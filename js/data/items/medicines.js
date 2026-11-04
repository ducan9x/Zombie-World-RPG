export const MEDICINES = [
  { id: "创可贴", name: "Băng tr sticking", type: "medicine", effects: { health: 10 }, rarity: "common" },
  { id: "葡萄糖服液", name: "Dung dịch gluco", type: "medicine", effects: { health: 25, hydration: 15 }, rarity: "common" },
  { id: "止痛片", name: "Thuốc giảm đau", type: "medicine", effects: { sanity: 15, crash: -5 }, rarity: "uncommon" },
  { id: "镇静剂", name: "Thuốc an thần", type: "medicine", effects: { sanity: 30 }, rarity: "uncommon" },
  { id: "肾上腺素", name: "Adrenalin", type: "medicine", effects: { health: 20, crash: -10 }, rarity: "uncommon" },
  { id: "止血带", name: "Dây bó máu", type: "medicine", effects: { health: 30 }, rarity: "uncommon" },
  { id: "清创药", name: "Thuốc sạch vết", type: "medicine", effects: { infection: -25 }, rarity: "uncommon" },
  { id: "手术包", name: "Gói phẫu thuật", type: "medicine", effects: { health: 25, crash: -10 }, rarity: "rare" },
  { id: "抗生素", name: "Kháng sinh", type: "medicine", effects: { health: 35, infection: -25 }, rarity: "rare" },
  { id: "抗感染血청", name: "Huyết thanh kháng nhiễm", type: "medicine", effects: { infection: -60 }, rarity: "rare" },
  { id: "医用急救包", name: "Gói cấp cứu y tế", type: "medicine", effects: { health: 70 }, rarity: "epic" },
  { id: "战地医疗箱", name: "Hộp y tế chiến địa", type: "medicine", effects: { health: 120, crash: -30 }, rarity: "epic" },
  { id: "万能针剂", name: "Tiêm thế hệ", type: "medicine", effects: { health: 150, crash: -50, infection: -50, hydration: 20}, rarity: "legendary" },
  { id: "improved_serum", name: "Kháng thể cải tiến", type: "medicine", effects: { infection: -90 }, rarity: "myth" },
  { id: "zombie_gel", name: "Gel zombie", type: "medicine", effects: { infection: 2}, rarity: "myth" },
];

export const NURSE_MEDICINE_POOL = MEDICINES.filter(m => m.rarity === "common" || m.rarity === "uncommon");
