import {
  getState, setPhase, setStory, setOptions,
  addItem, addRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
  addNpcAffinity, getNpcAffinity, getAffinityLabel, getAffinityStage,
  canChatToday, incrementChatCount, formatQualityText,
  removeItemById,
} from '../state.js';

import { GAME_CONSTANTS, AFFINITY_MAX } from '../config.js';

import { GUYUE_DIALOGUES } from '../data/dialogues/map-dialogues.js';
import { FISH_RECYCLE_PRICES } from '../data/items/seafood-meals.js';
import { FISH, FISH_RARITY_WEIGHTS } from '../data/items/fish.js';

import { refreshIslandMenu } from './index.js';

const RARITY_LABELS = { common: "Thường", uncommon: "Ưu tú", rare: "Hiếm", epic: "Sử thi", legendary: "Huyền thoại" };

function randomDialogue(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function handleNpcGuyue() {
  const state = getState();
  const affinity = getNpcAffinity("guyue");
  const friendshipLabel = getAffinityLabel(affinity);
  const dialogue = randomDialogue(GUYUE_DIALOGUES);

  let desc = `[Đảo dân Cố Nguyệt]\nMột đảo dân tràn đầy kính ngưỡng đối với đức vua, trong mắt luôn lóe lên cuồng nhiệt đối với vương quyền.`;
  desc += `\n\nHảo cảm hiện tại: ${affinity}/${AFFINITY_MAX.guyue}(${friendshipLabel})`;
  desc += `\n\n${dialogue}`;

  setPhase("island_guyue");
  setStory(desc);
  setOptions([
    { text: "Trò chuyện", action: "guyue_chat" },
    { text: "Thu hồi cá biển", action: "guyue_recycle" },
    { text: "Rời đi", action: "guyue_leave" },
  ]);
}

export function handleGuyueAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "guyue_chat":
      handleGuyueChat();
      break;
    case "guyue_recycle":
      handleGuyueRecycle();
      break;
    case "guyue_recycle_select":
      handleGuyueRecycleSelect();
      break;
    case "guyue_recycle_one":
      handleGuyueRecycleOne(input);
      break;
    case "guyue_recycle_all":
      handleGuyueRecycleAll();
      break;
    case "guyue_recycle_one_continue":
      handleGuyueRecycleSelect();
      break;
    case "guyue_recycle_all_continue":
      showGuyueRecycleMenu();
      break;
    case "guyue_recycle_back":
      handleNpcGuyue();
      break;
    case "guyue_leave":
      refreshIslandMenu();
      break;
    default:
      handleNpcGuyue();
      break;
  }
}

export function handleGuyueChat() {
  const state = getState();
  if (!canChatToday("guyue")) {
    setStory("Cố Nguyệt xua tay: 'Hôm nay đã nói chuyện nhiều rồi, ngày khác hãy trò chuyện tiếp nhé.'");
    handleNpcGuyue();
    return;
  }
  incrementChatCount("guyue");
  addNpcAffinity("guyue", 1);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleNpcGuyue();
}

export function handleGuyueRecycle() {
  const state = getState();
  const fishCount = state.food.filter(i => i.type === "fish").length;
  if (fishCount === 0) {
    setStory("Bạn không có cá biển nào để thu hồi.");
    handleNpcGuyue();
    return;
  }
  showGuyueRecycleMenu();
}

export function handleGuyueRecycleSelect() {
  const state = getState();
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishes.length === 0) {
    setStory("Bạn không có cá biển nào để thu hồi.");
    showGuyueRecycleMenu();
    return;
  }
  const opts = fishes.map((f, i) => {
    const rarity = f.rarity || "common";
    const price = FISH_RECYCLE_PRICES[rarity] || 1;
    const label = RARITY_LABELS[rarity] || "Thường";
    return { text: `${formatQualityText(f.name, rarity)}[${label}]→ ${price} xu hoàng gia`, action: "guyue_recycle_one", index: i };
  });
  opts.push({ text: "Quay lại", action: "guyue_recycle_back" });
  setPhase("island_guyue");
  setStory("Chọn cá biển muốn thu hồi:");
  setOptions(opts);
}

export function handleGuyueRecycleOne(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "guyue_recycle_one") return;

  const fishIdx = option.index;
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishIdx < 0 || fishIdx >= fishes.length) {
    setStory("Không tìm thấy cá biển đó.");
    showGuyueRecycleMenu();
    return;
  }

  const fish = fishes[fishIdx];
  const rarity = fish.rarity || "common";
  const price = FISH_RECYCLE_PRICES[rarity] || 1;
  const label = RARITY_LABELS[rarity] || "Thường";

  const realIdx = state.food.indexOf(fish);
  if (realIdx !== -1) {
    state.food.splice(realIdx, 1);
  }

  addRoyalCoins(price);
  setStory(`Bạn đã thu hồi ${formatQualityText(fish.name, rarity)}[${label}], nhận ${price} xu hoàng gia.\n\nXu hoàng gia hiện tại: ${getState().royalCoins}`);
  setPhase("island_guyue");
  setOptions([{ text: "Tiếp tục", action: "guyue_recycle_one_continue" }]);
}

export function handleGuyueRecycleAll() {
  const state = getState();
  const fishes = state.food.filter(i => i.type === "fish");
  if (fishes.length === 0) {
    setStory("Bạn không có cá biển nào để thu hồi.");
    showGuyueRecycleMenu();
    return;
  }

  let totalCoins = 0;
  const summary = [];

  for (const fish of fishes) {
    const rarity = fish.rarity || "common";
    const price = FISH_RECYCLE_PRICES[rarity] || 1;
    const label = RARITY_LABELS[rarity] || "Thường";
    totalCoins += price;
    summary.push(`${formatQualityText(fish.name, rarity)}[${label}]→ ${price} xu hoàng gia`);
  }

  state.food = state.food.filter(i => i.type !== "fish");
  addRoyalCoins(totalCoins);

  setStory(`Bạn đã thu hồi tất cả cá biển, tổng ${fishes.length} con: \n${summary.join("\n")}\n\nTổng nhận ${totalCoins} xu hoàng gia.\nXu hoàng gia hiện tại: ${getState().royalCoins}`);
  setPhase("island_guyue");
  setOptions([{ text: "Tiếp tục", action: "guyue_recycle_all_continue" }]);
}

function showGuyueRecycleMenu() {
  const state = getState();
  const fishCount = state.food.filter(i => i.type === "fish").length;
  setPhase("island_guyue");
  setStory(fishCount > 0 ? `Bạn có ${fishCount} con cá biển có thể thu hồi.` : "Bạn không có cá biển nào để thu hồi.");
  setOptions([
    { text: "Chọn cá biển", action: "guyue_recycle_select", disabled: fishCount === 0 },
    { text: "Thu hồi tất cả", action: "guyue_recycle_all", disabled: fishCount === 0 },
    { text: "Rời đi", action: "guyue_recycle_back" },
  ]);
}