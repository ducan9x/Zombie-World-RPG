import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { SPECIAL_ITEMS } from '../config.js';

import { hasCastleIdentity, getCastleRankName } from '../faction.js';

import { BAR_OPEN_PHASES, BAR_MENU } from '../data/island/bar-menu.js';

import { refreshIslandMenu } from './index.js';

export function handleBar() {
  const state = getState();
  if (!hasCastleIdentity(state) && !state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) {
    setStory('Người phục vụ ở cửa chặn bạn: "Xin lỗi, thưa ngài. Đây là nơi dành riêng cho quý tộc, vui lòng xuất trình thẻ thân phận hoặc giấy thông hành lâu đài."');
    refreshIslandMenu();
    return;
  }
  if (!BAR_OPEN_PHASES.includes(state.phaseIndex)) {
    setStory('Cửa quán bar đóng chặt, trên cửa treo một tấm biển: "Giờ mở cửa: chiều tối đến rạng sáng".');
    refreshIslandMenu();
    return;
  }
  const opts = BAR_MENU.map((item, i) => ({
    text: `${item.name}（${item.price} xu）`,
    action: "bar_order",
    menuIndex: i,
  }));
  opts.push({ text: "Rời đi", action: "bar_leave" });
  setPhase("island_bar");
  setStory('Quán bar do Vua Karen của Lâu đài Tận thế đầu tư, tọa lạc tại khu trung tâm đảo của Công tước Dư Mặc. Quý tộc ra vào tấp nập, cuộc sống uống rượu vui chơi và xa hoa trụy lạc trên đảo, giống như lâu đài, như thể ngày tận thế chưa từng xảy ra. Pha chế nhìn bạn, hỏi "Thưa ngài? Tối nay uống gì?"');
  setOptions(opts);
}

export function handleBarAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  const action = option.action;

  if (action === "bar_order") {
    const menuItem = BAR_MENU[option.menuIndex];
    if (!menuItem) {
      handleBar();
      return;
    }
    if (state.royalCoins < menuItem.price) {
      setStory(`Bạn sờ túi, tiền hoàng gia không đủ……cần ${menuItem.price} xu, hiện chỉ có ${state.royalCoins} xu.`);
      handleBar();
      return;
    }
    removeRoyalCoins(menuItem.price);
    const effects = menuItem.effects;
    if (effects.crash) {
      state.crash = Math.max(0, state.crash + effects.crash);
    }
    if (effects.hunger) {
      state.hunger = Math.min(100, state.hunger + effects.hunger);
    }
    if (effects.hydration) {
      state.hydration = Math.min(100, state.hydration + effects.hydration);
    }
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      let effectDesc = [];
      if (effects.hunger) effectDesc.push(`No+${effects.hunger}`);
      if (effects.hydration) effectDesc.push(`Nước+${effects.hydration}`);
      if (effects.crash) effectDesc.push(`Mệt${effects.crash}`);
      const effectText = effectDesc.length > 0 ? `\n\n${effectDesc.join("  ")}  |  Tốn ${menuItem.price} xu hoàng gia  |  Số dư ${getState().royalCoins} xu hoàng gia` : "";
      setStory(`${menuItem.story}${effectText}`);
      setPhase("island_bar");
      setOptions([{ text: "Tiếp tục", action: "bar_continue" }]);
    }
  } else if (action === "bar_continue") {
    handleBar();
  } else if (action === "bar_leave") {
    refreshIslandMenu();
  }
}