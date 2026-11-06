/* ============================================================
   Mô-đun render UI game
   Thứ tự tổ chức: import → hàm phụ trợ → render bảng điều khiển (trạng thái/vũ khí/ba lô/hàng hóa/câu chuyện/lựa chọn)
   → render tổng hợp → khởi tạo UI
   ============================================================ */

import { getState, setName, setPhase, resetState, getItemDisplayName, getGameSettings, toggleClickMode, toggleInputMode, toggleMusic, setPlayerAppearance, getPlayerAppearance } from './state.js';
import { getAppearanceConfig, getAppearanceDisplayName, DEFAULT_APPEARANCE } from './data/player-appearance.js';
import { TIME_PHASES, BASE_LEVELS, ACHIEVEMENTS, GAME_CONSTANTS } from './config.js';
import { getAllSlots, getBestRecord } from './save.js';
import { handleSavePage, handleSavePageAction, handleSaveConfirm } from './game/index.js';
import { returnToMenu } from './routing.js';
import { handleAction } from './game/index.js';
import { getIdentityDisplayName } from './faction.js';
import { INVEST_DIRECTIONS } from './data/island/investment.js';
import { formatStoryWithCombatHUD } from './combat-hud.js';
import { renderInventoryComponent } from './inventory-ui.js';
import { pixiRenderer } from './pixi-renderer.js';

