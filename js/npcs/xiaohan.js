import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  removeCigarettes,
  removeGasoline,
  getItemDisplayName,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { handleNpcAction } from './index.js';

import { FOODS, XIAOHAN_REWARD_FOOD_IDS } from '../config.js';

export function handleXiaohanTrade(input) {
  const state = getState();
  if (state.lastXiaohanTradeDay >= state.day) {
    setStory("Tiểu Hàn lắc đầu: \"Hôm nay đã giao dịch rồi, hẹn ngày khác nhé.\"");
    handleNpcAction("chat");
    return;
  }
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];
  if (option.action === "xiaohan_back") { showExploreOptionsState(); return; }

  const item = option.tradeItem;
  if (!item) { showExploreOptionsState(); return; }

  if (item.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
  } else {
    const catMap = { food: state.food, drinks: state.drinks, medicine: state.medicine, other: state.other };
    const targetItem = catMap[item.cat][item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[item.cat].splice(item.idx, 1);
    }
  }

  const rewardFoods = XIAOHAN_REWARD_FOOD_IDS.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
  const reward = rewardFoods[Math.floor(Math.random() * rewardFoods.length)];
  const added = addItem({ ...reward, type: "food" });
  if (added) {
    setStory(`Tiểu Hàn vui vẻ nhận lấy${getItemDisplayName(item)}, để đổi lại, cô ấy đưa cho bạn một phần${reward.name}.`);
  } else {
    setStory(`Tiểu Hàn vui vẻ nhận lấy${getItemDisplayName(item)}, muốn đưa cho bạn một phần${reward.name}, nhưng túi đồ bạn đã đầy, không thể mang theo.`);
  }
  state.lastXiaohanTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleXiaohanTradeConfirm(input) {
  const state = getState();
  if (state.lastXiaohanTradeDay >= state.day) {
    setStory("Hôm nay đã giao dịch với Tiểu Hàn rồi, ngày mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];
  if (option.action === "xiaohan_back") { showExploreOptionsState(); return; }

  const item = option.tradeItem;
  if (!item) { showExploreOptionsState(); return; }

  if (item.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
  } else {
    const catMap = { food: state.food, drinks: state.drinks, medicine: state.medicine, other: state.other };
    const targetItem = catMap[item.cat][item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[item.cat].splice(item.idx, 1);
    }
  }

  const rewardFoods = XIAOHAN_REWARD_FOOD_IDS.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
  const reward = rewardFoods[Math.floor(Math.random() * rewardFoods.length)];
  const added = addItem({ ...reward, type: "food" });
  if (added) {
    setStory(`Tiểu Hàn vui vẻ nhận lấy${getItemDisplayName(item)}, để đổi lại, cô ấy đưa cho bạn một phần${reward.name}.`);
  } else {
    setStory(`Tiểu Hàn vui vẻ nhận lấy${getItemDisplayName(item)}, muốn đưa cho bạn một phần${reward.name}, nhưng túi đồ bạn đã đầy, không thể mang theo.`);
  }
  state.lastXiaohanTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
