/* ============================================================
   Mô-đun quản lý trạng thái trò chơi
   Thứ tự tổ chức: Nhập → Hằng số → Trạng thái ban đầu → Truy cập trạng thái
   → Thuộc tính sinh tồn (thời gian/đói/khát) → Balo/Vật phẩm/Hàng hóa
   → Trang bị (cận chiến/tầm xa/đạn) → Kiểm tra trạng thái → Độ thân thiện/ nhiệm vụ NPC
   ============================================================ */
  
import { TIME_PHASES, MELEE_WEAPONS, FOODS, DRINKS, MEDICINES, BACKPACK_TYPES, AFFINITY_THRESHOLDS, AFFINITY_MAX, GAME_CONSTANTS, DEFAULT_ITEM_IDS, GAME_INTRO, SEEDS, AMMO } from './config.js';
import { DEFAULT_APPEARANCE } from './data/player-appearance.js';

// ---------- Trạng thái ban đầu ----------

const INITIAL_STATE = {
  name: "",
  playerAppearance: { ...DEFAULT_APPEARANCE },
  day: 1,
  phaseIndex: 0,
  location: "Lều Người Sống Sót",
  health: GAME_CONSTANTS.MAX_HEALTH,
  crash: 0,
  crashTurns: 0,
  sanity: GAME_CONSTANTS.SANITY_MAX,
  infection: 0,
  hunger: 100,
  hydration: 100,
  status: "Bình thường",
  currentMap: null,
  meleeWeapon: { ...MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee), currentDurability: MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).durability },
  rangedWeapon: null,
  ammo: [],
  backpack: { ...BACKPACK_TYPES.tui_xach },
  food: [
    { ...FOODS.find(f => f.id === DEFAULT_ITEM_IDS.food), count: 2 }
  ],
  drinks: [
    { ...DRINKS.find(d => d.id === DEFAULT_ITEM_IDS.drink), count: 2 }
  ],
  medicine: [{ ...MEDICINES.find(m => m.id === "bang_keo"), count: 1 }],
  other: [],
  cigarettes: 0,
  royalCoins: 0,
  pureEnergy: 0,
  seeds: [],
  npcAffinity: { v: 0, xiaohan: 0, lili: 0, nurseZombie: 0, leader: 0, mumiao: 0, yumo: 0, guyue: 0, linhan: 0, wolf: 0, mermaid: 0 },
  npcQuestsDone: { v1: false, v2: false, v3: false, v4: false, v5: false, v6: false, xh0: false, xh1: false, xh2: false, xh3: false, xh4: false, xh5: false, llGift: false, mumiaoSecret: false, mumiaoQuest1: false, mumiaoQuest2: false, mumiaoQuest3: false, leaderQuest1: false, leaderQuest2: false, leaderQuest3: false, queenQuest1: false, queenQuest2: false, queenQuest3: false, queenQuest4: false, yumoQuest1: false, yumoQuest2: false, yumoQuest3: false, yumoQuest4: false, yumoQuest5: false },
  lastBegDay: 0,
  lastClimbDay: 0,
  lastPickFruitDay: 0,
  lastCaveDay: 0,
  lastMoldySeedsDay: 0,
  lastAbandonedFieldDay: 0,
  lastLootCorpseDay: 0,
  lastFactoryExploreDay: 0,
  lastFactoryWorkshopDay: 0,
  lastViewRiverDay: 0,
  outlawKilled: false,
  hasEatenStrangeMeat: false,
  maSanQuest1Done: false,
  maSanQuest2Done: false,
  maSanQuest3Done: false,
  maSanQuest4Done: false,
  liuruyanRescued: false,
  liuruyanDiscovered: false,
  liuruyanQuest1Done: false,
  liuruyanQuest2Done: false,
  liuruyanQuest3Done: false,
  liuruyanQuest4Done: false,
  wolfQuest1Done: false,
  wolfQuest2Done: false,
  wolfQuest3Done: false,
  wolfQuest4Done: false,
  gasoline: 0,
  nurseZombieRescued: false,
  lastPartnerHarvestDay: 0,
  lastNurseHarvestDay: 0,
  lastMumiaoTendDay: 0,
  tombstoneDug: false,
  tentSearched: false,
  lastVTradeDay: 0,
  lastLiliTradeDay: 0,
  lastXiaohanTradeDay: 0,
  zombieKingDefeated: false,
  doctorTradeDone: false,
  baseLevel: 0,
  warehouseLevel: 0,
  warehouse: [],
  crops: Array(GAME_CONSTANTS.BASE.FARMING_CROP_SLOTS).fill(null),
  weather: "troi_nang",
  castleDebt: null,
  islandDebt: null,
  islandDebtTriggered: false,
  castleDebtTriggered: false,
  investment: null,
  bankerKilled: false,
  currentSubMap: null,
  lastBanquetDay: 0,
  lastBallDay: 0,
  highestCastleRank: 0,
  kingQuestsDone: { king_1: false, king_2: false, king_3: false, king_4: false, king_5: false },
  castleRankObtained: { viscount: false, count: false, marquis: false, duke: false, crown_prince: false },
  lastSalaryDay: 0,
  lastTreatmentDay: 0,
  lastMeetingDay: 0,
  lastGardenDay: 0,
  lastCastleWorkDay: 0,
  leaderAlive: true,
  giantPuppetDefeated: false,
  doctorQuest1Accepted: false,
  doctorQuest1Done: false,
  doctorQuest2Done: false,
  doctorQuest3Done: false,
  undergroundKeyObtained: false,
  generatorObtained: false,
  rocketRepaired: false,
  doctorLeftInEnding8: false,
  yumoDivingKills: 0,
  fishingCount: 0,
  lastEnergyWellDay: 0,
  lastImprovedSerumDay: 0,
  lastLeaderChatDay: 0,
  lastLeaderGiftDay: 0,
  leaderGiftClaimed: false,
  lastIslandWelfareDay: 0,
  stats: {
    zombieKills: 0,
    mapsExplored: [],
    bossesDefeated: [],
    maxBaseLevel: 0,
    companionsRecruited: 0,
    totalTrades: 0,
    totalCigarettesEarned: 0,
  },
  unlockedAchievements: [],
  unlockedEndings: [],
  _playerDied: false,
  _optionPage: 0,
  // Chuỗi nhiệm vụ Lão Mã
  oldMaContrabandUsed: false,
  oldMaStep: 0,
  crimeDataCount: 0,
  kingKilled: false,
  zhaoKilled: false,
  doctorKilled: false,
  lastPoliceArchiveDay: 0,
  npcChatCount: { v: 0, xiaohan: 0, lili: 0, nurseZombie: 0, leader: 0, mumiao: 0, yumo: 0, guyue: 0, linhan: 0, wolf: 0, mermaid: 0 },
  lastChatDay: 0,
  story: GAME_INTRO,
  options: [
    { text: "Ngủ", action: "sleep" },
    { text: "Ăn uống", action: "eat" },
    { text: "Uống nước", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Ra ngoài", action: "goOut" },
    { text: "Vứt bỏ", action: "discard" },
    { text: "Lưu trữ", action: "save_game" },
    { text: "Thu hoạch đồng bạn", action: "partner_harvest" },
    { text: "Xây dựng căn cứ", action: "base_build" },
    { text: "Ghi chú sinh tồn", action: "survival_notes" },
    { text: "Quay về menu", action: "back_to_main_menu" },],
  phase: "choose",
  gameOver: false,
  combatState: null,
};