const bgMusic = new Audio('./public/music/backmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

export function startGameMusic() {
  const settings = getGameSettings();
  if (settings.musicEnabled) {
    bgMusic.play().catch(() => {});
  }
}

export function stopGameMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

export function updateMusicState() {
  const settings = getGameSettings();
  if (settings.musicEnabled) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
}

// ---------- Hàm phụ trợ ----------

// Tính tổng số lượng vật phẩm trong ba lô
function getBackpackCount(state) {
  const countArr = (arr) => arr.reduce((sum, item) => sum + (item.count || 1), 0);
  return countArr(state.food) + countArr(state.drinks) + countArr(state.medicine) + countArr(state.other) + (state.seeds ? countArr(state.seeds) : 0);
}

// Định dạng văn bản hiển thị đạn dược, trả về "Không" khi không có đạn
function formatAmmo(state) {
  if (state.ammo.length === 0) {
    return 'Không';
  }
  return state.ammo.map(a => `${a.name}×${a.count}`).join(', ');
}

function getBaseDisplayName(state) {
  return BASE_LEVELS[state.baseLevel || 0]?.name || BASE_LEVELS[0].name;
}

// ---------- Render bảng điều khiển ----------

export function renderIdentity(state) {
  const panel = document.getElementById('identity-panel');
  const display = getIdentityDisplayName(state);
  state._identityDisplay = display;
  panel.innerHTML = `
<div class="identity-panel">
  <div class="panel-title">🎭 Thân phận</div>
  <div class="stat-row"><span class="stat-label">🆔 Thân phận</span><span class="stat-value identity-value">${display}</span></div>
</div>`;
}

/**
 * Render bảng điều khiển trạng thái nhân vật
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderStats(state) {
  const panel = document.getElementById('stats-panel');
  const hpPct = Math.round(state.health / GAME_CONSTANTS.MAX_HEALTH * 100);
  const appearance = state.playerAppearance || DEFAULT_APPEARANCE;
  const appearanceConfig = getAppearanceConfig(appearance.age, appearance.gender, appearance.outfit);
  const appearanceDisplayName = getAppearanceDisplayName(appearance);
  const avatarPath = appearanceConfig?.path || 'public/assets/characters/player/young_adult_male_survivor.png';

  panel.innerHTML = `
<div class="stats-title">📊 Trạng thái nhân vật</div>
<div class="stat-player-card">
  <div class="stat-player-avatar-box">
    <img class="stat-player-avatar-img" src="${avatarPath}" alt="${state.name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
    <div class="stat-player-avatar-fallback" style="display:none;">👤</div>
  </div>
  <div class="stat-player-info">
    <div class="stat-player-name">${state.name || 'Người sống sót'}</div>
    <div class="stat-player-appearance">${appearanceDisplayName}</div>
  </div>
</div>
<div class="stat-row"><span class="stat-label">Nhân vật</span><span class="stat-value">${state.name}</span></div>
<div class="stat-row"><span class="stat-label">Thời gian</span><span class="stat-value">Ngày ${state.day} ${TIME_PHASES[state.phaseIndex]} · ${state.weather}</span></div>
<div class="stat-row"><span class="stat-label">Địa điểm</span><span class="stat-value">${state.location}</span></div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_hp.png" alt="" onerror="this.style.display='none'">Sức khỏe</span>
  <div class="stat-bar-track"><div class="stat-bar-fill hp" style="width:${hpPct}%"></div></div>
  <span class="stat-bar-value hp">${state.health}</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_hunger.png" alt="" onerror="this.style.display='none'">Bụng no</span>
  <div class="stat-bar-track"><div class="stat-bar-fill hunger" style="width:${state.hunger}%"></div></div>
  <span class="stat-bar-value hunger">${state.hunger}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_hydration.png" alt="" onerror="this.style.display='none'">Nước</span>
  <div class="stat-bar-track"><div class="stat-bar-fill thirst" style="width:${state.hydration}%"></div></div>
  <span class="stat-bar-value thirst">${state.hydration}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_sanity.png" alt="" onerror="this.style.display='none'">Lý trí</span>
  <div class="stat-bar-track"><div class="stat-bar-fill sanity" style="width:${state.sanity}%"></div></div>
  <span class="stat-bar-value sanity">${state.sanity}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_fatigue.png" alt="" onerror="this.style.display='none'">Mệt mỏi</span>
  <div class="stat-bar-track"><div class="stat-bar-fill fatigue" style="width:${state.crash}%"></div></div>
  <span class="stat-bar-value fatigue">${state.crash}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_infection.png" alt="" onerror="this.style.display='none'">Nhiễm bệnh</span>
  <div class="stat-bar-track"><div class="stat-bar-fill infection" style="width:${state.infection}%"></div></div>
  <span class="stat-bar-value infection">${state.infection}%</span>
</div>
<div class="stat-row"><span class="stat-label">Trạng thái</span><span class="stat-value">${state.status}</span></div>
<div class="stat-row"><span class="stat-label">🏠 Căn cứ</span><span class="stat-value">${getBaseDisplayName(state)}</span></div>`;
}

/**
 * Render bảng điều khiển vũ khí
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderWeapons(state) {
  const panel = document.getElementById('weapon-panel');
  const meleeDurability = state.meleeWeapon.durability === Infinity 
    ? '∞' 
    : `${state.meleeWeapon.currentDurability}/${state.meleeWeapon.durability}`;
  panel.innerHTML = `
<div class="weapon-panel">
  <div class="panel-title">⚔️ Vũ khí</div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_melee_slot.png" alt="" onerror="this.style.display='none'">Cận chiến</span><span class="stat-value">${state.meleeWeapon.name}(sát thương${state.meleeWeapon.damage} liên kích${Math.round((state.meleeWeapon.comboRate || 0) * 100)}%)</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_durability.png" alt="" onerror="this.style.display='none'">Độ bền</span><span class="stat-value">${meleeDurability}</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_ranged_slot.png" alt="" onerror="this.style.display='none'">Tầm xa</span><span class="stat-value">${state.rangedWeapon ? state.rangedWeapon.name : 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">⚙️ Độ nguyên vẹn</span><span class="stat-value">${state.rangedWeapon ? state.rangedWeapon.integrity : 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">💥 Đạn dược</span><span class="stat-value">${formatAmmo(state)}</span></div>
</div>`;
}

/**
 * Render bảng điều khiển ba lô
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderInventory(state) {
  renderInventoryComponent(state, renderAll);
}

/**
 * Render bảng điều khiển hàng hóa
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderCargo(state) {
  const panel = document.getElementById('cargo-panel');
  const cigDisplay = state.cigarettes > 0 ? `(${state.cigarettes}) thuốc lá` : 'Không';
  const gasDisplay = state.gasoline > 0 ? `(${state.gasoline}) xăng` : 'Không';
  const royalDisplay = state.royalCoins > 0 ? `(${state.royalCoins}) tiền hoàng gia` : 'Không';
  const pureDisplay = state.pureEnergy > 0 ? `(${state.pureEnergy}) năng lượng tinh khiết` : 'Không';
  panel.innerHTML = `
<div class="cargo-panel">
  <div class="panel-title">📦 Hàng hóa</div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_res_cigarette.png" alt="" onerror="this.style.display='none'">Thuốc lá</span><span class="stat-value">${cigDisplay}</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_res_gasoline.png" alt="" onerror="this.style.display='none'">Xăng</span><span class="stat-value">${gasDisplay}</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_res_royal_coin.png" alt="" onerror="this.style.display='none'">Tiền hoàng gia</span><span class="stat-value">${royalDisplay}</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_pure_energy.png" alt="" onerror="this.style.display='none'">Năng lượng tinh khiết</span><span class="stat-value">${pureDisplay}</span></div>
  <div class="stat-row"><span class="stat-label"><img class="ui-icon-inline" src="public/assets/icons/ui_icon_castle_debt.png" alt="" onerror="this.style.display='none'">Nợ lâu đài</span><span class="stat-value">${state.castleDebt ? (() => { const d = state.castleDebt.dueDay - state.day; return d > 0 ? `${state.castleDebt.amount} điếu thuốc lá, còn ${d} ngày` : `${state.castleDebt.amount} điếu thuốc lá, quá hạn ${-d} ngày!`; })() : "Không"}</span></div>
  <div class="stat-row"><span class="stat-label">🏝️ Nợ đảo</span><span class="stat-value">${state.islandDebt ? (() => { const d = state.islandDebt.dueDay - state.day; return d > 0 ? `${state.islandDebt.amount} tiền hoàng gia, còn ${d} ngày` : `${state.islandDebt.amount} tiền hoàng gia, quá hạn ${-d} ngày!`; })() : "Không"}</span></div>
  <div class="stat-row"><span class="stat-label">📈 Đầu tư</span><span class="stat-value">${state.investment ? (() => { const dir = INVEST_DIRECTIONS.find(d => d.id === state.investment.directionId); const daysLeft = state.investment.dueDay - state.day; return daysLeft > 0 ? `${dir ? dir.name : state.investment.directionId}, ${state.investment.amount} xu, còn ${daysLeft} ngày` : `${dir ? dir.name : state.investment.directionId}, ${state.investment.amount} xu, đã đáo hạn!`; })() : "Không"}</span></div>
</div>`;
}

/**
 * Render khu vực văn bản câu chuyện
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderStory(state) {
  const area = document.getElementById('story-area');
  if (!area) return;
  area.innerHTML = formatStoryWithCombatHUD(state.story, state);
}

/**
 * Render danh sách lựa chọn
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderOptions(state) {
  const area = document.getElementById('options-area');
  const paginationArea = document.getElementById('pagination-area');
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');
  const pageInfo = document.getElementById('page-info');

  area.innerHTML = '';

  const options = state.options || [];
  const pageSize = 30;
  let page = state._optionPage || 0;
  const totalPages = Math.ceil(options.length / pageSize);

  // Dam bao trang hop le khi danh sach thay doi
  if (totalPages > 0 && page >= totalPages) {
    page = totalPages - 1;
    state._optionPage = page;
  }

  let toggleBarHtml = '';
  if (state.phase === 'map_select') {
    const isGraph = !pixiRenderer || pixiRenderer.mapViewMode === 'graphical';
    const zoomText = pixiRenderer?.worldMapRenderer?.zoomLevel ? `${pixiRenderer.worldMapRenderer.zoomLevel.toFixed(1)}x` : '1.0x';
    const gridText = pixiRenderer?.worldMapRenderer?.showGrid ? 'Lưới: Bật' : 'Lưới: Tắt';

    if (isGraph) {
      toggleBarHtml = `
      <div class="map-view-toggle-bar">
        <div class="map-toolbar-left">
          <button id="map-zoom-btn" class="map-ctrl-btn" type="button" title="Thu phóng bản đồ">🔍 Zoom: ${zoomText}</button>
          <button id="map-grid-btn" class="map-ctrl-btn" type="button" title="Bật/tắt lưới tọa độ quân sự">📐 ${gridText}</button>
          <button id="map-recenter-btn" class="map-ctrl-btn" type="button" title="Định vị nhân vật">🎯 Vị trí</button>
        </div>
        <div class="map-toolbar-right">
          <button id="map-view-toggle-btn" class="map-toggle-btn" type="button">📋 Xem Chữ</button>
        </div>
      </div>`;
    } else {
      toggleBarHtml = `
      <div class="map-view-toggle-bar">
        <div class="map-toolbar-right">
          <button id="map-view-toggle-btn" class="map-toggle-btn" type="button">🗺️ Xem Sa bàn</button>
        </div>
      </div>`;
    }
  }

  if (options.length === 0) {
    paginationArea.style.display = 'none';
    area.innerHTML = toggleBarHtml + '<div class="option-no-action">Không có hành động khả dụng</div>';
  } else if (totalPages <= 1) {
    paginationArea.style.display = 'none';
    let html = '';
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const disabledClass = option.disabled ? ' option-disabled' : '';
      const disabledAttr = option.disabled ? ' data-disabled="true"' : '';
      html += `<div class="option-item${disabledClass}" data-index="${i + 1}"${disabledAttr}>${option.text}</div>`;
    }
    area.innerHTML = toggleBarHtml + html;
  } else {
    paginationArea.style.display = 'flex';
    const start = page * pageSize;
    const end = Math.min(start + pageSize, options.length);
    const pageOptions = options.slice(start, end);
    let html = '';
    for (let i = 0; i < pageOptions.length; i++) {
      const option = pageOptions[i];
      const globalIdx = start + i;
      const disabledClass = option.disabled ? ' option-disabled' : '';
      const disabledAttr = option.disabled ? ' data-disabled="true"' : '';
      html += `<div class="option-item${disabledClass}" data-index="${globalIdx + 1}"${disabledAttr}>${option.text}</div>`;
    }
    area.innerHTML = toggleBarHtml + html;

    prevBtn.disabled = (page === 0);
    nextBtn.disabled = (page >= totalPages - 1);
    pageInfo.textContent = `${page + 1}/${totalPages}`;
  }

  // Update scroll hint visibility only when scrolling is actually needed
  const scrollHint = document.querySelector ? document.querySelector('.scroll-hint') : null;
  if (scrollHint && scrollHint.classList) {
    const isOverflowing = (area.scrollHeight > area.clientHeight && area.clientHeight > 0) || (options.length > 6);
    if (isOverflowing) {
      scrollHint.classList.add('is-scrollable');
    } else {
      scrollHint.classList.remove('is-scrollable');
    }
  }

  const toggleBtn = area.querySelector ? area.querySelector('#map-view-toggle-btn') : null;
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pixiRenderer) pixiRenderer.toggleMapViewMode();
      renderAll();
    });
  }

  const zoomBtn = area.querySelector ? area.querySelector('#map-zoom-btn') : null;
  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pixiRenderer?.worldMapRenderer) {
        const nextZoom = pixiRenderer.worldMapRenderer.cycleZoom();
        zoomBtn.textContent = `🔍 Zoom: ${nextZoom.toFixed(1)}x`;
      }
    });
  }

  const gridBtn = area.querySelector ? area.querySelector('#map-grid-btn') : null;
  if (gridBtn) {
    gridBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pixiRenderer?.worldMapRenderer) {
        const isGrid = pixiRenderer.worldMapRenderer.toggleGrid();
        gridBtn.textContent = `📐 Lưới: ${isGrid ? 'Bật' : 'Tắt'}`;
      }
    });
  }

  const recenterBtn = area.querySelector ? area.querySelector('#map-recenter-btn') : null;
  if (recenterBtn) {
    recenterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pixiRenderer?.worldMapRenderer) {
        pixiRenderer.worldMapRenderer.recenterToPlayer();
      }
    });
  }

  // Bidirectional hover between text options and canvas map
  if (state.phase === 'map_select') {
    const mapItems = area.querySelectorAll('.option-item');
    mapItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10) - 1;
        const opt = (state.options || [])[idx];
        if (opt?.map && pixiRenderer?.worldMapRenderer) {
          pixiRenderer.worldMapRenderer.highlightPOI(opt.map.id);
        }
      });
      item.addEventListener('mouseleave', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10) - 1;
        const opt = (state.options || [])[idx];
        if (opt?.map && pixiRenderer?.worldMapRenderer) {
          pixiRenderer.worldMapRenderer.unhighlightPOI(opt.map.id);
        }
      });
    });
  }

  const settings = getGameSettings();
  if (settings.clickMode) {
    const items = area.querySelectorAll('.option-item:not([data-disabled="true"])');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        handleAction(index);
        renderAll();
      });
    });
  }
}

// ---------- Trang lưu trữ / kỷ lục tốt nhất ----------

/**
 * Render trang ô lưu trữ
 */
export function renderSavePage() {
  const area = document.getElementById('save-slots-area');
  const slots = getAllSlots();
  let html = '';
  const autoSlot = slots[0];
  if (autoSlot) {
    html += `<div class="option-item auto-save-slot" data-index="1">🔄 Tự động lưu: ${autoSlot.nickname} · Ngày ${autoSlot.day} · ${autoSlot.timestamp}</div>`;
  } else {
    html += `<div class="option-item auto-save-slot" data-index="1">🔄 Tự động lưu —— Trống ——</div>`;
  }
  for (let i = 1; i < slots.length; i++) {
    const slot = slots[i];
    if (slot === null) {
      html += `<div class="option-item" data-index="${i + 1}">Ô ${i} —— Trống ——</div>`;
    } else {
      html += `<div class="option-item" data-index="${i + 1}">Ô ${i}: ${slot.nickname} · Ngày ${slot.day} · ${slot.timestamp}</div>`;
    }
  }
  html += `<div class="option-item" data-index="${slots.length + 1}">Quay lại</div>`;
  area.innerHTML = html;

  const settings = getGameSettings();
  if (settings.clickMode) {
    const items = area.querySelectorAll('.option-item:not([data-disabled="true"])');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        handleSavePageAction(index);
        renderAll();
      });
    });
  }
}

