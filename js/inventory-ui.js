/* ============================================================
   Inventory UI Upgrade — Zombie World RPG (Phase 3 & 3.1)
   Giao diện kho đồ trực quan dạng thẻ bài hậu tận thế
   Bảo đảm 100% Index Mapping & Reference Lifecycle chính xác
   ============================================================ */

import {
  getState,
  setStory,
  getBackpackCount,
  getItemDisplayName,
  formatQualityName,
  isStackableType,
  consumeItem,
  equipMelee,
  equipRanged,
  removeItem,
  updateStatusEffects,
  checkDeath,
} from './state.js';

import {
  GAME_CONSTANTS,
  DEFAULT_ITEM_IDS,
} from './config.js';

import {
  getItemIconPath,
} from './item-icon-mapping.js';

/**
 * Danh sách Tab phân loại theo dữ liệu game thực tế
 */
export const INVENTORY_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'weapons', label: 'Vũ khí' },
  { id: 'equipment', label: 'Trang bị' },
  { id: 'food', label: 'Thực phẩm' },
  { id: 'drinks', label: 'Đồ uống' },
  { id: 'medicine', label: 'Y tế' },
  { id: 'materials', label: 'Vật liệu & Khác' },
];

/** Cờ ngăn chặn thực hiện hành động trùng lặp do nhấp chuột nhanh */
let isActionBusy = false;

/**
 * Tính toán dung lượng balo từ đối tượng state theo đúng chuẩn gameplay
 * @param {Object} state - Trạng thái game
 * @returns {number} Số đơn vị dung lượng đã dùng
 */
export function calculateBackpackCount(state) {
  if (!state) return getBackpackCount();
  const getCount = (arr) => (Array.isArray(arr) ? arr : []).reduce((sum, item) => sum + (item.count || 1), 0);
  return (
    getCount(state.food) +
    getCount(state.drinks) +
    getCount(state.medicine) +
    getCount(state.other) +
    getCount(state.seeds)
  );
}

/**
 * Lấy đường dẫn icon tương ứng từ kho asset SwisserAI v1.0 (hoặc fallback Batch 01)
 * @param {Object} item - Vật phẩm
 * @param {'100'|'256'} [size='100'] - Kích thước ảnh ('100' cho danh sách thẻ, '256' cho modal chi tiết)
 * @returns {string} Đường dẫn asset hình ảnh
 */
export function getItemIcon(item, size = '100') {
  if (!item) return 'public/assets/icons/ui_placeholder_empty.png';
  if (item.icon && typeof item.icon === 'string') return item.icon;

  // 1. Ánh xạ ngữ nghĩa tập trung từ bộ SwisserAI FiveM Inventory Icons v1.0 (Batch 05)
  const mappedIcon = getItemIconPath(item, size);
  if (mappedIcon) return mappedIcon;

  const type = item.type || item.category;

  if (type === 'melee' || item.equippedSlot === 'melee') {
    return 'public/assets/icons/ui_icon_melee_slot.png';
  }
  if (type === 'ranged' || item.equippedSlot === 'ranged') {
    return 'public/assets/icons/ui_icon_ranged_slot.png';
  }
  if (type === 'backpack') {
    return 'public/assets/icons/ui_icon_backpack.png';
  }
  if (type === 'food' || type === 'fruit' || type === 'fish') {
    return 'public/assets/icons/ui_icon_hunger.png';
  }
  if (type === 'drink' || type === 'drinks') {
    return 'public/assets/icons/ui_icon_hydration.png';
  }
  if (type === 'medicine') {
    return 'public/assets/icons/ui_icon_hp.png';
  }
  if (type === 'ammo') {
    return 'public/assets/icons/ui_icon_ranged_slot.png';
  }
  if (type === 'cigarette') {
    return 'public/assets/icons/ui_icon_res_cigarette.png';
  }
  if (type === 'gasoline') {
    return 'public/assets/icons/ui_icon_res_gasoline.png';
  }
  if (type === 'royal_coin') {
    return 'public/assets/icons/ui_icon_res_royal_coin.png';
  }
  if (type === 'pure_energy' || type === 'pureEnergy' || item.id === 'nang_luong_tinh_khiet') {
    return 'public/assets/icons/ui_icon_pure_energy.png';
  }

  return 'public/assets/icons/ui_placeholder_empty.png';
}

/**
 * Thu thập và chuẩn hóa toàn bộ vật phẩm trong kho đồ với live references
 * @param {Object} state - Trạng thái game
 * @returns {Array} Danh sách vật phẩm đã gắn UID và thông tin hiển thị
 */
