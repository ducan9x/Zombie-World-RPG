/**
 * ============================================================
 * BATCH 09 – PHASE 09.5 AUTOMATED TEST SUITE
 * Combat Screen & Narrative Story Mobile Experience Audit
 *
 * Verifies:
 * 1. Compact Combat Enemy HUD CSS Rules & Touch Layout (<768px)
 * 2. Long Enemy Name Handling & Boss Visual Identity (getEnemyClassification)
 * 3. Narrative Feed Typography & Differentiated Combat Log Classes
 * 4. Smart Auto-Scroll Behavior (near bottom auto-scrolls, scrolled up preserves position)
 * 5. Action Dock Touch Target Sizing (Options >= 44px, Pagination >= 44x44px, Input >= 44px & 16px font)
 * 6. Desktop & Tablet Combat Layout Preservation (>= 1024px and 768-1023px)
 * 7. Headless Chromium Exact Bounding-Box Across 8 Viewports
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('   BATCH 09 – PHASE 09.5: COMBAT & STORY AUDIT      ');
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
  const css = fs.readFileSync('css/style.css', 'utf8');

  // ==========================================================
  // TEST 1: Compact Combat HUD Stylesheet Rules (< 768px)
  // ==========================================================
  {
    const hasCombatHudCompact = css.includes('.combat-hud') && css.includes('border-radius: 6px');
    const hasEnemyVisualCompact = css.includes('.combat-enemy-visual') && (css.includes('56px') || css.includes('54px'));
    const hasEnemyNameClamp = css.includes('.combat-enemy-name') && css.includes('word-break: break-word');
    const hasHpTrackCompact = css.includes('.combat-hp-track') && css.includes('height: 8px');
    const hasCombatLogBodyVisible = css.includes('.combat-log-body') && css.includes('max-height: none !important');

    const passed = hasCombatHudCompact && hasEnemyVisualCompact && hasEnemyNameClamp && hasHpTrackCompact && hasCombatLogBodyVisible;

    record(1, 'Compact Combat HUD Stylesheet Rules (<768px)', passed,
      `HudCompact: ${hasCombatHudCompact}, VisualCompact: ${hasEnemyVisualCompact}, NameClamp: ${hasEnemyNameClamp}, Track8px: ${hasHpTrackCompact}, LogBodyVisible: ${hasCombatLogBodyVisible}`);
  }

  // ==========================================================
  // TEST 2: Long Enemy Name & Boss Classification Logic
  // ==========================================================
  {
    const context = vm.createContext({ console, Math });
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
      if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath);
      const code = fs.readFileSync(resolvedPath, 'utf8');
      const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
      moduleCache.set(resolvedPath, mod);
      return mod;
    }

    const combatHudCode = fs.readFileSync('js/combat-hud.js', 'utf8');
    const combatHudMod = new vm.SourceTextModule(combatHudCode, { identifier: path.resolve('js/combat-hud.js'), context });
    moduleCache.set(path.resolve('js/combat-hud.js'), combatHudMod);
    await combatHudMod.link(linker);
    await combatHudMod.evaluate();

    const { getEnemyClassification, renderCombatHUD, getEnemySprite } = combatHudMod.namespace;

    // Boss encounter
    const bossEnemy = { id: 'zombie_king', name: 'Vua Zombie Tối Thượng', hp: 500, maxHp: 500 };
    const bossClass = getEnemyClassification(bossEnemy);
    const bossSprite = getEnemySprite(bossEnemy);
    const bossHtml = renderCombatHUD(bossEnemy, { currentHp: 350, maxHp: 500 });

    // Long mutant name encounter
    const longMutantEnemy = { id: 'zombie_axit', name: 'Zombie Đột Biến Phun Axit Ăn Mòn Cực Mạnh', hp: 120, maxHp: 120 };
    const mutantClass = getEnemyClassification(longMutantEnemy);
    const mutantHtml = renderCombatHUD(longMutantEnemy, { currentHp: 60, maxHp: 120 });

    const isBossClassified = bossClass.className === 'badge-boss';
    const isMutantClassified = mutantClass.className === 'badge-mutant';
    const hasHpRendered = bossHtml.includes('350 / 500') && mutantHtml.includes('60 / 120');
    const hasSpriteUrl = typeof bossSprite === 'string' && bossSprite.includes('.png');

    const passed = isBossClassified && isMutantClassified && hasHpRendered && hasSpriteUrl;

    record(2, 'Enemy Classification & HUD Data Binding', passed,
      `BossClass: ${bossClass.label}, MutantClass: ${mutantClass.label}, HpRendered: ${hasHpRendered}, Sprite: ${bossSprite}`);
  }

  // ==========================================================
  // TEST 3: Combat Log Differentiation & Format Formatting
  // ==========================================================
  {
    const context = vm.createContext({ console, Math });
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
      if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath);
      const code = fs.readFileSync(resolvedPath, 'utf8');
      const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
      moduleCache.set(resolvedPath, mod);
      return mod;
    }

    const combatHudCode = fs.readFileSync('js/combat-hud.js', 'utf8');
    const combatHudMod = new vm.SourceTextModule(combatHudCode, { identifier: path.resolve('js/combat-hud.js'), context });
    moduleCache.set(path.resolve('js/combat-hud.js'), combatHudMod);
    await combatHudMod.link(linker);
    await combatHudMod.evaluate();

    const { formatCombatLogRow } = combatHudMod.namespace;

    const rowPlayerHit = formatCombatLogRow('Bạn dùng Dao Găm tấn công, gây 25 sát thương!');
    const rowEnemyHit = formatCombatLogRow('Zombie gây 15 sát thương cho bạn!');
    const rowCrit = formatCombatLogRow('💀Bắn trúng đầu! Sát thương chí mạng 60!');
    const rowDodge = formatCombatLogRow('Bạn đã né đòn tấn công của đối thủ!');
    const rowVictory = formatCombatLogRow('Bạn đã đánh bại Zombie Lãng Đao! Rơi ra 2x Thịt hộp!');
    const rowDefeat = formatCombatLogRow('Bạn bị Zombie đánh gục…… Thất bại!');

    const hasPlayerHitClass = rowPlayerHit.includes('combat-log-player-hit');
    const hasEnemyHitClass = rowEnemyHit.includes('combat-log-enemy-hit');
    const hasCritClass = rowCrit.includes('combat-log-crit');
    const hasDodgeClass = rowDodge.includes('combat-log-dodge');
    const hasVictoryClass = rowVictory.includes('combat-log-victory');
    const hasDefeatClass = rowDefeat.includes('combat-log-defeat');

    const passed = hasPlayerHitClass && hasEnemyHitClass && hasCritClass && hasDodgeClass && hasVictoryClass && hasDefeatClass;

    record(3, 'Combat Log Differentiation & Visual Categories', passed,
      `PlayerHit: ${hasPlayerHitClass}, EnemyHit: ${hasEnemyHitClass}, Crit: ${hasCritClass}, Dodge: ${hasDodgeClass}, Victory: ${hasVictoryClass}, Defeat: ${hasDefeatClass}`);
  }

  // ==========================================================
  // TEST 4: Smart Narrative & Mobile Scroll Preservation Logic
  // ==========================================================
  {
    const elements = {};
    function makeEl(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          scrollHeight: 1000,
          clientHeight: 400,
          scrollTop: 0,
          style: {}
        };
      }
      return elements[id];
    }

    const storyArea = makeEl('story-area');
    const gameContent = makeEl('game-content');

    const mockDocument = {
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: () => []
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
      if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath);
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

    const { scrollStoryToBottomIfNeeded } = uiMod.namespace;

    // Case 1: Near bottom (scrollTop = 550, distanceFromBottom = 1000 - (550 + 400) = 50 <= 80)
    storyArea.scrollTop = 550;
    gameContent.scrollTop = 550;
    scrollStoryToBottomIfNeeded(storyArea);
    const storyScrolled = storyArea.scrollTop === 1000;
    const gcScrolled = gameContent.scrollTop === 1000;

    // Case 2: Scrolled up reading history (scrollTop = 200, distanceFromBottom = 1000 - (200 + 400) = 400 > 80)
    storyArea.scrollTop = 200;
    gameContent.scrollTop = 200;
    scrollStoryToBottomIfNeeded(storyArea);
    const storyPreserved = storyArea.scrollTop === 200;
    const gcPreserved = gameContent.scrollTop === 200;

    const passed = storyScrolled && gcScrolled && storyPreserved && gcPreserved;

    record(4, 'Smart Auto-Scroll & History Scroll Preservation', passed,
      `NearBottomScrolled: ${storyScrolled && gcScrolled}, HistoryPreserved: ${storyPreserved && gcPreserved}`);
  }

  // ==========================================================
  // TEST 5: Action Dock Touch Sizing & Rules Inspection (<768px)
  // ==========================================================
  {
    const hasOptionMinHeight44 = css.includes('#zone-4 > #options-area .option-item') && css.includes('min-height: 44px');
    const hasOptionBadge22 = css.includes('#zone-4 > #options-area .option-item::before') && css.includes('width: 22px');
    const hasPagination44 = css.includes('.pagination-btn') && css.includes('min-height: 44px') && css.includes('min-width: 44px');
    const hasActionInput16px = css.includes('#action-input') && css.includes('font-size: 16px') && css.includes('min-height: 44px');
    const hasSubmitBtn44 = css.includes('#submit-btn') && css.includes('min-height: 44px');

    const passed = hasOptionMinHeight44 && hasOptionBadge22 && hasPagination44 && hasActionInput16px && hasSubmitBtn44;

    record(5, 'Action Dock Touch Sizing Inspection (<768px)', passed,
      `Option44: ${hasOptionMinHeight44}, Badge22: ${hasOptionBadge22}, Pagination44: ${hasPagination44}, Input16px: ${hasActionInput16px}, Submit44: ${hasSubmitBtn44}`);
  }

  // ==========================================================
  // TEST 6: Desktop & Tablet Layout Preservation Rules
  // ==========================================================
  {
    const hasDesktopMinWidth = css.includes('@media (min-width: 1024px)');
    const hasDesktopZones = css.includes('#zone-1') && css.includes('#zone-2') && css.includes('#zone-3') && css.includes('#zone-4');
    const hasDesktopEnemyCard = css.includes('.combat-enemy-visual') && css.includes('width: 96px') && css.includes('height: 120px');

    const passed = hasDesktopMinWidth && hasDesktopZones && hasDesktopEnemyCard;

    record(6, 'Desktop Combat & Dashboard Preservation Rules', passed,
      `MinWidth1024: ${hasDesktopMinWidth}, DesktopZones: ${hasDesktopZones}, DesktopCard120px: ${hasDesktopEnemyCard}`);
  }

  // ==========================================================
  // TEST 7: Headless Chromium Exact Bounding-Box Across 8 Viewports
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
    let rawIndexHtml = fs.readFileSync('index.html', 'utf8');
    const cssContent = fs.readFileSync('css/style.css', 'utf8');

    rawIndexHtml = rawIndexHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
    rawIndexHtml = rawIndexHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
    rawIndexHtml = rawIndexHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
    rawIndexHtml = rawIndexHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

    const harnessPath = path.resolve('scratch/harness_phase09_5.html');
    const harnessHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Phase 09.5 Viewport Audit</title>
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
          gameContent.setAttribute('data-mobile-view', 'gameplay');
        }

        // Inject Combat HUD and Combat Story inside #story-area
        const storyArea = doc.getElementById('story-area');
        if (storyArea) {
          storyArea.innerHTML = \`
            <div class="combat-hud">
              <div class="combat-hud-header">
                <div class="combat-hud-badge badge-boss">☣ BOSS CHIẾN DỊCH</div>
                <div class="combat-hud-status-badge status-alive">⚔️ ĐANG CHIẾN ĐẤU</div>
              </div>
              <div class="combat-enemy-card">
                <div class="combat-enemy-visual">
                  <img class="combat-enemy-sprite" src="public/assets/zombies/zombie_king.png" alt="Vua Zombie">
                </div>
                <div class="combat-enemy-details">
                  <div class="combat-enemy-title-row">
                    <span class="combat-enemy-name">Vua Zombie Tối Thượng</span>
                  </div>
                  <div class="combat-enemy-hp-container">
                    <div class="combat-hp-label">
                      <span>HP Đối thủ</span>
                      <span class="combat-hp-values">350 / 500</span>
                    </div>
                    <div class="combat-hp-track">
                      <div class="combat-hp-fill healthy" style="width: 70%;"></div>
                    </div>
                  </div>
                  <div class="combat-enemy-meta">
                    <span class="combat-meta-stat">⚔️ Sát thương: <strong>45</strong></span>
                    <span class="combat-meta-stat">💨 Thân pháp: <strong>15%</strong></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="combat-log-container">
              <div class="combat-log-title">Nhật ký giao tranh</div>
              <div class="combat-log-body">
                <div class="combat-log-row combat-log-player-hit"><span class="combat-log-icon">⚔️</span>Bạn dùng Dao Găm tấn công, gây 35 sát thương!</div>
                <div class="combat-log-row combat-log-enemy-hit"><span class="combat-log-icon">🩸</span>Vua Zombie vung quyền, gây 20 sát thương cho bạn!</div>
              </div>
            </div>
          \`;
        }

        // Inject Combat action options and pagination in #zone-4
        const optionsArea = doc.getElementById('options-area');
        if (optionsArea) {
          optionsArea.innerHTML = \`
            <div class="option-item" data-index="1">1. Tấn công cận chiến bằng Dao Găm Quân Dụng</div>
            <div class="option-item" data-index="2">2. Sử dụng Băng Gạc Hồi Phục Máu khẩn cấp</div>
            <div class="option-item" data-index="3">3. Tìm cơ hội thoái lui chiến thuật an toàn</div>
          \`;
        }

        const paginationArea = doc.getElementById('pagination-area');
        if (paginationArea) paginationArea.style.display = 'flex';

        const inputArea = doc.getElementById('input-area');
        if (inputArea) inputArea.style.display = 'flex';

        await new Promise(r => setTimeout(r, 60));

        const bodyW = doc.body.clientWidth;
        const bodyScrollW = doc.body.scrollWidth;
        const docW = doc.documentElement.clientWidth;
        const docScrollW = doc.documentElement.scrollWidth;
        const hasHorizOverflow = docScrollW > docW || bodyScrollW > bodyW;

        // Measure Combat HUD Elements
        const enemyVisual = doc.querySelector('.combat-enemy-visual');
        const visualRect = enemyVisual ? enemyVisual.getBoundingClientRect() : { width: 0, height: 0 };

        const enemyName = doc.querySelector('.combat-enemy-name');
        const nameRect = enemyName ? enemyName.getBoundingClientRect() : { width: 0, height: 0 };

        // Measure Options
        const optionItem = doc.querySelector('.option-item');
        const optionHeight = optionItem ? optionItem.getBoundingClientRect().height : 0;

        // Measure Pagination Buttons
        const prevBtn = doc.getElementById('prev-page-btn');
        const prevBtnRect = prevBtn ? prevBtn.getBoundingClientRect() : { width: 0, height: 0 };

        // Measure Input and Submit
        const actionInput = doc.getElementById('action-input');
        const inputHeight = actionInput ? actionInput.getBoundingClientRect().height : 0;
        const submitBtn = doc.getElementById('submit-btn');
        const submitHeight = submitBtn ? submitBtn.getBoundingClientRect().height : 0;

        document.body.removeChild(iframe);

        measurements.push({
          name: vp.name,
          w: vp.w,
          h: vp.h,
          isMobile: vp.isMobile,
          isDesktop: vp.isDesktop,
          hasHorizOverflow,
          visualW: visualRect.width,
          visualH: visualRect.height,
          optionHeight,
          prevBtnW: prevBtnRect.width,
          prevBtnH: prevBtnRect.height,
          inputHeight,
          submitHeight
        });
      }

      const div = document.createElement('div');
      div.id = 'measure_dump';
      div.textContent = JSON.stringify(measurements);
      document.body.appendChild(div);
    }

    runTest();
  </script>
</body>
</html>`;

    if (!fs.existsSync('scratch')) fs.mkdirSync('scratch', { recursive: true });
    fs.writeFileSync(harnessPath, harnessHtml, 'utf8');

    try {
      const rawOutput = execSync(`"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-p095 --virtual-time-budget=9000 --dump-dom "file://${harnessPath}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });

      const match = rawOutput.match(/<div id="measure_dump">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        const measurements = JSON.parse(match[1]);

        let allOverflowFree = true;
        let allTouchTargetsPassed = true;
        let allVisualSizingPassed = true;

        for (const m of measurements) {
          if (m.hasHorizOverflow) allOverflowFree = false;

          if (m.isMobile) {
            // Touch targets >= 44px
            if (m.optionHeight < 43.5 || m.prevBtnH < 43.5 || m.prevBtnW < 43.5 || m.inputHeight < 43.5 || m.submitHeight < 43.5) {
              allTouchTargetsPassed = false;
            }
            // Mobile compact visual ~56px (not 120px)
            if (m.visualH > 70 || m.visualW > 70) {
              allVisualSizingPassed = false;
            }
          } else if (m.isDesktop) {
            // Desktop visual preserved at 120px height
            if (m.visualH < 100) {
              allVisualSizingPassed = false;
            }
          }
        }

        const passed = allOverflowFree && allTouchTargetsPassed && allVisualSizingPassed;
        record(7, 'Headless Chromium Exact Bounding-Box Across 8 Viewports', passed,
          `NoOverflow: ${allOverflowFree}, TouchTargets44: ${allTouchTargetsPassed}, VisualSizing: ${allVisualSizingPassed}`);
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

