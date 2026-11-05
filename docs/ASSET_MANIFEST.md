# SỔ TỔNG KÊ TÀI NGUYÊN HÌNH ẢNH TOÀN DIỆN (CENTRAL ASSET MANIFEST)
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
- Toàn bộ 28 background tại `public/assets/backgrounds/` đã được chuyển đổi thành công sang **WebP chuẩn 1920×1080 (Quality 85)**, giảm 96.24% dung lượng từ 236.15 MB xuống còn 8.87 MB.
- Background dự phòng toàn cục `public/image/hinh_nen.webp` (46.5 KB) được giữ nguyên vẹn.

---

## 2. BẢNG CHI TIẾT TÀI NGUYÊN HÌNH ẢNH TOÀN GAME

### Bảng 2.1: Giao Diện Người Dùng (UI Icons & Logo) — 13 Asset (Batch 01)
| Asset ID | Tên Hiển Thị | Trạng Thái | Đường Dẫn Thực Tế | Kích Thước | Định Dạng | Alpha | Source Code Tham Chiếu | Ghi Chú |
|---|---|:---:|---|:---:|:---:|:---:|---|---|
| `ui_game_logo` | Logo Tựa Game Thế Giới Zombie | **EXISTING** | `public/assets/ui/ui_game_logo.png` | 1024x512 | PNG | Có | `index.html (#header-logo), css/style.css` | Logo kim loại đẫm máu sắc nét trên Header |
| `ui_icon_hp` | Icon Sức Khỏe (HP) | **EXISTING** | `public/assets/icons/ui_icon_hp.png` | 256x256 | PNG | Có | `js/ui.js (renderStats), js/pixi-renderer.js (hpIconSprite)` | Trái tim sinh học bọc thép viền trong suốt |
| `ui_icon_hunger` | Icon Bụng No | **EXISTING** | `public/assets/icons/ui_icon_hunger.png` | 256x256 | PNG | Có | `js/ui.js (renderStats)` | Miếng thịt nướng lửa trại |
| `ui_icon_hydration` | Icon Nước Uống | **EXISTING** | `public/assets/icons/ui_icon_hydration.png` | 256x256 | PNG | Có | `js/ui.js (renderStats)` | Giọt nước sinh tồn trong vắt |
| `ui_icon_sanity` | Icon Lý Trí | **EXISTING** | `public/assets/icons/ui_icon_sanity.png` | 256x256 | PNG | Có | `js/ui.js (renderStats)` | Bộ não phát sáng xanh tâm lý |
| `ui_icon_infection` | Icon Nhiễm Bệnh | **EXISTING** | `public/assets/icons/ui_icon_infection.png` | 256x256 | PNG | Có | `js/ui.js (renderStats)` | Cảnh báo sinh học virus đột biến |
| `ui_icon_backpack` | Icon Ba Lô Sinh Tồn | **EXISTING** | `public/assets/icons/ui_icon_backpack.png` | 256x256 | PNG | Có | `js/ui.js (renderInventory)` | Ba lô quân dụng xanh rêu, đã bỏ thanh CAPACITY |
| `ui_icon_melee_slot` | Icon Ô Cận Chiến | **EXISTING** | `public/assets/icons/ui_icon_melee_slot.png` | 256x256 | PNG | Có | `js/ui.js (renderWeapons)` | Hai lưỡi đao chéo rỉ sét |
| `ui_icon_ranged_slot` | Icon Ô Tầm Xa | **EXISTING** | `public/assets/icons/ui_icon_ranged_slot.png` | 256x256 | PNG | Có | `js/ui.js (renderWeapons)` | Tâm ngắm súng trường chiến thuật |
| `ui_icon_res_cigarette` | Icon Thuốc Lá | **EXISTING** | `public/assets/icons/ui_icon_res_cigarette.png` | 256x256 | PNG | Có | `js/ui.js (renderCargo)` | Bao thuốc lá mạt thế đang cháy |
| `ui_icon_res_gasoline` | Icon Xăng Xe | **EXISTING** | `public/assets/icons/ui_icon_res_gasoline.png` | 256x256 | PNG | Có | `js/ui.js (renderCargo)` | Can xăng đỏ quân dụng |
| `ui_icon_res_royal_coin` | Icon Tiền Hoàng Gia | **EXISTING** | `public/assets/icons/ui_icon_res_royal_coin.png` | 256x256 | PNG | Có | `js/ui.js (renderCargo)` | Đồng tiền vàng đúc vương miện Lâu đài |
| `ui_placeholder_empty` | Icon Ô Lựa Chọn Trống | **EXISTING** | `public/assets/ui/ui_placeholder_empty.png` | 256x256 | PNG | Có | `js/ui.js (renderOptions)` | Khung ô vuông trống phân trang 30 slots |

