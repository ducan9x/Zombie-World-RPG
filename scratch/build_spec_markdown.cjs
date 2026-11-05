const fs = require('fs');

const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));

let md = `# ĐẶC TẢ CHI TIẾT TẠO ẢNH BATCH 03 — PLAYER APPEARANCE & STORY NPCS
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian cập nhật:** 2026-11-05 17:10:00 (ICT)  
**Phiên bản đặc tả:** v2.5 (Chuẩn hóa toàn diện 36 Character Assets: 30 Player + 6 Story NPCs)  
**Trạng thái triển khai:** \`PENDING_GENERATION\` (Đã chuẩn hóa kiến trúc, manifest và prompt tạo ảnh; chưa sinh ảnh)

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
- \`teen\`: Thanh thiếu niên (16-17 tuổi), nét mặt trẻ trung, vóc dáng gọn gàng, trang phục sinh tồn kín đáo phù hợp độ tuổi, không gợi cảm.
- \`young_adult\`: Thanh niên (22-25 tuổi), nét mặt kiên định rắn rỏi, vóc dáng thể thao năng động.
- \`adult\`: Trưởng thành (32-38 tuổi), nét mặt dày dạn sương gió, vóc dáng vững chãi từng trải.
- \`middle_aged\`: Trung niên (48-52 tuổi), khuôn mặt khắc khổ có nếp nhăn và râu/tóc điểm bạc, phong thái trầm tĩnh dày dạn.
- \`elderly\`: Cao tuổi (65-70 tuổi), nếp nhăn sâu, mái tóc bạc trắng, ánh mắt kiên nghị sắc sảo của người sống sót qua nhiều thập kỷ.

#### 2. Giới tính (Gender) – 2 lựa chọn:
- \`male\`: Nhân vật nam, đường nét khuôn mặt và vóc dáng nam tính tự nhiên.
- \`female\`: Nhân vật nữ, đường nét khuôn mặt và vóc dáng nữ tính tự nhiên, không cường điệu hóa hoặc tình dục hóa.

#### 3. Trang phục (Outfit) – 3 lựa chọn:
- \`survivor\` (Sinh tồn cơ bản): Áo khoác sinh tồn dã chiến cũ sờn rách nhẹ xắn tay, áo thun tối màu bên trong, quần túi hộp tiện dụng, bốt dã chiến, thắt lưng sinh tồn nhiều túi và bình nước nhỏ.
- \`tactical\` (Chiến thuật): Áo giáp nhẹ/tactical vest molle, áo combat dã chiến, quần chiến thuật gia cố đệm đầu gối, găng tay chiến thuật, bốt quân sự, không mang vũ khí quá khổ che khuất cơ thể.
- \`casual\` (Thường ngày): Trang phục dân sự đời thường hậu tận thế: áo hoodie hoặc áo sơ mi khoác ngoài bạc màu, quần jeans sờn rách, giày thể thao/dã ngoại cũ có vệt bụi đất.

### 3.2 Quy tắc lưu trữ & Đặt tên file

- **Thư mục lưu trữ:** \`public/assets/characters/player/\`
- **Quy tắc đặt tên:** \`{age}_{gender}_{outfit}.png\`

### 3.3 Danh sách 30 tổ hợp và Prompt tạo ảnh chuẩn hóa

Negative Prompt chung cho toàn bộ 30 Player:
\`\`\`text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic high-tech sci-fi, cyberpunk neon, superhero, deformed limbs, extra fingers, missing fingers, bad anatomy, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery, weapons blocking body
\`\`\`

| STT | Mã Tổ Hợp (ID) | Độ Tuổi | Giới Tính | Trang Phục | Tên File (\`public/assets/characters/player/\`) | Prompt Chuẩn Hóa | Trạng Thái |
|:---:|---|---|---|---|---|---|:---:|
`;