/**
 * Render trang kỷ lục tốt nhất
 */
export function renderBestRecordPage() {
  const area = document.getElementById('best-record-content');
  const record = getBestRecord();
  if (!record) {
    area.innerHTML = `<div>Chưa có lịch sử ghi nhận.</div>`;
    return;
  }
  const s = record.snapshot;
  const backpackName = s.backpack ? s.backpack.name : 'Không';
  const backpackCapacity = s.backpack ? s.backpack.capacity : 0;
  const meleeName = s.meleeWeapon ? s.meleeWeapon.name : 'Không';
  const rangedName = s.rangedWeapon ? s.rangedWeapon.name : 'Không';
  const foodNames = (s.food && s.food.length > 0) ? s.food.map(f => getItemDisplayName(f)).join(', ') : 'Không';
  const drinkNames = (s.drinks && s.drinks.length > 0) ? s.drinks.map(d => getItemDisplayName(d)).join(', ') : 'Không';
  const medicineNames = (s.medicine && s.medicine.length > 0) ? s.medicine.map(m => getItemDisplayName(m)).join(', ') : 'Không';
  const otherNames = (s.other && s.other.length > 0) ? s.other.map(o => getItemDisplayName(o)).join(', ') : 'Không';
  const cigDisplay = (s.cigarettes && s.cigarettes > 0) ? '(' + s.cigarettes + ') thuốc lá' : 'Không';
  const gasDisplay = (s.gasoline && s.gasoline > 0) ? '(' + s.gasoline + ') xăng' : 'Không';
  const royalDisplay = (s.royalCoins && s.royalCoins > 0) ? '(' + s.royalCoins + ') tiền hoàng gia' : 'Không';
  const pureDisplay = (s.pureEnergy && s.pureEnergy > 0) ? '(' + s.pureEnergy + ') năng lượng tinh khiết' : 'Không';
  const ammoNames = (s.ammo && s.ammo.length > 0) ? s.ammo.map(a => `${a.name}×${a.count}`).join(', ') : 'Không';

  area.innerHTML = `
<div>Sống sót lâu nhất: Ngày ${record.day}</div>
<div>Nhân vật: ${record.nickname}</div>
<div>Sinh mệnh: ${s.health}</div>
<div>Mệt mỏi: ${s.crash}%</div>
<div>Lý trí: ${s.sanity !== undefined ? s.sanity + '%' : '100%'}</div>
<div>Nhiễm bệnh: ${s.infection}%</div>
<div>Vị trí: ${s.location}</div>
<div>Vũ khí cận chiến: ${meleeName}</div>
<div>Vũ khí tầm xa: ${rangedName}</div>
<div>Ba lô: ${backpackName}(${backpackCapacity} ô)</div>
<div>Thực phẩm: ${foodNames}</div>
<div>Đồ uống: ${drinkNames}</div>
<div>Thuốc: ${medicineNames}</div>
<div>Khác: ${otherNames}</div>
<div>Thuốc lá: ${cigDisplay}</div>
<div>Xăng: ${gasDisplay}</div>
<div>Tiền hoàng gia: ${royalDisplay}</div>
<div>Năng lượng tinh khiết: ${pureDisplay}</div>
<div>Đạn dược: ${ammoNames}</div>`;
}

