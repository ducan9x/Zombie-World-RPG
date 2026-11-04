import { getState, setPhase, setStory, setOptions, addItem, advanceTime, updateStatusEffects, checkDeath, getItemDisplayName, isQuestDone, markQuestDone, removeItemById, removeRoyalCoins } from '../state.js';
import { CASTLE_KING_DIALOGUES, CASTLE_KING_HIGH_DIALOGUES, CASTLE_QUEEN_DIALOGUES, CASTLE_QUEEN_HIGH_DIALOGUES, FOODS, FRUITS, DRINKS, MEDICINES, RANGED_WEAPONS, MELEE_WEAPONS, GAME_CONSTANTS, getDialogueByRank, KING_UNDERGROUND_STORY, SPECIAL_ITEMS } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity } from '../faction.js';
import { refreshCastleOutpost } from './outpost.js';
import { refreshCastleInterior } from './interior.js';
import { checkGoHomeEnding } from '../game/endings.js';

export function handleCastleKing() {
  const state = getState();
  const rank = getCastleRank(state);
  const line = getDialogueByRank("king", rank);
  setStory(`Vua lâu đài ngồi trên ngai vàng cao, nhìn xuống bạn: ${line}`);
  const opts = [];
  if (rank === 6 && state.doctorQuest1Accepted && !state.undergroundKeyObtained) {
    opts.push({ text: "Bệ hạ, tôi muốn đến khu vực ngầm", action: "king_underground" });
  }
  opts.push({ text: "Quay về sảnh", action: "castle_back" });
  setOptions(opts);
  setPhase("castle_interior");
}

export function handleCastleQueen() {
  const state = getState();
  const rank = getCastleRank(state);
  const line = getDialogueByRank("queen", rank);
  const hasLetter = state.other.some(i => i.id === "letter_to_sister");
  const hasToken = isQuestDone("leaderQuest3");
  const quest4Done = isQuestDone("queenQuest4");

  const opts = [];
  let story = `Hoàng hậu lâu đài lười biếng tựa trên ghế dài, liếc bạn một cái: ${line}`;

  if (hasLetter) {
    story += "\n\nBạn chú ý ánh mắt cô ấy khẽ dừng lại khi lướt qua bức thư trong tay bạn.";
    opts.push({ text: "Lời xin lỗi muộn màng", action: "queen_late_apology" });
  }

  if (hasToken) {
    story += "\n\nBạn lấy ra chiếc mặt dây chuyền hoa hướng dương, sắc mặt hoàng hậu lập tức đông cứng.";
    opts.push({ text: "Nói về quá khứ", action: "queen_past" });
  }

  if (quest4Done) {
    opts.push({ text: "Giao dịch hoàng gia", action: "queen_royal_trade" });
  }

  setStory(story);
  setPhase("castle_interior");
  opts.push({ text: "Quay về sảnh", action: "castle_back" });
  setOptions(opts);
}

export function handleQueenLateApology() {
  const state = getState();
  const hasLetter = state.other.some(i => i.id === "letter_to_sister");
  if (!hasLetter) {
    setStory("Bạn không có thư để giao cho hoàng hậu.");
    refreshCastleInterior();
    return;
  }
  const letterIdx = state.other.findIndex(i => i.id === "letter_to_sister");
  if (letterIdx !== -1) {
    state.other.splice(letterIdx, 1);
  }
  const reply = SPECIAL_ITEMS.queen_reply;
  addItem({ ...reply });
  setStory(`Bạn đưa bức thư ngả vàng cho hoàng hậu.

Cô ấy thờ ơ nhận lấy, định đặt xuống, nhưng nhìn thấy chữ viết trên bì thư. Tay cô ấy khựng lại.

"Đây là……chữ của anh trai."

Cô ấy chậm rãi mở thư, đọc từng chữ một. Trong lều im phăng phắc, chỉ nghe thấy tiếng giấy động.

Một lúc sau, cô ấy gấp thư lại, áp vào ngực. Mắt cô ấy đỏ hoe, nhưng không khóc.

"Ba năm rồi." Giọng cô ấy rất khẽ, "Ba năm rồi anh ấy mới chịu nhờ người gửi đến."

Cô ấy trầm mặc rất lâu, lâu đến mức bạn tưởng cô ấy sẽ không nói nữa.

"Tôi sẽ không quay về." Cuối cùng cô ấy mở miệng, giọng bình tĩnh nhưng kiên quyết, "Tôi đã quen với cuộc sống ở đây rồi. Lâu đài tuy giả dối, nhưng ít ra……tôi không phải đối mặt với những hồi ức đó."

Cô ấy lấy từ bàn trang điểm một tờ giấy thư, nhấc bút viết vài dòng:
"Giao cái này cho anh ấy. Nói với anh ấy, tôi không hận anh ấy. Nhưng có những vết thương, thời gian cũng không chữa lành được."

📖 Nhận được【Thưhồi âm của hoàng hậu】

（Gợi ý：Giao thưhồi âm cho thủ lĩnh căn cứ）`);
  refreshCastleInterior();
}

