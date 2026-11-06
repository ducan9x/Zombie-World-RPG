const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('docs/screenshots/phase09_4');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let baseHtml = fs.readFileSync('index.html', 'utf8');
const cssContent = fs.readFileSync('css/style.css', 'utf8');

// Inline CSS so headless browser renders completely and reliably
baseHtml = baseHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
baseHtml = baseHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

const sampleItemsHtml = `
  <div class="inventory-panel">
    <div class="inv-header">
      <div class="inv-header-top">
        <span class="inv-header-title">🎒 Ba lô dã chiến</span>
        <span class="inv-capacity-text cap-normal">8/25 ô</span>
      </div>
      <div class="inv-capacity-track">
        <div class="inv-capacity-fill cap-normal" style="width: 32%;"></div>
      </div>
    </div>
    <div class="inv-tabs-scroll">
      <button class="inv-tab is-active" data-tab="all">Tất cả <span class="inv-tab-count">(4)</span></button>
      <button class="inv-tab" data-tab="food">Thực phẩm <span class="inv-tab-count">(2)</span></button>
      <button class="inv-tab" data-tab="drinks">Đồ uống <span class="inv-tab-count">(1)</span></button>
      <button class="inv-tab" data-tab="medicine">Y tế <span class="inv-tab-count">(1)</span></button>
      <button class="inv-tab" data-tab="weapons">Vũ khí <span class="inv-tab-count">(1)</span></button>
      <button class="inv-tab" data-tab="equipment">Trang bị <span class="inv-tab-count">(0)</span></button>
      <button class="inv-tab" data-tab="materials">Vật liệu <span class="inv-tab-count">(0)</span></button>
    </div>
    <div class="inv-cards-grid">
      <div class="inv-card is-selected">
        <span class="inv-badge-count">x2</span>
        <div class="inv-card-icon-box"><img src="public/assets/icons/ui_icon_hunger.png" class="inv-card-icon"></div>
        <div class="inv-card-name">Thịt Hộp Quân Đội</div>
        <div class="inv-card-subtext">+35 Bụng no</div>
      </div>
      <div class="inv-card">
        <span class="inv-badge-count">x1</span>
        <div class="inv-card-icon-box"><img src="public/assets/icons/ui_icon_hydration.png" class="inv-card-icon"></div>
        <div class="inv-card-name">Nước Khoáng Tinh Khiết</div>
        <div class="inv-card-subtext">+40 Giải khát</div>
      </div>
      <div class="inv-card">
        <span class="inv-badge-count">x1</span>
        <div class="inv-card-icon-box"><img src="public/assets/icons/ui_icon_hp.png" class="inv-card-icon"></div>
        <div class="inv-card-name">Băng Gạc Kháng Khuẩn</div>
        <div class="inv-card-subtext">+25 Máu</div>
      </div>
      <div class="inv-card is-equipped">
        <span class="inv-badge-equipped">Đang trang bị</span>
        <div class="inv-card-icon-box"><img src="public/assets/icons/ui_icon_melee_slot.png" class="inv-card-icon"></div>
        <div class="inv-card-name">Dao Găm Quân Dụng</div>
        <div class="inv-card-subtext">Sát thương 15</div>
      </div>
    </div>
    <div class="inv-detail-panel">
      <div class="inv-detail-header">
        <div class="inv-detail-title-group">
          <img src="public/assets/icons/ui_icon_hunger.png" class="inv-detail-icon">
          <div>
            <div class="inv-detail-name">Thịt Hộp Quân Đội</div>
            <span class="inv-detail-tag">Thực phẩm</span>
          </div>
        </div>
        <button class="inv-detail-close">✕</button>
      </div>
      <div class="inv-detail-stats">
        <div class="inv-stat-item"><span class="inv-stat-label">Số lượng:</span><span class="inv-stat-val text-green">2</span></div>
        <div class="inv-stat-item"><span class="inv-stat-label">Hồi phục:</span><span class="inv-stat-val text-warn">+35 No</span></div>
      </div>
      <div class="inv-detail-actions">
        <button class="inv-action-btn btn-use">🍽️ Ăn (Sử dụng)</button>
        <button class="inv-action-btn btn-discard">🗑️ Vứt bỏ vật phẩm</button>
      </div>
    </div>
  </div>
`;

const sampleWhCardsBackpack = `
  <div class="wh-item-card is-selected">
    <span class="wh-item-card-count">x5</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_hunger.png"></div>
    <div class="wh-item-card-name">Thịt Hộp</div>
  </div>
  <div class="wh-item-card">
    <span class="wh-item-card-count">x2</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_hydration.png"></div>
    <div class="wh-item-card-name">Nước Suối</div>
  </div>
  <div class="wh-item-card">
    <span class="wh-item-card-count">x10</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_pure_energy.png"></div>
    <div class="wh-item-card-name">Gỗ Củi</div>
  </div>
`;

