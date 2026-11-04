import { getState, setPhase, setStory, setOptions, addItem, addCigarettes, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { MELEE_WEAPONS, MEDICINES, GAME_CONSTANTS, SPECIAL_ITEMS, CASTLE_RANKS, weightedRandom } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity, getHighestObtainedRank, hasAnyDawnIdentity, cleanDualIdentity } from '../faction.js';
import { refreshCastleOutpost } from './outpost.js';
import { refreshCastleInterior } from './interior.js';

export function handleCastleTreatment() {
  const state = getState();
  const rank = getCastleRank(state);
  if (state.lastTreatmentDay === state.day) {
    setStory("Hôm nay bạn đã được chữa trị rồi, mai hãy đến nhé.");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  setPhase("castle_treatment");
  setStory("Trong phòng y tế lâu đài, vài bác sĩ mặc áo blouse trắng đang bận rộn. Vui lòng chọn bác sĩ để chữa trị cho bạn:");
  const opts = [];
  const rankName = getCastleRankName(state) || "Bình dân";
  opts.push({ text: rank >= GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[0] ? "Bác sĩ thực tập chữa trị(Giảm 10% giá trị nhiễm trùng)" : "Bác sĩ thực tập(Cần Bá tước trở lên)", action: "treat_10", disabled: rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[0] });
  opts.push({ text: rank >= GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[1] ? "Bác sĩ chính thức chữa trị(Giảm 30% giá trị nhiễm trùng)" : "Bác sĩ chính thức(Cần Hầu tước trở lên)", action: "treat_30", disabled: rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[1] });
  opts.push({ text: rank >= GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[2] ? "Bác sĩ trưởng khoa chữa trị(Giảm 50% giá trị nhiễm trùng)" : "Bác sĩ trưởng khoa(Cần Công tước trở lên)", action: "treat_50", disabled: rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[2] });
  opts.push({ text: rank >= GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[3] ? "Bác sĩ cung đình chữa trị(Giảm 80% giá trị nhiễm trùng)" : "Bác sĩ cung đình(Cần Trữ quân trở lên)", action: "treat_80", disabled: rank < GAME_CONSTANTS.CASTLE.TREATMENT_RANKS[3] });
  opts.push({ text: "Rời đi", action: "treat_back" });
  setOptions(opts);
}

export function handleTreatConfirm(amount) {
  const state = getState();
  state.infection = Math.max(0, state.infection - amount);
  state.lastTreatmentDay = state.day;
  const doctors = GAME_CONSTANTS.CASTLE.TREATMENT_DOCTORS;
  setStory(`${doctors[amount]} đã tiến hành chữa trị tận tâm cho bạn. Giá trị nhiễm trùng giảm ${amount}%(Giá trị nhiễm trùng hiện tại: ${state.infection}%).`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleMeeting() {
  const state = getState();
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  if (rank < GAME_CONSTANTS.CASTLE.MEETING_RANK_REQUIRED) {
    setStory(`Phòng quản lý hội nghị xem xét thẻtước vị của bạn, lịch sự yêu cầu bạn rời khỏi hội trường.\n"Vị ${rankName} đại nhân này, rất xin lỗi, ngài hiện chưa đủ tư cách tham dự hội nghị."`);
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  if (state.lastMeetingDay === state.day) {
    setStory("Hôm nay bạn đã tham dự hội nghị rồi.");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  state.lastMeetingDay = state.day;
  addCigarettes(2);
  setStory(`Bạn đã tham dự hội nghị lâu đài, các đại thần thảo luận về phân phối vật tư và bố trí phòng thủ. Sau hội nghị, thị tùng đưa cho bạn hai điếu thuốc lá làm phụ cấp tham dự.\n\nNhận được 2 điếu thuốc lá.`);
  advanceTime(GAME_CONSTANTS.CASTLE.MEETING_TIME_COST);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleGarden() {
  const state = getState();
  const rank = getCastleRank(state);
  const rankName = getCastleRankName(state) || "Bình dân";
  if (rank < GAME_CONSTANTS.CASTLE.GARDEN_RANK_REQUIRED) {
    setStory(`Vệ binh hậu hoa viên xem xét thẻtước vị của bạn, vẻ mặt nghiêm túc.\n"Vị ${rankName} đại nhân này, dừng bước, ngài hiện chưa được phép vào hậu hoa viên."`);
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  if (state.day - state.lastGardenDay < GAME_CONSTANTS.CASTLE.GARDEN_COOLDOWN_DAYS) {
    setStory("Gần đây bạn đã đi dạo hậu hoa viên rồi, vài ngày nữa hãy đến nhé.");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  state.lastGardenDay = state.day;
  if (Math.random() < GAME_CONSTANTS.CASTLE.GARDEN_MEDICINE_RATE) {
    const gardenMeds = MEDICINES.filter(m => m.rarity === "common" || m.rarity === "uncommon" || m.rarity === "rare");
    const rarityWeights = GAME_CONSTANTS.LOOT.RARITY_WEIGHTS;
    const received = [];
    for (let i = 0; i < GAME_CONSTANTS.CASTLE.GARDEN_MEDICINE_COUNT; i++) {
      const med = weightedRandom(gardenMeds, m => rarityWeights[m.rarity] || 1);
      if (med) {
        addItem({ ...med });
        received.push(med.name);
      }
    }
    setStory(`Khi bạn dạo bước trong hậu hoa viên thì gặp hoàng hậu. Cô ấy đang ngắm hoa, thấy bạn liền mỉm cười vẫy tay.\n\n"Gần đây vất vả rồi, những vật tư y tế này bạn cầm lấy, khi đi thám hiểm bên ngoài sẽ dùng được."\n\nNhận được ${received.join(", ")}.`);
  } else {
    const commonMelee = MELEE_WEAPONS.filter(w => w.type === "melee" && w.rarity === "common" && w.id !== "dam");
    if (commonMelee.length === 0) {
      setStory("Bạn dạo một vòng hậu hoa viên, chẳng tìm thấy gì.");
      advanceTime(1);
      updateStatusEffects();
      checkDeath();
      if (!state.gameOver) refreshCastleInterior();
      return;
    }
    const idx = Math.floor(Math.random() * commonMelee.length);
    const weapon = { ...commonMelee[idx], currentDurability: commonMelee[idx].durability };
    addItem(weapon);
    setStory(`Khi bạn dạo bước trong hậu hoa viên thì gặp nhà vua. Nhà vua đang luyện kiếm, thấy bạn liền gật đầu.\n\n"Đến đúng lúc, thanh ${weapon.name} này là bộ sưu tập của cô vương, tặng bạn đểphòng thân."\n\nNhận được ${weapon.name}(Vũ khí cận chiến phẩm chất thường).`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function handleCastleTitleReissue() {
  const state = getState();
  const highest = getHighestObtainedRank(state);
  if (highest < 2) {
    setStory("Nhân viên văn phòng lục tìm trong phòng lưu trữ nửa ngày, lắc đầu: \"Không có hồ sơ thẻ thân phận có thểbổ sung.\"");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  const rankEntry = CASTLE_RANKS.find(r => r.rank === highest);
  if (!rankEntry) {
    setStory("Xảy ra lỗi khibổ sung, vui lòng liên hệ quản trị viên.");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  const hasId = state.other.some(i => i.id === SPECIAL_ITEMS[rankEntry.itemId].id);
  if (hasId) {
    setStory(`Hiện tại bạn đã sở hữu thẻ thân phận ${rankEntry.name}, không cầnbổ sung.`);
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh", action: "castle_back" }]);
    return;
  }
  state.other.push({ ...SPECIAL_ITEMS[rankEntry.itemId] });
  setStory(`Nhân viên văn phòng cẩn thận đối chiếu hồ sơ, lấy từ tủ bảo hiểm ra một thẻ thân phận mới tinh.\n\n"Qua xác minh, ngàiquả thựctừng được phong tước ${rankEntry.name}. Đây là thẻ thân phậnbổ sung, xin hãy giữ kỹ. Lầnbổ sung này miễn phí."\n\nNhận được[Thẻ thân phận ${rankEntry.name}]!`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

const CASTLE_WORK_BY_RANK = {
  0: {
    timeCost: 8,
    crashGain: 40,
    story: "Bạn làm việc chân tay cả ngày trên công trường lâu đài——khiêng gạch, vác bao cát, dọn chuồng ngựa……mệt đến mức không thẳng nổi lưng.\n\nBạn làm việc cả ngày, lại đói lại khát! Công việc khổ nhất mệt nhất, nhưng bạn nhận được tiền lương——một điếu thuốc lá. ",
    storyFull: "Bạn làm việc chân tay cả ngày trên công trường lâu đài——khiêng gạch, vác bao cát, dọn chuồng ngựa……mệt đến mức không thẳng nổi lưng.\n\nBạn làm việc cả ngày, lại đói lại khát! Công việc khổ nhất mệt nhất, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  1: {
    timeCost: 7,
    crashGain: 30,
    story: "Bạn làm việc vất vả cả ngày trong lâu đài——vận chuyển vật tư, sắp xếp kho, hỗ trợ thợ thủ công……mệt không chịu nổi.\n\nCông việc lao động khiến bạn lại đói lại khát, điểm mệt mỏi tăng lên!Nhưng bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn làm việc vất vả cả ngày trong lâu đài——vận chuyển vật tư, sắp xếp kho, hỗ trợ thợ thủ công……mệt không chịu nổi.\n\nCông việc lao động khiến bạn lại đói lại khát, điểm mệt mỏi tăng lên!Nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  2: {
    timeCost: 6,
    crashGain: 20,
    story: "Bạn làm việc bình thường cả ngày trong lâu đài——quản lý đăng ký vật tư, hỗ trợ vệ binh tuần tra, kiểm tra tồn kho……mặc dù bận rộn nhưng còncòn ra thể thống.\n\nCông việc bình thường khiến bạn có chút mệt mỏi, nhưng bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn làm việc bình thường cả ngày trong lâu đài——quản lý đăng ký vật tư, hỗ trợ vệ binh tuần tra, kiểm tra tồn kho……mặc dù bận rộn nhưng còncòn ra thể thống.\n\nCông việc bình thường khiến bạn có chút mệt mỏi, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  3: {
    timeCost: 5,
    crashGain: 10,
    story: "Bạn làm việc nhẹ nhàng cả ngày trong lâu đài——giám sát thuộc hạ làm việc, xem xét báo cáo vật tư, thỉnh thoảng tuần tra một vòng……thân phận Bá tước khiến công việc nhẹ nhàng hơn nhiều.\n\nCông việc nhẹ nhàng, bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn làm việc nhẹ nhàng cả ngày trong lâu đài——giám sát thuộc hạ làm việc, xem xét báo cáo vật tư, thỉnh thoảng tuần tra một vòng……thân phận Bá tước khiến công việc nhẹ nhàng hơn nhiều.\n\nCông việc nhẹ nhàng, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  4: {
    timeCost: 4,
    crashGain: 0,
    story: "Bạn tuần tra một vòng trong lâu đài——kiểm tra phòng thủ các nơi, nghe báo cáo của vệ binh,thị sát kho vật tư……thân phận Hầu tước khiến bạn chỉ cần đi xem một chút.\n\nTuần tra xong, bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn tuần tra một vòng trong lâu đài——kiểm tra phòng thủ các nơi, nghe báo cáo của vệ binh,thị sát kho vật tư……thân phận Hầu tước khiến bạn chỉ cần đi xem một chút.\n\nTuần tra xong, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  5: {
    timeCost: 3,
    crashGain: 0,
    story: "Bạn đi qua sân trong lâu đài——ký vài chữ trên tài liệu, tham dự một hội nghị ngắn, và vài quan chứcchào hỏi vài câu……thân phận Công tước khiến mọi thứ dễ dàng như vậy.\n\nĐi qua sân xong, bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn đi qua sân trong lâu đài——ký vài chữ trên tài liệu, tham dự một hội nghị ngắn, và vài quan chứcchào hỏi vài câu……thân phận Công tước khiến mọi thứ dễ dàng như vậy.\n\nĐi qua sân xong, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
  6: {
    timeCost: 2,
    crashGain: 0,
    story: "Bạn ngồi trong lâu đài một lúc——nếm trà, lật báo cáo, tùy tiện phân phó vài việc……công việc của \"Trữ quân điện hạ\" chỉ có thế.\n\nNgồi một lúc, bạn nhận được tiền lương——một điếu thuốc lá.",
    storyFull: "Bạn ngồi trong lâu đài một lúc——nếm trà, lật báo cáo, tùy tiện phân phó vài việc……công việc của \"Trữ quân điện hạ\" chỉ có thế.\n\nNgồi một lúc, nhưng balo đã đầy, tiền lương thuốc lá không thể cho vào!",
  },
};

export function handleCastleWork() {
  const state = getState();
  cleanDualIdentity(state);
  if (hasAnyDawnIdentity(state)) {
    setStory("công đầu lâu đài liếc bạn một cái: \"Người của Dawn Base còn muốn đến lâu đài làm việc? Ngươi chẳng lẽ là gian tế? Cút!\" Hai vệ binhđẩy bạn ra ngoài.");
    setPhase("explore");
    setOptions([{ text: "Quay lại", action: "castle_work_back" }]);
    return;
  }
  if (state.lastCastleWorkDay === state.day) {
    setStory("Hôm nay bạn đã làm việc trong lâu đài rồi, mai hãy đến nhé.");
    setPhase("explore");
    setOptions([{ text: "Quay lại", action: "castle_work_back" }]);
    return;
  }
  const rank = getCastleRank(state);
  const workConfig = CASTLE_WORK_BY_RANK[rank] || CASTLE_WORK_BY_RANK[0];
  state.lastCastleWorkDay = state.day;
  setPhase("explore");
  state.crash = Math.min(100, (state.crash || 0) + workConfig.crashGain);
  addCigarettes(1);
  setStory(workConfig.story);
  advanceTime(workConfig.timeCost);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    refreshCastleOutpost();
  }
}
