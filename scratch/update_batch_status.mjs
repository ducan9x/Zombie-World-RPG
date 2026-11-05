import fs from 'fs';
import path from 'path';

const batchFile = path.resolve('project-docs/assets/batches/batch-01-ui-icons.json');
const manifestFile = path.resolve('project-docs/assets/asset-manifest.json');

const batch = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));

const batchIds = new Set(batch.assets.map(a => a.id));

// Verify that all files exist on disk before updating status
for (const asset of batch.assets) {
  const p = path.resolve(asset.file);
  if (!fs.existsSync(p)) {
    throw new Error(`Cannot update status: file ${p} does not exist!`);
  }
}

// Update batch
for (const asset of batch.assets) {
  asset.status = "integrated";
}
fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2), 'utf-8');
console.log(`Updated ${batch.assets.length} assets to 'integrated' in ${batchFile}`);

// Update manifest
let updatedCount = 0;
for (const asset of manifest) {
  if (batchIds.has(asset.id)) {
    asset.status = "integrated";
    updatedCount++;
  }
}
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`Updated ${updatedCount} assets to 'integrated' in ${manifestFile}`);

