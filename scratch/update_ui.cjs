const fs = require('fs');

let code = fs.readFileSync('js/ui.js', 'utf8');
const isCRLF = code.includes('\r\n');
const normalize = s => s.replace(/\r\n/g, '\n');

// 1. Update renderStats
const oldRenderStats = [
  "export function renderStats(state) {",
  "  const panel = document.getElementById('stats-panel');",
  "  const hpPct = Math.round(state.health / GAME_CONSTANTS.MAX_HEALTH * 100);",
  "  panel.innerHTML = `",
  "<div class=\"stats-title\">📊 Trạng thái nhân vật</div>",
  "<div class=\"stat-row\"><span class=\"stat-label\">Nhân vật</span><span class=\"stat-value\">${state.name}</span></div>"
].join('\n');

const newRenderStats = [
  "export function renderStats(state) {",
  "  const panel = document.getElementById('stats-panel');",
  "  const hpPct = Math.round(state.health / GAME_CONSTANTS.MAX_HEALTH * 100);",
  "  const appearance = state.playerAppearance || DEFAULT_APPEARANCE;",
  "  const appearanceConfig = getAppearanceConfig(appearance.age, appearance.gender, appearance.outfit);",
  "  const appearanceDisplayName = getAppearanceDisplayName(appearance);",
  "  const avatarPath = appearanceConfig?.path || 'public/assets/characters/player/young_adult_male_survivor.png';",
  "",
  "  panel.innerHTML = `",
  "<div class=\"stats-title\">📊 Trạng thái nhân vật</div>",
  "<div class=\"stat-player-card\">",
  "  <div class=\"stat-player-avatar-box\">",
  "    <img class=\"stat-player-avatar-img\" src=\"${avatarPath}\" alt=\"${state.name}\" onerror=\"this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';\">",
  "    <div class=\"stat-player-avatar-fallback\" style=\"display:none;\">👤</div>",
  "  </div>",
  "  <div class=\"stat-player-info\">",
  "    <div class=\"stat-player-name\">${state.name || 'Người sống sót'}</div>",
  "    <div class=\"stat-player-appearance\">${appearanceDisplayName}</div>",
  "  </div>",
  "</div>",
  "<div class=\"stat-row\"><span class=\"stat-label\">Nhân vật</span><span class=\"stat-value\">${state.name}</span></div>"
].join('\n');

let normCode = normalize(code);
if (normCode.includes(oldRenderStats)) {
  normCode = normCode.replace(oldRenderStats, newRenderStats);
  console.log('renderStats updated successfully!');
} else {
  console.error('Could not find oldRenderStats block');
}

