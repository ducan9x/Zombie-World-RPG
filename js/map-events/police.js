import {
  getState,
  setStory,
  addItem,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  AMMO,
  GAME_CONSTANTS,
  SPECIAL_ITEMS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handlePoliceRaid() {
  const state = getState();
  if (state.lastPoliceRaidDay >= state.day) {
    setStory("Hôm nay đã lục soát phòng chứng vật rồi, mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_RATE) {
    state.health = Math.max(0, state.health - GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_DAMAGE);
    setStory(`Bạn cẩn thận lục soát phòng chứng vật, nhưng chẳng may kích hoạt bẫy còn sót lại của đồn cảnh sát! Một vụ nổ hất bạn văng ra đất, bạn bị thương, HP -${GAME_CONSTANTS.MAP_EVENTS.POLICE_TRAP_DAMAGE}.`);
  } else {
    const ammo = AMMO[Math.floor(Math.random() * AMMO.length)];
    const count = Math.floor(Math.random() * (GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MAX - GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MIN + 1)) + GAME_CONSTANTS.MAP_EVENTS.POLICE_AMMO_MIN;
    const added = addItem({ id: ammo.id, name: ammo.name, type: "ammo", count });
    if (added) {
      setStory(`Phía sau đống hồ sơ cũ bạn phát hiện một số đạn còn sót lại: ${ammo.name}×${count}. Chuyến mạo hiểm này không uổng phí.`);
    } else {
      setStory(`Bạn phát hiện một số đạn: ${ammo.name}×${count}, nhưng túi đã đầy, không thể mang.`);
    }
  }
  state.lastPoliceRaidDay = state.day;
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handlePoliceArchive() {
  const state = getState();
  if (state.lastPoliceArchiveDay >= state.day) {
    setStory("Hôm nay đã lục lọi tủ hồ sơ rồi, mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  state.lastPoliceArchiveDay = state.day;
  if (Math.random() < GAME_CONSTANTS.MAP_EVENTS.POLICE_ARCHIVE_CRIME_DATA_RATE) {
    const crimeDoc = SPECIAL_ITEMS.crime_data;
    const added = addItem({ ...crimeDoc });
    if (added) {
      state.crimeDataCount = (state.crimeDataCount || 0) + 1;
      const target = state.oldMaStep >= 1 ? 10 : "?";
      setStory(`Sâu trong tủ hồ sơ phủ đầy bụi bạn lục ra một tập hồ sơ ố vàng.\n\nĐây là một vụ án treo phủ bụi từ lâu — danh tính người chết không rõ, số vụ án đã bị bôi đen, trong hồ sơ điều tra nhiều lần xuất hiện một cái tên: "Lão Mã".\n\n[Thu được] [Tài liệu tội phạm] (${state.crimeDataCount}/${target})`);
    } else {
      setStory("Bạn lục được một túi hồ sơ ghi \"Tuyệt mật\", nhưng túi đã đầy, không thể mang.");
    }
  } else {
    const failMessages = [
      "Bạn lật từng tủ hồ sơ, trong đó ngoài thông báo tạm giữ mốc meo thì chẳng có gì.",
      "Tài liệu trong tủ hồ sơ đã bị chuột gặm đến méo mó, bốc mùi mốc.",
      "Bạn tìm thấy một cuốn nhật ký trực ban cũ nát trong tủ hồ sơ, nhưng lật hết cũng không có manh mối có giá trị.",
      "Khóa tủ hồ sơ đã gỉ chết, bạn mất nửa ngày mới cạy được, kết quả bên trong trống rỗng.",
    ];
    setStory(failMessages[Math.floor(Math.random() * failMessages.length)]);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}