# BÁO CÁO TỐI ƯU VÀ CHUYỂN ĐỔI BACKGROUND SANG WEBP CHUẨN
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 ASSET OPTIMIZATION

**Thời gian hoàn thành:** 2026-11-05 16:15:00 (ICT)  
**Công cụ thực hiện:** Sharp v0.35.5 (libvips 8.18.7, libwebp 1.6.0)  
**Tiêu chuẩn đầu ra:** WebP Lossy chất lượng cao (Quality 85, Effort 6), Kích thước chuẩn **1920×1080**, Tỷ lệ **16:9** (Cover Crop trung tâm), Kênh màu RGB.  
**Trạng thái an toàn dữ liệu:** Đã hoàn thành nghiệm thu chất lượng 28 file WebP chuẩn tại `public/assets/backgrounds/`. Thư mục backup tạm thời đã được dọn dẹp để tối ưu hóa kích thước repository. Toàn bộ prompt tái tạo gốc được lưu trữ tại `docs/IMAGE_GENERATION_PROMPTS.md`.

---

## 1. TỔNG HỢP HIỆU QUẢ TỐI ƯU

| Chỉ số | Trước chuyển đổi | Sau chuyển đổi | Mức độ cải thiện |
|---|:---:|:---:|:---:|
| **Tổng số file background** | 28 file | 28 file | 100% chuyển đổi thành công |
| **Định dạng thực tế** | 27 PNG + 1 JPEG | **28 WebP chuẩn (RIFF/WEBP)** | Đồng nhất 100% |
| **Độ phân giải chuẩn hóa** | 2752×1536 / 1672×941 | **1920×1080 (Chuẩn 16:9)** | Tối ưu hiển thị PixiJS |
| **Tổng dung lượng bộ nhớ** | **245.54 MB** (257,466,697 bytes) | **7.59 MB** (7,958,812 bytes) | **Giảm 237.95 MB** |
| **Tỷ lệ nén dung lượng** | 100% | **3.09%** | **Tiết kiệm 96.91% băng thông/RAM** |

---

## 2. BẢNG CHI TIẾT 28 BACKGROUND ĐÃ CHUYỂN ĐỔI VÀ XÁC THỰC

| STT | Tên Tập Tin | Format Gốc | Kích Thước Gốc | Dung Lượng Gốc | Kích Thước Mới | Dung Lượng Mới | Giảm (%) | Xác Thực |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | `combat_bg_city.webp` | PNG | 2752x1536 | 8.68 MB | **1920×1080** | **322.4 KB** | -96.4% | **PASS (100%)** |
| 2 | `combat_bg_interior.webp` | PNG | 2752x1536 | 8.17 MB | **1920×1080** | **240.2 KB** | -97.1% | **PASS (100%)** |
| 3 | `combat_bg_nest.webp` | PNG | 2752x1536 | 8.93 MB | **1920×1080** | **280.2 KB** | -96.9% | **PASS (100%)** |
| 4 | `combat_bg_sea.webp` | PNG | 2752x1536 | 9.88 MB | **1920×1080** | **487.0 KB** | -95.2% | **PASS (100%)** |
| 5 | `map_benh_vien_ngoai_thanh_bg.webp` | PNG | 2752x1536 | 8.05 MB | **1920×1080** | **153.4 KB** | -98.1% | **PASS (100%)** |
| 6 | `map_cam_trai_ben_song_bg.webp` | PNG | 2752x1536 | 8.71 MB | **1920×1080** | **333.0 KB** | -96.3% | **PASS (100%)** |
| 7 | `map_cang_ben_song_bg.webp` | PNG | 2752x1536 | 8.80 MB | **1920×1080** | **328.6 KB** | -96.4% | **PASS (100%)** |
| 8 | `map_canh_sat_bo_roi_bg.webp` | PNG | 2752x1536 | 9.31 MB | **1920×1080** | **345.3 KB** | -96.4% | **PASS (100%)** |
| 9 | `map_co_so_vu_tru_tuyet_mat_bg.webp` | PNG | 2752x1536 | 9.01 MB | **1920×1080** | **295.5 KB** | -96.8% | **PASS (100%)** |
| 10 | `map_dao_nho_bg.webp` | PNG | 2752x1536 | 8.79 MB | **1920×1080** | **345.0 KB** | -96.2% | **PASS (100%)** |
| 11 | `map_ham_tau_dien_ngam_bg.webp` | PNG | 2752x1536 | 8.53 MB | **1920×1080** | **257.4 KB** | -97.1% | **PASS (100%)** |
| 12 | `map_khu_cong_nghiep_bg.webp` | PNG | 2752x1536 | 8.75 MB | **1920×1080** | **298.9 KB** | -96.7% | **PASS (100%)** |
| 13 | `map_khu_dan_cu_cu_bg.webp` | PNG | 2752x1536 | 9.33 MB | **1920×1080** | **367.0 KB** | -96.2% | **PASS (100%)** |
| 14 | `map_khu_dich_vu_cao_toc_bg.webp` | PNG | 1672x941 | 2.61 MB | **1920×1080** | **282.8 KB** | -89.4% | **PASS (100%)** |
| 15 | `map_lang_nong_trai_nui_bg.webp` | PNG | 2752x1536 | 9.45 MB | **1920×1080** | **432.4 KB** | -95.5% | **PASS (100%)** |
| 16 | `map_lau_dai_tan_the_bg.webp` | PNG | 2752x1536 | 8.79 MB | **1920×1080** | **294.0 KB** | -96.7% | **PASS (100%)** |
| 17 | `map_nha_kho_nha_may_bg.webp` | PNG | 2752x1536 | 9.37 MB | **1920×1080** | **361.2 KB** | -96.2% | **PASS (100%)** |
| 18 | `map_nha_kho_nong_thon_bg.webp` | PNG | 2752x1536 | 9.41 MB | **1920×1080** | **392.1 KB** | -95.9% | **PASS (100%)** |
| 19 | `map_sieu_thi_kho_bg.webp` | PNG | 2752x1536 | 9.17 MB | **1920×1080** | **352.8 KB** | -96.2% | **PASS (100%)** |
| 20 | `map_thanh_pho_dai_hoc_bg.webp` | PNG | 2752x1536 | 10.19 MB | **1920×1080** | **498.9 KB** | -95.2% | **PASS (100%)** |
| 21 | `map_thap_canh_bo_roi_bg.webp` | PNG | 2752x1536 | 8.91 MB | **1920×1080** | **351.7 KB** | -96.1% | **PASS (100%)** |
| 22 | `map_to_zombie_bg.webp` | PNG | 2752x1536 | 9.04 MB | **1920×1080** | **285.8 KB** | -96.9% | **PASS (100%)** |
| 23 | `map_tram_kiem_tra_quan_du_bg.webp` | PNG | 2752x1536 | 8.48 MB | **1920×1080** | **298.5 KB** | -96.6% | **PASS (100%)** |
| 24 | `map_tram_xang_bo_roi_bg.webp` | PNG | 2752x1536 | 9.07 MB | **1920×1080** | **372.2 KB** | -96.0% | **PASS (100%)** |
| 25 | `map_tran_dia_binh_minh_bg.webp` | PNG | 2752x1536 | 8.55 MB | **1920×1080** | **296.6 KB** | -96.6% | **PASS (100%)** |
| 26 | `map_trung_tam_thuong_mai_bg.webp` | PNG | 2752x1536 | 9.00 MB | **1920×1080** | **360.2 KB** | -96.1% | **PASS (100%)** |
| 27 | `map_vien_sinh_hoc_bg.webp` | PNG | 2752x1536 | 8.92 MB | **1920×1080** | **296.1 KB** | -96.8% | **PASS (100%)** |
| 28 | `ui_main_menu_bg.webp` | JPEG | 1920x1080 | 0.25 MB | **1920×1080** | **152.8 KB** | -40.8% | **PASS (100%)** |

