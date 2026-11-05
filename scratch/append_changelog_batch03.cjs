const fs = require('fs');

const changelog = fs.readFileSync('project-docs/CHANGELOG.md', 'utf8');
const entry = '| 2026-11-05 | docs/BATCH_03_CHARACTER_SPEC.md, project-docs/assets/batches/batch-03-characters.json, project-docs/assets/player-appearance-manifest.json, project-docs/assets/asset-manifest.json | Chuan hoa toan dien Batch 03 (36 Character Assets): 30 Player combinations (5 tuoi x 2 gioi tinh x 3 trang phuc) va 6 Story NPC; quy chuan 512x768 PNG RGBA transparent 2:3, prompt AI chi tiet, dong bo thu muc public/assets/characters/npc/ va tai lieu BATCH_03_CHARACTER_SPEC.md v2.5 | Senior Game Frontend Engineer |\n';

const updated = changelog.trimEnd() + '\n' + entry;
fs.writeFileSync('project-docs/CHANGELOG.md', updated, 'utf8');
console.log('CHANGELOG.md updated successfully!');

