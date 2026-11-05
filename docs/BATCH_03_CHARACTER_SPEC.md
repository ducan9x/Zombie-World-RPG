# ĐẶC TẢ CHI TIẾT TẠO ẢNH BATCH 03 — PLAYER APPEARANCE & STORY NPCS
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian cập nhật:** 2026-11-05 23:10:00 (ICT)  
**Phiên bản đặc tả:** v2.7 (Kết quả QA Audit toàn diện 36 ảnh: 15 COMPLETE, 21 REJECTED/PENDING)  
**Trạng thái kiểm tra QA:** `QA_AUDIT_FAILED` (15/36 Hợp lệ; 21/36 Lỗi alpha 0%, kích thước 1696×2528 hoặc tên file)

---

## 1. MỤC TIÊU VÀ PHẠM VI

Tài liệu này xác lập quy chuẩn đồ họa, danh mục manifest và prompt AI chuẩn hóa cho toàn bộ **Batch 03** của dự án Zombie World RPG.

Batch 03 gồm **36 asset nhân vật** được chia thành 2 nhóm độc lập:

1. **Nhóm A – Player Appearance (30 ảnh):** Hệ thống 30 tổ hợp ngoại hình người chơi được tạo sẵn (Pre-generated Character Assets) tương ứng với 3 thuộc tính lựa chọn trước khi bắt đầu trò chơi (5 Nhóm tuổi × 2 Giới tính × 3 Trang phục).
2. **Nhóm B – Story NPCs (6 ảnh):** 6 nhân vật cốt truyện ưu tiên cao nhất (P0) xuất hiện xuyên suốt các sự kiện, nhiệm vụ và hội thoại trong game.

### Nguyên tắc cốt lõi:
- **Tài nguyên tạo sẵn (Pre-generated Assets):** Người chơi chọn thuộc tính, hệ thống tự động tìm và tải ảnh tương ứng từ thư mục tĩnh.
- **100% Offline & Zero Runtime AI:** Tuyệt đối không sinh ảnh bằng AI trong lúc chơi, không gọi API ngoài, không phụ thuộc kết nối mạng.
- **Ảnh độc lập hoàn chỉnh:** Mỗi ảnh là một nhân vật toàn thân hoàn chỉnh, không ghép ảnh bằng code, không tái sử dụng bộ phận cơ thể.
- **Không thay đổi gameplay:** Toàn bộ logic chiến đấu, bản đồ, sự kiện, kho đồ và hội thoại giữ nguyên trạng 100%.
- **Chưa sinh ảnh ở giai đoạn này:** Chỉ chuẩn hóa đặc tả, manifest và prompt; sẵn sàng cho quy trình sinh ảnh AI tiếp theo.

---

## 2. QUY CHUẨN KỸ THUẬT CHUNG CHO TOÀN BỘ 36 ẢNH

Tất cả 36 ảnh (30 Player + 6 NPC) phải tuân thủ nghiêm ngặt cùng một tiêu chuẩn kỹ thuật:

| Tiêu chí | Quy chuẩn bắt buộc |
|---|---|
| **Kích thước** | **512 × 768 pixels** |
| **Tỷ lệ khung hình** | **2:3 (Aspect Ratio --ar 2:3)** |
| **Định dạng file** | **PNG 32-bit (True RGBA, kênh Alpha trong suốt)** |
| **Nền (Background)** | **100% trong suốt (Transparent Alpha)**, tuyệt đối không vẽ ô caro (checkerboard) giả nền trong suốt |
| **Góc nhìn & Bố cục** | **Toàn thân (Full Body)**: Hiển thị trọn vẹn từ đỉnh đầu đến giày/bốt, nhân vật đứng chính giữa khung hình |
| **Giới hạn khung hình** | Tuyệt đối **không cắt cụt đầu, bàn tay, chân** hoặc trang bị quan trọng |
| **Tư thế nhân vật** | Đứng tự nhiên, phong thái hơi cảnh giác, mắt quan sát phía trước |
| **Nền cảnh** | **Không có bất kỳ cảnh nền, phong cảnh, tường, đồ vật trang trí** phía sau nhân vật |
| **Văn bản & Ký hiệu** | Tuyệt đối **không có chữ, tên nhân vật, số liệu, thanh UI, logo hoặc watermark** |