let gameState = JSON.parse(JSON.stringify(INITIAL_STATE));

let _autoSaveCallback = null;
export function setAutoSaveCallback(cb) { _autoSaveCallback = cb; }

// Công cụ nội bộ: giới hạn giá trị trong khoảng [min, max]
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function isStackableType(item) {
  if (item.stackable) return true;
  const stackableTypes = new Set(["food", "fruit", "drink", "drinks", "medicine", "building", "seed", "fish"]);
  return stackableTypes.has(item.type);
}

export function getStackableCount(arr) {
  return arr.reduce((sum, item) => sum + (item.count || 1), 0);
}

export function getItemDisplayName(item) {
  const name = formatQualityName(item);
  if (isStackableType(item) && (item.count || 1) > 1) {
    return `${item.count}${name}`;
  }
  return name;
}

/**
 * Trả về tên với màu HTML theo phẩm chất vật phẩm
 * @param {Object} item - Đối tượng vật phẩm (chứa thuộc tính rarity)
 * @returns {string} Tên bọc trong span có màu
 */
export function formatQualityName(item) {
  const rarity = item.rarity;
  if (rarity) return `<span class="quality-${rarity}">${item.name}</span>`;
  if (item.type === "other") return `<span class="quality-special">${item.name}</span>`;
  return item.name;
}

/**
 * Trả về văn bản với màu HTML theo tên và phẩm chất
 * @param {string} name - Tên vật phẩm
 * @param {string} rarity - Cấp phẩm chất
 * @returns {string} Tên bọc trong span có màu
 */
export function formatQualityText(name, rarity) {
  if (!rarity) return name;
  return `<span class="quality-${rarity}">${name}</span>`;
}

// ---------- Truy cập trạng thái ----------

/** Lấy tham chiếu đến đối tượng trạng thái trò chơi hiện tại */
export function getState() {
  return gameState;
}

/** Đặt lại trạng thái trò chơi về giá trị ban đầu */
export function resetState() {
  gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
}

/** Đặt tên nhân vật người chơi */
export function setName(name) {
  gameState.name = name;
}

/** Lấy thông tin ngoại hình nhân vật */
export function getPlayerAppearance() {
  return gameState.playerAppearance || { ...DEFAULT_APPEARANCE };
}

/** Đặt thông tin ngoại hình nhân vật */
export function setPlayerAppearance(appearance) {
  if (appearance) {
    gameState.playerAppearance = { ...appearance };
  }
}

// ---------- Thuộc tính sinh tồn (thời gian/đói/khát) ----------

/** Tiến thời gian theo số bước, đồng thời cập nhật đói, khát và mệt mỏi */
export function advanceTime(steps = 1) {
  const messages = [];

  gameState.phaseIndex += steps;

  gameState.crashTurns += steps;
  while (gameState.crashTurns >= GAME_CONSTANTS.SURVIVAL.FATIGUE_THRESHOLD_TURNS) {
    gameState.crashTurns -= GAME_CONSTANTS.SURVIVAL.FATIGUE_THRESHOLD_TURNS;
    if (gameState.crash < GAME_CONSTANTS.FATIGUE_MAX) {
      gameState.crash = Math.min(gameState.crash + GAME_CONSTANTS.SURVIVAL.FATIGUE_PER_CYCLE, GAME_CONSTANTS.FATIGUE_MAX);
      messages.push(`Bạn đã quá lâu chưa nghỉ ngơi, cơ thể càng lúc càng mệt mỏi! Mệt mỏi +${GAME_CONSTANTS.SURVIVAL.FATIGUE_PER_CYCLE}%`);
    }
  }

  while (gameState.phaseIndex >= TIME_PHASES.length) {
    gameState.day++;
    gameState.phaseIndex -= TIME_PHASES.length;
    gameState.fishingCount = 0;
    generateWeather();
    messages.push(`Một ngày mới bắt đầu! Ngày thứ ${gameState.day}`);
    for (const entry of GAME_CONSTANTS.ACHIEVEMENTS.SURVIVAL_DAYS) {
      if (gameState.day === entry.threshold) {
        if (!gameState.unlockedAchievements) gameState.unlockedAchievements = [];
        if (!gameState.unlockedAchievements.includes(entry.id)) gameState.unlockedAchievements.push(entry.id);
      }
    }
    if (gameState.day % 5 === 0 && gameState.day > 0 && _autoSaveCallback) {
      _autoSaveCallback(gameState);
    }
  }

  gameState.hunger = clamp(gameState.hunger - GAME_CONSTANTS.SURVIVAL.HUNGER_DECAY * steps, 0, 100);
  gameState.hydration = clamp(gameState.hydration - GAME_CONSTANTS.SURVIVAL.HYDRATION_DECAY * steps, 0, 100);

  applyWeatherEffects(steps);

  for (let i = 0; i < gameState.crops.length; i++) {
    if (gameState.crops[i] !== null && gameState.crops[i].matureTurns > 0) {
      gameState.crops[i].matureTurns--;
    }
  }

  return messages;
}

/** Đặt lại bộ đếm mệt mỏi (gọi sau khi nghỉ ngơi) */
export function resetCrashTurns() {
  gameState.crashTurns = 0;
}

// ---------- Balo/Vật phẩm ----------

