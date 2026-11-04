/* ============================================================
   Hệ thống chiến đấu
   Thứ tự tổ chức: công cụ chiến đấu → chiến đấu zombie → chiến đấu NPC → sự kiện gặp gỡ
   ============================================================ */

import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  addCigarettes,
  removeCigarettes,
  getItemDisplayName,
} from './state.js';

import {
  AMMO,
  FOODS,
  DRINKS,
  FRUITS,
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  GAME_CONSTANTS,
  SPECIAL_ITEMS,
  BUILDING_MATERIALS,
  getAmmoById,
  getRandomZombie,
  pickRandomLoot,
  createNpcInstance,
  generateNpcLoot,
  getRandomTrade,
  TRADER_WEAPON_SHOP,
  FIXED_LOOT_DROPS,
  DEFAULT_ITEM_IDS,
  BOSS_NAMES,
  SEEDS,
} from './config.js';

import { MAP_NPC_INTROS } from './data/dialogues/map-dialogues.js';

import { showExploreOptionsState, showHomeOptions } from './routing.js';
import { triggerEnding } from './game/endings.js';

import { checkLeaderAssassinationVictory } from './outpost/index.js';

import { refreshIslandMenu } from './island/index.js';

// ---------- Công cụ chiến đấu ----------

function getRangedAmmoInfo(state) {
  if (!state.rangedWeapon) return "(chưa trang bị)";
  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId);
  const ammoCount = ammo ? ammo.count : 0;
  return `(đạn:${ammoCount} viên hoàn chỉnh:${state.rangedWeapon.integrity}%)`;
}

/**
 * Kiểm tra có thể dùng vũ khí tầm xa để chiến đấu không
 * @param {Object} state - trạng thái game
 * @returns {boolean} có đạn và vũ khí không
 */
function canRangedCombat(state) {
  if (!state.rangedWeapon) return false;
  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId && a.count > 0);
  return !!ammo;
}

/**
 * Xử lý lựa chọn trước chiến đấu (cận chiến/tầm xa/chạy)
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handlePreCombatChoice(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "combat_flee") {
    if (Math.random() < GAME_CONSTANTS.COMBAT.FLEE_RATE) {
      setStory(`Bạn đã thoát khỏi sự truy đuổi của ${state._pendingZombie?.name || "zombie"}!`);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        showExploreOptionsState();
      }
    } else {
      setStory("Chạy trốn thất bại! Bạn bị zombie quấn lấy! Bị buộc vào chiến đấu!");
      setPhase("combat");
      setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
      const zombieDef = state._pendingZombie;
      const died = handleCombat(zombieDef, "melee");
      if (died) return;
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        showExploreOptionsState();
      }
    }
    return;
  }

  if (action === "combat_melee") {
    setPhase("combat");
    setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
    const zombieDef = state._pendingZombie;
    const died = handleCombat(zombieDef, "melee");
    if (died) return;
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      showExploreOptionsState();
    }
    return;
  }

  if (action === "combat_ranged") {
    if (!canRangedCombat(state)) {
      setStory("Bạn không có vũ khí tầm xa hoặc đạn khả dụng! Chỉ có thể cận chiến!");
      setPhase("combat");
      setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
      const zombieDef = state._pendingZombie;
      const died = handleCombat(zombieDef, "melee");
      if (died) return;
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        showExploreOptionsState();
      }
      return;
    }
    setPhase("combat");
    setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
    const zombieDef = state._pendingZombie;
    const died = handleCombat(zombieDef, "ranged");
    if (died) return;
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      showExploreOptionsState();
    }
    return;
  }
}

// ---------- Chiến đấu (zombie) ----------

/**
 * Xử lý chiến đấu với zombie
 * @param {Object} zombieDef - dữ liệu định nghĩa zombie
 * @param {string} combatMode - chế độ chiến đấu: 'melee' hoặc 'ranged'
 */
