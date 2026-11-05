const fs = require('fs');
const zlib = require('zlib');
const { execSync } = require('child_process');
const path = require('path');

// CRC32 table for PNG encoding
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  let crc = -1;
  const combined = Buffer.concat([typeBuf, data]);
  for (let i = 0; i < combined.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ combined[i]) & 0xFF];
  }
  crc = (crc ^ (-1)) >>> 0;
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function processCharacter(srcPath, outPngPath) {
  const tmpId = Date.now() + '_' + Math.floor(Math.random() * 10000);
  const tmpBmp = path.resolve(`scratch/tmp_${tmpId}.bmp`);
  const tmpRawPng = path.resolve(`scratch/tmp_${tmpId}_raw.png`);

  try {
    // 1. Convert source to uncompressed BMP using macOS sips
    execSync(`sips -s format bmp "${srcPath}" --out "${tmpBmp}"`, { stdio: 'ignore' });

    const buf = fs.readFileSync(tmpBmp);
    const dataOffset = buf.readUInt32LE(10);
    const w = buf.readInt32LE(18);
    const hRaw = buf.readInt32LE(22);
    const h = Math.abs(hRaw);
    const isTopDown = hRaw < 0;
    const bpp = buf.readUInt16LE(28);
    const bytesPerPixel = bpp / 8;
    const rowStride = Math.ceil((w * bytesPerPixel) / 4) * 4;

    const isBg = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let qHead = 0, qTail = 0;

    function getPixel(x, y) {
      const row = isTopDown ? y : (h - 1 - y);
      const offset = dataOffset + row * rowStride + x * bytesPerPixel;
      return { b: buf[offset], g: buf[offset + 1], r: buf[offset + 2] };
    }

    // A pixel is considered background if it is bright light gray/white with low color saturation
    function isBgColor(r, g, b) {
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
      const minVal = Math.min(r, g, b);
      return minVal >= 220 && maxDiff <= 30;
    }

    // Seed borders (all 4 edges)
    for (let x = 0; x < w; x++) {
      const top = getPixel(x, 0);
      if (isBgColor(top.r, top.g, top.b)) {
        isBg[0 * w + x] = 1;
        queue[qTail++] = (0 << 16) | x;
      }
      const bottom = getPixel(x, h - 1);
      if (isBgColor(bottom.r, bottom.g, bottom.b)) {
        isBg[(h - 1) * w + x] = 1;
        queue[qTail++] = ((h - 1) << 16) | x;
      }
    }
    for (let y = 0; y < h; y++) {
      const left = getPixel(0, y);
      if (isBgColor(left.r, left.g, left.b) && !isBg[y * w + 0]) {
        isBg[y * w + 0] = 1;
        queue[qTail++] = (y << 16) | 0;
      }
      const right = getPixel(w - 1, y);
      if (isBgColor(right.r, right.g, right.b) && !isBg[y * w + (w - 1)]) {
        isBg[y * w + (w - 1)] = 1;
        queue[qTail++] = (y << 16) | (w - 1);
      }
    }

    // 4-way BFS flood fill
    const dx = [0, 0, 1, -1];
    const dy = [1, -1, 0, 0];

    while (qHead < qTail) {
      const val = queue[qHead++];
      const py = val >> 16;
      const px = val & 0xFFFF;

      for (let i = 0; i < 4; i++) {
        const nx = px + dx[i];
        const ny = py + dy[i];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nIdx = ny * w + nx;
          if (!isBg[nIdx]) {
            const np = getPixel(nx, ny);
            if (isBgColor(np.r, np.g, np.b)) {
              isBg[nIdx] = 1;
              queue[qTail++] = (ny << 16) | nx;
            }
          }
        }
      }
    }

    // Build RGBA scanlines
    const scanlines = Buffer.alloc(h * (1 + w * 4));
    for (let y = 0; y < h; y++) {
      scanlines[y * (1 + w * 4)] = 0; // Filter 0 (None)
      for (let x = 0; x < w; x++) {
        const idx = y * (1 + w * 4) + 1 + x * 4;
        const pIdx = y * w + x;
        const px = getPixel(x, y);

        if (isBg[pIdx]) {
          scanlines[idx] = 0;
          scanlines[idx + 1] = 0;
          scanlines[idx + 2] = 0;
          scanlines[idx + 3] = 0;
        } else {
          // Check anti-aliasing near background boundary
          let nearBg = false;
          for (let i = 0; i < 4; i++) {
            const nx = x + dx[i];
            const ny = y + dy[i];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[ny * w + nx]) {
              nearBg = true;
              break;
            }
          }

          let a = 255;
          let r = px.r;
          let g = px.g;
          let b = px.b;

          if (nearBg) {
            const brightness = (r + g + b) / 3;
            if (brightness > 210) {
              a = Math.max(0, Math.min(255, Math.round(((255 - brightness) / 45) * 255)));
            }
          }

          scanlines[idx] = r;
          scanlines[idx + 1] = g;
          scanlines[idx + 2] = b;
          scanlines[idx + 3] = a;
        }
      }
    }

    // Build PNG buffer
    const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;  // 8 bits per sample
    ihdr[9] = 6;  // RGBA
    ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

    const idat = zlib.deflateSync(scanlines, { level: 6 });
    const pngBuf = Buffer.concat([
      header,
      makeChunk('IHDR', ihdr),
      makeChunk('IDAT', idat),
      makeChunk('IEND', Buffer.alloc(0))
    ]);

    fs.writeFileSync(tmpRawPng, pngBuf);

    // Ensure destination directory exists
    const destDir = path.dirname(outPngPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Resize to exact 512x768 pixels with sips
    execSync(`sips -z 768 512 "${tmpRawPng}" --out "${outPngPath}"`, { stdio: 'ignore' });

    // Verify output
    const outMeta = execSync(`sips -g pixelWidth -g pixelHeight -g hasAlpha "${outPngPath}"`).toString();
    if (!outMeta.includes('512') || !outMeta.includes('768') || !outMeta.includes('hasAlpha: yes')) {
      throw new Error(`Failed verification for ${outPngPath}: ${outMeta}`);
    }

    const fileSize = fs.statSync(outPngPath).size;
    console.log(`[PROCESSED] -> ${outPngPath} (${fileSize} bytes)`);
    return { success: true, path: outPngPath, size: fileSize };
  } finally {
    if (fs.existsSync(tmpBmp)) fs.unlinkSync(tmpBmp);
    if (fs.existsSync(tmpRawPng)) fs.unlinkSync(tmpRawPng);
  }
}

module.exports = { processCharacter };

if (require.main === module) {
  const [,, src, dest] = process.argv;
  if (!src || !dest) {
    console.error('Usage: node process_character.js <src> <dest>');
    process.exit(1);
  }
  processCharacter(src, dest);
}

