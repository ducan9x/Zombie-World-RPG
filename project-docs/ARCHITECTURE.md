# Kien truc tong quat — Zombie-World-RPG

## 1. Thong tin chung
- Ten game: Zombie World (Thế Giới Zombie — Game sinh tồn văn bản ngày tận thế)
- Phien ban: V0.2.3
- The loai: Text-based Survival RPG (mạt thế sinh tồn, văn bản)
- Phong choi: Single-player, turn-based (luot), quan ly tai nguyen, su kien ngau nhien, nhieu ket cuoc

## 2. Cong nghe & kien truc
- Framework/Engine: Khong co framework. Vanilla HTML5 + JavaScript ES Modules chay truc tiep trinh duyet.
- Build tool: Khong co (`package.json` chi co `start: node server.js`).
- Server: `server.js` — static file server (cong 9999), chi phuc vu file tinh, khong co backend database.
- Luu tru: `localStorage` (khoa: `zombie_save_0`…`zombie_save_10`, `zombie_best_record`, `zombieWorldGameSettings`).
- Thu vien ngoai: Khong co (khong co React/Vue/Phaser). Chi su dung font Google (`JetBrains Mono`, `Noto Sans SC`) va anh nen cu the.

## 3. Cau truc thu muc
```
Zombie-World-RPG/
├── index.html              # Entry point, lien ket js/main.js
├── server.js               # Static file server (cong 9999)
├── package.json            # Chi dinh entry, khong co dependency
├── css/style.css           # Giao dien toan game (dark theme)
├── public/                 # Tai nguyen tinh (image, music)
├── js/
│   ├── main.js             # Entry module, khoi tao game
│   ├── ui.js               # Render toan bo giao dien (god function)
│   ├── state.js            # Game state duy nhat, luu/chua thoi gian, item
│   ├── config.js           # Trung tam xuat du lieu game (items, maps, constants)
│   ├── routing.js          # Dinh tuyen phase (menu, explore, castle, island...)
│   ├── save.js             # Luu/load localStorage
│   ├── cheats.js           # He thong ma gian lan (/get_...)
│   ├── equipment.js        # Trang bi vu khi/balo
│   ├── combat.js           # Chien dau, gap NPC, thuong lai, bac si
│   ├── farming.js          # Trong trot, kho hang
│   ├── base.js             # Nang cap can cu
│   ├── faction.js          # Danh tinh lau dai / phe
│   ├── maps.js             # Xuat du lieu ban do
│   └── game/               # Logic gameplay (index, exploration, navigation, consumables, save, notes, endings, base-actions, achievements)
│   ├── island/             # He thong dao (bar, fishing, guyue, linhan, invest, street, black-market, intel, yumo)
│   ├── castle/             # He thong lau dai (bank, identity, interior, outpost, royalty, services, king-quest)
│   ├── outpost/            # Tram ngoai (menu, work, leader, assassinate)
│   ├── npcs/               # NPC (index, v, xiaohan, lili, mumiao, map-npcs)
│   ├── map-events/         # Su kien ban do (doctor, wolf, warehouse, factory, ...)
│   └── data/               # Du lieu game (items, maps, systems, dialogues, entities, weapons)
├── docs/                   # Huong dan (Trung/Anh)
└── tools/                  # Cong cu nha phat trien (cheat, encyclopedia, probability)
```

## 4. Entry point & luong khoi tao
1. Mo trinh duyet tai `index.html`.
2. `js/main.js` chay ngay (ES module).
3. `init()` trong `main.js`:
   - Dang ky auto-save callback (luu slot 0 moi 5 ngay qua `advanceTime`).
   - Goi `initUI()` (ui.js) — gan su kien nut bam, an/hien panel ban dau.
   - Goi `setupPagination()`.
   - Goi `setupActionInput()` — gan o nhap lenh `/get_...` (cheat) va nut Submit/Enter.
   - Goi `renderAll()` — ve UI theo `state.phase`.
4. `INITIAL_STATE.phase = "choose"`, `name = ""` -> man hinh dau tien la form nhap ten nhan vat (`#name-setup`).

## 5. He thong quan ly state
- Mot doi tuong `gameState` duy nhat trong bo nho, deep-copy tu `INITIAL_STATE` khi `resetState()`.
- Cac ham truy cap: `getState()`, `setPhase()`, `setStory()`, `setOptions()`, `setName()`, `setLocation()`, `setCurrentMap()`.
- `advanceTime(steps)`: tang luot, ngay, thoi tiet, doí/khát (-4/luot), met mỏi (+10 moi 24 luot khong nghi), giam mua troc, auto-save moi 5 ngay.
- `updateStatusEffects()`: tru HP neu doí/khát, xay chuoi `status` (Dói, Khát, Nhiem trung, Met mỏi, Rối loạn, Ảo giac, Trọng thuong).
- `checkDeath()`: neu `health <= 0` hoac `infection >= 100` -> `gameOver = true`.

## 6. Phase (trang thai) game
Cac phase chinh duoc phan bo qua `switch (phase)` trong `handleAction()` (game/index.js) va `renderAll()` (ui.js):
- `main_menu`: MENU chinh (chua co ten / ve menu)
- `choose`: Menu can cu (ngu, an, uong, y te, trang bi, ra ngoai, luu, xay dung, ghi chu...)
- `save_page` / `save_confirm`: Trang quan ly luu tru (chon slot)
- `explore` / `explore_action`: Kham pha ban do
- `pre_combat` / `pre_combat_npc`: Truoc chien dau (chon hanh dong)
- `survivor_interact`: Tuong tac nguoi song sot
- `trader_interact` / `trader_buy_*` / `doctor_interact`: Giao dien buon lai / bac si
- `npc_chat` / `npc_gift` / `npc_quest_*`: NPC
- `equip_select` / `melee_equip` / `ranged_equip` / `ammo_load` / `backpack_equip`: Trang bi
- `discard_select` / `discard_quantity`: Rut bo vat pham
- `trade_choice` / `trade_input`: Giao dich
- `nurse_feed`: Nuoi y sat che
- `base_build` / `base_upgrade_confirm` / `warehouse_*`: Xay can cu, kho
- `castle_*` / `island_*` / `outpost_*` / `npc_*`: Noi dung vung vach
- `ending`: Ket thuc game
- `survival_notes` / `survival_notes_detail`: Ghi chu sinh ton

## 7. He thong render UI
- `renderAll()` (ui.js): ham "god function" dieu khien toan bo hien theo `state.phase`.
- Panel chinh: identity-panel, stats-panel, weapon-panel, inventory-panel, cargo-panel, story-area, options-area, save-slots-area.
- `initUI()` (ui.js): Gan tat ca listener nut bam (new game, load, save return, achievement, settings, music, player tools, about, name input Enter).

## 8. He thong luu/load
- `saveGame(slotId, gameState, nickname)`: luu vao localStorage kho `zombie_save_<slotId>`.
- `loadGame(slotId)`: doc tu localStorage, goi `normalizeState()` de chuan hoa save cu.
- `deleteSlot(slotId)`: xoa khoi localStorage.
- `autoSave()`: goi `saveGame(0, ...)` moi 5 ngay.
- `getBestRecord()` / `updateBestRecord()`: doc/ghi `zombie_best_record`.

## 9. Cac he thong duoc tich hop ngoai
- Khong co. Tat ca logic chay o client-side.
