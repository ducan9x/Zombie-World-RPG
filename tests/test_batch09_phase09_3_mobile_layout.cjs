/* ============================================================
   BATCH 09 – PHASE 09.3: GAME ZONES MOBILE LAYOUT & VIEW SWITCHER
   Automated Acceptance & Regression Verification Suite
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

async function runPhase093Tests() {
  console.log('====================================================');
  console.log('   BATCH 09 – PHASE 09.3: MOBILE LAYOUT AUDIT       ');
  console.log('====================================================\n');

  const results = [];
  function record(stt, item, pass, notes) {
    results.push({ stt, item, status: pass ? 'PASS' : 'FAIL', notes });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] #${stt}: ${item} (${notes})`);
  }

  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/style.css', 'utf8');

  // ==========================================================
  // TEST 1: DOM Structure for Mobile Header, Survival HUD & View Switcher
  // ==========================================================
  {
    const hasMobileHeader = html.includes('id="mobile-gameplay-header"');
    const hasSurvivalHUD = html.includes('id="mobile-survival-hud"');
    const hasViewTabs = html.includes('id="mobile-view-tabs"');
    const hasGameplayTab = html.includes('id="tab-btn-gameplay"');
    const hasInventoryTab = html.includes('id="tab-btn-inventory"');
    const hasCharacterTab = html.includes('id="tab-btn-character"');

    const passed = hasMobileHeader && hasSurvivalHUD && hasViewTabs &&
                   hasGameplayTab && hasInventoryTab && hasCharacterTab;
    record(1, 'Mobile Header & Navigation DOM Structure', passed,
      `Header: ${hasMobileHeader}, HUD: ${hasSurvivalHUD}, Tabs: ${hasViewTabs}, Buttons: ${hasGameplayTab && hasInventoryTab && hasCharacterTab}`);
  }

  // ==========================================================
  // TEST 2: Survival HUD Data Fields & Accessibility
  // ==========================================================
  {
    const hasHP = html.includes('id="mobile-hud-hp-val"') && html.includes('id="mobile-hud-hp-bar"');
    const hasHunger = html.includes('id="mobile-hud-hunger-val"') && html.includes('id="mobile-hud-hunger-bar"');
    const hasThirst = html.includes('id="mobile-hud-thirst-val"') && html.includes('id="mobile-hud-thirst-bar"');
    const hasDay = html.includes('id="mobile-hud-day-text"');
    const hasLocation = html.includes('id="mobile-hud-location-text"');

    const passed = hasHP && hasHunger && hasThirst && hasDay && hasLocation;
    record(2, 'Survival HUD Vitals & Telemetry Binds', passed,
      `HP: ${hasHP}, Hunger: ${hasHunger}, Thirst: ${hasThirst}, Day: ${hasDay}, Location: ${hasLocation}`);
  }

  // ==========================================================
  // TEST 3: WAI-ARIA Accessibility on Mobile Switcher
  // ==========================================================
  {
    const hasRoleTablist = html.includes('role="tablist"');
    const hasRoleTab = html.includes('role="tab"');
    const hasAriaSelected = html.includes('aria-selected="true"') && html.includes('aria-selected="false"');
    const hasAriaControls = html.includes('aria-controls="zone-3 zone-4"') && html.includes('aria-controls="zone-2"') && html.includes('aria-controls="zone-1"');

    const passed = hasRoleTablist && hasRoleTab && hasAriaSelected && hasAriaControls;
    record(3, 'WAI-ARIA Roles & Accessibility Attributes', passed,
      `Tablist: ${hasRoleTablist}, RoleTab: ${hasRoleTab}, AriaSelected: ${hasAriaSelected}, AriaControls: ${hasAriaControls}`);
  }

  // ==========================================================
  // TEST 4: Mobile Stylesheet Rules & Elimination of 40%/60% Grid
  // ==========================================================
  {
    const hasMobileQuery = css.includes('@media (max-width: 767px)');
    const hasSingleCol = css.includes('flex-direction: column !important') && css.includes('grid-template-columns: none !important');
    const hasStickyHeader = css.includes('#mobile-gameplay-header') && css.includes('position: sticky');
    const hasZoneDisplayRules = css.includes('[data-mobile-view="gameplay"]') &&
                                css.includes('[data-mobile-view="inventory"]') &&
                                css.includes('[data-mobile-view="character"]');

    const passed = hasMobileQuery && hasSingleCol && hasStickyHeader && hasZoneDisplayRules;
    record(4, 'Mobile Stylesheet Rules & 40/60 Grid Elimination', passed,
      `Query <768px: ${hasMobileQuery}, SingleCol: ${hasSingleCol}, StickyHeader: ${hasStickyHeader}, ZoneRules: ${hasZoneDisplayRules}`);
  }

  // ==========================================================
  // TEST 5: Desktop & Tablet Protection Rules in CSS
  // ==========================================================
  {
    const hasDesktopQuery = css.includes('@media (min-width: 1024px)');
    const hasTabletQuery = css.includes('@media (min-width: 768px)');
    const hasHeaderHiddenOnDesktop = css.includes('#mobile-gameplay-header') && css.includes('display: none !important');
    const hasAllZonesOnDesktop = css.includes('#zone-1, #zone-2, #zone-3, #zone-4') && css.includes('display: flex !important');

    const passed = hasDesktopQuery && hasTabletQuery && hasHeaderHiddenOnDesktop && hasAllZonesOnDesktop;
    record(5, 'Desktop & Tablet Layout Protection Rules', passed,
      `Desktop: ${hasDesktopQuery}, Tablet: ${hasTabletQuery}, HeaderHidden: ${hasHeaderHiddenOnDesktop}, AllZonesDesktop: ${hasAllZonesOnDesktop}`);
  }

  // ==========================================================
  // TEST 6: JavaScript Mobile Navigation Logic & View Switching
  // ==========================================================
  {
    // Setup Mock DOM
    const elements = {};
    function makeEl(id, tag = 'div') {
      if (elements[id]) return elements[id];
      const el = {
        id,
        tagName: tag.toUpperCase(),
        style: { display: '', width: '' },
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
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 400,
        _attrs: {},
        setAttribute(k, v) { this._attrs[k] = String(v); },
        getAttribute(k) { return this._attrs[k] !== undefined ? this._attrs[k] : null; },
        removeAttribute(k) { delete this._attrs[k]; },
        querySelectorAll(sel) {
          if (sel === '.mobile-tab-btn') {
            return [elements['tab-btn-gameplay'], elements['tab-btn-inventory'], elements['tab-btn-character']].filter(Boolean);
          }
          return [];
        },
        querySelector(sel) { return null; },
        addEventListener(evt, fn) {
          if (!this._listeners) this._listeners = {};
          if (!this._listeners[evt]) this._listeners[evt] = [];
          this._listeners[evt].push(fn);
        },
        click() {
          if (this._listeners && this._listeners['click']) {
            this._listeners['click'].forEach(fn => fn({ preventDefault() {} }));
          }
        }
      };
      elements[id] = el;
      return el;
    }

    [
      'game-content', 'mobile-gameplay-header', 'mobile-survival-hud', 'mobile-view-tabs',
      'tab-btn-gameplay', 'tab-btn-inventory', 'tab-btn-character',
      'zone-1', 'zone-2', 'zone-3', 'zone-4',
      'mobile-hud-hp-val', 'mobile-hud-hp-bar', 'mobile-hud-hunger-val', 'mobile-hud-hunger-bar',
      'mobile-hud-thirst-val', 'mobile-hud-thirst-bar', 'mobile-hud-day-text', 'mobile-hud-weather-text', 'mobile-hud-location-text'
    ].forEach(id => makeEl(id));

    elements['tab-btn-gameplay'].setAttribute('data-view', 'gameplay');
    elements['tab-btn-inventory'].setAttribute('data-view', 'inventory');
    elements['tab-btn-character'].setAttribute('data-view', 'character');

    const mockDocument = {
      getElementById: (id) => makeEl(id),
      createElement: (tag) => makeEl(`mock_${Math.random()}`, tag),
      querySelectorAll: (sel) => {
        if (sel === '.mobile-tab-btn') {
          return [elements['tab-btn-gameplay'], elements['tab-btn-inventory'], elements['tab-btn-character']].filter(Boolean);
        }
        return [];
      },
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    const context = vm.createContext({
      console,
      document: mockDocument,
      window: { renderAllUI: () => {} },
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

    const uiCode = fs.readFileSync('js/ui.js', 'utf8');
    const uiMod = new vm.SourceTextModule(uiCode, { identifier: path.resolve('js/ui.js'), context });
    moduleCache.set(path.resolve('js/ui.js'), uiMod);
    await uiMod.link(linker);
    await uiMod.evaluate();

    // 1. Initial State
    uiMod.namespace.setupMobileNav();
    const initView = uiMod.namespace.getMobileView();
    const gameContent = elements['game-content'];
    const initAttr = gameContent.getAttribute('data-mobile-view');

    // 2. Switch to Inventory
    uiMod.namespace.setMobileView('inventory');
    const viewAfterInv = uiMod.namespace.getMobileView();
    const attrAfterInv = gameContent.getAttribute('data-mobile-view');
    const isInvTabActive = elements['tab-btn-inventory'].classList.contains('is-active');

    // 3. Switch to Character
    uiMod.namespace.setMobileView('character');
    const viewAfterChar = uiMod.namespace.getMobileView();
    const attrAfterChar = gameContent.getAttribute('data-mobile-view');
    const isCharTabActive = elements['tab-btn-character'].classList.contains('is-active');

    // 4. Switch back to Gameplay
    uiMod.namespace.setMobileView('gameplay');
    const viewAfterGame = uiMod.namespace.getMobileView();
    const attrAfterGame = gameContent.getAttribute('data-mobile-view');
    const isGameTabActive = elements['tab-btn-gameplay'].classList.contains('is-active');

    const passed = initView === 'gameplay' && initAttr === 'gameplay' &&
                   viewAfterInv === 'inventory' && attrAfterInv === 'inventory' && isInvTabActive &&
                   viewAfterChar === 'character' && attrAfterChar === 'character' && isCharTabActive &&
                   viewAfterGame === 'gameplay' && attrAfterGame === 'gameplay' && isGameTabActive;

    record(6, 'JS Navigation & Mobile View Switching Cycle', passed,
      `Init: ${initView}, Inv: ${viewAfterInv}, Char: ${viewAfterChar}, Gameplay: ${viewAfterGame}`);
  }

  // ==========================================================
  // TEST 7: Survival HUD Live State Synchronization
  // ==========================================================
  {
    const hpVal = { textContent: '' };
    const hpBar = { style: { width: '' } };
    const hungerVal = { textContent: '' };
    const hungerBar = { style: { width: '' } };
    const thirstVal = { textContent: '' };
    const thirstBar = { style: { width: '' } };
    const dayText = { textContent: '' };
    const weatherText = { textContent: '' };
    const locText = { textContent: '' };

    const elements = {
      'mobile-survival-hud': { id: 'mobile-survival-hud' },
      'mobile-hud-hp-val': hpVal,
      'mobile-hud-hp-bar': hpBar,
      'mobile-hud-hunger-val': hungerVal,
      'mobile-hud-hunger-bar': hungerBar,
      'mobile-hud-thirst-val': thirstVal,
      'mobile-hud-thirst-bar': thirstBar,
      'mobile-hud-day-text': dayText,
      'mobile-hud-weather-text': weatherText,
      'mobile-hud-location-text': locText
    };

    const mockDocument = {
      getElementById: (id) => elements[id] || null,
      createElement: () => ({ style: {} }),
      querySelectorAll: () => [],
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

    const uiCode = fs.readFileSync('js/ui.js', 'utf8');
    const uiMod = new vm.SourceTextModule(uiCode, { identifier: path.resolve('js/ui.js'), context });
    moduleCache.set(path.resolve('js/ui.js'), uiMod);
    await uiMod.link(linker);
    await uiMod.evaluate();

    const mockState = {
      health: 85,
      hunger: 60,
      hydration: 45,
      day: 4,
      phaseIndex: 1,
      weather: 'Mưa axit',
      location: 'Trạm Y Tế Bỏ Hoang'
    };

    uiMod.namespace.renderMobileSurvivalHUD(mockState);

    const expectedHpPct = Math.round(85 / 300 * 100);
    const passed = hpVal.textContent === 85 && hpBar.style.width === `${expectedHpPct}%` &&
                   hungerVal.textContent === '60%' && hungerBar.style.width === '60%' &&
                   thirstVal.textContent === '45%' && thirstBar.style.width === '45%' &&
                   dayText.textContent.includes('Ngày 4') &&
                   weatherText.textContent === 'Mưa axit' &&
                   locText.textContent === 'Trạm Y Tế Bỏ Hoang';

    record(7, 'Survival HUD Live State Synchronization', passed,
      `HP: ${hpVal.textContent} (${hpBar.style.width}), Hunger: ${hungerVal.textContent}, Day: ${dayText.textContent}, Loc: ${locText.textContent}`);
  }

  // ==========================================================
  // TEST 8: Headless Chromium Exact Bounding-Box Across 8 Viewports
  // ==========================================================
  {
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
    let indexHtml = fs.readFileSync('index.html', 'utf8');
    const cssContent = fs.readFileSync('css/style.css', 'utf8');

    indexHtml = indexHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
    indexHtml = indexHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
    indexHtml = indexHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
    indexHtml = indexHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

    const harnessPath = path.resolve('scratch/harness_audit.html');
    const harnessHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Viewport Audit</title>
  <style>body { margin: 0; padding: 0; background: #000; } iframe { border: none; display: block; }</style>
</head>
<body>
  <div id="results"></div>
  <script>
    const viewports = ${JSON.stringify(VIEWPORTS)};
    const rawHtml = ${JSON.stringify(indexHtml)};
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
        if (gameContent) gameContent.style.display = '';

        const optionsArea = doc.getElementById('options-area');
        if (optionsArea) {
          optionsArea.innerHTML = '<div class="option-item" style="min-height:44px;">1. Khám phá</div><div class="option-item" style="min-height:44px;">2. Nghỉ ngơi</div>';
        }

        await new Promise(r => setTimeout(r, 60));

        const bodyW = doc.body.clientWidth;
        const bodyScrollW = doc.body.scrollWidth;
        const docW = doc.documentElement.clientWidth;
        const docScrollW = doc.documentElement.scrollWidth;
        const hasHorizOverflow = docScrollW > docW || bodyScrollW > bodyW;

        const headerEl = doc.getElementById('mobile-gameplay-header');
        const zone1 = doc.getElementById('zone-1');
        const zone2 = doc.getElementById('zone-2');
        const zone3 = doc.getElementById('zone-3');
        const zone4 = doc.getElementById('zone-4');
        const pixiVp = doc.getElementById('pixi-viewport');

        const headerDisplay = headerEl ? win.getComputedStyle(headerEl).display : 'none';
        const z1Display = zone1 ? win.getComputedStyle(zone1).display : 'none';
        const z2Display = zone2 ? win.getComputedStyle(zone2).display : 'none';
        const z3Display = zone3 ? win.getComputedStyle(zone3).display : 'none';
        const z4Display = zone4 ? win.getComputedStyle(zone4).display : 'none';

        const pixiW = pixiVp ? pixiVp.getBoundingClientRect().width : 0;
        const z1Rect = zone1 ? zone1.getBoundingClientRect() : { width: 0 };
        const z2Rect = zone2 ? zone2.getBoundingClientRect() : { width: 0 };
        const z4Rect = zone4 ? zone4.getBoundingClientRect() : { width: 0 };

        let tabSwitchPassed = true;
        if (vp.isMobile) {
          gameContent.setAttribute('data-mobile-view', 'inventory');
          const z2Inv = win.getComputedStyle(zone2).display;
          const z3Inv = win.getComputedStyle(zone3).display;

          gameContent.setAttribute('data-mobile-view', 'character');
          const z1Char = win.getComputedStyle(zone1).display;
          const z2Char = win.getComputedStyle(zone2).display;

          gameContent.setAttribute('data-mobile-view', 'gameplay');
          const z3Game = win.getComputedStyle(zone3).display;
          const z1Game = win.getComputedStyle(zone1).display;

          tabSwitchPassed = (z2Inv !== 'none' && z3Inv === 'none') &&
                            (z1Char !== 'none' && z2Char === 'none') &&
                            (z3Game !== 'none' && z1Game === 'none');
        }

        measurements.push({
          name: vp.name,
          w: vp.w,
          h: vp.h,
          hasHorizOverflow,
          headerDisplay,
          z1Display,
          z2Display,
          z3Display,
          z4Display,
          pixiWidth: Math.round(pixiW),
          z1Width: Math.round(z1Rect.width),
          z2Width: Math.round(z2Rect.width),
          z4Width: Math.round(z4Rect.width),
          tabSwitchPassed
        });

        document.body.removeChild(iframe);
      }

      document.getElementById('results').textContent = JSON.stringify(measurements);
    }
    runTest();
  </script>
</body>
</html>`;

    fs.writeFileSync(harnessPath, harnessHtml);

    try {
      const cmd = `"${chromePath}" --headless --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-profile --run-all-compositor-stages-before-draw --virtual-time-budget=6000 --dump-dom "file://${harnessPath}"`;
      const result = execSync(cmd, { encoding: 'utf8', timeout: 25000 });
      const match = result.match(/<div id="results">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        const data = JSON.parse(match[1]);

        // Check zero horizontal overflow across all 8 viewports
        const allNoOverflow = data.every(d => !d.hasHorizOverflow);

        // Check mobile header visibility
        const mobileHeadersOk = data.filter(d => d.w < 768).every(d => d.headerDisplay === 'flex');
        const nonMobileHeadersOk = data.filter(d => d.w >= 768).every(d => d.headerDisplay === 'none');

        // Check tab switches
        const allTabSwitchesOk = data.filter(d => d.w < 768).every(d => d.tabSwitchPassed);

        // Check desktop 4 zones visible side by side (200, 200, flex, 360)
        const desktopOk = data.filter(d => d.w >= 1024).every(d =>
          d.z1Display === 'flex' && d.z2Display === 'flex' && d.z3Display === 'flex' && d.z4Display === 'flex' &&
          d.z1Width === 200 && d.z2Width === 200 && d.z4Width === 360
        );

        // Check mobile pixi receives full available width (>= 310px on 320, >= 350px on 360, etc.)
        const mobilePixiFullWidth = data.filter(d => d.w < 768).every(d => d.pixiWidth >= (d.w - 16));

        const passed = allNoOverflow && mobileHeadersOk && nonMobileHeadersOk && allTabSwitchesOk && desktopOk && mobilePixiFullWidth;
        record(8, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', passed,
          `NoOverflow: ${allNoOverflow}, MobileHeader: ${mobileHeadersOk}, NonMobileHidden: ${nonMobileHeadersOk}, Tabs: ${allTabSwitchesOk}, DesktopPreserved: ${desktopOk}, FullPixi: ${mobilePixiFullWidth}`);
      } else {
        record(8, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', false, 'DOM results match failed');
      }
    } catch (e) {
      record(8, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', false, e.message);
    } finally {
      if (fs.existsSync(harnessPath)) fs.unlinkSync(harnessPath);
    }
  }

  // ==========================================================
  // SUMMARY
  // ==========================================================
  console.log('\n====================================================');
  const allPassed = results.every(r => r.status === 'PASS');
  console.log(`TOTAL AUDIT ITEMS: ${results.length} | PASS: ${results.filter(r => r.status === 'PASS').length} | FAIL: ${results.filter(r => r.status === 'FAIL').length}`);
  console.log('====================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runPhase093Tests().catch(err => {
  console.error(err);
  process.exit(1);
});

