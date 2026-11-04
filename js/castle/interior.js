import { getState, setPhase, setStory, setOptions, addItem, advanceTime, updateStatusEffects, checkDeath, getItemDisplayName } from '../state.js';
import { FOODS, DRINKS, FRUITS, GAME_CONSTANTS, UNDERGROUND_STORY, SPECIAL_ITEMS, NAMED_NPCS, MAP_NPC_INTROS } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity } from '../faction.js';
import { showExploreOptionsState } from '../routing.js';
import { handleEatSelect, handleDrinkSelect, handleMedicineSelect, handleGoOut } from '../game/index.js';
import { handleEquipSelect, handleDiscardSelect } from '../equipment.js';
import { refreshCastleOutpost } from './outpost.js';
import { handleCastleKing, handleCastleQueen, handleQueenLateApology, handleQueenPast, handleQueenQuest1, handleQueenQuest2, handleQueenQuest3, handleQueenQuest4, handleCastleBanquet, handleCastleBall, handleCastleRoom, handleCastleSalary, handleKingUnderground, handleKingTradeAWM, handleRoyalTrade, handleRoyalExchange, handleExchangeGouqi, handleExchangeSword, handleRoyalShop, handleRoyalShopBuy } from './royalty.js';
import { handleCastleTreatment, handleTreatConfirm, handleCastleMeeting, handleCastleGarden, handleCastleTitleReissue } from './services.js';
import { handleCastleKingQuest, handleKingQuestSubmit } from './king-quest.js';

export function enterCastleInterior() {
  const state = getState();
  state.currentSubMap = "城堡内部";
  showCastleInterior();
}

export function showCastleInterior() {
  const state = getState();
  state.currentSubMap = "城堡内部";
  setPhase("castle_interior");
  const acidBlock = state.weather === "酸雨";
  setStory("Xuyên qua cánh cổng thành dày nặng, bạn bước vào bên trong thành, đại sảnh chính rộng lớn hùng vĩ sáng trưng ánh đèn, ánh sáng ấm áp lung linh chiếu rọi mọi chi tiết chạm trổ, sàn đá marble bóng loáng như gương, vòm trần treo đèn chùm pha lê khổng lồ, khí phái xa hoa không hề kém thời kỳ đỉnh thịnh trước ngày tận thế, quý tộc và quan chức cấp cao ăn mặc hoa lệ tụ tập tại đây, mặc lễ phục cắt may tinh xảo, đeo vàng bạc châu báu và huy hiệu biểu tượng quyền lực, nâng chén cười nói, rượu và món ăn tinh xảo bày đầy bàn dài, tiếng cười nói vang vọng trong đại sảnh, bầu không khí xa hoa lười biếng tràn ngập, như thể lũ xác sống hoành hành bên ngoài, thế giới hoang tàn tuyệt vọng, chưa từng giáng xuống mảnh đất được tường cao che chở này.");
  refreshCastleInterior();
}