export function getAllInventoryItems(state) {
  if (!state) return [];
  const items = [];

  // 1. Vũ khí cận chiến đang trang bị
  if (state.meleeWeapon) {
    items.push({
      ...state.meleeWeapon,
      rawTarget: 'equipped_melee',
      rawItem: state.meleeWeapon,
      uid: 'equipped_melee_' + state.meleeWeapon.id,
      category: 'equipped_melee',
      isEquipped: true,
      equippedSlot: 'melee',
      count: 1,
      itemGroup: 'weapons',
    });
  }

  // 2. Vũ khí tầm xa đang trang bị
  if (state.rangedWeapon) {
    items.push({
      ...state.rangedWeapon,
      rawTarget: 'equipped_ranged',
      rawItem: state.rangedWeapon,
      uid: 'equipped_ranged_' + state.rangedWeapon.id,
      category: 'equipped_ranged',
      isEquipped: true,
      equippedSlot: 'ranged',
      count: 1,
      itemGroup: 'weapons',
    });
  }

  // 3. Thức ăn (food, fruit, fish)
  (state.food || []).forEach((item, idx) => {
    items.push({
      ...item,
      rawTarget: 'food',
      rawItem: item,
      uid: `food_${item.id}_${idx}`,
      category: 'food',
      count: item.count || 1,
      itemGroup: 'food',
    });
  });

  // 4. Đồ uống
  (state.drinks || []).forEach((item, idx) => {
    items.push({
      ...item,
      rawTarget: 'drinks',
      rawItem: item,
      uid: `drinks_${item.id}_${idx}`,
      category: 'drinks',
      count: item.count || 1,
      itemGroup: 'drinks',
    });
  });

  // 5. Y tế
  (state.medicine || []).forEach((item, idx) => {
    items.push({
      ...item,
      rawTarget: 'medicine',
      rawItem: item,
      uid: `medicine_${item.id}_${idx}`,
      category: 'medicine',
      count: item.count || 1,
      itemGroup: 'medicine',
    });
  });

  // 6. Vật phẩm khác (Vũ khí trong balo, balo phụ, vật liệu, đồ đặc biệt)
  (state.other || []).forEach((item, idx) => {
    let group = 'materials';
    if (item.type === 'melee' || item.type === 'ranged') group = 'weapons';
    else if (item.type === 'backpack') group = 'equipment';
    else if (item.type === 'building') group = 'materials';

    items.push({
      ...item,
      rawTarget: 'other',
      rawItem: item,
      uid: `other_${item.id}_${item.currentDurability ?? ''}_${item.integrity ?? ''}_${idx}`,
      category: 'other',
      count: item.count || 1,
      itemGroup: group,
    });
  });

  // 7. Hạt giống
  (state.seeds || []).forEach((item, idx) => {
    items.push({
      ...item,
      rawTarget: 'seeds',
      rawItem: item,
      uid: `seeds_${item.id}_${idx}`,
      category: 'seeds',
      count: item.count || 1,
      itemGroup: 'materials',
    });
  });

  // 8. Đạn dược
  (state.ammo || []).forEach((item, idx) => {
    items.push({
      ...item,
      rawTarget: 'ammo',
      rawItem: item,
      uid: `ammo_${item.id}_${idx}`,
      category: 'ammo',
      count: item.count || 1,
      itemGroup: 'weapons',
    });
  });

  return items;
}

/**
 * Lọc danh sách vật phẩm theo Tab hiện tại
 * @param {Array} items - Danh sách vật phẩm
 * @param {string} tab - ID tab
 * @returns {Array} Vật phẩm phù hợp
 */
export function filterItemsByTab(items, tab) {
  if (!Array.isArray(items)) return [];
  if (!tab || tab === 'all') return items;
  if (tab === 'weapons') {
    return items.filter(i => i.itemGroup === 'weapons' || i.type === 'melee' || i.type === 'ranged' || i.type === 'ammo');
  }
  if (tab === 'equipment') {
    return items.filter(i => i.isEquipped || i.type === 'melee' || i.type === 'ranged' || i.type === 'backpack' || i.type === 'ammo');
  }
  if (tab === 'food') {
    return items.filter(i => i.itemGroup === 'food' || i.type === 'food' || i.type === 'fruit' || i.type === 'fish');
  }
  if (tab === 'drinks') {
    return items.filter(i => i.itemGroup === 'drinks' || i.type === 'drink' || i.type === 'drinks');
  }
  if (tab === 'medicine') {
    return items.filter(i => i.itemGroup === 'medicine' || i.type === 'medicine');
  }
  if (tab === 'materials') {
    return items.filter(i => i.itemGroup === 'materials' || i.type === 'building' || i.type === 'seed' || i.category === 'seeds' || i.type === 'other');
  }
  return items;
}

