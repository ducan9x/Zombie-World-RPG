import {
  getState,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  setPhase,
  setStory,
  setOptions,
  consumeItem,
  resetCrashTurns,
  getItemDisplayName,
} from '../state.js';

import {
  GAME_CONSTANTS,
} from '../config.js';

import { showHomeOptions, returnToMenu } from '../routing.js';

import { getBaseBonus } from '../base.js';

export function handleSleep() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("Cơ thể bạn đã hoàn toàn kiệt sức, không thể ngủ được. Cơ thể đau nhức vô lực. Bạn có thể dùng vật phẩm y tế (như thuốc giảm đau, adrenaline) để khôi phục tinh thần.");
    showHomeOptions();
    return;
  }
  if (state.hunger <= 0) {
    setStory("Bạn quá đói, không thể ngủ được. Hãy ăn chút gì đi.");
    showHomeOptions();
    return;
  }
  if (state.hydration <= 0) {
    setStory("Bạn quá khát, không thể ngủ được. Hãy uống chút gì đi.");
    showHomeOptions();
    return;
  }
  resetCrashTurns();
  const reduction = Math.floor(Math.random() * (GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MAX - GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MIN + 1)) + GAME_CONSTANTS.SLEEP.FATIGUE_REDUCTION_MIN;
  state.crash = Math.max(0, state.crash - reduction);
  state.sanity = Math.min(GAME_CONSTANTS.SANITY_MAX, state.sanity + GAME_CONSTANTS.SLEEP.SANITY_RECOVERY);
  const healthRecovery = Math.floor(Math.random() * (GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MAX - GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MIN + 1)) + GAME_CONSTANTS.SLEEP.HEALTH_RECOVERY_MIN + getBaseBonus(state.baseLevel);
  state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + healthRecovery);
  advanceTime(GAME_CONSTANTS.SLEEP.TIME_COST);
  updateStatusEffects();
  setStory(`Bạn chìm vào giấc ngủ, thức dậy thấy cơ thể khá hơn. Mệt mỏi giảm ${reduction}%, sức khỏe hồi ${healthRecovery} điểm, lý trí hồi ${GAME_CONSTANTS.SLEEP.SANITY_RECOVERY} điểm.`);
  checkDeath();
  if (!state.gameOver) showHomeOptions();
}

export function handleEatSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("Cơ thể bạn đã hoàn toàn kiệt sức, không muốn ăn bất cứ thứ gì. Bạn mất hứng thú với mọi thứ. Bạn có thể dùng vật phẩm y tế (như thuốc giảm đau, adrenaline) để khôi phục tinh thần.");
    returnToMenu();
    return;
  }
  if (state.food.length === 0) {
    setStory("Bạn không có đồ ăn.");
    returnToMenu();
    return;
  }
  setPhase("eat_select");
  setStory("Chọn thức ăn muốn dùng:");
  const foodOptions = state.food.map((f, i) => {
    let info = `（độ no+${f.hunger || 0}`;
    if (f.hydration) info += ` nước+${f.hydration}`;
    if (f.effects) {
      if (f.effects.health) info += ` HP+${f.effects.health}`;
      if (f.effects.infection) info += ` nhiễm${f.effects.infection > 0 ? "+" : ""}${f.effects.infection}`;
      if (f.effects.crash) info += ` mệt${f.effects.crash > 0 ? "+" : ""}${f.effects.crash}`;
            if (f.effects.sanity) info += ` lý trí${f.effects.sanity > 0 ? "+" : ""}${f.effects.sanity}`;
    }
    info += "）";
    return { text: getItemDisplayName(f) + info, action: "eat_food", index: i };
  });
  foodOptions.push({ text: "Quay lại", action: "back", index: -1 });
  setOptions(foodOptions);
}

export function handleDrinkSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    setStory("Cơ thể bạn đã hoàn toàn kiệt sức, không muốn uống bất cứ thứ gì. Bạn có thể dùng vật phẩm y tế để khôi phục trạng thái.");
    returnToMenu();
    return;
  }
  if (state.drinks.length === 0) {
    setStory("Bạn không có đồ uống.");
    returnToMenu();
    return;
  }
  setPhase("drink_select");
  setStory("Chọn đồ uống muốn dùng:");
  const drinkOptions = state.drinks.map((d, i) => {
    let info = `（nước+${d.hydration}`;
    if (d.effects && d.effects.crash) info += ` mệt${d.effects.crash > 0 ? "+" : ""}${d.effects.crash}`;
        if (d.effects && d.effects.sanity) info += ` lý trí${d.effects.sanity > 0 ? "+" : ""}${d.effects.sanity}`;
    info += "）";
    return { text: getItemDisplayName(d) + info, action: "drink_item", index: i };
  });
  drinkOptions.push({ text: "Quay lại", action: "back", index: -1 });
  setOptions(drinkOptions);
}

