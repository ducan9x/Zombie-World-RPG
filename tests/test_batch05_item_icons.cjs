/**
 * Test Suite: Batch 05 Phase 1 — Item Icon Mapping & Visual Consistency
 * Verifies mapping accuracy, asset file existence, fallback behavior, and resolution switching.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

async function runBatch05Tests() {
  console.log('====================================================');
  console.log('   BATCH 05 – PHASE 1: ITEM ICON INTEGRATION TEST   ');
  console.log('====================================================\n');

  const moduleCache = new Map();
  const context = vm.createContext({
    console,
    Math,
    setTimeout,
    clearTimeout
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

  // Load item-icon-mapping.js
  const mapPath = path.resolve(process.cwd(), 'js/item-icon-mapping.js');
  const mapCode = fs.readFileSync(mapPath, 'utf8');
  const mapMod = new vm.SourceTextModule(mapCode, { identifier: mapPath, context });
  moduleCache.set(mapPath, mapMod);
  await mapMod.link(linker);
  await mapMod.evaluate();
  const { ITEM_ICON_MAP, getItemIconPath, getItemIconEntry } = mapMod.namespace;

  // Load inventory-ui.js
  const invPath = path.resolve(process.cwd(), 'js/inventory-ui.js');
  const invCode = fs.readFileSync(invPath, 'utf8');
  const invMod = new vm.SourceTextModule(invCode, { identifier: invPath, context });
  moduleCache.set(invPath, invMod);
  await invMod.link(linker);
  await invMod.evaluate();
  const { getItemIcon } = invMod.namespace;

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] #${total}: ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] #${total}: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Verify mapping dictionary integrity
  const mapKeys = Object.keys(ITEM_ICON_MAP);
  assert(mapKeys.length >= 140, `Mapping dictionary contains ${mapKeys.length} mapped game items (>= 140)`);

  // 2. Verify all mapped assets exist on disk in both webp-100 and webp-256
  let allFilesExist = true;
  for (const [id, entry] of Object.entries(ITEM_ICON_MAP)) {
    const p100 = path.resolve(process.cwd(), `public/assets/icons/swisserai-fivem-inventory-icons-v1.0/webp-100/${entry.icon}.webp`);
    const p256 = path.resolve(process.cwd(), `public/assets/icons/swisserai-fivem-inventory-icons-v1.0/webp-256/${entry.icon}.webp`);
    if (!fs.existsSync(p100) || !fs.existsSync(p256)) {
      allFilesExist = false;
      console.error(`Missing file for item ${id}: ${entry.icon}`);
      break;
    }
  }
  assert(allFilesExist, 'All mapped SwisserAI WebP files (100x100 and 256x256) exist on disk');

  // 3. Test food item mapping
  const breadUrl100 = getItemIcon({ id: 'banh_mi_lua_mi', name: 'Bánh mì lúa mì', type: 'food' }, '100');
  const breadUrl256 = getItemIcon({ id: 'banh_mi_lua_mi', name: 'Bánh mì lúa mì', type: 'food' }, '256');
  assert(
    breadUrl100.endsWith('webp-100/bread.webp') && breadUrl256.endsWith('webp-256/bread.webp'),
    'Food item (banh_mi_lua_mi) maps to bread.webp in 100 and 256 sizes'
  );

  // 4. Test drink item mapping
  const waterUrl = getItemIcon({ id: 'nuoc_khoang', name: 'Nước suối', type: 'drink' });
  assert(waterUrl.endsWith('webp-100/water_bottle.webp'), 'Drink item (nuoc_khoang) maps to water_bottle.webp');

  // 5. Test medical item mapping
  const bandUrl = getItemIcon({ id: 'bang_keo', name: 'Băng cá nhân', type: 'medicine' });
  assert(bandUrl.endsWith('webp-100/bandage.webp'), 'Medical item (bang_keo) maps to bandage.webp');

  // 6. Test backpack item mapping
  const bpUrl = getItemIcon({ id: 'balo_le_nui', name: 'Balo leo núi', type: 'backpack' });
  assert(bpUrl.endsWith('webp-100/backpack.webp'), 'Backpack item (balo_le_nui) maps to backpack.webp');

  // 7. Test melee tool item mapping
  const hammerUrl = getItemIcon({ id: 'bua_sat_nho', name: 'Búa sắt nhỏ', type: 'melee' });
  assert(hammerUrl.endsWith('webp-100/hammer.webp'), 'Melee tool item (bua_sat_nho) maps to hammer.webp');

  // 8. Test ammo item mapping
  const ammoUrl = getItemIcon({ id: '9×19mm', name: '9×19mm', type: 'ammo' });
  assert(ammoUrl.endsWith('webp-100/pistol_ammo.webp'), 'Ammo item (9×19mm) maps to pistol_ammo.webp');

  // 9. Test safe fallback for unmapped weapon (sword)
  const swordUrl = getItemIcon({ id: 'dao_samurai', name: 'Đao Samurai', type: 'melee' });
  assert(swordUrl === 'public/assets/icons/ui_icon_melee_slot.png', 'Unmapped melee weapon safely falls back to ui_icon_melee_slot.png');

  // 10. Test safe fallback for unmapped firearm (rifle)
  const akUrl = getItemIcon({ id: 'AK47', name: 'AK47', type: 'ranged' });
  assert(akUrl === 'public/assets/icons/ui_icon_ranged_slot.png', 'Unmapped ranged weapon safely falls back to ui_icon_ranged_slot.png');

  // 11. Test safe fallback for pure energy
  const peUrl = getItemIcon({ id: 'pure_energy', name: 'Năng lượng tinh khiết', type: 'pure_energy' });
  assert(peUrl === 'public/assets/icons/ui_icon_pure_energy.png', 'Pure energy item uses custom Batch 06 icon');

  // 12. Test custom icon override precedence
  const overrideUrl = getItemIcon({ id: 'banh_mi_lua_mi', icon: 'custom/path/icon.png' });
  assert(overrideUrl === 'custom/path/icon.png', 'Explicit item.icon takes precedence over mapped icon');

  // 13. Test null / empty item fallback
  const emptyUrl = getItemIcon(null);
  assert(emptyUrl === 'public/assets/icons/ui_placeholder_empty.png', 'Null/empty item safely falls back to ui_placeholder_empty.png');

  // 14. Test getItemIconEntry metadata lookup
  const meta = getItemIconEntry('banh_quy_nen');
  assert(meta && meta.icon === 'cookies' && meta.quality === 'EXACT', 'getItemIconEntry correctly retrieves quality & packCategory metadata');

  console.log(`\n====================================================`);
  console.log(`TOTAL AUDIT ITEMS: ${total} | PASS: ${passed} | FAIL: ${total - passed}`);
  console.log('====================================================\n');
}

runBatch05Tests().catch(err => {
  console.error(err);
  process.exit(1);
});

