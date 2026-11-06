import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addCigarettes,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getBackpackCount,
} from '../state.js';

import {
  WAREHOUSE_GUARD_DIALOGUES,
  BUILDING_MATERIALS,
  GAME_CONSTANTS,
  RANGED_WEAPONS,
  MAP_NPC_INTROS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { hasCastleIdentity } from '../faction.js';

const OLDMAN_QUESTS = [
  { id: 1, name: "Tìm hồ sơ", desc: "Thu thập 10 phần tư liệu tội phạm giao cho Lão Mã", type: "collect", require: 10, reward: 3, intro: "Lão Mã nheo mắt, ghé sát bạn thì thầm: \"Bạn từng động vào thứ đó rồi nhỉ? He he, tôi biết mà. Hàng cấm thời ngày tận thế, không phải ai cũng có gan động vào.…….\" Anh ấy xoay người lục từ đống tạp vật ra một chiếc hộp giấy kraft ngả vàng. \"Trong tủ hồ sơ của đồn cảnh sát bỏ hoang, có một lô tư liệu tội phạm bị. Giúp tôi thu thập 10 phần. Đó là những thứ còn lại từ 'nghề cũ' của tôi.\"" },
  { id: 2, name: "Diệt trừ bóng đen", desc: "Tiêu diệt bóng đen trong siêu thị kho", type: "kill_shadow", reward: 5, intro: "Lão Mã lật xem tư liệu bạn đưa, khóe miệng lộ ra nụ cười quái dị: \"Tốt, rất tốt……Bóng đen. Gã hoạt động trong của siêu thị, hắn chính là một trong những chủ mưu của vụ vận chuyển hàng cấm năm xưa. Toàn bộ chuỗi, bắt đầu từ hắn. Đi giải quyết hắn đi.\"" },
  { id: 3, name: "Diệt trừ Mã Tam", desc: "Đánh bại Mã Tam", type: "kill_masan", reward: 10, intro: "Lão Mã nghe tin bóng đen bị tiêu diệt, hài lòng gật đầu: \"Một sợi dây, đứt rồi. Nhưng vẫn còn một sợi khác——tên đầu bếp ở trạm dịch quốc lộ, Mã Tam. Bạn hẳn đã nghe về 'món ăn' của hắn rồi?. Hắn cũng là một mắt xích trong chuỗi năm xưa, phụ trách 'xử lý' những người không nghe lời. Đi, xóa hắn khỏi thế giới này.\"" },
  { id: 4, name: "Diệt trừ nhà vua", desc: "Ám sát nhà vua lâu đài", type: "kill_king", reward: 15, intro: "Lão Mã hút một hơi thuốc, nhả ra một vòng khói: \"Mã Tam chết rồi? Dứt khoát lắm. Mục tiêu tiếp theo, hơi có chút——vị trong lâu đài. Ông ta đã lợi dụng quyền thế bao che cho bao nhiêu thế lực, bạn biết không? Trên chiếc vương miện đó, dính không chỉ là vàng.\" Anh ấy dừng lại, ánh mắt sắc bén: \"Tuy nhiên, nếu bạn mang theo thân phận lâu đài, tôi không khuyên bạn nhận việc này. Tự cân nhắc.\"" },
  { id: 5, name: "Diệt trừ Lão Triệu", desc: "Diệt trừ Lão Triệu ở trạm kiểm soát", type: "kill_zhao", reward: 20, intro: "Lão Mã trầm mặc rất lâu mới mở miệng: \"Nhà vua……cũng chết rồi. Bạn ngày càng dứt khoát. Mục tiêu tiếp theo——lão binh ở trạm kiểm soát quân sự, Lão Triệu. Hắn đã quá nhiều dân thường muốn đi qua trạm kiểm soát. Đánh 'kiểm tra an toàn', làm giết người., .\"" },
  { id: 6, name: "Diệt trừ Tiến sĩ Chen", desc: "Diệt trừ Tiến sĩ Chen ở viện nghiên cứu sinh hóa", type: "kill_doctor", reward: 25, intro: "Lão Mã dập mạnh tàn thuốc: \"Lão Triệu xong rồi? Tốt. Còn lại mục tiêu cuối cùng——Tiến sĩ Chen ở viện nghiên cứu sinh hóa. Bạn biết tại sao ngày tận thế ba năm rồi vẫn chưa kết thúc không? Chính là vì những 'nhà khoa học' như hắn!Ngày nào cũng nghiên cứu virus, nghiên cứu tới nghiên cứu lui, zombie ngày càng nhiều!Đi, giải quyết hắn cho tôi!\"" },
  { id: 7, name: "Đường hầm tàu điện ngầm ngầm", desc: "Đến đường hầm tàu điện ngầm ngầm——đợi Lão Mã", type: "final", reward: 30, intro: "Lão Mã vỗ vai bạn cười híp mắt, nụ cười có chút không nói rõ được: \"Tất cả đều xong. Bóng đen, Mã Tam, nhà vua, Lão Triệu, Tiến sĩ Chen……một tên không sót. Bạn thực sự là con dao 'tốt' nhất tôi từng gặp. Đến đi, việc cuối cùng——đến đường hầm tàu điện ngầm ngầm. Tôi đích thân đưa bạn 30 điếu thuốc, cảm tạ bạn.\"" },
];

export function handleWarehouseGuardInteract() {
  const state = getState();
  if (state.oldMaContrabandUsed) {
    handleOldMaQuestInteract();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.warehouse_guard_intro);
  setOptions([
    { text: "Đối thoại", action: "warehouse_guard_chat" },
    { text: "Giao dịch", action: "warehouse_guard_trade" },
    { text: "Rời đi", action: "warehouse_guard_leave" },
  ]);
}

export function handleWarehouseGuardChat() {
  setPhase("explore");
  const line = WAREHOUSE_GUARD_DIALOGUES[Math.floor(Math.random() * WAREHOUSE_GUARD_DIALOGUES.length)];
  setStory(line);
  setOptions([
    { text: "Đối thoại", action: "warehouse_guard_chat" },
    { text: "Giao dịch", action: "warehouse_guard_trade" },
    { text: "Rời đi", action: "warehouse_guard_leave" },
  ]);
}

export function handleWarehouseGuardLeave() {
  setStory("Bạn rời khỏi thủ vệ kho, quay lại đường phố.");
  showExploreOptionsState();
}

export function handleWarehouseGuardTrade() {
  const state = getState();
  if (state.lastWarehouseTradeDay >= state.day) {
    setStory("Hôm nay đã giao dịch với Lão Mã rồi, mai hãy đến nhé.");
    handleWarehouseGuardInteract();
    return;
  }
  const buildingIds = BUILDING_MATERIALS.map(b => b.id);
  const buildingCount = state.other.filter(i => buildingIds.includes(i.id)).reduce((sum, i) => sum + (i.count || 1), 0);
  if (buildingCount < GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST) {
    setStory(`Lão Mã lắc đầu: "Vật liệu xây dựng không đủ, ít nhất cần ${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}, bạn chỉ có ${buildingCount}.Đi thu thập thêm rồi hãy đến!"`);
    handleWarehouseGuardInteract();
    return;
  }
  setStory(`Lão Mã xem xét vật liệu của bạn: "Không tệ không tệ, ${buildingCount}. ${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST} đổi một vũ khí tầm xa, làm không?"`);
  setPhase("explore");
  setOptions([
    { text: `Giao dịch ${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}`, action: "warehouse_guard_trade_confirm" },
    { text: "Suy nghĩ thêm", action: "warehouse_guard_chat" },
  ]);
}

export function handleWarehouseGuardTradeConfirm() {
  const state = getState();
  const buildingIds = BUILDING_MATERIALS.map(b => b.id);
  const buildingCount = state.other.filter(i => buildingIds.includes(i.id)).reduce((sum, i) => sum + (i.count || 1), 0);
  if (buildingCount < GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST) {
    setStory("Vật liệu không đủ rồi.");
    handleWarehouseGuardInteract();
    return;
  }
  if (getBackpackCount() - GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST + 1 > state.backpack.capacity) {
    setStory("Không gian balo không đủ, không thể hoàn thành giao dịch.");
    handleWarehouseGuardInteract();
    return;
  }
  let remaining = GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST;
  for (let i = state.other.length - 1; i >= 0 && remaining > 0; i--) {
    if (buildingIds.includes(state.other[i].id)) {
      const available = state.other[i].count || 1;
      if (available <= remaining) {
        state.other.splice(i, 1);
        remaining -= available;
      } else {
        state.other[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  const laomaWeapons = RANGED_WEAPONS.filter(w => w.rarity === "common");
  const weapon = laomaWeapons[Math.floor(Math.random() * laomaWeapons.length)];
  const added = addItem({ ...weapon });
  if (added) {
    setStory(`Lão Mã nhận lấy ${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}, kiểm tra kỹ một lượt, hài lòng gật đầu. Anh ấy lấy từ sâu trong kho ra một ${weapon.name} đưa cho bạn. "Xứng đáng!"`);
  } else {
    setStory(`Lão Mã nhận lấy ${GAME_CONSTANTS.MAP_EVENTS.WAREHOUSE_BUILDING_COST}, đưa cho bạn một ${weapon.name}, nhưng balo của bạn đã đầy, không thể mang.`);
  }
  state.lastWarehouseTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

// ========== Chuỗi nhiệm vụ Lão Mã ==========

export function handleOldMaQuestInteract() {
  const state = getState();
  setPhase("explore");

  if (state.oldMaStep === 0) {
    // Kích hoạt lần đầu
    state.oldMaStep = 1;
    const q = OLDMAN_QUESTS[0];
    setStory(q.intro + `\n\n[Nhiệm vụ]: ${q.name}\n[Chi tiết]: ${q.desc}\n[Phần thưởng]: ${q.reward} điếu thuốc lá`);
  } else if (state.oldMaStep >= 1 && state.oldMaStep <= 6) {
    const q = OLDMAN_QUESTS[state.oldMaStep - 1];
    const canSubmit = checkOldMaQuestCondition(state, q);
    let story = `Lão Mã ngồi xổm ở góc kho, thấy bạn đến thì nhe răng cười.`;
    story += `\n\n[Nhiệm vụ]: ${q.name}\n[Chi tiết]: ${q.desc}\n[Phần thưởng]: ${q.reward} điếu thuốc lá`;
    if (q.type === "collect") {
      story += `\n[Tiến độ]: ${state.crimeDataCount}/${q.require}`;
    }
    if (canSubmit) {
      story += `\n\n[Hoàn thành] Điều kiện nhiệm vụ đã thỏa mãn!`;
    }
    setStory(story);
  } else if (state.oldMaStep === 7) {
    setStory("Lão Mã cười híp mắt nhìn bạn: \"Còn chờ gì nữa? Đến đường hầm tàu điện ngầm đi, tôi đợi bạn ở đó.\"");
  }

  buildOldMaOptions();
}

function checkOldMaQuestCondition(state, quest) {
  switch (quest.type) {
    case "collect":
      return state.crimeDataCount >= quest.require;
    case "kill_shadow":
      return state.shadowDefeated === true;
    case "kill_masan":
      return state.outlawKilled === true;
    case "kill_king": {
      const hasId = hasCastleIdentity(state);
      return state.kingKilled === true && !hasId;
    }
    case "kill_zhao":
      return state.zhaoKilled === true;
    case "kill_doctor":
      return state.doctorKilled === true;
    case "final":
      return false;
    default:
      return false;
  }
}

function buildOldMaOptions() {
  const state = getState();
  const opts = [];

  if (state.oldMaStep >= 1 && state.oldMaStep <= 6) {
    const q = OLDMAN_QUESTS[state.oldMaStep - 1];
    const canSubmit = checkOldMaQuestCondition(state, q);

    // Nhiệm vụ 4 kiểm tra đặc biệt: nếu có thân phận lâu đài không thể nộp
    if (q.type === "kill_king") {
      const hasId = hasCastleIdentity(state);
      if (hasId && !state.kingKilled) {
        opts.push({ text: "Nộp nhiệm vụ(Bạn mang thân phận lâu đài, không thể nhận nhiệm vụ này)", action: "oldma_submit", disabled: true });
      } else if (canSubmit) {
        opts.push({ text: `Nộp nhiệm vụ(Nhận ${q.reward} điếu thuốc lá)`, action: "oldma_submit" });
      } else {
        opts.push({ text: "Nộp nhiệm vụ(Điều kiện chưa thỏa mãn)", action: "oldma_submit", disabled: true });
      }
    } else if (canSubmit) {
      opts.push({ text: `Nộp nhiệm vụ(Nhận ${q.reward} điếu thuốc lá)`, action: "oldma_submit" });
    } else {
      opts.push({ text: "Nộp nhiệm vụ(Điều kiện chưa thỏa mãn)", action: "oldma_submit", disabled: true });
    }
  }

  opts.push({ text: "Đối thoại", action: "oldma_chat" });
  opts.push({ text: "Giao dịch", action: "warehouse_guard_trade" });
  opts.push({ text: "Rời đi", action: "warehouse_guard_leave" });
  setOptions(opts);
}

export function handleOldMaQuestSubmit() {
  const state = getState();
  if (state.oldMaStep < 1 || state.oldMaStep > 6) {
    handleOldMaQuestInteract();
    return;
  }

  const q = OLDMAN_QUESTS[state.oldMaStep - 1];
  const canSubmit = checkOldMaQuestCondition(state, q);

  if (!canSubmit) {
    setStory("Lão Mã lắc đầu: \"Điều kiện chưa thỏa mãn, đừng vội. Đợi bạn làm xong rồi hãy đến tìm tôi.\"");
    handleOldMaQuestInteract();
    return;
  }

  // Nhiệm vụ 4 kiểm tra đặc biệt
  if (q.type === "kill_king") {
    const hasId = hasCastleIdentity(state);
    if (hasId && !state.kingKilled) {
      setStory("Lão Mã lạnh lùng nhìn bạn: \"Bạn vẫn còn mang thân phận lâu đài? Tôi thấy bạn chưa nghĩ rõ. Đợi bạn và lâu đài cắt đứt hoàn toàn rồi hãy đến tìm tôi.\"");
      handleOldMaQuestInteract();
      return;
    }
  }

  // Tiêu hao vật phẩm(Nhiệm vụ 1: tư liệu tội phạm)
  if (q.type === "collect") {
    let remaining = q.require;
    for (let i = state.other.length - 1; i >= 0 && remaining > 0; i--) {
      if (state.other[i].id === "crime_data") {
        const available = state.other[i].count || 1;
        if (available <= remaining) {
          state.other.splice(i, 1);
          remaining -= available;
          state.crimeDataCount -= available;
        } else {
          state.other[i].count = available - remaining;
          state.crimeDataCount -= remaining;
          remaining = 0;
        }
      }
    }
  }

  // Phát thưởng
  addCigarettes(q.reward);
  state.oldMaStep++;

  if (state.oldMaStep <= 6) {
    // Nhiệm vụ tiếp theo
    const nextQ = OLDMAN_QUESTS[state.oldMaStep - 1];
    setStory(`Lão Mã nhận lấy đồ, trên mặt lộ vẻ hài lòng: \"Làm tốt lắm!Đây là ${q.reward} điếu thuốc lá của bạn.\"\n\nAnh ấy thu lại nụ cười, ghé sát bạn nói: ${nextQ.intro}\n\n[Nhiệm vụ mới]: ${nextQ.name}\n[Chi tiết]: ${nextQ.desc}\n[Phần thưởng]: ${nextQ.reward} điếu thuốc lá`);
  } else if (state.oldMaStep === 7) {
    const finalQ = OLDMAN_QUESTS[6];
    setStory(`Lão Mã nhận lấy đồ, cười lớn: \"${q.reward} điếu thuốc, cầm lấy!\"\n\n${finalQ.intro}\n\n[Nhiệm vụ cuối cùng]: ${finalQ.name}\n[Chi tiết]: ${finalQ.desc}`);
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleOldMaQuestInteract();
  }
}

export function handleOldMaChat() {
  const state = getState();
  setPhase("explore");
  const dialogues = [
    "Lão Mã nhả một hơi thuốc: \"Ngày tận thế này, mỗi người đều có sổ sách của mình. Tôi chỉ giúp họ……kết sổ.\"",
    "Lão Mã suy tư nhìn về phương xa: \"Bạn biết không, trước ngày tận thế tôi là kế toán. Bây giờ? Bây giờ tôi đang tính toán sổ sách lớn hơn.\"",
    "Lão Mã gảy tàn thuốc: \"Đừng hỏi nhiều. Có vài việc, biết càng ít càng tốt.\"",
    "Lão Mã ngáp một cái: \"Làm việc của bạn đi, ít dò hỏi.\"",
    "Lão Mã lấy từ trong ngực ra một tấm ảnh cũ ngả vàng, nhìn một lát rồi cất đi. Anh ấy không nói gì.",
  ];
  const line = dialogues[Math.floor(Math.random() * dialogues.length)];
  setStory(line);
  buildOldMaOptions();
}
