/**
 * ============================================================
 * BATCH 07 – PHASE 7.5: FINAL ACCEPTANCE AUDIT SUITE
 * Comprehensive Audit: Assets, POI Mappings, Danger Levels,
 * Viewport/Clamping, 20-Cycle Lifecycle, Save/Load Purity
 * ============================================================
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

async function runFinalAcceptanceAudit() {
  console.log('====================================================');
  console.log('   BATCH 07 – PHASE 7.5: FINAL ACCEPTANCE AUDIT     ');
  console.log('====================================================\n');

  const auditSections = {};
  function logAudit(section, id, name, pass, detail) {
    if (!auditSections[section]) auditSections[section] = [];
    auditSections[section].push({ id, name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] [${section}] #${id} ${name}: ${detail}`);
  }

  // --- Step 1: Physical Asset & Atlas Inspection ---
  console.log('>>> [STEP 1: PHYSICAL ASSET & ATLAS AUDIT] <<<');
  const atlasJsonPath = 'public/assets/maps/atlases/world_map_tileset.json';
  const atlasPngPath = 'public/assets/maps/atlases/world_map_tileset.png';
  const atlasWebpPath = 'public/assets/maps/atlases/world_map_tileset.webp';

  const atlasJsonExists = fs.existsSync(atlasJsonPath);
  const atlasPngExists = fs.existsSync(atlasPngPath);
  const atlasWebpExists = fs.existsSync(atlasWebpPath);

  logAudit('Asset', 1, 'Atlas files on disk', atlasJsonExists && atlasPngExists && atlasWebpExists,
    `JSON: ${atlasJsonExists}, PNG: ${atlasPngExists}, WebP: ${atlasWebpExists}`);

  let atlasData = null;
  if (atlasJsonExists) {
    atlasData = JSON.parse(fs.readFileSync(atlasJsonPath, 'utf8'));
    const meta = atlasData.meta;
    const isPowerOfTwo = meta && meta.size && meta.size.w === 512 && meta.size.h === 512;
    const frameCount = Object.keys(atlasData.frames || {}).length;
    logAudit('Asset', 2, 'Atlas dimensions & frames', isPowerOfTwo && frameCount >= 30,
      `Dimensions: ${meta?.size?.w}x${meta?.size?.h} (512x512 PoT: ${isPowerOfTwo}), Total Frames: ${frameCount}`);

    // Verify all frames fit within 512x512 texture boundary
    let outOfBounds = 0;
    for (const [frameKey, frameObj] of Object.entries(atlasData.frames)) {
      const f = frameObj.frame;
      if (f.x + f.w > 512 || f.y + f.h > 512 || f.x < 0 || f.y < 0) {
        outOfBounds++;
      }
    }
    logAudit('Asset', 3, 'Frame boundary conformance', outOfBounds === 0,
      `Out of bounds frames: ${outOfBounds}`);
  }

  // Check 33 individual tile files
  const tileFolders = ['terrain', 'roads', 'structures', 'props', 'markers'];
  let tileCount = 0;
  for (const folder of tileFolders) {
    const dir = path.join('public/assets/maps/tiles', folder);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
      tileCount += files.length;
    }
  }
  logAudit('Asset', 4, 'Individual fallback tiles', tileCount >= 30,
    `Found ${tileCount} individual PNG tile assets on disk`);

  // --- Step 2: POI Mapping vs MAPS Definition Audit ---
  console.log('\n>>> [STEP 2: POI MAPPING VS MAPS DEFINITION AUDIT] <<<');
  
  // Set up VM environment to load ES modules
  const moduleCache = new Map();
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
          return matches.map(m => {
            const classes = new Set(['option-item']);
            return {
              getAttribute: () => m[1],
              classList: {
                add: (c) => classes.add(c),
                remove: (c) => classes.delete(c),
                contains: (c) => classes.has(c)
              },
              addEventListener: () => {}
            };
          });
        }
        return [];
      },
      querySelector: function(sel) {
        if (sel.includes('#map-')) return { addEventListener: () => {}, textContent: '' };
        if (sel.includes('.option-item')) {
          return {
            classList: { add: () => {}, remove: () => {} },
            scrollIntoView: () => {}
          };
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

  class MockContainer {
    constructor() {
      this.children = [];
      this.visible = true;
      this.x = 0;
      this.y = 0;
      this.scale = { x: 1, y: 1, set: function(sx, sy) { this.x = sx; this.y = sy !== undefined ? sy : sx; } };
      this.position = { x: 0, y: 0, set: function(px, py) { this.x = px; this.y = py; } };
      this.listeners = {};
    }
    addChild(c) { this.children.push(c); return c; }
    removeChild(c) { const idx = this.children.indexOf(c); if (idx >= 0) this.children.splice(idx, 1); return c; }
    removeChildren() { this.children = []; }
    destroy() { this.children = []; }
    toGlobal(pt) { return { x: this.x + pt.x, y: this.y + pt.y }; }
    on(event, handler) { this.listeners[event] = handler; }
    emit(event, ...args) { if (this.listeners[event]) this.listeners[event](...args); }
  }

  class MockSprite extends MockContainer {
    constructor(texture) {
      super();
      this.texture = texture;
      this.anchor = { x: 0, y: 0, set: function(ax, ay) { this.x = ax; this.y = ay; } };
      this.tint = 0xffffff;
    }
  }

  class MockGraphics extends MockContainer {
    constructor() { super(); }
    beginFill() { return this; }
    endFill() { return this; }
    drawRect() { return this; }
    drawRoundedRect() { return this; }
    drawCircle() { return this; }
    lineStyle() { return this; }
    moveTo() { return this; }
    lineTo() { return this; }
    clear() { return this; }
  }

  class MockText extends MockContainer {
    constructor(text, style) {
      super();
      this.text = text;
      this.style = style || {};
      this.width = 100;
      this.height = 20;
    }
  }

  const activeTickers = [];
  const mockTicker = {
    add: (fn) => activeTickers.push(fn),
    remove: (fn) => {
      const idx = activeTickers.indexOf(fn);
      if (idx >= 0) activeTickers.splice(idx, 1);
    }
  };

  const mockPIXI = {
    VERSION: '7.4.2',
    Point: class { constructor(x, y) { this.x = x || 0; this.y = y || 0; } },
    Container: MockContainer,
    Sprite: MockSprite,
    Graphics: MockGraphics,
    Text: MockText,
    Texture: { WHITE: {} },
    SCALE_MODES: { NEAREST: 1 },
    Assets: {
      load: async () => ({
        textures: atlasData?.frames ? Object.fromEntries(Object.keys(atlasData.frames).map(k => [k, {}])) : {}
      })
    }
  };

  const context = vm.createContext({
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

  const stateMod = await loadModule('js/state.js');
  const navMod = await loadModule('js/game/navigation.js');
  const gameMod = await loadModule('js/game/index.js');
  const uiMod = await loadModule('js/ui.js');
  const saveMod = await loadModule('js/save.js');
  const mapRendererMod = await loadModule('js/map-renderer.js');
  const mapsDataMod = await loadModule('js/data/maps/maps.js');

  const allMaps = mapsDataMod.MAPS;
  const mapCoords = mapRendererMod.MAP_COORDINATES;

  // Check POI ID coverage
  let mappedCount = 0;
  let missingNonHidden = [];
  let hiddenProperlyExcluded = true;

  for (const m of allMaps) {
    if (m.hidden) {
      if (mapCoords[m.id]) {
        hiddenProperlyExcluded = false;
      }
    } else {
      if (mapCoords[m.id]) {
        mappedCount++;
        const c = mapCoords[m.id];
        if (c.tileX < 0 || c.tileX >= 20 || c.tileY < 0 || c.tileY >= 10) {
          missingNonHidden.push(`${m.id} (out of bounds [${c.tileX}, ${c.tileY}])`);
        }
      } else {
        missingNonHidden.push(m.id);
      }
    }
  }

  logAudit('Mapping', 5, 'All non-hidden locations mapped in 20x10 grid', missingNonHidden.length === 0,
    `Mapped count: ${mappedCount}/22 non-hidden locations; Unmapped or out-of-bounds: ${missingNonHidden.join(', ') || 'None'}`);

  logAudit('Mapping', 6, 'Hidden location protection (dao_nho)', hiddenProperlyExcluded,
    `dao_nho excluded from MAP_COORDINATES: ${hiddenProperlyExcluded}`);

  // Danger Info Resolution
  let dangerResolvedAll = true;
  for (const m of allMaps) {
    const dInfo = mapRendererMod.getDangerInfo(m.danger);
    if (!dInfo || !dInfo.color || !dInfo.label) {
      dangerResolvedAll = false;
      break;
    }
  }
  logAudit('Mapping', 7, 'Danger level resolution & color coding', dangerResolvedAll,
    `All ${allMaps.length} map danger ranks resolved cleanly`);

  // --- Step 3: Lifecycle, Ticker & 20-Cycle Performance Audit ---
  console.log('\n>>> [STEP 3: 20-CYCLE REOPEN & LIFECYCLE AUDIT] <<<');
  const mockApp = { ticker: mockTicker };
  const renderer = new mapRendererMod.WorldMapRenderer(mockApp);
  await renderer.loadAssets();

  stateMod.resetState();
  const state = stateMod.getState();
  state.name = 'AcceptanceTester';
  state.phase = 'home';
  state.location = 'Lều Người Sống Sót';

  let cyclesSuccessful = true;
  for (let i = 1; i <= 20; i++) {
    navMod.handleGoOut();
    renderer.render(state);
    if (renderer.container.visible !== true || activeTickers.length === 0) {
      cyclesSuccessful = false;
      break;
    }
    // Return to home
    gameMod.handleAction(23); // Back
    renderer.render(state);
    if (renderer.container.visible !== false || activeTickers.length !== 0) {
      cyclesSuccessful = false;
      break;
    }
  }

  logAudit('Lifecycle', 8, '20-Cycle Reopen & Ticker Cleanup', cyclesSuccessful,
    `20 consecutive open/close cycles executed. Active tickers remaining: ${activeTickers.length} (Expected: 0)`);

  // --- Step 4: Dual Control Architecture & Travel Execution Audit ---
  console.log('\n>>> [STEP 4: DUAL CONTROL & GAMEPLAY EXECUTION AUDIT] <<<');
  navMod.handleGoOut();
  renderer.render(state);

  const initialDay = state.day;
  const initialPhase = state.phaseIndex;
  const initialHunger = state.hunger;

  // Destination: Bệnh Viện Ngoại Thành (id: benh_vien_ngoai_thanh)
  const targetOptionIdx = state.options.findIndex(o => o.map && o.map.id === 'benh_vien_ngoai_thanh');
  const optionValid = targetOptionIdx >= 0;

  // Execute travel via handleAction (1-based index)
  gameMod.handleAction(targetOptionIdx + 1);

  const stateAfterTravel = stateMod.getState();
  const locationUpdated = stateAfterTravel.location === 'Bệnh Viện Ngoại Thành';
  const currentMapUpdated = stateAfterTravel.currentMap?.id === 'benh_vien_ngoai_thanh';
  const timeAdvanced = stateAfterTravel.phaseIndex === initialPhase + 1;
  const mapsExploredRecorded = stateAfterTravel.stats?.mapsExplored?.includes('benh_vien_ngoai_thanh');

  logAudit('Gameplay', 9, 'Fast Travel execution via existing pipeline',
    optionValid && locationUpdated && currentMapUpdated && timeAdvanced && mapsExploredRecorded,
    `Target: "benh_vien_ngoai_thanh", Location: "${stateAfterTravel.location}", PhaseIndex: ${initialPhase}->${stateAfterTravel.phaseIndex}, Explored recorded: ${mapsExploredRecorded}`);

  // When opening map again while at Bệnh Viện Ngoại Thành
  navMod.handleGoOut();
  renderer.render(stateAfterTravel);
  const tokenX = renderer.playerTokenSprite?.x;
  const tokenY = renderer.playerTokenSprite?.y;
  const expectedHospitalX = mapCoords.benh_vien_ngoai_thanh.tileX * 32 + 16;
  const tokenRelocated = tokenX === expectedHospitalX;

  logAudit('Gameplay', 10, 'Player token relocation to destination', tokenRelocated,
    `Token X: ${tokenX} (expected ${expectedHospitalX})`);

  // --- Step 5: Save & Load Full Roundtrip Audit ---
  console.log('\n>>> [STEP 5: SAVE/LOAD COMPATIBILITY AUDIT] <<<');
  saveMod.saveGame(2, stateAfterTravel, stateAfterTravel.name);
  const rawSave = JSON.parse(localStorageData['zombie_save_2'] || '{}');
  const rawState = rawSave.gameState;

  const noUiKeysPersisted = rawState &&
                            rawState._optionPage === undefined &&
                            rawState.mapViewMode === undefined &&
                            rawState.zoomLevel === undefined;

  const loadedSave = saveMod.loadGame(2);
  const loadedState = loadedSave ? loadedSave.gameState : null;
  const saveRestoredPurity = loadedState &&
                             loadedState.location === 'Bệnh Viện Ngoại Thành' &&
                             loadedState.day === stateAfterTravel.day &&
                             loadedState.health === stateAfterTravel.health;

  logAudit('SaveLoad', 11, 'Save/Load roundtrip & UI state purity',
    noUiKeysPersisted && saveRestoredPurity,
    `Transient keys stripped: ${noUiKeysPersisted}, Location preserved on load: "${loadedState?.location}"`);

  // --- Step 6: Summary & Audit Totals ---
  console.log('\n====================================================');
  let totalTests = 0;
  let passedTests = 0;
  for (const [sec, items] of Object.entries(auditSections)) {
    for (const item of items) {
      totalTests++;
      if (item.pass) passedTests++;
    }
  }

  console.log(`FINAL ACCEPTANCE AUDIT TOTALS: ${totalTests} CHECKS | ${passedTests} PASS | ${totalTests - passedTests} FAIL`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runFinalAcceptanceAudit().catch(err => {
  console.error('Final Acceptance Audit failed with error:', err);
  process.exit(1);
});