### Bảng 2.2: Bối Cảnh Môi Trường (Backgrounds & Maps) — 29 Asset (Batch 02)
| Asset ID | Tên Bối Cảnh | Trạng Thái | Đường Dẫn Lưu | Kích Thước | Format Thực | Dung Lượng | Source Code Tham Chiếu | Đánh Giá Kỹ Thuật |
|---|---|:---:|---|:---:|:---:|:---:|---|---|
| `ui_bg_fallback` | Hình Nền Dự Phòng Toàn Cục | **EXISTING** | `public/image/hinh_nen.webp` | 2732x1534 | WEBP | 47 KB | `index.html (CSS fallback)` | Hình nền gốc mạt thế, WebP chuẩn 46KB |
| `ui_main_menu_bg` | Cổng Căn Cứ Menu Chính | **EXISTING** | `public/assets/backgrounds/ui_main_menu_bg.webp` | 2732x1534 | WEBP | 153 KB | `index.html (#game-header background)` | Cổng căn cứ lúc chạng vạng (1920x1080 JPEG 258KB) |
| `map_lau_dai_tan_the_bg` | Lâu Đài Karen Tận Thế | **EXISTING** | `public/assets/backgrounds/map_lau_dai_tan_the_bg.webp` | 2732x1534 | WEBP | 294 KB | `js/data/maps/maps.js, js/castle/royalty.js` | Thành trì gothic bọc thép của Vua Karen |
| `map_tran_dia_binh_minh_bg` | Tiền Đồn Đợi Sáng | **EXISTING** | `public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp` | 2732x1534 | WEBP | 297 KB | `js/data/maps/maps.js` | Doanh trại quân sự tiền tuyến trong sương sớm |
| `map_benh_vien_ngoai_thanh_bg` | Bệnh Viện Ngoại Thành | **EXISTING** | `public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp` | 2732x1534 | WEBP | 153 KB | `js/data/maps/maps.js` | Khu cấp cứu đổ nát đầy u ám |
| `map_tram_kiem_tra_quan_du_bg` | Trạm Kiểm Soát Quân Sự | **EXISTING** | `public/assets/backgrounds/map_tram_kiem_tra_quan_du_bg.webp` | 2732x1534 | WEBP | 298 KB | `js/data/maps/maps.js` | Barie cao tốc bọc thép rỉ sét |
| `map_vien_sinh_hoc_bg` | Viện Sinh Học Tuyệt Mật | **EXISTING** | `public/assets/backgrounds/map_vien_sinh_hoc_bg.webp` | 2732x1534 | WEBP | 296 KB | `js/data/maps/maps.js` | Phòng thí nghiệm virus phát ánh sáng xanh |
| `map_to_zombie_bg` | Tổ Zombie Chúa | **EXISTING** | `public/assets/backgrounds/map_to_zombie_bg.webp` | 2732x1534 | WEBP | 286 KB | `js/data/maps/maps.js` | Tổ kén quái vật đỏ thẫm kinh hoàng |
| `map_co_so_vu_tru_tuyet_mat_bg` | Căn Cứ Vũ Trụ Tuyệt Mật | **EXISTING** | `public/assets/backgrounds/map_co_so_vu_tru_tuyet_mat_bg.webp` | 2732x1534 | WEBP | 295 KB | `js/data/maps/maps.js` | Bệ phóng tên lửa bí mật mạt thế |
| `combat_bg_city` | Đấu Trường Đô Thị Hoang Tàn | **EXISTING** | `public/assets/backgrounds/combat_bg_city.webp` | 2732x1534 | WEBP | 322 KB | `js/combat.js` | Đường phố đổ nát xe cộ ngổn ngang |
| `combat_bg_nest` | Đấu Trường Ổ Quái Vật | **EXISTING** | `public/assets/backgrounds/combat_bg_nest.webp` | 2732x1534 | WEBP | 280 KB | `js/combat.js` | Hầm ngầm đầy dịch nhầy và kén zombie |
| `map_khu_dich_vu_cao_toc_bg` | Trạm Dịch Vụ Cao Tốc | **EXISTING** | `public/assets/backgrounds/map_khu_dich_vu_cao_toc_bg.webp` | 2732x1534 | WEBP | 283 KB | `js/data/maps/maps.js` | Khu dừng nghỉ cao tốc vỡ nát |
| `map_thanh_pho_dai_hoc_bg` | Thành Phố Đại Học | **EXISTING** | `public/assets/backgrounds/map_thanh_pho_dai_hoc_bg.webp` | 2732x1534 | WEBP | 499 KB | `js/data/maps/maps.js` | Khuôn viên trường học hoang tàn |
| `map_tram_xang_bo_roi_bg` | Trạm Xăng Bỏ Rơi | **EXISTING** | `public/assets/backgrounds/map_tram_xang_bo_roi_bg.webp` | 2732x1534 | WEBP | 372 KB | `js/data/maps/maps.js` | Cột bơm xăng rỉ sét ven đường |
| `map_trung_tam_thuong_mai_bg` | Trung Tâm Thương Mại | **EXISTING** | `public/assets/backgrounds/map_trung_tam_thuong_mai_bg.webp` | 2732x1534 | WEBP | 360 KB | `js/data/maps/maps.js` | Đại sảnh mua sắm mái kính vỡ vụn |
| `map_khu_dan_cu_cu_bg` | Khu Dân Cư Cũ | **EXISTING** | `public/assets/backgrounds/map_khu_dan_cu_cu_bg.webp` | 2732x1534 | WEBP | 367 KB | `js/data/maps/maps.js` | Dãy nhà tập thể cũ kỹ âm u |
| `map_khu_cong_nghiep_bg` | Khu Công Nghiệp Phế Thải | **EXISTING** | `public/assets/backgrounds/map_khu_cong_nghiep_bg.webp` | 2732x1534 | WEBP | 299 KB | `js/data/maps/maps.js` | Nhà xưởng ống khói khổng lồ rỉ sét |
| `map_cang_ben_song_bg` | Bến Cảng Ven Sông | **EXISTING** | `public/assets/backgrounds/map_cang_ben_song_bg.webp` | 2732x1534 | WEBP | 329 KB | `js/data/maps/maps.js` | Tàu bè mắc cạn sương mù mịt mùng |
| `map_sieu_thi_kho_bg` | Siêu Thị Kho Hàng | **EXISTING** | `public/assets/backgrounds/map_sieu_thi_kho_bg.webp` | 2732x1534 | WEBP | 353 KB | `js/data/maps/maps.js` | Kệ hàng đổ sập bị cướp phá |
| `map_canh_sat_bo_roi_bg` | Đồn Cảnh Sát Bỏ Hoang | **EXISTING** | `public/assets/backgrounds/map_canh_sat_bo_roi_bg.webp` | 2732x1534 | WEBP | 345 KB | `js/data/maps/maps.js` | Khu giam giữ và văn phòng cảnh sát |
| `map_ham_tau_dien_ngam_bg` | Hầm Tàu Điện Ngầm | **EXISTING** | `public/assets/backgrounds/map_ham_tau_dien_ngam_bg.webp` | 2732x1534 | WEBP | 257 KB | `js/data/maps/maps.js` | Đường ray ngập nước tăm tối |
| `map_dao_nho_bg` | Hòn Đảo Cô Độc | **EXISTING** | `public/assets/backgrounds/map_dao_nho_bg.webp` | 2732x1534 | WEBP | 345 KB | `js/data/maps/maps.js` | Bờ biển sóng vỗ hoang vắng |
| `combat_bg_interior` | Đấu Trường Nội Thất Tòa Nhà | **EXISTING** | `public/assets/backgrounds/combat_bg_interior.webp` | 2732x1534 | WEBP | 240 KB | `js/combat.js` | Hành lang đổ nát phòng kín |
| `combat_bg_sea` | Đấu Trường Boong Tàu / Biển | **EXISTING** | `public/assets/backgrounds/combat_bg_sea.webp` | 2732x1534 | WEBP | 487 KB | `js/combat.js` | Mặt biển đen tối sóng gió |
| `map_thap_canh_bo_roi_bg` | Tháp Canh Trên Đồi | **EXISTING** | `public/assets/backgrounds/map_thap_canh_bo_roi_bg.webp` | 2732x1534 | WEBP | 352 KB | `js/data/maps/maps.js` | Tháp quan sát quân sự cô độc |
| `map_nha_kho_nong_thon_bg` | Nhà Kho Nông Thôn | **EXISTING** | `public/assets/backgrounds/map_nha_kho_nong_thon_bg.webp` | 2732x1534 | WEBP | 392 KB | `js/data/maps/maps.js` | Kho thóc gỗ mục giữa đồng cỏ khô |
| `map_lang_nong_trai_nui_bg` | Bản Làng Dưới Núi | **EXISTING** | `public/assets/backgrounds/map_lang_nong_trai_nui_bg.webp` | 2732x1534 | WEBP | 432 KB | `js/data/maps/maps.js` | Thôn làng hẻo lánh vắng bóng người |
| `map_cam_trai_ben_song_bg` | Khu Cắm Trại Bên Sông | **EXISTING** | `public/assets/backgrounds/map_cam_trai_ben_song_bg.webp` | 2732x1534 | WEBP | 333 KB | `js/data/maps/maps.js` | Lều bạt rách nát bờ cỏ |
| `map_nha_kho_nha_may_bg` | Kho Xưởng Cơ Khí | **EXISTING** | `public/assets/backgrounds/map_nha_kho_nha_may_bg.webp` | 2732x1534 | WEBP | 361 KB | `js/data/maps/maps.js` | Kho phụ tùng máy móc phế liệu |

