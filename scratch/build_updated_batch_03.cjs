const fs = require('fs');

const ages = [
  {
    id: 'teen',
    name: 'Thanh thiếu niên',
    desc: 'Thiếu niên khoảng 16-17 tuổi, khuôn mặt trẻ trung, vóc dáng gọn gàng, trang phục sinh tồn kín đáo phù hợp độ tuổi',
    promptChunk: 'teenage youth around 16-17 years old with youthful facial features, lean agile build, alert survivalist posture'
  },
  {
    id: 'young_adult',
    name: 'Thanh niên',
    desc: 'Thanh niên trẻ tuổi 22-25 tuổi, nét mặt kiên định rắn rỏi, vóc dáng thể thao năng động',
    promptChunk: 'young adult around 22-24 years old with determined sharp eyes and focused expression, athletic resilient build, alert ready posture'
  },
  {
    id: 'adult',
    name: 'Trưởng thành',
    desc: 'Người trưởng thành 32-38 tuổi, nét mặt dày dạn sương gió, vóc dáng vững chãi từng trải',
    promptChunk: 'battle-hardened adult around 35 years old with weathered experienced facial features, sturdy capable build, vigilant combat-ready posture'
  },
  {
    id: 'middle_aged',
    name: 'Trung niên',
    desc: 'Người trung niên khoảng 48-52 tuổi, khuôn mặt khắc khổ có nếp nhăn và râu/tóc điểm bạc, phong thái trầm tĩnh',
    promptChunk: 'middle-aged survivor around 50 years old with rugged weathered face, prominent age lines, graying hair, calm hardened posture'
  },
  {
    id: 'elderly',
    name: 'Cao tuổi',
    desc: 'Người cao tuổi 65-70 tuổi, nếp nhăn sâu, mái tóc bạc trắng, ánh mắt kiên nghị sắc sảo của người sống sót qua nhiều thập kỷ',
    promptChunk: 'elderly veteran survivor around 65-70 years old with deep facial wrinkles, distinguished silver-gray hair, determined weathered eyes, resolute resilient posture'
  }
];

const genders = [
  {
    id: 'male',
    name: 'Nam',
    promptChunk: 'male survivor'
  },
  {
    id: 'female',
    name: 'Nữ',
    promptChunk: 'female survivor'
  }
];

const outfits = [
  {
    id: 'survivor',
    name: 'Sinh tồn cơ bản',
    desc: 'Áo khoác sinh tồn cũ sờn rách nhẹ, áo thun tối màu bên trong, quần túi hộp tiện dụng, bốt dã chiến, thắt lưng sinh tồn và túi đeo nhỏ',
    promptChunk: 'wearing a weathered survival field jacket with scuffed patches and rolled-up sleeves over a dark worn undershirt, rugged cargo pants with reinforced knees, scuffed tactical combat boots, utility survival belt with equipment pouches and small canteen, dusty fabrics with realistic fabric frays and dirt smudges'
  },
  {
    id: 'tactical',
    name: 'Chiến thuật',
    desc: 'Áo giáp nhẹ/tactical vest molle, áo combat dã chiến, quần chiến thuật gia cố đệm đầu gối, găng tay chiến thuật, bốt quân sự',
    promptChunk: 'wearing a low-profile tactical load-bearing vest (molle vest) over a rugged combat shirt, tactical cargo pants with integrated knee pads, heavy-duty military combat boots, tactical fingerless gloves, duty belt with equipment holsters and magazine pouches, realistic utilitarian gear'
  },
  {
    id: 'casual',
    name: 'Thường ngày',
    desc: 'Trang phục dân sự đời thường hậu tận thế: áo hoodie hoặc áo sơ mi khoác ngoài bạc màu, quần jeans sờn rách do sinh tồn, giày thể thao/dã ngoại cũ',
    promptChunk: 'wearing post-apocalyptic civilian casual clothing, a faded slightly weathered hoodie over a worn collared shirt, rugged distressed denim jeans with frayed cuffs and dust smudges, scuffed sturdy hiking sneakers, casual survivalist street style'
  }
];