// ---------- Trang thành tựu ----------

/**
 * Render trang thành tựu
 */
export function renderAchievementPage() {
  const area = document.getElementById('achievement-content');
  const state = getState();
  const unlocked = state.unlockedAchievements || [];
  let html = '<div class="achievement-list">';
  for (const ach of ACHIEVEMENTS) {
    const isUnlocked = unlocked.includes(ach.id);
    if (isUnlocked) {
      html += `<div class="achievement-item unlocked">
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-desc">${ach.desc}</div>
        </div>
      </div>`;
    } else {
      html += `<div class="achievement-item locked">
        <div class="achievement-icon">❓</div>
        <div class="achievement-info">
          <div class="achievement-name">???</div>
          <div class="achievement-desc">Chưa mở khóa</div>
        </div>
      </div>`;
    }
  }
  html += '</div>';
  area.innerHTML = html;
}

/**
 * Cuộn mượt story-area xuống cuối khi người chơi đang ở gần đáy (<= 80px)
 * Giữ nguyên vị trí cuộn khi người chơi đang chủ động cuộn lên đọc log/cốt truyện cũ
 * @param {HTMLElement} storyArea
 */
export function scrollStoryToBottomIfNeeded(storyArea) {
  if (!storyArea) return;
  const threshold = 80;
  const distanceFromBottom = storyArea.scrollHeight - (storyArea.scrollTop + storyArea.clientHeight);
  if (distanceFromBottom <= threshold) {
    storyArea.scrollTop = storyArea.scrollHeight;
  }
}

