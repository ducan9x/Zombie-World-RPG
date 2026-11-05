# TỔNG HỢP DANH MỤC TÀI NGUYÊN HÌNH ẢNH (ASSET INVENTORY)
## DỰ ÁN: ZOMBIE WORLD RPG — HỆ THỐNG ĐỒ HỌA PIXIJS & UI

Tài liệu này tổng hợp toàn bộ hiện trạng asset, các vị trí đang sử dụng placeholder, danh mục chi tiết 120+ asset hình ảnh cần thiết cho dự án game và quy chuẩn responsive cho đa dạng kích thước màn hình.

---

## BẢNG 1: TỔNG QUAN ASSET TOÀN DỰ ÁN (SUMMARY OVERVIEW)

| Phân nhóm (Category) | Tổng Asset cần có (Total) | Đã có sẵn (Existing) | Đang dùng Placeholder | Còn thiếu (Missing) | Có thể tái sử dụng (Reusable) |
|---|---:|---:|---:|---:|---:|
| **A. UI / Interface** | 28 | 1 | 27 | 27 | 18 |
| **B. World / Map** | 25 | 1 | 24 | 24 | 12 |
| **C. Character / Zombie** | 35 | 0 | 35 | 35 | 24 |
| **D. Combat** | 15 | 0 | 15 | 15 | 15 |
| **E. Item / Equipment** | 32 | 0 | 32 | 32 | 28 |
| **F. Event / Story** | 12 | 0 | 12 | 12 | 6 |
| **TỔNG CỘNG** | **147** | **2** | **145** | **145** | **103** |

*Ghi chú:*
- **Existing:** 2 asset hiện có là `public/icon/icon.png` (400x400) và `public/image/hinh_nen.webp` (2732x1534).
- **Placeholder:** 145 vị trí hiện đang hiển thị bằng ký tự Emoji Unicode trong HTML, hình khối màu CSS phẳng, hoặc text thuần túy trong PixiJS.
- **Reusable:** 103 asset có thể dùng chung giữa các màn hình, popup, tooltip và panel (ví dụ icon trang bị, icon chỉ số, khung viền panel, hiệu ứng chiến đấu VFX).

---

## BẢNG 2: CHI TIẾT ASSET CẦN TẠO (DETAILED ASSET CREATION SPECIFICATION)

