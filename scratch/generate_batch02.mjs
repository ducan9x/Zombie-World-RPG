import fs from 'fs';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('project-docs/assets/asset-manifest.json', 'utf8'));

// Filter background assets that are not already generated or integrated or existing
const pendingBgs = manifest.filter(a => a.category === 'backgrounds' && a.status === 'pending');

// Sort by priority P0 -> P1 -> P2
const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
pendingBgs.sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));

const batch02 = {
  batchId: "batch-02-backgrounds",
  title: "Batch 02: Backgrounds & Locations",
  description: "Bộ asset hình nền và bản đồ địa điểm sinh tồn mạt thế cho Zombie World RPG theo phong cách Dark Cinematic Post-apocalyptic RPG.",
  assetCount: pendingBgs.length,
  targetFormat: "WebP 1920x1080",
  styleGuide: "Dark Post-apocalyptic Survival RPG. Gritty desaturated palette (cold grays, moss green, rusty brown, scorched red), cinematic twilight/overcast lighting, volumetric fog, wide shot 16:9, clean composition with central 70% safe area for UI text, no human characters, no text, no watermark.",
  prioritySummary: {
    P0: pendingBgs.filter(a => a.priority === 'P0').length,
    P1: pendingBgs.filter(a => a.priority === 'P1').length,
    P2: pendingBgs.filter(a => a.priority === 'P2').length
  },
  assets: pendingBgs
};

const outFile = path.resolve('project-docs/assets/batches/batch-02-backgrounds.json');
fs.writeFileSync(outFile, JSON.stringify(batch02, null, 2), 'utf8');
console.log(`Created ${outFile} with ${pendingBgs.length} pending background assets.`);
console.log('Priority breakdown:', batch02.prioritySummary);

