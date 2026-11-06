# BÁO CÁO PHỤC HỒI VÀ KIỂM TOÁN TÀI NGUYÊN BATCH 04 — ZOMBIE & MONSTER ASSETS
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian thực hiện:** 2026-11-06 08:38:00 (ICT)  
**Kỹ sư thực hiện:** Senior Game Frontend Engineer  
**Phạm vi:** Kiểm toán, định danh, chuẩn hóa và lập hồ sơ phục hồi toàn bộ tài nguyên Zombie & Quái vật (Batch 04).

---

## 1. TỔNG HỢP KIỂM TOÁN MÃ NGUỒN (STAGE A: SOURCE AUDIT & INVENTORY)

### 1.1 Khảo sát cấu trúc Repository & Lịch sử Git
- Đã kiểm tra toàn bộ lịch sử Git từ commit gốc `2fda335` (V0.2.3 ban đầu thuần text RPG, chỉ có `public/icon/icon.png`) đến commit mới nhất `c537526`.
- Xác nhận: **Không có bất kỳ file ảnh zombie/quái vật nào từng tồn tại hoặc bị xóa trong lịch sử git**. Toàn bộ 21 thực thể kẻ địch trong mã nguồn trước giờ hoạt động theo cơ chế text-driven (chữ mô tả trong `#story-area`).
- Thư mục `public/assets/zombies/` trước đó chưa được khởi tạo.

### 1.2 Phân tích chi tiết 21 thực thể Kẻ địch trong Source Code
Qua quét mã nguồn tại `js/data/entities/zombies.js` và `js/data/entities/npcs.js`, đã định danh chính xác 21 thực thể hostile:

1. **Nhóm 16 Zombie thường & tinh nhuệ (`zombies.js`):**
   - `zombie_lang_dao` (Zombie Lãng Du Thường - Wandering Zombie)
   - `zombie_thay_rach` (Thây Rách - Torn Flesh Zombie)
   - `zombie_bo` (Zombie Bò - Crawler Zombie)
   - `zombie_nhanh` (Zombie Chạy Nhanh - Runner Zombie)
   - `zombie_beo` (Zombie Béo Phì - Bloater Zombie)
   - `zombie_no` (Zombie Nổ - Explosive Suicide Zombie)
   - `zombie_quan_canh` (Zombie Quân Cảnh - Riot Police Zombie)
   - `zombie_me_nhom` (Mẹ Zombie Bầy Đàn - Swarm Mother Zombie)
   - `zombie_giap_sat` (Zombie Giáp Sắt - Ironclad Zombie)
   - `zombie_bang_gia` (Zombie Băng Giá - Frost Zombie)
   - `zombie_dien_cuong` (Zombie Cuồng Nộ - Berserker Zombie)
   - `zombie_axit` (Zombie Phun Axit - Acid Spitter Zombie)
   - `zombie_nhay` (Zombie Nhảy - Leaper Hunter Zombie)
   - `zombie_tank` (Zombie Xe Tăng - Juggernaut Tank Brute Zombie)
   - `zombie_ma_vo_hinh` (Zombie Vô Hình - Stealth Cloaked Zombie)
   - `zombie_xuyen_thung` (Zombie Xuyên Thủng - Impaling Bone Zombie)

2. **Nhóm 5 Quái vật Boss & Biến dị đặc biệt (`npcs.js` - `NAMED_NPCS`):**
   - `zombie_king` (Vua Zombie Im Lặng - Silent Zombie King Boss, HP: 420)
   - `giant_puppet` (Cỗ Rối Khổng Lồ - Giant Mechanical Cyber-Zombie Boss, HP: 380)
   - `sea_monster` (Hải Zombie Khổng Lồ - Deep-Sea Zombie Leviathan Boss, HP: 600)
   - `football_zombie` (Zombie Bóng Bầu Dục - Armored Football Zombie, HP: 250)
   - `diving_zombie` (Zombie Lặn - Scuba Diver Zombie, HP: 200)

*(Ghi chú phân loại: Các Boss là con người như Mã Tam, Hắc Ảnh, Trưởng Ngân Hàng, Trưởng Trận Địa, Lão Binh Lão Triệu là Human NPCs, không thuộc danh mục Zombie/Monster; Y tá Zombie Rutile được xếp vào nhóm Story NPC / Đồng hành).*

---

## 2. KẾ HOẠCH VÀ QUY CHUẨN KỸ THUẬT (STAGE B: RECOVERY PLAN)

- **Thư mục quy hoạch:** `public/assets/zombies/` (Đã khởi tạo).
- **Quy chuẩn kích thước:**
  - 18 Zombie thường và biến dị: **512 × 768 pixels (Tỷ lệ 2:3)**.
  - 3 Đại Boss quái vật (Vua Zombie, Cỗ Rối Khổng Lồ, Hải Zombie): **1024 × 1024 pixels (Tỷ lệ 1:1)**.
