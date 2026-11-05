# BÁO CÁO KHỞI TẠO VÀ XỬ LÝ ASSET BATCH 02 – BACKGROUNDS & LOCATIONS

**Dự án:** Zombie World RPG  
**Giai đoạn:** Stage 2B — Asset Generation (Batch 02: Backgrounds & Locations)  
**Thời gian lập báo cáo:** 2026-11-05 14:07:00 (ICT) / 07:07:00 (UTC)  
**Tập tin danh mục:** [`project-docs/assets/batches/batch-02-backgrounds.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/batches/batch-02-backgrounds.json)  
**Trạng thái tổng thể:** **QUOTA EXHAUSTED (HẠN NGẠCH API TẠM KHÓA)**

---

## 1. Tổng quan số lượng Asset Batch 02

Batch 02 được khởi tạo để xử lý toàn bộ các hình nền bản đồ thế giới và đấu trường chiến đấu còn lại trong [`project-docs/assets/asset-manifest.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/asset-manifest.json).

- **Tổng số asset trong Batch 02:** **27 asset**
  - **Nhóm P0 (Bản đồ cốt lõi & Đấu trường chính):** **9 asset**
  - **Nhóm P1 (Bản đồ khám phá & Sinh tồn):** **13 asset**
  - **Nhóm P2 (Địa điểm phụ & Vùng ven):** **5 asset**
- **Đã tạo thành công đợt này:** **0 / 27**
- **Đã tồn tại trước đó:**
  - `ui_bg_fallback` (`public/image/hinh_nen.webp` — 2732×1534 WebP, backup tại `public/assets/backup/hinh_nen_backup.webp`)
  - `ui_main_menu_bg` (`public/assets/backgrounds/ui_main_menu_bg.webp` — 1920×1080 WebP, đã nghiệm thu ở tác vụ trước)
- **Tạm hoãn / Chặn bởi Quota:** **27 / 27 asset** (giữ nguyên trạng thái `"pending"` theo quy tắc bảo đảm tính trung thực của Manifest).

---

## 2. Nhật ký thực thi và Nguyên nhân lỗi

