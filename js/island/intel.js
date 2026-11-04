import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { GAME_CONSTANTS } from '../config.js';

import { refreshIslandMenu } from './index.js';

export function handleIntel() {
  const state = getState();
  setPhase("island_intel");

  const currentTurn = state.day * 8 + state.phaseIndex;
  let statusText = "";
  if (state.intelImmunityEnd && state.intelImmunityEnd > currentTurn) {
    const remainingTurns = state.intelImmunityEnd - currentTurn;
    const remainingDays = Math.ceil(remainingTurns / 8);
    statusText = `\n\nHiệu quả tình báo hiện tại: Còn lại${remainingTurns} vòng(khoảng${remainingDays} ngày)khám phá không gặp thù`;
  }

  let desc = "📡 Trung tâm tình báo\n\n";
  desc += `Một buôn tình báo bí mật ngồi ở góc, nói nhỏ: \"Chi một chút tiền, tôi đảm bảo bạn khám phá sẽ không gặp bất kỳ rắc rối nào.${GAME_CONSTANTS.INTEL.DURATION} vòng trong, zombie và cường đạo sẽ không tìm đến bạn.\"\n\n`;
  desc += `Giá: ${GAME_CONSTANTS.INTEL.PRICE} Xu Hoàng Gia`;
  desc += statusText;
  desc += `\n\nXu Hoàng Gia hiện tại: ${state.royalCoins}`;

  setStory(desc);
  setOptions([
    { text: `Mua tình báo(${GAME_CONSTANTS.INTEL.PRICE} xu)`, action: "intel_buy" },
    { text: "Rời khỏi", action: "intel_leave" },
  ]);
}

export function handleIntelAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "intel_buy") {
    handleIntelBuy();
  } else if (action === "intel_continue") {
    handleIntel();
  } else if (action === "intel_leave") {
    refreshIslandMenu();
  } else {
    refreshIslandMenu();
  }
}

function handleIntelBuy() {
  const state = getState();
  if (state.royalCoins < GAME_CONSTANTS.INTEL.PRICE) {
    setStory(`Xu Hoàng Gia của bạn không đủ. Cần${GAME_CONSTANTS.INTEL.PRICE} xu, hiện chỉ có${state.royalCoins} xu.`);
    setPhase("island_intel");
    setOptions([{ text: "Tiếp tục", action: "intel_continue" }]);
    return;
  }

  removeRoyalCoins(GAME_CONSTANTS.INTEL.PRICE);
  const currentTurn = state.day * 8 + state.phaseIndex;
  const newEnd = currentTurn + GAME_CONSTANTS.INTEL.DURATION;

  if (state.intelImmunityEnd && state.intelImmunityEnd > currentTurn) {
    state.intelImmunityEnd = newEnd;
  } else {
    state.intelImmunityEnd = newEnd;
  }

  const remainingTurns = state.intelImmunityEnd - currentTurn;
  const remainingDays = Math.ceil(remainingTurns / 8);

  setStory(`Buôn tình báo đưa cho bạn một bản đồ đánh dấu đường đi an toàn: \"Đi theo, ${GAME_CONSTANTS.INTEL.DURATION} vòng trong sẽ không ai tìm bạn phiền toái.\"\n\nChi phí ${GAME_CONSTANTS.INTEL.PRICE} Xu Hoàng Gia\nHiệu quả tình báo: Còn lại${remainingTurns} vòng(khoảng${remainingDays} ngày)khám phá không gặp thù\nXu Hoàng Gia hiện tại: ${getState().royalCoins}`);

  setPhase("island_intel");
  setOptions([{ text: "Tiếp tục", action: "intel_continue" }]);
}
