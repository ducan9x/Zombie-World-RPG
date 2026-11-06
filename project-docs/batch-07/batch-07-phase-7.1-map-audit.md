# BÁO CÁO TOÀN DIỆN: BATCH 07 – PHASE 7.1
## MAP AUDIT & TILESET ARCHITECTURE SPECIFICATION
**Dự án:** Zombie World RPG  
**Giai đoạn:** Phase 7.1 – Khảo sát hệ thống bản đồ & Thiết kế kiến trúc Tileset  
**Ngày thực hiện:** 06/11/2026  
**Mục tiêu:** Audit toàn diện hiện trạng mã nguồn bản đồ, phân tích cấu trúc dữ liệu, xác định danh mục tài nguyên đồ họa (tileset), và xây dựng kiến trúc tích hợp an toàn tuyệt đối cho Phase 7.2 mà không làm thay đổi gameplay, logic điều hướng hay dữ liệu lưu trữ.  

---

## 1. Hiện trạng kiến trúc bản đồ (Current Map Architecture)

### 1.1. Bản chất kiến trúc hiện tại: Hệ thống Node trừu tượng (Abstract Node Graph)
Hiện tại, **Zombie World RPG** là một tựa game sinh tồn hậu tận thế trên nền web/offline kết hợp giao diện văn bản (Text-based RPG) và đồ họa tăng cường (PixiJS Stage 1).

Sau khi rà soát toàn bộ source code, kết quả audit xác nhận:
- **Game KHÔNG sử dụng hệ thống lưới tọa độ (Tile Grid) hay bản đồ 2D dạng ma trận vật lý.**
- Toàn bộ thế giới game hiện được mô hình hóa theo dạng **đồ thị các điểm đến (Node-based Map Graph)**:
  - Mỗi địa điểm là một thực thể độc lập có ID riêng, mức độ nguy hiểm, bảng tỷ lệ nhặt đồ (`lootTable`), tỷ lệ chạm trán zombie (`encounterRate`), và các hành động đặc thù (`MAP_ACTIONS`).
  - Việc di chuyển giữa các địa điểm hoạt động theo cơ chế **dịch chuyển tức thời dựa trên lựa chọn (Menu-driven Fast Travel)**: Người chơi chọn điểm đến từ danh sách menu, hệ thống cập nhật `state.currentMap`, thay đổi chuỗi `state.location`, ghi nhận `state.stats.mapsExplored`, và tiêu tốn 1 đơn vị thời gian (`advanceTime(1)`).
  - Không có khoảng cách vật lý (distance), không có chi phí xăng dầu theo dặm đường (ngoại trừ nợ đảo hoặc giao dịch), và không có va chạm vật lý (collision detection).

### 1.2. Các module mã nguồn liên quan đến bản đồ (Relevant Source Files)

| File | Vai trò kiến trúc | Chi tiết xử lý |
|---|---|---|
| `js/data/maps/maps.js` | Định nghĩa dữ liệu gốc | Khai báo hằng số `MAPS` gồm 23 địa điểm ngoài căn cứ |
| `js/data/maps/map-actions.js` | Định nghĩa hành động | Khai báo `MAP_ACTIONS` gồm các tương tác đặc thù tại từng địa điểm |
| `js/data/maps/map-descriptions.js` | Nội dung mô tả bối cảnh | Khai báo `MAP_DESCRIPTIONS` chứa 23 đoạn văn mô tả không gian u ám, sinh tồn |
| `js/data/maps/index.js` | Cổng xuất dữ liệu | Re-export `MAPS`, `MAP_ACTIONS`, `MAP_DESCRIPTIONS` |
| `js/game/navigation.js` | Điều hướng di chuyển | Chứa `handleGoOut()`, `handleGoHome()`, `handleMapAction(input)` |
| `js/game/exploration.js` | Khám phá & Chạm trán | Chứa `handleExplore()`, `handleExploreAction(input)`, vòng lặp nhặt đồ & quái vật |
| `js/routing.js` | Định tuyến giao diện | `showExploreOptionsState()` hiển thị các nút thao tác tương ứng với địa điểm hiện tại |
| `js/maps.js` | Cổng xuất map-events | Re-export toàn bộ 21 handler sự kiện tương tác từ thư mục `js/map-events/` |
| `js/map-events/*.js` | Logic sự kiện địa điểm | 21 file xử lý sự kiện chi tiết: tháp canh, trạm xăng, đường hầm, bệnh viện, v.v. |
| `js/pixi-renderer.js` | Bộ kết xuất đồ họa Canvas | Quản lý canvas PixiJS v7 tại `#pixi-viewport` (hiện hiển thị text vị trí, ngày, HP bar) |
| `js/state.js` | Quản lý trạng thái | Lưu trữ `location`, `currentMap`, `currentSubMap`, `stats.mapsExplored` |
| `js/save.js` | Lưu trữ dữ liệu | Tuần tự hóa `gameState` vào `localStorage` |

