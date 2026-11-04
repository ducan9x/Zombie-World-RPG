/* ============================================================
   Hệ thống mã gian lận (dùng thử cho nhà phát triển)
   Hỗ trợ định dạng: /get_{tên vật phẩm}_{số lượng}
   Tên vật phẩm hỗ trợ:
   - Thực phẩm: food_xxx hoặc tên thực phẩm trực tiếp
   - Đồ uống: drink_xxx
   - Thuốc: medicine_xxx
   - Trái cây: fruit_xxx
   - Thuốc lá: cigarette_xxx
   - Xu Hoàng Gia: royalcoin_xxx (ví dụ royalcoin_10)
   - Xăng: gasoline_xxx (ví dụ gasoline_5)
   - Dân dược: ammo_xxx (ví dụ ammo_9mm, ammo_magnum)
   - Vũ khí cận chiến: melee_xxx (ví dụ chao_ap, dao_samurai)
   - Vũ khí tầm xa: ranged_xxx (ví dụ ranged_G17, ranged_AWM)
   - Balo: backpack_xxx (ví dụ balo_quan_doi, balo_du_lich_lon)
   - Hạt giống: seed_xxx (ví dụ seed_seed_luobo, seed_seed_gouqi)
   - Trồng trọt: crop_xxx (ví dụ crop_niupicai, crop_luobo)
   - Cá: fish_xxx (ví dụ fish_grey_mullet, fish_abyss_core_fish)
   - Bữa ăn hải sản: seafood_xxx (ví dụ seafood_bad_seafood_meal, seafood_top_seafood_meal)
   - Đồ uống quán bar: bar_xxx (ví dụ bar_rainbow_beer, bar_king_special)
   ============================================================ */

import { getState, addItem, addCigarettes, addRoyalCoins, addGasoline } from './state.js';
import { FOODS, DRINKS, MEDICINES, FRUITS, CIGARETTES, AMMO, MELEE_WEAPONS, RANGED_WEAPONS, LOOT_BACKPACKS, BUILDING_MATERIALS, GAME_CONSTANTS, SPECIAL_ITEMS, DEFAULT_ITEM_IDS, SEEDS, CROPS, CROP_FOOD_MAP, FISH, SEAFOOD_MEALS } from './config.js';
import { BAR_MENU } from './data/island/bar-menu.js';

const AMMO_ALIASES = {
  'arrow': 'mui_ten',
  '9mm': '9×19mm',
  'magnum': '.357 Magnum',
  '45acp': '.45 ACP',
  '50ae': '.50 AE',
  '57': '5.7×28mm',
  '556': '5.56×45mm NATO',
  '762': '7.62×39mm',
  '76251': '7.62×51mm',
  '76254': '7.62×54mmR',
  '792': '7.92×57mm',
  '300': '.300 Winchester Magnum',
  'shotgun': 'dan_12'
};

const BUILDING_ALIASES = {};
for (const m of BUILDING_MATERIALS) {
  BUILDING_ALIASES[m.id] = m.name;
}

const SPECIAL_ALIASES = {};
for (const [key, item] of Object.entries(SPECIAL_ITEMS)) {
  SPECIAL_ALIASES[key] = item.name;
}

function getFoodByName(name) {
  return FOODS.find(f => f.name === name);
}

function getDrinkByName(name) {
  return DRINKS.find(d => d.name === name);
}

function getMedicineByName(name) {
  return MEDICINES.find(m => m.id === name || m.name === name);
}

function getFruitByName(name) {
  return FRUITS.find(f => f.name === name);
}

function getCigaretteByName(name) {
  return name.includes("thuoc_la") ? { id: "thuoc_la", name: "Thuốc lá", type: "cigarette" } : undefined;
}

function getAmmoByName(name) {
  const ammoId = AMMO_ALIASES[name] || name;
  return AMMO.find(a => a.id === ammoId) || AMMO.find(a => a.name === name);
}

function getMeleeByName(name) {
  return MELEE_WEAPONS.find(w => w.name === name && w.id !== DEFAULT_ITEM_IDS.melee);
}

function getRangedByName(name) {
  return RANGED_WEAPONS.find(w => w.id === name);
}

function getBackpackByName(name) {
  return LOOT_BACKPACKS.find(b => b.name === name);
}

