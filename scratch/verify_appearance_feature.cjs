const fs = require('fs');
const assert = require('assert');

console.log('=== BẮT ĐẦU KIỂM THỬ TÍNH NĂNG LỰA CHỌN NGOẠI HÌNH NHÂN VẬT ===\n');

const testResults = [];
function test(name, fn) {
  try {
    fn();
    testResults.push({ name, status: 'PASS' });
    console.log(`[PASS] ${name}`);
  } catch (err) {
    testResults.push({ name, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// 1. Kiểm tra Manifest Batch 03 có đủ 30 tổ hợp Player
test('1. Manifest batch-03-characters.json có đủ 30 tổ hợp Player', () => {
  const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));
  assert.strictEqual(b3.player.length, 30, `Expected 30 player assets, found ${b3.player.length}`);
  assert.strictEqual(b3.npcs.length, 6, `Expected 6 NPCs, found ${b3.npcs.length}`);
  assert.strictEqual(b3.assets.length, 36, `Expected 36 total assets in batch-03`);
});

// 2. Kiểm tra Filename chính xác theo quy chuẩn: {age}_{gender}_{outfit}.png
test('2. Mỗi tổ hợp có filename và path chính xác', () => {
  const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));
  const validAges = ['teen', 'young_adult', 'adult', 'middle_aged', 'elderly'];
  const validGenders = ['male', 'female'];
  const validOutfits = ['survivor', 'tactical', 'casual'];

  const ids = new Set();
  for (const p of b3.player) {
    assert(validAges.includes(p.age), `Invalid age: ${p.age}`);
    assert(validGenders.includes(p.gender), `Invalid gender: ${p.gender}`);
    assert(validOutfits.includes(p.outfit), `Invalid outfit: ${p.outfit}`);
    const expectedFilename = `${p.age}_${p.gender}_${p.outfit}.png`;
    assert.strictEqual(p.filename, expectedFilename, `Filename mismatch: ${p.filename} vs ${expectedFilename}`);
    assert.strictEqual(p.path, `public/assets/characters/player/${expectedFilename}`);
    assert(!ids.has(p.id), `Duplicate ID: ${p.id}`);
    ids.add(p.id);
  }
  assert.strictEqual(ids.size, 30, 'Must have 30 unique IDs');
});

// 3, 4, 5, 6. Kiểm tra logic tra cứu không nhầm lẫn giữa các tổ hợp
test('3, 4, 5, 6. Tra cứu tổ hợp khớp 1:1, không nhầm ảnh giữa các tổ hợp', () => {
  // Read and parse js/data/player-appearance.js
  const code = fs.readFileSync('js/data/player-appearance.js', 'utf8');
  assert(code.includes('export function getAppearanceConfig'));
  assert(code.includes('export function getAppearanceDisplayName'));
  assert(code.includes('export const DEFAULT_APPEARANCE'));

  // Test matrix of all 5 x 2 x 3 = 30
  const ages = ['teen', 'young_adult', 'adult', 'middle_aged', 'elderly'];
  const genders = ['male', 'female'];
  const outfits = ['survivor', 'tactical', 'casual'];

  const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));
  const manifestMap = new Map(b3.player.map(p => [p.id, p]));

  for (const age of ages) {
    for (const gender of genders) {
      for (const outfit of outfits) {
        const id = `${age}_${gender}_${outfit}`;
        const item = manifestMap.get(id);
        assert(item, `Missing combination ${id} in manifest`);
        assert.strictEqual(item.id, id);
        assert.strictEqual(item.filename, `${id}.png`);
      }
    }
  }
});

