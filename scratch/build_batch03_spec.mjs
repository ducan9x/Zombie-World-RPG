import fs from 'fs';
import path from 'path';

console.log('=== BUILDING BATCH 03 SPECIFICATION ===');

const characters = [
  {
    id: "char_player_default",
    characterName: "Nhân Vật Chính (Survivor)",
    filename: "player_character.png",
    filePath: "public/assets/characters/player_character.png",
    sourceEntityId: "player",
    role: "Nhân vật đại diện người chơi sinh tồn trong thế giới ngày tận thế",
    inGameLocation: "Khắp các bản đồ (Khởi đầu tại Doanh địa người sống sót)",
    sourceEvidence: {
      sourceFiles: ["index.html (#name-input)", "js/state.js", "js/ui.js"],
      directDescription: "Người sống sót đơn độc chiến đấu với đói khát, nhiễm bệnh và hiểm nguy mạt thế.",
      missingSourceInfo: "Giới tính, tuổi tác, diện mạo cụ thể chưa được định nghĩa cố định trong source (do người chơi tự đặt tên)."
    },
    visualDesign: {
      genderAge: "Nam/Nữ sinh tồn đa dụng (đề xuất: Nam giới trẻ tuổi 26-28 tuổi, nét mặt kiên định rắn rỏi)",
      bodyBuild: "Dáng người thon gọn, nhanh nhẹn, cơ bắp thực dụng, tư thế đứng quan sát cảnh giác",
      costume: "Áo khoác dã chiến màu xám sẫm/xanh rêu rách sờn, áo thun đen bên trong, quần túi hộp gia cố miếng đệm đầu gối, thắt lưng chiến thuật nhiều túi nhỏ",
      accessories: "Ba lô sinh tồn quai dù, găng tay hở ngón, bao dao găm bên hông, giày bốt cổ cao lội bùn",
      expression: "Ánh mắt cảnh giác, bình tĩnh, tập trung, môi mím chặt kiên nghị",
      colorPalette: "Xám chì, xanh rêu quân đội, nâu da cũ, đen khói"
    },
    prompt: "Full-body character concept art of a resilient solitary post-apocalyptic male survivor standing in ready alert posture, wearing a weathered olive-green tactical field jacket with rolled-up sleeves, black under-shirt, rugged reinforced cargo pants with knee pads, combat boots, tactical utility belt with pouches and survival knife sheath, dark tactical backpack straps, gritty dirt smudges and minor scratches, dark survival horror RPG aesthetic, semi-realistic digital illustration, clean sharp silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, bright cartoon, futuristic high-tech sci-fi, cyberpunk neon, deformed limbs, extra fingers, blurry, solid background, white box backdrop",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_v",
    characterName: "Cô V",
    filename: "npc_co_v.png",
    filePath: "public/assets/characters/npc_co_v.png",
    sourceEntityId: "v",
    role: "Nữ sát thủ đơn độc, người dẫn dắt huấn luyện chiến đấu tại Tiền đồn Bình Minh",
    inGameLocation: "Tiền đồn Bình Minh (Dawn Outpost)",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (SURVIVOR_NPC id: 'v')", "docs/phan_tich_cot_truyen_chuyen_sau.md"],
      directDescription: "Một nữ sát thủ ánh mắt lạnh lùng, luôn đơn độc. Cô ấy không bao giờ chủ động nói chuyện, lau dao găm, tặng dao găm phòng thân cho bạn.",
      missingSourceInfo: "Trang phục cụ thể và kiểu tóc không được mô tả chi tiết từng lớp vải trong source."
    },
    visualDesign: {
      genderAge: "Nữ giới, khoảng 26-28 tuổi",
      bodyBuild: "Vóc dáng thon thả, săn chắc, di chuyển linh hoạt nhẹ nhàng như bóng ma",
      costume: "Áo choàng có mũ trùm đầu màu xám đen che nửa mặt, áo giáp da bó sát gia cố ngực và vai, quần da chiến thuật đen ôm sát, bốt sát thủ không gây tiếng động",
      accessories: "Bao đựng hai con dao găm quân sự bên hông đùi, dây đai chéo trước ngực, găng tay da đen ôm sát",
      expression: "Ánh mắt sắc bén như lưỡi dao băng, lạnh lùng xa cách, không nở nụ cười",
      colorPalette: "Đen tuyền, xám than, bạc kim loại lưỡi dao, điểm xuyết đỏ thẫm"
    },
    prompt: "Full-body character concept art of Lady V, a lethal and cold-eyed female assassin in a dark post-apocalyptic world, standing in a poised, deadly combat-ready posture, wearing a dark hooded tactical cowl shadowing the upper face, revealing piercing cold eyes, fitted black weathered leather armor vest with shoulder guards, tactical pants with dual military knife sheaths strapped to thighs, holding a gleaming tactical combat knife, fingerless gloves, stealth leather boots, dark grim survival RPG aesthetic, semi-realistic character art, full body from head to toe completely in frame, clean silhouette on solid transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, cheerful, colorful, futuristic high-tech sci-fi, neon, deformed fingers, extra limbs, blurry, solid background, white box",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_xiaohan",
    characterName: "Tiểu Hàm",
    filename: "npc_tieu_ham.png",
    filePath: "public/assets/characters/npc_tieu_ham.png",
    sourceEntityId: "xiaohan",
    role: "Y tá tình nguyện dã chiến, chỗ dựa tinh thần và chăm sóc y tế tại Tiền đồn",
    inGameLocation: "Tiền đồn Bình Minh / Doanh trại người sống sót",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (SURVIVOR_NPC id: 'xiaohan')", "docs/huong_dan_tuyen_truyen.md"],
      directDescription: "Cô gái trẻ mang theo nụ cười ấm áp hiếm hoi giữa ngày tận thế, luôn lo lắng hỏi han vết thương và thu thập sữa, trái cây, thuốc men.",
      missingSourceInfo: "Chiều cao, màu tóc cụ thể không có trong source code."
    },
    visualDesign: {
      genderAge: "Nữ giới, khoảng 20-22 tuổi",
      bodyBuild: "Nhỏ nhắn, thanh mảnh, dáng vẻ hiền lành và nhanh nhẹn",
      costume: "Áo len cổ lọ màu be ấm áp bên trong khoác áo blouse y tế trắng sờn rách có vết ố mạt thế, quần kaki xám bó gấu, giày thể thao cũ",
      accessories: "Túi vải cứu thương dã chiến đeo chéo có biểu tượng chữ thập đỏ nhạt, ống nghe quàng cổ, kéo y tế gài túi áo",
      expression: "Ánh mắt hiền từ, nụ cười mỉm ấm áp khích lệ, gương mặt sáng xua tan u ám",
      colorPalette: "Trắng cháo lòng, be sữa, xám nhạt, đỏ chữ thập"
    },
    prompt: "Full-body character concept art of Xiao Han (Tieu Ham), a gentle and compassionate young female field nurse in a dark post-apocalyptic survivor shelter, standing gracefully facing viewer, wearing a slightly worn cream-white field medical coat with faint red cross shoulder patch over a warm beige sweater, rolled-up sleeves, practical cargo pants, worn sneakers, carrying a vintage canvas medical cross-body messenger bag with medical scissors and bandage rolls visible, warm hopeful smile on face, clean neat ponytail hair, dark survival RPG aesthetic, semi-realistic digital illustration, full body completely visible from head to shoes, isolated on transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, sexualized, futuristic sci-fi, neon, deformed hands, extra fingers, blurry, solid background",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_lili",
    characterName: "Lili",
    filename: "npc_lili.png",
    filePath: "public/assets/characters/npc_lili.png",
    sourceEntityId: "lili",
    role: "Nữ thợ máy cơ khí, chuyên gia chế tạo, tái chế phế liệu và sửa súng",
    inGameLocation: "Xưởng cơ khí Tiền đồn Bình Minh",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (SURVIVOR_NPC id: 'lili')", "docs/huong_dan_tuyen_truyen.md"],
      directDescription: "Một cô gái tinh nghịch, luôn thích bày vẽ với vũ khí phế liệu và các chi tiết máy móc, sửa súng và balo dư thừa.",
      missingSourceInfo: "Màu mắt, chiều cao, trang phục chi tiết chưa khai báo trong code."
    },
    visualDesign: {
      genderAge: "Nữ giới, khoảng 23-25 tuổi",
      bodyBuild: "Khỏe khoắn, năng động, phong thái nghịch ngợm tomboy",
      costume: "Áo thun ba lỗ đen bó sát kết hợp yếm bò denim hoặc tạp dề thợ máy vải thô dính dầu mỡ máy móc, quần bảo hộ lao động nhiều túi",
      accessories: "Kính bảo hộ hàn xì đẩy ngược trên trán, găng tay da dầy cộm dính dầu, thắt lưng mang cờ lê lớn, mỏ lết và kìm búa",
      expression: "Nụ cười nhếch mép tự tin, tinh quái, một bên má dính vệt dầu đen",
      colorPalette: "Xanh denim bụi, da bò vàng cháy, đen dầu máy, kim loại rỉ sét"
    },
    prompt: "Full-body character concept art of Lili, an energetic tomboyish female mechanic and gunsmith in a post-apocalyptic shelter, standing confidently resting a heavy pipe wrench on her shoulder, wearing a rugged oil-stained denim work jumpsuit with top tied around waist, black tank top, heavy leather work gloves, welding goggles pushed up onto messy tied-back auburn hair, tool belt loaded with pliers, nuts, bolts and screwdrivers, smudge of engine grease on cheek, playful confident smirk, heavy work boots, dark survival RPG aesthetic, semi-realistic digital painting, whole body visible from head to boots, clean silhouette on transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, princess, delicate, futuristic cyber, neon, deformed fingers, extra limbs, blurry, solid background",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_mumiao",
    characterName: "Mục Miêu Miêu",
    filename: "npc_muc_mieu_mieu.png",
    filePath: "public/assets/characters/npc_muc_mieu_mieu.png",
    sourceEntityId: "mumiao",
    role: "Trinh sát thông tin đô thị, người liên lạc bí ẩn tại các ngõ ngách",
    inGameLocation: "Các ngõ ngách thành phố, trung tâm thương mại bỏ hoang",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (SURVIVOR_NPC id: 'mumiao')", "docs/phan_tich_cot_truyen_chuyen_sau.md"],
      directDescription: "Người mang dáng vẻ bí hiểm, thoắt ẩn thoắt hiện trong các hẻm phố hoang tàn, giao dịch quà bí ẩn và trao đổi tin tức.",
      missingSourceInfo: "Giới tính và diện mạo chưa xác định rõ trong source (tạo hình trung tính bí ẩn)."
    },
    visualDesign: {
      genderAge: "Nữ/Trung tính, vóc dáng linh hoạt nhẹ cân, khoảng 24-27 tuổi",
      bodyBuild: "Mảnh khảnh, nhanh nhẹn, tư thế như chuẩn bị lủi nhanh vào bóng râm",
      costume: "Áo măng tô dã chiến có mũ rộng vành che phủ nửa trên mặt, khăn rằn che kín mũi miệng, áo nỉ đen mỏng nhẹ chống gió",
      accessories: "Bộ đàm vô tuyến quân sự kẹp vai, ống nhòm dã chiến mini đeo cổ, túi đưa thư chống nước, dao bấm ngụy trang",
      expression: "Đôi mắt hẹp tinh ranh lấp ló dưới vành mũ, thần thái bí ẩn khó đoán",
      colorPalette: "Nâu đất phai, xám khói, xanh rêu rêu phong, đen nhung"
    },
    prompt: "Full-body character concept art of Mu Miao Miao (Muc Mieu Mieu), a secretive agile urban scout and mysterious courier in post-apocalyptic ruins, standing in an elusive alert stance, wearing a weathered long trench duster coat with deep hood and a wide-brimmed weathered hat casting deep shadow over upper face, tactical scarf covering lower mouth, revealing only keen cunning eyes, compact chest rig with small field radio and antenna, lightweight urban running boots, tactical messenger satchel, dark survival RPG aesthetic, semi-realistic character art, full body completely in frame from head to boots, clean silhouette on solid transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, bright colorful, futuristic sci-fi, neon, deformed fingers, extra limbs, blurry, solid background",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_vua_karen",
    characterName: "Vua Karen",
    filename: "npc_vua_karen.png",
    filePath: "public/assets/characters/npc_vua_karen.png",
    sourceEntityId: "king_boss",
    role: "Quốc vương Lâu Đài Tận Thế, trùm bạo chúa phong kiến cai trị bằng bàn tay sắt",
    inGameLocation: "Lâu Đài Tận Thế (Throne Room / Karen Castle)",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (id: 'king_boss')", "js/castle/royalty.js", "docs/phan_tich_cot_truyen_chuyen_sau.md"],
      directDescription: "Cựu trùm bất động sản, kẻ xây dựng Lâu đài Tận Thế bằng xi măng cốt thép và sự tàn bạo. Nắm quyền sinh sát và phong chức quý tộc.",
      missingSourceInfo: "Khuôn mặt cụ thể không có ảnh minh họa trước đó."
    },
    visualDesign: {
      genderAge: "Nam giới, 48-52 tuổi",
      bodyBuild: "Cao lớn, bệ vệ, cơ thể vạm vỡ của kẻ quyền lực quen chỉ huy",
      costume: "Bộ giáp phiến gothic bằng thép dày có nẹp viền vàng quý tộc, áo choàng nhung đỏ thẫm viền lông thú sờn rách quàng qua vai, áo giáp chân bọc thép",
      accessories: "Vương miện gai sắt mạ vàng trên đầu, thanh kiếm lệnh quý tộc chuôi vàng cắm xuống sàn, các nhẫn vàng trên găng tay giáp",
      expression: "Khuôn mặt góc cạnh râu quai nón hoa râm, ánh mắt ngạo mạn, tàn bạo, độc đoán",
      colorPalette: "Vàng hoàng gia xỉn màu, đỏ thẫm đẫm máu, đen thép bóng, xám tro"
    },
    prompt: "Full-body character concept art of King Karen (Vua Karen), the tyrannical feudal warlord of the Doom Castle, standing in an arrogant imposing posture resting both hands on the pommel of an ornate medieval broadsword grounded in front of him, middle-aged man around 50 with stern weathered face and graying beard, wearing heavily decorated gothic dark plate armor with tarnished gold trims, a tattered royal crimson velvet cape draped over shoulders, spiked iron and gold crown on his head, heavy armored boots, dark grim survival RPG aesthetic, semi-realistic digital painting, whole body visible from head to boots, clean silhouette on transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, cartoon, benevolent, smiling, futuristic sci-fi, neon cyberpunk, deformed hands, extra limbs, blurry, solid background",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  },
  {
    id: "char_npc_tien_si_tran",
    characterName: "Tiến Sĩ Trần",
    filename: "npc_tien_si_tran.png",
    filePath: "public/assets/characters/npc_tien_si_tran.png",
    sourceEntityId: "doctor_boss",
    role: "Nhà khoa học trưởng Viện Sinh Học & Bệ Phóng Vũ Trụ, kẻ nắm giữ bí mật virus và tàu thoát hiểm",
    inGameLocation: "Viện Sinh Học / Trạm Phóng Tên Lửa Tuyệt Mật",
    sourceEvidence: {
      sourceFiles: ["js/data/entities/npcs.js (id: 'doctor_boss')", "docs/phan_tich_cot_truyen_chuyen_sau.md", "docs/huong_dan_tuyen_truyen.md"],
      directDescription: "Nhà khoa học tài ba mang gánh nặng tội lỗi, gắn liền với phòng thí nghiệm virus và kết cục phóng tên lửa rời khỏi Trái Đất.",
      missingSourceInfo: "Trang phục cụ thể ngoài chiếc áo choàng thí nghiệm chưa được đặc tả chi tiết."
    },
    visualDesign: {
      genderAge: "Nam giới, 50-55 tuổi",
      bodyBuild: "Gầy gò, lưng hơi còng vì nhiều năm nghiên cứu trong phòng thí nghiệm kín",
      costume: "Áo khoác blouse phòng thí nghiệm trắng ố vàng rách rưới có dính vệt hóa chất xanh lục, bên trong là áo sơ mi xám và giáp bảo hộ sinh học mỏng",
      accessories: "Kính gọng vuông kim loại trễ xuống sống mũi, tay đeo găng cao su dính hóa chất cầm ống nghiệm phát sáng chất lỏng xanh lục, máy đo bức xạ bên hông",
      expression: "Khuôn mặt hốc hác, quầng thâm mắt sâu, ánh nhìn vừa điên rồ vừa tuyệt vọng đầy ám ảnh",
      colorPalette: "Trắng ố vàng, xanh lục dạ quang sinh học, xám tro, đen hóa chất"
    },
    prompt: "Full-body character concept art of Dr. Tran (Tien Si Tran), a haunted, morally-conflicted biochemist in an apocalyptic secret laboratory, standing slightly stooped in a tense pose holding a glowing bio-luminescent emerald green syringe vial in one gloved hand and a portable electronic datapad in the other, man in his early 50s with disheveled graying hair and tired hollow eyes behind wire-rimmed glasses, wearing a tattered chemical-stained white lab coat over practical tactical vest and dark trousers, rugged field boots, dark survival horror RPG aesthetic, semi-realistic digital illustration, full body completely visible from head to boots, isolated on solid transparent background, no text, no watermark --ar 2:3",
    negativePrompt: "cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, cheerful, healthy, colorful, superhero, deformed hands, extra fingers, blurry, solid background, white box",
    width: 512,
    height: 768,
    aspectRatio: "2:3",
    format: "png",
    transparent: true,
    priority: "P0",
    status: "PENDING_GENERATION"
  }
];

