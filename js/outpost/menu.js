import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addCigarettes,
  removeCigarettes,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  canBegToday,
  markBegDone,
  addAmmo,
} from '../state.js';

import {
  FRUITS,
  GAME_CONSTANTS,
  DRINKS,
  MEDICINES,
  CROP_FOOD_MAP,
} from '../config.js';

import {
  hasDawnCaptainBadge,
  hasCastleIdentity,
  cleanDualIdentity,
} from '../faction.js';

export function showOutpostOptions() {
  if (getState().gameOver) return;
  setPhase("explore");
  const state = getState();
  const opts = [
    { text: "Khám phá", action: "outpost_explore" },
    { text: "Ăn", action: "eat" },
    { text: "Uống nước", action: "drink" },
    { text: "Y tế", action: "medicine" },
    { text: "Trang bị", action: "equip" },
    { text: "Về nhà", action: "goHome" },
    { text: "Vứt bỏ", action: "discard" },
    { text: "Cô V", action: "npc_v" },
    { text: "Su Xiao Han", action: "npc_xiaohan" },
    { text: "Lilith", action: "npc_lili" },
    { text: "Mieu Miao", action: "npc_mumiao" },
    { text: "Thủ lĩnh trận địa", action: "npc_leader" }
  ];
  opts.push({ text: "Làm việc nhẹ nhàng", action: "work" });
  opts.push({ text: "Khất thực vật tư", action: "beg_supplies" });
  opts.push({ text: "Trạm giao dịch Dawn", action: "trading_post" });
  opts.push({ text: "Điểm trưng thu vật tư", action: "collection_point" });
  setOptions(opts);
}

