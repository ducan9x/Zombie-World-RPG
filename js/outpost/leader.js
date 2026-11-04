import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  removeCigarettes,
  removeGasoline,
  removePureEnergy,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getItemDisplayName,
  removeItemById,
  isQuestDone,
  markQuestDone,
  addNpcAffinity,
} from '../state.js';

import {
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  AMMO,
  SPECIAL_ITEMS,
  FIXED_LOOT_DROPS,
  LEADER_DIALOGUES,
  GAME_CONSTANTS,
  AFFINITY_MAX,
} from '../config.js';

import {
  hasNobleId,
  hasDawnBadge,
  cleanDualIdentity,
  hasCastleIdentity,
  hasDawnCaptainBadge,
} from '../faction.js';

import { showOutpostOptions } from './menu.js';

export function handleNpcLeader() {
  const state = getState();
  if (!state.leaderAlive) {
    setStory("Thủ lĩnh căn cứ không còn nữa... vị trí của anh ấy trống rỗng, mọi người trong căn cứ đang bàn tán xôn xao.");
    setPhase("npc_leader");
    setOptions([{ text: "Quay lại", action: "leader_leave" }]);
    return;
  }
  cleanDualIdentity(state);
  if (hasCastleIdentity(state)) {
    setStory("Thủ lĩnh căn cứ cảnh giác nhìn bạn: \"Hóa ra bạn là người của thế lực lâu đài, cút ngay!\" Vài vệ binh vây lại, bạn đành lủi thủi rời đi.");
    setPhase("npc_leader");
    setOptions([{ text: "Quay lại", action: "leader_leave" }]);
    return;
  }
  const hasBadge = hasDawnBadge(state);
  const affinity = state.npcAffinity.leader || 0;
  setStory(`[Thủ lĩnh căn cứ]\n\nThủ lĩnh căn cứ là một người đàn ông trung niên đầy gió sương, ánh mắt kiên nghị. Anh ấy đánh giá bạn, khẽ gật đầu.\n\nĐiểm thân mật: ${affinity}/${AFFINITY_MAX.leader}${hasBadge ? "\n\nBạn đã gia nhập Dawn Base, đang đeo huy chương Dawn." : ""}`);
  showLeaderOptions();
}

export function showLeaderOptions() {
  const state = getState();
  setPhase("npc_leader");
  const hasBadge = hasDawnBadge(state);
  const opts = [
    { text: "Đối thoại", action: "leader_chat" },
    { text: "Tặng quà", action: "leader_gift" },
    { text: hasBadge ? "Rời căn cứ" : "Gia nhập căn cứ", action: hasBadge ? "leader_quit" : "leader_join" },
    { text: "Nhận quà", action: "leader_claim" },
    { text: "Nhận vinh dự", action: "leader_honor" },
  ];
  const hasRecorder = state.other.some(i => i.id === "strange_recorder");
  const leaderQuestInProgress = state.npcQuestsDone && (state.npcQuestsDone.leaderQuest1 || state.npcQuestsDone.leaderQuest2);
  if (!isQuestDone("leaderQuest3") && (hasRecorder || leaderQuestInProgress)) {
    opts.push({ text: "Về máy ghi âm", action: "leader_recorder" });
  }
  opts.push({ text: "Ám sát lén lút", action: "leader_assassinate" });
  opts.push({ text: "Rời đi", action: "leader_leave" });
  setOptions(opts);
}