### Nhóm A: Giao diện người dùng & Hệ thống (UI / Interface)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `ui_main_menu_bg` | ui_main_menu_bg | UI | Menu chính | Cổng căn cứ phế thổ tàn tạ, dây thép gai rỉ sét, sương mù u ám lúc chập tối | Dark survival RPG | 1920x1080 | 16:9 | WebP | No | P0 |
| `ui_game_logo` | ui_game_logo | UI | Header/Menu | Logo tựa game "THẾ GIỚI ZOMBIE" chữ kim loại hoen rỉ, vết máu khô và vết cào | Grunge metallic logo | 1024x512 | 2:1 | PNG | Yes | P0 |
| `ui_panel_frame` | ui_panel_frame | UI | Toàn bộ UI | Khung viền panel kim loại phong cách hậu tận thế, ốc vít góc, gỉ sét nhẹ | 9-Slice metallic frame | 512x512 | 1:1 | PNG | Yes | P1 |
| `ui_button_action` | ui_button_action | UI | Options Zone | Nút bấm giao diện hành động, bề mặt kim loại mờ, viền vàng kim loại cảnh báo | Rusty button plate | 512x128 | 4:1 | PNG | Yes | P1 |
| `ui_icon_hp` | ui_icon_hp | UI | Stats Panel | Trái tim đỏ thẫm sinh học được bọc khung kim loại bảo hộ | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_sanity` | ui_icon_sanity | UI | Stats Panel | Bộ não người phát ánh sáng xanh mờ ảo, biểu thị sức khỏe tâm lý | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_crash` | ui_icon_crash | UI | Stats Panel | Bộ não bị nứt vỡ với những tia chớp đỏ hoảng loạn (Độ sụp đổ) | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `ui_icon_hunger` | ui_icon_hunger | UI | Stats Panel | Miếng thịt đùi nướng sinh tồn trên lửa trại hoặc đùi gà vàng | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_hydration` | ui_icon_hydration | UI | Stats Panel | Giọt nước trong vắt phản chiếu ánh sáng xanh dịu | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_infection` | ui_icon_infection | UI | Stats Panel | Biểu tượng cảnh báo sinh học (Biohazard) màu xanh lá dạ quang đột biến | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_power` | ui_icon_power | UI | Stats Panel | Cánh tay cơ bắp bọc giáp thép, biểu thị tổng lực chiến | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `ui_icon_defense` | ui_icon_defense | UI | Stats Panel | Khiên thép cảnh sát chống bạo động có vết đạn và vết cào | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `ui_icon_res_cigarette` | ui_icon_res_cigarette | UI | Stats/Economy | Bao thuốc lá mạt thế cùng điếu thuốc đang cháy khói nghi ngút | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_res_royal_coin` | ui_icon_res_royal_coin | UI | Stats/Castle | Đồng tiền vàng khắc hình vương miện Karen tinh xảo | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_res_gasoline` | ui_icon_res_gasoline | UI | Stats/Vehicle | Can xăng quân đội màu đỏ sắt có vòi rót | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_res_wood` | ui_icon_res_wood | UI | Base building | Bó khúc gỗ rừng khô được buộc dây thừng chắc chắn | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P2 |
| `ui_icon_res_stone` | ui_icon_res_stone | UI | Base building | Đống đá tảng xây dựng xám sắc cạnh | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P2 |
| `ui_icon_res_scrap_metal` | ui_icon_res_scrap_metal | UI | Base/Craft | Các tấm kim loại phế liệu, bánh răng và bu lông cũ | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P2 |
| `ui_icon_res_parts` | ui_icon_res_parts | UI | Tech crafting | Bo mạch điện tử và vi mạch phát sáng xanh lục | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P2 |
| `ui_icon_backpack` | ui_icon_backpack | UI | Inventory | Balo dã ngoại quân sự màu xanh rêu đa ngăn | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_cargo` | ui_icon_cargo | UI | Cargo trunk | Thùng hàng gỗ hoặc cốp xe tải chứa đồ | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `ui_icon_melee_slot` | ui_icon_melee_slot | UI | Equipment Zone | Biểu tượng hai thanh đao bắt chéo cho ô cận chiến | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_icon_ranged_slot` | ui_icon_ranged_slot | UI | Equipment Zone | Biểu tượng khẩu súng trường ngắm bắn cho ô tầm xa | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `ui_placeholder_empty` | ui_placeholder_empty | UI | Fallback system | Khung ô vuông kim loại trống rỉ sét có dấu gạch chéo mờ | Flat tactical icon | 256x256 | 1:1 | PNG | Yes | P0 |

---

