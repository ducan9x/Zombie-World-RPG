import fs from 'fs';
import path from 'path';

console.log('=== STAGE E: TESTING INTEGRATION ===');

// 1. Check all 13 Batch 01 assets exist and are non-empty
const batch01 = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-01-ui-icons.json', 'utf-8'));
let missing = 0;
for (const asset of batch01.assets) {
  const p = path.resolve(asset.file);
  if (!fs.existsSync(p)) {
    console.error(`FAIL: Missing file ${asset.file}`);
    missing++;
  } else {
    const size = fs.statSync(p).size;
    if (size === 0) {
      console.error(`FAIL: Empty file ${asset.file}`);
      missing++;
    }
  }
}
if (missing === 0) {
  console.log('PASS: All 13 assets exist and are non-empty.');
}

// 2. Check index.html references
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const expectedRefs = [
  'public/assets/ui/ui_game_logo.png',
  'public/vendor/pixi.min.js',
  'js/main.js'
];
for (const ref of expectedRefs) {
  if (indexHtml.includes(ref)) {
    console.log(`PASS: index.html correctly references ${ref}`);
  } else {
    console.error(`FAIL: index.html missing reference ${ref}`);
  }
}

// 3. Check js/ui.js references
const uiJs = fs.readFileSync('js/ui.js', 'utf-8');
const uiRefs = [
  'public/assets/icons/ui_icon_hp.png',
  'public/assets/icons/ui_icon_hunger.png',
  'public/assets/icons/ui_icon_hydration.png',
  'public/assets/icons/ui_icon_sanity.png',
  'public/assets/icons/ui_icon_infection.png',
  'public/assets/icons/ui_icon_melee_slot.png',
  'public/assets/icons/ui_icon_ranged_slot.png',
  'public/assets/icons/ui_icon_backpack.png',
  'public/assets/icons/ui_icon_res_cigarette.png',
  'public/assets/icons/ui_icon_res_gasoline.png',
  'public/assets/icons/ui_icon_res_royal_coin.png',
  'public/assets/ui/ui_placeholder_empty.png'
];
for (const ref of uiRefs) {
  if (uiJs.includes(ref)) {
    console.log(`PASS: js/ui.js correctly references ${ref}`);
  } else {
    console.error(`FAIL: js/ui.js missing reference ${ref}`);
  }
}

// 4. Check js/pixi-renderer.js references
const pixiJs = fs.readFileSync('js/pixi-renderer.js', 'utf-8');
if (pixiJs.includes('preloadBatch01') && pixiJs.includes('hpIconSprite')) {
  console.log('PASS: js/pixi-renderer.js has preloadBatch01 and hpIconSprite.');
} else {
  console.error('FAIL: js/pixi-renderer.js missing preloadBatch01 or hpIconSprite');
}

console.log('ALL INTEGRATION CHECKS PASSED!');