function handleCombat(zombieDef, combatMode = "melee") {
  const state = getState();
  const zombie = { ...zombieDef, currentHp: zombieDef.hp, summoned: false };
  const combatLog = [];
  let round = 0;
  let currentMode = combatMode;

  state._tripped = 0;
  state._frozen = 0;
  state._blindTurns = 0;

  // Gặp zombie giảm lý trí
  if (state.sanity > 0) {
    state.sanity = Math.max(0, state.sanity - GAME_CONSTANTS.SURVIVAL.SANITY_PER_ENCOUNTER);
    combatLog.push({ round: 0, text: `Gặp zombie khiến tinh thần bạn bị sốc, lý trí -${GAME_CONSTANTS.SURVIVAL.SANITY_PER_ENCOUNTER}!` });
  }

  const isCrippled = state.crash >= GAME_CONSTANTS.FATIGUE_MAX;
  if (isCrippled) {
    combatLog.push({ round: 0, text: "Bạn quá mệt mỏi không thể chiến đấu, chỉ có thể bị đánh!" });
  }

  while (zombie.currentHp > 0 && state.health > 0) {
    round++;

    if (Array.isArray(zombie.ability) && zombie.ability.includes("screech") && round % 2 === 0) {
      state.crash = Math.min(100, (state.crash || 0) + GAME_CONSTANTS.COMBAT.ABILITY_SCREECH_FATIGUE);
      combatLog.push({ round, text: `${zombie.name} phát ra tiếng thét, tinh thần bạn bị sốc! mệt mỏi+${GAME_CONSTANTS.COMBAT.ABILITY_SCREECH_FATIGUE}` });
    }

    if (currentMode === "ranged") {
      if (!canRangedCombat(state)) {
        combatLog.push({ round, text: "Bạn đã hết đạn, chỉ có thể cận chiến." });
        currentMode = "melee";
      } else if (state.rangedWeapon && state.rangedWeapon.integrity <= 0) {
        combatLog.push({ round, text: "Súng của bạn đã hỏng, chỉ có thể cận chiến." });
        state.rangedWeapon = null;
        currentMode = "melee";
      }
    }

    if (!isCrippled) {
      let skipTurn = false;

      if (state._tripped > 0 && Math.random() < GAME_CONSTANTS.COMBAT.ABILITY_TRIP_SKIP_RATE) {
        combatLog.push({ round, text: "Bạn bị zombie bò quấn ngã, chật vật đứng dậy, không thể tấn công!" });
        state._tripped = 0;
        skipTurn = true;
      }

      if (!skipTurn && state._blindTurns > 0 && Math.random() < GAME_CONSTANTS.COMBAT.ABILITY_BLIND_MISS_RATE) {
        combatLog.push({ round, text: "Bạn vì bị mù mà đánh lệch!" });
        state._blindTurns = 0;
        skipTurn = true;
      }

      if (!skipTurn && state._frozen > 0) {
        combatLog.push({ round, text: "Hàn khí băng giá xói mòn cơ thể bạn, sát thương giảm!" });
      }

      if (!skipTurn) {
        if (Math.random() < zombie.dodge) {
          combatLog.push({ round, text: "Zombie né đòn tấn công của bạn!" });

          if (Array.isArray(zombie.ability) && zombie.ability.includes("leap")) {
            const leapDmg = Math.floor(zombie.damage * GAME_CONSTANTS.COMBAT.ABILITY_LEAP_DAMAGE_MULT);
            state.health -= leapDmg;
            state.health = Math.max(0, state.health);
            combatLog.push({ round, text: `Zombie nhảy vọt phản công! Gây ${leapDmg} điểm sát thương cho bạn!` });
          }

          if (Array.isArray(zombie.ability) && zombie.ability.includes("cloak")) {
            const cloakDmg = Math.floor(zombie.damage * GAME_CONSTANTS.COMBAT.ABILITY_CLOAK_COUNTER_MULT);
            state.health -= cloakDmg;
            state.health = Math.max(0, state.health);
            combatLog.push({ round, text: `Zombie Vô Hình lẩn vào bóng tối, đánh lén từ sau! Gây ${cloakDmg} điểm sát thương!` });
          }
        } else if (currentMode === "ranged" && state.rangedWeapon) {
          const ammoId = state.rangedWeapon.ammoType;
          const ammo = state.ammo.find(a => a.id === ammoId);
          if (ammo && ammo.count > 0) {
            ammo.count--;
            if (ammo.count <= 0) {
              state.ammo = state.ammo.filter(a => a.id !== ammoId);
            }
            const critRate = state.rangedWeapon.critRate || 0;
            const isCrit = Math.random() < critRate;
            let damage = state.rangedWeapon.damage;
            if (Array.isArray(zombie.ability) && zombie.ability.includes("armor")) {
              damage = Math.floor(damage * GAME_CONSTANTS.COMBAT.ABILITY_ARMOR_MULT);
            }
            if (state._frozen > 0) {
              damage = Math.floor(damage * GAME_CONSTANTS.COMBAT.FROZEN_DAMAGE_MULT);
              state._frozen = 0;
            }
            if (isCrit) {
              damage *= GAME_CONSTANTS.COMBAT.CRIT_MULTIPLIER;
              combatLog.push({ round, text: `💀Bắn trúng đầu! Trúng đầu ${zombie.name}, sát thương gấp đôi! Gây ${damage} điểm sát thương!` });
            } else {
              combatLog.push({ round, text: `Bạn dùng ${state.rangedWeapon.name} bắn, gây ${damage} điểm sát thương.` });
            }
            zombie.currentHp -= damage;
            if (state.liuruyanRescued && Math.random() < GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_RATE && zombie.currentHp > 0) {
              zombie.currentHp -= GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE;
              combatLog.push({ round, text: `Liu Ruyan ra tay từ trong bóng tối, gây ${GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE} điểm sát thương!` });
            }
            if (state.rangedWeapon.ammoType !== "mui_ten") {
              state.rangedWeapon.integrity = Math.max(0, state.rangedWeapon.integrity - GAME_CONSTANTS.COMBAT.RANGED_SHOT_INTEGRITY_LOSS);
              if (state.rangedWeapon.integrity <= 0) {
                combatLog.push({ round, text: `${state.rangedWeapon.name} độ bền hao hết, hoàn toàn hỏng rồi!` });
                state.rangedWeapon = null;
                currentMode = "melee";
              }
            }
          }
        } else {
          let comboHits = 0;
          do {
            // Lý trí về 0, 50% xác suất tấn công trượt
            if (state.sanity <= 0 && Math.random() < GAME_CONSTANTS.SURVIVAL.SANITY_ZERO_DAMAGE_ZERO_RATE) {
              combatLog.push({ round, text: "Ảo giác làm méo mó tầm nhìn của bạn, đòn tấn công hoàn toàn trượt!" });
              break;
            }
            let playerDamage = state.meleeWeapon.damage;
            if (Array.isArray(zombie.ability) && zombie.ability.includes("armor")) {
              playerDamage = Math.floor(playerDamage * GAME_CONSTANTS.COMBAT.ABILITY_ARMOR_MULT);
            }
            if (state._frozen > 0) {
              playerDamage = Math.floor(playerDamage * GAME_CONSTANTS.COMBAT.FROZEN_DAMAGE_MULT);
              state._frozen = 0;
            }
            zombie.currentHp -= playerDamage;
            if (state.liuruyanRescued && Math.random() < GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_RATE && zombie.currentHp > 0) {
              zombie.currentHp -= GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE;
              combatLog.push({ round, text: `Liu Ruyan ra tay từ trong bóng tối, gây ${GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE} điểm sát thương!` });
            }
            state.meleeWeapon.currentDurability = Math.max(0, state.meleeWeapon.currentDurability - 1);
            if (comboHits === 0) {
              combatLog.push({ round, text: `Bạn dùng ${state.meleeWeapon.name} tấn công, gây ${playerDamage} điểm sát thương. (HP:${Math.max(0, zombie.currentHp)})` });
            } else {
              combatLog.push({ round, text: `Liên kích! Đòn bổ sung! Gây ${playerDamage} điểm sát thương! (${comboHits} liên kích) (HP:${Math.max(0, zombie.currentHp)})` });
            }
            if (state.meleeWeapon.currentDurability <= 0 && state.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
              combatLog.push({ round, text: `${state.meleeWeapon.name} độ bền hao hết, hoàn toàn hỏng rồi!` });
              const fist = MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee);
              state.meleeWeapon = { ...fist, currentDurability: fist.durability };
              break;
            }
            comboHits++;
          } while (zombie.currentHp > 0 && Math.random() < (state.meleeWeapon.comboRate || 0));
        }
        state._blindTurns = 0;
      }
    } else {
      combatLog.push({ round, text: "Bạn mệt đến không còn sức phản kháng……" });
    }

    if (zombie.currentHp <= 0) {
      break;
    }

    let playerDodged = false;
    if (currentMode === "ranged" && Math.random() < GAME_CONSTANTS.COMBAT.RANGED_DODGE_RATE) {
      playerDodged = true;
      combatLog.push({ round, text: "Bạn cầm súng giữ khoảng cách, né được đòn tấn công của zombie!" });
    }

    if (!playerDodged) {
      state.health -= zombie.damage;
      state.health = Math.max(0, state.health);

      if (Array.isArray(zombie.ability) && zombie.ability.includes("infect")) {
        state.infection = Math.min(100, state.infection + GAME_CONSTANTS.COMBAT.INFECTION_ON_HIT);
        combatLog.push({ round, text: `${zombie.name} lây nhiễm khiến bạn khó chịu! giá trị nhiễm+${GAME_CONSTANTS.COMBAT.INFECTION_ON_HIT}` });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("blind")) {
        state._blindTurns = 1;
        combatLog.push({ round, text: "Bạn bị mù, lượt sau tỷ lệ trúng giảm!" });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("corrode")) {
        if (currentMode === "melee" && state.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
          state.meleeWeapon.currentDurability = Math.max(0, state.meleeWeapon.currentDurability - GAME_CONSTANTS.COMBAT.ABILITY_CORRODE_DURABILITY);
          combatLog.push({ round, text: "Vũ khí của bạn bị ăn mòn!" });
        } else if (currentMode === "ranged" && state.rangedWeapon) {
          state.rangedWeapon.integrity = Math.max(0, state.rangedWeapon.integrity - GAME_CONSTANTS.COMBAT.ABILITY_CORRODE_INTEGRITY);
          combatLog.push({ round, text: "Vũ khí của bạn bị ăn mòn!" });
        }
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("acid")) {
        const acidDamage = Math.floor(Math.random() * (GAME_CONSTANTS.COMBAT.ABILITY_ACID_DAMAGE_MAX - GAME_CONSTANTS.COMBAT.ABILITY_ACID_DAMAGE_MIN + 1)) + GAME_CONSTANTS.COMBAT.ABILITY_ACID_DAMAGE_MIN;
        state.health -= acidDamage;
        state.health = Math.max(0, state.health);
        combatLog.push({ round, text: `Zombie phun acid phun acid ăn mòn bạn! Nhận thêm ${acidDamage} điểm sát thương!` });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("summon") && !zombie.summoned) {
        zombie.summoned = true;
        combatLog.push({ round, text: "Zombie mẫu triệu hồi 2 zombie du đãng thường!" });
        const summonDmg = GAME_CONSTANTS.COMBAT.SUMMONED_ZOMBIE_DAMAGE;
        state.health -= summonDmg;
        state.health = Math.max(0, state.health);
        combatLog.push({ round, text: `Zombie được triệu hồi gây ${summonDmg} điểm sát thương cho bạn.` });
        state.health -= summonDmg;
        state.health = Math.max(0, state.health);
        combatLog.push({ round, text: `Zombie được triệu hồi gây ${summonDmg} điểm sát thương cho bạn.` });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("trip")) {
        state._tripped = 1;
        combatLog.push({ round, text: "Zombie bò quấn lấy chân bạn, bạn bị vấp ngã!" });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("freeze")) {
        state._frozen = 1;
        combatLog.push({ round, text: "Hàn khí của zombie băng giá xâm nhập cơ thể bạn, động tác bạn chậm lại!" });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("impale")) {
        const impaleDmg = Math.floor(zombie.damage * GAME_CONSTANTS.COMBAT.ABILITY_IMPALE_MULT);
        state.health -= impaleDmg;
        state.health = Math.max(0, state.health);
        combatLog.push({ round, text: `Xương nhọn của zombie xuyên thấu đâm sâu vào cơ thể bạn! Nhận thêm ${impaleDmg} điểm sát thương xuyên giáp!` });
      }

      if (Array.isArray(zombie.ability) && zombie.ability.includes("cloak") && Math.random() < GAME_CONSTANTS.COMBAT.ABILITY_CLOAK_AMBUSH_RATE) {
        const cloakDmg = Math.floor(zombie.damage * GAME_CONSTANTS.COMBAT.ABILITY_CLOAK_AMBUSH_MULT);
        state.health -= cloakDmg;
        state.health = Math.max(0, state.health);
        combatLog.push({ round, text: `Zombie Vô Hình phát động đánh lén từ trong bóng tối! Gây thêm ${cloakDmg} điểm sát thương!` });
      }

      combatLog.push({ round, text: `Zombie gây ${zombie.damage} điểm sát thương cho bạn.` });
    }
  }

  if (zombie.currentHp <= 0) {
    combatLog.push({ round: "Chiến thắng", text: `Bạn đã đánh bại ${zombie.name}!` });

    if (Array.isArray(zombie.ability) && zombie.ability.includes("selfDestruct")) {
      state.health -= zombie.damage;
      state.health = Math.max(0, state.health);
      combatLog.push({ round: "Chiến thắng", text: `${zombie.name} phát nổ! Gây ${zombie.damage} điểm sát thương!` });
    }

    if (Array.isArray(zombie.ability) && zombie.ability.includes("explosive")) {
      const explosiveDmg = Math.floor(zombie.damage * GAME_CONSTANTS.COMBAT.ABILITY_EXPLOSIVE_MULT);
      state.health -= explosiveDmg;
      state.health = Math.max(0, state.health);
      combatLog.push({ round: "Chiến thắng", text: `Thi thể zombie nổ tung! Mảnh vỡ văng tứ tung, gây ${explosiveDmg} điểm sát thương!` });
    }

    if (state.nurseZombieRescued) {
      state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + GAME_CONSTANTS.COMBAT.NURSE_HEAL_AFTER_COMBAT);
      combatLog.push({ round: "Chiến thắng", text: `Lulu Wei đã đơn giản xử lý vết thương cho bạn, sức khỏe hồi phục ${GAME_CONSTANTS.COMBAT.NURSE_HEAL_AFTER_COMBAT}.` });
    }

    if (Math.random() < GAME_CONSTANTS.COMBAT.ZOMBIE_LOOT_DROP_RATE) {
      const isFood = Math.random() < GAME_CONSTANTS.COMBAT.ZOMBIE_LOOT_FOOD_RATE;
      let lootItem;
      if (isFood) {
        const food = FOODS[Math.floor(Math.random() * FOODS.length)];
        lootItem = { ...food };
      } else {
        const drink = DRINKS[Math.floor(Math.random() * DRINKS.length)];
        lootItem = { ...drink };
      }
      const added = addItem(lootItem);
      if (added) {
        combatLog.push({ round: "Chiến thắng", text: `Trên người zombie rơi ra một ít ${isFood ? 'thực phẩm' : 'đồ uống'}: ${lootItem.name}.` });
      } else {
        combatLog.push({ round: "Chiến thắng", text: `Trên người zombie rơi ra một ít ${isFood ? 'thực phẩm' : 'đồ uống'}, nhưng balo đã đầy.` });
      }
    }

    if (Math.random() < GAME_CONSTANTS.YUMO.GEL_DROP_RATE) {
      const gel = { id: "zombie_gel", name: "Gel zombie", type: "medicine", count: 1 };
      const added = addItem(gel);
      if (added) {
        combatLog.push({ round: "Chiến thắng", text: "Trên người zombie tiết ra một cục gel nhớt." });
      }
    }

    if (!state.stats) state.stats = {};
    if (!state.stats.zombieKills) state.stats.zombieKills = 0;
    state.stats.zombieKills++;
    const kills = state.stats.zombieKills;
    if (!state.unlockedAchievements) state.unlockedAchievements = [];
    for (const entry of GAME_CONSTANTS.ACHIEVEMENTS.ZOMBIE_KILLS) {
      if (kills >= entry.threshold && !state.unlockedAchievements.includes(entry.id)) {
        state.unlockedAchievements.push(entry.id);
      }
    }
  }

  if (state.health <= 0) {
    combatLog.push({ round: "Thất bại", text: "Bạn bị zombie đánh gục……" });
    checkDeath();
  }

  const logText = combatLog.map(entry => {
    if (typeof entry.round === "number") {
      return `[Lượt ${entry.round}] ${entry.text}`;
    }
    return entry.text;
  }).join("\n");

  const currentStory = state.story || "";
  setStory(currentStory + "\n\n--- Nhật ký chiến đấu ---\n" + logText);

  return state.health <= 0;
}

