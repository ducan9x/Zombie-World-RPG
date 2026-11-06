# BATCH 09 – PHASE 09.1: SCREEN INVENTORY
## Zombie World RPG – Comprehensive UI & Screen Catalog

**Document Version:** 1.0  
**Audit Date:** 2026-11-06  
**Auditor:** Senior Frontend Architect & QA Engineer  
**Objective:** Complete inventory of all existing screens, major UI states, containers, and interactive components to establish baseline for Mobile-First refactoring.

---

## 1. INVENTORY SUMMARY

A complete source-code audit across `index.html`, `css/style.css`, `js/ui.js`, `js/inventory-ui.js`, `js/warehouse-ui.js`, `js/combat-hud.js`, `js/map-renderer.js`, and gameplay state handlers identified **21 distinct screens and major UI states**.

| # | Screen / State Name | DOM Container ID / Selector | Type | Redesign Priority |
|---|---|---|---|---|
| 1 | Main Menu & Character Setup | `#name-setup`, `#game-header` | Full Page View | P1 – High |
| 2 | Save & Load Manager | `#save-page` | Full Page View | P2 – Medium |
| 3 | Best Survival Record | `#best-record-page` | Full Page View | P2 – Medium |
| 4 | Achievements Gallery | `#achievement-page` | Full Page View | P2 – Medium |
| 5 | Tactical Settings | `#settings-page` | Full Page View | P2 – Medium |
| 6 | Player Auxiliary Tools | `#player-tools-page` | Full Page View (Iframe) | P1 – High |
| 7 | About & Credits | `#about-page` | Full Page View | P3 – Low |
| 8 | Identity & Survival Stats HUD | `#zone-1` (`#identity-panel`, `#stats-panel`, `#cargo-panel`) | HUD Panel (Zone 1) | P1 – High |
| 9 | Weaponry & Equipment HUD | `#zone-2` (`#weapon-panel`) | HUD Panel (Zone 2) | P1 – High |
| 10 | Visual Inventory & Item Cards | `#zone-2` (`#inventory-panel`) | HUD Panel (Zone 2) | P0 – Critical |
| 11 | 2D Graphical Viewport & World Map | `#zone-3` (`#pixi-viewport`) | Interactive Viewport (Zone 3) | P0 – Critical |
| 12 | Narrative Story & Event Log | `#zone-3` (`#story-area`) | Narrative Feed (Zone 3) | P0 – Critical |
| 13 | Combat Encounter & Enemy HUD | `#zone-3` (`.combat-enemy-card`) + `#zone-4` | Gameplay State View | P0 – Critical |
| 14 | Exploration & Location Detail | `#zone-3` (`#story-area`) + `#zone-4` (`#options-area`) | Gameplay State View | P0 – Critical |
| 15 | NPC Dialogue & Quest Interaction | `#zone-3` (`#story-area`) + `#zone-4` (`#options-area`) | Gameplay State View | P1 – High |
| 16 | Trading & Merchant Exchange | `#zone-3` (`#story-area`) + `#zone-4` (`#options-area`) | Gameplay State View | P1 – High |
| 17 | Base Management & Crop Farming | `#zone-3` (`#story-area`) + `#zone-4` (`#options-area`) | Gameplay State View | P1 – High |
| 18 | Action Options & Pagination HUD | `#zone-4` (`#options-area`, `#pagination-area`, `#input-area`) | Interactive HUD (Zone 4) | P0 – Critical |
| 19 | Destructive Discard Modal | `#discard-confirm-modal` | Modal Overlay Dialog | P2 – Medium |
| 20 | Dual-Pane Warehouse Stash Modal | `#warehouse-modal` | Modal Overlay Dialog | P1 – High |
| 21 | Game Over & Epilogue / Ending | `#game-content` (Phase `ending`) | Gameplay State View | P2 – Medium |

---

## 2. DETAILED SCREEN INVENTORY