// 1. Output project-docs/assets/batches/batch-03-characters.json
const batch03Json = {
  batchId: "batch-03-characters",
  title: "Batch 03: Player Character & Priority Story NPCs",
  description: "Bộ đặc tả 7 nhân vật cốt lõi ưu tiên P0 của dự án Zombie World RPG phục vụ sinh ảnh AI toàn thân có nền trong suốt.",
  assetCount: characters.length,
  targetFormat: "PNG 512x768 (True Alpha Channel RGBA)",
  styleGuide: "Dark Post-apocalyptic Survival RPG. Semi-realistic 3D character illustration, cinematic dramatic lighting from top-left, gritty realistic textures (weathered fabrics, scratches, dirt, oil smudges), isolated on solid transparent alpha background, full-body visible without limb clipping, strictly no text or watermark.",
  assets: characters
};

fs.writeFileSync('project-docs/assets/batches/batch-03-characters.json', JSON.stringify(batch03Json, null, 2), 'utf8');
console.log('Saved project-docs/assets/batches/batch-03-characters.json successfully.');

// 2. Output docs/BATCH_03_CHARACTER_SPEC.md
let docMd = `# ĐẶC TẢ CHI TIẾT TẠO ẢNH BATCH 03 — PLAYER & STORY NPC
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian lập tài liệu:** 2026-11-05 16:22:00 (ICT)  
**Phiên bản đặc tả:** v1.0  
**Trạng thái triển khai:** \`PENDING_GENERATION\` (Đã hoàn tất khảo sát source code, chờ xác nhận trước khi sinh ảnh)

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC THIẾT KẾ MỸ THUẬT

Batch 03 tập trung vào **7 nhân vật cốt lõi ưu tiên số 1 (P0)** xuất hiện xuyên suốt mạch truyện, hệ thống nhiệm vụ và các trận chiến quyết định trong thế giới Zombie World RPG:
1. **Player** (Nhân vật chính người sống sót)
2. **Cô V** (Nữ sát thủ - Cố vấn chiến đấu Tiền đồn Bình Minh)
3. **Tiểu Hàm** (Nữ y tá dã chiến - Tuyến nhiệm vụ y tế & hồi phục)
4. **Lili** (Nữ thợ máy - Tuyến sửa súng, nâng cấp ba lô và tái chế)
5. **Mục Miêu Miêu** (Trinh sát đô thị - Giao liên bí ẩn)
6. **Vua Karen** (Bạo chúa Lâu Đài Tận Thế - Trùm tối cao phe quý tộc)
7. **Tiến Sĩ Trần** (Nhà khoa học trưởng - Tuyến thoát hiểm tên lửa vũ trụ)

### Quy chuẩn kỹ thuật bắt buộc:
- **Độ phân giải:** \`512 × 768 pixels\` (Tỷ lệ \`2:3\`).
- **Định dạng file:** \`PNG 32-bit ARGB\` với kênh Alpha thực (True Alpha 100% trong suốt ở nền).
- **Góc nhìn & Tạo dáng:** **Nhân vật toàn thân (Full Body)** đứng thẳng hoặc trong tư thế sẵn sàng chiến đấu / cảnh giác, nhìn rõ từ đỉnh đầu, thân thể, trang phục, vũ khí đến chân và giày bốt. Tuyệt đối không để bị cắt cụt đầu, tay hoặc chân.
- **Phong cách nghệ thuật:** Bán tả thực (Semi-realistic 3D Game Character Concept Art), không anime, không cartoon, không neon sci-fi. Ánh sáng điện ảnh tương phản nhẹ hướng từ góc trên bên trái chiếu xuống, đồng bộ hoàn hảo giữa 7 nhân vật.
- **Tiêu chuẩn sạch:** Tuyệt đối không có chữ (text), watermark, logo, thanh máu, khung viền hay hộp màu nền.

---

## 2. BẢNG TỔNG HỢP 7 NHÂN VẬT BATCH 03

| STT | Tên Nhân Vật | ID Entity Source | Tên File Dự Kiến | Kích Thước | Định Dạng | Nền Trong Suốt | Mức Độ Khảo Sát | Trạng Thái |
|---|---|---|---|:---:|:---:|:---:|---|:---:|
| 1 | **Nhân Vật Chính** | \`player\` | \`player_character.png\` | 512×768 | PNG RGBA | Có | Đủ vai trò (Tạo hình trung tính) | \`PENDING_GENERATION\` |
| 2 | **Cô V** | \`v\` | \`npc_co_v.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Sát thủ dao găm) | \`PENDING_GENERATION\` |
| 3 | **Tiểu Hàm** | \`xiaohan\` | \`npc_tieu_ham.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Y tá dã chiến) | \`PENDING_GENERATION\` |
| 4 | **Lili** | \`lili\` | \`npc_lili.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Nữ thợ máy kìm búa) | \`PENDING_GENERATION\` |
| 5 | **Mục Miêu Miêu** | \`mumiao\` | \`npc_muc_mieu_mieu.png\` | 512×768 | PNG RGBA | Có | Đủ vai trò (Trinh sát vành mũ) | \`PENDING_GENERATION\` |
| 6 | **Vua Karen** | \`king_boss\` | \`npc_vua_karen.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Bạo chúa giáp vương miện) | \`PENDING_GENERATION\` |
| 7 | **Tiến Sĩ Trần** | \`doctor_boss\` | \`npc_tien_si_tran.png\` | 512×768 | PNG RGBA | Có | **Đầy đủ dữ liệu** (Nhà khoa học áo blouse) | \`PENDING_GENERATION\` |

---

## 3. CHI TIẾT ĐẶC TẢ TỪNG NHÂN VẬT

`;

