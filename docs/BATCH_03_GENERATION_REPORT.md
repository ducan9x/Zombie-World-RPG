# BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG (QA AUDIT) BATCH 03 — CHARACTER ASSETS
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian kiểm toán:** 2026-11-05 23:10:00 (ICT)  
**Tiêu chuẩn kỹ thuật bắt buộc:**
- Kích thước: **512 × 768 pixels** (Tỷ lệ 2:3)
- Định dạng: **PNG 32-bit (RGBA)**
- Độ trong suốt: **True Alpha Transparency** (Kênh Alpha có vùng trong suốt thực tế > 20%, không chấp nhận nền đục 100% opacity)
- Bố cục: Nhân vật toàn thân (Full Body), đứng chính giữa, không crop đầu/chân, không viền giả caro, không watermark/logo.

---

## 1. TỔNG HỢP KẾT QUẢ KIỂM TOÁN (AUDIT SUMMARY)

| Chỉ số | Kết quả kiểm tra | Tỷ lệ | Đánh giá |
|---|:---:|:---:|:---:|
| **Tổng số asset Batch 03 theo đặc tả** | **36 assets** | 100% | 30 Player + 6 Story NPCs |
| **Số file thực tế tồn tại trên đĩa** | 36 files | 100% | Đã có file tương ứng (1 file bị lỗi khoảng trắng) |
| **Số asset ĐẠT CHUẨN (COMPLETE / PASS)** | **15 assets** | **41.7%** | Đạt 100% tiêu chuẩn 512×768 RGBA, True Alpha > 60% |
| **Số asset KHÔNG ĐẠT (REJECTED / PENDING)** | **21 assets** | **58.3%** | Không đạt tiêu chuẩn kích thước, alpha hoặc tên file |
| - *Lỗi 1: Kích thước 512×768 nhưng Alpha 0.0% (Nền đen đặc)* | 12 assets | 33.3% | Cần chạy lại thuật toán bóc tách nền |
| - *Lỗi 2: Ảnh raw 1696×2528, Alpha 0.0% (Nền trắng)* | 8 assets | 22.2% | Chưa qua pipeline bóc tách nền và resize |
| - *Lỗi 3: Sai tên file (thừa dấu cách) + Raw 1696×2528* | 1 asset | 2.8% | File bị đặt tên `' npc_tien_si_tran.png'` |
| **Kết luận điều kiện chuyển sang Batch 04** | **CHƯA ĐỦ ĐIỀU KIỆN** | — | **Cần khắc phục 21 asset lỗi trước khi chuyển Batch** |

---

## 2. DANH SÁCH 15 ASSET ĐẠT CHUẨN 100% (COMPLETE)

Tất cả 15 file này đã được kiểm tra nhị phân (Magic bytes PNG, đúng 512×768 px, RGBA, True Alpha > 60%):