### Screen 1: Main Menu & Character Setup
- **Container:** `#name-setup` (with `#game-header`)
- **Source Files:** `index.html` (lines 14–75), `css/style.css` (lines 80–180), `js/ui.js` (lines 780–840), `js/data/player-appearance.js`
- **Layout Structure:** Centered column container (`max-width: 420px; width: 100%`) on dark apocalyptic background.
- **Components & Content:**
  - Header with game logo (`#header-logo`) and subtitle.
  - Nickname text input (`#name-input`).
  - Character Appearance Configuration Box (`.character-appearance-box`, fixed 320px width):
    - Age dropdown (`#appearance-age-select`: Teen, Young Adult, Adult, Middle-Aged, Elderly).
    - Gender dropdown (`#appearance-gender-select`: Male, Female).
    - Outfit dropdown (`#appearance-outfit-select`: Survivor, Tactical, Casual).
    - 2:3 Portrait Preview Card (`.appearance-preview-card`, 160px height) rendering selected PNG sprite.
  - Start Buttons Column (`.start-buttons`, 320px width):
    - "Bắt đầu sinh tồn" (`#new-game-btn`)
    - "Tải tiến trình" (`#load-game-btn`)
    - "Kỷ lục tốt nhất" (`#best-record-btn`)
    - "Thành tựu" (`#achievement-btn`)
    - "Cài đặt" (`#settings-btn`)
    - "Công cụ người chơi" (`#player-tools-btn`)
    - "Giới thiệu" (`#about-btn`)
- **Interactive Controls:** Text typing, 3 dropdown selections, 7 full-width button triggers.
- **Existing Responsive Behavior:** Centered with `max-width: 420px`, but inner child elements have hardcoded `width: 320px` and container has `padding: 24px 20px` (total 360px), causing horizontal clipping on 320px screens.
- **Scrolling Behavior:** None on desktop; locked inside `100vh`. On short mobile viewports (e.g. 360×640 or landscape), bottom buttons are pushed offscreen and inaccessible.
- **Redesign Priority:** **P1 – High** (Remove rigid 320px constraints, adapt preview card, ensure full vertical scrollability on small screens).

---

### Screen 2: Save & Load Manager
- **Container:** `#save-page`
- **Source Files:** `index.html` (lines 76–90), `css/style.css` (lines 740–820), `js/ui.js` (lines 350–430), `js/save.js`
- **Layout Structure:** Full-screen flex container (`flex: 1; flex-direction: column; overflow: hidden;`).
- **Components & Content:**
  - Title & status feed (`#save-story-area`).
  - 11 Save Slots Grid / List (`#save-slots-area`):
    - Slot 0 (Auto-save) with timestamp, survival day, player nickname.
    - Slots 1–10 (Manual save positions) with usage status.
  - Slot Action Area (`#save-options-area`): Contextual action buttons (Lưu đè, Tải bản lưu, Xóa vị trí).
  - Return button (`#save-return-btn`).
- **Interactive Controls:** Slot card click selection, action execution, return to menu.
- **Existing Responsive Behavior:** Inherits container bounds; slots list uses `overflow-y: auto`.
- **Scrolling Behavior:** Slots list is independently scrollable, but container is locked inside `height: 100vh`.
- **Redesign Priority:** **P2 – Medium** (Ensure slot cards have comfortable touch targets and clear active states on mobile).

---

### Screen 3: Best Survival Record
- **Container:** `#best-record-page`
- **Source Files:** `index.html` (lines 91–105), `css/style.css` (lines 820–880), `js/ui.js` (lines 430–480), `js/save.js`
- **Layout Structure:** Full-screen flex container (`display: flex; flex-direction: column;`).
- **Components & Content:**
  - Record trophy header (Số ngày sinh tồn kỷ lục, Tên nhân vật).
  - Detailed inventory snapshot card: items, ammo, weapons, health, crash/fatigue, infection, location at time of record.
  - Return button (`#best-record-return-btn`).
- **Interactive Controls:** Single return button.
- **Existing Responsive Behavior:** Content panel has `overflow-y: auto`.
- **Scrolling Behavior:** Inner content scrolls vertically if snapshot exceeds screen height.
- **Redesign Priority:** **P2 – Medium** (Clean vertical flow on mobile).

---

### Screen 4: Achievements Gallery
- **Container:** `#achievement-page`
- **Source Files:** `index.html` (lines 106–118), `css/style.css` (lines 880–940), `js/ui.js` (lines 480–520), `js/achievements.js`
- **Layout Structure:** Full-screen flex container with inner grid (`#achievement-content`).
- **Components & Content:**
  - Achievements grid (`grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`).
  - Achievement cards: Icon (`.achievement-icon`, 40px), Title, Description, Unlock condition, Status (Đã mở khóa / Chưa mở).
  - Return button (`#achievement-return-btn`).