### Nhóm B: Thế giới & Bản đồ (World / Map Locations - 23 Địa điểm)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `map_world_overview` | map_world_overview | Map | Bản đồ tổng | Tấm bản đồ quân sự trải trên bàn gỗ, đánh dấu các cứ điểm và vùng đỏ nguy hiểm | Top-down tactical | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_lau_dai_tan_the` | map_lau_dai_tan_the | Map | Lâu đài Karen | Tòa lâu đài đá tráng lệ kiểu gothic được gia cố tường thép cao, ánh đèn vàng xa hoa | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_tran_dia_binh_minh` | map_tran_dia_binh_minh | Map | Căn cứ Dawn | Tiền đồn quân sự kiên cố, bao cát, tháp canh gác, đèn pha rọi sáng trong đêm | Cinematic survival | 1920x1080 | 16:9 | WebP | P0 |
| `map_thap_canh_bo_roi` | map_thap_canh_bo_roi | Map | Tháp Canh | Tháp canh bằng thép hoang vắng trên đỉnh núi đá trơ trọi, gió rít mây mù | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P2 |
| `map_nha_kho_nong_thon` | map_nha_kho_nong_thon | Map | Kho nông thôn | Kho thóc bằng gỗ mục nát giữa cánh đồng khô cằn, máy cày bỏ hoang | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P2 |
| `map_lang_nong_trai_nui` | map_lang_nong_trai_nui | Map | Làng chân núi | Ngôi làng nhỏ dưới chân vách đá sụp đổ, nhà cửa bỏ hoang, cỏ dại mọc um tùm | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P2 |
| `map_cam_trai_ben_song` | map_cam_trai_ben_song | Map | Khu cắm trại | Lều trại rách nát bên bờ sông đục ngầu, tàn tích lửa trại đã nguội lạnh | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P2 |
| `map_khu_dich_vu_cao_toc`| map_khu_dich_vu_cao_toc| Map | Trạm dừng cao tốc | Trạm dừng chân đường cao tốc hoang phế, xe hơi dồn toa cháy đen, biển hiệu rơi | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_thanh_pho_dai_hoc` | map_thanh_pho_dai_hoc | Map | Khu đại học | Khuôn viên trường đại học đổ nát, sách vở vương vãi, vết máu khô trên tường | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_tram_xang_bo_roi` | map_tram_xang_bo_roi | Map | Trạm xăng | Cột bơm xăng rỉ sét, mái che sập một góc, cửa hàng tiện lợi vỡ kính | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_trung_tam_thuong_mai`| map_trung_tam_thuong_mai| Map | TTTM sụp đổ | Tòa trung tâm thương mại mái kính vỡ toang, thang cuốn kẹt cứng, biển hiệu tắt lịm | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_khu_dan_cu_cu` | map_khu_dan_cu_cu | Map | Khu dân cư | Khu tập thể chung cư cũ nứt toác, dây phơi quần áo rách rưới, ô cửa sổ tối đen | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_khu_cong_nghiep` | map_khu_cong_nghiep | Map | Nhà máy xưởng | Khu công nghiệp nặng, ống khói khổng lồ gãy gập, đường ống khí rò rỉ rỉ sét | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_cang_ben_song` | map_cang_ben_song | Map | Cảng tàu | Bến cảng sông nước đục, cần cẩu rỉ sét, vài chiếc thuyền gỗ thủng dập dềnh | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_sieu_thi_kho` | map_sieu_thi_kho | Map | Siêu thị kho | Nhà kho bán sỉ khổng lồ với các kệ hàng thép cao chót vót nhưng trống trơn | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_nha_kho_nha_may` | map_nha_kho_nha_may | Map | Kho công xưởng | Kho chứa phụ tùng công nghiệp tối tăm, ánh trăng chiếu qua kẽ hở tôn lợp | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P2 |
| `map_benh_vien_ngoai_thanh`| map_benh_vien_ngoai_thanh| Map | Bệnh viện bỏ hoang| Hành lang bệnh viện u ám, xe lăn lật đổ, vết máu kéo dài, đèn huỳnh quang nhấp nháy | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_canh_sat_bo_roi` | map_canh_sat_bo_roi | Map | Đồn cảnh sát | Tiền sảnh sở cảnh sát có hàng rào kẽm gai dã chiến, cửa sổ bọc thép thủng lỗ đạn | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_tram_kiem_tra_quan_du`| map_tram_kiem_tra_quan_du| Map | Chốt kiểm soát lính| Trạm gác quân đội bọc thép, rào cản xe tăng, xe jeep quân sự rỉ sét bên đường | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_ham_tau_dien_ngam`| map_ham_tau_dien_ngam| Map | Ga tàu ngầm | Đường hầm tàu điện ngầm ngập nước đen ngòm, toa tàu trật bánh chìm trong bóng tối | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |
| `map_vien_sinh_hoc` | map_vien_sinh_hoc | Map | Viện nghiên cứu | Phòng thí nghiệm kính vỡ, bể nuôi cấy sinh học phát ánh sáng lục ma quái | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_to_zombie` | map_to_zombie | Map | Hang ổ zombie | Hang động sâu tăm tối phủ đầy kén nhầy sinh học hữu cơ, đầu lâu và xương trắng | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_co_so_vu_tru` | map_co_so_vu_tru | Map | Trung tâm phóng | Bệ phóng tên lửa khổng lồ bằng thép giữa trung tâm sa mạc, tháp nối giàn giáo | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P0 |
| `map_dao_nho` | map_dao_nho | Map | Đảo hoàng gia | Hòn đảo biệt lập trên biển sương mù, phố mua sắm ngầm và quán bar đèn neon | Cinematic survival | 1920x1080 | 16:9 | WebP | No | P1 |

---

### Nhóm C: Nhân vật, NPC, Zombie & Boss (Characters, NPCs, Enemies)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `char_player_portrait` | char_player_portrait | Char | Identity panel | Người sống sót kiên cường mặc áo khoác sờn, khăn trùm cổ, ánh mắt sắc lạnh | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_v` | char_npc_v | NPC | Base/Quest | Chị V - Nữ chiến binh tóc ngắn, áo khoác rằn ri, dao găm đeo bên hông | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_xiaohan` | char_npc_xiaohan | NPC | Base/Quest | Tô Tiểu Hàm - Cô gái ấm áp, áo len sờn, cầm bình sữa tươi, nụ cười hiền | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_lili` | char_npc_lili | NPC | Base/Workshop | Lili - Nữ thợ cơ khí tinh nghịch, mặt lấm lem dầu mỡ, đeo kính bảo hộ trên trán | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_mumiao` | char_npc_mumiao | NPC | Base/Garden | Mục Miêu Miêu - Chuyên gia nông nghiệp đội mũ rơm, tay dính bùn đất, áo tạp dề | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_guyue` | char_npc_guyue | NPC | Island/Harbor | Cố Nguyệt - Nữ thương nhân tàu cá, đội mũ len thủy thủ, áo khoác da gió biển | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `char_npc_linhan` | char_npc_linhan | NPC | Island/Black market | Lâm Hàm - Thương nhân chợ đen đảo bí hiểm, áo trenchcoat đen, ngậm tẩu thuốc | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `char_npc_yumo` | char_npc_yumo | NPC | Coast/Mystery | Vũ Mặc - Thiếu nữ bí ẩn bờ biển, tóc dài ướt rủ, ánh mắt sâu thẳm như đại dương | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `char_npc_liuruyan` | char_npc_liuruyan | NPC | Event/Survivor | Lưu Như Yên - Người phụ nữ sống sót yếu ớt, ánh mắt van nài cần thuốc tiêm | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `char_npc_zhao` | char_npc_zhao | NPC | Military Outpost| Lão Triệu - Lão cựu binh già dặn, râu bạc lởm chởm, mắt đỏ ngầu điên dại | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_doctor_chen` | char_npc_doctor_chen | NPC | Lab/Story | Tiến Sĩ Trần - Nhà khoa học trung niên kính cận dày, áo blouse trắng rách | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_king_karen` | char_npc_king_karen | NPC | Castle/Court | Quốc vương Karen - Cựu tài phiệt bất động sản bệ vệ, mặc hoàng bào, tay cầm kiếm | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_queen` | char_npc_queen | NPC | Castle/Interior | Hoàng Hậu - Quý bà thanh lịch u buồn, đeo mặt dây chuyền hoa hướng dương | Character Portrait | 512x512 | 1:1 | PNG | Yes | P0 |
| `char_npc_banker` | char_npc_banker | NPC | Castle/Bank | Trưởng Ngân Hàng - Gã chủ ngân hàng nịnh hót xảo quyệt, com-lê cũ, tay vuốt ria | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `char_npc_leader` | char_npc_leader | NPC | Outpost/Camp | Thủ Lĩnh Trận Địa - Chỉ huy tiền đồn uy nghiêm, áo giáp chống đạn, mặt có vết sẹo | Character Portrait | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_lang_dao` | zombie_lang_dao | Enemy | Combat/Map | Zombie Lãng Du Thường - Xác sống lang thang da xám xanh, quần áo rách rưới | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_nhanh` | zombie_nhanh | Enemy | Combat/Map | Zombie Chạy Nhanh - Xác sống gầy guộc dị dạng, tứ chi dài ngoằng, miệng há toét | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_beo` | zombie_beo | Enemy | Combat/Map | Zombie Béo Phì - Khối thịt thối trương phình, bụng sắp nổ tung phun dịch độc | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_no` | zombie_no | Enemy | Combat/Map | Zombie Nổ - Toàn thân mọc các bọc mủ phát sáng cam đỏ sắp phát nổ | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_quan_canh` | zombie_quan_canh | Enemy | Police/Military | Zombie Quân Cảnh - Xác sống mặc áo giáp chống bạo động và mũ bảo hộ vỡ | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `zombie_giap_sat` | zombie_giap_sat | Enemy | Industrial/Combat| Zombie Giáp Sắt - Xác sống bị kim loại và sắt thép găm chặt vào xương thịt | Enemy Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `boss_zombie_king` | boss_zombie_king | Boss | Nest/Combat | Thi Vương Tịch Diệt - Đại quái vật zombie khổng lồ da đen tuyền, cắm đầy vũ khí | Boss Portrait/Sprite | 1024x1024 | 1:1 | PNG | Yes | P0 |
| `boss_giant_puppet` | boss_giant_puppet | Boss | Rocket Center | Cỗ Rối Khổng Lồ - Zombie cơ khí đột biến bị khung sắt cố định, mắt sáng xanh lục | Boss Portrait/Sprite | 1024x1024 | 1:1 | PNG | Yes | P0 |
| `boss_sea_monster` | boss_sea_monster | Boss | Deep Sea/Wolf | Hải Zombie Khổng Lồ - Thây cá voi thối rữa phủ vảy đen tuyền, hàng chục xúc tu | Boss Portrait/Sprite | 1024x1024 | 1:1 | PNG | Yes | P0 |
| `boss_ma_san` | boss_ma_san | Boss | Wasteland/Combat| Mã Tam - Trùm giang hồ chột mắt, áo da đinh tán, cầm AK47 bắn liên thanh | Boss Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |
| `boss_shadow` | boss_shadow | Boss | Dark Ruins | Hắc Ảnh - Sát thủ giấu mặt trong áo choàng đen rách, cầm súng côn xoay GP100 | Boss Portrait/Sprite | 512x512 | 1:1 | PNG | Yes | P1 |

