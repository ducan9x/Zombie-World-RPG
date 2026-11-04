export const BUILDING_MATERIALS = [
  { id: "wood", name: "Gỗ", type: "building" },
  { id: "building_mat", name: "Vật liệu xây dựng", type: "building" },
  { id: "stone", name: "Đá", type: "building" },
  { id: "nails", name: "M đóng", type: "building" },
  { id: "glass", name: "Kính", type: "building" },
];

export const BUILDING_MATERIAL_NAMES = {};
for (const m of BUILDING_MATERIALS) {
  BUILDING_MATERIAL_NAMES[m.id] = m.name;
}
