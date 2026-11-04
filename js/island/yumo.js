import {
  getState, setPhase, setStory, setOptions,
  addItem, addRoyalCoins, advanceTime, updateStatusEffects, checkDeath,
  addNpcAffinity, getNpcAffinity, getAffinityLabel, getAffinityStage,
  canChatToday, incrementChatCount, isQuestDone, markQuestDone,
  removeItemById,
} from '../state.js';

import { GAME_CONSTANTS, AFFINITY_MAX } from '../config.js';

import { YUMO_DIALOGUES } from '../data/dialogues/map-dialogues.js';
import { YUMO_QUEST_STORIES } from '../data/dialogues/yumo-dialogues.js';

import { refreshIslandMenu } from './index.js';

function randomDialogue(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function handleNpcYumo() {
  const state = getState();
  const affinity = getNpcAffinity("yumo");
  const friendshipLabel = getAffinityLabel(affinity);
  const stage = getAffinityStage(affinity);
  const pool = YUMO_DIALOGUES[stage] || YUMO_DIALOGUES.stranger;
  const dialogue = randomDialogue(pool);

  let desc = `[Công tước Yu Mo]\nMột quý tộc mặc hoa phục, cử chỉ toát lên uy nghi trời sinh. Trong ánh mắt ông vừa có sự thong dong của kẻ bề trên, vừa ẩn giấu một tia lo lắng khó nhận ra.`;
  desc += `\n\nHảo cảm hiện tại: ${affinity}/${AFFINITY_MAX.yumo}(${friendshipLabel})`;
  desc += `\n\n${dialogue}`;

  setPhase("island_yumo");
  setStory(desc);

  const opts = [
    { text: "Đối thoại", action: "yumo_chat" },
    { text: "Tặng quà", action: "yumo_gift" },
  ];

  if (!isQuestDone("yumoQuest1")) {
    opts.push({ text: "Nỗi phiền của công tước", action: "yumo_quest1" });
  } else if (!isQuestDone("yumoQuest2")) {
    opts.push({ text: "Nỗi phiền của công tước(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Thí nghiệm vương quốc", action: "yumo_quest2" });
  } else if (!isQuestDone("yumoQuest3")) {
    opts.push({ text: "Nỗi phiền của công tước(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Thí nghiệm vương quốc(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Quái vật biển đổ bộ", action: "yumo_quest3" });
  } else if (!isQuestDone("yumoQuest4")) {
    opts.push({ text: "Nỗi phiền của công tước(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Thí nghiệm vương quốc(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Quái vật biển đổ bộ(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Xây dựng đảo", action: "yumo_quest4" });
  } else if (!isQuestDone("yumoQuest5")) {
    opts.push({ text: "Nỗi phiền của công tước(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Thí nghiệm vương quốc(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Quái vật biển đổ bộ(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Xây dựng đảo(đã hoàn thành)", action: "yumo_quest_done", disabled: true });
    opts.push({ text: "Yến tiệc khánh công", action: "yumo_quest5" });
  } else {
    opts.push({ text: "Yến tiệc khánh công(đã hoàn thành)", action: "yumo_quest5_done", disabled: true });
  }

  opts.push({ text: "Rời đi", action: "yumo_leave" });

  setOptions(opts);
}

export function handleYumoAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "yumo_chat":
      handleYumoChat();
      break;
    case "yumo_gift":
      handleYumoGift();
      break;
    case "yumo_quest1":
      handleYumoQuest1();
      break;
    case "yumo_quest2":
      handleYumoQuest2();
      break;
    case "yumo_quest3":
      handleYumoQuest3();
      break;
    case "yumo_quest4":
      handleYumoQuest4();
      break;
    case "yumo_quest5":
      handleYumoQuest5();
      break;
    case "yumo_quest5_done":
      setStory("Công tước Yu Mo mỉm cười nâng ly: 'Yến tiệc khánh công ngày đó thật khó quên…… Cảm ơn bạn, bạn của tôi.'");
      handleNpcYumo();
      break;
    case "yumo_gift_food":
      handleYumoGiftConfirm("food", 3);
      break;
    case "yumo_gift_drinks":
      handleYumoGiftConfirm("drinks", 3);
      break;
    case "yumo_gift_medicine":
      handleYumoGiftConfirm("medicine", 5);
      break;
    case "yumo_gift_cigs":
      handleYumoGiftCigs();
      break;
    case "yumo_gift_continue":
    case "yumo_quest_continue":
      handleNpcYumo();
      break;
    case "yumo_gift_back":
      handleNpcYumo();
      break;
    case "yumo_leave":
      refreshIslandMenu();
      break;
    default:
      handleNpcYumo();
      break;
  }
}