export function handleLeaderChat() {
  const state = getState();
  if (state.lastLeaderChatDay === state.day) {
    setStory("Thủ lĩnh xua tay: \"Hôm nay đã nói đủ rồi, tôi rất bận, bạn đi đi.\"");
    showLeaderOptions();
    return;
  }
  state.lastLeaderChatDay = state.day;
  addNpcAffinity("leader", GAME_CONSTANTS.OUTPOST.LEADER_CHAT_AFFINITY);
  const chatLines = LEADER_DIALOGUES;
  const line = chatLines[Math.floor(Math.random() * chatLines.length)];
  setStory(`Thủ lĩnh tranh thủ lúc bận rộn trò chuyện với bạn vài câu: ${line}\n\nĐiểm thân mật +1(Hiện tại ${state.npcAffinity.leader})`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderRecorder() {
  const state = getState();
  const hasRecorder = state.other.some(i => i.id === "strange_recorder");

  if (!hasRecorder && !isQuestDone("leaderQuest1")) {
    showLeaderOptions();
    return;
  }

  if (isQuestDone("leaderQuest3")) {
    setStory("Thủ lĩnh vỗ vai bạn: \"Chuyện quá khứ cứ để nó qua đi.\"");
    showLeaderOptions();
    return;
  }

  if (!isQuestDone("leaderQuest1")) {
    const recorderIdx = state.other.findIndex(i => i.id === "strange_recorder");
    if (recorderIdx !== -1) {
      state.other.splice(recorderIdx, 1);
    }
    markQuestDone("leaderQuest1");
    const letter = SPECIAL_ITEMS.letter_to_sister;
    addItem({ ...letter });
    addNpcAffinity("leader", 10);
    setStory(`Bạn đưa máy ghi âm cho thủ lĩnh. Anh ấy nhấn nút phát, sắc mặt dần dần trầm xuống.

Sau khi bản ghi âm kết thúc, trong lều im phăng phắc.

Nắm đấm thủ lĩnh siết chặt kêu răng rắc, giọng khàn khàn:
"Con súc vật đó... hắn đã giết người tôi phái đi. Cô gái đó, cô ấy chỉ là một tình báo viên, cô ấy không làm gì sai cả..."

Anh ấy nhắm mắt, hít sâu một hơi:
"Ba năm trước, hắn nhìn trúng em gái tôi. Tôi thừa nhận, tôi phản đối họ ở bên nhau, vì tôi không tin hắn. Sau đó hắn quả nhiên lộ nguyên hình — hắn muốn kiểm soát tài nguyên của căn cứ, bị tôi từ chối thì ôm hận trong lòng."

"Tôi đã đuổi hắn đi, cũng làm tổn thương em gái. Cô ấy đi rồi, đến lâu đài, trở thành hoàng hậu hiện tại."

Thủ lĩnh lấy từ ngăn kéo ra một phong bì đã ngả vàng:
"Tờ thư này tôi viết ba năm rồi, vẫn chưa đủ can đảm gửi đi. Bạn... có thể giúp tôi đưa cho cô ấy không?"

📖 Nhận được[Thư gửi em gái]

Thủ lĩnh điểm thân mật +10(Hiện tại ${state.npcAffinity.leader}/${AFFINITY_MAX.leader})

(Gợi ý: Giao thư cho hoàng hậu của lâu đài)`);
    showLeaderOptions();
    return;
  }

  if (isQuestDone("leaderQuest1") && !isQuestDone("leaderQuest2")) {
    const hasReply = state.other.some(i => i.id === "queen_reply");
    if (!hasReply) {
      setStory("Thủ lĩnh nhìn bạn: \"Thư đã đưa đến chưa?thưhồi âm của cô ấy... tôi cần biết suy nghĩ của cô ấy.\"");
      showLeaderOptions();
      return;
    }
    handleLeaderQuest2();
    return;
  }

  if (isQuestDone("leaderQuest2") && !isQuestDone("leaderQuest3")) {
    handleLeaderQuest3();
    return;
  }

  showLeaderOptions();
}

export function handleLeaderQuest2() {
  const state = getState();
  const hasReply = state.other.some(i => i.id === "queen_reply");
  const baijiuCount = state.drinks.filter(i => i.id === "ruou_cao_do").reduce((sum, i) => sum + (i.count || 1), 0);
  const needBaijiu = 5;

  if (!hasReply || baijiuCount < needBaijiu) {
    let msg = "Thủ lĩnh thở dài: \"Tôi muốn uống chút rượu, bạn giúp tôi kiếm chút rượu trắng mạnh. 5 chai là đủ. Còn nữa...thưhồi âm của em gái tôi, bạn mang theo chưa?\"\n\nVật phẩm cần:";
    if (!hasReply) msg += "\n thưhồi âm của hoàng hậu ✗";
    else msg += "\n thưhồi âm của hoàng hậu ✓";
    if (baijiuCount < needBaijiu) msg += `\n  Rượu trắng mạnh ${baijiuCount}/${needBaijiu}`;
    else msg += `\n  Rượu trắng mạnh ${baijiuCount}/${needBaijiu} ✓`;
    setStory(msg);
    showLeaderOptions();
    return;
  }

  const replyIdx = state.other.findIndex(i => i.id === "queen_reply");
  if (replyIdx !== -1) state.other.splice(replyIdx, 1);
  removeItemById("drinks", "ruou_cao_do", needBaijiu);
  markQuestDone("leaderQuest2");
  addNpcAffinity("leader", 20);
  advanceTime(3);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn đặtthưhồi âm của hoàng hậu và 5 chai rượu trắng mạnh trước mặt thủ lĩnh.

Anh ấy trước rót đầy một ly, uống cạn. Sau đó cẩn thận mởthưhồi âm, đọc từng chữ một.

"Cô ấy nói... cô ấy không trách tôi." Giọng thủ lĩnh có chút run rẩy, "Cô ấy nói cô ấy hiểu tại sao tôi đuổi người đó đi, nhưng cô ấy đã quen với cuộc sống ở lâu đài, không muốn quay lại."

Anh ấy lại rót một ly rượu:
"Ba năm trước, tôi viết một bức thư cho cô ấy. Tôi nói, anh đã sai, không nên đuổi người trong lòng cô đi. Tôi nói, quay về đi, căn cứ mãi mãi là nhà của cô."

"Nhưng cô ấy không quay về."

Thủ lĩnh gấp thư lại, cho vào túi áo ngực. Anh ấy nâng ly rượu:
"Đến, uống cùng tôi. Đêm nay không bàn về căn cứ, không bàn về ngày tận thế, chỉ hai người bạn cũ, uống đến sáng."

Các bạn uống cả đêm. Anh ấy kể rất nhiều chuyện trước đây — cách xây dựng căn cứ, cách sống sót trong đợt zombie, cách nhìn người bên cạnh lần lượt rời đi. Nói đến cuối, anh ấy tựa vào ghế, mắt say lờ đờniệm thưhồi âm của hoàng hậu câu cuối cùng:

"Anh, em không hận anh. Nhưng có những vết thương, thời gian cũng không chữa lành được."

Thủ lĩnh điểm thân mật +20(Hiện tại ${state.npcAffinity.leader}/${AFFINITY_MAX.leader})

Thời gian tiến 3 lượt.`);
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderQuest3() {
  const state = getState();
  const serumCount = state.medicine.filter(i => i.id === "tiem_van_nang").reduce((sum, i) => sum + (i.count || 1), 0);
  const needSerum = 3;

  if (serumCount < needSerum) {
    setStory(`Thủ lĩnh toàn thân mọc đầy phát ban đỏ, mặt xanh mét, rõ ràng là ngộ độc rượu. Anh ấy cố gắng chống đỡ nói:\n"Không sao... chỉ là uống nhiều thôi..."\n\nNhưng tình trạng của anh ấy rõ ràng rất nghiêm trọng, cần thuốc vạn năng để giải độc.\n\nVật phẩm cần:\n  Thuốc vạn năng ${serumCount}/${needSerum}`);
    showLeaderOptions();
    return;
  }

  removeItemById("medicine", "tiem_van_nang", needSerum);
  markQuestDone("leaderQuest3");
  addNpcAffinity("leader", 30);
  addItem({ id: "9×19mm", name: "9×19mm", type: "ammo", count: 100 });
  const token = SPECIAL_ITEMS.love_token;
  addItem({ ...token });
  advanceTime(2);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn tiêm ba ống thuốc vạn năng vào cơ thể thủ lĩnh. Hơi thở anh ấy dần dần ổn định, phát ban trên người cũng bắt đầu tiêu đi.

Một lúc sau, thủ lĩnh chậm rãi mở mắt, thấy bạn đang ở bên cạnh, lộ ra một nụ cười khổ:
"Để bạn chê cười rồi. Thủ lĩnh căn cứ đường đường, suýt bị rượu đưa đi."

Anh ấy mò từ dưới gối ra một chiếc hộp nhỏ, đưa cho bạn:
"Đừng hiểu lầm, đây không phải vật đính ước cho bạn." Anh ấy ho hai tiếng, "Đây là món quà trước đây người đó — nhà vua, tặng cho em gái tôi. Anh ấy để lại căn cứ, vẫn chưa thu hồi."

Anh ấy dừng lại:
"Giờ nó có ích cho bạn hơn. Cầm đi, coi như cảm ơn bạn. Không chỉ cứu mạng tôi, còn... giúp tôi hoàn thành việc ba năm chưa làm được."

Bạn mở hộp, bên trong là một chiếc mặt dây chuyền tinh xảo, trên đó khắc một bông hoa hướng dương nhỏ.

🏹 Nhận được[9×19mm]×100!
📿 Nhận được[Vật đính ước]!

Thủ lĩnh điểm thân mật +30(Hiện tại ${state.npcAffinity.leader}/${AFFINITY_MAX.leader})

Thời gian tiến 2 lượt.`);
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderHonor() {
  const state = getState();
  if (hasCastleIdentity(state)) {
    setStory("Thủ lĩnh nhíu mày, ánh mắt sắc bén: \"Bạn mang thẻ thân phận thế lực lâu đài. Dawn Base của chúng tôi không hoan nghênh người của lâu đài. Trước khi bạn và lâu đài cắt đứt hoàn toàn, đừng đến tìm tôi nữa.\"\n\nAnh ấy quay lưng đi, không nhìn bạn nữa.");
    showLeaderOptions();
    return;
  }
  const vAffinity = state.npcAffinity.v || 0;
  const xiaohanAffinity = state.npcAffinity.xiaohan || 0;
  const liliAffinity = state.npcAffinity.lili || 0;
  const allMaxed = vAffinity >= AFFINITY_MAX.v && xiaohanAffinity >= AFFINITY_MAX.xiaohan && liliAffinity >= AFFINITY_MAX.lili && (state.npcAffinity.leader || 0) >= AFFINITY_MAX.leader;

  if (!allMaxed) {
    const missing = [];
    if (vAffinity < AFFINITY_MAX.v) missing.push(`Cô V(${vAffinity}/${AFFINITY_MAX.v})`);
    if (xiaohanAffinity < AFFINITY_MAX.xiaohan) missing.push(`Tô Tiểu Hàm(${xiaohanAffinity}/${AFFINITY_MAX.xiaohan})`);
    if (liliAffinity < AFFINITY_MAX.lili) missing.push(`Lilith(${liliAffinity}/${AFFINITY_MAX.lili})`);
    if ((state.npcAffinity.leader || 0) < AFFINITY_MAX.leader) missing.push(`Bản thân thủ lĩnh(${state.npcAffinity.leader || 0}/${AFFINITY_MAX.leader})`);

    setStory(`Thủ lĩnh lắc đầu, giọng mang theo sự tiếc nuối: \"Người của căn cứ vẫn chưa đủ tin tưởng bạn. Bạn xem, ${missing.join(", ")}——niềm tin của họ dành cho bạn vẫn chưa đủ. Vị trí Thuyền trưởng tiên phong Dawn, cần được mọi người trong căn cứ công nhận mới được. Hãy đi nói chuyện với họ đi, giúp đỡ từng người, để họ chân thành tiếp nhận bạn. Đợi đến khi tất cả đều tin tưởng bạn, hãy đến tìm tôi.\"`);
    showLeaderOptions();
    return;
  }

  if (hasDawnCaptainBadge(state)) {
    setStory("Thủ lĩnh vỗ vai bạn: \"Bạn đã là Thuyền trưởng tiên phong Dawn rồi, không cần trao thêm nữa.\"");
    showLeaderOptions();
    return;
  }

  state.other.push({ ...SPECIAL_ITEMS.dawn_captain_badge });

  const vectorWeapon = RANGED_WEAPONS.find(w => w.id === GAME_CONSTANTS.OUTPOST.HONOR_WEAPON_ID);
  const vectorAmmo = AMMO.find(a => a.id === GAME_CONSTANTS.OUTPOST.HONOR_AMMO_ID);
  if (vectorWeapon) addItem({ ...vectorWeapon });
  if (vectorAmmo) addItem({ id: vectorAmmo.id, name: vectorAmmo.name, type: "ammo", count: GAME_CONSTANTS.OUTPOST.HONOR_AMMO_COUNT });

  setStory(`Thủ lĩnh nhìn bạn, trong mắt lóe lên ánh sáng vui mừng. Anh ấy đứng dậy, trang trọng đi đến trước mặt bạn.

"${state.name}, từ khi bạn đến Dawn Base, mỗi người ở đây đều bị bạn cảm động. Trái tim lạnh giá của Cô V được bạn sưởi ấm, nụ cười của Tô Tiểu Hàm vì bạn mà càng rạng rỡ, tính cách tinh nghịch của Lilith cũng nghe lời bạn... ngay cả tôi, một ông già, cũng nhìn thấy hy vọng của ngày tận thế trên người bạn."

Anh ấy dừng lại, lấy từ trong ngực ra một huy chương phát ánh bạc, lại từ chiếc hộp phía sau lấy ra một khẩu súng trường mới tinh và vài hộp đạn.

"Đây là huy chương Thuyền trưởng Dawn, đại diện cho vinh dự cao nhất của Dawn Base. Từ hôm nay, bạn chính là Thuyền trưởng tiên phong Dawn — nhân vật dẫn dắt căn cứ! Khẩu Vector này là một trong những trang bị tốt nhất của căn cứ, cùng 60 viên đạn 9mm, đủ để bạn đối phó với bất kỳ nguy hiểm nào."

"Nhưng bạn phải nhớ, một khi nhận vinh dự này, bạn sẽ không bao giờ có thể có bất kỳ liên hệ nào với lâu đài ngày tận thế nữa. Họ sẽ không chấp nhận một Thuyền trưởng Dawn, giống như chúng tôi sẽ không chấp nhận một quý tộc lâu đài."

Anh ấy trang trọng gắn huy chương lên ngực bạn, nhét vũ khí vào tay bạn.

"Đi đi, dẫn dắt chúng tôi tiến về bình minh thực sự."

Nhận được[Huy chương Thuyền trưởng Dawn]!
Nhận được[Vector]+[9×19mm×60]!

(Gợi ý: Sau khi sở hữu huy chương Thuyền trưởng Dawn, sản lượng làm công và ăn xin tăng gấp đôi, tất cả dịch vụ của Lilith giảm nửa giá vĩnh viễn, nhưng không thể có bất kỳ thân phận lâu đài nào.)`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderGift() {
  const state = getState();
  if (state.lastLeaderGiftDay === state.day) {
    setStory("Thủ lĩnh xua tay: \"Hôm nay đã nhận đồ của bạn rồi, tôi rất bận.\"");
    showLeaderOptions();
    return;
  }
  let items = [];
  state.food.forEach((item, i) => items.push({ ...item, cat: "food", idx: i, label: `[Thức ăn] ${getItemDisplayName(item)}` }));
  state.drinks.forEach((item, i) => items.push({ ...item, cat: "drinks", idx: i, label: `[Đồ uống] ${getItemDisplayName(item)}` }));
  state.medicine.forEach((item, i) => items.push({ ...item, cat: "medicine", idx: i, label: `[Y tế] ${getItemDisplayName(item)}` }));
  state.other.forEach((item, i) => items.push({ ...item, cat: "other", idx: i, label: `[Khác] ${getItemDisplayName(item)}` }));
  if (state.cigarettes > 0) items.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá", label: `[Hàng hóa] (${state.cigarettes})Thuốc lá` });
  if (state.gasoline > 0) items.push({ cat: "gasoline", idx: 0, name: "Xăng", label: `[Hàng hóa] (${state.gasoline})Xăng` });
  if (state.pureEnergy > 0) items.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết", label: `[Hàng hóa] (${state.pureEnergy})Năng lượng tinh khiết` });
  if (items.length === 0) {
    setStory("Bạn lục tung balo, không có thứ gì đem ra được.");
    showLeaderOptions();
    return;
  }
  setPhase("leader_gift_select");
  setStory("Vui lòng chọn vật phẩm muốn tặng cho thủ lĩnh:");
  const opts = items.map((item, i) => ({ text: item.label, action: "leader_do_gift", index: i, giftItem: item }));
  opts.push({ text: "Quay lại", action: "back_to_leader", index: -1 });
  setOptions(opts);
}

export function handleLeaderJoin() {
  const state = getState();
  if (hasDawnBadge(state)) {
    setStory("Bạn đã gia nhập Dawn Base rồi.");
    showLeaderOptions();
    return;
  }
  state.other.push({ ...SPECIAL_ITEMS.dawn_badge });
  cleanDualIdentity(state);
  if (!state.unlockedAchievements) state.unlockedAchievements = [];
  if (!state.unlockedAchievements.includes("dawn_member")) state.unlockedAchievements.push("dawn_member");
  setStory("Thủ lĩnh trang trọng gắn một huy chương Dawn lên ngực bạn: \"Chào mừng gia nhập Dawn Base. Từ nay về sau, chúng ta là một gia đình.\"\n\nNhận được[Huy chương Dawn]!\n\n(Lưu ý: Sau khi gia nhập Dawn Base, bạn sẽ không thể vay tiền ở ngân hàng lâu đài, làm công ở lâu đài, hoặc xử lý thân phận quý tộc.)");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderQuit() {
  const state = getState();
  const idx = state.other.findIndex(i => i.id === SPECIAL_ITEMS.dawn_badge.id);
  if (idx !== -1) {
    state.other.splice(idx, 1);
  }
  const captainIdx = state.other.findIndex(i => i.id === SPECIAL_ITEMS.dawn_captain_badge.id);
  if (captainIdx !== -1) {
    state.other.splice(captainIdx, 1);
  }
  setStory("Bạn trả lại huy chương Dawn. Thủ lĩnh thở dài: \"Mỗi người một chí hướng, đi đi.\"\n\nBạn đã rời khỏi Dawn Base.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderClaim() {
  const state = getState();
  if (state.leaderGiftClaimed) {
    setStory("Thủ lĩnh lắc đầu: \"Quà bạn đã nhận rồi, đừng tham lam.\"");
    showLeaderOptions();
    return;
  }
  if ((state.npcAffinity.leader || 0) < AFFINITY_MAX.leader) {
    setStory(`Thủ lĩnh cười: \"Điểm thân mật của bạn chưa đủ(${state.npcAffinity.leader}/${AFFINITY_MAX.leader}), hãy giúp tôi làm thêm việc đi.\"`);
    showLeaderOptions();
    return;
  }
  state.leaderGiftClaimed = true;
  const gift = FIXED_LOOT_DROPS.leader_gift;
  const giftWeapon = gift.type === "ranged"
    ? RANGED_WEAPONS.find(w => w.id === gift.weaponId)
    : MELEE_WEAPONS.find(w => w.id === gift.weaponId);
  if (!giftWeapon) return;
  const giftItem = gift.type === "melee"
    ? { ...giftWeapon, currentDurability: giftWeapon.durability }
    : { ...giftWeapon };
  const added = addItem(giftItem);
  if (added) {
    const stats = gift.type === "melee"
      ? `${giftWeapon.damage} sát thương/${giftWeapon.durability} độ bền/${Math.round(giftWeapon.comboRate * 100)}% tỷ lệ liên kích`
      : `${giftWeapon.damage} sát thương/${giftWeapon.ammoType}`;
    setStory(`Thủ lĩnh lấy từ chiếc hộp phía sau một món vũ khí: \"Đây là ${giftWeapon.name} mà tôi dùng hồi còn trong quân ngũ, theo tôi nhiều năm rồi. Giờ nó là của bạn.\"\n\nNhận được[${giftWeapon.name}](${stats})!`);
  } else {
    setStory(`Thủ lĩnh muốn tặng bạn một ${giftWeapon.name}, nhưng balo của bạn đã đầy. Hãydọn một ít chỗ đi.`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}

export function handleLeaderDoGift(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (!option.giftItem) { showLeaderOptions(); return; }
  const item = option.giftItem;
  if (item.cat === "cigarettes") {
    removeCigarettes(1);
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
  } else if (item.cat === "pureEnergy") {
    removePureEnergy(1);
  } else {
    const catMap = { food: state.food, drinks: state.drinks, medicine: state.medicine, other: state.other };
    const targetItem = catMap[item.cat][item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      catMap[item.cat].splice(item.idx, 1);
    }
  }
  state.lastLeaderGiftDay = state.day;
  addNpcAffinity("leader", GAME_CONSTANTS.OUTPOST.LEADER_GIFT_AFFINITY);
  setStory(`Bạn tặng một ${getItemDisplayName(item)}. Thủ lĩnh nhận xong gật đầu: \"Ừm, tôi nhận tấm lòng.\"\n\nĐiểm thân mật +1(Hiện tại ${state.npcAffinity.leader})`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showLeaderOptions();
}
