import {
  getState,
  setPhase,
  setStory,
  setOptions,
  addItem,
  addPureEnergy,
  removePureEnergy,
  advanceTime,
  updateStatusEffects,
  checkDeath,
} from '../state.js';

import {
  DOCTOR_INTRO,
  DOCTOR_DIALOGUES,
  DOCTOR_QUEST1_STORY,
  DOCTOR_QUEST1_COMPLETE,
  DOCTOR_QUEST2_COMPLETE,
  DOCTOR_QUEST3_COMPLETE,
  DOCTOR_QUEST1_REJECT,
  ENERGY_WELL_STORY,
  DOCTOR_ENDING8_GONE,
  AMMO,
  RANGED_WEAPONS,
  MEDICINES,
  DEFAULT_ITEM_IDS,
  FIXED_LOOT_DROPS,
  GAME_CONSTANTS,
  NAMED_NPCS,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

import { hasCastleIdentity } from '../faction.js';

export function handleDoctorInteract() {
  const state = getState();
  if (state.doctorLeftInEnding8) {
    setStory(DOCTOR_ENDING8_GONE);
    setPhase("explore");
    const opts = [];
    if (state.lastImprovedSerumDay !== state.day) {
      opts.push({ text: "Nhận sản lượng", action: "doctor_harvest_serum" });
    } else {
      opts.push({ text: "Nhận sản lượng (Hôm nay đã nhận)", action: "doctor_harvest_serum", disabled: true });
    }
    // Chuỗi nhiệm vụ Lão Mã: xử lý bác sĩ
    if (state.oldMaStep >= 6 && !state.doctorKilled) {
      opts.push({ text: "🔪 Xử lý bác sĩ", action: "kill_doctor" });
    }
    opts.push({ text: "Rời đi", action: "doctor_leave" });
    setOptions(opts);
    return;
  }
  if (state.doctorTradeDone) {
    setPhase("explore");
    setStory("Tiến sĩ Trần đang bận rộn sắp xếp dữ liệu thí nghiệm. Thấy bạn đi tới, anh đẩy gọng kính gật đầu.");
    const opts = [];
    opts.push({ text: "Đối thoại", action: "doctor_chat" });
    if (state.giantPuppetDefeated && !state.doctorQuest1Accepted && !state.doctorQuest1Done) {
      opts.push({ text: "Tư vấn sửa chữa tên lửa", action: "doctor_rocket_consult" });
    } else if (!state.giantPuppetDefeated && !state.doctorQuest1Accepted && !state.doctorQuest1Done) {
      opts.push({ text: "Tư vấn sửa chữa tên lửa (Cần đánh bại cỗ rối khổng lồ ở căn cứ hàng không vũ trụ trước)", action: "doctor_rocket_consult", disabled: true });
    }
    if (state.doctorQuest1Accepted && !state.doctorQuest1Done) {
      const hasGenerator = state.other.some(i => i.id === "small_nuclear_generator");
      if (hasGenerator) {
        opts.push({ text: "Nộp máy phát điện hạt nhân nhỏ", action: "doctor_quest1_submit" });
      } else {
        opts.push({ text: "Máy phát điện hạt nhân nhỏ (Chưa có)", action: "doctor_quest1_submit", disabled: true });
      }
    }
    if (state.doctorQuest1Done && !state.doctorQuest2Done) {
      if (state.pureEnergy >= GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST) {
        opts.push({ text: `Nộp ${GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST} năng lượng tinh khiết`, action: "doctor_quest2_submit" });
      } else {
        opts.push({ text: `Nộp ${GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST} năng lượng tinh khiết (Bạn có ${state.pureEnergy})`, action: "doctor_quest2_submit", disabled: true });
      }
    }
    if (state.doctorQuest2Done && !state.doctorQuest3Done) {
      const medCount = state.medicine.reduce((sum, m) => sum + (m.count || 1), 0);
      const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
      const drinkCount = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);
      const canSubmit = medCount >= GAME_CONSTANTS.ROCKET.QUEST3_MEDICINE_COST && foodCount >= GAME_CONSTANTS.ROCKET.QUEST3_FOOD_COST && drinkCount >= GAME_CONSTANTS.ROCKET.QUEST3_DRINKS_COST;
      if (canSubmit) {
        opts.push({ text: "Nộp dự trữ vật tư", action: "doctor_quest3_submit" });
      } else {
        opts.push({ text: `Dự trữ vật tư (Y tế${medCount}/${GAME_CONSTANTS.ROCKET.QUEST3_MEDICINE_COST} Thực phẩm${foodCount}/${GAME_CONSTANTS.ROCKET.QUEST3_FOOD_COST} Đồ uống${drinkCount}/${GAME_CONSTANTS.ROCKET.QUEST3_DRINKS_COST})`, action: "doctor_quest3_submit", disabled: true });
      }
    }
    if (state.doctorQuest3Done) {
      opts.push({ text: "Về tên lửa…", action: "doctor_rocket_status" });
    }
    // Chuỗi nhiệm vụ Lão Mã: xử lý bác sĩ
    if (state.oldMaStep >= 6 && !state.doctorKilled) {
      opts.push({ text: "🔪 Xử lý bác sĩ", action: "kill_doctor" });
    }
    opts.push({ text: "Rời đi", action: "doctor_leave" });
    setOptions(opts);
    return;
  }
  setPhase("explore");
  setStory(DOCTOR_INTRO);
  const serumCount = state.medicine.filter(m => m.id === DEFAULT_ITEM_IDS.serum).reduce((sum, m) => sum + (m.count || 1), 0);
  const opts = [];
  if (serumCount >= GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST) {
    opts.push({ text: `Nộp ${GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST} ống ${MEDICINES.find(m => m.id === DEFAULT_ITEM_IDS.serum).name}`, action: "doctor_trade" });
  } else {
    opts.push({ text: `Nộp ${GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST} ống ${MEDICINES.find(m => m.id === DEFAULT_ITEM_IDS.serum).name} (Bạn chỉ có ${serumCount} ống)`, action: "doctor_trade", disabled: true });
  }
  opts.push({ text: "Đối thoại", action: "doctor_chat" });
  opts.push({ text: "Tư vấn sửa chữa tên lửa (Cần hoàn thành giao dịch huyết thanh với Tiến sĩ Trần trước)", action: "doctor_rocket_consult", disabled: true });
  // Chuỗi nhiệm vụ Lão Mã: xử lý bác sĩ
  if (state.oldMaStep >= 6 && !state.doctorKilled) {
    opts.push({ text: "🔪 Xử lý bác sĩ", action: "kill_doctor" });
  }
  opts.push({ text: "Rời đi", action: "doctor_leave" });
  setOptions(opts);
}