### 1.3. Vùng chứa HTML & Kết xuất giao diện (DOM & Rendering Containers)
Cấu trúc bố cục giao diện 4 vùng trong `index.html`:
- **`#zone-1` (Cột trái):** Panel thông tin nhân vật, chỉ số sinh tồn (HP, Sanity, Đói, Khát, Nhiễm độc) và kho tài nguyên.
- **`#zone-2` (Cột giữa-trái):** Panel trang bị vũ khí và kho đồ dạng lưới thẻ bài (Inventory UI Upgrade Batch 06).
- **`#zone-3` (Cột giữa-phải - Vùng hiển thị trung tâm):**
  - `<div id="pixi-viewport"></div>`: Chứa thẻ `<canvas id="pixi-canvas">` độ phân giải ảo 640×320 do `PixiRenderer` điều khiển.
  - `<div id="story-area" class="panel"></div>`: Khung nhật ký văn bản cuộn hiển thị mô tả cảnh quan và kết quả hành động.
- **`#zone-4` (Cột phải):**
  - `<div id="options-area"></div>`: Danh sách các nút bấm thao tác (Grid 2 cột hoặc phân trang).

### 1.4. Tài nguyên hình ảnh bản đồ hiện có (Existing Map Assets)
Hiện tại dự án đã sở hữu sẵn **23 hình nền phong cảnh độ phân giải cao (1920×1080 WebP)** trong thư mục `public/assets/backgrounds/`:
- `map_lau_dai_tan_the_bg.webp`
- `map_tran_dia_binh_minh_bg.webp`
- `map_thap_canh_bo_roi_bg.webp`
- `map_nha_kho_nong_thon_bg.webp`
- `map_lang_nong_trai_nui_bg.webp`
- `map_cam_trai_ben_song_bg.webp`
- `map_khu_dich_vu_cao_toc_bg.webp`
- `map_thanh_pho_dai_hoc_bg.webp`
- `map_tram_xang_bo_roi_bg.webp`
- `map_trung_tam_thuong_mai_bg.webp`
- `map_khu_dan_cu_cu_bg.webp`
- `map_khu_cong_nghiep_bg.webp`
- `map_cang_ben_song_bg.webp`
- `map_sieu_thi_kho_bg.webp`
- `map_nha_kho_nha_may_bg.webp`
- `map_benh_vien_ngoai_thanh_bg.webp`
- `map_canh_sat_bo_roi_bg.webp`
- `map_tram_kiem_tra_quan_du_bg.webp`
- `map_ham_tau_dien_ngam_bg.webp`
- `map_vien_sinh_hoc_bg.webp`
- `map_to_zombie_bg.webp`
- `map_co_so_vu_tru_tuyet_mat_bg.webp`
- `map_dao_nho_bg.webp`
- Thêm 4 hình nền đấu trường chiến đấu (`combat_bg_*.webp`) và 1 hình nền menu (`ui_main_menu_bg.webp`).

*Ghi chú quan trọng:* Các hình nền trên là ảnh tĩnh toàn cảnh (panoramic concept art), **chưa có hệ thống tile đồ họa (tileset)** để thể hiện bản đồ địa hình tổng thể dạng sa bàn/chiến lược.

---

## 2. Phân tích dữ liệu bản đồ hiện hữu (Map Data Analysis)

### 2.1. Thống kê toàn bộ địa điểm trong game (24 địa điểm)

Game có tổng cộng **24 địa điểm** (1 Căn cứ chính + 2 Căn cứ liên minh an toàn + 1 Lãnh địa hải ngoại bí mật + 20 Khu vực phế thổ nguy hiểm):

```
                                [Lãnh địa Hải ngoại]
                                      Đảo Nhỏ
                                         ▲
                                   (Du thuyền)
                                         │
[Thành trì Gothic]               [Bến cảng & Sông]                  [Đường cao tốc & Đô thị]
 Lâu đài Tận thế                  Cảng Bên Sông                      Khu Dịch Vụ Cao Tốc
        ▲                                │                                    │
   (Cổng thành)                  Khu Cắm Trại Bên Sông               Thành Phố Đại Học
        │                                │                                    │
 [Trận địa Liên minh]             [Khu vực Núi & Rừng]               Trạm Xăng Ngoại Thành
Trận địa Đợi Sáng               Tháp Canh Đỉnh Núi                            │
        │                       Nhà Kho Nông Thôn                   Trung Tâm Thương Mại
 [Căn cứ Khởi đầu]               Làng Nông Trại Núi                   Khu Dân Cư Cũ
Lều Người Sống Sót ═════════════════════════════════════════════════ Khu Công Nghiệp
        │                                                                     │
        ▼                                                              Siêu Thị Kho
[Cơ sở Đặc biệt & Nguy hiểm cao]                                       Nhà Kho Nhà Máy
 Bệnh Viện Ngoại Thành                                                        │
 Cảnh Sát Local                                                        [Tử địa / Tuyệt cảnh]
 Trạm Kiểm Tra Quân Sự                                                 Đường Hầm Địa Ngục
                                                                       Viện Nghiên Cứu Sinh Học
                                                                       Tổ Zombie
                                                                       Cơ Sở Vũ Trụ Tuyệt Mật
```

### 2.2. Bảng thông số chi tiết 24 địa điểm

