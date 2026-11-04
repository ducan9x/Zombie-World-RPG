import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, addItem, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { GAME_CONSTANTS, RANGED_WEAPONS } from '../config.js';

import { refreshIslandMenu } from './index.js';

function getRandomUncommonRanged() {
  const uncommon = RANGED_WEAPONS.filter(w => w.rarity === "uncommon");
  if (uncommon.length === 0) return null;
  return uncommon[Math.floor(Math.random() * uncommon.length)];
}

function checkBlackMarketRefresh(state) {
  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) return true;
  const daysSinceRefresh = state.day - bm.refreshDay;
  return daysSinceRefresh >= GAME_CONSTANTS.BLACK_MARKET.REFRESH_DAYS;
}

function generateBlackMarketItem(state) {
  const weapon = getRandomUncommonRanged();
  if (!weapon) return null;
  const min = GAME_CONSTANTS.BLACK_MARKET.PRICE_MIN_MULTIPLIER;
  const max = GAME_CONSTANTS.BLACK_MARKET.PRICE_MAX_MULTIPLIER;
  const multiplier = min + Math.random() * (max - min);
  const price = Math.round(weapon.damage * multiplier);
  return {
    weaponId: weapon.id,
    price,
    refreshDay: state.day,
  };
}

export function handleBlackMarket() {
  const state = getState();
  setPhase("island_black_market");

  if (checkBlackMarketRefresh(state)) {
    if (!state.blackMarket || !state.blackMarket.weaponId) {
      state.blackMarket = generateBlackMarketItem(state);
    } else {
      state.blackMarket = generateBlackMarketItem(state);
    }
  }

  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) {
    setStory("🏴‍☠️ Thị trường đen Hoàng Gia\n\nMột thương nhân đội mặt nạ đứng trong bóng tối, nói nhỏ: \"Hôm nay không có hàng tốt, hẹn ngày khác nhé。\"");
    setOptions([{ text: "Rời khỏi", action: "bm_leave" }]);
    return;
  }

  const weapon = RANGED_WEAPONS.find(w => w.id === bm.weaponId);
  if (!weapon) {
    setStory("🏴‍☠️ Thị trường đen Hoàng Gia\n\nThương nhân lắc đầu: \"Hàng có chút vấn đề, hẹn ngày khác nhé。\"");
    setOptions([{ text: "Rời khỏi", action: "bm_leave" }]);
    return;
  }

  let desc = "🏴‍☠️ Thị trường đen Hoàng Gia\n\n";
  desc += `Một thương nhân đội mặt nạ đi ra từ bóng tối, nói nhỏ: \"Xem cái này, hàng tốt không chờ ai。\"\n\n`;
  desc += `【${weapon.name}】\n`;
  desc += `Sát thương：${weapon.damage}\n`;
  desc += `Loại đạn：${weapon.ammoType}\n`;
  desc += `Tỷ lệ chí mạng：${Math.round(weapon.critRate * 100)}%\n`;
  desc += `Giá bán：${bm.price} Xu Hoàng Gia\n\n`;
  desc += `Xu Hoàng Gia hiện tại：${state.royalCoins}`;

  setStory(desc);
  setOptions([
    { text: `Mua（${bm.price} xu）`, action: "bm_buy" },
    { text: "Rời khỏi", action: "bm_leave" },
  ]);
}

export function handleBlackMarketAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "bm_buy") {
    handleBlackMarketBuy();
  } else if (action === "bm_continue") {
    handleBlackMarket();
  } else if (action === "bm_leave") {
    refreshIslandMenu();
  } else {
    refreshIslandMenu();
  }
}

function handleBlackMarketBuy() {
  const state = getState();
  const bm = state.blackMarket;
  if (!bm || !bm.weaponId) {
    handleBlackMarket();
    return;
  }

  const weapon = RANGED_WEAPONS.find(w => w.id === bm.weaponId);
  if (!weapon) {
    handleBlackMarket();
    return;
  }

  if (state.royalCoins < bm.price) {
    setStory(`Xu Hoàng Gia của bạn không đủ. Cần${bm.price} xu, hiện chỉ có${state.royalCoins} xu。`);
    setPhase("island_black_market");
    setOptions([{ text: "Tiếp tục", action: "bm_continue" }]);
    return;
  }

  removeRoyalCoins(bm.price);
  const weaponCopy = { ...weapon, integrity: weapon.integrity };
  addItem(weaponCopy);

  setStory(`Thương nhân đưa cho bạn ${weapon.name}: \"Có mắt, cây này sẽ không làm bạn thất vọng. Nhớ rằng, chúng ta chưa từng gặp mặt。\"\n\nChi phí ${bm.price} Xu Hoàng Gia, nhận ${weapon.name}\nXu Hoàng Gia hiện tại：${getState().royalCoins}`);

  state.blackMarket = { refreshDay: bm.refreshDay };

  setPhase("island_black_market");
  setOptions([{ text: "Tiếp tục", action: "bm_continue" }]);
}