for (let i = 0; i < characters.length; i++) {
  const c = characters[i];
  docMd += `### 3.${i + 1} ${c.characterName} (\`${c.filename}\`)

- **Asset ID:** \`${c.id}\`
- **File đích:** \`${c.filePath}\`
- **Entity ID trong Source:** \`${c.sourceEntityId}\`
- **Vị trí xuất hiện:** ${c.inGameLocation}
- **Vai trò cốt truyện:** ${c.role}

#### Khảo sát thực tế từ source code:
- **Tài liệu & code nguồn:** ${c.sourceEvidence.sourceFiles.map(f => `\`${f}\``).join(', ')}
- **Mô tả trực tiếp:** "${c.sourceEvidence.directDescription}"
- **Điểm khuyết thiếu trong source:** *${c.sourceEvidence.missingSourceInfo}*

#### Đặc tả ngoại hình & trang phục:
- **Giới tính / Độ tuổi:** ${c.visualDesign.genderAge}
- **Dáng vóc & Tư thế:** ${c.visualDesign.bodyBuild}
- **Trang phục:** ${c.visualDesign.costume}
- **Phụ kiện & Trang bị:** ${c.visualDesign.accessories}
- **Nét mặt & Thần thái:** ${c.visualDesign.expression}
- **Bảng màu chủ đạo:** ${c.visualDesign.colorPalette}