/**
 * Tìm vị trí trực tiếp và chỉ số thực tế trong mảng gốc của state
 * @param {Object} state - Trạng thái game
 * @param {Object} item - Vật phẩm tham chiếu
 * @returns {{targetArray: Array, index: number, currentItem: Object}|null}
 */
export function findItemLiveLocation(state, item) {
  if (!state || !item || !item.rawTarget) return null;
  const targetArray = state[item.rawTarget];
  if (!Array.isArray(targetArray) || targetArray.length === 0) return null;

  // 1. Đối chiếu trực tiếp qua tham chiếu bộ nhớ (Object Reference)
  if (item.rawItem) {
    const refIdx = targetArray.indexOf(item.rawItem);
    if (refIdx !== -1) {
      return { targetArray, index: refIdx, currentItem: targetArray[refIdx] };
    }
  }

  // 2. Đối chiếu qua ID và thuộc tính đặc trưng (độ bền / độ nguyên vẹn)
  const matchIdx = targetArray.findIndex(x => {
    if (x.id !== item.id) return false;
    if (item.currentDurability !== undefined && x.currentDurability !== item.currentDurability) return false;
    if (item.integrity !== undefined && x.integrity !== item.integrity) return false;
    return true;
  });
  if (matchIdx !== -1) {
    return { targetArray, index: matchIdx, currentItem: targetArray[matchIdx] };
  }

  // 3. Dự phòng đối chiếu theo ID
  const idIdx = targetArray.findIndex(x => x.id === item.id);
  if (idIdx !== -1) {
    return { targetArray, index: idIdx, currentItem: targetArray[idIdx] };
  }

  return null;
}

/**
 * Trả về chuỗi thông tin ngắn cho card
 * @param {Object} item - Vật phẩm
 * @returns {string} Text mô tả ngắn gọn
 */
function getItemShortStat(item) {
  if (item.type === 'melee' || item.equippedSlot === 'melee') {
    return `⚔️ ST: ${item.damage}`;
  }
  if (item.type === 'ranged' || item.equippedSlot === 'ranged') {
    return `🔫 ST: ${item.damage}`;
  }
  if (item.type === 'backpack') {
    return `🎒 Chứa: ${item.capacity}`;
  }
  if (item.type === 'food' || item.type === 'fruit' || item.type === 'fish') {
    return item.hunger ? `🍖 No: +${item.hunger}` : '🍖 Thực phẩm';
  }
  if (item.type === 'drink' || item.type === 'drinks') {
    return item.hydration ? `💧 Nước: +${item.hydration}` : '💧 Đồ uống';
  }
  if (item.type === 'medicine') {
    if (item.effects?.health) return `❤️ HP: +${item.effects.health}`;
    if (item.effects?.infection) return `☣️ Giải: ${item.effects.infection}`;
    return '💊 Y tế';
  }
  if (item.type === 'ammo') {
    return `💥 ${item.count} viên`;
  }
  if (item.type === 'building') {
    return '🧱 Vật liệu';
  }
  if (item.type === 'seed' || item.category === 'seeds') {
    return '🌱 Hạt giống';
  }
  return '🧰 Vật phẩm';
}

/**
 * Trả về nhãn thể loại vật phẩm
 * @param {Object} item - Vật phẩm
 * @returns {string} Nhãn tiếng Việt
 */
function getItemCategoryLabel(item) {
  if (item.isEquipped) {
    return item.equippedSlot === 'melee' ? 'Cận chiến đang dùng' : 'Tầm xa đang dùng';
  }
  if (item.type === 'melee') return 'Vũ khí cận chiến';
  if (item.type === 'ranged') return 'Vũ khí tầm xa';
  if (item.type === 'backpack') return 'Túi / Ba lô';
  if (item.type === 'food' || item.type === 'fruit') return 'Thực phẩm sinh tồn';
  if (item.type === 'fish') return 'Thủy sản đánh bắt';
  if (item.type === 'drink' || item.type === 'drinks') return 'Nước giải khát';
  if (item.type === 'medicine') return 'Dược phẩm y tế';
  if (item.type === 'ammo') return 'Đạn dược súng';
  if (item.type === 'building') return 'Vật liệu chế tạo';
  if (item.type === 'seed' || item.category === 'seeds') return 'Hạt giống nông sản';
  return 'Vật phẩm sinh tồn';
}

/**
 * Render thẻ chi tiết vật phẩm đang chọn
 * @param {Object} item - Vật phẩm được chọn
 * @param {Object} state - Trạng thái game
 * @returns {string} HTML chi tiết vật phẩm
 */