| # | Map ID | Tên địa điểm | Mức độ nguy hiểm | Tỷ lệ quái (`encounterRate`) | Nhóm môi trường (Biome) | Đặc trưng bối cảnh |
|---|---|---|---|---|---|---|
| 0 | `home` | **Lều Người Sống Sót** | ☆ An toàn tuyệt đối | 0.00 | Nơi trú ẩn | Căn lều dã chiến, cải tạo căn cứ, trồng trọt |
| 1 | `lau_dai_tan_the` | **Lâu đài Tận thế** | ☆ An toàn | 0.00 | Thành trì Gothic | Cửa khẩu, trạm tiền đồn, nội thất quý tộc |
| 2 | `tran_dia_binh_minh` | **Trận địa Đợi Sáng** | ☆ An toàn | 0.00 | Doanh trại quân sự | Căn cứ tiền tuyến, luyện tập, trao đổi vật tư |
| 3 | `thap_canh_bo_roi` | **Tháp Canh Đỉnh Núi Hoang Vắng** | ★ Nhẹ nhàng | 0.01 | Núi đồi đá dốc | Tháp thép rỉ sét, nghĩa trang bia mộ cổ |
| 4 | `nha_kho_nong_thon` | **Nhà Kho Nông Thôn Hoang Hoắc** | ★ Nhẹ nhàng | 0.02 | Nông thôn ngoại vi | Kho rơm rạ mục nát, vườn cây ăn quả sót lại |
| 5 | `lang_nong_trai_nui` | **Làng Nông Trại Núi** | ★ Nhẹ nhàng | 0.03 | Làng ven sườn núi | Nhà nông đổ nát, ruộng hoang, hang động ngầm |
| 6 | `cam_trai_ben_song` | **Khu Cắm Trại Bên Sông** | ★★ Nguy hiểm thấp | 0.05 | Ven sông / Đầm lầy | Bãi lều rách, tro tàn lửa trại, thi thể dạt vào |
| 7 | `khu_dich_vu_cao_toc` | **Khu Dịch Vụ Cao Tốc Quốc Lộ** | ★★ Nguy hiểm thấp | 0.10 | Đường cao tốc | Trạm dừng chân, quán ăn tăm tối, Mã Tam |
| 8 | `thanh_pho_dai_hoc` | **Thành Phố Đại Học** | ★★ Nguy hiểm thấp | 0.12 | Đô thị học thuật | Giảng đường, ký túc xá, tủ locker, lớp học cũ |
| 9 | `tram_xang_bo_roi` | **Trạm Xăng Ngoại Thành** | ★★ Nguy hiểm thấp | 0.15 | Giao lộ ngoại ô | Trụ bơm xăng vỡ, xưởng sửa xe, thợ Vương |
| 10 | `trung_tam_thuong_mai` | **Trung Tâm Thương Mại** | ★★★ Trung bình | 0.20 | Đô thị sầm uất cũ | Gian hàng kính vỡ, thang cuốn gãy, bể kính rò điện |
| 11 | `khu_dan_cu_cu` | **Khu Dân Cư Cũ** | ★★★ Trung bình | 0.22 | Nhà ở cao tầng | Chung cư hoang tàn, kho vật tư Lão Lang |
| 12 | `khu_cong_nghiep` | **Khu Công Nghiệp / Nhà Xưởng** | ★★★ Trung bình | 0.24 | Công nghiệp nặng | Lò luyện kim, khung dầm thép, máy móc gỉ |
| 13 | `cang_ben_song` | **Cảng Bên Sông** | ★★★ Trung bình | 0.26 | Bến cảng sông lớn | Container xếp chồng, cẩu tháp, du thuyền sang |
| 14 | `sieu_thi_kho` | **Siêu Thị Kho Tối Đại Liên Khu** | ★★★ Trung bình | 0.28 | Trung tâm phân phối | Kệ pallet khổng lồ, góc tối, kẻ đeo mặt nạ |
| 15 | `nha_kho_nha_may` | **Nhà Kho Nhà Máy Hoang Hoắc** | ★★★ Trung bình | 0.30 | Hậu cần công nghiệp | Thùng gỗ xếp đống, trạm gác của Lão Mã |
| 16 | `benh_vien_ngoai_thanh` | **Bệnh Viện Ngoại Thành** | ★★★★ Nguy hiểm cao | 0.35 | Y tế đổ nát | Mùi thuốc khử trùng, cáng cứu thương, Y tá Lộ Lộ Vy |
| 17 | `canh_sat_bo_roi` | **Cảnh Sát Local Hoang Hoắc** | ★★★★ Nguy hiểm cao | 0.40 | Trụ sở an ninh | Phòng giam, rào chắn thép, phòng lưu trữ tang vật |
| 18 | `tram_kiem_tra_quan_du` | **Trạm Kiểm Tra Quân Sự** | ★★★★ Nguy hiểm cao | 0.45 | Phòng tuyến quân sự | Lưới thép gai bùng nhùng, chòi gác, cựu binh Triệu |
| 19 | `ham_tau_dien_ngam` | **Đường Hầm Địa Ngục** | ★★★★★ Tuyệt cảnh | 0.55 | Hạ tầng ngầm | Đường ray xe điện tối tăm, toa tàu trật bánh |
| 20 | `vien_sinh_hoc` | **Viện Nghiên Cứu Sinh Học** | ★★★★★ Tuyệt cảnh | 0.58 | Phòng thí nghiệm | Đèn nhấp nháy, buồng ấp mẫu vật, giếng năng lượng |
| 21 | `to_zombie` | **Đám Cú Zombie (Tổ Zombie)** | ★★★★★★ Luyện ngục | 0.60 | Vùng đột biến sinh học | Màng nhầy máu khô, xương vụn, Thi Vương Tịch Diệt |
| 22 | `co_so_vu_tru_tuyet_mat` | **Cơ Sở Vũ Trụ Tuyệt Mật** | ★★★★★★ Luyện ngục | 0.65 | Công nghệ tối cao | Tháp phóng tên lửa, radar mái vòm, silo hạt nhân |
| 23 | `dao_nho` | **Đảo Nhỏ (Đảo Công tước)** | ★ Nhẹ nhàng (Ẩn) | 0.00 | Quần đảo ven biển | Phố ngầm, quán bar lãng mạn, ngân hàng đảo |