/** Thêm vật phẩm vào balo, trả về có thêm thành công không */
export function addItem(item) {
  if (item.type === "cigarette") {
    gameState.cigarettes += (item.count || 1);
    return true;
  }

  if (item.type === "royal_coin") {
    gameState.royalCoins += (item.count || 1);
    return true;
  }

  if (item.type === "gasoline") {
    gameState.gasoline += (item.count || 1);
    return true;
  }

  if (item.type === "ammo") {
    const existing = gameState.ammo.find((a) => a.id === item.id);
    const count = item.count ?? 1;
    if (existing) {
      existing.count += count;
    } else {
      gameState.ammo.push({ id: item.id, name: item.name, count });
    }
    return true;
  }

  const totalItems =
    getStackableCount(gameState.food) +
    getStackableCount(gameState.drinks) +
    getStackableCount(gameState.medicine) +
    getStackableCount(gameState.other) +
    getStackableCount(gameState.seeds);

  if (totalItems >= gameState.backpack.capacity) {
    return false;
  }

  const typeMap = {
    food: gameState.food,
    fruit: gameState.food,
    fish: gameState.food,
    drink: gameState.drinks,
    drinks: gameState.drinks,
    medicine: gameState.medicine,
    seed: gameState.seeds,
  };

  const target = typeMap[item.type] || gameState.other;

  if (isStackableType(item)) {
    const existing = target.find((i) => i.id === item.id);
    if (existing) {
      existing.count = (existing.count || 1) + (item.count || 1);
    } else {
      target.push({ ...item, count: item.count || 1 });
    }
  } else {
    target.push(item);
  }

  return true;
}

/** Xóa vật phẩm theo loại và chỉ số trong balo, trả về vật phẩm đã xóa */
export function removeItem(type, index, count = 1) {
  if (type === "cigarette") {
    const removed = Math.min(count, gameState.cigarettes);
    gameState.cigarettes -= removed;
    return { type: "cigarette", name: "Thuốc lá", count: removed };
  }

  if (type === "gasoline") {
    const removed = Math.min(count, gameState.gasoline);
    gameState.gasoline -= removed;
    return { type: "gasoline", name: "Xăng", count: removed };
  }

  const typeMap = {
    food: gameState.food,
    fruit: gameState.food,
    drink: gameState.drinks,
    drinks: gameState.drinks,
    medicine: gameState.medicine,
    seed: gameState.seeds,
    other: gameState.other,
  };

  const target = typeMap[type];
  if (!target || index < 0 || index >= target.length) {
    return null;
  }

  const item = target[index];

  if (isStackableType(item) && (item.count || 1) > count) {
    item.count = (item.count || 1) - count;
    return { ...item, count };
  }

  return target.splice(index, 1)[0];
}

export function removeItemById(type, itemId, count = 1) {
  const typeMap = {
    food: gameState.food,
    fruit: gameState.food,
    drink: gameState.drinks,
    drinks: gameState.drinks,
    medicine: gameState.medicine,
    seed: gameState.seeds,
    other: gameState.other,
  };

  const target = typeMap[type];
  if (!target) return null;

  let remaining = count;
  for (let i = target.length - 1; i >= 0 && remaining > 0; i--) {
    if (target[i].id === itemId) {
      const item = target[i];
      const available = item.count || 1;
      if (isStackableType(item) && available > remaining) {
        item.count = available - remaining;
        remaining = 0;
      } else {
        remaining -= available;
        target.splice(i, 1);
      }
    }
  }
  return remaining <= 0;
}

/** Tiêu thụ vật phẩm trong balo và áp dụng hiệu quả */
export function consumeItem(type, index) {
  const typeMap = {
    food: gameState.food,
    fruit: gameState.food,
    drink: gameState.drinks,
    drinks: gameState.drinks,
    medicine: gameState.medicine,
    seed: gameState.seeds,
    other: gameState.other,
  };

  const target = typeMap[type];
  if (!target || index < 0 || index >= target.length) {
    return null;
  }

  const item = target[index];
  let consumed;

  if (isStackableType(item) && (item.count || 1) > 1) {
    item.count = (item.count || 1) - 1;
    consumed = { ...item, count: 1 };
  } else {
    consumed = target.splice(index, 1)[0];
  }

  if (consumed.hunger) {
    gameState.hunger = clamp(gameState.hunger + consumed.hunger, 0, 100);
  }

  if (consumed.hydration) {
    gameState.hydration = clamp(gameState.hydration + consumed.hydration, 0, 100);
  }

  if (consumed.health) {
    gameState.health = clamp(gameState.health + consumed.health, 0, GAME_CONSTANTS.MAX_HEALTH);
  }

  if (consumed.effects) {
    if (consumed.effects.infection != null) {
      gameState.infection = clamp(gameState.infection + consumed.effects.infection, 0, 100);
    }
    if (consumed.effects.crash != null) {
      gameState.crash = clamp(gameState.crash + consumed.effects.crash, 0, 100);
    }
    if (consumed.effects.sanity != null) {
      gameState.sanity = clamp(gameState.sanity + consumed.effects.sanity, 0, GAME_CONSTANTS.SANITY_MAX);
    }
    if (consumed.effects.hunger != null) {
      gameState.hunger = clamp(gameState.hunger + consumed.effects.hunger, 0, 100);
    }
    if (consumed.effects.hydration != null) {
      gameState.hydration = clamp(gameState.hydration + consumed.effects.hydration, 0, 100);
    }
    if (consumed.effects.health != null) {
      gameState.health = clamp(gameState.health + consumed.effects.health, 0, GAME_CONSTANTS.MAX_HEALTH);
    }
  }

  return consumed;
}

// ---------- Trang bị (cận chiến/tầm xa/đạn) ----------

/** Trang bị vũ khí cận chiến, trả về thông tin vũ khí đã trang bị */
export function equipMelee(itemId) {
  if (itemId === DEFAULT_ITEM_IDS.melee) {
    if (gameState.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
      gameState.other.push(gameState.meleeWeapon);
    }
    gameState.meleeWeapon = { ...MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee), currentDurability: MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).durability };
    return gameState.meleeWeapon;
  }

  const index = gameState.other.findIndex(
    (item) => item.id === itemId && item.type === "melee"
  );

  if (index === -1) {
    return null;
  }

  const newWeapon = gameState.other.splice(index, 1)[0];

  if (gameState.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
    gameState.other.push(gameState.meleeWeapon);
  }

  gameState.meleeWeapon = newWeapon;
  return gameState.meleeWeapon;
}