const playerNegativePrompt = 'cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic high-tech sci-fi, cyberpunk neon, superhero, deformed limbs, extra fingers, missing fingers, bad anatomy, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery, weapons blocking body';

// Build 30 player assets
const players = [];
for (const age of ages) {
  for (const gender of genders) {
    for (const outfit of outfits) {
      const id = `${age.id}_${gender.id}_${outfit.id}`;
      const filename = `${id}.png`;
      const path = `public/assets/characters/player/${filename}`;
      const prompt = `Full-body character concept art of a ${age.promptChunk} ${gender.promptChunk}, ${outfit.promptChunk}, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game character art, dramatic cinematic rim lighting from top-left, gritty realistic textures, standing centered in a natural alert posture, whole body completely visible from head to boots, no cropped limbs, isolated on solid transparent background, strictly no background, no text, no watermark --ar 2:3`;

      players.push({
        id,
        category: 'player',
        age: age.id,
        ageName: age.name,
        gender: gender.id,
        genderName: gender.name,
        outfit: outfit.id,
        outfitName: outfit.name,
        name: `Player: ${age.name} ${gender.name} (${outfit.name})`,
        filename,
        path,
        filePath: path,
        width: 512,
        height: 768,
        aspectRatio: '2:3',
        format: 'png',
        transparent: true,
        priority: 'P0',
        status: 'PENDING',
        prompt,
        negativePrompt: playerNegativePrompt,
        description: `${age.desc}. Giới tính: ${gender.name}. Trang phục: ${outfit.desc}.`,
        notes: `Tổ hợp ngoại hình người chơi: ${age.name}, ${gender.name}, ${outfit.name}. Trạng thái PENDING, chưa sinh ảnh.`
      });
    }
  }
}

// Build 6 NPC assets
const npcNegativePrompt = 'cropped head, cropped feet, out of frame, cut off, partial body, portrait only, headshot, bust, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic sci-fi neon, fantasy medieval knight, monster, zombie transformation, deformed limbs, extra fingers, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery';

