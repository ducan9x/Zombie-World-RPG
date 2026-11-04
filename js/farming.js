import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  getItemDisplayName,
} from './state.js';

import {
  CROPS,
  SEEDS,
  CROP_FOOD_MAP,
  GAME_CONSTANTS,
} from './config.js';

import { showBaseBuildOptions } from './routing.js';

export function handlePlantCrop() {
  const state = getState();
  const emptySlot = state.crops.findIndex(c => c === null);
  if (emptySlot === -1) {
    setStory("🌱 Cả 5 ô đất của bạn đều đã trồng đầy! Đợi cây trồng chín thu hoạch xong, có chỗ trống rồi hãy quay lại.");
    showBaseBuildOptions();
    return;
  }
  if (!state.seeds || state.seeds.length === 0) {
    setStory("🌱 Bạn lục khắp túi, không có hạt giống nào.\n\nHãy đi mua hạt giống chỗ Mục Miêu Miêu, hoặc chăm sóc ruộng thí nghiệm để nhận hạt giống.");
    showBaseBuildOptions();
    return;
  }
  const availableSeeds = state.seeds.filter(s => (s.count || 1) > 0);
  if (availableSeeds.length === 0) {
    setStory("🌱 Bạn lục khắp túi, không có hạt giống nào.\n\nHãy đi mua hạt giống chỗ Mục Miêu Miêu, hoặc chăm sóc ruộng thí nghiệm để nhận hạt giống.");
    showBaseBuildOptions();
    return;
  }
  setPhase("seed_select");
  setStory("🌱 Chọn hạt giống muốn trồng:\n\nMỗi loại hạt giống tương ứng một loại cây trồng, trồng gì được nấy.");
  const opts = availableSeeds.map((seed, i) => ({
    text: `${getItemDisplayName(seed)}`,
    action: "seed_plant",
    index: i,
    seedItem: seed,
  }));
  opts.push({ text: "Quay lại", action: "seed_back", index: -1 });
  setOptions(opts);
}

export function handleSeedSelect(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) {
    showBaseBuildOptions();
    return;
  }
  const option = state.options[optIdx];
  if (option.action === "seed_back") {
    showBaseBuildOptions();
    return;
  }
  if (option.action !== "seed_plant") {
    showBaseBuildOptions();
    return;
  }
  const seedItem = option.seedItem;
  if (!seedItem) {
    showBaseBuildOptions();
    return;
  }
  const cropData = CROPS.find(c => c.seedId === seedItem.id);
  if (!cropData) {
    showBaseBuildOptions();
    return;
  }
  const emptySlot = state.crops.findIndex(c => c === null);
  if (emptySlot === -1) {
    setStory("🌱 Không còn ô đất trống nào!");
    showBaseBuildOptions();
    return;
  }
  if ((seedItem.count || 1) > 1) {
    seedItem.count = (seedItem.count || 1) - 1;
  } else {
    const seedIdx = state.seeds.indexOf(seedItem);
    state.seeds.splice(seedIdx, 1);
  }
  state.crops[emptySlot] = {
    name: cropData.name,
    matureTurns: cropData.matureTurns,
    totalTurns: cropData.matureTurns,
    yield: cropData.yield,
    cropId: cropData.id,
  };
  const daysLeft = Math.ceil(cropData.matureTurns / GAME_CONSTANTS.TURNS_PER_DAY);
  setStory(`🌱 Bạn ngồi xổm trước ô đất [${emptySlot + 1}], cẩn thận chôn ${cropData.seedName} xuống đất, phủ đất nhẹ nhàng, tưới nước.\n\nDự kiến sau ${cropData.matureTurns} lượt có thể thu hoạch (khoảng ${daysLeft} ngày). Khi thu hoạch sẽ nhận ${cropData.yield} phần ${cropData.name}.`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showBaseBuildOptions();
  }
}

export function handleViewCrops() {
  const state = getState();
  let lines = [`🌾 [Trạng thái đất trồng]`];
  lines.push(`━━━━━━━━━━━━━━━━━`);
  let hasAny = false;
  for (let i = 0; i < state.crops.length; i++) {
    const crop = state.crops[i];
    if (crop === null) {
      lines.push(`[${i + 1}] ⬜ Trống`);
    } else if (crop.matureTurns <= 0) {
      lines.push(`[${i + 1}] ✅ ${crop.name} —— Đã chín, nhanh tay thu hoạch!`);
      hasAny = true;
    } else {
      const turnsLeft = crop.matureTurns;
      const daysLeft = Math.ceil(turnsLeft / GAME_CONSTANTS.TURNS_PER_DAY);
      const progress = Math.round((1 - turnsLeft / crop.totalTurns) * 100);
      lines.push(`[${i + 1}] 🌱 ${crop.name} —— Còn ${turnsLeft} lượt (khoảng ${daysLeft} ngày) [${progress}%]`);
      hasAny = true;
    }
  }
  lines.push(`━━━━━━━━━━━━━━━━━`);
  if (!hasAny) {
    lines.push(`💡 Tất cả ô đất đều trống, hãy trồng gì đó! Đi kiếm hạt giống đi.`);
  }
  lines.push(`💡 Túi tối đa trồng cùng lúc 5 ô, sau thu hoạch tự động trống chỗ.`);
  setStory(lines.join("\n"));
  showBaseBuildOptions();
}

export function handleHarvestCrops() {
  const state = getState();
  let harvested = [];
  let foodNames = [];
  for (let i = 0; i < state.crops.length; i++) {
    const crop = state.crops[i];
    if (crop !== null && crop.matureTurns <= 0) {
      const foodTemplate = CROP_FOOD_MAP[crop.cropId];
      if (!foodTemplate) {
        state.crops[i] = null;
        continue;
      }
      const yieldCount = crop.yield || 1;
      let addedCount = 0;
      for (let j = 0; j < yieldCount; j++) {
        const added = addItem({ ...foodTemplate });
        if (!added) {
          if (addedCount > 0) {
            harvested.push(`${crop.name}×${addedCount}`);
            foodNames.push(`${crop.name}×${addedCount}`);
          }
          if (addedCount >= yieldCount) {
            state.crops[i] = null;
          } else {
            crop.yield = yieldCount - addedCount;
          }
          setStory(`⚠️ Túi đã đầy! Chỉ thu hoạch được một phần cây trồng.\n\nĐã thu hoạch: ${foodNames.join("、")}\nHãy dọn chỗ túi rồi quay lại thu hoạch phần còn lại.`);
          showBaseBuildOptions();
          return;
        }
        addedCount++;
        foodNames.push(foodTemplate.name);
      }
      harvested.push(`${crop.name}×${yieldCount}`);
      state.crops[i] = null;
    }
  }
  if (harvested.length === 0) {
    setStory("🌾 Trong đất không có cây trồng nào để thu hoạch. Hoặc chưa chín, hoặc chưa trồng. Hãy xem [Xem đất trồng].");
  } else {
    setStory(`🌾 Bạn mang giỏ bước vào ruộng, cẩn thận hái những quả đã chín.\n\nDanh sách thu hoạch: ${harvested.join("、")}\nTổng cộng ${foodNames.length} phần thức ăn đã cất vào túi.`);
  }
  showBaseBuildOptions();
}