export function renderSettingsPage() {
  const settings = getGameSettings();
  const clickBtn = document.getElementById('click-mode-btn');
  const inputBtn = document.getElementById('input-mode-btn');
  const musicBtn = document.getElementById('music-btn');
  if (clickBtn) {
    clickBtn.className = 'settings-toggle-btn ' + (settings.clickMode ? 'on' : 'off');
    clickBtn.innerHTML = `
      <span class="rocker-label">Chế độ nhấp</span>
      <div class="rocker-switch ${settings.clickMode ? 'is-on' : 'is-off'}">
        <span class="rocker-led ${settings.clickMode ? 'led-active' : ''}"></span>
        <span class="rocker-status">${settings.clickMode ? 'BẬT' : 'TẮT'}</span>
      </div>`;
  }
  if (inputBtn) {
    inputBtn.className = 'settings-toggle-btn ' + (settings.inputMode ? 'on' : 'off');
    inputBtn.innerHTML = `
      <span class="rocker-label">Chế độ nhập</span>
      <div class="rocker-switch ${settings.inputMode ? 'is-on' : 'is-off'}">
        <span class="rocker-led ${settings.inputMode ? 'led-active' : ''}"></span>
        <span class="rocker-status">${settings.inputMode ? 'BẬT' : 'TẮT'}</span>
      </div>`;
  }
  if (musicBtn) {
    musicBtn.className = 'settings-toggle-btn ' + (settings.musicEnabled ? 'on' : 'off');
    musicBtn.innerHTML = `
      <span class="rocker-label">Nhạc game</span>
      <div class="rocker-switch ${settings.musicEnabled ? 'is-on' : 'is-off'}">
        <span class="rocker-led ${settings.musicEnabled ? 'led-active' : ''}"></span>
        <span class="rocker-status">${settings.musicEnabled ? 'BẬT' : 'TẮT'}</span>
      </div>`;
  }
}

