import { getState, setPhase, setStory, setOptions, addCigarettes, removeCigarettes, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { CASTLE_BANKER_DIALOGUES, CASTLE_BANKER_HIGH_DIALOGUES, MELEE_WEAPONS, RANGED_WEAPONS, GAME_CONSTANTS, NAMED_NPCS, FIXED_LOOT_DROPS, getDialogueByRank } from '../config.js';
import { getCastleRank, getCastleRankName, hasAnyDawnIdentity, cleanDualIdentity } from '../faction.js';
import { handleCastleOutpost } from './outpost.js';

export function handleCastleBank() {
  setPhase("castle_bank");
  const state = getState();
  let info = "🏦 [Ngân hàng lâu đài]\n\n";
  if (state.bankerKilled) {
    info += "Nhân viên ngân hàng lâu đài không muốn tiếp đón bạn, vì bạn đã ám sát trưởng ngân hàng.\n\n";
    if (state.castleDebt) {
      info += `Nợ hiện tại: ${state.castleDebt.amount} điếu thuốc lá\n\n`;
    }
    setStory(info);
    setOptions([
      { text: state.castleDebt ? "Trả nợ" : "Trả nợ(Không có nợ)", action: "bank_repay", disabled: !state.castleDebt },
      { text: "Rời đi", action: "bank_leave" },
    ]);
    return;
  }
  if (state.castleDebt) {
    const daysLeft = state.castleDebt.dueDay - state.day;
    if (daysLeft > 0) {
      info += `Nợ hiện tại: ${state.castleDebt.amount} điếu thuốc lá(Còn ${daysLeft} ngày để trả)\n\n`;
    } else {
      info += `Nợ hiện tại: ${state.castleDebt.amount} điếu thuốc lá(Đã quá hạn ${-daysLeft} ngày!)\n\n`;
    }
  } else {
    info += "Hiện tại bạn không có nợ.\n\n";
  }
  info += `Vay mượn: Vay thuốc lá từ ngân hàng(Tối đa 25 điếu)\nTrả nợ: Trả một phần hoặc toàn bộ nợ`;
  setStory(info);
  setOptions([
    { text: "Vay mượn", action: "bank_loan" },
    { text: state.castleDebt ? "Trả nợ" : "Trả nợ(Không có nợ)", action: "bank_repay", disabled: !state.castleDebt },
    { text: "Gặp trưởng ngân hàng", action: "bank_banker" },
    { text: "Rời đi", action: "bank_leave" },
  ]);
}

export function handleBankLoan() {
  const state = getState();
  if (state.castleDebt) {
    setStory("Bạn đã có một khoản nợ chưa trả, hãy trả xong rồi hãy vay tiếp.");
    refreshCastleBank();
    return;
  }
  cleanDualIdentity(state);
  if (hasAnyDawnIdentity(state)) {
    setStory("Giao dịch viên ngân hàng lạnh lùng nhìn bạn: \"Người của Dawn Base? Ngân hàng chúng tôi không tiếp đãi các người phản loạn. Mời rời đi ngay, nếu không tôi sẽ gọi vệ binh.\"");
    refreshCastleBank();
    return;
  }
  setPhase("castle_loan_input");
  const opts = [];
  const loanAmounts = [5, 10, 15, 20, 25];
  for (const amount of loanAmounts) {
    opts.push({ text: `${amount} điếu thuốc lá`, action: "loan_amount", amount });
  }
  opts.push({ text: "Quay lại", action: "back" });
  setStory("🏦 Vui lòng nhập số lượng thuốc lá muốn vay:");
  setOptions(opts);
}

export function handleLoanSubmit(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action === "back") { handleCastleBank(); return; }
  const amount = option.amount;
  state.castleDebt = { amount: amount, dueDay: state.day + GAME_CONSTANTS.CASTLE.LOAN_TERM_DAYS, mercyCount: 0 };
  addCigarettes(amount);
  setStory(`✅ Bạn đã vay ${amount} điếu thuốc lá từ ngân hàng lâu đài. Trưởng ngân hàng cười híp mắt nói: \"Nhớ trả trong ${GAME_CONSTANTS.CASTLE.LOAN_TERM_DAYS} ngày nhé, nếu không thì……."\n\n(Điều không nói cho bạn biết là, quá hạn phải trả gấp đôi.)`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleBank();
}

export function handleBankRepay() {
  const state = getState();
  if (!state.castleDebt) {
    setStory("Bạn không có nợ nào cần trả.");
    refreshCastleBank();
    return;
  }
  const needed = state.castleDebt.amount;
  if (state.cigarettes < needed) {
    setStory(`❌ Bạn cần ${needed} điếu thuốc lá để trả nợ, nhưng bạn chỉ có ${state.cigarettes} điếu. Hãy kiếm đủ rồi hãy đến.`);
    refreshCastleBank();
    return;
  }
  removeCigarettes(needed);
  state.castleDebt = null;
  state.castleDebtTriggered = false;
  setStory(`✅ Bạn đã trả toàn bộ nợ(${needed} điếu thuốc lá).Trưởng ngân hàng hài lòng gật đầu: \"Tốt lắm tốt lắm, làm ăn chân chính, hoan nghênh lần sau ghé lại!"`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleBank();
}

export function handleBankBanker() {
  const state = getState();
  const rank = getCastleRank(state);
  const line = getDialogueByRank("banker", rank);
  setStory(`Trưởng ngân hàng ngồi sau bàn làm việc rộng lớn, vắt chéo chân: ${line}\n\nBạn quyết định……`);
  setPhase("castle_banker");
  setOptions([
    { text: "Xin", action: "banker_waiver" },
    { text: "Xin gia hạn 5 ngày", action: "banker_mercy" },
    { text: "Đánh chết tên cho vay nặng lãi này!", action: "banker_fight" },
    { text: "Rời đi", action: "banker_leave" },
  ]);
}

export function handleBankerWaiver() {
  const state = getState();
  if (!state.castleDebt) {
    setStory("Trưởng ngân hàng xua tay: \"Bạn lại không, miễn gì? Đừng phí thời gian của tôi.\"");
    refreshCastleBank();
    return;
  }
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  setPhase("castle_banker_waiver");
  setStory(`Trưởng ngân hàng nhìn bạn: \"Ồ? Muốn xin? Để tôi xem tư cách của bạn……"\n\nNợ hiện tại: ${state.castleDebt.amount} điếu thuốc lá\nThân phận của bạn: ${rankName}`);
  setOptions([
    { text: rank >= 2 ? "Miễn ba và trả nợ" : "Miễn ba(Tử tước trở lên mới được hưởng)", action: "waiver_30", disabled: rank < 2 },
    { text: rank >= 4 ? "Miễn một nửa và trả nợ" : "Miễn một nửa(Hầu tước trở lên mới được hưởng)", action: "waiver_50", disabled: rank < 4 },
    { text: rank >= 6 ? "Miễn toàn bộ và trả nợ" : "Miễn toàn bộ(Trữ quân mới được hưởng)", action: "waiver_100", disabled: rank < 6 },
    { text: "Quay lại", action: "waiver_back" },
  ]);
}

function executeWaiver(rate, rankRequired, successMsg, failMsg) {
  const state = getState();
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  if (rank < rankRequired) {
    setStory(failMsg);
    setPhase("castle_banker_waiver");
    setOptions([
      { text: rank >= 2 ? "Miễn ba và trả nợ" : "Miễn ba(Tử tước trở lên mới được hưởng)", action: "waiver_30", disabled: rank < 2 },
      { text: rank >= 4 ? "Miễn một nửa và trả nợ" : "Miễn một nửa(Hầu tước trở lên mới được hưởng)", action: "waiver_50", disabled: rank < 4 },
      { text: rank >= 6 ? "Miễn toàn bộ và trả nợ" : "Miễn toàn bộ(Trữ quân mới được hưởng)", action: "waiver_100", disabled: rank < 6 },
      { text: "Quay lại", action: "waiver_back" },
    ]);
    return;
  }
  const debt = state.castleDebt.amount;
  const waiverAmount = debt * rate;
  if (waiverAmount < 1) {
    setStory("Trưởng ngân hàng lật xem sổ sách, lắc đầu: \"Bạn vay quá ít, không thể miễn cho bạn.\"");
    setPhase("castle_banker_waiver");
    setOptions([
      { text: rank >= 2 ? "Miễn ba và trả nợ" : "Miễn ba(Tử tước trở lên mới được hưởng)", action: "waiver_30", disabled: rank < 2 },
      { text: rank >= 4 ? "Miễn một nửa và trả nợ" : "Miễn một nửa(Hầu tước trở lên mới được hưởng)", action: "waiver_50", disabled: rank < 4 },
      { text: rank >= 6 ? "Miễn toàn bộ và trả nợ" : "Miễn toàn bộ(Trữ quân mới được hưởng)", action: "waiver_100", disabled: rank < 6 },
      { text: "Quay lại", action: "waiver_back" },
    ]);
    return;
  }
  const roundedWaiver = Math.round(waiverAmount);
  const newDebt = debt - roundedWaiver;
  if (newDebt <= 0) {
    state.castleDebt = null;
    state.castleDebtTriggered = false;
    setStory(`${successMsg}\n\nĐã miễn ${roundedWaiver} điếu thuốc lá, nợ đã được thanh toán toàn bộ!`);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) refreshCastleBank();
    return;
  }
  if (state.cigarettes < newDebt) {
    setStory(`${successMsg}\n\nSau khi miễn ${roundedWaiver} điếu, bạn còn cần trả ${newDebt} điếu thuốc lá, nhưng bạn chỉ có ${state.cigarettes} điếu. Hãy kiếm đủ rồi hãy đến.`);
    state.castleDebt.amount = newDebt;
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) refreshCastleBank();
    return;
  }
  removeCigarettes(newDebt);
  state.castleDebt = null;
  state.castleDebtTriggered = false;
  setStory(`${successMsg}\n\nMiễn ${roundedWaiver} điếu, trả ${newDebt} điếu, nợ đã được thanh toán toàn bộ!`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleBank();
}

export function handleWaiver30() {
  const state = getState();
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  if (rank >= 2) {
    executeWaiver(0.3, 2,
      "Trưởng ngân hàng cân nhắc thân phận của bạn, nghĩ đến nhà vua dường như cũng đang chiếu cố bạn, nên đồng ý miễn ba lãi suất\", , \"",
      "");
  } else if (rank === 1) {
    executeWaiver(0.3, 2, "",
      "Trưởng ngân hàng cười lạnh: \"Giảm, , .\"");
  } else {
    executeWaiver(0.3, 2, "",
      "Trưởng ngân hàng nổi trận lôi đình: \"Cút đi, đồ!Chúng tôi không có chỗ thương lượng!Vệ binh, vệ binh ở đâu? Đuổi hắn ra ngoài.\"");
  }
}

export function handleWaiver50() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank >= 4) {
    executeWaiver(0.5, 4,
      "Trưởng ngân hàng mời bạn ngồi trên sofa mềm mại, vừa pha trà vừa nói\"Vị đại nhân này tài chính?Vậy thì, lãi tôi cho ngài.\"",
      "");
  } else if (rank === 2 || rank === 3) {
    executeWaiver(0.5, 4, "",
      "Trưởng ngân hàng lộ vẻ khó xử: \", ,?\"");
  } else if (rank === 1) {
    executeWaiver(0.5, 4, "",
      "Trưởng ngân hàng: \", ?,.\"");
  } else {
    executeWaiver(0.5, 4, "",
      "Trưởng ngân hàng: \",!\"");
  }
}

