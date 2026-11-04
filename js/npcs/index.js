/* ============================================================
   Mô-đun logic cốt lõi của NPC
   Thứ tự tổ chức: Cấu hình NPC → Tương tác/Đối thoại → Giao nhiệm vụ → Thu hồi/Sửa chữa/Chữa trị
   ============================================================ */

import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  removeItem,
  addNpcAffinity,
  getNpcAffinity,
  getAffinityLabel,
  canChatToday,
  incrementChatCount,
  getAffinityStage,
  isQuestDone,
  markQuestDone,
  addCigarettes,
  removeCigarettes,
  removeGasoline,
  removePureEnergy,
  getItemDisplayName,
  isStackableType,
} from '../state.js';

import {
  SURVIVOR_NPC,
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  AMMO,
  CROPS,
  BUILDING_MATERIALS,
  CANNED_FOOD_IDS,
  FRUITS,
  DRINKS,
  FOODS,
  MEDICINES,
  DEFAULT_ITEM_IDS,
  GAME_CONSTANTS,
  CASTLE_REJECTION_DIALOGUES,
  AFFINITY_MAX,
} from '../config.js';

import {
  showExploreOptionsState,
  returnToMenu,
} from '../routing.js';

import {
  handleEquipSelect,
  handleDiscardSelect,
} from '../equipment.js';

import { hasCastleIdentity, hasDawnCaptainBadge } from '../faction.js';

import {
  showMumiaoOptions,
  handleMumiaoAction,
} from './mumiao.js';

function getCaptainDiscountCost(state, npcId, baseCost) {
  if (npcId === "lili" && hasDawnCaptainBadge(state)) {
    return Math.round(baseCost / 2);
  }
  return baseCost;
}

// ---------- Cấu hình NPC ----------

function getNpcConfig() {
  const state = getState();
  const npcId = state._currentNpc;
  return SURVIVOR_NPC.find(n => n.id === npcId);
}

// ---------- Lối vào tương tác NPC ----------

function npcHeader(npcId) {
  const state = getState();
  state._currentNpc = npcId;
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!config) {
    setStory("Người này không còn ở đây nữa...");
    returnToMenu();
    return;
  }
  const affinity = getNpcAffinity(npcId);
  const stage = getAffinityStage(affinity);
  const friendshipLabel = getAffinityLabel(affinity);
  let description = config.desc;
  description += `\n\nHiện tại thân mật: ${affinity}/${AFFINITY_MAX[npcId]}(${friendshipLabel})`;
  if (npcId === "lili") {
    description += `\n\n💡 Lilith có thể giúp bạn: Thu hồi vũ khí đổi thuốc lá | Thu hồi balo dư | Sửa chữa súng | Sửa chữa cung nỏ | Chữa trị nhiễm trùng | Giao dịch vật tư y tế`;
    if (affinity >= AFFINITY_MAX[npcId] && !isQuestDone("llGift")) {
      description += `\n\n🎁 Lilith dường như có thứ gì đó muốn đưa cho bạn...`;
    }
  } else if (npcId !== "v") {
    description += `\n\nBạn cũng mang balo của mình qua nói: \"Xem qua trang bị của tôi, có thể thu hồi/giao dịch v.v.\"`;
  }
  return description;
}

export function handleNpcInteract(npcId) {
  const state = getState();
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!config) {
    setStory("Người này không còn ở đây nữa...");
    returnToMenu();
    return;
  }

  const hasCastle = hasCastleIdentity(state);
  if (hasCastle && (npcId === "v" || npcId === "xiaohan" || npcId === "lili")) {
    const npcNames = { v: "Cô V", xiaohan: "Tô Tiểu Hàm", lili: "Lilith" };
    const name = npcNames[npcId] || "NPC";
    setStory(CASTLE_REJECTION_DIALOGUES[npcId] || `${name} thấy thẻ thân phận lâu đài của bạn, thái độ lập tức lạnh đi: "Người của lâu đài đến đây làm gì? Mời rời đi."`);
    setPhase("npc_" + npcId);
    state._currentNpc = npcId;
    setOptions([{ text: "Quay lại", action: "return" }]);
    return;
  }

  if (npcId === "mumiao") {
    showMumiaoOptions();
    return;
  }

  setPhase("npc_" + npcId);
  state._currentNpc = npcId;
  setStory(npcHeader(npcId));
  handleNpcAction("chat");
}

export function getAvailableQuest(npcId) {
  const state = getState();
  if (state._npcDailyQuests?.[npcId]) return state._npcDailyQuests[npcId];
  const npcConfig = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!npcConfig || !npcConfig.quests) return null;
  const affinity = state.npcAffinity[npcId] || 0;
  const quests = npcConfig.quests;
  let bestQuest = null;
  let bestReq = -1;
  for (const [questId, quest] of Object.entries(quests)) {
    if (state.npcQuestsDone[questId]) continue;
    const req = quest.reqAffection || 0;
    if (affinity >= req && req > bestReq) {
      bestReq = req;
      bestQuest = { id: questId, ...quest, npcId };
    }
  }
  return bestQuest;
}

