import {
  getState,
  setPhase,
  setStory,
  setOptions,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  removeCigarettes,
} from '../state.js';

import {
  OUTLAW_DIALOGUES,
  MAP_NPC_INTROS,
  NAMED_NPCS,
  GAME_CONSTANTS,
  CROP_FOOD_MAP,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';

export function handleRestaurantEat() {
  const state = getState();
  if (state.lastRestaurantEatDay >= state.day) {
    setStory("Hôm nay đã ăn đồ nhà hàng rồi, mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.restaurant_intro);
  setOptions([
    { text: "Ăn tạp nhục trên bàn", action: "restaurant_consume" },
    { text: "Rời đi", action: "restaurant_leave" },
  ]);
}

export function handleRestaurantConsume() {
  const state = getState();
  state.hunger = Math.min(100, state.hunger + 5);
  state.hydration = Math.min(100, state.hydration + 5);
  state.crash = Math.min(100, state.crash + 5);
  state.infection = Math.min(100, state.infection + 10);
  state.hasEatenStrangeMeat = true;
  state.lastRestaurantEatDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (state.gameOver) return;
  setStory(MAP_NPC_INTROS.restaurant_eat);
  setOptions([
    { text: "Ăn tạp nhục trên bàn", action: "restaurant_consume" },
    { text: "Rời đi", action: "restaurant_leave" },
  ]);
}

export function handleRestaurantLeave() {
  setStory("Bạn rời khỏi nhà hàng khu phục vụ, mùi thịt quái dị đó vẫn còn vương vấn ở mũi.");
  showExploreOptionsState();
}

export function handleOutlawInteract() {
  const state = getState();
  if (state.outlawKilled) {
    setStory(MAP_NPC_INTROS.outlaw_killed);
    showExploreOptionsState();
    return;
  }
  setPhase("explore");
  setStory(MAP_NPC_INTROS.outlaw_intro);
  showOutlawMenu();
}

function showOutlawMenu() {
  const state = getState();
  setPhase("explore");
  const opts = [
    { text: "Trò chuyện", action: "outlaw_chat" },
    { text: "Về đồ ăn nhà hàng", action: "outlaw_food_chat" },
    { text: "Thách đấu", action: "outlaw_fight" },
    { text: "Rời đi", action: "outlaw_leave" },
  ];
  setOptions(opts);
}

export function handleOutlawChat() {
  const line = OUTLAW_DIALOGUES[Math.floor(Math.random() * OUTLAW_DIALOGUES.length)];
  setStory(line);
  showOutlawMenu();
}

export function handleOutlawFoodChat() {
  const state = getState();
  if (!state.hasEatenStrangeMeat) {
    setStory(MAP_NPC_INTROS.outlaw_food_denied);
    showOutlawMenu();
    return;
  }
  if (!state.maSanQuest1Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest1);
    setPhase("explore");
    setOptions([
      { text: "Chấp nhận (cần 3 chai bia động lực)", action: "outlaw_food_accept" },
      { text: "Từ chối", action: "outlaw_food_refuse" },
    ]);
    return;
  }
  if (!state.maSanQuest2Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest2);
    setPhase("explore");
    setOptions([
      { text: "Chấp nhận (cần nộp 3 phần cây trồng)", action: "outlaw_food_accept" },
      { text: "Từ chối", action: "outlaw_food_refuse" },
    ]);
    return;
  }
  if (!state.maSanQuest3Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest3);
    setPhase("explore");
    setOptions([
      { text: "Chấp nhận (cần 10 điếu thuốc lá)", action: "outlaw_food_accept" },
      { text: "Từ chối", action: "outlaw_food_refuse" },
    ]);
    return;
  }
  if (!state.maSanQuest4Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest4);
    setPhase("explore");
    setOptions([
      { text: "Chấp nhận lời mời của Mã Tam (⚠ Điều này sẽ thay đổi số phận bạn)", action: "outlaw_food_accept" },
      { text: "Từ chối", action: "outlaw_food_refuse" },
    ]);
    return;
  }
  setStory("Mã Tam không còn gì để nói.");
  showOutlawMenu();
}