Theo quy trình chuẩn tại Mục 5:
1. Đã khởi tạo file danh mục [`batch-02-backgrounds.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/batches/batch-02-backgrounds.json) với đầy đủ 27 asset được trích xuất từ master manifest.
2. Đã kích hoạt Subagent Image Generator cho asset P0 đầu tiên:
   - **Asset ID:** `map_lau_dai_tan_the_bg`
   - **Đích xuất file:** `public/assets/backgrounds/map_lau_dai_tan_the_bg.webp`
   - **Kích thước mục tiêu:** 1920×1080 (16:9)
3. **Phản hồi từ Subagent / API:**
   - **Mã lỗi:** `429 RESOURCE_EXHAUSTED` (Quota exceeded cho mô hình `gemini-3.1-flash-image`).
   - **Thời điểm mở lại hạn ngạch dự kiến:** `2026-11-05T09:57:58Z` (khoảng 16:57:58 theo giờ Việt Nam ICT, tức sau khoảng 2 giờ 50 phút).
4. **Biện pháp xử lý tuân thủ quy tắc:**
   - Tuyệt đối không đánh dấu `generated` cho các asset chưa sinh được file thực tế.
   - Không can thiệp source code, logic gameplay, PixiJS renderer hoặc DOM UI.

---

## 3. Danh sách 27 Asset trong Hàng đợi Batch 02 (Pending Queue)

### Nhóm Ưu tiên P0 (9 Asset)

| STT | Asset ID | Tên bối cảnh | File dự kiến | Kích thước | Tỷ lệ |
|---|---|---|---|:---:|:---:|
| 1 | `map_lau_dai_tan_the_bg` | Lâu đài Karen Tận thế | `public/assets/backgrounds/map_lau_dai_tan_the_bg.webp` | 1920×1080 | 16:9 |
| 2 | `map_tran_dia_binh_minh_bg` | Doanh trại tiền đồn Đợi Sáng | `public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp` | 1920×1080 | 16:9 |
| 3 | `map_benh_vien_ngoai_thanh_bg` | Bệnh viện ngoại thành hoang phế | `public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp` | 1920×1080 | 16:9 |
| 4 | `map_tram_kiem_tra_quan_du_bg` | Trạm kiểm soát quân sự rỉ sét | `public/assets/backgrounds/map_tram_kiem_tra_quan_du_bg.webp` | 1920×1080 | 16:9 |
| 5 | `map_vien_sinh_hoc_bg` | Viện nghiên cứu sinh học đổ nát | `public/assets/backgrounds/map_vien_sinh_hoc_bg.webp` | 1920×1080 | 16:9 |
| 6 | `map_to_zombie_bg` | Tổ Zombie chúa đỏ rực | `public/assets/backgrounds/map_to_zombie_bg.webp` | 1920×1080 | 16:9 |
| 7 | `map_co_so_vu_tru_tuyet_mat_bg` | Bệ phóng căn cứ vũ trụ bí mật | `public/assets/backgrounds/map_co_so_vu_tru_tuyet_mat_bg.webp` | 1920×1080 | 16:9 |
| 8 | `combat_bg_city` | Đấu trường đường phố đô thị hoang tàn | `public/assets/backgrounds/combat_bg_city.webp` | 1920×1080 | 16:9 |
| 9 | `combat_bg_nest` | Đấu trường trung tâm tổ quái vật | `public/assets/backgrounds/combat_bg_nest.webp` | 1920×1080 | 16:9 |

### Nhóm Ưu tiên P1 (13 Asset)

| STT | Asset ID | Tên bối cảnh | File dự kiến | Kích thước | Tỷ lệ |
|---|---|---|---|:---:|:---:|
| 10 | `map_khu_dich_vu_cao_toc_bg` | Trạm dừng chân cao tốc đổ nát | `public/assets/backgrounds/map_khu_dich_vu_cao_toc_bg.webp` | 1920×1080 | 16:9 |
| 11 | `map_thanh_pho_dai_hoc_bg` | Khuôn viên đại học hoang phế | `public/assets/backgrounds/map_thanh_pho_dai_hoc_bg.webp` | 1920×1080 | 16:9 |
| 12 | `map_tram_xang_bo_roi_bg` | Trạm xăng rỉ sét ven đường | `public/assets/backgrounds/map_tram_xang_bo_roi_bg.webp` | 1920×1080 | 16:9 |
| 13 | `map_trung_tam_thuong_mai_bg` | Trung tâm thương mại vỡ nát | `public/assets/backgrounds/map_trung_tam_thuong_mai_bg.webp` | 1920×1080 | 16:9 |
| 14 | `map_khu_dan_cu_cu_bg` | Khu tập thể chung cư cũ sụp đổ | `public/assets/backgrounds/map_khu_dan_cu_cu_bg.webp` | 1920×1080 | 16:9 |
| 15 | `map_khu_cong_nghiep_bg` | Khu công nghiệp khói bụi hoang tàn | `public/assets/backgrounds/map_khu_cong_nghiep_bg.webp` | 1920×1080 | 16:9 |
| 16 | `map_cang_ben_song_bg` | Bến cảng sông tàu thuyền mục nát | `public/assets/backgrounds/map_cang_ben_song_bg.webp` | 1920×1080 | 16:9 |
| 17 | `map_sieu_thi_kho_bg` | Siêu thị kho hàng bị cướp bóc | `public/assets/backgrounds/map_sieu_thi_kho_bg.webp` | 1920×1080 | 16:9 |
| 18 | `map_canh_sat_bo_roi_bg` | Đồn cảnh sát bỏ hoang kính vỡ | `public/assets/backgrounds/map_canh_sat_bo_roi_bg.webp` | 1920×1080 | 16:9 |
| 19 | `map_ham_tau_dien_ngam_bg` | Hầm ngầm đường sắt tăm tối | `public/assets/backgrounds/map_ham_tau_dien_ngam_bg.webp` | 1920×1080 | 16:9 |
| 20 | `map_dao_nho_bg` | Đảo nhỏ ngoài khơi hoang sơ | `public/assets/backgrounds/map_dao_nho_bg.webp` | 1920×1080 | 16:9 |
| 21 | `combat_bg_interior` | Đấu trường nội thất tòa nhà hoang | `public/assets/backgrounds/combat_bg_interior.webp` | 1920×1080 | 16:9 |
| 22 | `combat_bg_sea` | Đấu trường boong tàu / sương mù biển | `public/assets/backgrounds/combat_bg_sea.webp` | 1920×1080 | 16:9 |

### Nhóm Ưu tiên P2 (5 Asset)

| STT | Asset ID | Tên bối cảnh | File dự kiến | Kích thước | Tỷ lệ |
|---|---|---|---|:---:|:---:|
| 23 | `map_thap_canh_bo_roi_bg` | Tháp quan sát trên đồi | `public/assets/backgrounds/map_thap_canh_bo_roi_bg.webp` | 1920×1080 | 16:9 |
| 24 | `map_nha_kho_nong_thon_bg` | Nhà kho nông trại vách gỗ mục | `public/assets/backgrounds/map_nha_kho_nong_thon_bg.webp` | 1920×1080 | 16:9 |
| 25 | `map_lang_nong_trai_nui_bg` | Thôn bản chân núi âm u | `public/assets/backgrounds/map_lang_nong_trai_nui_bg.webp` | 1920×1080 | 16:9 |
| 26 | `map_cam_trai_ben_song_bg` | Bãi cắm trại dã ngoại bỏ rơi | `public/assets/backgrounds/map_cam_trai_ben_song_bg.webp` | 1920×1080 | 16:9 |
| 27 | `map_nha_kho_nha_may_bg` | Kho chứa xưởng cơ khí rỉ sét | `public/assets/backgrounds/map_nha_kho_nha_may_bg.webp` | 1920×1080 | 16:9 |

---

## 4. Kế hoạch hành động khi Quota phục hồi

1. **Thời điểm kích hoạt lại:** Sau `09:57:58Z` (tức sau 17:00 giờ Việt Nam).
2. **Thứ tự sinh ảnh:**
   - Chạy 3 asset P0 đầu tiên (`map_lau_dai_tan_the_bg`, `map_tran_dia_binh_minh_bg`, `map_benh_vien_ngoai_thanh_bg`).
   - Kiểm tra kích thước (1920×1080), tỷ lệ (16:9), định dạng (WebP) qua bộ xử lý `scratch/ResizeBackground.cs`.
   - Cập nhật trạng thái từng asset từ `pending` sang `generated` chỉ sau khi xác minh file tồn tại hợp lệ trên đĩa.
   - Tiếp tục tuần tự cho đến khi hoàn tất 27 background của Batch 02.

