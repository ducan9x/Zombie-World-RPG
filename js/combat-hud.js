/* ============================================================
   Combat Visual HUD & Sprite Mapping — Zombie World RPG (Phase 2)
   Tích hợp kho sprite Batch 04 và chuẩn hóa giao diện chiến đấu
   ============================================================ */

/**
 * Bản đồ liên kết Enemy ID với Sprite Batch 04
 */
export const ENEMY_SPRITE_MAP = {
  // 16 Zombie thường và đột biến (Batch 04)
  zombie_lang_dao: 'public/assets/zombies/zombie_lang_dao.png',
  zombie_thay_rach: 'public/assets/zombies/zombie_thay_rach.png',
  zombie_bo: 'public/assets/zombies/zombie_bo.png',
  zombie_nhanh: 'public/assets/zombies/zombie_nhanh.png',
  zombie_beo: 'public/assets/zombies/zombie_beo.png',
  zombie_no: 'public/assets/zombies/zombie_no.png',
  zombie_quan_canh: 'public/assets/zombies/zombie_quan_canh.png',
  zombie_me_nhom: 'public/assets/zombies/zombie_me_nhom.png',
  zombie_giap_sat: 'public/assets/zombies/zombie_giap_sat.png',
  zombie_bang_gia: 'public/assets/zombies/zombie_bang_gia.png',
  zombie_dien_cuong: 'public/assets/zombies/zombie_dien_cuong.png',
  zombie_axit: 'public/assets/zombies/zombie_axit.png',
  zombie_nhay: 'public/assets/zombies/zombie_nhay.png',
  zombie_tank: 'public/assets/zombies/zombie_tank.png',
  zombie_ma_vo_hinh: 'public/assets/zombies/zombie_ma_vo_hinh.png',
  zombie_xuyen_thung: 'public/assets/zombies/zombie_xuyen_thung.png',

  // 5 Quái vật đặc biệt & Boss (Batch 04)
  diving_zombie: 'public/assets/zombies/diving_zombie.png',
  football_zombie: 'public/assets/zombies/football_zombie.png',
  giant_puppet: 'public/assets/zombies/giant_puppet.png',
  sea_monster: 'public/assets/zombies/sea_monster.png',
  zombie_king: 'public/assets/zombies/zombie_king.png',

  // Boss người trong cốt truyện (Batch 03 NPC)
  doctor_boss: 'public/assets/characters/npcs/npc_tien_si_tran.png',
  king_boss: 'public/assets/characters/npcs/npc_vua_karen.png',
};

/**
 * Bản dịch kỹ năng zombie sang tiếng Việt
 */
export const ABILITY_LABELS = {
  infect: 'Lây nhiễm',
  screech: 'Tiếng thét gây mệt',
  trip: 'Quấn ngã đối thủ',
  selfDestruct: 'Tự bộc phát',
  explosive: 'Chất nổ sát thương',
  corrode: 'Ăn mòn giáp/vũ khí',
  summon: 'Gọi bầy đàn',
  armor: 'Giáp sắt giảm thương',
  freeze: 'Hàn khí đóng băng',
  blind: 'Gây mù lòa',
  acid: 'Phun axit ăn mòn',
  leap: 'Nhảy vồ phản kích',
  cloak: 'Ẩn thân vô hình',
  impale: 'Xuyên thấu phòng ngự',
};

/**
 * Tìm kiếm đường dẫn sprite phù hợp cho đối thủ
 * @param {Object|string} enemy - Đối tượng đối thủ hoặc tên
 * @returns {string|null} Đường dẫn asset PNG
 */
