import {
  getState,
  setPhase,
  setStory,
  setOptions,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  isQuestDone,
} from '../state.js';

import {
  NAMED_NPCS,
} from '../config.js';

import { showLeaderOptions } from './leader.js';

export function handleLeaderAssassinate() {
  const state = getState();
  if (!state.kingQuestsDone || !state.kingQuestsDone.king_4) {
    setStory("Bạn nhìn bóng lưng thủ lĩnh, trong lòng do dự rất lâu, cuối cùng vẫn bỏ đi ý nghĩ đó.\n\nBạn không có lý do để làm vậy.");
    showLeaderOptions();
    return;
  }
  if (!isQuestDone("leaderQuest3")) {
    setStory("Bạn nhìn bóng lưng thủ lĩnh, trong lòng nhớ lại mệnh lệnh của quốc vương……\n\nNhưng bạn đột nhiên nhận ra, thủ lĩnh vẫn còn cất giấu nhiều bí mật. Ám sát hắn sẽ không thể hoàn thành chuỗi nhiệm vụ của thủ lĩnh trận địa.\n\nXác nhận tiếp tục?");
    setPhase("leader_assassinate_warn");
    setOptions([
      { text: "Tiếp tục ám sát", action: "assassinate_confirm" },
      { text: "Bỏ kế hoạch", action: "assassinate_flee" },
    ]);
    return;
  }
  setStory("Bạn siết chặt vũ khí, trong lòng nhớ lại mệnh lệnh của quốc vương: \"Trừ khử thủ lĩnh trận địa Dawn.\"\n\nThủ lĩnh trước mắt đang quay lưng về phía bạn sắp xếp vật tư, không chút phòng bị. Bạn hít sâu một hơi——đây là cơ hội ngàn năm có một.\n\nNhưng bạn cũng biết, vị thủ lĩnh này có thể dẫn dắt trận địa tồn tại đến ngày nay trong ngày tận thế, tuyệt không phải hạng người tầm thường. Thực lực của hắn sánh ngang với Vua Xác Sống.\n\nBạn quyết định……");
  setPhase("leader_assassinate");
  setOptions([
    { text: "Ám sát cận chiến", action: "assassinate_melee" },
    { text: "Bắn tỉa từ xa", action: "assassinate_ranged" },
    { text: "Bỏ kế hoạch", action: "assassinate_flee" },
  ]);
}

function startAssassinationCombat(mode) {
  const state = getState();

  const leaderDef = NAMED_NPCS.leader;
  state._pendingNpc = {
    name: leaderDef.name,
    hp: leaderDef.hp,
    maxHp: leaderDef.hp,
    damage: leaderDef.damage,
    hasRanged: leaderDef.hasRanged,
    dodgeRate: leaderDef.dodgeRate,
    isAssassination: true,
  };

  setPhase("pre_combat_npc");
  if (mode === "melee") {
    setStory("Bạn rút vũ khí cận chiến, lặng lẽ tiến lại gần thủ lĩnh. Tuy nhiên ngay khoảnh khắc bạn giơ vũ khí lên, thủ lĩnh đột ngột quay người!\n\n\"Ta đã sớm cảm nhận được sát khí của ngươi.\" Thủ lĩnh lạnh lùng nhìn bạn, tiện tay vớ lấy một thanh gậy sắt. \"Đến đi, để ta xem ngươi có bản lĩnh gì!\"");
    setOptions([
      { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
      { text: "Bắn từ xa", action: "combat_npc_ranged" },
      { text: "Chạy trốn (100%)", action: "assassinate_flee_combat" },
    ]);
  } else {
    setStory("Bạn giữ khoảng cách, giơ vũ khí tầm xa nhắm vào lưng thủ lĩnh. Nhưng ngay khoảnh khắc bóp cò, thủ lĩnh như có linh cảm đột nhiên nghiêng người!\n\n\"Ám tiễn thương người?\" Thủ lĩnh gầm lên, lao về phía bạn!");
    setOptions([
      { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
      { text: "Bắn từ xa", action: "combat_npc_ranged" },
      { text: "Chạy trốn (100%)", action: "assassinate_flee_combat" },
    ]);
  }
}

function handleAssassinateFlee() {
  const state = getState();
  setStory("Bạn hít sâu một hơi, cất vũ khí đi. Ám sát thủ lĩnh trận địa……ý nghĩ này quá điên rồ.\n\nBạn từ bỏ kế hoạch ám sát, thủ lĩnh có chút nghi hoặc nhìn về phía bạn rời đi.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleAssassinateFleeCombat() {
  const state = getState();
  setStory("Bạn nhận ra mình không phải đối thủ của thủ lĩnh, nhân lúc hắn không chú ý quay đầu bỏ chạy. Bạn may mắn thoát thân.\n\nBạn từ bỏ kế hoạch ám sát, thủ lĩnh có chút nghi hoặc nhìn về phía bạn rời đi.");
  state._pendingNpc = null;
  state._combatNpcDefeated = false;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function checkLeaderAssassinationVictory() {
  const state = getState();
  if (state._combatNpcDefeated && state._pendingNpc && state._pendingNpc.isAssassination) {
    state.leaderAlive = false;
    state._combatNpcDefeated = false;
    setStory("Bạn thở hổn hển đứng bên cạnh thủ lĩnh đã ngã xuống. Máu nhỏ giọt từ vũ khí của bạn.\n\nThủ lĩnh dùng hơi thở cuối cùng nhìn bạn: \"Ngươi……tại sao phải làm vậy……\"\n\nĐôi mắt hắn mất đi ánh sáng. Thủ lĩnh trận địa Dawn——vị lãnh tụ từng dẫn dắt vô số người chống lại ngày tận thế——chết dưới tay bạn.\n\nNhiệm vụ quốc vương giao đã hoàn thành, nhưng đôi tay bạn đã nhuốm máu.");
    state._pendingNpc = null;
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showLeaderOptions();
    return true;
  }
  return false;
}

export function handleOutpostAssassinateAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "assassinate_melee") { startAssassinationCombat("melee"); return; }
  if (action === "assassinate_ranged") { startAssassinationCombat("ranged"); return; }
  if (action === "assassinate_flee") { handleAssassinateFlee(); return; }
  if (action === "assassinate_confirm") {
    const state = getState();
    setStory("Bạn siết chặt vũ khí, trong lòng nhớ lại mệnh lệnh của quốc vương: \"Trừ khử thủ lĩnh trận địa Dawn.\"\n\nThủ lĩnh trước mắt đang quay lưng về phía bạn sắp xếp vật tư, không chút phòng bị. Bạn hít sâu một hơi——đây là cơ hội ngàn năm có một.\n\nNhưng bạn cũng biết, vị thủ lĩnh này có thể dẫn dắt trận địa tồn tại đến ngày nay trong ngày tận thế, tuyệt không phải hạng người tầm thường. Thực lực của hắn sánh ngang với Vua Xác Sống.\n\nBạn quyết định……");
    setPhase("leader_assassinate");
    setOptions([
      { text: "Ám sát cận chiến", action: "assassinate_melee" },
      { text: "Bắn tỉa từ xa", action: "assassinate_ranged" },
      { text: "Bỏ kế hoạch", action: "assassinate_flee" },
    ]);
    return;
  }
}