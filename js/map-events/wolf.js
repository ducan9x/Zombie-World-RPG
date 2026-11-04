import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addNpcAffinity,
  getNpcAffinity,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getBackpackCount,
  removeGasoline,
} from '../state.js';

import {
  WOLF_DIALOGUES,
  GAME_CONSTANTS,
  MEDICINES,
  MAP_NPC_INTROS,
  SPECIAL_ITEMS,
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  AMMO,
  NAMED_NPCS,
  weightedRandom,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';

/* ============================================================
   Lão sói - đối thoại / giao dịch (giữ nguyên logic)
   ============================================================ */

export function handleWolfInteract() {
  setPhase("explore");
  setStory(MAP_NPC_INTROS.wolf_intro);
  setOptions(buildWolfOptions());
}

export function handleWolfChat() {
  setPhase("explore");
  const line = WOLF_DIALOGUES[Math.floor(Math.random() * WOLF_DIALOGUES.length)];
  setStory(line);
  setOptions(buildWolfOptions());
}

export function handleWolfLeave() {
  setStory("Bạn từ biệt lão sói, rời khỏi khu dân cư.");
  showExploreOptionsState();
}

export function handleWolfTrade() {
  const state = getState();
  if (state.lastWolfTradeDay >= state.day) {
    setStory("Hôm nay đã giao dịch với lão sói rồi, ngày mai hãy quay lại.");
    handleWolfInteract();
    return;
  }
  const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
  if (foodCount < GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST) {
    setStory(`Lão sói liếc bạn một cái: "Chỉ từng đó đồ ăn còn muốn đổi thứ? Ít nhất ${GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST} phần thực phẩm. Bạn chỉ có ${foodCount} phần."`);
    handleWolfInteract();
    return;
  }
  if (getBackpackCount() - GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST + 1 > state.backpack.capacity) {
    setStory("Không gian balo không đủ, không thể hoàn thành giao dịch.");
    handleWolfInteract();
    return;
  }
  const removedItems = [];
  let remaining = GAME_CONSTANTS.MAP_EVENTS.WOLF_TRADE_FOOD_COST;
  for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
    const available = state.food[i].count || 1;
    if (available <= remaining) {
      removedItems.push(state.food[i]);
      state.food.splice(i, 1);
      remaining -= available;
    } else {
      removedItems.push({ ...state.food[i], count: remaining });
      state.food[i].count = available - remaining;
      remaining = 0;
    }
  }
  const laolangMeds = MEDICINES.filter(m => m.rarity === "common" || m.rarity === "uncommon" || m.rarity === "rare");
  const rarityWeights = GAME_CONSTANTS.LOOT.RARITY_WEIGHTS;
  const med = weightedRandom(laolangMeds, m => rarityWeights[m.rarity] || 1);
  const added = addItem({ ...med, type: "medicine" });
  const foodNames = removedItems.map(f => f.name).join("、");
  if (added) {
    setStory(`Bạn dùng ${foodNames} đổi với lão sói một hộp ${med.name}. Lão sói nhận đồ ăn, vội vàng gặm lên.`);
  } else {
    setStory(`Bạn dùng ${foodNames} đổi với lão sói một hộp ${med.name}, nhưng balo đã đầy, thuốc rơi xuống đất!`);
  }
  state.lastWolfTradeDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

/* ============================================================
   Hàm hỗ trợ xây dựng lựa chọn
   ============================================================ */

function buildWolfOptions() {
  const state = getState();
  const opts = [
    { text: "Đối thoại", action: "wolf_chat" },
    { text: "Trao đổi vật phẩm", action: "wolf_trade" },
  ];

  // Nhiệm vụ 1: thu thập vảy
  if (!state.wolfQuest1Done) {
    opts.push({ text: "Nhiệm vụ: thu thập vảy", action: "wolf_quest1" });
  }

  // Nhiệm vụ 2: nhà sưu tầm
  if (state.wolfQuest1Done && !state.wolfQuest2Done) {
    opts.push({ text: "Nhiệm vụ: nhà sưu tầm", action: "wolf_quest2" });
  }

  // Nhiệm vụ 3: chuẩn bị ra khơi
  const mermaidAff = getNpcAffinity("mermaid");
  if (state.wolfQuest2Done && !state.wolfQuest3Done && mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    opts.push({ text: "Nhiệm vụ: chuẩn bị ra khơi", action: "wolf_quest3" });
  }

  // Nhiệm vụ 4: hải thi khổng lồ
  if (state.wolfQuest3Done && !state.wolfQuest4Done) {
    opts.push({ text: "Nhiệm vụ: hải thi khổng lồ", action: "wolf_quest4" });
  }

  opts.push({ text: "Rời đi", action: "wolf_leave" });
  return opts;
}

/* ============================================================
   Nhiệm vụ 1: thu thập vảy - nộp 5 vảy sấm sét
   ============================================================ */

export function handleWolfQuest1() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST1_SCALE_COST;

  setPhase("explore");
  setStory(
    `Lão sói nheo mắt, trầm tư nhìn bạn: "Cậu trai, từng nghe về 'vảy sấm sét' chưa?\n` +
    `Nghe nói chỉ có trong vùng nước mang điện, do một loại cá đặc biệt mới sản xuất. Tôi gần đây đang nghiên cứu mấy thứ này,\n` +
    `nếu cậu có thể giúp tôi lấy ${cost} vảy sấm sét, tôi sẽ nợ cậu một món.\n\n` +
    `（Gợi ý: có lẽ có thể thử ở bể kính rò điện trong trung tâm thương mại）`
  );

  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  const lightningCount = lightningItem ? (lightningItem.count || 1) : 0;

  setOptions([
    {
      text: `Nộp ${cost} vảy sấm sét (hiện có: ${lightningCount})`,
      action: "wolf_quest1_submit",
      disabled: lightningCount < cost,
    },
    { text: "Quay lại", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest1Submit() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST1_SCALE_COST;

  let remaining = cost;
  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  if (lightningItem) {
    const available = lightningItem.count || 1;
    if (available <= remaining) {
      remaining -= available;
      const idx = state.other.indexOf(lightningItem);
      if (idx !== -1) state.other.splice(idx, 1);
    } else {
      lightningItem.count = available - remaining;
      remaining = 0;
    }
  }

  if (remaining > 0) {
    setStory("Số lượng vảy sấm sét không đủ, lão sói lắc đầu.");
    handleWolfInteract();
    return;
  }

  state.wolfQuest1Done = true;
  addNpcAffinity("wolf", 10);

  setStory(
    `Bạn đưa ${cost} vảy sấm sét vào tay lão sói.\n\n` +
    `Lão sói cẩn thận xem xét những chiếc vảy lấp lánh hồ quang điện, trong mắt thoáng hiện vẻ ngạc nhiên:\n` +
    `"Khá lắm……thứ này còn lợi hại hơn tôi dự đoán. Năng lượng chứa trong những chiếc vảy này,\n` +
    `tuyệt đối không phải thứ nên có trong mạt thế này."\n\n` +
    `Ông ấy cẩn thận cất vảy vào trong ngực, hạ giọng nói:\n` +
    `"Thật ra……tôi vẫn đang nghiên cứu những thứ sâu hơn. Truyền thuyết nói trong biển sâu có một loại sinh vật,\n` +
    `vảy của chúng chứa lực lượng sấm sét. Còn những vảy sấm sét này, chỉ là sản phẩm sơ cấp nhất……\n` +
    `nếu cậu có thể lấy được 'vảy thông lôi' cao cấp hơn, nhớ tìm tôi."\n\n` +
    `✅ Nhiệm vụ "thu thập vảy" hoàn thành! Độ thiện cảm lão sói +10.`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   Nhiệm vụ 2: nhà sưu tầm - nộp 3 vảy thông lôi
   ============================================================ */

export function handleWolfQuest2() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST2_SCALE_COST;

  setPhase("explore");
  setStory(
    `Lão sói lấy từ trong ngực ra một cuốn sổ cũ nát, trên đó vẽ đầy các loại ký hiệu và hình vẽ kỳ lạ.\n` +
    `"Vảy thônglôi——tôi tra rất nhiều cổ thư mới tìm được cái tên này." ông ấy chỉ vào một bức phác thảo trên sổ,\n` +
    `"Loại vảy này mạnh hơn vảy sấm sét nhiều, nghe nói sản xuất từ loài cá vực sâu trong truyền thuyết.\n` +
    `Nếu cậu giúp tôi lấy ${cost} chiếc, tôi sẽ nói cho cậu một bí mật——\n` +
    `về thứ cất giấu trong kho vật nghiệp của khu dân cư này."`
  );

  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  const thunderCount = thunderItem ? (thunderItem.count || 1) : 0;

  setOptions([
    {
      text: `Nộp ${cost} vảy thông lôi (hiện có: ${thunderCount})`,
      action: "wolf_quest2_submit",
      disabled: thunderCount < cost,
    },
    { text: "Quay lại", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest2Submit() {
  const state = getState();
  const cost = GAME_CONSTANTS.WOLF.QUEST2_SCALE_COST;

  let remaining = cost;
  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  if (thunderItem) {
    const available = thunderItem.count || 1;
    if (available <= remaining) {
      remaining -= available;
      const idx = state.other.indexOf(thunderItem);
      if (idx !== -1) state.other.splice(idx, 1);
    } else {
      thunderItem.count = available - remaining;
      remaining = 0;
    }
  }

  if (remaining > 0) {
    setStory("Số lượng vảy thông lôi không đủ, lão sói thở dài.");
    handleWolfInteract();
    return;
  }

  state.wolfQuest2Done = true;
  addNpcAffinity("wolf", 15);

  setStory(
    `Bạn trịnh trọng đặt ${cost} vảy thông lôi vào tay lão sói.\n\n` +
    `Vảy vừa chạm vào lòng bàn tay lão sói, liền bắn ra một tia sét nhỏ. Tay lão sói khẽ run——\n` +
    `không phải vì điện giật, mà vì kích động.\n\n` +
    `"Quả nhiên……quả nhiên là thật!" ông ấy hít sâu một hơi, dùng một mảnh vải cũ cẩn thận gói vảy lại.\n` +
    `"Nghe đây, cậu trai. Phía kho vật nghiệp……có một người cá bị thương.\n` +
    `Cô ấy bị nhốt ở đó rất lâu rồi, tôi không dám để ai đến gần cô ấy.\n` +
    `Nhưng giờ đây, cậu đã chứng minh thành ý của mình——cậu có thể đi xem cô ấy.\n` +
    `Mang theo vảy của cậu, có lẽ……cậu có thể giúp được cô ấy."\n\n` +
    `✅ Nhiệm vụ "nhà sưu tầm" hoàn thành! Độ thiện cảm lão sói +15.\n` +
    `🔓 【Kho vật nghiệp】 tại khu dân cư cũ đã mở!`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   Nhiệm vụ 3: chuẩn bị ra khơi —— nộp 5 xăng + 5 thực phẩm bất kỳ + 5 đồ uống bất kỳ
   Phần thưởng: Desert Eagle + 30 viên .50 AE
   ============================================================ */

export function handleWolfQuest3() {
  const state = getState();

  setPhase("explore");
  setStory(
    `Lão sói đứng bên cửa sổ, nhìn về phía biển, thần sắc ngưng trọng.\n\n` +
    `"Người cá nói cho tôi biết vài chuyện……trong biển sâu có một con quái vật, đáng sợ hơn bất kỳ zombie nào chúng ta từng thấy.\n` +
    `Nếu không xử lý nó, sớm muộn gì cũng đe dọa toàn bộ bờ biển."\n\n` +
    `Ông ấy xoay người, ánh mắt kiên định: "Tôi chuẩn bị ra khơi, đi gặp con quái vật đó. Nhưng tôi cần tiếp tế——\n` +
    `${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST} thùng xăng、${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST} phần thực phẩm、${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST} phần đồ uống.\n` +
    `Sẽ không để cậu bận công toi, xong việc, thứ tôi cất giữ nhiều năm sẽ thuộc về cậu."`
  );

  const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
  const drinksCount = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);

  const canSubmit =
    state.gasoline >= GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST &&
    foodCount >= GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST &&
    drinksCount >= GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST;

  setOptions([
    {
      text: `Nộp vật tư (xăng:${state.gasoline}/${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST} thực phẩm:${foodCount}/${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST} đồ uống:${drinksCount}/${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST})`,
      action: "wolf_quest3_submit",
      disabled: !canSubmit,
    },
    { text: "Quay lại", action: "wolf_interact" },
  ]);
}

export function handleWolfQuest3Submit() {
  const state = getState();

  // Khấu trừ xăng
  removeGasoline(GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST);

  // Khấu trừ thực phẩm
  let foodRemaining = GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST;
  for (let i = state.food.length - 1; i >= 0 && foodRemaining > 0; i--) {
    const available = state.food[i].count || 1;
    if (available <= foodRemaining) {
      state.food.splice(i, 1);
      foodRemaining -= available;
    } else {
      state.food[i].count = available - foodRemaining;
      foodRemaining = 0;
    }
  }

  // Khấu trừ đồ uống
  let drinksRemaining = GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST;
  for (let i = state.drinks.length - 1; i >= 0 && drinksRemaining > 0; i--) {
    const available = state.drinks[i].count || 1;
    if (available <= drinksRemaining) {
      state.drinks.splice(i, 1);
      drinksRemaining -= available;
    } else {
      state.drinks[i].count = available - drinksRemaining;
      drinksRemaining = 0;
    }
  }

  // Phần thưởng
  const deagle = RANGED_WEAPONS.find(w => w.id === GAME_CONSTANTS.WOLF.QUEST3_REWARD_DEAGLE);
  const deagleItem = deagle ? { ...deagle } : null;
  if (deagleItem) addItem(deagleItem);

  const ammoItem = {
    id: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO,
    name: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO,
    type: "ammo",
    count: GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT,
  };
  addItem(ammoItem);

  state.wolfQuest3Done = true;
  addNpcAffinity("wolf", 20);

  setStory(
    `Bạn chất đống vật tư lục soát từ khắp nơi trước mặt lão sói:\n` +
    `${GAME_CONSTANTS.WOLF.QUEST3_GASOLINE_COST} thùng xăng、${GAME_CONSTANTS.WOLF.QUEST3_FOOD_COST} phần thực phẩm、${GAME_CONSTANTS.WOLF.QUEST3_DRINKS_COST} phần đồ uống.\n\n` +
    `Lão sói im lặng một lúc, sau đó kéo từ dưới giường ra một chiếc hộp dài bọc vải dầu.\n` +
    `"Cầm lấy." ông ấy mở hộp——một khẩu Desert Eagle được bảo dưỡng sáng bóng nằm trong đó,\n` +
    `bên cạnh xếp ngay ngắn ${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT} viên đạn .50 AE cỡ lớn.\n\n` +
    `"Đây là thứ tôi mua ở chợ đen thời còn trẻ, tốn không ít công sức. Tầm bắn xa、sát thương lớn,\n` +
    `đối phó con quái vật biển sâu đó, hẳn sẽ có tác dụng."\n\n` +
    `Ông ấy vỗ vai bạn: "Chuẩn bị xong thì tìm tôi. Đối thủ thực sự, ở dưới biển sâu."\n\n` +
    `✅ Nhiệm vụ "chuẩn bị ra khơi" hoàn thành! Độ thiện cảm lão sói +20.\n` +
    `🎁 Nhận được: ${deagleItem ? deagleItem.name : "Desert Eagle"}×1 + ${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO}×${GAME_CONSTANTS.WOLF.QUEST3_REWARD_AMMO_COUNT}`
  );

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleWolfInteract();
  }
}

/* ============================================================
   Nhiệm vụ 4: hải thi khổng lồ —— chỉ có thể tấn công từ xa BOSSchiến
   Chiến thắng → kết cục 13 "Truyền thuyết người cá"
   Thất bại → tử vong
   ============================================================ */

export function handleWolfQuest4() {
  const state = getState();

  if (!state.rangedWeapon) {
    setStory(
      `Lão sói nhìn hai tay trống trơn của bạn, nhíu mày:\n` +
      `"Bạn không mang vũ khí tầm xa? Đó là quái vật biển sâu, cận chiếnhoàn toàn không với tới!\n` +
      `Đi trang bị một vũ khí tầm xa, mang đủ đạn rồi quay lại tìm tôi."`
    );
    handleWolfInteract();
    return;
  }

  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId);
  if (!ammo || ammo.count <= 0) {
    setStory(
      `Lão sói nhìn ${state.rangedWeapon.name} của bạn:\n` +
      `"Súng là súng tốt, nhưng bạn không mang đạn! Mau đi bổ sung ${ammoId} rồi quay lại."`
    );
    handleWolfInteract();
    return;
  }

  setPhase("explore");
  setStory(
    `Lão sói đưa bạn đến bên một chiếc thuyền cá cũ nát ở cảng. Mặt biển âm u, mây xám nặng trĩu ép xuống rất thấp.\n\n` +
    `"Con đó……ngay dưới vùng biển này." giọng lão sói trầm và ngưng trọng.\n` +
    `"Khổng lồ đến không giống sinh vật của thế giới này. Người cá nói, nó đã ngủ say mấy trăm năm,\n` +
    `là năng lượng mạt thế đánh thức nó."\n\n` +
    `Phía xa, một cánh tay trắng như tuyết thò ra từ mạn thuyền——là người cá bị thương.\n` +
    `Vảy của cô ấy lấp lánh ánh sáng yếu trên mặt biển âm u, trong mắt vừa có sợ hãi, vừa có quyết tuyệt.\n\n` +
    `"Chuẩn bị xong chưa? " lão sói siết chặt súng săn.\n` +
    `"Trận này, hoặc là đưa quái vật trở về vực sâu……hoặc chúng ta đều chôn thây trong bụng cá."\n\n` +
    `⚠ Hải thi khổng lồ chỉ có thể dùng vũ khí tầm xa để tấn công, cận chiến vô hiệu!`
  );

  setOptions([
    { text: "Ra khơi nghênh chiến (tầm xa·không thể quay lại!)", action: "wolf_quest4_fight" },
    { text: "Tạm thời rút lui", action: "wolf_quest4_retreat" },
  ]);
}

export function handleWolfQuest4Retreat() {
  setStory("Bạn tạm thời bỏ ý định ra khơi. Lão sói lặng lẽ gật đầu: \"Chuẩn bị kỹ rồi hãy đến, không vội.\"");
  handleWolfInteract();
}

export function handleWolfQuest4Fight() {
  const state = getState();

  // Kiểm tra lại vũ khí tầm xa
  if (!state.rangedWeapon) {
    setStory("Bạn không trang bị vũ khí tầm xa, không thể chiến đấu với quái vật biển sâu!");
    handleWolfInteract();
    return;
  }

  const ammoId = state.rangedWeapon.ammoType;
  const ammo = state.ammo.find(a => a.id === ammoId);
  if (!ammo || ammo.count <= 0) {
    setStory("Bạn không có đạn, không thể chiến đấu!");
    handleWolfInteract();
    return;
  }

  // Tạo BOSS
  const bossDef = NAMED_NPCS.sea_monster;
  if (!bossDef) {
    setStory("【Lỗi】Dữ liệu BOSS chưa định nghĩa, vui lòng liên hệ nhà phát triển.");
    handleWolfInteract();
    return;
  }

  const npc = {
    type: "sea_monster",
    name: bossDef.name,
    hp: bossDef.hp,
    maxHp: bossDef.hp,
    damage: bossDef.damage || 60,
    hasRanged: false,
    dodgeRate: bossDef.dodgeRate || 0.1,
  };

  state._pendingNpc = npc;
  state._wolfQuest4Combat = true;

  setPhase("pre_combat_npc");
  setStory(
    `Thuyền cá đi vào vùng biển sâu. Mặt biển đột nhiên cuộn trào dữ dội——\n\n` +
    `Một bóng đen khổng lồ từ biển sâu chậm rãi dâng lên. Đó là một sinh vật khó tả:\n` +
    `thân thể giống cá voi thối rữa, phủ vảy đen tuyền, hàng chục xúc tu vươn ra từ hai bên thân,\n` +
    `cuối mỗi xúc tu mọc một con mắt phát ánh sáng u ám.\n\n` +
    `"Là nó! " lão sói hét lớn. Người cá bị thương cất lên một khúc hát kỳ lạ mà bi thương,\n` +
    `một rào cản mỏng manh bao trùm thuyền cá——đó là chút che chở cuối cùng cô ấy có thể cung cấp.\n\n` +
    `【Hải thi khổng lồ】HP:${npc.hp} Sát thương:${npc.damage}\n` +
    `⚠ Quái vật này chỉ có thể dùng vũ khí tầm xa để tấn công!\n\n` +
    `【Cận chiến】${state.meleeWeapon.name}\n` +
    `【Tầm xa】${state.rangedWeapon.name} (đạn:${ammo ? ammo.count : 0} viên hoàn chỉnh:${state.rangedWeapon.integrity}%)`
  );

  const options = [
    { text: "Chiến đấu tầm xa", action: "combat_npc_ranged" },
    { text: "Chiến đấu cận chiến (vô hiệu! không với tới quái vật biển sâu)", action: "combat_npc_melee", disabled: true },
    { text: "Rút lui (25%)", action: "combat_npc_flee" },
  ];
  setOptions(options);
}

/* ============================================================
   Kho vật nghiệp - tùy chọn thường trú tại khu dân cư cũ
   ============================================================ */

export function handlePropertyWarehouse() {
  const state = getState();

  if (!state.wolfQuest2Done) {
    setStory(
      "Bạn đi đến cửa kho vật nghiệp, phát hiện trên cửa sắt treo một ổ khóa rỉ sét lớn.\n" +
      "Qua khe cửa nhìn vào, mơ hồ thấy một thân hình co ro……\n\n" +
      "Ngay lúc đó, lão sói không biết từ đâu xuất hiện, chặn trước mặt bạn:\n" +
      "\"Chỗ đó……bạn đừng đi thì hơn.\" ánh mắt ông ấy rất phức tạp.\n" +
      "\"Đợi bạn giúp tôi làm xong những việc đó, tôi tự nhiên sẽ nói cho bạn bên trong có gì."\n\n" +
      "Lão sói không muốn bạn đi chỗ đó, thôi vậy."
    );
    showExploreOptionsState();
    return;
  }

  handleMermaidInteract();
}

/* ============================================================
   Người cá bị thương —— hệ thống thiện cảm
   ============================================================ */

export function handleMermaidInteract() {
  const state = getState();
  const mermaidAff = getNpcAffinity("mermaid");

  setPhase("explore");

  let storyText;
  const affInfo = `\n\nĐộ thiện cảm hiện tại: ${mermaidAff}/${GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY}`;
  if (mermaidAff < 30) {
    storyText =
      "Bạn đẩy cánh cửa sắt gỉ sét của kho vật nghiệp, một mùi tanh biển ẩm ướt xộc vào mặt.\n" +
      "Sâu trong kho, trong một chiếc bồn tắm cũ kỹ co ro một sinh vật kỳ lạ——\n" +
      "nửa trên là hình thiếu nữ trắng bệch, nửa dưới lại là một chiếc đuôi cá phủ vảy tối mờ.\n\n" +
      "Trên đuôi cá của cô ấy có một vết thương sâu, vảy rụng mất quá nửa, lộ ra da thịt viêm nhiễm bên dưới.\n" +
      "Cô ấy ngẩng đầu, yếu ớt mà cảnh giác nhìn bạn, môi khẽ run nhưng không phát ra âm thanh." +
      affInfo;
  } else if (mermaidAff < 80) {
    storyText =
      "Người cá bị thương thấy bạn, trong mắt lóe lên một tia sáng yếu ớt.\n" +
      "Vết thương trên đuôi cá của cô ấy dường như đã tốt hơn chút, nhưng vẫn kinh người.\n" +
      "Cô ấy dùng giọng khàn khàn khẽ nói: \"Bạn……lại đến nữa. Cảm ơn……những chiếc vảy……\"" +
      affInfo;
  } else if (mermaidAff < GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    storyText =
      `Tinh thần người cá tốt hơn nhiều. Vết thương trên đuôi cá đã bắt đầu lành,\n` +
      `một số chiếc vảy mới, nhỏ xíu đang mọc lại.\n` +
      `"Tôi cảm nhận được……sức mạnh đang từ từ quay lại." giọng cô ấy không còn khàn,\n` +
      `mà mang theo một tiết tấu kỳ lạ, như sóng biển.\n` +
      `"Giúp tôi nữa đi……đưa thêm vảy cho tôi……tôi sắp có thể về nhà rồi……"` +
      affInfo;
  } else {
    storyText =
      `Đuôi cá của người cá đã hoàn toàn lành! Chiếc vảy mới lấp lánh ánh ngọc trai,\n` +
      `trong kho tối tăm sáng như những vì sao.\n\n` +
      `Cô ấy đứng dậy từ trong bồn tắm——không, là bay lên——giọt nước lơ lửng quanh cô ấy,\n` +
      `không khí tràn ngập hơi thở tươi mới của biển cả.\n\n` +
      `"Cảm ơn bạn……người lạ. Không, bạn không còn là người lạ nữa."\n` +
      `Cô ấy vươn tay, một cây đinh ba kỳ lạ chậm rãi hiện ra từ trong sương nước——\n` +
      `"Đây là đinh ba hải ca, thánh vật của tộc chúng tôi. Nó từng thuộc về mẹ tôi,\n` +
      `giờ đây……thuộc về bạn."\n\n` +
      `Cô ấy trao đinh ba vào tay bạn, trong mắt lấp lánh nước mắt:\n` +
      `"Xin hãy giúp lão sói……giúp chúng tôi tiêu diệt con quái vật biển sâu đó.\n` +
      `Chỉ khi nó chết, tôi mới thực sự tự do quay về biển cả."\n\n` +
      `🎁 Nhận được: 【Đinh ba hải ca】!\n` +
      `🔓 Nhiệm vụ 3 của lão sói "chuẩn bị ra khơi" đã mở!` +
      affInfo;
  }

  setStory(storyText);

  const lightningItem = state.other.find(i => i.id === "lightning_scale");
  const thunderItem = state.other.find(i => i.id === "thunder_scale");
  const lightningCount = lightningItem ? (lightningItem.count || 1) : 0;
  const thunderCount = thunderItem ? (thunderItem.count || 1) : 0;

  const opts = [];
  opts.push({
    text: `Nộp vảy sấm sét (+${GAME_CONSTANTS.WOLF.MERMAID_LIGHTNING_AFFINITY} thiện cảm đang có: ${lightningCount})`,
    action: "mermaid_submit_lightning",
    disabled: lightningCount === 0 || mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY,
  });
  opts.push({
    text: `Nộp vảy thông lôi (+${GAME_CONSTANTS.WOLF.MERMAID_THUNDER_AFFINITY} thiện cảm đang có: ${thunderCount})`,
    action: "mermaid_submit_thunder",
    disabled: thunderCount === 0 || mermaidAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY,
  });
  opts.push({ text: "Rời đi", action: "mermaid_leave" });

  setOptions(opts);
}

export function handleMermaidSubmitLightning() {
  handleMermaidSubmitScale("lightning_scale", GAME_CONSTANTS.WOLF.MERMAID_LIGHTNING_AFFINITY);
}

export function handleMermaidSubmitThunder() {
  handleMermaidSubmitScale("thunder_scale", GAME_CONSTANTS.WOLF.MERMAID_THUNDER_AFFINITY);
}

function handleMermaidSubmitScale(scaleId, affinityGain) {
  const state = getState();

  const idx = state.other.findIndex(i => i.id === scaleId);
  if (idx === -1) {
    setStory("Bạn không có chiếc vảy này, người cá thất vọng cúi mắt xuống.");
    handleMermaidInteract();
    return;
  }

  const scaleItem = state.other[idx];
  if ((scaleItem.count || 1) > 1) {
    scaleItem.count--;
  } else {
    state.other.splice(idx, 1);
  }

  const newAff = addNpcAffinity("mermaid", affinityGain);

  const scaleName = scaleId === "lightning_scale" ? "vảy sấm sét" : "vảy thông lôi";

  let storyMsg = `Bạn đưa một chiếc ${scaleName} cho người cá.\n\n`;

  if (scaleId === "lightning_scale") {
    storyMsg +=
      `Cô ấy nhận lấy chiếc vảy, nhẹ nhàng đặt lên vết thương của mình. Chiếc vảy tan chảy——\n` +
      `hóa thành một tia sét yếu ớt, thấm vào đuôi cá của cô ấy.\n` +
      `Rìa vết thương dường như nhỏ đi một chút……`;
  } else {
    storyMsg +=
      `Cô ấy hai tay nâng chiếc vảy thông lôi, nhắm mắt, khẽ ngâm một khúc ca cổ xưa.\n` +
      `Chiếc vảy trong tiếng sét trầm thấp hóa thành những hạt sáng vàng, bao phủ toàn thân cô ấy.\n` +
      `Vết thương lành lại một mảng nhỏ với tốc độ mắt thường có thể thấy!`;
  }

  storyMsg += `\n\nĐộ thiện cảm người cá: ${newAff}/${GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY}`;

  // Kiểm tra đạt độ thiện cảm tối đa
  if (newAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
    const harpoon = MELEE_WEAPONS.find(w => w.id === GAME_CONSTANTS.WOLF.MERMAID_REWARD_WEAPON);
    if (harpoon) {
      const weapon = { ...harpoon, currentDurability: harpoon.durability };
      const added = addItem(weapon);
      if (added) {
        storyMsg +=
          `\n\nNgay khoảnh khắc chiếc vảy hoàn toàn hòa vào, thân thể người cá đột nhiên bừng sáng rực rỡ.\n` +
          `Sương nước xoáy tròn quanh cô ấy, bốc lên, cuối cùng ngưng tụ thành một cây đinh ba cổ kính mà thanh nhã——\n` +
          `"Đinh ba hải ca"——đầu đinh ba lấp lánh ánh ngọc trai, cán khắc cổ văn biển cả.\n\n` +
          `Người cá hai tay nâng đinh ba, trang trọng trao cho bạn:\n` +
          `"Đây là vũ khí quý giá nhất tộc chúng tôi, mẹ tôi nói, chỉ có bạn thực sự mới xứng đáng sở hữu.\n` +
          `Giờ đây, bạn chính là bạn thực sự của chúng tôi."\n\n` +
          `Trong mắt cô ấy phản chiếu ánh vảy:\n` +
          `"Đi nói với lão sói……về chuyện con quái vật biển sâu. Nó không nên tồn tại ở thế giới này.\n` +
          `Các bạn cần liên thủ——tôi sẽ dẫn đường cho các bạn trong biển."`;
      } else {
        storyMsg += `\n\n⚠ Balo đã đầy, không thể nhận đinh ba hải ca! Vui lòng dọn dẹp balo rồi quay lại.`;
        // Độ thiện cảm giữ nguyên, nhưng lùi lại một chút để người chơi có thể kích hoạt lại
        state.npcAffinity.mermaid = GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY - 1;
        setStory(storyMsg);
        handleMermaidInteract();
        return;
      }
    }
    storyMsg += `\n\n🎁 Nhận được: 【Đinh ba hải ca】!\n🔓 Nhiệm vụ 3 của lão sói "chuẩn bị ra khơi" đã mở!`;
  }

  setStory(storyMsg);

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    if (newAff >= GAME_CONSTANTS.WOLF.MERMAID_MAX_AFFINITY) {
      handleMermaidInteract();
    } else {
      handleMermaidInteract();
    }
  }
}

export function handleMermaidLeave() {
  setStory("Bạn nhẹ nhàng đóng cửa kho vật nghiệp, ánh mắt người cá dần ẩn vào trong bóng tối.");
  showExploreOptionsState();
}

/* ============================================================
   Xử lý sau chiến đấu hải thi khổng lồ —— kích hoạt trong combat.js qua cờ _wolfQuest4Combat
   ============================================================ */

export function checkWolfQuest4Victory() {
  const state = getState();
  if (!state._wolfQuest4Combat) return false;

  delete state._wolfQuest4Combat;

  if (state._combatNpcDefeated) {
    state.wolfQuest4Done = true;
    state.stats.bossesDefeated.push(GAME_CONSTANTS.WOLF.BOSS_SEA_MONSTER);
    triggerEnding("ending_mermaid");
    return true;
  }

  // Thất bại chiến đấu do checkDeath trong combat.js xử lý
  return false;
}
