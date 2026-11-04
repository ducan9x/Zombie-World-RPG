/* ============================================================
   Mô-đun xây dựng căn cứ
   Thứ tự tổ chức: nâng cấp căn cứ → hệ thống trồng trọt → hệ thống kho
   ============================================================ */

import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addCigarettes,
  removeCigarettes,
  removePureEnergy,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getItemDisplayName,
} from './state.js';

import {
  FOODS,
  BASE_LEVELS,
  WAREHOUSE_LEVELS,
  BUILDING_MATERIAL_NAMES,
  DEFAULT_ITEM_IDS,
  GAME_CONSTANTS,
} from './config.js';

import {
  showHomeOptions,
  showBaseBuildOptions,
} from './routing.js';

import {
  handleBaseBuild,
} from './game/index.js';

import {
  handlePlantCrop as farmingPlantCrop,
  handleViewCrops as farmingViewCrops,
  handleHarvestCrops as farmingHarvestCrops,
  handleSeedSelect,
} from './farming.js';

// ---------- Nâng cấp căn cứ ----------

export function getBaseName(level) {
  return BASE_LEVELS[level]?.name || BASE_LEVELS[0].name;
}

export function getBaseBonus(level) {
  return BASE_LEVELS[level]?.bonus ?? 0;
}

export function getBaseUpgradeCost(level) {
  return BASE_LEVELS[level]?.cost ?? null;
}

export function handleUpgradeBase() {
  const state = getState();
  if (state.baseLevel >= GAME_CONSTANTS.BASE.MAX_BASE_LEVEL) {
    setStory("【Biệt thự người sống sót】 đã là căn cứ cấp cao nhất, vàng son lộng lẫy, vững như thành đồng. Bạn đứng trước cửa sổ sát đất nhìn xuống vùng phế tích tận thế, trong lòng bồi hồi khôn xiết.");
    showHomeOptions();
    return;
  }
  const cost = getBaseUpgradeCost(state.baseLevel + 1);
  if (!cost) {
    showHomeOptions();
    return;
  }
  const nextLevel = state.baseLevel + 1;
  const bonus = getBaseBonus(nextLevel) - getBaseBonus(state.baseLevel);
  const lines = [`🏠 ${getBaseName(state.baseLevel)} → ${getBaseName(nextLevel)}`];
  lines.push(`Bổ sung hồi phục khi ngủ: ${getBaseBonus(state.baseLevel)} → ${getBaseBonus(nextLevel)}（+${bonus}HP）`);
  lines.push(`⏱ Thời gian: ${GAME_CONSTANTS.BASE.UPGRADE_TIME_COST} lượt（1 ngày）`);
  lines.push(`━━━━━━━━━━━━━━━━━`);
  lines.push(`📦 Vật liệu cần：`);
  const costNames = BUILDING_MATERIAL_NAMES;
  let canAfford = true;
  for (const [id, count] of Object.entries(cost)) {
    const have = countBuildingMaterial(state, id);
    lines.push(`  ${costNames[id]}: ${have}/${count} ${have >= count ? "✅" : "❌"}`);
    if (have < count) canAfford = false;
  }
  if (canAfford) {
    setStory(lines.join("\n") + "\n\nXác nhận tiêu hao những vật liệu này để nâng cấp? Việc nâng cấp sẽ kéo dài cả một ngày.");
    setPhase("base_upgrade_confirm");
    setOptions([
      { text: "✅ Xác nhận nâng cấp", action: "confirm_upgrade" },
      { text: "❌ Suy nghĩ lại", action: "back_to_base" },
    ]);
  } else {
    setStory(lines.join("\n") + "\n\n⚠️ Vật liệu xây dựng không đủ, không thể khởi công. Hãy đi lục soát thêm vật liệu nhé!");
    showBaseBuildOptions();
  }
}

