const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('project-docs/assets/asset-manifest.json', 'utf8'));
const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));

// Convert batch-03 players to asset-manifest format
const playerManifestEntries = b3.player.map(p => ({
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
  description: `Ngoại hình nhân vật người chơi: ${p.ageName}, ${p.genderName}, ${p.outfitName}`,
  file: p.path,
  width: 512,
  height: 512,
  aspectRatio: '1:1',
  format: 'png',
  transparent: true,
  priority: 'P0',
  status: 'pending',
  usedBy: ['player-appearance', 'renderStats'],
  fallback: true,
  notes: 'Tổ hợp ngoại hình người chơi (Pre-generated Character Assets). Trạng thái PENDING.'
}));

// Find index of old char_player_portrait
const oldIndex = manifest.findIndex(m => m.id === 'char_player_portrait');
if (oldIndex !== -1) {
  // Replace old entry with 30 new player entries
  manifest.splice(oldIndex, 1, ...playerManifestEntries);
  console.log(`Replaced char_player_portrait with ${playerManifestEntries.length} player combinations.`);
} else {
  // If not found, append
  manifest.push(...playerManifestEntries);
  console.log(`Appended ${playerManifestEntries.length} player combinations.`);
}

fs.writeFileSync('project-docs/assets/asset-manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Saved project-docs/assets/asset-manifest.json: total ${manifest.length} items.`);

