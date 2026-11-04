/* ============================================================
   Module hệ thống giao dịch
   Trình tự tổ chức: chọn loại giao dịch → xác nhận số lượng giao dịch
   ============================================================ */

import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from './state.js';

import { showExploreOptionsState } from './routing.js';

import { getRandomTrade } from './config.js';

export function handleTradeChoice(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "trade_back") {
    state._trade = null;
    setStory("Bạn từ bỏ giao dịch.");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    showExploreOptionsState();
    return;
  }

  const trade = state._trade;
  if (!trade) return;

  const type = action === "trade_food" ? "food" : "drink";
  const label = action === "trade_food" ? "đồ ăn" : "đồ uống";
  const inventory = state[type];

  const totalItems = inventory.reduce((sum, item) => sum + (item.count || 1), 0);
  if (totalItems === 0) {
    setStory(`Bạn không có ${label} nào để giao dịch.`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    showExploreOptionsState();
    return;
  }

  state._tradeType = type;

  setPhase("trade_input");
  setStory(`Bạn có ${totalItems} đồ ${label}. Nhập số lượng ${label} bạn muốn giao dịch:`);

  const inputOptions = [];
  for (let i = 1; i <= totalItems; i++) {
    const ammoCount = i * trade.ammoPerItem;
    inputOptions.push({ text: `Đổi ${i} đồ ${label} (nhận ${ammoCount} viên ${trade.ammoType})`, action: "confirm", count: i });
  }
  inputOptions.push({ text: "Quay lại", action: "back" });
  setOptions(inputOptions);
}

export function handleTradeInput(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    setPhase("trade_choice");
    setStory("Người sống sót sẵn sàng đổi đạn lấy vật tư của bạn.");
    setOptions([
      { text: "Đổi đồ ăn lấy đạn", action: "trade_food" },
      { text: "Đổi đồ uống lấy đạn", action: "trade_drink" },
      { text: "Quay lại", action: "trade_back" },
    ]);
    return;
  }

  const trade = state._trade;
  const type = state._tradeType;
  const count = option.count;

  const ammoCount = count * trade.ammoPerItem;
  const added = addItem({ id: trade.ammoType, name: trade.ammoType, type: "ammo", count: ammoCount });
  if (!added) {
    setStory(`Balo đã đầy! Bạn không thể mang thêm đạn.`);
    showExploreOptionsState();
    return;
  }

  let remaining = count;
  for (let i = state[type].length - 1; i >= 0 && remaining > 0; i--) {
    const item = state[type][i];
    const available = item.count || 1;
    if (available <= remaining) {
      state[type].splice(i, 1);
      remaining -= available;
    } else {
      item.count = available - remaining;
      remaining = 0;
    }
  }

  setStory(`Bạn dùng ${count} đồ ${type === "food" ? "đồ ăn" : "đồ uống"} để đổi lấy ${ammoCount} viên ${trade.ammoType}.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showExploreOptionsState();
}
