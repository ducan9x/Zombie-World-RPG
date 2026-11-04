import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  addNpcAffinity,
  getNpcAffinity,
  getAffinityLabel,
  canChatToday,
  incrementChatCount,
  getAffinityStage,
  isQuestDone,
  markQuestDone,
  removeCigarettes,
  removeGasoline,
  removeItemById,
  getItemDisplayName,
} from '../state.js';

import {
  SEEDS,
  CROPS,
  RANGED_WEAPONS,
  SURVIVOR_NPC,
  GAME_CONSTANTS,
  AFFINITY_MAX,
  SPECIAL_ITEMS,
} from '../config.js';

import { returnToMenu } from '../routing.js';

import { checkGoHomeEnding } from '../game/endings.js';

export function showMumiaoOptions() {
  const state = getState();
  const affinity = getNpcAffinity("mumiao");
  const friendshipLabel = getAffinityLabel(affinity);
  const config = SURVIVOR_NPC.find(n => n.id === "mumiao");
  const stage = getAffinityStage(affinity);
  const lines = config.dialogues[stage] || config.dialogues["stranger"];
  const greeting = lines[Math.floor(Math.random() * lines.length)];

  let desc = config.desc;
  desc += `\n\nHiện tạiđiểm thân mật: ${affinity}/${AFFINITY_MAX.mumiao}（${friendshipLabel}）`;
  desc += `\n\n${greeting}`;

  setPhase("npc_mumiao");
  setStory(desc);

  const opts = [
    { text: "Mua hạt giống (1 điếu thuốc lá → 3 hạt giống ngẫu nhiên)", action: "mumiao_buy_seeds" },
    { text: "Chăm sóc đất thử nghiệm", action: "mumiao_tend_field" },
  ];

  if (affinity >= 150 && !isQuestDone("mumiaoSecret")) {
    opts.push({ text: "Cô ấy có một bí mật", action: "mumiao_secret" });
  } else if (affinity < 150) {
    opts.push({ text: "Cô ấy có một bí mật (thiếuđiểm thân mật)", action: "mumiao_secret_locked" });
  }

  const hasDiary = state.other.some(i => i.id === "miaomiao_diary");
  if (hasDiary) {
    opts.push({ text: "Quá khứ bị chôn vùi", action: "mumiao_buried_past" });
  }

  opts.push({ text: "Tặng vật phẩm", action: "mumiao_gift" });
  opts.push({ text: "Rời đi", action: "mumiao_leave" });

  setOptions(opts);
}

export function handleMumiaoBuySeeds() {
  const state = getState();
  if (state.cigarettes < 1) {
    setStory("Mộc Miêu Miêu lắc đầu: \"Không có thuốc lá thì không được, việc bồi dưỡng hạt giống rất tốn tài nguyên.\"");
    showMumiaoOptions();
    return;
  }
  removeCigarettes(1);
  const seedCount = GAME_CONSTANTS.NPC.MUMIAO_SEED_COUNT;
  const addedSeeds = [];
  let anyFailed = false;
  for (let i = 0; i < seedCount; i++) {
    const seed = SEEDS[Math.floor(Math.random() * SEEDS.length)];
    const added = addItem({ ...seed });
    if (added) {
      addedSeeds.push(seed.name);
    } else {
      anyFailed = true;
    }
  }
  if (addedSeeds.length > 0) {
    let msg = `Mộc Miêu Miêu nhận lấy thuốc lá, từ vườn ươm chọn vài hạt giống đưa cho bạn: \"Cầm kỹ nhé, mỗi hạt giống đều không dễ dàng có được.\"\n\nNhận được: ${addedSeeds.join("、")}`;
    if (anyFailed) {
      msg += "\n\n⚠️ Một phần hạt giống không thể cho vào vì balo đã đầy.";
    }
    setStory(msg);
  } else {
    state.cigarettes += 1;
    setStory("Balo đã đầy, không thể cho hạt giống vào. Mộc Miêu Miêu trả lại thuốc lá cho bạn.");
  }
  showMumiaoOptions();
}