- **Định dạng:** PNG 32-bit (True RGBA, kênh Alpha trong suốt > 60%).
- **Phong cách:** Dark Post-apocalyptic Survival RPG, semi-realistic 3D game character art, ánh sáng xiên góc trên bên trái, toàn thân không crop.

---

## 3. HÀNH ĐỘNG THỰC HIỆN (STAGE C: ASSET ORGANIZATION)

1. **Khởi tạo thư mục:** `public/assets/zombies/`.
2. **Tạo Manifest Batch 04:** `project-docs/assets/batches/batch-04-zombies.json` với đầy đủ 21 bản ghi, prompt AI, negative prompt, kích thước, định dạng và trạng thái `PENDING`.
3. **Đồng bộ Manifest trung tâm:** `project-docs/assets/asset-manifest.json` được chuẩn hóa từ 161 lên 163 asset (bổ sung đầy đủ `zombie_football` và `zombie_diver`, chuẩn hóa đường dẫn về `public/assets/zombies/`).
4. **Lập tài liệu đặc tả:** `docs/BATCH_04_ZOMBIE_SPEC.md` mô tả chi tiết hình tượng, thuộc tính chiến đấu và prompt cho toàn bộ 21 sinh vật.
5. **Bảo toàn nguyên vẹn Batch 01, 02, 03:** Tuyệt đối không can thiệp, đổi tên hoặc ghi đè bất kỳ file nào thuộc 3 Batch trước.

---

## 4. KẾT QUẢ KIỂM TOÁN CHẤT LƯỢNG (STAGE D & E: QA RESULTS)

### 4.1 Tiến độ thực tế qua các giai đoạn (Stage C1 & C2)

- **Stage C1 (P0 Zombies):** Đã tạo, tách nền và kiểm định 6/6 asset P0 (`zombie_lang_dao`, `zombie_nhanh`, `zombie_no`, `zombie_quan_canh`, `zombie_dien_cuong`, `zombie_axit`) đạt chuẩn 100% PASS (512×768 RGBA, true alpha).
- **Stage C2 (P1 Zombies):** 
  - Đã tạo, tách nền và kiểm định 7 asset P1 (`zombie_thay_rach`, `zombie_bo`, `zombie_beo`, `zombie_me_nhom`, `zombie_giap_sat`, `zombie_bang_gia`, `zombie_nhay`) đạt chuẩn 100% PASS (512×768 RGBA, true alpha).
  - 3 asset P1 (`zombie_tank`, `zombie_ma_vo_hinh`, `zombie_xuyen_thung`) tạm dừng do khóa Quota API 429 (`gemini-3.1-flash-image`, reset lúc 07:03:02Z UTC).
  - 5 Boss monsters và 2 P2 zombies chưa kích hoạt.

### 4.2 Thống kê lũy kế hiện tại

| Chỉ số kiểm toán | Số lượng | Tỷ lệ | Đánh giá |
|---|:---:|:---:|:---:|
| **Tổng số asset định danh trong Batch 04** | **21 assets** | 100% | Đầy đủ 16 zombie + 5 quái vật/Boss |
| **Số asset đã hoàn thành và nghiệm thu (PASS)** | **13 assets** | **61.9%** | **6 P0 + 7 P1 đạt chuẩn RGBA 512×768** |
| **Số asset tạm dừng do Quota API (Pending Quota)** | **3 assets** | 14.3% | `zombie_tank`, `zombie_ma_vo_hinh`, `zombie_xuyen_thung` |
| **Số asset chưa khởi tạo (Pending C3/Boss)** | **5 assets** | 23.8% | 5 Boss và biến dị đặc biệt |
| **Tổng số asset chưa giải quyết (Unresolved)** | **8 assets** | 38.1% | 3 P1 + 5 Boss |
| **Kết luận kiểm toán Batch 04** | **IN_PROGRESS (13/21 PASS)** | — | Tuân thủ nghiêm ngặt quy tắc không đánh giá PASS toàn bộ khi còn 8 asset chưa giải quyết |

---

## 5. DANH SÁCH FILE ĐÃ CHỈNH SỬA & TẠO MỚI

1. `public/assets/zombies/` *(Thư mục lưu trữ 13 asset PNG 512×768 RGBA)*
2. `scratch/qa/batch-04/` *(Thư mục lưu trữ montage QA: `batch_04_p0_montage.png`, `batch_04_c2_montage.png`, `batch_04_cumulative_montage.png`)*
3. `project-docs/assets/batches/batch-04-zombies.json` *(Cập nhật trạng thái 13 asset PASS, 8 PENDING)*
4. `docs/BATCH_04_ZOMBIE_SPEC.md` *(Tài liệu đặc tả 21 sinh vật)*
5. `project-docs/assets/batches/BATCH_04_RECOVERY_REPORT.md` *(Cập nhật tiến độ Stage C2)*
6. `project-docs/assets/asset-manifest.json` *(Cập nhật đồng bộ 13 asset existing/PASS)*
7. `project-docs/CHANGELOG.md` *(Ghi nhật ký hệ thống)*
