import {
  getState, setPhase, setStory, setOptions,
  addItem, advanceTime, updateStatusEffects, checkDeath, isQuestDone, formatQualityText,
} from '../state.js';

import { GAME_CONSTANTS } from '../config.js';

import { FISH, FISH_RARITY_WEIGHTS } from '../data/items/fish.js';

import { refreshIslandMenu } from './index.js';

const RARITY_LABELS = { common: "Thường", uncommon: "Tốt", rare: "Hiếm", epic: "Sử thi", legendary: "Huyền thoại" };

function pickRandomFish() {
  const roll = Math.random() * 1000;
  let rarity;
  let cumulative = 0;
  for (const [r, w] of Object.entries(FISH_RARITY_WEIGHTS)) {
    cumulative += w;
    if (roll < cumulative) { rarity = r; break; }
  }
  const pool = FISH.filter(f => f.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function handleFishingArea() {
  if (!isQuestDone("yumoQuest5")) {
    setStory("Đây là khu câu cá riêng của Công tước Dư Mặc, bạn tạm chưa có cách nào để vào.");
    refreshIslandMenu();
    return;
  }
  setPhase("island_fishing");
  setStory("Bạn đến khu câu cá của hòn đảo, gió biển phất tới, mặt nước lấp lánh ánh sáng.");
  setOptions([
    { text: "Câu cá", action: "island_fish" },
    { text: "Rời đi", action: "island_fishing_leave" },
  ]);
}

export function handleFishAction() {
  const state = getState();
  if (state.fishingCount >= GAME_CONSTANTS.FISHING.DAILY_FISH_LIMIT) {
    setStory("Hôm nay đã câu quá lâu rồi, mai quay lại nhé.");
    setPhase("island_fishing");
    setOptions([
      { text: "Rời đi", action: "island_fishing_leave" },
    ]);
    return;
  }
  advanceTime(1);
  const fish = pickRandomFish();
  const added = addItem({ ...fish });
  state.fishingCount++;
  const rarityLabel = RARITY_LABELS[fish.rarity] || fish.rarity;
  if (added) {
    setStory(`Bạn tung lưỡi câu, kiên nhẫn chờ đợi……\nCâu được một con[${rarityLabel}]${formatQualityText(fish.name, fish.rarity)}!`);
  } else {
    setStory(`Bạn tung lưỡi câu, kiên nhẫn chờ đợi……\nCâu được một con[${rarityLabel}]${formatQualityText(fish.name, fish.rarity)}, nhưng balo đã đầy, không thể mang theo.`);
  }
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_fishing");
    setOptions([
      { text: "Câu cá", action: "island_fish" },
      { text: "Rời đi", action: "island_fishing_leave" },
    ]);
  }
}

export function handleFishingLeave() {
  refreshIslandMenu();
}

export function handleFishingAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "island_fish") {
    handleFishAction();
  } else if (action === "island_fishing_leave") {
    handleFishingLeave();
  }
}