for (let i = 0; i < b3.player.length; i++) {
  const p = b3.player[i];
  md += `| ${i + 1} | \`${p.id}\` | ${p.ageName} | ${p.genderName} | ${p.outfitName} | \`${p.filename}\` | \`${p.prompt.slice(0, 110)}...\` | \`${p.status}\` |\n`;
}

md += `
---

## 4. NHÓM B: ĐẶC TẢ CHI TIẾT 6 STORY NPCS

- **Thư mục lưu trữ:** \`public/assets/characters/npc/\`
- **Quy tắc đặt tên:** \`{filename}\`

Negative Prompt chung cho toàn bộ 6 NPC:
\`\`\`text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery
\`\`\`

`;

for (const npc of b3.npcs) {
  md += `### 4.${b3.npcs.indexOf(npc) + 1} ${npc.characterName} (\`${npc.filename}\`)

- **ID Manifest:** \`${npc.id}\`
- **ID Entity trong Source:** \`${npc.sourceEntityId}\`
- **Đường dẫn file đích:** \`${npc.path}\`
- **Vị trí xuất hiện trong game:** ${npc.inGameLocation}
- **Vai trò cốt truyện:** ${npc.role}
- **Mô tả nhận diện:** ${npc.description}
- **Kích thước & Định dạng:** 512 × 768 pixels, PNG 32-bit RGBA (True Alpha Transparency, Full Body)
- **Trạng thái:** \`${npc.status}\`

#### AI Generation Prompt:
\`\`\`text
${npc.prompt}
\`\`\`

#### AI Negative Prompt:
\`\`\`text
${npc.negativePrompt}
\`\`\`

---
`;
}

md += `## 5. TỔNG KẾT BẢNG MANIFEST BATCH 03

| Nhóm | Số Lượng Asset | Thư Mục Lưu Trữ | Kích Thước | Định Dạng | Tỷ Lệ | Trạng Thái Hiện Tại |
|---|:---:|---|:---:|:---:|:---:|:---:|
| **Nhóm A: Player** | 30 | \`public/assets/characters/player/\` | 512 × 768 px | PNG RGBA Transparent | 2:3 | \`PENDING\` |
| **Nhóm B: Story NPC** | 6 | \`public/assets/characters/npc/\` | 512 × 768 px | PNG RGBA Transparent | 2:3 | \`PENDING\` |
| **TỔNG BATCH 03** | **36** | \`public/assets/characters/\` | 512 × 768 px | PNG RGBA Transparent | 2:3 | **36 PENDING** |

---

## 6. QUY TẮC TRIỂN KHAI VÀ HƯỚNG DẪN BƯỚC TIẾP THEO

1. **Giai đoạn chuẩn bị (Hiện tại):**
   - Đã cấu hình và kiểm thử thành công hệ thống lựa chọn ngoại hình trên UI (\`index.html\`, \`js/ui.js\`, \`js/state.js\`).
   - Đã đồng bộ toàn bộ 36 bản ghi trong \`batch-03-characters.json\`, \`player-appearance-manifest.json\`, và \`asset-manifest.json\`.
   - Các thư mục đích \`public/assets/characters/player/\` và \`public/assets/characters/npc/\` đã sẵn sàng.
2. **Giai đoạn sinh ảnh (Bước tiếp theo):**
   - Khi tiến hành sinh ảnh, sử dụng chính xác các prompt và negative prompt chuẩn hóa trong tài liệu này.
   - Kiểm tra kỹ kênh Alpha trong suốt, đảm bảo ảnh không bị dính ô caro xám-trắng giả lập nền transparent.
   - Lưu đúng kích thước 512 × 768 px và đúng tên file quy định.
   - Sau khi tải ảnh vào thư mục, hệ thống UI và PixiJS sẽ tự động nhận diện và hiển thị ảnh thực tế mà không cần chỉnh sửa source code.
`;

fs.writeFileSync('docs/BATCH_03_CHARACTER_SPEC.md', md, 'utf8');
console.log('docs/BATCH_03_CHARACTER_SPEC.md regenerated successfully!');