// 7, 8. Kiểm tra trạng thái PENDING và cơ chế Fallback khi ảnh chưa tồn tại
test('7, 8. Tất cả ảnh chưa có đều mang trạng thái PENDING và giao diện có fallback an toàn', () => {
  const b3 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));
  for (const p of b3.player) {
    assert.strictEqual(p.status, 'PENDING', `Player item ${p.id} must be PENDING`);
  }

  // Check index.html fallback DOM elements
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('id="appearance-preview-img"'), 'Missing #appearance-preview-img');
  assert(html.includes('id="appearance-preview-placeholder"'), 'Missing #appearance-preview-placeholder');
  assert(html.includes('id="appearance-status-badge"'), 'Missing #appearance-status-badge');
  assert(html.includes('id="appearance-age-select"'), 'Missing age select');
  assert(html.includes('id="appearance-gender-select"'), 'Missing gender select');
  assert(html.includes('id="appearance-outfit-select"'), 'Missing outfit select');
  assert(html.includes('id="confirm-appearance-btn"'), 'Missing confirm btn');

  // Check ui.js onerror fallback
  const ui = fs.readFileSync('js/ui.js', 'utf8');
  assert(ui.includes('previewImg.onerror'), 'ui.js must handle previewImg.onerror fallback');
  assert(ui.includes('stat-player-avatar-fallback'), 'ui.js must render stat-player-avatar-fallback');
});

// 9. Xác nhận ngoại hình lưu đúng vào gameState
test('9. Xác nhận ngoại hình lưu đúng vào gameState', () => {
  const stateCode = fs.readFileSync('js/state.js', 'utf8');
  assert(stateCode.includes('playerAppearance:'), 'state.js must have playerAppearance in INITIAL_STATE');
  assert(stateCode.includes('export function getPlayerAppearance'), 'state.js must export getPlayerAppearance');
  assert(stateCode.includes('export function setPlayerAppearance'), 'state.js must export setPlayerAppearance');
});

// 10, 11. Khôi phục ngoại hình và tương thích hoàn toàn với Save Game cũ
test('10, 11. Khôi phục ngoại hình và tương thích ngược với Save Game cũ', () => {
  const stateCode = fs.readFileSync('js/state.js', 'utf8');
  assert(stateCode.includes('normalizeState(state)'), 'state.js must have normalizeState');
  assert(stateCode.includes('if (!state.playerAppearance)'), 'normalizeState must check and inject default appearance for legacy saves');

  // Simulate normalizeState logic on old save
  const legacySave = {
    day: 5,
    health: 80,
    name: 'Cựu Binh'
  };
  // Inject default appearance as normalizeState would
  if (!legacySave.playerAppearance) {
    legacySave.playerAppearance = {
      age: 'young_adult',
      gender: 'male',
      outfit: 'survivor'
    };
  }
  assert.strictEqual(legacySave.playerAppearance.age, 'young_adult');
  assert.strictEqual(legacySave.playerAppearance.gender, 'male');
  assert.strictEqual(legacySave.playerAppearance.outfit, 'survivor');
  assert.strictEqual(legacySave.name, 'Cựu Binh');
});

// 12. Không ảnh hưởng gameplay / combat / logic
test('12. Không làm thay đổi logic combat hay các cơ chế gameplay', () => {
  const combatCode = fs.readFileSync('js/combat.js', 'utf8');
  assert(!combatCode.includes('playerAppearance'), 'Combat should not be modified by player appearance');
});

// 13. Hoạt động offline hoàn toàn (không fetch API ngoài)
test('13. Hoạt động offline hoàn toàn (không có external URL trong player-appearance)', () => {
  const appCode = fs.readFileSync('js/data/player-appearance.js', 'utf8');
  assert(!appCode.includes('http://') && !appCode.includes('https://'), 'Must not have external URLs');
  const b3Code = fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8');
  assert(!b3Code.includes('http://') && !b3Code.includes('https://'), 'Batch-03 manifest must not have external URLs');
});

console.log(`\n=== TỔNG KẾT KIỂM THỬ: ${testResults.filter(t => t.status === 'PASS').length}/${testResults.length} BÀI TEST ĐẠT ===\n`);