export function handleCastleBanquet() {
  const state = getState();
  const hasId = hasCastleIdentity(state);
  if (!hasId) {
    setStory("Bạn vừa đi đến cửa đại sảnh yến tiệc, thị tùng đã chặn lại: \"Vui lòng xuất trình thẻ thân phận quý tộc.\" Bạn không có thẻ thân phận, bị đuổi ra ngoài.\n\nBạn bị phát hiện không có thân phận quý tộc, bị đuổi ra ngoài！");
    state.currentSubMap = null;
    refreshCastleOutpost();
    return;
  }
  if (state.lastBanquetDay === state.day) {
    setStory("Hôm nay bạn đã tham dự yến tiệc rồi. Quý tộc vẫn đang nâng ly, nhưng bạn đã ăn không nổi nữa.");
    refreshCastleInterior();
    return;
  }
  state.lastBanquetDay = state.day;
  state.hunger = Math.min(100, state.hunger + GAME_CONSTANTS.CASTLE.BANQUET_HUNGER_RESTORE);
  state.hydration = Math.min(100, state.hydration + GAME_CONSTANTS.CASTLE.BANQUET_HYDRATION_RESTORE);
  setStory(`Bạn ngồi vào bàn yến tiệc dài, thưởng thức bữa đại tiệc phong phú——gà tây nướng, rượu vang đỏ, súp kem……trong ngày tận thế mà được ăn một bữa như vậy quả là xa xỉ！

Độ no và nước uống mỗi thứ hồi phục +${GAME_CONSTANTS.CASTLE.BANQUET_HUNGER_RESTORE}%.`);
  advanceTime(GAME_CONSTANTS.CASTLE.BANQUET_TIME_COST);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleQueenPast() {
  const state = getState();
  if (isQuestDone("queenQuest4")) {
    setStory("Hoàng hậu mỉm cười nhìn bạn: \"Chuyện quá khứ, để nó qua đi. Chúng ta đều phải nhìn về phía trước.\"");
    refreshCastleInterior();
    return;
  }

  const opts = [];
  let story = "Hoàng hậu nhìn chiếc mặt dây chuyền hoa hướng dương, ánh mắt phức tạp:\n\"Đây là anh ấy tặng tôi……khi chúng tôi còn là người thường.\"\n\nCô ấy trầm mặc một lát, thở dài:\n\"Có vài việc, tôi vẫn luôn muốn tìm người giúp. Bạn sẵn lòng nghe không?\"";

  if (!isQuestDone("queenQuest1")) {
    opts.push({ text: "Giải sầu", action: "queen_quest1" });
  } else if (!isQuestDone("queenQuest2")) {
    opts.push({ text: "Giải sầu（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Tình hình nhà vua", action: "queen_quest2" });
  } else if (!isQuestDone("queenQuest3")) {
    opts.push({ text: "Giải sầu（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Tình hình nhà vua（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Luyện kiếm", action: "queen_quest3" });
  } else if (!isQuestDone("queenQuest4")) {
    opts.push({ text: "Giải sầu（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Tình hình nhà vua（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Luyện kiếm（Đã hoàn thành）", action: "queen_past", disabled: true });
    opts.push({ text: "Kỷ niệm ngày cưới", action: "queen_quest4" });
  }

  opts.push({ text: "Quay về sảnh", action: "castle_back" });
  setStory(story);
  setPhase("castle_interior");
  setOptions(opts);
}

export function handleQueenQuest1() {
  const state = getState();
  const baiweiCount = state.drinks.filter(i => i.id === "Bai Wei beer").reduce((sum, i) => sum + (i.count || 1), 0);
  const dongliCount = state.drinks.filter(i => i.id === "Dong Li beer").reduce((sum, i) => sum + (i.count || 1), 0);
  const needBaiwei = 5;
  const needDongli = 5;

  if (baiweiCount < needBaiwei || dongliCount < needDongli) {
    let msg = "Hoàng hậu thở dài: \"Nhìn thấy chiếc mặt dây chuyền này, lại nhớ đến những chuyện không vui. Giúp tôi lấy chút rượu để giải sầu。\"\n\nVật phẩm cần:";
    if (baiweiCount < needBaiwei) msg += `\n  Bai Wei beer ${baiweiCount}/${needBaiwei}`;
    else msg += `\n  Bai Wei beer ${baiweiCount}/${needBaiwei} ✓`;
    if (dongliCount < needDongli) msg += `\n  Dong Li beer ${dongliCount}/${needDongli}`;
    else msg += `\n  Dong Li beer ${dongliCount}/${needDongli} ✓`;
    setStory(msg);
    refreshCastleInterior();
    return;
  }

  removeItemById("drinks", "Bai Wei beer", needBaiwei);
  removeItemById("drinks", "Dong Li beer", needDongli);
  markQuestDone("queenQuest1");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 10 });
  setStory(`Bạn bàyBai Wei beer vàDong Li beer trước mặt hoàng hậu. Cô ấy cầm một chai, ngửa cổ uống một hơi.

"Anh không biết," cô ấy lau khóe miệng, "chiếc mặt dây chuyền này do chính tay anh ấy làm. Khi đó anh ấy chưa làm vua, chỉ là một ông trùm bất động sản. Anh ấy nói hoa hướng dương luôn hướng về mặt trời, như anh ấy luôn nhìn về phía em."

Cô ấy lại uống một ngụm:
"Sau đó thì sao? Sau đó anh ấy có quyền lực, có lâu đài, có mọi người quỳ dưới chân. Nhưng anh ấy vẫn muốn em đeo thứ này. Anh nói đi, đó làsâu nặng, hay làxiềng xích?"

Bạn không trả lời. Có những câu hỏi, đáp án không nằm trong rượu.

🪙 Nhận được【Royal coin】×10`);
  refreshCastleInterior();
}

