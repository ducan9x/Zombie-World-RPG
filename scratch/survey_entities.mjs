import fs from 'fs';

function scan(filePath, label) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=================== ${label} (${filePath}) ===================`);
  
  const lines = content.split('\n');
  let currentKey = null;
  let currentId = null;
  let currentName = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const keyMatch = line.match(/^([a-zA-Z0-9_]+):\s*{/);
    if (keyMatch) {
      currentKey = keyMatch[1];
    }
    const idMatch = line.match(/id:\s*["']([^"']+)["']/);
    if (idMatch) currentId = idMatch[1];
    
    const nameMatch = line.match(/name:\s*["']([^"']+)["']/);
    if (nameMatch) currentName = nameMatch[1];
    
    if (currentName && (currentId || currentKey)) {
      console.log(`  Key: ${currentKey || currentId} | ID: ${currentId || currentKey} | Name: ${currentName}`);
      currentName = null;
      currentId = null;
    }
  }
}

scan('js/data/entities/npcs.js', 'NPCS & SURVIVOR NPCS');
scan('js/data/entities/zombies.js', 'ZOMBIES & BOSSES');
scan('js/data/weapons/melee.js', 'MELEE WEAPONS');
scan('js/data/weapons/ranged.js', 'RANGED WEAPONS');
scan('js/data/items/foods.js', 'FOODS');
scan('js/data/items/drinks.js', 'DRINKS');
scan('js/data/items/medicines.js', 'MEDICINES');
scan('js/data/items/crops.js', 'CROPS');
scan('js/data/items/fish.js', 'FISH');
scan('js/data/items/seafood-meals.js', 'SEAFOOD MEALS');
scan('js/data/items/cigarettes.js', 'CIGARETTES');
scan('js/data/items/building-materials.js', 'BUILDING MATERIALS');
scan('js/data/items/backpacks.js', 'BACKPACKS');