// ---------- Chiến đấu và tương tác NPC ----------

/**
 * Kích hoạt sự kiện gặp người sống sót
 */
function handleSurvivorEncounter() {
  setStory("Bạn gặp một người sống sót trong khi thám hiểm. Anh ấy cảnh giác nhìn bạn, nhưng dường như không định động thủ ngay.");
  setPhase("survivor_interact");
  setOptions([
    { text: "Giao dịch (dùng thực phẩm đổi đạn)", action: "survivor_trade" },
    { text: "Đâm lén (tấn công người sống sót)", action: "survivor_backstab" },
    { text: "Rời đi", action: "survivor_leave" }
  ]);
}

/**
 * Kích hoạt sự kiện gặp bandit
 */
function handleBanditEncounter() {
  const state = getState();
  const bandit = createNpcInstance('bandit');
  state._pendingNpc = bandit;
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "không";
  const ammoInfo = getRangedAmmoInfo(state);
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Nên nghỉ ngơi trước khi thám hiểm." : "";
  setStory(`Bạn gặp ${bandit.name}! Anh ấy không nói hai lời liền xông về phía bạn!\n\n[Cận chiến]${meleeName}\n[Tầm xa]${rangedName} ${ammoInfo}${crashWarning}`);
  const options = [
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" }
  ];
  if (canRangedCombat(state)) {
    options.push({ text: "Chiến đấu tầm xa", action: "combat_npc_ranged" });
  } else {
    options.push({ text: "Chiến đấu tầm xa (không khả dụng: không đạn)", action: "combat_npc_ranged", disabled: true });
  }
  options.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
  setOptions(options);
  return;
}

