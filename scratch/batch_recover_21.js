const fs = require("fs");
const path = require("path");
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

function recoverSingleCharacter(srcPath, outPngPath) {
  const tmpId = Date.now() + "_" + Math.floor(Math.random() * 100000);
  const tmpBmp = `scratch/tmp_br_${tmpId}.bmp`;
  const tmpRawPng = `scratch/tmp_br_${tmpId}.png`;

  try {
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
      return { r: buf[offset + 2], g: buf[offset + 1], b: buf[offset] };
    }

    // 1. Profile background from top-left margin
    const sampleW = Math.min(100, Math.floor(w * 0.15));
    const sampleH = Math.min(100, Math.floor(h * 0.1));
    let bgMin = 255, bgMax = 0, bgMaxSat = 0;

    for (let y = 10; y < sampleH; y += 4) {
      for (let x = 10; x < sampleW; x += 4) {
        const p = getPixel(x, y);
        const avg = (p.r + p.g + p.b) / 3;
        const sat = Math.max(Math.abs(p.r - p.g), Math.abs(p.r - p.b), Math.abs(p.g - p.b));
        if (avg < bgMin) bgMin = avg;
        if (avg > bgMax) bgMax = avg;
        if (sat > bgMaxSat) bgMaxSat = sat;
      }
    }

    const S = w > 1000 ? 34 : 10;
    const R = Math.round(S * 1.25);
    const darkThresh = bgMin + (bgMax - bgMin) * 0.35;
    const lightThresh = bgMax - (bgMax - bgMin) * 0.35;
    const maxAllowedSat = Math.max(12, bgMaxSat + 4);

    function isLocalChecker(cx, cy) {
      const p = getPixel(cx, cy);
      const sat = Math.max(Math.abs(p.r - p.g), Math.abs(p.r - p.b), Math.abs(p.g - p.b));
      if (sat > maxAllowedSat) return false;

      let count = 0, darkCount = 0, lightCount = 0;
      const step = Math.max(1, Math.floor(S / 4));
      for (let dy = -R; dy <= R; dy += step) {
        for (let dx = -R; dx <= R; dx += step) {
          if (dx * dx + dy * dy <= R * R) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const np = getPixel(nx, ny);
              const nsat = Math.max(Math.abs(np.r - np.g), Math.abs(np.r - np.b), Math.abs(np.g - np.b));
              if (nsat <= maxAllowedSat) {
                const na = (np.r + np.g + np.b) / 3;
                count++;
                if (na <= darkThresh) darkCount++;
                if (na >= lightThresh) lightCount++;
              }
            }
          }
        }
      }
      if (count < 4) return false;
      return (darkCount / count >= 0.15 && lightCount / count >= 0.15);
    }

    // 2. Scan outer silhouette boundaries with margin
    const rawLeft = new Int32Array(h);
    const rawRight = new Int32Array(h);
    const margin = Math.round(w * 0.08);

    for (let y = 0; y < h; y++) {
      let lb = -1;
      for (let x = margin; x < w / 2; x++) {
        if (!isLocalChecker(x, y)) { lb = x; break; }
      }
      rawLeft[y] = lb === -1 ? Math.floor(w / 2) : lb;

      let rb = -1;
      for (let x = w - 1 - margin; x >= w / 2; x--) {
        if (!isLocalChecker(x, y)) { rb = x; break; }
      }
      rawRight[y] = rb === -1 ? Math.floor(w / 2) : rb;
    }

    // 3. Find head top and foot bottom
    let headY = 0;
    const minWidth = Math.round(w * 0.05);
    for (let y = 0; y < h / 2; y++) {
      if (rawRight[y] - rawLeft[y] > minWidth) { headY = y; break; }
    }
    let footY = h - 1;
    for (let y = h - 1; y > h / 2; y--) {
      if (rawRight[y] - rawLeft[y] > minWidth) { footY = y; break; }
    }

    // 4. Median filter to eliminate spikes
    const medR = Math.max(2, Math.floor(S * 0.15));
    const leftBound = new Int32Array(h);
    const rightBound = new Int32Array(h);

    for (let y = 0; y < h; y++) {
      const lList = [];
      const rList = [];
      for (let k = -medR; k <= medR; k++) {
        const cy = Math.max(0, Math.min(h - 1, y + k));
        lList.push(rawLeft[cy]);
        rList.push(rawRight[cy]);
      }
      lList.sort((a, b) => a - b);
      rList.sort((a, b) => a - b);
      leftBound[y] = lList[Math.floor(lList.length / 2)];
      rightBound[y] = rList[Math.floor(rList.length / 2)];
    }

    // 5. Initial background mask
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

    // 6. Crotch fill between legs
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

    // 7. Remove watermark and speckles (< 800 px) from foreground
    const isFg = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) if (!isBg[i]) isFg[i] = 1;

    const fgVisited = new Uint8Array(w * h);
    const fgQueue = new Int32Array(w * h);
    const minFgSize = w > 1000 ? 2500 : 800;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (isFg[idx] && !fgVisited[idx]) {
          let fHead = 0, fTail = 0;
          fgQueue[fTail++] = (y << 16) | x;
          fgVisited[idx] = 1;

          while (fHead < fTail) {
            const val = fgQueue[fHead++];
            const cy = val >> 16;
            const cx = val & 0xFFFF;
            for (let i = 0; i < 4; i++) {
              const nx = cx + dx[i], ny = cy + dy[i];
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nIdx = ny * w + nx;
                if (isFg[nIdx] && !fgVisited[nIdx]) {
                  fgVisited[nIdx] = 1;
                  fgQueue[fTail++] = (ny << 16) | nx;
                }
              }
            }
          }

          if (fTail < minFgSize) {
            for (let i = 0; i < fTail; i++) {
              const val = fgQueue[i];
              isBg[(val >> 16) * w + (val & 0xFFFF)] = 1;
            }
          }
        }
      }
    }

    // 8. Build RGBA scanlines with anti-aliasing
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

    const outDir = path.dirname(outPngPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    if (w === 512 && h === 768) {
      fs.writeFileSync(outPngPath, pngBuf);
    } else {
      fs.writeFileSync(tmpRawPng, pngBuf);
      execSync(`sips -z 768 512 "${tmpRawPng}" --out "${outPngPath}"`, { stdio: "ignore" });
    }

    const transPct = (transCount / (w * h) * 100).toFixed(1);
    const finalSize = fs.statSync(outPngPath).size;
    console.log(`[RECOVERED] ${path.basename(outPngPath)}: ${w}x${h} -> 512x768 | Trans: ${transPct}% | ${finalSize} bytes`);
    return { success: true, transPct, size: finalSize };
  } finally {
    if (fs.existsSync(tmpBmp)) fs.unlinkSync(tmpBmp);
    if (fs.existsSync(tmpRawPng)) fs.unlinkSync(tmpRawPng);
  }
}

