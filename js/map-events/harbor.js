import {
  getState,
  setStory,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  removeGasoline,
} from '../state.js';

import {
  GAME_CONSTANTS,
  SPECIAL_ITEMS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { hasCastleIdentity } from '../faction.js';
import { handleEnterIsland } from '../island/index.js';

export function handleYacht() {
  const state = getState();
  const hasId = hasCastleIdentity(state);
  const hasPass = state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id);
  if (!hasId && !hasPass) {
    setStory("Đây là chiếc du thuyền mang biểu tượng Lâu Đài Tận Thế, đừng na ná nghịch với nó. (Cần thẻ danh tính lâu đài hoặc thẻ thông hành)");
    showExploreOptionsState();
    return;
  }
  if (state.gasoline < 1) {
    setStory("Nó cần 1 bình xăng mới nổ máy được. (Có thể đổi xăng bằng thuốc lá qua Vương Thiết Trụ)");
    showExploreOptionsState();
    return;
  }
  removeGasoline(1);
  setStory("Bạn tiêu hao 1 bình xăng, theo tuyến đường để đến hòn đảo.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    handleEnterIsland();
  }
}

export function handleViewRiver() {
  const state = getState();
  if (state.lastViewRiverDay >= state.day) {
    setStory("Hôm nay đã ngắm cảnh ven sông rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastViewRiverDay = state.day;
  state.crash = Math.max(0, state.crash - GAME_CONSTANTS.MAP_EVENTS.RIVER_FATIGUE_REDUCTION);
  setStory("Biển xanh nối liền trời một sắc ~ Tâm trạng tốt hơn, độ mệt mỏi giảm.");
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