/** Trang bị vũ khí tầm xa, trả về thông tin vũ khí đã trang bị */
export function equipRanged(itemId) {
  const index = gameState.other.findIndex(
    (item) => item.id === itemId && item.type === "ranged"
  );

  if (index === -1) {
    return null;
  }

  const newWeapon = gameState.other.splice(index, 1)[0];

  if (gameState.rangedWeapon) {
    gameState.other.push(gameState.rangedWeapon);
  }

  gameState.rangedWeapon = newWeapon;
  return gameState.rangedWeapon;
}

/** Thêm đạn theo loại và số lượng vào khe đạn */
export function addAmmo(ammoId, count) {
  if (!count || count <= 0) return;
  const existing = gameState.ammo.find((a) => a.id === ammoId);
  if (existing) {
    existing.count += count;
  } else {
    const ammoDef = AMMO.find(a => a.id === ammoId);
    const name = ammoDef ? ammoDef.name : ammoId;
    gameState.ammo.push({ id: ammoId, name, count });
  }
}

/** Tiêu thụ một viên đạn loại chỉ định, trả về có tiêu thụ thành công không */
export function useAmmo(ammoId) {
  const existing = gameState.ammo.find((a) => a.id === ammoId);
  if (!existing || existing.count <= 0) {
    return false;
  }

  existing.count--;
  if (existing.count <= 0) {
    gameState.ammo = gameState.ammo.filter((a) => a.id !== ammoId);
  }
  return true;
}

/** Giảm độ bền vũ khí cận chiến hiện tại, trả về thông báo hỏng hoặc null */
export function reduceMeleeDurability() {
  if (gameState.meleeWeapon.currentDurability === Infinity) {
    return null;
  }

  gameState.meleeWeapon.currentDurability -= 1;

  if (gameState.meleeWeapon.currentDurability <= 0) {
    const brokenName = gameState.meleeWeapon.name;
    gameState.meleeWeapon = { ...MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee), currentDurability: MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).durability };
    return `${brokenName} đã bị hỏng, bạn chỉ có thể dùng ${MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).name} thôi.`;
  }

  return null;
}

/** Giảm độ nguyên vẹn vũ khí tầm xa hiện tại, trả về thông báo hỏng hoặc null */
export function reduceRangedIntegrity() {
  if (!gameState.rangedWeapon) {
    return null;
  }

  gameState.rangedWeapon.integrity -= GAME_CONSTANTS.COMBAT.RANGED_INTEGRITY_LOSS;

  if (gameState.rangedWeapon.integrity <= 0) {
    const brokenName = gameState.rangedWeapon.name;
    gameState.rangedWeapon = null;
    return `${brokenName} đã bị hỏng, không thể dùng nữa.`;
  }

  return null;
}

// ---------- Kiểm tra trạng thái ----------

/** Kiểm tra người chơi có chết không, trả về đã chết chưa */
export function checkDeath() {
  if (gameState.health <= 0 || gameState.infection >= GAME_CONSTANTS.INFECTION_MAX) {
    gameState._playerDied = true;
    gameState.gameOver = true;
    return true;
  }
  return false;
}

/** Cập nhật trạng thái người chơi theo tình trạng đói/khát/nhiễm/mệt/lý trí và trả về thông báo */
export function updateStatusEffects() {
  const messages = [];

  if (gameState.hunger <= 0) {
    gameState.health = clamp(gameState.health - GAME_CONSTANTS.SURVIVAL.STARVATION_DAMAGE, 0, GAME_CONSTANTS.MAX_HEALTH);
    messages.push("Bạn cực kỳ đói, sinh lực giảm!");
  }
  if (gameState.hydration <= 0) {
    gameState.health = clamp(gameState.health - GAME_CONSTANTS.SURVIVAL.STARVATION_DAMAGE, 0, GAME_CONSTANTS.MAX_HEALTH);
    messages.push("Bạn cực kỳ khát, sinh lực giảm!");
  }

  if (gameState.hunger > 0 && gameState.hunger <= GAME_CONSTANTS.SURVIVAL.HUNGER_WARN_THRESHOLD) {
    messages.push("Bạn thấy hơi đói, cần ăn uống sớm.");
  }
  if (gameState.hydration > 0 && gameState.hydration <= GAME_CONSTANTS.SURVIVAL.HYDRATION_WARN_THRESHOLD) {
    messages.push("Bạn thấy hơi khát, cần uống nước sớm.");
  }

  const statusList = [];

  if (gameState.hunger <= 0) {
    statusList.push("Đói");
  }
  if (gameState.hydration <= 0) {
    statusList.push("Khát");
  }
  if (gameState.infection > GAME_CONSTANTS.SURVIVAL.INFECTION_THRESHOLD) {
    statusList.push("Nhiễm trùng");
    messages.push("Bạn cảm thấy cơ thể đang bị virus xâm thực……");
  }
  if (gameState.crash > GAME_CONSTANTS.SURVIVAL.FATIGUE_STATUS_THRESHOLD) {
    statusList.push("Mệt mỏi");
    messages.push("Cơ thể bạn đã cực kỳ mệt mỏi……");
  }
  if (gameState.sanity < GAME_CONSTANTS.SURVIVAL.SANITY_STATUS_THRESHOLD) {
    statusList.push("Rối loạn");
    messages.push("Bạn cảm thấy tinh thần hoảng hốt, lý trí đang trôi đi……");
  }
  if (gameState.sanity <= 0) {
    statusList.push("Ảo giác");
    messages.push("Ảo giác và rối loạn nhận thức nghiêm trọng đang nuốt chửng bạn! Bạn không thể phân biệt đường về nhà, trong chiến đấu đòn đánh thường xuyên trượt!");
  }
  if (gameState.health < GAME_CONSTANTS.SURVIVAL.SEVERE_INJURY_THRESHOLD) {
    statusList.push("Trọng thương");
    messages.push("Bạn bị thương nặng, cần điều trị sớm!");
  }

  if (statusList.length > 0) {
    gameState.status = statusList.join("·");
  } else {
    gameState.status = "Bình thường";
  }

  return messages;
}

// ---------- Độ thân thiện NPC / Nhiệm vụ ----------

/**
 * Tăng độ thân thiện của NPC chỉ định (tối đa 150)
 * @param {string} npcId - Mã NPC: v/xiaohan/lili
 * @param {number} amount - Lượng thân thiện tăng
 * @returns {number} Giá trị thân thiện mới
 */
export function addNpcAffinity(npcId, amount) {
  if (gameState.npcAffinity[npcId] !== undefined) {
    gameState.npcAffinity[npcId] = clamp(gameState.npcAffinity[npcId] + amount, 0, AFFINITY_MAX[npcId] ?? 200);
  }
  return gameState.npcAffinity[npcId] || 0;
}

