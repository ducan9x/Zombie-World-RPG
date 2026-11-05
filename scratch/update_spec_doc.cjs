const fs = require('fs');

let doc = fs.readFileSync('docs/BATCH_03_CHARACTER_SPEC.md', 'utf8');

// Replace header info
doc = doc.replace('**Phiên bản đặc tả:** v1.0', '**Phiên bản đặc tả:** v2.0 (Cập nhật 30 tổ hợp ngoại hình Player)');
doc = doc.replace('Batch 03 tập trung vào **7 nhân vật cốt lõi ưu tiên số 1 (P0)**', 'Batch 03 tập trung vào **30 tổ hợp ngoại hình Người chơi (Player)** và **6 Story NPC cốt lõi ưu tiên số 1 (P0)**');

// Update summary table
const oldTable = `| STT | Tên Nhân Vật | ID Entity Source | Tên File Dự Kiến | Kích Thước | Định Dạng | Nền Trong Suốt | Mức Độ Khảo Sát | Trạng Thái |
|---|---|---|---|:---:|:---:|:---:|---|:---:|
| 1 | **Nhân Vật Chính** | \`player\` | \`player_character.png\` | 512×768 | PNG RGBA | Có | Đủ vai trò (Tạo hình trung tính) | \`PENDING_GENERATION\` |
| 2 | **Cô V** | \`v\` | \`npc_co_v.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Sát thủ dao găm) | \`PENDING_GENERATION\` |
| 3 | **Tiểu Hàm** | \`xiaohan\` | \`npc_tieu_ham.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Y tá dã chiến) | \`PENDING_GENERATION\` |
| 4 | **Lili** | \`lili\` | \`npc_lili.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Nữ thợ máy kìm búa) | \`PENDING_GENERATION\` |
| 5 | **Mục Miêu Miêu** | \`mumiao\` | \`npc_muc_mieu_mieu.png\` | 512×768 | PNG RGBA | Có | Đủ vai trò (Trinh sát vành mũ) | \`PENDING_GENERATION\` |
| 6 | **Vua Karen** | \`king_boss\` | \`npc_vua_karen.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Bạo chúa giáp vương miện) | \`PENDING_GENERATION\` |
| 7 | **Tiến Sĩ Trần** | \`doctor_boss\` | \`npc_tien_si_tran.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Nhà khoa học áo blouse) | \`PENDING_GENERATION\` |`;

const newTable = `| Nhóm | Số Lượng | Quy Tắc Đặt Tên / Tên File | Kích Thước | Định Dạng | Nền Trong Suốt | Trạng Thái | Ghi Chú |
|---|:---:|---|:---:|:---:|:---:|:---:|---|
| **Player (Người chơi)** | **30 tổ hợp** | \`{age}_{gender}_{outfit}.png\` | 512×512 | PNG RGBA | Có | \`PENDING\` | 5 tuổi × 2 giới tính × 3 trang phục |
| **Cô V** | 1 | \`npc_co_v.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Sát thủ dao găm Tiền đồn Bình Minh |
| **Tiểu Hàm** | 1 | \`npc_tieu_ham.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Nữ y tá dã chiến Doanh địa |
| **Lili** | 1 | \`npc_lili.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Nữ thợ máy kỹ thuật |
| **Mục Miêu Miêu** | 1 | \`npc_muc_mieu_mieu.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Nữ trinh sát mũ vành |
| **Vua Karen** | 1 | \`npc_vua_karen.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Bạo chúa phong kiến Lâu đài Mạt thế |
| **Tiến Sĩ Trần** | 1 | \`npc_tien_si_tran.png\` | 512×768 | PNG RGBA | Có | \`PENDING\` | Nhà sinh hóa Viện Sinh Học |
| **TỔNG CỘNG** | **36 assets** | 30 Player + 6 Story NPCs | - | PNG RGBA | Có | \`PENDING\` | Đã hoàn tất kiến trúc và manifest |`;

doc = doc.replace(oldTable, newTable);

