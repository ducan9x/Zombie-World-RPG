import {
  getState, setPhase, setStory, setOptions,
  removeRoyalCoins, addRoyalCoins, addItem, advanceTime, updateStatusEffects, checkDeath,
} from '../state.js';

import { SPECIAL_ITEMS, MELEE_WEAPONS, AMMO, FOODS, DRINKS, MEDICINES } from '../config.js';

import { hasCastleIdentity, getCastleRankName } from '../faction.js';

import { STREET_OPEN_PHASES, MELEE_SHOP_ITEMS, AMMO_SHOP_ITEMS, AMMO_RECYCLE_RATE, FOOD_SHOP_ITEMS, MEDICAL_SHOP_ITEMS } from '../data/island/street-shop.js';

import { refreshIslandMenu } from './index.js';

function hasAnyCastleRelatedIdentity(state) {
  if (hasCastleIdentity(state)) return true;
  if (state.other.some(i => i.id === SPECIAL_ITEMS.castle_pass.id)) return true;
  return false;
}

export function handleStreet() {
  const state = getState();
  if (!hasAnyCastleRelatedIdentity(state)) {
    setStory("Vệ binh phố thương mại chặn bạn lại: \"Nơi này chỉ dành cho các thế lực liên quan đến lâu đài, vui lòng xuất trình giấy thông hành lâu đài hoặc thẻ thân phận lâu đài.\"");
    refreshIslandMenu();
    return;
  }
  if (!STREET_OPEN_PHASES.includes(state.phaseIndex)) {
    setStory("Các cửa hàng ở khu phố thương mại đều đã đóng cửa, cửa sắt khóa chặt, chỉ có thể mai quay lại.");
    refreshIslandMenu();
    return;
  }
  setPhase("island_street");
  setStory("Phố thương mại do Nữ hoàng Elena khai mở trên đảo, các cửa hàng san sát dọc theo con đường lát đá. Thương nhân nhiệt tình mời gọi các quý tộc qua lại, kệ hàng chất đầy những món hàng hiếm thấy trên lục địa. Đây là khu vực phồn thịnh nhất của đảo, cũng là nơi đồng tiền hoàng gia lưu thông sôi động nhất.");
  setOptions([
    { text: "Cửa hàng vũ khí cận chiến", action: "street_melee" },
    { text: "Cửa hàng đạn dược", action: "street_ammo" },
    { text: "Cửa hàng thực phẩm", action: "street_food" },
    { text: "Cửa hàng y dược", action: "street_medical" },
    { text: "Rời đi", action: "street_leave" },
  ]);
}

export function handleStreetAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const action = state.options[optIdx].action;

  switch (action) {
    case "street_melee":
      handleStreetMelee();
      break;
    case "street_ammo":
      handleStreetAmmo();
      break;
    case "street_food":
      handleStreetFood();
      break;
    case "street_leave":
      refreshIslandMenu();
      break;
    case "street_melee_buy":
      handleStreetMeleeBuy(input);
      break;
    case "street_ammo_buy":
      handleStreetAmmoBuy(input);
      break;
    case "street_ammo_recycle":
      handleStreetAmmoRecycle();
      break;
    case "street_ammo_recycle_type":
      handleStreetAmmoRecycleType(input);
      break;
    case "street_food_buy":
      handleStreetFoodBuy(input);
      break;
    case "street_medical":
      handleStreetMedical();
      break;
    case "street_medical_buy":
      handleStreetMedicalBuy(input);
      break;
    case "street_medical_continue":
      handleStreetMedical();
      break;
    case "street_melee_continue":
      handleStreetMelee();
      break;
    case "street_ammo_continue":
      handleStreetAmmo();
      break;
    case "street_food_continue":
      handleStreetFood();
      break;
    case "street_back":
      handleStreet();
      break;
    default:
      handleStreet();
      break;
  }
}