### Phong cách mỹ thuật thống nhất:
- **Art Direction:** Dark Post-apocalyptic Survival RPG, semi-realistic 3D game character art.
- **Chất liệu:** Mô tả chân thực độ sờn rách của vải canvas, da cũ bạc màu, kim loại gỉ sét nhẹ, bụi bẩn, vết dầu mỡ và vết xước do mạt thế.
- **Ánh sáng:** Chiếu sáng điện ảnh góc xiên từ trên bên trái (cinematic rim lighting from top-left), tạo độ khối và chiều sâu rõ nét.
- **Bảng màu:** Màu sắc trầm, đằm và thực tế (xám bê tông, xanh rêu quân đội, nâu da cũ, đen khói, đỏ sẫm mờ).
- **Tính đồng bộ:** 30 ảnh Player và 6 ảnh NPC phải chia sẻ cùng phong cách mỹ thuật và mức độ chi tiết; không để Player mang phong cách khác biệt so với NPC.
- **Tuyệt đối cấm:** Phong cách anime kawaii, chibi, cartoon hoạt họa tươi sáng, phong cách sci-fi cyberpunk neon hay hiệp sĩ fantasy trung cổ rực rỡ.

---

## 3. NHÓM A: ĐẶC TẢ CHI TIẾT 30 ẢNH PLAYER APPEARANCE

### 3.1 Cấu trúc 3 thuộc tính lựa chọn

Hệ thống cho phép người chơi lựa chọn chính xác 3 thuộc tính:

#### 1. Nhóm tuổi (Age) – 5 lựa chọn:
- `teen`: Thanh thiếu niên (16-17 tuổi), nét mặt trẻ trung, vóc dáng gọn gàng, trang phục sinh tồn kín đáo phù hợp độ tuổi, không gợi cảm.
- `young_adult`: Thanh niên (22-25 tuổi), nét mặt kiên định rắn rỏi, vóc dáng thể thao năng động.
- `adult`: Trưởng thành (32-38 tuổi), nét mặt dày dạn sương gió, vóc dáng vững chãi từng trải.
- `middle_aged`: Trung niên (48-52 tuổi), khuôn mặt khắc khổ có nếp nhăn và râu/tóc điểm bạc, phong thái trầm tĩnh dày dạn.
- `elderly`: Cao tuổi (65-70 tuổi), nếp nhăn sâu, mái tóc bạc trắng, ánh mắt kiên nghị sắc sảo của người sống sót qua nhiều thập kỷ.

#### 2. Giới tính (Gender) – 2 lựa chọn:
- `male`: Nhân vật nam, đường nét khuôn mặt và vóc dáng nam tính tự nhiên.
- `female`: Nhân vật nữ, đường nét khuôn mặt và vóc dáng nữ tính tự nhiên, không cường điệu hóa hoặc tình dục hóa.

#### 3. Trang phục (Outfit) – 3 lựa chọn:
- `survivor` (Sinh tồn cơ bản): Áo khoác sinh tồn dã chiến cũ sờn rách nhẹ xắn tay, áo thun tối màu bên trong, quần túi hộp tiện dụng, bốt dã chiến, thắt lưng sinh tồn nhiều túi và bình nước nhỏ.
- `tactical` (Chiến thuật): Áo giáp nhẹ/tactical vest molle, áo combat dã chiến, quần chiến thuật gia cố đệm đầu gối, găng tay chiến thuật, bốt quân sự, không mang vũ khí quá khổ che khuất cơ thể.
- `casual` (Thường ngày): Trang phục dân sự đời thường hậu tận thế: áo hoodie hoặc áo sơ mi khoác ngoài bạc màu, quần jeans sờn rách, giày thể thao/dã ngoại cũ có vệt bụi đất.

