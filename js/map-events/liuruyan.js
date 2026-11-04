import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  removeGasoline,
} from '../state.js';

import {
  GAME_CONSTANTS,
  MAP_NPC_INTROS,
  NAMED_NPCS,
  MEDICINES,
  DEFAULT_ITEM_IDS,
  getRandomZombie,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';
import { handleGoHome } from '../game/index.js';

export function handleInfectedWoman() {
  const state = getState();
  if (state.liuruyanRescued) {
    setStory(MAP_NPC_INTROS.liuruyan_intro);
    showExploreOptionsState();
    return;
  }
  state.liuruyanDiscovered = true;
  if (state.day <= GAME_CONSTANTS.LIURUYAN.RESCUE_DEADLINE_DAYS) {
    const remaining = GAME_CONSTANTS.LIURUYAN.RESCUE_DEADLINE_DAYS - state.day;
    setPhase("explore");
    setStory(`${MAP_NPC_INTROS.infected_woman_intro}\n\nĐếm ngược sinh mệnh: còn ${remaining} ngày`);
    setOptions([
      { text: `Tiêm cho cô ấy thuốc kháng nhiễm×${GAME_CONSTANTS.LIURUYAN.SERUM_COST}`, action: "inject_woman" },
      { text: "Mặc kệ cô ấy đi.", action: "ignore_woman" },
    ]);
  } else {
    setPhase("explore");
    setStory(MAP_NPC_INTROS.infected_woman_zombie);
    setOptions([
      { text: "Tiêu diệt cô ấy（cô ấy đã biến thành zombie）", action: "kill_zombie_woman" },
    ]);
  }
}

export function handleInjectWoman() {
  const state = getState();
  const serumCount = state.medicine.filter(m => m.id === DEFAULT_ITEM_IDS.serum).reduce((sum, m) => sum + (m.count || 1), 0);
  if (serumCount < GAME_CONSTANTS.LIURUYAN.SERUM_COST) {
    setStory(`Thuốc ${MEDICINES.find(m => m.id === DEFAULT_ITEM_IDS.serum).name} của bạn không đủ, cần ${GAME_CONSTANTS.LIURUYAN.SERUM_COST} ống.`);
    handleInfectedWoman();
    return;
  }
  let serumRemaining = GAME_CONSTANTS.LIURUYAN.SERUM_COST;
  for (let i = state.medicine.length - 1; i >= 0 && serumRemaining > 0; i--) {
    if (state.medicine[i].id === DEFAULT_ITEM_IDS.serum) {
      const available = state.medicine[i].count || 1;
      if (available <= serumRemaining) {
        state.medicine.splice(i, 1);
        serumRemaining -= available;
      } else {
        state.medicine[i].count = available - serumRemaining;
        serumRemaining = 0;
      }
    }
  }
  state.liuruyanRescued = true;
  if (!state.unlockedAchievements) state.unlockedAchievements = [];
  if (!state.unlockedAchievements.includes("companion_recruit")) state.unlockedAchievements.push("companion_recruit");
  handleGoHome();
  const serumName = MEDICINES.find(m => m.id === DEFAULT_ITEM_IDS.serum).name;
  setStory(`Bạn run rẩy hai tay, lần lượt tiêm ${GAME_CONSTANTS.LIURUYAN.SERUM_COST} ống ${serumName} vào cơ thể cô ấy. Hiệu quả của huyết thanh gần như tức thì——cô ấy ho dữ dội vài tiếng, những chỗ lở loét trên da bắt đầu lành lại với tốc độ mắt thường có thể thấy.\n\nCô ấy chậm rãi mở mắt, đó là một đôi mắt nâu, trong trẻo mà mờ mịt.\n\n" Tôi……tôi đang ở đâu?" Cô ấy yếu ớt hỏi.\n\nBạn giải thích tình hình cho cô. Cô im lặng rất lâu, nước mắt lặng lẽ trượt xuống.\n\n" Cảm……cảm ơn. Tôi tên Liu Ru Yan." Giọng cô rất khẽ, như dùng hết sức lực toàn thân. "Nếu bạn không chê……tôi muốn đi theo bạn. Tuy tôi có thể không giúp được gì nhiều, nhưng tôi có thể giúp bạn thu thập một ít vật tư……"\n\nBạn gật đầu.\n\nCứ như vậy, Liu Ru Yan trở thành đồng bạn của bạn. Từ nay về sau, mỗi ngày cô ấy sẽ ra ngoài thu thập một ít vật tư cho bạn.\n\nBạn đưa Liu Ru Yan an toàn trở về lều của người sống sót.`);
}

export function handleIgnoreWoman() {
  setStory(MAP_NPC_INTROS.infected_woman_ignore);
  showExploreOptionsState();
}

export function handleKillZombieWoman() {
  const state = getState();
  const zombieDef = getRandomZombie(state.currentMap);
  setPhase("pre_combat");
  state._pendingZombie = zombieDef;
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Khuyến nghị nghỉ ngơi trước rồi hãy khám phá." : "";
  setStory(`Người phụ nữ từng đó đã hoàn toàn biến thành zombie, cô ấy gầm lên lao về phía bạn!${crashWarning}`);
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_melee" },
    { text: "Bắn tầm xa", action: "combat_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_flee" },
  ]);
}

