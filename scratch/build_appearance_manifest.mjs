import fs from 'fs';
import path from 'path';

const PLAYER_DIR = path.resolve('public/assets/characters/player');
fs.mkdirSync(PLAYER_DIR, { recursive: true });

const AGES = [
  { id: 'teen', name: 'Thanh thiếu niên' },
  { id: 'young_adult', name: 'Thanh niên' },
  { id: 'adult', name: 'Trưởng thành' },
  { id: 'middle_aged', name: 'Trung niên' },
  { id: 'elderly', name: 'Cao tuổi' }
];

const GENDERS = [
  { id: 'male', name: 'Nam' },
  { id: 'female', name: 'Nữ' }
];

const OUTFITS = [
  { id: 'survivor', name: 'Trang phục sinh tồn cơ bản' },
  { id: 'tactical', name: 'Trang phục chiến thuật' },
  { id: 'casual', name: 'Trang phục thường ngày' }
];

const combinations = [];

for (const a of AGES) {
  for (const g of GENDERS) {
    for (const o of OUTFITS) {
      const id = `${a.id}_${g.id}_${o.id}`;
      const filename = `${id}.png`;
      const relPath = `public/assets/characters/player/${filename}`;
      const fullPath = path.join(PLAYER_DIR, filename);
      const exists = fs.existsSync(fullPath);

      combinations.push({
        id,
        age: a.id,
        ageName: a.name,
        gender: g.id,
        genderName: g.name,
        outfit: o.id,
        outfitName: o.name,
        filename,
        path: relPath,
        status: exists ? "EXISTING" : "PENDING"
      });
    }
  }
}

console.log(`Generated ${combinations.length} combinations.`);

// 1. Write project-docs/assets/player-appearance-manifest.json
const manifestData = {
  manifestId: "player-appearance-manifest",
  title: "Player Character Appearance Manifest",
  totalCombinations: combinations.length,
  attributes: {
    age: AGES,
    gender: GENDERS,
    outfit: OUTFITS
  },
  baseDirectory: "public/assets/characters/player/",
  combinations
};

const jsonFile = path.resolve('project-docs/assets/player-appearance-manifest.json');
fs.writeFileSync(jsonFile, JSON.stringify(manifestData, null, 2), 'utf8');
console.log(`Saved ${jsonFile}`);

// 2. Write js/data/player-appearance.js (ES Module for in-game use)
const jsContent = `/* ============================================================
   Player Appearance Manifest & Registry — Zombie World RPG
   Định nghĩa 30 tổ hợp ngoại hình nhân vật người chơi (Pre-generated).
   ============================================================ */

export const AGE_OPTIONS = ${JSON.stringify(AGES, null, 2)};

export const GENDER_OPTIONS = ${JSON.stringify(GENDERS, null, 2)};

export const OUTFIT_OPTIONS = ${JSON.stringify(OUTFITS, null, 2)};

export const DEFAULT_APPEARANCE = {
  age: 'young_adult',
  gender: 'male',
  outfit: 'survivor',
  id: 'young_adult_male_survivor',
  filename: 'young_adult_male_survivor.png',
  path: 'public/assets/characters/player/young_adult_male_survivor.png',
  status: 'PENDING'
};

export const PLAYER_APPEARANCE_MANIFEST = ${JSON.stringify(combinations, null, 2)};

/**
 * Tìm thông tin tổ hợp ngoại hình theo 3 thuộc tính
 * @param {string} age - teen | young_adult | adult | middle_aged | elderly
 * @param {string} gender - male | female
 * @param {string} outfit - survivor | tactical | casual
 * @returns {Object} Thông tin cấu hình ngoại hình
 */
export function getAppearanceConfig(age, gender, outfit) {
  const safeAge = age || DEFAULT_APPEARANCE.age;
  const safeGender = gender || DEFAULT_APPEARANCE.gender;
  const safeOutfit = outfit || DEFAULT_APPEARANCE.outfit;
  const id = \`\${safeAge}_\${safeGender}_\${safeOutfit}\`;
  
  const found = PLAYER_APPEARANCE_MANIFEST.find(item => item.id === id);
  return found || {
    ...DEFAULT_APPEARANCE,
    id,
    age: safeAge,
    gender: safeGender,
    outfit: safeOutfit,
    filename: \`\${id}.png\`,
    path: \`public/assets/characters/player/\${id}.png\`,
    status: 'PENDING'
  };
}

/**
 * Lấy nhãn hiển thị tiếng Việt của ngoại hình
 * @param {Object} appearance 
 * @returns {string} Chuỗi mô tả ngắn
 */
export function getAppearanceDisplayName(appearance) {
  if (!appearance) return 'Chưa chọn';
  const a = AGE_OPTIONS.find(x => x.id === appearance.age)?.name || appearance.age;
  const g = GENDER_OPTIONS.find(x => x.id === appearance.gender)?.name || appearance.gender;
  const o = OUTFIT_OPTIONS.find(x => x.id === appearance.outfit)?.name || appearance.outfit;
  return \`\${g}, \${a} (\${o})\`;
}
`;

const jsFile = path.resolve('js/data/player-appearance.js');
fs.writeFileSync(jsFile, jsContent, 'utf8');
console.log(`Saved ${jsFile}`);