const npcs = [
  {
    id: 'char_npc_v',
    sourceEntityId: 'v',
    characterName: 'Cô V',
    filename: 'npc_co_v.png',
    path: 'public/assets/characters/npc/npc_co_v.png',
    filePath: 'public/assets/characters/npc/npc_co_v.png',
    category: 'npc',
    role: 'Nữ sát thủ đơn độc, người dẫn dắt huấn luyện chiến đấu tại Tiền đồn Bình Minh',
    inGameLocation: 'Tiền đồn Bình Minh (Dawn Outpost)',
    description: 'Nữ sát thủ lạnh lùng, ít nói, trang phục thực dụng phù hợp cận chiến, dao găm là phụ kiện nhận diện đặc trưng, phong thái cảnh giác cao độ.',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of Sister V (Cô V), a deadly and solitary female post-apocalyptic assassin, standing in an agile ready alert posture, woman around 28 years old with short messy black bob hair, sharp piercing cold dark eyes, small faint scar across cheek, wearing a dark weathered tactical combat vest over a dark gray undershirt, reinforced cargo pants, combat boots, holding a signature survival combat dagger in her gloved hand with knife sheath on hip, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D digital illustration, clean silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  },
  {
    id: 'char_npc_xiaohan',
    sourceEntityId: 'xiaohan',
    characterName: 'Tiểu Hàm',
    filename: 'npc_tieu_ham.png',
    path: 'public/assets/characters/npc/npc_tieu_ham.png',
    filePath: 'public/assets/characters/npc/npc_tieu_ham.png',
    category: 'npc',
    role: 'Nữ y tá dã chiến trẻ tuổi tại Doanh địa người sống sót, phụ trách cứu trợ y tế',
    inGameLocation: 'Doanh địa Người Sống Sót (Survivor Camp)',
    description: 'Nữ y tá trẻ tuổi với nụ cười ấm áp, trang phục y tế dã chiến, túi cứu thương và dụng cụ y tế bên người, phong thái thân thiện, luôn quan tâm chăm sóc người khác.',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of Xiao Han (Tiểu Hàm), a kind-hearted young female field medic in a post-apocalyptic survivor camp, standing in a gentle yet prepared posture with a warm compassionate smile, young woman around 22 years old with neat shoulder-length dark hair tied back, wearing a practical rugged field nurse uniform, faded olive and white medic jacket with red cross armband, dark trousers, utility boots, carrying a leather medical trauma kit bag across shoulder with visible bandages and medical instruments, dark survival horror RPG aesthetic, semi-realistic digital illustration, clean sharp silhouette isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  },
  {
    id: 'char_npc_lili',
    sourceEntityId: 'lili',
    characterName: 'Lili',
    filename: 'npc_lili.png',
    path: 'public/assets/characters/npc/npc_lili.png',
    filePath: 'public/assets/characters/npc/npc_lili.png',
    category: 'npc',
    role: 'Nữ thợ máy cơ khí và công nghệ tại Khu Công Nghiệp / Doanh Địa',
    inGameLocation: 'Khu Công Nghiệp / Doanh Địa',
    description: 'Nữ thợ máy phong cách tomboy tinh nghịch, trang phục lao động cơ khí bám dầu mỡ, kính bảo hộ trên trán, phụ kiện cờ lê/kìm búa, phong thái tự tin nhanh nhẹn.',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of Lili, an energetic spunky female mechanic and engineer in a post-apocalyptic world, standing in a confident relaxed tomboy pose resting an adjustable wrench on her shoulder, young woman around 24 years old with short spiky auburn hair with protective goggles pushed up on forehead, smudge of dark grease on her cheek, wearing a heavy-duty denim mechanic jumpsuit with top half tied around waist over a fitted grey work tank-top, reinforced leather work boots, tool belt with pliers, screwdrivers, and measuring tape, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D digital illustration, isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  },
  {
    id: 'char_npc_mumiao',
    sourceEntityId: 'mumiao',
    characterName: 'Mục Miêu Miêu',
    filename: 'npc_muc_mieu_mieu.png',
    path: 'public/assets/characters/npc/npc_muc_mieu_mieu.png',
    filePath: 'public/assets/characters/npc/npc_muc_mieu_mieu.png',
    category: 'npc',
    role: 'Nữ trinh sát đô thị bí ẩn, người dẫn dắt thông tin và nhiệm vụ trinh sát mạt thế',
    inGameLocation: 'Trung tâm thành phố / Các khu vực đổ nát',
    description: 'Nữ trinh sát đô thị bí ẩn, chiếc mũ rộng vành che khuất một phần khuôn mặt, áo măng tô dã chiến, bộ đàm và ống nhòm trinh sát, phong thái kín đáo khó đoán.',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of Mu Miaomiao (Mục Miêu Miêu), a mysterious and elusive female urban scout, standing in a quiet alert posture, young woman in her mid-20s wearing an iconic wide-brim dark weather-beaten fedora hat casting shadow over part of her observant face, worn long trench coat over dark tactical gear, rugged boots, tactical radio transceiver with shoulder antenna on her harness, binoculars strapped to chest, dark cinematic survival RPG aesthetic, semi-realistic digital art, clean silhouette isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  },
  {
    id: 'char_npc_vua_karen',
    sourceEntityId: 'king_boss',
    characterName: 'Vua Karen',
    filename: 'npc_vua_karen.png',
    path: 'public/assets/characters/npc/npc_vua_karen.png',
    filePath: 'public/assets/characters/npc/npc_vua_karen.png',
    category: 'npc',
    role: 'Cựu trùm bất động sản, bạo chúa phong kiến thống trị Lâu đài Mạt thế (Doom Castle)',
    inGameLocation: 'Lâu Đài Tận Thế (Doom Castle)',
    description: 'Cựu trùm bất động sản xây dựng đế chế độc tài mạt thế, trang phục quyền lực xa xỉ mang dấu ấn hậu tận thế, phong thái ngạo mạn, tàn bạo, độc đoán (không phải vua fantasy thời trung cổ).',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of King Karen (Vua Karen), the ruthless former real estate tycoon turned apocalyptic warlord of the Doom Castle, standing in an arrogant imposing stance, middle-aged man around 50 with slicked graying hair, manicured beard, and cold haughty sneer, wearing opulent yet post-apocalyptic attire: a tailored dark velvet warlord trench coat with tarnished gold embroidery and dark fur collar over a reinforced concealed ballistic vest, expensive signet rings on leather-gloved hands, polished high-end leather officer boots, ornate walking cane with gilded eagle pommel, dark survival RPG aesthetic, semi-realistic 3D game character art, NOT medieval fantasy, isolated on solid transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  },
  {
    id: 'char_npc_tien_si_tran',
    sourceEntityId: 'doctor_boss',
    characterName: 'Tiến Sĩ Trần',
    filename: 'npc_tien_si_tran.png',
    path: 'public/assets/characters/npc/npc_tien_si_tran.png',
    filePath: 'public/assets/characters/npc/npc_tien_si_tran.png',
    category: 'npc',
    role: 'Nhà khoa học trưởng Viện Sinh Học, người nắm giữ bí mật nguồn gốc virus và kế hoạch thoát hiểm',
    inGameLocation: 'Viện Sinh Học / Trạm Phóng Vũ Trụ Tuyệt Mật',
    description: 'Nhà khoa học nghiên cứu virus mang gánh nặng tội lỗi, áo choàng blouse phòng thí nghiệm rách sờn, găng tay bảo hộ và mẫu phẩm virus sinh học, phong thái thông minh, mệt mỏi, tuyệt vọng (là con người, không phải zombie/quái vật).',
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    priority: 'P0',
    status: 'PENDING',
    prompt: 'Full-body character concept art of Dr. Tran (Tiến Sĩ Trần), a brilliant, weary, guilt-ridden virologist who holds the secrets of the zombie outbreak, standing in a slightly stooped, tense posture holding a glowing bio-sample vial and a digital research tablet, man in his early 50s with disheveled graying hair and tired hollow eyes behind wire-rimmed glasses, wearing a weathered stained white laboratory coat over tactical survival clothes and bio-hazard apron, heavy rubberized safety gloves and field boots, NOT a zombie, human scientist aesthetic, dark survival horror RPG, semi-realistic digital illustration, isolated on transparent background, whole body visible from head to boots, no cropped limbs, no text, no watermark --ar 2:3',
    negativePrompt: npcNegativePrompt
  }
];