---

### Nhóm D: Chiến đấu & Hiệu ứng (Combat & Visual Effects - VFX)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `combat_bg_city` | combat_bg_city | Combat | Thành phố/Đường | Khung cảnh chiến đấu ngã tư đường phố nứt toác, xác xe ô tô bốc khói | Combat Arena BG | 1920x1080 | 16:9 | WebP | No | P0 |
| `combat_bg_interior` | combat_bg_interior | Combat | Trong nhà/Hành lang| Khung cảnh chiến đấu trong phòng thí nghiệm hoặc hành lang bệnh viện âm u | Combat Arena BG | 1920x1080 | 16:9 | WebP | No | P1 |
| `combat_bg_nest` | combat_bg_nest | Combat | Tổ Zombie | Hang ổ tối tăm ánh sáng xanh lân tinh ma quái cho trận đánh Thi Vương | Combat Arena BG | 1920x1080 | 16:9 | WebP | No | P0 |
| `combat_bg_sea` | combat_bg_sea | Combat | Biển sâu | Mặt biển cuộn sóng dữ dội lúc nửa đêm dưới mưa bão cho trận Hải Zombie | Combat Arena BG | 1920x1080 | 16:9 | WebP | No | P1 |
| `vfx_hit_slash` | vfx_hit_slash | VFX | Combat | Vết chém sắc bén màu trắng bạc xé toạc không khí | Action FX Overlay | 512x512 | 1:1 | PNG | Yes | P1 |
| `vfx_hit_bullet` | vfx_hit_bullet | VFX | Combat | Tia lửa đạn nổ lóe sáng và khói súng khi đạn trúng đích | Action FX Overlay | 512x512 | 1:1 | PNG | Yes | P1 |
| `vfx_blood_splatter` | vfx_blood_splatter | VFX | Combat | Vết máu đỏ tươi bắn tung tóe lên màn hình khi người chơi trúng đòn | Screen Overlay | 1024x1024 | 1:1 | PNG | Yes | P1 |
| `vfx_critical_hit` | vfx_critical_hit | VFX | Combat | Luồng ánh sáng vàng bùng nổ mạnh mẽ kèm tia chớp khi bạo kích | Action FX Overlay | 512x512 | 1:1 | PNG | Yes | P1 |
| `vfx_heal_glow` | vfx_heal_glow | VFX | Combat | Vòng hào quang xanh lục dịu mát hồi phục sinh lực | Action FX Overlay | 512x512 | 1:1 | PNG | Yes | P2 |
| `vfx_victory_banner` | vfx_victory_banner | VFX | Combat Win | Biểu ngữ chiến thắng rực lửa phong cách sinh tồn hoang tàn | UI Victory Banner | 1024x256 | 4:1 | PNG | Yes | P1 |
| `vfx_defeat_banner` | vfx_defeat_banner | VFX | Combat Defeat | Dòng chữ đẫm máu "BẠN ĐÃ TỬ NẠN" rỉ sét u ám trên nền đen | UI Defeat Banner | 1024x256 | 4:1 | PNG | Yes | P1 |