### 2.3. Quy tắc di chuyển và khám phá (Travel & Exploration Rules)
1. **Lựa chọn lộ trình:** Người chơi từ Lều Người Sống Sót bấm "Ra ngoài" (`handleGoOut`) -> Hệ thống liệt kê toàn bộ các địa điểm không bị ẩn (`!map.hidden`).
2. **Chi phí thời gian:** Mỗi lượt di chuyển tới địa điểm hoặc quay về nhà tiêu tốn 1 giờ (`advanceTime(1)`), kích hoạt tính toán trạng thái (đói, khát, mệt mỏi, độc tố).
3. **Giới hạn tâm trí (Sanity Check):** Khi `state.sanity <= 0`, nhân vật bị ảo giác nghiêm trọng, mất phương hướng và **không thể bấm "Về nhà"** cho đến khi uống thuốc an thần.
4. **Vòng lặp khám phá:** Tại bất kỳ địa điểm nào, hành động "Khám phá" (`handleExplore`) sẽ kích hoạt tỷ lệ cướp bóc (`checkRobberEncounter`), tỷ lệ gặp NPC sống sót/thương nhân lang thang, và tỷ lệ chạm trán zombie theo đúng chỉ số `encounterRate` của địa điểm đó.
5. **Đảo Nhỏ (`dao_nho`):** Là địa điểm ẩn (`hidden: true`), không xuất hiện trong menu chọn bản đồ thông thường; chỉ có thể tiếp cận bằng cách di chuyển đến `cang_ben_song` (Cảng bên sông) rồi tương tác với "Du thuyền của lâu đài".

---

## 3. Yêu cầu danh mục tài nguyên đồ họa (Tileset Requirements)

Dựa trên 24 địa điểm và 6 nhóm sinh cảnh (Biomes) đã khảo sát, hệ thống tileset cần bao quát đầy đủ các thành phần thị giác đặc trưng của thế giới hậu tận thế:

### 3.1. Địa hình nền (Terrain Tiles)
- **Đất cát khô cằn (Barren Dirt / Dust):** Màu nâu đất xỉn, nứt nẻ, thể hiện đất đai khô cháy vì hạn hán hoặc vũ khí sinh hóa.
- **Cỏ úa sinh tồn (Dead Dry Grass):** Màu xanh vàng ngả nâu xỉn (olive-drab / yellowed turf), thưa thớt, không dùng màu xanh tươi mát hoạt họa.
- **Mặt đường bê tông / Nhựa đường (Asphalt / Concrete):** Màu xám tro sẫm, vạch kẻ đường mờ nhạt, nứt toác với cỏ dại mọc xen qua khe nứt.
- **Mặt nước đục ngầu (Murky Toxic Water):** Dòng sông ô nhiễm xám xanh hoặc xanh rêu sẫm, bờ sông lở loét, bãi bồi ven sông cho khu vực Cảng và Bãi cắm trại.
- **Địa hình đá núi (Rocky Mountain Terrain):** Đá xám hoa cương lởm chởm, vách núi dốc đứng cho Tháp Canh và Làng Núi.
- **Màng nhầy sinh học (Bio-Blight / Infested Flesh Terrain):** Mặt đất phủ màng đỏ thẫm xơ cứng, dịch nhầy độc hại cho khu vực Tổ Zombie và Viện Sinh Học.

### 3.2. Đường sá & Mạng lưới giao thông (Roads & Transit)
- **Đường nhựa 2 làn (2-Lane Asphalt Highway):** Đoạn thẳng ngang, đoạn thẳng dọc, khúc cua 90°, ngã ba (T-junction), ngã tư (crossroad).
- **Mép đường & Vỉa hè vỡ (Broken Sidewalks & Curbs):** Gờ đá vỉa hè nứt gãy chuyển tiếp giữa mặt đường và đất cát.
- **Đường đất nông thôn (Dirt Roads & Trails):** Đường mòn sỏi đá dẫn vào nhà kho nông thôn và làng núi.
- **Đường ray xe lửa / Tàu điện (Railway Tracks):** Thanh ray gỉ sét và tà vẹt gỗ/bê tông mục dẫn vào Nhà Xưởng và Đường Hầm ngầm.