export function handleQueenQuest2() {
  const state = getState();
  const gouqiCount = state.food.filter(i => i.id === "gouqi").reduce((sum, i) => sum + (i.count || 1), 0);
  const needGouqi = 10;

  if (gouqiCount < needGouqi) {
    setStory(`Hoàng hậu ưu tư nói："Gần đây nhà vua sức khỏe không tốt, hoài hoài. Tôi nghe nói kỷ tử có ích cho cơ thể, bạn có thể giúp tôi tìm một ít không？"\n\nVật phẩm cần：\n  kỷ tử ${gouqiCount}/${needGouqi}`);
    refreshCastleInterior();
    return;
  }

  removeItemById("food", "gouqi", needGouqi);
  markQuestDone("queenQuest2");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 20 });
  setStory(`Bạn giao kỷ tử cho hoàng hậu. Cô ấy cẩn thận cất kỹ, như nâng niu báu vật.

"Cảm ơn." Giọng cô ấy rất khẽ, "Bất kể người khác nói gì về anh ấy, anh ấy đối với em……thực sự rất tốt."

Cô ấy dừng lại, cười khổ:
"Anh ấy chỉ có một mình em là hoàng hậu. Trong ngày tận thế này, một vị vua chỉ giữ một người, bạn tin không?"

Bạn nhìn vào mắt cô ấy, nơi đó có ánh sáng, cũng có bóng tối.

🪙 Nhận được【Royal coin】×20`);
  refreshCastleInterior();
}