function handleStreetMelee() {
  const state = getState();
  setPhase("island_street_melee");
  let desc = "Chủ cửa hàng vũ khí là một thợ rèn ít nói, trên tường treo đầy đủ loại vũ khí cận chiến. Ông liếc nhìn bạn: \"Nhìn trúng thanh nào?\"\n\n";
  desc += `Tiền hoàng gia hiện tại: ${state.royalCoins}\n\n`;
  MELEE_SHOP_ITEMS.forEach((item, i) => {
    const weapon = MELEE_WEAPONS.find(w => w.id === item.weaponId);
    if (weapon) {
      desc += `${weapon.name} - Sát thương:${weapon.damage} Độ bền:${weapon.durability} - ${item.price} xu\n`;
    }
  });
  setStory(desc);
  const opts = MELEE_SHOP_ITEMS.map((item, i) => {
    const weapon = MELEE_WEAPONS.find(w => w.id === item.weaponId);
    return { text: `${weapon.name} (${item.price} xu)`, action: "street_melee_buy", shopIndex: i };
  });
  opts.push({ text: "Quay lại", action: "street_back" });
  setOptions(opts);
}

function handleStreetMeleeBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "street_melee_buy") return;
  const shopIndex = option.shopIndex;
  const shopItem = MELEE_SHOP_ITEMS[shopIndex];
  if (!shopItem) { handleStreetMelee(); return; }
  const weapon = MELEE_WEAPONS.find(w => w.id === shopItem.weaponId);
  if (!weapon) { handleStreetMelee(); return; }
  if (state.royalCoins < shopItem.price) {
    setStory(`Tiền hoàng gia của bạn không đủ. Thanh ${weapon.name} này cần ${shopItem.price} xu, bạn chỉ có ${state.royalCoins} xu.`);
    handleStreetMelee();
    return;
  }
  removeRoyalCoins(shopItem.price);
  const weaponCopy = { ...weapon, currentDurability: weapon.durability };
  addItem(weaponCopy);
  setStory(`Thợ rèn lấy ${weapon.name} xuống từ tường đưa cho bạn: "Mắt nhìn tốt, thanh này sẽ không làm bạn thất vọng."\n\nChi ${shopItem.price} xu tiền hoàng gia, nhận ${weapon.name}\nTiền hoàng gia hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_street_melee");
    setOptions([{ text: "Tiếp tục", action: "street_melee_continue" }]);
  }
}

function handleStreetAmmo() {
  const state = getState();
  setPhase("island_street_ammo");
  let desc = "Chủ cửa hàng đạn dược là một cựu chiến binh xuất ngũ, trên kệ bày ngay ngắn đủ loại đạn các cỡ nòng. \"Cần gì? Toàn đồ tốt.\"\n\n";
  desc += `Tiền hoàng gia hiện tại: ${state.royalCoins}\n\n`;
  AMMO_SHOP_ITEMS.forEach((item, i) => {
    desc += `${item.ammoId} - ${item.count} viên - ${item.price} xu\n`;
  });
  setStory(desc);
  const opts = AMMO_SHOP_ITEMS.map((item, i) => {
    return { text: `${item.ammoId} (${item.price} xu/${item.count} viên)`, action: "street_ammo_buy", shopIndex: i };
  });
  opts.push({ text: "Thu hồi đạn", action: "street_ammo_recycle" });
  opts.push({ text: "Quay lại", action: "street_back" });
  setOptions(opts);
}

function handleStreetAmmoBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "street_ammo_buy") return;
  const shopIndex = option.shopIndex;
  const shopItem = AMMO_SHOP_ITEMS[shopIndex];
  if (!shopItem) { handleStreetAmmo(); return; }
  const ammoData = AMMO.find(a => a.name === shopItem.ammoId);
  if (!ammoData) { handleStreetAmmo(); return; }
  if (state.royalCoins < shopItem.price) {
    setStory(`Tiền hoàng gia không đủ. Lô đạn này cần ${shopItem.price} xu, bạn chỉ có ${state.royalCoins} xu.`);
    handleStreetAmmo();
    return;
  }
  removeRoyalCoins(shopItem.price);
  const existing = state.ammo.find(a => a.id === ammoData.id);
  if (existing) {
    existing.count += shopItem.count;
  } else {
    state.ammo.push({ id: ammoData.id, name: ammoData.name, count: shopItem.count });
  }
  setStory(`Cựu chiến binh lấy một hộp ${shopItem.ammoId} từ kệ đẩy đến trước mặt bạn: "Đủ cho bạn bắn một thời gian." \n\nChi ${shopItem.price} xu tiền hoàng gia, nhận ${shopItem.ammoId} ×${shopItem.count}\nTiền hoàng gia hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_street_ammo");
    setOptions([{ text: "Tiếp tục", action: "street_ammo_continue" }]);
  }
}

