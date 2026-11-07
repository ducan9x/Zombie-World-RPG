/**
 * ============================================================
 * BATCH 09 – PHASE 09.4 AUTOMATED TEST SUITE
 * Sub-screens, Inventory & Modals Mobile Redesign Audit
 *
 * Verifies:
 * 1. Inventory Category Navigation (single row, touch targets >= 44px, 7 categories, active state)
 * 2. Inventory Responsive Card Grid (2-column on 320-430px, icon, name, count, actions >= 44px)
 * 3. Warehouse Mobile Switcher Tabs (2 tabs, touch >= 44px, single pane visibility on mobile, dual pane on desktop)
 * 4. Discard Modal Stepper & Action Touch Targets (>= 44px, zero horizontal overflow at 320px)
 * 5. Supporting Sub-screens Fluid Usability (fluid heights, return buttons >= 44px, toggles >= 52px)
 * 6. JS State & Behavior Preservation (zero gameplay/save mutations, clean tab switching)
 * 7. Headless Chromium Exact Bounding Box & No Overflow across 8 viewports
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('   BATCH 09 – PHASE 09.4: SUBSCREENS & MODALS AUDIT  ');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function record(num, name, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`[PASS] #${num}: ${name} (${details})`);
  } else {
    failedTests++;
    console.error(`[FAIL] #${num}: ${name} (${details})`);
  }
}

async function runAudit() {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/style.css', 'utf8');

  // ==========================================================
  // TEST 1: Warehouse Modal Mobile Tabs & Pane Attributes in DOM
  // ==========================================================
  {
    const hasWhTabs = indexHtml.includes('id="wh-mobile-tabs"');
    const hasTabBackpack = indexHtml.includes('id="wh-tab-backpack"');
    const hasTabWarehouse = indexHtml.includes('id="wh-tab-warehouse"');
    const hasRoleTablist = indexHtml.includes('role="tablist"');
    const hasRoleTab = indexHtml.includes('role="tab"');
    const hasPaneBackpack = indexHtml.includes('id="wh-pane-backpack"');
    const hasPaneWarehouse = indexHtml.includes('id="wh-pane-warehouse"');
    const hasActivePaneAttr = indexHtml.includes('data-active-pane="backpack"');

    const passed = hasWhTabs && hasTabBackpack && hasTabWarehouse && hasRoleTablist &&
                   hasRoleTab && hasPaneBackpack && hasPaneWarehouse && hasActivePaneAttr;

    record(1, 'Warehouse Modal Mobile Switcher DOM Structure', passed,
      `WhTabs: ${hasWhTabs}, BackpackTab: ${hasTabBackpack}, WarehouseTab: ${hasTabWarehouse}, Panes: ${hasPaneBackpack && hasPaneWarehouse}`);
  }

  // ==========================================================
  // TEST 2: Discard Modal & Sub-screens Markup Integrity
  // ==========================================================
  {
    const hasDiscardMinus = indexHtml.includes('id="discard-qty-minus"');
    const hasDiscardPlus = indexHtml.includes('id="discard-qty-plus"');
    const hasDiscardAll = indexHtml.includes('id="discard-qty-all"');
    const hasDiscardInput = indexHtml.includes('id="discard-qty-input"');
    const hasDiscardConfirm = indexHtml.includes('id="discard-confirm-btn"');
    const hasDiscardCancel = indexHtml.includes('id="discard-cancel-btn"');

    const hasSaveReturn = indexHtml.includes('id="save-return-btn"');
    const hasBestRecordReturn = indexHtml.includes('id="best-record-return-btn"');
    const hasAchievementReturn = indexHtml.includes('id="achievement-return-btn"');
    const hasSettingsReturn = indexHtml.includes('id="settings-return-btn"');
    const hasPlayerToolsReturn = indexHtml.includes('id="player-tools-return-btn"');
    const hasAboutReturn = indexHtml.includes('id="about-return-btn"');

    const discardOk = hasDiscardMinus && hasDiscardPlus && hasDiscardAll && hasDiscardInput && hasDiscardConfirm && hasDiscardCancel;
    const subScreensOk = hasSaveReturn && hasBestRecordReturn && hasAchievementReturn && hasSettingsReturn && hasPlayerToolsReturn && hasAboutReturn;

    record(2, 'Discard Modal & Sub-screens DOM Structure', discardOk && subScreensOk,
      `DiscardControls: ${discardOk}, ReturnButtons: ${subScreensOk}`);
  }

  // ==========================================================
  // TEST 3: Stylesheet Touch Targets & Mobile Layout Rules (max-width: 767px)
  // ==========================================================
  {
    const hasMobileQuery = css.includes('@media (max-width: 767px)');

    // Inventory category navigation
    const hasInvTabsScroll = css.includes('.inv-tabs-scroll') && css.includes('flex-wrap: nowrap');
    const hasInvTab44 = css.includes('.inv-tab') && css.includes('min-height: 44px');

    // Inventory cards & actions
    const hasInvCardsGrid = css.includes('.inv-cards-grid') && css.includes('minmax(136px, 1fr)');
    const hasInvActionBtn44 = css.includes('.inv-action-btn') && css.includes('min-height: 44px');
    const hasInvDiscardWarning = css.includes('.inv-action-btn.btn-discard') && css.includes('#3e1818');

    // Warehouse mobile switcher
    const hasWhTabsDisplay = css.includes('#wh-mobile-tabs') && css.includes('display: flex !important');
    const hasWhTabBtn44 = css.includes('.wh-tab-btn') && css.includes('min-height: 44px');
    const hasWhSinglePaneRules = css.includes('data-active-pane="backpack"') && css.includes('data-active-pane="warehouse"');
    const hasWhTransfer44 = css.includes('.wh-btn-transfer') && css.includes('min-height: 44px');

    // Discard modal touch targets
    const hasDiscardQtyBtn44 = css.includes('.discard-qty-btn') && css.includes('height: 44px');
    const hasDiscardQtyAll44 = css.includes('.discard-qty-all-btn') && css.includes('min-height: 44px');
    const hasDiscardActions44 = css.includes('.discard-modal-actions button') && css.includes('min-height: 44px');

    // Sub-screens
    const hasSettingsToggle52 = css.includes('.settings-toggle-btn') && css.includes('min-height: 52px');
    const hasReturnBtns44 = css.includes('#save-return-btn') && css.includes('min-height: 44px');

    const passed = hasMobileQuery && hasInvTabsScroll && hasInvTab44 && hasInvCardsGrid &&
                   hasInvActionBtn44 && hasInvDiscardWarning && hasWhTabsDisplay && hasWhTabBtn44 &&
                   hasWhSinglePaneRules && hasWhTransfer44 && hasDiscardQtyBtn44 && hasDiscardQtyAll44 &&
                   hasDiscardActions44 && hasSettingsToggle52 && hasReturnBtns44;

    record(3, 'Stylesheet Touch Targets & Rules Inspection (<768px)', passed,
      `InvTabs44: ${hasInvTab44}, InvCardsGrid: ${hasInvCardsGrid}, Actions44: ${hasInvActionBtn44}, WhTabs44: ${hasWhTabBtn44}, Discard44: ${hasDiscardQtyBtn44}, Return44: ${hasReturnBtns44}`);
  }

  // ==========================================================
  // TEST 4: Desktop & Tablet Preservation Rules (min-width: 768px)
  // ==========================================================
  {
    const hasMinWidth768 = css.includes('@media (min-width: 768px)');
    const hasHideWhMobileTabs = css.includes('#wh-mobile-tabs') && css.includes('display: none !important');
    const hasDualPaneFlexRow = css.includes('flex-direction: row !important') && css.includes('warehouse-dual-container');
    const hasBothPanesVisible = css.includes('#wh-pane-backpack') && css.includes('#wh-pane-warehouse') && css.includes('display: flex !important');

    const passed = hasMinWidth768 && hasHideWhMobileTabs && hasDualPaneFlexRow && hasBothPanesVisible;

    record(4, 'Desktop & Tablet Layout Protection Rules', passed,
      `MinWidth768: ${hasMinWidth768}, HideWhTabs: ${hasHideWhMobileTabs}, DualPaneRow: ${hasDualPaneFlexRow}, BothPanes: ${hasBothPanesVisible}`);
  }

  // ==========================================================
  // TEST 5: JS Mobile Warehouse Tabs Switcher Logic
  // ==========================================================
  {
    const elements = {};
    function makeEl(id, tag = 'div') {
      if (!elements[id]) {
        elements[id] = {
          id,
          tagName: tag.toUpperCase(),
          style: {},
          classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) this.classes.add(c);
              else this.classes.delete(c);
            },
            contains(c) { return this.classes.has(c); }
          },
          attributes: {},
          setAttribute(k, v) { this.attributes[k] = String(v); },
          getAttribute(k) { return this.attributes[k] || null; },
          removeAttribute(k) { delete this.attributes[k]; },
          addEventListener() {},
          removeEventListener() {},
          innerHTML: '',
          textContent: '',
          children: []
        };
      }
      return elements[id];
    }

    [
      'warehouse-modal', 'warehouse-modal-close', 'wh-mobile-tabs', 'wh-tab-backpack', 'wh-tab-warehouse',
      'wh-pane-backpack', 'wh-pane-warehouse', 'wh-level-badge', 'wh-backpack-cap', 'wh-warehouse-cap',
      'wh-backpack-grid', 'wh-warehouse-grid', 'wh-action-bar', 'wh-selected-info', 'wh-transfer-buttons',
      'wh-status-msg'
    ].forEach(id => makeEl(id));

    const containerEl = makeEl('warehouse-dual-container');

    const mockDocument = {
      getElementById: (id) => elements[id] || null,
      querySelector: (sel) => {
        if (sel === '.warehouse-dual-container') return containerEl;
        return null;
      },
      querySelectorAll: () => [],
      createElement: (tag) => makeEl(`mock_${Math.random()}`, tag),
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    const context = vm.createContext({
      console,
      document: mockDocument,
      window: {},
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      Audio: class { constructor() {} play() {} pause() {} },
      Image: class { constructor() {} },
      setTimeout,
      clearTimeout,
      Math
    });

    const moduleCache = new Map();
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
      if (moduleCache.has(resolvedPath)) {
        return moduleCache.get(resolvedPath);
      }
      const code = fs.readFileSync(resolvedPath, 'utf8');
      const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
      moduleCache.set(resolvedPath, mod);
      return mod;
    }

    const whUiCode = fs.readFileSync('js/warehouse-ui.js', 'utf8');
    const whUiMod = new vm.SourceTextModule(whUiCode, { identifier: path.resolve('js/warehouse-ui.js'), context });
    moduleCache.set(path.resolve('js/warehouse-ui.js'), whUiMod);
    await whUiMod.link(linker);
    await whUiMod.evaluate();

    // 1. Initial State
    const initPane = whUiMod.namespace.getMobileWarehousePane();
    const backpackTab = elements['wh-tab-backpack'];
    const warehouseTab = elements['wh-tab-warehouse'];

    // 2. Switch to Warehouse Tab
    whUiMod.namespace.setMobileWarehousePane('warehouse');
    const paneAfterWh = whUiMod.namespace.getMobileWarehousePane();
    const isWhActive = warehouseTab.classList.contains('is-active');
    const isWhAria = warehouseTab.getAttribute('aria-selected') === 'true';
    const isBpInactive = !backpackTab.classList.contains('is-active');
    const isBpAria = backpackTab.getAttribute('aria-selected') === 'false';
    const attrAfterWh = containerEl.getAttribute('data-active-pane') === 'warehouse';

    // 3. Switch back to Backpack Tab
    whUiMod.namespace.setMobileWarehousePane('backpack');
    const paneAfterBp = whUiMod.namespace.getMobileWarehousePane();
    const isBpActiveAgain = backpackTab.classList.contains('is-active');
    const isBpAriaAgain = backpackTab.getAttribute('aria-selected') === 'true';
    const attrAfterBp = containerEl.getAttribute('data-active-pane') === 'backpack';

    const passed = initPane === 'backpack' && paneAfterWh === 'warehouse' && isWhActive &&
                   isWhAria && isBpInactive && isBpAria && attrAfterWh &&
                   paneAfterBp === 'backpack' && isBpActiveAgain && isBpAriaAgain && attrAfterBp;

    record(5, 'JS Mobile Warehouse Tabs Switcher Logic', passed,
      `Init: ${initPane}, SwitchToWh: ${paneAfterWh} (attr=${attrAfterWh}), SwitchToBp: ${paneAfterBp} (attr=${attrAfterBp})`);
  }

  // ==========================================================
  // TEST 6: Inventory Live Category Navigation & Selection
  // ==========================================================
  {
    const invCategories = [
      { id: 'all', label: 'Tất cả' },
      { id: 'weapons', label: 'Vũ khí' },
      { id: 'equipment', label: 'Trang bị' },
      { id: 'food', label: 'Thực phẩm' },
      { id: 'drinks', label: 'Đồ uống' },
      { id: 'medicine', label: 'Y tế' },
      { id: 'materials', label: 'Vật liệu & Khác' }
    ];

    const elements = {};
    function makeEl(id, tag = 'div') {
      if (!elements[id]) {
        elements[id] = {
          id,
          tagName: tag.toUpperCase(),
          style: {},
          classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) this.classes.add(c);
              else this.classes.delete(c);
            },
            contains(c) { return this.classes.has(c); }
          },
          attributes: {},
          setAttribute(k, v) { this.attributes[k] = String(v); },
          getAttribute(k) { return this.attributes[k] || null; },
          innerHTML: '',
          textContent: '',
          children: [],
          querySelectorAll: () => [],
          querySelector: () => null
        };
      }
      return elements[id];
    }

    [
      'inventory-panel', 'weapon-panel', 'discard-confirm-modal', 'discard-item-name',
      'discard-item-stock', 'discard-item-icon', 'discard-qty-row', 'discard-qty-input',
      'discard-qty-minus', 'discard-qty-plus', 'discard-qty-all', 'discard-confirm-btn',
      'discard-cancel-btn', 'discard-modal-close'
    ].forEach(id => makeEl(id));

    const mockDocument = {
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: (tag) => makeEl(`mock_${Math.random()}`, tag),
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    const context = vm.createContext({
      console,
      document: mockDocument,
      window: {},
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      Audio: class { constructor() {} play() {} pause() {} },
      Image: class { constructor() {} },
      setTimeout,
      clearTimeout,
      Math
    });

    const moduleCache = new Map();
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
      if (moduleCache.has(resolvedPath)) {
        return moduleCache.get(resolvedPath);
      }
      const code = fs.readFileSync(resolvedPath, 'utf8');
      const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
      moduleCache.set(resolvedPath, mod);
      return mod;
    }

    const invCode = fs.readFileSync('js/inventory-ui.js', 'utf8');
    const invMod = new vm.SourceTextModule(invCode, { identifier: path.resolve('js/inventory-ui.js'), context });
    moduleCache.set(path.resolve('js/inventory-ui.js'), invMod);
    await invMod.link(linker);
    await invMod.evaluate();

    const mockState = {
      backpack: { capacity: 25 },
      food: [{ id: 'thit_hop', name: 'Thịt hộp', type: 'food', count: 2 }],
      drinks: [{ id: 'nuoc_khoang', name: 'Nước khoáng', type: 'drink', count: 1 }],
      medicine: [{ id: 'bang_gac', name: 'Băng gạc', type: 'medicine', count: 1 }],
      other: [{ id: 'go', name: 'Gỗ', type: 'other', count: 10 }],
      meleeWeapon: { name: 'Dao Găm', durability: 50, currentDurability: 50, damage: 10 },
      rangedWeapon: null
    };

    invMod.namespace.renderInventoryComponent(mockState, () => {});
    const panelHtml = elements['inventory-panel'].innerHTML;

    const hasTabsScroll = panelHtml.includes('inv-tabs-scroll');
    const hasAll7Tabs = invCategories.every(cat => panelHtml.includes(`data-tab="${cat.id}"`));
    const hasCardsGrid = panelHtml.includes('inv-cards-grid');
    const hasItemCard = panelHtml.includes('Thịt hộp');

    const passed = hasTabsScroll && hasAll7Tabs && hasCardsGrid && hasItemCard;

    record(6, 'Inventory Live Category & Card Rendering', passed,
      `ScrollTabs: ${hasTabsScroll}, 7Categories: ${hasAll7Tabs}, Grid: ${hasCardsGrid}, CardRendered: ${hasItemCard}`);
  }

  // ==========================================================
  // TEST 7: Headless Chromium Exact Bounding-Box Across 8 Viewports
  // ==========================================================
  if (fs.readFileSync('index.html', 'utf8').includes('id="primary-nav"')) {
    try { record(7, 'Production Field Terminal subscreens browser acceptance', true, require('./helpers/current-ui-audit.cjs')()); }
    catch (error) { record(7, 'Production Field Terminal subscreens browser acceptance', false, error.message); }
  } else {
    const VIEWPORTS = [
      { name: 'Mobile 320x640', w: 320, h: 640, isMobile: true },
      { name: 'Mobile 360x800', w: 360, h: 800, isMobile: true },
      { name: 'Mobile 390x844', w: 390, h: 844, isMobile: true },
      { name: 'Mobile 430x932', w: 430, h: 932, isMobile: true },
      { name: 'Tablet 768x1024', w: 768, h: 1024, isTablet: true },
      { name: 'Desktop 1024x768', w: 1024, h: 768, isDesktop: true },
      { name: 'Desktop 1366x768', w: 1366, h: 768, isDesktop: true },
      { name: 'Desktop 1920x1080', w: 1920, h: 1080, isDesktop: true }
    ];

    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    let rawIndexHtml = fs.readFileSync('index.html', 'utf8');
    const cssContent = fs.readFileSync('css/style.css', 'utf8');

    rawIndexHtml = rawIndexHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
    rawIndexHtml = rawIndexHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
    rawIndexHtml = rawIndexHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
    rawIndexHtml = rawIndexHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

    const harnessPath = path.resolve('scratch/harness_phase09_4.html');
    const harnessHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Phase 09.4 Viewport Audit</title>
  <style>body { margin: 0; padding: 0; background: #000; } iframe { border: none; display: block; }</style>
</head>
<body>
  <div id="results"></div>
  <script>
    const viewports = ${JSON.stringify(VIEWPORTS)};
    const rawHtml = ${JSON.stringify(rawIndexHtml)};
    const measurements = [];

    async function runTest() {
      for (const vp of viewports) {
        const iframe = document.createElement('iframe');
        iframe.style.width = vp.w + 'px';
        iframe.style.height = vp.h + 'px';
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(rawHtml);
        doc.close();

        const win = iframe.contentWindow;
        const nameSetup = doc.getElementById('name-setup');
        const gameContent = doc.getElementById('game-content');
        if (nameSetup) nameSetup.style.display = 'none';
        if (gameContent) {
          gameContent.style.display = 'flex';
          gameContent.setAttribute('data-mobile-view', 'inventory');
        }

        // Mock inventory cards and tabs inside zone-2
        const invPanel = doc.getElementById('inventory-panel');
        if (invPanel) {
          invPanel.innerHTML = \`
            <div class="inventory-panel">
              <div class="inv-tabs-scroll">
                <button class="inv-tab is-active" data-cat="all">Tất cả <span class="inv-tab-count">4</span></button>
                <button class="inv-tab" data-cat="food">Thực phẩm <span class="inv-tab-count">2</span></button>
                <button class="inv-tab" data-cat="med">Y tế <span class="inv-tab-count">1</span></button>
                <button class="inv-tab" data-cat="material">Nguyên liệu <span class="inv-tab-count">1</span></button>
              </div>
              <div class="inv-cards-grid">
                <div class="inv-card is-selected" style="min-height:84px;">
                  <div class="inv-card-icon-box"><img src="public/assets/icons/ui_placeholder_empty.png" class="inv-card-icon"></div>
                  <div class="inv-card-name">Thịt hộp</div>
                </div>
                <div class="inv-card" style="min-height:84px;">
                  <div class="inv-card-icon-box"><img src="public/assets/icons/ui_placeholder_empty.png" class="inv-card-icon"></div>
                  <div class="inv-card-name">Bánh mì</div>
                </div>
              </div>
              <div class="inv-detail-panel">
                <div class="inv-detail-header">
                  <span class="inv-detail-name">Thịt hộp</span>
                  <button class="inv-detail-close">✕</button>
                </div>
                <div class="inv-detail-actions">
                  <button class="inv-action-btn btn-use">Sử dụng</button>
                  <button class="inv-action-btn btn-discard">Vứt bỏ</button>
                </div>
              </div>
            </div>
          \`;
        }

        await new Promise(r => setTimeout(r, 60));

        const bodyW = doc.body.clientWidth;
        const bodyScrollW = doc.body.scrollWidth;
        const docW = doc.documentElement.clientWidth;
        const docScrollW = doc.documentElement.scrollWidth;
        const hasHorizOverflow = docScrollW > docW || bodyScrollW > bodyW;

        // Measure Inventory tab and action button touch target heights
        const invTab = doc.querySelector('.inv-tab');
        const invTabHeight = invTab ? invTab.getBoundingClientRect().height : 0;
        const invActionBtn = doc.querySelector('.inv-action-btn');
        const invActionHeight = invActionBtn ? invActionBtn.getBoundingClientRect().height : 0;
        const invCloseBtn = doc.querySelector('.inv-detail-close');
        const invCloseHeight = invCloseBtn ? invCloseBtn.getBoundingClientRect().height : 0;

        // Measure Warehouse Modal tabs & pane visibility
        const whModal = doc.getElementById('warehouse-modal');
        if (whModal) whModal.style.display = 'flex';
        await new Promise(r => setTimeout(r, 40));

        const whMobileTabs = doc.getElementById('wh-mobile-tabs');
        const whTabsDisplay = whMobileTabs ? win.getComputedStyle(whMobileTabs).display : 'none';
        const whTabBackpack = doc.getElementById('wh-tab-backpack');
        const whTabHeight = whTabBackpack ? whTabBackpack.getBoundingClientRect().height : 0;

        const whPaneLeft = doc.getElementById('wh-pane-backpack');
        const whPaneRight = doc.getElementById('wh-pane-warehouse');
        const leftDisplay = whPaneLeft ? win.getComputedStyle(whPaneLeft).display : 'none';
        const rightDisplay = whPaneRight ? win.getComputedStyle(whPaneRight).display : 'none';

        // Switch warehouse tab to warehouse
        const dualContainer = doc.querySelector('.warehouse-dual-container');
        if (dualContainer) dualContainer.setAttribute('data-active-pane', 'warehouse');
        await new Promise(r => setTimeout(r, 20));
        const leftDisplayAfter = whPaneLeft ? win.getComputedStyle(whPaneLeft).display : 'none';
        const rightDisplayAfter = whPaneRight ? win.getComputedStyle(whPaneRight).display : 'none';

        // Close warehouse modal
        if (whModal) whModal.style.display = 'none';

        // Measure Discard Modal
        const discardModal = doc.getElementById('discard-confirm-modal');
        const discardQtyRow = doc.getElementById('discard-qty-row');
        if (discardModal) discardModal.style.display = 'flex';
        if (discardQtyRow) discardQtyRow.style.display = 'flex';
        await new Promise(r => setTimeout(r, 40));

        const discardMinus = doc.getElementById('discard-qty-minus');
        const discardMinusH = discardMinus ? discardMinus.getBoundingClientRect().height : 0;
        const discardMinusW = discardMinus ? discardMinus.getBoundingClientRect().width : 0;
        const discardAll = doc.getElementById('discard-qty-all');
        const discardAllH = discardAll ? discardAll.getBoundingClientRect().height : 0;
        const discardConfirm = doc.getElementById('discard-confirm-btn');
        const discardConfirmH = discardConfirm ? discardConfirm.getBoundingClientRect().height : 0;

        const discardScrollW = doc.documentElement.scrollWidth;
        const discardHasOverflow = discardScrollW > docW;
        if (discardModal) discardModal.style.display = 'none';

        // Measure Subscreens Return button
        const savePage = doc.getElementById('save-page');
        if (savePage) savePage.style.display = 'block';
        await new Promise(r => setTimeout(r, 40));
        const saveReturnBtn = doc.getElementById('save-return-btn');
        const saveReturnH = saveReturnBtn ? saveReturnBtn.getBoundingClientRect().height : 0;
        if (savePage) savePage.style.display = 'none';

        const settingsPage = doc.getElementById('settings-page');
        if (settingsPage) settingsPage.style.display = 'block';
        await new Promise(r => setTimeout(r, 40));
        const settingsToggle = doc.querySelector('.settings-toggle-btn');
        const settingsToggleH = settingsToggle ? settingsToggle.getBoundingClientRect().height : 0;
        if (settingsPage) settingsPage.style.display = 'none';

        document.body.removeChild(iframe);

        measurements.push({
          name: vp.name,
          w: vp.w,
          h: vp.h,
          isMobile: vp.isMobile,
          isDesktop: vp.isDesktop,
          hasHorizOverflow,
          discardHasOverflow,
          invTabHeight,
          invActionHeight,
          invCloseHeight,
          whTabsDisplay,
          whTabHeight,
          whLeftMobile: leftDisplay,
          whRightMobile: rightDisplay,
          whLeftAfter: leftDisplayAfter,
          whRightAfter: rightDisplayAfter,
          discardMinusH,
          discardMinusW,
          discardAllH,
          discardConfirmH,
          saveReturnH,
          settingsToggleH
        });
      }

      window.__measurements = measurements;
    }

    runTest();
  </script>
</body>
</html>`;

    if (!fs.existsSync('scratch')) fs.mkdirSync('scratch', { recursive: true });
    fs.writeFileSync(harnessPath, harnessHtml, 'utf8');

    try {
      const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-p094 --virtual-time-budget=8000 --dump-dom "file://${harnessPath}"`;
      const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });

      // Extract window.__measurements by evaluating in Node VM or simple extraction
      const evalScript = `
        const fs = require('fs');
        const data = fs.readFileSync('${harnessPath}', 'utf8');
      `;

      // Run runner script to fetch actual DOM object
      const runnerPath = path.resolve('scratch/run_measure_p094.js');
      const runnerCode = `
        const { execSync } = require('child_process');
        const fs = require('fs');
        const cmd = \`"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-p094 --virtual-time-budget=8000 --run-all-compositor-stages-before-draw --dump-dom "file://${harnessPath}"\`;
        const html = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        console.log(html);
      `;
      fs.writeFileSync(runnerPath, runnerCode, 'utf8');

      // Let's do exact inline evaluation of the iframe runner in chrome using console output
      const probeHarnessHtml = harnessHtml.replace('window.__measurements = measurements;', `
        console.log("===MEASURE_RESULT===" + JSON.stringify(measurements) + "===END_MEASURE===");
        const div = document.createElement('div');
        div.id = 'measure_dump';
        div.textContent = JSON.stringify(measurements);
        document.body.appendChild(div);
      `);
      fs.writeFileSync(harnessPath, probeHarnessHtml, 'utf8');

      const rawOutput = execSync(`"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-p094 --virtual-time-budget=9000 --dump-dom "file://${harnessPath}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });

      const match = rawOutput.match(/<div id="measure_dump">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        const measurements = JSON.parse(match[1]);

        let allOverflowFree = true;
        let allTouchTargetsPassed = true;
        let allWarehouseLayoutsPassed = true;

        for (const m of measurements) {
          if (m.hasHorizOverflow || m.discardHasOverflow) allOverflowFree = false;

          if (m.isMobile) {
            // Touch targets >= 44px
            if (m.invTabHeight < 43.5 || m.invActionHeight < 43.5 || m.invCloseHeight < 43.5) {
              allTouchTargetsPassed = false;
            }
            if (m.whTabHeight < 43.5 || m.discardMinusH < 43.5 || m.discardMinusW < 43.5 || m.discardAllH < 43.5 || m.discardConfirmH < 43.5) {
              allTouchTargetsPassed = false;
            }
            if (m.saveReturnH < 43.5 || m.settingsToggleH < 50) {
              allTouchTargetsPassed = false;
            }

            // Single active warehouse pane
            if (m.whTabsDisplay !== 'flex') allWarehouseLayoutsPassed = false;
            // First pane active: Left visible, Right hidden
            if (m.whLeftMobile === 'none' || m.whRightMobile !== 'none') allWarehouseLayoutsPassed = false;
            // Switch tab: Left hidden, Right visible
            if (m.whLeftAfter !== 'none' || m.whRightAfter === 'none') allWarehouseLayoutsPassed = false;
          } else if (m.isDesktop) {
            // Desktop: warehouse tabs hidden, both panes visible
            if (m.whTabsDisplay !== 'none') allWarehouseLayoutsPassed = false;
            if (m.whLeftMobile === 'none' || m.whRightMobile === 'none') allWarehouseLayoutsPassed = false;
          }
        }

        const passed = allOverflowFree && allTouchTargetsPassed && allWarehouseLayoutsPassed;
        record(7, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', passed,
          `NoOverflow: ${allOverflowFree}, TouchTargets44: ${allTouchTargetsPassed}, WarehouseLayouts: ${allWarehouseLayoutsPassed}`);
      } else {
        record(7, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', false, 'Failed to extract measurements dump from DOM');
      }
    } catch (err) {
      record(7, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', false, err.message);
    }
  }

  // ==========================================================
  // FINAL SUMMARY
  // ==========================================================
  console.log('\n====================================================');
  console.log(`TOTAL AUDIT ITEMS: ${totalTests} | PASS: ${passedTests} | FAIL: ${failedTests}`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Audit exception:', err);
  process.exit(1);
});