export function handleYumoChat() {
  const state = getState();
  if (!canChatToday("yumo")) {
    setStory("Công tước Yu Mo xua tay: 'Hôm nay đã nói chuyện rất nhiều rồi, ngày khác lại tự.'");
    handleNpcYumo();
    return;
  }
  incrementChatCount("yumo");
  addNpcAffinity("yumo", 1);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) handleNpcYumo();
}

export function handleYumoGift() {
  const state = getState();
  const opts = [];
  const hasFood = state.food && state.food.length > 0;
  const hasDrinks = state.drinks && state.drinks.length > 0;
  const hasMedicine = state.medicine && state.medicine.length > 0;
  const hasCigs = state.cigarettes > 0;

  if (hasFood) opts.push({ text: "Tặng thực phẩm(+3 hảo cảm)", action: "yumo_gift_food" });
  if (hasDrinks) opts.push({ text: "Tặng đồ uống(+3 hảo cảm)", action: "yumo_gift_drinks" });
  if (hasMedicine) opts.push({ text: "Tặng vật phẩm y tế(+5 hảo cảm)", action: "yumo_gift_medicine" });
  if (hasCigs) opts.push({ text: "Tặng thuốc lá(+2 hảo cảm)", action: "yumo_gift_cigs" });
  opts.push({ text: "Quay lại", action: "yumo_gift_back" });

  if (opts.length === 1) {
    setStory("Bạn lục khắp ba lô, phát hiện không có gì để tặng người……");
    handleNpcYumo();
    return;
  }

  setPhase("island_yumo");
  setStory("Bạn muốn tặng Công tước Yu Mo thứ gì?");
  setOptions(opts);
}

function handleYumoGiftConfirm(type, affinityGain) {
  const state = getState();
  const arr = type === "food" ? state.food : type === "drinks" ? state.drinks : state.medicine;
  if (!arr || arr.length === 0) {
    setStory("Bạn không có vật phẩm nào để tặng.");
    handleNpcYumo();
    return;
  }
  const item = arr[arr.length - 1];
  const itemName = item.name;
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    arr.pop();
  }
  addNpcAffinity("yumo", affinityGain);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn đem ${itemName} tặng cho Công tước Yu Mo. Ông khẽ gật đầu: 'Cảm ơn tấm lòng của bạn.'\n\nHảo cảm Công tước Yu Mo +${affinityGain}(hiện tại ${getNpcAffinity("yumo")}/${AFFINITY_MAX.yumo})`);
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_gift_continue" }]);
  }
}

function handleYumoGiftCigs() {
  const state = getState();
  if (state.cigarettes <= 0) {
    setStory("Bạn không có thuốc lá nào để tặng.");
    handleNpcYumo();
    return;
  }
  state.cigarettes--;
  addNpcAffinity("yumo", 2);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn đưa cho Công tước Yu Mo một điếu thuốc lá. Ông nhận lấy, khẽ ngửi: 'Chất lượng không tệ.'\n\nHảo cảm Công tước Yu Mo +2(hiện tại ${getNpcAffinity("yumo")}/${AFFINITY_MAX.yumo})`);
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_gift_continue" }]);
  }
}