export function getEnemySprite(enemy) {
  if (!enemy) return null;
  if (typeof enemy === 'string') {
    enemy = { name: enemy };
  }
  if (enemy.id && ENEMY_SPRITE_MAP[enemy.id]) return ENEMY_SPRITE_MAP[enemy.id];
  if (enemy.type && ENEMY_SPRITE_MAP[enemy.type]) return ENEMY_SPRITE_MAP[enemy.type];

  const name = enemy.name || '';
  if (name.includes('Vua Zombie')) return ENEMY_SPRITE_MAP.zombie_king;
  if (name.includes('Cỗ Rối Khổng Lồ') || name.includes('Cỗ Rối')) return ENEMY_SPRITE_MAP.giant_puppet;
  if (name.includes('Bóng Bầu Đục')) return ENEMY_SPRITE_MAP.football_zombie;
  if (name.includes('Zombie Lặn') || name.includes('zombie lặn')) return ENEMY_SPRITE_MAP.diving_zombie;
  if (name.includes('Hải Zombie') || name.includes('Biển Sâu') || name.includes('Hải thi')) return ENEMY_SPRITE_MAP.sea_monster;
  if (name.includes('Lãng Du') || name.includes('du đãng')) return ENEMY_SPRITE_MAP.zombie_lang_dao;
  if (name.includes('Thây Rách')) return ENEMY_SPRITE_MAP.zombie_thay_rach;
  if (name.includes('Bò') || name.includes('zombie bò')) return ENEMY_SPRITE_MAP.zombie_bo;
  if (name.includes('nhanh') || name.includes('chạy nhanh')) return ENEMY_SPRITE_MAP.zombie_nhanh;
  if (name.includes('béo phì') || name.includes('béo')) return ENEMY_SPRITE_MAP.zombie_beo;
  if (name.includes('nổ') || name.includes('phát nổ')) return ENEMY_SPRITE_MAP.zombie_no;
  if (name.includes('quân cảnh')) return ENEMY_SPRITE_MAP.zombie_quan_canh;
  if (name.includes('Bầy Đàn') || name.includes('Mẹ Zombie') || name.includes('mẫu triệu hồi')) return ENEMY_SPRITE_MAP.zombie_me_nhom;
  if (name.includes('giáp sắt')) return ENEMY_SPRITE_MAP.zombie_giap_sat;
  if (name.includes('băng giá')) return ENEMY_SPRITE_MAP.zombie_bang_gia;
  if (name.includes('Cuồng Nộ') || name.includes('Cuồng loạn')) return ENEMY_SPRITE_MAP.zombie_dien_cuong;
  if (name.includes('Phun Axit') || name.includes('acid') || name.includes('axit')) return ENEMY_SPRITE_MAP.zombie_axit;
  if (name.includes('nhảy') || name.includes('nhảy vọt')) return ENEMY_SPRITE_MAP.zombie_nhay;
  if (name.includes('xe tăng')) return ENEMY_SPRITE_MAP.zombie_tank;
  if (name.includes('Vô Hình')) return ENEMY_SPRITE_MAP.zombie_ma_vo_hinh;
  if (name.includes('Xuyên Thủng') || name.includes('xuyên thấu')) return ENEMY_SPRITE_MAP.zombie_xuyen_thung;
  if (name.includes('Tiến Sĩ') || name.includes('Trần')) return ENEMY_SPRITE_MAP.doctor_boss;
  if (name.includes('Vua Lâu Đài')) return ENEMY_SPRITE_MAP.king_boss;
  
  return null;
}

/**
 * Xác định nhãn phân loại nguy hiểm của đối thủ
 * @param {Object} enemy - Đối tượng đối thủ
 * @returns {{label: string, className: string}}
 */
export function getEnemyClassification(enemy) {
  const name = enemy?.name || '';
  const hp = enemy?.hp || enemy?.maxHp || 100;

  if (
    name.includes('Vua Zombie') ||
    name.includes('Cỗ Rối') ||
    name.includes('Hải Zombie') ||
    name.includes('Vua Lâu Đài') ||
    name.includes('Tiến Sĩ') ||
    name.includes('Lão Binh') ||
    name.includes('Hắc Ảnh') ||
    name.includes('Mã Tam') ||
    name.includes('Trưởng Ngân Hàng') ||
    name.includes('Trưởng Trận Địa') ||
    hp >= 350
  ) {
    return { label: 'BOSS CHIẾN DỊCH', className: 'badge-boss' };
  }
  if (
    name.includes('Cuồng Nộ') ||
    name.includes('Phun Axit') ||
    name.includes('băng giá') ||
    name.includes('Vô Hình') ||
    name.includes('Xuyên Thủng') ||
    name.includes('Bầy Đàn') ||
    name.includes('Mẹ Zombie') ||
    name.includes('béo') ||
    name.includes('nổ')
  ) {
    return { label: 'ZOMBIE ĐỘT BIẾN', className: 'badge-mutant' };
  }
  if (
    name.includes('quân cảnh') ||
    name.includes('giáp sắt') ||
    name.includes('xe tăng') ||
    name.includes('Bóng Bầu Đục') ||
    name.includes('Zombie Lặn') ||
    name.includes('zombie lặn')
  ) {
    return { label: 'ZOMBIE VŨ TRANG', className: 'badge-armored' };
  }
  if (name.includes('nhanh') || name.includes('nhảy') || name.includes('chạy nhanh')) {
    return { label: 'ZOMBIE TỐC ĐỘ CAO', className: 'badge-fast' };
  }
  return { label: 'ZOMBIE SINH TỒN', className: 'badge-normal' };
}

