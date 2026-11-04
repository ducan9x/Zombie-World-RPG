/* ============================================================
   Mô-đun render UI game
   Thứ tự tổ chức: import → hàm phụ trợ → render bảng điều khiển (trạng thái/vũ khí/ba lô/hàng hóa/câu chuyện/lựa chọn)
   → render tổng hợp → khởi tạo UI
   ============================================================ */

import { getState, setName, setPhase, resetState, getItemDisplayName, getGameSettings, toggleClickMode, toggleInputMode, toggleMusic } from './state.js';
import { TIME_PHASES, BASE_LEVELS, ACHIEVEMENTS, GAME_CONSTANTS } from './config.js';
import { getAllSlots, getBestRecord } from './save.js';
import { handleSavePage, handleSavePageAction, handleSaveConfirm } from './game/index.js';
import { returnToMenu } from './routing.js';
import { handleAction } from './game/index.js';
import { getIdentityDisplayName } from './faction.js';
import { INVEST_DIRECTIONS } from './data/island/investment.js';

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
  return state.ammo.map(a => `${a.name}×${a.count}`).join('、');
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
  panel.innerHTML = `
<div class="stats-title">📊 Trạng thái nhân vật</div>
<div class="stat-row"><span class="stat-label">Nhân vật</span><span class="stat-value">${state.name}</span></div>
<div class="stat-row"><span class="stat-label">Thời gian</span><span class="stat-value">Ngày ${state.day} ${TIME_PHASES[state.phaseIndex]} · ${state.weather}</span></div>
<div class="stat-row"><span class="stat-label">Địa điểm</span><span class="stat-value">${state.location}</span></div>
<div class="stat-bar-row">
  <span class="stat-bar-label">❤️ Sức khỏe</span>
  <div class="stat-bar-track"><div class="stat-bar-fill hp" style="width:${hpPct}%"></div></div>
  <span class="stat-bar-value hp">${state.health}</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label">🍖 Bụng no</span>
  <div class="stat-bar-track"><div class="stat-bar-fill hunger" style="width:${state.hunger}%"></div></div>
  <span class="stat-bar-value hunger">${state.hunger}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label">💧 Nước</span>
  <div class="stat-bar-track"><div class="stat-bar-fill thirst" style="width:${state.hydration}%"></div></div>
  <span class="stat-bar-value thirst">${state.hydration}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label">🧠 Lý trí</span>
  <div class="stat-bar-track"><div class="stat-bar-fill sanity" style="width:${state.sanity}%"></div></div>
  <span class="stat-bar-value sanity">${state.sanity}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label">💪 Mệt mỏi</span>
  <div class="stat-bar-track"><div class="stat-bar-fill fatigue" style="width:${state.crash}%"></div></div>
  <span class="stat-bar-value fatigue">${state.crash}%</span>
</div>
<div class="stat-bar-row">
  <span class="stat-bar-label">🦠 Nhiễm bệnh</span>
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
  <div class="stat-row"><span class="stat-label">🔪 Cận chiến</span><span class="stat-value">${state.meleeWeapon.name}（sát thương${state.meleeWeapon.damage} liên kích${Math.round((state.meleeWeapon.comboRate || 0) * 100)}%）</span></div>
  <div class="stat-row"><span class="stat-label">🛡️ Độ bền</span><span class="stat-value">${meleeDurability}</span></div>
  <div class="stat-row"><span class="stat-label">🏹 Tầm xa</span><span class="stat-value">${state.rangedWeapon ? state.rangedWeapon.name : 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">⚙️ Độ nguyên vẹn</span><span class="stat-value">${state.rangedWeapon ? state.rangedWeapon.integrity : 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">💥 Đạn dược</span><span class="stat-value">${formatAmmo(state)}</span></div>
</div>`;
}