---

### Nhóm E: Vật phẩm & Trang bị (Items & Equipment)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `item_knife_dagger` | item_knife_dagger | Weapon | Inventory | Dao găm quân dụng lưỡi thép đen có răng cưa | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_weapon_bat` | item_weapon_bat | Weapon | Inventory | Gậy bóng chày bọc dây thép gai đẫm máu | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_weapon_samurai` | item_weapon_samurai | Weapon | Inventory | Đao Katana Samurai lưỡi bén sáng loáng | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_gun_pistol_p226`| item_gun_pistol_p226| Weapon | Inventory | Súng ngắn SIG Sauer P226 kim loại đen | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_gun_smg_uzi` | item_gun_smg_uzi | Weapon | Inventory | Súng tiểu liên UZI báng gập nhỏ gọn | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_gun_rifle_m4a1` | item_gun_rifle_m4a1 | Weapon | Inventory | Súng trường tấn công M4A1 gắn kính ngắm holo | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_gun_rifle_ak47` | item_gun_rifle_ak47 | Weapon | Inventory | Súng trường AK-47 báng gỗ huyền thoại | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_gun_sniper_m700`| item_gun_sniper_m700| Weapon | Inventory | Súng bắn tỉa M700 thân polymer đen gắn ống ngắm lớn | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_ammo_box_9mm` | item_ammo_box_9mm | Ammo | Inventory | Hộp đạn quân sự xanh lá in nhãn vàng "9×19mm" | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_ammo_box_rifle` | item_ammo_box_rifle | Ammo | Inventory | Hộp đạn kim loại nặng in nhãn "5.56×45mm NATO" | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_med_firstaid` | item_med_firstaid | Medicine | Inventory | Gói cấp cứu y tế vải bạt đỏ in chữ thập trắng | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `item_med_serum` | item_med_serum | Medicine | Inventory | Ống nghiệm thủy tinh chứa huyết thanh phát sáng huỳnh quang xanh lam | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `item_med_universal` | item_med_universal | Medicine | Inventory | Ống tiêm tự động đa năng công nghệ cao chứa chất lỏng vàng kim | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_food_biscuit` | item_food_biscuit | Food | Inventory | Khối lương khô nén quân đội bọc giấy bạc rách góc | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_food_gouqi` | item_food_gouqi | Food/Crop | Inventory | Chùm quả kỷ tử mọng đỏ tươi rói hái từ vườn thí nghiệm | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_drink_water` | item_drink_water | Drink | Inventory | Chai nước khoáng nhựa cũ còn nửa bình nước trong | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_drink_beer` | item_drink_beer | Drink | Inventory | Chai bia thủy tinh nâu Bia Trăm Vị nắp thiếc | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P1 |
| `item_special_pass` | item_special_pass | Key Item | Inventory | Thẻ thông hành lâu đài bằng đồng thau mạ vàng có con dấu sáp | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P0 |
| `item_badge_silence` | item_badge_silence | Key Item | Inventory | Huy chương Tịch Diệt bằng kim loại đen cổ ngữ phát ánh sáng tím | Tactical Item Icon | 256x256 | 1:1 | PNG | Yes | P0 |

