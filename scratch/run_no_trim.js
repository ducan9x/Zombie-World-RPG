const fs = require("fs");
const zlib = require("zlib");
const { execSync } = require("child_process");

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  let crc = -1;
  const combined = Buffer.concat([typeBuf, data]);
  for (let i = 0; i < combined.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ combined[i]) & 0xFF];
  crc = (crc ^ (-1)) >>> 0;
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function perfectRecovery3(srcPath, outPng) {
  const tmpBmp = "scratch/tmp_perf3.bmp";
  execSync(`sips -s format bmp "${srcPath}" --out "${tmpBmp}"`, { stdio: "ignore" });
  const buf = fs.readFileSync(tmpBmp);
  const dataOffset = buf.readUInt32LE(10);
  const w = buf.readInt32LE(18);
  const hRaw = buf.readInt32LE(22);
  const h = Math.abs(hRaw);
  const isTopDown = hRaw < 0;
  const bpp = buf.readUInt16LE(28);
  const bytesPerPixel = bpp / 8;
  const rowStride = Math.ceil((w * bytesPerPixel) / 4) * 4;

  function getPixel(x, y) {
    const row = isTopDown ? y : (h - 1 - y);
    const offset = dataOffset + row * rowStride + x * bytesPerPixel;
    return { b: buf[offset], g: buf[offset + 1], r: buf[offset + 2] };
  }

  const S = w > 1000 ? 34 : 10;
  const R = Math.round(S * 1.25);

  function isLocalChecker(x, y) {
    const p = getPixel(x, y);
    const sat = Math.max(Math.abs(p.r - p.g), Math.abs(p.r - p.b), Math.abs(p.g - p.b));
    if (sat > 12) return false;

    let hasDark = false, hasLight = false;
    const step = Math.max(1, Math.floor(S / 3));
    for (let dy = -R; dy <= R; dy += step) {
      for (let dx = -R; dx <= R; dx += step) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const np = getPixel(nx, ny);
          const nsat = Math.max(Math.abs(np.r - np.g), Math.abs(np.r - np.b), Math.abs(np.g - np.b));
          if (nsat <= 10) {
            const na = (np.r + np.g + np.b) / 3;
            if (na <= 15) hasDark = true;
            if (na >= 115) hasLight = true;
          }
        }
      }
    }
    return (hasDark && hasLight);
  }

  const rawLeft = new Int32Array(h);
  const rawRight = new Int32Array(h);

  for (let y = 0; y < h; y++) {
    let lb = -1;
    for (let x = 0; x < w / 2; x++) {
      if (!isLocalChecker(x, y)) { lb = x; break; }
    }
    rawLeft[y] = lb === -1 ? Math.floor(w / 2) : lb;

    let rb = -1;
    for (let x = w - 1; x >= w / 2; x--) {
      if (!isLocalChecker(x, y)) { rb = x; break; }
    }
    rawRight[y] = rb === -1 ? Math.floor(w / 2) : rb;
  }

  let headY = 0;
  for (let y = 0; y < h / 2; y++) {
    if (rawRight[y] - rawLeft[y] > 20) { headY = y; break; }
  }
  let footY = h - 1;
  for (let y = h - 1; y > h / 2; y--) {
    if (rawRight[y] - rawLeft[y] > 20) { footY = y; break; }
  }

  const leftBound = new Int32Array(h);
  const rightBound = new Int32Array(h);
  const filterR = Math.max(2, Math.floor(S * 0.3));

  for (let y = 0; y < h; y++) {
    let minL = w;
    let maxR = 0;
    for (let k = -filterR; k <= filterR; k++) {
      const cy = Math.max(0, Math.min(h - 1, y + k));
      if (rawLeft[cy] < minL) minL = rawLeft[cy];
      if (rawRight[cy] > maxR) maxR = rawRight[cy];
    }
    leftBound[y] = minL;
    rightBound[y] = maxR;
  }

  const isBg = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < leftBound[y]; x++) isBg[y * w + x] = 1;
    for (let x = rightBound[y] + 1; x < w; x++) isBg[y * w + x] = 1;
  }

  for (let y = 0; y < headY; y++) {
    for (let x = 0; x < w; x++) isBg[y * w + x] = 1;
  }
  for (let y = footY + 1; y < h; y++) {
    for (let x = 0; x < w; x++) isBg[y * w + x] = 1;
  }

  // Flood fill from bottom between legs
  const crotchMinY = Math.round(h * 0.52);
  const legQueue = new Int32Array(w * h);
  let lHead = 0, lTail = 0;

  for (let x = 0; x < w; x++) {
    if (isBg[footY * w + x]) {
      legQueue[lTail++] = (footY << 16) | x;
    }
  }

  const dx = [0, 0, 1, -1];
  const dy = [-1, 1, 0, 0];

  while (lHead < lTail) {
    const val = legQueue[lHead++];
    const cy = val >> 16;
    const cx = val & 0xFFFF;

    for (let i = 0; i < 4; i++) {
      const nx = cx + dx[i], ny = cy + dy[i];
      if (nx >= 0 && nx < w && ny >= crotchMinY && ny < h) {
        const nIdx = ny * w + nx;
        if (!isBg[nIdx] && isLocalChecker(nx, ny)) {
          isBg[nIdx] = 1;
          legQueue[lTail++] = (ny << 16) | nx;
        }
      }
    }
  }

  // Trim edge residue:
  // For any pixel adjacent to isBg: if it is pure dark checker (avg <= 10) or pure gray checker (avg >= 125, sat <= 5)
  // and y is upper body or not foot sole, expand background!
  for (let iter = 0; iter < 0; iter++) {
    let changed = 0;
    for (let y = headY; y < footY; y++) {
      for (let x = leftBound[y]; x <= rightBound[y]; x++) {
        const idx = y * w + x;
        if (!isBg[idx]) {
          // Does it touch isBg?
          let touches = false;
          for (let i = 0; i < 4; i++) {
            const nx = x + dx[i], ny = y + dy[i];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[ny * w + nx]) {
              touches = true; break;
            }
          }
          if (touches) {
            const p = getPixel(x, y);
            const sat = Math.max(Math.abs(p.r - p.g), Math.abs(p.r - p.b), Math.abs(p.g - p.b));
            const avg = (p.r + p.g + p.b) / 3;
            // If near-zero black (<= 10) or light checker (>= 125, sat <= 5)
            // (Avoid trimming boots sole: foot sole is at y > footY - 30, so for y < footY - 30 we trim)
            if (y < footY - 20) {
              if ((avg <= 10 && sat <= 6) || (avg >= 125 && sat <= 5)) {
                isBg[idx] = 1;
                changed++;
              }
            }
          }
        }
      }
    }
    if (changed === 0) break;
  }

  // Alpha scanlines with 2-px anti-aliasing
  const scanlines = Buffer.alloc(h * (1 + w * 4));
  let transCount = 0;

  for (let y = 0; y < h; y++) {
    scanlines[y * (1 + w * 4)] = 0;
    for (let x = 0; x < w; x++) {
      const idx = y * (1 + w * 4) + 1 + x * 4;
      const p = getPixel(x, y);

      if (isBg[y * w + x]) {
        scanlines[idx] = 0;
        scanlines[idx + 1] = 0;
        scanlines[idx + 2] = 0;
        scanlines[idx + 3] = 0;
        transCount++;
      } else {
        let bgCount = 0;
        for (let ddy = -1; ddy <= 1; ddy++) {
          for (let ddx = -1; ddx <= 1; ddx++) {
            const nx = x + ddx, ny = y + ddy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[ny * w + nx]) {
              bgCount++;
            }
          }
        }
        let alpha = 255;
        if (bgCount > 0) {
          alpha = Math.round(255 * (1 - (bgCount / 9) * 0.45));
        }

        scanlines[idx] = p.r;
        scanlines[idx + 1] = p.g;
        scanlines[idx + 2] = p.b;
        scanlines[idx + 3] = alpha;
      }
    }
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const idat = zlib.deflateSync(scanlines, { level: 6 });
  const pngBuf = Buffer.concat([
    header,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", idat),
    makeChunk("IEND", Buffer.alloc(0))
  ]);

  fs.writeFileSync(outPng, pngBuf);
  fs.unlinkSync(tmpBmp);
  console.log(`Saved -> ${outPng}: transRatio = ${(transCount / (w * h) * 100).toFixed(1)}%`);
}