// Full 21 list:
const recoveryList = [
  // Group A: 12 player assets (512x768 black bg)
  { src: "scratch/backup_recovery_source/young_adult_male_casual.png", dest: "public/assets/characters/player/young_adult_male_casual.png", name: "young_adult_male_casual.png" },
  { src: "scratch/backup_recovery_source/young_adult_female_survivor.png", dest: "public/assets/characters/player/young_adult_female_survivor.png", name: "young_adult_female_survivor.png" },
  { src: "scratch/backup_recovery_source/young_adult_female_tactical.png", dest: "public/assets/characters/player/young_adult_female_tactical.png", name: "young_adult_female_tactical.png" },
  { src: "scratch/backup_recovery_source/young_adult_female_casual.png", dest: "public/assets/characters/player/young_adult_female_casual.png", name: "young_adult_female_casual.png" },
  { src: "scratch/backup_recovery_source/adult_male_survivor.png", dest: "public/assets/characters/player/adult_male_survivor.png", name: "adult_male_survivor.png" },
  { src: "scratch/backup_recovery_source/adult_male_tactical.png", dest: "public/assets/characters/player/adult_male_tactical.png", name: "adult_male_tactical.png" },
  { src: "scratch/backup_recovery_source/adult_male_casual.png", dest: "public/assets/characters/player/adult_male_casual.png", name: "adult_male_casual.png" },
  { src: "scratch/backup_recovery_source/adult_female_survivor.png", dest: "public/assets/characters/player/adult_female_survivor.png", name: "adult_female_survivor.png" },
  { src: "scratch/backup_recovery_source/adult_female_tactical.png", dest: "public/assets/characters/player/adult_female_tactical.png", name: "adult_female_tactical.png" },
  { src: "scratch/backup_recovery_source/adult_female_casual.png", dest: "public/assets/characters/player/adult_female_casual.png", name: "adult_female_casual.png" },
  { src: "scratch/backup_recovery_source/middle_aged_male_survivor.png", dest: "public/assets/characters/player/middle_aged_male_survivor.png", name: "middle_aged_male_survivor.png" },
  { src: "scratch/backup_recovery_source/middle_aged_male_tactical.png", dest: "public/assets/characters/player/middle_aged_male_tactical.png", name: "middle_aged_male_tactical.png" },

  // Group B: 8 raw 1696x2528 assets
  { src: "scratch/backup_recovery_source/elderly_female_survivor.png", dest: "public/assets/characters/player/elderly_female_survivor.png", name: "elderly_female_survivor.png" },
  { src: "scratch/backup_recovery_source/elderly_female_tactical.png", dest: "public/assets/characters/player/elderly_female_tactical.png", name: "elderly_female_tactical.png" },
  { src: "scratch/backup_recovery_source/elderly_female_casual.png", dest: "public/assets/characters/player/elderly_female_casual.png", name: "elderly_female_casual.png" },
  { src: "scratch/backup_recovery_source/npc_co_v.png", dest: "public/assets/characters/npc/npc_co_v.png", name: "npc_co_v.png" },
  { src: "scratch/backup_recovery_source/npc_tieu_ham.png", dest: "public/assets/characters/npc/npc_tieu_ham.png", name: "npc_tieu_ham.png" },
  { src: "scratch/backup_recovery_source/npc_lili.png", dest: "public/assets/characters/npc/npc_lili.png", name: "npc_lili.png" },
  { src: "scratch/backup_recovery_source/npc_muc_mieu_mieu.png", dest: "public/assets/characters/npc/npc_muc_mieu_mieu.png", name: "npc_muc_mieu_mieu.png" },
  { src: "scratch/backup_recovery_source/npc_vua_karen.png", dest: "public/assets/characters/npc/npc_vua_karen.png", name: "npc_vua_karen.png" },

  // Group C: 1 raw 1696x2528 with space
  { src: "scratch/backup_recovery_source/ npc_tien_si_tran.png", dest: "public/assets/characters/npc/npc_tien_si_tran.png", name: "npc_tien_si_tran.png" }
];

console.log("=== Starting Batch Recovery of 21 Assets ===");
const tempRecoveryDir = "scratch/recovered";
if (!fs.existsSync(tempRecoveryDir)) fs.mkdirSync(tempRecoveryDir, { recursive: true });

const results = [];
for (let i = 0; i < recoveryList.length; i++) {
  const item = recoveryList[i];
  console.log(`[${i + 1}/${recoveryList.length}] Processing: ${item.name} ...`);
  const tempOut = path.join(tempRecoveryDir, item.name);
  const res = recoverSingleCharacter(item.src, tempOut);
  results.push({ ...item, ...res, tempOut });
}

console.log("=== All 21 Assets Recovered to scratch/recovered/ ===");
fs.writeFileSync("scratch/recovery_results.json", JSON.stringify(results, null, 2));