export function handleMumiaoTendField() {
  const state = getState();
  if (state.lastMumiaoTendDay >= state.day) {
    setStory("Mộc Miêu Miêu xua tay: \"Hôm nay đã chăm sóc rồi, mai hãy đến nhé. Mầm cây cũng cần nghỉ ngơi.\"");
    showMumiaoOptions();
    return;
  }
  state.lastMumiaoTendDay = state.day;
  const affinityGain = GAME_CONSTANTS.NPC.MUMIAO_TEND_AFFINITY_MIN + Math.floor(Math.random() * (GAME_CONSTANTS.NPC.MUMIAO_TEND_AFFINITY_MAX - GAME_CONSTANTS.NPC.MUMIAO_TEND_AFFINITY_MIN + 1));
  addNpcAffinity("mumiao", affinityGain);
  const seed = SEEDS[Math.floor(Math.random() * SEEDS.length)];
  const added = addItem({ ...seed });
  advanceTime(2);
  updateStatusEffects();
  checkDeath();
  let msg = "Bạn đi theo Mộc Miêu Miêu vào đất thử nghiệm, giúp cô ấy nhổ cỏ, tưới nước, xới đất. Cô ấy vừa làm vừa giảng cho bạn kỹ thuật trồng trọt.\n\n";
  msg += `Mộc Miêu Miêuđiểm thân mật +${affinityGain}（Hiện tại ${getNpcAffinity("mumiao")}/${AFFINITY_MAX.mumiao}）\n\n`;
  msg += `Thời gian tiến ${2} lượt.`;
  if (added) {
    msg += `\n\nKhi rời đi, Mộc Miêu Miêu đưa cho bạn một hạt ${seed.name}: \"Cái này cho bạn, coi như tiền công.\"`;
  } else {
    msg += `\n\nMộc Miêu Miêu muốn đưa bạn một hạt giống, nhưng balo của bạn đã đầy.`;
  }
  setStory(msg);
  if (!state.gameOver) {
    showMumiaoOptions();
  }
}

export function handleMumiaoSecret() {
  const state = getState();
  const affinity = getNpcAffinity("mumiao");
  if (affinity < 150) {
    setStory("Mộc Miêu Miêu dời ánh mắt đi: \"Mối quan hệ của chúng ta chưa đến mức đó...\" Cô ấy cúi đầu tiếp tục vọc cây giống trong tay.");
    showMumiaoOptions();
    return;
  }
  if (isQuestDone("mumiaoSecret")) {
    setStory("Mộc Miêu Miêu mỉm cười lắc đầu: \"Bí mật đã nói cho bạn rồi... mảnh vườn hoa đó, sẽ luôn ở đó.\"");
    showMumiaoOptions();
    return;
  }
  markQuestDone("mumiaoSecret");
  const badge = SPECIAL_ITEMS.farming_master_badge;
  addItem({ ...badge });
  setStory(`Mộc Miêu Miêu im lặng rất lâu, cuối cùng ngẩng đầu nhìn vào mắt bạn.

"Tôi có một mảnh vườn hoa... ở thung lũng phía sau căn cứ."

Giọng cô ấy rất khẽ, như sợ kinh động điều gì đó:
"Trước ngày tận thế, đó là trạm thí nghiệm củađạo sư của tôi. Sau khiđạo sư đi rồi, tôi một mình canh giữ những bông hoa đó. Không ai biết nơi đó..."

Cô ấy dẫn bạn xuyên qua một mảnh phế tích hoang tàn, trèo qua một bức tường thấp. Trước mắt bỗng mở ra—

Trong một thung lũng ẩn mình, muôn hoa đua sắc lay động trong ánh hoàng hôn. Hướng dương, oải hương, cúc... chúng ngoan cường sinh trưởng trong các kẽ nứt của phế tích, như thể sự dịu dàng cuối cùng của thế giới này.

"Đẹp chứ?" Cô ấy đứng giữa vườn hoa, ánh hoàng hôn nhuộm vàng nửa khuôn mặt cô.

Bạn không biết nên nói gì. Bạn tôn trọng cô ấy, chân thành. Nhưng trong lòng bạn có chút mâu thuẫn — sự dịu dàng này quá nặng nề, bạn không chắc mình có xứng đáng với nó không.

Mộc Miêu Miêu dường như nhìn thấu sự do dự của bạn, cô ấy khẽ cười:
"Không sao. Tôi chỉ muốn bạn biết... trên thế giới này vẫn còn những thứ đáng để bảo vệ."

Cô ấy hái một chiếc huy chương từ trong vườn hoa đưa cho bạn:
"Đây làđạo sư để lại cho tôi. Giờ thì, nó thuộc về bạn rồi."

🌾 Nhận được【Huy chương bậc thầy nông nghiệp】`);
  showMumiaoOptions();
}

