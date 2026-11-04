import {
  getState,
  setPhase,
  setStory,
  setOptions,
  resetState,
} from '../state.js';

import {
  saveGame,
  loadGame,
  deleteSlot,
  getAllSlots
} from '../save.js';

import { showHomeOptions, showExploreOptionsState, returnToMenu } from '../routing.js';

export function handleSavePage() {
  const state = getState();
  const transientPhases = ["pre_combat", "pre_combat_npc", "combat", "survivor_interact", "trader_interact", "trader_buy_ammo", "trader_ammo_qty", "trader_buy_weapon", "doctor_interact", "npc_interact", "npc_gift", "npc_quest", "npc_quest_confirm", "npc_quest_preview", "npc_recycle", "npc_recycle_ranged", "npc_recycle_backpack", "npc_repair", "npc_repair_bow", "npc_cure", "lili_repair_gun", "lili_repair_bow", "leader_assassinate", "leader_assassinate_warn", "leader_gift_select", "nurse_feed", "castle_loan_input", "castle_banker", "castle_banker_waiver", "castle_guard", "castle_bank", "castle_identity", "castle_interior", "castle_treatment", "castle_king_quest", "castle_king_dialog", "map_npc", "map_npc_trade", "map_npc_gift_select", "v_trade", "v_trade_result", "xiaohan_trade", "lili_trade", "island_bank", "island_fishing", "island_yumo", "island_guyue", "island_linhan", "island_bar", "island_black_market", "island_intel", "island_street", "island_street_melee", "island_street_ammo", "island_street_ammo_recycle", "island_street_food", "island_street_medical", "island_invest"];
  if (transientPhases.includes(state.phase)) {
    setStory("Trạng thái hiện tại không thể lưu, hãy trở về trạng thái an toàn rồi lưu.");
    return;
  }
  if (state.gameOver && !state._endingBeforeSave) return;
  setPhase("save_page");
  setStory("Quản lý lưu trữ - Chọn một ô lưu để thao tác:\nNhập số tương ứng chọn ô, nhập 12 để quay lại.");
  renderSaveSlotsAsOptions();
}

export function renderSaveSlotsAsOptions() {
  const slots = getAllSlots();
  const opts = [];
  const autoSlot = slots[0];
  if (autoSlot) {
    opts.push({ text: `🔄 Tự động lưu | ${autoSlot.nickname} | Ngày ${autoSlot.day} | ${autoSlot.timestamp}`, action: "save_slot", index: 0 });
  } else {
    opts.push({ text: `🔄 Tự động lưu | ——Trống——`, action: "save_slot", index: 0 });
  }
  for (let i = 1; i < slots.length; i++) {
    const slot = slots[i];
    if (slot) {
      opts.push({ text: `Ô ${i}. ${slot.nickname} | Ngày ${slot.day} | ${slot.timestamp}`, action: "save_slot", index: i });
    } else {
      opts.push({ text: `Ô ${i}. ——Trống——`, action: "save_slot", index: i });
    }
  }
  opts.push({ text: "Quay lại", action: "back", index: -1 });
  setOptions(opts);
}

export function handleSavePageAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    returnToMenu();
    return;
  }

  const slotId = option.index;
  state._saveSlotId = slotId;
  state._saveSlotData = loadGame(slotId);

  if (slotId === 0) {
    setPhase("save_confirm");
    if (state._saveSlotData) {
      setStory(`🔄 Tự động lưu: ${state._saveSlotData.nickname} | Ngày ${state._saveSlotData.day} | ${state._saveSlotData.timestamp}\n(Tự động lưu mỗi 5 ngày tự ghi đè, không thể sửa thủ công)`);
      setOptions([
        { text: "Tải lưu", action: "load" },
        { text: "Quay lại", action: "back" }
      ]);
    } else {
      setStory(`🔄 Tự động lưu: Chưa có tự động lưu`);
      setOptions([
        { text: "Quay lại", action: "back" }
      ]);
    }
    return;
  }

  setPhase("save_confirm");

  if (state._saveSlotData) {
    setStory(`Ô ${slotId}: ${state._saveSlotData.nickname} | Ngày ${state._saveSlotData.day} | ${state._saveSlotData.timestamp}\n⚠ Chọn "Ghi đè lưu" sẽ vĩnh viễn ghi đè lưu này!`);
    setOptions([
      { text: "Tải lưu", action: "load" },
      { text: "Ghi đè lưu", action: "overwrite" },
      { text: "Xóa lưu", action: "delete" },
      { text: "Quay lại", action: "back" }
    ]);
  } else {
    setStory(`Ô ${slotId}: Trống`);
    setOptions([
      { text: "Lưu vào đây", action: "save" },
      { text: "Quay lại", action: "back" }
    ]);
  }
}

export function handleSaveConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const action = state.options[optionIndex].action;
  const slotId = state._saveSlotId;

  if (action === "back") {
    handleSavePage();
    return;
  }

  if (action === "save" || action === "overwrite") {
    const ok = saveGame(slotId, state, state.name);
    if (ok) {
      if (slotId === 0) {
        setStory(`Tự động lưu đã được lưu.`);
      } else {
        setStory(`Lưu đã được lưu vào ô ${slotId}.`);
      }
    } else {
      setStory("Lưu thất bại!");
    }
    handleSavePage();
    return;
  }

  if (action === "load") {
    const saveData = loadGame(slotId);
    if (!saveData || !saveData.gameState) {
      setStory("Tải lưu thất bại, dữ liệu lưu bị hỏng!");
      handleSavePage();
      return;
    }
    resetState();
    Object.assign(getState(), saveData.gameState);
    const loadedState = getState();
    setStory(`Tải lưu thành công! Chào mừng trở lại, ${loadedState.name}.`);
    setPhase("choose");
    if (loadedState.currentMap) {
      showExploreOptionsState();
    } else {
      showHomeOptions();
    }
    return;
  }

  if (action === "delete") {
    const ok = deleteSlot(slotId);
    if (ok) {
      setStory(`Lưu của ô ${slotId} đã bị xóa.`);
    } else {
      setStory("Xóa thất bại!");
    }
    handleSavePage();
    return;
  }
}