/**
 * Xử lý lựa chọn trước chiến đấu NPC
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handlePreCombatNpcChoice(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "combat_npc_flee") {
    const wasDivingZombie = !!state._divingZombieCombat;
    if (Math.random() < GAME_CONSTANTS.COMBAT.FLEE_RATE) {
      if (wasDivingZombie) delete state._divingZombieCombat;
      setStory(`Bạn đã thoát khỏi sự truy đuổi của ${state._pendingNpc?.name || "kẻ địch"}!`);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        if (wasDivingZombie) {
          refreshIslandMenu();
        } else {
          showExploreOptionsState();
        }
      }
    } else {
      setStory("Chạy trốn thất bại! Bạn bị bandit quấn lấy! Bị buộc vào chiến đấu!");
      setPhase("combat");
      setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
      const npc = state._pendingNpc;
      handleNpcCombat(npc, "melee");
    }
    return;
  }

  if (action === "combat_npc_melee") {
    setPhase("combat");
    setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
    const npc = state._pendingNpc;
    handleNpcCombat(npc, "melee");
    return;
  }

  if (action === "combat_npc_ranged") {
    if (!canRangedCombat(state)) {
      setStory("Bạn không có vũ khí tầm xa hoặc đạn khả dụng! Chỉ có thể cận chiến!");
      setPhase("combat");
      setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
      const npc = state._pendingNpc;
      handleNpcCombat(npc, "melee");
      return;
    }
    setPhase("combat");
    setOptions([{ text: "Chiến đấu đang diễn ra...", action: "none" }]);
    const npc = state._pendingNpc;
    handleNpcCombat(npc, "ranged");
    return;
  }
}

/**
 * Xử lý lựa chọn giao diện tương tác người sống sót
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handleSurvivorAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "survivor_leave") {
    setStory("Bạn chọn không trêu chọc người sống sót, lặng lẽ rời đi.");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }

  if (action === "survivor_trade") {
    const trade = getRandomTrade();
    state._trade = trade;
    setPhase("trade_choice");
    setStory("Người sống sót sẵn sàng dùng đạn đổi vật tư của bạn.");
    setOptions([
      { text: "Dùng thực phẩm đổi đạn", action: "trade_food" },
      { text: "Dùng đồ uống đổi đạn", action: "trade_drink" },
      { text: "Quay lại", action: "trade_back" },
    ]);
    return;
  }

  if (action === "survivor_backstab") {
    const survivor = createNpcInstance('survivor');
    getState()._pendingNpc = survivor;
    setPhase("pre_combat_npc");
    const meleeName = getState().meleeWeapon.name;
    const rangedName = getState().rangedWeapon ? getState().rangedWeapon.name : "không";
    const ammoInfo = getRangedAmmoInfo(getState());
    const crashWarning = getState().crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Nên nghỉ ngơi trước khi thám hiểm." : "";
    setStory(`Bạn quyết định mạo hiểm, đánh lén người sống sót này!\n\n[Cận chiến]${meleeName}\n[Tầm xa]${rangedName} ${ammoInfo}${crashWarning}`);
    const options = [
      { text: "Chiến đấu cận chiến", action: "combat_npc_melee" }
    ];
    if (canRangedCombat(getState())) {
      options.push({ text: "Chiến đấu tầm xa", action: "combat_npc_ranged" });
    } else {
      options.push({ text: "Chiến đấu tầm xa (không khả dụng: không đạn)", action: "combat_npc_ranged", disabled: true });
    }
    options.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
    setOptions(options);
    return;
  }
}

/**
 * Xử lý chiến đấu với NPC
 * @param {Object} npc - dữ liệu thực thể NPC
 * @param {string} combatMode - chế độ chiến đấu: 'melee' hoặc 'ranged'
 */