export function handleMumiaoSecretLocked() {
  setStory("Mộc Miêu Miêu dời ánh mắt đi: \"Mối quan hệ của chúng ta chưa đến mức đó...\" Cô ấy cúi đầu tiếp tục vọc cây giống trong tay.");
  showMumiaoOptions();
}

export function handleMumiaoAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "mumiao_buy_seeds":
      handleMumiaoBuySeeds();
      break;
    case "mumiao_tend_field":
      handleMumiaoTendField();
      break;
    case "mumiao_secret":
      handleMumiaoSecret();
      break;
    case "mumiao_secret_locked":
      handleMumiaoSecretLocked();
      break;
    case "mumiao_gift":
      state._currentNpc = "mumiao";
      setPhase("npc_gift");
      setStory("Vui lòng chọn vật phẩm muốn tặng (các vật phẩm khác nhau tăngđiểm thân mật khác nhau):");
      let items = [];
      state.food.forEach((item, i) => items.push({ ...item, cat: "food", idx: i, label: `[Thức ăn] ${getItemDisplayName(item)}` }));
      state.drinks.forEach((item, i) => items.push({ ...item, cat: "drinks", idx: i, label: `[Đồ uống] ${getItemDisplayName(item)}` }));
      state.medicine.forEach((item, i) => items.push({ ...item, cat: "medicine", idx: i, label: `[Y tế] ${getItemDisplayName(item)}` }));
      state.other.forEach((item, i) => items.push({ ...item, cat: "other", idx: i, label: `[Khác] ${getItemDisplayName(item)}` }));
      if (state.seeds) state.seeds.forEach((item, i) => items.push({ ...item, cat: "seed", idx: i, label: `[Hạt giống] ${getItemDisplayName(item)}` }));
      if (state.cigarettes > 0) items.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá", label: `[Hàng hóa] (${state.cigarettes})Thuốc lá` });
      if (state.gasoline > 0) items.push({ cat: "gasoline", idx: 0, name: "Xăng", label: `[Hàng hóa] (${state.gasoline})Xăng` });
            if (state.pureEnergy > 0) items.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết", label: `[Hàng hóa] (${state.pureEnergy})Năng lượng tinh khiết` });
      if (items.length === 0) {
        setStory("Bạn lục tung balo, phát hiện không có gì để tặng...");
        showMumiaoOptions();
        return;
      }
      const opts = items.map((item, i) => ({ text: item.label, action: "gift_confirm", index: i, giftItem: item }));
      opts.push({ text: "Quay lại", action: "gift_back", index: -1 });
      setOptions(opts);
      break;
    case "mumiao_leave":
      state._currentNpc = null;
      returnToMenu();
      break;
    case "mumiao_buried_past":
      handleMumiaoBuriedPast();
      break;
    case "mumiao_quest1":
      handleMumiaoQuest1();
      break;
    case "mumiao_quest2":
      handleMumiaoQuest2();
      break;
    case "mumiao_quest3":
      handleMumiaoQuest3();
      break;
    case "mumiao_back":
      showMumiaoOptions();
      break;
    default:
      showMumiaoOptions();
      break;
  }
}