export function refreshCastleInterior() {
  const state = getState();
  setPhase("castle_interior");
  const acidBlock = state.weather === "酸雨";
  const opts = [
    { text: "Khám phá", action: "castle_interior_explore" },
    { text: "Ăn uống", action: "eat" },
    { text: "Uống nước", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Vứt bỏ", action: "discard" },
    { text: acidBlock ? "Rời đi (Mưa axit không thể rời đi)" : "Rời đi", action: "leave_castle_interior", disabled: acidBlock },
    { text: "Gặp quốc vương thành", action: "castle_king" },
    { text: "Gặp hoàng hậu thành", action: "castle_queen" },
    { text: "Tham dự yến tiệc quý tộc", action: "castle_banquet" },
    { text: "Tham dự vũ hội quý tộc", action: "castle_ball" },
    { text: "Nghỉ tại phòng quý tộc", action: "castle_room" },
  ];
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  if (rank >= 2) {
    opts.push({ text: "Nhận lương bổng tước vị", action: "castle_salary" });
  }
  opts.push({ text: "Điều trị nhiễm trùng", action: "castle_treatment" });
  opts.push({ text: "Cấp lại tước vị", action: "castle_reissue" });
  const meetingCooldown = state.lastMeetingDay === state.day ? "（Hôm nay đã tham dự）" : "";
  opts.push({ text: `Tham dự hội nghị thành${meetingCooldown}`, action: "castle_meeting", disabled: state.lastMeetingDay === state.day });
  const gardenCooldown = state.lastGardenDay >= state.day - (GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS - 1) ? `（${GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS - (state.day - state.lastGardenDay)} ngày nữa mới có thể quay lại）` : "";
  const gardenDisabled = state.day - state.lastGardenDay < GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS;
  opts.push({ text: `Dạo vườn sau${gardenCooldown}`, action: "castle_garden", disabled: gardenDisabled });
  opts.push({ text: "Khu vực ngầm", action: "castle_underground" });
  opts.push({ text: "Nhiệm vụ vương quốc", action: "castle_king_quest" });

  // Chuỗi nhiệm vụ Lão Mã: ám sát quốc vương
  if (state.oldMaStep >= 4 && !state.kingKilled) {
    const hasId = hasCastleIdentity(state);
    if (!hasId) {
      opts.push({ text: "🔪 Ám sát quốc vương", action: "assassinate_king" });
    }
  }

  setOptions(opts);
}

export function handleCastleInteriorExplore() {
  const state = getState();
  const hasId = hasCastleIdentity(state);

  if (!hasId) {
    setStory("Bạn vừa định lục soát thứ gì đó, lính gác tuần tra đã chú ý đến bạn! Bạn bị đuổi ra ngoài!");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      state.currentSubMap = null;
      refreshCastleOutpost();
    }
    return;
  }

  if (state.lastCastleExploreDay >= state.day) {
    setStory("Hôm nay đã khám phá rồi, mai hãy quay lại.");
    refreshCastleInterior();
    return;
  }
  state.lastCastleExploreDay = state.day;

  const lootTables = [FOODS, DRINKS, FRUITS];
  const pool = lootTables[Math.floor(Math.random() * lootTables.length)];
  const item = pool[Math.floor(Math.random() * pool.length)];
  const added = addItem({ ...item });
  if (added) {
    setStory(`Bạn phát hiện ở góc thành vài thứ người khác bỏ lại: ${getItemDisplayName(item)}.`);
  } else {
    setStory("Bạn đi loanh quanh trong thành, nhưng balo đã đầy, không thể mang thêm gì.");
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleInteriorAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action === "eat") { handleEatSelect(); return; }
  if (option.action === "drink") { handleDrinkSelect(); return; }
  if (option.action === "medicine") { handleMedicineSelect(); return; }
  if (option.action === "equip") { handleEquipSelect(); return; }
  if (option.action === "discard") { handleDiscardSelect(); return; }
  if (option.action === "castle_interior_explore") { handleCastleInteriorExplore(); return; }
  if (option.action === "leave_castle_interior") {
    if (getState().weather === "酸雨") {
      setStory("Bên ngoài đang mưa axit ăn mòn, bạn không thể ra ngoài. Tốt nhất tìm chỗ nào đó trú đã.");
      return;
    }
    handleLeaveCastleInterior(); return;
  }
  if (option.action === "castle_king") { handleCastleKing(); return; }
  if (option.action === "castle_queen") { handleCastleQueen(); return; }
  if (option.action === "queen_late_apology") { handleQueenLateApology(); return; }
  if (option.action === "queen_past") { handleQueenPast(); return; }
  if (option.action === "queen_quest1") { handleQueenQuest1(); return; }
  if (option.action === "queen_quest2") { handleQueenQuest2(); return; }
  if (option.action === "queen_quest3") { handleQueenQuest3(); return; }
  if (option.action === "queen_quest4") { handleQueenQuest4(); return; }
  if (option.action === "queen_royal_trade") { handleRoyalTrade(); return; }
  if (option.action === "queen_royal_exchange") { handleRoyalExchange(); return; }
  if (option.action === "queen_exchange_gouqi") { handleExchangeGouqi(); return; }
  if (option.action === "queen_exchange_sword") { handleExchangeSword(); return; }
  if (option.action === "queen_royal_shop") { handleRoyalShop(); return; }
  if (option.action.startsWith("queen_buy_")) {
    const itemId = option.action.replace("queen_buy_", "");
    handleRoyalShopBuy(itemId);
    return;
  }
  if (option.action === "castle_banquet") { handleCastleBanquet(); return; }
  if (option.action === "castle_ball") { handleCastleBall(); return; }
  if (option.action === "castle_room") { handleCastleRoom(); return; }
  if (option.action === "castle_salary") { handleCastleSalary(); return; }
  if (option.action === "castle_treatment") { handleCastleTreatment(); return; }
  if (option.action === "castle_meeting") { handleCastleMeeting(); return; }
  if (option.action === "castle_garden") { handleCastleGarden(); return; }
  if (option.action === "castle_reissue") { handleCastleTitleReissue(); return; }
  if (option.action === "castle_king_quest") { handleCastleKingQuest(); return; }
  if (option.action === "castle_underground") { handleCastleUnderground(); return; }
  if (option.action === "underground_dismantle") { handleDismantleEquipment(); return; }
  if (option.action === "underground_leave") { refreshCastleInterior(); return; }
  if (option.action === "king_underground") { handleKingUnderground(); return; }
  if (option.action === "king_trade_awm") { handleKingTradeAWM(); return; }
  if (option.action === "castle_back") { refreshCastleInterior(); return; }
  if (option.action === "treat_10") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[0]) {
      const rn = getCastleRankName(getState()) || "Bình dân";
      setStory(`Vị ${rn} đại nhân, xin lỗi, nguồn y tế có hạn, chúng tôi chỉ sắp xếp bác sĩ thực tập cho các vị Bá tước trở lên.`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[0]); return;
  }
  if (option.action === "treat_30") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[1]) {
      const rn = getCastleRankName(getState()) || "Bình dân";
      setStory(`Vị ${rn} đại nhân, xin lỗi, nguồn y tế có hạn, chúng tôi chỉ sắp xếp bác sĩ chính thức cho các vị Hầu tước trở lên.`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[1]); return;
  }
  if (option.action === "treat_50") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[2]) {
      const rn = getCastleRankName(getState()) || "Bình dân";
      setStory(`Vị ${rn} đại nhân, xin lỗi, nguồn y tế có hạn, chúng tôi chỉ sắp xếp bác sĩ trưởng khoa cho các vị Công tước trở lên.`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[2]); return;
  }
  if (option.action === "treat_80") {
    const rank = getCastleRank(getState());
    if (rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[3]) {
      const rn = getCastleRankName(getState()) || "Bình dân";
      setStory(`Vị ${rn} đại nhân, xin lỗi, nguồn y tế có hạn, chúng tôi chỉ sắp xếp bác sĩ hoàng cung cho các vị Trữ quân trở lên.`);
      return;
    }
    handleTreatConfirm(GAME_CONSTANTS.CASTLE.TREATMENT_AMOUNTS[3]); return;
  }
  if (option.action === "treat_back") { refreshCastleInterior(); return; }
  if (option.action === "king_quest_submit") { handleKingQuestSubmit(); return; }
  if (option.action === "king_quest_back") { refreshCastleInterior(); return; }
  if (option.action === "assassinate_king") { handleAssassinateKing(); return; }
  if (option.action === "assassinate_king_fight") { handleAssassinateKingFight(); return; }
}