function renderItemDetailHtml(item, state) {
  if (!item) {
    return `<div class="inv-detail-hint">Nhấp vào một vật phẩm để xem chi tiết & thao tác</div>`;
  }

  const iconUrl = getItemIcon(item, '256');
  const categoryLabel = getItemCategoryLabel(item);
  const isEquipped = !!item.isEquipped;

  // Thống kê chỉ số chi tiết
  const stats = [];
  stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Số lượng:</span> <span class="inv-stat-val">${item.count || 1}</span></div>`);

  if (item.type === 'melee' || item.equippedSlot === 'melee') {
    stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Sát thương:</span> <span class="inv-stat-val text-warn">${item.damage}</span></div>`);
    const durText = item.durability === Infinity ? 'Vô hạn' : (item.currentDurability !== undefined ? `${item.currentDurability}/${item.durability}` : `${item.durability}`);
    stats.push(`<div class="inv-stat-item"><span class="inv-stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_durability.png" alt="" onerror="this.style.display='none'">Độ bền:</span> <span class="inv-stat-val">${durText}</span></div>`);
    if (item.comboRate) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Liên kích:</span> <span class="inv-stat-val text-cyan">${Math.round(item.comboRate * 100)}%</span></div>`);
  } else if (item.type === 'ranged' || item.equippedSlot === 'ranged') {
    stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Sát thương:</span> <span class="inv-stat-val text-warn">${item.damage}</span></div>`);
    if (item.integrity !== undefined) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Độ nguyên vẹn:</span> <span class="inv-stat-val">${item.integrity}</span></div>`);
    if (item.ammoType) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Loại đạn:</span> <span class="inv-stat-val text-yellow">${item.ammoType}</span></div>`);
    if (item.critRate) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Chí mạng:</span> <span class="inv-stat-val text-purple">${Math.round(item.critRate * 100)}%</span></div>`);
  } else if (item.type === 'backpack') {
    stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Sức chứa:</span> <span class="inv-stat-val text-green">${item.capacity} ô</span></div>`);
  }

  // Dinh dưỡng / Cấp nước
  if (item.hunger) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Bụng no:</span> <span class="inv-stat-val text-green">+${item.hunger}</span></div>`);
  if (item.hydration) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Cấp nước:</span> <span class="inv-stat-val text-blue">+${item.hydration}</span></div>`);

  // Hiệu ứng dược tính / đặc biệt
  if (item.effects) {
    if (item.effects.health) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Sức khỏe (HP):</span> <span class="inv-stat-val text-green">+${item.effects.health}</span></div>`);
    if (item.effects.infection) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Lây nhiễm:</span> <span class="inv-stat-val text-purple">${item.effects.infection > 0 ? '+' : ''}${item.effects.infection}</span></div>`);
    if (item.effects.crash) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_fatigue.png" alt="" onerror="this.style.display='none'">Mệt mỏi:</span> <span class="inv-stat-val text-yellow">${item.effects.crash > 0 ? '+' : ''}${item.effects.crash}</span></div>`);
    if (item.effects.sanity) stats.push(`<div class="inv-stat-item"><span class="inv-stat-label">Lý trí:</span> <span class="inv-stat-val text-cyan">${item.effects.sanity > 0 ? '+' : ''}${item.effects.sanity}</span></div>`);
  }

  // Action Buttons
  const buttons = [];

  if (item.rawTarget === 'food') {
    buttons.push(`<button class="inv-action-btn btn-use" data-action="eat">🍞 Ăn</button>`);
  } else if (item.rawTarget === 'drinks') {
    buttons.push(`<button class="inv-action-btn btn-use" data-action="drink">🥤 Uống</button>`);
  } else if (item.rawTarget === 'medicine') {
    buttons.push(`<button class="inv-action-btn btn-use" data-action="heal">💊 Sử dụng</button>`);
  }

  if (item.type === 'melee' && !isEquipped) {
    buttons.push(`<button class="inv-action-btn btn-equip" data-action="equip_melee">⚔️ Trang bị</button>`);
  } else if (isEquipped && item.equippedSlot === 'melee' && item.id !== DEFAULT_ITEM_IDS.melee) {
    buttons.push(`<button class="inv-action-btn btn-unequip" data-action="unequip_melee">🛡️ Tháo (Về tay không)</button>`);
  }

  if (item.type === 'ranged' && !isEquipped) {
    buttons.push(`<button class="inv-action-btn btn-equip" data-action="equip_ranged">🔫 Trang bị</button>`);
  } else if (isEquipped && item.equippedSlot === 'ranged') {
    buttons.push(`<button class="inv-action-btn btn-unequip" data-action="unequip_ranged">🔫 Tháo súng</button>`);
  }

  if (item.type === 'backpack' && !isEquipped) {
    buttons.push(`<button class="inv-action-btn btn-equip" data-action="swap_backpack">🎒 Đổi túi này</button>`);
  }

  // Nút vứt bỏ (cho vật phẩm trong túi, không áp dụng cho trang bị đang đeo)
  if (!isEquipped && item.rawTarget !== 'ammo') {
    buttons.push(`<button class="inv-action-btn btn-discard" data-action="discard">🗑️ Vứt bỏ</button>`);
  }

  return `
<div class="inv-detail-panel">
  <div class="inv-detail-header">
    <div class="inv-detail-title-group">
      <img class="inv-detail-icon" src="${iconUrl}" alt="" onerror="this.src='public/assets/icons/ui_placeholder_empty.png'">
      <div>
        <div class="inv-detail-name">${formatQualityName(item)}</div>
        <div class="inv-detail-tag">${categoryLabel}</div>
      </div>
    </div>
    <button class="inv-detail-close" title="Đóng chi tiết">✕</button>
  </div>
  <div class="inv-detail-stats">${stats.join('')}</div>
  ${buttons.length > 0 ? `<div class="inv-detail-actions">${buttons.join('')}</div>` : ''}
</div>`;
}