### 3.2 Quy tắc lưu trữ & Đặt tên file

- **Thư mục lưu trữ:** `public/assets/characters/player/`
- **Quy tắc đặt tên:** `{age}_{gender}_{outfit}.png`

### 3.3 Danh sách 30 tổ hợp và Prompt tạo ảnh chuẩn hóa

Negative Prompt chung cho toàn bộ 30 Player:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic high-tech sci-fi, cyberpunk neon, superhero, deformed limbs, extra fingers, missing fingers, bad anatomy, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery, weapons blocking body
```

| STT | Mã Tổ Hợp (ID) | Độ Tuổi | Giới Tính | Trang Phục | Tên File (`public/assets/characters/player/`) | Prompt Chuẩn Hóa | Trạng Thái |
|:---:|---|---|---|---|---|---|:---:|
| 1 | `teen_male_survivor` | Thanh thiếu niên | Nam | Sinh tồn cơ bản | `teen_male_survivor.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 2 | `teen_male_tactical` | Thanh thiếu niên | Nam | Chiến thuật | `teen_male_tactical.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 3 | `teen_male_casual` | Thanh thiếu niên | Nam | Thường ngày | `teen_male_casual.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 4 | `teen_female_survivor` | Thanh thiếu niên | Nữ | Sinh tồn cơ bản | `teen_female_survivor.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 5 | `teen_female_tactical` | Thanh thiếu niên | Nữ | Chiến thuật | `teen_female_tactical.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 6 | `teen_female_casual` | Thanh thiếu niên | Nữ | Thường ngày | `teen_female_casual.png` | `Full-body character concept art of a teenage youth around 16-17 years old with youthful facial features, lean ...` | `COMPLETE` |
| 7 | `young_adult_male_survivor` | Thanh niên | Nam | Sinh tồn cơ bản | `young_adult_male_survivor.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `COMPLETE` |
| 8 | `young_adult_male_tactical` | Thanh niên | Nam | Chiến thuật | `young_adult_male_tactical.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `COMPLETE` |
| 9 | `young_adult_male_casual` | Thanh niên | Nam | Thường ngày | `young_adult_male_casual.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `REJECTED (0% Alpha)` |
| 10 | `young_adult_female_survivor` | Thanh niên | Nữ | Sinh tồn cơ bản | `young_adult_female_survivor.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `REJECTED (0% Alpha)` |
| 11 | `young_adult_female_tactical` | Thanh niên | Nữ | Chiến thuật | `young_adult_female_tactical.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `REJECTED (0% Alpha)` |
| 12 | `young_adult_female_casual` | Thanh niên | Nữ | Thường ngày | `young_adult_female_casual.png` | `Full-body character concept art of a young adult around 22-24 years old with determined sharp eyes and focused...` | `REJECTED (0% Alpha)` |
| 13 | `adult_male_survivor` | Trưởng thành | Nam | Sinh tồn cơ bản | `adult_male_survivor.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 14 | `adult_male_tactical` | Trưởng thành | Nam | Chiến thuật | `adult_male_tactical.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 15 | `adult_male_casual` | Trưởng thành | Nam | Thường ngày | `adult_male_casual.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 16 | `adult_female_survivor` | Trưởng thành | Nữ | Sinh tồn cơ bản | `adult_female_survivor.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 17 | `adult_female_tactical` | Trưởng thành | Nữ | Chiến thuật | `adult_female_tactical.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 18 | `adult_female_casual` | Trưởng thành | Nữ | Thường ngày | `adult_female_casual.png` | `Full-body character concept art of a battle-hardened adult around 35 years old with weathered experienced faci...` | `REJECTED (0% Alpha)` |
| 19 | `middle_aged_male_survivor` | Trung niên | Nam | Sinh tồn cơ bản | `middle_aged_male_survivor.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `REJECTED (0% Alpha)` |
| 20 | `middle_aged_male_tactical` | Trung niên | Nam | Chiến thuật | `middle_aged_male_tactical.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `REJECTED (0% Alpha)` |
| 21 | `middle_aged_male_casual` | Trung niên | Nam | Thường ngày | `middle_aged_male_casual.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `COMPLETE` |
| 22 | `middle_aged_female_survivor` | Trung niên | Nữ | Sinh tồn cơ bản | `middle_aged_female_survivor.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `COMPLETE` |
| 23 | `middle_aged_female_tactical` | Trung niên | Nữ | Chiến thuật | `middle_aged_female_tactical.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `COMPLETE` |
| 24 | `middle_aged_female_casual` | Trung niên | Nữ | Thường ngày | `middle_aged_female_casual.png` | `Full-body character concept art of a middle-aged survivor around 50 years old with rugged weathered face, prom...` | `COMPLETE` |
| 25 | `elderly_male_survivor` | Cao tuổi | Nam | Sinh tồn cơ bản | `elderly_male_survivor.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `COMPLETE` |
| 26 | `elderly_male_tactical` | Cao tuổi | Nam | Chiến thuật | `elderly_male_tactical.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `COMPLETE` |
| 27 | `elderly_male_casual` | Cao tuổi | Nam | Thường ngày | `elderly_male_casual.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `COMPLETE` |
| 28 | `elderly_female_survivor` | Cao tuổi | Nữ | Sinh tồn cơ bản | `elderly_female_survivor.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `REJECTED (1696x2528)` |
| 29 | `elderly_female_tactical` | Cao tuổi | Nữ | Chiến thuật | `elderly_female_tactical.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `REJECTED (1696x2528)` |
| 30 | `elderly_female_casual` | Cao tuổi | Nữ | Thường ngày | `elderly_female_casual.png` | `Full-body character concept art of a elderly veteran survivor around 65-70 years old with deep facial wrinkles...` | `REJECTED (1696x2528)` |

