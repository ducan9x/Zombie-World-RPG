import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  AMMO,
  FOODS,
  FIXED_LOOT_DROPS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { triggerEnding } from '../game/endings.js';

export function handleExploreTunnel() {
  const state = getState();
  if (state.lastTunnelDay >= state.day) {
    setStory("Hôm nay đã khám phá đường hầm rồi, ngày mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  const roll = Math.random();
  if (roll < GAME_CONSTANTS.MAP_EVENTS.TUNNEL_CACHE_RATE) {
    const tunnelDrop = FIXED_LOOT_DROPS.tunnel_cache;
    const ammo9mm = AMMO.find(a => a.id === tunnelDrop.ammoId);
    const ammo = addItem({ id: ammo9mm.id, name: ammo9mm.name, type: "ammo", count: tunnelDrop.ammoCount });
    const biscuit = FOODS.find(f => f.id === tunnelDrop.foodId);
    const food = addItem({ ...biscuit });
    setStory("Bạn mạo hiểm đi sâu vào đường hầm, bên cạnh đường ray bị gãy lại phát hiện một thùng vật tư bị bỏ lại! Bên trong có một ít đạn dược và thức ăn." + (ammo && food ? "" : "\nTuy nhiên balo không đủ chỗ, một phần vật phẩm không thể mang theo."));
  } else if (roll < GAME_CONSTANTS.MAP_EVENTS.TUNNEL_COLLAPSE_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.TUNNEL_COLLAPSE_DAMAGE);
    setStory(`Sâu trong đường hầm vang lên tiếng nổ lớn, tấm xi măng trên đỉnh rơi xuống từng khối! Bạn bị đá sập đè trúng, sinh mệnh -${GAME_CONSTANTS.MAP_EVENTS.TUNNEL_COLLAPSE_DAMAGE}.`);
  } else if (roll < GAME_CONSTANTS.MAP_EVENTS.TUNNEL_GAS_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.TUNNEL_GAS_DAMAGE);
    state.infection = Math.min(100, state.infection + GAME_CONSTANTS.MAP_EVENTS.TUNNEL_GAS_INFECTION);
    setStory(`Bạn đi sâu vào đường hầm, trong không khí tràn ngập mùi hóa chất xộc mũi. Khí độc đã rò rỉ! Bạn ho dữ dội, sinh mệnh -${GAME_CONSTANTS.MAP_EVENTS.TUNNEL_GAS_DAMAGE}, lây nhiễm +${GAME_CONSTANTS.MAP_EVENTS.TUNNEL_GAS_INFECTION}.`);
  } else {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.TUNNEL_ZOMBIE_SWARM_DAMAGE);
    setStory(`Trong đường hầm vang lên tiếng bước chân dày đặc——một đàn zombie bất ngờ xông ra từ chỗ tối! Bạn bị vây công, sinh mệnh -${GAME_CONSTANTS.MAP_EVENTS.TUNNEL_ZOMBIE_SWARM_DAMAGE}.`);
  }
  state.lastTunnelDay = state.day;
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

// ========== Nhiệm vụ Lão Mã: Kết thúc 14 ==========

export function handleWaitOldMa() {
  const state = getState();
  if (state.oldMaStep < 7) {
    setStory("Trong đường hầm không một bóng người. Bạn chờ một lúc, không có chuyện gì xảy ra. Có lẽ chưa đến lúc.");
    showExploreOptionsState();
    return;
  }
  triggerEnding("ending_used");
}