function handleStreetAmmoRecycle() {
  const state = getState();
  setPhase("island_street_ammo_recycle");
  let desc = "Cựu chiến binh liếc nhìn túi đạn của bạn: \"Đạn không dùng có thể thu hồi đổi xu, 10 viên đổi 1 xu.\"\n\n";
  const recyclable = state.ammo.filter(a => a.count >= AMMO_RECYCLE_RATE);
  if (recyclable.length === 0) {
    desc += "Bạn không có đủ số lượng đạn để thu hồi.";
    setStory(desc);
    setOptions([{ text: "Quay lại", action: "street_ammo" }]);
    return;
  }
  recyclable.forEach(a => {
    desc += `${a.name}: ${a.count} viên → ${Math.floor(a.count / AMMO_RECYCLE_RATE)} xu\n`;
  });
  setStory(desc);
  const opts = [];
  state.ammo.forEach((a, i) => {
    if (a.count >= AMMO_RECYCLE_RATE) {
      opts.push({
        text: `Thu hồi ${a.name} (${a.count} viên→${Math.floor(a.count / AMMO_RECYCLE_RATE)} xu)`,
        action: "street_ammo_recycle_type",
        ammoIndex: i,
      });
    }
  });
  opts.push({ text: "Quay lại", action: "street_ammo" });
  setOptions(opts);
}

function handleStreetAmmoRecycleType(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "street_ammo_recycle_type") return;
  const ammoIndex = option.ammoIndex;
  const ammoItem = state.ammo[ammoIndex];
  if (!ammoItem) { handleStreetAmmoRecycle(); return; }
  const groups = Math.floor(ammoItem.count / AMMO_RECYCLE_RATE);
  const coins = groups;
  const usedCount = groups * AMMO_RECYCLE_RATE;
  addRoyalCoins(coins);
  ammoItem.count -= usedCount;
  if (ammoItem.count <= 0) {
    state.ammo = state.ammo.filter((_, i) => i !== ammoIndex);
  }
  setStory(`Cựu chiến binh thu ${usedCount} viên ${ammoItem.name}, đếm xong đưa cho bạn ${coins} xu tiền hoàng gia: "Lần sau lại đến."\n\nThu hồi ${ammoItem.name} ×${usedCount}, nhận ${coins} xu tiền hoàng gia\nTiền hoàng gia hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_street_ammo");
    setOptions([{ text: "Tiếp tục", action: "street_ammo_continue" }]);
  }
}

function handleStreetFood() {
  const state = getState();
  setPhase("island_street_food");
  let desc = "Kệ hàng cửa hàng thực phẩm bày đầy đủ loại đồ hộp và đồ uống, nhân viên bán hàng mỉm cười: \"Toàn hàng tươi, đảm bảo chất lượng.\"\n\n";
  desc += `Tiền hoàng gia hiện tại: ${state.royalCoins}\n\n`;
  FOOD_SHOP_ITEMS.forEach((shopItem, i) => {
    const source = shopItem.type === "food" ? FOODS : DRINKS;
    const item = source.find(it => it.id === shopItem.itemId);
    if (item) {
      desc += `${item.name} - ${shopItem.price} xu\n`;
    }
  });
  setStory(desc);
  const opts = FOOD_SHOP_ITEMS.map((shopItem, i) => {
    const source = shopItem.type === "food" ? FOODS : DRINKS;
    const item = source.find(it => it.id === shopItem.itemId);
    return { text: `${item.name} (${shopItem.price} xu)`, action: "street_food_buy", shopIndex: i };
  });
  opts.push({ text: "Quay lại", action: "street_back" });
  setOptions(opts);
}

function handleStreetFoodBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "street_food_buy") return;
  const shopIndex = option.shopIndex;
  const shopItem = FOOD_SHOP_ITEMS[shopIndex];
  if (!shopItem) { handleStreetFood(); return; }
  const source = shopItem.type === "food" ? FOODS : DRINKS;
  const item = source.find(it => it.id === shopItem.itemId);
  if (!item) { handleStreetFood(); return; }
  if (state.royalCoins < shopItem.price) {
    setStory(`Tiền hoàng gia không đủ. ${item.name} cần ${shopItem.price} xu, bạn chỉ có ${state.royalCoins} xu.`);
    handleStreetFood();
    return;
  }
  removeRoyalCoins(shopItem.price);
  const itemCopy = { ...item };
  addItem(itemCopy);
  setStory(`Nhân viên bán hàng lấy ${item.name} từ kệ đưa cho bạn: "Hoan nghênh quý khách lần sau ghé lại!"\n\nChi ${shopItem.price} xu tiền hoàng gia, nhận ${item.name}\nTiền hoàng gia hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_street_food");
    setOptions([{ text: "Tiếp tục", action: "street_food_continue" }]);
  }
}

