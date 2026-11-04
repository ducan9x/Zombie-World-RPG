import {
  getState,
  setPhase,
  setStory,
  setOptions,
} from '../state.js';

import {
  SURVIVAL_NOTES,
  GAME_CONSTANTS,
} from '../config.js';

import { showHomeOptions } from '../routing.js';

function getNewforceProgress(state) {
  const conditions = [
    { label: "Cứu Rutile", done: !!state.nurseZombieRescued },
    { label: "Cứu Liu Ruyan", done: !!state.liuruyanRescued },
    { label: "Đánh bại tên cướp", done: !!state.outlawKilled },
    { label: "Đánh bại Hắc Ảnh", done: !!(state.stats && state.stats.bossesDefeated && state.stats.bossesDefeated.includes("Hắc Ảnh")) },
    { label: "Đánh bại Vua Zombie", done: !!state.zombieKingDefeated },
    { label: "Hoàn thành nhiệm vụ vật tư của Tiến sĩ Chen", done: !!state.doctorQuest3Done },
  ];
  const doneCount = conditions.filter(c => c.done).length;
  return { conditions, doneCount };
}

function buildLiuruyanStory(state) {
  let story = "📖 Cứu Liu Ruyan\n━━━━━━━━━━━━━━━━━\n\n";
  if (state.liuruyanRescued) {
    story += "✅ Liu Ruyan đã được cứu, cô ấy hiện là đồng minh trung thành của bạn.";
  } else if (state.day > GAME_CONSTANTS.LIURUYAN.RESCUE_DEADLINE_DAYS) {
    story += "❌ Hạn cứu đã hết, Liu Ruyan đã biến thành zombie……";
  } else {
    const remaining = GAME_CONSTANTS.LIURUYAN.RESCUE_DEADLINE_DAYS - state.day;
    story += `⚠ Tại trường đại học phát hiện một người phụ nữ bị nhiễm——Liu Ruyan.\n\n`;
    story += `Hạn cứu: Còn ${remaining} ngày\n`;
    story += `Vật tư cần: Thuốc kháng nhiễm×${GAME_CONSTANTS.LIURUYAN.SERUM_COST}\n\n`;
    story += `Nếu không được cứu trong thời hạn, cô ấy sẽ biến thành zombie.`;
  }
  return story;
}

export function buildSurvivalNotes() {
  const state = getState();
  const notes = SURVIVAL_NOTES;
  const story = "📖 Ghi Chép Sinh Tồn\n━━━━━━━━━━━━━━━━━\nChọn danh mục xem mẹo:\n\n";
  const opts = notes.map((cat, i) => ({
    text: cat.name,
    action: "note_category",
    catIndex: i
  }));
  const { doneCount } = getNewforceProgress(state);
  if (doneCount > 0) {
    opts.push({ text: `Sức Mới Mới(${doneCount}/6)`, action: "note_newforce" });
  }
  if (state.liuruyanDiscovered && !state.liuruyanRescued) {
    const remaining = GAME_CONSTANTS.LIURUYAN.RESCUE_DEADLINE_DAYS - state.day;
    if (remaining > 0) {
      opts.push({ text: `Cứu Liu Ruyan(còn ${remaining} ngày)`, action: "note_liuruyan" });
    } else {
      opts.push({ text: "Cứu Liu Ruyan(đã hết hạn)", action: "note_liuruyan" });
    }
  }
  opts.push({ text: "Quay lại", action: "note_back" });
  setPhase("survival_notes");
  setStory(story);
  setOptions(opts);
}

function buildNewforceStory(state) {
  const { conditions, doneCount } = getNewforceProgress(state);
  let story = "📖 Sức Mới Mới\n━━━━━━━━━━━━━━━━━\n\n";
  story += "Dịp truyền thuyết, khi tất cả sự kiện chốt lệnh được giải quyết, một sức lực mới sẽ thức dậy…\n\n";
  story += "Tiến độ:\n";
  conditions.forEach(c => {
    story += `${c.done ? "✅" : "⬜"} ${c.label}\n`;
  });
  story += `\nĐã hoàn thành ${doneCount}/6`;
  if (doneCount === 6) {
    story += "\n\nTất cả điều kiện đã thỏa mãn, sức lực mới sắp thức dậy…";
  }
  return story;
}

export function handleSurvivalNotesAction(input) {
  const state = getState();
  const optIdx = input - 1;
  if (optIdx < 0 || optIdx >= state.options.length) { showHomeOptions(); return; }
  const opt = state.options[optIdx];
  if (opt.action === "note_back") { showHomeOptions(); return; }
  if (opt.action === "note_liuruyan") {
    const story = buildLiuruyanStory(state);
    const opts = SURVIVAL_NOTES.map((c, i) => ({
      text: c.name,
      action: "note_category",
      catIndex: i
    }));
    const { doneCount } = getNewforceProgress(state);
    if (doneCount > 0) {
      opts.push({ text: "Sức Mới Mới", action: "note_newforce" });
    }
    opts.push({ text: "→ Cứu Liu Ruyan(hiện tại)", action: "note_liuruyan" });
    opts.push({ text: "Quay lại", action: "note_back" });
    setPhase("survival_notes");
    setStory(story);
    setOptions(opts);
    return;
  }
  if (opt.action === "note_newforce") {
    const story = buildNewforceStory(state);
    const opts = SURVIVAL_NOTES.map((c, i) => ({
      text: c.name,
      action: "note_category",
      catIndex: i
    }));
    opts.push({ text: "→ Lực lượng mới (hiện tại)", action: "note_newforce" });
    if (state.liuruyanDiscovered && !state.liuruyanRescued) {
      opts.push({ text: "Cứu Liu Ruyan", action: "note_liuruyan" });
    }
    opts.push({ text: "Quay lại", action: "note_back" });
    setPhase("survival_notes");
    setStory(story);
    setOptions(opts);
    return;
  }
  if (opt.action === "note_category") {
    const catIndex = opt.catIndex;
    const cat = SURVIVAL_NOTES[catIndex];
    if (!cat) { showHomeOptions(); return; }
    let story = `📖 ${cat.name}\n━━━━━━━━━━━━━━━━━\n\n`;    cat.entries.forEach((entry) => {
      story += `🔹 ${entry.title}\n${entry.content}\n\n`;
    });
    const opts = SURVIVAL_NOTES.map((c, i) => ({
      text: i === catIndex ? `→ ${c.name}(hiện tại)` : c.name,
      action: "note_category",
      catIndex: i
    }));
    const { doneCount } = getNewforceProgress(state);
    if (doneCount > 0) {
      opts.push({ text: "Sức Mới Mới", action: "note_newforce" });
    }
    if (state.liuruyanDiscovered && !state.liuruyanRescued) {
      opts.push({ text: "Cứu Liu Ruyan", action: "note_liuruyan" });
    }
    opts.push({ text: "Quay lại", action: "note_back" });
    setPhase("survival_notes");
    setStory(story);
    setOptions(opts);
  }
}

export function handleSurvivalNotesDetailAction(input) {
  showHomeOptions();
}
