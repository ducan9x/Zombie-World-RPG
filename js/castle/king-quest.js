import { getState, setPhase, setStory, setOptions, advanceTime, updateStatusEffects, checkDeath } from '../state.js';
import { GAME_CONSTANTS, SPECIAL_ITEMS, KING_QUESTS } from '../config.js';
import { getCastleRank, hasNobleId, removeLowerCastleRanks } from '../faction.js';
import { refreshCastleInterior } from './interior.js';

export function handleCastleKingQuest() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank < 1) {
    setStory("Vua không nhẫn nén vẫy tay: \"Bạn thậm chí không phải quý tộc, còn muốn nhiệm vụ?Hãy đi làm thẻ thân phận trước rồi đến!\"");
    setPhase("castle_interior");
    setOptions([{ text: "Quay lại đại điện", action: "castle_back" }]);
    return;
  }
  if (rank < 2 && !hasNobleId(state)) {
    setStory("Vua không nhẫn nén vẫy tay: \"Bạn thậm chí không phải quý tộc, còn muốn nhiệm vụ?Hãy đi làm thẻ thân phận trước rồi đến!\"");
    setPhase("castle_interior");
    setOptions([{ text: "Quay lại đại điện", action: "castle_back" }]);
    return;
  }
  setPhase("castle_king_quest");
  const quests = KING_QUESTS;
  let availableQuest = null;
  for (const q of quests) {
    if (state.kingQuestsDone[q.id]) continue;
    if (q.prereqQuest && !state.kingQuestsDone[q.prereqQuest]) continue;
    availableQuest = q;
    break;
  }
  if (!availableQuest) {
    setStory("Vua gật đầu hài lòng: \"Bạn đã hoàn thành mọi nhiệm vụ của vua!Không phải là một tay đắc lực của vua sao!Hiện không còn nhiệm vụ mới.\"");
    setPhase("castle_interior");
    setOptions([{ text: "Quay lại đại điện", action: "castle_back" }]);
    return;
  }
  const q = availableQuest;
  let desc = `👑 [${q.name}]\n━━━━━━━━━━━━━━━━━\n📝 ${q.desc}\n\n💬 ${q.story}\n\n`;
  const check = checkKingQuestRequire(state, q);
  desc += `📊 Tiến độ: ${check.current}/${check.target}`;
  setStory(desc);
  const opts = [];
  if (check.met) {
    opts.push({ text: "✅ Nộp nhiệm vụ", action: "king_quest_submit" });
  }
  opts.push({ text: "Quay về sảnh chính", action: "king_quest_back" });
  setOptions(opts);
}

export function checkKingQuestRequire(state, quest) {
  const req = quest.require;
  if (!req) return { met: true, current: 0, target: 0 };
  if (req.assassinate) {
    const met = !state.leaderAlive;
    return { met, current: met ? 1 : 0, target: 1 };
  }
  if (req.medicine) {
    if (req.medicineId) {
      const have = state.medicine.filter(m => m.id === req.medicineId).reduce((sum, m) => sum + (m.count || 1), 0);
      return { met: have >= req.medicine, current: Math.min(have, req.medicine), target: req.medicine };
    }
    const have = state.medicine.reduce((sum, m) => sum + (m.count || 1), 0);
    return { met: have >= req.medicine, current: Math.min(have, req.medicine), target: req.medicine };
  }
  if (req.drinks) {
    if (req.drinkId) {
      const have = state.drinks.filter(d => d.id === req.drinkId).reduce((sum, d) => sum + (d.count || 1), 0);
      return { met: have >= req.drinks, current: Math.min(have, req.drinks), target: req.drinks };
    }
    const have = state.drinks.reduce((sum, d) => sum + (d.count || 1), 0);
    return { met: have >= req.drinks, current: Math.min(have, req.drinks), target: req.drinks };
  }
  if (req.food) {
    const have = state.food.reduce((sum, f) => sum + (f.count || 1), 0);
    return { met: have >= req.food, current: Math.min(have, req.food), target: req.food };
  }
  if (req.items) {
    let totalCurrent = 0;
    let totalTarget = 0;
    for (const itemReq of req.items) {
      if (itemReq.type === "cigarettes") {
        const have = state.cigarettes || 0;
        totalCurrent += Math.min(have, itemReq.count);
        totalTarget += itemReq.count;
        continue;
      }
      const have = state[itemReq.type].filter(i => i.id === itemReq.id).reduce((sum, i) => sum + (i.count || 1), 0);
      totalCurrent += Math.min(have, itemReq.count);
      totalTarget += itemReq.count;
    }
    return { met: totalCurrent >= totalTarget, current: totalCurrent, target: totalTarget };
  }
  return { met: true, current: 0, target: 0 };
}