- **Interactive Controls:** Single return button.
- **Existing Responsive Behavior:** Auto-fit grid adapts well across screen widths.
- **Scrolling Behavior:** `#achievement-content` has `overflow-y: auto`.
- **Redesign Priority:** **P2 – Medium** (Adjust minimum card width to prevent narrow card distortion on 320px).

---

### Screen 5: Tactical Settings
- **Container:** `#settings-page`
- **Source Files:** `index.html` (lines 119–130), `css/style.css` (lines 1210–1240, lines 2880–2920), `js/ui.js` (lines 490–515), `js/state.js`
- **Layout Structure:** Full-screen flex container with centered panel (`#settings-content`).
- **Components & Content:**
  - Military hardware toggle buttons with active LED glow:
    - Chế độ nhấp (`#click-mode-btn`: BẬT / TẮT)
    - Chế độ nhập (`#input-mode-btn`: BẬT / TẮT)
    - Nhạc game (`#music-btn`: BẬT / TẮT)
  - Return button (`#settings-return-btn`).
- **Interactive Controls:** Click/tap toggle buttons with instantaneous state persistence in `localStorage`.
- **Existing Responsive Behavior:** Buttons expand to 100% width with comfortable padding.
- **Scrolling Behavior:** Contained within screen height.
- **Redesign Priority:** **P2 – Medium** (Maintain tactile rocker switch presentation while ensuring thumb ergonomics).

---

### Screen 6: Player Auxiliary Tools
- **Container:** `#player-tools-page`
- **Source Files:** `index.html` (lines 131–155), `css/style.css` (lines 1240–1280, lines 2840–2880), `js/ui.js` (lines 920–960), `tools/probability.html`, `tools/encyclopedia.html`
- **Layout Structure:** Panel container containing tab header, embedded iframe container (`.player-tools-frame-container`), and actions row.
- **Components & Content:**
  - Header with tab pills:
    - "📊 Tra cứu xác suất" (`#pt-tab-probability`)
    - "📖 Bách khoa toàn thư" (`#pt-tab-encyclopedia`)
    - "↗ Mở tab mới" (`#pt-open-external-btn`)
  - Embedded iframe (`#player-tools-frame`, fixed 520px height in desktop CSS).
  - Return button (`#player-tools-return-btn`).
- **Interactive Controls:** Tab switching, external window open, internal iframe interactions.
- **Existing Responsive Behavior:** Desktop CSS has `height: 520px;`. Phase 8.4 added `@media (max-width: 640px) { height: 380px; }`.
- **Scrolling Behavior:** Iframe has internal scrolling; parent page is fixed.
- **Redesign Priority:** **P1 – High** (Make iframe height fluid relative to mobile viewport height `dvh` so the return button is never pushed offscreen).

---

### Screen 7: About & Credits
- **Container:** `#about-page`
- **Source Files:** `index.html` (lines 156–170), `css/style.css` (lines 940–1000), `js/ui.js`
- **Layout Structure:** Full-screen flex container with centered text card.
- **Components & Content:**
  - Lore summary, project credits, version badge, Return button (`#about-return-btn`).
- **Interactive Controls:** Single return button.
- **Existing Responsive Behavior:** Simple card text; scrolls cleanly if long.
- **Scrolling Behavior:** Inner container has `overflow-y: auto`.
- **Redesign Priority:** **P3 – Low** (Already stable).

---

### Screen 8: Identity & Survival Stats HUD
- **Container:** `#zone-1` (within `#game-content`)
- **Source Files:** `index.html` (lines 255–261), `css/style.css` (lines 100–350, lines 1056–1120), `js/ui.js` (lines 40–150)
- **Layout Structure:**
  - Desktop: Left column (fixed 200px width).
  - Mobile (≤768px): Top-Left quadrant (40% width, ~144px).
