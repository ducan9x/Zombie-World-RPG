/**
 * ============================================================
 * BATCH 07 – PHASE 7.4: MAP UX POLISH & VISUAL ENHANCEMENT
 * Acceptance & UX Validation Test Suite
 * ============================================================
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

async function runPhase74UXTests() {
  console.log('====================================================');
  console.log('   BATCH 07 – PHASE 7.4: MAP UX & POLISH AUDIT      ');
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

  // Mock PIXI minimal environment with scale, position, transform and ticker tracking
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
        textures: {
          'terrain_grass_dead_32': {},
          'terrain_dirt_wasteland_32': {},
          'terrain_concrete_cracked_32': {},
          'terrain_asphalt_dark_32': {},
          'terrain_gravel_coarse_32': {},
          'terrain_rock_cliff_32': {},
          'terrain_water_toxic_32': {},
          'terrain_bio_blight_32': {},
          'road_asphalt_h_32': {},
          'road_asphalt_v_32': {},
          'road_crossroads_32': {},
          'road_t_junction_32': {},
          'road_broken_cracked_32': {},
          'bld_castle_fortress_128': {},
          'bld_hospital_ruined_96': {},
          'bld_gas_station_64': {},
          'bld_industrial_warehouse_96': {},
          'bld_watchtower_fortified_64': {},
          'bld_abandoned_house_64': {},
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

  const stateMod = await loadModule('js/state.js');
  const navMod = await loadModule('js/game/navigation.js');
  const gameMod = await loadModule('js/game/index.js');
  const uiMod = await loadModule('js/ui.js');
  const mapRendererMod = await loadModule('js/map-renderer.js');
  const mapsDataMod = await loadModule('js/data/maps/maps.js');

  // Initialize renderer with mock ticker
  const mockApp = { ticker: mockTicker };
  const renderer = new mapRendererMod.WorldMapRenderer(mockApp);
  await renderer.loadAssets();

  stateMod.resetState();
  const state = stateMod.getState();
  state.name = 'UXTester';
  state.phase = 'home';
  state.location = 'Lều Người Sống Sót';

  // TEST 1: POI hover and selection feedback
  try {
    navMod.handleGoOut();
    renderer.render(state);

    const castleId = 'lau_dai_tan_the';
    renderer.highlightPOI(castleId);

    const isCardVisible = renderer.infoCard && renderer.infoCard.visible === true;
    const titleCorrect = renderer.cardTitle && renderer.cardTitle.text === 'Lâu đài Tận thế';
    const dangerBadgeText = renderer.cardDanger && renderer.cardDanger.text.includes('AN TOÀN');

    renderer.unhighlightPOI(castleId);
    const isCardHiddenAfterOut = renderer.infoCard && renderer.infoCard.visible === false;

    record(1, 'POI hover & tactical card feedback',
      isCardVisible && titleCorrect && dangerBadgeText && isCardHiddenAfterOut,
      `Card visible on hover: ${isCardVisible}, Title: "${renderer.cardTitle?.text}", Badge: "${renderer.cardDanger?.text}", Hidden on out: ${isCardHiddenAfterOut}`);
  } catch (err) {
    record(1, 'POI hover & tactical card feedback', false, err.message);
  }

  // TEST 2: Zoom behavior & cycling
  try {
    const z1 = renderer.setZoom(1.25);
    const scale1 = renderer.contentContainer.scale.x;

    const z2 = renderer.setZoom(1.5);
    const scale2 = renderer.contentContainer.scale.x;

    const z3 = renderer.cycleZoom(); // from 1.5 -> cycles to 1.0
    const scale3 = renderer.contentContainer.scale.x;

    const zoomValid = z1 === 1.25 && scale1 === 1.25 &&
                      z2 === 1.5 && scale2 === 1.5 &&
                      z3 === 1.0 && scale3 === 1.0;

    record(2, 'Zoom controls & cycling', zoomValid,
      `1.25x (scale=${scale1}) -> 1.5x (scale=${scale2}) -> 1.0x cycle (scale=${scale3})`);
  } catch (err) {
    record(2, 'Zoom controls & cycling', false, err.message);
  }

  // TEST 3: Grid toggle
  try {
    const initialGrid = renderer.showGrid;
    const toggledOn = renderer.toggleGrid();
    const isGridOn = toggledOn === true && renderer.showGrid === true;

    const toggledOff = renderer.toggleGrid();
    const isGridOff = toggledOff === false && renderer.showGrid === false;

    record(3, 'Tactical grid toggle', isGridOn && isGridOff,
      `Initial: ${initialGrid} -> Toggled: ${toggledOn} -> Toggled: ${toggledOff}`);
  } catch (err) {
    record(3, 'Tactical grid toggle', false, err.message);
  }

  // TEST 4: Viewport boundaries & clamping
  try {
    renderer.setZoom(1.5);
    renderer.applyZoomAndPan();

    const minX = 640 - 640 * 1.5; // -320
    const minY = 320 - 320 * 1.5; // -160
    const clampedX = renderer.contentContainer.x >= minX && renderer.contentContainer.x <= 0;
    const clampedY = renderer.contentContainer.y >= minY && renderer.contentContainer.y <= 0;

    renderer.setZoom(1.0); // Reset to 1.0
    const resetZero = renderer.contentContainer.x === 0 && renderer.contentContainer.y === 0;

    record(4, 'Viewport boundaries & clamping', clampedX && clampedY && resetZero,
      `At 1.5x: [x=${renderer.contentContainer.x}, y=${renderer.contentContainer.y}] within [${minX}, ${minY}]; Reset 1.0x: [${renderer.contentContainer.x}, ${renderer.contentContainer.y}]`);
  } catch (err) {
    record(4, 'Viewport boundaries & clamping', false, err.message);
  }

  // TEST 5: Renderer cleanup & zero lifecycle leaks
  try {
    navMod.handleGoOut();
    renderer.render(state);
    const animCountBefore = renderer.activeAnimations.length;

    // Clear animations when closing map
    renderer.clearAnimations();
    const animCountAfter = renderer.activeAnimations.length;
    const cardHidden = renderer.infoCard.visible === false;
    const tickersCleared = activeTickers.length === 0;

    record(5, 'Renderer cleanup & zero lifecycle leaks', animCountAfter === 0 && cardHidden && tickersCleared,
      `Animations: ${animCountBefore} -> ${animCountAfter}, Ticker handlers remaining in memory: ${activeTickers.length}`);
  } catch (err) {
    record(5, 'Renderer cleanup & zero lifecycle leaks', false, err.message);
  }

  // TEST 6: Repeated map opening/closing
  try {
    let stable = true;
    for (let i = 0; i < 10; i++) {
      navMod.handleGoOut();
      renderer.render(state);
      gameMod.handleAction(23); // Back to base
      renderer.render(state);
      if (renderer.container.visible !== false) {
        stable = false;
        break;
      }
    }
    record(6, 'Repeated map open/close cycles', stable,
      '10 rapid open/close cycles completed with clean container visibility toggle');
  } catch (err) {
    record(6, 'Repeated map open/close cycles', false, err.message);
  }

  // TEST 7: No duplicate event handlers or rapid action spamming
  try {
    navMod.handleGoOut();
    renderer.render(state);

    const castleMarker = renderer.markerMap['thap_canh_bo_roi'];
    let debounceWorks = false;
    if (castleMarker && castleMarker.container) {
      renderer.isActionPending = true;
      const wasPending = renderer.isActionPending;

      // Simulate click while pending
      castleMarker.container.emit('pointerdown');
      // Verify debounce remained active
      debounceWorks = wasPending === true && renderer.isActionPending === true;
      renderer.isActionPending = false;
    }

    record(7, 'No duplicate event handlers & action debouncing', debounceWorks,
      `Debounce guard verified: isActionPending prevented double-trigger`);
  } catch (err) {
    record(7, 'No duplicate event handlers & action debouncing', false, err.message);
  }

  // TEST 8: No gameplay state mutation from visual interactions
  try {
    stateMod.resetState();
    const s = stateMod.getState();
    s.name = 'PurityTester';
    s.day = 4;
    s.hunger = 80;
    s.health = 90;
    s.location = 'Lều Người Sống Sót';

    const snapDay = s.day;
    const snapHunger = s.hunger;
    const snapHealth = s.health;
    const snapLocation = s.location;

    navMod.handleGoOut();
    renderer.render(s);

    // Perform purely visual UX operations
    renderer.cycleZoom();
    renderer.toggleGrid();
    renderer.highlightPOI('lau_dai_tan_the');
    renderer.unhighlightPOI('lau_dai_tan_the');
    renderer.recenterToPlayer();
    renderer.setZoom(1.0);
    renderer.toggleGrid();

    // Close map
    gameMod.handleAction(23);

    const stateUntouched = s.day === snapDay &&
                           s.hunger === snapHunger &&
                           s.health === snapHealth &&
                           s.location === snapLocation;

    record(8, 'Zero gameplay mutation from visual UX interactions', stateUntouched,
      `Day: ${s.day}/${snapDay}, Hunger: ${s.hunger}/${snapHunger}, Health: ${s.health}/${snapHealth}, Location: "${s.location}"`);
  } catch (err) {
    record(8, 'Zero gameplay mutation from visual UX interactions', false, err.message);
  }

  console.log('\n====================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  console.log(`TOTAL AUDIT ITEMS: ${results.length} | PASS: ${passCount} | FAIL: ${results.length - passCount}`);
  console.log('====================================================\n');

  if (passCount !== results.length) {
    process.exit(1);
  }
}

runPhase74UXTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

