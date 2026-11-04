import {
  getState,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  setLocation,
  setCurrentMap,
  setPhase,
  setStory,
  setOptions,
} from '../state.js';

import {
  MAPS,
  MAP_DESCRIPTIONS,
  GAME_CONSTANTS,
} from '../config.js';

import { showHomeOptions, showExploreOptionsState } from '../routing.js';

import { checkGoHomeEnding } from './endings.js';

import { handleCastleOutpost } from '../castle/index.js';

export function handleGoOut() {
  setPhase("map_select");
  setStory("Hãy chọn địa điểm bạn muốn đến:");
  const mapOptions = MAPS.filter(m => !m.hidden).map(m => ({
    text: `${m.name} [${m.danger}]`,
    action: "select_map",
    map: m
  }));
  mapOptions.push({ text: "Quay lại", action: "back", map: null });
  setOptions(mapOptions);
}

export function handleGoHome() {
  const state = getState();

  if (checkGoHomeEnding()) return;

  // Khi tâm trí về 0, xuất hiện ảo giác bên ngoài, không thể về nhà
  if (state.sanity <= 0 && state.location !== "幸存者帐篷") {
    setStory("Thế giới trước mắt trở nên méo mó và xa lạ——đường nét tòa nhà không ngừng nhúc nhích, màu sắc bầu trời chớp nháy điên cuồng, mặt đất như chao đảo dưới chân……\n\nBạn cố gắng nhận biết phương hướng, nhưng mỗi lần nhìn thấy đều là cảnh tượng khác nhau. Con đường quen thuộc kéo dài vào bóng tối lạ lẫm, phương hướng về nhà bị xóa sạch trong ảo giác.\n\n(Tâm trí về 0 xuất hiện ảo giác nghiêm trọng, không thể nhận biết đường về nhà. Hãy dùng thuốc an thần để khôi phục tâm trí.)");
    return;
  }

  setLocation("幸存者帐篷");
  setCurrentMap(null);
  state.currentSubMap = null;
  advanceTime(1);
  updateStatusEffects();
  setStory("Sau vài giờ đi đường và tránh zombie trên đường, bạn cuối cùng cũng an toàn trở về căn nhà nhỏ của người sống sót.");
  checkDeath();
  if (!state.gameOver) showHomeOptions();
}

export function handleMapAction(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) {
    return;
  }

  const option = state.options[optionIndex];
  if (option.action === "back") {
    showHomeOptions();
    return;
  }

  const map = option.map;
  if (!map) {
    return;
  }

  setCurrentMap(map);
  setLocation(map.name);

  const mapId = map.id;
  if (!state.stats.mapsExplored) state.stats.mapsExplored = [];
  if (!state.stats.mapsExplored.includes(mapId)) {
    state.stats.mapsExplored.push(mapId);
  }

  if (map.id === "末日城堡") {
    setStory("Bạn đã đến trước cổng Lâu đài Tận thế.");
    advanceTime(1);
    updateStatusEffects();
    checkDeath();
    if (!state.gameOver) {
      handleCastleOutpost();
    }
    return;
  }

  let entryMsg = MAP_DESCRIPTIONS[map.id] || `Bạn đã vào ${map.name}.`;
  for (const [key, msg] of Object.entries(GAME_CONSTANTS.MAP.DANGER_MESSAGES)) {
    if (map.danger.includes(key)) {
      entryMsg += msg;
      break;
    }
  }
  setStory(entryMsg);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}