- **Components & Content:**
  - **Identity Panel (`#identity-panel`):**
    - Avatar thumbnail (`.stat-player-avatar-box`, 36×36px).
    - Player nickname & Faction title badge.
  - **Stats Panel (`#stats-panel`):**
    - Time row: Day number, Time Phase (Sáng sớm, Buổi sáng, Buổi trưa, Buổi chiều, Hoàng hôn, Đêm khuya), Weather text.
    - Location row: Name of current map node.
    - 6 Survival Stat Rows with Icons, Labels, Numerical Values, and Animated Tracks:
      - Sức khỏe (`hp`: 0–100)
      - Bụng no (`hunger`: 0–100%)
      - Nước (`thirst`: 0–100%)
      - Lý trí (`sanity`: 0–100%)
      - Mệt mỏi (`fatigue`: 0–100%)
      - Nhiễm bệnh (`infection`: 0–100%)
  - **Cargo Panel (`#cargo-panel`):**
    - Thuốc lá, Xăng, Xu hoàng gia, Năng lượng tinh khiết, Nợ lâu đài.
- **Interactive Controls:** Information display only; non-interactive HUD.
- **Existing Responsive Behavior:** Squeezed into 40% width (~144px) on mobile. Stat bar tracks shrink to ~50px; text truncates or wraps tightly.
- **Scrolling Behavior:** Trapped in `#zone-1` (`overflow: hidden`).
- **Redesign Priority:** **P1 – High** (Reorganize into a compact, horizontal mobile status bar or collapsible drawer).

---

### Screen 9: Weaponry & Equipment HUD
- **Container:** `#zone-2 > #weapon-panel` (within `#game-content`)
- **Source Files:** `index.html` (lines 262–264), `css/style.css` (lines 350–430, lines 1090–1110), `js/ui.js` (lines 150–220)
- **Layout Structure:**
  - Desktop: Top section of Zone 2 (fixed 200px width).
  - Mobile (≤768px): Top section of Zone 2 (60% width, ~216px).
- **Components & Content:**
  - Panel title ("⚔️ Vũ khí").
  - Melee weapon row: Name, Damage, Combo rate percentage, Durability bar / count.
  - Ranged weapon row: Name, Damage, Hit rate percentage, Durability bar / count.
  - Ammo row: Bullet type and quantity.
  - Backpack row: Bag name and total carrying capacity slots.
- **Interactive Controls:** Informational display; equipped slots.
- **Existing Responsive Behavior:** Takes top half of Zone 2 on mobile; text wraps awkwardly.
- **Scrolling Behavior:** None (`flex-shrink: 0`).
- **Redesign Priority:** **P1 – High** (Needs consolidation with character stats into mobile drawer/tab).

---

### Screen 10: Visual Inventory & Item Cards
- **Container:** `#zone-2 > #inventory-panel`
- **Source Files:** `index.html` (line 265), `css/style.css` (lines 1785–2050), `js/inventory-ui.js`
- **Layout Structure:**
  - Desktop: Bottom section of Zone 2 (scrollable cards grid + floating/bottom detail panel).
  - Mobile (≤768px): Squeezed into 60% column width (~216px) beneath `#weapon-panel`.
- **Components & Content:**
  - Inventory Capacity Bar (`.inv-header`): Progress track showing `X/Y ô`.
  - Category Filter Tabs (`.inv-tabs`): 7 tabs (Tất cả, Vũ khí, Trang bị, Thực phẩm, Đồ uống, Y tế, Nguyên liệu).
  - Item Cards Grid (`.inv-cards-grid`):
    - Cards with item thumbnail icon (SwisserAI WebP), quality border color, item name, count badge, equipped indicator tag.
  - Item Detail Panel (`.inv-detail-panel`):
    - Appears when a card is selected.
    - Large icon, rarity title, category tag, detailed stats (Hunger restore, Hydration restore, HP heal, Infection reduction, Durability, Damage, Combo rate).
    - Contextual Action Buttons (`.inv-detail-actions`): "Ăn", "Uống", "Dùng", "Trang bị", "Tháo", "Đổi túi", "Vứt bỏ".
- **Interactive Controls:** Tab switching, card selection click/tap, action button execution, detail close button.
- **Existing Responsive Behavior:** In a 216px mobile column:
  - 7 tabs wrap into 3 jagged rows.
  - The cards grid is reduced to 1 or 2 narrow cards.
  - When detail panel opens, it covers the entire grid, making comparison impossible.
