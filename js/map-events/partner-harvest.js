import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  FOODS,
  DRINKS,
  FRUITS,
  AMMO,
  NURSE_MEDICINE_POOL,
  randInt,
} from '../config.js';

import {
  showHomeOptions,
} from '../routing.js';

export function handlePartnerHarvest() {
  const state = getState();
  const hasLiuruyan = state.liuruyanRescued;
  const hasNurse = state.nurseZombieRescued;

  if (!hasLiuruyan && !hasNurse) {
    setStory("Bạn vẫn chưa có đồng hành nào theo bạn.");
    showHomeOptions();
    return;
  }

  const liuruyanReady = hasLiuruyan && state.lastPartnerHarvestDay < state.day;
  const nurseReady = hasNurse && state.lastNurseHarvestDay < state.day;

  if (!liuruyanReady && !nurseReady) {
    setStory("Các đồng hành của bạn hôm nay đã ra ngoài hết rồi, mai quay lại nhé.");
    showHomeOptions();
    return;
  }

  let storyLines = [];

  if (liuruyanReady) {
    const liruyanItems = [];
    for (let j = 0; j < 2; j++) {
      const roll = Math.random() * 100;
      let item;
      if (roll < 38.5) {
        item = { ...FOODS[Math.floor(Math.random() * FOODS.length)] };
      } else if (roll < 61.6) {
        item = { ...DRINKS[Math.floor(Math.random() * DRINKS.length)], type: "drink" };
      } else if (roll < 82.8) {
        item = { ...FRUITS[Math.floor(Math.random() * FRUITS.length)], type: "fruit" };
      } else {
        const a = AMMO[Math.floor(Math.random() * AMMO.length)];
        item = { id: a.id, name: a.name, type: "ammo", count: randInt(3, 12) };
      }
      if (item) {
        const added = addItem(item);
        if (added) liruyanItems.push(item.name);
      }
    }
    state.lastPartnerHarvestDay = state.day;
    storyLines.push(`Lưu Như Yên hôm nay mang đến cho bạn${liruyanItems.join(", ")}.`);
  }

  if (nurseReady) {
    const med = NURSE_MEDICINE_POOL[Math.floor(Math.random() * NURSE_MEDICINE_POOL.length)];
    addItem({ ...med, type: "medicine" });
    state.lastNurseHarvestDay = state.day;
    storyLines.push(`Lộ Lộ Vy hôm nay mang đến cho bạn${med.name}.`);
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setStory(storyLines.join("\n"));
    showHomeOptions();
  }
}