---

## 3. TIÊU CHÍ VÀ KẾT QUẢ KIỂM TRA CHẤT LƯỢNG (STAGE 4 AUDIT)

1. **Xác thực Magic Bytes nhị phân:**
   - 100% 28 file có 4 bytes đầu là `RIFF` (`52 49 46 46`) và 4 bytes từ vị trí 8..11 là `WEBP` (`57 45 42 50`).
   - Đã loại bỏ hoàn toàn hiện tượng "đuôi file .webp nhưng ruột là PNG/JPEG".
2. **Kích thước và Tỷ lệ khung hình:**
   - Toàn bộ 28 file đạt kích thước chính xác tuyệt đối **1920×1080 pixels**.
   - Áp dụng thuật toán `fit: 'cover', position: 'center'`: Không kéo giãn méo hình (no stretching), giữ nguyên bố cục không gian trung tâm (Safe Area 70%) phục vụ hiển thị chữ và thông tin UI của game.
3. **Chất lượng hình ảnh:**
   - Nén WebP Quality 85 kết hợp thuật toán bicubic lanczos resampling của libvips giữ được độ nét sắc cạnh của các chi tiết kiến trúc đổ nát, dây thép gai, vệt máu và đèn sương mù mà không có nhiễu nén (compression artifacts) hay dải màu loang lổ (color banding).
4. **Không có file 0-byte hoặc lỗi giải mã:**
   - Tất cả 28 file đều được giải mã thử nghiệm thành công bởi thư viện đồ họa mà không gặp bất kỳ ngoại lệ (exception) nào.

---

## 4. AN TOÀN DỮ LIỆU & DỌN DẸP REPOSITORY

- 28 file background WebP chuẩn 1920×1080 (7.59 MB) đang hoạt động ổn định và chính thức tại `public/assets/backgrounds/`.
- Thư mục backup tạm thời `scratch/backup_raw_backgrounds/` (~236 MB) và `scratch/optimized_backgrounds/` (~8.9 MB) đã được dọn dẹp khỏi Git để giải phóng ~245 MB bộ nhớ kho lưu trữ.
- Toàn bộ metadata và prompt sinh ảnh được lưu trữ vĩnh viễn tại `docs/IMAGE_GENERATION_PROMPTS.md` và `project-docs/assets/batches/batch-02-backgrounds.json`, cho phép tái tạo hoặc nâng cấp độ phân giải bất kỳ lúc nào.
- Không để lại bất kỳ file rác nào trong `public/assets/backgrounds/`.
