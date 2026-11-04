import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  FRUITS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  hasDawnCaptainBadge,
  hasCastleIdentity,
  cleanDualIdentity,
} from '../faction.js';

import { showOutpostOptions } from './menu.js';

export function handleWork() {
  const state = getState();
  cleanDualIdentity(state);
  if (hasCastleIdentity(state)) {
    setStory("Quản lý trận địa nhíu mày: \"Bạn đều là người Lâu Đại Cítol rồi, còn đến tranh việc làm của người nghèo?Đi đi đi!\" Bạn bị đuổi đi.");
    showOutpostOptions();
    return;
  }
  if (state.phaseIndex < 1 || state.phaseIndex > 4) {
    setStory("Người ở trận địa đã hết giờ làm, hãy quay lại làm việc ngày mai.");
    showOutpostOptions();
    return;
  }
  state.hunger = Math.max(0, state.hunger - GAME_CONSTANTS.OUTPOST.WORK_HUNGER_COST);
  state.hydration = Math.max(0, state.hydration - GAME_CONSTANTS.OUTPOST.WORK_HYDRATION_COST);
  state.crash = Math.min(100, state.crash + GAME_CONSTANTS.OUTPOST.WORK_FATIGUE_GAIN);
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const added1 = addItem({ ...fruit });
  let story = `Bạn làm việc vài tiếng đồng hồ, nhận được ${fruit.name}.`;

  const hasCaptain = hasDawnCaptainBadge(state);
  if (hasCaptain) {
    const fruit2 = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const added2 = addItem({ ...fruit2 });
    story = `Danh tính Đội Trưởng Tiên Phong giúp bạn nhận gấp đôi thu hoạch! Bạn làm việc vài tiếng đồng hồ, nhận được ${fruit.name} và ${fruit2.name}.`;
    if (!added2) story += " Nhưng balo đã đầy, một phần vật phẩm rơi vãi xuống đất.";
  }

  if (!added1) story += " Nhưng balo đã đầy, vật phẩm rơi vãi xuống đất.";
  setStory(story);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  showOutpostOptions();
}
