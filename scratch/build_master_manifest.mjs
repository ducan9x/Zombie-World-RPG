import fs from 'fs';
import path from 'path';

console.log('=== BUILDING MASTER ASSET MANIFEST & ROADMAP ===');

// Check disk assets
function fileInfo(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, sizeKB: 0, realFormat: 'NONE' };
  }
  const stat = fs.statSync(filePath);
  const buf = Buffer.alloc(16);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 16, 0);
  fs.closeSync(fd);

  let realFormat = 'UNKNOWN';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) realFormat = 'PNG';
  else if (buf[0] === 0xFF && buf[1] === 0xD8) realFormat = 'JPEG';
  else if (buf.toString('ascii', 0, 4) === 'RIFF') realFormat = 'WEBP';

  return {
    exists: true,
    sizeKB: Math.round(stat.size / 1024),
    realFormat
  };
}

// 1. Audit Batch 01 UI assets
const uiAssets = [
  { id: 'ui_game_logo', name: 'Game Logo Title', cat: 'UI', file: 'public/assets/ui/ui_game_logo.png', dim: '1024x512', fmt: 'PNG', trans: true, ref: 'index.html (#header-logo)', role: 'Logo tiêu đề trò chơi trên Header' },
  { id: 'ui_icon_hp', name: 'HP Vitality Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_hp.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderStats), js/pixi-renderer.js (hpIconSprite)', role: 'Icon chỉ số máu trên Stats & Canvas HP bar' },
  { id: 'ui_icon_hunger', name: 'Hunger Satiety Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_hunger.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderStats)', role: 'Icon chỉ số đói / no' },
  { id: 'ui_icon_hydration', name: 'Hydration Water Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_hydration.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderStats)', role: 'Icon chỉ số nước' },
  { id: 'ui_icon_sanity', name: 'Sanity Mind Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_sanity.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderStats)', role: 'Icon chỉ số lý trí tâm lý' },
  { id: 'ui_icon_infection', name: 'Infection Biohazard Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_infection.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderStats)', role: 'Icon chỉ số nhiễm bệnh' },
  { id: 'ui_icon_backpack', name: 'Backpack Inventory Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_backpack.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderInventory)', role: 'Icon tiêu đề bảng ba lô túi đồ' },
  { id: 'ui_icon_melee_slot', name: 'Melee Weapon Slot Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_melee_slot.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderWeapons)', role: 'Icon slot vũ khí cận chiến' },
  { id: 'ui_icon_ranged_slot', name: 'Ranged Weapon Slot Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_ranged_slot.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderWeapons)', role: 'Icon slot vũ khí tầm xa' },
  { id: 'ui_icon_res_cigarette', name: 'Cigarette Currency Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_res_cigarette.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderCargo)', role: 'Icon tài nguyên thuốc lá hàng hóa' },
  { id: 'ui_icon_res_gasoline', name: 'Gasoline Fuel Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_res_gasoline.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderCargo)', role: 'Icon tài nguyên xăng xe' },
  { id: 'ui_icon_res_royal_coin', name: 'Royal Coin Gold Icon', cat: 'UI', file: 'public/assets/icons/ui_icon_res_royal_coin.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderCargo)', role: 'Icon tiền hoàng gia Lâu đài' },
  { id: 'ui_placeholder_empty', name: 'Empty Slot Placeholder', cat: 'UI', file: 'public/assets/ui/ui_placeholder_empty.png', dim: '256x256', fmt: 'PNG', trans: true, ref: 'js/ui.js (renderOptions)', role: 'Icon hiển thị trong ô lựa chọn trống' }
];

console.log('Batch 01 UI count:', uiAssets.length);
uiAssets.forEach(a => {
  const info = fileInfo(a.file);
  console.log(`  ${a.id}: exists=${info.exists}, realFormat=${info.realFormat}, size=${info.sizeKB}KB`);
});

