export const MEDICINES = [
  { id: "bang_keo", name: "Băng tr sticking", type: "medicine", effects: { health: 10 }, rarity: "common" },
  { id: "dich_gluco", name: "Dung dịch gluco", type: "medicine", effects: { health: 25, hydration: 15 }, rarity: "common" },
  { id: "thuoc_giam_dau", name: "Thuốc giảm đau", type: "medicine", effects: { sanity: 15, crash: -5 }, rarity: "uncommon" },
  { id: "thuoc_an_than", name: "Thuốc an thần", type: "medicine", effects: { sanity: 30 }, rarity: "uncommon" },
  { id: "adrenalin", name: "Adrenalin", type: "medicine", effects: { health: 20, crash: -10 }, rarity: "uncommon" },
  { id: "day_bo_mau", name: "Dây bó máu", type: "medicine", effects: { health: 30 }, rarity: "uncommon" },
  { id: "thuoc_sach_vet", name: "Thuốc sạch vết", type: "medicine", effects: { infection: -25 }, rarity: "uncommon" },
  { id: "goi_phau_thuat", name: "Gói phẫu thuật", type: "medicine", effects: { health: 25, crash: -10 }, rarity: "rare" },
  { id: "khang_sinh", name: "Kháng sinh", type: "medicine", effects: { health: 35, infection: -25 }, rarity: "rare" },
  { id: "huyet_thanh", name: "Huyết thanh kháng nhiễm", type: "medicine", effects: { infection: -60 }, rarity: "rare" },
  { id: "goi_cap_cuu", name: "Gói cấp cứu y tế", type: "medicine", effects: { health: 70 }, rarity: "epic" },
  { id: "hop_y_te", name: "Hộp y tế chiến địa", type: "medicine", effects: { health: 120, crash: -30 }, rarity: "epic" },
  { id: "tiem_van_nang", name: "Tiêm thế hệ", type: "medicine", effects: { health: 150, crash: -50, infection: -50, hydration: 20}, rarity: "legendary" },
  { id: "improved_serum", name: "Kháng thể cải tiến", type: "medicine", effects: { infection: -90 }, rarity: "myth" },
  { id: "zombie_gel", name: "Gel zombie", type: "medicine", effects: { infection: 2}, rarity: "myth" },
];

export const NURSE_MEDICINE_POOL = MEDICINES.filter(m => m.rarity === "common" || m.rarity === "uncommon");