// Replace Section 3.1
const oldSection31 = `### 3.1 Nhân Vật Chính (Survivor) (\`player_character.png\`)

- **Asset ID:** \`char_player_default\`
- **File đích:** \`public/assets/characters/player_character.png\`
- **Entity ID trong Source:** \`player\`
- **Vị trí xuất hiện:** Khắp các bản đồ (Khởi đầu tại Doanh địa người sống sót)
- **Vai trò cốt truyện:** Nhân vật đại diện người chơi sinh tồn trong thế giới ngày tận thế

#### Khảo sát thực tế từ source code:
- **Tài liệu & code nguồn:** \`index.html (#name-input)\`, \`js/state.js\`, \`js/ui.js\`
- **Mô tả trực tiếp:** "Người sống sót đơn độc chiến đấu với đói khát, nhiễm bệnh và hiểm nguy mạt thế."
- **Điểm khuyết thiếu trong source:** *Giới tính, tuổi tác, diện mạo cụ thể chưa được định nghĩa cố định trong source (do người chơi tự đặt tên).*

#### Đặc tả ngoại hình & trang phục:
- **Giới tính / Độ tuổi:** Nam/Nữ sinh tồn đa dụng (đề xuất: Nam giới trẻ tuổi 26-28 tuổi, nét mặt kiên định rắn rỏi)
- **Dáng vóc & Tư thế:** Dáng người thon gọn, nhanh nhẹn, cơ bắp thực dụng, tư thế đứng quan sát cảnh giác
- **Trang phục:** Áo khoác dã chiến màu xám sẫm/xanh rêu rách sờn, áo thun đen bên trong, quần túi hộp gia cố miếng đệm đầu gối, thắt lưng chiến thuật nhiều túi nhỏ
- **Phụ kiện & Trang bị:** Ba lô sinh tồn quai dù, găng tay hở ngón, bao dao găm bên hông, giày bốt cổ cao lội bùn
- **Nét mặt & Thần thái:** Ánh mắt cảnh giác, bình tĩnh, tập trung, môi mím chặt kiên nghị
- **Bảng màu chủ đạo:** Xám chì, xanh rêu quân đội, nâu da cũ, đen khói

#### AI Generation Prompt (Chuẩn hóa):
\`\`\`text
Full-body character concept art of a resilient solitary post-apocalyptic male survivor standing in ready alert posture, wearing a weathered olive-green tactical field jacket with rolled-up sleeves, black under-shirt, rugged reinforced cargo pants with knee pads, combat boots, tactical utility belt with pouches and survival knife sheath, dark tactical backpack straps, gritty dirt smudges and minor scratches, dark survival horror RPG aesthetic, semi-realistic digital illustration, clean sharp silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3
\`\`\`

#### Negative Prompt:
\`\`\`text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, bright cartoon, futuristic high-tech sci-fi, cyberpunk neon, deformed limbs, extra fingers, blurry, solid background, white box backdrop
\`\`\``;

