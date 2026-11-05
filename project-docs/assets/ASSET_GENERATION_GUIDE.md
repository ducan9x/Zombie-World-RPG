# HƯỚNG DẪN SINH VÀ QUẢN LÝ ASSET BẰNG AI (ASSET GENERATION GUIDE)
## DỰ ÁN: ZOMBIE WORLD RPG — STAGE 2A & 2B

Tài liệu này là quy chuẩn kỹ thuật vận hành dành cho đội ngũ phát triển để sinh hình ảnh bằng AI (Midjourney, Stable Diffusion XL, Google Imagen 3, DALL-E 3) và đưa asset vào game **Zombie World RPG** một cách đồng bộ, an toàn và tối ưu hiệu năng.

---

## 1. NGUYÊN TẮC THIẾT KẾ & ĐỒNG BỘ PHONG CÁCH (ART STYLE CONSISTENCY)

### 1.1. Phong cách chủ đạo (Art Style)
- **Tông mỹ thuật:** *Cinematic Dark Post-Apocalyptic Survival Horror RPG*.
- **Cảm hứng hình ảnh:** Gritty Realism pha trộn Painterly Digital Art (tương tự phong cách đồ họa *The Last of Us*, *Darkest Dungeon*, *S.T.A.L.K.E.R.*).
- **Màu sắc (Color Palette):**
  - Gam màu chủ đạo là trầm, khử bão hòa (Muted, Desaturated).
  - Màu nền bóng tối: Dark Slate (`#1a1a2e`, `#16213e`, `#0f3460`).
  - Điểm nhấn: Cam rỉ sét kim loại (Rust Orange), Đỏ máu khô (Dried Crimson), Xanh lục dạ quang đột biến sinh học (Bioluminescent Toxic Green).
- **Ánh sáng (Lighting):** Tương phản cao (Chiaroscuro), sương mù volumetric u ám, viền sáng kịch tính (Rim lighting).

### 1.2. Negative Prompt chuẩn cho toàn bộ dự án
Mỗi lần tạo prompt AI, bắt buộc phải đính kèm danh sách negative prompt chuẩn sau:
```text
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bright saturated cartoon, anime kawaii, cheerful, colorful, futuristic sci-fi, neon cyberpunk
```

---

## 2. QUY TẮC ĐẶT TÊN & ĐỊNH DANH (NAMING CONVENTION)

1. **Chuẩn ID:** `snake_case`, hoàn toàn viết thường, **không dấu tiếng Việt**, không dấu cách, không ký tự đặc biệt ngoài gạch dưới `_`.
2. **Tiền tố theo phân nhóm (Category Prefix):**
   - `ui_` : Thành phần giao diện chung (VD: `ui_game_logo`, `ui_panel_frame`, `ui_icon_hp`).
   - `map_` : Hình nền địa danh, bản đồ khám phá (VD: `map_lau_dai_tan_the_bg`, `map_benh_vien_ngoai_thanh_bg`).
   - `combat_` : Đấu trường chiến đấu (VD: `combat_bg_city`, `combat_bg_nest`).
   - `char_` : Chân dung người chơi và NPC (VD: `char_player_portrait`, `char_npc_v`).
   - `zombie_` : Sprite quái vật zombie thông thường (VD: `zombie_lang_dao`, `zombie_quan_canh`).
   - `boss_` : Sprite trùm Boss lớn (VD: `boss_zombie_king`, `boss_sea_monster`).
   - `vfx_` : Hiệu ứng chiến đấu hoặc biểu ngữ (VD: `vfx_hit_slash`, `vfx_blood_splatter`).
   - `item_` : Vật phẩm, vũ khí, thuốc men, trang bị (VD: `item_gun_rifle_m4a1`, `item_med_serum`).
   - `story_` : Tranh minh họa cốt truyện & CG kết thúc (VD: `story_cg_rocket_launch`, `story_cg_mermaid`).
3. **Quy tắc đường dẫn:** Tên file trên đĩa phải trùng khớp 100% với Asset ID trong manifest:
   - File WebP: `public/assets/<category>/<id>.webp`
   - File PNG: `public/assets/<category>/<id>.png`

---

## 3. QUY TẮC KÍCH THƯỚC & ĐỊNH DẠNG (DIMENSIONS & FORMATS)

| Loại Asset | Độ phân giải gốc | Tỷ lệ | Định dạng | Trong suốt (Alpha) | Vùng an toàn (Safe Area) & Cắt xén |
|---|---|:---:|:---:|:---:|---|
| **Background Bản đồ & Combat** | 1920x1080 | 16:9 | WebP | Không (`transparent: false`) | Safe area 70% trung tâm; cho phép crop 15% hai bên trên mobile. |
| **Story CG & Ending Art** | 1920x1080 | 16:9 | WebP | Không (`transparent: false`) | Hiển thị trọn vẹn (Letterbox / Contain), không crop mất chi tiết. |
| **Chân dung Nhân vật / NPC** | 512x512 | 1:1 | PNG | Có (`transparent: true`) | Neo ở đáy (Bottom-center), vùng ngực và đầu chiếm 85% khung hình. |
| **Zombie Quái vật Thường** | 512x512 | 1:1 | PNG | Có (`transparent: true`) | Toàn thân (Full body), đứng vững giữa khung, lề an toàn 5%. |
| **Boss / Trùm Khổng Lồ** | 1024x1024 | 1:1 | PNG | Có (`transparent: true`) | Toàn thân chi tiết cao, hào quang hoặc xúc tu không chạm viền biên. |
| **Icon Chỉ số & Tài nguyên** | 256x256 | 1:1 | PNG | Có (`transparent: true`) | Tâm icon ở chính giữa, viền an toàn 10% lề để co về 20x20px không vỡ. |
| **Vật phẩm & Trang bị (Item)** | 256x256 | 1:1 | PNG | Có (`transparent: true`) | Vũ khí nằm nghiêng góc 45 độ, thuốc và đồ ăn đặt chính diện. |
| **Hiệu ứng VFX** | 512x512 / 1024x1024 | 1:1 | PNG | Có (`transparent: true`) | Hạt ánh sáng / vết chém trong suốt, sẵn sàng cho Blend Mode Additive. |
| **Biểu ngữ (Banner)** | 1024x256 | 4:1 | PNG | Có (`transparent: true`) | Băng rôn kim loại kéo dài, chữ nằm gọn trong 80% chiều rộng. |

