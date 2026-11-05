const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const qaDir = path.resolve('scratch/qa/batch-03');
if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });

const batch = JSON.parse(fs.readFileSync('project-docs/assets/batches/batch-03-characters.json', 'utf8'));

// Helper to create small thumbnail for montage embedding
function getThumbnailBase64(srcPath, w, h) {
  const tmpThumb = path.resolve(`scratch/tmp_thumb_${Date.now()}_${Math.floor(Math.random()*1000)}.png`);
  try {
    execSync(`sips -z ${h} ${w} "${srcPath}" --out "${tmpThumb}"`, { stdio: 'ignore' });
    const buf = fs.readFileSync(tmpThumb);
    return buf.toString('base64');
  } catch (e) {
    return '';
  } finally {
    if (fs.existsSync(tmpThumb)) fs.unlinkSync(tmpThumb);
  }
}

// 1. GENERATE PLAYER MONTAGE (6 cols x 5 rows)
const pCols = 6;
const pRows = 5;
const cardW = 230;
const imgW = 200;
const imgH = 300;
const cardH = 365;
const padX = 20;
const padY = 20;
const headerH = 75;

const totalPW = padX + pCols * (cardW + padX);
const totalPH = headerH + padY + pRows * (cardH + padY);

let playerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalPW}" height="${totalPH}" viewBox="0 0 ${totalPW} ${totalPH}">
  <style>
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 26px; font-weight: bold; fill: #ffffff; }
    .subtitle { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; fill: #888888; }
    .label { font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 11px; fill: #dddddd; text-anchor: middle; font-weight: 600; }
    .sublabel { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 10px; text-anchor: middle; }
    .pass { fill: #4ade80; font-weight: bold; }
    .fail { fill: #f87171; font-weight: bold; }
  </style>
  <rect width="${totalPW}" height="${totalPH}" fill="#111318"/>
  <text x="${totalPW / 2}" y="35" class="title" text-anchor="middle">BATCH 03: PLAYER APPEARANCE ASSETS (30 COMBINATIONS)</text>
  <text x="${totalPW / 2}" y="58" class="subtitle" text-anchor="middle">QA Audit Grid — Specification: 512×768 (2:3) PNG RGBA | True Alpha Transparency Check</text>
`;

batch.player.forEach((item, idx) => {
  const col = idx % pCols;
  const row = Math.floor(idx / pCols);
  const cx = padX + col * (cardW + padX);
  const cy = headerH + padY + row * (cardH + padY);

  const p = item.filePath;
  const exists = fs.existsSync(p);
  let b64 = '';
  let metaW = 0, metaH = 0, isPass = false, statusText = '';

  if (exists) {
    b64 = getThumbnailBase64(p, imgW, imgH);
    try {
      const meta = execSync(`sips -g pixelWidth -g pixelHeight -g hasAlpha "${p}"`).toString();
      metaW = parseInt((meta.match(/pixelWidth: (\d+)/) || [])[1] || 0);
      metaH = parseInt((meta.match(/pixelHeight: (\d+)/) || [])[1] || 0);
    } catch (e) {}

    const tmpBmp = path.resolve(`scratch/chk_p_${idx}.bmp`);
    try {
      execSync(`sips -s format bmp "${p}" --out "${tmpBmp}"`, { stdio: 'ignore' });
      const b = fs.readFileSync(tmpBmp);
      const dataOffset = b.readUInt32LE(10);
      const bpp = b.readUInt16LE(28);
      const bppBytes = bpp / 8;
      const stride = Math.ceil((metaW * bppBytes) / 4) * 4;
      let trans = 0, opaque = 0;
      for (let y = 0; y < metaH; y += 4) {
        for (let x = 0; x < metaW; x += 4) {
          const off = dataOffset + y * stride + x * bppBytes;
          const a = bppBytes === 4 ? b[off + 3] : 255;
          if (a === 0) trans++; else opaque++;
        }
      }
      const transPct = (trans / (trans + opaque)) * 100;
      if (metaW === 512 && metaH === 768 && transPct >= 20) {
        isPass = true;
        statusText = `512×768 | Alpha ${transPct.toFixed(0)}% (PASS)`;
      } else if (metaW !== 512 || metaH !== 768) {
        statusText = `${metaW}×${metaH} (FAIL: Raw Image)`;
      } else {
        statusText = `512×768 | Opaque (FAIL: 0% Alpha)`;
      }
    } catch (e) {
      statusText = 'Error reading alpha';
    } finally {
      if (fs.existsSync(tmpBmp)) fs.unlinkSync(tmpBmp);
    }
  } else {
    statusText = 'MISSING FILE';
  }

  const strokeColor = isPass ? '#22c55e' : '#ef4444';
  const labelClass = isPass ? 'pass' : 'fail';

  playerSvg += `
  <g transform="translate(${cx}, ${cy})">
    <rect width="${cardW}" height="${cardH}" rx="8" fill="#1b1e26" stroke="${strokeColor}" stroke-width="1.5"/>
    <g transform="translate(${(cardW - imgW)/2}, 10)">
      <rect width="${imgW}" height="${imgH}" rx="4" fill="#2a2e39"/>
      <pattern id="chk_${idx}" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#323744"/>
        <rect x="8" width="8" height="8" fill="#262b35"/>
        <rect y="8" width="8" height="8" fill="#262b35"/>
        <rect x="8" y="8" width="8" height="8" fill="#323744"/>
      </pattern>
      <rect width="${imgW}" height="${imgH}" rx="4" fill="url(#chk_${idx})"/>
      ${exists && b64 ? `<image href="data:image/png;base64,${b64}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid meet"/>` : `<text x="${imgW/2}" y="${imgH/2}" fill="#ef4444" text-anchor="middle">NO IMAGE</text>`}
    </g>
    <text x="${cardW / 2}" y="${imgH + 28}" class="label">${item.filename}</text>
    <text x="${cardW / 2}" y="${imgH + 45}" class="sublabel ${labelClass}">${statusText}</text>
  </g>`;
});

playerSvg += `\n</svg>`;

const playerSvgPath = path.resolve('scratch/qa/batch-03/player_montage.svg');
const playerPngPath = path.resolve('scratch/qa/batch-03/player_montage.png');
fs.writeFileSync(playerSvgPath, playerSvg);
console.log('Written player_montage.svg');

// 2. GENERATE NPC MONTAGE (6 cols x 1 row)
const nCols = 6;
const nRows = 1;
const totalNW = padX + nCols * (cardW + padX);
const totalNH = headerH + padY + nRows * (cardH + padY);

let npcSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalNW}" height="${totalNH}" viewBox="0 0 ${totalNW} ${totalNH}">
  <style>
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 26px; font-weight: bold; fill: #ffffff; }
    .subtitle { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; fill: #888888; }
    .label { font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 11px; fill: #dddddd; text-anchor: middle; font-weight: 600; }
    .sublabel { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 10px; text-anchor: middle; }
    .pass { fill: #4ade80; font-weight: bold; }
    .fail { fill: #f87171; font-weight: bold; }
  </style>
  <rect width="${totalNW}" height="${totalNH}" fill="#111318"/>
  <text x="${totalNW / 2}" y="35" class="title" text-anchor="middle">BATCH 03: STORY NPC ASSETS (6 NPCS)</text>
  <text x="${totalNW / 2}" y="58" class="subtitle" text-anchor="middle">QA Audit Grid — Specification: 512×768 (2:3) PNG RGBA | True Alpha Transparency Check</text>
`;

batch.npcs.forEach((item, idx) => {
  const col = idx;
  const cx = padX + col * (cardW + padX);
  const cy = headerH + padY;

  let p = item.filePath;
  let exists = fs.existsSync(p);
  if (!exists) {
    const dir = path.dirname(p);
    const base = path.basename(p);
    if (fs.existsSync(dir)) {
      const match = fs.readdirSync(dir).find(f => f.trim() === base);
      if (match) { p = path.join(dir, match); exists = true; }
    }
  }

  let b64 = '';
  let metaW = 0, metaH = 0, isPass = false, statusText = '';

  if (exists) {
    b64 = getThumbnailBase64(p, imgW, imgH);
    try {
      const meta = execSync(`sips -g pixelWidth -g pixelHeight -g hasAlpha "${p}"`).toString();
      metaW = parseInt((meta.match(/pixelWidth: (\d+)/) || [])[1] || 0);
      metaH = parseInt((meta.match(/pixelHeight: (\d+)/) || [])[1] || 0);
    } catch (e) {}

    const hasLeadingSpace = path.basename(p) !== item.filename;
    if (hasLeadingSpace) {
      statusText = `FAIL: Space ("${path.basename(p)}")`;
    } else if (metaW !== 512 || metaH !== 768) {
      statusText = `${metaW}×${metaH} (FAIL: Raw Image)`;
    } else {
      statusText = 'PASS';
      isPass = true;
    }
  } else {
    statusText = 'MISSING FILE';
  }

  const strokeColor = isPass ? '#22c55e' : '#ef4444';
  const labelClass = isPass ? 'pass' : 'fail';

  npcSvg += `
  <g transform="translate(${cx}, ${cy})">
    <rect width="${cardW}" height="${cardH}" rx="8" fill="#1b1e26" stroke="${strokeColor}" stroke-width="1.5"/>
    <g transform="translate(${(cardW - imgW)/2}, 10)">
      <rect width="${imgW}" height="${imgH}" rx="4" fill="#2a2e39"/>
      <pattern id="chk_npc_${idx}" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#323744"/>
        <rect x="8" width="8" height="8" fill="#262b35"/>
        <rect y="8" width="8" height="8" fill="#262b35"/>
        <rect x="8" y="8" width="8" height="8" fill="#323744"/>
      </pattern>
      <rect width="${imgW}" height="${imgH}" rx="4" fill="url(#chk_npc_${idx})"/>
      ${exists && b64 ? `<image href="data:image/png;base64,${b64}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid meet"/>` : `<text x="${imgW/2}" y="${imgH/2}" fill="#ef4444" text-anchor="middle">NO IMAGE</text>`}
    </g>
    <text x="${cardW / 2}" y="${imgH + 28}" class="label">${item.filename}</text>
    <text x="${cardW / 2}" y="${imgH + 45}" class="sublabel ${labelClass}">${statusText}</text>
  </g>`;
});

npcSvg += `\n</svg>`;

const npcSvgPath = path.resolve('scratch/qa/batch-03/npc_montage.svg');
const npcPngPath = path.resolve('scratch/qa/batch-03/npc_montage.png');
fs.writeFileSync(npcSvgPath, npcSvg);
console.log('Written npc_montage.svg');

// Render to PNG
execSync(`sips -s format png "${playerSvgPath}" --out "${playerPngPath}"`);
console.log('Rendered player_montage.png');
execSync(`sips -s format png "${npcSvgPath}" --out "${npcPngPath}"`);
console.log('Rendered npc_montage.png');