function handleNpcCombat(npc, combatMode = "melee") {
  const state = getState();
  state._tripped = 0;
  state._frozen = 0;
  state._blindTurns = 0;
  const combatLog = [];
  let round = 0;
  let currentMode = combatMode;

  // Gặp chiến đấu giảm lý trí
  if (state.sanity > 0) {
    state.sanity = Math.max(0, state.sanity - GAME_CONSTANTS.SURVIVAL.SANITY_PER_ENCOUNTER);
    combatLog.push({ round: 0, text: `Gặp kẻ địch khiến tinh thần bạn bị sốc, lý trí -${GAME_CONSTANTS.SURVIVAL.SANITY_PER_ENCOUNTER}!` });
  }

  const isCrippled = state.crash >= GAME_CONSTANTS.FATIGUE_MAX;
  if (isCrippled) {
    combatLog.push({ round: 0, text: "Bạn quá mệt mỏi không thể chiến đấu, chỉ có thể bị đánh!" });
  }

  if (npc.hasRanged && Math.random() < GAME_CONSTANTS.COMBAT.NPC_RANGED_TRIGGER_RATE) {
    const npcRangedDamage = Math.floor(Math.random() * (GAME_CONSTANTS.COMBAT.NPC_RANGED_OPENING_DAMAGE_MAX - GAME_CONSTANTS.COMBAT.NPC_RANGED_OPENING_DAMAGE_MIN + 1)) + GAME_CONSTANTS.COMBAT.NPC_RANGED_OPENING_DAMAGE_MIN;
    state.health -= npcRangedDamage;
    state.health = Math.max(0, state.health);
    combatLog.push({ round: 0, text: `${npc.name} rút vũ khí tầm xa bắn về phía bạn, gây ${npcRangedDamage} điểm sát thương!` });
  }

  if (!isCrippled && currentMode === "ranged" && state.rangedWeapon) {
    const ammoId = state.rangedWeapon.ammoType;
    const ammo = state.ammo.find(a => a.id === ammoId);
    if (ammo && ammo.count > 0) {
      ammo.count--;
      if (ammo.count <= 0) {
        state.ammo = state.ammo.filter(a => a.id !== ammoId);
      }
      const critRate = state.rangedWeapon.critRate || 0;
      const isCrit = Math.random() < critRate;
      let damage = state.rangedWeapon.damage;
      if (isCrit) {
        damage *= GAME_CONSTANTS.COMBAT.CRIT_MULTIPLIER;
        combatLog.push({ round: 0, text: `💀Bắn trúng đầu! Bạn dùng ${state.rangedWeapon.name} trúng đầu ${npc.name}, gây ${damage} điểm sát thương!` });
      } else {
        combatLog.push({ round: 0, text: `Bạn dùng ${state.rangedWeapon.name} bắn, gây ${damage} điểm sát thương.` });
      }
      npc.hp -= damage;
      if (state.liuruyanRescued && Math.random() < GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_RATE && npc.hp > 0) {
        npc.hp -= GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE;
        combatLog.push({ round: 0, text: `Liu Ruyan ra tay từ trong bóng tối, gây ${GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE} điểm sát thương!` });
      }
      if (state.rangedWeapon.ammoType !== "mui_ten") {
        state.rangedWeapon.integrity = Math.max(0, state.rangedWeapon.integrity - GAME_CONSTANTS.COMBAT.RANGED_SHOT_INTEGRITY_LOSS);
        if (state.rangedWeapon.integrity <= 0) {
          combatLog.push({ round: 0, text: `${state.rangedWeapon.name} độ bền hao hết, hoàn toàn hỏng rồi!` });
          state.rangedWeapon = null;
        }
      }
    } else {
      combatLog.push({ round: 0, text: "Bạn đã hết đạn, chỉ có thể cận chiến." });
      currentMode = "melee";
    }
  }

  while (npc.hp > 0 && state.health > 0) {
    round++;

    if (currentMode === "ranged") {
      if (!canRangedCombat(state)) {
        combatLog.push({ round, text: "Bạn đã hết đạn, chỉ có thể cận chiến." });
        currentMode = "melee";
      } else if (state.rangedWeapon && state.rangedWeapon.integrity <= 0) {
        combatLog.push({ round, text: "Súng của bạn đã hỏng, chỉ có thể cận chiến." });
        state.rangedWeapon = null;
        currentMode = "melee";
      }
    }

    if (!isCrippled) {
      // Lý trí về 0, 50% xác suất tấn công trượt
      if (state.sanity <= 0 && Math.random() < GAME_CONSTANTS.SURVIVAL.SANITY_ZERO_DAMAGE_ZERO_RATE) {
        combatLog.push({ round, text: "Ảo giác làm méo mó tầm nhìn của bạn, đòn tấn công hoàn toàn trượt!" });
      } else {
      const playerDamage = state.meleeWeapon.damage;

      if (Math.random() < (npc.dodgeRate || GAME_CONSTANTS.COMBAT.DEFAULT_NPC_DODGE_RATE)) {
        combatLog.push({ round, text: `${npc.name} né được đòn tấn công của bạn!` });
      } else if (currentMode === "ranged" && state.rangedWeapon) {
        const ammoId = state.rangedWeapon.ammoType;
        const ammo = state.ammo.find(a => a.id === ammoId);
        if (ammo && ammo.count > 0) {
          ammo.count--;
          if (ammo.count <= 0) {
            state.ammo = state.ammo.filter(a => a.id !== ammoId);
          }
          const critRate = state.rangedWeapon.critRate || 0;
          const isCrit = Math.random() < critRate;
          let damage = state.rangedWeapon.damage;
          if (isCrit) {
            damage *= GAME_CONSTANTS.COMBAT.CRIT_MULTIPLIER;
            combatLog.push({ round, text: `💀Bắn trúng đầu! Trúng đầu ${npc.name}, sát thương gấp đôi! Gây ${damage} điểm sát thương!` });
          } else {
            combatLog.push({ round, text: `Bạn dùng ${state.rangedWeapon.name} bắn, gây ${damage} điểm sát thương.` });
          }
          npc.hp -= damage;
          if (state.liuruyanRescued && Math.random() < GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_RATE && npc.hp > 0) {
            npc.hp -= GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE;
            combatLog.push({ round, text: `Liu Ruyan ra tay từ trong bóng tối, gây ${GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE} điểm sát thương!` });
          }
          if (state.rangedWeapon.ammoType !== "mui_ten") {
            state.rangedWeapon.integrity = Math.max(0, state.rangedWeapon.integrity - GAME_CONSTANTS.COMBAT.RANGED_SHOT_INTEGRITY_LOSS);
            if (state.rangedWeapon.integrity <= 0) {
              combatLog.push({ round, text: `${state.rangedWeapon.name} độ bền hao hết, hoàn toàn hỏng rồi!` });
              state.rangedWeapon = null;
            }
          }
        }
      } else {
        let comboHits = 0;
        do {
          npc.hp -= playerDamage;
          if (state.liuruyanRescued && Math.random() < GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_RATE && npc.hp > 0) {
            npc.hp -= GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE;
            combatLog.push({ round, text: `Liu Ruyan ra tay từ trong bóng tối, gây ${GAME_CONSTANTS.COMBAT.LIURUYAN_ASSIST_DAMAGE} điểm sát thương!` });
          }
          state.meleeWeapon.currentDurability = Math.max(0, state.meleeWeapon.currentDurability - 1);
          if (comboHits === 0) {
            combatLog.push({ round, text: `Bạn dùng ${state.meleeWeapon.name} tấn công, gây ${playerDamage} điểm sát thương. (${npc.name} HP:${Math.max(0, npc.hp)})` });
          } else {
            combatLog.push({ round, text: `Liên kích! Đòn bổ sung! Gây ${playerDamage} điểm sát thương! (${comboHits} liên kích) (${npc.name} HP:${Math.max(0, npc.hp)})` });
          }
          if (state.meleeWeapon.currentDurability <= 0 && state.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
            combatLog.push({ round, text: `${state.meleeWeapon.name} độ bền hao hết, hoàn toàn hỏng rồi!` });
            const fist = MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee);
            state.meleeWeapon = { ...fist, currentDurability: fist.durability };
            break;
          }
          comboHits++;
        } while (npc.hp > 0 && Math.random() < (state.meleeWeapon.comboRate || 0));
      }
      }
    } else {
      combatLog.push({ round, text: "Bạn mệt đến không còn sức phản kháng……" });
    }

    if (npc.hp <= 0) break;

    let playerDodged = false;
    if (currentMode === "ranged" && Math.random() < GAME_CONSTANTS.COMBAT.RANGED_DODGE_RATE) {
      playerDodged = true;
      combatLog.push({ round, text: "Bạn cầm súng giữ khoảng cách, né được đòn tấn công!" });
    }

    if (!playerDodged) {
      const npcDamage = npc.damage;
      state.health -= npcDamage;
      state.health = Math.max(0, state.health);
      combatLog.push({ round, text: `${npc.name} gây ${npcDamage} điểm sát thương cho bạn.` });
    }
  }

  if (npc.hp <= 0) {
    combatLog.push({ round: "Chiến thắng", text: `Bạn đã đánh bại ${npc.name}!` });
    state._combatNpcDefeated = true;

    const isBoss = BOSS_NAMES.includes(npc.name);
    if (isBoss) {
      const bossState = getState();
      if (!bossState.unlockedAchievements) bossState.unlockedAchievements = [];
      if (!bossState.unlockedAchievements.includes("boss_killer")) bossState.unlockedAchievements.push("boss_killer");
    }

    if (state._maSanQuest4Combat) {
      delete state._maSanQuest4Combat;
      state.maSanQuest4Done = true;
      triggerEnding("ending_food");
      return;
    } else if (npc.name === "Mã Tam") {
      state.outlawKilled = true;
      state.stats.bossesDefeated.push("Mã Tam");
      const outlawDrop = FIXED_LOOT_DROPS.outlaw_kill;
      const outlawWeapon = RANGED_WEAPONS.find(w => w.id === outlawDrop.weaponId);
      const addedAk = addItem({ ...outlawWeapon });
      const outlawAmmo = AMMO.find(a => a.id === outlawDrop.ammoId);
      const addedAmmo = addItem({ id: outlawAmmo.id, name: outlawAmmo.name, type: "ammo", count: outlawDrop.ammoCount });
      if (addedAk && addedAmmo) {
        combatLog.push({ round: "Chiến thắng", text: `Trên người Mã Tam rơi ra: ${outlawWeapon.name}×1, ${outlawAmmo.name}×${outlawDrop.ammoCount}` });
      } else {
        combatLog.push({ round: "Chiến thắng", text: "Trên người Mã Tam rơi ra một số trang bị, nhưng không gian balo không đủ, một phần vật phẩm không thể mang theo." });
      }
    } else if (npc.name === "Hắc Ảnh") {
      state.stats.bossesDefeated.push("Hắc Ảnh");
      state.shadowDefeated = true;
      const shadowDrop = FIXED_LOOT_DROPS.shadow_kill;
      const shadowWeapon = RANGED_WEAPONS.find(w => w.id === shadowDrop.weaponId);
      const addedGun = addItem({ ...shadowWeapon });
      const shadowAmmo = AMMO.find(a => a.id === shadowDrop.ammoId);
      const addedAmmo2 = addItem({ id: shadowAmmo.id, name: shadowAmmo.name, type: "ammo", count: shadowDrop.ammoCount });
      if (addedGun && addedAmmo2) {
        combatLog.push({ round: "Chiến thắng", text: `Trên người Hắc Ảnh rơi ra: ${shadowWeapon.name}×1, ${shadowAmmo.name}×${shadowDrop.ammoCount}` });
      } else {
        combatLog.push({ round: "Chiến thắng", text: "Trên người Hắc Ảnh rơi ra một số trang bị, nhưng không gian balo không đủ, một phần vật phẩm không thể mang theo." });
      }
    } else if (npc.name === "Vua Zombie Im Lặng") {
      state.zombieKingDefeated = true;
      state.stats.bossesDefeated.push("Vua Zombie Im Lặng");
      state.other.push({ ...SPECIAL_ITEMS.silence_badge });
      combatLog.push({ round: "Chiến thắng", text: "Bạn đã đánh bại kẻ thống trị thực sự của tổ zombie! Thân thể nó đổ sập, cả tổ zombie đều rung chuyển. Bạn sống sót qua trận chiến chưa từng có này, đây sẽ là khoảnh khắc đáng nhớ sau mạt thế." });
      combatLog.push({ round: "Chiến thắng", text: "Bạn đã đánh bại Vua Zombie Tịch Diệt! Trong tàn tích của nó, bạn tìm thấy một chiếc huy chương khắc chữ cổ — [Huy chương Tịch Diệt]. Đây là biểu tượng của vinh dự." });
    } else if (npc.name === "Ngân Hàng Hàng Trưởng") {
      state.castleDebt = null;
      state.castleDebtTriggered = false;
      state.bankerKilled = true;
      const drop = FIXED_LOOT_DROPS.banker_kill;
      const dropWeapon = drop.type === "ranged"
        ? RANGED_WEAPONS.find(w => w.id === drop.weaponId)
        : MELEE_WEAPONS.find(w => w.id === drop.weaponId);
      if (dropWeapon) {
        const dropItem = drop.type === "melee"
          ? { ...dropWeapon, currentDurability: dropWeapon.durability }
          : { ...dropWeapon };
        const added = addItem(dropItem);
        if (added) {
          combatLog.push({ round: "Chiến thắng", text: `Hành trưởng ngã xuống, nợ nần xóa sạch! Bạn lấy từ bàn ông ấy một thanh ${dropWeapon.name}.` });
        } else {
          combatLog.push({ round: "Chiến thắng", text: `Hành trưởng ngã xuống, nợ nần xóa sạch! Nhưng balo đã đầy, không thể lấy ${dropWeapon.name}.` });
        }
      }
    } else if (npc.name === "Vua Lâu Đài") {
      state.kingKilled = true;
      state.stats.bossesDefeated.push("Vua Lâu Đài");
      combatLog.push({ round: "Chiến thắng", text: "Quốc vương đổ gục dưới chân ngai vàng, áo choàng hoa lệ bị máu thấm ướt. Đại sảnh im phăng phắc, quý tộc kinh hãi tứ tán——nhưng không ai dám bước lên." });
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
        setStory(logText);
        setStory(state.story + "\n\nBạn nhân lúc hỗn loạn trốn khỏi thành bảo. Từ giờ trở đi, cửa thành bảo sẽ vĩnh viễn đóng với bạn.");
        showExploreOptionsState();
      }
      return;
    } else if (npc.name === "Lão Bin Lão Triệu") {
      state.zhaoKilled = true;
      state.stats.bossesDefeated.push("Lão Bin Lão Triệu");
      combatLog.push({ round: "Chiến thắng", text: "Lão Triệu cuối cùng cũng ngã xuống. Khẩu súng trong tay ông ấy lăn sang một bên, mắt vẫn mở, nhìn về bầu trời xám xịt. Có lẽ ông ấy cuối cùng cũng được giải thoát." });
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
        setStory(logText);
        showExploreOptionsState();
      }
      return;
    } else if (npc.name === "Tiến Sĩ Trần") {
      state.doctorKilled = true;
      state.stats.bossesDefeated.push("Tiến Sĩ Trần");
      combatLog.push({ round: "Chiến thắng", text: "Tiến Sĩ Trần ngã xuống bên cạnh bàn thí nghiệm, hóa chất bị đánh đổ bốc khói trắng trên sàn. Trước khi chết ông ấy vẫn lẩm bẩm điều gì đó——có lẽ là công thức chưa hoàn thành, có lẽ là hối hận về cả đời mình." });
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
        setStory(logText);
        showExploreOptionsState();
      }
      return;
    } else if (state._liuruyanQuest2Combat) {
      delete state._liuruyanQuest2Combat;
      state.liuruyanQuest2Done = true;
      const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
      setStory(logText + "\n\n---\n\n" + MAP_NPC_INTROS.liuruyan_quest2_victory);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) showExploreOptionsState();
      return;
    } else if (state._divingZombieCombat) {
      delete state._divingZombieCombat;
      state.yumoDivingKills++;
      const progress = `Đã giết ${state.yumoDivingKills}/${GAME_CONSTANTS.YUMO.QUEST3_DIVING_KILLS} zombie lặn.`;
      const questDone = state.yumoDivingKills >= GAME_CONSTANTS.YUMO.QUEST3_DIVING_KILLS ? "\nBạn đã hoàn thành nhiệm vụ dọn zombie đổ bộ!" : "";
      combatLog.push({ round: "Chiến thắng", text: progress });
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
        setStory(logText + "\n\n---\n\n" + `Bạn đã đánh bại zombie lặn!\n${progress}${questDone}`);
        refreshIslandMenu();
      }
      return;
    } else if (state._pendingNpc && state._pendingNpc.name && state._pendingNpc.name.includes("Cỗ Rối")) {
      state.giantPuppetDefeated = true;
      delete state._pendingNpc;
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
        setStory(logText + "\n\n---\n\n" + "Cỗ Rối Khổng Lồ sụp đổ, khung kim loại vặn vẹo biến dạng, đường ống đỏ sẫm đứt đoạn phun ra hơi nước cuối cùng. Nó cuối cùng cũng yên tĩnh rồi. Cửa trung tâm phóng mở ra cho bạn.");
        showExploreOptionsState();
      }
      return;
    } else if (state._wolfQuest4Combat) {
      delete state._wolfQuest4Combat;
      state.wolfQuest4Done = true;
      state.stats.bossesDefeated.push("Hải Zombie Khổng Lồ");
      const logText = combatLog.map(entry => typeof entry.round === "number" ? `[Lượt ${entry.round}] ${entry.text}` : entry.text).join("\n");
      setStory(logText + "\n\n---\n\n" + "Hải thi khổng lồ phát ra tiếng rên rỉ chấn động, thân thể khổng lồ từ từ đổ xuống. Sóng biển cuộn trào, như cả đại dương đang thương tiếc cho sự vẫn lạc của sinh vật cổ đại này.\n\nNgười cá nổi lên mặt nước, ánh trăng rải trên chiếc vảy mới sinh của cô ấy……");
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        triggerEnding("ending_mermaid");
      }
      return;
    } else if (Math.random() < GAME_CONSTANTS.COMBAT.NPC_LOOT_DROP_RATE) {
      const loot = generateNpcLoot();
      const droppedItems = [];
      for (const item of loot) {
        const added = addItem(item);
        if (added) droppedItems.push(getItemDisplayName(item));
      }
      if (droppedItems.length > 0) {
        combatLog.push({ round: "Chiến thắng", text: `${npc.name} trên người rơi ra: ${droppedItems.join(", ")}` });
      }
      if (droppedItems.length < loot.length) {
        combatLog.push({ round: "Chiến thắng", text: "Balo đã đầy, một phần vật phẩm không thể mang theo." });
      }
    }

    if (state.nurseZombieRescued) {
      state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + GAME_CONSTANTS.COMBAT.NURSE_HEAL_AFTER_COMBAT);
      combatLog.push({ round: "Chiến thắng", text: `Lulu Wei đã đơn giản xử lý vết thương cho bạn, sức khỏe hồi phục ${GAME_CONSTANTS.COMBAT.NURSE_HEAL_AFTER_COMBAT}.` });
    }

    if (npc.type === "wanderingTrader") {
      const cigCount = Math.floor(Math.random() * (GAME_CONSTANTS.COMBAT.TRADER_CIG_DROP_MAX - GAME_CONSTANTS.COMBAT.TRADER_CIG_DROP_MIN + 1)) + GAME_CONSTANTS.COMBAT.TRADER_CIG_DROP_MIN;
      addCigarettes(cigCount);
      combatLog.push({ round: "Chiến thắng", text: `${npc.name} trên người rơi ra ${cigCount} điếu thuốc` });
    }
  }

  if (state.health <= 0) {
    combatLog.push({ round: "Thất bại", text: `Bạn bị ${npc.name} giết chết……` });
    if (state._maSanQuest4Combat) {
      delete state._maSanQuest4Combat;
    }
    if (state._wolfQuest4Combat) {
      delete state._wolfQuest4Combat;
    }
  }

  const logText = combatLog.map(entry => {
    if (typeof entry.round === "number") {
      return `[Lượt ${entry.round}] ${entry.text}`;
    }
    return entry.text;
  }).join("\n");

  setStory((state.story || "") + "\n\n--- Nhật ký chiến đấu ---\n" + logText);

  advanceTime(1);
  updateStatusEffects();
  checkDeath();

  if (!state.gameOver) {
    if (checkLeaderAssassinationVictory()) {
      return;
    }
    if (state.currentMap) {
      showExploreOptionsState();
    } else {
      showHomeOptions();
    }
  }
}