/**
 * Định dạng một dòng trong nhật ký chiến đấu với màu sắc và icon trực quan
 * @param {string} line - Dòng log
 * @returns {string} Chuỗi HTML đã phân loại
 */
export function formatCombatLogRow(line) {
  if (!line || !line.trim()) return '';
  const trimmed = line.trim();

  // 1. Thất bại (Defeat)
  if (trimmed.includes('Thất bại') || trimmed.includes('đánh gục……') || trimmed.includes('giết chết……')) {
    return `<div class="combat-log-row combat-log-defeat"><span class="combat-log-icon">☠</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 2. Chiến thắng / Thu hoạch vật phẩm / Hồi phục sau trận (Victory & Drops)
  if (
    trimmed.includes('Chiến thắng') ||
    trimmed.includes('đánh bại') ||
    trimmed.includes('rơi ra') ||
    trimmed.includes('tiết ra') ||
    trimmed.includes('ngã xuống') ||
    trimmed.includes('đổ gục') ||
    trimmed.includes('sụp đổ') ||
    trimmed.includes('Đã giết') ||
    trimmed.includes('xử lý vết thương cho bạn') ||
    trimmed.includes('Gel zombie')
  ) {
    return `<div class="combat-log-row combat-log-victory"><span class="combat-log-icon">🏆</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 3. Chí mạng / Headshot
  if (trimmed.includes('💀Bắn trúng đầu') || trimmed.includes('Trúng đầu') || trimmed.includes('Chí mạng')) {
    return `<div class="combat-log-row combat-log-crit"><span class="combat-log-icon">🎯</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 4. Đòn liên kích (Combo)
  if (trimmed.includes('Liên kích!')) {
    return `<div class="combat-log-row combat-log-combo"><span class="combat-log-icon">⚡</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 5. Đồng minh hỗ trợ (Ally)
  if (trimmed.includes('Liu Ruyan') || trimmed.includes('Lulu Wei')) {
    return `<div class="combat-log-row combat-log-ally"><span class="combat-log-icon">🗡️</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 6. Né đòn / Trượt / Đánh lệch (Dodge & Miss)
  if (
    trimmed.includes('né đòn') ||
    trimmed.includes('né được') ||
    trimmed.includes('đánh lệch') ||
    trimmed.includes('hoàn toàn trượt') ||
    trimmed.includes('giữ khoảng cách')
  ) {
    return `<div class="combat-log-row combat-log-dodge"><span class="combat-log-icon">💨</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 7. Sát thương đối thủ gây ra (Enemy hits)
  if (
    trimmed.includes('cho bạn') ||
    trimmed.includes('bắn về phía bạn') ||
    trimmed.includes('phun acid ăn mòn bạn') ||
    trimmed.includes('đánh lén từ sau') ||
    trimmed.includes('phản công!') ||
    trimmed.includes('sát thương xuyên giáp') ||
    trimmed.includes('phát nổ! Gây') ||
    trimmed.includes('nổ tung! Mảnh vỡ') ||
    trimmed.includes('Zombie gây') ||
    (trimmed.includes('gây') && !trimmed.includes('Bạn dùng') && !trimmed.includes('Bạn tấn công'))
  ) {
    return `<div class="combat-log-row combat-log-enemy-hit"><span class="combat-log-icon">🩸</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 8. Hiệu ứng trạng thái xấu / Hao mòn (Debuffs & Status)
  if (
    trimmed.includes('lý trí -') ||
    trimmed.includes('mệt mỏi') ||
    trimmed.includes('quấn ngã') ||
    trimmed.includes('vấp ngã') ||
    trimmed.includes('bị mù') ||
    trimmed.includes('Hàn khí') ||
    trimmed.includes('tiếng thét') ||
    trimmed.includes('lây nhiễm') ||
    trimmed.includes('ăn mòn') ||
    trimmed.includes('độ bền hao hết') ||
    trimmed.includes('hết đạn') ||
    trimmed.includes('đã hỏng') ||
    trimmed.includes('triệu hồi') ||
    trimmed.includes('khó chịu!')
  ) {
    return `<div class="combat-log-row combat-log-status"><span class="combat-log-icon">⚠</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // 9. Người chơi tấn công thành công (Player hits)
  if (trimmed.includes('Bạn dùng') || trimmed.includes('tấn công, gây') || trimmed.includes('bắn, gây')) {
    return `<div class="combat-log-row combat-log-player-hit"><span class="combat-log-icon">⚔️</span><span class="combat-log-text">${trimmed}</span></div>`;
  }

  // Dòng thường
  return `<div class="combat-log-row"><span class="combat-log-bullet">•</span><span class="combat-log-text">${trimmed}</span></div>`;
}

/**
 * Render component Combat Visual HUD
 * @param {Object} enemy - Dữ liệu đối thủ
 * @param {Object} options - Tùy chọn hiển thị (currentHp, maxHp, isDefeated, isPreCombat)
 * @returns {string} HTML Combat HUD
 */
export function renderCombatHUD(enemy, options = {}) {
  if (!enemy) return '';

  const spriteUrl = getEnemySprite(enemy) || 'public/assets/zombies/zombie_lang_dao.png';
  const classification = getEnemyClassification(enemy);
  const maxHp = options.maxHp !== undefined ? options.maxHp : (enemy.hp || enemy.maxHp || 100);
  const currentHp = options.currentHp !== undefined ? Math.max(0, options.currentHp) : maxHp;
  const hpPct = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));
  const isDefeated = options.isDefeated || currentHp <= 0;

  // Thanh máu theo trạng thái
  let hpColorClass = 'healthy';
  if (hpPct <= 25) hpColorClass = 'critical';
  else if (hpPct <= 50) hpColorClass = 'warning';

  // Danh sách kỹ năng
  const abilities = Array.isArray(enemy.ability) ? enemy.ability : [];
  const abilityBadges = abilities.map(code => {
    const label = ABILITY_LABELS[code] || code;
    return `<span class="combat-ability-tag">${label}</span>`;
  }).join('');

  const enemyDamage = enemy.damage || (enemy.damageMin && enemy.damageMax ? `${enemy.damageMin}-${enemy.damageMax}` : 20);
  const dodgeRate = enemy.dodge !== undefined ? enemy.dodge : (enemy.dodgeRate !== undefined ? enemy.dodgeRate : 0);
  const dodgeText = dodgeRate > 0 ? `${Math.round(dodgeRate * 100)}%` : null;

  return `
<div class="combat-hud">
  <div class="combat-hud-header">
    <div class="combat-hud-badge ${classification.className}">☣ ${classification.label}</div>
    <div class="combat-hud-status-badge ${isDefeated ? 'status-dead' : 'status-alive'}">${isDefeated ? '💀 ĐÃ TIÊU DIỆT' : '⚔️ ĐANG CHIẾN ĐẤU'}</div>
  </div>
  
  <div class="combat-enemy-card ${isDefeated ? 'is-defeated' : ''}">
    <div class="combat-enemy-visual">
      <img class="combat-enemy-sprite" src="${spriteUrl}" alt="${enemy.name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <div class="combat-enemy-fallback" style="display:none;">🧟</div>
      ${isDefeated ? '<div class="combat-defeated-overlay">💀 ĐÃ BỊ HẠ</div>' : ''}
    </div>
    
    <div class="combat-enemy-details">
      <div class="combat-enemy-title-row">
        <span class="combat-enemy-name">${enemy.name}</span>
      </div>
      
      <div class="combat-enemy-hp-container">
        <div class="combat-hp-label">
          <span><img class="ui-icon-inline" src="public/assets/icons/ui_icon_hp.png" alt="" onerror="this.style.display='none'">HP Đối thủ</span>
          <span class="combat-hp-values ${isDefeated ? 'hp-zero' : ''}">${currentHp} / ${maxHp}</span>
        </div>
        <div class="combat-hp-track">
          <div class="combat-hp-fill ${hpColorClass}" style="width: ${hpPct}%;"></div>
        </div>
      </div>
      
      <div class="combat-enemy-meta">
        <span class="combat-meta-stat">⚔️ Sát thương: <strong>${enemyDamage}</strong></span>
        ${dodgeText ? `<span class="combat-meta-stat">💨 Thân pháp: <strong>${dodgeText}</strong></span>` : ''}
      </div>
      
      ${abilityBadges ? `<div class="combat-ability-list">${abilityBadges}</div>` : ''}
    </div>
  </div>
</div>`;
}

/**
 * Trích xuất tên đối thủ từ nhật ký chiến đấu nếu không có object state
 * @param {string} text - Toàn bộ nhật ký
 * @returns {string|null} Tên đối thủ
 */
function extractEnemyNameFromCombat(text) {
  if (!text) return null;
  const defeatMatch = text.match(/Bạn đã đánh bại ([^!\n]+)!/);
  if (defeatMatch) return defeatMatch[1].trim();

  const killMatch = text.match(/Bạn bị ([^\s\n]+(?: [^\s\n]+)*) (?:đánh gục|giết chết)/);
  if (killMatch) return killMatch[1].trim();

  const hitMatch = text.match(/(?:Trúng đầu|HP của) ([^\s\n,]+(?: [^\s\n,]+)*)/);
  if (hitMatch) return hitMatch[1].trim();

  return null;
}

/**
 * Xử lý văn bản Story để tích hợp Combat Visual HUD và log có màu
 * @param {string} storyText - Văn bản story gốc
 * @param {Object} state - Trạng thái game
 * @returns {string} Chuỗi HTML hoàn chỉnh
 */
export function formatStoryWithCombatHUD(storyText, state = {}) {
  if (!storyText) return '';

  const isPreCombat = state?.phase === 'pre_combat' || state?.phase === 'pre_combat_npc';
  const hasCombatLog = storyText.includes('--- Nhật ký chiến đấu ---') || storyText.includes('[Lượt 1]');

  // Trường hợp 1: Đang chuẩn bị giao tranh (pre_combat)
  if (isPreCombat) {
    const enemy = state._pendingZombie || state._pendingNpc;
    if (enemy) {
      const hudHtml = renderCombatHUD(enemy, {
        currentHp: enemy.hp || enemy.maxHp || 100,
        maxHp: enemy.hp || enemy.maxHp || 100,
        isDefeated: false,
        isPreCombat: true,
      });
      return `${hudHtml}\n<div class="combat-story-text">${storyText}</div>`;
    }
  }

  // Trường hợp 2: Giao tranh có nhật ký đòn đánh
  if (hasCombatLog) {
    let narrativePart = '';
    let logPart = '';
    let epiloguePart = '';

    if (storyText.includes('--- Nhật ký chiến đấu ---')) {
      const parts = storyText.split('--- Nhật ký chiến đấu ---');
      narrativePart = parts[0].trim();
      logPart = parts[1] || '';
    } else {
      const turnIndex = storyText.indexOf('[Lượt 1]');
      narrativePart = storyText.slice(0, turnIndex).trim();
      logPart = storyText.slice(turnIndex);
    }

    // Nếu trong logPart có phần kết thúc epilogue ngăn cách bởi "---"
    if (logPart.includes('\n\n---\n\n') || logPart.includes('\n---\n')) {
      const subParts = logPart.split(/\n+---\n+/);
      logPart = subParts[0] || '';
      epiloguePart = subParts.slice(1).join('\n\n').trim();
    }

    // Lấy thông tin đối thủ gần nhất
    let enemy = state._lastCombatEnemy || state._pendingZombie || state._pendingNpc;
    if (!enemy) {
      const extractedName = extractEnemyNameFromCombat(storyText);
      if (extractedName) {
        enemy = { name: extractedName };
      }
    }

    const isEnemyDefeated =
      logPart.includes('đánh bại') ||
      logPart.includes('Chiến thắng') ||
      (state._lastCombatEnemy && typeof state._lastCombatEnemy.finalHp === 'number' && state._lastCombatEnemy.finalHp <= 0);

    const finalHp = isEnemyDefeated
      ? 0
      : (typeof state._lastCombatEnemy?.finalHp === 'number'
          ? state._lastCombatEnemy.finalHp
          : (state._lastCombatEnemy?.currentHp || 0));

    let hudHtml = '';
    if (enemy) {
      hudHtml = renderCombatHUD(enemy, {
        currentHp: finalHp,
        maxHp: enemy.hp || enemy.maxHp || 100,
        isDefeated: isEnemyDefeated,
        isPreCombat: false,
      });
    }

    // Format các dòng combat log
    const logRows = logPart.split('\n')
      .map(formatCombatLogRow)
      .filter(Boolean)
      .join('\n');

    const formattedLog = `
<div class="combat-log-container">
  <div class="combat-log-title">📜 Nhật ký giao tranh</div>
  <div class="combat-log-body">${logRows}</div>
</div>`;

    const narrativeHtml = narrativePart ? `<div class="combat-story-text">${narrativePart}</div>` : '';
    const epilogueHtml = epiloguePart ? `<div class="combat-epilogue-text">${epiloguePart}</div>` : '';

    return `${hudHtml}\n${narrativeHtml}\n${formattedLog}\n${epilogueHtml}`.trim();
  }

  // Mặc định: Trả về nội dung story bình thường
  return storyText;
}