// 1. Write batch-03-characters.json
const batch03 = {
  batchId: 'batch-03-characters',
  title: 'Batch 03: Player Appearance Combinations & Priority Story NPCs',
  description: 'Đặc tả và quản lý 36 asset nhân vật: 30 tổ hợp ngoại hình người chơi (Pre-generated Character Assets) và 6 Story NPC cốt lõi của Zombie World RPG.',
  targetFormat: 'PNG 512x768 (True Alpha Channel RGBA, Transparent Background)',
  aspectRatio: '2:3',
  styleGuide: 'Dark Post-apocalyptic Survival RPG. Semi-realistic 3D game character art, dramatic cinematic rim lighting from top-left, gritty realistic textures (weathered fabrics, scratches, dust, smudges), full-body view from head to boots, clean silhouette isolated on solid transparent background, strictly no background, no text, no logo, no watermark.',
  summary: {
    totalAssets: players.length + npcs.length,
    playerAssetsCount: players.length,
    npcAssetsCount: npcs.length,
    existingCount: 0,
    pendingCount: players.length + npcs.length
  },
  player: players,
  npcs: npcs,
  assets: [...players, ...npcs]
};

fs.writeFileSync('project-docs/assets/batches/batch-03-characters.json', JSON.stringify(batch03, null, 2), 'utf8');
console.log('Saved project-docs/assets/batches/batch-03-characters.json (36 assets)');