let currentDiscardTarget = null;
let currentDiscardState = null;
let currentDiscardRerender = null;
let isDiscardBusy = false;

function handleDiscardKeyDown(e) {
  if (e.key === 'Escape') {
    closeDiscardModal();
  }
}

export function closeDiscardModal() {
  currentDiscardTarget = null;
  currentDiscardState = null;
  currentDiscardRerender = null;
  isDiscardBusy = false;
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('discard-confirm-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.removeEventListener('keydown', handleDiscardKeyDown);
}

export function openDiscardModal(item, state, rerender) {
  if (!item || !state) return;
  if (typeof document === 'undefined') return;

  const modal = document.getElementById('discard-confirm-modal');
  if (!modal) return;

  currentDiscardTarget = item;
  currentDiscardState = state;
  currentDiscardRerender = rerender;
  isDiscardBusy = false;

  const nameEl = document.getElementById('discard-item-name');
  const stockEl = document.getElementById('discard-item-stock');
  const iconEl = document.getElementById('discard-item-icon');
  const qtyRow = document.getElementById('discard-qty-row');
  const qtyInput = document.getElementById('discard-qty-input');
  const qtyMinus = document.getElementById('discard-qty-minus');
  const qtyPlus = document.getElementById('discard-qty-plus');
  const qtyAll = document.getElementById('discard-qty-all');
  const confirmBtn = document.getElementById('discard-confirm-btn');
  const cancelBtn = document.getElementById('discard-cancel-btn');
  const closeBtn = document.getElementById('discard-modal-close');

  const loc = findItemLiveLocation(state, item);
  const liveItem = loc ? loc.currentItem : (item.rawItem || item);
  const totalCount = Math.max(1, liveItem.count || 1);

  if (nameEl) nameEl.innerHTML = formatQualityName(liveItem);
  if (stockEl) stockEl.textContent = `Số lượng có: ${totalCount}`;
  if (iconEl) {
    iconEl.src = getItemIconPath(liveItem.id, liveItem.type);
    iconEl.onerror = () => { iconEl.src = 'public/assets/icons/ui_placeholder_empty.png'; };
  }

  if (qtyRow && qtyInput) {
    if (totalCount > 1) {
      qtyRow.style.display = 'flex';
      qtyInput.max = totalCount;
      qtyInput.min = 1;
      qtyInput.value = 1;
    } else {
      qtyRow.style.display = 'none';
      qtyInput.value = 1;
    }
  }

  const updateQty = (val) => {
    let num = parseInt(val, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > totalCount) num = totalCount;
    if (qtyInput) qtyInput.value = num;
  };

  if (qtyMinus) {
    qtyMinus.onclick = (e) => {
      e.stopPropagation();
      updateQty(parseInt(qtyInput.value, 10) - 1);
    };
  }
  if (qtyPlus) {
    qtyPlus.onclick = (e) => {
      e.stopPropagation();
      updateQty(parseInt(qtyInput.value, 10) + 1);
    };
  }
  if (qtyAll) {
    qtyAll.onclick = (e) => {
      e.stopPropagation();
      updateQty(totalCount);
    };
  }
  if (qtyInput) {
    qtyInput.oninput = () => {
      updateQty(qtyInput.value);
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      closeDiscardModal();
    };
  }
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeDiscardModal();
    };
  }
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeDiscardModal();
    }
  };

  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.onclick = (e) => {
      e.stopPropagation();
      if (isDiscardBusy) return;
      isDiscardBusy = true;
      confirmBtn.disabled = true;

      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      const targetItem = currentDiscardTarget;
      const st = currentDiscardState;
      const cb = currentDiscardRerender;

      closeDiscardModal();
      if (targetItem && st) {
        executeInventoryAction('discard', targetItem, st, cb, qty);
      }
    };
  }

  modal.style.display = 'flex';
  document.addEventListener('keydown', handleDiscardKeyDown);
}

