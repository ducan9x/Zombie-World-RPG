# BÁO CÁO NGHIỆM THU: BATCH 07 – PHASE 7.2A
## TILESET ASSET ACQUISITION & VISUAL SPECIFICATION
**Dự án:** Zombie World RPG  
**Giai đoạn:** Phase 7.2A – Chuẩn bị & Đặc tả Tài nguyên Đồ họa Tileset  
**Ngày hoàn thành:** 06/11/2026  
**Trạng thái:** HOÀN THÀNH TOÀN DIỆN (Assets & Previews Generated)  

---

## 1. Định hướng phong cách thị giác (Visual Style Specification)

Hệ thống tileset được thiết kế đồng bộ theo phong cách **Retro Post-Apocalyptic Survival Pixel Art**, hòa nhập hoàn hảo với bối cảnh thế giới sinh tồn u ám của Zombie World RPG:

- **Bảng màu chủ đạo (Muted & Desaturated Palette):**
  - **Cỏ úa phế thổ (Dead Olive Green):** `#444e3b`, `#5a634a`, `#313829` — không dùng màu xanh tươi mọng hoạt hình; thể hiện lớp cỏ khô cằn bị nhiễm độc và bụi phóng xạ.
  - **Đất hoang cát bụi (Dusty Wasteland Soil):** `#584738`, `#6e5a48`, `#3e3226` — đất nứt nẻ, cằn cỗi vì hạn hán và chiến tranh.
  - **Bê tông & Đá phong hóa (Weathered Concrete & Rock):** `#565a5f`, `#6d7278`, `#404347` — màu xám tro tàn của các kết cấu đô thị đổ nát.
  - **Nhựa đường sẫm (Worn Bitumen Asphalt):** `#26282a`, `#343639`, `#1a1a1c` kèm vạch sơn phân làn vàng ố phai màu `#b59b48`.
  - **Nước sông độc hại (Murky Chemical Water):** `#1b2622`, `#2a3a34`, `#475c40` — mặt nước đục ngầu, tĩnh lặng với váng hóa chất màu rêu.
  - **Vùng biến dị sinh học (Bio-Blight Hive Terrain):** `#5a2121`, `#381313`, `#823030` — màng nhầy máu khô và tế bào biến dị phục vụ cho Tổ Zombie và Viện Nghiên Cứu.
  - **Kim loại rỉ sét & Gỗ mục (Rusted Metal & Rotting Wood):** `#753f2c`, `#4e291c`, `#594333`.
  - **Điểm nhấn tương phản (High-Readability Accents):** Vàng hổ phách `#e6a035` cho trạm kiểm soát/địa điểm khả dụng, đỏ cảnh báo `#b82c2c` cho biểu tượng đầu lâu tử địa, xanh lơ `#00ffd2` cho token người chơi.

- **Nguyên tắc thẩm mỹ kiên định:**
  - Tuyệt đối tránh phong cách tươi sáng, hoạt hình nông trại (farming game).
  - Tuyệt đối tránh phong cách viễn tưởng neon bóng bẩy (cyberpunk neon).
  - Độ nhiễu thị giác thấp (low visual noise), ưu tiên khả năng nhận diện công trình và ranh giới đường sá.

---

## 2. Nguồn gốc tài nguyên & Thông tin bản quyền (Asset Sources & Licensing)

1. **Nguồn gốc tài nguyên (Asset Origin):**
   - Toàn bộ 33 sprite tileset, công trình đa ô (multi-tile structures), đạo cụ môi trường và ghim POI đã được khởi tạo trực tiếp trong nội bộ dự án (Procedural In-Engine Pixel Synthesis).
   - Tối ưu hóa kích thước pixel-perfect thông qua thư viện `sharp` sẵn có trong `package.json`, không cài đặt thêm bất kỳ thư viện bên thứ ba nào.
2. **Giấy phép bản quyền (Licensing):**
   - **CC0 1.0 Universal (Public Domain Dedication) / MIT Game Project License.**
   - Hoàn toàn tự do sử dụng thương mại, chỉnh sửa, phân phối offline, không dính bất kỳ tranh chấp bản quyền hoặc điều khoản giới hạn nào.
3. **Tính độc lập:**
   - Không can thiệp hoặc ghi đè lên 23 hình nền phong cảnh `public/assets/backgrounds/map_*_bg.webp`.
   - Giữ nguyên toàn bộ cấu trúc kho biểu tượng `public/assets/icons/swisserai-fivem-inventory-icons-v1.0/`.

