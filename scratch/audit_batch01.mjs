import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const batchFile = path.resolve('project-docs/assets/batches/batch-01-ui-icons.json');
const batch = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));

console.log('====================================================');
console.log('STAGE A: COMPREHENSIVE AUDIT OF BATCH 01 ASSETS');
console.log('====================================================');

const results = [];

// Use PowerShell + System.Drawing to inspect low-level bitmap data for each asset
const psScript = `
Add-Type -AssemblyName System.Drawing
$batch = Get-Content -Raw "project-docs/assets/batches/batch-01-ui-icons.json" | ConvertFrom-Json
foreach ($a in $batch.assets) {
    $p = Join-Path "C:\\Users\\dungu\\Documents\\test\\Zombie-World-RPG" $a.file
    $exists = Test-Path $p
    if (-not $exists) {
        Write-Output "RESULT:$($a.id)|MISSING|0|0|0|0|0|0"
        continue
    }
    $len = (Get-Item $p).Length
    $bmp = [System.Drawing.Bitmap]::FromFile($p)
    $w = $bmp.Width
    $h = $bmp.Height
    $fmt = $bmp.PixelFormat.ToString()
    
    $c0 = $bmp.GetPixel(0, 0)
    $cMid = $bmp.GetPixel([int]($w/2), [int]($h/2))
    
    $trans = 0
    $semi = 0
    $opaque = 0
    $step = 4
    for ($y = 0; $y -lt $h; $y += $step) {
        for ($x = 0; $x -lt $w; $x += $step) {
            $px = $bmp.GetPixel($x, $y)
            if ($px.A -eq 0) { $trans++ }
            elseif ($px.A -eq 255) { $opaque++ }
            else { $semi++ }
        }
    }
    $tot = $trans + $semi + $opaque
    $transPct = [math]::Round($trans * 100 / $tot, 1)
    $opaquePct = [math]::Round($opaque * 100 / $tot, 1)
    
    $cornerA = $c0.A
    
    $bmp.Dispose()
    Write-Output "RESULT:$($a.id)|$exists|$w|$h|$len|$fmt|$transPct|$opaquePct|$cornerA"
}
`;

const psOutput = execSync(`powershell -NoProfile -Command "${psScript.replace(/"/g, '\\"')}"`).toString('utf-8');

const lines = psOutput.split('\n').filter(l => l.startsWith('RESULT:'));

let allPass = true;
const auditTable = [];

for (const line of lines) {
  const parts = line.trim().replace('RESULT:', '').split('|');
  const [id, exists, w, h, len, fmt, transPct, opaquePct, cornerA] = parts;
  
  const expected = batch.assets.find(a => a.id === id);
  const dimOk = expected && parseInt(w) === expected.width && parseInt(h) === expected.height;
  const transOk = parseInt(cornerA) === 0 && parseFloat(transPct) > 10;
  const fmtOk = fmt === 'Format32bppArgb';
  const sizeOk = parseInt(len) > 5000 && parseInt(len) < 1000000;
  
  const pass = exists === 'True' && dimOk && transOk && fmtOk && sizeOk;
  if (!pass) allPass = false;
  
  auditTable.push({
    id,
    file: expected.file,
    dimensions: `${w}x${h}`,
    expectedDim: `${expected.width}x${expected.height}`,
    format: fmt,
    fileSize: `${(parseInt(len)/1024).toFixed(1)} KB`,
    transparency: `${transPct}% (Corner Alpha=${cornerA})`,
    opaque: `${opaquePct}%`,
    status: pass ? 'PASS' : 'FAIL'
  });
}

console.table(auditTable);
console.log('Overall Batch 01 Audit Status:', allPass ? 'ALL 13 ASSETS PASS AUDIT 100%' : 'FAILURES DETECTED');

