import {
  getState, setPhase, setStory, setOptions,
  addItem, addRoyalCoins, removeRoyalCoins,
  addGasoline, removeGasoline,
  advanceTime, updateStatusEffects, checkDeath,
  setLocation, isQuestDone,
} from '../state.js';

import {
  GAME_CONSTANTS, MAPS,
  pickRandomLoot, SPECIAL_ITEMS, NAMED_NPCS,
} from '../config.js';

import {
  hasCastleIdentity,
  cleanDualIdentity,
  getCastleRank,
  getCastleRankName,
} from '../faction.js';

import { showExploreOptionsState } from '../routing.js';

import {
  handleFishingArea,
} from './fishing.js';

import {
  handleNpcYumo, handleYumoAction,
} from './yumo.js';

import {
  handleNpcGuyue, handleGuyueAction,
} from './guyue.js';

import {
  handleNpcLinhan, handleLinhanAction,
} from './linhan.js';

import { handleBar, handleBarAction } from './bar.js';
import { handleStreet, handleStreetAction } from './street.js';
import { handleInvest, handleInvestAction } from './invest.js';
import { handleBlackMarket, handleBlackMarketAction } from './black-market.js';
import { handleIntel, handleIntelAction } from './intel.js';
import { checkRobberEncounter, handleRobberEncounter } from '../map-events/robber.js';

function calculateIslandInterest(debt, overdueDays) {
  const IC = GAME_CONSTANTS.ISLAND;
  const steps = Math.floor(overdueDays / IC.INTEREST_OVERDUE_STEP);
  const rate = Math.min(IC.INTEREST_RATE_BASE + steps * IC.INTEREST_RATE_PER_STEP, IC.INTEREST_RATE_CAP);
  return Math.round(debt * rate);
}

export function handleEnterIsland() {
  const state = getState();
  const islandMap = MAPS.find(m => m.id === "小型岛屿");
  state.currentMap = islandMap;
  setLocation("小型岛屿");

  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    if (daysLeft < 0) {
      setStory(`Bạn đặt chân lên đảo nhỏ. Quản gia của Công tước Dư Mặc vội vàng chạy tới: \"Thưa ngài, nợ ngân hàng đảo của ngài đã quá hạn ${-daysLeft} ngày, xin mau chóng đến ngân hàng trả nợ!\"`);
      refreshIslandMenu();
      return;
    }
  }

  setStory("Bạn lái du thuyền đến đảo nhỏ. Hòn đảo phong cảnh hữu tình, là đất phong vua ban cho Công tước Dư Mặc. Cư dân trên đảo an cư lạc nghiệp, cờ thành phấp phới giữa đảo.");
  refreshIslandMenu();
}