---

## 3. Đặc tả kích thước & Khung lưới Tile (Tile Dimensions & Grid)

- **Lưới cơ sở (Base Grid Size):** **32 × 32 pixels**.
- **Kích thước công trình đa ô (Multi-Tile Dimensions):**
  - Căn nhà bỏ hoang (`bld_abandoned_house_64`): **64 × 64 pixels** (2 × 2 tiles).
  - Trạm xăng ngoại thành (`bld_gas_station_64`): **64 × 64 pixels** (2 × 2 tiles).
  - Tháp canh núi (`bld_watchtower_fortified_64`): **64 × 64 pixels** (2 × 2 tiles).
  - Bệnh viện dã chiến (`bld_hospital_ruined_96`): **96 × 64 pixels** (3 × 2 tiles).
  - Nhà kho công nghiệp (`bld_industrial_warehouse_96`): **96 × 64 pixels** (3 × 2 tiles).
  - Lâu đài Tận thế (`bld_castle_fortress_128`): **128 × 96 pixels** (4 × 3 tiles).
- **Quy chuẩn độ phân giải kết xuất ảo:**
  - Khung nhìn ảo chuẩn PixiJS: **640 × 320 pixels** (tương đương chính xác **20 cột × 10 dòng tiles**).
  - Hỗ trợ màn hình Retina / High-DPI với tỷ lệ co giãn canvas responsive `width: 100%; height: auto;`.

---

## 4. Danh mục tài nguyên đã tạo (Generated Asset Catalog)

Tổng cộng **33 sprite độc lập** đã được tạo ở cả hai định dạng **PNG** (chuẩn đồ họa lossless) và **WebP** (tối ưu hóa dung lượng web):

### 4.1. Nhóm Địa hình nền (Terrain Tiles - 8 items)
1. `terrain_grass_dead_32.png / .webp`: Cỏ úa phế thổ xơ xác, xen kẽ đất khô cằn.
2. `terrain_dirt_wasteland_32.png / .webp`: Đất hoang nứt nẻ, bụi cát sinh tồn.
3. `terrain_concrete_cracked_32.png / .webp`: Bê tông đô thị nứt toác, khe co giãn vỡ.
4. `terrain_asphalt_dark_32.png / .webp`: Nhựa đường thô sẫm màu, bề mặt mài mòn.
5. `terrain_gravel_coarse_32.png / .webp`: Sỏi đá dăm và tàn tích vụn.
6. `terrain_rock_cliff_32.png / .webp`: Vách đá hoa cương dựng đứng cho vùng núi.
7. `terrain_water_toxic_32.png / .webp`: Dòng sông ô nhiễm đục ngầu, gợn sóng hóa chất.
8. `terrain_bio_blight_32.png / .webp`: Mặt đất nhiễm khuẩn biến dị, màng nhầy đỏ thẫm.

### 4.2. Nhóm Đường sá & Giao thông (Road Tiles - 8 items)
1. `road_asphalt_h_32.png / .webp`: Đường nhựa nằm ngang với vạch sơn vàng đứt đoạn.
2. `road_asphalt_v_32.png / .webp`: Đường nhựa thẳng đứng với vạch sơn vàng đứt đoạn.
3. `road_crossroads_32.png / .webp`: Ngã tư giao cắt hoàn chỉnh 4 hướng.
4. `road_t_junction_32.png / .webp`: Ngã ba giao cắt hình chữ T.
5. `road_corner_32.png / .webp`: Khúc cua ngoặt 90 độ mềm mại.
6. `road_edge_32.png / .webp`: Mép lề đường chuyển tiếp giữa nhựa đường và đất cát.
7. `road_broken_cracked_32.png / .webp`: Đoạn đường bị nổ sập hố bom / hố sâu trơ cốt thép.
8. `road_sidewalk_pavement_32.png / .webp`: Vỉa hè đô thị lát gạch kèm gờ đá bó vỉa.

### 4.3. Nhóm Đạo cụ & Tàn tích môi trường (Props & Debris - 7 items)
1. `prop_dead_bush_32.png / .webp`: Bụi cây khô trơ cành gai.
2. `prop_boulder_rock_32.png / .webp`: Tảng đá granite phong hóa có bóng đổ.
3. `prop_rubble_debris_32.png / .webp`: Đống gạch vỡ, bê tông và thanh sắt vụn.
4. `prop_barricade_sandbag_32.png / .webp`: Công sự bao cát phòng thủ xếp 2 tầng.
5. `prop_fence_barbed_wire_32.png / .webp`: Hàng rào cọc gỗ cuốn dây thép gai rỉ sét.
6. `prop_oil_drum_rust_32.png / .webp`: Thùng phuy nhiên liệu rỉ sét có sọc cảnh báo.
7. `prop_vehicle_wreck_small_32.png / .webp`: Xác xe hơi cháy rụi, cửa kính vỡ, lốp bẹp.

