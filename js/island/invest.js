import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, addRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { GAME_CONSTANTS, SPECIAL_ITEMS } from '../config.js';

import { hasCastleIdentity, getCastleRank, getCastleRankName } from '../faction.js';

import { INVEST_AMOUNTS, INVEST_DURATION_DAYS, INVEST_DIRECTIONS } from '../data/island/investment.js';

import { refreshIslandMenu } from './index.js';

function getInvestorTitle(state) {
  if (!hasCastleIdentity(state) && state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) {
    return "Ngài";
  }
  const rankName = getCastleRankName(state);
  const titleMap = {
    "贵族": "Quý tộc",
    "子爵": "Tử tước",
    "伯爵": "Bá tước",
    "侯爵": "Hầu tước",
    "公爵": "Công tước",
    "储君": "Trữ quân",
  };
  return titleMap[rankName] || "Ngài";
}

export function handleInvest() {
  const state = getState();
  if (!hasCastleIdentity(state) && !state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) {
    setStory("Một người đại diện ăn mặc sang trọng chặn bạn: \"Xin lỗi, chỉ người giữ vé thông hành lâu đài hoặc thẻ thân phận lâu đài mới được vào Hàng đầu tư Lucius.\"");
    refreshIslandMenu();
    return;
  }
  if (state.islandDebt && state.islandDebt.dueDay - state.day < 0) {
    setStory("Tín dụng của bạn hiện không đủ, nhân viên không muốn tiếp bạn, hãy trả hết nợ liên quan đến đảo rồi quay lại.");
    refreshIslandMenu();
    return;
  }
  const title = getInvestorTitle(state);
  setPhase("island_invest");
  setStory(`Kính thưa ${title} đại nhân, chào mừng đến Hàng đại lý đầu tư Lucius, chúng tôi cung cấp dịch vụ đầu tư tốt nhất cho bạn!`);
  setOptions([
    { text: "Thực hiện đầu tư", action: "invest_start" },
    { text: "Lợi nhuận đầu tư", action: "invest_check" },
    { text: "Rời đi", action: "invest_leave" },
  ]);
}

export function handleInvestAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "invest_start":
      handleInvestStart();
      break;
    case "invest_check":
      handleInvestCheck();
      break;
    case "invest_leave":
      refreshIslandMenu();
      break;
    case "invest_amount":
      handleInvestDirection(input);
      break;
    case "invest_direction":
      handleInvestConfirm(input);
      break;
    case "invest_back":
      handleInvest();
      break;
    case "invest_collect":
      handleInvestCollect(input);
      break;
    default:
      handleInvest();
      break;
  }
}

function handleInvestStart() {
  const state = getState();
  if (state.investment !== null) {
    setStory("Bạn đã có một khoản đầu tư rồi.");
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
    return;
  }
  setPhase("island_invest");
  setStory("Chọn số tiền đầu tư:");
  const opts = INVEST_AMOUNTS.map(amount => ({
    text: `${amount} Royal Coin`,
    action: "invest_amount",
    amount,
  }));
  opts.push({ text: "Quay lại", action: "invest_back" });
  setOptions(opts);
}

function handleInvestDirection(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "invest_amount") return;
  const amount = option.amount;

  setPhase("island_invest");
  setStory(`Số tiền đầu tư: ${amount} Royal Coin\nChọn hướng đầu tư:`);
  const opts = INVEST_DIRECTIONS.map(dir => ({
    text: `${dir.name}`,
    action: "invest_direction",
    directionId: dir.id,
    amount,
  }));
  opts.push({ text: "Quay lại", action: "invest_back" });
  setOptions(opts);
}

function handleInvestConfirm(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "invest_direction") return;

  const directionId = option.directionId;
  const amount = option.amount;

  const tax = Math.round(amount * GAME_CONSTANTS.ISLAND.INVEST_TAX_RATE);
  const totalCost = amount + tax;
  if (state.royalCoins < totalCost) {
    setStory(`Royal Coin của bạn không đủ. Đầu tư cần ${amount} + ${tax} thuế stamp (tổng ${totalCost}), nhưng chỉ có ${state.royalCoins}.`);
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
    return;
  }

  removeRoyalCoins(totalCost);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    const direction = INVEST_DIRECTIONS.find(d => d.id === directionId);
    const directionName = direction ? direction.name : directionId;
    state.investment = {
      amount,
      directionId,
      startDay: state.day,
      dueDay: state.day + INVEST_DURATION_DAYS,
      tax,
    };

    const title = getInvestorTitle(state);
    setStory(`Bạn đã đầu tư ${amount} Royal Coin vào ${directionName}, nộp thuế ${tax} Royal Coin. Lucius mỉm cười: "Lựa chọn sáng suốt, ${title} đại nhân. ${INVEST_DURATION_DAYS} ngày nữa hãy quay lại xem kết quả."`);
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
  }
}

function handleInvestCheck() {
  const state = getState();
  if (!state.investment) {
    setStory("Hiện chưa có đầu tư nào, không có lợi nhuận để nhận.");
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
    return;
  }

  const direction = INVEST_DIRECTIONS.find(d => d.id === state.investment.directionId);
  const directionName = direction ? direction.name : state.investment.directionId;
  const amount = state.investment.amount;
  const daysLeft = state.investment.dueDay - state.day;

  if (daysLeft > 0) {
    setStory(`Đầu tư của bạn vẫn đang tiến hành.\n\nHướng đầu tư: ${directionName}\nSố tiền đầu tư: ${amount} Royal Coin\nThời gian còn lại: ${daysLeft} ngày`);
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
    return;
  }

  if (!direction) {
    setStory("Dữ liệu hướng đầu tư bất thường, đầu tư đã hủy.");
    state.investment = null;
    setPhase("island_invest");
    setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
    return;
  }

  const outcomes = direction.outcomes;
  let roll = Math.random();
  let cumulative = 0;
  let selectedOutcome = outcomes[outcomes.length - 1];
  for (const outcome of outcomes) {
    cumulative += outcome.probability;
    if (roll < cumulative) {
      selectedOutcome = outcome;
      break;
    }
  }

  const result = Math.round(amount * (1 + selectedOutcome.returnRate));
  const profit = result - amount;
  let profitText;
  if (profit > 0) {
    profitText = `📈 Lãi +${profit} Royal Coin`;
  } else if (profit < 0) {
    profitText = `📉 Lỗ ${profit} Royal Coin`;
  } else {
    profitText = "Hòa vốn";
  }

  if (result > 0) {
    addRoyalCoins(result);
  }
  const taxInfo = state.investment && state.investment.tax ? `\nĐã nộp thuế stamp: ${state.investment.tax} Royal Coin` : "";
  state.investment = null;

  setStory(`${selectedOutcome.desc}\n\nĐầu tư: ${amount} Royal Coin\nThu hồi: ${result} Royal Coin\n${profitText}${taxInfo}\nRoyal Coin hiện tại: ${getState().royalCoins}`);
  setPhase("island_invest");
  setOptions([{ text: "Tiếp tục", action: "invest_back" }]);
}

function handleInvestCollect(input) {
  handleInvestCheck();
}