export function handleOutlawFoodAccept() {
  const state = getState();
  if (!state.maSanQuest1Done) {
    const beerCount = state.drinks.filter(d => d.id === "bia_nang_luong").reduce((sum, d) => sum + (d.count || 1), 0);
    if (beerCount < 3) {
      setStory(`Bạn cần 3 chai bia động lực, nhưng chỉ có ${beerCount} chai.`);
      showOutlawMenu();
      return;
    }
    let remaining = 3;
    for (let i = state.drinks.length - 1; i >= 0 && remaining > 0; i--) {
      if (state.drinks[i].id === "bia_nang_luong") {
        const available = state.drinks[i].count || 1;
        if (available <= remaining) {
          state.drinks.splice(i, 1);
          remaining -= available;
        } else {
          state.drinks[i].count = available - remaining;
          remaining = 0;
        }
      }
    }
    state.maSanQuest1Done = true;
    setStory(MAP_NPC_INTROS.outlaw_food_quest1_accept);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showOutlawMenu();
    return;
  }
  if (!state.maSanQuest2Done) {
    const cropIds = Object.keys(CROP_FOOD_MAP);
    const cropCount = state.food.filter(f => cropIds.includes(f.id)).reduce((sum, f) => sum + (f.count || 1), 0);
    if (cropCount < 3) {
      setStory(`Bạn cần nộp 3 phần cây trồng, nhưng bạn chỉ có ${cropCount} phần.`);
      showOutlawMenu();
      return;
    }
    let remaining = 3;
    for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
      if (!cropIds.includes(state.food[i].id)) continue;
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        state.food.splice(i, 1);
        remaining -= available;
      } else {
        state.food[i].count = available - remaining;
        remaining = 0;
      }
    }
    state.maSanQuest2Done = true;
    setStory(MAP_NPC_INTROS.outlaw_food_quest2_accept);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showOutlawMenu();
    return;
  }
  if (!state.maSanQuest3Done) {
    if (state.cigarettes < 10) {
      setStory(`Bạn cần 10 điếu thuốc lá, nhưng bạn chỉ có ${state.cigarettes} điếu.`);
      showOutlawMenu();
      return;
    }
    removeCigarettes(10);
    state.maSanQuest3Done = true;
    setStory(MAP_NPC_INTROS.outlaw_food_quest3_accept);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) showOutlawMenu();
    return;
  }
  if (!state.maSanQuest4Done) {
    state.maSanQuest4Done = true;
    triggerEnding("ending_food");
    return;
  }
}

export function handleOutlawFoodRefuse() {
  const state = getState();
  if (!state.maSanQuest1Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest1_reject);
    showOutlawMenu();
    return;
  }
  if (!state.maSanQuest2Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest2_reject);
    showOutlawMenu();
    return;
  }
  if (!state.maSanQuest3Done) {
    setStory(MAP_NPC_INTROS.outlaw_food_quest3_reject);
    showOutlawMenu();
    return;
  }
  if (!state.maSanQuest4Done) {
    state._maSanQuest4Combat = true;
    state._pendingNpc = {
      name: NAMED_NPCS.ma_san.name,
      hp: NAMED_NPCS.ma_san.hp,
      damage: Math.floor(Math.random() * (NAMED_NPCS.ma_san.damageMax - NAMED_NPCS.ma_san.damageMin + 1)) + NAMED_NPCS.ma_san.damageMin,
      hasRanged: NAMED_NPCS.ma_san.hasRanged,
      dodgeRate: NAMED_NPCS.ma_san.dodgeRate,
    };
    setPhase("pre_combat_npc");
    setStory(MAP_NPC_INTROS.outlaw_food_quest4_reject);
    setOptions([
      { text: "Cận chiến", action: "combat_npc_melee" },
      { text: "Bắn tầm xa", action: "combat_npc_ranged" },
      { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
    ]);
    return;
  }
}

export function handleOutlawFight() {
  const state = getState();
  const maSan = NAMED_NPCS.ma_san;
  state._pendingNpc = {
    name: maSan.name,
    hp: maSan.hp,
    damage: Math.floor(Math.random() * (maSan.damageMax - maSan.damageMin + 1)) + maSan.damageMin,
    hasRanged: maSan.hasRanged,
    dodgeRate: maSan.dodgeRate,
  };
  setPhase("pre_combat_npc");
  setStory(MAP_NPC_INTROS.outlaw_fight);
  setOptions([
    { text: "Cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" },
  ]);
}

export function handleOutlawLeave() {
  setStory(MAP_NPC_INTROS.outlaw_leave);
  showExploreOptionsState();
}

export function handleSearchFoodLocker() {
  const state = getState();
  if (state.lastFoodLockerDay > 0 && state.day - state.lastFoodLockerDay < GAME_CONSTANTS.MAP_EVENTS.CORPSE_COOLDOWN_DAYS) {
    const remaining = GAME_CONSTANTS.MAP_EVENTS.CORPSE_COOLDOWN_DAYS - (state.day - state.lastFoodLockerDay);
    setStory(`Tủ trữ thức ăn đã lục rồi, ${remaining} ngày nữa hãy quay lại.`);
    showExploreOptionsState();
    return;
  }
  state.lastFoodLockerDay = state.day;
  const isGood = Math.random() < GAME_CONSTANTS.MAP_EVENTS.FOOD_LOCKER_GOOD_RATE;
  if (isGood) {
    state.hunger = Math.min(100, state.hunger + GAME_CONSTANTS.MAP_EVENTS.FOOD_LOCKER_HUNGER_RESTORE);
    state.hydration = Math.min(100, state.hydration + GAME_CONSTANTS.MAP_EVENTS.FOOD_LOCKER_HYDRATION_RESTORE);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      setStory("Bạn lục tủ trữ thức ăn khu phục vụ, tìm được một số thức ăn và nước còn khá tươi. Độ no và nước đã hồi phục.");
      showExploreOptionsState();
    }
  } else {
    state.crash = Math.min(100, state.crash + GAME_CONSTANTS.MAP_EVENTS.FOOD_LOCKER_BAD_FOOD_CRASH);
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      setStory("Bạn lục tủ trữ thức ăn, nhưng đồ bên trong đã mốc meo biến chất. Nhìn những thức ăn thối rữa đó, bạn cảm thấy buồn nôn, độ mệt mỏi tăng lên.");
      showExploreOptionsState();
    }
  }
}