/**
 * Lấy độ thân thiện hiện tại của NPC chỉ định
 * @param {string} npcId - Mã NPC
 * @returns {number} Giá trị thân thiện
 */
export function getNpcAffinity(npcId) {
  return gameState.npcAffinity[npcId] || 0;
}

/**
 * Trả về danh xưng quan hệ theo giá trị thân thiện
 * @param {number} affinity - Thân thiện (0-150)
 * @returns {string} Danh xưng quan hệ
 */
export function getAffinityLabel(affinity) {
  for (const t of AFFINITY_THRESHOLDS) {
    if (affinity >= t.min) return t.label;
  }
  return "Người lạ";
}

/**
 * Kiểm tra hôm nay còn có thể xin vật tư không
 * @returns {boolean}
 */
export function canBegToday() {
  return gameState.lastBegDay < gameState.day;
}

/**
 * Đánh dấu hôm nay đã xin vật tư
 */
export function markBegDone() {
  gameState.lastBegDay = gameState.day;
}

/**
 * Kiểm tra hôm nay còn có thể đối thoại với NPC chỉ định không
 * @param {string} npcId - Mã NPC
 * @param {number} maxChats - Số lần đối thoại tối đa mỗi ngày, mặc định 4
 * @returns {boolean}
 */
export function canChatToday(npcId, maxChats = GAME_CONSTANTS.NPC.DAILY_CHAT_LIMIT) {
  if (gameState.lastChatDay < gameState.day) {
    resetChatCounts();
  }
  return gameState.npcChatCount[npcId] < maxChats;
}

/**
 * Tăng số lần đối thoại với NPC chỉ định
 * @param {string} npcId - Mã NPC
 */
export function incrementChatCount(npcId) {
  if (gameState.lastChatDay < gameState.day) {
    resetChatCounts();
  }
  if (gameState.npcChatCount[npcId] !== undefined) {
    gameState.npcChatCount[npcId]++;
  }
}

/**
 * Đặt lại số lần đối thoại của tất cả NPC (ngày mới)
 */
export function resetChatCounts() {
  gameState.lastChatDay = gameState.day;
  gameState.npcChatCount = { v: 0, xiaohan: 0, lili: 0, nurseZombie: 0, leader: 0, mumiao: 0, yumo: 0, guyue: 0, linhan: 0, wolf: 0, mermaid: 0 };
}

/**
 * Lấy số lần đối thoại hôm nay với NPC chỉ định
 * @param {string} npcId - Mã NPC
 * @returns {number}
 */
export function getChatCount(npcId) {
  if (gameState.lastChatDay < gameState.day) {
    resetChatCounts();
  }
  return gameState.npcChatCount[npcId] || 0;
}

/**
 * Lấy giai đoạn thân thiện
 * @param {number} affinity - Thân thiện
 * @returns {string} Tên giai đoạn
 */
export function getAffinityStage(affinity) {
  for (const t of AFFINITY_THRESHOLDS) {
    if (affinity >= t.min) return t.stage;
  }
  return "stranger";
}

/**
 * Kiểm tra nhiệm vụ chỉ định đã hoàn thành chưa
 * @param {string} questId - ID nhiệm vụ (v1/v2/v3/v4/xh1/xh2/llGift)
 * @returns {boolean}
 */
export function isQuestDone(questId) {
  return !!gameState.npcQuestsDone[questId];
}

/**
 * Đánh dấu nhiệm vụ chỉ định là đã hoàn thành
 * @param {string} questId - ID nhiệm vụ
 */
export function markQuestDone(questId) {
  if (gameState.npcQuestsDone[questId] !== undefined) {
    gameState.npcQuestsDone[questId] = true;
  }
}

// ---------- Hỗ trợ giao diện ----------

/** Đặt mô tả vị trí hiện tại */
export function setLocation(location) {
  gameState.location = location;
}

/** Đặt bản đồ khám phá hiện tại */
export function setCurrentMap(map) {
  gameState.currentMap = map;
}

/** Đặt giai đoạn trò chơi hiện tại */
export function setPhase(phase) {
  gameState.phase = phase;
}

/** Đặt văn bản cốt truyện hiện tại */
export function setStory(text) {
  gameState.story = text;
}

export function addPureEnergy(count) {
  gameState.pureEnergy += count;
}

export function removePureEnergy(count) {
  const removed = Math.min(count, gameState.pureEnergy);
  gameState.pureEnergy -= removed;
  return removed;
}

/** Đặt danh sách thao tác có thể chọn hiện tại */
export function setOptions(options) {
  gameState._optionPage = 0;
  gameState.options = options;
}

/** Lấy số ô balo đã chiếm */
export function getBackpackCount() {
  return (
    getStackableCount(gameState.food) +
    getStackableCount(gameState.drinks) +
    getStackableCount(gameState.medicine) +
    getStackableCount(gameState.other) +
    getStackableCount(gameState.seeds)
  );
}

export function addCigarettes(count) {
  gameState.cigarettes += count;
}

export function addRoyalCoins(count) {
  gameState.royalCoins += count;
}

export function removeCigarettes(count) {
  const removed = Math.min(count, gameState.cigarettes);
  gameState.cigarettes -= removed;
  return removed;
}

export function removeRoyalCoins(count) {
  const removed = Math.min(count, gameState.royalCoins);
  gameState.royalCoins -= removed;
  return removed;
}

export function addGasoline(count) {
  gameState.gasoline += count;
}

export function removeGasoline(count) {
  const removed = Math.min(count, gameState.gasoline);
  gameState.gasoline -= removed;
  return removed;
}

/**
 * Chuẩn hóa trạng thái trò chơi, đảm bảo mọi trường cần thiết đều tồn tại
 * @param {Object} state - Đối tượng trạng thái trò chơi
 */
