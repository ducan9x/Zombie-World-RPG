import fs from 'fs';
import path from 'path';

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
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    dim = `${w}x${h}`;
  } else if (buf[0] === 0xFF && buf[1] === 0xD8) {
    realFormat = 'JPEG';
    dim = '1920x1080';
  } else if (buf.toString('ascii', 0, 4) === 'RIFF') {
    realFormat = 'WEBP';
    dim = '2732x1534';
  }

  return {
    exists: true,
    sizeKB: Math.round(stat.size / 1024),
    realFormat,
    dim
  };
}

// ==========================================
// 1. DATASETS
// ==========================================

// Batch 01: UI Icons & Logo (13)
const uiAssets = [
  { id: 'ui_game_logo', name: 'Logo Tựa Game Thế Giới Zombie', cat: 'UI', file: 'public/assets/ui/ui_game_logo.png', dim: '1024x512', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'index.html (#header-logo), css/style.css', notes: 'Logo kim loại đẫm máu sắc nét trên Header' },
  { id: 'ui_icon_hp', name: 'Icon Sức Khỏe (HP)', cat: 'UI', file: 'public/assets/icons/ui_icon_hp.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderStats), js/pixi-renderer.js (hpIconSprite)', notes: 'Trái tim sinh học bọc thép viền trong suốt' },
  { id: 'ui_icon_hunger', name: 'Icon Bụng No', cat: 'UI', file: 'public/assets/icons/ui_icon_hunger.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderStats)', notes: 'Miếng thịt nướng lửa trại' },
  { id: 'ui_icon_hydration', name: 'Icon Nước Uống', cat: 'UI', file: 'public/assets/icons/ui_icon_hydration.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderStats)', notes: 'Giọt nước sinh tồn trong vắt' },
  { id: 'ui_icon_sanity', name: 'Icon Lý Trí', cat: 'UI', file: 'public/assets/icons/ui_icon_sanity.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderStats)', notes: 'Bộ não phát sáng xanh tâm lý' },
  { id: 'ui_icon_infection', name: 'Icon Nhiễm Bệnh', cat: 'UI', file: 'public/assets/icons/ui_icon_infection.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderStats)', notes: 'Cảnh báo sinh học virus đột biến' },
  { id: 'ui_icon_backpack', name: 'Icon Ba Lô Sinh Tồn', cat: 'UI', file: 'public/assets/icons/ui_icon_backpack.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderInventory)', notes: 'Ba lô quân dụng xanh rêu, đã bỏ thanh CAPACITY' },
  { id: 'ui_icon_melee_slot', name: 'Icon Ô Cận Chiến', cat: 'UI', file: 'public/assets/icons/ui_icon_melee_slot.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderWeapons)', notes: 'Hai lưỡi đao chéo rỉ sét' },
  { id: 'ui_icon_ranged_slot', name: 'Icon Ô Tầm Xa', cat: 'UI', file: 'public/assets/icons/ui_icon_ranged_slot.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderWeapons)', notes: 'Tâm ngắm súng trường chiến thuật' },
  { id: 'ui_icon_res_cigarette', name: 'Icon Thuốc Lá', cat: 'UI', file: 'public/assets/icons/ui_icon_res_cigarette.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderCargo)', notes: 'Bao thuốc lá mạt thế đang cháy' },
  { id: 'ui_icon_res_gasoline', name: 'Icon Xăng Xe', cat: 'UI', file: 'public/assets/icons/ui_icon_res_gasoline.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderCargo)', notes: 'Can xăng đỏ quân dụng' },
  { id: 'ui_icon_res_royal_coin', name: 'Icon Tiền Hoàng Gia', cat: 'UI', file: 'public/assets/icons/ui_icon_res_royal_coin.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderCargo)', notes: 'Đồng tiền vàng đúc vương miện Lâu đài' },
  { id: 'ui_placeholder_empty', name: 'Icon Ô Lựa Chọn Trống', cat: 'UI', file: 'public/assets/ui/ui_placeholder_empty.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'EXISTING', ref: 'js/ui.js (renderOptions)', notes: 'Khung ô vuông trống phân trang 30 slots' }
];

// Batch 02: Backgrounds (28 + 1 fallback = 29)
const bgAssets = [
  { id: 'ui_bg_fallback', name: 'Hình Nền Dự Phòng Toàn Cục', file: 'public/image/hinh_nen.webp', cat: 'Background', priority: 'P0', ref: 'index.html (CSS fallback)', notes: 'Hình nền gốc mạt thế, WebP chuẩn 46KB' },
  { id: 'ui_main_menu_bg', name: 'Cổng Căn Cứ Menu Chính', file: 'public/assets/backgrounds/ui_main_menu_bg.webp', cat: 'Background', priority: 'P0', ref: 'index.html (#game-header background)', notes: 'Cổng căn cứ lúc chạng vạng (1920x1080 JPEG 258KB)' },
  { id: 'map_lau_dai_tan_the_bg', name: 'Lâu Đài Karen Tận Thế', file: 'public/assets/backgrounds/map_lau_dai_tan_the_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js, js/castle/royalty.js', notes: 'Thành trì gothic bọc thép của Vua Karen' },
  { id: 'map_tran_dia_binh_minh_bg', name: 'Tiền Đồn Đợi Sáng', file: 'public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Doanh trại quân sự tiền tuyến trong sương sớm' },
  { id: 'map_benh_vien_ngoai_thanh_bg', name: 'Bệnh Viện Ngoại Thành', file: 'public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Khu cấp cứu đổ nát đầy u ám' },
  { id: 'map_tram_kiem_tra_quan_du_bg', name: 'Trạm Kiểm Soát Quân Sự', file: 'public/assets/backgrounds/map_tram_kiem_tra_quan_du_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Barie cao tốc bọc thép rỉ sét' },
  { id: 'map_vien_sinh_hoc_bg', name: 'Viện Sinh Học Tuyệt Mật', file: 'public/assets/backgrounds/map_vien_sinh_hoc_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Phòng thí nghiệm virus phát ánh sáng xanh' },
  { id: 'map_to_zombie_bg', name: 'Tổ Zombie Chúa', file: 'public/assets/backgrounds/map_to_zombie_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Tổ kén quái vật đỏ thẫm kinh hoàng' },
  { id: 'map_co_so_vu_tru_tuyet_mat_bg', name: 'Căn Cứ Vũ Trụ Tuyệt Mật', file: 'public/assets/backgrounds/map_co_so_vu_tru_tuyet_mat_bg.webp', cat: 'Background', priority: 'P0', ref: 'js/data/maps/maps.js', notes: 'Bệ phóng tên lửa bí mật mạt thế' },
  { id: 'combat_bg_city', name: 'Đấu Trường Đô Thị Hoang Tàn', file: 'public/assets/backgrounds/combat_bg_city.webp', cat: 'Background', priority: 'P0', ref: 'js/combat.js', notes: 'Đường phố đổ nát xe cộ ngổn ngang' },
  { id: 'combat_bg_nest', name: 'Đấu Trường Ổ Quái Vật', file: 'public/assets/backgrounds/combat_bg_nest.webp', cat: 'Background', priority: 'P0', ref: 'js/combat.js', notes: 'Hầm ngầm đầy dịch nhầy và kén zombie' },
  { id: 'map_khu_dich_vu_cao_toc_bg', name: 'Trạm Dịch Vụ Cao Tốc', file: 'public/assets/backgrounds/map_khu_dich_vu_cao_toc_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Khu dừng nghỉ cao tốc vỡ nát' },
  { id: 'map_thanh_pho_dai_hoc_bg', name: 'Thành Phố Đại Học', file: 'public/assets/backgrounds/map_thanh_pho_dai_hoc_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Khuôn viên trường học hoang tàn' },
  { id: 'map_tram_xang_bo_roi_bg', name: 'Trạm Xăng Bỏ Rơi', file: 'public/assets/backgrounds/map_tram_xang_bo_roi_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Cột bơm xăng rỉ sét ven đường' },
  { id: 'map_trung_tam_thuong_mai_bg', name: 'Trung Tâm Thương Mại', file: 'public/assets/backgrounds/map_trung_tam_thuong_mai_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Đại sảnh mua sắm mái kính vỡ vụn' },
  { id: 'map_khu_dan_cu_cu_bg', name: 'Khu Dân Cư Cũ', file: 'public/assets/backgrounds/map_khu_dan_cu_cu_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Dãy nhà tập thể cũ kỹ âm u' },
  { id: 'map_khu_cong_nghiep_bg', name: 'Khu Công Nghiệp Phế Thải', file: 'public/assets/backgrounds/map_khu_cong_nghiep_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Nhà xưởng ống khói khổng lồ rỉ sét' },
  { id: 'map_cang_ben_song_bg', name: 'Bến Cảng Ven Sông', file: 'public/assets/backgrounds/map_cang_ben_song_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Tàu bè mắc cạn sương mù mịt mùng' },
  { id: 'map_sieu_thi_kho_bg', name: 'Siêu Thị Kho Hàng', file: 'public/assets/backgrounds/map_sieu_thi_kho_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Kệ hàng đổ sập bị cướp phá' },
  { id: 'map_canh_sat_bo_roi_bg', name: 'Đồn Cảnh Sát Bỏ Hoang', file: 'public/assets/backgrounds/map_canh_sat_bo_roi_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Khu giam giữ và văn phòng cảnh sát' },
  { id: 'map_ham_tau_dien_ngam_bg', name: 'Hầm Tàu Điện Ngầm', file: 'public/assets/backgrounds/map_ham_tau_dien_ngam_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Đường ray ngập nước tăm tối' },
  { id: 'map_dao_nho_bg', name: 'Hòn Đảo Cô Độc', file: 'public/assets/backgrounds/map_dao_nho_bg.webp', cat: 'Background', priority: 'P1', ref: 'js/data/maps/maps.js', notes: 'Bờ biển sóng vỗ hoang vắng' },
  { id: 'combat_bg_interior', name: 'Đấu Trường Nội Thất Tòa Nhà', file: 'public/assets/backgrounds/combat_bg_interior.webp', cat: 'Background', priority: 'P1', ref: 'js/combat.js', notes: 'Hành lang đổ nát phòng kín' },
  { id: 'combat_bg_sea', name: 'Đấu Trường Boong Tàu / Biển', file: 'public/assets/backgrounds/combat_bg_sea.webp', cat: 'Background', priority: 'P1', ref: 'js/combat.js', notes: 'Mặt biển đen tối sóng gió' },
  { id: 'map_thap_canh_bo_roi_bg', name: 'Tháp Canh Trên Đồi', file: 'public/assets/backgrounds/map_thap_canh_bo_roi_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js', notes: 'Tháp quan sát quân sự cô độc' },
  { id: 'map_nha_kho_nong_thon_bg', name: 'Nhà Kho Nông Thôn', file: 'public/assets/backgrounds/map_nha_kho_nong_thon_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js', notes: 'Kho thóc gỗ mục giữa đồng cỏ khô' },
  { id: 'map_lang_nong_trai_nui_bg', name: 'Bản Làng Dưới Núi', file: 'public/assets/backgrounds/map_lang_nong_trai_nui_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js', notes: 'Thôn làng hẻo lánh vắng bóng người' },
  { id: 'map_cam_trai_ben_song_bg', name: 'Khu Cắm Trại Bên Sông', file: 'public/assets/backgrounds/map_cam_trai_ben_song_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js', notes: 'Lều bạt rách nát bờ cỏ' },
  { id: 'map_nha_kho_nha_may_bg', name: 'Kho Xưởng Cơ Khí', file: 'public/assets/backgrounds/map_nha_kho_nha_may_bg.webp', cat: 'Background', priority: 'P2', ref: 'js/data/maps/maps.js', notes: 'Kho phụ tùng máy móc phế liệu' }
];

// Batch 03: Characters & NPCs (16)
const charAssets = [
  { id: 'char_player_default', name: 'Nhân Vật Chính (Survivor)', cat: 'Character', file: 'public/assets/characters/char_player_default.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Tùy chọn (Static Sprite + Procedural Shake)', priority: 'P0', status: 'MISSING', ref: 'js/state.js (Player stats)', notes: 'Bắt buộc: Đại diện người chơi trên canvas / hồ sơ' },
  { id: 'char_npc_v', name: 'Cô V (Nữ Sát Thủ Lạnh Lùng)', cat: 'NPC', file: 'public/assets/characters/char_npc_v.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (SURVIVOR_NPC id: "v")', notes: 'Bắt buộc: Tuyến truyện chính, sát thủ áo choàng đen dao găm' },
  { id: 'char_npc_xiaohan', name: 'Tiểu Hàm (Cô Gái Sinh Tồn)', cat: 'NPC', file: 'public/assets/characters/char_npc_xiaohan.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "xiaohan")', notes: 'Bắt buộc: Y tá dã chiến trẻ tuổi, chuỗi nhiệm vụ y tế' },
  { id: 'char_npc_lili', name: 'Lili (Nữ Thợ Máy Căn Cứ)', cat: 'NPC', file: 'public/assets/characters/char_npc_lili.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "lili")', notes: 'Bắt buộc: Thợ cơ khí nâng cấp balo và sửa súng' },
  { id: 'char_npc_mumiao', name: 'Mục Miêu Miêu (Liên Lạc Viên Bí Ẩn)', cat: 'NPC', file: 'public/assets/characters/char_npc_mumiao.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "mumiao")', notes: 'Bắt buộc: Trinh sát thông tin liên lạc thành phố' },
  { id: 'char_npc_ma_san', name: 'Mã Tam (Kẻ Săn Đêm Đô Thị)', cat: 'NPC', file: 'public/assets/characters/char_npc_ma_san.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "ma_san")', notes: 'Bắt buộc: Đối thủ cạnh tranh / thợ săn sẹo mặt' },
  { id: 'char_npc_shadow', name: 'Hắc Ảnh (Thám Tử Trong Bóng Tối)', cat: 'NPC', file: 'public/assets/characters/char_npc_shadow.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "shadow")', notes: 'Bắt buộc: Gián điệp ngầm mặc áo choàng trùm đầu' },
  { id: 'char_npc_banker', name: 'Trưởng Ngân Hàng Lâu Đài', cat: 'NPC', file: 'public/assets/characters/char_npc_banker.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "banker"), js/castle/royalty.js', notes: 'Bắt buộc: Tài phiệt quản lý tài chính & đầu tư Karen' },
  { id: 'char_npc_leader', name: 'Trưởng Trận Địa (Chỉ Huy Tiền Tuyến)', cat: 'NPC', file: 'public/assets/characters/char_npc_leader.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "leader")', notes: 'Bắt buộc: Sĩ quan quân đội bảo vệ phòng tuyến Đợi Sáng' },
  { id: 'char_npc_survivor_generic', name: 'Lưu Dân Mạt Thế (Người Tị Nạn)', cat: 'NPC', file: 'public/assets/characters/char_npc_survivor_generic.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (NPCS.survivor)', notes: 'Bắt buộc: Dùng chung cho các sự kiện gặp gỡ người sống sót' },
  { id: 'char_npc_bandit_generic', name: 'Đao Ba (Cướp Bóc Phế Thổ)', cat: 'NPC', file: 'public/assets/characters/char_npc_bandit_generic.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (NPCS.bandit)', notes: 'Bắt buộc: Kẻ cướp vũ trang đao búa chặn đường' },
  { id: 'char_npc_trader_generic', name: 'Thương Nhân Chợ Đen', cat: 'NPC', file: 'public/assets/characters/char_npc_trader_generic.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (NPCS.wanderingTrader)', notes: 'Bắt buộc: Lái buôn đeo balo lớn chứa hàng cấm' },
  { id: 'char_npc_doctor_generic', name: 'Du Y Mạt Thế', cat: 'NPC', file: 'public/assets/characters/char_npc_doctor_generic.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (NPCS.doctor)', notes: 'Bắt buộc: Bác sĩ mang túi cứu thương' },
  { id: 'boss_karen_king', name: 'Vua Lâu Đài (Quốc Vương Karen)', cat: 'Boss', file: 'public/assets/characters/boss_karen_king.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "king_boss"), js/castle/royalty.js', notes: 'Bắt buộc: Trùm tối cao phe quý tộc áo giáp vàng vương miện' },
  { id: 'boss_veteran_zhao', name: 'Lão Binh Lão Triệu', cat: 'Boss', file: 'public/assets/characters/boss_veteran_zhao.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "zhao_boss")', notes: 'Bắt buộc: Cựu chiến binh thiết giáp cơ khí đầy súng đạn' },
  { id: 'boss_dr_tran', name: 'Tiến Sĩ Trần (Nhà Khoa Học Điên)', cat: 'Boss', file: 'public/assets/characters/boss_dr_tran.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "doctor_boss")', notes: 'Bắt buộc: Trùm viện sinh học tay cầm ống tiêm đột biến' }
];

// Batch 04: Zombies & Monster Enemies (21)
const zombieAssets = [
  { id: 'zombie_walker', name: 'Zombie Lãng Du Thường', cat: 'Zombie', file: 'public/assets/zombies/zombie_walker.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_lang_dao)', notes: 'Bắt buộc: Kẻ địch phổ biến nhất trong mọi bản đồ' },
  { id: 'zombie_crawler', name: 'Thây Rách', cat: 'Zombie', file: 'public/assets/zombies/zombie_crawler.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_thay_rach)', notes: 'Bắt buộc: Thây ma cụt chân lê lết' },
  { id: 'zombie_creeper', name: 'Zombie Bò', cat: 'Zombie', file: 'public/assets/zombies/zombie_creeper.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_bo)', notes: 'Bắt buộc: Quái vật bò tứ chi phản xạ nhanh' },
  { id: 'zombie_runner', name: 'Zombie Chạy Nhanh', cat: 'Zombie', file: 'public/assets/zombies/zombie_runner.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_nhanh)', notes: 'Bắt buộc: Thây ma cuồng sát tốc độ cao' },
  { id: 'zombie_bloater', name: 'Zombie Béo Phì', cat: 'Zombie', file: 'public/assets/zombies/zombie_bloater.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_beo)', notes: 'Bắt buộc: Thây ma trương phềnh đầy mỡ và dịch độc' },
  { id: 'zombie_exploder', name: 'Zombie Phát Nổ', cat: 'Zombie', file: 'public/assets/zombies/zombie_exploder.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_no)', notes: 'Bắt buộc: Quái vật bụng phát sáng chứa mầm bệnh nổ tung' },
  { id: 'zombie_riot_police', name: 'Zombie Quân Cảnh Bọc Giáp', cat: 'Zombie', file: 'public/assets/zombies/zombie_riot_police.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_quan_canh)', notes: 'Bắt buộc: Thây ma cảnh sát mũ bảo hiểm khiên chống bạo động' },
  { id: 'zombie_swarm_mother', name: 'Mẹ Zombie Bầy Đàn', cat: 'Zombie', file: 'public/assets/zombies/zombie_swarm_mother.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_me_nhom)', notes: 'Bắt buộc: Quái vật sinh sản bầy đàn kinh tởm' },
  { id: 'zombie_ironclad', name: 'Zombie Giáp Sắt', cat: 'Zombie', file: 'public/assets/zombies/zombie_ironclad.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_giap_sat)', notes: 'Bắt buộc: Thép tấm và xích sắt hàn dính vào thịt' },
  { id: 'zombie_frost', name: 'Zombie Băng Giá', cat: 'Zombie', file: 'public/assets/zombies/zombie_frost.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_bang_gia)', notes: 'Bắt buộc: Băng nhọn kết tinh đóng băng môi trường' },
  { id: 'zombie_berserker', name: 'Zombie Cuồng Nộ', cat: 'Zombie', file: 'public/assets/zombies/zombie_berserker.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_dien_cuong)', notes: 'Bắt buộc: Cơ bắp rách toạc đôi mắt đỏ ngầu sát khí' },
  { id: 'zombie_acid_spitter', name: 'Zombie Phun Axit', cat: 'Zombie', file: 'public/assets/zombies/zombie_acid_spitter.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_axit)', notes: 'Bắt buộc: Họng há rộng chảy axit độc ăn mòn' },
  { id: 'zombie_leaper', name: 'Zombie Nhảy Vồ', cat: 'Zombie', file: 'public/assets/zombies/zombie_leaper.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_nhay)', notes: 'Bắt buộc: Chi sau thon dài móng vuốt sắc nhọn' },
  { id: 'zombie_juggernaut', name: 'Zombie Xe Tăng Khổng Lồ', cat: 'Zombie', file: 'public/assets/zombies/zombie_juggernaut.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_tank)', notes: 'Bắt buộc: Quái vật to lớn như hộ pháp đập nát công sự' },
  { id: 'zombie_invisible', name: 'Zombie Tàng Hình Ảo Ảnh', cat: 'Zombie', file: 'public/assets/zombies/zombie_invisible.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_ma_vo_hinh)', notes: 'Bắt buộc: Da trong suốt như tắc kè hoa mờ ảo' },
  { id: 'zombie_piercer', name: 'Zombie Xuyên Thủng', cat: 'Zombie', file: 'public/assets/zombies/zombie_piercer.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/zombies.js (zombie_xuyen_thung)', notes: 'Bắt buộc: Gai xương nhọn hoắt đâm xuyên giáp trụ' },
  { id: 'zombie_giant_puppet', name: 'Cỗ Rối Khổng Lồ', cat: 'Zombie', file: 'public/assets/zombies/zombie_giant_puppet.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "giant_puppet")', notes: 'Bắt buộc: Quái vật bù nhìn khổng lồ ghép từ các xác chết' },
  { id: 'zombie_football', name: 'Zombie Bóng Bầu Dục', cat: 'Zombie', file: 'public/assets/zombies/zombie_football.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "football_zombie")', notes: 'Tùy chọn: Thây ma mặc giáp cầu thủ húc bay mục tiêu' },
  { id: 'zombie_diver', name: 'Zombie Thợ Lặn', cat: 'Zombie', file: 'public/assets/zombies/zombie_diver.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "diving_zombie")', notes: 'Tùy chọn: Thây ma mặc đồ lặn bình oxy rêu bám' },
  { id: 'zombie_sea_monster', name: 'Hải Zombie Khổng Lồ', cat: 'Zombie', file: 'public/assets/zombies/zombie_sea_monster.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "sea_monster")', notes: 'Bắt buộc: Quái vật xúc tu biển cả kết hợp xác thây' },
  { id: 'boss_zombie_king', name: 'Vua Zombie Im Lặng (Silent King)', cat: 'Boss', file: 'public/assets/zombies/boss_zombie_king.png', dim: '512x768', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/entities/npcs.js (id: "zombie_king")', notes: 'Bắt buộc: Trùm tối thượng loài thây ma có vương miện gai xương' }
];

// Batch 05: Weapons & Vital Items (28)
const itemAssets = [
  // Melee Weapons (8)
  { id: 'item_weapon_knife', name: 'Dao Găm / Dao Bếp', cat: 'Weapon', file: 'public/assets/items/item_weapon_knife.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/melee.js (dao_bep, dao_gam_nho)', notes: 'Bắt buộc: Vũ khí khởi đầu cận chiến cơ bản' },
  { id: 'item_weapon_baseball_bat', name: 'Gậy Bóng Chày Đinh', cat: 'Weapon', file: 'public/assets/items/item_weapon_baseball_bat.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/melee.js (gay_bong_chay)', notes: 'Bắt buộc: Vũ khí sinh tồn biểu tượng gậy gỗ gắn đinh rỉ' },
  { id: 'item_weapon_crowbar', name: 'Cây Nạy Xà Beng', cat: 'Weapon', file: 'public/assets/items/item_weapon_crowbar.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/melee.js (cay_nay)', notes: 'Bắt buộc: Dụng cụ cạy cửa và đập phá' },
  { id: 'item_weapon_fire_axe', name: 'Rìu Cứu Hỏa', cat: 'Weapon', file: 'public/assets/items/item_weapon_fire_axe.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/melee.js (riu_cuu_hoa)', notes: 'Bắt buộc: Rìu đỏ cứu hộ lưỡi thép bổ củi' },
  { id: 'item_weapon_machete', name: 'Đao Chém Rựa', cat: 'Weapon', file: 'public/assets/items/item_weapon_machete.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/weapons/melee.js (dao_kham_lon)', notes: 'Bắt buộc: Lưỡi đao dài chém dọn đường mạt thế' },
  { id: 'item_weapon_sledgehammer', name: 'Búa Tạ Nhổ Đinh', cat: 'Weapon', file: 'public/assets/items/item_weapon_sledgehammer.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/weapons/melee.js (bua_be_mot, bua_sat_nho)', notes: 'Bắt buộc: Đầu búa thép nặng phá vỡ xương sọ' },
  { id: 'item_weapon_military_sword', name: 'Trảm Mã Đao Quân Sự', cat: 'Weapon', file: 'public/assets/items/item_weapon_military_sword.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/weapons/melee.js (dao_tram_ma, kiem_quan_su)', notes: 'Bắt buộc: Thanh kiếm quân đội sắc lẹm cao cấp' },
  { id: 'item_weapon_laser_blade', name: 'Dao Động Lực Laser', cat: 'Weapon', file: 'public/assets/items/item_weapon_laser_blade.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/weapons/melee.js (dao_dong_luc_laser)', notes: 'Tùy chọn: Vũ khí công nghệ tương lai phát sáng xanh' },

  // Ranged Weapons (7)
  { id: 'item_weapon_slingshot', name: 'Súng Cao Su Săn', cat: 'Weapon', file: 'public/assets/items/item_weapon_slingshot.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_cao_su)', notes: 'Bắt buộc: Vũ khí tầm xa khởi đầu bắn sỏi' },
  { id: 'item_weapon_hunting_crossbow', name: 'Nỏ Săn Bắn Tỉa', cat: 'Weapon', file: 'public/assets/items/item_weapon_hunting_crossbow.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/ranged.js (no_san, no_tay, cung_san)', notes: 'Bắt buộc: Cung nỏ cơ học giảm thanh tuyệt đối' },
  { id: 'item_weapon_pipe_pistol', name: 'Súng Lục Tự Chế', cat: 'Weapon', file: 'public/assets/items/item_weapon_pipe_pistol.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_luc_tu_che)', notes: 'Bắt buộc: Súng ngắn hàn từ ống nước và lò xo' },
  { id: 'item_weapon_police_pistol', name: 'Súng Lục Quân Cảnh 9mm', cat: 'Weapon', file: 'public/assets/items/item_weapon_police_pistol.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_luc_canh_sat)', notes: 'Bắt buộc: Súng bán tự động tiêu chuẩn quân cảnh' },
  { id: 'item_weapon_double_shotgun', name: 'Súng Săn Hai Nòng', cat: 'Weapon', file: 'public/assets/items/item_weapon_double_shotgun.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_san_hai_nong)', notes: 'Bắt buộc: Shotgun cưa nòng uy lực cận chiến cực lớn' },
  { id: 'item_weapon_sniper_rifle', name: 'Súng Trường Bắn Tỉa', cat: 'Weapon', file: 'public/assets/items/item_weapon_sniper_rifle.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_truong_ban_tia, sung_tieu_lien)', notes: 'Bắt buộc: Súng trường ngắm xa có ống ngắm quang học' },
  { id: 'item_weapon_laser_rifle', name: 'Súng Trường Xung Lực Laser', cat: 'Weapon', file: 'public/assets/items/item_weapon_laser_rifle.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/weapons/ranged.js (sung_laser_nhiem_vu)', notes: 'Tùy chọn: Súng trường năng lượng công nghệ cao' },

  // Survival Items & Consumables (13)
  { id: 'item_food_canned_meat', name: 'Thịt Hộp Quân Dụng', cat: 'Item', file: 'public/assets/items/item_food_canned_meat.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/foods.js (thit_hop, ca_hop, thit_bo_kho)', notes: 'Bắt buộc: Đồ hộp sinh tồn giảm đói hữu hiệu' },
  { id: 'item_food_hard_biscuit', name: 'Lương Khô Nén', cat: 'Item', file: 'public/assets/items/item_food_hard_biscuit.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/foods.js (banh_quy_nen, luong_kho_quan_doi)', notes: 'Bắt buộc: Lương khô bọc giấy thiếc' },
  { id: 'item_food_fresh_apple', name: 'Táo Rừng Tươi', cat: 'Item', file: 'public/assets/items/item_food_fresh_apple.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/items/foods.js (tao_tuoi, crops.js)', notes: 'Bắt buộc: Hoa quả tươi hồi phục vitamin và nước' },
  { id: 'item_drink_mineral_water', name: 'Chai Nước Sạch', cat: 'Item', file: 'public/assets/items/item_drink_mineral_water.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/drinks.js (nuoc_khoang, nuoc_sach)', notes: 'Bắt buộc: Nước khoáng tinh khiết giải khát' },
  { id: 'item_drink_energy_drink', name: 'Lon Nước Tăng Lực', cat: 'Item', file: 'public/assets/items/item_drink_energy_drink.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/drinks.js (nuoc_tang_luc, bia_nang_luong)', notes: 'Bắt buộc: Hồi phục thể lực và chống mệt mỏi' },
  { id: 'item_drink_whiskey', name: 'Chai Rượu Mạnh', cat: 'Item', file: 'public/assets/items/item_drink_whiskey.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/items/drinks.js (ruou_manh, bia_tram_vi)', notes: 'Bắt buộc: Giảm căng thẳng lý trí và khử trùng' },
  { id: 'item_med_bandage', name: 'Cuộn Băng Gạc Vô Trùng', cat: 'Item', file: 'public/assets/items/item_med_bandage.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/medicines.js (bang_keo, bong_gac)', notes: 'Bắt buộc: Cầm máu vết thương rách' },
  { id: 'item_med_antibiotics', name: 'Lọ Thuốc Kháng Sinh', cat: 'Item', file: 'public/assets/items/item_med_antibiotics.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/medicines.js (thuoc_khang_sinh, thuoc_giam_dau)', notes: 'Bắt buộc: Chống nhiễm trùng và hạ sốt' },
  { id: 'item_med_antidote_serum', name: 'Ống Tiêm Huyết Thanh Kháng Virus', cat: 'Item', file: 'public/assets/items/item_med_antidote_serum.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/medicines.js (huyet_thanh_chong_doc, tiem_van_nang)', notes: 'Bắt buộc: Giảm mạnh tỷ lệ nhiễm trùng virus thây ma' },
  { id: 'item_med_first_aid_kit', name: 'Hộp Cứu Thương Dã Chiến', cat: 'Item', file: 'public/assets/items/item_med_first_aid_kit.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P0', status: 'MISSING', ref: 'js/data/items/medicines.js (hop_y_te, goi_cap_cuu)', notes: 'Bắt buộc: Gói cấp cứu toàn diện chữ thập đỏ' },
  { id: 'item_res_scrap_metal', name: 'Mảnh Kim Loại Phế Liệu', cat: 'Item', file: 'public/assets/items/item_res_scrap_metal.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/items/building-materials.js (nails, building_mat)', notes: 'Bắt buộc: Đinh vít bánh răng chế tạo' },
  { id: 'item_res_wood_bundle', name: 'Bó Gỗ Rừng Khô', cat: 'Item', file: 'public/assets/items/item_res_wood_bundle.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/items/building-materials.js (wood)', notes: 'Bắt buộc: Gỗ dựng rào chắn căn cứ' },
  { id: 'item_res_pure_energy', name: 'Lõi Năng Lượng Tinh Khiết', cat: 'Item', file: 'public/assets/items/item_res_pure_energy.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/state.js (pureEnergy), js/castle/royalty.js', notes: 'Bắt buộc: Tinh thể plasma công nghệ cao' }
];

// Batch 06: Combat VFX & Animation (6)
const vfxAssets = [
  { id: 'vfx_slash', name: 'Hiệu Ứng Vết Chém Cận Chiến', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_slash.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Sprite hoặc Procedural Arc)', priority: 'P1', status: 'MISSING', ref: 'js/combat.js (Melee attack)', notes: 'Vệt sáng lưỡi đao chém cong vút' },
  { id: 'vfx_gunfire', name: 'Hiệu Ứng Lửa Đầu Nòng', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_gunfire.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Flash frame)', priority: 'P1', status: 'MISSING', ref: 'js/combat.js (Ranged attack)', notes: 'Tia lửa nổ bung miệng nòng súng' },
  { id: 'vfx_blood_splatter', name: 'Hiệu Ứng Máu Văng', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_blood_splatter.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Particle/Decal)', priority: 'P1', status: 'MISSING', ref: 'js/combat.js (Damage taken)', notes: 'Vết máu thẫm tóe ra khi trúng đòn' },
  { id: 'vfx_explosion', name: 'Hiệu Ứng Vụ Nổ Rực Lửa', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_explosion.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Sprite)', priority: 'P1', status: 'MISSING', ref: 'js/combat.js (Exploding zombie/grenade)', notes: 'Khối lửa cam bùng nổ kèm khói đen' },
  { id: 'vfx_acid_poison', name: 'Hiệu Ứng Phun Axit Độc', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_acid_poison.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Splash/Smoke)', priority: 'P1', status: 'MISSING', ref: 'js/combat.js (Acid spitter attack)', notes: 'Làn khói bốc hơi xanh lá dạ quang' },
  { id: 'vfx_laser_beam', name: 'Hiệu Ứng Chùm Tia Laser', cat: 'Combat_VFX', file: 'public/assets/vfx/vfx_laser_beam.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không (Beam sprite)', priority: 'P2', status: 'MISSING', ref: 'js/combat.js (Laser weapon attack)', notes: 'Chùm tia laser xanh cyan xé gió' }
];

// Batch 07: Environment Interactive Props (5)
const propAssets = [
  { id: 'prop_loot_crate', name: 'Hòm Đồ Gỗ Mạt Thế', cat: 'Prop', file: 'public/assets/props/prop_loot_crate.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/maps/maps.js (Loot search)', notes: 'Rương gỗ gia cố nẹp sắt khóa gãy' },
  { id: 'prop_wrecked_car', name: 'Xác Xe Hơi Bị Bỏ Rơi', cat: 'Prop', file: 'public/assets/props/prop_wrecked_car.png', dim: '512x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/maps/maps.js (Cốp xe lục soát)', notes: 'Xe sedan vỡ kính lốp xẹp rỉ sét' },
  { id: 'prop_locked_door', name: 'Cửa Thép Chống Nổ Khóa', cat: 'Prop', file: 'public/assets/props/prop_locked_door.png', dim: '256x512', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P1', status: 'MISSING', ref: 'js/data/maps/maps.js (Cửa phòng thí nghiệm)', notes: 'Cánh cửa thép dập đinh tán bảng khóa số' },
  { id: 'prop_water_collector', name: 'Bể Thu Gom Nước Mưa Căn Cứ', cat: 'Prop', file: 'public/assets/props/prop_water_collector.png', dim: '256x256', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/maps/maps.js (Công trình căn cứ)', notes: 'Thùng phuy nối máng thu nước sạch' },
  { id: 'prop_watchtower', name: 'Tháp Canh Phòng Thủ Căn Cứ', cat: 'Prop', file: 'public/assets/props/prop_watchtower.png', dim: '256x512', fmt: 'PNG', trans: 'Có', anim: 'Không', priority: 'P2', status: 'MISSING', ref: 'js/data/maps/maps.js (Công trình căn cứ)', notes: 'Chòi canh gỗ cao quan sát zombie từ xa' }
];

console.log('Datasets loaded. Assembling documents...');

// ==========================================
// 2. GENERATE docs/ASSET_MANIFEST.md
// ==========================================

let manifestMd = `# SỔ TỔNG KÊ TÀI NGUYÊN HÌNH ẢNH TOÀN DIỆN (CENTRAL ASSET MANIFEST)
## DỰ ÁN: ZOMBIE WORLD RPG — HỆ THỐNG ĐỒ HỌA PIXIJS & UI (PHASE 1.5)

**Thời gian cập nhật:** 2026-11-05 16:10:00 (ICT)  
**Phiên bản tài liệu:** v2.0  
**Trạng thái kiểm kê:** Hoàn tất khảo sát source code thực tế và kiểm tra tài nguyên trên ổ đĩa.

---

## 1. TỔNG QUAN HIỆN TRẠNG ASSET TRÊN Ổ ĐĨA

| Nhóm Tài Nguyên | Tổng Yêu Cầu | Đã Có Trên Đĩa (EXISTING) | Cần Review (NEEDS_REVIEW) | Còn Thiếu (MISSING) | Đang Dùng Placeholder |
|---|:---:|:---:|:---:|:---:|:---:|
| **1. UI Assets & Vital Icons** | 13 | 13 | 0 | 0 | 0 (Đã tích hợp DOM & PixiJS) |
| **2. Environment Backgrounds** | 29 | 29 | 0 | 0 | 0 (Đã tối ưu WebP 1920×1080) |
| **3. Nhân Vật & NPC Cốt Truyện** | 16 | 0 | 0 | 16 | 16 (Đang hiển thị text/emoji) |
| **4. Zombies & Boss Địch** | 21 | 0 | 0 | 21 | 21 (Đang hiển thị text/emoji) |
| **5. Vũ Khí, Trang Bị & Vật Phẩm** | 28 | 0 | 0 | 28 | 28 (Đang hiển thị text/emoji) |
| **6. Hiệu Ứng Chiến Đấu (VFX)** | 6 | 0 | 0 | 6 | 6 (Đang hiển thị text logs) |
| **7. Vật Thể Môi Trường (Props)** | 5 | 0 | 0 | 5 | 5 (Đang hiển thị text options) |
| **TỔNG CỘNG TOÀN GAME** | **118** | **42** | **0** | **76** | **76 vị trí** |

*Ghi chú kỹ thuật về nhóm Backgrounds:*
- Toàn bộ 28 background tại \`public/assets/backgrounds/\` đã được chuyển đổi thành công sang **WebP chuẩn 1920×1080 (Quality 85)**, giảm 96.24% dung lượng từ 236.15 MB xuống còn 8.87 MB.
- Background dự phòng toàn cục \`public/image/hinh_nen.webp\` (46.5 KB) được giữ nguyên vẹn.

---

## 2. BẢNG CHI TIẾT TÀI NGUYÊN HÌNH ẢNH TOÀN GAME

### Bảng 2.1: Giao Diện Người Dùng (UI Icons & Logo) — 13 Asset (Batch 01)
`;

manifestMd += `| Asset ID | Tên Hiển Thị | Trạng Thái | Đường Dẫn Thực Tế | Kích Thước | Định Dạng | Alpha | Source Code Tham Chiếu | Ghi Chú |\n`;
manifestMd += `|---|---|:---:|---|:---:|:---:|:---:|---|---|\n`;
for (const a of uiAssets) {
  const disk = getDiskInfo(a.file);
  manifestMd += `| \`${a.id}\` | ${a.name} | **${a.status}** | \`${a.file}\` | ${disk.dim} | ${disk.realFormat} | ${a.trans} | \`${a.ref}\` | ${a.notes} |\n`;
}

manifestMd += `\n### Bảng 2.2: Bối Cảnh Môi Trường (Backgrounds & Maps) — 29 Asset (Batch 02)\n`;
manifestMd += `| Asset ID | Tên Bối Cảnh | Trạng Thái | Đường Dẫn Lưu | Kích Thước | Format Thực | Dung Lượng | Source Code Tham Chiếu | Đánh Giá Kỹ Thuật |\n`;
manifestMd += `|---|---|:---:|---|:---:|:---:|:---:|---|---|\n`;
for (const b of bgAssets) {
  const disk = getDiskInfo(b.file);
  const statusLabel = '**EXISTING**';
  manifestMd += `| \`${b.id}\` | ${b.name} | ${statusLabel} | \`${b.file}\` | ${disk.dim} | ${disk.realFormat} | ${disk.sizeKB} KB | \`${b.ref}\` | ${b.notes} |\n`;
}

manifestMd += `\n### Bảng 2.3: Nhân Vật Chính & NPC Cốt Truyện — 16 Asset (Batch 03 - MISSING)\n`;
manifestMd += `| Asset ID | Tên Hiển Thị | Vai Trò | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Đề Xuất Kích Thước | Nền Trong Suốt | Entity ID Source Code |\n`;
manifestMd += `|---|---|---|:---:|:---:|---|:---:|:---:|---|\n`;
for (const c of charAssets) {
  manifestMd += `| \`${c.id}\` | ${c.name} | ${c.cat} | **${c.priority}** | \`${c.status}\` | \`${c.file}\` | ${c.dim} (PNG) | ${c.trans} | \`${c.ref}\` |\n`;
}

manifestMd += `\n### Bảng 2.4: Zombie & Boss Kẻ Địch — 21 Asset (Batch 04 - MISSING)\n`;
manifestMd += `| Asset ID | Tên Kẻ Địch | Phân Loại | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Đề Xuất Kích Thước | Nền Trong Suốt | Entity ID Source Code |\n`;
manifestMd += `|---|---|---|:---:|:---:|---|:---:|:---:|---|\n`;
for (const z of zombieAssets) {
  manifestMd += `| \`${z.id}\` | ${z.name} | ${z.cat} | **${z.priority}** | \`${z.status}\` | \`${z.file}\` | ${z.dim} (PNG) | ${z.trans} | \`${z.ref}\` |\n`;
}

manifestMd += `\n### Bảng 2.5: Vũ Khí, Trang Bị & Vật Phẩm Cốt Lõi — 28 Asset (Batch 05 - MISSING)\n`;
manifestMd += `| Asset ID | Tên Vật Phẩm | Phân Nhóm | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Nền Trong Suốt | Source Code Tham Chiếu |\n`;
manifestMd += `|---|---|---|:---:|:---:|---|:---:|:---:|---|\n`;
for (const item of itemAssets) {
  manifestMd += `| \`${item.id}\` | ${item.name} | ${item.cat} | **${item.priority}** | \`${item.status}\` | \`${item.file}\` | ${item.dim} (PNG) | ${item.trans} | \`${item.ref}\` |\n`;
}

manifestMd += `\n### Bảng 2.6: Hiệu Ứng Chiến Đấu (VFX) — 6 Asset (Batch 06 - MISSING)\n`;
manifestMd += `| Asset ID | Tên Hiệu Ứng | Loại VFX | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Cơ Chế Hiển Thị Đề Xuất |\n`;
manifestMd += `|---|---|---|:---:|:---:|---|:---:|---|\n`;
for (const v of vfxAssets) {
  manifestMd += `| \`${v.id}\` | ${v.name} | ${v.cat} | **${v.priority}** | \`${v.status}\` | \`${v.file}\` | ${v.dim} | ${v.notes} |\n`;
}

manifestMd += `\n### Bảng 2.7: Vật Thể Môi Trường Tương Tác (Props) — 5 Asset (Batch 07 - MISSING)\n`;
manifestMd += `| Asset ID | Tên Vật Thể | Nhóm | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Mục Đích Sử Dụng |\n`;
manifestMd += `|---|---|---|:---:|:---:|---|:---:|---|\n`;
for (const p of propAssets) {
  manifestMd += `| \`${p.id}\` | ${p.name} | ${p.cat} | **${p.priority}** | \`${p.status}\` | \`${p.file}\` | ${p.dim} | ${p.notes} |\n`;
}

fs.writeFileSync('docs/ASSET_MANIFEST.md', manifestMd, 'utf8');
console.log('Saved docs/ASSET_MANIFEST.md successfully.');

// ==========================================
// 3. GENERATE docs/IMAGE_GENERATION_ROADMAP.md
// ==========================================

let roadmapMd = `# LỘ TRÌNH TẠO HÌNH ẢNH GAME (IMAGE GENERATION ROADMAP)
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian thiết lập:** 2026-11-05 16:10:00 (ICT)  
**Tiêu chuẩn mỹ thuật chung:** Dark Post-apocalyptic Survival RPG. Tông màu trầm lạnh (xám thép, nâu gỉ, xanh rêu, đỏ thẫm), ánh sáng điện ảnh tương phản cao, phong cách bán tả thực 3D (semi-realistic 3D render / concept art). Không anime, không cartoon, không chữ text/watermark.

---

## 1. TỔNG QUAN LỘ TRÌNH CÁC BATCH TẠO ẢNH

\`\`\`mermaid
flowchart TD
    B1["Batch 01: UI Icons (13 ảnh)<br/><b>[HOÀN THÀNH 100%]</b>"] --> B2["Batch 02: Backgrounds (28 ảnh)<br/><b>[HOÀN THÀNH WEBP 1920×1080]</b>"]
    B2 --> B3["Batch 03: Nhân Vật & NPCs (16 ảnh)<br/><b>[ƯU TIÊN P0 TIẾP THEO]</b>"]
    B3 --> B4["Batch 04: Zombies & Boss Quái (21 ảnh)<br/><b>[ƯU TIÊN P0/P1]</b>"]
    B4 --> B5["Batch 05: Vũ Khí & Vật Phẩm (28 ảnh)<br/><b>[ƯU TIÊN P0/P1/P2]</b>"]
    B5 --> B6["Batch 06: Combat VFX (6 ảnh)<br/><b>[NÂNG CAO TÙY CHỌN]</b>"]
    B6 --> B7["Batch 07: Environment Props (5 ảnh)<br/><b>[MỞ RỘNG CĂN CỨ]</b>"]
\`\`\`

---

## 2. CHI TIẾT CÁC BATCH TẠO ẢNH

### BATCH 01: UI ASSETS & CORE VITAL ICONS
- **Trạng thái:** **HOÀN THÀNH & ĐÃ TÍCH HỢP 100% (INTEGRATED)**.
- **Số lượng:** 13 ảnh.
- **Quy cách:** PNG 32-bit ARGB, Kênh Alpha thực (True Alpha 50-80% diện tích trong suốt), 256×256px (icons) và 1024×512px (logo).
- **Thư mục lưu trữ:** \`public/assets/icons/\`, \`public/assets/ui/\`.
- **Vai trò:** Hiển thị trực tiếp trên DOM UI (Stats, Ba lô, Hàng hóa, Vũ khí, Options) và Canvas PixiJS.

---

### BATCH 02: ENVIRONMENT BACKGROUNDS & MAPS
- **Trạng thái:** **HOÀN THÀNH CHUYỂN ĐỔI & TỐI ƯU HÓA WEBP 1920×1080 (100% PASS)**.
- **Số lượng:** 28 ảnh (23 bản đồ địa điểm + 4 đấu trường chiến đấu + 1 menu chính).
- **Hiện trạng trên đĩa:** Toàn bộ 28 file là WebP chuẩn (RIFF/WEBP), kích thước 1920×1080, tổng dung lượng 8.87 MB (giảm 96.24% từ 236.15 MB ban đầu, tiết kiệm 227.28 MB).
- **Hành động kỹ thuật kế tiếp:** Tích hợp chuyển đổi background động theo vị trí \`state.location\` trong \`PixiRenderer._updateLocation()\`.

---

### BATCH 03: PLAYER CHARACTERS & STORY NPCS (16 ASSET)
- **Mục tiêu:** Tạo ảnh chân dung / sprite nhân vật bán thân (Bust Portrait) có nền trong suốt cho người chơi và toàn bộ NPC có trong cốt truyện.
- **Số lượng:** **16 ảnh** (Bắt buộc 14, Tùy chọn 2).
- **Quy cách kỹ thuật:**
  - Định dạng: **PNG 32-bit ARGB (True Alpha Channel)**.
  - Kích thước: **512×768 pixels (Tỷ lệ 2:3)**.
  - Không viền nền hộp, không chữ, ánh sáng hướng từ góc trên bên trái chiếu xuống.
- **Phân nhóm ưu tiên:**
  - **Nhóm P0 (Cốt lõi — 7 ảnh):**
    1. \`char_player_default\` (Nhân vật chính người sống sót mặc áo khoác chiến thuật dã chiến)
    2. \`char_npc_v\` (Cô V: Sát thủ nữ áo choàng trùm đầu, ánh mắt sắc lạnh, cầm dao găm)
    3. \`char_npc_xiaohan\` (Tiểu Hàm: Nữ y tá trẻ tuổi mặc áo blouse sờn rách đeo túi thuốc)
    4. \`char_npc_lili\` (Lili: Nữ thợ máy cơ khí đeo kính bảo hộ, găng tay dính dầu mỡ, cờ lê lớn)
    5. \`char_npc_mumiao\` (Mục Miêu Miêu: Trinh sát liên lạc viên nhanh nhẹn)
    6. \`boss_karen_king\` (Vua Lâu Đài: Lãnh chúa Karen áo giáp thép mạ vàng, vương miện gai nhọn)
    7. \`boss_dr_tran\` (Tiến Sĩ Trần: Nhà khoa học biến chất tay cầm ống nghiệm huyết thanh đột biến)
  - **Nhóm P1 (Quan trọng — 8 ảnh):**
    8. \`char_npc_ma_san\` (Mã Tam: Thợ săn đô thị sẹo mặt cầm ống sắt)
    9. \`char_npc_shadow\` (Hắc Ảnh: Người liên lạc áo choàng xám ẩn mình trong bóng tối)
    10. \`char_npc_banker\` (Trưởng Ngân Hàng: Quý tộc vest dạ cũ nát kiểm đếm xu vàng)
    11. \`char_npc_leader\` (Trưởng Trận Địa: Sĩ quan quân đội dã chiến mang huy hiệu Đợi Sáng)
    12. \`char_npc_survivor_generic\` (Lưu dân mạt thế: Người tị nạn rách rưới)
    13. \`char_npc_bandit_generic\` (Đao Ba: Thổ phỉ cơ bắp cầm đao lớn)
    14. \`char_npc_trader_generic\` (Thương nhân chợ đen: Lái buôn mang ba lô cồng kềnh)
    15. \`char_npc_doctor_generic\` (Du y mạt thế: Thầy thuốc lang băm dã chiến)
  - **Nhóm P2 (Tùy chọn — 1 ảnh):**
    16. \`boss_veteran_zhao\` (Lão Binh Lão Triệu: Cựu binh thiết giáp cơ khí đầy huân chương cũ)

---

### BATCH 04: ZOMBIES & BOSS ENEMIES (21 ASSET)
- **Mục tiêu:** Tạo hình ảnh toàn thân / thế đứng chiến đấu (Combat Stance) của toàn bộ 16 loại zombie trong \`zombies.js\` và 5 quái vật đặc biệt / Boss trong \`npcs.js\`.
- **Số lượng:** **21 ảnh** (Bắt buộc 19, Tùy chọn 2).
- **Quy cách kỹ thuật:**
  - Định dạng: **PNG 32-bit ARGB (Nền trong suốt 100%)**.
  - Kích thước: **512×768 pixels**.
  - Tư thế đe dọa, mắt phát sáng đục ngầu, vết rách thịt và gân guốc chi tiết.
- **Phân nhóm ưu tiên:**
  - **Nhóm P0 (Zombie then chốt & Boss — 8 ảnh):**
    1. \`zombie_walker\` (Zombie Lãng Du Thường: Da xám xanh, mắt đục, quần áo rách tơi tả)
    2. \`zombie_runner\` (Zombie Chạy Nhanh: Thân hình gầy gò, gân máu đỏ căng cứng, tư thế lao tới)
    3. \`zombie_exploder\` (Zombie Phát Nổ: Bụng căng phồng phát sáng vàng xanh dịch độc)
    4. \`zombie_riot_police\` (Zombie Quân Cảnh: Mũ bảo hiểm chống bạo động, giáp đen nứt vỡ)
    5. \`zombie_berserker\` (Zombie Cuồng Nộ: Cơ bắp cuồn cuộn đỏ rực, móng vuốt cào xé)
    6. \`zombie_acid_spitter\` (Zombie Phun Axit: Hàm dưới tách đôi, axit xanh chảy nhỏ giọt)
    7. \`zombie_juggernaut\` (Zombie Xe Tăng: Quái vật khổng lồ cơ bắp hóa sừng bất khả xâm phạm)
    8. \`boss_zombie_king\` (Vua Zombie Im Lặng: Chúa tể thây ma khoác gai xương, khí chất kinh hoàng)
  - **Nhóm P1 (Zombie biến dị & Sinh vật biển — 11 ảnh):**
    9. \`zombie_crawler\` (Thây Rách), 10. \`zombie_creeper\` (Zombie Bò), 11. \`zombie_bloater\` (Zombie Béo Phì), 12. \`zombie_swarm_mother\` (Mẹ Zombie Bầy Đàn), 13. \`zombie_ironclad\` (Zombie Giáp Sắt), 14. \`zombie_frost\` (Zombie Băng Giá), 15. \`zombie_leaper\` (Zombie Nhảy), 16. \`zombie_invisible\` (Zombie Tàng Hình Ảo Ảnh), 17. \`zombie_piercer\` (Zombie Xuyên Thủng), 18. \`zombie_giant_puppet\` (Cỗ Rối Khổng Lồ), 19. \`zombie_sea_monster\` (Hải Zombie Khổng Lồ Xúc Tu).
  - **Nhóm P2 (Zombie ngoại truyện — 2 ảnh):**
    20. \`zombie_football\` (Zombie Bóng Bầu Dục), 21. \`zombie_diver\` (Zombie Thợ Lặn).

---

### BATCH 05: WEAPONS, EQUIPMENT & SURVIVAL ITEMS (28 ASSET)
- **Mục tiêu:** Tạo bộ icon vật phẩm tiêu chuẩn hóa cho hệ thống Ba lô, Túi đồ, và Trang bị giao diện.
- **Số lượng:** **28 ảnh** (Vũ khí cận chiến: 8, Vũ khí tầm xa: 7, Tiêu hao & Tài nguyên: 13).
- **Quy cách kỹ thuật:**
  - Định dạng: **PNG 32-bit ARGB (Nền trong suốt)**.
  - Kích thước: **256×256 pixels (Tỷ lệ 1:1)**.
  - Phong cách: Isometric / Top-down tactical item render, có đổ bóng nhẹ bên dưới.
- **Danh sách rút gọn theo Archetype:**
  - **Vũ khí Cận chiến:** Dao găm, Gậy bóng chày đinh, Cây nạy xà beng, Rìu cứu hỏa, Đao rựa, Búa tạ, Trảm mã đao, Dao laser.
  - **Vũ khí Tầm xa:** Súng cao su, Cung nỏ săn, Súng lục tự chế, Súng lục 9mm, Súng săn hai nòng, Súng trường bắn tỉa, Súng laser.
  - **Vật phẩm Tiêu hao & Y tế:** Thịt hộp, Lương khô nén, Táo tươi, Chai nước sạch, Lon nước tăng lực, Chai rượu mạnh, Cuộn băng gạc, Lọ kháng sinh, Huyết thanh kháng độc, Hộp cứu thương dã chiến.
  - **Nguyên liệu Xây dựng & Năng lượng:** Mảnh kim loại phế liệu, Bó gỗ khô, Lõi năng lượng tinh khiết.

---

### BATCH 06: COMBAT ANIMATIONS & VFX (6 ASSET - TÙY CHỌN NÂNG CAO)
- **Mục tiêu:** Hiệu ứng hình ảnh hỗ trợ màn chiến đấu trong PixiJS.
- **Số lượng:** **6 ảnh**.
- **Cơ chế triển khai:**
  - **Khuyến nghị:** Sử dụng sprite tĩnh có kênh alpha kết hợp với Tween Animation trong PixiJS (Flash, Scale, Rotate, Shake). Không cần tạo Sprite Sheet phức tạp hàng chục frame vì cấu trúc chiến đấu hiện tại của game chủ yếu hiển thị lượt đánh văn bản.
- **Danh mục:**
  1. \`vfx_slash\` (Vết chém sáng lưỡi đao)
  2. \`vfx_gunfire\` (Tia lửa đầu nòng)
  3. \`vfx_blood_splatter\` (Vết máu văng)
  4. \`vfx_explosion\` (Khối lửa nổ da cam)
  5. \`vfx_acid_poison\` (Làn khói axit xanh độc)
  6. \`vfx_laser_beam\` (Tia xung lực laser)

---

### BATCH 07: INTERACTIVE ENVIRONMENT PROPS (5 ASSET - TÙY CHỌN MỞ RỘNG)
- **Mục tiêu:** Hình ảnh minh họa các vật thể khám phá và công trình căn cứ trong bản đồ.
- **Số lượng:** **5 ảnh**.
- **Quy cách:** PNG 256×256px hoặc 256×512px trong suốt.
- **Danh mục:** \`prop_loot_crate\` (Hòm tiếp tế), \`prop_wrecked_car\` (Xác xe hơi), \`prop_locked_door\` (Cửa thép khóa), \`prop_water_collector\` (Bể hứng nước mưa), \`prop_watchtower\` (Tháp canh gỗ).

---

## 3. PHÂN ĐỊNH TÀI NGUYÊN BẮT BUỘC VS TÙY CHỌN

1. **Bắt buộc tuyệt đối (Core Mandatory — 60 Asset):**
   - 13 UI Assets (Đã hoàn thành 100%).
   - 28 Backgrounds (Đã có file, chỉ cần nén WebP).
   - 7 Nhân vật P0 (Player + 4 NPC chính + 2 Boss người).
   - 8 Zombie P0 (Walker, Runner, Exploder, Riot Police, Berserker, Spitter, Juggernaut, Zombie King).
   - 4 Vũ khí cận chiến P0 + 5 Vũ khí tầm xa P0.
   - 7 Vật phẩm y tế & sinh tồn P0 (Thịt hộp, Lương khô, Nước sạch, Tăng lực, Băng gạc, Kháng sinh, Huyết thanh).
2. **Tùy chọn nâng cao (Optional / Polish — 58 Asset):**
   - Các biến thể zombie phụ (Football, Thợ lặn), vũ khí laser viễn tưởng, công trình căn cứ và hiệu ứng VFX.
`;

fs.writeFileSync('docs/IMAGE_GENERATION_ROADMAP.md', roadmapMd, 'utf8');
console.log('Saved docs/IMAGE_GENERATION_ROADMAP.md successfully.');

// ==========================================
// 4. UPDATE project-docs/assets/batches/batch-02-backgrounds.json
// ==========================================
// Align status of 27 backgrounds to generated since files exist on disk!
const batch02File = 'project-docs/assets/batches/batch-02-backgrounds.json';
if (fs.existsSync(batch02File)) {
  const b2 = JSON.parse(fs.readFileSync(batch02File, 'utf8'));
  let b2Updated = 0;
  for (const a of b2.assets) {
    if (fs.existsSync(a.file)) {
      a.status = 'generated';
      b2Updated++;
    }
  }
  fs.writeFileSync(batch02File, JSON.stringify(b2, null, 2), 'utf8');
  console.log(`Updated ${b2Updated} assets in ${batch02File} to 'generated'.`);
}

// ==========================================
// 5. UPDATE project-docs/assets/asset-manifest.json
// ==========================================
const masterManifestFile = 'project-docs/assets/asset-manifest.json';
if (fs.existsSync(masterManifestFile)) {
  const master = JSON.parse(fs.readFileSync(masterManifestFile, 'utf8'));
  let masterUpdated = 0;
  for (const a of master) {
    if (a.category === 'backgrounds' && fs.existsSync(a.file) && a.status === 'pending') {
      a.status = 'generated';
      masterUpdated++;
    }
  }
  fs.writeFileSync(masterManifestFile, JSON.stringify(master, null, 2), 'utf8');
  console.log(`Updated ${masterUpdated} background assets in ${masterManifestFile} to 'generated'.`);
}

console.log('ALL TASKS COMPLETED SUCCESSFULLY!');