export function handleKingQuestSubmit() {
  const state = getState();
  const rank = getCastleRank(state);
  if (rank < 1) {
    setStory("Vua không nhẫn nén: \"Bạn không có thẻ thân phận còn dám đến nộp nhiệm vụ?\"");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh chính", action: "king_quest_back" }]);
    return;
  }
  const quests = KING_QUESTS;
  let quest = null;
  for (const q of quests) {
    if (state.kingQuestsDone[q.id]) continue;
    if (q.prereqQuest && !state.kingQuestsDone[q.prereqQuest]) continue;
    quest = q;
    break;
  }
  if (!quest || !checkKingQuestRequire(state, quest).met) {
    setStory("Điều kiện nhiệm vụ chưa đạt được.");
    setPhase("castle_interior");
    setOptions([{ text: "Quay về sảnh chính", action: "king_quest_back" }]);
    return;
  }
  removeKingQuestItems(state, quest);
  state.kingQuestsDone[quest.id] = true;
  const reward = quest.reward;
  if (reward.rankItemId && reward.rank) {
    removeLowerCastleRanks(state, reward.rank);
    state.other.push({ ...SPECIAL_ITEMS[reward.rankItemId] });
    if (reward.rank > state.highestCastleRank) {
      state.highestCastleRank = reward.rank;
    }
  }
  setStory(quest.submitStory);
  advanceTime(1);
  updateStatusEffects();
  checkDeath();
  if (!state.gameOver) refreshCastleInterior();
}

export function removeKingQuestItems(state, quest) {
  const req = quest.require;
  if (!req) return;
  if (req.food) {
    let remaining = req.food;
    for (let i = state.food.length - 1; i >= 0 && remaining > 0; i--) {
      const available = state.food[i].count || 1;
      if (available <= remaining) {
        state.food.splice(i, 1);
        remaining -= available;
      } else {
        state.food[i].count = available - remaining;
        remaining = 0;
      }
    }
  }
  if (req.medicine) {
    if (req.medicineId) {
      let remaining = req.medicine;
      for (let i = state.medicine.length - 1; i >= 0 && remaining > 0; i--) {
        if (state.medicine[i].id === req.medicineId) {
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
    }
  }
  if (req.drinks) {
    if (req.drinkId) {
      let remaining = req.drinks;
      for (let i = state.drinks.length - 1; i >= 0 && remaining > 0; i--) {
        if (state.drinks[i].id === req.drinkId) {
          const available = state.drinks[i].count || 1;
          if (available <= remaining) {
            state.drinks.splice(i, 1);
            remaining -= available;
          } else {
            state.drinks[i].count = available - remaining;
            remaining = 0;
          }
        }
      }
    }
  }
  if (req.items) {
    for (const itemReq of req.items) {
      if (itemReq.type === "cigarettes") {
        state.cigarettes = Math.max(0, (state.cigarettes || 0) - itemReq.count);
        continue;
      }
      let removed = 0;
      for (let i = state[itemReq.type].length - 1; i >= 0 && removed < itemReq.count; i--) {
        if (state[itemReq.type][i].id === itemReq.id) {
          const item = state[itemReq.type][i];
          const available = item.count || 1;
          const need = itemReq.count - removed;
          if (available <= need) {
            state[itemReq.type].splice(i, 1);
            removed += available;
          } else {
            item.count = available - need;
            removed += need;
          }
        }
      }
    }
  }
}