export function normalizeState(state) {
  if (!state.playerAppearance) {
    state.playerAppearance = { ...DEFAULT_APPEARANCE };
  }
  if (state.meleeWeapon && state.meleeWeapon.currentDurability == null) {
    if (state.meleeWeapon.durability == null || state.meleeWeapon.durability === Infinity) {
      state.meleeWeapon.durability = Infinity;
      state.meleeWeapon.currentDurability = Infinity;
    } else {
      state.meleeWeapon.currentDurability = state.meleeWeapon.durability || 0;
    }
  }

  // Chuẩn hóa vũ khí cận chiến trong ô vật phẩm khác của balo
  if (state.other && Array.isArray(state.other)) {
    state.other.forEach(item => {
      if (item && item.type === "melee" && item.currentDurability == null) {
        if (item.durability == null || item.durability === Infinity) {
          item.durability = Infinity;
          item.currentDurability = Infinity;
        } else {
          item.currentDurability = item.durability || 0;
        }
      }
    });
  }

  // Đảm bảo các trường cần thiết khác tồn tại
  if (state.npcChatCount === undefined) {
    state.npcChatCount = { ...INITIAL_STATE.npcChatCount };
  } else {
    for (const key of Object.keys(INITIAL_STATE.npcChatCount)) {
      if (state.npcChatCount[key] === undefined) {
        state.npcChatCount[key] = 0;
      }
    }
  }
  if (state.lastChatDay === undefined) {
    state.lastChatDay = 0;
  }
  if (state.npcQuestsDone) {
    if (state.npcQuestsDone.v5 === undefined) state.npcQuestsDone.v5 = false;
    if (state.npcQuestsDone.v6 === undefined) state.npcQuestsDone.v6 = false;
    if (state.npcQuestsDone.xh0 === undefined) state.npcQuestsDone.xh0 = false;
    if (state.npcQuestsDone.xh3 === undefined) state.npcQuestsDone.xh3 = false;
    if (state.npcQuestsDone.xh4 === undefined) state.npcQuestsDone.xh4 = false;
    if (state.npcQuestsDone.xh5 === undefined) state.npcQuestsDone.xh5 = false;
    if (state.npcQuestsDone.llGift === undefined) state.npcQuestsDone.llGift = false;
  }
  if (state.lastClimbDay === undefined) state.lastClimbDay = 0;
  if (state.lastPickFruitDay === undefined) state.lastPickFruitDay = 0;
  if (state.lastCaveDay === undefined) state.lastCaveDay = 0;
  if (state.lastMoldySeedsDay === undefined) state.lastMoldySeedsDay = 0;
  if (state.lastAbandonedFieldDay === undefined) state.lastAbandonedFieldDay = 0;
  if (state.lastLootCorpseDay === undefined) state.lastLootCorpseDay = 0;
  if (state.outlawKilled === undefined) state.outlawKilled = false;
  if (state.hasEatenStrangeMeat === undefined) state.hasEatenStrangeMeat = false;
  if (state.maSanQuest1Done === undefined) state.maSanQuest1Done = false;
  if (state.maSanQuest2Done === undefined) state.maSanQuest2Done = false;
  if (state.maSanQuest3Done === undefined) state.maSanQuest3Done = false;
  if (state.maSanQuest4Done === undefined) state.maSanQuest4Done = false;
  if (state.liuruyanRescued === undefined) state.liuruyanRescued = false;
  if (state.liuruyanDiscovered === undefined) state.liuruyanDiscovered = false;
  if (state.liuruyanQuest1Done === undefined) state.liuruyanQuest1Done = false;
  if (state.liuruyanQuest2Done === undefined) state.liuruyanQuest2Done = false;
  if (state.liuruyanQuest3Done === undefined) state.liuruyanQuest3Done = false;
  if (state.liuruyanQuest4Done === undefined) state.liuruyanQuest4Done = false;
  if (state.gasoline === undefined) state.gasoline = 0;
    if (state.pureEnergy === undefined) state.pureEnergy = 0;
    if (state.sanity === undefined) state.sanity = GAME_CONSTANTS.SANITY_MAX;
  if (state.lastPartnerHarvestDay === undefined) state.lastPartnerHarvestDay = 0;
  if (state.lastFactoryExploreDay === undefined) state.lastFactoryExploreDay = 0;
  if (state.lastViewRiverDay === undefined) state.lastViewRiverDay = 0;
  if (state.nurseZombieAffinity !== undefined) {
    state.npcAffinity.nurseZombie = state.nurseZombieAffinity;
    delete state.nurseZombieAffinity;
  }
  if (state.nurseZombieRescued === undefined) state.nurseZombieRescued = false;
  if (state.lastNurseHarvestDay === undefined) state.lastNurseHarvestDay = 0;
  if (state.zombieKingDefeated === undefined) state.zombieKingDefeated = false;
  if (state.doctorTradeDone === undefined) state.doctorTradeDone = false;
  if (state.baseLevel === undefined) state.baseLevel = 0;
  if (state.warehouseLevel === undefined) state.warehouseLevel = 0;
  if (!Array.isArray(state.warehouse)) state.warehouse = [];
  if (!Array.isArray(state.crops)) state.crops = [null, null, null, null, null];
  if (state.weather === undefined) state.weather = "troi_nang";
  if (state.npcAffinity && state.npcAffinity.nurseZombie === undefined) state.npcAffinity.nurseZombie = 0;
  if (state.crashTurns === undefined) state.crashTurns = 0;
  if (state.lastBegDay === undefined) state.lastBegDay = 0;
  if (!state.backpack) state.backpack = { ...BACKPACK_TYPES.tui_xach };
  if (!Array.isArray(state.food)) state.food = [{ ...FOODS.find(f => f.id === DEFAULT_ITEM_IDS.food) }];
  if (!Array.isArray(state.drinks)) state.drinks = [{ ...DRINKS.find(d => d.id === DEFAULT_ITEM_IDS.drink) }];
  if (!Array.isArray(state.medicine)) state.medicine = [];
  if (!Array.isArray(state.other)) state.other = [];
  if (!Array.isArray(state.cargo)) state.cargo = [];
  if (Array.isArray(state.cargo) && state.cargo.length > 0) {
    let migratedCigarettes = 0;
    state.cargo.forEach(item => {
      if (item && item.type === "cigarette") {
        migratedCigarettes += (item.count || 1);
      }
    });
    if (migratedCigarettes > 0) {
      state.cigarettes = (state.cigarettes || 0) + migratedCigarettes;
    }
    state.cargo = [];
  }
  if (state.cigarettes === undefined) state.cigarettes = 0;

  const mergeStackable = (arr) => {
    const stackableMap = new Map();
    const nonStackable = [];
    for (const item of arr) {
      if (isStackableType(item)) {
        const existing = stackableMap.get(item.id);
        if (existing) {
          existing.count = (existing.count || 1) + (item.count || 1);
        } else {
          stackableMap.set(item.id, { ...item, count: item.count || 1 });
        }
      } else {
        nonStackable.push(item);
      }
    }
    return [...stackableMap.values(), ...nonStackable];
  };

  if (Array.isArray(state.food)) state.food = mergeStackable(state.food);
  if (Array.isArray(state.drinks)) state.drinks = mergeStackable(state.drinks);
  if (Array.isArray(state.medicine)) state.medicine = mergeStackable(state.medicine);
  if (Array.isArray(state.other)) {
    const fruits = state.other.filter(i => i && i.type === "fruit");
    if (fruits.length > 0) {
      for (const fruit of fruits) {
        const existing = state.food.find(f => f.id === fruit.id);
        if (existing) {
          existing.count = (existing.count || 1) + (fruit.count || 1);
        } else {
          state.food.push({ ...fruit });
        }
      }
      state.other = state.other.filter(i => !i || i.type !== "fruit");
    }
    state.other = mergeStackable(state.other);
  }

  if (!Array.isArray(state.ammo)) state.ammo = [];
  if (state.castleDebt === undefined) state.castleDebt = null;
  if (state.castleDebt && state.castleDebt.mercyCount === undefined) state.castleDebt.mercyCount = 0;
  if (state.castleDebtTriggered === undefined) state.castleDebtTriggered = false;
  if (state.islandDebt === undefined) state.islandDebt = null;
  if (state.islandDebtTriggered === undefined) state.islandDebtTriggered = false;
  if (state.investment === undefined) state.investment = null;
  if (state.bankerKilled === undefined) state.bankerKilled = false;
  if (state.currentSubMap === undefined) state.currentSubMap = null;
  if (state.lastLeaderChatDay === undefined) state.lastLeaderChatDay = 0;
  if (state.lastLeaderGiftDay === undefined) state.lastLeaderGiftDay = 0;
  if (state.leaderGiftClaimed === undefined) state.leaderGiftClaimed = false;
  if (state.npcAffinity && state.npcAffinity.leader === undefined) state.npcAffinity.leader = 0;
  if (state.lastBanquetDay === undefined) state.lastBanquetDay = 0;
  if (state.lastBallDay === undefined) state.lastBallDay = 0;
  if (state.highestCastleRank === undefined) state.highestCastleRank = 0;
  if (state.kingQuestsDone === undefined) state.kingQuestsDone = { king_1: false, king_2: false, king_3: false, king_4: false, king_5: false };
  if (state.castleRankObtained === undefined) state.castleRankObtained = { viscount: false, count: false, marquis: false, duke: false, crown_prince: false };
  if (state.lastSalaryDay === undefined) state.lastSalaryDay = 0;
  if (state.lastTreatmentDay === undefined) state.lastTreatmentDay = 0;
  if (state.lastMeetingDay === undefined) state.lastMeetingDay = 0;
  if (state.lastGardenDay === undefined) state.lastGardenDay = 0;
  if (state.lastCastleWorkDay === undefined) state.lastCastleWorkDay = 0;
  if (state.leaderAlive === undefined) state.leaderAlive = true;
  if (!state.stats) {
    state.stats = {
      zombieKills: 0,
      mapsExplored: [],
      bossesDefeated: [],
      maxBaseLevel: 0,
      companionsRecruited: 0,
      totalTrades: 0,
      totalCigarettesEarned: 0,
    };
  }
  if (!state.stats.bossesDefeated) state.stats.bossesDefeated = [];
  if (!Array.isArray(state.unlockedAchievements)) state.unlockedAchievements = [];
  if (!Array.isArray(state.unlockedEndings)) state.unlockedEndings = [];
  if (state._spaceCrateLooted === undefined) state._spaceCrateLooted = false;
  if (state.giantPuppetDefeated === undefined) state.giantPuppetDefeated = false;
  if (state.doctorQuest1Accepted === undefined) state.doctorQuest1Accepted = false;
  if (state.doctorQuest1Done === undefined) state.doctorQuest1Done = false;
  if (state.doctorQuest2Done === undefined) state.doctorQuest2Done = false;
  if (state.doctorQuest3Done === undefined) state.doctorQuest3Done = false;
  if (state.undergroundKeyObtained === undefined) state.undergroundKeyObtained = false;
  if (state.generatorObtained === undefined) state.generatorObtained = false;
  if (state.rocketRepaired === undefined) state.rocketRepaired = false;
  if (state.doctorLeftInEnding8 === undefined) state.doctorLeftInEnding8 = false;
  if (state.lastEnergyWellDay === undefined) state.lastEnergyWellDay = 0;
  if (state.lastImprovedSerumDay === undefined) state.lastImprovedSerumDay = 0;
  if (!Array.isArray(state.seeds)) state.seeds = [];
  if (state.npcAffinity && state.npcAffinity.mumiao === undefined) state.npcAffinity.mumiao = 0;
  if (state.npcChatCount && state.npcChatCount.mumiao === undefined) state.npcChatCount.mumiao = 0;
  if (state.npcQuestsDone && state.npcQuestsDone.mumiaoSecret === undefined) state.npcQuestsDone.mumiaoSecret = false;
  if (state.npcQuestsDone && state.npcQuestsDone.mumiaoQuest1 === undefined) state.npcQuestsDone.mumiaoQuest1 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.mumiaoQuest2 === undefined) state.npcQuestsDone.mumiaoQuest2 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.mumiaoQuest3 === undefined) state.npcQuestsDone.mumiaoQuest3 = false;
  if (state.tombstoneDug === undefined) state.tombstoneDug = false;
  if (state.npcQuestsDone && state.npcQuestsDone.leaderQuest1 === undefined) state.npcQuestsDone.leaderQuest1 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.leaderQuest2 === undefined) state.npcQuestsDone.leaderQuest2 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.leaderQuest3 === undefined) state.npcQuestsDone.leaderQuest3 = false;
  if (state.tentSearched === undefined) state.tentSearched = false;
  if (state.royalCoins === undefined) state.royalCoins = 0;
  if (state.npcQuestsDone && state.npcQuestsDone.queenQuest1 === undefined) state.npcQuestsDone.queenQuest1 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.queenQuest2 === undefined) state.npcQuestsDone.queenQuest2 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.queenQuest3 === undefined) state.npcQuestsDone.queenQuest3 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.queenQuest4 === undefined) state.npcQuestsDone.queenQuest4 = false;
  if (state.lastMumiaoTendDay === undefined) state.lastMumiaoTendDay = 0;
  if (state.lastVTradeDay === undefined) state.lastVTradeDay = 0;
  if (state.lastLiliTradeDay === undefined) state.lastLiliTradeDay = 0;
  if (state.lastXiaohanTradeDay === undefined) state.lastXiaohanTradeDay = 0;
  if (Array.isArray(state.other)) {
    const oldSeeds = state.other.filter(i => i && i.id === "seed" && i.type === "building");
    if (oldSeeds.length > 0) {
      state.other = state.other.filter(i => !i || i.id !== "seed" || i.type !== "building");
      for (const oldSeed of oldSeeds) {
        const count = oldSeed.count || 1;
        for (let j = 0; j < count; j++) {
          const randomSeed = SEEDS[Math.floor(Math.random() * SEEDS.length)];
          const existing = state.seeds.find(s => s.id === randomSeed.id);
          if (existing) {
            existing.count = (existing.count || 1) + 1;
          } else {
            state.seeds.push({ ...randomSeed, count: 1 });
          }
        }
      }
    }
  }
  if (Array.isArray(state.crops)) {
    for (let i = 0; i < state.crops.length; i++) {
      if (state.crops[i] && state.crops[i].reward !== undefined) {
        state.crops[i] = null;
      }
    }
  }
  if (state.npcQuestsDone && state.npcQuestsDone.yumoQuest1 === undefined) state.npcQuestsDone.yumoQuest1 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.yumoQuest2 === undefined) state.npcQuestsDone.yumoQuest2 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.yumoQuest3 === undefined) state.npcQuestsDone.yumoQuest3 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.yumoQuest4 === undefined) state.npcQuestsDone.yumoQuest4 = false;
  if (state.npcQuestsDone && state.npcQuestsDone.yumoQuest5 === undefined) state.npcQuestsDone.yumoQuest5 = false;
  if (state.npcAffinity && state.npcAffinity.yumo === undefined) state.npcAffinity.yumo = 0;
  if (state.npcChatCount && state.npcChatCount.yumo === undefined) state.npcChatCount.yumo = 0;
  if (state.yumoDivingKills === undefined) state.yumoDivingKills = 0;
  if (state.npcAffinity && state.npcAffinity.guyue === undefined) state.npcAffinity.guyue = 0;
  if (state.npcAffinity && state.npcAffinity.linhan === undefined) state.npcAffinity.linhan = 0;
  if (state.npcChatCount && state.npcChatCount.guyue === undefined) state.npcChatCount.guyue = 0;
  if (state.npcChatCount && state.npcChatCount.linhan === undefined) state.npcChatCount.linhan = 0;
  if (state.fishingCount === undefined) state.fishingCount = 0;
  if (state.lastIslandWelfareDay === undefined) state.lastIslandWelfareDay = 0;
  if (state._optionPage === undefined) state._optionPage = 0;

  // Tương thích chuỗi nhiệm vụ Lão Lang
  if (state.wolfQuest1Done === undefined) state.wolfQuest1Done = false;
  if (state.wolfQuest2Done === undefined) state.wolfQuest2Done = false;
  if (state.wolfQuest3Done === undefined) state.wolfQuest3Done = false;
  if (state.wolfQuest4Done === undefined) state.wolfQuest4Done = false;

  // Tương thích thân thiện Lão Lang/Người cá
  if (state.npcAffinity && state.npcAffinity.wolf === undefined) state.npcAffinity.wolf = 0;
  if (state.npcAffinity && state.npcAffinity.mermaid === undefined) state.npcAffinity.mermaid = 0;
  if (state.npcChatCount && state.npcChatCount.wolf === undefined) state.npcChatCount.wolf = 0;
  if (state.npcChatCount && state.npcChatCount.mermaid === undefined) state.npcChatCount.mermaid = 0;

  // Tương thích chuỗi nhiệm vụ Lão Mã
  if (state.oldMaContrabandUsed === undefined) state.oldMaContrabandUsed = false;
  if (state.oldMaStep === undefined) state.oldMaStep = 0;
  if (state.crimeDataCount === undefined) state.crimeDataCount = 0;
  if (state.kingKilled === undefined) state.kingKilled = false;
  if (state.zhaoKilled === undefined) state.zhaoKilled = false;
  if (state.doctorKilled === undefined) state.doctorKilled = false;
  if (state.lastPoliceArchiveDay === undefined) state.lastPoliceArchiveDay = 0;
  if (state.lastFactoryWorkshopDay === undefined) state.lastFactoryWorkshopDay = 0;
  if (state.lastTunnelDay === undefined) state.lastTunnelDay = 0;
}

