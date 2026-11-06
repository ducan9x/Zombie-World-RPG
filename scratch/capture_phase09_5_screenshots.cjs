const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('docs/screenshots/phase09_5');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let baseHtml = fs.readFileSync('index.html', 'utf8');
const cssContent = fs.readFileSync('css/style.css', 'utf8');

// Inline CSS so headless browser renders completely and reliably
baseHtml = baseHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
baseHtml = baseHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

const standardCombatHudHtml = `
  <div class="combat-hud">
    <div class="combat-hud-header">
      <div class="combat-hud-badge badge-normal">☣ ZOMBIE SINH TỒN</div>
      <div class="combat-hud-status-badge status-alive">⚔️ ĐANG CHIẾN ĐẤU</div>
    </div>
    <div class="combat-enemy-card">
      <div class="combat-enemy-visual">
        <img class="combat-enemy-sprite" src="public/assets/zombies/zombie_lang_dao.png" alt="Zombie Lãng Đao">
      </div>
      <div class="combat-enemy-details">
        <div class="combat-enemy-title-row">
          <span class="combat-enemy-name">Zombie Lãng Đao</span>
        </div>
        <div class="combat-enemy-hp-container">
          <div class="combat-hp-label">
            <span>HP Đối thủ</span>
            <span class="combat-hp-values">65 / 100</span>
          </div>
          <div class="combat-hp-track">
            <div class="combat-hp-fill healthy" style="width: 65%;"></div>
          </div>
        </div>
        <div class="combat-enemy-meta">
          <span class="combat-meta-stat">⚔️ Sát thương: <strong>18</strong></span>
          <span class="combat-meta-stat">💨 Thân pháp: <strong>5%</strong></span>
        </div>
      </div>
    </div>
  </div>
  <div class="combat-log-container">
    <div class="combat-log-title">Nhật ký giao tranh</div>
    <div class="combat-log-body">
      <div class="combat-log-row combat-log-player-hit"><span class="combat-log-icon">⚔️</span>Bạn dùng Dao Găm đâm mạnh, gây 35 sát thương!</div>
      <div class="combat-log-row combat-log-enemy-hit"><span class="combat-log-icon">🩸</span>Zombie cào trúng cánh tay bạn, gây 12 sát thương!</div>
    </div>
  </div>
`;

const bossCombatHudHtml = `
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
            <span class="combat-hp-values">380 / 500</span>
          </div>
          <div class="combat-hp-track">
            <div class="combat-hp-fill healthy" style="width: 76%;"></div>
          </div>
        </div>
        <div class="combat-enemy-meta">
          <span class="combat-meta-stat">⚔️ Sát thương: <strong>55</strong></span>
          <span class="combat-meta-stat">💨 Thân pháp: <strong>18%</strong></span>
        </div>
        <div class="combat-ability-list">
          <span class="combat-ability-tag">Gọi bầy đàn</span>
          <span class="combat-ability-tag">Tự bộc phát</span>
        </div>
      </div>
    </div>
  </div>
  <div class="combat-log-container">
    <div class="combat-log-title">Nhật ký giao tranh Boss</div>
    <div class="combat-log-body">
      <div class="combat-log-row combat-log-crit"><span class="combat-log-icon">🎯</span>Chí mạng! Bạn nhắm bắn chuẩn xác, gây 75 sát thương!</div>
      <div class="combat-log-row combat-log-enemy-hit"><span class="combat-log-icon">🩸</span>Vua Zombie gầm thét cuồng bạo, quét chấn động gây 28 sát thương!</div>
    </div>
  </div>
`;