export function handleLiuruyanClassroom() {
  const state = getState();
  if (!state.liuruyanRescued) {
    setStory(MAP_NPC_INTROS.liuruyan_classroom_none);
    showExploreOptionsState();
    return;
  }
  if (state.liuruyanQuest4Done) {
    setStory(MAP_NPC_INTROS.liuruyan_quest4_enough);
    setPhase("explore");
    setOptions([
      { text: "Lên xe rời đi", action: "liuruyan_quest_accept" },
      { text: "Chuẩn bị thêm chút nữa", action: "liuruyan_reject" },
    ]);
    return;
  }
  if (!state.liuruyanQuest1Done) {
    setStory(MAP_NPC_INTROS.liuruyan_classroom_intro);
    setPhase("explore");
    setOptions([
      { text: "Ghế đó", action: "liuruyan_seat" },
      { text: "Rời đi", action: "liuruyan_reject" },
    ]);
    return;
  }
  if (!state.liuruyanQuest2Done) {
    setStory(MAP_NPC_INTROS.liuruyan_quest2_intro);
    setPhase("explore");
    setOptions([
      { text: "Đến sân vận động", action: "liuruyan_quest_fight" },
      { text: "Chưa chuẩn bị xong", action: "liuruyan_reject" },
    ]);
    return;
  }
  if (!state.liuruyanQuest3Done) {
    setStory(MAP_NPC_INTROS.liuruyan_quest3_intro);
    setPhase("explore");
    setOptions([
      { text: "Dùng xà beng mở cửa", action: "liuruyan_quest_accept" },
      { text: "Thôi vậy", action: "liuruyan_reject" },
    ]);
    return;
  }
  if (!state.liuruyanQuest4Done) {
    if (state.gasoline >= 10) {
      state.liuruyanQuest4Done = true;
      removeGasoline(10);
      triggerEnding("ending_elopement");
      return;
    }
    const need = 10 - state.gasoline;
    setStory(MAP_NPC_INTROS.liuruyan_quest4_intro + "\n\n" + MAP_NPC_INTROS.liuruyan_quest4_need_gas.replace("{need}", need));
    setPhase("explore");
    setOptions([
      { text: "Đi kiếm xăng", action: "liuruyan_reject" },
    ]);
    return;
  }
}

export function handleLiuruyanSeat() {
  setStory(MAP_NPC_INTROS.liuruyan_classroom_seat);
  setPhase("explore");
  setOptions([
    { text: "Cùng đi phòng y tế", action: "liuruyan_quest_accept" },
    { text: "Lần sau nói", action: "liuruyan_reject" },
  ]);
}

export function handleLiuruyanReject() {
  showExploreOptionsState();
}

export function handleLiuruyanQuestAccept() {
  setPhase("explore");
  const state = getState();
  if (!state.liuruyanQuest1Done) {
    addItem({ id: "万能针剂", name: "Thuốc Tiêm Đa Năng", type: "medicine" });
    state.liuruyanQuest1Done = true;
    setStory(MAP_NPC_INTROS.liuruyan_quest1_accept);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      setOptions([
        { text: "Rời khỏi lớp học", action: "liuruyan_reject" },
      ]);
    }
    return;
  }
  if (state.liuruyanQuest2Done && !state.liuruyanQuest3Done) {
    const stateRef = getState();
    const hasCrowbar = stateRef.meleeWeapon?.id === "撬棍";
    if (!hasCrowbar) {
      setStory(MAP_NPC_INTROS.liuruyan_quest3_need_crowbar);
      setOptions([
        { text: "Rời đi", action: "liuruyan_reject" },
      ]);
      return;
    }
    addItem({ id: "car_key", name: "Chìa khóa xe", type: "other" });
    state.liuruyanQuest3Done = true;
    setStory(MAP_NPC_INTROS.liuruyan_quest3_success);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      setOptions([
        { text: "Rời đi", action: "liuruyan_reject" },
      ]);
    }
    return;
  }
}

export function handleLiuruyanQuestReject() {
  showExploreOptionsState();
}

export function handleLiuruyanQuestFight() {
  const state = getState();
  state._pendingNpc = {
    name: NAMED_NPCS.football_zombie.name,
    hp: NAMED_NPCS.football_zombie.hp,
    damage: Math.floor(Math.random() * (NAMED_NPCS.football_zombie.damageMax - NAMED_NPCS.football_zombie.damageMin + 1)) + NAMED_NPCS.football_zombie.damageMin,
    hasRanged: NAMED_NPCS.football_zombie.hasRanged,
    dodgeRate: NAMED_NPCS.football_zombie.dodgeRate,
  };
  state._liuruyanQuest2Combat = true;
  setPhase("pre_combat_npc");
  setStory("Một con zombie bóng bầu dục to lớn đang lang thang trên sân vận động, nó mặc bộ đồng phục đã rách nát, dưới mũ bảo hiểm lộ ra khuôn mặt thối rữa. Nó dường như đã chú ý đến các bạn!");
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}
