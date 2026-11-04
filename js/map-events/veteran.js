import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  NERVOUS_VETERAN_DIALOGUES,
  AMMO,
  GAME_CONSTANTS,
  MAP_NPC_INTROS,
  NAMED_NPCS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleVeteranInteract() {
  const state = getState();
  setPhase("explore");
  const opts = [
    { text: "Trò chuyện", action: "veteran_chat" },
    { text: "Xin đạn", action: "veteran_ammo" },
    { text: "Rời đi", action: "veteran_leave" },
  ];
  // Chuỗi nhiệm vụ Lão Mã: tiêu diệt Lão Triệu
  if (state.oldMaStep >= 5 && !state.zhaoKilled) {
    opts.splice(2, 0, { text: "🔪 Tiêu diệt Lão Triệu", action: "kill_zhao" });
  }
  if (state.zhaoKilled) {
    setStory("Thi thể Lão Triệu vẫn còn nằm trên đất, trạm kiểm soát quân sự trống không.");
    showExploreOptionsState();
    return;
  }
  setStory(MAP_NPC_INTROS.veteran_intro);
  setOptions(opts);
}

export function handleVeteranChat() {
  setPhase("explore");
  const state = getState();
  const line = NERVOUS_VETERAN_DIALOGUES[Math.floor(Math.random() * NERVOUS_VETERAN_DIALOGUES.length)];
  let result = line;
  advanceTime(1);
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE);
    result += `\n\nLão binh đột nhiên trở nên cuồng loạn, súng trường trong tay cướp cò! Bạn bị bắn trúng, HP -${GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE}.`;
  }
  setStory(result);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setOptions([
      { text: "Trò chuyện", action: "veteran_chat" },
      { text: "Xin đạn", action: "veteran_ammo" },
      { text: "Rời đi", action: "veteran_leave" },
    ]);
  }
}

export function handleVeteranLeave() {
  setStory("Bạn rời khỏi trạm kiểm soát quân sự.");
  showExploreOptionsState();
}

export function handleVeteranAmmo() {
  const state = getState();
  if (state.lastVeteranAmmoDay >= state.day) {
    setStory("Hôm nay đã xin đạn của Lão Triệu rồi, mai hãy quay lại.");
    handleVeteranInteract();
    return;
  }
  advanceTime(1);
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_GIVE_RATE) {
    const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
    const count = Math.floor(Math.random() * (GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MAX - GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MIN + 1)) + GAME_CONSTANTS.MAP_EVENTS.VETERAN_AMMO_MIN;
    const added = addItem({ id: ammo.id, name: ammo.name, type: "ammo", count });
    if (added) {
      setStory(`Lão Triệu đánh giá bạn một lượt, ánh mắt lộ ra chút quen thuộc. "Tiểu tử, cầm lấy! Ngày xưa ta trong quân đội... thôi, không nói nữa." Ông ta ném cho bạn ${count} viên ${ammo.name}.`);
    } else {
      setStory("Lão Triệu đánh giá bạn một lượt, định cho bạn ít đạn nhưng túi của bạn đã đầy.");
    }
  } else {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE);
    setStory(`Lão Triệu đột nhiên đổi sắc, giơ súng chĩa vào bạn: "Ngươi là gian tế bọn chúng phái đến! Cút!" Ông ta bóp cò, bạn bị bắn trúng, HP -${GAME_CONSTANTS.MAP_EVENTS.VETERAN_MISFIRE_DAMAGE}.`);
  }
  state.lastVeteranAmmoDay = state.day;
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleVeteranInteract();
  }
}

// ========== Nhiệm vụ Lão Mã: tiêu diệt Lão Triệu ==========

export function handleKillZhao() {
  const state = getState();
  if (state.zhaoKilled) {
    setStory("Lão Triệu đã chết, trạm kiểm soát chỉ còn tiếng gió rít qua hàng rào kẽm gai.");
    showExploreOptionsState();
    return;
  }
  if (state.oldMaStep < 5) {
    handleVeteranInteract();
    return;
  }
  const zhao = NAMED_NPCS.zhao_boss;
  state._pendingNpc = {
    name: zhao.name,
    hp: zhao.hp,
    damage: Math.floor(Math.random() * (zhao.damageMax - zhao.damageMin + 1)) + zhao.damageMin,
    hasRanged: zhao.hasRanged,
    dodgeRate: zhao.dodgeRate,
  };
  state._pendingNpcCallback = "kill_zhao_result";
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "Không";
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ kiệt sức, không thể chiến đấu bình thường!" : "";
  setStory(`Bạn nắm chặt vũ khí, bước về phía Lão Triệu. Lão Triệu cảnh giác quay người, súng trường lập tức giơ lên——"Lại là ngươi?! Đứng yên! Đừng động!"\n\nÁnh mắt điên loạn của hắn nói cho bạn biết không còn đường lui.\n\n⚔️ ${zhao.name}\n❤️ HP:${zhao.hp} | ⚡ Sát thương:${zhao.damageMin}-${zhao.damageMax}\n\n[Cận chiến] ${meleeName}\n[Tầm xa] ${rangedName}${crashWarning}`);
  const opts = [
    { text: "Cận chiến", action: "combat_npc_melee" }
  ];
  if (state.rangedWeapon && state.ammo.some(a => a.id === state.rangedWeapon.ammoType && a.count > 0)) {
    opts.push({ text: "Tầm xa", action: "combat_npc_ranged" });
  } else {
    opts.push({ text: "Tầm xa (không khả dụng: không có đạn)", action: "combat_npc_ranged", disabled: true });
  }
  opts.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
  setOptions(opts);
}