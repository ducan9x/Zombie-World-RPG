import fs from 'fs';

console.log('=== SURVEYING 7 CHARACTERS IN CODEBASE ===');

const filesToSearch = [
  'js/data/entities/npcs.js',
  'js/data/dialogues/story-dialogues.js',
  'js/data/dialogues/castle-dialogues.js',
  'js/castle/royalty.js',
  'docs/phan_tich_cot_truyen_chuyen_sau.md',
  'docs/In-Depth-Story-Analysis.md',
  'docs/huong_dan_tuyen_truyen.md',
  'docs/Story-Route-Guide.md'
];

const targets = [
  { key: 'player', terms: ['Người chơi', 'Nhân vật chính', 'name-input', 'name:'] },
  { key: 'v', terms: ['Cô V', 'id: "v"', '"v":', 'Sát thủ', 'dao găm'] },
  { key: 'xiaohan', terms: ['Tiểu Hàm', 'id: "xiaohan"', '"xiaohan":', 'y tá', 'thuốc'] },
  { key: 'lili', terms: ['Lili', 'id: "lili"', '"lili":', 'thợ máy', 'sửa súng'] },
  { key: 'mumiao', terms: ['Mục Miêu Miêu', 'Mu Miao Miao', 'id: "mumiao"', '"mumiao":'] },
  { key: 'karen', terms: ['Karen', 'Vua Lâu Đài', 'king_boss', 'vua', 'Quốc vương'] },
  { key: 'tran', terms: ['Tiến Sĩ Trần', 'doctor_boss', 'Trần', 'phòng thí nghiệm'] }
];

for (const target of targets) {
  console.log(`\n============================\nTARGET: ${target.key.toUpperCase()}\n============================`);
  for (const file of filesToSearch) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const matched = [];
    lines.forEach((l, idx) => {
      for (const term of target.terms) {
        if (l.includes(term)) {
          matched.push({ line: idx + 1, text: l.trim() });
          break;
        }
      }
    });
    if (matched.length > 0) {
      console.log(`-- In ${file} (${matched.length} matches) --`);
      matched.slice(0, 8).forEach(m => console.log(`   L${m.line}: ${m.text.slice(0, 120)}`));
    }
  }
}