/**
 * Mỗi ngày bắt đầu ngẫu nhiên tạo thời tiết
 */
export function generateWeather() {
  const probs = GAME_CONSTANTS.WEATHER.PROBABILITIES;
  const roll = Math.random();
  let cumulative = 0;
  for (const [weather, prob] of Object.entries(probs)) {
    cumulative += prob;
    if (roll < cumulative) {
      gameState.weather = weather;
      return;
    }
  }
  gameState.weather = "troi_nang";
}

/**
 * Áp dụng hiệu quả mỗi lượt của thời tiết (gọi trong advanceTime)
 * @param {number} steps - Số lượt tiến
 */
export function applyWeatherEffects(steps) {
  const effects = GAME_CONSTANTS.WEATHER.EFFECTS[gameState.weather];
  if (!effects) return;
  for (let i = 0; i < steps; i++) {
    if (effects.fatigue) gameState.crash = Math.min(100, (gameState.crash || 0) + effects.fatigue);
    if (effects.hydration) gameState.hydration = Math.max(0, gameState.hydration + effects.hydration);
    if (effects.health) gameState.health = Math.max(0, Math.min(GAME_CONSTANTS.MAX_HEALTH, gameState.health + effects.health));
  }
}

export function getGameSettings() {
  const defaults = { clickMode: true, inputMode: false, musicEnabled: true };
  try {
    const raw = localStorage.getItem('zombieWorldGameSettings');
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch (e) {
  }
  return { ...defaults };
}

export function saveGameSettings(settings) {
  localStorage.setItem('zombieWorldGameSettings', JSON.stringify(settings));
}

export function toggleClickMode() {
  const settings = getGameSettings();
  if (settings.clickMode) {
    if (!settings.inputMode) {
      return false;
    }
  }
  settings.clickMode = !settings.clickMode;
  saveGameSettings(settings);
  return true;
}

export function toggleInputMode() {
  const settings = getGameSettings();
  if (settings.inputMode) {
    if (!settings.clickMode) {
      return false;
    }
  }
  settings.inputMode = !settings.inputMode;
  saveGameSettings(settings);
  return true;
}

export function toggleMusic() {
  const settings = getGameSettings();
  settings.musicEnabled = !settings.musicEnabled;
  saveGameSettings(settings);
  return settings.musicEnabled;
}