export function handleQueenQuest3() {
  const state = getState();
  const swordCount = state.other.filter(i => i.id === "kiếm西洋").length;
  const needSwords = 3;

  if (swordCount < needSwords) {
    setStory(`Hoàng hậu nói："Kiếm ở thao trường lâu đài đều hỏng rồi, rất cần mới. Bạn có thể kiếm được 3 thanhkiếm西洋 không? Nhà vua thích luyện kiếm, đó là sở thích duy nhất của anh ấy。"\n\nVật phẩm cần：\n  kiếm西洋 ${swordCount}/${needSwords}`);
    refreshCastleInterior();
    return;
  }

  for (let i = 0; i < needSwords; i++) {
    const idx = state.other.findIndex(item => item.id === "kiếm西洋");
    if (idx !== -1) state.other.splice(idx, 1);
  }
  markQuestDone("queenQuest3");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 30 });
  setStory(`Bạn giao 3 thanhkiếm西洋 cho hoàng hậu. Cô ấy tự tay kiểm tra từng thanh, hài lòng gật đầu.

"Anh ấy luyện kiếm mỗi ngày." Hoàng hậu nhìn lưỡi kiếm lóehàn quang, "Anh ấy nói, chỉ khi tay có kiếm, mới có thể bảo vệ người muốn bảo vệ。"

Cô ấy bỗng khẽ nói:
"Nhưng anh ấy bảo vệ tất cả mọi người, chỉ không bảo vệ được bản thân. Sức khỏe của anh ấy……ngày càng tệ。"

🪙 Nhận được【Royal coin】×30`);
  refreshCastleInterior();
}

export function handleQueenQuest4() {
  const state = getState();
  const hasM700 = state.rangedWeapon && state.rangedWeapon.id === "M700";
  const m700InBag = state.other.some(i => i.id === "M700");

  if (!hasM700 && !m700InBag) {
    setStory("Hoàng hậu do dự một chút, rồi nói：\"Hôm nay là kỷ niệm ngày cưới của chúng tôi. Anh ấy thích đi săn và sưu tầm vũ khí……tôi muốn tặng anh ấy một khẩu súng tốt. Bạn có thể giúp tôi kiếm một khẩu M700 không？\"\n\nVật phẩm cần：\n  M700 ×1\n\n（Gợi ý：M700 cần trang bị làm vũ khí tầm xa hoặc đặt trong balo）");
    refreshCastleInterior();
    return;
  }

  if (hasM700) {
    state.rangedWeapon = null;
  } else {
    const idx = state.other.findIndex(i => i.id === "M700");
    if (idx !== -1) state.other.splice(idx, 1);
  }

  markQuestDone("queenQuest4");
  if (checkGoHomeEnding()) return;
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 40 });
  const pass = SPECIAL_ITEMS.castle_pass;
  addItem({ ...pass });
  setStory(`Bạn đưa M700 cho hoàng hậu. Cô ấy nhận lấy khẩu súng, khẽ vuốt ve các hoa văn trên báng súng, trong mắt thoáng qua một tia dịu dàng.

"Anh ấy chắc chắn sẽ thích。" Cô ấy đặt súng sang một bên, lấy từ dưới ghế dài ra một phong bì tinh xảo, đưa cho bạn.

"Đây là thẻ thông hành lâu đài. Có nó, bạn có thể ra vào lâu đài bất cứ lúc nào, không cần thẻ thân phận, cũng không cần hối lộ vệ binh。"

Cô ấy nhìn ra cửa sổ về phía đêm, khẽ nói:
"Anh biết không? Anh ấy chưa bao giờ để em chịu chútuất ức nào。Trong ngày tận thế này, anh ấy cho em một ngôi nhà, một vương miện, và……toàn bộ chân tâm của anh ấy。"

"Nhưng chân tâm thứ này, đôi khi cònthương người hơn cả đạn。"

Cô ấy quay lại nhìn bạn, nụ cười mang theo sự giải thoát:
"Thay tôi chăm sóc anh ấy。Cũng thay tôi……chăm sóc anh trai tôi。"

🪙 Nhận được【Royal coin】×40！
🎫 Nhận được【Thẻ thông hành lâu đài】！

（Gợi ý：Sở hữu thẻ thông hành lâu đài có thể tự do ra vào lâu đài）`);
  refreshCastleInterior();
}