/**
 * Kích hoạt sự kiện gặp thương nhân chợ đen
 */
function handleWanderingTraderEncounter() {
  setStory("Một thương nhân chợ đen mang theo bao lớn bao nhỏ xuất hiện trước mặt bạn. Anh ấy nhe răng cười: \"Này, muốn làm chút giao dịch không? Tôi ở đây cái gì cũng có!\"");
  setPhase("trader_interact");
  setOptions([
    { text: "Điếu thuốc đổi đạn", action: "trader_ammo" },
    { text: "Mua vũ khí", action: "trader_weapon" },
    { text: "Đổi đồ tiêu hao ngẫu nhiên (1 điếu thuốc)", action: "trader_consumable" },
    { text: "Đâm lén (tấn công thương nhân chợ đen)", action: "trader_backstab" },
    { text: "Rời đi", action: "trader_leave" }
  ]);
}

/**
 * Xử lý lựa chọn giao diện tương tác thương nhân chợ đen
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handleWanderingTraderAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "trader_leave") {
    setStory("Bạn từ biệt thương nhân chợ đen, tiếp tục hành trình.");
    advanceTime(1);
    showExploreOptionsState();
    return;
  }

  if (action === "trader_backstab") {
    const trader = createNpcInstance('wanderingTrader');
    state._pendingNpc = trader;
    setPhase("pre_combat_npc");
    const meleeName = state.meleeWeapon.name;
    const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "không";
    const ammoInfo = getRangedAmmoInfo(state);
    const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Nên nghỉ ngơi trước khi thám hiểm." : "";
    setStory(`Bạn quyết định mạo hiểm, đánh lén thương nhân chợ đen này! Nhưng anh ấy rõ ràng đã có phòng bị……\n\n[Cận chiến]${meleeName}\n[Tầm xa]${rangedName} ${ammoInfo}${crashWarning}`);
    const options = [
      { text: "Chiến đấu cận chiến", action: "combat_npc_melee" }
    ];
    if (canRangedCombat(state)) {
      options.push({ text: "Chiến đấu tầm xa", action: "combat_npc_ranged" });
    } else {
      options.push({ text: "Chiến đấu tầm xa (không khả dụng: không đạn)", action: "combat_npc_ranged", disabled: true });
    }
    options.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
    setOptions(options);
    return;
  }

  if (action === "trader_ammo") {
    if (state.cigarettes === 0) {
      setStory("Thương nhân chợ đen liếc bạn một cái: \"Không có điếu thuốc còn muốn đổi đạn? Đi đi đi!\"");
      showExploreOptionsState();
      return;
    }
    setPhase("trader_buy_ammo");
    setStory(`Thương nhân chợ đen lấy ra một hộp đạn: "Nói đi, muốn loại đạn nào? Mỗi điếu thuốc đổi ${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MIN}~${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MAX} viên."\nBạn có ${state.cigarettes} điếu thuốc.`);
    const ammoOptions = AMMO.map((a, i) => ({
      text: `${a.name}(mỗi điếu thuốc đổi ${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MIN}~${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MAX} viên)`,
      action: "buy_ammo",
      index: i
    }));
    ammoOptions.push({ text: "Quay lại", action: "trader_back", index: -1 });
    setOptions(ammoOptions);
    return;
  }

  if (action === "trader_weapon") {
    if (state.cigarettes === 0) {
      setStory("Thương nhân chợ đen lắc đầu: \"Một điếu thuốc cũng không có, tôi sẽ không tặng vũ khí đâu.\"");
      showExploreOptionsState();
      return;
    }
    setPhase("trader_buy_weapon");
    setStory(`Thương nhân chợ đen vỗ vỗ hộp hàng: "Vũ khí không rẻ đâu, tầm xa càng đắt!"\nBạn có ${state.cigarettes} điếu thuốc.`);
    const weaponOptions = TRADER_WEAPON_SHOP.map((item, i) => {
      const typeLabel = item.type === "ranged" ? "Tầm xa" : "Cận chiến";
      const weapon = item.type === "ranged"
        ? RANGED_WEAPONS.find(w => w.id === item.weaponId)
        : MELEE_WEAPONS.find(w => w.id === item.weaponId);
      const weaponName = weapon ? weapon.name : item.weaponId;
      return { text: `${weaponName}(${typeLabel} ${item.costMin}~${item.costMax} điếu thuốc)`, action: `buy_weapon_${i}`, index: i };
    });
    weaponOptions.push({ text: "Quay lại", action: "trader_back", index: -1 });
    setOptions(weaponOptions);
    return;
  }

  if (action === "trader_consumable") {
    if (state.cigarettes === 0) {
      setStory("Thương nhân chợ đen xua tay: \"Không có điếu thuốc? Vậy đừng lãng phí thời gian của tôi.\"");
      showExploreOptionsState();
      return;
    }
    const consumableRoll = Math.random();
    let consumableItem;
    if (consumableRoll < 0.25) {
      consumableItem = { ...FOODS[Math.floor(Math.random() * FOODS.length)] };
    } else if (consumableRoll < 0.5) {
      consumableItem = { ...DRINKS[Math.floor(Math.random() * DRINKS.length)] };
    } else if (consumableRoll < 0.75) {
      consumableItem = { ...FRUITS[Math.floor(Math.random() * FRUITS.length)] };
    } else {
      consumableItem = { ...SEEDS[Math.floor(Math.random() * SEEDS.length)] };
    }
    removeCigarettes(1);
    const added = addItem(consumableItem);
    if (added) {
      setStory(`Thương nhân chợ đen dùng ${consumableItem.name} đổi một điếu thuốc của bạn.`);
    } else {
      addCigarettes(1);
      setStory(`Balo đã đầy, giao dịch thất bại. Thương nhân chợ đen trả lại điếu thuốc cho bạn.`);
    }
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }
}

/**
 * Xử lý lựa chọn mua đạn của thương nhân chợ đen
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handleTraderBuyAmmo(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "trader_back") {
    handleWanderingTraderEncounter();
    return;
  }

  if (option.action === "buy_ammo") {
    const ammo = AMMO[option.index];
    if (!ammo || state.cigarettes === 0) {
      setStory("Bạn không có điếu thuốc nào, không thể đổi đạn.");
      showExploreOptionsState();
      return;
    }
    setPhase("trader_ammo_qty");
    setStory(`Chọn dùng bao nhiêu điếu thuốc đổi ${ammo.name}? (1 điếu thuốc = ngẫu nhiên ${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MIN}~${GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MAX} viên)\nĐiếu thuốc hiện tại: ${state.cigarettes} điếu`);
    const qtyOptions = [];
    const amounts = [1, 5, 10];
    for (const amt of amounts) {
      if (amt <= state.cigarettes) {
        qtyOptions.push({ text: `Dùng ${amt} điếu thuốc đổi`, action: "confirm_ammo_qty", ammoIndex: option.index, qty: amt });
      }
    }
    if (state.cigarettes > 10) {
      qtyOptions.push({ text: `Dùng tất cả ${state.cigarettes} điếu thuốc đổi`, action: "confirm_ammo_qty", ammoIndex: option.index, qty: state.cigarettes });
    }
    qtyOptions.push({ text: "Quay lại", action: "trader_back" });
    setOptions(qtyOptions);
    return;
  }

  if (option.action === "confirm_ammo_qty") {
    const ammo = AMMO[option.ammoIndex];
    const qty = option.qty;
    if (!ammo || qty <= 0 || state.cigarettes < qty) {
      setStory("Điếu thuốc không đủ, không thể đổi.");
      showExploreOptionsState();
      return;
    }
    const perCig = Math.floor(Math.random() * (GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MAX - GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MIN + 1)) + GAME_CONSTANTS.TRADING.AMMO_PER_CIG_MIN;
    const totalAmmo = qty * perCig;
    removeCigarettes(qty);
    const added = addItem({ id: ammo.id, name: ammo.name, type: "ammo", count: totalAmmo });
    if (!added) {
      addCigarettes(qty);
      setStory("Balo của bạn đã đầy, không thể chứa thêm đạn.");
      showExploreOptionsState();
      return;
    }
    setStory(`Giao dịch thành công! Bạn dùng ${qty} điếu thuốc đổi được ${totalAmmo} viên ${ammo.name} (mỗi điếu ${perCig} viên).`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
  }
}

/**
 * Xử lý lựa chọn mua vũ khí của thương nhân chợ đen
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handleTraderBuyWeapon(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "trader_back") {
    handleWanderingTraderEncounter();
    return;
  }

  if (state.cigarettes === 0) {
    setStory("Thương nhân chợ đen trừng bạn một cái: \"Không có điếu thuốc mà làm gì có chuyện vui?\"");
    showExploreOptionsState();
    return;
  }

  const shopMatch = option.action.match(/^buy_weapon_(\d+)$/);
  if (!shopMatch) return;
  const shopIndex = parseInt(shopMatch[1]);
  const shopItem = TRADER_WEAPON_SHOP[shopIndex];
  if (!shopItem) return;

  const weaponDef = shopItem.type === "ranged"
    ? RANGED_WEAPONS.find(w => w.id === shopItem.weaponId)
    : MELEE_WEAPONS.find(w => w.id === shopItem.weaponId);
  const costMin = shopItem.costMin;
  const costMax = shopItem.costMax;
  const costLabel = shopItem.type === "ranged" ? "Tầm xa" : "Cận chiến";

  if (!weaponDef) return;

  const cost = Math.floor(Math.random() * (costMax - costMin + 1)) + costMin;

  if (state.cigarettes < cost) {
    setStory(`Thương nhân chợ đen lắc đầu: "Vũ khí ${costLabel} này cần ${cost} điếu thuốc, bạn chỉ có ${state.cigarettes} điếu, không đủ."`);
    showExploreOptionsState();
    return;
  }

  removeCigarettes(cost);
  const weaponItem = weaponDef.type === "melee"
    ? { ...weaponDef, currentDurability: weaponDef.durability }
    : { ...weaponDef };

  const added = addItem(weaponItem);
  if (!added) {
    addCigarettes(cost);
    setStory("Balo đã đầy, giao dịch thất bại. Thương nhân chợ đen trả lại điếu thuốc cho bạn.");
  } else {
    setStory(`Giao dịch thành công! Bạn dùng ${cost} điếu thuốc mua được một thanh ${weaponDef.name}. Thương nhân chợ đen thổi một tiếng huýt sáo.`);
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

/**
 * Kích hoạt sự kiện gặp bác sĩ mạt thế
 */