---

## 4. NHÓM B: ĐẶC TẢ CHI TIẾT 6 STORY NPCS

- **Thư mục lưu trữ:** `public/assets/characters/npc/`
- **Quy tắc đặt tên:** `{filename}`

Negative Prompt chung cho toàn bộ 6 NPC:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

### 4.1 Cô V (`npc_co_v.png`)

- **ID Manifest:** `char_npc_v`
- **ID Entity trong Source:** `v`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_co_v.png`
- **Vị trí xuất hiện trong game:** Tiền đồn Bình Minh (Dawn Outpost)
- **Vai trò cốt truyện:** Nữ sát thủ đơn độc, người dẫn dắt huấn luyện chiến đấu tại Tiền đồn Bình Minh
- **Mô tả nhận diện:** Nữ sát thủ lạnh lùng, ít nói, trang phục thực dụng phù hợp cận chiến, dao găm là phụ kiện nhận diện đặc trưng, phong thái cảnh giác cao độ.
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of Sister V (Cô V), a deadly and solitary female post-apocalyptic assassin, standing in an agile ready alert posture, woman around 28 years old with short messy black bob hair, sharp piercing cold dark eyes, small faint scar across cheek, wearing a dark weathered tactical combat vest over a dark gray undershirt, reinforced cargo pants, combat boots, holding a signature survival combat dagger in her gloved hand with knife sheath on hip, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D digital illustration, clean silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
### 4.2 Tiểu Hàm (`npc_tieu_ham.png`)

- **ID Manifest:** `char_npc_xiaohan`
- **ID Entity trong Source:** `xiaohan`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_tieu_ham.png`
- **Vị trí xuất hiện trong game:** Doanh địa Người Sống Sót (Survivor Camp)
- **Vai trò cốt truyện:** Nữ y tá dã chiến trẻ tuổi tại Doanh địa người sống sót, phụ trách cứu trợ y tế
- **Mô tả nhận diện:** Nữ y tá trẻ tuổi với nụ cười ấm áp, trang phục y tế dã chiến, túi cứu thương và dụng cụ y tế bên người, phong thái thân thiện, luôn quan tâm chăm sóc người khác.
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of Xiao Han (Tiểu Hàm), a kind-hearted young female field medic in a post-apocalyptic survivor camp, standing in a gentle yet prepared posture with a warm compassionate smile, young woman around 22 years old with neat shoulder-length dark hair tied back, wearing a practical rugged field nurse uniform, faded olive and white medic jacket with red cross armband, dark trousers, utility boots, carrying a leather medical trauma kit bag across shoulder with visible bandages and medical instruments, dark survival horror RPG aesthetic, semi-realistic digital illustration, clean sharp silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
### 4.3 Lili (`npc_lili.png`)