export function handleOutpostExplore() {
  setStory("Bạn nhìn quanh một lượt——đây là địa bàn của người khác, trộm đồ không hay đâu.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showOutpostOptions();
}

export function handleBegSupplies() {
  const state = getState();
  cleanDualIdentity(state);
  if (hasCastleIdentity(state)) {
    setStory("Quản lý trận địa liếc nhìn bạn: \"Hừ, người của lâu đài còn đến chỗ chúng tôi xin cơm à? Có còn biết xấu hổ không!\" Người xung quanh nhìn bạn bằng ánh mắt khinh bỉ, bạn đành lủi thủi đi mất.");
    showOutpostOptions();
    return;
  }
  if (!canBegToday()) {
    setStory("Hôm nay đã nhận cứu trợ rồi, mai lại đến nhé.");
    showOutpostOptions();
    return;
  }
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const added1 = addItem({ ...fruit });

  const hasCaptain = hasDawnCaptainBadge(state);
  if (hasCaptain) {
    const fruit2 = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const added2 = addItem({ ...fruit2 });
    if (added1 || added2) {
      markBegDone();
      setStory(`Thân phận đội trưởng tiên phong Dawn khiến bạn được lĩnh thêm một phần cứu trợ! Quản lý trận địa đưa cho bạn ${fruit.name} và ${fruit2.name}. "Đội trưởng đại nhân, xin từ từ dùng!"`);
    } else {
      setStory("Ba lô của bạn đã đầy, không thể nhận vật tư cứu trợ.");
    }
  } else {
    if (added1) {
      markBegDone();
      setStory(`Quản lý trận địa đưa cho bạn một phần ${fruit.name}. "Tiết kiệm mà ăn, mai lại đến."`);
    } else {
      setStory("Ba lô của bạn đã đầy, không thể nhận vật tư cứu trợ.");
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showOutpostOptions();
}

export function handleTradingPost() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  setPhase("explore");
  let info = "🏪 [Trạm giao dịch Dawn]\n\nHậu cần trận địa quản lý một trạm giao dịch vật tư nhỏ: \"Đây đều là đồ chúng tôi lục lọi từ khắp nơi, chỉ thu thuốc lá.\"\n\n";
  info += `Thuốc lá hiện tại: ${state.cigarettes}\n\n`;
  info += "Danh sách hàng hóa:\n";
  const prices = OC.TRADING_POST;
  const ammoAmounts = OC.TRADING_POST_AMMO;
  for (const [name, price] of Object.entries(prices)) {
    const ammoAmount = ammoAmounts[name];
    const extra = ammoAmount ? `(${ammoAmount} viên)` : "";
    info += `  ${name}${extra} - ${price} thuốc lá\n`;
  }
  setStory(info);
  const opts = [];
  for (const [name, price] of Object.entries(prices)) {
    const ammoAmount = ammoAmounts[name];
    const extra = ammoAmount ? `(${ammoAmount} viên)` : "";
    opts.push({ text: `Mua ${name}${extra}(${price} thuốc lá)`, action: "trading_post_buy", item: name, price });
  }
  opts.push({ text: "Rời đi", action: "trading_post_back" });
  setOptions(opts);
}

export function handleTradingPostBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "trading_post_buy") return;
  const { item, price } = option;
  if (state.cigarettes < price) {
    setStory(`❌ Thuốc lá của bạn không đủ, cần ${price} điếu thuốc lá, hiện chỉ có ${state.cigarettes} điếu.`);
    handleTradingPost();
    return;
  }
  const OC = GAME_CONSTANTS.OUTPOST;
  const ammoAmount = OC.TRADING_POST_AMMO[item];
  if (ammoAmount) {
    removeCigarettes(price);
    addAmmo(item, ammoAmount);
    setStory(`✅ Bạn tiêu ${price} điếu thuốc lá mua ${ammoAmount} viên ${item}.\n\nThuốc lá hiện tại: ${state.cigarettes}`);
  } else {
    let added = false;
    const drink = DRINKS.find(d => d.id === item);
    if (drink) {
      added = addItem({ ...drink });
    }
    if (!added) {
      const med = MEDICINES.find(m => m.id === item);
      if (med) {
        added = addItem({ ...med });
      }
    }
    if (!added) {
      setStory("❌ Mua thất bại, ba lô có thể đã đầy.");
      handleTradingPost();
      return;
    }
    removeCigarettes(price);
    setStory(`✅ Bạn tiêu ${price} điếu thuốc lá mua ${item}.\n\nThuốc lá hiện tại: ${state.cigarettes}`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleTradingPost();
}

export function handleCollectionPoint() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  setPhase("explore");
  let fruitCount = 0;
  for (const item of state.food) {
    if (item.type === "fruit") fruitCount += (item.count || 1);
  }
  let cropCount = 0;
  for (const item of state.food) {
    if (item.type === "food" && CROP_FOOD_MAP[item.id]) {
      cropCount += (item.count || 1);
    }
  }
  setStory(`📦 [Điểm trưng thu vật tư]\n\nTrận địa Dawn đang trưng thu vật tư dân gian, có thể dùng nông sản đổi thuốc lá.\n\n📌 Quy tắc đổi:\n  ${OC.COLLECTION_FRUIT_COST} trái cây → ${OC.COLLECTION_REWARD} thuốc lá\n  ${OC.COLLECTION_CROP_COST} nông sản → ${OC.COLLECTION_REWARD} thuốc lá\n\n📦 Đang giữ:\n  Trái cây: ${fruitCount} quả\n  Nông sản: ${cropCount} cái\n  Thuốc lá: ${state.cigarettes} điếu`);
  setOptions([
    { text: `Nộp ${OC.COLLECTION_FRUIT_COST} trái cây → ${OC.COLLECTION_REWARD} thuốc lá`, action: "collection_fruit" },
    { text: `Nộp ${OC.COLLECTION_CROP_COST} nông sản → ${OC.COLLECTION_REWARD} thuốc lá`, action: "collection_crop" },
    { text: "Rời đi", action: "collection_back" },
  ]);
}

export function handleCollectionFruit() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  let fruitCount = 0;
  for (const item of state.food) {
    if (item.type === "fruit") fruitCount += (item.count || 1);
  }
  if (fruitCount < OC.COLLECTION_FRUIT_COST) {
    setStory(`❌ Trái cây của bạn không đủ, cần ${OC.COLLECTION_FRUIT_COST} quả, hiện chỉ có ${fruitCount} quả.`);
    handleCollectionPoint();
    return;
  }
  let remaining = OC.COLLECTION_FRUIT_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.food[i].type === "fruit") {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        remaining -= available;
        state.food.splice(i, 1);
      } else {
        state.food[i].count -= remaining;
        remaining = 0;
      }
    }
  }
  addCigarettes(OC.COLLECTION_REWARD);
  setStory(`✅ Bạn nộp ${OC.COLLECTION_FRUIT_COST} trái cây, nhận ${OC.COLLECTION_REWARD} điếu thuốc lá.\n\nThuốc lá hiện tại: ${state.cigarettes}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleCollectionPoint();
}

export function handleCollectionCrop() {
  const state = getState();
  const OC = GAME_CONSTANTS.OUTPOST;
  let cropCount = 0;
  for (const item of state.food) {
    if (item.type === "food" && CROP_FOOD_MAP[item.id]) {
      cropCount += (item.count || 1);
    }
  }
  if (cropCount < OC.COLLECTION_CROP_COST) {
    setStory(`❌ Nông sản của bạn không đủ, cần ${OC.COLLECTION_CROP_COST} cái, hiện chỉ có ${cropCount} cái.`);
    handleCollectionPoint();
    return;
  }
  let remaining = OC.COLLECTION_CROP_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.food[i].type === "food" && CROP_FOOD_MAP[state.food[i].id]) {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        remaining -= available;
        state.food.splice(i, 1);
      } else {
        state.food[i].count -= remaining;
        remaining = 0;
      }
    }
  }
  addCigarettes(OC.COLLECTION_REWARD);
  setStory(`✅ Bạn nộp ${OC.COLLECTION_CROP_COST} nông sản, nhận ${OC.COLLECTION_REWARD} điếu thuốc lá.\n\nThuốc lá hiện tại: ${state.cigarettes}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleCollectionPoint();
}
