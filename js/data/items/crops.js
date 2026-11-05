export const CROPS = [
  { id: "niupicai", name: "Cáu bò", matureTurns: 12, yield: 1, seedId: "seed_niupicai", seedName: "Hạt cáu bò", hunger: 18, hydration: 15 },
  { id: "machixian", name: "Xà lách bò", matureTurns: 14, yield: 1, seedId: "seed_machixian", seedName: "Hạt xà lách bò", hunger: 22, hydration: 18 },
  { id: "juju", name: "Cách lá", matureTurns: 16, yield: 2, seedId: "seed_juju", seedName: "Hạt cách lá", hunger: 12, hydration: 12 },
  { id: "yangjiang", name: "Hành lá Tây", matureTurns: 20, yield: 2, seedId: "seed_yangjiang", seedName: "Hạt hành lá Tây", hunger: 16, hydration: 10 },
  { id: "mushu", name: "Cassava", matureTurns: 36, yield: 3, seedId: "seed_mushu", seedName: "Hạt cassava", hunger: 20, hydration: 8 },
  { id: "hongshu", name: "Khoai lang", matureTurns: 32, yield: 3, seedId: "seed_hongshu", seedName: "Hạt khoai lang", hunger: 18, hydration: 12 },
  { id: "tudou", name: "Khoai tây", matureTurns: 24, yield: 2, seedId: "seed_tudou", seedName: "Hạt khoai tây", hunger: 20, hydration: 10 },
  { id: "wujing", name: "Củ cải trắng", matureTurns: 22, yield: 2, seedId: "seed_wujing", seedName: "Hạt cải trắng", hunger: 18, hydration: 12 },
  { id: "boluomencan", name: "Nhan sam Ba La Môn", matureTurns: 28, yield: 2, seedId: "seed_boluomencan", seedName: "Hạt nhan sam Ba La Môn", hunger: 24, hydration: 8 },
  { id: "luobo", name: "Cà rốt", matureTurns: 26, yield: 2, seedId: "seed_luobo", seedName: "Hạt cà rốt", hunger: 22, hydration: 14 },
  { id: "jiucai", name: "Hẹ", matureTurns: 14, yield: 1, seedId: "seed_jiucai", seedName: "Hạt hẹ", hunger: 22, hydration: 12 },
  { id: "gouqi", name: "Kỷ tử", matureTurns: 20, yield: 2, seedId: "seed_gouqi", seedName: "Hạt kỷ tử", hunger: 16, hydration: 20 },
  { id: "suanmo", name: "Rau chua", matureTurns: 16, yield: 1, seedId: "seed_suanmo", seedName: "Hạt rau chua", hunger: 25, hydration: 20 },
  { id: "heimai", name: "Lúa mạch đen", matureTurns: 40, yield: 4, seedId: "seed_heimai", seedName: "Hạt mạch đen", hunger: 18, hydration: 6 },
  { id: "wandou", name: "Đậu Hà Lan", matureTurns: 28, yield: 3, seedId: "seed_wandou", seedName: "Hạt đậu Hà Lan", hunger: 16, hydration: 14 },
];

export const SEEDS = CROPS.map(crop => ({
  id: crop.seedId,
  name: crop.seedName,
  type: "seed",
  cropId: crop.id,
}));

export const CROP_FOOD_MAP = {};
for (const crop of CROPS) {
  const foodItem = { id: crop.id, name: crop.name, type: "food", hunger: crop.hunger };
  if (crop.hydration) foodItem.hydration = crop.hydration;
  CROP_FOOD_MAP[crop.id] = foodItem;
}