export function refreshIslandMenu() {
  const state = getState();
  setPhase("island");
  const options = [
    { text: "Khám phá", action: "island_explore" },
    { text: "Ăn uống", action: "eat" },
    { text: "Uống nước", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Rời đi", action: "island_leave" },
    { text: "Vứt bỏ", action: "discard" },
    { text: "Cư dân Cố Nguyệt", action: "island_guyue" },
    { text: "Cư dân Lâm Hàn", action: "island_linhan" },
    { text: "Công tước Dư Mặc", action: "island_yumo" },
  ];
  if (isQuestDone("yumoQuest2") && !isQuestDone("yumoQuest3")) {
    options.push({ text: "Dọn dẹp xác sống đổ bộ", action: "island_clean_diving" });
  }
  options.push({ text: "Khu vực câu cá", action: "island_fishing" });
  options.push({ text: "Nghỉ trên đảo", action: "island_rest" });
  options.push({ text: "Quán bar Vua Karen", action: "island_bar" });
  options.push({ text: "Phố Hoàng hậu Elena", action: "island_street" });
  options.push({ text: "Hành đầu tư Lucius", action: "island_invest" });
  options.push({ text: "Chợ đen hoàng gia", action: "island_black_market" });
  options.push({ text: "Trung tâm tình báo", action: "island_intel" });
  options.push({ text: "Ngân hàng đảo", action: "island_bank" });
  options.push({ text: "Phúc lợi trợ cấp", action: "island_welfare" });
  options.push({ text: "Tàu chở dầu vương quốc", action: "island_oil_tanker" });
  setOptions(options);
}

export function handleIslandAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;

  const action = state.options[optIdx].action;

  switch (action) {
    case "island_explore":
      handleIslandExplore();
      break;
    case "eat":
    case "drink":
    case "medicine":
    case "equip":
    case "discard":
      return action;
    case "island_leave":
      handleIslandLeave();
      break;
    case "island_guyue":
      handleNpcGuyue();
      break;
    case "island_linhan":
      handleNpcLinhan();
      break;
    case "island_yumo":
      handleNpcYumo();
      break;
    case "island_clean_diving":
      handleCleanDivingZombie();
      break;
    case "island_fishing":
      handleFishingArea();
      break;
    case "island_rest":
      handleIslandRest();
      break;
    case "island_bar":
      handleBar();
      break;
    case "island_street":
      handleStreet();
      break;
    case "island_invest":
      handleInvest();
      break;
    case "island_bank":
      handleIslandBank();
      break;
    case "island_black_market":
      handleBlackMarket();
      break;
    case "island_intel":
      handleIntel();
      break;
    case "island_welfare":
      handleIslandWelfare();
      break;
    case "island_oil_tanker":
      handleIslandOilTanker();
      break;
    case "oil_tanker_buy":
      handleOilTankerBuy();
      break;
    case "oil_tanker_sell":
      handleOilTankerSell();
      break;
    case "oil_tanker_back":
      refreshIslandMenu();
      break;
  }
}

