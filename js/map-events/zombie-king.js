import {
  getState,
  setPhase,
  setStory,
  setOptions,
} from '../state.js';

import {
  NAMED_NPCS,
  ZOMBIE_KING_INTRO,
} from '../config.js';

import {
  showExploreOptionsState,
} from '../routing.js';

export function handleZombieKingInteract() {
  const state = getState();
  if (state.zombieKingDefeated) {
    setStory("Xác của Vua Zombie đổ gục trên đất, hang ổ trở về sự tĩnh lặng tuyệt đối. Nơi này đã không còn gì đáng thử thách.");
    showExploreOptionsState();
    return;
  }
  const zk = NAMED_NPCS.zombie_king;
  state._pendingNpc = {
    name: zk.name,
    hp: zk.hp,
    damage: zk.damage,
    hasRanged: zk.hasRanged,
    dodgeRate: zk.dodgeRate,
  };
  setPhase("pre_combat_npc");
  setStory(ZOMBIE_KING_INTRO);
  setOptions([
    { text: "Chiến đấu cận chiến", action: "combat_npc_melee" },
    { text: "Bắn tầm xa", action: "combat_npc_ranged" },
    { text: "Chạy trốn", action: "combat_npc_flee" },
  ]);
}
