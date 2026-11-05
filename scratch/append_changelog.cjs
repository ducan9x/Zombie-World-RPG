const fs = require('fs');

const changelog = fs.readFileSync('project-docs/CHANGELOG.md', 'utf8');
const entry = '| 2026-11-05 | public/assets/characters/player/, js/data/player-appearance.js, js/state.js, index.html, css/style.css, js/ui.js, project-docs/assets/batches/batch-03-characters.json, project-docs/assets/asset-manifest.json, docs/BATCH_03_CHARACTER_SPEC.md | Trien khai tinh nang lua chon ngoai hinh nhan vat (30 to hop: 5 tuoi x 2 gioi tinh x 3 trang phuc), he thong pre-generated assets offline, fallback placeholder PENDING, dong bo save/load va hien thi ho so nguoi choi | Senior Game Frontend Engineer |\n';

const updated = changelog.trimEnd() + '\n' + entry;
fs.writeFileSync('project-docs/CHANGELOG.md', updated, 'utf8');
console.log('CHANGELOG.md updated successfully!');

