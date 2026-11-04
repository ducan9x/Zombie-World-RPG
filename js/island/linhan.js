import {
  getState, setPhase, setStory, setOptions,
  addItem, advanceTime, updateStatusEffects, checkDeath,
  addNpcAffinity, getNpcAffinity, getAffinityLabel,
  canChatToday, incrementChatCount, formatQualityText,
} from '../state.js';

import { GAME_CONSTANTS, AFFINITY_MAX } from '../config.js';

import { LINHAN_DIALOGUES } from '../data/dialogues/map-dialogues.js';

import { SEAFOOD_MEALS, SEAFOOD_MEAL_RECIPES } from '../data/items/seafood-meals.js';

import { refreshIslandMenu } from './index.js';

const RARITY_LABELS = { common: "Thường", uncommon: "Ưu tú", rare: "Hiếm", epic: "Sử thi", legendary: "Huyền thoại" };

function randomDialogue(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function countFishByRarity(state, rarity) {
  return state.food
    .filter(i => i.type === "fish" && i.rarity === rarity)
    .reduce((sum, i) => sum + (i.count || 1), 0);
}

function removeFishByRarity(state, rarity, count) {
  let remaining = count;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    const item = state.food[i];
    if (item.type === "fish" && item.rarity === rarity) {
      const available = item.count || 1;
      if (available <= remaining) {
        remaining -= available;
        state.food.splice(i, 1);
      } else {
        item.count = available - remaining;
        remaining = 0;
      }
    }
  }
  return remaining <= 0;
}

export function handleNpcLinhan() {
  const state = getState();
  const affinity = getNpcAffinity("linhan");
  const friendshipLabel = getAffinityLabel(affinity);
  const dialogue = randomDialogue(LINHAN_DIALOGUES);

  let desc = `[Dân đảo Lâm Hàn]\nMột gã đàn ông trung niên gương mặt lạnh lùng, ánh mắt sắc bén mà trầm tĩnh. Người anh mang theo vị mặn của gió biển, hai tay đầy sẹo vì nhiều năm xử lý cá biển.`;
  desc += `\n\nThiện cảm hiện tại: ${affinity}/${AFFINITY_MAX.linhan}(${friendshipLabel})`;
  desc += `\n\n${dialogue}`;

  setPhase("island_linhan");
  setStory(desc);
  setOptions([
    { text: "Trò chuyện", action: "linhan_chat" },
    { text: "Chế biến cá biển độc", action: "linhan_cook" },
    { text: "Rời đi", action: "linhan_leave" },
  ]);
}

export function handleLinhanAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "linhan_chat":
      handleLinhanChat();
      break;
    case "linhan_cook":
      handleLinhanCook();
      break;
    case "linhan_cook_meal":
      handleLinhanCookMeal(input);
      break;
    case "linhan_cook_continue":
      handleLinhanCook();
      break;
    case "linhan_cook_back":
      handleNpcLinhan();
      break;
    case "linhan_leave":
      refreshIslandMenu();
      break;
    default:
      handleNpcLinhan();
      break;
  }
}

export function handleLinhanChat() {
  const state = getState();
  if (!canChatToday("linhan")) {
    setStory("Lâm Hàn vẫy tay: 'Hôm nay đã trò chuyện rất nhiều rồi, bữa khác tâm sự tiếp.'");
    handleNpcLinhan();
    return;
  }
  incrementChatCount("linhan");
  addNpcAffinity("linhan", 1);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleNpcLinhan();
}

export function handleLinhanCook() {
  const state = getState();
  const opts = [];
  const fishCost = GAME_CONSTANTS.FISHING.SEAFOOD_FISH_COST;

  for (const recipe of SEAFOOD_MEAL_RECIPES) {
    const meal = SEAFOOD_MEALS.find(m => m.id === recipe.mealId);
    const fishCount = countFishByRarity(state, recipe.fishRarity);
    const rarityLabel = RARITY_LABELS[recipe.fishRarity] || recipe.fishRarity;
    const canCook = fishCount >= fishCost;
    opts.push({
      text: `${formatQualityText(meal.name, meal.rarity)}(${rarityLabel} cá ${fishCount}/${fishCost})`,
      action: "linhan_cook_meal",
      cookRecipe: recipe.mealId,
      disabled: !canCook,
    });
  }
  opts.push({ text: "Quay lại", action: "linhan_cook_back" });

  setPhase("island_linhan");
  setStory("Lâm Hàn có thể giúp bạn xử lý cá biển độc, chế biến thành món hải sản ăn được. Chọn món bạn muốn làm:");
  setOptions(opts);
}

export function handleLinhanCookMeal(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "linhan_cook_meal") return;

  const recipe = SEAFOOD_MEAL_RECIPES.find(r => r.mealId === option.cookRecipe);
  if (!recipe) {
    handleLinhanCook();
    return;
  }

  const fishCost = GAME_CONSTANTS.FISHING.SEAFOOD_FISH_COST;
  const fishCount = countFishByRarity(state, recipe.fishRarity);

  if (fishCount < fishCost) {
    const rarityLabel = RARITY_LABELS[recipe.fishRarity] || recipe.fishRarity;
    setStory(`${rarityLabel} cá không đủ, cần ${fishCost} con, hiện chỉ có ${fishCount} con.`);
    handleLinhanCook();
    return;
  }

  removeFishByRarity(state, recipe.fishRarity, fishCost);

  const meal = SEAFOOD_MEALS.find(m => m.id === recipe.mealId);
  addItem({ ...meal, count: 1 });

  advanceTime(1);
  updateStatusEffects();
  checkDeath();

  setStory(`Lâm Hàn xử lý thành thạo ${fishCost} con${RARITY_LABELS[recipe.fishRarity] || recipe.fishRarity} cá biển độc, làm ra 1 phần${formatQualityText(meal.name, meal.rarity)}.`);
  if (!state.gameOver) {
    setPhase("island_linhan");
    setOptions([{ text: "Tiếp tục", action: "linhan_cook_continue" }]);
  }
}