export function handleDoctorTrade() {
  const state = getState();
  const serumCount = state.medicine.filter(m => m.id === DEFAULT_ITEM_IDS.serum).reduce((sum, m) => sum + (m.count || 1), 0);
  if (serumCount < GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST) {
    handleDoctorInteract();
    return;
  }
  let remaining = GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST;
  for (let i = state.medicine.length - 1; i >= 0 && remaining > 0; i--) {
    if (state.medicine[i].id === DEFAULT_ITEM_IDS.serum) {
      const available = state.medicine[i].count || 1;
      if (available <= remaining) {
        state.medicine.splice(i, 1);
        remaining -= available;
      } else {
        state.medicine[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  const doctorDrop = FIXED_LOOT_DROPS.doctor_trade;
  const doctorWeapon = RANGED_WEAPONS.find(w => w.id === doctorDrop.weaponId);
  const addedGun = addItem({ ...doctorWeapon });
  const doctorAmmo = AMMO.find(a => a.id === doctorDrop.ammoId);
  const addedAmmo = addItem({ id: doctorAmmo.id, name: doctorAmmo.name, type: "ammo", count: doctorDrop.ammoCount });
  state.doctorTradeDone = true;
  if (addedGun && addedAmmo) {
    setStory(`Tiến sĩ nhận ${GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST} ống huyết thanh, hai tay run nhẹ. "Cảm ơn nhiều……đủ để tôi hoàn thành nghiên cứu rồi!" Anh đưa cho bạn một khẩu ${doctorWeapon.name} và ${doctorDrop.ammoCount} viên ${doctorAmmo.name} đạn. "Đây là đồ dùng riêng cuối cùng của tôi, hy vọng có thể giúp được bạn."`);
  } else {
    setStory(`Tiến sĩ nhận ${GAME_CONSTANTS.DOCTOR.SERUM_TRADE_COST} ống huyết thanh, đưa cho bạn ${doctorWeapon.name} và đạn. Nhưng balo bạn không đủ chỗ, một phần vật phẩm không thể mang theo!`);
  }
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) {
    showExploreOptionsState();
  }
}

export function handleDoctorChat() {
  const state = getState();
  setPhase("explore");
  const line = DOCTOR_DIALOGUES[Math.floor(Math.random() * DOCTOR_DIALOGUES.length)];
  setStory(line);
  if (state.doctorLeftInEnding8) {
    const opts = [];
    if (state.lastImprovedSerumDay !== state.day) {
      opts.push({ text: "Nhận sản lượng", action: "doctor_harvest_serum" });
    } else {
      opts.push({ text: "Nhận sản lượng (Hôm nay đã nhận)", action: "doctor_harvest_serum", disabled: true });
    }
    opts.push({ text: "Rời đi", action: "doctor_leave" });
    setOptions(opts);
    return;
  }
  const opts = [];
  opts.push({ text: "Đối thoại", action: "doctor_chat" });
  if (state.doctorTradeDone && state.giantPuppetDefeated && !state.doctorQuest1Accepted && !state.doctorQuest1Done) {
    opts.push({ text: "Tư vấn sửa chữa tên lửa", action: "doctor_rocket_consult" });
  }
  if (state.doctorTradeDone && state.doctorQuest1Accepted && !state.doctorQuest1Done) {
    const hasGenerator = state.other.some(i => i.id === "small_nuclear_generator");
    if (hasGenerator) {
      opts.push({ text: "Nộp máy phát điện hạt nhân nhỏ", action: "doctor_quest1_submit" });
    } else {
      opts.push({ text: "Máy phát điện hạt nhân nhỏ (Chưa có)", action: "doctor_quest1_submit", disabled: true });
    }
  }
  if (state.doctorTradeDone && state.doctorQuest1Done && !state.doctorQuest2Done) {
    if (state.pureEnergy >= GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST) {
      opts.push({ text: `Nộp ${GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST} năng lượng tinh khiết`, action: "doctor_quest2_submit" });
    } else {
      opts.push({ text: `Nộp ${GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST} năng lượng tinh khiết (Bạn có ${state.pureEnergy})`, action: "doctor_quest2_submit", disabled: true });
    }
  }
  if (state.doctorTradeDone && state.doctorQuest2Done && !state.doctorQuest3Done) {
    const medCount = state.medicine.reduce((sum, m) => sum + (m.count || 1), 0);
    const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
    const drinkCount = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);
    const canSubmit = medCount >= GAME_CONSTANTS.ROCKET.QUEST3_MEDICINE_COST && foodCount >= GAME_CONSTANTS.ROCKET.QUEST3_FOOD_COST && drinkCount >= GAME_CONSTANTS.ROCKET.QUEST3_DRINKS_COST;
    if (canSubmit) {
      opts.push({ text: "Nộp dự trữ vật tư", action: "doctor_quest3_submit" });
    } else {
      opts.push({ text: `Dự trữ vật tư (Y tế${medCount}/${GAME_CONSTANTS.ROCKET.QUEST3_MEDICINE_COST} Thực phẩm${foodCount}/${GAME_CONSTANTS.ROCKET.QUEST3_FOOD_COST} Đồ uống${drinkCount}/${GAME_CONSTANTS.ROCKET.QUEST3_DRINKS_COST})`, action: "doctor_quest3_submit", disabled: true });
    }
  }
  if (state.doctorTradeDone && state.doctorQuest3Done) {
    opts.push({ text: "Về tên lửa…", action: "doctor_rocket_status" });
  }
  // Chuỗi nhiệm vụ Lão Mã: xử lý bác sĩ
  if (state.oldMaStep >= 6 && !state.doctorKilled) {
    opts.push({ text: "🔪 Xử lý bác sĩ", action: "kill_doctor" });
  }
  opts.push({ text: "Rời đi", action: "doctor_leave" });
  setOptions(opts);
}

export function handleDoctorLeave() {
  setStory("Bạn chào tạm biệt bác sĩ, rời khỏi viện nghiên cứu.");
  showExploreOptionsState();
}

export function handleDoctorRocketConsult() {
  setPhase("explore");
  setStory(DOCTOR_QUEST1_STORY);
  setOptions([
    { text: "Nhận nhiệm vụ", action: "doctor_quest1_accept" },
    { text: "Từ chối", action: "doctor_quest1_reject" },
  ]);
}

export function handleDoctorQuest1Accept() {
  const state = getState();
  state.doctorQuest1Accepted = true;
  setStory("Bạn gật đầu. Tiến sĩ Trần lộ ra nụ cười hiếm hoi: \"Tuyệt quá! Đi tìm quốc vương ở thành đi, chúc may mắn. Nhớ nhé, bạn cần máy phát điện hạt nhân nhỏ.\"");
  showExploreOptionsState();
}

export function handleDoctorQuest1Reject() {
  setStory(DOCTOR_QUEST1_REJECT);
  showExploreOptionsState();
}

export function handleDoctorQuest1Submit() {
  const state = getState();
  const genIdx = state.other.findIndex(i => i.id === "small_nuclear_generator");
  if (genIdx === -1) {
    handleDoctorInteract();
    return;
  }
  state.other.splice(genIdx, 1);
  state.doctorQuest1Done = true;
  setStory(DOCTOR_QUEST1_COMPLETE);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export function handleDoctorQuest2Submit() {
  const state = getState();
  const cost = GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST;
  if (state.pureEnergy < cost) {
    setStory("Năng lượng tinh khiết không đủ.");
    handleDoctorInteract();
    return;
  }
  removePureEnergy(cost);
  state.doctorQuest2Done = true;
  setStory(DOCTOR_QUEST2_COMPLETE);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export function handleDoctorQuest3Submit() {
  const state = getState();
  const medCost = GAME_CONSTANTS.ROCKET.QUEST3_MEDICINE_COST;
  const foodCost = GAME_CONSTANTS.ROCKET.QUEST3_FOOD_COST;
  const drinkCost = GAME_CONSTANTS.ROCKET.QUEST3_DRINKS_COST;
  const medCount = state.medicine.reduce((sum, m) => sum + (m.count || 1), 0);
  const foodCount = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
  const drinkCount = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);
  if (medCount < medCost || foodCount < foodCost || drinkCount < drinkCost) {
    handleDoctorInteract();
    return;
  }
  function removeStackableCount(arr, count) {
    let remaining = count;
    for (let i = arr.length - 1; i >= 0 && remaining > 0; i--) {
      const available = arr[i].count || 1;
      if (available <= remaining) {
        arr.splice(i, 1);
        remaining -= available;
      } else {
        arr[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  removeStackableCount(state.medicine, medCost);
  removeStackableCount(state.food, foodCost);
  removeStackableCount(state.drinks, drinkCost);
  state.doctorQuest3Done = true;
  setStory(DOCTOR_QUEST3_COMPLETE);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

export function handleDoctorRocketStatus() {
  setStory("Tiến sĩ Trần đẩy gọng kính: \"Tên lửa đã sẵn sàng, mọi hệ thống hoạt động bình thường. Hãy đến trung tâm phóng ở căn cứ hàng không vũ trụ, ở đó bạn sẽ đưa ra lựa chọn cuối cùng.\"");
  showExploreOptionsState();
}

export function handleDoctorHarvestSerum() {
  const state = getState();
  if (state.lastImprovedSerumDay === state.day) {
    setStory("Hôm nay đã nhận kháng thể cải tiến rồi, mai hãy quay lại.");
    handleDoctorInteract();
    return;
  }
  state.lastImprovedSerumDay = state.day;
  const improvedSerum = MEDICINES.find(m => m.id === "improved_serum");
  if (improvedSerum) {
    const added = addItem({ ...improvedSerum });
    if (added) {
      setStory("Bạn lấy ra một ống kháng thể cải tiến từ thiết bị chế tạo mà bác sĩ để lại. Chất lỏng màu xanh nhạt hơi phát sáng trong ống.");
    } else {
      setStory("Thiết bị chế tạo cho ra một ống kháng thể cải tiến, nhưng balo bạn đã đầy, không thể mang theo!");
    }
  }
  handleDoctorInteract();
}

export function handleEnergyWell() {
  const state = getState();
  if (!state.doctorQuest1Done) {
    setStory("Sâu trong viện nghiên cứu dường như có thiết bị gì đó, nhưng hiện chưa thể sử dụng. Có lẽ cần sự giúp đỡ của Tiến sĩ Trần mới khởi động được.");
    showExploreOptionsState();
    return;
  }
  if (state.lastEnergyWellDay === state.day) {
    setStory(ENERGY_WELL_STORY + "\n\nGiếng khai thác hôm nay đã lấy rồi, mai hãy quay lại.");
    showExploreOptionsState();
    return;
  }
  state.lastEnergyWellDay = state.day;
  const progressHint = `\n\nSố lượng năng lượng tinh khiết hiện tại: ${state.pureEnergy + 1}/${GAME_CONSTANTS.ROCKET.QUEST2_ENERGY_COST}`;
  addPureEnergy(1);
  setStory(ENERGY_WELL_STORY + "\n\nBạn trích xuất được một phần năng lượng tinh khiết từ giếng khai thác. Chất lỏng năng lượng màu xanh nhạt hơi phát sáng trong bình chứa." + progressHint);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) showExploreOptionsState();
}

// ========== Chuỗi nhiệm vụ Lão Mã: xử lý bác sĩ ==========

export function handleKillDoctor() {
  const state = getState();
  if (state.doctorKilled) {
    setStory("Tiến sĩ Trần không còn ở đây nữa, trong phòng thí nghiệm chỉ còn tiếng vo vo của thiết bị.");
    showExploreOptionsState();
    return;
  }
  if (state.oldMaStep < 6) {
    handleDoctorInteract();
    return;
  }
  const doctor = NAMED_NPCS.doctor_boss;
  state._pendingNpc = {
    name: doctor.name,
    hp: doctor.hp,
    damage: Math.floor(Math.random() * (doctor.damageMax - doctor.damageMin + 1)) + doctor.damageMin,
    hasRanged: doctor.hasRanged,
    dodgeRate: doctor.dodgeRate,
  };
  state._pendingNpcCallback = "kill_doctor_result";
  setPhase("pre_combat_npc");
  const meleeName = state.meleeWeapon.name;
  const rangedName = state.rangedWeapon ? state.rangedWeapon.name : "Không";
  const crashWarning = state.crash >= GAME_CONSTANTS.FATIGUE_MAX ? "\n\n⚠ Cơ thể bạn cực kỳ mệt mỏi, không thể chiến đấu bình thường!" : "";
  setStory(`Bạn lạnh lùng nhìn Tiến sĩ Trần. Anh vẫn bận rộn trước kính hiển vi, hoàn toàn không nhận ra nguy hiểm đang đến gần.\n\n"Lão Mã bảo tôi gửi lời." Bạn chậm rãi giơ vũ khí lên.\n\nTiến sĩ Trần cuối cùng cũng ngẩng đầu, đẩy gọng kính, trong mắt đầu tiên là bối rối, rồi biến thành sợ hãi: "Ngươi……ngươi là người hắn phái tới?! Tôi biết mà……hắn sớm muộn cũng tìm đến tôi……"\n\n⚔️ ${doctor.name}\n❤️ HP:${doctor.hp} | ⚡ Sát thương:${doctor.damageMin}-${doctor.damageMax}\n\n【Cận chiến】${meleeName}\n【Tầm xa】${rangedName}${crashWarning}`);
  const opts = [
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" }
  ];
  if (state.rangedWeapon && state.ammo.some(a => a.id === state.rangedWeapon.ammoType && a.count > 0)) {
    opts.push({ text: "Chiến đấu tầm xa", action: "combat_npc_ranged" });
  } else {
    opts.push({ text: "Chiến đấu tầm xa (Không khả dụng: Hết đạn)", action: "combat_npc_ranged", disabled: true });
  }
  opts.push({ text: GAME_CONSTANTS.COMBAT.FLEE_RATE_TEXT, action: "combat_npc_flee" });
  setOptions(opts);
}