/**
 * Render bảng điều khiển ba lô
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderInventory(state) {
  const panel = document.getElementById('inventory-panel');
  const count = getBackpackCount(state);
  
  // Lọc riêng thực phẩm, cá, trái cây
  const foods = state.food.filter(f => f.type === "food" || f.type === "fruit");
  const fish = state.food.filter(f => f.type === "fish");
  
  // Phân loại "khác" thành vũ khí, súng, vật liệu xây dựng, khác
  const meleeItems = state.other.filter(o => o.type === "melee");
  const rangedItems = state.other.filter(o => o.type === "ranged");
  const buildingItems = state.other.filter(o => o.type === "building");
  const otherItems = state.other.filter(o => o.type !== "melee" && o.type !== "ranged" && o.type !== "building");
  
  panel.innerHTML = `
<div class="inventory-panel">
  <div class="panel-title">🎒 Ba lô</div>
  <div class="stat-row"><span class="stat-label">Ba lô</span><span class="stat-value">${state.backpack.name}（sức chứa${count}/${state.backpack.capacity}）</span></div>
  <div class="stat-row"><span class="stat-label">🍞 Thực phẩm</span><span class="stat-value">${foods.map(f => getItemDisplayName(f)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🥤 Đồ uống</span><span class="stat-value">${state.drinks.map(d => getItemDisplayName(d)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">💊 Y tế</span><span class="stat-value">${state.medicine.map(m => getItemDisplayName(m)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🐟 Cá</span><span class="stat-value">${fish.map(f => getItemDisplayName(f)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">⚔️ Vũ khí</span><span class="stat-value">${meleeItems.map(o => getItemDisplayName(o)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🔫 Súng</span><span class="stat-value">${rangedItems.map(o => getItemDisplayName(o)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🧱 Vật liệu xây dựng</span><span class="stat-value">${buildingItems.map(o => getItemDisplayName(o)).join('、') || 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🌱 Hạt giống</span><span class="stat-value">${state.seeds ? state.seeds.map(s => getItemDisplayName(s)).join('、') || 'Không' : 'Không'}</span></div>
  <div class="stat-row"><span class="stat-label">🧰 Khác</span><span class="stat-value">${otherItems.map(o => getItemDisplayName(o)).join('、') || 'Không'}</span></div>
</div>`;
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
  <div class="stat-row"><span class="stat-label">🚬 Thuốc lá</span><span class="stat-value">${cigDisplay}</span></div>
  <div class="stat-row"><span class="stat-label">⛽ Xăng</span><span class="stat-value">${gasDisplay}</span></div>
  <div class="stat-row"><span class="stat-label">👑 Tiền hoàng gia</span><span class="stat-value">${royalDisplay}</span></div>
  <div class="stat-row"><span class="stat-label">🔋 Năng lượng tinh khiết</span><span class="stat-value">${pureDisplay}</span></div>
  <div class="stat-row"><span class="stat-label">🏰 Nợ lâu đài</span><span class="stat-value">${state.castleDebt ? (() => { const d = state.castleDebt.dueDay - state.day; return d > 0 ? `${state.castleDebt.amount} điếu thuốc lá, còn ${d} ngày` : `${state.castleDebt.amount} điếu thuốc lá, quá hạn ${-d} ngày!`; })() : "Không"}</span></div>
  <div class="stat-row"><span class="stat-label">🏝️ Nợ đảo</span><span class="stat-value">${state.islandDebt ? (() => { const d = state.islandDebt.dueDay - state.day; return d > 0 ? `${state.islandDebt.amount} tiền hoàng gia, còn ${d} ngày` : `${state.islandDebt.amount} tiền hoàng gia, quá hạn ${-d} ngày!`; })() : "Không"}</span></div>
  <div class="stat-row"><span class="stat-label">📈 Đầu tư</span><span class="stat-value">${state.investment ? (() => { const dir = INVEST_DIRECTIONS.find(d => d.id === state.investment.directionId); const daysLeft = state.investment.dueDay - state.day; return daysLeft > 0 ? `${dir ? dir.name : state.investment.directionId}，${state.investment.amount} xu, còn ${daysLeft} ngày` : `${dir ? dir.name : state.investment.directionId}，${state.investment.amount} xu, đã đáo hạn!`; })() : "Không"}</span></div>
</div>`;
}

/**
 * Render khu vực văn bản câu chuyện
 * @param {Object} state - Đối tượng trạng thái game
 */