- **Scrolling Behavior:** Nested scroll inside `#zone-2 > #inventory-panel` (`overflow-y: auto`).
- **Redesign Priority:** **P0 – Critical** (Core survival mechanic; must become a dedicated full-width mobile view or clean slide-over drawer).

---

### Screen 11: 2D Graphical Viewport & World Map
- **Container:** `#zone-3 > #pixi-viewport`
- **Source Files:** `index.html` (line 268), `css/style.css` (lines 430–520, lines 2150–2272), `js/pixi-renderer.js`, `js/map-renderer.js`
- **Layout Structure:**
  - Desktop: Upper half of Zone 3 (central column, variable width ~300–700px).
  - Mobile (≤768px): Squeezed into Bottom-Left quadrant (40% width, ~144px).
- **Components & Content:**
  - PixiJS Canvas element rendering 640×320 2D virtual coordinate space:
    - **Landscape Mode:** Renders 1920×1080 location backgrounds with parallax framing.
    - **World Map Mode:** Renders 23 POI locations on a terrain tilemap with road connections, player token, pulse radar beacon, and coordinate grid lines.
  - HTML Map Toolbar Overlay (`.map-toolbar-container`):
    - Zoom Controls: Cycling button (`1.0x` -> `1.25x` -> `1.5x`).
    - Grid Toggle: Military coordinate grid (`Lưới: Bật/Tắt`).
    - Tactical POI Hover/Touch Card (`.map-tactical-card`): Displays location name, danger badge, loot preview.
    - Close Map button (`Đóng bản đồ`).
- **Interactive Controls:** Canvas POI click/tap, toolbar buttons, drag/pan navigation (clamped to boundaries).
- **Existing Responsive Behavior:**
  - `aspect-ratio: 2 / 1; width: 100%; height: auto;`.
  - In a 144px mobile column, canvas height becomes **72 pixels**!
  - Tactical cards and buttons become invisible or overlap the canvas entirely.
- **Scrolling Behavior:** Fixed position above story area.
- **Redesign Priority:** **P0 – Critical** (Graphical world map is unplayable in a 144px box; must expand to 100% viewport width on mobile).

---

### Screen 12: Narrative Story & Event Log
- **Container:** `#zone-3 > #story-area`
- **Source Files:** `index.html` (line 269), `css/style.css` (lines 685–705), `js/ui.js` (lines 280–320, lines 490–510)
- **Layout Structure:**
  - Desktop: Bottom section of Zone 3.
  - Mobile (≤768px): Squeezed into Bottom-Left quadrant (40% width, ~144px).
- **Components & Content:**
  - Narrative story text with color-coded qualities (`.quality-common`, `.quality-rare`, etc.).
  - Environmental flavor text, day transitions, survival alerts.
  - Smooth scrolling with reading-position preservation (`scrollStoryToBottomIfNeeded`).
- **Interactive Controls:** Reading / vertical scrolling.
- **Existing Responsive Behavior:** Restricted to 144px width on mobile, causing long sentences to break into 2-3 words per line, making reading exhausting.
- **Scrolling Behavior:** `overflow-y: auto`.
- **Redesign Priority:** **P0 – Critical** (Narrative is the primary game medium; must have full readable width on mobile).

---

### Screen 13: Combat Encounter & Boss Battle HUD
- **Container:** Embedded inside `#zone-3 > #story-area` (`.combat-enemy-card`) + `#zone-4` (`#options-area`)
- **Source Files:** `js/combat-hud.js`, `js/combat.js`, `css/style.css` (lines 1700–1785)
- **Layout Structure:**
  - Enemy HUD card inserted at top of story feed.
  - Combat options in Zone 4.
- **Components & Content:**
  - **Enemy Visual Card (`.combat-enemy-card`):**
    - Enemy Sprite Portrait (`.combat-enemy-sprite`, Batch 04 Zombies or Bosses).
    - Enemy Header: Name, Category tag (Zombie thường, Quái dị, Boss), Level badge.
    - Dynamic HP Track (`.combat-hp-track`): Live animated health bar with current HP value and percentage.
    - Ability Badges: Lây nhiễm, Tiếng thét, Hàn khí, Ăn mòn, etc.
  - **Combat Action Log:**
    - Player attack, damage dealt, enemy retaliation, critical hits, dodges, infection warnings.
  - **Combat Controls (Zone 4):**
    - Tấn công vũ khí cận chiến
    - Bắn vũ khí tầm xa
    - Sử dụng vật phẩm y tế
    - Tháo chạy (Flee)