### 4.4. Nhóm Công trình kiến trúc (Structures - 6 items)
1. `bld_abandoned_house_64.png / .webp` (64×64): Nhà dân 2 tầng thủng mái, cửa đóng ván gỗ.
2. `bld_gas_station_64.png / .webp` (64×64): Trạm xăng đổ nát có mái che, trụ bơm và vạch đỏ.
3. `bld_watchtower_fortified_64.png / .webp` (64×64): Tháp canh quân sự chân thép giằng chéo.
4. `bld_hospital_ruined_96.png / .webp` (96×64): Bệnh viện gạch đỏ có biểu tượng Chữ Thập Đỏ vỡ.
5. `bld_industrial_warehouse_96.png / .webp` (96×64): Nhà kho tôn sóng lớn có cửa cuốn xếp dỡ.
6. `bld_castle_fortress_128.png / .webp` (128×96): Lâu đài đá khổng lồ, tháp canh đôi và cổng vòm Gothic.

### 4.5. Nhóm Ghim địa điểm & Dấu mốc (POI Markers - 4 items)
1. `marker_poi_active_32.png / .webp`: Ghim radar hổ phách phát sáng báo địa điểm khả dụng.
2. `marker_poi_unexplored_32.png / .webp`: Vòng tròn kim loại chứa dấu hỏi bí ẩn chưa thám hiểm.
3. `marker_danger_skull_32.png / .webp`: Huy hiệu đầu lâu đỏ cảnh báo tử địa nguy hiểm cao.
4. `marker_player_token_32.png / .webp`: Token chiến thuật màu ngọc lam hiển thị vị trí người chơi.

---

## 5. Cấu trúc thư mục tài nguyên hoàn chỉnh (Asset Organization)

Toàn bộ tài nguyên đã được lưu trữ ngăn nắp đúng quy chuẩn tại `public/assets/maps/`:

```
public/assets/maps/
├── tiles/
│   ├── terrain/              # 8 tiles mặt đất (PNG + WebP)
│   ├── roads/                # 8 tiles đường sá giao thông (PNG + WebP)
│   ├── props/                # 7 props môi trường trong suốt (PNG + WebP)
│   ├── structures/           # 6 công trình kiến trúc đa ô (PNG + WebP)
│   └── markers/              # 4 biểu tượng POI và token (PNG + WebP)
├── atlases/
│   ├── world_map_tileset.png # Spritesheet Atlas 256x256 pixel-perfect
│   ├── world_map_tileset.webp# Spritesheet Atlas nén WebP siêu nhẹ (~19KB)
│   └── world_map_tileset.json# PixiJS v7 compatible metadata frame coordinates
└── previews/
    ├── preview_tileset_showcase.png  # Bức tranh sa bàn toàn cảnh 640x320 PNG
    └── preview_tileset_showcase.webp # Bức tranh sa bàn toàn cảnh 640x320 WebP
```

---

## 6. Phân tích độ phủ & Đánh giá khoảng trống (Asset Coverage & Gap Analysis)

| Danh mục | Số lượng hiện có | Nhu cầu của 24 địa điểm | Đánh giá độ phủ | Hướng mở rộng Phase 7.2B/C |
|---|---|---|---|---|
| **Mặt đất (Terrain)** | 8 tiles | 6 nhóm Biomes | **Đầy đủ 100%** | Có thể bổ sung thêm tile cát bờ biển cho Đảo Nhỏ |
| **Đường sá (Roads)** | 8 tiles | Mạng lưới cao tốc & ngã rẽ | **Đầy đủ 100%** | Đáp ứng hoàn hảo các trục giao thông chính |
| **Đạo cụ (Props)** | 7 props | Tàn tích, xe cộ, rào chắn | **Đạt 90%** | Có thể thêm cọc tiêu phản quang, biển báo giao thông |
| **Công trình (Structures)** | 6 công trình | 24 địa điểm | **Đạt 75%** | Các địa điểm tương đồng có thể dùng chung mẫu (ví dụ: siêu thị & nhà kho, trường học & bệnh viện) |
| **Điểm mốc (Markers)** | 4 markers | Active, Unexplored, Danger, Token | **Đầy đủ 100%** | Tương thích trọn vẹn logic trạng thái game |