---

### Nhóm F: Cốt truyện, Sự kiện & Kết thúc (Story & Ending CG)

| ID | Asset Name | Category | Screen/Scene | Description | Style | Source Size | Aspect Ratio | Format | Transparent | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| `story_cg_intro` | story_cg_intro | Story | Game Start | Người sống sót co ro trong căn lều rách nát, nhìn ra màn đêm tiếng zombie gầm rú | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P1 |
| `story_cg_nurse` | story_cg_nurse | Story | Hospital Event | Nữ y tá zombie Lộ Lộ Vy nép mình trong góc tối nhìn chằm chằm mẩu bánh quy | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P2 |
| `story_cg_rocket_launch`| story_cg_rocket_launch| Ending | Ending 1 | Tên lửa ngân hà khai hỏa bốc khói trắng xóa bay vào không gian thoát khỏi Trái Đất | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P0 |
| `story_cg_mermaid` | story_cg_mermaid | Ending | Ending 13 | Người cá xinh đẹp vươn lên từ mặt biển lấp lánh ánh trăng sau khi hạ Hải Zombie | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P1 |
| `story_cg_king_vassal` | story_cg_king_vassal | Ending | Ending Karen | Người chơi quỳ gối tuyên thệ trước ngai vàng quốc vương Karen trong lâu đài | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P2 |
| `story_cg_infection_death`| story_cg_infection_death| Ending | Bad Ending | Cánh tay biến dị đen ngòm ngã quỵ trên đất hoang khi virus hoàn toàn xâm chiếm | Cinematic Story Art | 1920x1080 | 16:9 | WebP | No | P2 |