function handleStreetMedical() {
  const state = getState();
  setPhase("island_street_medical");
  let desc = "Trong cửa hàng y dược thoang thoảng mùi thuốc, trên kệ bày ngay ngắn đủ loại thuốc. Dược sĩ đẩy gọng kính: \"Cần loại thuốc nào? Toàn đồ tốt.\"\n\n";
  desc += `Tiền hoàng gia hiện tại: ${state.royalCoins}\n\n`;
  MEDICAL_SHOP_ITEMS.forEach((shopItem, i) => {
    const item = MEDICINES.find(m => m.id === shopItem.itemId);
    if (item) {
      desc += `${item.name} - ${shopItem.price} xu\n`;
    }
  });
  setStory(desc);
  const opts = MEDICAL_SHOP_ITEMS.map((shopItem, i) => {
    const item = MEDICINES.find(m => m.id === shopItem.itemId);
    return { text: `${item.name} (${shopItem.price} xu)`, action: "street_medical_buy", shopIndex: i };
  });
  opts.push({ text: "Quay lại", action: "street_back" });
  setOptions(opts);
}

function handleStreetMedicalBuy(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) return;
  const option = state.options[optIdx];
  if (option.action !== "street_medical_buy") return;
  const shopIndex = option.shopIndex;
  const shopItem = MEDICAL_SHOP_ITEMS[shopIndex];
  if (!shopItem) { handleStreetMedical(); return; }
  const item = MEDICINES.find(m => m.id === shopItem.itemId);
  if (!item) { handleStreetMedical(); return; }
  if (state.royalCoins < shopItem.price) {
    setStory(`Tiền hoàng gia không đủ. ${item.name} cần ${shopItem.price} xu, bạn chỉ có ${state.royalCoins} xu.`);
    handleStreetMedical();
    return;
  }
  removeRoyalCoins(shopItem.price);
  const itemCopy = { ...item };
  addItem(itemCopy);
  setStory(`Dược sĩ lấy từ tủ thuốc một phần ${item.name} đưa cho bạn: "Uống đúng giờ, giữ gìn sức khỏe."\n\nChi ${shopItem.price} xu tiền hoàng gia, nhận ${item.name}\nTiền hoàng gia hiện tại: ${state.royalCoins}`);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    setPhase("island_street_medical");
    setOptions([{ text: "Tiếp tục", action: "street_medical_continue" }]);
  }
}
