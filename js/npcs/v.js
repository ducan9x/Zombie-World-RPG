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

import { getRandomTrade, BACKPACK_TYPES, LOOT_BACKPACKS, V_TRADE_AMMO_TYPES, GAME_CONSTANTS } from '../config.js';

export function handleVTrade(input) {
  const state = getState();
  if (state.lastVTradeDay >= state.day) {
    setStory("Cô V phun một vòng khói thuốc: \"Hôm nay đã giao dịch rồi, ngày mai hãy quay lại.\"");
    handleNpcAction("chat");
    return;
  }
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];
  if (option.action === "v_back") { showExploreOptionsState(); return; }

  const offerItem = option.vItem;
  if (!offerItem) { showExploreOptionsState(); return; }

  setPhase("v_trade_result");

  const trade = getRandomTrade();
  const added = addItem({ id: trade.ammoType, name: trade.ammoType, type: "ammo", count: trade.ammoPerItem });
  if (!added) {
    setStory(`Túi đồ đã đầy! Cô V nhíu mày: "Lần sau mang đủ chỗ trống rồi hãy đến nhé."`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }

  if (offerItem.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (offerItem.cat === "gasoline") {
    removeGasoline(1);
  } else {
    const catMap = { food: state.food, drinks: state.drinks };
    const targetItem = catMap[offerItem.cat][offerItem.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[offerItem.cat].splice(offerItem.idx, 1);
    }
  }

  setStory(`Cô V nhận lấy${getItemDisplayName(offerItem)}, được cho${trade.ammoPerItem} viên${trade.ammoType}."Giao dịch công bằng."`);
  state.lastVTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleVTradeConfirm(input) {
  const state = getState();
  if (state.lastVTradeDay >= state.day) {
    setStory("Hôm nay đã giao dịch với Cô V rồi, ngày mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;
  const option = state.options[optionIndex];
  if (option.action === "v_back") { showExploreOptionsState(); return; }

  const item = option.vItem;
  if (!item) return;

  const ammoTypes = V_TRADE_AMMO_TYPES;
  const randomAmmo = ammoTypes[Math.floor(Math.random() * ammoTypes.length)];
  const ammoCount = Math.floor(Math.random() * (GAME_CONSTANTS.NPC.V_TRADE_AMMO_MAX - GAME_CONSTANTS.NPC.V_TRADE_AMMO_MIN + 1)) + GAME_CONSTANTS.NPC.V_TRADE_AMMO_MIN;
  const ammoItem = { id: randomAmmo, name: randomAmmo, type: "ammo", count: ammoCount };
  const addedAmmo = addItem(ammoItem);

  const bpNames = LOOT_BACKPACKS.map(b => b.id);
  const randomBp = bpNames[Math.floor(Math.random() * bpNames.length)];
  const bpConfig = LOOT_BACKPACKS.find(b => b.id === randomBp);
  const cap = bpConfig.capacity;
  const bpItem = { id: bpConfig.id, name: bpConfig.name, type: "backpack", capacity: cap, rarity: bpConfig.rarity };
  const addedBp = addItem(bpItem);

  if (!addedAmmo || !addedBp) {
    if (addedAmmo) {
      const existingAmmo = state.ammo.find(a => a.id === ammoItem.id);
      if (existingAmmo) {
        existingAmmo.count -= ammoItem.count;
        if (existingAmmo.count <= 0) {
          state.ammo = state.ammo.filter(a => a.id !== ammoItem.id);
        }
      }
    }
    if (addedBp) {
      const bpIdx = state.other.findIndex(i => i.id === bpItem.id && i.type === "backpack");
      if (bpIdx !== -1) {
        state.other.splice(bpIdx, 1);
      }
    }
    setStory(`Túi đồ đã đầy!Cô V nhìn túi đồ của bạn, lắc đầu: "Dọn dẹp đồ dùng của bạn trước đi."`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showExploreOptionsState();
    return;
  }

  if (item.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
  } else {
    const catMap = { food: state.food, drinks: state.drinks };
    const targetItem = catMap[item.cat][item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[item.cat].splice(item.idx, 1);
    }
  }

  setStory(`Cô V nhận lấy${getItemDisplayName(item)}, đã hài lòng.Cô ấy đưa cho bạn${ammoCount} viên${randomAmmo} và một${randomBp}(dung lượng${cap}).`);
  state.lastVTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
