# Feature Inventory — Zombie-World-RPG

Danh sach toan bo tinh nang, phan loai theo nhom A-G.
Trang thai: Hoan thien / Dang phat trien / Chua co / Chua xac minh.

## A. Core Gameplay
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Nhap ten / bat dau game | Form nhap ten, nut Tro choi moi | index.html, js/ui.js | Hoan thien |
| Menu can cu (choose) | Ngu, an, uong, y te, trang bi, ra ngoai, luu, xay dung, ghi chu, quay menu | js/game/index.js, js/routing.js | Hoan thien |
| Chon ban do | Danh sach 25 map (loc hidden), hien ten + muc do nguy hiem | js/game/navigation.js, js/data/maps/maps.js | Hoan thien |
| Kham pha ban do | Kiem tra cuong dao, gap NPC (10%), gap zombie (theo encounterRate), nhat loot, event kho vu trong (0.05%) | js/game/exploration.js | Hoan thien |
| Su kien ban do | Leo thap, bia mo, hai qua, hang dong, nha hang, tram xang, siêu thi, nha may, cong, benh vien, canh sat, tram quan su, duong hamm, vien nghien cuu, trung tam phong, vuc vong zombie... | js/map-events/*.js | Hoan thien |
| Lua chon hanh dong | O nhap so hoac nhap tiep tuc (click mode), phan trang 30 lua chon/trang | js/ui.js, js/main.js | Hoan thien |
| Cot truyen / van ban | state.story hien trong #story-area, cac su kien ghi story | js/ui.js (renderStory) | Hoan thien |
| Chien dau zombie | Pre-combat chon cuan/tam xa/chay; vong lap turn-based; tinh damage, ne, crit/dau dau, nhiem, do ben | js/combat.js | Hoan thien |
| Thang/thua chien dau | Zombie chet -> het luot; nguoi choi chet hoac nhiem 100% -> gameOver | js/combat.js, js/state.js | Hoan thien |
| Ket thuc game | 14 ket cuoc, moi ket cuoc co dieu kien biet liet; nut Choi lai/Tiep tuc | js/game/endings.js | Hoan thien |

## B. Character System
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Chi so nhan vat | health, hunger, hydration, crash, sanity, infection, status, name, day, phaseIndex, weather, location | js/state.js | Hoan thien |
| Sinh ton | Giam doí/khát moi luot; nguong canh bao; tru HP neu = 0 | js/state.js | Hoan thien |
| Trang bi | Vu khi cuan chien, tam xa, bala, dan (nap); hoan doi voi other[] | js/equipment.js, js/state.js | Hoan thien |
| Ky nang | Khong co he thong ky nang biet liet | — | Chua co |
| Level / EXP | Khong co he thong level/EXP | — | Chua co |
| Buff/debuff | Khong co he thong buff/debuff for mal | — | Chua co |
| Trang thai | status hien van ban duoi chi so | js/state.js | Hoan thien |

## C. RPG System
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Inventory | Ba lo phan loai 9 nhom, suc chua theo balo | js/ui.js (renderInventory) | Hoan thien |
| Item | ~200+ vat pham: thuc pham, thuoc, do uong, vu khi, dan, balo, hat giong, ca, vat lieu xay dung... | js/data/items/*.js | Hoan thien |
| Shop | Quan bar (bar-menu.js), cho den dao, tram giao dich Dawn, pho thuong mai lau dai | js/island/*.js | Hoan thien |
| Tien te | royalCoins (xu hoang gia), cigarettes (diep thuoc la), gasoline (xang) | js/state.js | Hoan thien |
| Crafting | Khong co he thong che tao | — | Chua co |
| Loot | pickRandomLoot() theo lootTable cua ban do, weighted rarity | js/config.js | Hoan thien |
| Reward | Thuong nhiem vu: vu khi, dan, diep thuoc la, vat pham dac biet | js/npcs/index.js | Hoan thien |
| Quest | ~30+ nhiem vu NPC chinh, 7 buoc Lao Ma, 4 Liu Ruyan, 5 Yumo, 5 vua lau dai | js/npcs/*.js, js/castle/king-quest.js | Hoan thien |
| Thanh tuu | 26 thanh tuu (song sot, sat zombie, tham hiem, ket cuoc...) | js/data/systems/achievements.js | Hoan thien |

## D. World System
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| World map | 25 ban do, tung ban do co danger, encounterRate, lootTable | js/data/maps/maps.js | Hoan thien |
| Region | Khong co phan vung lon, chi la cac ban do rieng le | js/data/maps/maps.js | Co ban |
| Town | Tram tro an (outpost), thanh bao (castle), dao (island) | js/castle/*.js, js/island/*.js | Hoan thien |
| Dungeon | Duong hamm, vien nghien cuu, thap canh (canh tham...) | js/map-events/*.js | Co ban |
| Random encounter | Cuong dao (robber), NPC ngau nhien, zombie ngau nhien | js/game/exploration.js, js/combat.js | Hoan thien |
| NPC interaction | Doi thoai, tang qua, nhiem vu, giao dich, thu hoi, sua chua, chua nhiem | js/npcs/*.js | Hoan thien |
| Exploration | Kham pha ban do, su kien, nhat vat pham | js/game/exploration.js | Hoan thien |

## E. Combat System
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Combat mode | Turn-based (vong lap while) | js/combat.js | Hoan thien |
| Attack | Cuan chien (lien ket comboRate), tam xa (tieu dan, giam integrity) | js/combat.js | Hoan thien |
| Skill | Khong co ky nang | — | Chua co |
| Defense | Ne tranh (dodge), giap (armor giam 50%), dong bang (frozen giam 50%) | js/combat.js | Hoan thien |
| Enemy AI | Khong co AI phuc tap, chi stats co dinh + ability | js/data/entities/zombies.js | Co ban |
| Damage calculation | Cong thuc damage, crit x2, armor x0.5, frozen x0.5, acid 15-24, selfDestruct | js/combat.js | Hoan thien |
| Combat reward | Loot tu zombie/NPC (thuc pham, thuoc, dan, vu khi), stat zombieKills | js/combat.js | Hoan thien |
| Combat result | Thang (zombie chet) / Thua (nguoi choi chet hoac chay tro nen thanh cong) | js/combat.js | Hoan thien |

## F. Progression System
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Level progression | Khong co level | — | Chua co |
| Skill progression | Khong co ky nang | — | Chua co |
| Character development | Nang cap can cu, trang bi, affinity NPC, danh tinh quy toc | js/base.js, js/npcs/*.js, js/faction.js | Co ban |
| Unlock content | Ket cuoc mo khoa, thanh tuu, ban do moi, castle rank | js/game/endings.js, js/data/systems/achievements.js | Hoan thien |
| Story progression | Cot truyen qua story + options, nhieu nhánh | js/ui.js, js/game/*.js | Hoan thien |
| Chapter/Act | Khong co chuong/act ro ret | — | Chua co |
| Dieu kien mo khoa | Castle rank, vat pham dac biet, hoan thanh quest, ngay song sot | js/faction.js, js/game/endings.js | Hoan thien |

## G. UI/UX
| Tinh nang | Mo ta | File lien quan | Trang thai |
|-----------|-------|----------------|------------|
| Main menu | Trinh duyet -> nhap ten -> menu can cu | index.html, js/ui.js | Hoan thien |
| Game screen | 4 vung (stats, weapon, story, options) | index.html, js/ui.js | Hoan thien |
| Map screen | Danh sach ban do chon | js/game/navigation.js | Hoan thien |
| Character screen | Stats panel, identity panel, weapon panel | js/ui.js | Co ban |
| Inventory | Ba lo phan loai | js/ui.js | Hoan thien |
| Combat UI | Khong co UI chien dau biet liet, dung story + options | js/ui.js, js/combat.js | Co ban |
| Dialog | Hoi thoai NPC theo 5 giai do tinh cam | js/data/dialogues/*.js, js/npcs/*.js | Hoan thien |
| Settings | Che do nhap, che do nhap, nhac game (localStorage) | js/state.js | Hoan thien |
| Save/load | 11 slot (slot 0 auto-save moi 5 ngay), localStorage | js/save.js, js/ui.js | Hoan thien |
| Notification | Story area, status text, alert (javascript) | js/ui.js, js/main.js | Co ban |

## Cap nhat khi sua code
Moi lan sua source, bat buoc cap nhat bang nay neu them/sua tinh nang (xem RULE.md o goc repo).
