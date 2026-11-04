import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  GAME_CONSTANTS,
  FOODS,
  CANNED_FOOD_IDS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleExploreFactory() {
  const state = getState();
  if (state.lastFactoryExploreDay >= state.day) {
    setStory("Hôm nay đã khám phá bên trong nhà máy rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastFactoryExploreDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_DAMAGE);
    setStory(`Bạn bất ngờ va vào chất nổ bị thương, trừ ${GAME_CONSTANTS.MAP_EVENTS.FACTORY_EXPLOSION_DAMAGE} sức khỏe.`);
  } else {
    const canned = FOODS.filter(f => CANNED_FOOD_IDS.includes(f.id));
    const can = canned[Math.floor(Math.random() * canned.length)];
    const added = addItem({ ...can });
    if (!added) {
      setStory(`Bạn tìm thấy ${can.name} bên trong nhà máy, nhưng ba lô đã đầy, không thể mang theo.`);
    } else {
      setStory(`Bạn tìm thấy ${can.name} bên trong nhà máy!`);
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    const maps = state.stats?.mapsExplored || [];
    if (!state.unlockedAchievements) state.unlockedAchievements = [];
    for (const entry of GAME_CONSTANTS.ACHIEVEMENTS.EXPLORATION_MAPS) {
      if (maps.length >= entry.threshold && !state.unlockedAchievements.includes(entry.id)) state.unlockedAchievements.push(entry.id);
    }
    showExploreOptionsState();
  }
}

export function handleFactoryWorkshop() {
  const state = getState();
  if (state.lastFactoryWorkshopDay >= state.day) {
    setStory("Hôm nay đã xem qua phân xưởng rồi, mai quay lại nhé.");
    showExploreOptionsState();
    return;
  }
  state.lastFactoryWorkshopDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SCARY_RATE) {
    state.sanity = Math.max(0, state.sanity - GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SANITY_LOSS);
    const scaryStories = [
      "Một chiếc máy dập lớn gỉ sét đột nhiên tự khởi động, phát ra tiếng kim loại va chạm chói tai——nhưng dây điện đã bị cắt từ lâu. Bạn lăn lộn bò ra khỏi phân xưởng, tim đập thình thịch không ngừng.",
      "Trong góc tối của băng chuyền đột nhiên nằm một thi thể đã khô héo từ lâu, các ngón tay vẫn giữ tư thế chỉ về một hướng nào đó. Bạn theo hướng đó nhìn, trên tường dùng máu viết một dòng chữ: \"Họ vẫn đang nhìn tôi\".",
      "Bạn nghe thấy tiếng khóc trẻ sơ sinh yếu ớt phát ra từ sâu trong phân xưởng. Đi theo âm thanh, bạn phát hiện một chiếc radio cũ nằm giữa đống kính vỡ, đang phát một đoạn ghi âm lặp đi lặp lại. Bên cạnh radio rải rác vài chiếc răng sữa.",
      "Có thứ gì đó đang bò trong ống thông gió trên trần phân xưởng. Bạn ngẩng đầu lên, hàng chục đôi mắt phát ra ánh sáng xanh lét đang lạnh lùng nhìn bạn qua khe sắt. Đó không phải chuột.",
      "Một bộ hài cốt mặc đồ công nhân ngồi trước bàn điều khiển, như thể vẫn đang tăng ca. Màn hình máy tính trước mặt nó thế mà còn sáng, trên đó liên tục nhấp nháy một dòng chữ: \"Giờ tan làm đã qua, xin mau chóng rời đi\".",
    ];
    setStory(scaryStories[Math.floor(Math.random() * scaryStories.length)] + `\n\nLý trí của bạn -${GAME_CONSTANTS.MAP_EVENTS.FACTORY_WORKSHOP_SANITY_LOSS}`);
  } else {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    const added = addItem({ ...food });
    if (added) {
      setStory(`Bạn lục trong tủ đồ nhân viên của phân xưởng thì tìm thấy một gói chưa mở——${food.name}! Xem ra trước đây có người đã lén giấu nó vào tận sâu nhất của tủ.`);
    } else {
      setStory(`Bạn phát hiện ${food.name} trong tủ đồ nhân viên của phân xưởng, nhưng ba lô đã đầy, không thể mang theo.`);
    }
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
