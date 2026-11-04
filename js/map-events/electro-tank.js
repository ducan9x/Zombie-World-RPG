import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
  formatQualityText,
} from '../state.js';

import {
  FISH,
  SPECIAL_ITEMS,
  GAME_CONSTANTS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

/**
 * Trung tâm thương mại - bể cá điện chính
 */
export function handleElectroTank() {
  setPhase("explore");
  setStory(
    "Góc thương trường có một chiếc bể kính khổng lồ, thành bể phủ đầy rêu xanh và vết nứt.\n" +
    "Nước trong bể đục ngầu, ẩn hiện vài sợi dây điện trần đang lắc lư trong nước, phát ra tiếng xèo xèo.\n" +
    "Mặt nước nổi lờ đờ vài con cá nhỏ đã lật trắng bụng từ lâu——xem ra cá thường không thể sống trong nước có điện này.\n" +
    "Bạn chú ý thấy đáy bể có vài vảy lấp lánh ánh sáng vi mô, dường như chứa đựng một dạng năng lượng nào đó……"
  );
  showElectroOptions();
}

/**
 * Hiển thị các lựa chọn phụ của bể cá điện (không ghi đè story hiện tại)
 */
function showElectroOptions() {
  setOptions([
    { text: "Thả cá", action: "electro_throw_fish" },
    { text: "Chạm tay", action: "electro_touch" },
    { text: "Rời đi", action: "electro_leave" },
  ]);
}

/**
 * Thả cá - chọn loại cá muốn thả
 */
export function handleElectroThrowFish() {
  const state = getState();
  const fishInBag = state.food.filter(f => f.type === "fish");

  if (fishInBag.length === 0) {
    setStory("Bạn lục khắp balo, không có lấy một con cá. Có lẽ nên ra đảo câu vài con rồi quay lại.");
    setOptions([
      { text: "Chạm tay", action: "electro_touch" },
      { text: "Rời đi", action: "electro_leave" },
    ]);
    return;
  }

  setPhase("explore");
  setStory("Hãy chọn loại cá bạn muốn thả:");
  const opts = fishInBag.map((f, i) => ({
    text: `${f.name} ×${f.count || 1}`,
    action: "electro_fish_confirm",
    fishIndex: i,
    fishId: f.id,
  }));
  opts.push({ text: "Quay lại", action: "electro_tank" });
  setOptions(opts);
}

/**
 * Xác nhận thả một con cá
 */
export function handleElectroFishConfirm(input) {
  const state = getState();
  const optionIndex = input - 1;
  if (optionIndex < 0 || optionIndex >= state.options.length) return;

  const option = state.options[optionIndex];

  if (option.action === "electro_tank") {
    handleElectroTank();
    return;
  }

  const fishDef = FISH.find(f => f.id === option.fishId);
  if (!fishDef) {
    handleElectroTank();
    return;
  }

  // Tiêu thụ 1 con cá
  const fishInBag = state.food.filter(f => f.type === "fish" && f.id === option.fishId);
  if (fishInBag.length === 0) {
    setStory("Không tìm thấy cá đó trong balo, có lẽ đã bị tiêu thụ rồi.");
    handleElectroTank();
    return;
  }
  const fishItem = fishInBag[0];
  if ((fishItem.count || 1) > 1) {
    fishItem.count--;
  } else {
    const idx = state.food.indexOf(fishItem);
    if (idx !== -1) state.food.splice(idx, 1);
  }

  let storyMsg;
  const rarity = fishDef.rarity;

  if (rarity === "epic") {
    const scale = { ...SPECIAL_ITEMS.lightning_scale };
    addItem(scale);
    storyMsg =
      `Bạn thả [${formatQualityText(fishDef.name, rarity)}] nhẹ nhàng vào bể kính……\n\n` +
      `Ngay khi cá chạm nước, điện quang bắn tung tóe! Dòng điện xèo xèo quấn lấy thân cá, nhưng không điện chết nó.\n` +
      `${formatQualityText(fishDef.name, rarity)} rung lên dữ dội trong dòng điện, vảy bắt đầu khúc xạ ánh sáng xanh trắng chói lòa.\n` +
      `Một lát sau, cá chìm xuống đáy bể, một chiếc vảy lấp lánh tia điện từ từ nổi lên——\n\n` +
      `✨ Nhận được vật phẩm đặc biệt: ${formatQualityText(SPECIAL_ITEMS.lightning_scale.name, "epic")}!`;
  } else if (rarity === "legendary") {
    const scale = { ...SPECIAL_ITEMS.thunder_scale };
    addItem(scale);
    storyMsg =
      `Bạn thả [${formatQualityText(fishDef.name, rarity)}] vào bể kính……\n\n` +
      `Ầm——!\n` +
      `Toàn bộ nước trong bể sôi sùng sục trong nháy mắt! Dòng điện cuồng bạo như rồng rắn múa wild trong nước, thân ${formatQualityText(fishDef.name, rarity)} bị sấm sét bao bọc.\n` +
      `Nó không những không chết, mà còn biến đổi trong sấm sét——vảy bong ra, ngưng tụ thành một chiếc vảy ánh kim sẫm.\n` +
      `Khi mặt nước yên lại, chiếc vảy ấy lặng lẽ nổi trên mặt nước, ẩn ẩn vang lên tiếng sấm trầm——\n\n` +
      `⚡ Nhận được vật phẩm đặc biệt: ${formatQualityText(SPECIAL_ITEMS.thunder_scale.name, "legendary")}!`;
  } else {
    storyMsg =
      `Bạn thả [${formatQualityText(fishDef.name, rarity)}] vào bể kính……\n\n` +
      `Rắc! Dòng điện tức thì xuyên qua thân cá. ${formatQualityText(fishDef.name, rarity)} giật giật vài cái rồi lật trắng bụng.\n` +
      `Xem ra cần giống tốt hơn mới có thể sống sót trong nước có điện này.`;
  }

  setStory(storyMsg);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showElectroOptions();
  }
}

