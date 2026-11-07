/* ============================================================
   Warehouse UI — Zombie World RPG (Batch 08 Phase 8.3)
   Dual-pane grid interface for Base Warehouse and Backpack
   100% strict gameplay and save preservation
   ============================================================ */

import {
  getState,
  setStory,
  addItem,
  isStackableType,
  formatQualityName,
} from './state.js';

import { getItemIconPath } from './item-icon-mapping.js';
import { getWarehouseCapacity } from './base.js';
import {
  getAllInventoryItems,
  calculateBackpackCount,
  findItemLiveLocation,
} from './inventory-ui.js';

let selectedSide = null; // 'backpack' | 'warehouse' | null
let selectedBackpackItem = null;
let selectedWarehouseIndex = null;
let onWarehouseUpdateCallback = null;
let activeMobileWarehousePane = 'backpack'; // 'backpack' | 'warehouse'

/**
 * Lấy tab đang hoạt động của kho trên di động
 */
export function getMobileWarehousePane() {
  return activeMobileWarehousePane;
}

/**
 * Đặt tab kho đang hoạt động trên di động ('backpack' | 'warehouse')
 * @param {string} pane
 */
export function setMobileWarehousePane(pane) {
  activeMobileWarehousePane = (pane === 'warehouse') ? 'warehouse' : 'backpack';
  updateMobileWarehouseTabsUI();
}

/**
 * Cập nhật giao diện tabs kho di động và thuộc tính data-active-pane
 */
export function updateMobileWarehouseTabsUI() {
  if (typeof document === 'undefined') return;

  const modal = (typeof document.getElementById === 'function') ? document.getElementById('warehouse-modal') : null;
  const container = (typeof document.querySelector === 'function')
    ? document.querySelector('.warehouse-dual-container')
    : null;

  if (container && typeof container.setAttribute === 'function') {
    container.setAttribute('data-active-pane', activeMobileWarehousePane);
  }
  if (modal && typeof modal.setAttribute === 'function') {
    modal.setAttribute('data-active-pane', activeMobileWarehousePane);
  }

  const backpackTab = (typeof document.getElementById === 'function') ? document.getElementById('wh-tab-backpack') : null;
  const warehouseTab = (typeof document.getElementById === 'function') ? document.getElementById('wh-tab-warehouse') : null;

  const isBackpack = activeMobileWarehousePane === 'backpack';

  if (backpackTab && backpackTab.classList) {
    backpackTab.classList.toggle('is-active', isBackpack);
    if (typeof backpackTab.setAttribute === 'function') {
      backpackTab.setAttribute('aria-selected', isBackpack ? 'true' : 'false');
      backpackTab.setAttribute('tabindex', isBackpack ? '0' : '-1');
    }
  }

  if (warehouseTab && warehouseTab.classList) {
    warehouseTab.classList.toggle('is-active', !isBackpack);
    if (typeof warehouseTab.setAttribute === 'function') {
      warehouseTab.setAttribute('aria-selected', !isBackpack ? 'true' : 'false');
      warehouseTab.setAttribute('tabindex', !isBackpack ? '0' : '-1');
    }
  }
}

function initMobileWarehouseTabs() {
  if (typeof document === 'undefined') return;
  const backpackTab = document.getElementById('wh-tab-backpack');
  const warehouseTab = document.getElementById('wh-tab-warehouse');

  if (backpackTab) {
    backpackTab.onclick = (e) => {
      e.stopPropagation();
      setMobileWarehousePane('backpack');
    };
    backpackTab.onkeydown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setMobileWarehousePane('warehouse');
        const next = document.getElementById('wh-tab-warehouse');
        if (next && typeof next.focus === 'function') next.focus();
      }
    };
  }

  if (warehouseTab) {
    warehouseTab.onclick = (e) => {
      e.stopPropagation();
      setMobileWarehousePane('warehouse');
    };
    warehouseTab.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setMobileWarehousePane('backpack');
        const prev = document.getElementById('wh-tab-backpack');
        if (prev && typeof prev.focus === 'function') prev.focus();
      }
    };
  }

  updateMobileWarehouseTabsUI();
}

function handleWarehouseKeyDown(e) {
  if (e.key === 'Escape') {
    closeWarehouseModal();
  }
}

/**
 * Đóng modal kho căn cứ
 */