### 3.3. Công trình & Kiến trúc (Structures & Architecture)
- **Căn cứ & Phòng tuyến:** Tường thành đá Gothic kiên cố (Lâu đài), hàng rào bao cát quân sự & tháp canh dã chiến (Trận địa Đợi Sáng), chòi kiểm soát biên giới (Trạm Quân Sự).
- **Công trình công cộng & Đô thị:** Mặt tiền trường đại học, bệnh viện ngoại thành với biểu tượng chữ thập đỏ vỡ, trụ sở cảnh sát cửa sắt bảo mật, trung tâm thương mại mái kính nứt.
- **Cơ sở hạ tầng dịch vụ:** Trạm xăng với mái che tôn rỉ và trụ bơm xăng vỡ, trạm dừng chân cao tốc.
- **Cơ sở công nghiệp & Kho bãi:** Nhà xưởng dầm thép tiền chế, tháp làm mát, nhà kho mái vòm, container vận tải biển xếp lớp.
- **Khu dân cư:** Nhà ở 2-3 tầng ngoại ô loang lổ, cửa sổ bị ván gỗ đóng kín.
- **Công trình khoa học tối mật:** Bệ phóng tên lửa khổng lồ, tháp anten radar mái vòm, cửa hầm boong-ke hạt nhân dày đặc chốt khóa.

### 3.4. Đạo cụ môi trường & Chi tiết tàn tích (Props, Debris & Atmosphere)
- **Xác phương tiện giao thông (Wrecked Vehicles):** Xe con gỉ sét lật nghiêng, xe bus cháy rụi trơ khung, xe bán tải cảnh sát móp méo, du thuyền màu trắng ngà neo đậu ven bờ.
- **Rào chắn & Phòng vệ:** Hàng rào thép gai cuộn bùng nhùng (razor wire), rào chắn bê tông phân làn giao thông (Jersey barriers), cọc tiêu phản quang vỡ.
- **Thực vật cằn cỗi:** Cây khô cụt ngọn trơ cành, bụi gai khô, gốc cây mục nát.
- **Rác thải & Đạo cụ sinh thái:** Thùng phuy kim loại rỉ sét (oil drums), pallet gỗ mục, đống gạch đá vụn (rubble piles), cột điện gãy nghiêng với dây cáp lòng thòng.
- **Bia mộ & Dấu vết sinh tồn:** Nhóm bia mộ gỗ xiêu vẹo, lều bạt dã chiến rách nát, thùng hàng cứu trợ của LHQ/Quân đội.

---

## 4. Đặc tả kỹ thuật Tileset (Tileset Technical Specification)

### 4.1. Kích thước Tile chuẩn & Độ phân giải (Tile Dimensions)
- **Kích thước Tile cơ bản (Base Grid Size):** **32×32 pixels**.
  - *Luận chứng kỹ thuật:*
    - Khung nhìn ảo của `PixiRenderer` hiện tại là **640×320 pixels** (tỷ lệ 2:1 hoặc mở rộng sang 16:9).
    - Với tile kích thước 32×32 px, màn hình sẽ hiển thị chính xác một lưới **20 cột × 10 dòng** (200 tiles) trên khung nhìn toàn cảnh, hoặc một bản đồ thế giới tổng thể **40×24 tiles** (1280×768 px) với cơ chế camera trượt nhẹ (smooth pan) hoặc mini-viewport sa bàn.
    - Kích thước 32×32 px cân bằng hoàn hảo giữa: độ sắc nét của đồ họa pixel-art/retro survival, dung lượng tải xuống cực nhẹ cho môi trường web/offline (< 300KB cho toàn bộ spritesheet), và hiệu năng dựng hình 60 FPS ổn định trên thiết bị di động yếu.
- **Kích thước công trình lớn (Multi-tile Structures):**
  - Công trình nhỏ (nhà dân, chòi canh, trạm xăng nhỏ): 2×2 tiles (64×64 px) hoặc 3×2 tiles (96×64 px).
  - Công trình trung bình (bệnh viện, nhà xưởng, siêu thị): 4×3 tiles (128×96 px) hoặc 4×4 tiles (128×128 px).
  - Đại công trình (Lâu đài Tận thế, Cơ sở Vũ trụ): 6×4 tiles (192×128 px).

### 4.2. Hệ tọa độ & Định dạng dữ liệu (Coordinate System & Map Data Format)
- **Hệ tọa độ:** Tọa độ lưới số nguyên `[tileX, tileY]` với gốc tọa độ `(0, 0)` tại góc trên bên trái (Top-Left).
- **Khoảng cách tọa độ thế giới:** `worldX = tileX * 32`, `worldY = tileY * 32`.
- **Cấu trúc lưu trữ ma trận bản đồ:** Định dạng mảng 1 chiều phẳng (Flat 1D TypedArray) hoặc mảng 2 chiều JSON tiêu chuẩn:
  ```json
  {
    "width": 40,
    "height": 20,
    "tileSize": 32,
    "layers": {
      "ground": [ /* ID các tile đất, nước, cỏ */ ],
      "roads": [ /* ID các tile đường, ray tàu */ ],
      "fringe": [ /* Chi tiết cỏ dại, vết nứt, mép nước */ ],
      "structures": [ /* ID các công trình và nhà cửa */ ],
      "props": [ /* Xe cộ, rào chắn, thùng phuy */ ]
    },
    "poiNodes": [
      {
        "mapId": "tram_xang_bo_roi",
        "name": "Trạm Xăng Ngoại Thành",
        "tileX": 14,
        "tileY": 8,
        "width": 2,
        "height": 2,
        "danger": "★★Nguy hiểm thấp"
      }
    ]
  }
  ```

