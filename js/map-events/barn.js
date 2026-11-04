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
  showExploreOptionsState,
} from '../routing.js';

export function handlePickFruit() {
  const state = getState();
  if (state.lastPickFruitDay > 0 && state.day - state.lastPickFruitDay < GAME_CONSTANTS.MAP_EVENTS.FRUIT_REGROW_DAYS) {
    const remaining = GAME_CONSTANTS.MAP_EVENTS.FRUIT_REGROW_DAYS - (state.day - state.lastPickFruitDay);
    setStory(`Vườn cây trống trơn, chờ trái cây mọc trở lại rồi hãy đến, còn ${remaining} ngày`);
    showExploreOptionsState();
    return;
  }
  const fruits = [];
  for (let i = 0; i < GAME_CONSTANTS.MAP_EVENTS.FRUIT_PICK_COUNT; i++) {
    fruits.push(FRUITS[Math.floor(Math.random() * FRUITS.length)]);
  }
  let added = 0;
  fruits.forEach(f => { if (addItem({ ...f })) added++; });
  setStory(`Bạn hái được ${GAME_CONSTANTS.MAP_EVENTS.FRUIT_PICK_COUNT} trái cây trong vườn cây, nhận được: ${fruits.map(f => f.name).join(", ")}.`);
  state.lastPickFruitDay = state.day;
  advanceTime(2);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
