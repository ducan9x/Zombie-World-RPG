import {
  getState,
  setStory,
  addItem,
  addCigarettes,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  AMMO,
  GAME_CONSTANTS,
  SEEDS,
  CROP_FOOD_MAP,
  randInt,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleExploreCave() {
  const state = getState();
  if (state.lastCaveDay >= state.day) {
    setStory("Hôm nay đã khám phá hang động rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastCaveDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.CAVE_CIG_RATE) {
    addCigarettes(1);
    setStory(`Bạn phát hiện một gói thuốc lá ở sâu trong hang động!`);
  } else {
    const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
    addItem({ id: ammo.id, name: ammo.name, type: "ammo", count: 1 });
    setStory(`Bạn nhặt được một viên đạn ${ammo.name} ở góc hang động.`);
  }
  advanceTime(3);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    const maps = state.stats?.mapsExplored || [];
    if (!state.unlockedAchievements) state.unlockedAchievements = [];
    for (const entry of GAME_CONSTANTS.ACHIEVEMENTS.EXPLORATION_MAPS) {
      if (maps.length >= entry.threshold && !state.unlockedAchievements.includes(entry.id)) state.unlockedAchievements.push(entry.id);
    }
    showExploreOptionsState();
  }
}

export function handleMoldySeeds() {
  const state = getState();
  const hasBadge = state.other.some(i => i.id === "farming_master_badge");
  if (!hasBadge) {
    setStory("Bạn nhìn những hạt giống mốc này, chúng đã hoàn toàn vô dụng, bạn bỏ chúng đi. (Cần huy hiệu bậc thầy nông nghiệp của Mục Miêu Miêu)");
    showExploreOptionsState();
    return;
  }
  if (state.lastMoldySeedsDay >= state.day) {
    setStory("Hôm nay đã xử lý những hạt giống mốc này rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastMoldySeedsDay = state.day;
  const seedCount = randInt(1, 3);
  const addedSeeds = [];
  for (let i = 0; i < seedCount; i++) {
    const seed = SEEDS[Math.floor(Math.random() * SEEDS.length)];
    const added = addItem({ ...seed });
    if (added) {
      addedSeeds.push(seed.name);
    }
  }
  let msg = "Những ngày làm việc trên ruộng thí nghiệm, học theo Miêu Miêu, đã giúp bạn nắm được khả năng tái sử dụng hạt giống hỏng.";
  if (addedSeeds.length > 0) {
    msg += `\n\nBạn nhận được: ${addedSeeds.join(", ")}`;
  } else {
    msg += "\n\nNhưng balo của bạn đã đầy, hạt giống không cho vào được.";
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  setStory(msg);
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handleAbandonedField() {
  const state = getState();
  const hasBadge = state.other.some(i => i.id === "farming_master_badge");
  if (!hasBadge) {
    setStory("Bạn nhìn mảnh ruộng rau bỏ hoang, dường như không làm gì được, bạn hoàn toàn không biết cách. (Cần huy hiệu bậc thầy nông nghiệp của Mục Miêu Miêu)");
    showExploreOptionsState();
    return;
  }
  if (state.lastAbandonedFieldDay >= state.day) {
    setStory("Hôm nay đã chăm sóc mảnh ruộng rau này rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastAbandonedFieldDay = state.day;
  const jiucai = CROP_FOOD_MAP["jiucai"];
  let added = 0;
  for (let i = 0; i < 2; i++) {
    if (addItem({ ...jiucai })) added++;
  }
  let msg = "Bạn dọn cỏ dại và tưới nước sông đơn giản cho chúng, theo cách Mục Miêu Miêu dạy, bạn thu hoạch được 2 cây hẹ.";
  if (added < 2) {
    msg += "\n\n[Lưu ý] Một phần hẹ không cho vào được do balo đã đầy.";
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  setStory(msg);
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
