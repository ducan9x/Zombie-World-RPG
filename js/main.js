/* ============================================================
   Módul nhập game
   Thứ tự sắp xếp: Nhập → Ràng buộc đầu vào → Khởi tạo
   ============================================================ */

import { renderAll, initUI, setupPagination, setPresentationRefresh, showNotice } from './ui.js';
import { initPresentation } from './presentation/app.js';
import { handleAction } from './game/index.js';
import { processCheatCommand } from './cheats.js';
import { getState, setStory, setAutoSaveCallback } from './state.js';
import { saveGame } from './save.js';
import { pixiRenderer } from './pixi-renderer.js';

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
      if (pixiRenderer.enabled) pixiRenderer.render(getState());
      input.value = '';
      input.focus();
      return;
    }

    const value = parseInt(rawValue, 10);
    if (isNaN(value) || value < 1) {
      showNotice('Vui lòng nhập đúng lựa chọn');
      input.value = '';
      input.focus();
      return;
    }
    handleAction(value);
    renderAll();
    if (pixiRenderer.enabled) pixiRenderer.render(getState());
    input.value = '';
    // Keep the virtual keyboard closed after touch actions; keyboard users retain focus.
  }

  btn.addEventListener('click', submitAction);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAction();
  });
}

// ---------- Khởi tạo (Initialization) ----------

/**
 * Khởi tạo trò chơi
 * Khởi tạo UI (gắn nút màn hình bắt đầu), gắn thao tác nhập, vẽ tất cả giao diện
 */
async function init() {
  setAutoSaveCallback((state) => saveGame(0, state, state.name));
  initUI();
  initPresentation({ setRefresh: setPresentationRefresh, renderAll });
  setupPagination();
  setupActionInput();
  renderAll();

  // Khoi tao PixiJS renderer (Phase 1.5) va hien thi lan dau
  try {
    await pixiRenderer.init();
    pixiRenderer.render(getState());
  } catch (err) {
    console.warn('[PixiRenderer] Khoi tao that bo, game van chay boi DOM:', err.message);
  }
}

// ---------- Chạy phần khởi động ----------
init();