const newSection31 = `### 3.1 Hệ Thống Ngoại Hình Người Chơi (30 Tổ Hợp Pre-generated Assets)

Loại bỏ hoàn toàn giả định chỉ có một ảnh cố định \`player_character.png\`. Thay vào đó, hệ thống hỗ trợ 30 tổ hợp ngoại hình được tạo sẵn dựa trên 3 thuộc tính lựa chọn trực tiếp trước khi bắt đầu trò chơi.

- **Thư mục lưu trữ:** \`public/assets/characters/player/\`
- **Quy tắc đặt tên:** \`{age}_{gender}_{outfit}.png\`
- **Kích thước & Định dạng:** 512×512 PNG, kênh Alpha trong suốt (True RGBA).
- **Trạng thái hiện tại:** Toàn bộ 30 ảnh ở trạng thái \`PENDING\`. Hệ thống hiển thị placeholder sinh tồn khi chưa có ảnh.

#### 3 Thuộc tính lựa chọn:
1. **Nhóm tuổi (Age) – 5 lựa chọn:**
   - \`teen\`: Thanh thiếu niên (15-18 tuổi)
   - \`young_adult\`: Thanh niên (19-29 tuổi)
   - \`adult\`: Trưởng thành (30-45 tuổi)
   - \`middle_aged\`: Trung niên (46-59 tuổi)
   - \`elderly\`: Cao tuổi (60+ tuổi)
2. **Giới tính (Gender) – 2 lựa chọn:**
   - \`male\`: Nam
   - \`female\`: Nữ
3. **Trang phục (Outfit) – 3 lựa chọn:**
   - \`survivor\`: Sinh tồn cơ bản (áo khoác sờn, quần túi hộp, thắt lưng sinh tồn)
   - \`tactical\`: Chiến thuật (áo giáp nhẹ, dây đeo molle, bao súng dã chiến)
   - \`casual\`: Thường ngày (áo hoodie/sơ mi bụi bặm, quần jeans bạc màu, giày thể thao cũ)

#### Danh sách 30 file ảnh tổ hợp:

| STT | Mã Tổ Hợp (ID) | Độ Tuổi | Giới Tính | Trang Phục | Tên File (\`public/assets/characters/player/\`) | Trạng Thái |
|:---:|---|---|---|---|---|:---:|
| 1 | \`teen_male_survivor\` | Thanh thiếu niên | Nam | Sinh tồn cơ bản | \`teen_male_survivor.png\` | \`PENDING\` |
| 2 | \`teen_male_tactical\` | Thanh thiếu niên | Nam | Chiến thuật | \`teen_male_tactical.png\` | \`PENDING\` |
| 3 | \`teen_male_casual\` | Thanh thiếu niên | Nam | Thường ngày | \`teen_male_casual.png\` | \`PENDING\` |
| 4 | \`teen_female_survivor\` | Thanh thiếu niên | Nữ | Sinh tồn cơ bản | \`teen_female_survivor.png\` | \`PENDING\` |
| 5 | \`teen_female_tactical\` | Thanh thiếu niên | Nữ | Chiến thuật | \`teen_female_tactical.png\` | \`PENDING\` |
| 6 | \`teen_female_casual\` | Thanh thiếu niên | Nữ | Thường ngày | \`teen_female_casual.png\` | \`PENDING\` |
| 7 | \`young_adult_male_survivor\` | Thanh niên (Mặc định) | Nam | Sinh tồn cơ bản | \`young_adult_male_survivor.png\` | \`PENDING\` |
| 8 | \`young_adult_male_tactical\` | Thanh niên | Nam | Chiến thuật | \`young_adult_male_tactical.png\` | \`PENDING\` |
| 9 | \`young_adult_male_casual\` | Thanh niên | Nam | Thường ngày | \`young_adult_male_casual.png\` | \`PENDING\` |
| 10 | \`young_adult_female_survivor\` | Thanh niên | Nữ | Sinh tồn cơ bản | \`young_adult_female_survivor.png\` | \`PENDING\` |
| 11 | \`young_adult_female_tactical\` | Thanh niên | Nữ | Chiến thuật | \`young_adult_female_tactical.png\` | \`PENDING\` |
| 12 | \`young_adult_female_casual\` | Thanh niên | Nữ | Thường ngày | \`young_adult_female_casual.png\` | \`PENDING\` |
| 13 | \`adult_male_survivor\` | Trưởng thành | Nam | Sinh tồn cơ bản | \`adult_male_survivor.png\` | \`PENDING\` |
| 14 | \`adult_male_tactical\` | Trưởng thành | Nam | Chiến thuật | \`adult_male_tactical.png\` | \`PENDING\` |
| 15 | \`adult_male_casual\` | Trưởng thành | Nam | Thường ngày | \`adult_male_casual.png\` | \`PENDING\` |
| 16 | \`adult_female_survivor\` | Trưởng thành | Nữ | Sinh tồn cơ bản | \`adult_female_survivor.png\` | \`PENDING\` |
| 17 | \`adult_female_tactical\` | Trưởng thành | Nữ | Chiến thuật | \`adult_female_tactical.png\` | \`PENDING\` |
| 18 | \`adult_female_casual\` | Trưởng thành | Nữ | Thường ngày | \`adult_female_casual.png\` | \`PENDING\` |
| 19 | \`middle_aged_male_survivor\` | Trung niên | Nam | Sinh tồn cơ bản | \`middle_aged_male_survivor.png\` | \`PENDING\` |
| 20 | \`middle_aged_male_tactical\` | Trung niên | Nam | Chiến thuật | \`middle_aged_male_tactical.png\` | \`PENDING\` |
| 21 | \`middle_aged_male_casual\` | Trung niên | Nam | Thường ngày | \`middle_aged_male_casual.png\` | \`PENDING\` |
| 22 | \`middle_aged_female_survivor\` | Trung niên | Nữ | Sinh tồn cơ bản | \`middle_aged_female_survivor.png\` | \`PENDING\` |
| 23 | \`middle_aged_female_tactical\` | Trung niên | Nữ | Chiến thuật | \`middle_aged_female_tactical.png\` | \`PENDING\` |
| 24 | \`middle_aged_female_casual\` | Trung niên | Nữ | Thường ngày | \`middle_aged_female_casual.png\` | \`PENDING\` |
| 25 | \`elderly_male_survivor\` | Cao tuổi | Nam | Sinh tồn cơ bản | \`elderly_male_survivor.png\` | \`PENDING\` |
| 26 | \`elderly_male_tactical\` | Cao tuổi | Nam | Chiến thuật | \`elderly_male_tactical.png\` | \`PENDING\` |
| 27 | \`elderly_male_casual\` | Cao tuổi | Nam | Thường ngày | \`elderly_male_casual.png\` | \`PENDING\` |
| 28 | \`elderly_female_survivor\` | Cao tuổi | Nữ | Sinh tồn cơ bản | \`elderly_female_survivor.png\` | \`PENDING\` |
| 29 | \`elderly_female_tactical\` | Cao tuổi | Nữ | Chiến thuật | \`elderly_female_tactical.png\` | \`PENDING\` |
| 30 | \`elderly_female_casual\` | Cao tuổi | Nữ | Thường ngày | \`elderly_female_casual.png\` | \`PENDING\` |`;

doc = doc.replace(oldSection31, newSection31);

fs.writeFileSync('docs/BATCH_03_CHARACTER_SPEC.md', doc, 'utf8');
console.log('docs/BATCH_03_CHARACTER_SPEC.md updated successfully!');

