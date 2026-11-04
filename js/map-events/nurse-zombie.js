import {
  getState,
  setPhase,
  setStory,
  setOptions,
  advanceTime,
  updateStatusEffects,
  getItemDisplayName,
} from '../state.js';

import {
  NURSE_ZOMBIE_INTRO,
  CANNED_FOOD_IDS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
  showHomeOptions,
} from '../routing.js';

export function handleNurseZombieInteract() {
  const state = getState();
  if (state.nurseZombieRescued) {
    setStory("Ở đây đã không còn gì nữa, Rutile đã đi với bạn về nhà rồi.");
    showExploreOptionsState();
    return;
  }
  setPhase("explore");
  const affinity = state.npcAffinity.nurseZombie || 0;
  const affinityText = `[Tình cảm: ${affinity}/${GAME_CONSTANTS.NURSE_ZOMBIE.MAX_AFFINITY}]`;
  const intro = NURSE_ZOMBIE_INTRO;
  const feedResult = state._lastFeedResult;
  delete state._lastFeedResult;
  setStory((feedResult ? feedResult + "\n\n" : "") + `${intro}\n\n${affinityText}`);
  const opts = [
    { text: "Đưa ăn", action: "nurse_zombie_feed" },
  ];
  if (affinity >= GAME_CONSTANTS.NURSE_ZOMBIE.BRING_HOME_AFFINITY) {
    opts.push({ text: "Mang về nhà", action: "nurse_zombie_bring_home" });
  }
  opts.push({ text: "Rời khỏi", action: "nurse_zombie_leave" });
  setOptions(opts);
}

export function handleNurseZombieFeedSelect() {
  const state = getState();
  if (state.food.length === 0) {
    setStory("Bạn không có thức ăn nào để cho cô ấy ăn.");
    handleNurseZombieInteract();
    return;
  }
  setPhase("nurse_feed");
  const foodList = state.food.map((f, i) =>
    `${i + 1}. ${getItemDisplayName(f)}`
  ).join("\n");
  setStory(`Vui lòng chọn một loại thức ăn để cho cô ấy ăn: \n\n${foodList}`);
  const opts = state.food.map((f, i) => ({
    text: getItemDisplayName(f),
    action: "nurse_feed_confirm",
    index: i,
  }));
  opts.push({ text: "Quay lại", action: "nurse_zombie_leave" });
  setOptions(opts);
}

export function handleNurseZombieFeedConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  const option = state.options[optionIndex];
  if (!option || option.action === "nurse_zombie_leave") {
    handleNurseZombieInteract();
    return;
  }
  const foodItem = state.food[option.index];
  const isCanned = CANNED_FOOD_IDS.includes(foodItem.id);
  if ((foodItem.count || 1) > 1) {
    foodItem.count = (foodItem.count || 1) - 1;
  } else {
    state.food.splice(option.index, 1);
  }
  if (isCanned) {
    const gain = Math.floor(Math.random() * (GAME_CONSTANTS.NURSE_ZOMBIE.CANNED_AFFINITY_MAX - GAME_CONSTANTS.NURSE_ZOMBIE.CANNED_AFFINITY_MIN + 1)) + GAME_CONSTANTS.NURSE_ZOMBIE.CANNED_AFFINITY_MIN;
    state.npcAffinity.nurseZombie = Math.min(GAME_CONSTANTS.NURSE_ZOMBIE.MAX_AFFINITY, (state.npcAffinity.nurseZombie || 0) + gain);
    state._lastFeedResult = `Cô ấy dường như rất thích ăn thực phẩm đóng hộp!Tình cảm +${gain}.[Tình cảm: ${state.npcAffinity.nurseZombie}/${GAME_CONSTANTS.NURSE_ZOMBIE.MAX_AFFINITY}]`;
  } else {
    state._lastFeedResult = `Cô ấy dường như không thích ăn cái này…… có lẽ nên thử thực phẩm đóng hộp?[Tình cảm: ${state.npcAffinity.nurseZombie || 0}/${GAME_CONSTANTS.NURSE_ZOMBIE.MAX_AFFINITY}]`;
  }
  handleNurseZombieInteract();
}

export function handleNurseZombieBringHome() {
  const state = getState();
  state.nurseZombieRescued = true;
  if (!state.unlockedAchievements) state.unlockedAchievements = [];
  if (!state.unlockedAchievements.includes("companion_recruit")) state.unlockedAchievements.push("companion_recruit");
  setStory("Rutile đi theo bạn về lều lưu sinh, cô ấy hiện là đồng minh trung thành của bạn.");
  advanceTime(1);
  updateStatusEffects();
  showHomeOptions();
}

export function handleNurseZombieLeave() {
  setStory("Bạn quyết định không mang Rutile theo, rời đi một mình.");
  showExploreOptionsState();
}
