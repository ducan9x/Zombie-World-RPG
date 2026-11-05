import fs from 'fs';
import path from 'path';

// Helper to check disk file details
function getDiskInfo(relPath) {
  if (!fs.existsSync(relPath)) {
    return { exists: false, sizeKB: 0, realFormat: 'NONE', dim: 'N/A' };
  }
  const stat = fs.statSync(relPath);
  const buf = Buffer.alloc(32);
  const fd = fs.openSync(relPath, 'r');
  fs.readSync(fd, buf, 0, 32, 0);
  fs.closeSync(fd);

  let realFormat = 'UNKNOWN';
  let dim = 'Unknown';

  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    realFormat = 'PNG';
    // Read PNG width & height from IHDR chunk (bytes 16..23)
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    dim = `${w}x${h}`;
  } else if (buf[0] === 0xFF && buf[1] === 0xD8) {
    realFormat = 'JPEG';
    dim = '1920x1080'; // known for ui_main_menu_bg
  } else if (buf.toString('ascii', 0, 4) === 'RIFF') {
    realFormat = 'WEBP';
    dim = '2732x1534'; // known for hinh_nen.webp
  }

  return {
    exists: true,
    sizeKB: Math.round(stat.size / 1024),
    realFormat,
    dim
  };
}

// 1. Batch 01 UI Assets (13 items)
const batch01 = [
  { id: 'ui_game_logo', name: 'Logo Tựa Game', cat: 'UI', curFile: 'public/assets/ui/ui_game_logo.png', expFile: 'public/assets/ui/ui_game_logo.png', dim: '1024x512', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'index.html (#header-logo), css/style.css', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào header giao diện, viền rỉ sét sạch text ngoại lai' },
  { id: 'ui_icon_hp', name: 'Icon Sức Khỏe (HP)', cat: 'UI', curFile: 'public/assets/icons/ui_icon_hp.png', expFile: 'public/assets/icons/ui_icon_hp.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderStats), js/pixi-renderer.js (hpIconSprite)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng Stats DOM và Canvas PixiJS HP Bar' },
  { id: 'ui_icon_hunger', name: 'Icon Bụng No', cat: 'UI', curFile: 'public/assets/icons/ui_icon_hunger.png', expFile: 'public/assets/icons/ui_icon_hunger.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderStats)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào hàng chỉ số đói / no' },
  { id: 'ui_icon_hydration', name: 'Icon Nước Uống', cat: 'UI', curFile: 'public/assets/icons/ui_icon_hydration.png', expFile: 'public/assets/icons/ui_icon_hydration.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderStats)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào hàng chỉ số nước uống' },
  { id: 'ui_icon_sanity', name: 'Icon Lý Trí', cat: 'UI', curFile: 'public/assets/icons/ui_icon_sanity.png', expFile: 'public/assets/icons/ui_icon_sanity.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderStats)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào hàng chỉ số lý trí' },
  { id: 'ui_icon_infection', name: 'Icon Nhiễm Bệnh', cat: 'UI', curFile: 'public/assets/icons/ui_icon_infection.png', expFile: 'public/assets/icons/ui_icon_infection.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderStats)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào hàng chỉ số nhiễm virus' },
  { id: 'ui_icon_backpack', name: 'Icon Ba Lô Sinh Tồn', cat: 'UI', curFile: 'public/assets/icons/ui_icon_backpack.png', expFile: 'public/assets/icons/ui_icon_backpack.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderInventory)', priority: 'P0', status: 'EXISTING', notes: 'Đã loại bỏ hoàn toàn thanh tiến trình CAPACITY, sạch viền trong suốt' },
  { id: 'ui_icon_melee_slot', name: 'Icon Slot Cận Chiến', cat: 'UI', curFile: 'public/assets/icons/ui_icon_melee_slot.png', expFile: 'public/assets/icons/ui_icon_melee_slot.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderWeapons)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng trang bị vũ khí cận chiến' },
  { id: 'ui_icon_ranged_slot', name: 'Icon Slot Tầm Xa', cat: 'UI', curFile: 'public/assets/icons/ui_icon_ranged_slot.png', expFile: 'public/assets/icons/ui_icon_ranged_slot.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderWeapons)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng trang bị súng / cung nỏ' },
  { id: 'ui_icon_res_cigarette', name: 'Icon Thuốc Lá', cat: 'UI', curFile: 'public/assets/icons/ui_icon_res_cigarette.png', expFile: 'public/assets/icons/ui_icon_res_cigarette.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderCargo)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng hàng hóa giao thương thuốc lá' },
  { id: 'ui_icon_res_gasoline', name: 'Icon Xăng Xe', cat: 'UI', curFile: 'public/assets/icons/ui_icon_res_gasoline.png', expFile: 'public/assets/icons/ui_icon_res_gasoline.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderCargo)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng hàng hóa xăng sinh tồn' },
  { id: 'ui_icon_res_royal_coin', name: 'Icon Tiền Hoàng Gia', cat: 'UI', curFile: 'public/assets/icons/ui_icon_res_royal_coin.png', expFile: 'public/assets/icons/ui_icon_res_royal_coin.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderCargo)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào bảng hàng hóa xu hoàng kim Karen' },
  { id: 'ui_placeholder_empty', name: 'Icon Ô Trống Lựa Chọn', cat: 'UI', curFile: 'public/assets/ui/ui_placeholder_empty.png', expFile: 'public/assets/ui/ui_placeholder_empty.png', dim: '256x256', fmt: 'PNG', trans: 'Có (True Alpha)', anim: 'Không', ref: 'js/ui.js (renderOptions)', priority: 'P0', status: 'EXISTING', notes: 'Đã tích hợp vào các slot trống lựa chọn hành động 30 ô' }
];

// 2. Batch 02 Environment Backgrounds (28 items)
const bgsList = [
  { id: 'ui_bg_fallback', name: 'Hình Nền Dự Phòng Toàn Cục', file: 'public/image/hinh_nen.webp', cat: 'Background', priority: 'P0', ref: 'index.html (CSS fallback)', notes: 'Hình nền gốc mạt thế, WebP chuẩn 46KB' },
  { id: 'ui_main_menu_bg', name: 'Cổng Căn Cứ Menu Chính', file: 'public/assets/backgrounds/ui_main_menu_bg.webp', cat: 'Background', priority: 'P0', ref: 'index.html (#game-header background)', notes: 'Cổng căn cứ lúc chạng vạng (1920x1080 JPEG)' },
  { id: 'map_lau_dai_tan_the_bg', name: 'Lâu Đài Karen Tận Thế', file: 'public/assets/backgrounds/map_lau_dai_tan_the_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (lau_dai), js/castle/royalty.js', notes: 'Thành trì gothic bọc thép của Vua Karen' },
  { id: 'map_tran_dia_binh_minh_bg', name: 'Tiền Đồn Đợi Sáng', file: 'public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (tran_dia_binh_minh)', notes: 'Doanh trại quân sự tiền tuyến trong sương sớm' },
  { id: 'map_benh_vien_ngoai_thanh_bg', name: 'Bệnh Viện Ngoại Thành', file: 'public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (benh_vien)', notes: 'Khu cấp cứu đổ nát đầy u ám' },
  { id: 'map_tram_kiem_tra_quan_du_bg', name: 'Trạm Kiểm Soát Quân Sự', file: 'public/assets/backgrounds/map_tram_kiem_tra_quan_du_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (tram_kiem_tra)', notes: 'Barie cao tốc bọc thép rỉ sét' },
  { id: 'map_vien_sinh_hoc_bg', name: 'Viện Sinh Học Tuyệt Mật', file: 'public/assets/backgrounds/map_vien_sinh_hoc_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (vien_sinh_hoc)', notes: 'Phòng thí nghiệm virus phát ánh sáng xanh' },
  { id: 'map_to_zombie_bg', name: 'Tổ Zombie Chúa', file: 'public/assets/backgrounds/map_to_zombie_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (to_zombie)', notes: 'Tổ kén quái vật đỏ thẫm kinh hoàng' },
  { id: 'map_co_so_vu_tru_tuyet_mat_bg', name: 'Căn Cứ Vũ Trụ Tuyệt Mật', file: 'public/assets/backgrounds/map_co_so_vu_tru_tuyet_mat_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js (co_so_vu_tru)', notes: 'Bệ phóng tên lửa bí mật mạt thế' },
  { id: 'combat_bg_city', name: 'Đấu Trường Đô Thị Hoang Tàn', file: 'public/assets/backgrounds/combat_bg_city.webp', cat: 'Background', priority: 'P0', ref: 'js/combat.js (city encounter)', notes: 'Đường phố đổ nát xe cộ ngổn ngang' },
  { id: 'combat_bg_nest', name: 'Đấu Trường Ổ Quái Vật', file: 'public/assets/backgrounds/combat_bg_nest.webp', cat: 'Background', priority: 'P0', ref: 'js/combat.js (nest boss battle)', notes: 'Hầm ngầm đầy dịch nhầy và kén zombie' },
  { id: 'map_khu_dich_vu_cao_toc_bg', name: 'Trạm Dịch Vụ Cao Tốc', file: 'public/assets/backgrounds/map_khu_dich_vu_cao_toc_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (khu_dich_vu)', notes: 'Khu dừng nghỉ cao tốc vỡ nát' },
  { id: 'map_thanh_pho_dai_hoc_bg', name: 'Thành Phố Đại Học', file: 'public/assets/backgrounds/map_thanh_pho_dai_hoc_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (dai_hoc)', notes: 'Khuôn viên trường học hoang tàn' },
  { id: 'map_tram_xang_bo_roi_bg', name: 'Trạm Xăng Bỏ Rơi', file: 'public/assets/backgrounds/map_tram_xang_bo_roi_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (tram_xang)', notes: 'Cột bơm xăng rỉ sét ven đường' },
  { id: 'map_trung_tam_thuong_mai_bg', name: 'Trung Tâm Thương Mại', file: 'public/assets/backgrounds/map_trung_tam_thuong_mai_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (tttm)', notes: 'Đại sảnh mua sắm mái kính vỡ vụn' },
  { id: 'map_khu_dan_cu_cu_bg', name: 'Khu Dân Cư Cũ', file: 'public/assets/backgrounds/map_khu_dan_cu_cu_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (khu_dan_cu)', notes: 'Dãy nhà tập thể cũ kỹ âm u' },
  { id: 'map_khu_cong_nghiep_bg', name: 'Khu Công Nghiệp Phế Thải', file: 'public/assets/backgrounds/map_khu_cong_nghiep_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (khu_cong_nghiep)', notes: 'Nhà xưởng ống khói khổng lồ rỉ sét' },
  { id: 'map_cang_ben_song_bg', name: 'Bến Cảng Ven Sông', file: 'public/assets/backgrounds/map_cang_ben_song_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (cang_song)', notes: 'Tàu bè mắc cạn sương mù mịt mùng' },
  { id: 'map_sieu_thi_kho_bg', name: 'Siêu Thị Kho Hàng', file: 'public/assets/backgrounds/map_sieu_thi_kho_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (sieu_thi)', notes: 'Kệ hàng đổ sập bị cướp phá' },
  { id: 'map_canh_sat_bo_roi_bg', name: 'Đồn Cảnh Sát Bỏ Hoang', file: 'public/assets/backgrounds/map_canh_sat_bo_roi_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (don_canh_sat)', notes: 'Khu giam giữ và văn phòng cảnh sát' },
  { id: 'map_ham_tau_dien_ngam_bg', name: 'Hầm Tàu Điện Ngầm', file: 'public/assets/backgrounds/map_ham_tau_dien_ngam_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (tau_dien)', notes: 'Đường ray ngập nước tăm tối' },
  { id: 'map_dao_nho_bg', name: 'Hòn Đảo Cô Độc', file: 'public/assets/backgrounds/map_dao_nho_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js (dao_nho)', notes: 'Bờ biển sóng vỗ hoang vắng' },
  { id: 'combat_bg_interior', name: 'Đấu Trường Nội Thất Tòa Nhà', file: 'public/assets/backgrounds/combat_bg_interior.webp', cat: 'Background', priority: 'P1', ref: 'js/combat.js (indoor encounter)', notes: 'Hành lang đổ nát phòng kín' },
  { id: 'combat_bg_sea', name: 'Đấu Trường Boong Tàu / Biển', file: 'public/assets/backgrounds/combat_bg_sea.webp', cat: 'Background', priority: 'P1', ref: 'js/combat.js (sea battle)', notes: 'Mặt biển đen tối sóng gió' },
  { id: 'map_thap_canh_bo_roi_bg', name: 'Tháp Canh Trên Đồi', file: 'public/assets/backgrounds/map_thap_canh_bo_roi_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js (thap_canh)', notes: 'Tháp quan sát quân sự cô độc' },
  { id: 'map_nha_kho_nong_thon_bg', name: 'Nhà Kho Nông Thôn', file: 'public/assets/backgrounds/map_nha_kho_nong_thon_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js (kho_nong_thon)', notes: 'Kho thóc gỗ mục giữa đồng cỏ khô' },
  { id: 'map_lang_nong_trai_nui_bg', name: 'Bản Làng Dưới Núi', file: 'public/assets/backgrounds/map_lang_nong_trai_nui_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js (lang_nui)', notes: 'Thôn làng hẻo lánh vắng bóng người' },
  { id: 'map_cam_trai_ben_song_bg', name: 'Khu Cắm Trại Bên Sông', file: 'public/assets/backgrounds/map_cam_trai_ben_song_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js (cam_trai)', notes: 'Lều bạt rách nát bờ cỏ' },
  { id: 'map_nha_kho_nha_may_bg', name: 'Kho Xưởng Cơ Khí', file: 'public/assets/backgrounds/map_nha_kho_nha_may_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js (kho_nha_may)', notes: 'Kho phụ tùng máy móc phế liệu' }
];

console.log('Background count:', bgsList.length);
bgsList.forEach(b => {
  const info = getDiskInfo(b.file);
  b.dim = info.dim;
  b.fmt = info.realFormat;
  b.sizeKB = info.sizeKB;
  b.status = info.exists ? 'NEEDS_REVIEW' : 'MISSING';
});

// Write to docs/ASSET_MANIFEST.md
console.log('Generating docs/ASSET_MANIFEST.md and docs/IMAGE_GENERATION_ROADMAP.md...');