function getBuildingByName(name) {
  const buildingName = BUILDING_ALIASES[name] || name;
  return BUILDING_MATERIALS.find(b => b.name === buildingName);
}

function handleSpecialItem(name, count) {
  const item = SPECIAL_ITEMS[name];
  if (item) {
    let added = 0;
    for (let i = 0; i < count; i++) {
      if (addItem({ ...item })) added++;
    }
    return added;
  }
  return 0;
}

export function processCheatCommand(input) {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return null;
  }

  const parts = trimmed.slice(1).split('_');
  if (parts.length < 3 || parts[0] !== 'get') {
    return null;
  }

  const type = parts[1];
  const count = parseInt(parts[parts.length - 1]);
  if (isNaN(count) || count < 1 || count > 999) {
    return null;
  }

  const nameParts = parts.slice(2, parts.length - 1);
  const itemName = nameParts.join('_');

  const state = getState();
  let added = 0;
  let item = null;

  switch (type) {
    case 'food':
      item = getFoodByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'drink':
      item = getDrinkByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'medicine':
      item = getMedicineByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'fruit':
      item = getFruitByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'cigarette':
      item = getCigaretteByName(itemName);
      if (item) {
        addCigarettes(count);
        added = count;
        item = { name: "Thuốc lá" };
      }
      break;

    case 'royalcoin':
      addRoyalCoins(count);
      added = count;
      item = { name: "Xu Hoàng Gia" };
      break;

    case 'gasoline':
      addGasoline(count);
      added = count;
      item = { name: "Xăng" };
      break;

    case 'ammo':
      item = getAmmoByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ id: item.id, name: item.name, type: 'ammo', count: 1 })) added++;
        }
      }
      break;

    case 'melee':
      item = getMeleeByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item, currentDurability: item.durability })) added++;
        }
      }
      break;

    case 'ranged':
      item = getRangedByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'backpack':
      item = getBackpackByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'building':
      item = getBuildingByName(itemName);
      if (item) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...item })) added++;
        }
      }
      break;

    case 'seed':
      const seedItem = SEEDS.find(s => s.id === itemName || s.name === itemName || s.cropId === itemName);
      if (seedItem) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...seedItem })) added++;
        }
        item = seedItem;
      }
      break;

    case 'special':
      added = handleSpecialItem(itemName, count);
      break;

    case 'crop': {
      const foodItem = CROP_FOOD_MAP[itemName] || CROP_FOOD_MAP[CROPS.find(c => c.name === itemName)?.id];
      if (foodItem) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...foodItem })) added++;
        }
        item = foodItem;
      }
      break;
    }

    case 'fish': {
      const fishItem = FISH.find(f => f.id === itemName || f.name === itemName);
      if (fishItem) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...fishItem })) added++;
        }
        item = fishItem;
      }
      break;
    }

    case 'seafood': {
      const mealItem = SEAFOOD_MEALS.find(m => m.id === itemName || m.name === itemName);
      if (mealItem) {
        for (let i = 0; i < count; i++) {
          if (addItem({ ...mealItem })) added++;
        }
        item = mealItem;
      }
      break;
    }

    case 'bar': {
      const barItem = BAR_MENU.find(b => b.id === itemName || b.name === itemName);
      if (barItem) {
        for (let i = 0; i < count; i++) {
          if (addItem({ id: barItem.id, name: barItem.name, type: 'drink', effects: barItem.effects })) added++;
        }
        item = barItem;
      }
      break;
    }

    case 'health':
      state.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, state.health + count);
      return { success: true, message: `Sinh mệnh +${count}` };

    case 'full':
      state.health = GAME_CONSTANTS.MAX_HEALTH;
      state.hunger = 100;
      state.hydration = 100;
      state.infection = 0;
      state.crash = 0;
      state.sanity = GAME_CONSTANTS.SANITY_MAX;
      return { success: true, message: 'Đã khôi phục tất cả thuộc tính' };

    case 'day':
      state.day += count;
      return { success: true, message: `Ngày +${count}` };
  }

  if (item && added > 0) {
    return { success: true, message: `Đã thêm ${added} ${item.name}` };
  }

  return { success: false, message: null };
}