export function closeWarehouseModal() {
  selectedSide = null;
  selectedBackpackItem = null;
  selectedWarehouseIndex = null;
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('warehouse-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.removeEventListener('keydown', handleWarehouseKeyDown);
}

/**
 * Mở modal kho căn cứ hai cột
 * @param {Object} [state] - Trạng thái game
 * @param {Function} [onUpdate] - Callback gọi khi kho hoặc túi thay đổi
 */
export function openWarehouseModal(state, onUpdate) {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('warehouse-modal');
  if (!modal) return;

  onWarehouseUpdateCallback = onUpdate || null;
  selectedSide = null;
  selectedBackpackItem = null;
  selectedWarehouseIndex = null;
  activeMobileWarehousePane = 'backpack';

  const closeBtn = document.getElementById('warehouse-modal-close');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeWarehouseModal();
    };
  }
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeWarehouseModal();
    }
  };

  initMobileWarehouseTabs();

  modal.style.display = 'flex';
  document.addEventListener('keydown', handleWarehouseKeyDown);
  renderWarehouseModal(state || getState());
}

/**
 * Hiển thị thông báo trạng thái kho
 * @param {string} msg 
 */
function showWhStatus(msg) {
  const el = document.getElementById('wh-status-msg');
  if (el) el.textContent = msg;
}

/**
 * Xóa thông báo trạng thái kho
 */
function clearWhStatus() {
  const el = document.getElementById('wh-status-msg');
  if (el) el.textContent = '';
}

/**
 * Render toàn bộ giao diện hai cột của kho căn cứ
 * @param {Object} state 
 */
export function renderWarehouseModal(state) {
  if (typeof document === 'undefined') return;
  state = state || getState();
  if (!state.warehouse) state.warehouse = [];

  const whLevel = state.warehouseLevel || 0;
  const whCap = getWarehouseCapacity(whLevel);
  const whUsed = state.warehouse.length;
  const bpCap = state.backpack ? state.backpack.capacity : 20;
  const bpUsed = calculateBackpackCount(state);

  const levelBadge = document.getElementById('wh-level-badge');
  if (levelBadge) {
    levelBadge.textContent = `Cấp ${whLevel + 1} (${whUsed}/${whCap} ô)`;
  }

  const bpCapEl = document.getElementById('wh-backpack-cap');
  if (bpCapEl) {
    bpCapEl.textContent = `${bpUsed}/${bpCap} ô`;
    bpCapEl.classList.toggle('cap-full', bpUsed >= bpCap);
  }

  const whCapEl = document.getElementById('wh-warehouse-cap');
  if (whCapEl) {
    whCapEl.textContent = `${whUsed}/${whCap} ô`;
    whCapEl.classList.toggle('cap-full', whUsed >= whCap);
  }

  // 1. Render Backpack Grid (Bên trái)
  const bpGrid = document.getElementById('wh-backpack-grid');
  if (bpGrid) {
    const bpItems = getAllInventoryItems(state).filter(i => !i.isEquipped && i.rawTarget !== 'ammo');
    if (bpItems.length === 0) {
      bpGrid.innerHTML = `<div class="wh-empty-pane">Ba lô không có vật phẩm có thể cất</div>`;
    } else {
      bpGrid.innerHTML = bpItems.map((item) => {
        const isSelected = selectedSide === 'backpack' && selectedBackpackItem && selectedBackpackItem.uid === item.uid;
        const iconUrl = getItemIconPath(item.id, item.type);
        const countBadge = (item.count && item.count > 1) ? `<span class="wh-item-card-count">x${item.count}</span>` : '';
        return `
          <button type="button" class="wh-item-card ${isSelected ? 'is-selected' : ''}" data-uid="${item.uid}" title="${item.name}">
            ${countBadge}
            <div class="wh-item-card-icon-box">
              <img src="${iconUrl}" alt="" onerror="this.src='public/assets/icons/ui_placeholder_empty.png'">
            </div>
            <div class="wh-item-card-name">${formatQualityName(item)}</div>
          </button>
        `;
      }).join('');

      bpGrid.querySelectorAll('.wh-item-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const uid = card.getAttribute('data-uid');
          const found = bpItems.find(i => i.uid === uid);
          if (found) {
            selectedSide = 'backpack';
            selectedBackpackItem = found;
            selectedWarehouseIndex = null;
            clearWhStatus();
            renderWarehouseModal(state);
          }
        });
      });
    }
  }

  // 2. Render Warehouse Grid (Bên phải)
  const whGrid = document.getElementById('wh-warehouse-grid');
  if (whGrid) {
    if (state.warehouse.length === 0) {
      whGrid.innerHTML = `<div class="wh-empty-pane">Kho căn cứ hiện đang trống</div>`;
    } else {
      whGrid.innerHTML = state.warehouse.map((item, index) => {
        const isSelected = selectedSide === 'warehouse' && selectedWarehouseIndex === index;
        const iconUrl = getItemIconPath(item.id, item.type);
        const countBadge = (item.count && item.count > 1) ? `<span class="wh-item-card-count">x${item.count}</span>` : '';
        return `
          <button type="button" class="wh-item-card ${isSelected ? 'is-selected' : ''}" data-wh-index="${index}" title="${item.name}">
            ${countBadge}
            <div class="wh-item-card-icon-box">
              <img src="${iconUrl}" alt="" onerror="this.src='public/assets/icons/ui_placeholder_empty.png'">
            </div>
            <div class="wh-item-card-name">${formatQualityName(item)}</div>
          </button>
        `;
      }).join('');

      whGrid.querySelectorAll('.wh-item-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(card.getAttribute('data-wh-index'), 10);
          selectedSide = 'warehouse';
          selectedWarehouseIndex = index;
          selectedBackpackItem = null;
          clearWhStatus();
          renderWarehouseModal(state);
        });
      });
    }
  }

  // 3. Render Action Bar
  renderWarehouseActionBar(state);

  // 4. Update Mobile Tabs UI
  updateMobileWarehouseTabsUI();
}

