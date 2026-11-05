import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('project-docs/assets/asset-manifest.json', 'utf8'));
const bgAssets = manifest.filter(a => a.category === 'backgrounds');
console.log('Total background assets:', bgAssets.length);
const pCount = { P0: 0, P1: 0, P2: 0, P3: 0 };
bgAssets.forEach((a, i) => {
  pCount[a.priority] = (pCount[a.priority] || 0) + 1;
  const exists = fs.existsSync(a.file);
  console.log(`${i+1}. [${a.priority}] ${a.id} -> ${a.file} | Status: ${a.status} | Exists: ${exists}`);
});
console.log('\nPriority breakdown:', pCount);