// ---------- Render tổng hợp ----------

/**
 * Render tổng hợp tất cả bảng điều khiển UI, điều khiển hiển thị giao diện theo giai đoạn game
 */
export function renderAll() {
  const state = getState();
  const settings = getGameSettings();

  const nameSetup = document.getElementById('name-setup');
  const gameContent = document.getElementById('game-content');
  const gameHeader = document.getElementById('game-header');
  const inputArea = document.getElementById('input-area');
  const savePage = document.getElementById('save-page');
  const bestRecordPage = document.getElementById('best-record-page');
  const achievementPage = document.getElementById('achievement-page');
  const aboutPage = document.getElementById('about-page');

  if (state.phase === 'main_menu') {
    gameHeader.style.display = 'block';
    nameSetup.style.display = 'flex';
    gameContent.style.display = 'none';
    inputArea.style.display = 'none';
    savePage.style.display = 'none';
    bestRecordPage.style.display = 'none';
    achievementPage.style.display = 'none';
    aboutPage.style.display = 'none';
    return;
  }

  if (state.phase === 'save_page' || state.phase === 'save_confirm') {
    gameHeader.style.display = 'none';
    nameSetup.style.display = 'none';
    gameContent.style.display = 'none';
    inputArea.style.display = 'none';
    savePage.style.display = 'block';
    bestRecordPage.style.display = 'none';
    achievementPage.style.display = 'none';
    aboutPage.style.display = 'none';
    const saveStory = document.getElementById('save-story-area');
    const saveOpts = document.getElementById('save-options-area');
    if (state.story) {
      saveStory.style.display = 'block';
      saveStory.innerHTML = state.story;
    } else {
      saveStory.style.display = 'none';
    }
    if (state.options && state.options.length > 0) {
      saveOpts.style.display = 'block';
      saveOpts.innerHTML = state.options.map((option, i) =>
        `<div class="option-item" data-index="${i + 1}">${i + 1}. ${option.text}</div>`
      ).join('');
      const clickSettings = getGameSettings();
      if (clickSettings.clickMode) {
        const items = saveOpts.querySelectorAll('.option-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'), 10);
            if (state.phase === 'save_page') {
              handleSavePageAction(index);
            } else if (state.phase === 'save_confirm') {
              handleSaveConfirm(index);
            }
            renderAll();
          });
        });
      }
    } else {
      saveOpts.style.display = 'none';
    }
    return;
  }

  if (state.gameOver) {
    gameHeader.style.display = 'none';
    gameContent.style.display = '';
    nameSetup.style.display = 'none';
    inputArea.style.display = settings.inputMode ? '' : 'none';
    savePage.style.display = 'none';
    bestRecordPage.style.display = 'none';
    achievementPage.style.display = 'none';
    aboutPage.style.display = 'none';
    renderStats(state);
    renderWeapons(state);
    renderInventory(state);
    renderCargo(state);
    renderIdentity(state);
    renderStory(state);
    renderOptions(state);
    const storyArea = document.getElementById('story-area');
    scrollStoryToBottomIfNeeded(storyArea);
    if (pixiRenderer && pixiRenderer.enabled) {
      pixiRenderer.render(state);
    }
    return;
  }

  if (state.name === '') {
    gameHeader.style.display = 'block';
    nameSetup.style.display = 'flex';
    gameContent.style.display = 'none';
    inputArea.style.display = 'none';
    savePage.style.display = 'none';
    bestRecordPage.style.display = 'none';
    achievementPage.style.display = 'none';
    aboutPage.style.display = 'none';
    return;
  }

  gameHeader.style.display = 'none';
  nameSetup.style.display = 'none';
  gameContent.style.display = '';
  inputArea.style.display = settings.inputMode ? '' : 'none';
  savePage.style.display = 'none';
  bestRecordPage.style.display = 'none';
  achievementPage.style.display = 'none';

  renderStats(state);
  renderWeapons(state);
  renderInventory(state);
  renderCargo(state);
  renderIdentity(state);
  renderStory(state);
  renderOptions(state);

  const storyArea = document.getElementById('story-area');
  scrollStoryToBottomIfNeeded(storyArea);

  if (pixiRenderer && pixiRenderer.enabled) {
    pixiRenderer.render(state);
  }
}

// ---------- Khởi tạo UI ----------

/**
 * Khởi tạo ràng buộc sự kiện UI và trạng thái hiển thị ban đầu
 */
export function setupPagination() {
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  prevBtn.addEventListener('click', () => {
    const state = getState();
    if ((state._optionPage || 0) > 0) {
      state._optionPage = (state._optionPage || 0) - 1;
      renderAll();
    }
  });

  nextBtn.addEventListener('click', () => {
    const state = getState();
    const totalPages = Math.ceil((state.options || []).length / 30);
    if ((state._optionPage || 0) < totalPages - 1) {
      state._optionPage = (state._optionPage || 0) + 1;
      renderAll();
    }
  });
}

/**
 * Khởi tạo bộ điều khiển lựa chọn ngoại hình nhân vật trên màn hình bắt đầu
 */
