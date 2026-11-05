# BÁO CÁO TIẾN ĐỘ: TẠO LẠI HÌNH NỀN GAME (BACKGROUND REGENERATION REPORT)
## DỰ ÁN: ZOMBIE WORLD RPG — BỐI CẢNH MẠT THẾ ĐIỆN ẢNH (CINEMATIC BACKGROUNDS)

Báo cáo này tổng kết việc thực thi quy trình tạo lại và chuẩn hóa toàn bộ các hình nền môi trường (World Maps & Combat Arenas) cho dự án **Zombie World RPG** theo các quy tắc nghệ thuật và kỹ thuật đã đề ra.

---

## 1. TỔNG QUAN TIẾN ĐỘ BACKGROUND

- **Tổng số background trong hệ thống:** **29** asset.
- **Background nền tảng có sẵn:** **1** (`ui_bg_fallback` tại `public/image/hinh_nen.webp` - đã được sao lưu an toàn).
- **Background đã tạo thành công trong đợt này:** **1** (`ui_main_menu_bg` tại `public/assets/backgrounds/ui_main_menu_bg.webp`).
- **Background tạm hoãn do giới hạn Quota API:** **27** asset (chi tiết tại Mục 4).

---

## 2. DANH SÁCH BACKGROUND ĐÃ XÁC MINH VÀ LƯU THỰC TẾ

| # | Asset ID | Tên bối cảnh | Vị trí file lưu trên đĩa | Kích thước | Dung lượng | Tỷ lệ | Trạng thái kỹ thuật |
|---|---|---|---|:---:|:---:|:---:|:---:|
| 1 | `ui_bg_fallback` | Hình nền dự phòng toàn cục | `public/image/hinh_nen.webp`<br>*(Bản sao lưu: `public/assets/backup/hinh_nen_backup.webp`)* | 2732 × 1534 | 1.15 MB | ~16:9 | **Đã bảo toàn & Backup** |
| 2 | `ui_main_menu_bg` | Cổng căn cứ mạt thế (Main Menu & Title) | `public/assets/backgrounds/ui_main_menu_bg.webp` | **1920 × 1080** | **264.468 bytes (~258 KB)** | 16:9 | **Đạt chuẩn (Generated)** |

### Đặc điểm mỹ thuật của `ui_main_menu_bg`:
- **Bối cảnh:** Cổng căn cứ người sống sót gia cố bằng thép sóng rỉ sét, rào bê tông chống nổ và dây thép gai lúc chạng vạng. Đèn pha rọi qua màn sương mù độc hại, phía xa là hình bóng thành phố đổ nát.
- **Bố cục:** Tỷ lệ chuẩn 16:9 điện ảnh (1920x1080), không chứa nhân vật nổi bật hay chữ text/watermark, vùng trung tâm thoáng đãng đảm bảo hiển thị rõ ràng giao diện Menu và cài đặt tên người chơi.

---

## 3. THÔNG BÁO KỸ THUẬT: GIỚI HẠN QUOTA SINH ẢNH AI (QUOTA EXHAUSTED)

Trong quá trình khởi tạo chuỗi 28 hình nền bối cảnh, hệ thống AI Image Generator đã kích hoạt giới hạn tần suất/hạn ngạch của nhà cung cấp dịch vụ:

- **Mã lỗi ghi nhận:** `429 RESOURCE_EXHAUSTED` (Quota exceeded).
- **Mô hình tạo ảnh:** `gemini-3.1-flash-image`.
- **Thời điểm hạn ngạch hồi phục dự kiến:** `2026-11-05T09:57:58Z` (khoảng ~4 giờ 20 phút kể từ thời điểm tạo).
- **Biện pháp tuân thủ:** Tuân thủ nghiêm ngặt nguyên tắc **"Không đánh dấu generated khi file chưa tồn tại"** và **"Báo lỗi rõ ràng nếu không thể tạo ảnh"**, toàn bộ 27 background còn lại được giữ nguyên trạng thái `"pending"` trong manifest để tiếp tục xử lý khi quota hồi phục.

---

## 4. DANH SÁCH 27 BACKGROUND ĐANG CHỜ QUOTA (PENDING QUEUE)