export function handleMumiaoBuriedPast() {
  const state = getState();
  const opts = [];
  if (!isQuestDone("mumiaoQuest1")) {
    opts.push({ text: "Cùng nhau đi dã ngoại", action: "mumiao_quest1" });
  } else if (!isQuestDone("mumiaoQuest2")) {
    opts.push({ text: "Cùng nhau đi dã ngoại（đã hoàn thành）", action: "mumiao_buried_past", disabled: true });
    opts.push({ text: "Nỗi nhớ xuyên thời không", action: "mumiao_quest2" });
  } else if (!isQuestDone("mumiaoQuest3")) {
    opts.push({ text: "Cùng nhau đi dã ngoại（đã hoàn thành）", action: "mumiao_buried_past", disabled: true });
    opts.push({ text: "Nỗi nhớ xuyên thời không（đã hoàn thành）", action: "mumiao_buried_past", disabled: true });
    opts.push({ text: "Mở rộng đất thử nghiệm", action: "mumiao_quest3" });
  } else {
    setStory("Mộc Miêu Miêu mỉm cười nhìn bạn: \"Cảm ơn bạn... những quá khứ đó, cuối cùng không còn chỉ do một mình tôi gánh vác nữa.\"");
    showMumiaoOptions();
    return;
  }
  setPhase("npc_mumiao");
  setStory("Mộc Miêu Miêu nhìn thấy cuốn nhật ký trong tay bạn, vành mắt lập tức đỏ hoe. Cô ấy run rẩy vươn tay, rồi lại rụt về.\n\n\"Đây là... nhật ký của tôi. Tôi tưởng nó đã vĩnh viễn bị chôn ở đó rồi.\"\n\nCô ấy hít sâu một hơi, cố gắng bình tĩnh lại:\n\"Có vài việc... tôi vẫn luôn muốn làm, nhưng một mình không làm được. Bạn sẵn lòng giúp tôi không?\"");
  opts.push({ text: "Quay lại", action: "mumiao_back" });
  setOptions(opts);
}

