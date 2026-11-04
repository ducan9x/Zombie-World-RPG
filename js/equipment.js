/* ============================================================
   Hệ thống trang bị
   Thứ tự: chọn trang bị → quản lý cận chiến/tầm xa/đạn/túi → vứt đồ
   ============================================================ */

import {
  getState,
  setPhase,
  setStory,
  setOptions,
  removeItem,
  equipMelee,
  equipRanged,
  getBackpackCount,
  getItemDisplayName,
  isStackableType,
  removeCigarettes,
  removeGasoline,
} from './state.js';

import { returnToMenu } from './routing.js';

import { MELEE_WEAPONS, DEFAULT_ITEM_IDS } from './config.js';

// ---------- Chọn trang bị ----------

export function handleEquipSelect() {
  const state = getState();
  setPhase("equip_select");
  setStory("Quản lý trang bị - Chọn loại trang bị muốn quản lý:");
  setOptions([
    { text: `Vũ khí cận chiến (hiện tại: ${state.meleeWeapon.name})`, action: "melee" },
    { text: `Vũ khí tầm xa (hiện tại: ${state.rangedWeapon ? state.rangedWeapon.name : "Không"})`, action: "ranged" },
    { text: "Quản lý đạn", action: "ammo" },
    { text: `Đổi túi (hiện tại: ${state.backpack.name} ${getBackpackCount()}/${state.backpack.capacity})`, action: "backpack" },
    { text: "Quay lại", action: "back" }
  ]);
}

export function handleEquipSubAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;

  if (action === "back") {
    returnToMenu();
    return;
  }

  if (action === "melee") {
    const meleeItems = state.other.filter(item => item.type === "melee");
    const options = meleeItems.map((item, i) => ({
      text: `${item.name} (Sát thương:${item.damage} Độ bền:${item.durability})`,
      action: "equip_melee",
      index: i
    }));
    options.push({ text: `Tháo vũ khí hiện tại (chuyển sang ${MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).name})`, action: "equip_fist", index: -1 });
    options.push({ text: "Quay lại", action: "back", index: -2 });
    setPhase("melee_equip");
    setOptions(options);
    return;
  }

  if (action === "ranged") {
    const rangedItems = state.other.filter(item => item.type === "ranged");
    const options = rangedItems.map((item, i) => ({
      text: `${item.name} (Sát thương:${item.damage} Chí mạng:${Math.round(item.critRate * 100)}% Đạn:${item.ammoType})`,
      action: "equip_ranged_item",
      index: i
    }));
    if (state.rangedWeapon) {
      options.push({ text: `Tháo ${state.rangedWeapon.name}`, action: "unequip_ranged", index: -1 });
    }
    options.push({ text: "Quay lại", action: "back", index: -2 });
    setPhase("ranged_equip");
    setOptions(options);
    return;
  }

  if (action === "ammo") {
    const ammoOptions = state.ammo.map((a, i) => ({
      text: `${a.name} (Số lượng:${a.count})`,
      action: "load_ammo",
      index: i
    }));
    ammoOptions.push({ text: "Quay lại", action: "back", index: -1 });
    setPhase("ammo_load");
    setOptions(ammoOptions);
    return;
  }

  if (action === "backpack") {
    showBackpackOptions();
    return;
  }
}

// ---------- Quản lý túi ----------

function showBackpackOptions() {
  const state = getState();
  const backpacksInOther = state.other
    .map((item, i) => ({ item, originalIndex: i }))
    .filter(({ item }) => item.type === "backpack");

  if (backpacksInOther.length === 0) {
    setStory(`Túi hiện tại: ${state.backpack.name} (Sức chứa ${state.backpack.capacity})\nSố vật phẩm: ${getBackpackCount()}/${state.backpack.capacity}\n\nKhông có túi nào khác để đổi. Túi nhặt được khi khám phá sẽ lưu ở đây.`);
    setPhase("backpack_equip");
    setOptions([{ text: "Quay lại", action: "back" }]);
    return;
  }

  const currentCount = getBackpackCount();
  const options = backpacksInOther.map(({ item, originalIndex }) => {
    const canSwap = currentCount <= item.capacity;
    const statusTag = canSwap ? "" : " ⚠️Vật phẩm vượt sức chứa";
    return {
      text: `${item.name} (Sức chứa ${item.capacity})${statusTag}`,
      action: "equip_backpack",
      originalIndex,
      targetCapacity: item.capacity,
      canSwap,
    };
  });
  options.push({ text: "Quay lại", action: "back" });
  setPhase("backpack_equip");
  setStory(`Túi hiện tại: ${state.backpack.name} (Sức chứa ${state.backpack.capacity})\nSố vật phẩm: ${currentCount}/${state.backpack.capacity}\n\nChọn túi muốn trang bị: ${currentCount > state.backpack.capacity ? "" : ""}`);
  setOptions(options);
}

