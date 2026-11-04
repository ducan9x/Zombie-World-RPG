/* ============================================================
   Mô-đun NPC bản đồ
   Thứ tự tổ chức: Lối vào NPC bản đồ → Giao dịch/Tặng
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
  addNpcAffinity,
  getNpcAffinity,
  getAffinityLabel,
  getAffinityStage,
  addCigarettes,
  removeCigarettes,
  removeGasoline,
  removePureEnergy,
  getItemDisplayName,
} from '../state.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import {
  SURVIVOR_NPC,
  GAME_CONSTANTS,
  AFFINITY_MAX,
} from '../config.js';

export function handleMapNpcs(npcId) {
  const state = getState();
  const npcData = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!npcData) {
    setStory("Ở đây không một bóng người.");
    showExploreOptionsState();
    return;
  }
  state._currentNpc = npcId;
  const affinity = getNpcAffinity(npcId);
  const stage = getAffinityStage(affinity);
  const intro = npcData.desc;
  setStory(intro + `\n\nHảo cảm：${affinity}/${AFFINITY_MAX[npcId]}`);
  setPhase("map_npc");
  setOptions([
    { text: "Giao dịch", action: "map_npc_trade" },
    { text: "Tặng", action: "map_npc_gift" },
    { text: "Rời đi", action: "map_npc_leave" },
  ]);
}

export function handleMapNpcsAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "map_npc_leave") {
    setStory("Bạn đã rời khỏi đây.");
    showExploreOptionsState();
    return;
  }

  if (action === "map_npc_trade") {
    const npcId = state._currentNpc;
    const npcData = SURVIVOR_NPC.find(n => n.id === npcId);
    if (!npcData) return;
    let items = [];
    state.food.forEach((item, i) => items.push({ cat: "food", idx: i, name: getItemDisplayName(item), label: `[Thức ăn] ${getItemDisplayName(item)}` }));
    state.drinks.forEach((item, i) => items.push({ cat: "drinks", idx: i, name: getItemDisplayName(item), label: `[Đồ uống] ${getItemDisplayName(item)}` }));
    state.medicine.forEach((item, i) => items.push({ cat: "medicine", idx: i, name: getItemDisplayName(item), label: `[Y tế] ${getItemDisplayName(item)}` }));
    if (state.cigarettes > 0) items.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá", label: `[Hàng hóa] (${state.cigarettes})Thuốc lá` });
    if (state.gasoline > 0) items.push({ cat: "gasoline", idx: 0, name: "Xăng", label: `[Hàng hóa] (${state.gasoline})Xăng` });
    if (state.pureEnergy > 0) items.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết", label: `[Hàng hóa] (${state.pureEnergy})Năng lượng tinh khiết` });
    if (items.length === 0) {
      setStory("Bạn không có gì để giao dịch.");
      handleMapNpcs(npcId);
      return;
    }
    setPhase("map_npc_trade");
    setStory("Chọn vật phẩm bạn muốn giao dịch:");
    const opts = items.map((item, i) => ({ text: item.label, action: "map_npc_trade_confirm", index: i, tradeItem: item }));
    opts.push({ text: "Quay lại", action: "map_npc_trade_back", index: -1 });
    setOptions(opts);
    return;
  }

  if (action === "map_npc_gift") {
    const npcId = state._currentNpc;
    if (state.cigarettes <= 0 && state.gasoline <= 0 && state.pureEnergy <= 0) {
      setStory("Bạn không có thuốc lá, xăng hoặc năng lượng tinh khiết để tặng.");
      handleMapNpcs(npcId);
      return;
    }
    let giftItems = [];
    if (state.cigarettes > 0) giftItems.push({ cat: "cigarettes", name: "Thuốc lá" });
    if (state.gasoline > 0) giftItems.push({ cat: "gasoline", name: "Xăng" });
    if (state.pureEnergy > 0) giftItems.push({ cat: "pureEnergy", name: "Năng lượng tinh khiết" });
    if (giftItems.length === 1) {
      const gift = giftItems[0];
      if (gift.cat === "cigarettes") removeCigarettes(1);
      else if (gift.cat === "gasoline") removeGasoline(1);
      else if (gift.cat === "pureEnergy") removePureEnergy(1);
      addNpcAffinity(npcId, GAME_CONSTANTS.NPC.MAP_NPC_GIFT_AFFINITY);
      const affinity = getNpcAffinity(npcId);
      setStory(`Bạn đưa lên một ${gift.name}. ${SURVIVOR_NPC.find(n => n.id === npcId)?.name || "đối phương"} lộ vẻ biết ơn, hảo cảm +${GAME_CONSTANTS.NPC.MAP_NPC_GIFT_AFFINITY}（hiện tại ${affinity}/${AFFINITY_MAX[npcId]}）。`);
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) {
        handleMapNpcs(npcId);
      }
      return;
    }
    setPhase("map_npc_gift_select");
    setStory("Hãy chọn vật phẩm muốn tặng:");
    const opts = giftItems.map((item, i) => ({ text: `[Hàng hóa] ${item.name}`, action: "map_npc_gift_confirm", index: i, giftItem: item }));
    opts.push({ text: "Quay lại", action: "map_npc_gift_back", index: -1 });
    setOptions(opts);
    return;
  }
}

export function handleMapNpcTrade(input) {
  const state = getState();
  if (state.lastMapNpcTradeDay >= state.day) {
    setStory("Hôm nay đã giao dịch rồi, ngày mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];
  if (option.action === "map_npc_trade_back") {
    handleMapNpcs(state._currentNpc);
    return;
  }
  const item = option.tradeItem;
  if (!item) { showExploreOptionsState(); return; }
  const catMap = { food: state.food, drinks: state.drinks, medicine: state.medicine, cigarettes: [], gasoline: [] };
  if (item.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
  } else if (item.cat === "pureEnergy") {
    removePureEnergy(1);
  } else {
    const targetItem = catMap[item.cat][item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[item.cat].splice(item.idx, 1);
    }
  }
  addCigarettes(1);
  state.lastMapNpcTradeDay = state.day;
  setStory(`Bạn đã giao dịch ${getItemDisplayName(item)}, nhận được một điếu thuốc lá.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handleMapNpcGiftConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];

  if (option.action === "map_npc_gift_back") {
    handleMapNpcs(state._currentNpc);
    return;
  }

  const npcId = state._currentNpc;
  const gift = option.giftItem;
  if (!gift) { handleMapNpcs(npcId); return; }

  if (gift.cat === "cigarettes") removeCigarettes(1);
  else if (gift.cat === "gasoline") removeGasoline(1);

  addNpcAffinity(npcId, GAME_CONSTANTS.NPC.MAP_NPC_GIFT_AFFINITY);
  const affinity = getNpcAffinity(npcId);
  setStory(`Bạn đưa lên một ${gift.name}. ${SURVIVOR_NPC.find(n => n.id === npcId)?.name || "đối phương"} lộ vẻ biết ơn, hảo cảm +${GAME_CONSTANTS.NPC.MAP_NPC_GIFT_AFFINITY}（hiện tại ${affinity}/${AFFINITY_MAX[npcId]}）。`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleMapNpcs(npcId);
  }
}