export function handleIslandExplore() {
  const state = getState();
  const map = state.currentMap;
  if (!map) {
    refreshIslandMenu();
    return;
  }

  const currentTurn = state.day * 8 + state.phaseIndex;
  const intelActive = state.intelImmunityEnd && state.intelImmunityEnd > currentTurn;

  if (!intelActive) {
    if (checkRobberEncounter(state)) {
      handleRobberEncounter();
      if (!state.gameOver) refreshIslandMenu();
      return;
    }
  }

  const loot = pickRandomLoot(map);
  if (!loot) {
    setStory("Bạn tìm kiếm khắp đảo, không tìm thấy gì.");
  } else {
    const added = addItem(loot);
    if (!added) {
      setStory(`Bạn phát hiện ${loot.name}, nhưng balo đã đầy, không thể mang theo.`);
    } else {
      setStory(`Bạn phát hiện ${loot.name} trên đảo!`);
    }
  }

  advanceTime(1);
  const wasFoggy = state.weather === "大雾";
  if (wasFoggy) advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleIslandLeave() {
  const state = getState();
  const portMap = MAPS.find(m => m.id === "江边港口码头");
  state.currentMap = portMap;
  setLocation("江边港口码头");
  setStory("Bạn lái du thuyền quay về bến cảng sông.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export function handleIslandRest() {
  const state = getState();
  const healAmount = Math.min(GAME_CONSTANTS.ISLAND.REST_HEALTH, GAME_CONSTANTS.MAX_HEALTH - state.health);
  const crashReduction = Math.min(GAME_CONSTANTS.ISLAND.REST_FATIGUE, state.crash);
  state.health = Math.min(state.health + GAME_CONSTANTS.ISLAND.REST_HEALTH, GAME_CONSTANTS.MAX_HEALTH);
  state.crash = Math.max(state.crash - GAME_CONSTANTS.ISLAND.REST_FATIGUE, 0);
  state.sanity = Math.min(GAME_CONSTANTS.SANITY_MAX, state.sanity + GAME_CONSTANTS.ISLAND.REST_SANITY_RECOVERY);

  setStory(`Bạn nghỉ ngơi trong căn nhà nhỏ trên đảo, gió biển khẽ thổi, bạn cảm thấy thân tâm được thư giãn đầy đủ.\nHồi ${healAmount} điểm sinh lực, giảm ${crashReduction} điểm mệt mỏi, lý trí hồi ${GAME_CONSTANTS.ISLAND.REST_SANITY_RECOVERY} điểm.`);

  advanceTime(GAME_CONSTANTS.ISLAND.REST_TIME);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleCleanDivingZombie() {
  const state = getState();
  const dz = NAMED_NPCS.diving_zombie;
  state._pendingNpc = {
    name: dz.name,
    hp: dz.hp,
    damage: Math.floor(Math.random() * (dz.damageMax - dz.damageMin + 1)) + dz.damageMin,
    hasRanged: dz.hasRanged,
    dodgeRate: dz.dodgeRate,
  };
  state._divingZombieCombat = true;
  setPhase("pre_combat_npc");
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Nên nghỉ ngơi trước khi khám phá." : "";
  setStory(`Một xác sống lặn từ biển trèo lên bờ, toàn thân nhỏ giọt nước biển tanh hôi, lao về phía bạn!${crashWarning}`);
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
    { text: "Bắn từ xa", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleIslandBank() {
  setPhase("island_bank");
  const state = getState();

  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    if (daysLeft < 0) {
      const overdueDays = -daysLeft;
      const interest = calculateIslandInterest(state.islandDebt.amount, overdueDays);
      const IC = GAME_CONSTANTS.ISLAND;
      const steps = Math.floor(overdueDays / IC.INTEREST_OVERDUE_STEP);
      const rate = Math.min(IC.INTEREST_RATE_BASE + steps * IC.INTEREST_RATE_PER_STEP, IC.INTEREST_RATE_CAP);
      state.islandDebt.amount += interest;
      state.islandDebt.dueDay = state.day + GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS;
      setStory(`🏦 Xử lý nợ quá hạn\n\nNợ ngân hàng đảo của ngài đã quá hạn ${overdueDays} ngày, cộng ${Math.round(rate * 100)}% lãi (${interest} royalcoin?), hiệnnợ ${state.islandDebt.amount} royalcoin, thời hạn trả nợ đã dời đến ngày ${state.islandDebt.dueDay}.`);
      setOptions([{ text: "Tiếp tục", action: "island_bank_continue" }]);
      return;
    }
  }

  let info = "🏦 【Ngân hàng đảo】\nNgân hàng hoàng gia do hoàng hậu mở\n\n";
  if (state.islandDebt) {
    const daysLeft = state.islandDebt.dueDay - state.day;
    info += `Nợ hiện tại: ${state.islandDebt.amount} royalcoin (còn ${daysLeft} ngày để trả)\n\n`;
  } else {
    info += "Bạn hiện không có nợ.\n\n";
  }
  info += "Vay mượn: Vay royalcoin (10 mức 10/20/30/40/50/60/70/80/90/100)\nTrả nợ: Hoàn trả nợ";
  setStory(info);
  setOptions([
    { text: "Vay mượn", action: "island_loan" },
    { text: state.islandDebt ? "Trả nợ" : "Trả nợ (Không có nợ)", action: "island_repay", disabled: !state.islandDebt },
    { text: "Rời đi", action: "island_bank_leave" },
  ]);
}

export function handleIslandBankAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  if (action === "island_loan") {
    handleIslandLoan();
    return;
  }
  if (action === "island_repay") {
    handleIslandRepay();
    return;
  }
  if (action === "island_loan_submit") {
    handleIslandLoanSubmit(input);
    return;
  }
  if (action === "island_bank_continue") {
    handleIslandBank();
    return;
  }
  if (action === "island_bank_leave" || action === "island_loan_back") {
    handleIslandBankLeave();
    return;
  }
}

export function handleIslandBankLeave() {
  refreshIslandMenu();
}

function hasAnyCastleRelatedIdentity(state) {
  if (hasCastleIdentity(state)) return true;
  if (state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) return true;
  return false;
}

export function handleIslandLoan() {
  const state = getState();
  if (state.islandDebt) {
    setStory("Bạn còn nợ chưa trả, hãy trả xong rồi vay tiếp.");
    handleIslandBank();
    return;
  }
  if (!hasAnyCastleRelatedIdentity(state)) {
    setStory("Nhân viên ngân hàng lễ phép nói: \"Chỉ thành viên liên quan đến thành mới được dùng ngân hàng đảo. Xin xuất trình thẻ thông hành thành hoặc thẻ thân phận thành.\"");
    handleIslandBank();
    return;
  }
  cleanDualIdentity(state);
  setPhase("island_bank");
  const opts = [];
  for (const amount of GAME_CONSTANTS.ISLAND.LOAN_AMOUNTS) {
    opts.push({ text: `${amount} royalcoin`, action: "island_loan_submit", amount });
  }
  opts.push({ text: "Quay lại", action: "island_loan_back" });
  setStory(`🏦 Hãy chọn số tiền vay (Ngân hàng do hoàng hậu mở, lãi chỉ ${GAME_CONSTANTS.ISLAND.INTEREST_RATE_BASE * 100}%, thời hạn ${GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS} ngày):`);
  setOptions(opts);
}

export function handleIslandLoanSubmit(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "island_loan_submit") return;
  const amount = option.amount;
  state.islandDebt = { amount, dueDay: state.day + GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS };
  addRoyalCoins(amount);
  setStory(`✅ Bạn vay ${amount} royalcoin từ ngân hàng đảo. Nhân viên mỉm cười: \"Hoàng hậu điện hạ đã dặn, lãi chỉ 10%, xinhãy trả trong ${GAME_CONSTANTS.ISLAND.LOAN_TERM_DAYS} ngày.\"\n\nRoyalcoin hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_bank");
    setOptions([{ text: "Tiếp tục", action: "island_bank_continue" }]);
  }
}

export function handleIslandBarAction(input) {
  handleBarAction(input);
}

export function handleIslandStreetAction(input) {
  handleStreetAction(input);
}

export function handleIslandBlackMarketAction(input) {
  handleBlackMarketAction(input);
}

export function handleIslandIntelAction(input) {
  handleIntelAction(input);
}

export function handleIslandInvestAction(input) {
  handleInvestAction(input);
}

export function handleIslandRepay() {
  const state = getState();
  if (!state.islandDebt) {
    setStory("Bạn không có nợ cần trả.");
    handleIslandBank();
    return;
  }
  const needed = state.islandDebt.amount;
  if (state.royalCoins < needed) {
    setStory(`❌ Bạn cần ${needed} royalcoin để trả nợ, nhưng bạn chỉ có ${state.royalCoins} royalcoin. Hãy đến chỗ hoàng hậu thành đổi royalcoin rồi quay lại.`);
    handleIslandBank();
    return;
  }
  removeRoyalCoins(needed);
  state.islandDebt = null;
  state.islandDebtTriggered = false;
  setStory(`✅ Bạn đã trả toàn bộ nợ (${needed} royalcoin). Nhân viên gật đầu: \"Cảm ơn sự chân thành của ngài, hoàng hậu điện hạ sẽ rất vui.\"\n\nRoyalcoin hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_bank");
    setOptions([{ text: "Tiếp tục", action: "island_bank_continue" }]);
  }
}

export function handleIslandWelfare() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank === 0) {
    setStory("❌ Nhân viên cửa sổ phúc lợi liếc bạn một cái: \"Chỉ quý tộc thành mới được nhận phúc lợi trợ cấp, bạn chưa có thân phận quý tộc.\"");
    refreshIslandMenu();
    return;
  }
  const IC = GAME_CONSTANTS.ISLAND;
  const daysSinceLast = state.day - state.lastIslandWelfareDay;
  if (state.lastIslandWelfareDay > 0 && daysSinceLast < IC.WELFARE_COOLDOWN_DAYS) {
    const daysLeft = IC.WELFARE_COOLDOWN_DAYS - daysSinceLast;
    setStory(`⏳ Bạn chưa đến thời gian nhận phúc lợi lần sau.\n\nCòn ${daysLeft} ngày nữa mới có thể nhận.`);
    refreshIslandMenu();
    return;
  }
  const reward = IC.WELFARE_REWARDS[rank] || rank;
  state.lastIslandWelfareDay = state.day;
  addRoyalCoins(reward);
  const rankName = getCastleRankName(state);
  setStory(`✅ 【Phúc lợi trợ cấp】\n\nNhân viên kiểm tra thẻ thân phận của bạn: \"${rankName} các hạ, đây là trợ cấp quý tộc của ngài.\"\nBạn nhận được ${reward} royalcoin.\n\nRoyalcoin hiện tại: ${state.royalCoins}\nLần nhận tiếp theo: Ngày ${state.day + IC.WELFARE_COOLDOWN_DAYS}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshIslandMenu();
}

export function handleIslandOilTanker() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  setPhase("island");
  setStory(`⛽ 【Tàu chở dầu vương quốc】\n\nMột tàu dầu hoàng gia khổng lồ neo tại bến đảo, trên thân in huy hiệu hoàng gia.\nThuyền trưởng nhiệt tình đón: \"Chào mừng! Đây là trạm giao dịch xăng dầu chính thức của vương quốc.\"\n\n💰 Mua xăng: ${IC.OIL_TANKER_BUY_PRICE} royalcoin → 1 xăng\n♻️ Thu hồi xăng: 1 xăng → ${IC.OIL_TANKER_SELL_PRICE} royalcoin\n\nHiện có: ${state.royalCoins} royalcoin | ${state.gasoline} xăng`);
  setOptions([
    { text: `Mua xăng (${IC.OIL_TANKER_BUY_PRICE}coin→1 xăng)`, action: "oil_tanker_buy" },
    { text: `Thu hồi xăng (1 xăng→${IC.OIL_TANKER_SELL_PRICE}coin)`, action: "oil_tanker_sell" },
    { text: "Rời đi", action: "oil_tanker_back" },
  ]);
}