export function handleWaiver100() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank >= 6) {
    executeWaiver(1.0, 6,
      "Trưởng ngân hàng chuẩn bị trà ngon và đồ ăn vặt đặc sản, cười tươi nói\"Trữ quân điện hạ ngài có thể đến chỗ chúng tôi, là vinh hạnh của chúng tôi, lãi cho ngài, ngài chỉ cần trả.Sau này nhớ.\"",
      "");
  } else if (rank === 5 || rank === 4) {
    executeWaiver(1.0, 6, "",
      "Trưởng ngân hàng khó xử nỗi: \"Vị đại nhân này,,?\"");
  } else if (rank === 3 || rank === 2) {
    executeWaiver(1.0, 6, "",
      "Trưởng ngân hàng nhíu mày: \", ,.\"");
  } else if (rank === 1) {
    executeWaiver(1.0, 6, "",
      "Trưởng ngân hàng trừng lớn mắt: \"Bạn?.\"");
  } else {
    executeWaiver(1.0, 6, "",
      "Trưởng ngân hàng: \"?,,.\"");
  }
}

export function handleBankerMercy() {
  const state = getState();
  if (!state.castleDebt) {
    setStory("Trưởng ngân hàng xua tay: \"Bạn lại không,? Đừng phí thời gian của tôi.\"");
    refreshCastleBank();
    return;
  }
  if (state.castleDebt.mercyCount >= 2) {
    setStory("Trưởng ngân hàng không kiên nhẫn vẫy tay: \"Tôi đã,!Hãy mau nghĩ cách trả tiền!\"");
    refreshCastleBank();
    return;
  }
  state.castleDebt.mercyCount = (state.castleDebt.mercyCount || 0) + 1;
  state.castleDebt.dueDay += GAME_CONSTANTS.CASTLE.MERCY_EXTENSION_DAYS;
  setStory(`Trưởng ngân hàng nhíu mày: \"Hành đi hành đi, xem, ${GAME_CONSTANTS.CASTLE.MERCY_EXTENSION_DAYS} ngày., ${state.castleDebt.dueDay} !"\n\nThời hạn trả nợ kéo dài ${GAME_CONSTANTS.CASTLE.MERCY_EXTENSION_DAYS} ngày.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleBank();
}

export function refreshCastleBank() {
  setPhase("castle_bank");
  const state = getState();
  if (state.bankerKilled) {
    setOptions([
      { text: state.castleDebt ? "Trả nợ" : "Trả nợ(Không có nợ)", action: "bank_repay", disabled: !state.castleDebt },
      { text: "Rời đi", action: "bank_leave" },
    ]);
    return;
  }
  setOptions([
    { text: "Vay mượn", action: "bank_loan" },
    { text: state.castleDebt ? "Trả nợ" : "Trả nợ(Không có nợ)", action: "bank_repay", disabled: !state.castleDebt },
    { text: "Gặp trưởng ngân hàng", action: "bank_banker" },
    { text: "Rời đi", action: "bank_leave" },
  ]);
}

export function handleBankerFight() {
  const state = getState();
  const banker = NAMED_NPCS.banker;
  state._pendingNpc = {
    name: banker.name,
    hp: banker.hp,
    damage: Math.floor(Math.random() * (banker.damageMax - banker.damageMin + 1)) + banker.damageMin,
    hasRanged: banker.hasRanged,
    dodgeRate: banker.dodgeRate,
  };
  const bankerWeapon = FIXED_LOOT_DROPS.banker_kill.type === "ranged"
    ? RANGED_WEAPONS.find(w => w.id === FIXED_LOOT_DROPS.banker_kill.weaponId)
    : MELEE_WEAPONS.find(w => w.id === FIXED_LOOT_DROPS.banker_kill.weaponId);
  setPhase("pre_combat_npc");
  setStory(`Bạn vỗ bàn, rút vũ khí ra!Trưởng ngân hàng cười lạnh, rút từ dưới bàn ra một thanh ${bankerWeapon.name} lóe: \"Tìm chết!"`);
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleCastleBankAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "bank_loan") { handleBankLoan(); return; }
  if (action === "bank_repay") { handleBankRepay(); return; }
  if (action === "bank_banker") { handleBankBanker(); return; }
  if (action === "bank_leave") { handleCastleOutpost(); return; }
}

export function handleCastleBankerAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "banker_waiver") { handleBankerWaiver(); return; }
  if (action === "waiver_30") { handleWaiver30(); return; }
  if (action === "waiver_50") { handleWaiver50(); return; }
  if (action === "waiver_100") { handleWaiver100(); return; }
  if (action === "waiver_back") { handleBankBanker(); return; }
  if (action === "banker_mercy") { handleBankerMercy(); return; }
  if (action === "banker_fight") { handleBankerFight(); return; }
  if (action === "banker_leave") { handleCastleOutpost(); return; }
}