| STT | Mã Asset (ID) | Phân Loại | File Name | Kích Thước | Tỷ Lệ Alpha Trong Suốt | Dung Lượng | Đánh Giá |
|:---:|---|---|---|:---:|:---:|:---:|:---:|
| 1 | `teen_male_survivor` | Player: Thiếu niên Nam | `teen_male_survivor.png` | 512×768 | **72.1%** | 284.8 KB | **PASS** |
| 2 | `teen_male_tactical` | Player: Thiếu niên Nam | `teen_male_tactical.png` | 512×768 | **73.7%** | 266.7 KB | **PASS** |
| 3 | `teen_male_casual` | Player: Thiếu niên Nam | `teen_male_casual.png` | 512×768 | **67.7%** | 284.0 KB | **PASS** |
| 4 | `teen_female_survivor` | Player: Thiếu niên Nữ | `teen_female_survivor.png` | 512×768 | **72.2%** | 280.5 KB | **PASS** |
| 5 | `teen_female_tactical` | Player: Thiếu niên Nữ | `teen_female_tactical.png` | 512×768 | **74.9%** | 255.8 KB | **PASS** |
| 6 | `teen_female_casual` | Player: Thiếu niên Nữ | `teen_female_casual.png` | 512×768 | **71.9%** | 260.0 KB | **PASS** |
| 7 | `young_adult_male_survivor` | Player: Thanh niên Nam | `young_adult_male_survivor.png` | 512×768 | **67.5%** | 344.7 KB | **PASS** |
| 8 | `young_adult_male_tactical` | Player: Thanh niên Nam | `young_adult_male_tactical.png` | 512×768 | **60.2%** | 455.3 KB | **PASS** |
| 9 | `middle_aged_male_casual` | Player: Trung niên Nam | `middle_aged_male_casual.png` | 512×768 | **73.1%** | 271.0 KB | **PASS** |
| 10 | `middle_aged_female_survivor` | Player: Trung niên Nữ | `middle_aged_female_survivor.png` | 512×768 | **72.9%** | 266.3 KB | **PASS** |
| 11 | `middle_aged_female_tactical` | Player: Trung niên Nữ | `middle_aged_female_tactical.png` | 512×768 | **74.6%** | 264.4 KB | **PASS** |
| 12 | `middle_aged_female_casual` | Player: Trung niên Nữ | `middle_aged_female_casual.png` | 512×768 | **70.8%** | 278.8 KB | **PASS** |
| 13 | `elderly_male_survivor` | Player: Cao tuổi Nam | `elderly_male_survivor.png` | 512×768 | **68.3%** | 337.3 KB | **PASS** |
| 14 | `elderly_male_tactical` | Player: Cao tuổi Nam | `elderly_male_tactical.png` | 512×768 | **72.4%** | 303.6 KB | **PASS** |
| 15 | `elderly_male_casual` | Player: Cao tuổi Nam | `elderly_male_casual.png` | 512×768 | **73.0%** | 275.3 KB | **PASS** |

---

## 3. DANH SÁCH 21 ASSET KHÔNG ĐẠT YÊU CẦU (REJECTED)

### Nhóm 1: Đúng 512×768 nhưng Nền đen đặc (Alpha 0.0% Trong suốt) — 12 ảnh
Các ảnh này đã được đưa về độ phân giải 512×768 nhưng phông nền là màu đen đặc nguyên khối (`RGB ~0,0,0`), kênh alpha có giá trị `255` toàn bộ, không có độ trong suốt thực tế. Khi đưa vào game, nhân vật sẽ bị bao quanh bởi một khối đen che khuất cảnh nền bản đồ.