/**
 * Chạm tay vào bể kính
 */
export function handleElectroTouch() {
  const state = getState();

  if (Math.random() < 0.5) {
    state.health = Math.max(0, state.health - 50);
    setStory(
      "Bạn đưa tay chạm vào thành bể kính……\n\n" +
      "Xèo xèo——!!\n" +
      "Một luồng điện mạnh tức thì xuyên qua cánh tay bạn! Bạn bị hất văng ra xa vài mét, toàn thân tê liệt.\n" +
      "Trên cánh tay còn lại một vết cháy đen, đau buốt tận xương.\n\n" +
      `[Hệ thống] Bạn chịu sát thương điện giật ❤️ -50 (sức khỏe hiện tại: ${state.health}/${GAME_CONSTANTS.MAX_HEALTH})`
    );
  } else {
    setStory(
      "Bạn thận trọng dùng ngón tay chạm nhẹ thành bể kính——\n\n" +
      "Ngờ đâu chỉ hơi tê tê, chẳng có cảm giác đặc biệt nào.\n" +
      "Nước trong bể vẫn đục ngầu, dây điện vẫn xèo xèo.\n" +
      "Ánh sáng của những chiếc vảy ấy khiến bạn cảm thấy chúng không tầm thường, có lẽ nên hỏi người am hiểu.\n\n" +
      `[Hệ thống] Không chịu sát thương (sức khỏe hiện tại: ${state.health}/${GAME_CONSTANTS.MAX_HEALTH})`
    );
  }

  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showElectroOptions();
  }
}

/**
 * Rời khỏi bể kính
 */
export function handleElectroLeave() {
  setStory("Bạn quay người rời khỏi chiếc bể kính đang xèo xèo, điện quang dần tan biến phía sau.");
  showExploreOptionsState();
}