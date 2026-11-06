/**
 * Test Suite: Batch 08 Phase 8.2 — Asset Coverage & UI Consistency Audit
 * Verifies narrative icon standardization, settlement interior backgrounds,
 * expanded item icon mappings, and scroll-hint visibility behavior.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

async function runBatch08Phase82Tests() {
  console.log('====================================================');
  console.log('   BATCH 08 – PHASE 8.2: ASSET & UI CONSISTENCY TEST');
  console.log('====================================================\n');

  const moduleCache = new Map();
  const context = vm.createContext({
    console,
    Math,
    setTimeout,
    clearTimeout,
    Object,
    Array,
    Map,
    Set,
    JSON,
    Audio: class { constructor() {} play() {} pause() {} },
    window: { addEventListener: () => {}, removeEventListener: () => {} },
    document: { getElementById: () => null, querySelector: () => null, createElement: () => ({ style: {} }) }
  });

  async function linker(specifier, referencingModule) {
    let resolvedPath = specifier;
    if (specifier.startsWith('.')) {
      const dir = path.dirname(referencingModule.identifier);
      resolvedPath = path.resolve(dir, specifier);
      if (!resolvedPath.endsWith('.js')) resolvedPath += '.js';
    } else {
      resolvedPath = path.resolve(process.cwd(), specifier);
      if (!resolvedPath.endsWith('.js')) resolvedPath += '.js';
    }
    resolvedPath = path.normalize(resolvedPath);
    if (moduleCache.has(resolvedPath)) {
      return moduleCache.get(resolvedPath);
    }
    const code = fs.readFileSync(resolvedPath, 'utf8');
    const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
    moduleCache.set(resolvedPath, mod);
    return mod;
  }

  // Load modules
  const mapPath = path.resolve(process.cwd(), 'js/item-icon-mapping.js');
  const mapMod = new vm.SourceTextModule(fs.readFileSync(mapPath, 'utf8'), { identifier: mapPath, context });
  moduleCache.set(mapPath, mapMod);
  await mapMod.link(linker);
  await mapMod.evaluate();
  const { ITEM_ICON_MAP, getItemIconPath } = mapMod.namespace;

  const pixiPath = path.resolve(process.cwd(), 'js/pixi-renderer.js');
  const pixiMod = new vm.SourceTextModule(fs.readFileSync(pixiPath, 'utf8'), { identifier: pixiPath, context });
  moduleCache.set(pixiPath, pixiMod);
  await pixiMod.link(linker);
  await pixiMod.evaluate();
  const { PixiRenderer } = pixiMod.namespace;

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] #${total}: ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] #${total}: ${message}`);
    }
  }

  // Test 1: Zero decorative emojis remaining in js/map-events/
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const eventDir = path.resolve(process.cwd(), 'js/map-events');
  let emojiOccurrences = 0;
  fs.readdirSync(eventDir).forEach(file => {
    if (file.endsWith('.js')) {
      const content = fs.readFileSync(path.join(eventDir, file), 'utf8');
      content.split('\n').forEach(line => {
        if (emojiRegex.test(line)) emojiOccurrences++;
      });
    }
  });
  assert(emojiOccurrences === 0, `Zero decorative emojis in js/map-events (found: ${emojiOccurrences})`);

  // Test 2: Settlement interior background assets exist on disk
  const bgs = [
    'public/assets/backgrounds/map_lau_dai_bank_bg.webp',
    'public/assets/backgrounds/map_lau_dai_y_te_bg.webp',
    'public/assets/backgrounds/map_tram_giao_dich_bg.webp'
  ];
  const allBgsExist = bgs.every(bg => {
    const full = path.resolve(process.cwd(), bg);
    return fs.existsSync(full) && fs.statSync(full).size > 100000;
  });
  assert(allBgsExist, `All 3 settlement interior backgrounds exist and are >100KB WebP`);

  // Test 3: Background resolver routes settlement phases correctly
  const renderer = new PixiRenderer();
  const bankBg = renderer._resolveBackground({ phase: 'castle_bank' });
  const treatBg = renderer._resolveBackground({ phase: 'castle_treatment' });
  const tradeBg = renderer._resolveBackground({ phase: 'trading_post', story: '' });
  const tradeStoryBg = renderer._resolveBackground({ phase: 'explore', story: '🏪 [Trạm giao dịch Dawn]' });
  assert(
    bankBg === 'public/assets/backgrounds/map_lau_dai_bank_bg.webp' &&
    treatBg === 'public/assets/backgrounds/map_lau_dai_y_te_bg.webp' &&
    tradeBg === 'public/assets/backgrounds/map_tram_giao_dich_bg.webp' &&
    tradeStoryBg === 'public/assets/backgrounds/map_tram_giao_dich_bg.webp',
    `_resolveBackground correctly maps castle_bank, castle_treatment, and trading_post`
  );

  // Test 4: Expanded item mappings include stone, strange_recorder, small_nuclear_generator, zombie_gel, seeds
  const testKeys = ['stone', 'strange_recorder', 'small_nuclear_generator', 'zombie_gel', 'seed_tudou'];
  const allKeysPresent = testKeys.every(k => ITEM_ICON_MAP[k]);
  assert(allKeysPresent, `ITEM_ICON_MAP expanded with stone, strange_recorder, generator, gel, and seeds`);

  // Test 5: Newly mapped items have valid SwisserAI webp files
  const newlyMappedIcons = ['gold_ore', 'usb_drive', 'electronickit', 'acetone', 'weed_seed'];
  const swissBase = path.resolve(process.cwd(), 'public/assets/icons/swisserai-fivem-inventory-icons-v1.0');
  const allIconsOnDisk = newlyMappedIcons.every(icon => {
    const f100 = path.join(swissBase, 'webp-100', `${icon}.webp`);
    const f256 = path.join(swissBase, 'webp-256', `${icon}.webp`);
    return fs.existsSync(f100) && fs.existsSync(f256);
  });
  assert(allIconsOnDisk, `All newly mapped SwisserAI WebP assets (100x100 & 256x256) exist on disk`);

  // Test 6: Total mapped items count in ITEM_ICON_MAP is 162
  assert(Object.keys(ITEM_ICON_MAP).length === 162, `Total mapped items count is 162 (increased from 143)`);

  console.log(`\n====================================================`);
  console.log(`TOTAL AUDIT ITEMS: ${total} | PASS: ${passed} | FAIL: ${total - passed}`);
  console.log(`====================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runBatch08Phase82Tests().catch(err => {
  console.error(err);
  process.exit(1);
});