export function handleKingUnderground() {
  const state = getState();
  if (state.undergroundKeyObtained) {
    setStory("Nhà vua xua tay：\"Chìa khóa không phải đã đưa bạn rồi sao? Mau đi đi。\"");
    refreshCastleInterior();
    return;
  }
  setStory(KING_UNDERGROUND_STORY);
  const hasAWM = state.rangedWeapon && state.rangedWeapon.id === GAME_CONSTANTS.ROCKET.AWM_ID;
  const hasAWMInBag = state.other.some(i => i.id === GAME_CONSTANTS.ROCKET.AWM_ID);
  const opts = [];
  if (hasAWM || hasAWMInBag) {
    opts.push({ text: "Nộp AWM", action: "king_trade_awm" });
  } else {
    opts.push({ text: "Nộp AWM（Bạn không có AWM）", action: "king_trade_awm", disabled: true });
  }
  opts.push({ text: "Rời đi", action: "castle_back" });
  setOptions(opts);
  setPhase("castle_interior");
}

export function handleKingTradeAWM() {
  const state = getState();
  if (state.rangedWeapon && state.rangedWeapon.id === GAME_CONSTANTS.ROCKET.AWM_ID) {
    state.rangedWeapon = null;
  } else {
    const awmIdx = state.other.findIndex(i => i.id === GAME_CONSTANTS.ROCKET.AWM_ID);
    if (awmIdx !== -1) {
      state.other.splice(awmIdx, 1);
    } else {
      setStory("Bạn không có AWM để nộp。");
      refreshCastleInterior();
      return;
    }
  }
  state.undergroundKeyObtained = true;
  state.other.push({ ...SPECIAL_ITEMS.underground_key });
  setStory("Nhà vua nhận lấy AWM, yêu thích vuốt ve thân súng："Súng tốt！Súng tốt a！" Anh ấy lấy từ dưới ngai vàng ra một chiếc chìa khóa rỉ sét ném cho bạn："Cầm đi, chìa khóa khu vực ngầm. Đừng có mà tháo hết thiết bị hạt nhân của tôi！\"");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleBall() {
  const state = getState();
  const hasId = hasCastleIdentity(state);
  if (!hasId) {
    setStory("Vệ binh vũ hội chặn bạn lại ở cửa："Vui lòng xuất trình thẻ thân phận quý tộc。" Bạn không có thẻ thân phận, bị đuổi ra ngoài。\n\nBạn bị phát hiện không có thân phận quý tộc, bị đuổi ra ngoài！");
    state.currentSubMap = null;
    refreshCastleOutpost();
    return;
  }
  if (state.lastBallDay === state.day) {
    setStory("Hôm nay bạn đã tham dự vũ hội rồi, chân cũng nhảy mỏi rồi. Lần sau hãy đến。");
    refreshCastleInterior();
    return;
  }
  state.lastBallDay = state.day;
  state.crash = Math.max(0, (state.crash || 0) - GAME_CONSTANTS.CASTLE.BALL_FATIGUE_REDUCTION);
  setStory(`Bạn nhảy múa trong đại sảnh lộng lẫy, điệu waltz du dương khiến bạn tạm thời quên đi sự tàn khốc của ngày tận thế. Một khúc nhạc kết thúc, bạn cảm thấy cả thân thể lẫn tâm hồn đều được thư giãn。\n\nMệt mỏi -${GAME_CONSTANTS.CASTLE.BALL_FATIGUE_REDUCTION}。`);
  advanceTime(GAME_CONSTANTS.CASTLE.BALL_TIME_COST);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleRoom() {
  const state = getState();
  const hasId = hasCastleIdentity(state);
  if (!hasId) {
    setStory("Quản gia phòng khách chặn bạn lại："nơi đây chỉ dành cho quý tộc mở cửa。" Bạn không có thẻ thân phận, bị đuổi ra ngoài。\n\nBạn bị phát hiện không có thân phận quý tộc, bị đuổi ra ngoài！");
    state.currentSubMap = null;
    refreshCastleOutpost();
    return;
  }
  if (state.lastRoomDay >= state.day) {
    setStory("Hôm nay đã nghỉ ngơi rồi, mai hãy đến nhé。");
    refreshCastleInterior();
    return;
  }
  state.lastRoomDay = state.day;
  state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + GAME_CONSTANTS.CASTLE.ROOM_HEALTH_RESTORE);
  state.sanity = Math.min(GAME_CONSTANTS.SANITY_MAX, state.sanity + GAME_CONSTANTS.CASTLE.ROOM_SANITY_RECOVERY);
  const fatigueReduction = Math.min(GAME_CONSTANTS.CASTLE.ROOM_FATIGUE_REDUCTION, state.crash);
  state.crash = Math.max(state.crash - GAME_CONSTANTS.CASTLE.ROOM_FATIGUE_REDUCTION, 0);
  setStory(`Bạn nghỉ ngơi thoải mái trong phòng khách quý tộc. Sau khi tỉnh dậy tinh thần sảng khoái。\n\nMáu +${GAME_CONSTANTS.CASTLE.ROOM_HEALTH_RESTORE}（Hiện tại ${state.health}/${GAME_CONSTANTS.MAX_HEALTH}）, lý trí hồi phục ${GAME_CONSTANTS.CASTLE.ROOM_SANITY_RECOVERY} điểm, mệt mỏi giảm ${fatigueReduction} điểm。`);
  advanceTime(GAME_CONSTANTS.CASTLE.ROOM_TIME_COST);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleSalary() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank < 2) {
    setStory("Bạn chưa đáp ứng điều kiện nhận lương。");
    refreshCastleInterior();
    return;
  }
  if (state.lastSalaryDay === state.day) {
    setStory("Hôm nay bạn đã nhận lương rồi, mai hãy đến nhé。");
    refreshCastleInterior();
    return;
  }
  const rankName = getCastleRankName(state);
  const count = rank - 1;
  state.lastSalaryDay = state.day;
  const pools = [FOODS, FRUITS, DRINKS];
  const received = [];
  for (let i = 0; i < count; i++) {
    const pool = pools[Math.floor(Math.random() * pools.length)];
    const item = { ...pool[Math.floor(Math.random() * pool.length)] };
    addItem(item);
    received.push(getItemDisplayName(item));
  }
  setStory(`Thân phận hiện tại của bạn là ${rankName}, nhận được ${received.join("、")}。`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

const ROYAL_SHOP_ITEMS = [
  { name: "Quân lương đóng hộp", price: 2, type: "food", itemId: "军粮罐头" },
  { name: "Nước điện giải", price: 2, type: "drink", itemId: "电解质水" },
  { name: "Huyết thanh kháng nhiễm", price: 3, type: "medicine", itemId: "抗感染血清" },
  { name: "Túi cấp cứu y tế", price: 5, type: "medicine", itemId: "医用急救包" },
  { name: "Hộp y tế chiến trường", price: 10, type: "medicine", itemId: "战地医疗箱" },
  { name: "Súng ngắn hoàng gia", price: 100, type: "ranged", itemId: "皇家短枪" },
  { name: "Kiếm bạc hoàng gia", price: 100, type: "melee", itemId: "皇家银剑" },
];

export function handleRoyalTrade() {
  const state = getState();
  setStory(`Hoàng hậu khẽ gật đầu："Giao dịch hoàng gia? Đương nhiên. Royal coin trong tay bạn có thể đổi được không ít đồ tốt ở đây。"\n\nRoyal coin hiện tại：${state.royalCoins}`);
  setPhase("castle_interior");
  setOptions([
    { text: "Đổi Royal coin", action: "queen_royal_exchange" },
    { text: "Cửa hàng tạp hóa hoàng hậu", action: "queen_royal_shop" },
    { text: "Quay về sảnh", action: "castle_back" },
  ]);
}

export function handleRoyalExchange() {
  const state = getState();
  const gouqiCount = state.food.filter(i => i.id === "gouqi").reduce((sum, i) => sum + (i.count || 1), 0);
  const swordCount = state.other.filter(i => i.id === "kiếm西洋").length;
  setStory(`Hoàng hậu："Bạn có thể dùng vật tư để đổi Royal coin。"\n\nRoyal coin hiện tại：${state.royalCoins}\n\nCó thể đổi：\n  Kỷ tử ×${gouqiCount}（2 kỷ tử = 1 Royal coin）\n  Kiếm西洋 ×${swordCount}（1 kiếm西洋 = 5 Royal coin）`);
  setPhase("castle_interior");
  setOptions([
    { text: `Nộp kỷ tử（2→1 coin）×${gouqiCount}`, action: "queen_exchange_gouqi" },
    { text: `Nộp kiếm西洋（1→5 coin）×${swordCount}`, action: "queen_exchange_sword" },
    { text: "Quay lại", action: "queen_royal_trade" },
  ]);
}

export function handleExchangeGouqi() {
  const state = getState();
  const gouqiCount = state.food.filter(i => i.id === "gouqi").reduce((sum, i) => sum + (i.count || 1), 0);
  if (gouqiCount < 2) {
    setStory("Kỷ tử của bạn không đủ, ít nhất cần 2 cái mới đổi được 1 Royal coin。");
    refreshCastleInterior();
    return;
  }
  removeItemById("food", "gouqi", 2);
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 1 });
  setStory(`Bạn nộp 2 kỷ tử, nhận được 1 Royal coin。\n\nRoyal coin hiện tại：${state.royalCoins}`);
  refreshCastleInterior();
}