export function handleNpcAction(input) {
  const state = getState();

  let action;
  let isInitial = typeof input === "string";
  if (isInitial) {
    action = input;
  } else {
    const optionIndex = input - 1;
    if (optionIndex < 0 || optionIndex >= state.options.length) return;
    action = state.options[optionIndex].action;
  }

  if (action === "return") {
    state._currentNpc = null;
    returnToMenu();
    return;
  }

  const npcId = state._currentNpc;
  const hasCastle = hasCastleIdentity(state);
  if (hasCastle && npcId && (npcId === "v" || npcId === "xiaohan" || npcId === "lili")) {
    const npcNames = { v: "Cô V", xiaohan: "Tô Tiểu Hàm", lili: "Lilith" };
    const name = npcNames[npcId] || "NPC";
    setStory(CASTLE_REJECTION_DIALOGUES[npcId] || `${name} thấy thẻ thân phận lâu đài của bạn, thái độ lập tức lạnh đi: "Người của lâu đài đến đây làm gì? Mời rời đi."`);
    setPhase("npc_" + npcId);
    setOptions([{ text: "Quay lại", action: "return" }]);
    return;
  }

  if (!isInitial) {
    if (action === "chat") { handleNpcChat(); return; }
    if (action === "gift") { handleNpcGift(); return; }
    if (action === "recycle") { handleNpcRecycle(); return; }
    if (action === "recycle_ranged") { handleNpcRecycleRanged(); return; }
    if (action === "recycle_backpack") { handleNpcRecycleBackpack(); return; }
    if (action === "repair") { handleNpcRepair(); return; }
    if (action === "repair_bow") { handleNpcRepairBow(); return; }
    if (action === "cure_infection") { handleNpcCureInfection(); return; }
    if (action === "quest") { handleNpcQuest(); return; }
    if (action === "lili_gift_claim") { handleLiliGiftClaim(); return; }
    if (action === "mumiao_buy_seeds" || action === "mumiao_tend_field" || action === "mumiao_secret" || action === "mumiao_secret_locked" || action === "mumiao_gift" || action === "mumiao_leave") {
      handleMumiaoAction(input);
      return;
    }
    if (action === "lili_repair_gun") { handleLiliRepairGun(); return; }
    if (action === "lili_repair_bow") { handleLiliRepairBow(); return; }
    if (action === "trade") {
      const npcId = state._currentNpc;
      if (npcId === "v") {
        const offerings = [];
        state.food.forEach((item, i) => offerings.push({ cat: "food", idx: i, name: getItemDisplayName(item), label: `[Thức ăn] ${getItemDisplayName(item)}` }));
        state.drinks.forEach((item, i) => offerings.push({ cat: "drinks", idx: i, name: getItemDisplayName(item), label: `[Đồ uống] ${getItemDisplayName(item)}` }));
        if (state.cigarettes > 0) offerings.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá", label: `[Hàng hóa] (${state.cigarettes})Thuốc lá` });
        if (state.gasoline > 0) offerings.push({ cat: "gasoline", idx: 0, name: "Xăng", label: `[Hàng hóa] (${state.gasoline})Xăng` });
        if (state.pureEnergy > 0) offerings.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết", label: `[Hàng hóa] (${state.pureEnergy})Năng lượng tinh khiết` });
        if (offerings.length === 0) {
          setStory("Cô V liếc bạn một cái: \"Bạn hai tay trống trơn, lấy gì để giao dịch?\"");
          handleNpcAction("chat");
          return;
        }
        setPhase("v_trade");
        setStory("Cô V cầm balo của bạn lật qua lật lại, chọn những thứ cô ấy muốn:");
        const opts = offerings.map((item, i) => ({
          text: item.label,
          action: "v_trade_confirm",
          index: i,
          vItem: item,
        }));
        opts.push({ text: "Quay lại", action: "v_back", index: -1 });
        setOptions(opts);
      } else if (npcId === "xiaohan") {
        const offerings = [];
        state.food.forEach((item, i) => offerings.push({ cat: "food", idx: i, name: getItemDisplayName(item) }));
        state.drinks.forEach((item, i) => offerings.push({ cat: "drinks", idx: i, name: getItemDisplayName(item) }));
        state.medicine.forEach((item, i) => offerings.push({ cat: "medicine", idx: i, name: getItemDisplayName(item) }));
        state.other.forEach((item, i) => offerings.push({ cat: "other", idx: i, name: getItemDisplayName(item) }));
        if (state.cigarettes > 0) offerings.push({ cat: "cigarettes", idx: 0, name: "Thuốc lá" });
        if (state.gasoline > 0) offerings.push({ cat: "gasoline", idx: 0, name: "Xăng" });
        if (state.pureEnergy > 0) offerings.push({ cat: "pureEnergy", idx: 0, name: "Năng lượng tinh khiết" });
        if (offerings.length === 0) {
          setStory("Tô Tiểu Hàm nghiêng đầu nhìn bạn: \"Bạn không có thứ gì để đưa tôi nhỉ...\"");
          handleNpcAction("chat");
          return;
        }
        setPhase("xiaohan_trade");
        setStory("Tô Tiểu Hàm tò mò lật xem balo của bạn, cuối cùng dừng lại ở một món đồ: \"Cái này! Tôi có thể lấy đồ đổi với bạn không?\"\nVui lòng chọn vật phẩm muốn giao dịch:");
        const opts = offerings.map((item, i) => ({
          text: item.label || `[${item.cat}] ${item.name}`,
          action: "xiaohan_trade_confirm",
          index: i,
          tradeItem: item,
        }));
        opts.push({ text: "Quay lại", action: "xiaohan_back", index: -1 });
        setOptions(opts);
      } else if (npcId === "lili") {
        const offerings = [];
        state.medicine.forEach((item, i) => offerings.push({ cat: "medicine", idx: i, name: getItemDisplayName(item), label: `[Y tế] ${getItemDisplayName(item)}` }));
        if (offerings.length === 0) {
          setStory("Lilith lắc đầu: \"Bạn không có vật tư y tế để giao dịch...\"");
          handleNpcAction("chat");
          return;
        }
        setPhase("lili_trade");
        setStory("Lilith lật xem túi y tế của bạn: \"Ừm... những thứ này tôi có thể giúp bạn đổi thành thuốc.\"\nVui lòng chọn vật phẩm muốn giao dịch:");
        const opts = offerings.map((item, i) => ({
          text: item.label,
          action: "lili_trade_confirm",
          index: i,
          tradeItem: item,
        }));
        opts.push({ text: "Quay lại", action: "lili_back", index: -1 });
        setOptions(opts);
      }
      return;
    }
  }

  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!config) { returnToMenu(); return; }

  const actions = [
    { text: "Đối thoại", action: "chat" },
  ];

  if (config.canTrade !== false) {
    actions.push({ text: "Giao dịch", action: "trade" });
  }

  const availableQuest = getAvailableQuest(npcId);
  if (availableQuest) {
    actions.push({ text: "Xem treo thưởng", action: "quest" });
  }

  if (config.canGift !== false) {
    actions.push({ text: "Tặng vật phẩm", action: "gift" });
  }

  if (config.canRecycle) {
    actions.push({ text: config.recycleQuest?.name || "Thu hồi vũ khí cận chiến", action: "recycle" });
    actions.push({ text: config.recycleRangedQuest?.name || "Thu hồi vũ khí tầm xa", action: "recycle_ranged" });
    if (config.recycleBackpackQuest) {
      actions.push({ text: config.recycleBackpackQuest.name, action: "recycle_backpack" });
    }
  }

  if (config.canRepair) {
    actions.push({ text: "Sửa chữa vũ khí cận chiến", action: "repair" });
    if (config.canRepairBow) {
      actions.push({ text: "Sửa chữa vũ khí tầm xa", action: "repair_bow" });
    }
  }

  if (config.repairQuest) {
    actions.push({ text: config.repairQuest.name, action: "lili_repair_gun" });
  }
  if (config.repairBowQuest) {
    actions.push({ text: config.repairBowQuest.name, action: "lili_repair_bow" });
  }

  if (config.canCureInfection || config.cureInfectionQuest) {
    actions.push({ text: config.cureInfectionQuest?.name || "Chữa trị nhiễm trùng", action: "cure_infection" });
  }

  if (npcId === "lili" && config.giftQuest) {
    const giftAffinity = getNpcAffinity(npcId);
    if (giftAffinity >= config.giftQuest.reqAffection && !isQuestDone("llGift")) {
      actions.push({ text: "Nhận quà bí ẩn", action: "lili_gift_claim" });
    }
  }

  actions.push({ text: "Quay lại", action: "return" });

  setPhase("npc_" + npcId);
  setOptions(actions);
}

