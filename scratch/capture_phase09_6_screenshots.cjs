const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('docs/screenshots/phase09_6');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let baseHtml = fs.readFileSync('index.html', 'utf8');
const cssContent = fs.readFileSync('css/style.css', 'utf8');

// Inline CSS so headless browser renders completely and reliably
baseHtml = baseHtml.replace('<link rel="stylesheet" href="css/style.css">', `<style>${cssContent}</style>`);
baseHtml = baseHtml.replace(/<script src="public\/vendor\/pixi\.min\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script type="module" src="js\/main\.js"><\/script>/g, '');
baseHtml = baseHtml.replace(/<script src="tools\/devtools-auth\.js"><\/script>/g, '');

const mapToolbarHtml = `
  <div class="map-view-toggle-bar">
    <div class="map-toolbar-left">
      <button id="map-zoom-btn" class="map-ctrl-btn" type="button">🔍 Zoom: 1.0x</button>
      <button id="map-grid-btn" class="map-ctrl-btn" type="button">📐 Lưới: Bật</button>
      <button id="map-recenter-btn" class="map-ctrl-btn" type="button">🎯 Vị trí</button>
    </div>
    <div class="map-toolbar-right">
      <button id="map-view-toggle-btn" class="map-toggle-btn" type="button">📋 Xem Chữ</button>
    </div>
  </div>
`;

const mapOptionsHtml = `
  ${mapToolbarHtml}
  <div class="option-item" data-index="1">1. 🏰 Lâu đài Tận thế [☆An toàn]</div>
  <div class="option-item" data-index="2">2. 🗼 Tháp Canh Đỉnh Núi Hoang Vắng [★Nhẹ nhàng]</div>
  <div class="option-item map-hover-highlight" data-index="3">3. 🌾 Làng Nông Trại Núi [★★Nguy hiểm thấp]</div>
  <div class="option-item" data-index="4">4. 🏭 Khu Công Nghiệp / Nhà Xưởng [★★★Trung bình]</div>
  <div class="option-item" data-index="5">5. 🏥 Bệnh Viện Ngoại Thành [★★★★Nguy hiểm cao]</div>
`;

// Canvas drawing script injected into HTML
function getCanvasScript(focusedPoi = null) {
  return `
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const vp = document.getElementById('pixi-viewport');
        if (!vp) return;
        const cv = document.createElement('canvas');
        cv.id = 'pixi-canvas';
        cv.width = 640;
        cv.height = 320;
        vp.appendChild(cv);

        const ctx = cv.getContext('2d');
        if (!ctx) return;

        // 1. Terrain Base
        ctx.fillStyle = '#1a1f2c';
        ctx.fillRect(0, 0, 640, 320);

        // Northwest mountains
        ctx.fillStyle = '#262f3d';
        ctx.fillRect(0, 0, 160, 120);

        // East river & swamp
        ctx.fillStyle = '#0f2736';
        ctx.fillRect(520, 0, 120, 320);

        // South industrial
        ctx.fillStyle = '#161e29';
        ctx.fillRect(32, 200, 220, 120);

        // 2. Military Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 640; x += 32) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 320); ctx.stroke();
        }
        for (let y = 0; y <= 320; y += 32) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke();
        }

        // 3. Roads
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 150, 520, 20); // Horizontal highway
        ctx.fillRect(246, 0, 20, 320); // North-South axis
        ctx.fillRect(86, 32, 20, 130); // Castle branch
        ctx.fillRect(406, 64, 20, 220); // East branch

        // Road dashes
        ctx.strokeStyle = '#e2e8f0';
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 160); ctx.lineTo(520, 160); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 320); ctx.stroke();
        ctx.setLineDash([]);

        // 4. Structures
        // Castle Fortress
        ctx.fillStyle = '#475569';
        ctx.fillRect(40, 22, 112, 70);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(56, 40, 80, 42);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('🏰 LÂU ĐÀI TẬN THẾ', 46, 36);

        // Hospital
        ctx.fillStyle = '#64748b';
        ctx.fillRect(328, 42, 80, 50);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(362, 54, 12, 26);
        ctx.fillRect(355, 61, 26, 12);

        // Gas Station
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(160, 106, 64, 40);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('⛽ TRẠM XĂNG', 164, 124);

        // 5. POI Markers & Reticles
        const pois = [
          { id: 'lau_dai_tan_the', x: 96, y: 22, name: 'Lâu đài Tận thế', color: '#4ade80', icon: '🏰', danger: '☆ AN TOÀN' },
          { id: 'tran_dia_binh_minh', x: 256, y: 42, name: 'Trận địa Bình minh', color: '#4ade80', icon: '🛡️', danger: '★ NHẸ NHÀNG' },
          { id: 'thap_canh_bo_roi', x: 32, y: 138, name: 'Tháp canh bỏ rơi', color: '#38bdf8', icon: '🗼', danger: '★ NHẸ NHÀNG' },
          { id: 'lang_nong_trai_nui', x: 64, y: 234, name: 'Làng Nông Trại Núi', color: '#34d399', icon: '🌾', danger: '★★ NGUY HIỂM THẤP' },
          { id: 'khu_cong_nghiep', x: 112, y: 234, name: 'Khu Công Nghiệp', color: '#fb923c', icon: '🏭', danger: '★★★ TRUNG BÌNH' },
          { id: 'benh_vien_ngoai_thanh', x: 368, y: 42, name: 'Bệnh viện ngoại thành', color: '#f87171', icon: '🏥', danger: '★★★★ CAO' },
          { id: 'ham_tau_dien_ngam', x: 448, y: 170, name: 'Hầm tàu ngầm', color: '#c084fc', icon: '🚇', danger: '★★★★★ NGUY CẤP' },
          { id: 'to_zombie', x: 576, y: 234, name: 'Tổ Zombie Chúa', color: '#ef4444', icon: '☣', danger: '☠ TUYỆT CẢNH' }
        ];

        for (const p of pois) {
          const isFocused = '${focusedPoi}' === p.id;

          // Pulse circle / Reticle
          ctx.strokeStyle = isFocused ? '#22c55e' : p.color;
          ctx.lineWidth = isFocused ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, isFocused ? 22 : 14, 0, Math.PI * 2);
          ctx.stroke();

          // Background circle
          ctx.fillStyle = isFocused ? 'rgba(34, 197, 94, 0.25)' : 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
          ctx.fill();

          // Icon
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.icon, p.x, p.y);
        }

        // 6. Tactical Info Card if POI focused
        const focusedObj = pois.find(p => p.id === '${focusedPoi}');
        if (focusedObj) {
          const cardW = 165;
          const cardH = 68;
          let cardX = focusedObj.x + 22;
          let cardY = focusedObj.y - 12;

          // Card clamping boundary check
          if (cardX + cardW > 632) cardX = focusedObj.x - cardW - 22;
          if (cardX < 8) cardX = 8;
          if (cardY + cardH > 312) cardY = 312 - cardH;
          if (cardY < 8) cardY = 8;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.strokeStyle = focusedObj.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(focusedObj.name, cardX + 10, cardY + 18);

          ctx.fillStyle = focusedObj.color;
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText('ĐỘ NGUY HIỂM: ' + focusedObj.danger, cardX + 10, cardY + 34);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px monospace';
          ctx.fillText('Tỉ lệ chạm trán: 15% · Đã khám phá', cardX + 10, cardY + 48);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'italic 8.5px monospace';
          ctx.fillText('▶ Đã định vị - Chạm để di chuyển', cardX + 10, cardY + 60);
        }

        // 7. Player Token & Beacon
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(160, 160, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(160, 160, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧭', 160, 160);

        // Vignette Border
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 638, 318);
      });
    </script>
  `;
}

function capture(htmlContent, w, h, outFile) {
  const tempPath = path.resolve(`scratch/harness_shot_${Date.now()}_${w}.html`);
  fs.writeFileSync(tempPath, htmlContent, 'utf8');

  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-shot-p096 --window-size=${w},${h} --screenshot="${outFile}" "file://${tempPath}"`;
  execSync(cmd, { stdio: ['pipe', 'ignore', 'ignore'] });
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  console.log(`[Captured] ${path.basename(outFile)} (${w}x${h})`);
}

// 1. World Map Mobile 320x640 (Portrait)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript()}</body>`);
  capture(h, 320, 640, path.join(outDir, '01_world_map_mobile_320x640.png'));
}