- **ID Manifest:** `char_npc_lili`
- **ID Entity trong Source:** `lili`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_lili.png`
- **Vị trí xuất hiện trong game:** Khu Công Nghiệp / Doanh Địa
- **Vai trò cốt truyện:** Nữ thợ máy cơ khí và công nghệ tại Khu Công Nghiệp / Doanh Địa
- **Mô tả nhận diện:** Nữ thợ máy phong cách tomboy tinh nghịch, trang phục lao động cơ khí bám dầu mỡ, kính bảo hộ trên trán, phụ kiện cờ lê/kìm búa, phong thái tự tin nhanh nhẹn.
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of Lili, an energetic spunky female mechanic and engineer in a post-apocalyptic world, standing in a confident relaxed tomboy pose resting an adjustable wrench on her shoulder, young woman around 24 years old with short spiky auburn hair with protective goggles pushed up on forehead, smudge of dark grease on her cheek, wearing a heavy-duty denim mechanic jumpsuit with top half tied around waist over a fitted grey work tank-top, reinforced leather work boots, tool belt with pliers, screwdrivers, and measuring tape, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D digital illustration, isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
### 4.4 Mục Miêu Miêu (`npc_muc_mieu_mieu.png`)

- **ID Manifest:** `char_npc_mumiao`
- **ID Entity trong Source:** `mumiao`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_muc_mieu_mieu.png`
- **Vị trí xuất hiện trong game:** Trung tâm thành phố / Các khu vực đổ nát
- **Vai trò cốt truyện:** Nữ trinh sát đô thị bí ẩn, người dẫn dắt thông tin và nhiệm vụ trinh sát mạt thế
- **Mô tả nhận diện:** Nữ trinh sát đô thị bí ẩn, chiếc mũ rộng vành che khuất một phần khuôn mặt, áo măng tô dã chiến, bộ đàm và ống nhòm trinh sát, phong thái kín đáo khó đoán.
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of Mu Miaomiao (Mục Miêu Miêu), a mysterious and elusive female urban scout, standing in a quiet alert posture, young woman in her mid-20s wearing an iconic wide-brim dark weather-beaten fedora hat casting shadow over part of her observant face, worn long trench coat over dark tactical gear, rugged boots, tactical radio transceiver with shoulder antenna on her harness, binoculars strapped to chest, dark cinematic survival RPG aesthetic, semi-realistic digital art, clean silhouette isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
### 4.5 Vua Karen (`npc_vua_karen.png`)