### 4.3. Phân tầng kết xuất (Render Layering Architecture)
Nhằm đạt hiệu năng cao và phân tách rõ ràng trách nhiệm thị giác, hệ thống kết xuất PixiJS cho Map sẽ tổ chức thành 6 Display Containers theo thứ tự từ dưới lên trên:

```
[Layer 5: UI Overlay]       --> Hover Tooltip, Nhãn tên địa điểm, Thanh điều hướng
[Layer 4: Fog / Explored]   --> Lớp sương mù mờ ảo, làm tối các vùng chưa đi tới
[Layer 3: POI & Markers]    --> Ghim vị trí POI, icon nguy hiểm, Token nhân vật
[Layer 2: Structures & Props] -> Nhà cửa, cây cối, xe cộ (Y-Sorting theo trục đứng)
[Layer 1: Road & Decals]    --> Nhựa đường, vạch kẻ, vết nứt, mép vỉa hè
[Layer 0: Terrain Ground]   --> Nền đất khô, cát xỉn, cỏ úa, nước độc
```

### 4.4. Chiến lược tối ưu hiệu năng (Performance & Memory Considerations)
- **Texture Packing (Spritesheet Atlas):** Toàn bộ tileset được đóng gói vào 1 đến 2 file texture atlas duy nhất (định dạng WebP trong suốt kèm file JSON mô tả tọa độ UV). Điều này giúp PixiJS gom toàn bộ lượt vẽ địa hình vào **duy nhất 1 Draw Call** (Texture Batching).
- **Object Pooling cho Markers:** Các ghim POI và nhãn tên chỉ khởi tạo tối đa 24 đối tượng hiển thị (tương ứng 24 địa điểm), tái sử dụng hoàn toàn, không tạo đối tượng mới trong mỗi frame render.
- **Responsive & DPR Handling:** Canvas tự động căn chỉnh theo tỷ lệ khung nhìn của trình duyệt qua CSS (`max-width: 100%; height: auto;`), giữ nguyên tỷ lệ khung hình chuẩn không gây vỡ nét hoặc méo hình.

---

## 5. Thiết kế thư mục tài nguyên Tileset (Asset Directory Design)

Đề xuất cấu trúc thư mục quy chuẩn, phù hợp với kiến trúc hiện có trong `public/assets/`:

```
public/assets/maps/
├── tiles/
│   ├── terrain/              # Tile mặt đất cơ bản (dirt, grass, asphalt, water, rock, toxic)
│   │   ├── terrain_dirt_dry_32.webp
│   │   ├── terrain_grass_dead_32.webp
│   │   ├── terrain_asphalt_cracked_32.webp
│   │   ├── terrain_water_murky_32.webp
│   │   └── terrain_rock_mountain_32.webp
│   ├── roads/                # Hệ thống đường sá, ray tàu, ngã ba, ngã tư
│   │   ├── road_asphalt_h_32.webp
│   │   ├── road_asphalt_v_32.webp
│   │   ├── road_asphalt_cross_32.webp
│   │   ├── road_asphalt_curve_32.webp
│   │   └── road_railway_tracks_32.webp
│   ├── structures/           # Công trình kiến trúc theo kích thước chuẩn
│   │   ├── bld_watchtower_mountain.webp
│   │   ├── bld_rural_barn.webp
│   │   ├── bld_gas_station.webp
│   │   ├── bld_hospital_ruined.webp
│   │   ├── bld_police_station.webp
│   │   ├── bld_supermarket_warehouse.webp
│   │   ├── bld_industrial_factory.webp
│   │   ├── bld_castle_fortress.webp
│   │   └── bld_aerospace_silo.webp
│   ├── props/                # Đạo cụ chi tiết rải trên địa hình
│   │   ├── prop_car_wreck_01.webp
│   │   ├── prop_barricade_sandbag.webp
│   │   ├── prop_fence_barbed_wire.webp
│   │   ├── prop_dead_tree.webp
│   │   └── prop_rubble_pile.webp
│   └── markers/              # Ghim vị trí, icon nguy hiểm, token người chơi
│       ├── marker_poi_active.webp
│       ├── marker_poi_unexplored.webp
│       ├── marker_danger_skull.webp
│       └── marker_player_token.webp
├── data/
│   └── world_map_layout.json # Ma trận bố trí tile và tọa độ của 24 địa điểm
└── atlases/
    ├── world_map_tileset.json # Texture Atlas metadata
    └── world_map_tileset.webp # Texture Atlas spritesheet tổng hợp
```

*Quy tắc an toàn:* Không tạo thư mục rỗng trước khi có asset. Trong Phase 7.1 giữ nguyên hiện trạng toàn bộ cây thư mục dự án.