/**
 * Xử lý tương tác hành động từ giao diện Item Detail
 * Áp dụng giải pháp Index Mapping trực tiếp và chống click đúp
 * @param {string} action - Hành động
 * @param {Object} item - Vật phẩm được chọn
 * @param {Object} state - Trạng thái game
 * @param {Function} rerender - Callback render lại toàn bộ UI
 * @param {number} [qty=1] - Số lượng thao tác (nếu có)
 */
export function executeInventoryAction(action, item, state, rerender, qty = 1) {
  if (!item || !action || !state) return;
  if (isActionBusy) return;

  isActionBusy = true;
  try {
    if (action === 'eat') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'food') {
        setStory('Vật phẩm này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
        setStory('Cơ thể bạn đã hoàn toàn kiệt sức, không muốn ăn bất cứ thứ gì. Hãy dùng vật phẩm y tế trước.');
        rerender();
        return;
      }
      const targetItem = loc.currentItem;
      const result = consumeItem('food', loc.index);
      if (result) {
        let msg = `Bạn đã ăn ${getItemDisplayName(targetItem)}.`;
        if (result.hunger) msg += ` độ no+${result.hunger}`;
        if (result.hydration) msg += ` nước+${result.hydration}`;
        if (result.effects?.health) msg += ` HP+${result.effects.health}`;
        if (result.effects?.infection) msg += ` nhiễm${result.effects.infection > 0 ? '+' : ''}${result.effects.infection}`;
        if (result.effects?.crash) msg += ` mệt${result.effects.crash > 0 ? '+' : ''}${result.effects.crash}`;
        if (result.effects?.sanity) msg += ` lý trí${result.effects.sanity > 0 ? '+' : ''}${result.effects.sanity}`;
        setStory(msg);
        updateStatusEffects();
        checkDeath();
      }
    } else if (action === 'drink') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'drinks') {
        setStory('Đồ uống này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
        setStory('Cơ thể bạn đã hoàn toàn kiệt sức, không muốn uống bất cứ thứ gì. Hãy dùng vật phẩm y tế trước.');
        rerender();
        return;
      }
      const targetItem = loc.currentItem;
      const result = consumeItem('drinks', loc.index);
      if (result) {
        let msg = `Bạn đã uống ${getItemDisplayName(targetItem)}.`;
        if (result.hydration) msg += ` nước+${result.hydration}`;
        if (result.effects?.sanity) msg += ` lý trí${result.effects.sanity > 0 ? '+' : ''}${result.effects.sanity}`;
        if (result.effects?.crash) msg += ` mệt${result.effects.crash > 0 ? '+' : ''}${result.effects.crash}`;
        setStory(msg);
        updateStatusEffects();
        checkDeath();
      }
    } else if (action === 'heal') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'medicine') {
        setStory('Vật phẩm y tế này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      const targetItem = loc.currentItem;
      const result = consumeItem('medicine', loc.index);
      if (result) {
        let msg = `Bạn đã dùng ${getItemDisplayName(targetItem)}.`;
        if (result.effects?.health) msg += ` HP+${result.effects.health}`;
        if (result.effects?.infection) msg += ` nhiễm${result.effects.infection > 0 ? '+' : ''}${result.effects.infection}`;
        if (result.effects?.crash) msg += ` mệt${result.effects.crash > 0 ? '+' : ''}${result.effects.crash}`;
        if (result.effects?.sanity) msg += ` lý trí${result.effects.sanity > 0 ? '+' : ''}${result.effects.sanity}`;
        setStory(msg);
        updateStatusEffects();
        checkDeath();
      }
    } else if (action === 'equip_melee') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'other') {
        setStory('Vũ khí này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      // Bảo đảm hoán đổi đúng vị trí của vũ khí được chỉ định
      const firstIdx = (state.other || []).findIndex(x => x.id === item.id && x.type === 'melee');
      if (firstIdx !== -1 && firstIdx !== loc.index) {
        const temp = state.other[firstIdx];
        state.other[firstIdx] = state.other[loc.index];
        state.other[loc.index] = temp;
      }
      const equipped = equipMelee(item.id);
      if (equipped) {
        setStory(`Bạn đã trang bị vũ khí cận chiến: ${equipped.name}.`);
      }
    } else if (action === 'unequip_melee') {
      const fist = equipMelee(DEFAULT_ITEM_IDS.melee);
      setStory(`Bạn đã tháo vũ khí cận chiến, chuyển sang dùng ${fist.name}.`);
    } else if (action === 'equip_ranged') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'other') {
        setStory('Vũ khí này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      const firstIdx = (state.other || []).findIndex(x => x.id === item.id && x.type === 'ranged');
      if (firstIdx !== -1 && firstIdx !== loc.index) {
        const temp = state.other[firstIdx];
        state.other[firstIdx] = state.other[loc.index];
        state.other[loc.index] = temp;
      }
      const equipped = equipRanged(item.id);
      if (equipped) {
        setStory(`Bạn đã trang bị vũ khí tầm xa: ${equipped.name}.`);
      }
    } else if (action === 'unequip_ranged') {
      if (state.rangedWeapon) {
        const name = state.rangedWeapon.name;
        state.other.push(state.rangedWeapon);
        state.rangedWeapon = null;
        setStory(`Bạn đã tháo ${name} cất vào balo.`);
      }
    } else if (action === 'swap_backpack') {
      const loc = findItemLiveLocation(state, item);
      if (!loc || item.rawTarget !== 'other' || loc.currentItem.type !== 'backpack') {
        setStory('Túi này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      const currentCount = calculateBackpackCount(state);
      if (currentCount > loc.currentItem.capacity) {
        setStory(`⚠️ Không thể đổi túi! Số lượng vật phẩm trong balo (${currentCount}) vượt quá sức chứa túi mới (${loc.currentItem.capacity}).`);
        rerender();
        return;
      }
      const oldBag = state.backpack;
      state.backpack = state.other.splice(loc.index, 1)[0];
      state.other.push(oldBag);
      setStory(`Bạn đã đổi sang túi ${state.backpack.name} (sức chứa ${state.backpack.capacity} ô).`);
    } else if (action === 'discard') {
      const loc = findItemLiveLocation(state, item);
      if (!loc) {
        setStory('Vật phẩm này không còn trong balo.');
        state._selectedInvItem = null;
        rerender();
        return;
      }
      const removeType = item.rawTarget === 'seeds' || loc.currentItem.type === 'seed'
        ? 'seed'
        : (item.rawTarget === 'drinks' ? 'drinks' : (item.rawTarget === 'medicine' ? 'medicine' : (item.rawTarget === 'food' ? (loc.currentItem.type === 'fruit' ? 'fruit' : 'food') : 'other')));

      const itemName = loc.currentItem.name || item.name;
      const discardQty = Math.max(1, Math.min(qty || 1, loc.currentItem.count || 1));
      const removed = removeItem(removeType, loc.index, discardQty);
      if (removed) {
        setStory(`Bạn đã vứt bỏ ${discardQty}x ${itemName}.`);
      } else {
        setStory('Không thể vứt bỏ vật phẩm này.');
      }
    }

    // Xác thực lại trạng thái của vật phẩm đang chọn
    const allCurrent = getAllInventoryItems(state);
    const stillExists = allCurrent.some(i => 
      (item.rawItem && i.rawItem && i.rawItem === item.rawItem) ||
      i.uid === item.uid
    );
    if (!stillExists) {
      state._selectedInvItem = null;
    }
  } finally {
    setTimeout(() => { isActionBusy = false; }, 80);
  }

  rerender();
}

/**
 * Render toàn bộ component Inventory Visual UI
 * @param {Object} state - Trạng thái game
 * @param {Function} rerenderCallback - Hàm gọi renderAll của UI
 */
export function renderInventoryComponent(state, rerenderCallback) {
  const panel = document.getElementById('inventory-panel');
  if (!panel || !state) return;

  const currentCount = Math.max(0, calculateBackpackCount(state));
  const capacity = Math.max(1, state.backpack?.capacity || 20);
  const capPct = Math.max(0, Math.min(100, Math.round((currentCount / capacity) * 100)));

  let capClass = 'cap-normal';
  if (capPct >= 100) capClass = 'cap-full';
  else if (capPct >= 70) capClass = 'cap-warning';

  const activeTab = state._invTab || 'all';
  const allItems = getAllInventoryItems(state);

  // Đồng bộ Selected Item Lifecycle: kiểm tra vật phẩm đang chọn còn sống không
  if (state._selectedInvItem) {
    const liveItem = allItems.find(i => 
      (state._selectedInvItem.rawItem && i.rawItem && i.rawItem === state._selectedInvItem.rawItem) ||
      i.uid === state._selectedInvItem.uid ||
      (i.id === state._selectedInvItem.id && i.rawTarget === state._selectedInvItem.rawTarget)
    );
    if (liveItem) {
      state._selectedInvItem = liveItem;
    } else {
      state._selectedInvItem = null;
    }
  }

  // Tính số lượng cho mỗi tab
  const tabCounts = {};
  INVENTORY_TABS.forEach(t => {
    tabCounts[t.id] = filterItemsByTab(allItems, t.id).length;
  });

  const filteredItems = filterItemsByTab(allItems, activeTab);

  // Nếu tab chuyển sang danh mục không chứa vật phẩm đang chọn, xóa selection để tránh nhầm lẫn
  if (state._selectedInvItem && activeTab !== 'all') {
    const belongsToTab = filteredItems.some(i => i.uid === state._selectedInvItem.uid);
    if (!belongsToTab) {
      state._selectedInvItem = null;
    }
  }

  // Header Ba lô & Sức chứa
  const headerHtml = `
<div class="inv-header">
  <div class="inv-header-top">
    <span class="inv-header-title">
      <img class="ui-icon-inline" src="public/assets/icons/ui_icon_backpack.png" alt="" onerror="this.style.display='none'">
      ${state.backpack?.name || 'Ba lô'}
    </span>
    <span class="inv-capacity-text ${capClass}">${currentCount}/${capacity} ô</span>
  </div>
  <div class="inv-capacity-track">
    <div class="inv-capacity-fill ${capClass}" style="width: ${capPct}%;"></div>
  </div>
</div>`;

  // Thanh tab cuộn
  const tabsHtml = `
<div class="inv-tabs-scroll">
  ${INVENTORY_TABS.map(t => {
    const isActive = t.id === activeTab ? ' is-active' : '';
    const count = tabCounts[t.id] || 0;
    return `<button class="inv-tab${isActive}" data-tab="${t.id}">${t.label} <span class="inv-tab-count">(${count})</span></button>`;
  }).join('')}
</div>`;

  // Danh sách thẻ vật phẩm
  let contentHtml = '';
  if (filteredItems.length === 0) {
    contentHtml = `
<div class="inv-empty-state">
  <img class="inv-empty-icon" src="public/assets/icons/ui_placeholder_empty.png" alt="">
  <div class="inv-empty-title">Ngăn trống</div>
  <div class="inv-empty-desc">Không có vật phẩm nào trong mục này</div>
</div>`;
  } else {
    const selectedUid = state._selectedInvItem ? state._selectedInvItem.uid : null;
    const cardsHtml = filteredItems.map(item => {
      const isSelected = item.uid === selectedUid;
      const cardClasses = ['inv-card'];
      if (isSelected) cardClasses.push('is-selected');
      if (item.isEquipped) cardClasses.push('is-equipped');

      const iconUrl = getItemIcon(item, '100');
      const shortStat = getItemShortStat(item);
      const badgeHtml = item.isEquipped
        ? `<span class="inv-badge-equipped">Đang dùng</span>`
        : ((item.count || 1) > 1 ? `<span class="inv-badge-count">×${item.count}</span>` : '');

      return `
<div class="${cardClasses.join(' ')}" data-uid="${item.uid}" title="${item.name}">
  ${badgeHtml}
  <div class="inv-card-icon-box">
    <img class="inv-card-icon" src="${iconUrl}" alt="${item.name}" onerror="this.src='public/assets/icons/ui_placeholder_empty.png'">
  </div>
  <div class="inv-card-name">${formatQualityName(item)}</div>
  <div class="inv-card-subtext">${shortStat}</div>
</div>`;
    }).join('');

    contentHtml = `<div class="inv-cards-grid">${cardsHtml}</div>`;
  }

  // Chi tiết vật phẩm đang chọn
  const detailHtml = renderItemDetailHtml(state._selectedInvItem, state);

  // Gắn HTML vào panel
  panel.innerHTML = `
<div class="inventory-panel-custom">
  ${headerHtml}
  ${tabsHtml}
  ${contentHtml}
  ${detailHtml}
</div>`;

  // Gán sự kiện tương tác
  // 1. Chuyển Tab
  const tabBtns = panel.querySelectorAll('.inv-tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tabId = btn.getAttribute('data-tab');
      state._invTab = tabId;
      renderInventoryComponent(state, rerenderCallback);
    });
  });

  // 2. Chọn Card
  const cards = panel.querySelectorAll('.inv-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const uid = card.getAttribute('data-uid');
      const item = allItems.find(i => i.uid === uid);
      if (item) {
        state._selectedInvItem = (state._selectedInvItem?.uid === uid) ? null : item;
        renderInventoryComponent(state, rerenderCallback);
      }
    });
  });

  // 3. Đóng chi tiết
  const closeBtn = panel.querySelector('.inv-detail-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state._selectedInvItem = null;
      renderInventoryComponent(state, rerenderCallback);
    });
  }

  // 4. Các nút hành động
  const actionBtns = panel.querySelectorAll('.inv-action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      if (state._selectedInvItem) {
        if (action === 'discard' && typeof document !== 'undefined' && document.getElementById('discard-confirm-modal')) {
          openDiscardModal(state._selectedInvItem, state, rerenderCallback);
          return;
        }
        executeInventoryAction(action, state._selectedInvItem, state, rerenderCallback);
      }
    });
  });
}
