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
  LOOT_BACKPACKS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleStinkyTent() {
  const state = getState();
  setPhase("explore");
  const hasCaptain = state.other.some(i => i.id === "dawn_captain_badge");
  if (!hasCaptain) {
    setStory("Cái lều này có vẻ quá nguy hiểm, tốt nhất đừng vào. (Cần huy hiệu đội trưởng tiên phong Dawn) Cửa lều phủ rèm rách nát, thoang thoảng mùi thối rữa khiến người ta buồn nôn.");
    showExploreOptionsState();
    return;
  }
  setStory("Dẫn dắt thành viên Dawn chiến đấu bao lâu, sóng gió nào chưa từng thấy, vào xem thử thôi.\n\nBạn vén rèm lên, một luồng mùi thối xác chết nồng nặc ùa vào mặt.");
  setOptions([
    { text: "Vào", action: "stinky_tent_enter" },
    { text: "Rời đi", action: "stinky_tent_leave" },
  ]);
}

export function handleStinkyTentEnter() {
  setPhase("explore");
  setStory("Trong lều tối tăm ẩm ướt, góc phòng nằm một thi thể nữ bốc mùi thối. Quần áo tuy đã rách nát nhưng vẫn có thể nhận ra từng có vẻ chỉnh tề. Bên tay cô ấy vương vãi vài tài liệu và một chiếc bút ghi âm, dường như trước khi chết vẫn cố gắng ghi lại điều gì đó.\n\nKhông khí tràn ngập mùi thối khiến người ta nghẹt thở, ruồi bu quanh xác chết vo ve.");
  setOptions([
    { text: "Lục soát", action: "stinky_tent_search" },
    { text: "Rời đi", action: "stinky_tent_leave" },
  ]);
}

export function handleStinkyTentSearch() {
  const state = getState();
  if (state.tentSearched) {
    setStory("Bạn đã lục soát rồi, ngoài chiếc bút ghi âm kia ra không còn gì có giá trị. Mùi thối khiến bạn không muốn lưu lại dù một khắc.");
    showExploreOptionsState();
    return;
  }
  state.tentSearched = true;
  const recorder = SPECIAL_ITEMS.strange_recorder;
  addItem({ ...recorder });
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  setStory(`Bạn lục soát bên tay nữ thi tìm được một chiếc bút ghi âm, nhấn nút phát——\n\n🎙️ Nội dung ghi âm:\n\nGiọng nam quen thuộc: "Nể tình chúng ta là bạn cũ, tốt nhất ngươi tránh xa thủ lĩnh của trận địa đó đi. Trong ngày tận thế, trật tự thực sự chính là phải tích hợp tài nguyên nghiêm ngặt, mọi người mới sống sót được."\n\nGiọng nữ: "Tại sao?"\n\nGiọng nam quen thuộc: "Vì hắn quá ngu xuẩn! Chỉ có tích hợp tài nguyên mới thu được lợi ích lớn nhất, mới đối phó được thủy triều xác sống! Vì vậy ta cần có người bán mạng cho ta!"\n\nGiọng nữ: "Ngươi làm bất động sản thì biết cái gì?"\n\nGiọng nam quen thuộc: "Ta tận mắt chứng kiến thái độ lạnh lùng của hắn! Ta đã làm nhiều như vậy cho em gái của thủ lĩnh trận địa đó, rõ ràng hai ta tình đầu ý hợp. Nhưng hắn thì sao? Chia rẽ chúng ta, còn không cho ta tự mình ra ngoài làm riêng, nói gì mà lấy tập thể làm trung tâm."\n\nGiọng nữ: "Quả dưa vặn không ngọt, là ngươi quá ích kỷ. Ta phải về doanh địa rồi."\n\nGiọng nữ: "Báo cáo thủ lĩnh, qua trao đổi gián điệp, đã thu thập được những lời bất lợi của mục tiêu về em gái của ngài."\n\nBịch—— trong ghi âm vang lên tiếng súng lục.\n\nGiọng nam quen thuộc: "Đi chết đi trận địa của ngươi! Lão tử tự xưng là vua! Người của trận địa các ngươi không một ai được yên, kể cả ngươi đàn bà này cũng dám phản bội ta! Tin cái tên thủ lĩnh cắt đứt nhân duyên đó đi!"\n\nGhi âm đến đây kết thúc. Bạn nắm chặt bút ghi âm, lòng bàn tay toàn mồ hôi lạnh.\n\n📖 Nhận được [Bút ghi âm kỳ lạ]\n\nThời gian tiến thêm 1 lượt.`);
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handleLootCorpse() {
  const state = getState();
  if (state.lastLootCorpseDay > 0 && state.day - state.lastLootCorpseDay < GAME_CONSTANTS.MAP_EVENTS.CORPSE_COOLDOWN_DAYS) {
    const remaining = GAME_CONSTANTS.MAP_EVENTS.CORPSE_COOLDOWN_DAYS - (state.day - state.lastLootCorpseDay);
    setStory(`Đã lục soát gần hết rồi, ${remaining} ngày nữa hãy quay lại`);
    showExploreOptionsState();
    return;
  }
  const backpackIds = LOOT_BACKPACKS.filter(b => b.rarity === "common" || b.rarity === "uncommon" || b.rarity === "rare").map(b => b.id);
  const pickId = backpackIds[Math.floor(Math.random() * backpackIds.length)];
  const bp = LOOT_BACKPACKS.find(b => b.id === pickId);
  if (!bp) {
    setStory("Có vấn đề khi lục soát xác chết.");
    showExploreOptionsState();
    return;
  }
  state.lastLootCorpseDay = state.day;
  const added = addItem({ ...bp });
  if (added) {
    setStory(`Bạn lục soát từ xác chết được một ${bp.name} (sức chứa ${bp.capacity}), đã cho vào balo. Có thể qua "Trang bị → Đổi balo" để trang bị.`);
  } else {
    setStory(`Bạn lục soát từ xác chết được một ${bp.name} (sức chứa ${bp.capacity}), nhưng balo đã đầy, không thể mang theo.`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}