// ---------- Đối thoại ----------

export function handleNpcChat() {
  const state = getState();
  const npcId = state._currentNpc;
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!config) { returnToMenu(); return; }

  if (!canChatToday(npcId)) {
    setStory("Hôm nay đã nói chuyện đủ rồi, mai hãy đến nhé.");
    handleNpcAction("chat");
    return;
  }

  const affinity = getNpcAffinity(npcId);
  const stage = getAffinityStage(affinity);
  const lines = config.dialogues[stage] || config.dialogues["stranger"];
  const line = lines[Math.floor(Math.random() * lines.length)];
  incrementChatCount(npcId);
  addNpcAffinity(npcId, GAME_CONSTANTS.NPC.CHAT_AFFINITY);
  const newAffinity = getNpcAffinity(npcId);
  setStory(line + `\n\nĐiểm thân mật +${GAME_CONSTANTS.NPC.CHAT_AFFINITY}(Hiện tại ${newAffinity}/${AFFINITY_MAX[npcId]})`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Tặng ----------

export function handleNpcGift() {
  const state = getState();
  const npcId = state._currentNpc;
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
    handleNpcAction("chat");
    return;
  }
  setPhase("npc_gift");
  setStory("Vui lòng chọn vật phẩm muốn tặng (các vật phẩm khác nhau tăng điểm thân mật khác nhau):");
  const opts = items.map((item, i) => ({ text: item.label, action: "gift_confirm", index: i, giftItem: item }));
  opts.push({ text: "Quay lại", action: "gift_back", index: -1 });
  setOptions(opts);
}

