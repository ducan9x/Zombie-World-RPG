const fs = require('fs');

// Read existing batch-03 to preserve the exact NPC descriptions, prompts, visual designs
const oldBatch = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));
const npcs = (oldBatch.assets || []).filter(a => a.id.startsWith('char_npc_'));

// 30 Player combinations
const ages = [
  { id: 'teen', name: 'Thanh thiếu niên' },
  { id: 'young_adult', name: 'Thanh niên' },
  { id: 'adult', name: 'Trưởng thành' },
  { id: 'middle_aged', name: 'Trung niên' },
  { id: 'elderly', name: 'Cao tuổi' }
];

const genders = [
  { id: 'male', name: 'Nam' },
  { id: 'female', name: 'Nữ' }
];

const outfits = [
  { id: 'survivor', name: 'Trang phục sinh tồn cơ bản', desc: 'áo khoác sờn, quần túi hộp, thắt lưng sinh tồn' },
  { id: 'tactical', name: 'Trang phục chiến thuật', desc: 'áo giáp nhẹ, dây đeo chiến thuật molle, bao súng' },
  { id: 'casual', name: 'Trang phục thường ngày', desc: 'áo hoodie/sơ mi bụi bặm, quần jeans bạc màu, giày thể thao cũ' }
];

const players = [];

for (const age of ages) {
  for (const gender of genders) {
    for (const outfit of outfits) {
      const id = `${age.id}_${gender.id}_${outfit.id}`;
      const filename = `${id}.png`;
      const path = `public/assets/characters/player/${filename}`;

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
        height: 512,
        aspectRatio: '1:1',
        format: 'png',
        transparent: true,
        priority: 'P0',
        status: 'PENDING',
        notes: `Tổ hợp ngoại hình người chơi: ${age.name}, ${gender.name}, ${outfit.name}. Trạng thái PENDING, chưa sinh ảnh.`
      });
    }
  }
}

// Clean up NPC statuses to PENDING
const cleanedNpcs = npcs.map(npc => ({
  ...npc,
  category: 'npc',
  status: 'PENDING'
}));

const batch03 = {
  batchId: 'batch-03-characters',
  title: 'Batch 03: Player Appearance Combinations & Priority Story NPCs',
  description: 'Quản lý 30 tổ hợp ngoại hình người chơi (Pre-generated Character Assets) và 6 NPC cốt lõi ưu tiên P0 của Zombie World RPG.',
  targetFormat: 'PNG 512x512 / 512x768 (True Alpha Channel RGBA, Transparent Background)',
  styleGuide: 'Dark Post-apocalyptic Survival RPG. Semi-realistic 3D character illustration, cinematic dramatic lighting, gritty realistic textures (weathered fabrics, scratches, dust, smudges), isolated on transparent background, strictly no text or UI watermark.',
  summary: {
    totalAssets: players.length + cleanedNpcs.length,
    playerAssetsCount: players.length,
    npcAssetsCount: cleanedNpcs.length,
    existingCount: 0,
    pendingCount: players.length + cleanedNpcs.length
  },
  player: players,
  npcs: cleanedNpcs,
  assets: [...players, ...cleanedNpcs]
};

fs.writeFileSync('project-docs/assets/batches/batch-03-characters.json', JSON.stringify(batch03, null, 2), 'utf8');
console.log(`Saved batch-03-characters.json: ${players.length} players, ${cleanedNpcs.length} npcs, total ${batch03.assets.length} assets.`);