- **Interactive Controls:** Combat option buttons, pagination.
- **Existing Responsive Behavior:** On mobile (40% column), the 96px enemy sprite takes almost the entire width; HP bar compresses to 30px; combat logs are pushed completely out of sight.
- **Scrolling Behavior:** Nested scroll inside story feed.
- **Redesign Priority:** **P0 – Critical** (Combat is the primary survival tension; requires full-width dedicated presentation on mobile).

---

### Screen 14: Exploration & Location Detail Screen
- **Container:** `#zone-3 > #story-area` + `#zone-4 > #options-area` (during phases `explore`, `explore_action`, location events)
- **Source Files:** `js/game/explore.js`, `js/map-events/*.js`
- **Layout Structure:** Dynamic story text in Zone 3; action options in Zone 4.
- **Components & Content:**
  - Scavenge descriptions, loot discoveries, hazard warnings.
  - Options: Tìm kiếm tài nguyên, Vào sâu hơn, Quay về căn cứ, v.v.
- **Interactive Controls:** Action buttons in Zone 4.
- **Existing Responsive Behavior:** Same as Zones 3 & 4.
- **Redesign Priority:** **P0 – Critical** (Core gameplay loop).

---

### Screen 15: NPC Dialogue & Story Quest Screen
- **Container:** `#zone-3 > #story-area` + `#zone-4 > #options-area` (during phases `survivor_interact`, `map_npc`, `npc_quest`)
- **Source Files:** `js/data/entities/npcs.js`, `js/map-events/liuruyan.js`, `js/map-events/wolf.js`, etc.
- **Layout Structure:** Dialogue text with story choices.
- **Components & Content:**
  - Dialogue transcripts, NPC affinity updates, quest requests, item demands.
  - Response choices in Zone 4.
- **Interactive Controls:** Option selection.
- **Existing Responsive Behavior:** Split between two narrow mobile columns.
- **Redesign Priority:** **P1 – High**.

---

### Screen 16: Trading & Merchant Exchange Screen
- **Container:** `#zone-3 > #story-area` + `#zone-4 > #options-area` (during phases `trader_interact`, `v_trade`, `xiaohan_trade`, `lili_trade`, `island_street_*`)
- **Source Files:** `js/trade.js`, `js/data/island/street.js`
- **Layout Structure:** Price catalog and inventory trade list.
- **Components & Content:**
  - Items offered, exchange rate (e.g. 5 Thuốc lá -> 1 Hộp đạn), currency balances.
  - Buy/Sell buttons in options.
- **Interactive Controls:** Trade choices.
- **Existing Responsive Behavior:** Split between columns.
- **Redesign Priority:** **P1 – High**.

---

### Screen 17: Base Management & Crop Farming Screen
- **Container:** `#zone-3 > #story-area` + `#zone-4 > #options-area` (during phases `choose`, `base_build`, `seed_select`)
- **Source Files:** `js/base.js`, `js/farming.js`
- **Layout Structure:** Status text and base options.
- **Components & Content:**
  - Base level, defense status, warehouse capacity, 5 crop plots status (ready, growing, empty).
  - Actions: Trồng trọt, Nâng cấp căn cứ, Quản lý kho, Nghỉ ngơi, Đi ra ngoài.
- **Interactive Controls:** Option selection.
- **Existing Responsive Behavior:** Split between columns.
- **Redesign Priority:** **P1 – High**.

---

### Screen 18: Action Options & Pagination HUD
- **Container:** `#zone-4` (within `#game-content`)
- **Source Files:** `index.html` (lines 271–284), `css/style.css` (lines 707–740, lines 1120–1145), `js/ui.js` (lines 320–350)
- **Layout Structure:**
  - Desktop: Rightmost column (fixed 360px width).
  - Mobile (≤768px): Bottom-Right quadrant (60% width, ~216px).
