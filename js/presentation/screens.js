// Screen identity is a projection. Phase/options remain exclusively Core-owned.
export function describeScreen(state) {
  const phase = state.phase;
  if (phase === 'ending') return ['MỘT CÂU CHUYỆN KHÉP LẠI', 'Kết cục', 'ending'];
  if (phase === 'pre_combat' || phase === 'pre_combat_npc') return ['MỐI ĐE DỌA TRƯỚC MẮT', 'Chạm trán', 'encounter'];
  if (phase === 'map_select') return ['CHỌN ĐƯỜNG ĐI TIẾP', 'Sa bàn chiến thuật', 'map'];
  if (phase === 'base_build' || phase.includes('upgrade_confirm')) return ['XÂY DỰNG MỘT NƠI ĐỂ TRỞ VỀ', 'Nơi trú ẩn', 'base'];
  if (phase.startsWith('warehouse_')) return ['QUẢN LÝ VẬT TƯ', 'Kho căn cứ', 'warehouse'];
  if (phase === 'seed_select') return ['ĐỂ NGÀY MAI CÒN SỐNG', 'Gieo trồng', 'farm'];
  if (phase.startsWith('trade') || phase.includes('_trade') || phase.includes('black_market') || phase.startsWith('island_street')) return ['VẬT TƯ LUÔN CÓ CÁI GIÁ CỦA NÓ', 'Trao đổi & tiếp tế', 'trade'];
  if (phase.includes('bank') || phase === 'island_invest' || phase === 'castle_loan_input') return ['KINH TẾ VÙNG HOANG', 'Tài chính', 'finance'];
  if (phase === 'island_linhan' && state.options?.some(option => option.cookRecipe)) return ['CHẾ BIẾN TẠI LÂM HÀN', 'Công thức hải sản', 'recipe'];
  if (phase === 'survival_notes' || phase === 'survival_notes_detail') return ['KIẾN THỨC GIỮ BẠN SỐNG SÓT', 'Ghi chép sinh tồn', 'journal'];
  if (phase.startsWith('npc_') || phase.startsWith('map_npc') || phase.startsWith('lili_') || ['island_yumo', 'island_guyue', 'island_linhan', 'nurse_feed'].includes(phase)) return ['NHỮNG NGƯỜI CÒN Ở LẠI', 'Gặp gỡ & đối thoại', 'dialogue'];
  if (phase === 'island_fishing') return ['GIỮA MẶT NƯỚC VÀ BÓNG TỐI', 'Bãi câu', 'fishing'];
  if (phase === 'choose') return ['MỘT KHOẢNG LẶNG GIỮA TẬN THẾ', state.location, 'home'];
  return ['NHẬT KÝ SINH TỒN', state.location || 'Hiện trường', 'field'];
}
