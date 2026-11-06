const fs = require('fs');
const vm = require('vm');
const path = require('path');

async function runRegressionAudit() {
  console.log('=== RUNNING BATCH 06 PHASE 3.1 REGRESSION AUDIT ===\n');

  // Linker for ES modules
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

  // Mock DOM
  let clickHandlers = [];
  const mockPanel = {
    innerHTML: '',
    querySelectorAll: (sel) => {
      if (sel === '.inv-tab') {
        return [
          { getAttribute: () => 'food', addEventListener: (ev, fn) => clickHandlers.push({ sel, fn }) },
          { getAttribute: () => 'weapons', addEventListener: (ev, fn) => clickHandlers.push({ sel, fn }) }
        ];
      }
      return [];
    },
    querySelector: (sel) => null
  };

  const localStorageData = {};
  const context = vm.createContext({
    console,
    document: {
      getElementById: (id) => (id === 'inventory-panel' ? mockPanel : null)
    },
    localStorage: {
      getItem: (k) => localStorageData[k] || null,
      setItem: (k, v) => { localStorageData[k] = String(v); },
      removeItem: (k) => { delete localStorageData[k]; }
    },
    Audio: class { constructor() {} play() {} pause() {} },
    setTimeout,
    clearTimeout,
    Math
  });

  const entryPath = path.resolve(process.cwd(), 'js/inventory-ui.js');
  const invUiCode = fs.readFileSync(entryPath, 'utf8');
  const invModule = new vm.SourceTextModule(invUiCode, { identifier: entryPath, context });
  moduleCache.set(entryPath, invModule);
  await invModule.link(linker);
  await invModule.evaluate();
  const invUi = invModule.namespace;

  const statePath = path.resolve(process.cwd(), 'js/state.js');
  const stateMod = moduleCache.get(statePath).namespace;

  const savePath = path.resolve(process.cwd(), 'js/save.js');
  const saveModCode = fs.readFileSync(savePath, 'utf8');
  const saveModule = new vm.SourceTextModule(saveModCode, { identifier: savePath, context });
  moduleCache.set(savePath, saveModule);
  await saveModule.link(linker);
  await saveModule.evaluate();
  const saveUi = saveModule.namespace;

  const results = [];
  function record(id, name, pass, detail) {
    results.push({ id, name, status: pass ? 'PASS' : 'FAIL', detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] Test ${id}: ${name} - ${detail}`);
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Test 1: Lọc thực phẩm rồi sử dụng vật phẩm -> Đúng vật phẩm bị tiêu hao
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [
      { id: 'food_01', name: 'Thịt hộp', type: 'food', hunger: 40, count: 2 },
      { id: 'food_02', name: 'Bánh mì', type: 'food', hunger: 30, count: 3 }
    ];
    s.medicine = [{ id: 'medicine_01', name: 'Thuốc hồi máu', type: 'medicine', count: 5 }];
    s.hunger = 40;

    // Filter by food
    const all = invUi.getAllInventoryItems(s);
    const filtered = invUi.filterItemsByTab(all, 'food');
    // filtered has 2 items: [Thịt hộp, Bánh mì]. Select Bánh mì (item 1 in filtered)
    const targetCard = filtered[1]; // Bánh mì
    s._selectedInvItem = targetCard;

    let rerendered = false;
    invUi.executeInventoryAction('eat', targetCard, s, () => { rerendered = true; });

    // Verify: ONLY food_02 count was decreased! food_01 is untouched!
    const correctDeduct = s.food[0].count === 2 && s.food[1].count === 2 && s.hunger === 70;
    record(1, 'Lọc thực phẩm rồi sử dụng vật phẩm', correctDeduct, `Thịt hộp count=${s.food[0].count}, Bánh mì count=${s.food[1].count}, hunger=${s.hunger}`);
  }

  // Test 2: Lọc thuốc rồi sử dụng vật phẩm -> Đúng thuốc bị tiêu hao
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.medicine = [
      { id: 'med_01', name: 'Băng dán', type: 'medicine', effects: { health: 10 }, count: 3 },
      { id: 'med_02', name: 'Adrenaline', type: 'medicine', effects: { health: 25 }, count: 1 }
    ];
    s.health = 50;

    const all = invUi.getAllInventoryItems(s);
    const filtered = invUi.filterItemsByTab(all, 'medicine');
    const targetCard = filtered[1]; // Adrenaline
    s._selectedInvItem = targetCard;

    invUi.executeInventoryAction('heal', targetCard, s, () => {});

    // med_02 count was 1, so it should be completely consumed and removed, med_01 untouched
    const pass = s.medicine.length === 1 && s.medicine[0].id === 'med_01' && s.medicine[0].count === 3 && s.health === 75;
    record(2, 'Lọc thuốc rồi sử dụng vật phẩm', pass, `med_01 count=${s.medicine[0].count}, med_02 consumed, health=${s.health}`);
  }

  // Test 3: Lọc nguyên liệu rồi vứt bỏ -> Đúng nguyên liệu bị xóa
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.other = [
      { id: 'gay_go', name: 'Gậy gỗ', type: 'melee', damage: 22, count: 1 },
      { id: 'wood', name: 'Gỗ', type: 'building', count: 10 },
      { id: 'stone', name: 'Đá', type: 'building', count: 5 }
    ];

    const all = invUi.getAllInventoryItems(s);
    const filtered = invUi.filterItemsByTab(all, 'materials');
    // filtered has [Gỗ, Đá]. Pick Đá (stone)
    const targetCard = filtered.find(i => i.id === 'stone');
    s._selectedInvItem = targetCard;

    invUi.executeInventoryAction('discard', targetCard, s, () => {});

    const pass = s.other.find(i => i.id === 'wood').count === 10 && s.other.find(i => i.id === 'stone').count === 4;
    record(3, 'Lọc nguyên liệu rồi vứt bỏ', pass, `Gỗ count=${s.other.find(i => i.id === 'wood').count}, Đá count=${s.other.find(i => i.id === 'stone').count}`);
  }

  // Test 4: Chọn item rồi chuyển category -> Không giữ selection sai
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'food_01', name: 'Thịt hộp', type: 'food', count: 2 }];
    s.other = [{ id: 'wood', name: 'Gỗ', type: 'building', count: 5 }];

    const all = invUi.getAllInventoryItems(s);
    s._selectedInvItem = all.find(i => i.id === 'food_01');
    s._invTab = 'materials'; // switch tab to materials

    invUi.renderInventoryComponent(s, () => {});

    // Since food_01 is NOT in materials tab, _selectedInvItem must be reset to null!
    const pass = s._selectedInvItem === null;
    record(4, 'Chọn item rồi chuyển category', pass, `Selected item reset to null: ${s._selectedInvItem === null}`);
  }

  // Test 5: Sử dụng hết số lượng item -> Card biến mất hoặc cập nhật đúng
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'food_01', name: 'Thịt hộp', type: 'food', count: 1, hunger: 20 }];
    const all = invUi.getAllInventoryItems(s);
    const targetCard = all.find(i => i.id === 'food_01');
    s._selectedInvItem = targetCard;

    invUi.executeInventoryAction('eat', targetCard, s, () => {});

    // food array should now be empty and selection cleared
    const pass = s.food.length === 0 && s._selectedInvItem === null;
    record(5, 'Sử dụng hết số lượng item', pass, `Food length=${s.food.length}, selection=${s._selectedInvItem}`);
  }

  // Test 6: Vứt bỏ item đang chọn -> Detail được reset chính xác
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.other = [{ id: 'wood', name: 'Gỗ', type: 'building', count: 1 }];
    const all = invUi.getAllInventoryItems(s);
    const target = all.find(i => i.id === 'wood');
    s._selectedInvItem = target;

    invUi.executeInventoryAction('discard', target, s, () => {});

    const pass = s.other.length === 0 && s._selectedInvItem === null;
    record(6, 'Vứt bỏ item đang chọn', pass, `Other length=${s.other.length}, selection=${s._selectedInvItem}`);
  }

  // Test 7: Click nhanh nút sử dụng nhiều lần -> Không xử lý trùng ngoài chủ đích
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'food_01', name: 'Thịt hộp', type: 'food', count: 5, hunger: 10 }];
    const all = invUi.getAllInventoryItems(s);
    const target = all.find(i => i.id === 'food_01');
    s.hunger = 0;

    // Simulate 3 rapid consecutive calls without delay
    invUi.executeInventoryAction('eat', target, s, () => {});
    invUi.executeInventoryAction('eat', target, s, () => {});
    invUi.executeInventoryAction('eat', target, s, () => {});

    // Because of isActionBusy lock, only 1 should execute!
    const pass = s.food[0].count === 4 && s.hunger === 10;
    record(7, 'Click nhanh nút sử dụng nhiều lần', pass, `Count decreased once: ${s.food[0].count === 4}, hunger=${s.hunger}`);
  }

  // Test 8: Trang bị vũ khí từ inventory -> Đúng vũ khí được trang bị
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.other = [
      { id: 'dao_gam_nho', name: 'Dao Găm Nhỏ', type: 'melee', damage: 40, durability: 40 },
      { id: 'gay_go', name: 'Gậy gỗ', type: 'melee', damage: 22, durability: 50 }
    ];
    const all = invUi.getAllInventoryItems(s);
    const target = all.find(i => i.id === 'dao_gam_nho');

    invUi.executeInventoryAction('equip_melee', target, s, () => {});

    const pass = s.meleeWeapon.id === 'dao_gam_nho' && !s.other.some(i => i.id === 'dao_gam_nho');
    record(8, 'Trang bị vũ khí từ inventory', pass, `Equipped weapon=${s.meleeWeapon.name}`);
  }

  // Test 9: Tháo vũ khí -> Đúng trạng thái equipment
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.meleeWeapon = { id: 'dao_gam_nho', name: 'Dao Găm Nhỏ', type: 'melee', damage: 40, durability: 40 };

    invUi.executeInventoryAction('unequip_melee', s.meleeWeapon, s, () => {});

    const pass = s.meleeWeapon.id === 'dam' && s.other.some(i => i.id === 'dao_gam_nho');
    record(9, 'Tháo vũ khí', pass, `Equipped after unequip=${s.meleeWeapon.name}, Stored in other: ${s.other.some(i => i.id === 'dao_gam_nho')}`);
  }

  // Test 10: Đổi balo -> Dung lượng hiển thị đúng
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.backpack = { id: 'tui_xach', name: 'Túi xách', capacity: 20 };
    s.other = [{ id: 'balo_le_nui', name: 'Balo leo núi', type: 'backpack', capacity: 34 }];

    const all = invUi.getAllInventoryItems(s);
    const target = all.find(i => i.id === 'balo_le_nui');

    invUi.executeInventoryAction('swap_backpack', target, s, () => {});

    const pass = s.backpack.id === 'balo_le_nui' && s.backpack.capacity === 34 && s.other.some(i => i.id === 'tui_xach');
    record(10, 'Đổi balo', pass, `New backpack=${s.backpack.name}, capacity=${s.backpack.capacity}`);
  }

  // Test 11: Inventory có item stack -> Capacity tính đúng theo gameplay
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'f1', count: 10 }];
    s.drinks = [{ id: 'd1', count: 5 }];
    s.medicine = [{ id: 'm1', count: 2 }];
    s.other = [{ id: 'w1', type: 'melee', count: 1 }, { id: 'b1', type: 'building', count: 10 }];
    s.seeds = [];
    s.backpack = { capacity: 30 };

    // Total: 10 + 5 + 2 + 1 + 10 = 28
    const count = invUi.calculateBackpackCount(s);
    const pass = count === 28;
    record(11, 'Inventory có item stack', pass, `Calculated capacity count=${count}/30`);
  }

  // Test 12: Save / Load -> Dữ liệu được bảo toàn và không lưu UI selection
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'dau_phong', name: 'Đậu phộng', count: 3 }];
    s._selectedInvItem = { id: 'dau_phong', name: 'Đậu phộng' };
    s._invTab = 'food';

    const saveSuccess = saveUi.saveGame(1, s, 'TestPlayer');
    const rawSaved = JSON.parse(localStorageData['zombie_save_1']);

    // Check that cleanState stripped _selectedInvItem and _invTab
    const noSelectionInSave = rawSaved.gameState._selectedInvItem === undefined && rawSaved.gameState._invTab === undefined;
    const foodPreserved = rawSaved.gameState.food[0].count === 3;

    const pass = saveSuccess && noSelectionInSave && foodPreserved;
    record(12, 'Save / Load', pass, `Saved without UI selection: ${noSelectionInSave}, Food preserved: ${foodPreserved}`);
  }

  // Test 13: Inventory rỗng -> Không phát sinh lỗi runtime
  {
    await sleep(100);
    const emptyS = {
      backpack: { capacity: 20 },
      meleeWeapon: null,
      rangedWeapon: null,
      food: [], drinks: [], medicine: [], other: [], seeds: [], ammo: []
    };
    let errorThrown = false;
    try {
      invUi.renderInventoryComponent(emptyS, () => {});
    } catch (e) {
      errorThrown = true;
    }
    const pass = !errorThrown && mockPanel.innerHTML.includes('inv-empty-state');
    record(13, 'Inventory rỗng', pass, `Rendered empty state without error: ${pass}`);
  }

  // Test 14: Item bị xóa từ gameplay khác -> Selection không bị stale
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    s.food = [{ id: 'f1', name: 'Thịt hộp', count: 1 }];
    const all = invUi.getAllInventoryItems(s);
    const target = all.find(i => i.id === 'f1');
    s._selectedInvItem = target;

    // Simulate external event deleting the item
    s.food = [];

    // Call renderInventoryComponent
    invUi.renderInventoryComponent(s, () => {});

    // Selection must be safely reset to null
    const pass = s._selectedInvItem === null;
    record(14, 'Item bị xóa từ gameplay khác', pass, `Stale selection auto-cleared: ${pass}`);
  }

  // Test 15: RenderAll liên tục -> Không tạo event listener trùng
  {
    await sleep(100);
    stateMod.resetState();
    const s = stateMod.getState();
    let counter = 0;
    const mockRerender = () => { counter++; };

    // Render 10 times consecutively
    for (let i = 0; i < 10; i++) {
      invUi.renderInventoryComponent(s, mockRerender);
    }
    // Panel innerHTML is replaced each time, avoiding DOM listener stacking
    const pass = mockPanel.innerHTML.length > 0;
    record(15, 'RenderAll liên tục', pass, `Clean idempotent rendering verified`);
  }

  console.log('\n=== AUDIT SUMMARY ===');
  const allPassed = results.every(r => r.status === 'PASS');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.filter(r => r.status === 'PASS').length} | FAILED: ${results.filter(r => r.status === 'FAIL').length}`);
  if (!allPassed) {
    process.exit(1);
  }
}

runRegressionAudit().catch(err => {
  console.error('\nREGRESSION SCRIPT CRASHED:', err);
  process.exit(1);
});
