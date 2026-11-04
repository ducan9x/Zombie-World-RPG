# Roadmap Plan — Zombie-World-RPG

Ke hoach trien khai 4 giai doi. Moi lan thuc hien giai doi, cap nhat trang thai vao file nay.
Xem CHI TIET trang thai o bang tong quan va tung bang chi tiet duoi day.

## 0. Tong quan tien do (Status Overview)

| Phase | Ten | Trang thai | Tinh nang da hoan thien / Tong so | Ghi chu |
|-------|-----|------------|-----------------------------------|---------|
| Phase 1 | Hoan thien Core | Da hoan thanh | 4 / 4 | |
| Phase 1.5 | Tich hop PixiJS | Chua bat dau | 0 / 2 | |
| Phase 2 | Cai thien Gameplay | Chua bat dau | 0 / 4 | |
| Phase 3 | Mo rong Content | Chua bat dau | 0 / 4 | |
| Phase 4 | Advanced Systems | Chua bat dau | 0 / 4 | |
| **Tong ket** | **Toan bo** | **Da hoan thanh mot phan** | **4 / 18** | Cap nhat khi moi tinh nang duoc thuc hien xong |

Cach cap nhat: khi moi tinh nang duot code xong, thay "Chua bat dau" thanh "Da hoan thien" (hoac "Dang thuc hien" neu dang lam), va cap nhat so luong o cot "Tinh nang da hoan thien / Tong so".

---

## Phase 1 - Hoan thien Core (Uu tien cao) - Da hoan thanh (4/4)

