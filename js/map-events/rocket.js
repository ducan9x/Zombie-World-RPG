import {
  getState,
  setPhase,
  setStory,
  setOptions,
} from '../state.js';

import {
  NAMED_NPCS,
  GIANT_PUPPET_INTRO,
  ROCKET_PREP_STORY,
  ROCKET_LAUNCH_PREP,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';

export function handleLaunchCenter() {
  const state = getState();
  if (!state.giantPuppetDefeated) {
    handleGiantPuppetInteract();
    return;
  }
  if (state.rocketRepaired) {
    handleRocketEndingChoices();
    return;
  }
  setPhase("explore");
  setStory(ROCKET_PREP_STORY);
  const opts = [];
  if (state.doctorQuest1Done && state.doctorQuest2Done && state.doctorQuest3Done) {
    opts.push({ text: "Bảo trì tên lửa", action: "repair_rocket" });
  } else {
    let hint = "Tên lửa cần thêm nhiều chuẩn bị mới có thể phóng:";
    if (!state.doctorQuest1Done) hint += " Thiếu máy phát điện hạt nhân mini";
    if (!state.doctorQuest2Done) hint += " Thiếu Năng Lượng Tinh Khiết";
    if (!state.doctorQuest3Done) hint += " Thiếu vật tư sinh tồn";
    opts.push({ text: "Bảo trì tên lửa (điều kiện chưa đáp ứng)", action: "repair_rocket", disabled: true });
    setStory(ROCKET_PREP_STORY + "\n\n" + hint);
  }
  opts.push({ text: "Rời đi", action: "launch_center_leave" });
  setOptions(opts);
}

export function handleGiantPuppetInteract() {
  const state = getState();
  const gp = NAMED_NPCS.giant_puppet;
  state._pendingNpc = {
    name: gp.name,
    hp: gp.hp,
    damage: gp.damage,
    hasRanged: gp.hasRanged,
    dodgeRate: gp.dodgeRate,
  };
  setPhase("pre_combat_npc");
  setStory(GIANT_PUPPET_INTRO);
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: "Chạy trốn", action: "combat_npc_flee" },
  ]);
}

export function handleLaunchCenterLeave() {
  setStory("Bạn đã rời khỏi trung tâm phóng.");
  showExploreOptionsState();
}

export function handleRepairRocket() {
  const state = getState();
  if (!state.doctorQuest1Done || !state.doctorQuest2Done || !state.doctorQuest3Done) {
    handleLaunchCenter();
    return;
  }
  state.rocketRepaired = true;
  handleRocketEndingChoices();
}

export function handleRocketEndingChoices() {
  const state = getState();
  setPhase("explore");
  setStory(ROCKET_LAUNCH_PREP);
  const opts = [];
  opts.push({ text: "Tự mình lên tên lửa", action: "rocket_ending_space" });
  const allMaxAffinity = state.npcAffinity.v >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED && state.npcAffinity.xiaohan >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED && state.npcAffinity.lili >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED;
  if (allMaxAffinity) {
    opts.push({ text: "Mang theo người quan trọng", action: "rocket_ending_hope" });
  } else {
    const req = GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED;
    opts.push({ text: `Mang theo người quan trọng (Cô V:${state.npcAffinity.v}/${req}  Tiểu Hàm:${state.npcAffinity.xiaohan}/${req}  Lilith:${state.npcAffinity.lili}/${req})`, action: "rocket_ending_hope", disabled: true });
  }
  opts.push({ text: "Tôi không đi, Tiến sĩ cứ đi", action: "rocket_ending_stay" });
  setOptions(opts);
}

export function handleRocketEndingSpace() {
  triggerEnding("ending_space");
}

export function handleRocketEndingHope() {
  const state = getState();
  const allMaxAffinity = state.npcAffinity.v >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED && state.npcAffinity.xiaohan >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED && state.npcAffinity.lili >= GAME_CONSTANTS.ROCKET.HOPE_AFFINITY_REQUIRED;
  if (!allMaxAffinity) {
    handleRocketEndingChoices();
    return;
  }
  triggerEnding("ending_hope");
}

export function handleRocketEndingStay() {
  const state = getState();
  state.doctorLeftInEnding8 = true;
  triggerEnding("ending_stay");
}