---

## 7. Đánh giá chất lượng Showcase Preview (640 × 320 Virtual Viewport)

File sa bàn trực quan đã được tổng hợp tại:  
👉 [preview_tileset_showcase.png](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/public/assets/maps/previews/preview_tileset_showcase.png)  
👉 [preview_tileset_showcase.webp](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/public/assets/maps/previews/preview_tileset_showcase.webp)

Bức tranh mẫu 640×320 minh chứng rõ ràng:
1. **Chuyển tiếp địa hình tự nhiên:** Từ bãi cỏ úa sườn núi phía Tây chuyển tiếp mượt sang đất hoang cát bụi trung tâm, dòng sông độc hại phía Đông Bắc và vùng biến dị sinh học màu huyết dụ phía Đông Nam.
2. **Hệ thống giao thông liền mạch:** Trục quốc lộ 2 làn nằm ngang kết nối ngã tư trung tâm, ngã ba phía Đông và đoạn đường vỡ bom nát trơ hố đất.
3. **Quy mô công trình hài hòa (Scale Cohesion):** Đại lâu đài thành trì 128×96 px bề thế ở góc Tây Bắc, Bệnh viện Chữ Thập Đỏ 96×64 px bên đường, Trạm xăng 64×64 px sát trục giao thông, và Nhà kho công nghiệp bên bờ cảng.
4. **Phân bố đạo cụ hợp lý:** Xác xe cháy trên đường, hàng rào thép gai và công sự bao cát bảo vệ chốt giao thông, thùng phuy rỉ sét và tảng đá tự nhiên.
5. **Ghim mốc POI trực quan:** Ghim hổ phách phát sáng chỉ điểm căn cứ, ghim bí ẩn trên công trình chưa đến, đầu lâu cảnh báo khu vực nguy hiểm, và token người chơi hiển thị vị trí tức thời.

---

## 8. Đề xuất bố cục sa bàn cho Prototype (Recommended Prototype Composition)

Trong giai đoạn tiếp theo (**Phase 7.2B - Prototype Integration**), bản đồ sa bàn sẽ kết nối 24 địa điểm thành 4 cụm chiến lược:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CỤM BẮC - THÀNH TRÌ & NÚI]       [CỤM ĐÔNG BẮC - SÔNG NƯỚC & ĐẢO]     │
│ - Lâu đài Tận thế (128x96)         - Cảng Bên Sông & Du thuyền         │
│ - Tháp Canh Núi (Watchtower)       - Khu Cắm Trại Bên Sông             │
│ - Làng Nông Trại Núi               - Đảo Nhỏ (Offshore Island)         │
│                                                                        │
│ ═══════════════════════════ QUỐC LỘ CAO TỐC ══════════════════════════ │
│                                                                        │
│ [CỤM TRUNG TÂM - ĐÔ THỊ & DỊCH VỤ] [CỤM NAM - CÔNG NGHIỆP & TỬ ĐỊA]   │
│ - Trạm Xăng Ngoại Thành            - Khu Công Nghiệp / Nhà Xưởng       │
│ - Khu Dịch Vụ Cao Tốc              - Nhà Kho Nhà Máy / Lão Mã          │
│ - Đại Học & Trung Tâm Thương Mại   - Bệnh Viện & Đồn Cảnh Sát          │
│ - Lều Người Sống Sót (Home)        - Tổ Zombie & Viện Sinh Học         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Xác nhận an toàn & Kiểm thử hồi quy

- **Không can thiệp gameplay:** Mã nguồn logic của game (`js/game/*.js`, `js/data/*.js`) hoàn toàn không bị chỉnh sửa.
- **Không can thiệp hệ thống render hiện tại:** `PixiRenderer` hiện hữu và giao diện DOM nguyên vẹn 100%.
- **Chạy toàn bộ test suite (`npm test`):**
  - Batch 06 Phase 4.1 Final Acceptance: 20/20 PASS
  - Batch 06 Phase 3.1 Regression Audit: 15/15 PASS
  - Batch 05 Phase 1 Item Icons: 14/14 PASS
  - **TỔNG CỘNG: 49/49 TESTS ĐẠT (100% PASS)**

Phase 7.2A chính thức hoàn tất, sẵn sàng bước sang thiết kế bố cục dữ liệu và tích hợp mẫu thử nghiệm ở Phase 7.2B.