| STT | File Name | Kích Thước | Alpha Hiện Tại | Nguyên Nhân Lỗi |
|:---:|---|:---:|:---:|---|
| 1 | `young_adult_male_casual.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 2 | `young_adult_female_survivor.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 3 | `young_adult_female_tactical.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 4 | `young_adult_female_casual.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 5 | `adult_male_survivor.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 6 | `adult_male_tactical.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 7 | `adult_male_casual.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 8 | `adult_female_survivor.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 9 | `adult_female_tactical.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 10 | `adult_female_casual.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 11 | `middle_aged_male_survivor.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |
| 12 | `middle_aged_male_tactical.png` | 512×768 | **0.0%** (100% đục) | Nền đen studio chưa được bóc tách alpha |

### Nhóm 2: Ảnh raw 1696×2528, Nền trắng đặc (Alpha 0.0%) — 8 ảnh
Các ảnh này mới được sinh ra từ Imagen và lưu trực tiếp vào thư mục mà chưa chạy qua pipeline bóc tách nền và resize:

| STT | File Name | Thư Mục | Kích Thước | Dung Lượng | Nguyên Nhân Lỗi |
|:---:|---|---|:---:|:---:|---|
| 13 | `elderly_female_survivor.png` | `player/` | 1696×2528 | 6.65 MB | Chưa resize 512×768, nền trắng đục 100% |
| 14 | `elderly_female_tactical.png` | `player/` | 1696×2528 | 6.87 MB | Chưa resize 512×768, nền trắng đục 100% |
| 15 | `elderly_female_casual.png` | `player/` | 1696×2528 | 6.79 MB | Chưa resize 512×768, nền trắng đục 100% |
| 16 | `npc_co_v.png` | `npc/` | 1696×2528 | 6.87 MB | Chưa resize 512×768, nền trắng đục 100% |
| 17 | `npc_tieu_ham.png` | `npc/` | 1696×2528 | 6.57 MB | Chưa resize 512×768, nền trắng đục 100% |
| 18 | `npc_lili.png` | `npc/` | 1696×2528 | 6.64 MB | Chưa resize 512×768, nền trắng đục 100% |
| 19 | `npc_muc_mieu_mieu.png` | `npc/` | 1696×2528 | 6.84 MB | Chưa resize 512×768, nền trắng đục 100% |
| 20 | `npc_vua_karen.png` | `npc/` | 1696×2528 | 6.96 MB | Chưa resize 512×768, nền trắng đục 100% |

### Nhóm 3: Sai tên file (thừa dấu cách) + Raw 1696×2528 — 1 ảnh
| STT | File Name Mong Muốn | File Thực Tế Trên Đĩa | Kích Thước | Nguyên Nhân Lỗi |
|:---:|---|---|:---:|---|
| 21 | `npc_tien_si_tran.png` | `' npc_tien_si_tran.png'` | 1696×2528 | Tên file bị chèn khoảng trắng phía trước (`\x20`), kích thước raw 1696×2528, nền trắng đục 100% |

---

## 4. HÌNH ẢNH MONTAGE KIỂM TRA TRỰC QUAN

Đã tạo thành công 2 ảnh montage tổng hợp trực quan kèm nhãn trạng thái và lưới caro (checkerboard) thể hiện độ trong suốt tại thư mục `scratch/qa/batch-03/`:

1. **Montage Player Appearance (30 ảnh - Lưới 6×5)**:
   * **Đường dẫn**: [`scratch/qa/batch-03/player_montage.png`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/scratch/qa/batch-03/player_montage.png)
   * **Kích thước**: `1520 × 2020 pixels` (Dung lượng: `2.6 MB`)
   * **Hiển thị**: Viền xanh lá (PASS) cho 15 ảnh đạt chuẩn; Viền đỏ (FAIL) cho 15 ảnh lỗi alpha/kích thước.
2. **Montage Story NPCs (6 ảnh - Lưới 6×1)**:
   * **Đường dẫn**: [`scratch/qa/batch-03/npc_montage.png`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/scratch/qa/batch-03/npc_montage.png)
   * **Kích thước**: `1520 × 480 pixels` (Dung lượng: `737 KB`)
   * **Hiển thị**: Viền đỏ (FAIL) cho toàn bộ 6 ảnh NPC (do chưa resize 512×768 và chưa bóc tách nền).

---

## 5. TÀI LIỆU VÀ MANIFEST ĐÃ CẬP NHẬT

1. [`project-docs/assets/batches/batch-03-characters.json`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/project-docs/assets/batches/batch-03-characters.json): Cập nhật `existingCount: 15`, `pendingCount: 21`. 15 asset hợp lệ mang status `COMPLETE`, 21 asset lỗi mang status `PENDING` kèm lý do cụ thể.
2. [`project-docs/assets/player-appearance-manifest.json`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/project-docs/assets/player-appearance-manifest.json): Đồng bộ chính xác 15 COMPLETE, 15 PENDING.
3. [`project-docs/assets/asset-manifest.json`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/project-docs/assets/asset-manifest.json): Cập nhật trạng thái 15 complete, 21 pending trong danh mục tổng.
4. [`docs/BATCH_03_CHARACTER_SPEC.md`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/docs/BATCH_03_CHARACTER_SPEC.md): Cập nhật phiên bản v2.7 ghi nhận trạng thái QA Audit.
5. [`project-docs/CHANGELOG.md`](file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/project-docs/CHANGELOG.md): Ghi nhật ký kiểm toán chất lượng.