/**
 * Render thanh điều khiển chuyển đồ
 * @param {Object} state 
 */
function renderWarehouseActionBar(state) {
  const infoEl = document.getElementById('wh-selected-info');
  const btnGroup = document.getElementById('wh-transfer-buttons');
  if (!infoEl || !btnGroup) return;

  if (selectedSide === 'backpack' && selectedBackpackItem) {
    const item = selectedBackpackItem;
    const totalCount = Math.max(1, item.count || 1);
    infoEl.innerHTML = `<span>Đã chọn (Ba lô): <strong>${formatQualityName(item)}</strong> (Có: ${totalCount})</span>`;
    btnGroup.style.display = 'flex';

    if (isStackableType(item) && totalCount > 1) {
      btnGroup.innerHTML = `
        <button id="wh-btn-dep-1" class="wh-btn wh-btn-deposit">Cất 1</button>
        <button id="wh-btn-dep-all" class="wh-btn wh-btn-bulk">Cất hết (${totalCount})</button>
      `;
      const b1 = document.getElementById('wh-btn-dep-1');
      const bAll = document.getElementById('wh-btn-dep-all');
      if (b1) {
        b1.onclick = (e) => {
          e.stopPropagation();
          depositBackpackItem(item, 1, state);
        };
      }
      if (bAll) {
        bAll.onclick = (e) => {
          e.stopPropagation();
          depositBackpackItem(item, totalCount, state);
        };
      }
    } else {
      btnGroup.innerHTML = `
        <button id="wh-btn-dep-1" class="wh-btn wh-btn-deposit">Cất vào kho</button>
      `;
      const b1 = document.getElementById('wh-btn-dep-1');
      if (b1) {
        b1.onclick = (e) => {
          e.stopPropagation();
          depositBackpackItem(item, 1, state);
        };
      }
    }
  } else if (selectedSide === 'warehouse' && selectedWarehouseIndex !== null && state.warehouse[selectedWarehouseIndex]) {
    const item = state.warehouse[selectedWarehouseIndex];
    const totalCount = Math.max(1, item.count || 1);
    infoEl.innerHTML = `<span>Đã chọn (Kho): <strong>${formatQualityName(item)}</strong> (Có: ${totalCount})</span>`;
    btnGroup.style.display = 'flex';

    if (isStackableType(item) && totalCount > 1) {
      btnGroup.innerHTML = `
        <button id="wh-btn-with-1" class="wh-btn wh-btn-withdraw">Lấy 1</button>
        <button id="wh-btn-with-all" class="wh-btn wh-btn-bulk">Lấy hết (${totalCount})</button>
      `;
      const b1 = document.getElementById('wh-btn-with-1');
      const bAll = document.getElementById('wh-btn-with-all');
      if (b1) {
        b1.onclick = (e) => {
          e.stopPropagation();
          withdrawWarehouseItem(selectedWarehouseIndex, 1, state);
        };
      }
      if (bAll) {
        bAll.onclick = (e) => {
          e.stopPropagation();
          withdrawWarehouseItem(selectedWarehouseIndex, totalCount, state);
        };
      }
    } else {
      btnGroup.innerHTML = `
        <button id="wh-btn-with-1" class="wh-btn wh-btn-withdraw">Lấy vào ba lô</button>
      `;
      const b1 = document.getElementById('wh-btn-with-1');
      if (b1) {
        b1.onclick = (e) => {
          e.stopPropagation();
          withdrawWarehouseItem(selectedWarehouseIndex, 1, state);
        };
      }
    }
  } else {
    infoEl.innerHTML = `<span class="wh-hint">Nhấp vào một vật phẩm ở Ba lô hoặc Kho để chuyển đồ</span>`;
    btnGroup.style.display = 'none';
    btnGroup.innerHTML = '';
  }
}