const longCombatLogHtml = `
  <div class="combat-hud">
    <div class="combat-hud-header">
      <div class="combat-hud-badge badge-mutant">☣ ZOMBIE ĐỘT BIẾN</div>
      <div class="combat-hud-status-badge status-alive">⚔️ ĐANG CHIẾN ĐẤU</div>
    </div>
    <div class="combat-enemy-card">
      <div class="combat-enemy-visual">
        <img class="combat-enemy-sprite" src="public/assets/zombies/zombie_axit.png" alt="Zombie Phun Axit">
      </div>
      <div class="combat-enemy-details">
        <div class="combat-enemy-title-row">
          <span class="combat-enemy-name">Zombie Đột Biến Phun Axit Ăn Mòn</span>
        </div>
        <div class="combat-enemy-hp-container">
          <div class="combat-hp-label">
            <span>HP Đối thủ</span>
            <span class="combat-hp-values">24 / 160</span>
          </div>
          <div class="combat-hp-track">
            <div class="combat-hp-fill critical" style="width: 15%;"></div>
          </div>
        </div>
        <div class="combat-enemy-meta">
          <span class="combat-meta-stat">⚔️ Sát thương: <strong>26</strong></span>
          <span class="combat-meta-stat">💨 Thân pháp: <strong>10%</strong></span>
        </div>
      </div>
    </div>
  </div>
  <div class="combat-log-container">
    <div class="combat-log-title">Nhật ký giao tranh kéo dài (Lượt 1 - 6)</div>
    <div class="combat-log-body">
      <div class="combat-log-row combat-log-player-hit"><span class="combat-log-icon">⚔️</span>[Lượt 1] Bạn nổ súng cảnh cáo, gây 25 sát thương!</div>
      <div class="combat-log-row combat-log-dodge"><span class="combat-log-icon">💨</span>[Lượt 2] Bạn lướt nhanh né được dòng dịch độc bắn tới!</div>
      <div class="combat-log-row combat-log-combo"><span class="combat-log-icon">⚡</span>[Lượt 3] Đòn liên kích! Chém 2 nhát chớp nhoáng, gây 48 sát thương!</div>
      <div class="combat-log-row combat-log-enemy-hit"><span class="combat-log-icon">🩸</span>[Lượt 4] Axit ăn mòn giáp bảo vệ bạn, gây 18 sát thương!</div>
      <div class="combat-log-row combat-log-status"><span class="combat-log-icon">⚠</span>[Lượt 5] Độ bền giáp giảm! Cảm giác cay rát bốc lên da thịt!</div>
      <div class="combat-log-row combat-log-player-hit"><span class="combat-log-icon">⚔️</span>[Lượt 6] Bạn đâm bồi thêm một nhát chí mạng vào điểm yếu, gây 45 sát thương!</div>
    </div>
  </div>
`;

const standardOptionsHtml = `
  <div class="option-item" data-index="1">1. Tấn công cận chiến bằng Dao Găm Quân Dụng</div>
  <div class="option-item" data-index="2">2. Sử dụng Băng Gạc Hồi Phục Máu khẩn cấp</div>
  <div class="option-item" data-index="3">3. Tìm cơ hội thoái lui chiến thuật an toàn</div>
`;

const paginatedOptionsHtml = `
  <div class="option-item" data-index="1">1. Tấn công cận chiến bằng Dao Găm</div>
  <div class="option-item" data-index="2">2. Nhắm bắn súng lục tầm xa</div>
  <div class="option-item" data-index="3">3. Sử dụng Băng Gạc Kháng Khuẩn</div>
  <div class="option-item" data-index="4">4. Dùng Nước Tinh Khiết giải khát</div>
`;

function capture(html, w, h, outFile) {
  const tempPath = path.resolve(`scratch/tmp_${path.basename(outFile)}.html`);
  fs.writeFileSync(tempPath, html, 'utf8');
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-shot-p095 --window-size=${w},${h} --screenshot="${outFile}" "file://${tempPath}"`;
  execSync(cmd, { stdio: ['pipe', 'ignore', 'ignore'] });
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  console.log(`[Captured] ${path.basename(outFile)} (${w}x${h})`);
}

// 1. Standard Combat 320x640
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${standardCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 320, 640, path.join(outDir, '01_combat_mobile_320x640.png'));
}

// 2. Standard Combat 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${standardCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 390, 844, path.join(outDir, '02_combat_mobile_390x844.png'));
}

// 3. Boss Encounter 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${bossCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 390, 844, path.join(outDir, '03_boss_encounter_390x844.png'));
}

// 4. Long Combat Log 390x844
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${longCombatLogHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 390, 844, path.join(outDir, '04_long_combat_log_390x844.png'));
}

// 5. Action Pagination 320x640
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${standardCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${paginatedOptionsHtml}</div>`);
  h = h.replace('<div id="pagination-area" class="pagination-area" style="display:none;">',
    '<div id="pagination-area" class="pagination-area" style="display:flex;">');
  h = h.replace('<span id="page-info" class="page-info"></span>', '<span id="page-info" class="page-info">1/3</span>');
  capture(h, 320, 640, path.join(outDir, '05_action_pagination_320x640.png'));
}

// 6. Combat Text Input with reduced available height (Keyboard simulation: 390x520)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${standardCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  h = h.replace('<div id="input-area" style="display:none;">', '<div id="input-area" style="display:flex;">');
  capture(h, 390, 520, path.join(outDir, '06_combat_text_input_390x520.png'));
}

// 7. Desktop Combat 1366x768
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${bossCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 1366, 768, path.join(outDir, '07_desktop_combat_1366x768.png'));
}

// 8. Tablet Combat 768x1024
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:grid;">');
  h = h.replace('<div id="story-area" class="panel"></div>', `<div id="story-area" class="panel">${bossCombatHudHtml}</div>`);
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${standardOptionsHtml}</div>`);
  capture(h, 768, 1024, path.join(outDir, '08_tablet_combat_768x1024.png'));
}

console.log('All Phase 09.5 visual screenshots captured successfully!');

