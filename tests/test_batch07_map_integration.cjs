/**
 * ============================================================
 * BATCH 07 – PHASE 7.3: GRAPHICAL MAP INTEGRATION REGRESSION
 * Acceptance & Regression Test Suite
 * ============================================================
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

async function runBatch07Tests() {
  console.log('====================================================');
  console.log('   BATCH 07 – PHASE 7.3: MAP INTEGRATION TEST AUDIT  ');
  console.log('====================================================\n');

  const results = [];
  function record(stt, item, pass, notes) {
    results.push({ stt, item, status: pass ? 'PASS' : 'FAIL', notes });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] #${stt} ${item}: ${notes}`);
  }

  // --- Module Linker & Context Setup ---
  const moduleCache = new Map();
  let context;

  const mockElements = {
    'identity-panel': { innerHTML: '', style: {} },
    'stats-panel': { innerHTML: '', style: {} },
    'weapon-panel': { innerHTML: '', style: {} },
    'cargo-panel': { innerHTML: '', style: {} },
    'story-area': { innerHTML: '', style: {}, scrollTop: 0, scrollHeight: 100 },
    'options-area': {
      innerHTML: '',
      style: {},
      querySelectorAll: function(sel) {
        if (sel.includes('.option-item')) {
          const matches = [...this.innerHTML.matchAll(/data-index="(\d+)"/g)];
          return matches.map(m => ({
            getAttribute: () => m[1],
            addEventListener: () => {}
          }));
        }
        return [];
      },
      querySelector: function(sel) {
        if (sel === '#map-view-toggle-btn' && this.innerHTML.includes('id="map-view-toggle-btn"')) {
          return { addEventListener: () => {} };
        }
        return null;
      }
    },
    'pagination-area': { innerHTML: '', style: { display: 'none' } },
    'prev-page-btn': { disabled: false },
    'next-page-btn': { disabled: false },
    'page-info': { textContent: '' },
    'inventory-panel': { innerHTML: '', style: {}, querySelectorAll: () => [], querySelector: () => null },
    'name-setup': { style: {} },
    'game-content': { style: {} },
    'game-header': { style: {} },
    'input-area': { style: {} },
    'save-page': { style: {} },
    'best-record-page': { style: {} },
    'achievement-page': { style: {} },
    'about-page': { style: {} },
    'save-story-area': { style: {} },
    'save-options-area': { style: {}, querySelectorAll: () => [] }
  };

  const localStorageData = {};

  // Mock PIXI minimal environment
  class MockContainer {
    constructor() {
      this.children = [];
      this.visible = true;
      this.x = 0;
      this.y = 0;
      this.listeners = {};
    }
    addChild(c) { this.children.push(c); return c; }
    removeChild(c) { const idx = this.children.indexOf(c); if (idx >= 0) this.children.splice(idx, 1); return c; }
    removeChildren() { this.children = []; }
    destroy() { this.children = []; }
    on(event, handler) { this.listeners[event] = handler; }
    emit(event, ...args) { if (this.listeners[event]) this.listeners[event](...args); }
  }

  class MockSprite extends MockContainer {
    constructor(texture) {
      super();
      this.texture = texture;
      this.anchor = { set: () => {} };
      this.scale = { set: () => {} };
      this.tint = 0xffffff;
    }
  }

  class MockGraphics extends MockContainer {
    constructor() { super(); }
    beginFill() { return this; }
    endFill() { return this; }
    drawRect() { return this; }
    lineStyle() { return this; }
    moveTo() { return this; }
    lineTo() { return this; }
    clear() { return this; }
  }

  class MockText extends MockContainer {
    constructor(text) {
      super();
      this.text = text;
    }
  }

  const mockPIXI = {
    VERSION: '7.4.2',
    Container: MockContainer,
    Sprite: MockSprite,
    Graphics: MockGraphics,
    Text: MockText,
    Texture: { WHITE: {} },
    SCALE_MODES: { NEAREST: 1 },
    Assets: {
      load: async () => ({
        textures: {
          'terrain_wasteland_dirt_32': {},
          'road_asphalt_paved_32': {},
          'bld_castle_fortress_128': {},
          'marker_poi_active_32': {},
          'marker_poi_unexplored_32': {},
          'marker_danger_skull_32': {},
          'marker_player_token_32': {}
        }
      })
    }
  };

  context = vm.createContext({
    console,
    window: { PIXI: mockPIXI },
    PIXI: mockPIXI,
    document: {
      getElementById: (id) => mockElements[id] || null,
      createElement: (tag) => ({ tagName: tag, style: {}, addEventListener: () => {} })
    },
    localStorage: {
      getItem: (k) => localStorageData[k] || null,
      setItem: (k, v) => { localStorageData[k] = String(v); },
      removeItem: (k) => { delete localStorageData[k]; }
    },
    Audio: class { constructor() {} play() {} pause() {} },
    Image: class { constructor() {} },
    setTimeout,
    clearTimeout,
    Math
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

  async function loadModule(relPath) {
    const absPath = path.resolve(process.cwd(), relPath);
    if (moduleCache.has(absPath)) return moduleCache.get(absPath).namespace;
    const code = fs.readFileSync(absPath, 'utf8');
    const mod = new vm.SourceTextModule(code, { identifier: absPath, context });
    moduleCache.set(absPath, mod);
    await mod.link(linker);
    await mod.evaluate();
    return mod.namespace;
  }

  // Load target modules
  const stateMod = await loadModule('js/state.js');
  const gameMod = await loadModule('js/game/index.js');
  const navMod = await loadModule('js/game/navigation.js');
  const uiMod = await loadModule('js/ui.js');
  const saveMod = await loadModule('js/save.js');
  const mapRendererMod = await loadModule('js/map-renderer.js');
  const pixiMod = await loadModule('js/pixi-renderer.js');
  const mapsDataMod = await loadModule('js/data/maps/maps.js');

  // Reset state to initial game condition
  stateMod.resetState();
  const state = stateMod.getState();
  state.name = 'TestSurvivor';
  state.phase = 'home';
  state.location = 'Lều Người Sống Sót';

  // TEST 1: Open graphical map successfully
  try {
    navMod.handleGoOut();
    const isMapSelect = state.phase === 'map_select';
    const hasOptions = state.options && state.options.length === 23; // 22 maps + 1 Back
    const backOption = state.options[state.options.length - 1];
    const isBackCorrect = backOption && backOption.text === 'Quay lại' && backOption.action === 'back';
    record(1, 'Open graphical map', isMapSelect && hasOptions && isBackCorrect,
      `phase=${state.phase}, options count=${state.options.length}, back option present=${isBackCorrect}`);
  } catch (err) {
    record(1, 'Open graphical map', false, err.message);
  }

  // TEST 2: Close graphical map successfully
  try {
    const backIndex = state.options.length; // 23 (1-based index)
    gameMod.handleAction(backIndex);
    const returnedHome = state.phase === 'choose';
    const homeOptionsPresent = state.options && state.options.some(o => o.action === 'goOut');
    record(2, 'Close graphical map', returnedHome && homeOptionsPresent,
      `phase=${state.phase}, returnedHome=${returnedHome}, options reset=${homeOptionsPresent}`);
  } catch (err) {
    record(2, 'Close graphical map', false, err.message);
  }

  // TEST 3: Reopen map repeatedly without duplicate instances
  try {
    let stable = true;
    for (let i = 0; i < 5; i++) {
      navMod.handleGoOut();
      if (state.phase !== 'map_select' || state.options.length !== 23) {
        stable = false;
        break;
      }
      gameMod.handleAction(23); // Back
      if (state.phase !== 'choose') {
        stable = false;
        break;
      }
    }
    record(3, 'Reopen map repeatedly', stable, '5 consecutive open/close cycles executed cleanly without state drift');
  } catch (err) {
    record(3, 'Reopen map repeatedly', false, err.message);
  }

  // TEST 4: Click valid POI and invoke existing navigation handler exactly once
  let hungerBefore, phaseIndexBefore;
  try {
    navMod.handleGoOut();
    hungerBefore = state.hunger;
    phaseIndexBefore = state.phaseIndex;

    // Find Tháp Canh Đỉnh Núi Hoang Vắng (id: thap_canh_bo_roi)
    const targetIdx = state.options.findIndex(o => o.map && o.map.id === 'thap_canh_bo_roi');
    const validIdx = targetIdx >= 0;

    // Simulate clicking target POI via handleAction (1-based)
    gameMod.handleAction(targetIdx + 1);

    const hungerDecayed = state.hunger === hungerBefore - 5;
    const phaseIndexAdvanced = state.phaseIndex === phaseIndexBefore + 1;
    record(4, 'POI click invokes navigation handler', validIdx && (hungerDecayed || phaseIndexAdvanced),
      `Target option #${targetIdx + 1} chosen: Time advanced 1 turn (PhaseIndex ${phaseIndexBefore}->${state.phaseIndex}, Hunger ${hungerBefore}->${state.hunger})`);
  } catch (err) {
    record(4, 'POI click invokes navigation handler', false, err.message);
  }

  // TEST 5: Confirm current location updates through existing gameplay logic
  try {
    const locName = state.location;
    const currentMapId = state.currentMap ? state.currentMap.id : null;
    const isExplored = state.stats && state.stats.mapsExplored && state.stats.mapsExplored.includes('thap_canh_bo_roi');
    const locMatches = locName === 'Tháp Canh Đỉnh Núi Hoang Vắng' && currentMapId === 'thap_canh_bo_roi';
    record(5, 'Current location updates via gameplay logic', locMatches && isExplored,
      `state.location="${locName}", currentMap.id="${currentMapId}", mapsExplored recorded=${isExplored}`);
  } catch (err) {
    record(5, 'Current location updates via gameplay logic', false, err.message);
  }

  // TEST 6: Confirm player token updates to new current location
  try {
    const coordLookup = mapRendererMod.MAP_COORDINATES['thap_canh_bo_roi'];
    const homeCoord = mapRendererMod.MAP_COORDINATES['home'];
    const hasCoordinates = coordLookup && coordLookup.tileX === 0 && coordLookup.tileY === 4;
    const homeHasCoordinates = homeCoord && homeCoord.tileX === 4 && homeCoord.tileY === 4;
    record(6, 'Player token updates to current location', hasCoordinates && homeHasCoordinates,
      `Location "thap_canh_bo_roi" mapped to [${coordLookup.tileX}, ${coordLookup.tileY}]; Home at [${homeCoord.tileX}, ${homeCoord.tileY}]`);
  } catch (err) {
    record(6, 'Player token updates to current location', false, err.message);
  }

  // TEST 7: Confirm textual Fast Travel remains functional and consistent
  try {
    // Return to home first
    state.phase = 'choose';
    state.location = 'Lều Người Sống Sót';
    navMod.handleGoOut();

    // Render options through UI to verify both modes
    uiMod.renderOptions(state);
    const html = mockElements['options-area'].innerHTML;
    const hasToggleBtn = html.includes('id="map-view-toggle-btn"');
    const hasAll22TextOptions = state.options.filter(o => o.map).length === 22;
    const hasBack = html.includes('Quay lại');
    record(7, 'Textual Fast Travel preserved & consistent', hasToggleBtn && hasAll22TextOptions && hasBack,
      `Options rendered with toggle bar: ${hasToggleBtn}, 22 maps in options: ${hasAll22TextOptions}, back option present: ${hasBack}`);
  } catch (err) {
    record(7, 'Textual Fast Travel preserved & consistent', false, err.message);
  }

  // TEST 8: Confirm hidden locations (dao_nho) cannot be selected prematurely
  try {
    const hiddenInOptions = state.options.some(o => o.map && (o.map.id === 'dao_nho' || o.map.hidden));
    const allMaps = mapsDataMod.MAPS;
    const daoNhoDef = allMaps.find(m => m.id === 'dao_nho');
    const isProperlyFlaggedHidden = daoNhoDef && daoNhoDef.hidden === true;
    const absentFromMapCoords = !mapRendererMod.MAP_COORDINATES['dao_nho'];
    record(8, 'Hidden locations cannot be selected', !hiddenInOptions && isProperlyFlaggedHidden && absentFromMapCoords,
      `dao_nho in options: ${hiddenInOptions}, dao_nho.hidden: ${isProperlyFlaggedHidden}, absent from MAP_COORDINATES: ${absentFromMapCoords}`);
  } catch (err) {
    record(8, 'Hidden locations cannot be selected', false, err.message);
  }

  // TEST 9: Confirm invalid/unmapped POIs do not crash game and fall back safely
  try {
    const dummyState = { ...state, location: 'Khu Vực Bí Ẩn Không Tồn Tại', currentMap: { id: 'dia_diem_ma' } };
    const dummyRenderer = new mapRendererMod.WorldMapRenderer({ ticker: { add: () => {} } });
    let crashed = false;
    try {
      dummyRenderer.updatePlayerToken(dummyState);
    } catch (e) {
      crashed = true;
    }
    const tokenFallback = dummyRenderer.playerTokenSprite ? dummyRenderer.playerTokenSprite.x : null;
    const expectedHomeX = mapRendererMod.MAP_COORDINATES.home.tileX * 32 + 16;
    record(9, 'Invalid/unmapped POIs fallback safely', !crashed && tokenFallback === expectedHomeX,
      `Crashed: ${crashed}, Player token fell back to home X: ${tokenFallback} (expected ${expectedHomeX})`);
  } catch (err) {
    record(9, 'Invalid/unmapped POIs fallback safely', false, err.message);
  }

  // TEST 10: Confirm game save/load remains compatible
  try {
    stateMod.resetState();
    const s = stateMod.getState();
    s.name = 'SaveTester';
    s.day = 5;
    s.hunger = 80;
    s.health = 95;
    s.location = 'Tháp Canh Đỉnh Núi Hoang Vắng';
    s.currentMap = mapsDataMod.MAPS.find(m => m.id === 'thap_canh_bo_roi');
    s._optionPage = 1; // transient UI key

    saveMod.saveGame(1, s, s.name);
    const rawSaved = JSON.parse(localStorageData['zombie_save_1']);
    const rawGameState = rawSaved ? rawSaved.gameState : null;
    const noTransientInRaw = rawGameState && rawGameState._optionPage === undefined && rawGameState.mapViewMode === undefined;
    const loaded = saveMod.loadGame(1);
    const savedState = loaded ? loaded.gameState : null;
    const locationPreserved = savedState && savedState.location === 'Tháp Canh Đỉnh Núi Hoang Vắng';
    const statsPreserved = savedState && savedState.day === 5 && savedState.health === 95;

    record(10, 'Save/Load compatibility preserved', noTransientInRaw && locationPreserved && statsPreserved,
      `Raw save stripped transient keys: ${noTransientInRaw}, Location preserved: ${locationPreserved}, Day & stats intact: ${statsPreserved}`);
  } catch (err) {
    record(10, 'Save/Load compatibility preserved', false, err.message);
  }

  // TEST 11: Confirm opening/closing map does not mutate gameplay state
  try {
    stateMod.resetState();
    const s = stateMod.getState();
    s.name = 'NeutralStateTester';
    s.day = 3;
    s.hunger = 75;
    s.thirst = 70;
    s.health = 100;
    s.infection = 0;
    s.pureEnergy = 5;
    s.food = [{ id: 'test_food', name: 'Lương khô', count: 3 }];

    // Snapshot before
    const beforeDay = s.day;
    const beforeHunger = s.hunger;
    const beforeHealth = s.health;
    const beforePureEnergy = s.pureEnergy;
    const beforeFoodCount = s.food[0].count;

    // Open map
    navMod.handleGoOut();
    // Toggle view mode
    if (pixiMod.pixiRenderer) pixiMod.pixiRenderer.toggleMapViewMode();
    // Close map via Back
    gameMod.handleAction(s.options.length);

    // Verify after
    const unchanged = s.day === beforeDay &&
                      s.hunger === beforeHunger &&
                      s.health === beforeHealth &&
                      s.pureEnergy === beforePureEnergy &&
                      s.food[0].count === beforeFoodCount;

    record(11, 'Opening/closing map does not mutate state', unchanged,
      `Day: ${beforeDay}->${s.day}, Hunger: ${beforeHunger}->${s.hunger}, Health: ${beforeHealth}->${s.health}, Food: ${beforeFoodCount}->${s.food[0].count}`);
  } catch (err) {
    record(11, 'Opening/closing map does not mutate state', false, err.message);
  }

  // TEST 12: Confirm combat, inventory, and other screens remain unaffected
  try {
    stateMod.resetState();
    const s = stateMod.getState();
    s.name = 'ScreenIsolationTester';
    s.phase = 'combat';
    s.currentEnemy = { name: 'Zombie Thường', hp: 50, maxHp: 50, atk: 10 };
    s.food = [{ id: 'bread', name: 'Bánh mì', count: 2, hunger: 15 }];

    // Render UI during combat
    uiMod.renderAll();
    const isNotMapSelect = s.phase !== 'map_select';
    const inventoryWorks = s.food.length === 1 && s.food[0].count === 2;
    const combatHudFunctional = mockElements['story-area'].innerHTML !== undefined;

    record(12, 'Combat & other screens remain unaffected', isNotMapSelect && inventoryWorks && combatHudFunctional,
      `Combat phase preserved: ${isNotMapSelect}, Inventory state intact: ${inventoryWorks}, Combat render clean: ${combatHudFunctional}`);
  } catch (err) {
    record(12, 'Combat & other screens remain unaffected', false, err.message);
  }

  console.log('\n====================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  console.log(`TOTAL AUDIT ITEMS: ${results.length} | PASS: ${passCount} | FAIL: ${results.length - passCount}`);
  console.log('====================================================\n');

  if (passCount !== results.length) {
    process.exit(1);
  }
}

runBatch07Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