export function initAppearanceUI() {
  const ageSelect = document.getElementById('appearance-age-select');
  const genderSelect = document.getElementById('appearance-gender-select');
  const outfitSelect = document.getElementById('appearance-outfit-select');
  const previewImg = document.getElementById('appearance-preview-img');
  const previewPlaceholder = document.getElementById('appearance-preview-placeholder');
  const statusBadge = document.getElementById('appearance-status-badge');
  const placeholderName = document.getElementById('preview-placeholder-name');
  const placeholderOutfit = document.getElementById('preview-placeholder-outfit');
  const placeholderTag = document.getElementById('preview-placeholder-tag');
  const confirmBtn = document.getElementById('confirm-appearance-btn');

  if (!ageSelect || !genderSelect || !outfitSelect) return;

  function updatePreview() {
    const age = ageSelect.value;
    const gender = genderSelect.value;
    const outfit = outfitSelect.value;
    const config = getAppearanceConfig(age, gender, outfit);

    if (!config) return;

    if (placeholderName) {
      placeholderName.textContent = `${config.ageName} ${config.genderName}`;
    }
    if (placeholderOutfit) {
      placeholderOutfit.textContent = config.outfitName;
    }
    if (placeholderTag) {
      placeholderTag.textContent = `${config.filename} (${config.status})`;
    }

    if (statusBadge) {
      statusBadge.textContent = config.status;
      statusBadge.className = `appearance-status-badge status-${config.status.toLowerCase()}`;
    }

    if (previewImg && previewPlaceholder) {
      previewImg.onload = () => {
        previewImg.style.display = 'block';
        previewPlaceholder.style.display = 'none';
        if (statusBadge) {
          statusBadge.textContent = 'EXISTING';
          statusBadge.className = 'appearance-status-badge status-existing';
        }
      };
      previewImg.onerror = () => {
        previewImg.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
        if (statusBadge) {
          statusBadge.textContent = 'PENDING';
          statusBadge.className = 'appearance-status-badge status-pending';
        }
      };
      previewImg.src = config.path;
    }

    setPlayerAppearance(config);
  }

  ageSelect.addEventListener('change', updatePreview);
  genderSelect.addEventListener('change', updatePreview);
  outfitSelect.addEventListener('change', updatePreview);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      updatePreview();
      confirmBtn.classList.add('confirmed');
      const originalText = confirmBtn.textContent;
      confirmBtn.textContent = '✓ Đã chọn ngoại hình!';
      setTimeout(() => {
        confirmBtn.classList.remove('confirmed');
        confirmBtn.textContent = originalText;
      }, 1500);
    });
  }

  updatePreview();
}