---

## BẢNG 3: PLACEHOLDER ĐANG TỒN TẠI TRONG CODEBASE (EXISTING PLACEHOLDERS)

| File | Dòng code | Thành phần (Component) | Loại Placeholder | Nội dung hiện tại trong code | Asset thật sự cần thay | Vấn đề phát sinh (Issue) |
|---|---:|---|---|---|---|---|
| `js/pixi-renderer.js` | 142-153 | `_drawBackground` | Solid Color Graphics | `rect.beginFill(0x1a1a2e)` + viền hồng `0xe94560` | Background bản đồ theo `state.location` (`map_*_bg.webp`) | Canvas chỉ là một khối hộp màu phẳng vô hồn, không có cảnh quan thế giới |
| `js/pixi-renderer.js` | 159-209 | `_drawWorldInfo` | PIXI.Text & Graphics Bar | `new PIXI.Text(state.location)` + thanh máu vẽ bằng Graphics | UI HUD Canvas tinh chỉnh, Font bitmap hoặc icon chỉ số | Tạo mới Text liên tục gây rò rỉ Canvas Context 2D |
| `js/pixi-renderer.js` | 211-236 | `_drawEntities` | PIXI.Text String | `new PIXI.Text("${ent.name} (tham thiet ${affinity})")` | Sprite chân dung NPC (`char_npc_*.png`) | Không có hình ảnh nhân vật; hiển thị dạng danh sách text thô sơ |
| `js/ui.js` | 134-180 | `renderStats` | Unicode Emojis | `❤ Máu`, `🧠 Tinh thần`, `🦠 Nhiễm`, `🍖 Đói`, `💧 Khát` | Icon chỉ số chuyên dụng (`ui_icon_*.png`) | Emoji hiển thị khác nhau giữa Windows, Android, iOS; thiếu thẩm mỹ game |
| `js/ui.js` | 185-195 | `renderStats` (Tiền) | Unicode Emojis | `🚬 Thuốc lá`, `👑 Tiền hoàng gia`, `⛽ Xăng` | Icon tài nguyên kim loại (`ui_icon_res_*.png`) | Thiếu đồng bộ kích thước icon và phong cách mỹ thuật phế thổ |
| `js/ui.js` | 200-245 | `renderWeapons` | Unicode Emojis | `⚔️ Cận chiến`, `🔫 Tầm xa`, `🏹 Cung nỏ` | Thumbnail hình ảnh vũ khí thật (`item_*.png`) | Người chơi chỉ thấy tên chữ, không nhìn thấy độ ngầu của vũ khí |
| `js/ui.js` | 250-320 | `renderInventory` | Text List + Emoji | Danh sách text thuần túy: `[Bánh quy khô] x3` | Lưới ô đồ có hình ảnh item và khung phẩm cấp (Rarity frame) | Túi đồ dạng văn bản đơn điệu, không tạo cảm giác thu thập chiến lợi phẩm |
| `css/style.css` | 66 | `body` | CSS Background URL | `url('../public/image/hinh_nen.webp')` | Hình nền động co giãn đa nền tảng | Toàn bộ 23 bản đồ game đều dùng chung 1 ảnh nền tĩnh duy nhất |

---

## BẢNG 4: DANH MỤC ASSET HIỆN CÓ (EXISTING ASSETS AUDIT)

| Đường dẫn Asset | Định dạng | Kích thước thực tế | Thành phần sử dụng | Hiện trạng | Khả năng tái sử dụng |
|---|---|---|---|---|---|
| `public/icon/icon.png` | PNG | 400x400 (1:1) | Favicon trong `index.html` | Hoạt động tốt | Có thể dùng làm App Icon, Touch Icon cho PWA / Mobile |
| `public/image/hinh_nen.webp` | WebP (VP8X) | 2732x1534 (~16:9) | `body` background trong `css/style.css` | Độ phân giải cao, hiển thị tốt | Dùng làm hình nền Title Screen hoặc khu phế tích ngoại ô |
| `public/assets/pixi/.gitkeep` | Khác | 0 byte | Thư mục asset PixiJS | Rỗng | Cần nạp toàn bộ cấu trúc thư mục mới theo Implementation Map |
| `public/music/backmusic.mp3` | MP3 Audio | 3.2 MB | BGM trong `js/ui.js` | Hoạt động tốt | Tiếp tục sử dụng làm nhạc nền |