#### AI Generation Prompt (Chuẩn hóa):
\`\`\`text
${c.prompt}
\`\`\`

#### Negative Prompt:
\`\`\`text
${c.negativePrompt}
\`\`\`

---
`;
}

docMd += `## 4. QUY TRÌNH AN TOÀN VÀ BƯỚC TIẾP THEO

1. **Tuân thủ an toàn:** Toàn bộ công việc chỉ dừng lại ở khảo sát source code và tạo tài liệu đặc tả. Tuyệt đối không can thiệp code gameplay, combat hoặc renderer.
2. **Kích hoạt tạo ảnh:** Sau khi nhận xác nhận từ người phụ trách, hệ thống sẽ gọi Subagent Image Generator sinh tuần tự từng ảnh theo đúng prompt và negative prompt trên.
3. **Hậu kiểm:** Toàn bộ ảnh sau khi sinh sẽ được kiểm tra kích thước 512×768, kênh Alpha trong suốt, kiểm tra cắt cụt chi thể trước khi đưa vào manifest chính thức.
`;

fs.writeFileSync('docs/BATCH_03_CHARACTER_SPEC.md', docMd, 'utf8');
console.log('Saved docs/BATCH_03_CHARACTER_SPEC.md successfully.');

console.log('ALL BATCH 03 SPECIFICATION TASKS COMPLETED!');