- **ID Manifest:** `char_npc_vua_karen`
- **ID Entity trong Source:** `king_boss`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_vua_karen.png`
- **Vị trí xuất hiện trong game:** Lâu Đài Tận Thế (Doom Castle)
- **Vai trò cốt truyện:** Cựu trùm bất động sản, bạo chúa phong kiến thống trị Lâu đài Mạt thế (Doom Castle)
- **Mô tả nhận diện:** Cựu trùm bất động sản xây dựng đế chế độc tài mạt thế, trang phục quyền lực xa xỉ mang dấu ấn hậu tận thế, phong thái ngạo mạn, tàn bạo, độc đoán (không phải vua fantasy thời trung cổ).
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of King Karen (Vua Karen), the ruthless former real estate tycoon turned apocalyptic warlord of the Doom Castle, standing in an arrogant imposing stance, middle-aged man around 50 with slicked graying hair, manicured beard, and cold haughty sneer, wearing opulent yet post-apocalyptic attire: a tailored dark velvet warlord trench coat with tarnished gold embroidery and dark fur collar over a reinforced concealed ballistic vest, expensive signet rings on leather-gloved hands, polished high-end leather officer boots, ornate walking cane with gilded eagle pommel, dark survival RPG aesthetic, semi-realistic 3D game character art, NOT medieval fantasy, isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
### 4.6 Tiến Sĩ Trần (`npc_tien_si_tran.png`)

- **ID Manifest:** `char_npc_tien_si_tran`
- **ID Entity trong Source:** `doctor_boss`
- **Đường dẫn file đích:** `public/assets/characters/npc/npc_tien_si_tran.png`
- **Vị trí xuất hiện trong game:** Viện Sinh Học / Trạm Phóng Vũ Trụ Tuyệt Mật
- **Vai trò cốt truyện:** Nhà khoa học trưởng Viện Sinh Học, người nắm giữ bí mật nguồn gốc virus và kế hoạch thoát hiểm
- **Mô tả nhận diện:** Nhà khoa học nghiên cứu virus mang gánh nặng tội lỗi, áo choàng blouse phòng thí nghiệm rách sờn, găng tay bảo hộ và mẫu phẩm virus sinh học, phong thái thông minh, mệt mỏi, tuyệt vọng (là con người, không phải zombie/quái vật).
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character concept art of Dr. Tran (Tiến Sĩ Trần), a brilliant, weary, guilt-ridden virologist who holds the secrets of the zombie outbreak, standing in a slightly stooped, tense posture holding a glowing bio-sample vial and a digital research tablet, man in his early 50s with disheveled graying hair and tired hollow eyes behind wire-rimmed glasses, wearing a weathered stained white laboratory coat over tactical survival clothes and bio-hazard apron, heavy rubberized safety gloves and field boots, NOT a zombie, human scientist aesthetic, dark survival horror RPG, semi-realistic digital illustration, isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
```

#### AI Negative Prompt:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
```

---
## 5. TỔNG KẾT BẢNG MANIFEST BATCH 03

| Nhóm | Số Lượng Asset | Thư Mục Lưu Trữ | Kích Thước | Định Dạng | Tỷ Lệ | Trạng Thái Hiện Tại |
|---|:---:|---|:---:|:---:|:---:|:---:|
| **Nhóm A: Player** | 30 | `public/assets/characters/player/` | 512 × 768 px | PNG RGBA Transparent | 2:3 | `PENDING` |
| **Nhóm B: Story NPC** | 6 | `public/assets/characters/npc/` | 512 × 768 px | PNG RGBA Transparent | 2:3 | `PENDING` |
| **TỔNG BATCH 03** | **36** | `public/assets/characters/` | 512 × 768 px | PNG RGBA Transparent | 2:3 | **36 PENDING** |

---

## 6. QUY TẮC TRIỂN KHAI VÀ HƯỚNG DẪN BƯỚC TIẾP THEO

1. **Giai đoạn chuẩn bị (Hiện tại):**
   - Đã cấu hình và kiểm thử thành công hệ thống lựa chọn ngoại hình trên UI (`index.html`, `js/ui.js`, `js/state.js`).
   - Đã đồng bộ toàn bộ 36 bản ghi trong `batch-03-characters.json`, `player-appearance-manifest.json`, và `asset-manifest.json`.
   - Các thư mục đích `public/assets/characters/player/` và `public/assets/characters/npc/` đã sẵn sàng.
2. **Giai đoạn sinh ảnh (Bước tiếp theo):**
   - Khi tiến hành sinh ảnh, sử dụng chính xác các prompt và negative prompt chuẩn hóa trong tài liệu này.
   - Kiểm tra kỹ kênh Alpha trong suốt, đảm bảo ảnh không bị dính ô caro xám-trắng giả lập nền transparent.
   - Lưu đúng kích thước 512 × 768 px và đúng tên file quy định.
   - Sau khi tải ảnh vào thư mục, hệ thống UI và PixiJS sẽ tự động nhận diện và hiển thị ảnh thực tế mà không cần chỉnh sửa source code.