export function handleBackpackEquipAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    handleEquipSelect();
    return;
  }

  if (option.action === "equip_backpack") {
    const currentCount = getBackpackCount();
    const targetCapacity = option.targetCapacity;

    if (currentCount > targetCapacity) {
      setStory(`Không thể đổi! Đang mang ${currentCount} vật phẩm, vượt sức chứa của ${state.other[option.originalIndex].name} (${targetCapacity}). Hãy vứt bớt đồ trước.`);
      showBackpackOptions();
      return;
    }

    const newBp = state.other[option.originalIndex];
    const oldBp = { id: state.backpack.id || state.backpack.name, name: state.backpack.name, type: "backpack", capacity: state.backpack.capacity };

    state.other.splice(option.originalIndex, 1);
    state.other.push(oldBp);
    state.backpack = { id: newBp.id, name: newBp.name, type: newBp.type, capacity: newBp.capacity };

    setStory(`Đã đổi túi!\n${oldBp.name} (${oldBp.capacity} ô) → ${newBp.name} (${newBp.capacity} ô)\nTúi cũ đã đưa vào vật phẩm.`);
    returnToMenu();
    return;
  }
}

// ---------- Trang bị cận chiến ----------

export function handleMeleeEquipAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    handleEquipSelect();
    return;
  }

  if (option.action === "equip_fist") {
    if (state.meleeWeapon && state.meleeWeapon.id !== DEFAULT_ITEM_IDS.melee) {
      state.other.push(state.meleeWeapon);
      state.meleeWeapon = { ...MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee), currentDurability: MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).durability };
    }
    setStory(`Bạn đã tháo vũ khí cận chiến, hiện dùng ${MELEE_WEAPONS.find(w => w.id === DEFAULT_ITEM_IDS.melee).name} chiến đấu.`);
    returnToMenu();
    return;
  }

  if (option.action === "equip_melee") {
    const meleeItems = state.other.filter(item => item.type === "melee");
    const item = meleeItems[option.index];
    if (!item) {
      setStory("Không thể trang bị vũ khí này.");
      returnToMenu();
      return;
    }
    const result = equipMelee(item.id);
    if (result) {
      setStory(`Bạn đã trang bị ${result.name}.`);
    } else {
      setStory("Trang bị thất bại.");
    }
    returnToMenu();
    return;
  }
}

// ---------- Trang bị tầm xa ----------

export function handleRangedEquipAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) {
    return;
  }

  const option = state.options[optionIndex];

  if (option.action === "back") {
    handleEquipSelect();
    return;
  }

  if (option.action === "unequip_ranged") {
    if (state.rangedWeapon) {
      state.other.push(state.rangedWeapon);
      const weaponName = state.rangedWeapon.name;
      state.rangedWeapon = null;
      setStory(`Bạn đã tháo ${weaponName}.`);
    }
    returnToMenu();
    return;
  }

  if (option.action === "equip_ranged_item") {
    const rangedItems = state.other.filter(item => item.type === "ranged");
    const item = rangedItems[option.index];
    if (!item) {
      setStory("Không thể trang bị vũ khí này.");
      returnToMenu();
      return;
    }
    const result = equipRanged(item.id);
    if (result) {
      setStory(`Bạn đã trang bị ${result.name}.`);
    } else {
      setStory("Trang bị thất bại.");
    }
    returnToMenu();
    return;
  }
}

// ---------- Quản lý đạn ----------

export function handleAmmoLoadAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) {
    return;
  }

  const option = state.options[optionIndex];

  if (option.action === "back") {
    handleEquipSelect();
    return;
  }

  if (option.action === "load_ammo") {
    const ammo = state.ammo[option.index];
    if (!ammo) return;

    if (!state.rangedWeapon) {
      setStory("Bạn chưa trang bị vũ khí tầm xa, không thể nạp đạn.");
      returnToMenu();
      return;
    }

    if (state.rangedWeapon.ammoType !== ammo.name) {
      setStory(`${ammo.name} không tương thích với ${state.rangedWeapon.name} của bạn (cần ${state.rangedWeapon.ammoType}).`);
      returnToMenu();
      return;
    }

    setStory(`${state.rangedWeapon.name} đã nạp ${ammo.name} (tồn kho ${ammo.count} viên).`);
    returnToMenu();
    return;
  }
}