export function renderStory(state) {
  const area = document.getElementById('story-area');
  area.innerHTML = state.story;
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
  const page = state._optionPage || 0;
  const totalPages = Math.ceil(options.length / pageSize);

  if (totalPages <= 1) {
    paginationArea.style.display = 'none';
    const totalSlots = 30;
    let html = '';
    for (let i = 0; i < totalSlots; i++) {
      if (i < options.length) {
        const option = options[i];
        const disabledClass = option.disabled ? ' option-disabled' : '';
        const disabledAttr = option.disabled ? ' data-disabled="true"' : '';
        html += `<div class="option-item${disabledClass}" data-index="${i + 1}"${disabledAttr}>${option.text}</div>`;
      } else {
        html += '<div class="option-item option-empty"></div>';
      }
    }
    area.innerHTML = html;
  } else {
    paginationArea.style.display = 'flex';
    const start = page * pageSize;
    const end = Math.min(start + pageSize, options.length);
    const pageOptions = options.slice(start, end);
    const totalSlots = 30;
    let html = '';
    for (let i = 0; i < totalSlots; i++) {
      if (i < pageOptions.length) {
        const option = pageOptions[i];
        const globalIdx = start + i;
        const disabledClass = option.disabled ? ' option-disabled' : '';
        const disabledAttr = option.disabled ? ' data-disabled="true"' : '';
        html += `<div class="option-item${disabledClass}" data-index="${globalIdx + 1}"${disabledAttr}>${option.text}</div>`;
      } else {
        html += '<div class="option-item option-empty"></div>';
      }
    }
    area.innerHTML = html;

    prevBtn.disabled = (page === 0);
    nextBtn.disabled = (page >= totalPages - 1);
    pageInfo.textContent = `${page + 1}/${totalPages}`;
  }

  const settings = getGameSettings();
  if (settings.clickMode) {
    const items = area.querySelectorAll('.option-item:not([data-disabled="true"]):not(.option-empty)');
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
  const foodNames = (s.food && s.food.length > 0) ? s.food.map(f => getItemDisplayName(f)).join('、') : 'Không';
  const drinkNames = (s.drinks && s.drinks.length > 0) ? s.drinks.map(d => getItemDisplayName(d)).join('、') : 'Không';
  const medicineNames = (s.medicine && s.medicine.length > 0) ? s.medicine.map(m => getItemDisplayName(m)).join('、') : 'Không';
  const otherNames = (s.other && s.other.length > 0) ? s.other.map(o => getItemDisplayName(o)).join('、') : 'Không';
  const cigDisplay = (s.cigarettes && s.cigarettes > 0) ? '(' + s.cigarettes + ') thuốc lá' : 'Không';
  const gasDisplay = (s.gasoline && s.gasoline > 0) ? '(' + s.gasoline + ') xăng' : 'Không';
  const royalDisplay = (s.royalCoins && s.royalCoins > 0) ? '(' + s.royalCoins + ') tiền hoàng gia' : 'Không';
  const pureDisplay = (s.pureEnergy && s.pureEnergy > 0) ? '(' + s.pureEnergy + ') năng lượng tinh khiết' : 'Không';
  const ammoNames = (s.ammo && s.ammo.length > 0) ? s.ammo.map(a => `${a.name}×${a.count}`).join('、') : 'Không';

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
<div>Ba lô: ${backpackName}（${backpackCapacity} ô）</div>
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

export function renderSettingsPage() {
  const settings = getGameSettings();
  const clickBtn = document.getElementById('click-mode-btn');
  const inputBtn = document.getElementById('input-mode-btn');
  const musicBtn = document.getElementById('music-btn');
  if (clickBtn) {
    clickBtn.textContent = 'Chế độ nhấp: ' + (settings.clickMode ? 'Bật' : 'Tắt');
    clickBtn.className = 'settings-toggle-btn ' + (settings.clickMode ? 'on' : 'off');
  }
  if (inputBtn) {
    inputBtn.textContent = 'Chế độ nhập: ' + (settings.inputMode ? 'Bật' : 'Tắt');
    inputBtn.className = 'settings-toggle-btn ' + (settings.inputMode ? 'on' : 'off');
  }
  if (musicBtn) {
    musicBtn.textContent = 'Nhạc game: ' + (settings.musicEnabled ? 'Bật' : 'Tắt');
    musicBtn.className = 'settings-toggle-btn ' + (settings.musicEnabled ? 'on' : 'off');
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
    storyArea.scrollTop = storyArea.scrollHeight;
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
  storyArea.scrollTop = storyArea.scrollHeight;
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
      resetState();
      setName(value);
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

  if (playerToolsBtn) {
    playerToolsBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'none';
      document.getElementById('player-tools-page').style.display = 'block';
    });
  }

  const ptProbabilityBtn = document.getElementById('pt-probability-btn');
  if (ptProbabilityBtn) {
    ptProbabilityBtn.addEventListener('click', () => {
      window.open('tools/probability.html', '_blank');
    });
  }

  const ptEncyclopediaBtn = document.getElementById('pt-encyclopedia-btn');
  if (ptEncyclopediaBtn) {
    ptEncyclopediaBtn.addEventListener('click', () => {
      window.open('tools/encyclopedia.html', '_blank');
    });
  }

  const ptGamepediaBtn = document.getElementById('pt-gamepedia-btn');
  if (ptGamepediaBtn) {
    ptGamepediaBtn.addEventListener('click', () => {
      window.open('tools/encyclopedia.html', '_blank');
    });
  }

  const ptReturnBtn = document.getElementById('player-tools-return-btn');
  if (ptReturnBtn) {
    ptReturnBtn.addEventListener('click', () => {
      document.getElementById('name-setup').style.display = 'flex';
      document.getElementById('player-tools-page').style.display = 'none';
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
}
