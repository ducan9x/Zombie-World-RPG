import fs from 'fs';

const content = fs.readFileSync('js/combat.js', 'utf8');
const lines = content.split('\n');
console.log('Combat.js total lines:', lines.length);
let count = 0;
lines.forEach((l, idx) => {
  if (l.match(/render|canvas|pixi|sprite|image|img|<img|visual|graphic|anim/i)) {
    console.log(`${idx+1}: ${l.trim().slice(0, 100)}`);
    count++;
  }
});
console.log(`Total matching lines in combat.js: ${count}`);

const mainContent = fs.readFileSync('js/main.js', 'utf8');
const mainLines = mainContent.split('\n');
console.log('\n--- Main.js visual hooks ---');
mainLines.forEach((l, idx) => {
  if (l.match(/pixi|render|canvas|sprite/i)) {
    console.log(`${idx+1}: ${l.trim().slice(0, 100)}`);
  }
});