Toàn bộ 27 asset dưới đây đã được cấu hình đầy đủ prompt mỹ thuật chi tiết, negative prompt và kích thước chuẩn 1920x1080 trong [`project-docs/assets/asset-manifest.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/asset-manifest.json):

### Nhóm Bản Đồ Trọng Điểm (P0):
1. `map_lau_dai_tan_the_bg` (`public/assets/backgrounds/map_lau_dai_tan_the_bg.webp`) — Lâu đài gothic bọc thép của Quốc vương Karen.
2. `map_tran_dia_binh_minh_bg` (`public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp`) — Doanh trại quân sự tiền đồn Đợi Sáng.
3. `map_benh_vien_ngoai_thanh_bg` (`public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp`) — Hành lang bệnh viện dã chiến u ám.
4. `map_tram_kiem_tra_quan_du_bg` (`public/assets/backgrounds/map_tram_kiem_tra_quan_du_bg.webp`) — Trạm kiểm soát cao tốc bọc thép rỉ sét.
5. `map_vien_sinh_hoc_bg` (`public/assets/backgrounds/map_vien_sinh_hoc_bg.webp`) — Phòng thí nghiệm sinh học đổ nát phát ánh sáng lục.
6. `map_to_zombie_bg` (`public/assets/backgrounds/map_to_zombie_bg.webp`) — Hang ổ zombie ngầm kén nhầy hữu cơ.
7. `map_co_so_vu_tru_tuyet_mat_bg` (`public/assets/backgrounds/map_co_so_vu_tru_tuyet_mat_bg.webp`) — Bệ phóng tên lửa khổng lồ giữa sa mạc.
8. `combat_bg_city` (`public/assets/backgrounds/combat_bg_city.webp`) — Đấu trường ngã tư đường phố đổ nát khói lửa.
9. `combat_bg_nest` (`public/assets/backgrounds/combat_bg_nest.webp`) — Đấu trường hang ổ Boss Thi Vương Tịch Diệt.

### Nhóm Bản Đồ Khám Phá & Đấu Trường (P1):
10. `map_khu_dich_vu_cao_toc_bg` — Trạm dừng nghỉ cao tốc xe cháy dồn toa.
11. `map_thanh_pho_dai_hoc_bg` — Khuôn viên đại học đổ nát, vết máu trên cột đá.
12. `map_tram_xang_bo_roi_bg` — Trạm xăng hoang vắng mái che sập một góc.
13. `map_trung_tam_thuong_mai_bg` — Trung tâm thương mại mái kính vỡ toang.
14. `map_khu_dan_cu_cu_bg` — Khu chung cư tập thể cũ nứt toác.
15. `map_khu_cong_nghiep_bg` — Khu công nghiệp nặng ống khói gãy gập.
16. `map_cang_ben_song_bg` — Bến cảng sông nước đục và cần cẩu rỉ sét.
17. `map_sieu_thi_kho_bg` — Siêu thị kho bán sỉ giá kệ trơ trọi.
18. `map_canh_sat_bo_roi_bg` — Đồn cảnh sát rào kẽm gai dã chiến.
19. `map_ham_tau_dien_ngam_bg` — Ga tàu điện ngầm ngập nước đen ngòm.
20. `map_dao_nho_bg` — Bến cảng đảo đá mờ sương và ngõ đèn neon.
21. `combat_bg_interior` — Đấu trường hành lang trong nhà âm u.
22. `combat_bg_sea` — Đấu trường biển sâu bão tố lúc nửa đêm.

### Nhóm Bản Đồ Hoang Dã Phụ Trợ (P2):
23. `map_thap_canh_bo_roi_bg` — Tháp quan sát trên đỉnh núi đá trơ trọi.
24. `map_nha_kho_nong_thon_bg` — Kho thóc gỗ mục nát giữa đồng khô cằn.
25. `map_lang_nong_trai_nui_bg` — Ngôi làng chân vách đá sụp đổ.
26. `map_cam_trai_ben_song_bg` — Lều trại rách nát bên bờ sông.
27. `map_nha_kho_nha_may_bg` — Kho phụ tùng máy móc tối tăm ánh trăng chiếu.

---

## 5. KẾ HOẠCH BƯỚC TIẾP THEO

1. **Giai đoạn hiện tại:** Game tiếp tục sử dụng `public/image/hinh_nen.webp` (đã sao lưu) làm hình nền fallback và `public/assets/backgrounds/ui_main_menu_bg.webp` cho Menu chính. Cơ chế fallback của PixiJS Renderer (Stage 1) đảm bảo các màn chơi chưa có background riêng vẫn hoạt động trơn tru không lỗi.
2. **Kích hoạt đợt tiếp theo:** Ngay khi hạn ngạch Image Generation được hồi phục, quy trình sinh ảnh sẽ tiếp tục chạy tuần tự cho 9 bối cảnh P0 trước, sau đó là 13 bối cảnh P1 và 5 bối cảnh P2.
3. **Bảo toàn dữ liệu:** Không thay đổi bất kỳ file gameplay, logic chiến đấu hay các asset icon đã tạo thành công trong Batch 01.