---

## 6. Kế hoạch tích hợp kiến trúc kết xuất (Rendering Integration Architecture)

### 6.1. Nguyên tắc tối thượng: Visual Layer độc lập với Gameplay Logic
Để đảm bảo **không phá vỡ bất kỳ cơ chế gameplay nào**, kiến trúc kết xuất bản đồ đồ họa sẽ được xây dựng theo mô hình **Visual Mirroring Layer (Tầng hiển thị song hành)**:

```
┌─────────────────────────────────────────────────────────────┐
│                   GAME LOGIC & STATE ENGINE                 │
│  - MAPS, MAP_ACTIONS, MAP_DESCRIPTIONS (Chính thống)        │
│  - handleGoOut(), handleMapAction(), handleGoHome()         │
│  - advanceTime(), updateStatusEffects(), checkDeath()       │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│       TEXT / DOM LAYER       │    │     VISUAL TILESET LAYER     │
│   (Giao diện điều khiển)     │    │   (Tăng cường trải nghiệm)   │
│ - #story-area (Nhật ký)      │    │ - PixiRenderer worldLayer    │
│ - #options-area (Nút bấm)    │    │ - World Map Tileset Grid     │
│ - 100% Tương thích Save/Load │    │ - Tương tác Click trên POI   │
└──────────────────────────────┘    └─────────────┬────────────────┘
                                                  │
                                                  ▼
                                    Dispatches: handleMapAction()
```

### 6.2. Cơ chế điều khiển kép (Dual Control / Hybrid Navigation)
Khi người chơi chọn "Ra ngoài" (`phase === "map_select"`):
1. **Giao diện DOM hiện tại:** Vẫn sinh ra danh sách tùy chọn 22 địa điểm trong `#options-area` như trước đây.
2. **Giao diện PixiJS Canvas:** Render bản đồ thế giới dạng sa bàn tileset trên `#pixi-viewport`.
   - Mỗi địa điểm trong `MAPS` được gắn một điểm ghim tương tác (Interactive POI Container).
   - Khi người chơi rê chuột (hover) vào POI trên bản đồ: Hiển thị tooltip mô tả tên, cấp nguy hiểm và trạng thái đã khám phá hay chưa.
   - Khi người chơi nhấp chuột (click/touch) vào POI trên canvas: Bộ kích hoạt sẽ gọi chính xác `handleMapAction(optionIndex)` tương ứng, kích hoạt toàn bộ chu trình gameplay gốc mà không cần chỉnh sửa một dòng logic nào của hệ thống event hay combat.
3. Người chơi hoàn toàn có thể chọn bấm nút trên `#options-area` hoặc bấm trực tiếp trên bản đồ Canvas — cả hai cách đều dẫn tới cùng một kết quả trạng thái!

### 6.3. Khả năng tương thích Save/Load 100%
- Trong file lưu trữ (`localStorage`), dữ liệu trạng thái chỉ ghi nhận các chuỗi và số nguyên thuần túy: `state.location`, `state.currentMap.id`, `state.stats.mapsExplored`.
- Tầng Tileset hoàn toàn là hiển thị (View), không bổ sung bất kỳ biến trạng thái dị biệt nào vào save file.
- Khi tải lại game (`Load Game`), hệ thống đọc `state.stats.mapsExplored` và `state.location` để hiển thị đúng sương mù khám phá (Fog of War) và vị trí của token nhân vật.

---

## 7. Định hướng phong cách thị giác (Visual Direction)

Hệ thống tileset của Zombie World RPG phải phản ánh chính xác không khí u ám, lạnh lẽo và khốc liệt của ngày tận thế:
- **Tông màu chủ đạo:**
  - Bảng màu trầm tối, độ bão hòa thấp (Desaturated Earth & Concrete Palette).
  - Màu xanh rêu úa (`#3a4d39`), xám bê tông loang lổ (`#4f5358`), nâu đất rỉ sét (`#594a3c`), xanh than u tối (`#1a1a2e`).
  - Điểm nhấn thị giác (Accent Colors): Màu đỏ cảnh báo máu khô (`#8b0000` / `#e94560`) cho các vùng nguy hiểm cao, màu vàng hổ phách nhạt (`#ffa502`) cho ánh đèn le lói của các căn cứ còn người sống sót.
- **Độ tương phản và Dễ đọc (Readability):**
  - Mặt đất và đường sá đóng vai trò làm nền trầm (low visual noise), không vẽ các chi tiết tương phản quá gắt làm rối mắt.
  - Các công trình và ghim địa điểm (POI) có viền bóng đổ sẫm màu và nhãn chữ sắc nét (font `JetBrains Mono` / `Noto Sans SC`) để người chơi nhận diện ngay lập tức ranh giới an toàn và khu vực nguy hiểm.
- **Tuyệt đối loại bỏ:**
  - Không sử dụng màu sắc rực rỡ, tươi sáng kiểu game nông trại hoạt hình.
  - Không sử dụng đồ họa tương lai viễn tưởng bóng bẩy (sci-fi neon).
  - Không dùng phong cách fantasy phép thuật huyền ảo.

---

## 8. Ma trận rủi ro & Phương án bảo toàn (Risks & Compatibility Matrix)

