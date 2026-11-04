/* ============================================================
   Mô-đun định tuyến phân phối
   Thống nhất quản lý menu trang chủ/khám phá/quay lại v.v., tránh phụ thuộc vòng
   ============================================================ */

import {
  getState,
  setPhase,
  setOptions,
} from './state.js';

import {
  showOutpostOptions,
} from './outpost/index.js';

import {
  MAP_ACTIONS,
} from './config.js';

import {
  refreshCastleInterior,
  refreshCastleOutpost,
} from './castle/index.js';

/**
 * Hiển thị các tùy chọn menu trang chủ
 */
export function showHomeOptions() {
  if (getState().gameOver) return;
  setPhase("choose");
  const state = getState();
  const opts = [
    { text: "Ngủ", action: "sleep" },
    { text: "Ăn", action: "eat" },
    { text: "Uống", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: state.weather === "mua_axit" ? "Ra ngoài (mưa axit không thể ra)" : "Ra ngoài", action: "goOut", disabled: state.weather === "mua_axit" },
    { text: "Vứt bỏ", action: "discard" },
    { text: "Lưu", action: "save_game" },
    { text: "Thu hoạch đồng đội", action: "partner_harvest" },
    { text: "Xây dựng căn cứ", action: "base_build" },
    { text: "Ghi chú sinh tồn", action: "survival_notes" },
    { text: "Quay lại menu", action: "back_to_main_menu" },
  ];
  setOptions(opts);
}

/**
 * Hiển thị các tùy chọn menu trong trạng thái khám phá
 */
export function showExploreOptionsState() {
  if (getState().gameOver) return;
  const state = getState();
  if (state.currentMap && state.currentMap.id === "tran_dia_binh_minh") {
    showOutpostOptions();
    return;
  }
  if (state.currentMap && state.currentMap.id === "lau_dai_tan_the") {
    if (state.currentSubMap === "noi_that_lau_dai") {
      refreshCastleInterior();
      return;
    }
    refreshCastleOutpost();
    return;
  }
  setPhase("explore");
  const opts = [
    { text: "Khám phá", action: "explore" },
    { text: "Ăn", action: "eat" },
    { text: "Uống", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Về nhà", action: "goHome" },
    { text: "Vứt bỏ", action: "discard" }
  ];
  if (state.currentMap) {
    const mapActions = MAP_ACTIONS[state.currentMap.id];
    if (mapActions) {
      for (const act of mapActions) {
        opts.push({ text: act.text, action: act.action });
      }
    }
    // Nhiệm vụ Lão Mã bảy: tùy chọn ẩn đường hầm tàu điện ngầm
    if (state.currentMap.id === "ham_tau_dien_ngam" && state.oldMaStep >= 7) {
      opts.push({ text: "Chờ Lão Mã", action: "wait_old_ma" });
    }
  }
  setOptions(opts);
}

/**
 * Trả về menu tương ứng theo vị trí hiện tại
 */
export function showBaseBuildOptions() {
  if (getState().gameOver) return;
  setPhase("base_build");
  setOptions([
    { text: "Cải tạo căn cứ", action: "upgrade_base" },
    { text: "Trồng cây", action: "plant_crop" },
    { text: "Xem đất trồng", action: "view_crops" },
    { text: "Thu hoạch cây", action: "harvest_crops" },
    { text: "Xây kho", action: "build_warehouse" },
    { text: "Mở kho", action: "open_warehouse" },
    { text: "Quay lại", action: "back_to_home" },
  ]);
}

export function returnToMenu() {
  const state = getState();
  if (state.gameOver) return;
  if (state.currentMap) {
    showExploreOptionsState();
  } else {
    showHomeOptions();
  }
}