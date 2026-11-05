import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve('project-docs/assets/asset-manifest.json');
const raw = fs.readFileSync(manifestPath, 'utf-8');

let data;
try {
  data = JSON.parse(raw);
  console.log('PASS: Valid JSON syntax.');
} catch (e) {
  console.error('FAIL: Invalid JSON syntax', e);
  process.exit(1);
}

const ids = new Set();
const files = new Set();
let duplicates = 0;
let emptyPrompts = 0;
let invalidCategory = 0;

const VALID_CATEGORIES = new Set([
  "backgrounds", "characters", "zombies", "bosses", "icons",
  "items", "weapons", "equipment", "combat_vfx", "events", "endings", "ui", "map_markers"
]);

const stats = {
  total: data.length,
  existing: 0,
  pending: 0,
  p0: 0,
  p1: 0,
  p2: 0,
  p3: 0,
  categories: {}
};

for (const item of data) {
  // Check ID
  if (ids.has(item.id)) {
    console.error(`FAIL: Duplicate ID: ${item.id}`);
    duplicates++;
  }
  ids.add(item.id);

  // Check File
  if (files.has(item.file)) {
    console.error(`FAIL: Duplicate File: ${item.file}`);
    duplicates++;
  }
  files.add(item.file);

  // Check Category
  if (!VALID_CATEGORIES.has(item.category)) {
    console.error(`FAIL: Invalid category ${item.category} in ${item.id}`);
    invalidCategory++;
  }

  // Check Prompt
  if (!item.prompt || item.prompt.trim().length < 20) {
    console.error(`FAIL: Prompt too short or missing in ${item.id}`);
    emptyPrompts++;
  }

  // Count stats
  if (item.status === 'existing') stats.existing++;
  if (item.status === 'pending') stats.pending++;

  if (item.priority === 'P0') stats.p0++;
  else if (item.priority === 'P1') stats.p1++;
  else if (item.priority === 'P2') stats.p2++;
  else if (item.priority === 'P3') stats.p3++;

  stats.categories[item.category] = (stats.categories[item.category] || 0) + 1;
}

console.log('--- STATS ---');
console.log(`Total: ${stats.total}`);
console.log(`Existing: ${stats.existing}`);
console.log(`Pending: ${stats.pending}`);
console.log(`P0: ${stats.p0}, P1: ${stats.p1}, P2: ${stats.p2}, P3: ${stats.p3}`);
console.log('Categories:', stats.categories);

if (duplicates === 0 && emptyPrompts === 0 && invalidCategory === 0) {
  console.log('ALL MANIFEST CHECKS PASSED 100%!');
} else {
  console.error(`ERRORS FOUND: duplicates=${duplicates}, emptyPrompts=${emptyPrompts}, invalidCategory=${invalidCategory}`);
  process.exit(1);
}