// 2. Add initAppearanceUI before initUI
const initUIAnchor = 'export function initUI() {';
const appearanceUIFunc = [
  "/**",
  " * Khởi tạo bộ điều khiển lựa chọn ngoại hình nhân vật trên màn hình bắt đầu",
  " */",
  "export function initAppearanceUI() {",
  "  const ageSelect = document.getElementById('appearance-age-select');",
  "  const genderSelect = document.getElementById('appearance-gender-select');",
  "  const outfitSelect = document.getElementById('appearance-outfit-select');",
  "  const previewImg = document.getElementById('appearance-preview-img');",
  "  const previewPlaceholder = document.getElementById('appearance-preview-placeholder');",
  "  const statusBadge = document.getElementById('appearance-status-badge');",
  "  const placeholderName = document.getElementById('preview-placeholder-name');",
  "  const placeholderOutfit = document.getElementById('preview-placeholder-outfit');",
  "  const placeholderTag = document.getElementById('preview-placeholder-tag');",
  "  const confirmBtn = document.getElementById('confirm-appearance-btn');",
  "",
  "  if (!ageSelect || !genderSelect || !outfitSelect) return;",
  "",
  "  function updatePreview() {",
  "    const age = ageSelect.value;",
  "    const gender = genderSelect.value;",
  "    const outfit = outfitSelect.value;",
  "    const config = getAppearanceConfig(age, gender, outfit);",
  "",
  "    if (!config) return;",
  "",
  "    if (placeholderName) {",
  "      placeholderName.textContent = `${config.ageName} ${config.genderName}`;",
  "    }",
  "    if (placeholderOutfit) {",
  "      placeholderOutfit.textContent = config.outfitName;",
  "    }",
  "    if (placeholderTag) {",
  "      placeholderTag.textContent = `${config.filename} (${config.status})`;",
  "    }",
  "",
  "    if (statusBadge) {",
  "      statusBadge.textContent = config.status;",
  "      statusBadge.className = `appearance-status-badge status-${config.status.toLowerCase()}`;",
  "    }",
  "",
  "    if (previewImg && previewPlaceholder) {",
  "      previewImg.onload = () => {",
  "        previewImg.style.display = 'block';",
  "        previewPlaceholder.style.display = 'none';",
  "        if (statusBadge) {",
  "          statusBadge.textContent = 'EXISTING';",
  "          statusBadge.className = 'appearance-status-badge status-existing';",
  "        }",
  "      };",
  "      previewImg.onerror = () => {",
  "        previewImg.style.display = 'none';",
  "        previewPlaceholder.style.display = 'flex';",
  "        if (statusBadge) {",
  "          statusBadge.textContent = 'PENDING';",
  "          statusBadge.className = 'appearance-status-badge status-pending';",
  "        }",
  "      };",
  "      previewImg.src = config.path;",
  "    }",
  "",
  "    setPlayerAppearance(config);",
  "  }",
  "",
  "  ageSelect.addEventListener('change', updatePreview);",
  "  genderSelect.addEventListener('change', updatePreview);",
  "  outfitSelect.addEventListener('change', updatePreview);",
  "",
  "  if (confirmBtn) {",
  "    confirmBtn.addEventListener('click', () => {",
  "      updatePreview();",
  "      confirmBtn.classList.add('confirmed');",
  "      const originalText = confirmBtn.textContent;",
  "      confirmBtn.textContent = '✓ Đã chọn ngoại hình!';",
  "      setTimeout(() => {",
  "        confirmBtn.classList.remove('confirmed');",
  "        confirmBtn.textContent = originalText;",
  "      }, 1500);",
  "    });",
  "  }",
  "",
  "  updatePreview();",
  "}",
  ""
].join('\n');

if (normCode.includes(initUIAnchor)) {
  normCode = normCode.replace(initUIAnchor, appearanceUIFunc + '\n' + initUIAnchor);
  console.log('initAppearanceUI added successfully!');
} else {
  console.error('Could not find initUI anchor');
}

// 3. Update newGameBtn in initUI
const oldNewGame = [
  "  if (newGameBtn) {",
  "    newGameBtn.addEventListener('click', () => {",
  "      const value = nameInput.value.trim();",
  "      if (!value) {",
  "        alert('Vui lòng nhập biệt danh nhân vật');",
  "        return;",
  "      }",
  "      resetState();",
  "      setName(value);",
  "      setPhase('choose');",
  "      startGameMusic();",
  "      renderAll();",
  "    });",
  "  }"
].join('\n');

const newNewGame = [
  "  if (newGameBtn) {",
  "    newGameBtn.addEventListener('click', () => {",
  "      const value = nameInput.value.trim();",
  "      if (!value) {",
  "        alert('Vui lòng nhập biệt danh nhân vật');",
  "        return;",
  "      }",
  "      const age = document.getElementById('appearance-age-select')?.value || 'young_adult';",
  "      const gender = document.getElementById('appearance-gender-select')?.value || 'male';",
  "      const outfit = document.getElementById('appearance-outfit-select')?.value || 'survivor';",
  "      const selectedAppearance = getAppearanceConfig(age, gender, outfit) || { ...DEFAULT_APPEARANCE };",
  "",
  "      resetState();",
  "      setName(value);",
  "      setPlayerAppearance(selectedAppearance);",
  "      setPhase('choose');",
  "      startGameMusic();",
  "      renderAll();",
  "    });",
  "  }"
].join('\n');

if (normCode.includes(oldNewGame)) {
  normCode = normCode.replace(oldNewGame, newNewGame);
  console.log('newGameBtn handler updated successfully!');
} else {
  console.error('Could not find oldNewGame block');
}

// 4. Add initAppearanceUI() inside initUI()
const initUIEndAnchor = 'renderAll();\n}';
if (normCode.includes(initUIEndAnchor)) {
  normCode = normCode.replace(initUIEndAnchor, 'renderAll();\n  initAppearanceUI();\n}');
  console.log('initAppearanceUI() call added inside initUI()');
} else {
  console.error('Could not find initUIEndAnchor');
}

fs.writeFileSync('js/ui.js', isCRLF ? normCode.replace(/\n/g, '\r\n') : normCode, 'utf8');
console.log('js/ui.js saved successfully!');