perfectRecovery3("public/assets/characters/player/young_adult_male_casual.png", "scratch/test_no_trim.png");

// Render preview
const b64 = fs.readFileSync("scratch/test_perfect3.png").toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="450" viewBox="0 0 900 450">
  <rect x="20" y="20" width="260" height="390" fill="#ffffff" stroke="#888" stroke-width="1"/>
  <image href="data:image/png;base64,${b64}" x="30" y="30" width="240" height="360" preserveAspectRatio="xMidYMid meet"/>
  <text x="150" y="430" font-family="sans-serif" font-size="14" font-weight="bold" fill="#000" text-anchor="middle">On White BG</text>

  <rect x="320" y="20" width="260" height="390" fill="#111318" stroke="#888" stroke-width="1"/>
  <image href="data:image/png;base64,${b64}" x="330" y="30" width="240" height="360" preserveAspectRatio="xMidYMid meet"/>
  <text x="450" y="430" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">On Dark BG</text>

  <pattern id="chk" width="16" height="16" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#555555"/>
    <rect x="8" width="8" height="8" fill="#333333"/>
    <rect y="8" width="8" height="8" fill="#333333"/>
    <rect x="8" y="8" width="8" height="8" fill="#555555"/>
  </pattern>
  <rect x="620" y="20" width="260" height="390" fill="url(#chk)" stroke="#888" stroke-width="1"/>
  <image href="data:image/png;base64,${b64}" x="630" y="30" width="240" height="360" preserveAspectRatio="xMidYMid meet"/>
  <text x="750" y="430" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">On Checkerboard</text>
</svg>`;
fs.writeFileSync("scratch/preview_no_trim.svg", svg);
execSync(`sips -s format png scratch/preview_perfect3.svg --out scratch/preview_perfect3.png`);
console.log("Rendered scratch/preview_perfect3.png");