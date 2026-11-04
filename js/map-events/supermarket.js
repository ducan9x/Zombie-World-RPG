import {
  getState,
  setPhase,
  setStory,
  setOptions,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  resetCrashTurns,
} from '../state.js';

import {
  MAP_NPC_INTROS,
  NAMED_NPCS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleMaskedManInteract() {
  const state = getState();
  if (state.shadowDefeated) {
    setStory("Bóng đen đó đã không còn nữa, góc siêu thị trống trơn.");
    showExploreOptionsState();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.shadow_intro);
  setOptions([
    { text: "Đối kháng", action: "masked_man_fight" },
    { text: "Rời khỏi", action: "masked_man_leave" },
  ]);
}

export function handleMaskedManFight() {
  const state = getState();
  const shadow = NAMED_NPCS.shadow;
  state._pendingNpc = {
    name: shadow.name,
    hp: shadow.hp,
    damage: Math.floor(Math.random() * (shadow.damageMax - shadow.damageMin + 1)) + shadow.damageMin,
    hasRanged: shadow.hasRanged,
    dodgeRate: shadow.dodgeRate,
  };
  setPhase("pre_combat_npc");
  setStory(MAP_NPC_INTROS.shadow_fight);
  setOptions([
    { text: "Tấn công cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleMaskedManLeave() {
  setStory(MAP_NPC_INTROS.shadow_leave);
  showExploreOptionsState();
}

export function handleSupermarketContraband() {
  const state = getState();
  if (state.oldMaContrabandUsed) {
    setStory("Bạn lại mở ngăn tối đó, bên trong trống rỗng. Năng lượng quỷ dị đó đã tiêu tan, không còn gì để lại.");
    showExploreOptionsState();
    return;
  }
  setStory("Ở sâu nhất siêu thị, sau một dãy kệ hàng, bạn phát hiện một ngăn tối cực kỳ kín đáo. Bên trong có thứ gì đó phát ra ánh sáng xanh lục——không giống thứ của thế giới này.\n\nBạn do dự một lát, cuối cùng vẫn nhấn nút khởi động. Một luồng năng lượng lạnh lẽo tức thì tràn vào cơ thể, rìa tầm nhìn bắt đầu méo mó, trong đầu lóe lên vô số hình ảnh vỡ vụn——trăng máu, thành phố đảo ngược, vô số khuôn mặt la hét không tiếng động……\n\nKhông biết bao lâu sau, bạn mới đứng dậy từ mặt đất. Cơ thể chưa bao giờ mạnh mẽ như vậy, nhưng trong lòng như bị khoét mất một mảnh thứ gì đó.");
  state.sanity = Math.max(0, state.sanity - 50);
  state.crash = 0;
  resetCrashTurns();
  state.oldMaContrabandUsed = true;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