export function handleExchangeSword() {
  const state = getState();
  const swordIdx = state.other.findIndex(i => i.id === "kiếm西洋");
  if (swordIdx === -1) {
    setStory("Bạn không có kiếm西洋 để nộp。");
    refreshCastleInterior();
    return;
  }
  state.other.splice(swordIdx, 1);
  addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: 5 });
  setStory(`Bạn nộp 1 kiếm西洋, nhận được 5 Royal coin。\n\nRoyal coin hiện tại：${state.royalCoins}`);
  refreshCastleInterior();
}

export function handleRoyalShop() {
  const state = getState();
  let shopList = "Cửa hàng tạp hóa hoàng hậu\n\n";
  ROYAL_SHOP_ITEMS.forEach((item, idx) => {
    shopList += `  ${idx + 1}. ${item.name} — ${item.price} Royal coin\n`;
  });
  shopList += `\nRoyal coin hiện tại：${state.royalCoins}`;
  setStory(shopList);
  setPhase("castle_interior");
  const opts = ROYAL_SHOP_ITEMS.map(item => ({
    text: `${item.name}（${item.price} coin）`,
    action: `queen_buy_${item.itemId}`,
  }));
  opts.push({ text: "Quay lại", action: "queen_royal_trade" });
  setOptions(opts);
}

