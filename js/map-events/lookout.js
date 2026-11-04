import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  GAME_CONSTANTS,
  SPECIAL_ITEMS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleClimbTower() {
  const state = getState();
  if (state.lastClimbDay >= state.day) {
    setStory("Hôm nay bạn đã lên đỉnh tháp rồi, mai quay lại nhé");
    showExploreOptionsState();
    return;
  }
  state.crash = Math.max(0, state.crash - GAME_CONSTANTS.MAP_EVENTS.TOWER_FATIGUE_REDUCTION);
  state.lastClimbDay = state.day;
  setStory("Sau khi lên đỉnh tháp, bạn phóng tầm mắt bao quát cả núi non, mức mệt mỏi đã giảm xuống.");
  advanceTime(2);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handleTombstone() {
  const state = getState();
  setPhase("explore_action");
  setStory("Bạn đi đến một góc cạnh tháp canh, ở đó có một tấm bia mộ loang lổ, trên đó bày vài vòng hoa đã héo úa. Chữ trên bia mộ đã bị mưa gió xói mòn đến mức không còn nhìn rõ, chỉ còn lờ mờ thấy một chữ \"Miao\". Trong không khí thoang thoảng một thứ khí tức chẳng thể diễn tả, đầy quái dị.");
  setOptions([
    { text: "Xem", action: "tombstone_look" },
    { text: "Rời đi", action: "tombstone_leave" },
  ]);
}

export function handleTombstoneLook() {
  setPhase("explore_action");
  const state = getState();
  const hasBadge = state.other.some(i => i.id === "farming_master_badge");
  if (!hasBadge) {
    setStory("Tấm bia mộ này quá quái dị, bạn không dám tiến đến xem. Hoa trên vòng hoa tuy đã héo, nhưng tỏa ra một thứ khí tức khiến người bất an. Bạn theo bản năng lùi lại mấy bước. (Cần huy chương nông nghiệp đại sư của Mieu Mieu)");
    setOptions([
      { text: "Rời đi", action: "tombstone_leave" },
    ]);
    return;
  }
  setStory("Hình như bạn bị ma ám, luôn cảm thấy những vòng hoa này ở đâu đó đã thấy qua, đất bên cạnh dường như có thứ gì đó bị chôn. Bạn khom người xuống, phát hiện đất cạnh bia mộ có dấu vết bị đào xới, hình như bên dưới chôn thứ gì đó……");
  setOptions([
    { text: "Đào", action: "tombstone_dig" },
    { text: "Rời đi", action: "tombstone_leave" },
  ]);
}

export function handleTombstoneDig() {
  const state = getState();
  if (state.tombstoneDug) {
    setStory("Chỗ này đã bị đào rồi, ngoài túi chống nước ra, trong đất không còn thứ gì khác.");
    showExploreOptionsState();
    return;
  }
  const isHoldingShovel = state.meleeWeapon && state.meleeWeapon.id === "xeng_sat";
  if (!isHoldingShovel) {
    setStory("Bạn cần trang bị một chiếc xẻng sắt, nếu không không đào nổi. Đất quá cứng, tay không căn bản không thể đào.");
    setOptions([
      { text: "Rời đi", action: "tombstone_leave" },
    ]);
    return;
  }
  state.tombstoneDug = true;
  const diary = SPECIAL_ITEMS.miaomiao_diary;
  addItem({ ...diary });
  advanceTime(2);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn dùng xẻng sắt cẩn thận đào đất cạnh bia mộ. Đào khoảng nửa mét sâu, đầu xẻng chạm vào một vật cứng——là một túi chống nước được bọc nhiều lớp bằng túi nhựa.\n\nBạn mở túi chống nước, bên trong là một cuốn nhật ký đã ngả vàng. Trên bìa dùng nét chữ non nớt viết "Nhật ký của Miao Miao".\n\nLật trang đầu tiên, tay bạn hơi run: \n\n"Ngày thứ 1. Bố mẹ nói họ rất đói, trong nhà không còn thứ gì để ăn." \n"Ngày thứ 15. Bố không cử động nữa. Mẹ cũng không cử động nữa. Con sợ lắm." \n"Ngày thứ 30. Con không thể khóc nữa, con phải sống tiếp. Chú hàng xóm dạy con trồng rau." \n"Ngày thứ 100. Con đã trồng được củ khoai tây đầu tiên! Bố, mẹ, hai người thấy không?" \n……\n\nTrang cuối cuốn nhật ký kẹp một bức vẽ tay——trên hình, một bé gái tết tóc đứng giữa một mảnh ruộng, bên trái là bố, bên phải là mẹ, ba người nắm tay nhau, trên đầu vẽ một vầng thái dương rất to. Dưới bức vẽ xiêu vẹo viết: \n\n"Gia đình chúng con, mãi mãi ở bên nhau." \n\n📖 Nhận được [Nhật ký của Miao Miao]\n\nThời gian tiến 2 lượt.`);
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}