export function handleLeaveCastleInterior() {
  const state = getState();
  state.currentSubMap = null;
  setStory("Bạn rời khỏi thành.");
  showExploreOptionsState();
}

export function handleLeaveCastle() {
  setStory("Bạn rời khỏi Thành tận thế, quay về hoang dã.");
  handleGoOut();
}

export function handleCastleUnderground() {
  const state = getState();
  if (!state.undergroundKeyObtained) {
    const hasKey = state.other.some(i => i.id === "underground_key");
    if (!hasKey) {
      setStory("Cánh cổng sắt dày nặng khóa chặt, bạn không có chìa khóa, không thể vào khu vực ngầm.");
      refreshCastleInterior();
      return;
    }
  }
  if (state.generatorObtained) {
    setStory(UNDERGROUND_STORY + "\n\nMột phần thiết bị hạt nhân đã bị tháo dỡ, phần còn lại vẫn đang vận hành. Nếu tháo thêm nữa, thành e rằng sẽ mất điện.");
    const opts = [
      { text: "Quay về đại sảnh", action: "castle_back" },
    ];
    setOptions(opts);
    setPhase("castle_interior");
    return;
  }
  setStory(UNDERGROUND_STORY);
  const opts = [
    { text: "Tháo thiết bị", action: "underground_dismantle" },
    { text: "Rời đi", action: "underground_leave" },
  ];
  setOptions(opts);
  setPhase("castle_interior");
}

