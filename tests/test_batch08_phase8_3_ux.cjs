/* ============================================================
   BATCH 08 – PHASE 8.3: GAMEPLAY UX POLISH & INTERACTION FLOW
   Automated Regression & Acceptance Verification Suite
   ============================================================ */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

async function runPhase83UXTests() {
  console.log('====================================================');
  console.log('   BATCH 08 – PHASE 8.3: GAMEPLAY UX & FLOW TEST    ');
  console.log('====================================================\n');

  const results = [];
  function record(stt, item, pass, notes) {
    results.push({ stt, item, status: pass ? 'PASS' : 'FAIL', notes });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] #${stt}: ${item} (${notes})`);
  }

  // Setup mock DOM & Environment
  const listeners = {};
  const elements = {};

  function makeEl(id, tag = 'div') {
    if (elements[id]) return elements[id];
    const el = {
      id,
      tagName: tag.toUpperCase(),
      style: { display: '' },
      className: '',
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this._classes.has(c)) this._classes.delete(c);
            else this._classes.add(c);
          } else if (force) {
            this._classes.add(c);
          } else {
            this._classes.delete(c);
          }
        },
        contains(c) { return this._classes.has(c); }
      },
      innerHTML: '',
      textContent: '',
      value: '',
      src: '',
      title: '',
      disabled: false,
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 400,
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null,
      addEventListener: (evt, fn) => {
        if (!listeners[id]) listeners[id] = {};
        if (!listeners[id][evt]) listeners[id][evt] = [];
        listeners[id][evt].push(fn);
      },
      removeEventListener: () => {},
      onclick: null,
      oninput: null,
      click() {
        if (this.onclick) this.onclick({ stopPropagation() {}, target: this });
        if (listeners[id] && listeners[id]['click']) {
          listeners[id]['click'].forEach(fn => fn({ stopPropagation() {}, target: this }));
        }
      }
    };
    elements[id] = el;
    return el;
  }

  // Pre-populate mock elements needed for tests
  [
    'discard-confirm-modal', 'discard-item-name', 'discard-item-stock', 'discard-item-icon',
    'discard-qty-row', 'discard-qty-input', 'discard-qty-minus', 'discard-qty-plus', 'discard-qty-all',
    'discard-confirm-btn', 'discard-cancel-btn', 'discard-modal-close',
    'warehouse-modal', 'warehouse-modal-close', 'wh-level-badge', 'wh-backpack-cap', 'wh-warehouse-cap',
    'wh-backpack-grid', 'wh-warehouse-grid', 'wh-action-bar', 'wh-selected-info', 'wh-transfer-buttons',
    'wh-status-msg',
    'player-tools-page', 'player-tools-btn', 'pt-tab-probability', 'pt-tab-encyclopedia', 'pt-open-external-btn',
    'player-tools-frame', 'player-tools-return-btn', 'name-setup',
    'click-mode-btn', 'input-mode-btn', 'music-btn',
    'story-area'
  ].forEach(id => makeEl(id));

  const docListeners = {};
  const mockDocument = {
    getElementById: (id) => makeEl(id),
    createElement: (tag) => makeEl(`mock_${Math.random()}`, tag),
    addEventListener: (evt, fn) => {
      if (!docListeners[evt]) docListeners[evt] = [];
      docListeners[evt].push(fn);
    },
    removeEventListener: (evt, fn) => {
      if (docListeners[evt]) {
        docListeners[evt] = docListeners[evt].filter(f => f !== fn);
      }
    }
  };

  const openedUrls = [];
  const mockWindow = {
    open: (url, target) => { openedUrls.push({ url, target }); },
    renderAllUI: () => {}
  };

  const localStorageData = {};
  const context = vm.createContext({
    console,
    document: mockDocument,
    window: mockWindow,
    localStorage: {
      getItem(k) { return localStorageData[k] || null; },
      setItem(k, v) { localStorageData[k] = String(v); },
      removeItem(k) { delete localStorageData[k]; }
    },
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
    resolvedPath = path.normalize(resolvedPath);
    if (moduleCache.has(resolvedPath)) {
      return moduleCache.get(resolvedPath);
    }
    const code = fs.readFileSync(resolvedPath, 'utf8');
    const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
    moduleCache.set(resolvedPath, mod);
    return mod;
  }

  async function loadModule(relPath) {
    const fullPath = path.normalize(path.resolve(process.cwd(), relPath));
    if (moduleCache.has(fullPath)) {
      return moduleCache.get(fullPath).namespace;
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    const mod = new vm.SourceTextModule(code, { identifier: fullPath, context });
    moduleCache.set(fullPath, mod);
    await mod.link(linker);
    await mod.evaluate();
    return mod.namespace;
  }

  // Load target modules
  const stateMod = await loadModule('js/state.js');
  const invUiMod = await loadModule('js/inventory-ui.js');
  const whUiMod = await loadModule('js/warehouse-ui.js');
  const uiMod = await loadModule('js/ui.js');

  // ----------------------------------------------------
  // TEST 1: Discard Modal Cancel & Close Safety
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.food = [{ id: 'thit_hop', name: 'Thịt hộp', type: 'food', count: 5, hunger: 20 }];
    const targetItem = { id: 'thit_hop', name: 'Thịt hộp', type: 'food', rawTarget: 'food', rawItem: s.food[0], count: 5 };

    invUiMod.openDiscardModal(targetItem, s, () => {});
    const modal = elements['discard-confirm-modal'];
    const isOpen = modal.style.display === 'flex';
    const hasName = elements['discard-item-name'].innerHTML.includes('Thịt hộp');
    const hasStock = elements['discard-item-stock'].textContent.includes('5');

    // Cancel action
    elements['discard-cancel-btn'].click();
    const isClosed = modal.style.display === 'none';
    const countUntouched = s.food[0].count === 5;

    record(1, 'Discard modal cancel safety', isOpen && hasName && hasStock && isClosed && countUntouched,
      `Opened: ${isOpen}, Cancelled cleanly, count untouched: ${countUntouched}`);
  } catch (err) {
    record(1, 'Discard modal cancel safety', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 2: Discard Partial Quantity (Minus/Plus/Confirm)
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.food = [{ id: 'thit_hop', name: 'Thịt hộp', type: 'food', count: 5, hunger: 20 }];
    const targetItem = { id: 'thit_hop', name: 'Thịt hộp', type: 'food', rawTarget: 'food', rawItem: s.food[0], count: 5 };

    invUiMod.openDiscardModal(targetItem, s, () => {});
    elements['discard-qty-plus'].click(); // 1 -> 2
    elements['discard-confirm-btn'].click();

    const remainingCount = s.food[0] ? s.food[0].count : 0;
    const passed = remainingCount === 3;
    record(2, 'Discard partial quantity (2 of 5)', passed, `Remaining count: ${remainingCount} (expected 3)`);
  } catch (err) {
    record(2, 'Discard partial quantity', false, err.message);
  }

  // Wait for action debounce
  await new Promise(r => setTimeout(r, 100));

  // ----------------------------------------------------
  // TEST 3: Discard All Quantity (Discard All Button)
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.food = [{ id: 'banh_mi', name: 'Bánh mì', type: 'food', count: 4, hunger: 15 }];
    const targetItem = { id: 'banh_mi', name: 'Bánh mì', type: 'food', rawTarget: 'food', rawItem: s.food[0], count: 4 };

    invUiMod.openDiscardModal(targetItem, s, () => {});
    elements['discard-qty-all'].click(); // Sets to 4
    elements['discard-confirm-btn'].click();

    const empty = s.food.length === 0;
    record(3, 'Discard all quantity', empty, `Food array length: ${s.food.length} (expected 0)`);
  } catch (err) {
    record(3, 'Discard all quantity', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 4: Warehouse Dual-Pane Render & Level Badge
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.warehouseLevel = 1; // base 30 + 1 * 10 = 40 cap
    s.warehouse = [
      { id: 'go', name: 'Gỗ', type: 'other', count: 10 },
      { id: 'da', name: 'Đá', type: 'other', count: 5 }
    ];
    s.other = [{ id: 'sat_vun', name: 'Sắt vụn', type: 'other', count: 3 }];
    s.backpack = { capacity: 20 };

    whUiMod.openWarehouseModal(s, () => {});
    const modal = elements['warehouse-modal'];
    const isOpen = modal.style.display === 'flex';
    const badgeText = elements['wh-level-badge'].textContent;
    const bpCapText = elements['wh-backpack-cap'].textContent;
    const whCapText = elements['wh-warehouse-cap'].textContent;

    const passed = isOpen && badgeText.includes('Cấp 2') && whCapText.includes('2/40');
    record(4, 'Warehouse dual-pane open & capacity badges', passed,
      `Badge: "${badgeText}", WH Cap: "${whCapText}", BP Cap: "${bpCapText}"`);
  } catch (err) {
    record(4, 'Warehouse dual-pane open & capacity badges', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 5: Warehouse Deposit Transfer (Backpack -> Warehouse)
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.warehouse = [];
    s.warehouseLevel = 0; // cap = 30
    s.food = [{ id: 'thit_kho', name: 'Thịt khô', type: 'food', count: 5, hunger: 25 }];
    const bpItem = { id: 'thit_kho', name: 'Thịt khô', type: 'food', count: 5, rawTarget: 'food', rawItem: s.food[0] };

    // Deposit 2 items
    const res1 = whUiMod.depositBackpackItem(bpItem, 2, s);
    const inWh1 = s.warehouse.length === 1 && s.warehouse[0].count === 2;
    const leftInBp1 = s.food[0].count === 3;

    // Deposit remaining 3 items (merge into stack)
    const res2 = whUiMod.depositBackpackItem(bpItem, 3, s);
    const inWh2 = s.warehouse.length === 1 && s.warehouse[0].count === 5;
    const emptyBp = s.food.length === 0;

    const passed = res1 && res2 && inWh1 && leftInBp1 && inWh2 && emptyBp;
    record(5, 'Warehouse deposit & stack merge', passed,
      `WH slots: ${s.warehouse.length}, WH count: ${s.warehouse[0]?.count}, BP food empty: ${emptyBp}`);
  } catch (err) {
    record(5, 'Warehouse deposit & stack merge', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 6: Warehouse Capacity Guard (Prevent Overfill)
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.warehouseLevel = 0; // cap = 30
    s.warehouse = Array.from({ length: 30 }, (_, i) => ({ id: `prop_${i}`, name: `Vật phẩm ${i}`, type: 'other' }));
    s.other = [{ id: 'new_item', name: 'Đồ mới', type: 'other' }];
    const bpItem = { id: 'new_item', name: 'Đồ mới', type: 'other', rawTarget: 'other', rawItem: s.other[0] };

    const success = whUiMod.depositBackpackItem(bpItem, 1, s);
    const blocked = success === false;
    const whCount = s.warehouse.length;
    const hasErrMsg = elements['wh-status-msg'].textContent.includes('đã đầy');

    const passed = blocked && whCount === 30 && hasErrMsg;
    record(6, 'Warehouse full capacity guard', passed,
      `Blocked: ${blocked}, Count: ${whCount}/30, Error shown: ${hasErrMsg}`);
  } catch (err) {
    record(6, 'Warehouse full capacity guard', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 7: Warehouse Withdraw Transfer (Warehouse -> Backpack)
  // ----------------------------------------------------
  try {
    const s = stateMod.getState();
    s.warehouse = [{ id: 'nuoc_ngot', name: 'Nước ngọt', type: 'drinks', count: 4, hydration: 20 }];
    s.drinks = [];
    s.backpack = { capacity: 20 };

    // Withdraw 1
    const res1 = whUiMod.withdrawWarehouseItem(0, 1, s);
    const inBp1 = s.drinks.length === 1 && s.drinks[0].count === 1;
    const inWh1 = s.warehouse[0].count === 3;

    // Withdraw remaining 3
    const res2 = whUiMod.withdrawWarehouseItem(0, 3, s);
    const inBp2 = s.drinks[0].count === 4;
    const whEmpty = s.warehouse.length === 0;

    const passed = res1 && res2 && inBp1 && inWh1 && inBp2 && whEmpty;
    record(7, 'Warehouse withdraw & backpack stacking', passed,
      `BP drinks count: ${s.drinks[0]?.count}, WH empty: ${whEmpty}`);
  } catch (err) {
    record(7, 'Warehouse withdraw & backpack stacking', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 8: Player Tools Internalization & Disposal
  // ----------------------------------------------------
  try {
    uiMod.initUI();
    const toolsBtn = elements['player-tools-btn'];
    const tabProb = elements['pt-tab-probability'];
    const tabEncy = elements['pt-tab-encyclopedia'];
    const openExtBtn = elements['pt-open-external-btn'];
    const returnBtn = elements['player-tools-return-btn'];
    const frame = elements['player-tools-frame'];

    // 1. Open tools page
    toolsBtn.click();
    const frameUrl1 = frame.src;
    const isProbActive1 = tabProb.classList.contains('is-active');

    // 2. Switch tab to Encyclopedia
    tabEncy.click();
    const frameUrl2 = frame.src;
    const isEncyActive = tabEncy.classList.contains('is-active');

    // 3. Open External tab
    openExtBtn.click();
    const lastOpened = openedUrls[openedUrls.length - 1];

    // 4. Return to main menu (clean disposal)
    returnBtn.click();
    const frameDisposed = frame.src === 'about:blank';

    const passed = frameUrl1.includes('probability.html') &&
                   isProbActive1 &&
                   frameUrl2.includes('encyclopedia.html') &&
                   isEncyActive &&
                   lastOpened && lastOpened.url.includes('encyclopedia.html') &&
                   frameDisposed;

    record(8, 'Player tools internalized tabs & clean disposal', passed,
      `Tab 1: ${frameUrl1}, Tab 2: ${frameUrl2}, Ext URL: ${lastOpened?.url}, Disposed: ${frameDisposed}`);
  } catch (err) {
    record(8, 'Player tools internalized tabs & clean disposal', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 9: Tactical Settings Rocker Switch Render
  // ----------------------------------------------------
  try {
    stateMod.saveGameSettings({ clickMode: true, inputMode: false, musicEnabled: true });

    uiMod.renderSettingsPage();

    const clickBtn = elements['click-mode-btn'];
    const inputBtn = elements['input-mode-btn'];
    const musicBtn = elements['music-btn'];

    const clickHasOn = clickBtn.className.includes('on');
    const clickHasRocker = clickBtn.innerHTML.includes('rocker-switch is-on') && clickBtn.innerHTML.includes('BẬT');
    const clickHasLed = clickBtn.innerHTML.includes('led-active');

    const inputHasOff = inputBtn.className.includes('off');
    const inputHasRocker = inputBtn.innerHTML.includes('rocker-switch is-off') && inputBtn.innerHTML.includes('TẮT');

    const musicHasOn = musicBtn.className.includes('on');

    const passed = clickHasOn && clickHasRocker && clickHasLed && inputHasOff && inputHasRocker && musicHasOn;
    record(9, 'Tactical settings rocker switches & LED state', passed,
      `ClickMode ON with LED: ${clickHasOn && clickHasLed}, InputMode OFF: ${inputHasOff}`);
  } catch (err) {
    record(9, 'Tactical settings rocker switches & LED state', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 10: Narrative Scroll Preservation Logic
  // ----------------------------------------------------
  try {
    const storyArea = elements['story-area'];
    storyArea.scrollHeight = 1000;
    storyArea.clientHeight = 400;

    // Case A: Near bottom (scrollTop = 550, distanceFromBottom = 1000 - (550 + 400) = 50 <= 80)
    storyArea.scrollTop = 550;
    uiMod.scrollStoryToBottomIfNeeded(storyArea);
    const scrolledToBottom = storyArea.scrollTop === 1000;

    // Case B: Scrolled up reading history (scrollTop = 200, distanceFromBottom = 1000 - (200 + 400) = 400 > 80)
    storyArea.scrollTop = 200;
    uiMod.scrollStoryToBottomIfNeeded(storyArea);
    const positionPreserved = storyArea.scrollTop === 200;

    const passed = scrolledToBottom && positionPreserved;
    record(10, 'Narrative scroll preservation (threshold <= 80px)', passed,
      `At bottom auto-scrolled: ${scrolledToBottom}, Scrolled up preserved: ${positionPreserved}`);
  } catch (err) {
    record(10, 'Narrative scroll preservation', false, err.message);
  }

  console.log('\n====================================================');
  const allPass = results.every(r => r.status === 'PASS');
  console.log(`TOTAL AUDIT ITEMS: ${results.length} | PASS: ${results.filter(r => r.status === 'PASS').length} | FAIL: ${results.filter(r => r.status === 'FAIL').length}`);
  console.log('====================================================\n');

  if (!allPass) {
    process.exit(1);
  }
}

runPhase83UXTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