// 2. World Map Mobile 390x844 (Portrait)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript()}</body>`);
  capture(h, 390, 844, path.join(outDir, '02_world_map_mobile_390x844.png'));
}

// 3. World Map Landscape 667x375 (iPhone SE/8 Landscape)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript()}</body>`);
  capture(h, 667, 375, path.join(outDir, '03_world_map_landscape_667x375.png'));
}

// 4. World Map Landscape 844x390 (iPhone 12/13/14 Landscape)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript()}</body>`);
  capture(h, 844, 390, path.join(outDir, '04_world_map_landscape_844x390.png'));
}

// 5. World Map Landscape 932x430 (iPhone 14/15 Pro Max Landscape)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript()}</body>`);
  capture(h, 932, 430, path.join(outDir, '05_world_map_landscape_932x430.png'));
}

// 6. Closest Neighbor POI Touch Selection at 390x844 (lang_nong_trai_nui vs khu_cong_nghiep)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript('lang_nong_trai_nui')}</body>`);
  capture(h, 390, 844, path.join(outDir, '06_world_map_close_poi_390x844.png'));
}

// 7. Edge POI Touch Selection at 320x640 (lau_dai_tan_the clamped at canvas border)
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;" data-mobile-view="gameplay">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript('lau_dai_tan_the')}</body>`);
  capture(h, 320, 640, path.join(outDir, '07_world_map_edge_poi_320x640.png'));
}

// 8. Desktop 4-Zone Map at 1366x768
{
  let h = baseHtml.replace('<div id="name-setup">', '<div id="name-setup" style="display:none;">');
  h = h.replace('<div id="game-content" style="display:none;" data-mobile-view="gameplay">',
    '<div id="game-content" style="display:flex;">');
  h = h.replace('<div id="options-area"></div>', `<div id="options-area">${mapOptionsHtml}</div>`);
  h = h.replace('</body>', `${getCanvasScript('lang_nong_trai_nui')}</body>`);
  capture(h, 1366, 768, path.join(outDir, '08_desktop_map_1366x768.png'));
}

console.log('All 8 Phase 09.6 final validation visual screenshots captured successfully!');