function handleDoctorEncounter() {
  setStory(`Một người đàn ông trung niên mặc áo choàng trắng, đeo khẩu trang đang ở góc phòng sắp xếp hộp thuốc. Thấy bạn đến gần, anh ấy bình tĩnh nói: "Tôi là bác sĩ mạt thế. Cho tôi ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần vật tư, tôi có thể chữa cho bạn."`);
  setPhase("doctor_interact");
  setOptions([
    { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần thực phẩm để chữa`, action: "doctor_food" },
    { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần đồ uống để chữa`, action: "doctor_drink" },
    { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần trái cây để chữa`, action: "doctor_fruit" },
    { text: `Trị liệu tâm lý (${GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FOOD_COST} thực phẩm, mệt mỏi-${GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FATIGUE_REDUCTION})`, action: "doctor_psychology" },
    { text: "Đâm lén (tấn công bác sĩ)", action: "doctor_backstab" },
    { text: "Rời đi", action: "doctor_leave" }
  ]);
}

/**
 * Xử lý lựa chọn giao diện tương tác bác sĩ mạt thế
 * @param {number} input - số thứ tự lựa chọn của người chơi
 */
function handleDoctorAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "doctor_leave") {
    setStory("Bạn cảm ơn bác sĩ, tiếp tục lên đường.");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }

  if (action === "doctor_psychology") {
    const foodItems1 = state.food;
    const foodCount = foodItems1.reduce((sum, f) => sum + (f.count || 1), 0);
    if (foodCount < GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FOOD_COST) {
      setStory(`Thực phẩm của bạn không đủ, trị liệu tâm lý cần ${GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FOOD_COST} phần thực phẩm.`);
      handleDoctorEncounter();
      return;
    }
    let remaining = GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FOOD_COST;
    for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        state.food.splice(i, 1);
        remaining -= available;
      } else {
        state.food[i].count = available - remaining;
        remaining = 0;
      }
    }
    state.crash = Math.max(0, (state.crash || 0) - GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FATIGUE_REDUCTION);
    setStory(`Bác sĩ mạt thế tiến hành một buổi tư vấn tâm lý ngắn……bạn cảm thấy dễ chịu hơn một chút. Mệt mỏi-${GAME_CONSTANTS.DOCTOR.PSYCHOLOGY_FATIGUE_REDUCTION}.`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }

  if (action === "doctor_backstab") {
    setStory("Bạn nắm chặt vũ khí, nhưng nghĩ lại——giữa mạt thế, bác sĩ quá quý giá. Bác sĩ có ích cho bạn, nên bạn gác ý nghĩ đó sang một bên.");
    setPhase("doctor_interact");
    setOptions([
      { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần thực phẩm để chữa`, action: "doctor_food" },
      { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần đồ uống để chữa`, action: "doctor_drink" },
      { text: `Dùng ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần trái cây để chữa`, action: "doctor_fruit" },
      { text: "Rời đi", action: "doctor_leave" }
    ]);
    return;
  }

  const typeMap = {
    doctor_food: { type: "food", label: "Thực phẩm", arr: state.food },
    doctor_drink: { type: "drinks", label: "Đồ uống", arr: state.drinks },
    doctor_fruit: { type: "food", label: "Trái cây", arr: state.food.filter(i => i.type === "fruit") },
  };

  const info = typeMap[action];
  if (!info) return;

  if (action === "doctor_fruit") {
    const fruitCount = state.food.filter(i => i.type === "fruit").reduce((sum, i) => sum + (i.count || 1), 0);
    if (fruitCount < GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST) {
      setStory(`Bác sĩ lắc đầu: "Bạn chỉ có ${fruitCount} phần trái cây, tôi cần ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần. Đi tìm thêm trái cây rồi quay lại."`);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) showExploreOptionsState();
      return;
    }
    let remaining = GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST;
    for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
      if (state.food[i].type === "fruit") {
        const available = state.food[i].count || 1;
        if (available <= remaining) {
          state.food.splice(i, 1);
          remaining -= available;
        } else {
          state.food[i].count = available - remaining;
          remaining = 0;
        }
      }
    }
  } else {
    const itemCount = info.arr.reduce((sum, i) => sum + (i.count || 1), 0);
    if (itemCount < GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST) {
      setStory(`Bác sĩ lắc đầu: "Bạn chỉ có ${itemCount} phần ${info.label}, tôi cần ${GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST} phần."`);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) showExploreOptionsState();
      return;
    }
    let remaining = GAME_CONSTANTS.DOCTOR.TREATMENT_ITEM_COST;
    for (let i = info.arr.length - 1; i >= 0 && remaining > 0; i--) {
      const available = info.arr[i].count || 1;
      if (available <= remaining) {
        info.arr.splice(i, 1);
        remaining -= available;
      } else {
        info.arr[i].count = available - remaining;
        remaining = 0;
      }
    }
  }

  state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + GAME_CONSTANTS.DOCTOR.HEAL_AMOUNT);
  setStory(`Bác sĩ cẩn thận xử lý vết thương của bạn. Bạn cảm thấy khá hơn nhiều! (Hồi phục ${GAME_CONSTANTS.DOCTOR.HEAL_AMOUNT} điểm sinh mệnh)`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export {
  getRangedAmmoInfo,
  canRangedCombat,
  handlePreCombatChoice,
  handleCombat,
  handleSurvivorEncounter,
  handleBanditEncounter,
  handlePreCombatNpcChoice,
  handleSurvivorAction,
  handleNpcCombat,
  handleWanderingTraderEncounter,
  handleWanderingTraderAction,
  handleTraderBuyAmmo,
  handleTraderBuyWeapon,
  handleDoctorEncounter,
  handleDoctorAction,
};