export function handleConfirmUpgrade() {
  const state = getState();
  const oldName = getBaseName(state.baseLevel);
  const cost = getBaseUpgradeCost(state.baseLevel + 1);
  if (!cost) { showHomeOptions(); return; }
  for (const [id, count] of Object.entries(cost)) {
    removeBuildingMaterials(state, id, count);
  }
  state.baseLevel++;
  const newName = getBaseName(state.baseLevel);
  advanceTime(GAME_CONSTANTS.BASE.UPGRADE_TIME_COST);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    const flavor = BASE_LEVELS[state.baseLevel]?.upgradeFlavor || "";
    setStory(`【${oldName} → ${newName}】\n\n${flavor}\n\nHiệu quả hồi phục khi ngủ đã tăng（+${getBaseBonus(state.baseLevel)}HP）！`);
    if (state.baseLevel >= GAME_CONSTANTS.BASE.MAX_BASE_LEVEL) {
      if (!state.unlockedAchievements) state.unlockedAchievements = [];
      if (!state.unlockedAchievements.includes("base_upgrade")) state.unlockedAchievements.push("base_upgrade");
    }
    showHomeOptions();
  }
}

// ---------- Hệ thống trồng trọt ----------

export function handlePlantCrop() {
  farmingPlantCrop();
}

export function handleViewCrops() {
  farmingViewCrops();
}

export function handleHarvestCrops() {
  farmingHarvestCrops();
}

// ---------- Hệ thống kho ----------

export function getWarehouseCapacity(level) {
  return GAME_CONSTANTS.BASE.WAREHOUSE_BASE_CAP + level * GAME_CONSTANTS.BASE.WAREHOUSE_CAP_PER_LEVEL;
}

export function getWarehouseUpgradeCost(level) {
  return WAREHOUSE_LEVELS[level] || null;
}

export function countBuildingMaterial(state, id) {
  return state.other.filter(i => i.id === id).reduce((sum, i) => sum + (i.count || 1), 0);
}