export function handleRoyalShopBuy(itemId) {
  const state = getState();
  const shopItem = ROYAL_SHOP_ITEMS.find(i => i.itemId === itemId);
  if (!shopItem) {
    refreshCastleInterior();
    return;
  }
  if (state.royalCoins < shopItem.price) {
    setStory(`Royal coin của bạn không đủ。Cần ${shopItem.price} Royal coin, hiện tại chỉ có ${state.royalCoins}。`);
    refreshCastleInterior();
    return;
  }
  removeRoyalCoins(shopItem.price);
  let itemToAdd;
  if (shopItem.type === "food") {
    const foodDef = FOODS.find(f => f.id === itemId);
    itemToAdd = foodDef ? { ...foodDef } : { id: itemId, name: shopItem.name, type: "food" };
  } else if (shopItem.type === "drink") {
    const drinkDef = DRINKS.find(d => d.id === itemId);
    itemToAdd = drinkDef ? { ...drinkDef } : { id: itemId, name: shopItem.name, type: "drink" };
  } else if (shopItem.type === "medicine") {
    const medDef = MEDICINES.find(m => m.id === itemId);
    itemToAdd = medDef ? { ...medDef } : { id: itemId, name: shopItem.name, type: "medicine" };
  } else if (shopItem.type === "ranged") {
    const rangedDef = RANGED_WEAPONS.find(w => w.id === itemId);
    itemToAdd = rangedDef ? { ...rangedDef } : { id: itemId, name: shopItem.name, type: "ranged" };
  } else if (shopItem.type === "melee") {
    const meleeDef = MELEE_WEAPONS.find(w => w.id === itemId);
    itemToAdd = meleeDef ? { ...meleeDef, currentDurability: meleeDef.durability } : { id: itemId, name: shopItem.name, type: "melee" };
  }
  if (itemToAdd) {
    const added = addItem(itemToAdd);
    if (!added) {
      addItem({ id: "Royal coin", name: "Royal coin", type: "royal_coin", count: shopItem.price });
      setStory("Balo của bạn đã đầy, không thể mua vật phẩm này。Royal coin đã được hoàn lại。");
      refreshCastleInterior();
      return;
    }
  }
  setStory(`Bạn đã tiêu ${shopItem.price} Royal coin, mua được【${shopItem.name}】。\n\nRoyal coin hiện tại：${state.royalCoins}`);
  refreshCastleInterior();
}