| STT | Rủi ro tiềm ẩn | Mức độ | Hậu quả nếu xảy ra | Giải pháp bảo toàn kiến trúc |
|---|---|---|---|---|
| 1 | Lệch đồng bộ giữa Click Canvas và Nút bấm DOM | Trung bình | Người chơi bấm trên bản đồ nhưng không kích hoạt được sự kiện | Map Renderer chỉ phát lệnh gọi lại hàm `handleMapAction(index)` sẵn có trong `js/game/navigation.js` |
| 2 | Giảm hiệu năng hoặc lag trên thiết bị di động | Trung bình | Tụt FPS, đơ cảm ứng trên điện thoại | Đóng gói toàn bộ tile vào 1 Spritesheet WebP, tắt render liên tục (chỉ render lại khi state thay đổi - Dirty Flag Render) |
| 3 | Mất khả năng chơi game khi tắt hoặc lỗi WebGL | Thấp | Game bị dừng hoặc trắng màn hình | Kế thừa cơ chế Procedural Fallback sẵn có của `PixiRenderer`: nếu WebGL tắt, toàn bộ game vẫn chạy 100% bằng DOM UI |
| 4 | Làm sai lệch dữ liệu Save/Load cũ | Nghiêm trọng | Người chơi bị hỏng file lưu trước đó | Tuyệt đối không thêm trường bắt buộc vào `state` gốc; đọc trực tiếp từ `state.stats.mapsExplored` |
| 5 | Không tương thích với màn hình dọc (Portrait Mode) | Thấp | Bản đồ bị co rúm hoặc tràn lề | Canvas giữ tỷ lệ co giãn `width: 100%; height: auto; max-width: 100%`, bố trí POI trong vùng an toàn (Safe Action Margin) |

---

## 9. Đề xuất kế hoạch triển khai Phase 7.2 (Recommended Phase 7.2 Implementation Plan)

Sau khi hoàn thành Phase 7.1 (Audit & Thiết kế Kiến trúc), lộ trình triển khai chi tiết cho Phase 7.2 được đề xuất như sau:

### Giai đoạn A: Chuẩn bị Dữ liệu Lưới & Tọa độ Bố cục (Layout Coordinate Modeling)
1. Xây dựng file dữ liệu tọa độ `js/data/maps/map-layout.js` định vị chính xác vị trí `[tileX, tileY]` cho toàn bộ 24 địa điểm trên sa bàn 40×24 ô.
2. Thiết lập cấu trúc đường nối giao thông hợp lý giữa các cụm địa điểm (Cụm ven sông, Cụm đô thị trung tâm, Cụm công nghiệp, Cụm cứ điểm quân sự).

### Giai đoạn B: Tích hợp Tài nguyên Đồ họa (Asset Preparation & Atlas)
1. Tập hợp các tile đồ họa 32×32 px đồng nhất phong cách Dark Post-Apocalyptic.
2. Đóng gói thành `world_map_tileset.webp` và metadata atlas JSON.
3. Bổ sung các icon ghim POI, badge cấp nguy hiểm (đầu lâu, sao an toàn), và token nhân vật.

### Giai đoạn C: Xây dựng Module Kết xuất Bản đồ (`js/map-renderer.js`)
1. Tạo class `WorldMapRenderer` tích hợp trực tiếp vào `worldLayer` của `PixiRenderer`.
2. Dựng lưới nền bằng `PIXI.Container` gom cụm (Batch Draw).
3. Đặt các POI Markers kèm tương tác chuột/cảm ứng (`eventMode = 'static'`, con trỏ `pointer`).
4. Triển khai hiệu ứng Sương mù khám phá (Fog of War) dựa trên mảng `state.stats.mapsExplored`.

### Giai đoạn D: Đồng bộ Giao diện & Kiểm thử hồi quy
1. Kết nối với chu trình chuyển cảnh `phase === "map_select"` trong `render(state)`.
2. Kiểm thử song song điều khiển kép: bấm nút DOM và bấm trực tiếp Canvas.
3. Viết bộ kiểm thử hồi quy tự động `tests/test_batch07_map.cjs` đảm bảo 100% test cũ và mới đều PASS.

---

## 10. Kết luận nghiệm thu Phase 7.1

- **Hoàn thành khảo sát 100% hiện trạng mã nguồn bản đồ:** Đã xác định rõ bản chất Node-based graph, 24 địa điểm, hệ thống điều hướng fast-travel, và vai trò của các container DOM/PixiJS.
- **Xác định đầy đủ danh mục tài nguyên tileset:** 5 nhóm địa hình, 5 loại đường sá, 9 loại công trình, cùng hệ thống đạo cụ và ghim POI chuẩn 32×32 px.
- **Thiết kế kiến trúc tích hợp an toàn tuyệt đối:** Tách biệt hoàn toàn giữa Tầng hiển thị Visual Tileset và Tầng xử lý Gameplay Logic; bảo toàn 100% Save/Load, cơ chế điều hướng và các bài test hiện có.
- **Dự án sẵn sàng bước vào Phase 7.2** để triển khai kết xuất đồ họa bản đồ theo đúng đặc tả kỹ thuật trên.