export function handleOilTankerBuy() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  if (state.royalCoins < IC.OIL_TANKER_BUY_PRICE) {
    setStory(`❌ Royalcoin của bạn không đủ. Cần ${IC.OIL_TANKER_BUY_PRICE} royalcoin, hiện chỉ có ${state.royalCoins} royalcoin.`);
    handleIslandOilTanker();
    return;
  }
  removeRoyalCoins(IC.OIL_TANKER_BUY_PRICE);
  addGasoline(1);
  setStory(`✅ Bạn dùng ${IC.OIL_TANKER_BUY_PRICE} royalcoin mua 1 xăng.\n\nRoyalcoin hiện tại: ${state.royalCoins} | Xăng hiện tại: ${state.gasoline}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleIslandOilTanker();
}

export function handleOilTankerSell() {
  const state = getState();
  const IC = GAME_CONSTANTS.ISLAND;
  if (state.gasoline < 1) {
    setStory("❌ Bạn không có xăng để thu hồi.");
    handleIslandOilTanker();
    return;
  }
  removeGasoline(1);
  addRoyalCoins(IC.OIL_TANKER_SELL_PRICE);
  setStory(`✅ Bạn thu hồi 1 xăng, nhận được ${IC.OIL_TANKER_SELL_PRICE} royalcoin.\n\nRoyalcoin hiện tại: ${state.royalCoins} | Xăng hiện tại: ${state.gasoline}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleIslandOilTanker();
}