---

## BẢNG 5: VỊ TRÍ CẦN THAY THẾ TRONG SOURCE CODE (REPLACEMENT TARGETS)

| File | Dòng code | Nội dung hiện tại | Asset thay thế đề xuất | Lý do & Mục đích |
|---|---:|---|---|---|
| `js/pixi-renderer.js` | 143 | `rect.beginFill(COLORS.bg)` | `PIXI.Sprite.from(mapTexture)` | Hiển thị bối cảnh địa danh thực tế thay vì hình chữ nhật xanh tím phẳng |
| `js/pixi-renderer.js` | 228 | `new PIXI.Text(...)` cho NPC | `new PIXI.Sprite(npcAvatarTexture)` | Hiển thị chân dung nhân vật NPC trực quan trên sân khấu PixiJS |
| `js/ui.js` | 140 | `<span class="stat-icon">❤</span>` | `<img class="stat-icon-img" src="assets/ui_icon_hp.png">` | Thống nhất UI chuyên nghiệp, loại bỏ sự phụ thuộc font emoji hệ điều hành |
| `js/ui.js` | 189 | `<span class="stat-label">👑 Tiền hoàng gia</span>`| `<img class="coin-icon" src="assets/ui_icon_res_royal_coin.png">` | Tạo cảm giác sang trọng của tiền tệ hoàng gia lâu đài |
| `js/ui.js` | 215 | `[Cận chiến] ${weapon.name}` | Hiển thị kèm `<img class="slot-thumb" src="assets/weapons/${weapon.id}.png">` | Tăng tính nhập vai khi người chơi trang bị vũ khí cận chiến |
| `js/ui.js` | 230 | `[Tầm xa] ${ranged.name}` | Hiển thị kèm `<img class="slot-thumb" src="assets/weapons/${ranged.id}.png">` | Trực quan hóa súng đạn và phụ kiện |

---

## BẢNG 6: QUY CHUẨN RESPONSIVE CHO TỪNG LOẠI ASSET (RESPONSIVE SPECIFICATION)

| Nhóm Asset | Desktop (1920x1080 / 1366x768) | Tablet (1024x768 / 768x1024) | Mobile (390x844 / 360x800) | Chiến lược Co giãn (Scaling Strategy) | Chiến lược Cắt xén (Crop Strategy) |
|---|---|---|---|---|---|
| **Background Bản đồ (Map BG)** | Render 100% Canvas (1920x1080 gốc) | Scale 50% - 66% giữ nguyên 16:9 | Scale 35% - 45% hoặc Fit Width | `object-fit: cover` trên Pixi Sprite | Giữ Safe Area ở trung tâm 70%, crop đều 2 mép biên |
| **Chân dung Nhân vật / NPC** | Render 128x128 hoặc 160x160 | Render 96x96 | Render 64x64 hoặc 80x80 | Uniform Scale giữ nguyên 1:1 | Không crop; neo chân dung ở đáy (Bottom-center anchor) |
| **Icon Chỉ số & Tài nguyên** | Render 24x24 hoặc 28x28 | Render 22x22 | Render 20x20 | CSS Pixel Snap / Crisp edges | Không crop; Icon thiết kế tràn viền an toàn 10% lề trong |
| **Icon Trang bị & Vật phẩm** | Render 48x48 hoặc 64x64 | Render 40x40 | Render 36x36 | Uniform Fit trong khung lưới ô đồ | Không crop; vũ khí đặt chéo góc 45 độ vừa khít khung vuông |
| **Combat VFX Overlays** | Render toàn màn hình đấu trường | Render theo kích thước canvas | Render theo tỷ lệ khung chiến đấu | Stretch to Arena Bounds / BlendMode Additive | Neo giữa tâm màn hình (Center origin 0.5, 0.5) |
| **Story CG & Ending Art** | Render 1920x1080 (16:9) | Render theo khung thoại | Render letterbox (Fit kèm dải đen trên/dưới) | Aspect Ratio Preserved (Fit Contain) | Tuyệt đối không crop để giữ nguyên bố cục tác phẩm mỹ thuật |