export function handleMumiaoQuest1() {
  const state = getState();
  const carrotCount = state.food.filter(i => i.id === "luobo").reduce((sum, i) => sum + (i.count || 1), 0);
  const potatoCount = state.food.filter(i => i.id === "tudou").reduce((sum, i) => sum + (i.count || 1), 0);
  const needCarrot = 3;
  const needPotato = 3;
  if (carrotCount < needCarrot || potatoCount < needPotato) {
    let msg = "Mộc Miêu Miêu nhìn bạn với vẻ mong đợi: \"Chúng ta cần một ít nguyên liệu để đi dã ngoại...\"\n\nVật phẩm cần:";
    if (carrotCount < needCarrot) msg += `\n  Cà rốt ${carrotCount}/${needCarrot}`;
    else msg += `\n  Cà rốt ${carrotCount}/${needCarrot} ✓`;
    if (potatoCount < needPotato) msg += `\n  Khoai tây ${potatoCount}/${needPotato}`;
    else msg += `\n  Khoai tây ${potatoCount}/${needPotato} ✓`;
    setStory(msg);
    showMumiaoOptions();
    return;
  }
  removeItemById("food", "luobo", needCarrot);
  removeItemById("food", "tudou", needPotato);
  markQuestDone("mumiaoQuest1");
  addNpcAffinity("mumiao", 20);
  advanceTime(3);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn mang cà rốt và khoai tây, đi theo Mộc Miêu Miêu đến một khoảng đất trống bên cạnh tháp canh. Cô ấy lấy từ balo ra một tấm vải cũ trải xuống đất, lại tìm vài hòn đá xếp thành một bếp lò đơn sơ.

"Đã lâu rồi không như vậy..." Cô ấy vừa gọt vỏ khoai tây vừa nói, "Hồi nhỏ, bố mẹ sẽ dẫn tôi đi dã ngoại. Bố luôn nướng cháy khoai tây, mẹ thì cười ông ấy."

Ngọn lửa liếm đáy nồi, cà rốt và khoai tây cuộn tròn trong canh. Nguyên liệu đơn giản, nhưng lại tỏa ra hương thơm đã lâu không thấy.

Mộc Miêu Miêu múc một bát đưa cho bạn, mình cũng bưng một bát. Cô ấy uống một ngụm, bỗng cười:
"Bạn nếm thử xem, đây là hương vị của mẹ tôi."

Hoàng hôn buông xuống, hai người ngồi bên phế tích, uống canh nóng. Gió thổi rối tóc cô ấy, nhưng cô ấy không để ý.

"Cảm ơn bạn." Cô ấy khẽ nói, "Đây là bát canh ngon nhất tôi từng uống kể từ ngày tận thế."

Mộc Miêu Miêuđiểm thân mật +20（Hiện tại ${getNpcAffinity("mumiao")}/${AFFINITY_MAX.mumiao}）

Thời gian tiến ${3} lượt.`);
  if (!state.gameOver) {
    showMumiaoOptions();
  }
}

export function handleMumiaoQuest2() {
  const state = getState();
  if (!isQuestDone("mumiaoQuest1")) {
    setStory("Bạn cần hoàn thành nhiệm vụ trước đó.");
    showMumiaoOptions();
    return;
  }
  const baijiuCount = state.drinks.filter(i => i.id === "高度白酒").reduce((sum, i) => sum + (i.count || 1), 0);
  const ryeCount = state.food.filter(i => i.id === "heimai").reduce((sum, i) => sum + (i.count || 1), 0);
  const needBaijiu = 5;
  const needRye = 10;
  if (baijiuCount < needBaijiu || ryeCount < needRye) {
    let msg = "Mộc Miêu Miêu cúi đầu nói: \"Tôi muốn đi... tảo mộ cho họ. Cần một số thứ.\"\n\nVật phẩm cần:";
    if (baijiuCount < needBaijiu) msg += `\n  Rượu trắng mạnh ${baijiuCount}/${needBaijiu}`;
    else msg += `\n  Rượu trắng mạnh ${baijiuCount}/${needBaijiu} ✓`;
    if (ryeCount < needRye) msg += `\n  Lúa mạch đen ${ryeCount}/${needRye}`;
    else msg += `\n  Lúa mạch đen ${ryeCount}/${needRye} ✓`;
    setStory(msg);
    showMumiaoOptions();
    return;
  }
  removeItemById("drinks", "高度白酒", needBaijiu);
  removeItemById("food", "heimai", needRye);
  markQuestDone("mumiaoQuest2");
  addNpcAffinity("mumiao", 30);
  advanceTime(3);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn đi theo Mộc Miêu Miêu, trở lại trước tấm bia mộ được bện từ vòng hoa.

Cô ấy rắc rượu trắng trước bia mộ, rồi rải từng hạt lúa mạch đen xuống đất. Những hạt lúa mạch lay động trong gió, như vô số bàn tay vươn về phía bầu trời.

"Bố, mẹ..." Giọng cô ấy rất khẽ, nhưng đặc biệt kiên định, "Con đã trồng ra rồi."

Cô ấy ngồi xổm xuống, dùng ngón tay vẽ gì đó trên đất:
"Xem này bố mẹ, con đã trồng ra rồi. Cà rốt, khoai tây, lúa mạch đen... các người sẽ không còn phải chịu đói nữa."

Cô ấy mở cuốn nhật ký trải ra trước bia mộ, lật đến trang cuối — bức tranh gia đình tự vẽ. Gió thổi qua, trang giấy kêu phần phật, như thể đang đáp lại cô ấy.

Mộc Miêu Miêu đứng dậy, lau nước mắt, bỗng cười:
"Họ chắc chắn đã thấy rồi."

Bạn đứng bên cạnh cô ấy, nhìn những hạt lúa mạch lay động trong gió. Ánh mặt trời xuyên qua mây, rọi lên bức tranh, ba người trong tranh dường như đang mỉm cười.

Mộc Miêu Miêuđiểm thân mật +30（Hiện tại ${getNpcAffinity("mumiao")}/${AFFINITY_MAX.mumiao}）

Thời gian tiến ${3} lượt.`);
  if (!state.gameOver) {
    showMumiaoOptions();
  }
}