// ---------- Vứt đồ ----------

export function handleDiscardSelect() {
  const state = getState();
  setPhase("discard_select");
  setStory("Chọn vật phẩm muốn vứt:");
  const items = [];
  if (state.cigarettes > 0) {
    items.push({ category: "cigarettes", index: 0, label: `[Hàng] (${state.cigarettes}) thuốc lá`, stackable: true, count: state.cigarettes });
  }
  if (state.gasoline > 0) {
    items.push({ category: "gasoline", index: 0, label: `[Hàng] (${state.gasoline}) xăng`, stackable: true, count: state.gasoline });
  }
  state.food.forEach((item, i) => items.push({ category: "food", index: i, label: `[Thức ăn] ${getItemDisplayName(item)}`, stackable: isStackableType(item), count: item.count || 1 }));
  state.drinks.forEach((item, i) => items.push({ category: "drinks", index: i, label: `[Đồ uống] ${getItemDisplayName(item)}`, stackable: isStackableType(item), count: item.count || 1 }));
  state.medicine.forEach((item, i) => items.push({ category: "medicine", index: i, label: `[Y tế] ${getItemDisplayName(item)}`, stackable: isStackableType(item), count: item.count || 1 }));
  state.other.forEach((item, i) => items.push({ category: "other", index: i, label: `[Khác] ${getItemDisplayName(item)}`, stackable: isStackableType(item), count: item.count || 1 }));
  if (state.seeds) state.seeds.forEach((item, i) => items.push({ category: "seed", index: i, label: `[Hạt giống] ${getItemDisplayName(item)}`, stackable: isStackableType(item), count: item.count || 1 }));
  items.push({ category: "back", index: -1, label: "Quay lại" });
  const opts = items.map((item, i) => ({ text: item.label, action: "discard", index: i }));
  state._discardItems = items;
  setOptions(opts);
}

export function handleDiscardAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];
  const items = state._discardItems;
  if (!items) { returnToMenu(); return; }

  const item = items[option.index];
  if (!item || item.category === "back") {
    returnToMenu();
    return;
  }

  if (item.stackable && item.count > 1) {
    handleDiscardQuantitySelect(item);
    return;
  }

  executeDiscard(item, 1);
}

function handleDiscardQuantitySelect(discardItem) {
  const state = getState();
  setPhase("discard_quantity");
  const maxCount = discardItem.count;
  let storyText = `Chọn số lượng ${discardItem.category === "cigarettes" ? "thuốc lá" : discardItem.category === "gasoline" ? "xăng" : discardItem.label.split('] ')[1]} muốn vứt:\n`;
  storyText += `Số lượng hiện có: ${maxCount}`;
  setStory(storyText);
  const opts = [];
  for (let i = 1; i <= maxCount; i++) {
    opts.push({ text: `Vứt ${i} cái`, action: "discard_quantity", count: i });
  }
  opts.push({ text: "Quay lại", action: "discard_back" });
  state._pendingDiscardItem = discardItem;
  setOptions(opts);
}

export function handleDiscardQuantityAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];
  if (option.action === "discard_back") {
    handleDiscardSelect();
    return;
  }
  if (option.action === "discard_quantity") {
    const discardItem = state._pendingDiscardItem;
    if (!discardItem) { returnToMenu(); return; }
    executeDiscard(discardItem, option.count);
    return;
  }
}

function executeDiscard(discardItem, count) {
  const state = getState();
  if (discardItem.category === "cigarettes") {
    const actual = Math.min(count, state.cigarettes);
    removeCigarettes(actual);
    setStory(`Bạn đã vứt ${actual} điếu thuốc lá.`);
  } else if (discardItem.category === "gasoline") {
    const actual = Math.min(count, state.gasoline);
    removeGasoline(actual);
    setStory(`Bạn đã vứt ${actual} can xăng.`);
  } else {
    const removed = removeItem(discardItem.category, discardItem.index, count);
    if (removed) {
      const displayName = discardItem.category === "cigarettes" ? "thuốc lá" : discardItem.category === "gasoline" ? "xăng" : (typeof removed === 'object' ? (removed.name || discardItem.label.split('] ')[1]) : discardItem.label.split('] ')[1]);
      setStory(`Bạn đã vứt ${count > 1 ? count : ''}${displayName}.`);
    } else {
      setStory("Không thể vứt vật phẩm này.");
    }
  }
  returnToMenu();
}