### Bảng 2.3: Nhân Vật Chính & NPC Cốt Truyện — 16 Asset (Batch 03 - MISSING)
| Asset ID | Tên Hiển Thị | Vai Trò | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Đề Xuất Kích Thước | Nền Trong Suốt | Entity ID Source Code |
|---|---|---|:---:|:---:|---|:---:|:---:|---|
| `char_player_default` | Nhân Vật Chính (Survivor) | Character | **P0** | `MISSING` | `public/assets/characters/char_player_default.png` | 512x768 (PNG) | Có | `js/state.js (Player stats)` |
| `char_npc_v` | Cô V (Nữ Sát Thủ Lạnh Lùng) | NPC | **P0** | `MISSING` | `public/assets/characters/char_npc_v.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (SURVIVOR_NPC id: "v")` |
| `char_npc_xiaohan` | Tiểu Hàm (Cô Gái Sinh Tồn) | NPC | **P0** | `MISSING` | `public/assets/characters/char_npc_xiaohan.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "xiaohan")` |
| `char_npc_lili` | Lili (Nữ Thợ Máy Căn Cứ) | NPC | **P0** | `MISSING` | `public/assets/characters/char_npc_lili.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "lili")` |
| `char_npc_mumiao` | Mục Miêu Miêu (Liên Lạc Viên Bí Ẩn) | NPC | **P0** | `MISSING` | `public/assets/characters/char_npc_mumiao.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "mumiao")` |
| `char_npc_ma_san` | Mã Tam (Kẻ Săn Đêm Đô Thị) | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_ma_san.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "ma_san")` |
| `char_npc_shadow` | Hắc Ảnh (Thám Tử Trong Bóng Tối) | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_shadow.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "shadow")` |
| `char_npc_banker` | Trưởng Ngân Hàng Lâu Đài | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_banker.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "banker"), js/castle/royalty.js` |
| `char_npc_leader` | Trưởng Trận Địa (Chỉ Huy Tiền Tuyến) | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_leader.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "leader")` |
| `char_npc_survivor_generic` | Lưu Dân Mạt Thế (Người Tị Nạn) | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_survivor_generic.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (NPCS.survivor)` |
| `char_npc_bandit_generic` | Đao Ba (Cướp Bóc Phế Thổ) | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_bandit_generic.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (NPCS.bandit)` |
| `char_npc_trader_generic` | Thương Nhân Chợ Đen | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_trader_generic.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (NPCS.wanderingTrader)` |
| `char_npc_doctor_generic` | Du Y Mạt Thế | NPC | **P1** | `MISSING` | `public/assets/characters/char_npc_doctor_generic.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (NPCS.doctor)` |
| `boss_karen_king` | Vua Lâu Đài (Quốc Vương Karen) | Boss | **P0** | `MISSING` | `public/assets/characters/boss_karen_king.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "king_boss"), js/castle/royalty.js` |
| `boss_veteran_zhao` | Lão Binh Lão Triệu | Boss | **P0** | `MISSING` | `public/assets/characters/boss_veteran_zhao.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "zhao_boss")` |
| `boss_dr_tran` | Tiến Sĩ Trần (Nhà Khoa Học Điên) | Boss | **P0** | `MISSING` | `public/assets/characters/boss_dr_tran.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "doctor_boss")` |

### Bảng 2.4: Zombie & Boss Kẻ Địch — 21 Asset (Batch 04 - MISSING)
| Asset ID | Tên Kẻ Địch | Phân Loại | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Đề Xuất Kích Thước | Nền Trong Suốt | Entity ID Source Code |
|---|---|---|:---:|:---:|---|:---:|:---:|---|
| `zombie_walker` | Zombie Lãng Du Thường | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_walker.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_lang_dao)` |
| `zombie_crawler` | Thây Rách | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_crawler.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_thay_rach)` |
| `zombie_creeper` | Zombie Bò | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_creeper.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_bo)` |
| `zombie_runner` | Zombie Chạy Nhanh | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_runner.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_nhanh)` |
| `zombie_bloater` | Zombie Béo Phì | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_bloater.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_beo)` |
| `zombie_exploder` | Zombie Phát Nổ | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_exploder.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_no)` |
| `zombie_riot_police` | Zombie Quân Cảnh Bọc Giáp | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_riot_police.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_quan_canh)` |
| `zombie_swarm_mother` | Mẹ Zombie Bầy Đàn | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_swarm_mother.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_me_nhom)` |
| `zombie_ironclad` | Zombie Giáp Sắt | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_ironclad.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_giap_sat)` |
| `zombie_frost` | Zombie Băng Giá | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_frost.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_bang_gia)` |
| `zombie_berserker` | Zombie Cuồng Nộ | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_berserker.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_dien_cuong)` |
| `zombie_acid_spitter` | Zombie Phun Axit | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_acid_spitter.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_axit)` |
| `zombie_leaper` | Zombie Nhảy Vồ | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_leaper.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_nhay)` |
| `zombie_juggernaut` | Zombie Xe Tăng Khổng Lồ | Zombie | **P0** | `MISSING` | `public/assets/zombies/zombie_juggernaut.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_tank)` |
| `zombie_invisible` | Zombie Tàng Hình Ảo Ảnh | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_invisible.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_ma_vo_hinh)` |
| `zombie_piercer` | Zombie Xuyên Thủng | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_piercer.png` | 512x768 (PNG) | Có | `js/data/entities/zombies.js (zombie_xuyen_thung)` |
| `zombie_giant_puppet` | Cỗ Rối Khổng Lồ | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_giant_puppet.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "giant_puppet")` |
| `zombie_football` | Zombie Bóng Bầu Dục | Zombie | **P2** | `MISSING` | `public/assets/zombies/zombie_football.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "football_zombie")` |
| `zombie_diver` | Zombie Thợ Lặn | Zombie | **P2** | `MISSING` | `public/assets/zombies/zombie_diver.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "diving_zombie")` |
| `zombie_sea_monster` | Hải Zombie Khổng Lồ | Zombie | **P1** | `MISSING` | `public/assets/zombies/zombie_sea_monster.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "sea_monster")` |
| `boss_zombie_king` | Vua Zombie Im Lặng (Silent King) | Boss | **P0** | `MISSING` | `public/assets/zombies/boss_zombie_king.png` | 512x768 (PNG) | Có | `js/data/entities/npcs.js (id: "zombie_king")` |

### Bảng 2.5: Vũ Khí, Trang Bị & Vật Phẩm Cốt Lõi — 28 Asset (Batch 05 - MISSING)
| Asset ID | Tên Vật Phẩm | Phân Nhóm | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Nền Trong Suốt | Source Code Tham Chiếu |
|---|---|---|:---:|:---:|---|:---:|:---:|---|
| `item_weapon_knife` | Dao Găm / Dao Bếp | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_knife.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (dao_bep, dao_gam_nho)` |
| `item_weapon_baseball_bat` | Gậy Bóng Chày Đinh | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_baseball_bat.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (gay_bong_chay)` |
| `item_weapon_crowbar` | Cây Nạy Xà Beng | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_crowbar.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (cay_nay)` |
| `item_weapon_fire_axe` | Rìu Cứu Hỏa | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_fire_axe.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (riu_cuu_hoa)` |
| `item_weapon_machete` | Đao Chém Rựa | Weapon | **P1** | `MISSING` | `public/assets/items/item_weapon_machete.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (dao_kham_lon)` |
| `item_weapon_sledgehammer` | Búa Tạ Nhổ Đinh | Weapon | **P1** | `MISSING` | `public/assets/items/item_weapon_sledgehammer.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (bua_be_mot, bua_sat_nho)` |
| `item_weapon_military_sword` | Trảm Mã Đao Quân Sự | Weapon | **P1** | `MISSING` | `public/assets/items/item_weapon_military_sword.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (dao_tram_ma, kiem_quan_su)` |
| `item_weapon_laser_blade` | Dao Động Lực Laser | Weapon | **P2** | `MISSING` | `public/assets/items/item_weapon_laser_blade.png` | 256x256 (PNG) | Có | `js/data/weapons/melee.js (dao_dong_luc_laser)` |
| `item_weapon_slingshot` | Súng Cao Su Săn | Weapon | **P1** | `MISSING` | `public/assets/items/item_weapon_slingshot.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_cao_su)` |
| `item_weapon_hunting_crossbow` | Nỏ Săn Bắn Tỉa | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_hunting_crossbow.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (no_san, no_tay, cung_san)` |
| `item_weapon_pipe_pistol` | Súng Lục Tự Chế | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_pipe_pistol.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_luc_tu_che)` |
| `item_weapon_police_pistol` | Súng Lục Quân Cảnh 9mm | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_police_pistol.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_luc_canh_sat)` |
| `item_weapon_double_shotgun` | Súng Săn Hai Nòng | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_double_shotgun.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_san_hai_nong)` |
| `item_weapon_sniper_rifle` | Súng Trường Bắn Tỉa | Weapon | **P0** | `MISSING` | `public/assets/items/item_weapon_sniper_rifle.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_truong_ban_tia, sung_tieu_lien)` |
| `item_weapon_laser_rifle` | Súng Trường Xung Lực Laser | Weapon | **P2** | `MISSING` | `public/assets/items/item_weapon_laser_rifle.png` | 256x256 (PNG) | Có | `js/data/weapons/ranged.js (sung_laser_nhiem_vu)` |
| `item_food_canned_meat` | Thịt Hộp Quân Dụng | Item | **P0** | `MISSING` | `public/assets/items/item_food_canned_meat.png` | 256x256 (PNG) | Có | `js/data/items/foods.js (thit_hop, ca_hop, thit_bo_kho)` |
| `item_food_hard_biscuit` | Lương Khô Nén | Item | **P0** | `MISSING` | `public/assets/items/item_food_hard_biscuit.png` | 256x256 (PNG) | Có | `js/data/items/foods.js (banh_quy_nen, luong_kho_quan_doi)` |
| `item_food_fresh_apple` | Táo Rừng Tươi | Item | **P1** | `MISSING` | `public/assets/items/item_food_fresh_apple.png` | 256x256 (PNG) | Có | `js/data/items/foods.js (tao_tuoi, crops.js)` |
| `item_drink_mineral_water` | Chai Nước Sạch | Item | **P0** | `MISSING` | `public/assets/items/item_drink_mineral_water.png` | 256x256 (PNG) | Có | `js/data/items/drinks.js (nuoc_khoang, nuoc_sach)` |
| `item_drink_energy_drink` | Lon Nước Tăng Lực | Item | **P0** | `MISSING` | `public/assets/items/item_drink_energy_drink.png` | 256x256 (PNG) | Có | `js/data/items/drinks.js (nuoc_tang_luc, bia_nang_luong)` |
| `item_drink_whiskey` | Chai Rượu Mạnh | Item | **P1** | `MISSING` | `public/assets/items/item_drink_whiskey.png` | 256x256 (PNG) | Có | `js/data/items/drinks.js (ruou_manh, bia_tram_vi)` |
| `item_med_bandage` | Cuộn Băng Gạc Vô Trùng | Item | **P0** | `MISSING` | `public/assets/items/item_med_bandage.png` | 256x256 (PNG) | Có | `js/data/items/medicines.js (bang_keo, bong_gac)` |
| `item_med_antibiotics` | Lọ Thuốc Kháng Sinh | Item | **P0** | `MISSING` | `public/assets/items/item_med_antibiotics.png` | 256x256 (PNG) | Có | `js/data/items/medicines.js (thuoc_khang_sinh, thuoc_giam_dau)` |
| `item_med_antidote_serum` | Ống Tiêm Huyết Thanh Kháng Virus | Item | **P0** | `MISSING` | `public/assets/items/item_med_antidote_serum.png` | 256x256 (PNG) | Có | `js/data/items/medicines.js (huyet_thanh_chong_doc, tiem_van_nang)` |
| `item_med_first_aid_kit` | Hộp Cứu Thương Dã Chiến | Item | **P0** | `MISSING` | `public/assets/items/item_med_first_aid_kit.png` | 256x256 (PNG) | Có | `js/data/items/medicines.js (hop_y_te, goi_cap_cuu)` |
| `item_res_scrap_metal` | Mảnh Kim Loại Phế Liệu | Item | **P1** | `MISSING` | `public/assets/items/item_res_scrap_metal.png` | 256x256 (PNG) | Có | `js/data/items/building-materials.js (nails, building_mat)` |
| `item_res_wood_bundle` | Bó Gỗ Rừng Khô | Item | **P1** | `MISSING` | `public/assets/items/item_res_wood_bundle.png` | 256x256 (PNG) | Có | `js/data/items/building-materials.js (wood)` |
| `item_res_pure_energy` | Lõi Năng Lượng Tinh Khiết | Item | **P1** | `MISSING` | `public/assets/items/item_res_pure_energy.png` | 256x256 (PNG) | Có | `js/state.js (pureEnergy), js/castle/royalty.js` |

### Bảng 2.6: Hiệu Ứng Chiến Đấu (VFX) — 6 Asset (Batch 06 - MISSING)
| Asset ID | Tên Hiệu Ứng | Loại VFX | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Cơ Chế Hiển Thị Đề Xuất |
|---|---|---|:---:|:---:|---|:---:|---|
| `vfx_slash` | Hiệu Ứng Vết Chém Cận Chiến | Combat_VFX | **P1** | `MISSING` | `public/assets/vfx/vfx_slash.png` | 256x256 | Vệt sáng lưỡi đao chém cong vút |
| `vfx_gunfire` | Hiệu Ứng Lửa Đầu Nòng | Combat_VFX | **P1** | `MISSING` | `public/assets/vfx/vfx_gunfire.png` | 256x256 | Tia lửa nổ bung miệng nòng súng |
| `vfx_blood_splatter` | Hiệu Ứng Máu Văng | Combat_VFX | **P1** | `MISSING` | `public/assets/vfx/vfx_blood_splatter.png` | 256x256 | Vết máu thẫm tóe ra khi trúng đòn |
| `vfx_explosion` | Hiệu Ứng Vụ Nổ Rực Lửa | Combat_VFX | **P1** | `MISSING` | `public/assets/vfx/vfx_explosion.png` | 256x256 | Khối lửa cam bùng nổ kèm khói đen |
| `vfx_acid_poison` | Hiệu Ứng Phun Axit Độc | Combat_VFX | **P1** | `MISSING` | `public/assets/vfx/vfx_acid_poison.png` | 256x256 | Làn khói bốc hơi xanh lá dạ quang |
| `vfx_laser_beam` | Hiệu Ứng Chùm Tia Laser | Combat_VFX | **P2** | `MISSING` | `public/assets/vfx/vfx_laser_beam.png` | 256x256 | Chùm tia laser xanh cyan xé gió |

### Bảng 2.7: Vật Thể Môi Trường Tương Tác (Props) — 5 Asset (Batch 07 - MISSING)
| Asset ID | Tên Vật Thể | Nhóm | Mức Độ | Trạng Thái | Đường Dẫn Dự Kiến | Kích Thước | Mục Đích Sử Dụng |
|---|---|---|:---:|:---:|---|:---:|---|
| `prop_loot_crate` | Hòm Đồ Gỗ Mạt Thế | Prop | **P1** | `MISSING` | `public/assets/props/prop_loot_crate.png` | 256x256 | Rương gỗ gia cố nẹp sắt khóa gãy |
| `prop_wrecked_car` | Xác Xe Hơi Bị Bỏ Rơi | Prop | **P1** | `MISSING` | `public/assets/props/prop_wrecked_car.png` | 512x256 | Xe sedan vỡ kính lốp xẹp rỉ sét |
| `prop_locked_door` | Cửa Thép Chống Nổ Khóa | Prop | **P1** | `MISSING` | `public/assets/props/prop_locked_door.png` | 256x512 | Cánh cửa thép dập đinh tán bảng khóa số |
| `prop_water_collector` | Bể Thu Gom Nước Mưa Căn Cứ | Prop | **P2** | `MISSING` | `public/assets/props/prop_water_collector.png` | 256x256 | Thùng phuy nối máng thu nước sạch |
| `prop_watchtower` | Tháp Canh Phòng Thủ Căn Cứ | Prop | **P2** | `MISSING` | `public/assets/props/prop_watchtower.png` | 256x512 | Chòi canh gỗ cao quan sát zombie từ xa |