export function initUI() {
  const nameInput = document.getElementById('name-input');
  const newGameBtn = document.getElementById('new-game-btn');
  const loadGameBtn = document.getElementById('load-game-btn');
  const bestRecordBtn = document.getElementById('best-record-btn');
  const saveReturnBtn = document.getElementById('save-return-btn');
  const bestRecordReturnBtn = document.getElementById('best-record-return-btn');
  const achievementBtn = document.getElementById('achievement-btn');
  const achievementReturnBtn = document.getElementById('achievement-return-btn');

  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      const value = nameInput.value.trim();
      if (!value) {
        alert('Vui lòng nhập biệt danh nhân vật');
        return;
      }
      const age = document.getElementById('appearance-age-select')?.value || 'young_adult';
      const gender = document.getElementById('appearance-gender-select')?.value || 'male';
      const outfit = document.getElementById('appearance-outfit-select')?.value || 'survivor';
      const selectedAppearance = getAppearanceConfig(age, gender, outfit) || { ...DEFAULT_APPEARANCE };

      resetState();
      setName(value);
      setPlayerAppearance(selectedAppearance);
      setPhase('choose');
      startGameMusic();
      renderAll();
    });
  }

  if (loadGameBtn) {
    loadGameBtn.addEventListener('click', () => {
      handleSavePage();
      renderAll();
    });
  }

  if (bestRecordBtn) {
    bestRecordBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('best-record-page').style.display = 'flex';
      document.getElementById('game-content').style.display = 'none';
      document.getElementById('input-area').style.display = 'none';
      renderBestRecordPage();
    });
  }

  if (saveReturnBtn) {
    saveReturnBtn.addEventListener('click', () => {
      const state = getState();
      if (state.phase === 'save_confirm') {
        handleSavePage();
      } else if (state.name !== '') {
        returnToMenu();
      } else {
        setPhase('main_menu');
        document.getElementById('name-setup').style.display = 'flex';
        document.getElementById('save-page').style.display = 'none';
      }
      renderAll();
    });
  }

  if (bestRecordReturnBtn) {
    bestRecordReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('best-record-page').style.display = 'none';
      renderAll();
    });
  }

  if (achievementBtn) {
    achievementBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('achievement-page').style.display = 'flex';
      document.getElementById('game-content').style.display = 'none';
      document.getElementById('input-area').style.display = 'none';
      document.getElementById('save-page').style.display = 'none';
      document.getElementById('best-record-page').style.display = 'none';
      renderAchievementPage();
    });
  }

  if (achievementReturnBtn) {
    achievementReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('achievement-page').style.display = 'none';
      renderAll();
    });
  }

  const settingsBtn = document.getElementById('settings-btn');
  const clickModeBtn = document.getElementById('click-mode-btn');
  const inputModeBtn = document.getElementById('input-mode-btn');
  const settingsReturnBtn = document.getElementById('settings-return-btn');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('settings-page').style.display = 'block';
      document.getElementById('game-content').style.display = 'none';
      document.getElementById('input-area').style.display = 'none';
      document.getElementById('save-page').style.display = 'none';
      document.getElementById('best-record-page').style.display = 'none';
      document.getElementById('achievement-page').style.display = 'none';
      document.getElementById('about-page').style.display = 'none';
      renderSettingsPage();
    });
  }

  if (clickModeBtn) {
    clickModeBtn.addEventListener('click', () => {
      const result = toggleClickMode();
      if (!result) {
        alert('Phải giữ ít nhất một chế độ thao tác');
      }
      renderSettingsPage();
    });
  }

  if (inputModeBtn) {
    inputModeBtn.addEventListener('click', () => {
      const result = toggleInputMode();
      if (!result) {
        alert('Phải giữ ít nhất một chế độ thao tác');
      }
      renderSettingsPage();
    });
  }

  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      toggleMusic();
      updateMusicState();
      renderSettingsPage();
    });
  }

  if (settingsReturnBtn) {
    settingsReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('settings-page').style.display = 'none';
    });
  }

  const playerToolsBtn = document.getElementById('player-tools-btn');
  const ptTabProbability = document.getElementById('pt-tab-probability');
  const ptTabEncyclopedia = document.getElementById('pt-tab-encyclopedia');
  const ptOpenExternalBtn = document.getElementById('pt-open-external-btn');
  const ptFrame = document.getElementById('player-tools-frame');
  const ptReturnBtn = document.getElementById('player-tools-return-btn');
  let currentToolUrl = 'tools/probability.html';

  function switchPlayerTool(url) {
    currentToolUrl = url;
    if (ptFrame) {
      ptFrame.src = url;
    }
    if (ptTabProbability) {
      ptTabProbability.classList.toggle('is-active', url.includes('probability'));
    }
    if (ptTabEncyclopedia) {
      ptTabEncyclopedia.classList.toggle('is-active', url.includes('encyclopedia'));
    }
  }

  if (playerToolsBtn) {
    playerToolsBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('player-tools-page').style.display = 'block';
      switchPlayerTool('tools/probability.html');
    });
  }

  if (ptTabProbability) {
    ptTabProbability.addEventListener('click', () => {
      switchPlayerTool('tools/probability.html');
    });
  }

  if (ptTabEncyclopedia) {
    ptTabEncyclopedia.addEventListener('click', () => {
      switchPlayerTool('tools/encyclopedia.html');
    });
  }

  if (ptOpenExternalBtn) {
    ptOpenExternalBtn.addEventListener('click', () => {
      window.open(currentToolUrl, '_blank');
    });
  }

  const ptProbabilityBtn = document.getElementById('pt-probability-btn');
  if (ptProbabilityBtn) {
    ptProbabilityBtn.addEventListener('click', () => {
      switchPlayerTool('tools/probability.html');
    });
  }

  const ptEncyclopediaBtn = document.getElementById('pt-encyclopedia-btn');
  if (ptEncyclopediaBtn) {
    ptEncyclopediaBtn.addEventListener('click', () => {
      switchPlayerTool('tools/encyclopedia.html');
    });
  }

  const ptGamepediaBtn = document.getElementById('pt-gamepedia-btn');
  if (ptGamepediaBtn) {
    ptGamepediaBtn.addEventListener('click', () => {
      switchPlayerTool('tools/encyclopedia.html');
    });
  }

  if (ptReturnBtn) {
    ptReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('player-tools-page').style.display = 'none';
      if (ptFrame) {
        ptFrame.src = 'about:blank';
      }
    });
  }

  const aboutBtn = document.getElementById('about-btn');
  const aboutReturnBtn = document.getElementById('about-return-btn');

  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('about-page').style.display = 'block';
      document.getElementById('game-content').style.display = 'none';
      document.getElementById('input-area').style.display = 'none';
      document.getElementById('save-page').style.display = 'none';
      document.getElementById('best-record-page').style.display = 'none';
      document.getElementById('achievement-page').style.display = 'none';
      document.getElementById('settings-page').style.display = 'none';
    });
  }

  if (aboutReturnBtn) {
    aboutReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('about-page').style.display = 'none';
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        newGameBtn?.click();
      }
    });
  }

  document.getElementById('game-content').style.display = 'none';
  document.getElementById('input-area').style.display = 'none';
  document.getElementById('name-setup').style.display = 'flex';
  document.getElementById('save-page').style.display = 'none';
  document.getElementById('best-record-page').style.display = 'none';
  document.getElementById('about-page').style.display = 'none';
  initAppearanceUI();
}