// 2. Write player-appearance-manifest.json
const playerManifest = {
  manifestId: 'player-appearance-manifest',
  title: 'Player Appearance Asset Manifest — Zombie World RPG',
  description: 'Danh mục 30 tổ hợp ngoại hình nhân vật người chơi (Pre-generated Character Assets). Toàn bộ ảnh kích thước 512x768 PNG 32-bit trong suốt.',
  totalCombinations: players.length,
  attributes: {
    age: ages.map(a => ({ id: a.id, name: a.name })),
    gender: genders.map(g => ({ id: g.id, name: g.name })),
    outfit: outfits.map(o => ({ id: o.id, name: o.name }))
  },
  baseDirectory: 'public/assets/characters/player/',
  namingConvention: '{age}_{gender}_{outfit}.png',
  technicalSpecs: {
    width: 512,
    height: 768,
    aspectRatio: '2:3',
    format: 'png',
    transparent: true,
    view: 'Full Body'
  },
  combinations: players
};

fs.writeFileSync('project-docs/assets/player-appearance-manifest.json', JSON.stringify(playerManifest, null, 2), 'utf8');
console.log('Saved project-docs/assets/player-appearance-manifest.json (30 combinations)');

// 3. Update project-docs/assets/asset-manifest.json
const masterManifest = JSON.parse(fs.readFileSync('project-docs/assets/asset-manifest.json', 'utf8'));

// Filter out old player/npc entries for batch-03
const keptManifest = masterManifest.filter(item => {
  if (item.category === 'characters') {
    // If it's a player combination or one of the 6 core NPCs, we replace it
    if (item.subCategory === 'player' || item.id.startsWith('char_player_')) return false;
    if (npcs.some(n => n.id === item.id)) return false;
  }
  return true;
});

// Convert players for master manifest
const playerMasterEntries = players.map(p => ({
  id: `char_player_${p.id}`,
  combinationId: p.id,
  name: p.name,
  category: 'characters',
  subCategory: 'player',
  age: p.age,
  ageName: p.ageName,
  gender: p.gender,
  genderName: p.genderName,
  outfit: p.outfit,
  outfitName: p.outfitName,
  description: p.description,
  file: p.path,
  width: 512,
  height: 768,
  aspectRatio: '2:3',
  format: 'png',
  transparent: true,
  priority: 'P0',
  status: 'pending',
  prompt: p.prompt,
  negativePrompt: p.negativePrompt,
  usedBy: ['player-appearance', 'renderStats'],
  fallback: true,
  notes: 'Tổ hợp ngoại hình người chơi (Pre-generated Character Assets) 512x768 PNG transparent. Trạng thái PENDING.'
}));

// Convert npcs for master manifest
const npcMasterEntries = npcs.map(n => ({
  id: n.id,
  sourceEntityId: n.sourceEntityId,
  name: n.characterName,
  category: 'characters',
  subCategory: 'story_npc',
  description: n.description,
  file: n.path,
  width: 512,
  height: 768,
  aspectRatio: '2:3',
  format: 'png',
  transparent: true,
  priority: 'P0',
  status: 'pending',
  prompt: n.prompt,
  negativePrompt: n.negativePrompt,
  usedBy: ['PixiRenderer', 'Story', 'Dialogues'],
  fallback: true,
  notes: `Chân dung toàn thân Story NPC 512x768 PNG transparent (${n.filename}). Trạng thái PENDING.`
}));

const updatedMasterManifest = [...keptManifest, ...playerMasterEntries, ...npcMasterEntries];
fs.writeFileSync('project-docs/assets/asset-manifest.json', JSON.stringify(updatedMasterManifest, null, 2), 'utf8');
console.log(`Saved project-docs/assets/asset-manifest.json: total ${updatedMasterManifest.length} items`);