export function handleMedicineSelect() {
  const state = getState();
  if (state.crash >= GAME_CONSTANTS.FATIGUE_MAX) {
    const usableMeds = state.medicine.filter(m => m.effects && (m.effects.crash && m.effects.crash < 0) || (m.effects.sanity && m.effects.sanity > 0));
    if (usableMeds.length === 0) {
      setStory("Cơ thể bạn đã hoàn toàn kiệt sức, không thể dùng vật phẩm y tế. Bạn có thể tìm người khác giúp khôi phục tinh thần.");
      returnToMenu();
      return;
    }
    setPhase("medicine_select");
    setStory("Cơ thể bạn đã hoàn toàn kiệt sức, chỉ có thể dùng vật phẩm khôi phục trạng thái. Chọn vật phẩm y tế muốn dùng:");
    const medOptions = usableMeds.map((m, i) => {
      const effects = [];
      if (m.effects) {
        if (m.effects.health) effects.push(`HP+${m.effects.health}`);
        if (m.effects.infection) effects.push(`nhiễm${m.effects.infection > 0 ? "+" : ""}${m.effects.infection}`);
        if (m.effects.crash) effects.push(`mệt${m.effects.crash > 0 ? "+" : ""}${m.effects.crash}`);
        if (m.effects.sanity) effects.push(`lý trí${m.effects.sanity > 0 ? "+" : ""}${m.effects.sanity}`);
        if (m.effects.hydration) effects.push(`nước+${m.effects.hydration}`);
      }
      return { text: getItemDisplayName(m) + (effects.length > 0 ? `（${effects.join(" ")}）` : ""), action: "use_med", index: state.medicine.indexOf(m) };
    });
    medOptions.push({ text: "Quay lại", action: "back", index: -1 });
    setOptions(medOptions);
    return;
  }
  if (state.medicine.length === 0) {
    setStory("Bạn không có vật phẩm y tế.");
    returnToMenu();
    return;
  }
  setPhase("medicine_select");
  setStory("Chọn vật phẩm y tế muốn dùng:");
  const medOptions = state.medicine.map((m, i) => {
    const effects = [];
    if (m.effects) {
      if (m.effects.health) effects.push(`HP+${m.effects.health}`);
      if (m.effects.infection) effects.push(`nhiễm${m.effects.infection > 0 ? "+" : ""}${m.effects.infection}`);
      if (m.effects.crash) effects.push(`mệt${m.effects.crash > 0 ? "+" : ""}${m.effects.crash}`);
      if (m.effects.sanity) effects.push(`lý trí${m.effects.sanity > 0 ? "+" : ""}${m.effects.sanity}`);
      if (m.effects.hydration) effects.push(`nước+${m.effects.hydration}`);
    }
    return { text: getItemDisplayName(m) + (effects.length > 0 ? `（${effects.join(" ")}）` : ""), action: "use_med", index: i };
  });
  medOptions.push({ text: "Quay lại", action: "back", index: -1 });
  setOptions(medOptions);
}

export function handleFoodAction(input) {
  handleSelectionPhase(input, "food", "Thức ăn", true);
}

export function handleDrinkAction(input) {
  handleSelectionPhase(input, "drinks", "Đồ uống", true);
}

export function handleMedicineAction(input) {
  handleSelectionPhase(input, "medicine", "Vật phẩm y tế", true);
}

export function handleSelectionPhase(input, key, label, consume) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "back") {
    returnToMenu();
    return;
  }

  if (consume && state[key] && state[key][option.index]) {
    const item = state[key][option.index];
    const result = consumeItem(key, option.index);
    if (result) {
      let msg = `Bạn đã dùng ${getItemDisplayName(item)}.`;
      if (result.hunger) msg += ` độ no+${result.hunger}`;
      if (result.hydration) msg += ` nước+${result.hydration}`;
      if (result.effects?.health) msg += ` HP+${result.effects.health}`;
      if (result.effects?.infection) msg += ` nhiễm${result.effects.infection > 0 ? '+' : ''}${result.effects.infection}`;
      if (result.effects?.crash) msg += ` mệt${result.effects.crash > 0 ? '+' : ''}${result.effects.crash}`;
            if (result.effects?.sanity) msg += ` lý trí${result.effects.sanity > 0 ? '+' : ''}${result.effects.sanity}`;
      setStory(msg);
      updateStatusEffects();
      checkDeath();
      const updatedState = getState();
      if (updatedState.gameOver) return;
      if (updatedState[key] && updatedState[key].length > 0) {
        if (key === "food") handleEatSelect();
        else if (key === "drinks") handleDrinkSelect();
        else if (key === "medicine") handleMedicineSelect();
        else returnToMenu();
      } else {
        returnToMenu();
      }
    } else {
      setStory("Thao tác không hợp lệ");
      returnToMenu();
    }
  }
}