export function handleYumoQuest1() {
  const state = getState();
  const gelCount = state.medicine.filter(i => i.id === "zombie_gel").reduce((sum, i) => sum + (i.count || 1), 0);
  const need = GAME_CONSTANTS.YUMO.QUEST1_GEL_COST;

  if (gelCount < need) {
    setStory(YUMO_QUEST_STORIES.quest1_intro + `\n\nVật phẩm cần: gel zombie ${gelCount}/${need}`);
    setPhase("island_yumo");
    setOptions([
      { text: "Đi thu thập gel", action: "yumo_leave" },
    ]);
    return;
  }

  removeItemById("medicine", "zombie_gel", need);
  markQuestDone("yumoQuest1");
  addRoyalCoins(GAME_CONSTANTS.YUMO.QUEST1_REWARD);
  setStory(YUMO_QUEST_STORIES.quest1_accept + `\n\nNhận ${GAME_CONSTANTS.YUMO.QUEST1_REWARD} tiền hoàng gia\nTiền hoàng gia hiện tại: ${getState().royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_quest_continue" }]);
  }
}

export function handleYumoQuest2() {
  const state = getState();
  const gelCount = state.medicine.filter(i => i.id === "zombie_gel").reduce((sum, i) => sum + (i.count || 1), 0);
  const need = GAME_CONSTANTS.YUMO.QUEST2_GEL_COST;

  if (gelCount < need) {
    setStory(YUMO_QUEST_STORIES.quest2_intro + `\n\nVật phẩm cần: gel zombie ${gelCount}/${need}`);
    setPhase("island_yumo");
    setOptions([
      { text: "Đi thu thập gel", action: "yumo_leave" },
    ]);
    return;
  }

  removeItemById("medicine", "zombie_gel", need);
  markQuestDone("yumoQuest2");
  addRoyalCoins(GAME_CONSTANTS.YUMO.QUEST2_REWARD);
  setStory(YUMO_QUEST_STORIES.quest2_accept + `\n\nNhận ${GAME_CONSTANTS.YUMO.QUEST2_REWARD} tiền hoàng gia\nTiền hoàng gia hiện tại: ${getState().royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_quest_continue" }]);
  }
}

export function handleYumoQuest3() {
  const state = getState();
  const kills = state.yumoDivingKills || 0;
  const need = GAME_CONSTANTS.YUMO.QUEST3_DIVING_KILLS;

  if (kills < need) {
    setStory(YUMO_QUEST_STORIES.quest3_intro + `\n\nTiến độ hiện tại: đã hạ ${kills}/${need} zombie lặn`);
    setPhase("island_yumo");
    setOptions([
      { text: "Đi dọn zombie", action: "yumo_leave" },
    ]);
    return;
  }

  markQuestDone("yumoQuest3");
  addRoyalCoins(GAME_CONSTANTS.YUMO.QUEST3_REWARD);
  setStory(YUMO_QUEST_STORIES.quest3_complete + `\n\nNhận ${GAME_CONSTANTS.YUMO.QUEST3_REWARD} tiền hoàng gia\nTiền hoàng gia hiện tại: ${getState().royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_quest_continue" }]);
  }
}

export function handleYumoQuest4() {
  const state = getState();
  const matCount = state.other.filter(i => i.id === "building_mat").reduce((sum, i) => sum + (i.count || 1), 0);
  const woodCount = state.other.filter(i => i.id === "wood").reduce((sum, i) => sum + (i.count || 1), 0);
  const stoneCount = state.other.filter(i => i.id === "stone").reduce((sum, i) => sum + (i.count || 1), 0);
  const need = GAME_CONSTANTS.YUMO.QUEST4_MATERIAL_COST;

  if (matCount < need || woodCount < need || stoneCount < need) {
    let msg = YUMO_QUEST_STORIES.quest4_intro + "\n\nVật phẩm cần:";
    if (matCount < need) msg += `\n  Vật liệu xây dựng ${matCount}/${need}`;
    else msg += `\n  Vật liệu xây dựng ${matCount}/${need} ✓`;
    if (woodCount < need) msg += `\n  Gỗ ${woodCount}/${need}`;
    else msg += `\n  Gỗ ${woodCount}/${need} ✓`;
    if (stoneCount < need) msg += `\n  Đá ${stoneCount}/${need}`;
    else msg += `\n  Đá ${stoneCount}/${need} ✓`;
    setStory(msg);
    setPhase("island_yumo");
    setOptions([
      { text: "Đi thu thập vật liệu", action: "yumo_leave" },
    ]);
    return;
  }

  removeItemById("other", "building_mat", need);
  removeItemById("other", "wood", need);
  removeItemById("other", "stone", need);
  markQuestDone("yumoQuest4");
  addRoyalCoins(GAME_CONSTANTS.YUMO.QUEST4_REWARD);
  setStory(YUMO_QUEST_STORIES.quest4_accept + `\n\nNhận ${GAME_CONSTANTS.YUMO.QUEST4_REWARD} tiền hoàng gia\nTiền hoàng gia hiện tại: ${getState().royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_quest_continue" }]);
  }
}

export function handleYumoQuest5() {
  const state = getState();
  const baijiuCount = state.drinks.filter(i => i.id === "ruou_cao_do").reduce((sum, i) => sum + (i.count || 1), 0);

  if (baijiuCount < 1) {
    setStory(YUMO_QUEST_STORIES.quest5_intro + "\n\nVật phẩm cần: rượu trắng độ cao 0/1");
    setPhase("island_yumo");
    setOptions([
      { text: "Đi tìm rượu", action: "yumo_leave" },
    ]);
    return;
  }

  removeItemById("drinks", "ruou_cao_do", 1);
  markQuestDone("yumoQuest5");
  setStory(YUMO_QUEST_STORIES.quest5_accept);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_yumo");
    setOptions([{ text: "Tiếp tục", action: "yumo_quest_continue" }]);
  }
}