- **Components & Content:**
  - **Options Area (`#options-area`):**
    - Action Buttons (`.option-item`): Fixed 28px height, 11px font size, numbered `[1]`, `[2]`, `[3]`.
  - **Pagination Area (`#pagination-area`):**
    - Prev button (`#prev-page-btn`), Page info label (`#page-info`), Next button (`#next-page-btn`).
  - **Manual Text Input Area (`#input-area`):**
    - Number input (`#action-input`) and Submit button (`#submit-btn`).
- **Interactive Controls:** Button click, pagination click, text typing/submit, keyboard number hotkeys.
- **Existing Responsive Behavior:** Buttons have fixed `height: 28px`, which is far below the recommended 44–48px touch target.
- **Scrolling Behavior:** `overflow-y: auto`.
- **Redesign Priority:** **P0 – Critical** (Must expand touch targets to ≥44px height for mobile ergonomics).

---

### Screen 19: Destructive Discard Confirmation Modal
- **Container:** `#discard-confirm-modal`
- **Source Files:** `index.html` (lines 175–210), `css/style.css` (lines 2350–2450), `js/inventory-ui.js` (lines 465–580)
- **Layout Structure:** Centered modal dialog overlay (`.modal-overlay` with backdrop blur).
- **Components & Content:**
  - Title banner ("⚠️ Xác nhận vứt bỏ").
  - Item preview card: 48px icon thumbnail, item name with rarity styling, available stock counter.
  - Irreversible loss warning banner.
  - Quantity Stepper (`#discard-qty-row`):
    - Minus button (`-`, 28×28px).
    - Number input field.
    - Plus button (`+`, 28×28px).
    - "Tất cả" button (`#discard-qty-all`).
  - Modal Actions: "Hủy bỏ" (`#discard-cancel-btn`) and "Xác nhận vứt" (`#discard-confirm-btn`).
- **Interactive Controls:** Quantity adjustment, confirm/cancel, backdrop dismiss, Escape key dismiss.
- **Existing Responsive Behavior:** Width is bounded by `max-width: 95vw; max-width: 380px;`.
- **Scrolling Behavior:** Modal dialog fits on screen; inner body scrolls if needed.
- **Redesign Priority:** **P2 – Medium** (Enlarge touch stepper buttons from 28px to 44px).

---

### Screen 20: Dual-Pane Base Warehouse Stash Modal
- **Container:** `#warehouse-modal`
- **Source Files:** `index.html` (lines 212–252), `css/style.css` (lines 2450–2650, lines 2910–2940), `js/warehouse-ui.js`
- **Layout Structure:** Large modal dialog (`.modal-overlay` with blur).
- **Components & Content:**
  - Header: Title, Level badge (`Cấp N (X/Y ô)`), Close button (`✕`).
  - Dual Containers:
    - **Left Pane (`#wh-backpack-grid`):** Backpack capacity badge (`X/Y ô`), item cards.
    - **Right Pane (`#wh-warehouse-grid`):** Base warehouse capacity badge (`X/Y ô`), item cards.
  - Action Bar (`#wh-action-bar`): Selected item indicator, contextual transfer buttons (`Cất 1`, `Cất hết`, `Lấy 1`, `Lấy hết`).
  - Status Message (`#wh-status-msg`): Capacity warnings and error feedback.
- **Interactive Controls:** Card selection, transfer execution, close/escape dismiss.
- **Existing Responsive Behavior:**
  - Desktop: Side-by-side columns (width 880px).
  - Phase 8.4 added `@media (max-width: 640px)` vertical column stacking.
- **Scrolling Behavior:** Each pane has independent `overflow-y: auto`.
- **Redesign Priority:** **P1 – High** (Refine mobile scrolling flow and card grid sizes).

---

### Screen 21: Game Over & Epilogue / Ending Screen
- **Container:** `#game-content` (during phase `ending`)
- **Source Files:** `js/state.js`, `js/ui.js`
- **Layout Structure:** Story area displays eulogy/epilogue; Zone 4 displays restart/menu options.
- **Components & Content:**
  - Survival duration, death cause / victory narrative, historical record comparisons.
  - Return to menu or view best records.
- **Interactive Controls:** Final option choices.
- **Existing Responsive Behavior:** Follows Zones 3 & 4 layout.
- **Redesign Priority:** **P2 – Medium**.

