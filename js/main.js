/* ============================================================
   Módul nhập game
   Thứ tự sắp xếp: Nhập → Ràng buộc đầu vào → Khởi tạo
   ============================================================ */

import { renderAll, initUI, setupPagination } from './ui.js';
import { handleAction } from './game/index.js';
import { processCheatCommand } from './cheats.js';
import { getState, setStory, setAutoSaveCallback } from './state.js';
import { saveGame } from './save.js';

// ---------- Ràng buộc đầu vào ----------

/**
 * Thiết lập trình lắng nghe thao tác nhập
 * Ràng buộc nút submit của ô nhập và sự kiện phím Enter
 * Tất cả hoạt động game (bao gồm chọn vị trí trang lưu) đều được điều hướng qua cổng nhập này
 */
function setupActionInput() {
  const input = document.getElementById('action-input');
  const btn = document.getElementById('submit-btn');

  function submitAction() {
    const rawValue = input.value.trim();
    if (!rawValue) return;

    const cheatResult = processCheatCommand(rawValue);
    if (cheatResult !== null) {
      if (cheatResult.success && cheatResult.message) {
        const state = getState();
        setStory((state.story || "") + "\n\n[Mã gian lận] " + cheatResult.message);
      }
      renderAll();
      input.value = '';
      input.focus();
      return;
    }

    const value = parseInt(rawValue, 10);
    if (isNaN(value) || value < 1) {
      alert('Vui lòng nhập đúng lựa chọn');
      input.value = '';
      input.focus();
      return;
    }
    handleAction(value);
    renderAll();
    input.value = '';
    input.focus();
  }

  btn.addEventListener('click', submitAction);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAction();
  });
}

// ---------- 初始化 ----------

/**
 * 初始化游戏
 * 初始化 UI（含开始界面按钮绑定）、绑定操作输入、渲染所有界面
 */
function init() {
  setAutoSaveCallback((state) => saveGame(0, state, state.name));
  initUI();
  setupPagination();
  setupActionInput();
  renderAll();
}

// ---------- 启动 ----------
init();
