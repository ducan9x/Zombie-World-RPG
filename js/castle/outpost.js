import { getState, setPhase, setStory, setOptions, removeCigarettes, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { CASTLE_GUARD_DIALOGUES, CASTLE_GUARD_HIGH_DIALOGUES, getDialogueByRank, MAPS } from '../config.js';
import { getCastleRank, getCastleRankName, hasCastleIdentity } from '../faction.js';
import { showExploreOptionsState } from '../routing.js';
import { enterCastleInterior } from './interior.js';

export function handleCastleOutpost() {
  const state = getState();
  if (state.castleDebt && state.day > state.castleDebt.dueDay) {
    const rank = getCastleRank(state);
    const overdueDays = state.day - state.castleDebt.dueDay;
    if (!state.castleDebtTriggered) {
      state.castleDebtTriggered = true;
      state.castleDebt.amount *= 2;
      if (rank >= 2) {
        setStory(`⚠️ Vì không kịp trả nợ, nợ của bạn đã tăng gấp đôi lên ${state.castleDebt.amount} điếu thuốc.\n\nTuy nhiên, nhờ thân phận tước vị, nhân viên đòi nợ của thành không dám động đến bạn. Bạn được thành bảo vệ, để giữ uy tín trong thành, xin hãy mau chóng trả nợ.\n\nNợ vẫn còn: ${state.castleDebt.amount} điếu thuốc (đã quá hạn ${overdueDays} ngày).`);
      } else {
        const foodCount = state.food.reduce((sum, i) => sum + (i.count || 1), 0);
        const drinkCount = state.drinks.reduce((sum, i) => sum + (i.count || 1), 0);
        const medCount = state.medicine.reduce((sum, i) => sum + (i.count || 1), 0);
        const totalConfiscated = foodCount + drinkCount + medCount;
        state.food = [];
        state.drinks = [];
        state.medicine = [];
        setStory(`⚠️ Vì không kịp trả nợ, nhân viên đòi nợ của Ngân hàng Thành bất ngờ xông ra cướp đi đồ ăn, đồ uống và thuốc của bạn (tổng ${totalConfiscated} món)! Họ đông người, bạn không thể chống lại.\n\nNợ tăng gấp đôi lên ${state.castleDebt.amount} điếu thuốc (đã quá hạn ${overdueDays} ngày).`);
      }
    } else {
      if (rank >= 2) {
        setStory(`⚠️ Nợ của bạn đã quá hạn ${overdueDays} ngày, hiện nợ ${state.castleDebt.amount} điếu thuốc. Nhờ thân phận tước vị, nhân viên đòi nợ không dám động đến bạn, nhưng xin hãy mau chóng trả nợ.`);
      } else {
        setStory(`⚠️ Nợ của bạn đã quá hạn ${overdueDays} ngày, hiện nợ ${state.castleDebt.amount} điếu thuốc. Nhân viên đòi nợ có thể bất cứ lúc nào đến cửa, xin hãy mau chóng trả nợ.`);
      }
    }
    setPhase("explore");
    refreshCastleOutpost();
    getState().currentMap = MAPS.find(m => m.id === "末日城堡");
    return;
  }
  setPhase("explore");
  setStory("Một tòa thành hùng vĩ và uy nghiêm sừng sững ở cuối tầm mắt, tháp đá góc cạnh sắc nhọn đâm thủng bầu trời xám xịt ngày tận thế, tường thành khổng lồ bằng đá nguyên khối xây nên, trên tường còn lưu lại họa tiết chạm khắc tinh xảo từ trước ngày tận thế cùng vết bỏng chiến tranh, im lặng kể lại sự huy hoàng và quyền lực tột đỉnh ngày xưa. Cổng thành cao lớn trang nghiêm, cổng sắt đóng chặt, hai bên đứng nghiêm hai lính gác toàn trang bị. Họ mặc giáp tăng cường, cầm vũ khí sắc lạnh, dáng đứng thẳng như thông, mắt sắc như chim ưng, toát ra áp lực không thể xâm phạm, đang cẩn thận quan sát, phân biệt từng người sống sót dám lại gần, không dám lơ là chút nào. Bên ngoài tường thành, trên công trường rộng, bụi bay mù mịt, một nhóm người sống sót rách rưới, mặt vàng da bủng đang bị thúc ép lao động, khiêng đá đầm đất, tu sửa công sự, trong nắng gắt và mệt mỏi tê liệt lao đầu làm việc, mồ hôi thấm ướt quần áo mỏng manh, từng chút mồ hôi công sức đều đang đắp nên bức tường của vương quốc tận thế. Không xa, bảng hiệu mạ vàng *Ngân hàng Thành Lucius* đặc biệt chói mắt giữa trời đất xám xịt, kiến trúc đá kiểu Âu nghiêm chỉnh toát ra cảm giác trật tự nghiêm khắc. Trước cửa và trong sảnh, vài quý tộc ăn mặc hoa lệ, vải vóc tinh xảo ung dung xoay xở, họ đeo trang sức biểu tượng thân phận, khẽ trò chuyện, tính toán tiền bạc, trên phế tích tận thế vẫn tiến hành vay mượn, giao dịch và đấu tranh quyền lực, hố sâu giàu nghèo và giai cấp, ở đây được thể hiện đến tận cùng.");
  refreshCastleOutpost();
  getState().currentMap = MAPS.find(m => m.id === "末日城堡");
}

export function refreshCastleOutpost() {
  const state = getState();
  setPhase("explore");
  setOptions([
    { text: "Khám phá", action: "castle_explore_blocked" },
    { text: "Ăn uống", action: "eat" },
    { text: "Uống nước", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Về nhà", action: "goHome" },
    { text: "Vứt bỏ", action: "discard" },
    { text: "Lính gác thành", action: "castle_guard" },
    { text: "Ngân hàng thành", action: "castle_bank" },
    { text: "Làm thân phận", action: "castle_identity" },
    { text: "Làm việc tại thành", action: "castle_work" },
  ]);
  getState().currentMap = MAPS.find(m => m.id === "末日城堡");
}

export function handleCastleExploreBlocked() {
  setStory("Lính gác thành giám sát khu vực này, bạn lén lút quá đáng ngờ, ở đây không thích hợp khám phá.");
  showExploreOptionsState();
}

export function handleGuardChat() {
  const state = getState();
  const rank = getCastleRank(state);
  const line = getDialogueByRank("guard", rank);
  setStory(`Lính gác quát bạn: ${line}`);
  setPhase("castle_guard");
  setOptions([
    { text: "Đối thoại", action: "guard_chat" },
    { text: "Vào thành", action: "guard_enter" },
    { text: "Đưa tiền tip (1 điếu thuốc)", action: "guard_bribe" },
    { text: "Rời đi", action: "guard_leave" },
  ]);
}

export function handleGuardEnter() {
  const state = getState();
  const hasPass = state.other.some(i => i.id === "castle_pass");
  if (hasPass) {
    setStory("Bạn lấy ra thẻ thông hành thành, lính gác xem xét kỹ lưỡng, lập tức cung kính nhường đường.\n\n\"Có thẻ thông hành, mời vào! Thành luôn chào đón ngài.\"");
    enterCastleInterior();
    return;
  }
  const hasId = hasCastleIdentity(state);
  const rank = getCastleRank(state);
  if (hasId) {
    if (rank >= 2) {
      const rankName = getCastleRankName(state);
      setStory(`Lính gác thấy thẻ thân phận ${rankName} của bạn, lập tức cung kính nhường một con đường.\n\n"${rankName} đại nhân, mời vào! Trong thành mọi thứ đã chuẩn bị sẵn cho ngài."`);
    } else {
      setStory("Bạn lấy ra thẻ thân phận quý tộc, lính gác không lạnh không nóng nhường một con đường.\n\nBạn vượt qua xác minh thân phận, đi đến bên trong Thành tận thế.");
    }
    enterCastleInterior();
  } else {
    setStory("Lính gác cười lạnh: \"Không có thẻ thân phận cũng muốn vào thành? Cút cút cút!\"");
    setPhase("castle_guard");
    setOptions([
      { text: "Đối thoại", action: "guard_chat" },
      { text: "Vào thành", action: "guard_enter" },
      { text: "Đưa tiền tip (1 điếu thuốc)", action: "guard_bribe" },
      { text: "Rời đi", action: "guard_leave" },
    ]);
  }
}

export function handleGuardBribe() {
  const state = getState();
  if (state.cigarettes < 1) {
    setStory("Bạn lục khắp túi, không có lấy một điếu thuốc. Lính gác không kiên nhẫn trừng bạn.");
    setPhase("castle_guard");
    setOptions([
      { text: "Đối thoại", action: "guard_chat" },
      { text: "Vào thành", action: "guard_enter" },
      { text: "Đưa tiền tip (1 điếu thuốc)", action: "guard_bribe" },
      { text: "Rời đi", action: "guard_leave" },
    ]);
    return;
  }
  removeCigarettes(1);
  setStory("Bạn lén nhét một điếu thuốc vào tay lính gác. Lính gác không đổi sắc mặt cất vào túi, nháy mắt với bạn: \"Vào đi, đừng gây chuyện!\"\n\nBạn qua hối lộ lính gác, lén lút đi vào bên trong thành.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) enterCastleInterior();
}

export function handleGuardLeave() {
  setStory("Bạn rời khỏi cổng thành.");
  showExploreOptionsState();
}

export function handleCastleGuard() {
  const state = getState();
  const rank = getCastleRank(state);
  let greeting;
  if (rank === 0) {
    greeting = "Một lính gác mặt dữ tợn trên dưới đánh giá bạn: \"Làm gì đấy?\"";
  } else if (rank === 1) {
    greeting = "Lính gác liếc nhìn thẻ thân phận quý tộc của bạn, giọng bình thản: \"Vào đi, đừng gây chuyện.\"";
  } else {
    greeting = `Lính gác thấy thẻ thân phận ${getCastleRankName(state)} của bạn, lập tức đứng thẳng: "Đại nhân, mời vào!"`;
  }
  setPhase("castle_guard");
  setStory(greeting);
  setOptions([
    { text: "Đối thoại", action: "guard_chat" },
    { text: "Vào thành", action: "guard_enter" },
    { text: "Đưa tiền tip (1 điếu thuốc)", action: "guard_bribe" },
    { text: "Rời đi", action: "guard_leave" },
  ]);
}

export function handleCastleGuardAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;
  if (action === "guard_chat") { handleGuardChat(); return; }
  if (action === "guard_enter") { handleGuardEnter(); return; }
  if (action === "guard_bribe") { handleGuardBribe(); return; }
  if (action === "guard_leave") { handleCastleOutpost(); return; }
}