/**
 * Chuyển vật phẩm từ ba lô vào kho căn cứ
 * @param {Object} item 
 * @param {number} qty 
 * @param {Object} state 
 * @returns {boolean}
 */
export function depositBackpackItem(item, qty, state) {
  if (!item || !state) return false;
  if (!state.warehouse) state.warehouse = [];
  const whCap = getWarehouseCapacity(state.warehouseLevel || 0);

  // Tìm stack trùng trong kho (nếu có thể xếp chồng)
  let existingStack = null;
  if (isStackableType(item)) {
    existingStack = state.warehouse.find(w => w.id === item.id && w.type === item.type);
  }

  // Nếu không có stack sẵn và kho đã đầy thì chặn
  if (!existingStack && state.warehouse.length >= whCap) {
    showWhStatus(`⚠️ Kho căn cứ đã đầy (${state.warehouse.length}/${whCap} ô)! Không thể cất thêm.`);
    return false;
  }

  // Tìm vị trí thật của vật phẩm trong ba lô
  const loc = findItemLiveLocation(state, item);
  if (!loc) {
    showWhStatus('⚠️ Vật phẩm không còn trong ba lô.');
    selectedBackpackItem = null;
    renderWarehouseModal(state);
    return false;
  }

  const liveItem = loc.currentItem;
  const depositQty = Math.max(1, Math.min(qty, liveItem.count || 1));

  if (isStackableType(liveItem) && (liveItem.count || 1) > depositQty) {
    liveItem.count = (liveItem.count || 1) - depositQty;
    if (existingStack) {
      existingStack.count = (existingStack.count || 1) + depositQty;
    } else {
      state.warehouse.push({ ...liveItem, count: depositQty });
    }
    // Cập nhật lại số lượng của selected item để hiển thị đúng
    if (selectedBackpackItem) selectedBackpackItem.count = liveItem.count;
  } else {
    // Rút hoàn toàn vật phẩm khỏi mảng túi
    const removed = loc.targetArray.splice(loc.index, 1)[0];
    if (existingStack) {
      existingStack.count = (existingStack.count || 1) + (removed.count || 1);
    } else {
      state.warehouse.push(removed);
    }
    selectedBackpackItem = null;
  }

  clearWhStatus();
  setStory(`📦 Bạn cất ${depositQty}x ${liveItem.name} vào kho căn cứ.`);
  renderWarehouseModal(state);
  if (onWarehouseUpdateCallback) onWarehouseUpdateCallback(state);
  return true;
}

/**
 * Rút vật phẩm từ kho căn cứ về ba lô
 * @param {number} index 
 * @param {number} qty 
 * @param {Object} state 
 * @returns {boolean}
 */
export function withdrawWarehouseItem(index, qty, state) {
  if (!state || !state.warehouse || index < 0 || index >= state.warehouse.length) return false;
  const item = state.warehouse[index];
  if (!item) return false;

  const withdrawQty = Math.max(1, Math.min(qty, item.count || 1));

  if (isStackableType(item) && (item.count || 1) > withdrawQty) {
    const added = addItem({ ...item, count: withdrawQty });
    if (!added) {
      showWhStatus(`⚠️ Ba lô đã đầy (${calculateBackpackCount(state)}/${state.backpack.capacity} ô)! Hãy dọn bớt ba lô.`);
      return false;
    }
    item.count = (item.count || 1) - withdrawQty;
    if (selectedWarehouseIndex === index) {
      // Giữ selection và cập nhật
    }
  } else {
    const added = addItem({ ...item });
    if (!added) {
      showWhStatus(`⚠️ Ba lô đã đầy (${calculateBackpackCount(state)}/${state.backpack.capacity} ô)! Hãy dọn bớt ba lô.`);
      return false;
    }
    state.warehouse.splice(index, 1);
    selectedWarehouseIndex = null;
  }

  clearWhStatus();
  setStory(`🎒 Bạn lấy ${withdrawQty}x ${item.name} từ kho căn cứ ra ba lô.`);
  renderWarehouseModal(state);
  if (onWarehouseUpdateCallback) onWarehouseUpdateCallback(state);
  return true;
}