export function handleDismantleEquipment() {
  const state = getState();
  if (state.generatorObtained) {
    setStory("Tháo thêm nữa thì thành mất điện!");
    refreshCastleInterior();
    return;
  }
  const hasWrench = state.meleeWeapon && state.meleeWeapon.id === GAME_CONSTANTS.ROCKET.DISMANTLE_WEAPON_ID;
  const hasDimBag = state.backpack && state.backpack.id === GAME_CONSTANTS.ROCKET.DISMANTLE_BACKPACK_ID;
  if (!hasWrench && !hasDimBag) {
    setStory("Bạn không có cờ lê, cũng không có balo phù hợp, chẳng làm được gì.");
    refreshCastleInterior();
    return;
  }
  if (!hasWrench) {
    setStory("Bạn không có cờ lê, không thể vặn các bu lông cố định thiết bị hạt nhân này.");
    refreshCastleInterior();
    return;
  }
  if (!hasDimBag) {
    setStory("Bạn không có balo phù hợp để chứa nó, xem ra cần balo chiều không gian trong truyền thuyết.");
    refreshCastleInterior();
    return;
  }
  const generator = SPECIAL_ITEMS.small_nuclear_generator;
  if (generator) {
    const added = addItem({ ...generator });
    if (added) {
      state.generatorObtained = true;
      setStory("Bạn dùng cờ lê lớn thận trọng vặn lỏng các bu lông cố định, tháo máy phát điện hạt nhân nhỏ khỏi bệ. Không gian của balo chiều không gian vừa đủ chứa vật to lớn này. Bạn cảm thấy balo hơi nóng lên——máy phát vẫn đang vận hành.");
    } else {
      setStory("Bạn cố tháo thiết bị, nhưng balo không đủ chỗ, không thể mang theo!");
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

// ========== Chuỗi nhiệm vụ Lão Mã: ám sát quốc vương ==========

export function handleAssassinateKing() {
  const state = getState();
  if (state.kingKilled) {
    setStory("Quốc vương đã không còn, ngai vàng trống không.");
    refreshCastleInterior();
    return;
  }
  if (state.oldMaStep < 4) {
    refreshCastleInterior();
    return;
  }
  const hasId = hasCastleIdentity(state);
  if (hasId) {
    setStory("Bạn vẫn mang theo thân phận của thành, lính gác đang dòm ngó bạn. Bạn không thể động thủ ở đây.");
    refreshCastleInterior();
    return;
  }
  setPhase("castle_interior");
  setStory("Bạn giả vờ thản nhiên tiến đến ngai vàng. Quốc vương đang tựa vào tay vịn dát vàng chợp mắt, áo choàng hoa lệ thêu chim thú quý hiếm đã tuyệt tích từ trước ngày tận thế.\n\nCác quý tộc trong đại sảnh vẫn còn nâng chén nói cười ở xa, không ai chú ý đến bạn. Tay bạn sờ đến vũ khí bên hông——đây là thời cơ tốt nhất.\n\nĐộng thủ không?");
  setOptions([
    { text: "Động thủ!", action: "assassinate_king_fight" },
    { text: "Đợi thêm……", action: "castle_back" },
  ]);
}

export function handleAssassinateKingFight() {
  const state = getState();
  const king = NAMED_NPCS.king_boss;
  state._pendingNpc = {
    name: king.name,
    hp: king.hp,
    damage: king.damage,
    hasRanged: king.hasRanged,
    dodgeRate: king.dodgeRate,
  };
  state._pendingNpcCallback = "assassinate_king_result";
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "Không";
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường! Nên nghỉ ngơi trước." : "";
  setStory(`Bạn rút vũ khí, xông về phía ngai vàng! Quốc vương giật mình tỉnh giấc, trong mắt thoáng qua một tia sợ hãi, rồi hóa thành ngọn lửa giận lạnh lùng. Hắn rút thanh kiếm bên hông, cận vệ quốc vương cũng xông ra từ chỗ tối——nhưng mục tiêu của bạn chỉ có quốc vương một người!\n\n⚔️ ${king.name}\n❤️ HP:${king.hp} | ⚡ Sát thương:${king.damage}\n\n【Cận chiến】${meleeName}\n【Tầm xa】${rangedName}${crashWarning}`);
  const opts = [
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" }
  ];
  if (state.rangedWeapon && state.ammo.some(a => a.id === state.rangedWeapon.ammoType && a.count > 0)) {
    opts.push({ text: "Chiến đấu tầm xa", action: "combat_npc_ranged" });
  } else {
    opts.push({ text: "Chiến đấu tầm xa (Không khả dụng: Hết đạn)", action: "combat_npc_ranged", disabled: true });
  }
  opts.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
  setOptions(opts);
}