export function removeBuildingMaterials(state, id, count) {
  let remaining = count;
  for (let i = state.other.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.other[i].id === id) {
      const available = state.other[i].count || 1;
      if (available <= remaining) {
        state.other.splice(i, 1);
        remaining -= available;
      } else {
        state.other[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  return remaining === 0;
}

export function handleBuildWarehouse() {
  const state = getState();
  if (state.warehouseLevel >= GAME_CONSTANTS.BASE.MAX_WAREHOUSE_LEVEL) {
    const maxCap = getWarehouseCapacity(GAME_CONSTANTS.BASE.MAX_WAREHOUSE_LEVEL);
    setStory(`Kho đã đạt sức chứa tối đa（${maxCap} ô），không cần mở rộng thêm.`);
    showBaseBuildOptions();
    return;
  }
  const nextLevel = state.warehouseLevel + 1;
  const cost = getWarehouseUpgradeCost(nextLevel);
  if (!cost) {
    showBaseBuildOptions();
    return;
  }
  const costNames = BUILDING_MATERIAL_NAMES;
  const currentCap = getWarehouseCapacity(state.warehouseLevel);
  const nextCap = getWarehouseCapacity(nextLevel);
  let lines = [`📦 【Mở rộng kho Lv${state.warehouseLevel} → Lv${nextLevel}】`];
  lines.push(`Sức chứa: ${currentCap} ô → ${nextCap} ô（+${nextCap - currentCap} ô）`);
  lines.push(`━━━━━━━━━━━━━━━━━`);
  lines.push(`📋 Vật liệu cần：`);
  let canAfford = true;
  for (const [id, count] of Object.entries(cost)) {
    const have = countBuildingMaterial(state, id);
    lines.push(`${costNames[id]}: ${have}/${count} ${have >= count ? "✅" : "❌"}`);
    if (have < count) canAfford = false;
  }
  if (canAfford) {
    setStory(lines.join("\n") + "\n\nSau khi mở rộng có thể chứa thêm nhiều vật tư, xác nhận xây dựng không?");
    setPhase("warehouse_upgrade_confirm");
    setOptions([
      { text: "✅ Xác nhận xây dựng", action: "confirm_warehouse" },
      { text: "❌ Suy nghĩ lại", action: "back_to_base" },
    ]);
  } else {
    setStory(lines.join("\n") + "\n\n⚠️ Vật liệu không đủ, không thể khởi công. Hãy đi lục soát thêm vật liệu nhé.");
    showBaseBuildOptions();
  }
}

export function handleConfirmWarehouse() {
  const state = getState();
  const nextLevel = state.warehouseLevel + 1;
  const cost = getWarehouseUpgradeCost(nextLevel);
  const oldCap = getWarehouseCapacity(state.warehouseLevel);
  if (!cost) { showHomeOptions(); return; }
  for (const [id, count] of Object.entries(cost)) {
    removeBuildingMaterials(state, id, count);
  }
  state.warehouseLevel++;
  const newCap = getWarehouseCapacity(state.warehouseLevel);
  setStory(`📦 Bạn dành một ít thời gian, lách cách lắp thêm một dãy kệ mới trong kho.\n\nKho mở rộng hoàn tất! ${oldCap} ô → ${newCap} ô  |  Đang dùng: ${state.warehouse.length}/${newCap} ô`);
  advanceTime(GAME_CONSTANTS.BASE.WAREHOUSE_UPGRADE_TIME);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showHomeOptions();
  }
}

export function handleOpenWarehouse() {
  const state = getState();
  const cap = getWarehouseCapacity(state.warehouseLevel);
  const usage = state.warehouse.length;
  const pct = Math.round((usage / cap) * 100);
  setStory(`📦 【Kho】Tình trạng sử dụng: ${usage}/${cap} ô（${pct}%）\n\nCất vật phẩm: chuyển vật phẩm trong ba lô vào kho\nLấy vật phẩm: lấy vật phẩm trong kho về ba lô`);
  setPhase("warehouse_menu");
  setOptions([
    { text: "Cất vật phẩm", action: "warehouse_deposit" },
    { text: "Lấy vật phẩm", action: "warehouse_withdraw" },
    { text: "Quay lại", action: "back_to_base" },
  ]);
}

export function handleWarehouseDeposit() {
  const state = getState();
  const cap = getWarehouseCapacity(state.warehouseLevel);
  if (state.warehouse.length >= cap) {
    setStory("📦 Kho đã đầy rồi! Hãy lấy bớt vật phẩm ra để tạo chỗ trống nhé.");
    handleOpenWarehouse();
    return;
  }
  let items = [];
  state.food.forEach((item, i) => items.push({ ...item, cat: "food", idx: i, label: `[Thực phẩm] ${getItemDisplayName(item)}` }));
  state.drinks.forEach((item, i) => items.push({ ...item, cat: "drinks", idx: i, label: `[Đồ uống] ${getItemDisplayName(item)}` }));
  state.medicine.forEach((item, i) => items.push({ ...item, cat: "medicine", idx: i, label: `[Y tế] ${getItemDisplayName(item)}` }));
  state.other.forEach((item, i) => items.push({ ...item, cat: "other", idx: i, label: `[Khác] ${getItemDisplayName(item)}` }));
  if (state.seeds) state.seeds.forEach((item, i) => items.push({ ...item, cat: "seed", idx: i, label: `[Hạt giống] ${getItemDisplayName(item)}` }));
  if (state.cigarettes > 0) items.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá", label: `[Hàng hóa] (${state.cigarettes}) thuốc lá` });
  if (state.gasoline > 0) items.push({ cat: "gasoline", idx: 0, name: "Xăng", label: `[Hàng hóa] (${state.gasoline}) xăng` });
  if (state.pureEnergy > 0) items.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết", label: `[Hàng hóa] (${state.pureEnergy}) năng lượng tinh khiết` });
  if (items.length === 0) {
    setStory("📦 Ba lô trống trơn, không có gì để cất.");
    handleOpenWarehouse();
    return;
  }
  setPhase("warehouse_deposit_select");
  const opts = items.map((item, i) => ({ text: item.label, action: "do_deposit", index: i, depositItem: item }));
  opts.push({ text: "Quay lại", action: "back_to_warehouse", index: -1 });
  setOptions(opts);
}

export function handleWarehouseWithdraw() {
  const state = getState();
  if (state.warehouse.length === 0) {
    setStory("📦 Kho trống trơn, chẳng có gì.");
    handleOpenWarehouse();
    return;
  }
  setPhase("warehouse_withdraw_select");
  const opts = state.warehouse.map((item, i) => ({ text: `${getItemDisplayName(item)}`, action: "do_withdraw", index: i }));
  opts.push({ text: "Quay lại", action: "back_to_warehouse", index: -1 });
  setOptions(opts);
}

export function handleDoDeposit(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) { handleOpenWarehouse(); return; }
  const option = state.options[optIdx];
  if (option.action !== "do_deposit") { handleOpenWarehouse(); return; }
  if (option.action === "back") { handleOpenWarehouse(); return; }
  const item = option.depositItem;
  if (item.cat === "cigarettes") {
    const depositCount = Math.min(item.count || state.cigarettes, state.cigarettes);
    removeCigarettes(depositCount);
    state.warehouse.push({ id: "香烟", name: "Thuốc lá", type: "cigarette", count: depositCount });
  } else if (item.cat === "pureEnergy") {
    const depositCount = Math.min(item.count || state.pureEnergy, state.pureEnergy);
    removePureEnergy(depositCount);
    state.warehouse.push({ id: "纯净能源", name: "Năng lượng tinh khiết", type: "other", count: depositCount });
  } else {
    state.warehouse.push(item);
    const catMap = { food: state.food, drinks: state.drinks, medicine: state.medicine, other: state.other, seed: state.seeds };
    catMap[item.cat].splice(item.idx, 1);
  }
  const cap = getWarehouseCapacity(state.warehouseLevel);
  const usage = state.warehouse.length;
  setStory(`📦 Bạn cất ${getItemDisplayName(item)} vào kho.（${usage}/${cap} ô）`);
  if (!state.gameOver) {
    const updatedState = getState();
    let hasMoreItems = false;
    if (updatedState.food.length > 0 || updatedState.drinks.length > 0 || 
        updatedState.medicine.length > 0 || updatedState.other.length > 0 ||
        (updatedState.seeds && updatedState.seeds.length > 0) ||
        updatedState.cigarettes > 0 || updatedState.gasoline > 0 || updatedState.pureEnergy > 0) {
      hasMoreItems = true;
    }
    if (hasMoreItems) {
      handleWarehouseDeposit();
    } else {
      handleOpenWarehouse();
    }
  }
}

export function handleDoWithdraw(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) { handleOpenWarehouse(); return; }
  const option = state.options[optIdx];
  if (option.action !== "do_withdraw") { handleOpenWarehouse(); return; }
  if (option.action === "back") { handleOpenWarehouse(); return; }
  const item = state.warehouse[option.index];
  const added = addItem({ ...item });
  if (!added) {
    setStory("🎒 Ba lô của bạn đã đầy, không mang thêm được nữa. Hãy dọn dẹp chỗ trống trong ba lô trước nhé.");
    handleOpenWarehouse();
    return;
  }
  state.warehouse.splice(option.index, 1);
  const cap2 = getWarehouseCapacity(state.warehouseLevel);
  setStory(`📦 Bạn lấy ${getItemDisplayName(item)} từ trong kho ra.（${state.warehouse.length}/${cap2} ô）`);
  if (!state.gameOver) {
    const updatedState = getState();
    if (updatedState.warehouse.length > 0) {
      handleWarehouseWithdraw();
    } else {
      handleOpenWarehouse();
    }
  }
}

export function handleWarehouseMenuAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "warehouse_deposit") handleWarehouseDeposit();
  else if (action === "warehouse_withdraw") handleWarehouseWithdraw();
  else showBaseBuildOptions();
}

export { handleSeedSelect };