export function handleNpcGiftConfirm(input) {
  const state = getState();
  const npcId = state._currentNpc;
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) {
    handleNpcAction("chat");
    return;
  }

  const option = state.options[optionIndex];
  if (option.action === "gift_back") {
    handleNpcAction("chat");
    return;
  }

  const item = option.giftItem;
  const catMap = {
    food: state.food,
    drinks: state.drinks,
    medicine: state.medicine,
    other: state.other,
    seed: state.seeds,
    cigarettes: [],
    gasoline: []
  };

  let affinityGain = 1;
  let giftName = item.name || "Thuốc lá";
  if (item.cat === "cigarettes") {
    removeCigarettes(1);
    affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_CARGO;
    giftName = "Thuốc lá";
  } else if (item.cat === "gasoline") {
    removeGasoline(1);
    affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_CARGO;
    giftName = "Xăng";
  } else if (item.cat === "pureEnergy") {
    removePureEnergy(1);
    affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_CARGO;
    giftName = "Năng lượng tinh khiết";
  } else {
    const arr = catMap[item.cat];
    const targetItem = arr[item.idx];
    if (targetItem && (targetItem.count || 1) > 1) {
      targetItem.count = (targetItem.count || 1) - 1;
    } else {
      arr.splice(item.idx, 1);
    }
    if (item.cat === "food") affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_FOOD;
    else if (item.cat === "drinks") affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_DRINKS;
    else if (item.cat === "medicine") affinityGain = GAME_CONSTANTS.NPC.GIFT_AFFINITY_MEDICINE;
  }

  if (npcId === "lili") {
    if (item.cat === "food" || item.cat === "drinks") {
      affinityGain = GAME_CONSTANTS.NPC.LILI_GIFT_AFFINITY_FOOD;
    } else if (item.cat === "medicine") {
      affinityGain = GAME_CONSTANTS.NPC.LILI_GIFT_AFFINITY_MEDICINE;
    }
  }

  addNpcAffinity(npcId, affinityGain);
  let affinity = getNpcAffinity(npcId);
  if (npcId === "lili") {
    setStory(`Bạn đã tặng ${giftName}. ${giftName} được Lilith yêu thích. Điểm thân mật +${affinityGain}(Hiện tại ${affinity}/${AFFINITY_MAX.lili})`);
  } else {
    setStory(`Bạn đã tặng ${giftName}. Điểm thân mật +${affinityGain}(Hiện tại ${affinity}/${AFFINITY_MAX[npcId]})`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Nhiệm vụ treo thưởng ----------

function checkQuestRequire(state, quest) {
  const req = quest.require;
  if (!req) return { met: true, current: 0, target: 0 };
  const results = [];

  if (req.food) {
    const have = state.food.reduce((sum, i) => sum + (i.count || 1), 0);
    results.push({ met: have >= req.food, current: have, target: req.food });
  }
  if (req.drinks) {
    if (req.drinkId) {
      const have = state.drinks.filter(d => d.id === req.drinkId).reduce((sum, d) => sum + (d.count || 1), 0);
      results.push({ met: have >= req.drinks, current: have, target: req.drinks });
    } else {
      const have = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);
      results.push({ met: have >= req.drinks, current: have, target: req.drinks });
    }
  }
  if (req.medicine) {
    if (req.medicineId) {
      const have = state.medicine.filter(m => m.id === req.medicineId).reduce((sum, m) => sum + (m.count || 1), 0);
      results.push({ met: have >= req.medicine, current: have, target: req.medicine });
    } else {
      const have = state.medicine.reduce((sum, m) => sum + (m.count || 1), 0);
      results.push({ met: have >= req.medicine, current: have, target: req.medicine });
    }
  }
  if (req.items) {
    let allMet = true;
    let totalCurrent = 0;
    let totalTarget = 0;
    for (const itemReq of req.items) {
      const have = state[itemReq.type].filter(i => i.id === itemReq.id).reduce((sum, i) => sum + (i.count || 1), 0);
      if (have < itemReq.count) allMet = false;
      totalCurrent += Math.min(have, itemReq.count);
      totalTarget += itemReq.count;
    }
    results.push({ met: allMet, current: totalCurrent, target: totalTarget });
  }
  if (req.allCanned) {
    const have = CANNED_FOOD_IDS.filter(id => state.food.some(f => f.id === id)).length;
    results.push({ met: have >= CANNED_FOOD_IDS.length, current: have, target: CANNED_FOOD_IDS.length });
  }
  if (req.allFruits) {
    const fruitIds = FRUITS.map(f => f.id);
    const have = fruitIds.filter(id => state.food.some(f => f.id === id)).length;
    results.push({ met: have >= fruitIds.length, current: have, target: fruitIds.length });
  }
  if (req.allDrinks) {
    const drinkIds = DRINKS.map(d => d.id);
    const have = drinkIds.filter(id => state.drinks.some(d => d.id === id)).length;
    if (req.allFoods) {
      const foodIds = FOODS.map(f => f.id);
      const foodHave = foodIds.filter(id => state.food.some(f => f.id === id)).length;
      results.push({ met: have >= drinkIds.length && foodHave >= foodIds.length, current: have + foodHave, target: drinkIds.length + foodIds.length });
    } else {
      results.push({ met: have >= drinkIds.length, current: have, target: drinkIds.length });
    }
  }
  if (req.allMedicine) {
    const medIds = MEDICINES.map(m => m.id);
    const have = medIds.filter(id => {
      const med = state.medicine.find(m => m.id === id);
      return med && (med.count || 1) >= 2;
    }).length;
    results.push({ met: have >= medIds.length, current: have, target: medIds.length });
  }

  if (results.length === 0) return { met: true, current: 0, target: 0 };
  const allMet = results.every(r => r.met);
  const totalCurrent = results.reduce((s, r) => s + r.current, 0);
  const totalTarget = results.reduce((s, r) => s + r.target, 0);
  return { met: allMet, current: totalCurrent, target: totalTarget };
}

function removeQuestItems(state, quest) {
  const req = quest.require;
  if (!req) return;

  function removeStackableItems(arr, count, filterFn) {
    let remaining = count;
    for (let i = arr.length - 1; i >= 0 && remaining > 0; i--) {
      if (!filterFn || filterFn(arr[i])) {
        const available = arr[i].count || 1;
        if (available <= remaining) {
          arr.splice(i, 1);
          remaining -= available;
        } else {
          arr[i].count = available - remaining;
          remaining = 0;
        }
      }
    }
  }

  if (req.food) {
    removeStackableItems(state.food, req.food);
  }
  if (req.drinks) {
    if (req.drinkId) {
      removeStackableItems(state.drinks, req.drinks, d => d.id === req.drinkId);
    } else {
      removeStackableItems(state.drinks, req.drinks);
    }
  }
  if (req.medicine) {
    if (req.medicineId) {
      removeStackableItems(state.medicine, req.medicine, m => m.id === req.medicineId);
    } else {
      removeStackableItems(state.medicine, req.medicine);
    }
  }
  if (req.items) {
    for (const itemReq of req.items) {
      removeStackableItems(state[itemReq.type], itemReq.count, i => i.id === itemReq.id);
    }
  }
  if (req.allCanned) {
    for (const id of CANNED_FOOD_IDS) {
      const idx = state.food.findIndex(f => f.id === id);
      if (idx !== -1) {
        const item = state.food[idx];
        if ((item.count || 1) > 1) {
          item.count = (item.count || 1) - 1;
        } else {
          state.food.splice(idx, 1);
        }
      }
    }
  }
  if (req.allFruits) {
    const fruitIds = FRUITS.map(f => f.id);
    for (const id of fruitIds) {
      const idx = state.food.findIndex(f => f.id === id);
      if (idx !== -1) {
        const item = state.food[idx];
        if ((item.count || 1) > 1) {
          item.count = (item.count || 1) - 1;
        } else {
          state.food.splice(idx, 1);
        }
      }
    }
  }
  if (req.allDrinks) {
    const drinkIds = DRINKS.map(d => d.id);
    for (const id of drinkIds) {
      const idx = state.drinks.findIndex(d => d.id === id);
      if (idx !== -1) {
        const item = state.drinks[idx];
        if ((item.count || 1) > 1) {
          item.count = (item.count || 1) - 1;
        } else {
          state.drinks.splice(idx, 1);
        }
      }
    }
  }
  if (req.allFoods) {
    const foodIds = FOODS.map(f => f.id);
    for (const id of foodIds) {
      const idx = state.food.findIndex(f => f.id === id);
      if (idx !== -1) {
        const item = state.food[idx];
        if ((item.count || 1) > 1) {
          item.count = (item.count || 1) - 1;
        } else {
          state.food.splice(idx, 1);
        }
      }
    }
  }
  if (req.allMedicine) {
    const medIds = MEDICINES.map(m => m.id);
    for (const id of medIds) {
      const idx = state.medicine.findIndex(m => m.id === id);
      if (idx !== -1) {
        const item = state.medicine[idx];
        if ((item.count || 1) > 2) {
          item.count = (item.count || 1) - 2;
        } else {
          state.medicine.splice(idx, 1);
        }
      }
    }
  }
}

function giveQuestReward(state, quest) {
  const rw = quest.reward;
  if (!rw) return;
  if (rw.item) {
    const meleeWeapon = MELEE_WEAPONS.find(w => w.name === rw.item);
    if (meleeWeapon) {
      addItem({ ...meleeWeapon, currentDurability: meleeWeapon.durability });
    }
    const rangedWeapon = RANGED_WEAPONS.find(w => w.id === rw.item);
    if (rangedWeapon) {
      addItem({ ...rangedWeapon });
    }
  }
  if (rw.ammo) {
    const ammoDef = AMMO.find(a => a.id === rw.ammo.type);
    if (ammoDef) {
      addItem({ id: ammoDef.id, name: ammoDef.name, type: "ammo", count: rw.ammo.count });
    }
  }
  if (rw.itemStack) {
    for (const stack of rw.itemStack) {
      const med = MEDICINES.find(m => m.id === stack.id);
      if (med) {
        for (let i = 0; i < stack.count; i++) addItem({ ...med });
      }
      const food = FOODS.find(f => f.id === stack.id);
      if (food) {
        for (let i = 0; i < stack.count; i++) addItem({ ...food });
      }
      const drink = DRINKS.find(d => d.id === stack.id);
      if (drink) {
        for (let i = 0; i < stack.count; i++) addItem({ ...drink });
      }
    }
  }
  if (rw.cigarettes) {
    addCigarettes(rw.cigarettes);
  }
}

export function getQuestProgress(state, quest) {
  const check = checkQuestRequire(state, quest);
  return check.current;
}

export function canSubmitQuest(state, quest) {
  const check = checkQuestRequire(state, quest);
  return check.met;
}

export function handleNpcQuest() {
  const state = getState();
  const npcId = state._currentNpc;
  const quest = getAvailableQuest(npcId);
  if (!quest) {
    setStory("Hiện tại không có nhiệm vụ treo thưởng nào có thể nhận.");
    handleNpcAction("chat");
    return;
  }
  const check = checkQuestRequire(state, quest);
  const npcName = SURVIVOR_NPC.find(n => n.id === npcId)?.name || "NPC";
  let desc = `📋 [${quest.name}]\n`;
  desc += `━━━━━━━━━━━━━━━━━\n`;
  desc += `📝 ${quest.desc}\n\n`;
  desc += `📊 Tiến độ: ${check.current}/${check.target}\n`;
  desc += `🏆 Phần thưởng: ${quest.reward?.desc || "Không"}`;
  if (quest.story) {
    desc += `\n\n💬 ${quest.story}`;
  }
  setPhase("npc_quest");
  setStory(desc);
  const opts = [];
  if (check.met) {
    opts.push({ text: "✅ Nộp nhiệm vụ", action: "quest_confirm" });
  }
  opts.push({ text: "📋 Xem chi tiết nhiệm vụ", action: "quest_preview" });
  opts.push({ text: "Lần sau hãy đến", action: "quest_back" });
  setOptions(opts);
}

export function handleNpcQuestConfirm() {
  const state = getState();
  const npcId = state._currentNpc;
  const quest = getAvailableQuest(npcId);
  if (!quest || !canSubmitQuest(state, quest)) {
    setStory("Điều kiện nhiệm vụ chưa đạt.");
    handleNpcAction("chat");
    return;
  }
  removeQuestItems(state, quest);
  giveQuestReward(state, quest);
  addNpcAffinity(npcId, GAME_CONSTANTS.NPC.QUEST_AFFINITY_REWARD);
  const newAffinity = getNpcAffinity(npcId);
  markQuestDone(quest.id);
  const npcName = SURVIVOR_NPC.find(n => n.id === npcId)?.name || "NPC";
  setStory(`🎉 Bạn đã hoàn thành treo thưởng[${quest.name}]của ${npcName}!\n\n🏆 Nhận phần thưởng: ${quest.reward?.desc || "Không"}\n💝 Điểm thân mật +${GAME_CONSTANTS.NPC.QUEST_AFFINITY_REWARD}(Hiện tại ${newAffinity}/${AFFINITY_MAX[npcId]})`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleNpcQuestPreview() {
  const state = getState();
  const npcId = state._currentNpc;
  const quest = getAvailableQuest(npcId);
  if (!quest) {
    setStory("Hiện tại không có nhiệm vụ treo thưởng nào có thể nhận.");
    handleNpcAction("chat");
    return;
  }
  const check = checkQuestRequire(state, quest);
  const detailLines = [];
  detailLines.push(`📋 [${quest.name}]`);
  detailLines.push(`━━━━━━━━━━━━━━━━━`);
  detailLines.push(`📝 ${quest.desc}`);
  detailLines.push(``);
  detailLines.push(`📊 Tiến độ hiện tại: ${check.current}/${check.target}`);
  detailLines.push(``);
  detailLines.push(`🏆 Phần thưởng nhiệm vụ: ${quest.reward?.desc || "Không"}`);
  detailLines.push(`💝 Điểm thân mật thêm: +${GAME_CONSTANTS.NPC.QUEST_AFFINITY_REWARD}`);
  if (quest.story) {
    detailLines.push(``);
    detailLines.push(`💬 ${quest.story}`);
  }
  setPhase("npc_quest_preview");
  setStory(detailLines.join("\n"));
  const opts = [];
  if (check.met) {
    opts.push({ text: "✅ Nộp nhiệm vụ", action: "quest_confirm" });
  }
  opts.push({ text: "Quay lại", action: "quest_back" });
  setOptions(opts);
}

export function handleNpcRecycle() {
  const state = getState();
  const npcId = state._currentNpc;
  const meleeItems = state.other.filter(item => item.type === "melee" && item.id !== DEFAULT_ITEM_IDS.melee);
  if (meleeItems.length === 0) {
    if (npcId === "lili") {
      setStory("Lilith lật xem balo của bạn: \"Không có vũ khí phế liệu nào cả... bạn đi nhà máy tìm xem?\"");
    } else {
      setStory("Bạn không có vũ khí cận chiến nào có thể thu hồi.");
    }
    handleNpcAction("chat");
    return;
  }
  setPhase("npc_recycle");
  const opts = meleeItems.map((item, i) => ({
    text: `${item.name}(Sát thương:${item.damage} Độ bền hiện tại:${item.currentDurability}/${item.durability})`,
    action: "recycle_confirm",
    index: i
  }));
  opts.push({ text: "Quay lại", action: "recycle_back", index: -1 });
  const price = meleeItems[0] ? Math.max(1, Math.floor(meleeItems[0].damage / 10)) : 1;
  if (npcId === "lili") {
    setStory(`Lilith mắt sáng lên: \"Để tôi xem vũ khí của bạn!\" Cô ấy thành thạo lật xem trang bị cận chiến của bạn.\n\nChọn vũ khí cận chiến muốn thu hồi (tính giá theo sát thương):\nVũ khí thường: ${price} điếu thuốc lá/món`);
  } else {
    setStory(`Chọn vũ khí cận chiến muốn thu hồi (tính giá theo sát thương):\n\nVũ khí thường: ${price} điếu thuốc lá/món`);
  }
  setOptions(opts);
}

export function handleRecycleConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) { handleNpcAction("chat"); return; }
  const option = state.options[optionIndex];
  if (option.action === "recycle_back") { handleNpcAction("chat"); return; }
  const meleeItems = state.other.filter(item => item.type === "melee" && item.id !== DEFAULT_ITEM_IDS.melee);
  const item = meleeItems[option.index];
  if (!item) { handleNpcAction("chat"); return; }
  const price = Math.max(1, Math.floor(item.damage / GAME_CONSTANTS.NPC.RECYCLE_MELEE_DIVISOR));
  addCigarettes(price);
  removeItem("other", state.other.indexOf(item));
  const npcId = state._currentNpc;
  if (npcId === "lili") {
    setStory(`Lilith nhận lấy ${item.name}, yêu thích ngắm nghía một hồi, rồi lấy từ túi ra ${price} điếu thuốc lá đưa cho bạn: \"Đồ tốt! Cái này thuộc về tôi, thuốc lá cho bạn~\"`);
  } else {
    setStory(`Bạn thu hồi ${item.name}, nhận được ${price} điếu thuốc lá.`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleNpcRecycleRanged() {
  const state = getState();
  const npcId = state._currentNpc;
  const rangedItems = state.other.filter(item => item.type === "ranged");
  if (rangedItems.length === 0) {
    if (npcId === "lili") {
      setStory("Lilith lật xem balo của bạn: \"Không có vũ khí tầm xa nào để thu hồi cả... đi đồn cảnh sát hoặc trạm kiểm soát quân sự tìm xem?\"");
    } else {
      setStory("Bạn không có vũ khí tầm xa nào có thể thu hồi.");
    }
    handleNpcAction("chat");
    return;
  }
  setPhase("npc_recycle_ranged");
  const opts = rangedItems.map((item, i) => ({
    text: `${item.name}(Sát thương:${item.damage} Đạn dược:${item.ammoType})`,
    action: "recycle_ranged_confirm",
    index: i
  }));
  opts.push({ text: "Quay lại", action: "recycle_ranged_back", index: -1 });
  if (npcId === "lili") {
    setStory("Lilith hào hứng xoa tay: \"Linh kiện vũ khí tầm xa đáng giá nhất!\" Cô ấy cẩn thận kiểm tra vũ khí tầm xa của bạn.\n\nChọn vũ khí tầm xa muốn thu hồi:");
  } else {
    setStory("Chọn vũ khí tầm xa muốn thu hồi:");
  }
  setOptions(opts);
}

export function handleRecycleRangedConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) { handleNpcAction("chat"); return; }
  const option = state.options[optionIndex];
  if (option.action === "recycle_ranged_back") { handleNpcAction("chat"); return; }
  const rangedItems = state.other.filter(item => item.type === "ranged");
  const item = rangedItems[option.index];
  if (!item) { handleNpcAction("chat"); return; }
  const price = Math.max(1, Math.floor(item.damage / GAME_CONSTANTS.NPC.RECYCLE_RANGED_DIVISOR));
  addCigarettes(price);
  removeItem("other", state.other.indexOf(item));
  const npcId = state._currentNpc;
  if (npcId === "lili") {
    setStory(`Lilith cẩn thận tháo dỡ ${item.name}, cất linh kiện vào kho, rồi đưa cho bạn ${price} điếu thuốc lá: "Những linh kiện này có thể làm được rất nhiều thứ! Thuốc lá bạn cầm đi~"`);
  } else {
    setStory(`Bạn thu hồi ${item.name}, nhận được ${price} điếu thuốc lá.`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleNpcRecycleBackpack() {
  const state = getState();
  const npcId = state._currentNpc;
  const backpackItems = state.other.filter(item => item.type === "backpack");
  if (backpackItems.length === 0) {
    if (npcId === "lili") {
      setStory("Lilith lật xem balo của bạn: \"Không có balo dư nào để thu hồi cả... khi đi thám hiểm hãy chú ý hơn nhé~\"");
    } else {
      setStory("Bạn không có balo dư nào có thể thu hồi.");
    }
    handleNpcAction("chat");
    return;
  }
  setPhase("npc_recycle_backpack");
  const opts = backpackItems.map((item, i) => {
    const price = 1 + Math.round(item.capacity / 20);
    return {
      text: `${item.name}(Dung lượng:${item.capacity} → ${price} điếu thuốc lá)`,
      action: "recycle_backpack_confirm",
      index: i
    };
  });
  opts.push({ text: "Quay lại", action: "recycle_backpack_back", index: -1 });
  if (npcId === "lili") {
    setStory("Lilith vỗ vỗ balo của bạn: \"Balo dư cũng có thể đổi thuốc lá này! Balo dung lượng càng lớn càng đáng giá nhé~\"\n\nChọn balo muốn thu hồi (tính theo 1+dung lượng÷20 làm tròn):");
  } else {
    setStory("Chọn balo muốn thu hồi (tính theo 1+dung lượng÷20 làm tròn):");
  }
  setOptions(opts);
}

export function handleRecycleBackpackConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) { handleNpcAction("chat"); return; }
  const option = state.options[optionIndex];
  if (option.action === "recycle_backpack_back") { handleNpcAction("chat"); return; }
  const backpackItems = state.other.filter(item => item.type === "backpack");
  const item = backpackItems[option.index];
  if (!item) { handleNpcAction("chat"); return; }
  const price = 1 + Math.round(item.capacity / 20);
  addCigarettes(price);
  removeItem("other", state.other.indexOf(item));
  const npcId = state._currentNpc;
  if (npcId === "lili") {
    setStory(`Lilith nhận lấy ${item.name}, cân nặng: \"Balo dung lượng ${item.capacity}, đáng ${price} điếu thuốc!\" Cô ấy nhét balo vào kho, đưa cho bạn ${price} điếu thuốc lá: \"Lần sau tìm được balo dung lượng lớn hơn hãy đến tìm tôi nhé~`);
  } else {
    setStory(`Bạn thu hồi ${item.name}, nhận được ${price} điếu thuốc lá.`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Sửa chữa ----------

export function handleNpcRepair() {
  const state = getState();
  const npcId = state._currentNpc;
  if (state.meleeWeapon.id === DEFAULT_ITEM_IDS.melee) {
    setStory("Hiện tại bạn không có vũ khí nào có thể sửa chữa.");
    handleNpcAction("chat");
    return;
  }
  const rawCost = Math.max(1, Math.floor((state.meleeWeapon.durability - state.meleeWeapon.currentDurability) / GAME_CONSTANTS.NPC.REPAIR_MELEE_DIVISOR) + 1);
  const cost = getCaptainDiscountCost(state, npcId, rawCost);
  const cigCount = state.cigarettes;
  setPhase("npc_repair");
  setStory(`Sửa chữa ${state.meleeWeapon.name} cần ${cost} điếu thuốc lá${npcId === "lili" && hasDawnCaptainBadge(state) ? "(Giảm giá 50% cho Thuyền trưởng Dawn)" : ""}(Độ bền hồi đầy).\nBạn có ${cigCount} điếu thuốc lá.`);
  setOptions([
    { text: cigCount >= cost ? "🔧 Xác nhận sửa chữa" : "🔧 Xác nhận sửa chữa(Thiếu thuốc lá)", action: "repair_confirm", disabled: cigCount < cost },
    { text: "Quay lại", action: "repair_back" },
  ]);
}

export function handleRepairConfirm() {
  const state = getState();
  const npcId = state._currentNpc;
  const rawCost = Math.max(1, Math.floor((state.meleeWeapon.durability - state.meleeWeapon.currentDurability) / GAME_CONSTANTS.NPC.REPAIR_MELEE_DIVISOR) + 1);
  const cost = getCaptainDiscountCost(state, npcId, rawCost);
  if (state.cigarettes < cost) {
    setStory("Bạn không có đủ thuốc lá để trả phí sửa chữa.");
    handleNpcAction("chat");
    return;
  }
  removeCigarettes(cost);
  state.meleeWeapon.currentDurability = state.meleeWeapon.durability;
  setStory(`${state.meleeWeapon.name} đã sửa xong, độ bền đã hồi đầy.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export function handleNpcRepairBow() {
  const state = getState();
  const npcId = state._currentNpc;
  if (!state.rangedWeapon) {
    setStory("Hiện tại bạn chưa trang bị vũ khí tầm xa.");
    handleNpcAction("chat");
    return;
  }
  const rawCost = Math.max(1, Math.floor((100 - state.rangedWeapon.integrity) / GAME_CONSTANTS.NPC.REPAIR_RANGED_DIVISOR) + 1);
  const cost = getCaptainDiscountCost(state, npcId, rawCost);
  const cigCount = state.cigarettes;
  setPhase("npc_repair_bow");
  setStory(`Sửa chữa ${state.rangedWeapon.name} cần ${cost} điếu thuốc lá${npcId === "lili" && hasDawnCaptainBadge(state) ? "(Giảm giá 50% cho Thuyền trưởng Dawn)" : ""}(Độ nguyên vẹn hồi về 100%).\nBạn có ${cigCount} điếu thuốc lá.`);
  setOptions([
    { text: cigCount >= cost ? "🔧 Xác nhận sửa chữa" : "🔧 Xác nhận sửa chữa(Thiếu thuốc lá)", action: "repair_bow_confirm", disabled: cigCount < cost },
    { text: "Quay lại", action: "repair_bow_back" },
  ]);
}

export function handleRepairBowConfirm() {
  const state = getState();
  const npcId = state._currentNpc;
  const rawCost = Math.max(1, Math.floor((100 - state.rangedWeapon.integrity) / GAME_CONSTANTS.NPC.REPAIR_RANGED_DIVISOR) + 1);
  const cost = getCaptainDiscountCost(state, npcId, rawCost);
  if (state.cigarettes < cost) {
    setStory("Bạn không có đủ thuốc lá để trả phí sửa chữa.");
    handleNpcAction("chat");
    return;
  }
  removeCigarettes(cost);
  state.rangedWeapon.integrity = 100;
  setStory(`${state.rangedWeapon.name} đã sửa xong, độ nguyên vẹn đã hồi đầy.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Lilith sửa chữa súng ----------

function handleLiliRepairGun() {
  const state = getState();
  const config = getNpcConfig();
  if (!config?.repairQuest) { handleNpcAction("chat"); return; }

  if (!state.rangedWeapon) {
    setStory("Lilith xem trang bị của bạn: \"Bạn còn chưa trang bị vũ khí tầm xa, sửa thế nào?\"");
    handleNpcAction("chat");
    return;
  }
  if (state.rangedWeapon.ammoType === "mui_ten") {
    setStory("Lilith xua tay: \"Đây là cung nỏ, không phải súng! Sửa cung nỏ chọn tùy chọn khác nhé~\"");
    handleNpcAction("chat");
    return;
  }

  const questCfg = config.repairQuest;
  const rawCost = questCfg.cost;
  const cost = getCaptainDiscountCost(state, "lili", rawCost);
  const repairAmount = questCfg.repair;
  const cigCount = state.cigarettes;
  setPhase("lili_repair_gun");
  setStory(`Lilith nhận lấy ${state.rangedWeapon.name} của bạn kiểm tra kỹ: \"Ừm... độ nguyên vẹn còn ${state.rangedWeapon.integrity}%. Giao cho tôi đi!\"\n\n${questCfg.desc.replace(`${rawCost} điếu`, `${cost} điếu`)}${hasDawnCaptainBadge(state) ? "\n\n💡 Giảm giá Thuyền trưởng Dawn: giá giảm một nửa!" : ""}\nBạn có ${cigCount} điếu thuốc lá.`);
  setOptions([
    { text: cigCount >= cost ? "🔧 Xác nhận sửa chữa" : "🔧 Xác nhận sửa chữa(Thiếu thuốc lá)", action: "lili_repair_gun_confirm", disabled: cigCount < cost },
    { text: "Quay lại", action: "lili_repair_gun_back" },
  ]);
}

export function handleLiliRepairGunConfirm(input) {
  const state = getState();
  const config = getNpcConfig();
  if (!config?.repairQuest) { handleNpcAction("chat"); return; }

  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) { handleNpcAction("chat"); return; }
  const opt = state.options[optIdx];
  if (opt.action === "lili_repair_gun_back") { handleNpcAction("chat"); return; }

  const questCfg = config.repairQuest;
  const rawCost = questCfg.cost;
  const cost = getCaptainDiscountCost(state, "lili", rawCost);
  const repairAmount = questCfg.repair;

  if (state.cigarettes < cost) {
    setStory("Lilith mở tay: \"Thiếu thuốc lá rồi... đi thu hồi vũ khí đổi thuốc lá đi!\"");
    handleNpcAction("chat");
    return;
  }
  removeCigarettes(cost);
  state.rangedWeapon.integrity = Math.min(100, state.rangedWeapon.integrity + repairAmount);

  const storyText = (questCfg.story || "Lilith đã sửa xong vũ khí của bạn.").replace("{weapon}", state.rangedWeapon.name);
  setStory(`${storyText}\n\n${state.rangedWeapon.name} độ nguyên vẹn hồi về ${state.rangedWeapon.integrity}%.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Lilith sửa chữa cung nỏ ----------

function handleLiliRepairBow() {
  const state = getState();
  const config = getNpcConfig();
  if (!config?.repairBowQuest) { handleNpcAction("chat"); return; }

  if (!state.rangedWeapon) {
    setStory("Lilith xem trang bị của bạn: \"Bạn còn chưa trang bị vũ khí tầm xa, sửa thế nào?\"");
    handleNpcAction("chat");
    return;
  }
  if (state.rangedWeapon.ammoType !== "mui_ten") {
    setStory("Lilith nghiêng đầu: \"Đây là súng, không phải cung nỏ! Sửa súng chọn tùy chọn khác nhé~\"");
    handleNpcAction("chat");
    return;
  }

  const questCfg = config.repairBowQuest;
  const rawCost = questCfg.cost;
  const cost = getCaptainDiscountCost(state, "lili", rawCost);
  const repairAmount = questCfg.repair;
  const cigCount = state.cigarettes;
  setPhase("lili_repair_bow");
  setStory(`Lilith nhận lấy ${state.rangedWeapon.name} của bạn kiểm tra kỹ: \"Cung nỏ là thế mạnh của tôi!\"\n\n${questCfg.desc.replace(`${rawCost} điếu`, `${cost} điếu`)}${hasDawnCaptainBadge(state) ? "\n\n💡 Giảm giá Thuyền trưởng Dawn: giá giảm một nửa!" : ""}\nBạn có ${cigCount} điếu thuốc lá.`);
  setOptions([
    { text: cigCount >= cost ? "🔧 Xác nhận sửa chữa" : "🔧 Xác nhận sửa chữa(Thiếu thuốc lá)", action: "lili_repair_bow_confirm", disabled: cigCount < cost },
    { text: "Quay lại", action: "lili_repair_bow_back" },
  ]);
}

export function handleLiliRepairBowConfirm(input) {
  const state = getState();
  const config = getNpcConfig();
  if (!config?.repairBowQuest) { handleNpcAction("chat"); return; }

  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) { handleNpcAction("chat"); return; }
  const opt = state.options[optIdx];
  if (opt.action === "lili_repair_bow_back") { handleNpcAction("chat"); return; }

  const questCfg = config.repairBowQuest;
  const rawCost = questCfg.cost;
  const cost = getCaptainDiscountCost(state, "lili", rawCost);
  const repairAmount = questCfg.repair;

  if (state.cigarettes < cost) {
    setStory("Lilith mở tay: \"Thiếu thuốc lá rồi... đi thu hồi vũ khí đổi thuốc lá đi!\"");
    handleNpcAction("chat");
    return;
  }
  removeCigarettes(cost);
  state.rangedWeapon.integrity = Math.min(100, state.rangedWeapon.integrity + repairAmount);

  const storyText = (questCfg.story || "Lilith đã sửa xong cung nỏ của bạn.").replace("{weapon}", state.rangedWeapon.name);
  setStory(`${storyText}\n\n${state.rangedWeapon.name} độ nguyên vẹn hồi về ${state.rangedWeapon.integrity}%.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Chữa trị nhiễm trùng ----------

export function handleNpcCureInfection() {
  const state = getState();
  const npcId = state._currentNpc;
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  const questCfg = config?.cureInfectionQuest;

  if (state.infection <= 0) {
    if (npcId === "lili") {
      setStory("Lilith xem cánh tay bạn: \"Bạn không bị nhiễm trùng đâu, đừng dọa mình nhé~\"");
    } else {
      setStory("Bạn không bị nhiễm trùng, không cần chữa trị.");
    }
    handleNpcAction("chat");
    return;
  }

  let rawCost, cureAmount;
  if (questCfg) {
    rawCost = questCfg.cost;
    cureAmount = questCfg.cureAmount;
  } else {
    rawCost = Math.max(1, Math.floor(state.infection / GAME_CONSTANTS.NPC.DEFAULT_CURE_DIVISOR) + 1);
    cureAmount = GAME_CONSTANTS.NPC.DEFAULT_CURE_AMOUNT;
  }
  const cost = getCaptainDiscountCost(state, npcId, rawCost);
  const cigCount = state.cigarettes;
  setPhase("npc_cure");
  if (npcId === "lili" && questCfg) {
    setStory(`Lilith cau mày đánh giá bạn: \"Nhiễm trùng không phải chuyện đùa!\" Cô ấy lấy từ hộp thuốc ra một ống thuốc màu vàng nhạt.\n\n${questCfg.desc}${hasDawnCaptainBadge(state) ? "\n\n💡 Giảm giá Thuyền trưởng Dawn: giá chữa trị giảm một nửa!" : ""}\nBạn có ${cigCount} điếu thuốc lá.`);
  } else {
    setStory(`Chữa trị nhiễm trùng cần ${cost} điếu thuốc lá${npcId === "lili" && hasDawnCaptainBadge(state) ? "(Giảm giá 50% cho Thuyền trưởng Dawn)" : ""}(Giá trị nhiễm trùng hiện tại: ${state.infection}%).\nBạn có ${cigCount} điếu thuốc lá.`);
  }
  setOptions([
    { text: cigCount >= cost ? "💊 Xác nhận chữa trị" : "💊 Xác nhận chữa trị(Thiếu thuốc lá)", action: "cure_confirm", disabled: cigCount < cost },
    { text: "Quay lại", action: "cure_back" },
  ]);
}

export function handleCureConfirm() {
  const state = getState();
  const npcId = state._currentNpc;
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  const questCfg = config?.cureInfectionQuest;

  let rawCost, cureAmount;
  if (questCfg) {
    rawCost = questCfg.cost;
    cureAmount = questCfg.cureAmount;
  } else {
    rawCost = Math.max(1, Math.floor(state.infection / GAME_CONSTANTS.NPC.DEFAULT_CURE_DIVISOR) + 1);
    cureAmount = GAME_CONSTANTS.NPC.DEFAULT_CURE_AMOUNT;
  }
  const cost = getCaptainDiscountCost(state, npcId, rawCost);

  if (state.cigarettes < cost) {
    if (npcId === "lili") {
      setStory("Lilith thở dài: \"Thiếu thuốc lá rồi... dược liệu tôi cần cũng phải dùng thuốc lá để đổi đấy.\"");
    } else {
      setStory("Bạn không có đủ thuốc lá để trả phí chữa trị.");
    }
    handleNpcAction("chat");
    return;
  }
  removeCigarettes(cost);
  state.infection = Math.max(0, state.infection - cureAmount);
  if (npcId === "lili" && questCfg) {
    setStory(`${questCfg.story}\n\nGiá trị nhiễm trùng đã giảm ${cureAmount}%(Giá trị nhiễm trùng hiện tại: ${state.infection}%).Lilith thở phào: \"Sợ chết tôi, sau này cẩn thận hơn nhé!\"`);
  } else {
    setStory(`Chữa trị hoàn tất! Giá trị nhiễm trùng đã giảm ${cureAmount}%(Giá trị nhiễm trùng hiện tại: ${state.infection}%).`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

// ---------- Lilith quà bí ẩn ----------

function handleLiliGiftClaim() {
  const state = getState();
  const npcId = "lili";
  const config = SURVIVOR_NPC.find(n => n.id === npcId);
  if (!config || !config.giftQuest) { handleNpcAction("chat"); return; }

  if (isQuestDone("llGift")) {
    setStory("Lilith lắc đầu: \"Quà bạn đã nhận rồi, đừng tham lam nhé~\"");
    handleNpcAction("chat");
    return;
  }

  const affinity = getNpcAffinity(npcId);
  if (affinity < config.giftQuest.reqAffection) {
    setStory(`Lilith nghiêng đầu nhìn bạn: \"Ừm... mối quan hệ của chúng ta chưa đủ tốt đâu(điểm thân mật${affinity}/${config.giftQuest.reqAffection}), hãy cùng tôi nói chuyện thêm nhé~\"`);
    handleNpcAction("chat");
    return;
  }

  markQuestDone("llGift");

  const reward = config.giftQuest.reward;
  const rewardNames = [];

  if (reward.cigarettes) {
    addCigarettes(reward.cigarettes);
    rewardNames.push(`Thuốc lá×${reward.cigarettes}`);
  }

  if (reward.ammo) {
    const ammoDef = AMMO.find(a => a.id === reward.ammo.type);
    if (ammoDef) {
      addItem({ id: ammoDef.id, name: ammoDef.name, type: "ammo", count: reward.ammo.count });
      rewardNames.push(`${ammoDef.name}×${reward.ammo.count}`);
    }
  }

  const storyText = config.giftQuest.story || "Lilith đưa cho bạn một món quà.";
  setStory(`${storyText}\n\n🎁 Nhận phần thưởng: ${rewardNames.join(", ")}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleNpcAction("chat");
  }
}

export {
  getNpcConfig,
  npcHeader,
  handleLiliGiftClaim,
};