| Tinh nang | Muc tieu | Loi ich | Do phuc tap | He thong phu thuoc | File can thay doi | Rui ro regression | Trang thai thuc hien |
|-----------|----------|---------|-------------|-------------------|-------------------|-------------------|---------------------|
| Viet hoa du lieu item/ban do/NPC | Hien ten vat pham, ban do, NPC boi tieng Viet | Nguoi choi VN hieu duoc noi dung | Trung | js/data/items/*.js, js/data/maps/*.js, js/data/entities/*.js | js/data/items/*.js, js/data/maps/maps.js | Thap (chi doi string hien thi, giu id) | Da hoan thanh (da dich maps, backpacks, melee, ranged, medicines, drinks, foods, crops, fish, building-materials, cigarettes, npcs, zombies, config, base, cheats, liuruyan, mumiao; giu id khong thay doi) |
| Them SFX am thanh | Am thanh chien dau, nhan nut, nhan item | Tang chat luong cam nhan | Trung | public/audio/ | js/combat.js, js/ui.js | Thap | Chua bat dau |
| Hien thi cooldown su kien | Hien thi remaining cooldown cho hang dong, hang dong... | UX tot hon | Thap | js/ui.js, js/map-events/*.js | js/ui.js, js/map-events/mechanic.js | Thap | Da hoan thanh (ap dung cho mechanic trade & gas trade) |
| Sua loi hien thi do ben Infinity | Hien thi ∞ cho vu khi khong hu | UX chi tiet | Thap | js/ui.js | js/ui.js | Rat thap | Da hoan thanh |

## Phase 1.5 - Tich hop PixiJS (Uu tien cao)

| Tinh nang | Muc tieu | Loi ich | Do phuc tap | He thong phu thuoc | File can thay doi | Rui ro regression | Trang thai thuc hien |
|-----------|----------|---------|-------------|-------------------|-------------------|-------------------|---------------------|
| Tich hop PixiJS render | Render the gioi ban do/NPC/item bang WebGL/Canvas, giu menu/DOM hien tai | Tang chat luong tran trang, ho tro sprite/anh dong | Trung | js/ui.js, js/main.js, js/state.js | js/pixi-renderer.js (moi), index.html, js/main.js, js/ui.js | Trung (thay doi luong render) | Chua bat dau |
| Tai nguyen anh PixiJS | Them sprite ban do, avatar NPC, icon item vao public/assets/pixi/ | Co du lieu visual cho Pixi render | Thap | public/assets/pixi/ | public/assets/pixi/* (moi) | Thap | Chua bat dau |

## Phase 2 - Cai thien Gameplay (Uu tien cao)

| Tinh nang | Muc tieu | Loi ich | Do phuc tap | He thong phu thuoc | File can thay doi | Rui ro regression | Trang thai thuc hien |
|-----------|----------|---------|-------------|-------------------|-------------------|-------------------|---------------------|
| He thong Level/EXP | Them state.level, state.exp, nang cap cap | Progression ro rang hon | Trung | js/state.js, js/game/index.js | js/state.js | Trung (thay doi state) | Chua bat dau |
| He thong Crafting don gian | Hop thanh vat pham tu nguyen lieu co san | Giam su ngau nhien cua loot | Trung | js/data/items/*.js, js/game/index.js | js/game/index.js, js/ui.js | Trung | Chua bat dau |
| Cai thien UI Combat | Panel chien dau biet liet, hien HP zombie, damage log | Tra nhiem chien dau tot hon | Cao | js/ui.js, js/combat.js | js/ui.js, js/combat.js | Cao (thay doi render luong) | Chua bat dau |
| He thong thoi tac anh huong combat | Mua giam do chuan xac, nong tang met nhanh | Chien thuat nhieu hon | Trung | js/data/systems/constants.js, js/combat.js | js/combat.js | Trung | Chua bat dau |

## Phase 3 - Mo rong Content (Uu tien trung binh)

| Tinh nang | Muc tieu | Loi ich | Do phuc tap | He thong phu thuoc | File can thay doi | Rui ro regression | Trang thai thuc hien |
|-----------|----------|---------|-------------|-------------------|-------------------|-------------------|---------------------|
| Them ban do moi | Mo rong the gioi, cap do kho moi | Noi dung moi cho nguoi choi cu | Thap | js/data/maps/maps.js, js/data/maps/map-actions.js | js/data/maps/maps.js | Thap | Chua bat dau |
| Them zombie/NPC moi | Da dong ke thu va doi thoai | Giam nam chan | Thap | js/data/entities/zombies.js, js/data/entities/npcs.js | js/data/entities/*.js | Thap | Chua bat dau |
| Them quest moi | Nhieu nhánh cot truyen hon | Tang replayability | Trung | js/npcs/*.js, js/castle/king-quest.js | js/npcs/*.js | Thap | Chua bat dau |
| Them item moi | Vu khi, thuoc, do uong moi | Loot thu vi hon | Thap | js/data/items/*.js, js/data/weapons/*.js | js/data/*.js | Thap | Chua bat dau |

## Phase 4 - Advanced Systems (Uu tien thap)

| Tinh nang | Muc tieu | Loi ich | Do phuc tap | He thong phu thuoc | File can thay doi | Rui ro regression | Trang thai thuc hien |
|-----------|----------|---------|-------------|-------------------|-------------------|-------------------|---------------------|
| Endgame / New Game+ | Noi dung sau khi hoan thanh game | Replayability cao | Cao | js/game/endings.js, js/state.js | js/game/endings.js | Cao | Chua bat dau |
| He thong ky nang | Ky nang chu dong / bi dong trong chien dau | Chien thuat sau hon | Cao | js/state.js, js/combat.js, js/ui.js | js/combat.js, js/ui.js | Cao | Chua bat dau |
| Luu game len cloud | Dong bo tien trinh nhieu thiet bi | Tien loi nguoi choi | Cao | Backend moi | js/save.js | Trung (can backend) | Chua bat dau |
| He thong dong gop mods | Dong dong tao noi dung | Sinh thai game ben vung | Rat cao | Kien truc plugin | Nhieu file | Rat cao | Chua bat dau |

## Thu tu trien khai de xuat
Phase 1 -> Phase 1.5 -> Phase 2 -> Phase 3 -> Phase 4.
Khong de xuat refactor lon vi kien truc hien tai du du de mo chuyen tun.

## Cap nhat khi sua code
Neu thay doi ke-hoach trien-khai, cap nhat file nay (xem RULE.md o goc repo).
Neu thuc hien xong mot tinh nang, cap nhat cot "Trang thai thuc hien" va bang "Tong quan tien do" o dau file.