const sampleWhCardsBase = `
  <div class="wh-item-card is-selected">
    <span class="wh-item-card-count">x50</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_res_gasoline.png"></div>
    <div class="wh-item-card-name">Xăng Dầu</div>
  </div>
  <div class="wh-item-card">
    <span class="wh-item-card-count">x100</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_res_cigarette.png"></div>
    <div class="wh-item-card-name">Thuốc Lá</div>
  </div>
  <div class="wh-item-card">
    <span class="wh-item-card-count">x20</span>
    <div class="wh-item-card-icon-box"><img src="public/assets/icons/ui_icon_res_royal_coin.png"></div>
    <div class="wh-item-card-name">Tiền Hoàng Gia</div>
  </div>
`;

function capture(html, w, h, outFile) {
  const tempPath = path.resolve(`scratch/tmp_${path.basename(outFile)}.html`);
  fs.writeFileSync(tempPath, html, 'utf8');
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-shot-p094 --window-size=${w},${h} --screenshot="${outFile}" "file://${tempPath}"`;
  execSync(cmd, { stdio: ['pipe', 'ignore', 'ignore'] });
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  console.log(`[Captured] ${path.basename(outFile)} (${w}x${h})`);
}

// 1. Inventory Mobile 320x640
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="inventory">');
  h = h.replace('<div id="inventory-panel"></div>', `<div id="inventory-panel">${sampleItemsHtml}</div>`);
  capture(h, 320, 640, path.join(outDir, '01_inventory_mobile_320x640.png'));
}

// 2. Inventory Mobile 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="inventory">');
  h = h.replace('<div id="inventory-panel"></div>', `<div id="inventory-panel">${sampleItemsHtml}</div>`);
  capture(h, 390, 844, path.join(outDir, '02_inventory_mobile_390x844.png'));
}

// 3. Inventory Detail Actions 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="inventory">');
  h = h.replace('<div id="inventory-panel"></div>', `<div id="inventory-panel">${sampleItemsHtml}</div>`);
  capture(h, 390, 844, path.join(outDir, '03_inventory_detail_actions_390x844.png'));
}

// 4. Warehouse Modal Backpack Tab (Mobile 390x844)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="warehouse-modal" class="modal-overlay" style="display:none;">',
    '<div id="warehouse-modal" class="modal-overlay" style="display:flex;">');
  h = h.replace('<div class="warehouse-dual-container" data-active-pane="backpack">',
    '<div class="warehouse-dual-container" data-active-pane="backpack">');
  h = h.replace('<div id="wh-backpack-grid" class="wh-cards-grid"></div>',
    `<div id="wh-backpack-grid" class="wh-cards-grid">${sampleWhCardsBackpack}</div>`);
  h = h.replace('<div id="wh-warehouse-grid" class="wh-cards-grid"></div>',
    `<div id="wh-warehouse-grid" class="wh-cards-grid">${sampleWhCardsBase}</div>`);
  h = h.replace('<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:none;"></div>',
    `<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:flex;">
      <button class="wh-btn-transfer">Cất vào kho (1 cái)</button>
      <button class="wh-btn-transfer">Cất tất cả (5 cái)</button>
    </div>`);
  capture(h, 390, 844, path.join(outDir, '04_warehouse_backpack_tab_390x844.png'));
}

// 5. Warehouse Modal Base Tab (Mobile 390x844)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="warehouse-modal" class="modal-overlay" style="display:none;">',
    '<div id="warehouse-modal" class="modal-overlay" style="display:flex;">');
  h = h.replace('<button type="button" id="wh-tab-backpack" role="tab" class="wh-tab-btn is-active" aria-selected="true"',
    '<button type="button" id="wh-tab-backpack" role="tab" class="wh-tab-btn" aria-selected="false"');
  h = h.replace('<button type="button" id="wh-tab-warehouse" role="tab" class="wh-tab-btn" aria-selected="false"',
    '<button type="button" id="wh-tab-warehouse" role="tab" class="wh-tab-btn is-active" aria-selected="true"');
  h = h.replace('<div class="warehouse-dual-container" data-active-pane="backpack">',
    '<div class="warehouse-dual-container" data-active-pane="warehouse">');
  h = h.replace('<div id="wh-backpack-grid" class="wh-cards-grid"></div>',
    `<div id="wh-backpack-grid" class="wh-cards-grid">${sampleWhCardsBackpack}</div>`);
  h = h.replace('<div id="wh-warehouse-grid" class="wh-cards-grid"></div>',
    `<div id="wh-warehouse-grid" class="wh-cards-grid">${sampleWhCardsBase}</div>`);
  h = h.replace('<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:none;"></div>',
    `<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:flex;">
      <button class="wh-btn-transfer">Rút về ba lô (1 cái)</button>
      <button class="wh-btn-transfer">Rút tất cả (50 cái)</button>
    </div>`);
  capture(h, 390, 844, path.join(outDir, '05_warehouse_base_tab_390x844.png'));
}

// 6. Discard Modal (Mobile 320x640)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="discard-confirm-modal" class="modal-overlay" style="display:none;">',
    '<div id="discard-confirm-modal" class="modal-overlay" style="display:flex;">');
  h = h.replace('<div id="discard-qty-row" class="discard-qty-row" style="display:none;">',
    '<div id="discard-qty-row" class="discard-qty-row" style="display:flex;">');
  h = h.replace('<div id="discard-item-name" class="discard-item-name">Tên vật phẩm</div>',
    '<div id="discard-item-name" class="discard-item-name">Thịt Hộp Hết Hạn</div>');
  h = h.replace('<div id="discard-item-stock" class="discard-item-stock">Số lượng có: 1</div>',
    '<div id="discard-item-stock" class="discard-item-stock">Số lượng có: 5</div>');
  capture(h, 320, 640, path.join(outDir, '06_discard_modal_mobile_320x640.png'));
}

// 7. Settings Mobile 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="settings-page" style="display:none;">',
    '<div id="settings-page" style="display:block;">');
  h = h.replace('<button id="click-mode-btn" class="settings-toggle-btn"></button>',
    `<button id="click-mode-btn" class="settings-toggle-btn on">
      <span class="rocker-label">🖱️ Chế độ nhấp chuột trực tiếp</span>
      <span class="rocker-switch"><span class="rocker-status">BẬT</span></span>
    </button>`);
  h = h.replace('<button id="input-mode-btn" class="settings-toggle-btn"></button>',
    `<button id="input-mode-btn" class="settings-toggle-btn off">
      <span class="rocker-label">⌨️ Chế độ gõ số dòng lệnh</span>
      <span class="rocker-switch"><span class="rocker-status">TẮT</span></span>
    </button>`);
  capture(h, 390, 844, path.join(outDir, '07_settings_mobile_390x844.png'));
}

// 8. Save Page Mobile 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="save-page" style="display:none;">',
    '<div id="save-page" style="display:block;">');
  h = h.replace('<div id="save-slots-area"></div>', `
    <div id="save-slots-area">
      <div class="option-item auto-save-slot">📁 [Tự động] Ngày 4 - Trại sinh tồn - HP: 85%</div>
      <div class="option-item">💾 [Ô 1] Ngày 3 - Trạm Y Tế - HP: 100%</div>
      <div class="option-item">💾 [Ô 2] (Ô lưu trống)</div>
    </div>
  `);
  capture(h, 390, 844, path.join(outDir, '08_save_page_mobile_390x844.png'));
}

// 9. Desktop Inventory 1366x768
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;">');
  h = h.replace('<div id="inventory-panel"></div>', `<div id="inventory-panel">${sampleItemsHtml}</div>`);
  capture(h, 1366, 768, path.join(outDir, '09_desktop_inventory_1366x768.png'));
}

// 10. Desktop Warehouse Dual Pane 1366x768
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="warehouse-modal" class="modal-overlay" style="display:none;">',
    '<div id="warehouse-modal" class="modal-overlay" style="display:flex;">');
  h = h.replace('<div id="wh-backpack-grid" class="wh-cards-grid"></div>',
    `<div id="wh-backpack-grid" class="wh-cards-grid">${sampleWhCardsBackpack}</div>`);
  h = h.replace('<div id="wh-warehouse-grid" class="wh-cards-grid"></div>',
    `<div id="wh-warehouse-grid" class="wh-cards-grid">${sampleWhCardsBase}</div>`);
  h = h.replace('<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:none;"></div>',
    `<div id="wh-transfer-buttons" class="wh-transfer-buttons" style="display:flex;">
      <button class="wh-btn-transfer">Cất vào kho (1 cái)</button>
      <button class="wh-btn-transfer">Cất tất cả (5 cái)</button>
    </div>`);
  capture(h, 1366, 768, path.join(outDir, '10_desktop_warehouse_dual_pane_1366x768.png'));
}

console.log('All Phase 09.4 screenshots captured successfully!');