---

## 4. QUY TRÌNH XỬ LÝ NỀN TRONG SUỐT (TRANSPARENT BACKGROUND)

Các công cụ sinh ảnh AI thường tạo nền solid (trắng, đen, hoặc xám) ngay cả khi prompt có từ khóa `transparent background`. Quy trình hậu kỳ bắt buộc:

1. **Sinh ảnh với phông đơn sắc tương phản:**
   - Đối với vật thể tối màu (kim loại đen, súng, zombie da xám): Dùng nền xám trung tính (`#7f7f7f`) hoặc trắng studio.
   - Đối với hiệu ứng phát sáng (huyết thanh, tia đạn, phép hồi phục): Sinh trên nền đen thuần túy (`#000000`).
2. **Tách nền tự động / công cụ:**
   - Sử dụng mô hình tách nền AI (RMBG-1.4, rembg, BiRefNet, hoặc Photoshop Select Subject).
   - Kiểm tra kỹ các vùng kẽ tóc, tia máu, lưỡi dao nhọn, không để lại viền trắng (halo effect).
3. **Khử viền màu (Defringe):**
   - Áp dụng lệnh Layer > Matting > Defringe 1px để loại bỏ hoàn toàn viền màu nền dư thừa.

---

## 5. QUY TẮC NÉN & EXPORT FILE

1. **Công cụ nén đề xuất:**
   - `cwebp` (cho định dạng WebP).
   - `pngquant` hoặc `oxipng` (cho định dạng PNG).
2. **Thông số nén:**
   - **WebP Background:** Quality 85, Lossy, Method 6. Dung lượng mỗi ảnh nền không vượt quá **250 KB**.
   - **PNG Icon & Character:** 24-bit PNG + 8-bit Alpha. Dung lượng icon không vượt quá **80 KB**; Boss không quá **300 KB**.
3. **Metadata:** Xóa bỏ toàn bộ EXIF, ICC Profile không cần thiết và thông tin bản quyền camera để giảm dung lượng file.

---

## 6. CẬP NHẬT TRẠNG THÁI VÀO MANIFEST

Khi một hoặc nhiều ảnh đã được sinh và xử lý hậu kỳ thành công:

1. Mở file [`project-docs/assets/asset-manifest.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/asset-manifest.json).
2. Tìm đúng `id` của asset.
3. Thay đổi giá trị:
   ```json
   "status": "generated"   // Khi ảnh đã sinh xong và đặt đúng vị trí file
   ```
4. Đặt file hình ảnh vào đúng đường dẫn đã khai báo trong thuộc tính `"file"`. Ví dụ:
   `public/assets/icons/ui_icon_hp.png`

---

## 7. QUY TRÌNH KIỂM TRA TRƯỚC KHI TÍCH HỢP (PRE-INTEGRATION VERIFICATION)

Trước khi viết code nạp ảnh vào `js/pixi-renderer.js` hoặc `js/ui.js`, phải chạy các bước kiểm tra sau:

1. **Kiểm tra sự tồn tại trên ổ đĩa:**
   - File có tồn tại đúng đường dẫn không?
   - Kích thước tệp có lớn hơn 0 byte không?
2. **Kiểm tra độ phân giải & định dạng:**
   - Chiều rộng và chiều cao có đúng với `width` và `height` trong manifest không?
   - Alpha channel có hoạt động đúng không? (Đối với PNG transparent).
3. **Kiểm tra độ hiển thị thị giác:**
   - Icon có rõ ràng khi thu nhỏ xuống 24x24 px trên màn hình điện thoại không?
   - Background có bị mờ nhòe hay vỡ hạt khi phóng to 1920x1080 không?
   - Phong cách có bị lệch sang hoạt hình anime hoặc 3D hoạt họa không?

---

## 8. DANH MỤC THỬ NGHIỆM ĐẦU TIÊN (BATCH 01)

Đợt sinh ảnh đầu tiên được giới hạn trong file [`project-docs/assets/batches/batch-01-ui-icons.json`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/assets/batches/batch-01-ui-icons.json), bao gồm **13 asset cốt lõi (P0)**:
1. `ui_game_logo`: Logo tiêu đề game
2. `ui_icon_hp`: Trái tim sinh học
3. `ui_icon_sanity`: Bộ não xanh lam
4. `ui_icon_hunger`: Đùi thịt nướng
5. `ui_icon_hydration`: Giọt nước trong
6. `ui_icon_infection`: Biểu tượng Biohazard
7. `ui_icon_res_cigarette`: Bao thuốc lá sinh tồn
8. `ui_icon_res_royal_coin`: Tiền vàng hoàng gia Karen
9. `ui_icon_res_gasoline`: Can xăng quân đội
10. `ui_icon_backpack`: Balo dã ngoại
11. `ui_icon_melee_slot`: Ô trang bị cận chiến
12. `ui_icon_ranged_slot`: Ô trang bị tầm xa
13. `ui_placeholder_empty`: Khung ô vuông rỗng dự phòng

