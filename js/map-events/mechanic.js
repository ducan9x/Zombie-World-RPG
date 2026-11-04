import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  removeItem,
  removeCigarettes,
  addGasoline,
} from '../state.js';

import {
  MECHANIC_DIALOGUES,
  TOOL_WEAPON_IDS,
  AMMO,
  DRINKS,
  FOODS,
  MAP_NPC_INTROS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

function showMechanicMenu() {
  setOptions([
    { text: "Trò chuyện", action: "mechanic_chat" },
    { text: "Giao dịch", action: "mechanic_trade" },
    { text: "Rời đi", action: "mechanic_leave" },
  ]);
}

export function handleMechanicInteract() {
  setPhase("explore");
  setStory(MAP_NPC_INTROS.mechanic_intro);
  showMechanicMenu();
}

export function handleMechanicChat() {
  const line = MECHANIC_DIALOGUES[Math.floor(Math.random() * MECHANIC_DIALOGUES.length)];
  setStory(line);
  showMechanicMenu();
}

export function handleMechanicTrade() {
  const state = getState();
  if (state.lastMechanicTradeDay >= state.day) {
    const daysLeft = Math.max(0, state.lastMechanicTradeDay + 1 - state.day);
    setStory(`Hôm nay đã giao dịch với Vương Thiết Trụ rồi. Còn lại ${daysLeft} ngày mới có thể giao dịch lại。`);
    showMechanicMenu();
    return;
  }
  const toolIds = TOOL_WEAPON_IDS;
  let foundIdx = -1;
  for (const id of toolIds) {
    foundIdx = state.other.findIndex(i => i.id === id);
    if (foundIdx !== -1) break;
  }
  if (foundIdx === -1) {
    setStory("Vương Thiết Trụ lật xem balo của bạn: \"Không có dụng cụ? Vậy chẳng có gì để nói. Đi kiếm chút cờ lê, ống sắt rồi quay lại!\"");
    showMechanicMenu();
    return;
  }
  const toolName = state.other[foundIdx].name;
  setStory(`Vương Thiết Trụ sáng mắt: "Yo, ${toolName}! Thứ này tôi đang dùng được! Đưa đây, tôi đổi cho bạn chút đạn, ăn uống, thế nào?"`);
  setPhase("explore");
  setOptions([
    { text: `Giao dịch ${toolName}`, action: "mechanic_trade_confirm" },
    { text: "Suy nghĩ thêm", action: "mechanic_chat" },
  ]);
}

export function handleMechanicTradeConfirm() {
  const state = getState();
  const toolIds = TOOL_WEAPON_IDS;
  let foundIdx = -1;
  for (const id of toolIds) {
    foundIdx = state.other.findIndex(i => i.id === id);
    if (foundIdx !== -1) break;
  }
  if (foundIdx === -1) {
    setStory("Dụng cụ đã không còn.");
    showMechanicMenu();
    return;
  }
  const toolName = state.other[foundIdx].name;
  removeItem("other", foundIdx);
  const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
  addItem({ id: ammo.id, name: ammo.name, type: "ammo", count: 5 });
  const drink = DRINKS[Math.floor(Math.random() * DRINKS.length)];
  addItem({ ...drink, type: "drink" });
  const food = FOODS[Math.floor(Math.random() * FOODS.length)];
  addItem({ ...food });
  setStory(`Bạn đưa ${toolName} cho Vương Thiết Trụ. Anh ta hài lòng nhận lấy, lục trong hộp dụng cụ ra một số thứ:\n\n• ${ammo.name}×5\n• ${drink.name}×1\n• ${food.name}×1\n\n"Đáng giá! Lần sau có dụng cụ nhớ tìm tôi nhé!"`);
  state.lastMechanicTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!getState().gameOver) {
    showMechanicMenu();
  }
}

export function handleMechanicLeave() {
  setStory("Bạn từ biệt Vương Thiết Trụ, rời khỏi nhà máy.");
  showExploreOptionsState();
}

export function handleMechanicGasTrade() {
  const state = getState();
  if (state.lastMechanicGasDay >= state.day) {
    const daysLeft = Math.max(0, state.lastMechanicGasDay + 1 - state.day);
    setStory(`Hôm nay đã đổi xăng rồi. Còn lại ${daysLeft} ngày mới có thể đổi lại。`);
    showMechanicMenu();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.mechanic_gas_intro);
  setOptions([
    { text: "Đổi (5 thuốc lá → 1 xăng)", action: "mechanic_gas_confirm" },
    { text: "Thôi", action: "mechanic_leave" },
  ]);
}

export function handleMechanicGasConfirm() {
  setPhase("explore");
  const state = getState();
  if (state.cigarettes < 5) {
    setStory(MAP_NPC_INTROS.mechanic_gas_no_cigs);
    setOptions([
      { text: "Rời đi", action: "mechanic_leave" },
    ]);
    return;
  }
  removeCigarettes(5);
  addGasoline(1);
  state.lastMechanicGasDay = state.day;
  setStory(MAP_NPC_INTROS.mechanic_gas_success);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setOptions([
      { text: "Tiếp tục đổi", action: "mechanic_gas_confirm" },
      { text: "Rời đi", action: "mechanic_leave" },
    ]);
  }
}