export function handleMumiaoQuest3() {
  const state = getState();
  if (!isQuestDone("mumiaoQuest2")) {
    setStory("Bạn cần hoàn thành nhiệm vụ trước đó.");
    showMumiaoOptions();
    return;
  }
  const cropIds = CROPS.map(c => c.id);
  const ownedCropIds = [];
  const missingCrops = [];
  for (const cropId of cropIds) {
    const hasIt = state.food.some(i => i.id === cropId && (i.count || 1) > 0);
    if (hasIt) {
      ownedCropIds.push(cropId);
    } else {
      missingCrops.push(CROPS.find(c => c.id === cropId).name);
    }
  }
  if (ownedCropIds.length < 15) {
    setStory(`Mộc Miêu Miêu nhìn bạn nói: "Tôi muốn mở rộng đất thử nghiệm, trồng tất cả các loại cây có thể trồng được. Bạn có thể giúp tôi gom đủ 15 loại cây khác nhau không?"\n\nHiện đang có ${ownedCropIds.length}/15 loại cây.\n\nCòn thiếu: ${missingCrops.join("、")}`);
    showMumiaoOptions();
    return;
  }
  for (const cropId of cropIds) {
    removeItemById("food", cropId, 1);
  }
  markQuestDone("mumiaoQuest3");
  addNpcAffinity("mumiao", 50);
  const bow = RANGED_WEAPONS.find(w => w.id === "原野之弓");
  if (bow) {
    addItem({ ...bow });
  }
  addItem({ id: "箭矢", name: "Mũi tên", type: "ammo", count: 30 });
  advanceTime(3);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn bày 15 loại cây trước mặt Mộc Miêu Miêu. Đôi mắt cô ấy sáng lên, như nhìn thấy báu vật quý giá nhất thế gian.

"Những thứ này... đều do bạn trồng ra sao?" Cô ấy cẩn thận nâng từng cây lên, như vuốt ve đứa trẻ mới sinh.

Cô ấy hít sâu một hơi, đứng thẳng người:
"Tôi muốn mở rộng đất thử nghiệm gấp ba lần. Mỗi hạt giống, mỗi cây mầm, tôi đều sẽ chăm sóc tốt. Sẽ không còn ai vì đói khát mà mất đi người thân nữa."

Cô ấy lấy từ nhà kho một cây cung cổ xưa, trên thân cung khắc hoa văn bông lúa, dây cung được bện từ sợi thực vật đặc biệt.

"Cây cung này làđạo sư để lại cho tôi. Cô ấy nói, đây được làm từ những cây kiên cường nhất trong đất thử nghiệm." Mộc Miêu Miêu đưa cung cho bạn, "Giờ thì, nó thuộc về bạn. Hãy bảo vệ mảnh đất này, cũng bảo vệ chính bạn."

Xa xa, cây cối trong đất thử nghiệm xào xạc trong gió, như đang vỗ tay cho một khởi đầu mới.

Mộc Miêu Miêuđiểm thân mật +50（Hiện tại ${getNpcAffinity("mumiao")}/${AFFINITY_MAX.mumiao}）

🏹 Nhận được【Cung đồng hoang】!
🏹 Nhận được【Mũi tên】×30!

Thời gian tiến ${3} lượt.`);
  if (!state.gameOver) {
    if (checkGoHomeEnding()) return;
    showMumiaoOptions();
  }
}
