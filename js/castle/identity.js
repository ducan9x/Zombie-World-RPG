import { getState, setPhase, setStory, setOptions, removeCigarettes, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { GAME_CONSTANTS, SPECIAL_ITEMS } from '../config.js';
import { hasNobleId, hasAnyDawnIdentity, cleanDualIdentity } from '../faction.js';
import { handleCastleOutpost, refreshCastleOutpost } from './outpost.js';

export function handleCastleIdentity() {
  setPhase("castle_identity");
  const state = getState();
  const hasId = state.other.some(i => i.id === SPECIAL_ITEMS.noble_id.id);
  setStory(`🏛️ [Nơi xử lý thẻ thân phận lâu đài]\n\n${hasId ? "Hiện bạn đang giữ thẻ quý tộc." : "Hiện bạn không có thẻ quý tộc."}\n\nLàm thẻ quý tộc cần ${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá. Lưu ý: mất thẻ phải làm lại, hủy thẻ sẽ không hoàn trả thuốc lá.`);
  setOptions([
    { text: `Làm thẻ (${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá)`, action: "identity_apply", disabled: state.other.some(i => i.id === "noble_id") },
    { text: hasId ? "Hủy thẻ" : "Hủy thẻ (chưa làm)", action: "identity_cancel", disabled: !hasId },
    { text: "Rời đi", action: "identity_leave" },
  ]);
}

export function handleIdentityApply() {
  const state = getState();
  if (state.other.some(i => i.id === "noble_id")) {
    setStory("Bạn đã có thẻ quý tộc rồi, không cần làm lại.");
    setPhase("castle_identity");
    setOptions([
      { text: `Làm thẻ (${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá)`, action: "identity_apply", disabled: true },
      { text: "Hủy thẻ", action: "identity_cancel" },
      { text: "Rời đi", action: "identity_leave" },
    ]);
    return;
  }
  cleanDualIdentity(state);
  if (hasAnyDawnIdentity(state)) {
    setStory("Nhân viên nghi ngờ đánh giá bạn: \"Người của Dawn Garrison đến làm thẻ quý tộc? Ngươi đang đùa ta sao?\" Hai vệ binh đi tới, bạn đành phải rời đi.");
    refreshCastleIdentity();
    return;
  }
  if (state.cigarettes < GAME_CONSTANTS.CASTLE.NOBLE_ID_COST) {
      setStory(`❌ Bạn cần ${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá để làm thẻ quý tộc. Bạn chỉ có ${state.cigarettes} điếu. Hãy đi kiếm thêm rồi quay lại.`);
    refreshCastleIdentity();
    return;
  }
  removeCigarettes(GAME_CONSTANTS.CASTLE.NOBLE_ID_COST);
  state.other.push({ ...SPECIAL_ITEMS.noble_id });
  if (!state.unlockedAchievements) state.unlockedAchievements = [];
  if (!state.unlockedAchievements.includes("noble_status")) state.unlockedAchievements.push("noble_status");
  setStory(`✅ Bạn đã nộp ${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá, nhân viên khắc tên bạn lên một tấm thẻ dát vàng, trịnh trọng trao cho bạn.\n\nNhận được [Thẻ quý tộc]! Giờ bạn có thể tự do ra vào khu vực quý tộc của Lâu đài Tận Thế.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleIdentity();
}

export function handleIdentityCancel() {
  const state = getState();
  const idx = state.other.findIndex(i => i.id === SPECIAL_ITEMS.noble_id.id);
  if (idx !== -1) {
    state.other.splice(idx, 1);
  }
  setStory(`Bạn trả lại thẻ quý tộc, nhân viên mặt không biểu cảm thu nhận, không nói một lời. ${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá coi như mất trắng……`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleIdentity();
}

export function refreshCastleIdentity() {
  setPhase("castle_identity");
  const state = getState();
  const hasId = hasNobleId(state);
  setOptions([
    { text: `Làm thẻ (${GAME_CONSTANTS.CASTLE.NOBLE_ID_COST} điếu thuốc lá)`, action: "identity_apply", disabled: state.other.some(i => i.id === "noble_id") },
    { text: hasId ? "Hủy thẻ" : "Hủy thẻ (chưa làm)", action: "identity_cancel", disabled: !hasId },
    { text: "Rời đi", action: "identity_leave" },
  ]);
}

export function handleCastleIdentityAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "identity_apply") { handleIdentityApply(); return; }
  if (action === "identity_cancel") { handleIdentityCancel(); return; }
  if (action === "identity_leave") { handleCastleOutpost(); return; }
}