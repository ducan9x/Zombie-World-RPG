/* ============================================================
   Mô-đun hệ thống lưu trữ
   Thứ tự tổ chức: import → hằng số → tên khóa localStorage → thao tác vị trí lưu
   → kỷ lục tốt nhất → định dạng thời gian
   Sử dụng localStorage để lưu trữ 11 vị trí lưu và kỷ lục sinh tồn tốt nhất
   ============================================================ */

import { normalizeState } from './state.js';

const SAVE_KEY_PREFIX = "zombie_save_";
const BEST_RECORD_KEY = "zombie_best_record";
const MAX_SLOTS = 11;

// ---------- Thao tác vị trí lưu ----------

/**
 * Lấy tên khóa localStorage cho vị trí lưu chỉ định
 * @param {number} slotId - số thứ tự vị trí (0~10)
 * @returns {string} tên khóa localStorage
 */
function getSlotKey(slotId) {
  return SAVE_KEY_PREFIX + slotId;
}

/**
 * Định dạng dấu thời gian thành chuỗi có thể đọc
 * @param {Date} date - đối tượng ngày
 * @returns {string} chuỗi thời gian định dạng YYYY-MM-DD HH:MM:SS
 */
function formatTimestamp(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

/**
 * Lấy dữ liệu của toàn bộ 11 vị trí lưu
 * Vị trí trống trả về null, vị trí đã dùng trả về metadata (không chứa gameState đầy đủ)
 * @returns {Array<Object|null>} mảng độ dài 11
 */
export function getAllSlots() {
  const slots = [];
  for (let i = 0; i < MAX_SLOTS; i++) {
    const raw = localStorage.getItem(getSlotKey(i));
    if (!raw) {
      slots.push(null);
      continue;
    }
    try {
      const parsed = JSON.parse(raw);
      slots.push({
        slotId: parsed.slotId,
        nickname: parsed.nickname,
        day: parsed.day,
        timestamp: parsed.timestamp
      });
    } catch (e) {
      slots.push(null);
    }
  }
  return slots;
}

/**
 * Lưu trạng thái game hiện tại vào vị trí chỉ định
 * @param {number} slotId - số thứ tự vị trí (0~9)
 * @param {Object} gameState - trạng thái game đầy đủ hiện tại
 * @param {string} nickname - biệt danh người chơi
 * @returns {boolean} có lưu thành công hay không
 */
export function saveGame(slotId, gameState, nickname) {
  if (slotId < 0 || slotId >= MAX_SLOTS) return false;
  try {
    const now = new Date();
    const cleanState = JSON.parse(JSON.stringify(gameState));
    const tempFields = ['_trade', '_npcId', '_currentQuest', '_pendingZombie', '_pendingNpc', '_combatNpcDefeated', '_discardItems', '_pendingDiscardItem', '_playerDied', '_maSanQuest4Combat', '_maSanKilledPlayer', '_liuruyanQuest2Combat', '_divingZombieCombat', '_identityDisplay', '_tripped', '_frozen', '_blindTurns', '_lastTriggeredEnding', '_mumiaoGiftFromMenu'];
    tempFields.forEach(field => delete cleanState[field]);
    delete cleanState._saveSlotId;
    delete cleanState._saveSlotData;
    delete cleanState._endingBeforeSave;
    delete cleanState._barAction;
    delete cleanState._streetAction;
    delete cleanState._investAction;
    const saveData = {
      slotId,
      nickname,
      day: cleanState.day,
      timestamp: formatTimestamp(now),
      gameState: cleanState
    };
    localStorage.setItem(getSlotKey(slotId), JSON.stringify(saveData));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tải dữ liệu lưu đầy đủ từ vị trí chỉ định
 * @param {number} slotId - số thứ tự vị trí (0~9)
 * @returns {Object|null} dữ liệu lưu (chứa gameState), hoặc null
 */
export function loadGame(slotId) {
  if (slotId < 0 || slotId >= MAX_SLOTS) return null;
  const raw = localStorage.getItem(getSlotKey(slotId));
  if (!raw) return null;
  try {
    const saveData = JSON.parse(raw);
    if (saveData.gameState) {
      normalizeState(saveData.gameState);
    }
    return saveData;
  } catch (e) {
    return null;
  }
}

/**
 * Xóa bản lưu của vị trí chỉ định
 * @param {number} slotId - số thứ tự vị trí (0~9)
 * @returns {boolean} có xóa thành công hay không
 */
export function deleteSlot(slotId) {
  if (slotId < 0 || slotId >= MAX_SLOTS) return false;
  localStorage.removeItem(getSlotKey(slotId));
  return true;
}

export function autoSave(gameState, nickname) {
  return saveGame(0, gameState, nickname);
}

// ---------- Kỷ lục tốt nhất ----------

/**
 * Lấy kỷ lục sinh tồn tốt nhất trong lịch sử
 * @returns {Object|null} dữ liệu kỷ lục tốt nhất, hoặc null (chưa có kỷ lục)
 */
export function getBestRecord() {
  const raw = localStorage.getItem(BEST_RECORD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Cập nhật kỷ lục sinh tồn tốt nhất (chỉ cập nhật khi số ngày hiện tại lớn hơn)
 * @param {Object} gameState - trạng thái game hiện tại
 * @returns {boolean} có làm mới kỷ lục hay không
 */
export function updateBestRecord(gameState) {
  const best = getBestRecord();
  if (best && gameState.day <= best.day) {
    return false;
  }

  const record = {
    day: gameState.day,
    nickname: gameState.name,
    snapshot: {
      food: gameState.food.map(f => ({ ...f })),
      drinks: gameState.drinks.map(d => ({ ...d })),
      medicine: gameState.medicine.map(m => ({ ...m })),
      other: gameState.other.map(o => ({ ...o })),
      cigarettes: gameState.cigarettes,
      gasoline: gameState.gasoline,
      royalCoins: gameState.royalCoins,
      ammo: gameState.ammo.map(a => ({ ...a })),
      backpack: { ...gameState.backpack },
      meleeWeapon: { ...gameState.meleeWeapon },
      rangedWeapon: gameState.rangedWeapon ? { ...gameState.rangedWeapon } : null,
      health: gameState.health,
      crash: gameState.crash,
      infection: gameState.infection,
      location: gameState.location
    }
  };

  localStorage.setItem(BEST_RECORD_KEY, JSON.stringify(record));
  return true;
}
