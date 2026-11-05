# 📋 Zombie World - Hướng Dẫn Bảo Trì Dữ Liệu (Data Maintenance Guide)

## Nguyên Tắc Cốt Lõi

- **Dữ liệu trò chơi được tổ chức theo module trong thư mục `js/data/`**, mỗi module con chịu trách nhiệm cho các loại dữ liệu khác nhau.
- **`js/config.js` đóng vai trò là điểm tái xuất (re-export) thống nhất**, tất cả dữ liệu được cung cấp thông qua `config.js`, các tệp khác chỉ cần import từ `config.js`.
- Làm mới trình duyệt (F5/Refresh) sau khi sửa đổi các tệp dữ liệu trong `js/data/` để thay đổi có hiệu lực.
- Các tệp khác (`combat.js`, `maps.js`, `state.js`, v.v.) không cần phải sửa đổi.
- Việc thêm vật phẩm mới chỉ yêu cầu thêm mục vào mảng tương ứng của submodule đó.
- Một số hằng số trong `config.js` và `utils.js` được suy dẫn tự động (như `NURSE_MEDICINE_POOL`, `V_TRADE_AMMO_TYPES`, `BUILDING_MATERIAL_NAMES`, `BOSS_NAMES`), chúng sẽ tự động cập nhật khi dữ liệu nguồn thay đổi.

---

## 1. Cấu Trúc Thư Mục Dữ Liệu và Tổng Quan Hằng Số

### 1.1 Cấu Trúc Thư Mục `js/data/`

| Đường dẫn | Nội dung | Các hằng số bao gồm |
|-----------|----------|---------------------|
| `js/data/items/` | Dữ liệu vật phẩm | FOODS, FRUITS, DRINKS, MEDICINES, CIGARETTES, BUILDING_MATERIALS, CROPS, BACKPACK_TYPES, LOOT_BACKPACKS |
| `js/data/weapons/` | Dữ liệu vũ khí | MELEE_WEAPONS, RANGED_WEAPONS, AMMO |
| `js/data/entities/` | Dữ liệu thực thể | ZOMBIES, NPCS, SURVIVOR_NPC, NAMED_NPCS, BOSS_NAMES |
| `js/data/maps/` | Dữ liệu bản đồ | MAPS, MAP_ACTIONS |
| `js/data/dialogues/` | Dữ liệu hội thoại | OUTLAW_DIALOGUES, MECHANIC_DIALOGUES, WOLF_DIALOGUES, WAREHOUSE_GUARD_DIALOGUES, NERVOUS_VETERAN_DIALOGUES, MAP_NPC_INTROS, CASTLE_GUARD_DIALOGUES, CASTLE_KING_DIALOGUES, CASTLE_QUEEN_DIALOGUES, CASTLE_BANKER_DIALOGUES, CASTLE_GUARD_HIGH_DIALOGUES, CASTLE_KING_HIGH_DIALOGUES, CASTLE_QUEEN_HIGH_DIALOGUES, CASTLE_BANKER_HIGH_DIALOGUES, CASTLE_REJECTION_DIALOGUES, DOCTOR_INTRO, DOCTOR_DIALOGUES, ZOMBIE_KING_INTRO, NURSE_ZOMBIE_INTRO, LEADER_DIALOGUES, GUYUE_DIALOGUES, LINHAN_DIALOGUES, YUMO_DIALOGUES |
| `js/data/systems/` | Cấu hình hệ thống | TIME_PHASES, GAME_CONSTANTS, DEFAULT_ITEM_IDS, AFFINITY_THRESHOLDS, AFFINITY_MAX, BASE_LEVELS, WAREHOUSE_LEVELS, CASTLE_RANKS, KING_QUESTS, SPECIAL_ITEMS, TRADER_WEAPON_SHOP, FIXED_LOOT_DROPS, TRADE_TEMPLATES, ACHIEVEMENTS, ENDING_STORIES, SURVIVAL_NOTES |
| `js/data/utils.js` | Dữ liệu tiện ích | CANNED_FOOD_IDS, TOOL_WEAPON_IDS, V_TRADE_AMMO_TYPES, LILI_REWARD_MEDICINE_IDS, XIAOHAN_REWARD_FOOD_IDS |

### 1.2 Danh Sách Hằng Số

Được tổ chức theo cấu trúc mã nguồn, tất cả các hằng số `export` và mục đích sử dụng của chúng:

| # | Tên hằng số | Kiểu | Số lượng | Mục đích sử dụng |
|---|-------------|------|----------|------------------|
| 1 | `TIME_PHASES` | Array | 8 | 8 mốc thời gian trong một ngày |
| 2 | `FOODS` | Array | 19 | Danh sách thức ăn |
| 3 | `FRUITS` | Array | 11 | Danh sách trái cây |
| 4 | `DRINKS` | Array | 12 | Danh sách đồ uống |
| 5 | `MEDICINES` | Array | 14 | Danh sách thuốc men |
| 6 | `NURSE_MEDICINE_POOL` | Array (suy dẫn tự động) | 6 | Kho thuốc của Zombie Y tá, tự động lọc từ `MEDICINES` cho phẩm chất `common` + `uncommon` |
| 7 | `CIGARETTES` | Array | 5 | Danh sách thuốc lá |
| 8 | `BUILDING_MATERIALS` | Array | 6 | Danh sách vật liệu xây dựng |
| 9 | `CROPS` | Array | 15 | Danh sách cây trồng |
| 10 | `MELEE_WEAPONS` | Array | 39 | Danh sách vũ khí cận chiến (bao gồm cả nắm đấm) |
| 11 | `RANGED_WEAPONS` | Array | 44 | Danh sách vũ khí tầm xa |
| 12 | `AMMO` | Array | 13 | Danh sách đạn dược |
| 13 | `ZOMBIES` | Array | 16 | Danh sách zombie |
| 14 | `NPCS` | Object | 4 | Mẫu NPC chạm trán (kẻ ngoài vòng pháp luật / thợ máy / bác sĩ chợ đen) |
| 15 | `SURVIVOR_NPC` | Array | 3 | Cấu hình đầy đủ của NPC Tiền đồn (V / Tiểu Hàm / Lệ Lệ) |
| 16 | `OUTLAW_DIALOGUES` | Array | 15 | Lời thoại kẻ ngoài vòng pháp luật |
| 17 | `MECHANIC_DIALOGUES` | Array | 5 | Lời thoại thợ máy |
| 18 | `WOLF_DIALOGUES` | Array | 5 | Lời thoại sói |
| 19 | `WAREHOUSE_GUARD_DIALOGUES` | Array | 5 | Lời thoại lính gác nhà kho |
| 20 | `NERVOUS_VETERAN_DIALOGUES` | Array | 5 | Lời thoại cựu binh căng thẳng |
| 21 | `DOCTOR_INTRO` | String | 1 | Đoạn văn giới thiệu Bác sĩ Trần |
| 22 | `DOCTOR_DIALOGUES` | Array | 5 | Lời thoại Bác sĩ Trần |
| 23 | `ZOMBIE_KING_INTRO` | String | 1 | Đoạn văn giới thiệu Vua Zombie |
| 24 | `BACKPACK_TYPES` | Object | 14 | Định nghĩa toàn bộ các loại ba lô |
| 25 | `LOOT_BACKPACKS` | Array | 14 | Danh sách ba lô có thể rơi ra (kèm độ hiếm) |
| 26 | `MAPS` | Array | 22 | Danh sách bản đồ (kèm bảng rơi đồ) |
| 27 | `CASTLE_GUARD_DIALOGUES` | Array | 5 | Lời thoại lính gác lâu đài |
| 28 | `CASTLE_KING_DIALOGUES` | Array | 5 | Lời thoại Quốc vương lâu đài |
| 29 | `CASTLE_QUEEN_DIALOGUES` | Array | 5 | Lời thoại Vương hậu lâu đài |
| 30 | `CASTLE_BANKER_DIALOGUES` | Array | 5 | Lời thoại Giám đốc ngân hàng lâu đài |
| 31 | `NURSE_ZOMBIE_INTRO` | String | 1 | Đoạn văn giới thiệu Zombie Y tá |
| 32 | `CANNED_FOOD_IDS` | Array | 8 | Danh sách ID thực phẩm đóng hộp |
| 33 | `SPECIAL_ITEMS` | Object | 18 | Vật phẩm đặc biệt (thẻ thân phận quý tộc / huy hiệu bình minh / huy hiệu im lặng / thẻ tước vị cấp 6 / huy hiệu đội trưởng tiền phong / huy hiệu bậc thầy nông nghiệp / nhật ký Miêu Miêu / máy ghi âm kỳ lạ / thư gửi em gái / thư hồi âm của vương hậu / tín vật định tình / thẻ thông hành lâu đài / chìa khóa xe hơi v.v.) |
| 34 | `BASE_LEVELS` | Array | 5 | Cấp bậc công trình tiền đồn |
| 35 | `WAREHOUSE_LEVELS` | Array | 8 | Cấp độ nhà kho (chỉ số 0 là null) |
| 36 | `AFFINITY_THRESHOLDS` | Array | 5 | Các ngưỡng giai đoạn độ thân mật |
| 37 | `AFFINITY_MAX` | Object | 5 | Giới hạn tối đa độ thân mật của từng NPC |
| 38 | `NAMED_NPCS` | Object | 5 | Cấu hình Boss (Mã Tam / Bóng Tối / Vua Zombie / Giám đốc ngân hàng / Thủ lĩnh tiền đồn) |
| 39 | `BOSS_NAMES` | Array (suy dẫn tự động) | 5 | Danh sách tên Boss, tự động lấy từ `NAMED_NPCS` |
| 40 | `GAME_CONSTANTS` | Object | 22 nhóm | Các thông số game toàn cục (bao gồm các hằng số cấp cao nhất CRASH_MAX / INFECTION_MAX / MAX_HEALTH / TURNS_PER_DAY) |
| 41 | `TOOL_WEAPON_IDS` | Array | 4 | Danh sách ID vũ khí dạng công cụ |
| 42 | `V_TRADE_AMMO_TYPES` | Array (suy dẫn tự động) | 11 | Các loại đạn giao dịch của V, tự động lọc từ `AMMO` ngoại trừ mũi tên |
| 43 | `TRADER_WEAPON_SHOP` | Array | 6 | Danh sách cửa hàng vũ khí chợ đen + giá bán |
| 44 | `FIXED_LOOT_DROPS` | Object | 7 | Cấu hình vật phẩm rơi cố định |
| 45 | `BUILDING_MATERIAL_NAMES` | Object (suy dẫn tự động) | 6 | Bảng ánh xạ ID → tên vật liệu xây dựng, tự động tạo từ `BUILDING_MATERIALS` |
| 46 | `TRADE_TEMPLATES` | Array | 4 | Mẫu giao dịch |
| 47 | `SURVIVAL_NOTES` | Array | 7 | Sổ tay sinh tồn (7 danh mục, tổng cộng 25 mẹo) |
| 48 | `ACHIEVEMENTS` | Array | 19 | Danh sách thành tựu |
| 49 | `ENDING_STORIES` | Object | 7 | Nội dung cốt truyện kết thúc |
| 50 | `DEFAULT_ITEM_IDS` | Object | 5 | ID vật phẩm mặc định |
| 51 | `LILI_REWARD_MEDICINE_IDS` | Array | 4 | Kho thuốc phần thưởng của Lệ Lệ |
| 52 | `XIAOHAN_REWARD_FOOD_IDS` | Array | 3 | Kho thức ăn phần thưởng của Tiểu Hàm |
| 53 | `MAP_ACTIONS` | Object | 23 | Điều hướng hành động bản đồ (hướng theo dữ liệu) |
| 54 | `LEADER_DIALOGUES` | Array | 5 | Lời thoại Thủ lĩnh tiền đồn |
| 55 | `MAP_NPC_INTROS` | Object | 13 | Văn bản giới thiệu NPC trên bản đồ |
| 56 | `CASTLE_REJECTION_DIALOGUES` | Object | 3 | Lời thoại từ chối của Lâu đài (V / Tiểu Hàm / Lệ Lệ) |
| 57 | `CASTLE_GUARD_HIGH_DIALOGUES` | Array | 5 | Lời thoại lính gác lâu đài (khi tước vị cao) |
| 58 | `CASTLE_KING_HIGH_DIALOGUES` | Array | 5 | Lời thoại Quốc vương (khi tước vị cao) |
| 59 | `CASTLE_QUEEN_HIGH_DIALOGUES` | Array | 5 | Lời thoại Vương hậu (khi tước vị cao) |
| 60 | `CASTLE_BANKER_HIGH_DIALOGUES` | Array | 5 | Lời thoại Giám đốc ngân hàng (khi tước vị cao) |
| 61 | `CASTLE_RANKS` | Array | 6 | Hệ thống tước vị quý tộc lâu đài |
| 62 | `KING_QUESTS` | Array | 5 | Chuỗi nhiệm vụ của Quốc vương |

---

## 2. Hướng Dẫn Thao Tác Thường Gặp

### 2.1 Thêm Thức Ăn

Thêm một mục vào cuối mảng `FOODS`.

**Mô tả các trường:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất, không trùng lặp trên toàn cục |
| `name` | String | ✅ | Tên hiển thị |
| `type` | String | ✅ | Cố định là `"food"` |
| `hunger` | Number | ✅ | Lượng độ no hồi phục |
| `hydration` | Number | ❌ | Lượng nước hồi phục, bỏ qua nếu không hồi nước |

**Ví dụ: Thêm "Thịt kho tàu"**

```js
// Thêm vào cuối mảng FOODS
{ id: "braised_pork", name: "Thịt kho tàu", type: "food", hunger: 50, hydration: 10 },
```

Sau khi thêm, hệ thống mã cheat sẽ tự động hỗ trợ định dạng `/get_food_braised_pork_5`. Các bản đồ có `food` trong bảng rơi đồ (`lootTable`) sẽ tự động bao gồm món ăn mới này.

---

### 2.2 Thêm Vũ Khí Cận Chiến

Thêm một mục vào cuối mảng `MELEE_WEAPONS`.

**Mô tả các trường:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất |
| `name` | String | ✅ | Tên hiển thị |
| `type` | String | ✅ | Cố định là `"melee"` |
| `damage` | Number | ✅ | Sát thương cơ bản |
| `durability` | Number | ✅ | Độ bền tối đa (nắm đấm là `Infinity`) |
| `rarity` | String | ❌ | Độ hiếm: `common` / `uncommon` / `rare` / `epic` / `legendary`, nắm đấm không có trường này |
| `comboRate` | Number | ✅ | Tỷ lệ đánh liên hoàn / combo (0~1) |

**Ví dụ: Thêm "Kiếm cưa máy"**

```js
{ id: "chainsaw_sword", name: "Kiếm cưa máy", type: "melee", damage: 110, durability: 90, rarity: "epic", comboRate: 0.16 },
```

**Mối quan hệ giữa Độ hiếm và Tỷ lệ Combo:**

| Độ hiếm | Tỷ lệ Combo | Phạm vi sát thương tham khảo |
|---------|-------------|------------------------------|
| common | 0.05 | 30~48 |
| uncommon | 0.08 | 40~70 |
| rare | 0.12 | 66~90 |
| epic | 0.15 | 99~105 |
| legendary | 0.18 | 118+ |

---

### 2.3 Thêm Vũ Khí Tầm Xa

Thêm vũ khí tầm xa đòi hỏi **đồng thời chú ý đến liên kết đạn dược**, các bước thực hiện:

**Bước 1: Thêm vũ khí vào `RANGED_WEAPONS`**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất |
| `name` | String | ✅ | Tên hiển thị |
| `type` | String | ✅ | Cố định là `"ranged"` |
| `damage` | Number | ✅ | Sát thương cơ bản |
| `integrity` | Number | ✅ | Độ bền / độ hoàn chỉnh (thường là 100) |
| `ammoType` | String | ✅ | Loại đạn sử dụng, phải khớp với `id` trong `AMMO` |
| `critRate` | Number | ✅ | Tỷ lệ bạo kích (0~1) |
| `rarity` | String | ✅ | Độ hiếm |

**Bước 2: Nếu cần loại đạn mới, thêm vào `AMMO`**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | ID duy nhất của đạn |
| `name` | String | ✅ | Tên hiển thị |
| `type` | String | ✅ | Cố định là `"ammo"` |
| `compatibleWith` | String[] | ✅ | Danh sách ID vũ khí tương thích |

**Bước 3: Nếu sử dụng loại đạn có sẵn, hãy thêm ID vũ khí mới vào mảng `compatibleWith` của loại đạn tương ứng**

**Ví dụ: Thêm "SCAR-H" (sử dụng loại đạn 7.62×51mm có sẵn)**

```js
// 1. Thêm vào cuối RANGED_WEAPONS
{ id: "scar_h", name: "SCAR-H", type: "ranged", damage: 85, integrity: 100, ammoType: "7.62x51mm", critRate: 0.28, rarity: "rare" },

// 2. Tìm "7.62x51mm" trong AMMO, thêm "scar_h" vào compatibleWith
{ id: "7.62x51mm", name: "7.62×51mm", type: "ammo", compatibleWith: ["m700", "fal", "ebr14", "sr25", "scar_h"] },
```

**Ví dụ: Thêm "SCAR-H" (sử dụng loại đạn mới 7.62×51mm NATO)**

```js
// 1. Thêm vào cuối RANGED_WEAPONS
{ id: "scar_h", name: "SCAR-H", type: "ranged", damage: 85, integrity: 100, ammoType: "7.62x51mm_nato", critRate: 0.28, rarity: "rare" },

// 2. Thêm loại đạn mới vào cuối AMMO
{ id: "7.62x51mm_nato", name: "7.62×51mm NATO", type: "ammo", compatibleWith: ["scar_h"] },
```

**Tham khảo tỷ lệ bạo kích (theo dòng vũ khí):**

| Dòng vũ khí | Phạm vi bạo kích | Loại đạn |
|-------------|------------------|----------|
| Cung / Nỏ | 0 | Mũi tên (Arrow) |
| Súng ngắn | 0.15~0.20 | 9×19mm / .357 Magnum |
| Tiểu liên (SMG) | 0.18~0.23 | 9×19mm |
| Súng trường (5.56) | 0.22~0.25 | 5.56×45mm NATO |
| Súng trường (7.62×39) | 0.20~0.28 | 7.62×39mm |
| Súng trường chiến đấu (7.62×51) | 0.22~0.32 | 7.62×51mm |
| Súng bắn tỉa | 0.35~0.45 | 7.62×51mm / .300 Win Mag |
| Shotgun | 0.10~0.12 | 12 Gauge |

---

### 2.4 Thêm/Sửa Đổi Ba Lô

Việc chỉnh sửa ba lô yêu cầu duy trì đồng bộ cả hai mảng `BACKPACK_TYPES` và `LOOT_BACKPACKS`.

**Mô tả các trường:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất, giống với `name` |
| `name` | String | ✅ | Tên hiển thị |
| `type` | String | ✅ | Cố định là `"backpack"` (trong `BACKPACK_TYPES` là tên loại ba lô cụ thể) |
| `capacity` | Number | ✅ | Sức chứa ba lô (số ô chứa) |
| `rarity` | String | ❌ | Độ hiếm, chỉ `LOOT_BACKPACKS` mới cần trường này |

#### `BACKPACK_TYPES` — Định nghĩa tất cả các loại ba lô

Đóng vai trò là từ điển ba lô hoàn chỉnh, **toàn bộ các loại ba lô khả dụng** đều được đăng ký tại đây. Ba lô ban đầu khi bắt đầu game mới cũng được chọn từ danh sách này.

```js
export const BACKPACK_TYPES = {
  pocket: { id: "pocket", name: "Túi quần áo", type: "pocket", capacity: 15 },
  // ... các ba lô hiện có
};
```

**Ví dụ thêm mới:**

```js
// Thêm mục mới vào BACKPACK_TYPES
  light_tactical: { id: "light_tactical", name: "Ba lô chiến thuật hạng nhẹ", type: "light_tactical", capacity: 38 },
```

#### `LOOT_BACKPACKS` — Danh sách ba lô có thể rơi ra

Kiểm soát những ba lô nào có thể rơi ra dưới dạng chiến lợi phẩm và trọng số độ hiếm của chúng.

**Ví dụ thêm mới:**

```js
// Thêm vào cuối LOOT_BACKPACKS
{ id: "light_tactical", name: "Ba lô chiến thuật hạng nhẹ", type: "backpack", capacity: 38, rarity: "rare" },
```

**⚠️ Lưu ý:**

1. **Cả hai mảng phải được đồng bộ**: Nếu chỉ thêm vào `LOOT_BACKPACKS` mà không thêm vào `BACKPACK_TYPES`, ba lô mới có thể không được nhận diện chính xác khi đưa vào hành lý của người chơi.
2. **`id` và `name` phải trùng khớp**: `id` và `name` của ba lô phải giống nhau, đây là quy ước logic của trò chơi.
3. **Ba lô mới tự động xuất hiện trong tỷ lệ rơi đồ**: Sau khi thêm vào `LOOT_BACKPACKS`, tất cả các bản đồ có `backpack` trong `lootTable` sẽ ngẫu nhiên rơi ra ba lô này mà không cần sửa đổi các tệp khác.
4. **Phạm vi sức chứa gợi ý**:

| Độ hiếm | Sức chứa tham khảo |
|---------|-------------------|
| common | 18~24 |
| uncommon | 26~32 |
| rare | 36~42 |
| epic | 48~56 |

---

### 2.5 Chỉnh Sửa Rơi Đồ Từ Boss

Chỉnh sửa mục tương ứng trong `FIXED_LOOT_DROPS`.

**Tổng quan về các vật phẩm rơi cố định hiện tại:**

| Tên Khóa (Key) | Nguồn | Vật phẩm rơi hiện tại |
|----------------|-------|----------------------|
| `banker_kill` | Tiêu diệt Giám đốc ngân hàng | Katana (cận chiến) |
| `leader_gift` | Quà tặng từ Thủ lĩnh tiền đồn | Đường Hoành Đao (cận chiến) |
| `doctor_trade` | Giao dịch với Bác sĩ Trần | M700 + 7.62×51mm×30 |
| `outlaw_kill` | Tiêu diệt Mã Tam | AK47 + 7.62×39mm×30 |
| `shadow_kill` | Tiêu diệt Bóng Tối | GP100 + .357 Magnum×20 |
| `space_crate` | Hòm căn cứ không gian | AWM + .300 Win Mag×30 |
| `tunnel_cache` | Hòm bí mật đường hầm | 9×19mm×20 + Lương khô nén |

**Ví dụ: Đổi rơi đồ của Mã Tam từ AK47 thành HK416**

```js
outlaw_kill: { weaponId: "hk416", type: "ranged", ammoId: "5.56x45mm_nato", ammoCount: 30 },
```

**Ví dụ: Đổi rơi đồ của Giám đốc ngân hàng sang vũ khí tầm xa**

```js
banker_kill: { weaponId: "ebr14", type: "ranged", ammoId: "7.62x51mm", ammoCount: 30 },
```

**Lưu ý:** Trường `type` quyết định mảng tra cứu vũ khí, `"melee"` sẽ tra cứu trong `MELEE_WEAPONS`, `"ranged"` sẽ tra cứu trong `RANGED_WEAPONS`. Nếu vật phẩm rơi bao gồm đạn, `ammoId` phải khớp với `id` trong `AMMO`.

---

### 2.6 Chỉnh Sửa Vật Phẩm Của Thương Nhân Chợ Đen

Thêm/xóa các mục trong `TRADER_WEAPON_SHOP`.

**Mô tả các trường:**

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `weaponId` | String | ID vũ khí, phải tồn tại trong `MELEE_WEAPONS` hoặc `RANGED_WEAPONS` |
| `type` | String | `"melee"` hoặc `"ranged"` |
| `costMin` | Number | Giá thuốc lá tối thiểu |
| `costMax` | Number | Giá thuốc lá tối đa |

**Ví dụ: Thêm vật phẩm mới "Dao găm nhỏ"**

```js
{ weaponId: "small_knife", type: "melee", costMin: 3, costMax: 5 },
```

**Ví dụ: Thêm vũ khí tầm xa "MP5"**

```js
{ weaponId: "mp5", type: "ranged", costMin: 15, costMax: 20 },
```

---

### 2.7 Chỉnh Sửa Tỷ Lệ Rơi Đồ Trên Bản Đồ

Điều chỉnh trọng số trong `lootTable` của `MAPS`. Các trọng số mang tính tương đối, không bắt buộc tổng phải bằng 100, nhưng theo quy ước nên để tổng bằng 100 cho rõ ràng.

**Các khóa khả dụng trong `lootTable`:**

| Khóa (Key) | Mô tả | Nguồn dữ liệu tương ứng |
|------------|-------|-------------------------|
| `food` | Thức ăn | `FOODS` |
| `drink` | Đồ uống | `DRINKS` |
| `fruit` | Trái cây | `FRUITS` |
| `cigarette` | Thuốc lá | `CIGARETTES` |
| `medicine` | Thuốc men | `MEDICINES` (tính theo trọng số độ hiếm) |
| `backpack` | Ba lô | `LOOT_BACKPACKS` (tính theo trọng số độ hiếm) |
| `melee` | Vũ khí cận chiến | `MELEE_WEAPONS` (loại trừ nắm đấm, tính theo trọng số độ hiếm) |
| `ranged` | Vũ khí tầm xa | `RANGED_WEAPONS` (tính theo trọng số độ hiếm) |
| `ammo` | Đạn dược | `AMMO` (bản đồ độ nguy hiểm thấp có tỷ lệ ra tên cao hơn) |
| `building` | Vật liệu xây dựng | `BUILDING_MATERIALS` |
| `empty` | Không rơi đồ | — |

**Ví dụ: Tăng tỷ lệ rơi vũ khí tầm xa cho "Đồn cảnh sát bỏ hoang"**

```js
// Gốc
{ id: "abandoned_police_station", name: "Đồn cảnh sát bỏ hoang", danger: "★★★★ Nguy hiểm cao", encounterRate: 0.55,
  lootTable: { melee: 15, ranged: 15, ammo: 25, medicine: 10, backpack: 10, fruit: 10, food: 5, drink: 5, empty: 5 } },

// Sửa đổi: Tăng trọng số súng tầm xa lên 25, giảm đạn xuống 15
{ id: "abandoned_police_station", name: "Đồn cảnh sát bỏ hoang", danger: "★★★★ Nguy hiểm cao", encounterRate: 0.55,
  lootTable: { melee: 15, ranged: 25, ammo: 15, medicine: 10, backpack: 10, fruit: 10, food: 5, drink: 5, empty: 5 } },
```

---

### 2.8 Điều Chỉnh Cân Bằng Trò Chơi

Chỉnh sửa trong `GAME_CONSTANTS`, bao gồm các nhóm con sau:

#### Giới Hạn Toàn Cục (Global Caps)

```js
CRASH_MAX: 100,              // Giới hạn giá trị mệt mỏi / sụp đổ tinh thần (khi >= mức này, nhân vật sụp đổ, không thể chiến đấu/ăn/uống/ngủ)
INFECTION_MAX: 100,          // Giới hạn nhiễm trùng (khi >= mức này, nhân vật tử vong)
```

#### Tham Số Sinh Tồn (`SURVIVAL`)

```js
SURVIVAL: {
  HUNGER_DECAY: 4,              // Độ no tiêu hao mỗi lượt
  HYDRATION_DECAY: 4,           // Độ nước tiêu hao mỗi lượt
  CRASH_THRESHOLD_TURNS: 16,    // Chu kỳ tích tụ mệt mỏi (kích hoạt tăng mệt mỏi mỗi 16 lượt)
  CRASH_PER_CYCLE: 20,          // Mệt mỏi tăng thêm mỗi chu kỳ
  STARVATION_DAMAGE: 10,        // Sát thương do chết đói / mất nước
  INFECTION_THRESHOLD: 50,      // Ngưỡng cảnh báo nguy hiểm nhiễm trùng
  CRASH_STATUS_THRESHOLD: 50,   // Ngưỡng cảnh báo nguy hiểm mệt mỏi
  SEVERE_INJURY_THRESHOLD: 30,  // Ngưỡng trọng thương
},
```

#### Tham Số Chiến Đấu (`COMBAT`)

```js
COMBAT: {
  FLEE_RATE: 0.25,                // Tỷ lệ chạy trốn thành công
  FLEE_RATE_TEXT: "Chạy trốn (25%)", // Văn bản nút chạy trốn (suy dẫn từ FLEE_RATE)
  RANGED_DODGE_RATE: 0.6,         // Tỷ lệ né tránh vũ khí tầm xa
  LIURUYAN_ASSIST_DAMAGE: 20,     // Sát thương hỗ trợ của V
  LIURUYAN_ASSIST_RATE: 0.3,      // Tỷ lệ kích hoạt hỗ trợ của V
  NPC_RANGED_TRIGGER_RATE: 0.4,   // Xác suất NPC dùng vũ khí tầm xa
  INFECTION_ON_HIT: 2,            // Nhiễm trùng tăng thêm khi bị zombie đánh trúng
  SUMMONED_ZOMBIE_DAMAGE: 8,      // Sát thương của zombie được triệu hồi
  NURSE_HEAL_AFTER_COMBAT: 20,    // Lượng máu Y tá hồi phục sau trận chiến
  // Tham số kỹ năng Zombie
  ABILITY_SCREECH_CRASH: 5,       // Tiếng thét tăng mệt mỏi
  ABILITY_TRIP_SKIP_RATE: 0.3,    // Ngáng chân làm mất lượt
  ABILITY_BLIND_MISS_RATE: 0.5,   // Mù mắt làm đánh trượt
  ABILITY_LEAP_DAMAGE_MULT: 0.6,  // Hệ số sát thương vồ tới
  ABILITY_CLOAK_COUNTER_MULT: 0.5,// Hệ số phản kích khi tàng hình
  ABILITY_ARMOR_MULT: 0.5,        // Hệ số giảm sát thương nhờ giáp
  ABILITY_CORRODE_DURABILITY: 5,  // Axit ăn mòn độ bền vũ khí cận chiến
  ABILITY_CORRODE_INTEGRITY: 5,   // Axit ăn mòn độ bền súng tầm xa
  ABILITY_ACID_DAMAGE_MIN: 15,    // Sát thương axit tối thiểu
  ABILITY_ACID_DAMAGE_MAX: 24,    // Sát thương axit tối đa
  ABILITY_CLOAK_AMBUSH_RATE: 0.4, // Tỷ lệ phục kích khi ẩn nấp
  ABILITY_CLOAK_AMBUSH_MULT: 0.8, // Hệ số sát thương phục kích ẩn nấp
  ABILITY_EXPLOSIVE_MULT: 2,      // Hệ số sát thương phát nổ
  // Tham số rơi đồ chiến lợi phẩm
  ZOMBIE_LOOT_DROP_RATE: 0.5,     // Tỷ lệ rơi đồ của Zombie
  ZOMBIE_LOOT_FOOD_RATE: 0.5,     // Tỷ lệ Zombie rơi ra thức ăn
  NPC_LOOT_DROP_RATE: 0.8,        // Tỷ lệ rơi đồ của NPC
  TRADER_CIG_DROP_MIN: 2,         // Thuốc lá rơi tối thiểu từ thương nhân
  TRADER_CIG_DROP_MAX: 5,         // Thuốc lá rơi tối đa từ thương nhân
  // Tham số chiến đấu của NPC
  NPC_RANGED_OPENING_DAMAGE_MIN: 10, // Sát thương mở màn tầm xa tối thiểu của NPC
  NPC_RANGED_OPENING_DAMAGE_MAX: 24, // Sát thương mở màn tầm xa tối đa của NPC
  DEFAULT_NPC_DODGE_RATE: 0.2,       // Tỷ lệ né tránh mặc định của NPC
  RANGED_INTEGRITY_LOSS: 5,          // Súng mất độ bền mỗi khi bị đánh trúng
  RANGED_SHOT_INTEGRITY_LOSS: 1,   // Tiêu hao độ bền khi bắn (mỗi viên -1)
},
```

#### Sát Thương Sự Kiện Bản Đồ (`MAP_EVENTS`)

```js
MAP_EVENTS: {
  FACTORY_EXPLOSION_DAMAGE: 120,      // Sát thương vụ nổ nhà máy
  VETERAN_MISFIRE_DAMAGE: 40,         // Sát thương cựu binh bắn nhầm
  TUNNEL_COLLAPSE_DAMAGE: 80,         // Sát thương sập hầm
  TUNNEL_GAS_DAMAGE: 40,              // Sát thương khí độc đường hầm
  TUNNEL_GAS_INFECTION: 10,           // Nhiễm trùng do khí độc đường hầm
  TUNNEL_ZOMBIE_SWARM_DAMAGE: 60,     // Sát thương bầy zombie trong hầm
  FOOD_LOCKER_HUNGER_RESTORE: 30,     // Hồi độ no từ tủ thực phẩm
  FOOD_LOCKER_HYDRATION_RESTORE: 30,  // Hồi nước từ tủ thực phẩm
  FOOD_LOCKER_BAD_FOOD_CRASH: 44,     // Tăng mệt mỏi do ăn phải thức ăn hỏng
  POLICE_TRAP_DAMAGE: 50,             // Sát thương bẫy đồn cảnh sát
  // Tham số sự kiện bản đồ bổ sung
  TOWER_CRASH_REDUCTION: 10,          // Giảm mệt mỏi khi leo tháp canh
  FRUIT_REGROW_DAYS: 3,              // Số ngày quả mọc lại
  FRUIT_PICK_COUNT: 3,               // Số lượng quả hái được
  CAVE_CIG_RATE: 0.1,                // Tỷ lệ nhặt được thuốc lá trong hang
  CORPSE_COOLDOWN_DAYS: 3,           // Số ngày hồi lại xác chết để nhặt đồ
  FOOD_LOCKER_GOOD_RATE: 0.3,        // Tỷ lệ tủ thực phẩm chứa đồ tốt
  WOLF_TRADE_FOOD_COST: 3,           // Lượng thức ăn đổi đồ với sói
  FACTORY_EXPLOSION_RATE: 0.3,       // Tỷ lệ nổ nhà máy
  RIVER_CRASH_REDUCTION: 10,         // Giảm mệt mỏi bên bờ sông
  WAREHOUSE_BUILDING_COST: 10,       // Chi phí vật liệu sửa nhà kho
  POLICE_TRAP_RATE: 0.7,             // Tỷ lệ dính bẫy đồn cảnh sát
  POLICE_AMMO_MIN: 3,                // Lượng đạn đồn cảnh sát tối thiểu
  POLICE_AMMO_MAX: 8,                // Lượng đạn đồn cảnh sát tối đa
  VETERAN_MISFIRE_RATE: 0.5,         // Tỷ lệ cựu binh bắn nhầm
  VETERAN_AMMO_GIVE_RATE: 0.5,       // Tỷ lệ cựu binh cho đạn
  VETERAN_AMMO_MIN: 3,               // Lượng đạn cựu binh cho tối thiểu
  VETERAN_AMMO_MAX: 7,               // Lượng đạn cựu binh cho tối đa
  TUNNEL_CACHE_RATE: 0.15,           // Tỷ lệ tìm thấy hòm bí mật trong hầm
  TUNNEL_COLLAPSE_RATE: 0.5,         // Tỷ lệ sập hầm
  TUNNEL_GAS_RATE: 0.8,              // Tỷ lệ trúng khí độc trong hầm
  SPACE_CRATE_RATE: 0.05,            // Tỷ lệ nhặt được hòm trạm không gian
},
```

#### Tham Số Lâu Đài (`CASTLE`)

```js
CASTLE: {
  WORK_HUNGER_COST: 18,          // Tiêu hao độ no khi làm việc
  WORK_HYDRATION_COST: 18,       // Tiêu hao nước khi làm việc
  WORK_CRASH_GAIN: 40,           // Mệt mỏi tăng lên khi làm việc
  BALL_CRASH_REDUCTION: 50,      // Giảm mệt mỏi khi dự vũ hội
  ROOM_HEALTH_RESTORE: 50,       // Hồi máu khi nghỉ tại phòng khách
  NOBLE_ID_COST: 25,             // Chi phí mua thẻ căn cước quý tộc (thuốc lá)
  LOAN_TERM_DAYS: 10,            // Thời hạn vay (ngày)
  MERCY_EXTENSION_DAYS: 5,       // Thời gian ân hạn gia hạn (ngày)
  // Tham số lâu đài bổ sung
  BANQUET_HUNGER_RESTORE: 50,    // Hồi độ no từ quốc yến
  BANQUET_HYDRATION_RESTORE: 50, // Hồi nước từ quốc yến
  GARDEN_MEDICINE_RATE: 0.3,     // Tỷ lệ hái được dược liệu trong vườn
  GARDEN_MEDICINE_COUNT: 3,      // Số lượng dược liệu hái được
  TREATMENT_AMOUNTS: [10, 30, 50, 80],   // Mức trị liệu (theo tước vị)
  TREATMENT_RANKS: [3, 4, 5, 6],         // Các tước vị tương ứng với mức trị liệu
  MEETING_RANK_REQUIRED: 5,     // Tước vị tối thiểu để diện kiến
  GARDEN_RANK_REQUIRED: 6,      // Tước vị tối thiểu vào ngự hoa viên
  BANQUET_TIME_COST: 2,         // Thời gian dự yến tiệc (mốc thời gian)
  BALL_TIME_COST: 2,            // Thời gian dự vũ hội (mốc thời gian)
  ROOM_TIME_COST: 3,            // Thời gian nghỉ tại phòng (mốc thời gian)
  MEETING_TIME_COST: 2,         // Thời gian hội đàm (mốc thời gian)
},
```

#### Tham Số Bác Sĩ (`DOCTOR`)

```js
DOCTOR: {
  HEAL_AMOUNT: 120,                  // Máu hồi phục khi chữa trị
  PSYCHOLOGY_CRASH_REDUCTION: 30,    // Giảm mệt mỏi khi tư vấn tâm lý
  TREATMENT_ITEM_COST: 5,            // Chi phí vật phẩm để chữa trị
  PSYCHOLOGY_FOOD_COST: 3,           // Chi phí thức ăn để tư vấn tâm lý
  SERUM_TRADE_COST: 50,              // Chi phí đổi huyết thanh (thuốc lá)
},
```

#### Tham Số Tên Lửa (`ROCKET`)

```js
ROCKET: {
  QUEST2_ENERGY_COST: 15,              // Chi phí năng lượng thuần khiết nhiệm vụ 2 (đã giảm từ 30 xuống)
  QUEST3_MEDICINE_COST: 10,            // Chi phí thuốc nhiệm vụ 3
  QUEST3_FOOD_COST: 10,                // Chi phí thức ăn nhiệm vụ 3
  QUEST3_DRINKS_COST: 10,              // Chi phí đồ uống nhiệm vụ 3
  IMPROVED_SERUM_INFECTION_REDUCTION: 90, // Lượng nhiễm trùng giảm nhờ huyết thanh cải tiến
  HOPE_AFFINITY_REQUIRED: 150,         // Độ thân mật cần để mở kết thúc Hy Vọng
  DISMANTLE_WEAPON_ID: "big_wrench",  // Vũ khí yêu cầu để tháo dỡ bom hạt nhân
  DISMANTLE_BACKPACK_ID: "dimensional_storage", // Ba lô yêu cầu để tháo dỡ bom hạt nhân
  AWM_ID: "awm",                       // ID vũ khí AWM
},
```

#### Tham Số Đảo Biển (`ISLAND`)

```js
ISLAND: {
  REST_HEALTH_RESTORE: 30,           // Máu hồi phục khi nghỉ ngơi trên đảo
  REST_CRASH_REDUCTION: 30,          // Giảm mệt mỏi khi nghỉ ngơi trên đảo
  REST_TIME_COST: 4,                 // Thời gian nghỉ ngơi trên đảo (mốc)
  YACHT_GASOLINE_COST: 1,            // Tiêu hao xăng khi đi du thuyền
  YACHT_TIME_COST: 8,                // Thời gian đi du thuyền (mốc)
},
```

#### Tham Số Câu Cá (`FISHING`)

```js
FISHING: {
  CATCH_RATE: 0.6,                   // Tỷ lệ câu cá thành công
  CATCH_COUNT_MIN: 1,                // Số lượng cá câu được tối thiểu
  CATCH_COUNT_MAX: 3,                // Số lượng cá câu được tối đa
},
```

#### Tham Số Công Tước Vũ Mặc (`YUMO`)

```js
YUMO: {
  TRADE_ROYAL_COIN_COST: 5,          // Tiền hoàng gia tiêu tốn khi giao dịch với Vũ Mặc
  LOAN_INTEREST_RATE: 0.1,           // Lãi suất ngân hàng trên đảo
  LOAN_TERM_DAYS: 30,                // Kỳ hạn trả nợ ngân hàng đảo
  LOAN_OVERDUE_PENALTY: 0.1,         // Phạt quá hạn nợ ngân hàng đảo
},
```

#### Xác Suất Thời Tiết (`WEATHER`)

```js
WEATHER: {
  PROBABILITIES: { sunny: 0.40, cloudy: 0.30, rainy: 0.10, hot: 0.05, foggy: 0.05, acid_rain: 0.05, sandstorm: 0.05 },
  EFFECTS: {
    rainy: { crash: 2 },       // Trời mưa tăng mệt mỏi
    hot: { hydration: -5 },    // Nắng gắt hao thêm nước
    sandstorm: { health: -2 }, // Bão cát gây sát thương máu
  },
},
```

#### Tham Số Chạm Trán (`ENCOUNTER`)

```js
ENCOUNTER: {
  NPC_RATE: 0.1,                                                    // Tỷ lệ chạm trán NPC
  NPC_DISTRIBUTION: { survivor: 0.6, wandering_trader: 0.2, doctor: 0.1, bandit: 0.1 },  // Phân bố các loại NPC
},
```

#### Tham Số Giấc Ngủ (`SLEEP`)

```js
SLEEP: {
  CRASH_REDUCTION_MIN: 10,       // Mức giảm mệt mỏi tối thiểu
  CRASH_REDUCTION_MAX: 25,       // Mức giảm mệt mỏi tối đa
  HEALTH_RECOVERY_MIN: 20,       // Hồi máu tối thiểu
  HEALTH_RECOVERY_MAX: 40,       // Hồi máu tối đa
  TIME_COST: 4,                  // Thời gian ngủ (mốc)
},
```

#### Tham Số Tiền Đồn (`OUTPOST`)

```js
OUTPOST: {
  WORK_HUNGER_COST: 6,           // Tiêu hao độ no khi làm việc tại tiền đồn
  WORK_HYDRATION_COST: 6,        // Tiêu hao nước khi làm việc tại tiền đồn
  WORK_CRASH_GAIN: 5,            // Mệt mỏi tăng khi làm việc tại tiền đồn
  HONOR_WEAPON_ID: "vector",     // Vũ khí khen thưởng danh dự
  HONOR_AMMO_ID: "9x19mm",       // Đạn khen thưởng danh dự
  HONOR_AMMO_COUNT: 60,          // Số lượng đạn khen thưởng danh dự
  LEADER_CHAT_AFFINITY: 1,       // Độ thân mật tăng khi trò chuyện với thủ lĩnh
  LEADER_GIFT_AFFINITY: 1,       // Độ thân mật tăng khi tặng quà thủ lĩnh
},
```

#### Tham Số Căn Cứ (`BASE`)

```js
BASE: {
  UPGRADE_TIME_COST: 8,          // Thời gian nâng cấp căn cứ (mốc)
  WAREHOUSE_BASE_CAP: 30,        // Sức chứa cơ bản của nhà kho
  WAREHOUSE_CAP_PER_LEVEL: 10,   // Sức chứa tăng thêm mỗi cấp nhà kho
  MAX_WAREHOUSE_LEVEL: 7,        // Cấp độ nhà kho tối đa
  WAREHOUSE_UPGRADE_TIME: 2,     // Thời gian nâng cấp nhà kho (mốc)
  FARMING_CROP_SLOTS: 5,         // Số ô trồng trọt
},
```

#### Tham Số Kết Cục (`ENDINGS`)

```js
ENDINGS: {
  DAY_999_THRESHOLD: 999,               // Ngưỡng ngày mở kết thúc 999 ngày
  NEWFORCE_WEAPON_ID: "fearless_blade",       // Vũ khí thưởng kết cục Lực Lượng Mới
  ENDING_999_BACKPACK_ID: "dimensional_storage", // Ba lô thưởng kết cục 999 ngày
  NEWFORCE_BOSS_NAME: "New Force Leader",     // Tên Boss Thủ lĩnh Lực Lượng Mới
  ALL_IDS: ["ending_death", "ending_999", "ending_prince", "ending_captain", "ending_newforce", "ending_space", "ending_hope", "ending_stay", "ending_farming", "ending_love_hate", "ending_food", "ending_elopement"],  // Danh sách ID toàn bộ các kết cục
},
```

#### Tham Số Liễu Như Yên (`LIURUYAN`)

```js
LIURUYAN: {
  RESCUE_DEADLINE_DAYS: 30,      // Thời hạn chót giải cứu (ngày)
  SERUM_COST: 3,                 // Số lượng huyết thanh tiêu hao
},
```

#### Tham Số Zombie Y Tá (`NURSE_ZOMBIE`)

```js
NURSE_ZOMBIE: {
  BRING_HOME_AFFINITY: 150,      // Độ thân mật tăng khi đưa về nhà
  CANNED_AFFINITY_MIN: 2,        // Độ thân mật tối thiểu khi cho ăn đồ hộp
  CANNED_AFFINITY_MAX: 3,        // Độ thân mật tối đa khi cho ăn đồ hộp
  MAX_AFFINITY: 150,             // Giới hạn độ thân mật tối đa
},
```

#### Tham Số Độ Thân Mật NPC (`NPC`)

```js
NPC: {
  GIFT_AFFINITY_FOOD: 3,         // Thân mật tăng khi tặng thức ăn
  GIFT_AFFINITY_DRINKS: 3,       // Thân mật tăng khi tặng đồ uống
  GIFT_AFFINITY_MEDICINE: 5,     // Thân mật tăng khi tặng thuốc
  GIFT_AFFINITY_CARGO: 2,        // Thân mật tăng khi tặng hàng hóa
  LILI_GIFT_AFFINITY_FOOD: 6,    // Thân mật tăng khi tặng đồ ăn cho Lệ Lệ
  LILI_GIFT_AFFINITY_MEDICINE: 10, // Thân mật tăng khi tặng thuốc cho Lệ Lệ
  QUEST_AFFINITY_REWARD: 5,      // Thân mật thưởng khi hoàn thành nhiệm vụ
  MAP_NPC_GIFT_AFFINITY: 2,      // Thân mật tăng khi tặng quà cho NPC trên bản đồ
  CHAT_AFFINITY: 1,              // Thân mật tăng khi trò chuyện
  V_TRADE_AMMO_MIN: 3,           // Lượng đạn giao dịch tối thiểu của V
  V_TRADE_AMMO_MAX: 12,          // Lượng đạn giao dịch tối đa của V
  LILI_TRADE_MED_COUNT_MIN: 1,   // Số lượng thuốc đổi tối thiểu của Lệ Lệ
  LILI_TRADE_MED_COUNT_MAX: 3,   // Số lượng thuốc đổi tối đa của Lệ Lệ
},
```

#### Tham Số Thành Tựu (`ACHIEVEMENTS`)

```js
ACHIEVEMENTS: {
  ZOMBIE_KILLS: [                    // Thành tựu diệt zombie
    { threshold: 50, id: "zombie_hunter" },
    { threshold: 200, id: "zombie_slayer" },
  ],
  SURVIVAL_DAYS: [                   // Thành tựu số ngày sinh tồn
    { threshold: 10, id: "survive_10" },
    { threshold: 30, id: "survive_30" },
    { threshold: 100, id: "survive_100" },
  ],
  EXPLORATION_MAPS: [                // Thành tựu khám phá bản đồ
    { threshold: 10, id: "explorer" },
    { threshold: 20, id: "collector" },
  ],
},
```

**Lưu ý:** Các ngưỡng thành tựu hiện nay được định hướng theo dữ liệu bởi `GAME_CONSTANTS.ACHIEVEMENTS`. Các hàm `checkSurvivalAchievements` và `checkExplorationAchievements` trong `game.js` sẽ lặp qua các mảng này để tự động kiểm tra. Việc bổ sung các cấp độ thành tựu mới chỉ cần thêm mục tại đây, không cần sửa đổi mã logic.

#### Tham Số Rơi Đồ (`LOOT`)

```js
LOOT: {
  RARITY_WEIGHTS: { common: 20, uncommon: 12, rare: 6, epic: 3, legendary: 1 },
  ARROW_CHANCE_LOW: 0.5,         // Tỷ lệ rơi tên ở bản đồ nguy hiểm thấp
  ARROW_CHANCE_MID: 0.3,         // Tỷ lệ rơi tên ở bản đồ nguy hiểm trung bình
  ARROW_CHANCE_HIGH: 0.1,        // Tỷ lệ rơi tên ở bản đồ nguy hiểm cao
  ARROW_COUNT_MIN: 3,            // Lượng tên rơi tối thiểu
  ARROW_COUNT_MAX: 8,            // Lượng tên rơi tối đa
  AMMO_COUNT_MIN: 5,             // Lượng đạn rơi tối thiểu
  AMMO_COUNT_MAX: 24,            // Lượng đạn rơi tối đa
},
```

#### Tham Số Giao Thương (`TRADING`)

```js
TRADING: {
  AMMO_PER_CIG_MIN: 3,           // Lượng đạn tối thiểu mỗi điếu thuốc
  AMMO_PER_CIG_MAX: 6,           // Lượng đạn tối đa mỗi điếu thuốc
},
```

#### Tham Số Bản Đồ (`MAP`)

```js
MAP: {
  DANGER_MESSAGES: {             // Văn bản mô tả cấp độ nguy hiểm
    "☆ An toàn": "Nơi này trông khá an toàn, thích hợp để thu thập tài nguyên.",
    "★ Dễ dàng": "Thỉnh thoảng có vài con zombie lảng vảng, hãy giữ cảnh giác.",
    "★★ Nguy hiểm thấp": "Zombie thỉnh thoảng hoạt động, cần cẩn thận một chút.",
    "★★★ Nguy hiểm trung bình": "Zombie xuất hiện thường xuyên, hãy di chuyển cẩn trọng.",
    "★★★★ Nguy hiểm cao": "Rất nhiều zombie tụ tập, cực kỳ nguy hiểm!",
    "★★★★★ Cực độ": "Đây thực sự là địa ngục, đừng dại dột đến nếu chưa chuẩn bị kỹ!",
    "★★★★★★ Hỏa ngục": "Vùng đất chết, chỉ có kẻ mạnh nhất mới có thể sống sót trở về!",
  },
},
```

---

### 2.9 Thêm Bản Đồ

Thêm mục mới vào mảng `MAPS`.

**Mô tả các trường:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất, đồng thời dùng để gán nhóm zombie |
| `name` | String | ✅ | Tên hiển thị |
| `danger` | String | ✅ | Văn bản hiển thị mức độ nguy hiểm |
| `encounterRate` | Number | ✅ | Tỷ lệ chạm trán (0~1), 0 nghĩa là không chạm trán zombie |
| `noZombie` | Boolean | ❌ | Đặt thành `true` nếu bản đồ hoàn toàn không có zombie |
| `lootTable` | Object | ✅ | Bảng trọng số rơi đồ |

**Tham khảo cấp độ nguy hiểm:**

| Cấp độ | Giá trị `danger` | Tham khảo `encounterRate` |
|--------|-------------------|----------------------------|
| An toàn | `"☆ Safe"` | 0 |
| Dễ dàng | `"★ Easy"` | 0.03~0.10 |
| Nguy hiểm thấp | `"★★ Low Risk"` | 0.12~0.20 |
| Nguy hiểm trung bình | `"★★★ Medium Risk"` | 0.35~0.40 |
| Nguy hiểm cao | `"★★★★ High Risk"` | 0.50~0.55 |
| Cực độ | `"★★★★★ Extreme"` | 0.60~0.70 |
| Hỏa ngục | `"★★★★★★ Inferno"` | 0.80~0.90 |

**Ví dụ: Thêm "Ga tàu điện ngầm bỏ hoang"**

```js
{
  id: "abandoned_subway",
  name: "Ga tàu điện ngầm bỏ hoang",
  danger: "★★★★ High Risk",
  encounterRate: 0.5,
  lootTable: { ammo: 20, ranged: 10, melee: 10, food: 15, drink: 15, medicine: 10, fruit: 10, backpack: 5, empty: 5 }
},
```

**⚠️ Lưu ý quan trọng:** Sau khi thêm bản đồ mới, bạn cũng cần thêm ID bản đồ đó vào bảng ánh xạ nhóm zombie trong đối tượng `poolMap` của hàm `getRandomZombie`, nếu không bản đồ mới sẽ mặc định dùng nhóm zombie nguy hiểm thấp:

```js
const poolMap = {
  // ... các ánh xạ hiện có ...
  "abandoned_subway": highPool,  // Thêm dòng này
};
```

---

### 2.10 Chỉnh Sửa Nhiệm Vụ NPC

Chỉnh sửa trong đối tượng `quests` của `SURVIVOR_NPC`.

**Mô tả các trường của nhiệm vụ:**

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `name` | String | Tên nhiệm vụ |
| `desc` | String | Mô tả nhiệm vụ |
| `reqAffinity` | Number | Độ thân mật yêu cầu |
| `require` | Object | Yêu cầu giao nộp |
| `reward` | Object | Phần thưởng |
| `story` | String | Nội dung cốt truyện nhiệm vụ |

**Các định dạng `require` được hỗ trợ:**

```js
// Thức ăn + đồ uống
require: { food: 1, drinks: 1 }

// Loại thuốc cụ thể
require: { medicine: 5, medicineId: "tourniquet" }

// Loại đồ uống cụ thể
require: { drinks: 10, drinkId: "pure_milk" }

// Kết hợp nhiều vật phẩm
require: { items: [{ type: "medicine", id: "medical_kit", count: 6 }, { type: "medicine", id: "anti_infection_serum", count: 6 }] }

// Mỗi loại thuốc N món
require: { allMedicine: 2 }

// Mỗi loại đồ hộp 1 món
require: { allCanned: 1 }

// Mỗi loại trái cây 1 quả
require: { allFruits: 1 }

// Mỗi loại đồ uống + mỗi loại thức ăn 1 món
require: { allDrinks: 1, allFoods: 1 }
```

**Các định dạng `reward` được hỗ trợ:**

```js
// Vật phẩm đơn lẻ
reward: { item: "small_knife", desc: "Dao găm nhỏ ×1" }

// Vật phẩm + đạn
reward: { item: "p226", ammo: { type: "9x19mm", count: 50 }, desc: "P226 ×1 + 9×19mm ×50" }

// Nhiều vật phẩm
reward: { itemStack: [{ id: "surgery_kit", count: 3 }], desc: "Bộ dụng cụ phẫu thuật ×3" }

// Thuốc lá + đạn
reward: { cigarettes: 20, ammo: { type: "9x19mm", count: 50 }, desc: "Thuốc lá ngẫu nhiên ×20 + 9×19mm ×50" }
```

**Ví dụ: Sửa đổi phần thưởng nhiệm vụ v1 của V**

```js
v1: { name: "Nhiệm vụ lần đầu gặp gỡ", desc: "Nộp 1 thức ăn + 1 đồ uống", reqAffinity: 0, require: { food: 1, drinks: 1 }, reward: { item: "big_wrench", desc: "Cờ lê lớn ×1" }, story: ""Đói bụng thì không thể chiến đấu được. Cho tôi đồ ăn, tôi sẽ cho bạn công cụ." Cô ấy gõ gõ chiếc cờ lê lên tường." },
```

---

### 2.11 Chỉnh Sửa Vật Phẩm Mặc Định

Chỉnh sửa trong `DEFAULT_ITEM_IDS`.

```js
export const DEFAULT_ITEM_IDS = {
  melee: "fist",                  // Vũ khí cận chiến mặc định
  food: "compressed_biscuit",     // Thức ăn mặc định
  drink: "mineral_water",         // Đồ uống mặc định
  seed: "seed",                   // Hạt giống mặc định (tương ứng với hạt giống trong BUILDING_MATERIALS)
  serum: "anti_infection_serum",  // Huyết thanh mặc định
};
```

**Lưu ý:** Việc sửa đổi giá trị `melee` sẽ ảnh hưởng đến vũ khí ban đầu khi bắt đầu chơi game mới, ID này bắt buộc phải tồn tại trong `MELEE_WEAPONS`.

---

### 2.12 Chỉnh Sửa Kho Đổi Đồ Của NPC

#### Kho Thuốc Đổi Thưởng Của Lệ Lệ (Lili)

```js
export const LILI_REWARD_MEDICINE_IDS = ["tourniquet", "debridement_powder", "antibiotics", "anti_infection_serum"];
```

Thêm ID thuốc mới sẽ mở rộng phạm vi phần thưởng đổi thuốc của Lệ Lệ:

```js
export const LILI_REWARD_MEDICINE_IDS = ["tourniquet", "debridement_powder", "antibiotics", "anti_infection_serum", "surgery_kit"];
```

#### Kho Thức Ăn Đổi Thưởng Của Tô Tiểu Hàm (Xiaohan)

```js
export const XIAOHAN_REWARD_FOOD_IDS = ["compressed_biscuit", "wheat_bread", "beef_canned"];
```

Thêm ID thức ăn mới sẽ mở rộng phạm vi phần thưởng đổi thức ăn của Tiểu Hàm:

```js
export const XIAOHAN_REWARD_FOOD_IDS = ["compressed_biscuit", "wheat_bread", "beef_canned", "military_rations_canned"];
```

---

### 2.13 Chỉnh Sửa Sổ Tay Sinh Tồn

Thêm/xóa danh mục hoặc các mục hướng dẫn trong mảng `SURVIVAL_NOTES`.

**Mô tả cấu trúc dữ liệu:**

```js
SURVIVAL_NOTES = [
  {
    id: "category_id",        // Định danh duy nhất, dùng để điều hướng
    name: "Tên danh mục",      // Tiêu đề danh mục hiển thị
    entries: [                // Mảng các mục trong danh mục này
      { title: "Tiêu đề mục", content: "Nội dung mục" },
      ...
    ]
  },
  ...
]
```

**Các mục động:** Một số mục trong sổ tay sinh tồn được tạo động bằng mã lệnh, không nằm cố định trong dữ liệu `SURVIVAL_NOTES`:
- **Tiến độ Lực Lượng Mới** (`note_newforce`): Tự động xuất hiện khi người chơi hoàn thành bất kỳ điều kiện tiên quyết nào của Lực Lượng Mới, hiển thị tiến độ hoàn thành 6 điều kiện (X/6).
- **Giải cứu Liễu Như Yên** (`note_liuruyan`): Tự động xuất hiện khi người chơi phát hiện Liễu Như Yên, hiển thị số ngày còn lại để giải cứu.

Các mục động này được sinh ra bởi các hàm `buildNewforceStory(state)` và `buildLiuruyanStory(state)` trong file `game/notes.js`.

**Ví dụ: Thêm một mục mới vào danh mục "Sinh tồn cơ bản"**

```js
{
  id: "basic_survival",
  name: "Sinh tồn cơ bản",
  entries: [
    { title: "Thời gian và Lượt", content: "Một ngày được chia thành 8 mốc thời gian..." },
    { title: "Các chỉ số cốt lõi", content: "Độ no và độ nước..." },
    { title: "Nơi trú ẩn và An toàn", content: "Tại nhà..." },
    // Mục mới
    { title: "Hồi phục bằng Giấc ngủ", content: "Ngủ giúp hồi phục thể lực, giảm mệt mỏi và bỏ qua các mốc thời gian ban đêm." },
  ]
}
```

**Ví dụ: Thêm danh mục mới**

```js
// Thêm vào cuối mảng SURVIVAL_NOTES
{
  id: "crafting",
  name: "Hệ thống chế tạo",
  entries: [
    { title: "Chế tạo cơ bản", content: "Thu thập nguyên liệu để chế tạo các trang bị và vật phẩm nâng cao." },
  ]
}
```

**Lưu ý:** Nếu thêm danh mục mới, bạn cần kiểm tra phần xử lý điều hướng danh mục trong hàm `handleSurvivalNotesAction` tại `game.js`, tuy nhiên ở tầng dữ liệu thì chỉ cần sửa `config.js`.

---

### 2.14 Chỉnh Sửa Cấu Hình Thành Tựu

Thêm/xóa các mục trong mảng `ACHIEVEMENTS`.

**Mô tả cấu trúc dữ liệu:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `id` | String | ✅ | Định danh duy nhất, dùng để kiểm tra mở khóa thành tựu |
| `name` | String | ✅ | Tên hiển thị của thành tựu |
| `desc` | String | ✅ | Văn bản mô tả thành tựu |
| `icon` | String | ✅ | Biểu tượng thành tựu (khuyến nghị dùng emoji) |

**Ví dụ: Thêm thành tựu mới**

```js
// Thêm vào cuối mảng ACHIEVEMENTS
{ id: "rich_man", name: "Đại gia", desc: "Tích lũy thu thập được 100 điếu thuốc lá", icon: "🚬" },
```

**⚠️ Quan trọng:** Đối với các thành tựu về số ngày sinh tồn và khám phá bản đồ, các ngưỡng hiện nay được điều khiển bằng dữ liệu thông qua `GAME_CONSTANTS.ACHIEVEMENTS.SURVIVAL_DAYS` và `GAME_CONSTANTS.ACHIEVEMENTS.EXPLORATION_MAPS`, các hàm kiểm tra trong `game.js` sẽ tự động lặp qua các mảng này. Việc bổ sung cấp độ thành tựu mới chỉ cần thêm mục vào `constants.js`. Đối với các thành tựu khác (như số lượng hạ gục, nâng cấp căn cứ, v.v.), bạn vẫn cần bổ sung logic kiểm tra thủ công trong `game.js`.

**Bảng tra cứu ID thành tựu hiện có vs Điều kiện mở khóa:**

| ID Thành tựu | Điều kiện | Thời điểm kiểm tra |
|--------------|-----------|--------------------|
| `survive_10` | Số ngày sinh tồn >= 10 | Bắt đầu ngày mới |
| `survive_30` | Số ngày sinh tồn >= 30 | Bắt đầu ngày mới |
| `survive_100` | Số ngày sinh tồn >= 100 | Bắt đầu ngày mới |
| `zombie_hunter` | Tiêu diệt zombie >= 50 | Thắng trận chiến |
| `zombie_slayer` | Tiêu diệt zombie >= 200 | Thắng trận chiến |
| `explorer` | Khám phá bản đồ >= 10 | Khám phá bản đồ |
| `collector` | Khám phá toàn bộ bản đồ | Khám phá bản đồ |
| `base_upgrade` | Căn cứ đạt cấp tối đa | Nâng cấp căn cứ |
| `companion_recruit` | Chiêu mộ người đồng hành đầu tiên | Giải cứu đồng hành |
| `boss_killer` | Đánh bại Boss đầu tiên | Đánh bại Boss |
| `noble_status` | Sở hữu căn cước quý tộc | Mua tại lâu đài |
| `dawn_member` | Gia nhập Tiền đồn Bình Minh | Gia nhập tiền đồn |

---

## 3. Cấu Trúc Thư Mục `js/data/` và Hướng Dẫn Mở Rộng

### 3.1 Nguyên Tắc Tổ Chức Thư Mục

Thư mục `js/data/` được phân chia thành các thư mục con theo loại dữ liệu, mỗi thư mục con chứa:

- **Các tệp dữ liệu**: Định nghĩa các hằng số và dữ liệu cụ thể.
- **`index.js`**: Xuất thống nhất toàn bộ các hằng số trong thư mục đó.

`js/data/index.js` đóng vai trò là điểm vào cấp cao nhất, tái xuất tất cả các hằng số từ file `index.js` của các thư mục con. Sau đó `js/config.js` sẽ import và tái xuất từ `js/data/index.js`, đồng thời cung cấp các hàm tiện ích.

### 3.2 Chuỗi Xuất Khẩu (Export Chain)

```
Tệp dữ liệu (ví dụ: foods.js)
  → index.js của thư mục con (ví dụ: items/index.js)
    → js/data/index.js
      → js/config.js (tái xuất + hàm tiện ích)
        → Các module khác (như game.js, combat.js, v.v.)
```

### 3.3 Cách Thêm Tệp Dữ Liệu Mới

**Bước 1: Tạo tệp dữ liệu trong thư mục con tương ứng**

Ví dụ: thêm tệp mới `crops-ext.js` trong `js/data/items/`:

```js
// js/data/items/crops-ext.js
export const SPECIAL_CROPS = [
  { id: "mutant_seed", name: "Hạt giống đột biến", matureTurns: 10, yield: { food: "universal_injection" } },
];
```

**Bước 2: Thêm lệnh export trong `index.js` của thư mục con**

```js
// js/data/items/index.js
export { FOODS, FRUITS } from './foods.js';
export { DRINKS } from './drinks.js';
// ... các export hiện có ...
export { SPECIAL_CROPS } from './crops-ext.js';  // Mới thêm
```

**Bước 3: Import vào `js/config.js` (nếu cần dùng trong hàm tiện ích)**

Nếu hằng số mới cần được sử dụng trong các hàm tiện ích của `config.js`, bạn cần thêm vào câu lệnh import; nếu không, lệnh `export * from './data/index.js'` sẽ tự động tái xuất hằng số đó mà không cần làm thêm thao tác nào.

### 3.4 Cách Thêm Thư Mục Con Mới

Nếu cần tạo một danh mục dữ liệu hoàn toàn mới (ví dụ: `js/data/quests/`):

**Bước 1: Tạo thư mục con và các tệp**

```
js/data/quests/
  ├── index.js
  └── main-quests.js
```

**Bước 2: Thêm lệnh export vào `js/data/index.js`**

```js
export * from './quests/index.js';
```

**Bước 3: Export các hằng số trong `index.js` của thư mục con**

```js
// js/data/quests/index.js
export { MAIN_QUESTS } from './main-quests.js';
```

### 3.5 Các Điểm Lưu Ý

1. **Toàn bộ hằng số cuối cùng đều được export qua `config.js`**: Các module khác nên import từ `config.js`, không nên import trực tiếp từ các thư mục con của `js/data/`.
2. **Các hằng số suy dẫn trong `utils.js`**: Các hằng số phái sinh như `CANNED_FOOD_IDS`, `TOOL_WEAPON_IDS`, `V_TRADE_AMMO_TYPES` được định nghĩa trong `js/data/utils.js`, chúng phụ thuộc vào dữ liệu của các submodule khác.
3. **Sau khi thêm thư mục con mới**: Đảm bảo đã thêm câu lệnh `export *` vào `js/data/index.js`, nếu không các hằng số sẽ không được đưa ra ngoài.
4. **Quy tắc đặt tên tệp**: Sử dụng chữ thường và dấu gạch nối (ví dụ: `building-materials.js`, `map-actions.js`).

---

## 4. Giải Thích Hệ Thống Độ Hiếm

Trò chơi áp dụng hệ thống phân cấp 5 mức độ hiếm, ảnh hưởng đến tỷ lệ rơi đồ và chỉ số vũ khí:

### Các Cấp Độ Hiếm

| Độ hiếm (Mã) | Tiếng Anh | Tiếng Việt | Trọng số rơi | Màu sắc tham khảo |
|--------------|-----------|------------|--------------|-------------------|
| common | common | Thường | 20 | Trắng / Xám |
| uncommon | uncommon | Tốt (Không phổ biến) | 12 | Xanh lá |
| rare | rare | Hiếm | 6 | Xanh dương |
| epic | epic | Sử thi | 3 | Tím |
| legendary | legendary | Huyền thoại | 1 | Cam / Vàng kim |

### Giải Thích Trọng Số Rơi Đồ

Trọng số rơi đồ được sử dụng để chọn ngẫu nhiên có trọng số trong hàm `pickRandomLoot`. Trọng số càng cao = xác suất xuất hiện càng lớn. Công thức tính xác suất thực tế:

```
Tỷ lệ của độ hiếm = Trọng số độ hiếm này / Tổng trọng số tất cả độ hiếm
```

Lấy vũ khí cận chiến làm ví dụ (tổng trọng số = 20 + 12 + 6 + 3 + 1 = 42):

| Độ hiếm | Trọng số | Tỷ lệ xấp xỉ |
|---------|----------|--------------|
| common | 20 | 47.6% |
| uncommon | 12 | 28.6% |
| rare | 6 | 14.3% |
| epic | 3 | 7.1% |
| legendary | 1 | 2.4% |

### Quan Hệ Giữa Tỷ Lệ Đòn Kép (Combo Rate) và Độ Hiếm Của Vũ Khí Cận Chiến

| Độ hiếm | Tỷ lệ Combo | Ví dụ vũ khí hiện có |
|---------|-------------|----------------------|
| (Nắm đấm) | 0 | Nắm đấm |
| common | 0.05 | Dao làm bếp, Gậy gỗ, Cuốc, Búa nhỏ, Chảo rán, Cờ lê lớn, Gậy bóng chày, Ống sắt, Xẻng |
| uncommon | 0.08 | Dao găm nhỏ, Dao mổ thịt, Dùi cui, Xà bén, Búa nhổ đinh, Rìu tay, Rìu cứu hỏa, Dao săn, Dao quân đội |
| rare | 0.12 | Nắm đấm gai (Brass Knuckles), Dao rựa Machete, Trảm Mã Đao, Roi chín khúc, Kiếm giác đấu, Chùy sao chổi (Meteor Hammer), Dao ngắn Wakizashi thép, Ảo Long Kiếm, Trường thương kỵ binh |
| epic | 0.15 | Song đao, Kiếm Mã Lai (Kris), Katana, Đường Hoành Đao, Cưa máy |
| legendary | 0.18~0.20 | Kiếm Dũng Giả (Hero's Sword), Kiếm Càn Khôn, Kiếm Hoàng Đế, **Lưỡi Đao Vô Úy (Fearless Blade)**, Ngân Kiếm Hoàng Gia (0.20) |

### Phạm Vi Tỷ Lệ Bạo Kích Của Vũ Khí Tầm Xa

Tỷ lệ bạo kích của súng tầm xa gắn liền với từng dòng vũ khí, không hoàn toàn phụ thuộc vào độ hiếm:

| Dòng vũ khí | Phạm vi bạo kích | Phạm vi độ hiếm |
|-------------|------------------|-----------------|
| Cung / Nỏ | 0 | common ~ rare |
| Súng ngắn | 0.15~0.20 | common ~ rare |
| Tiểu liên (SMG) | 0.18~0.23 | uncommon |
| Súng máy hạng nhẹ (LMG) | 0.22~0.23 | rare |
| Súng trường (5.56) | 0.22~0.27 | uncommon ~ epic |
| Súng trường (7.62×39) | 0.20~0.28 | uncommon ~ rare |
| Súng trường chiến đấu (7.62×51) | 0.22~0.32 | rare ~ epic |
| Súng bắn tỉa | 0.35~0.45 | rare ~ legendary |
| Vũ khí độc quyền | 0.29~0.52 | legendary |
| Shotgun | 0.10~0.12 | uncommon ~ rare |

### Độ Hiếm Thuốc Men

| Độ hiếm | Tên thuốc men |
|---------|---------------|
| common | Băng gạc, Dung dịch Glucose, Gel Zombie |
| uncommon | Thuốc giảm đau, Epinephrine, Garo cầm máu (Tourniquet), Bột làm sạch vết thương (Debridement Powder) |
| rare | Bộ dụng cụ phẫu thuật, Thuốc kháng sinh, Huyết thanh chống lây nhiễm |
| epic | Hộp cứu thương y tế, Hộp cứu thương dã chiến |
| legendary | Ống tiêm vạn năng (Universal Injection), Huyết thanh cải tiến |

### Độ Hiếm Ba Lô

| Độ hiếm | Tên ba lô | Sức chứa |
|---------|-----------|----------|
| common | Túi xách tay, Túi đeo hông nhỏ, Ba lô nhỏ, Ba lô vải bố | 18, 20, 22, 24 |
| uncommon | Ba lô thời trang, Ba lô thể thao, Ba lô leo núi | 26, 28, 32 |
| rare | Ba lô quân đội, Ba lô chiến thuật, Ba lô đặc nhiệm | 36, 39, 42 |
| epic | Ba lô leo núi cỡ lớn, Ba lô du lịch cực lớn, Ba lô dã chiến hạng nặng cực lớn | 48, 56, 64 |
| legendary | Ba lô kho chứa không gian đa chiều (Dimensional Storage) | 68 |

### Vật Phẩm Đặc Biệt (`SPECIAL_ITEMS`)

| Khóa (Key) | ID | Tên hiển thị | Mô tả |
|------------|----|--------------|-------|
| `noble_id` | `noble_id` | Thẻ căn cước quý tộc | Thân phận quý tộc cơ bản |
| `viscount_id` | `viscount_id` | Thẻ Tử tước | Tước vị Tử tước |
| `count_id` | `count_id` | Thẻ Bá tước | Tước vị Bá tước |
| `marquis_id` | `marquis_id` | Thẻ Hầu tước | Tước vị Hầu tước |
| `duke_id` | `duke_id` | Thẻ Công tước | Tước vị Công tước |
| `crown_prince_id` | `crown_prince_id` | Thẻ Thái tử | Tước vị Hoàng Thái tử |
| `dawn_badge` | `dawn_badge` | Huy hiệu Bình Minh | Thành viên Tiền đồn Bình Minh |
| `dawn_captain_badge` | `dawn_captain_badge` | Huy hiệu Đội trưởng Bình Minh | Đội trưởng tiên phong Bình Minh |
| `silence_badge` | `silence_badge` | Huy hiệu Im Lặng | Vật kỷ niệm tiêu diệt Vua Zombie·Tĩnh Lặng |
| `underground_key` | `underground_key` | Chìa khóa hầm | Chìa khóa tầng hầm |
| `farming_master_badge` | `farming_master_badge` | Huy hiệu Bậc thầy nông nghiệp | Kỷ niệm chương cao thủ trồng trọt |
| `miaomiao_diary` | `miaomiao_diary` | Nhật ký của Miêu Miêu | Cuốn nhật ký của Miêu Miêu |
| `strange_recorder` | `strange_recorder` | Máy ghi âm kỳ lạ | Chiếc máy ghi âm |
| `letter_to_sister` | `letter_to_sister` | Thư gửi em gái | Lá thư của Thủ lĩnh tiền đồn |
| `queen_reply` | `queen_reply` | Thư hồi âm của Vương hậu | Hồi âm của Vương hậu |
| `love_token` | `love_token` | Tín vật định tình | Mặt dây chuyền hoa hướng dương |
| `castle_pass` | `castle_pass` | Giấy thông hành lâu đài | Giấy phép ra vào lâu đài |
| `car_key` | `car_key` | Chìa khóa xe hơi | Thưởng nhiệm vụ 3 của Liễu Như Yên, điều kiện cho nhiệm vụ 4 |

### Tước Vị Quý Tộc Lâu Đài (`CASTLE_RANKS`)

Trò chơi có tổng cộng hệ thống 6 bậc tước vị:

| Cấp | Tên tước vị | Giá trị rank | Thẻ căn cước tương ứng |
|-----|-------------|--------------|------------------------|
| 1 | Quý tộc | 1 | `noble_id` |
| 2 | Tử tước | 2 | `viscount_id` |
| 3 | Bá tước | 3 | `count_id` |
| 4 | Hầu tước | 4 | `marquis_id` |
| 5 | Công tước | 5 | `duke_id` |
| 6 | Hoàng Thái tử | 6 | `crown_prince_id` |

### Danh Sách Thành Tựu (`ACHIEVEMENTS`)

Trò chơi có tổng cộng 17 thành tựu (mở rộng lên 19 bao gồm thành tựu cốt truyện), trong đó có 5 thành tựu kết cục:

| ID Thành tựu | Tên thành tựu | Điều kiện |
|--------------|---------------|-----------|
| `survive_10` | Sinh tồn 10 ngày | Số ngày >= 10 |
| `survive_30` | Sinh tồn 30 ngày | Số ngày >= 30 |
| `survive_100` | Sinh tồn 100 ngày | Số ngày >= 100 |
| `zombie_hunter` | Thợ săn Zombie | Tiêu diệt >= 50 |
| `zombie_slayer` | Kẻ tàn sát Zombie | Tiêu diệt >= 200 |
| `explorer` | Nhà thám hiểm | Bản đồ khám phá >= 10 |
| `collector` | Nhà sưu tập | Khám phá toàn bộ bản đồ |
| `base_upgrade` | Tổ ấm | Căn cứ đạt cấp tối đa |
| `companion_recruit` | Bạn đồng hành | Chiêu mộ được bạn đồng hành đầu tiên |
| `boss_killer` | Thợ săn Boss | Tiêu diệt Boss đầu tiên |
| `noble_status` | Thân phận Quý tộc | Đạt được thân phận quý tộc |
| `dawn_member` | Tia sáng Bình Minh | Gia nhập Tiền đồn Bình Minh |
| `ending_farming` | Ta Không Phải Nông Thần | Đạt kết cục: Ta Không Phải Nông Thần |
| `ending_love_hate` | Dây Dưa Yêu Hận | Đạt kết cục: Dây Dưa Yêu Hận |
| `ending_death` | Điểm Kết Thúc | Đạt kết cục: Cái Chết |
| `ending_999` | Tương Lai Bất Định | Đạt kết cục: Tương Lai Bất Định |
| `ending_prince` | Nghiện Quyền Lực | Đạt kết cục: Nghiện Quyền Lực |
| `ending_captain` | Tỏa Ánh Hào Quang | Đạt kết cục: Tỏa Ánh Hào Quang |
| `ending_newforce` | Trở Thành Lực Lượng Mới | Đạt kết cục: Trở Thành Lực Lượng Mới |

---

## 5. Sơ Đồ Quan Hệ Dữ Liệu

Các hằng số sau đây có mối quan hệ tham chiếu chặt chẽ lẫn nhau, hãy lưu ý liên kết đồng bộ khi chỉnh sửa:

### Đạn Dược ↔ Vũ Khí (Mối Quan Hệ Hai Chiều)

```
AMMO.compatibleWith[]  ←→  RANGED_WEAPONS.ammoType
```

- Mỗi `ammoType` của vũ khí tầm xa phải có mục tương ứng tồn tại trong `AMMO`.
- Mỗi `compatibleWith` của loại đạn phải chứa toàn bộ ID của các vũ khí sử dụng loại đạn đó.
- **Khi thêm súng tầm xa mới**: Nếu sử dụng loại đạn có sẵn, hãy thêm ID vũ khí vào mảng `compatibleWith` của loại đạn đó.
- **Khi thêm loại đạn mới**: Đảm bảo tất cả các vũ khí sử dụng loại đạn này đều được liệt kê trong `compatibleWith`.

### Rơi Đồ Cố Định → Các Mảng Vật Phẩm

```
FIXED_LOOT_DROPS.weaponId  →  MELEE_WEAPONS / RANGED_WEAPONS
FIXED_LOOT_DROPS.ammoId    →  AMMO
FIXED_LOOT_DROPS.foodId    →  FOODS
```

- Khi trường `type` là `"melee"`, `weaponId` sẽ được tìm trong `MELEE_WEAPONS`.
- Khi trường `type` là `"ranged"`, `weaponId` sẽ được tìm trong `RANGED_WEAPONS`.

### Vật Phẩm Mặc Định → Các Mảng Vật Phẩm Khác Nhau

```
DEFAULT_ITEM_IDS.melee  →  MELEE_WEAPONS
DEFAULT_ITEM_IDS.food   →  FOODS
DEFAULT_ITEM_IDS.drink  →  DRINKS
DEFAULT_ITEM_IDS.seed   →  BUILDING_MATERIALS
DEFAULT_ITEM_IDS.serum  →  MEDICINES
```

### Các Mối Quan Hệ Suy Dẫn Tự Động

```
NURSE_MEDICINE_POOL      ←  MEDICINES.filter(rarity === "common" || rarity === "uncommon")
V_TRADE_AMMO_TYPES       ←  AMMO.filter(id !== "arrow").map(id)
BUILDING_MATERIAL_NAMES  ←  Duyệt BUILDING_MATERIALS tự tạo {id: name}
BOSS_NAMES               ←  Duyệt NAMED_NPCS tự tạo mảng name
```

Sau khi sửa đổi dữ liệu gốc, các hằng số suy dẫn này sẽ tự động cập nhật mà không cần can thiệp thủ công.

### Suy Dẫn Tên Boss

```
NAMED_NPCS  →  BOSS_NAMES (Suy dẫn tự động)
```

`BOSS_NAMES` được sinh tự động thông qua `Object.values(NAMED_NPCS).map(npc => npc.name)`. Sau khi thêm hoặc sửa đổi các mục trong `NAMED_NPCS`, `BOSS_NAMES` sẽ tự cập nhật.

### Định Tuyến Hành Động Bản Đồ

```
MAP_ACTIONS  →  routing.js (Định tuyến hướng theo dữ liệu)
```

`MAP_ACTIONS` định nghĩa các nút thao tác khả dụng và mã định danh hành động tương ứng cho từng bản đồ. `routing.js` sẽ định tuyến đến logic xử lý tương ứng dựa trên mã hành động. Khi thêm hành động bản đồ mới, cần đồng thời thêm mục vào `MAP_ACTIONS` và hàm xử lý tương ứng trong `routing.js`.

### Văn Bản Giới Thiệu NPC Bản Đồ

```
MAP_NPC_INTROS  →  maps.js (Văn bản giới thiệu NPC)
```

`MAP_NPC_INTROS` lưu trữ văn bản xuất hiện, đối thoại khi chiến đấu và văn bản rời đi của các NPC trên bản đồ. Trong quá trình khám phá bản đồ, phần giới thiệu tương ứng sẽ hiển thị dựa theo loại NPC.

### Lời Thoại Của Thủ Lĩnh Tiền Đồn

```
LEADER_DIALOGUES  →  outpost.js (Đối thoại thủ lĩnh)
```

`LEADER_DIALOGUES` chứa nội dung đối thoại của thủ lĩnh tiền đồn, được chọn ngẫu nhiên để hiển thị khi tương tác tại tiền đồn.

### Lời Thoại Từ Chối Của Lâu Đài

```
CASTLE_REJECTION_DIALOGUES  →  npcs/index.js (Đối thoại từ chối)
```

`CASTLE_REJECTION_DIALOGUES` lưu trữ văn bản thoại khi NPC tiền đồn từ chối tiếp xúc nếu người chơi sở hữu thẻ căn cước lâu đài. Khóa là ID của NPC (`v`, `xiaohan`, `lili`).

### Phần Thưởng Nhiệm Vụ NPC → Các Mảng Vật Phẩm

```
SURVIVOR_NPC.quests.reward.item        →  MELEE_WEAPONS / RANGED_WEAPONS
SURVIVOR_NPC.quests.reward.ammo.type   →  AMMO
SURVIVOR_NPC.quests.require.medicineId →  MEDICINES
SURVIVOR_NPC.quests.require.drinkId    →  DRINKS
```

### Liên Quan Đến Giao Thương

```
TRADER_WEAPON_SHOP.weaponId  →  MELEE_WEAPONS / RANGED_WEAPONS
LILI_REWARD_MEDICINE_IDS     →  MEDICINES
XIAOHAN_REWARD_FOOD_IDS      →  FOODS
TRADE_TEMPLATES.ammoType     →  AMMO
```

### Bản Đồ → Nhóm Zombie (Zombie Pool)

```
MAPS.id  →  Ánh xạ poolMap trong getRandomZombie()
```

Sau khi thêm ID bản đồ mới, cần thêm ánh xạ tương ứng vào `poolMap`.

### Danh Sách Thực Phẩm Đóng Hộp

```
CANNED_FOOD_IDS  →  FOODS (Tập con)
```

Sử dụng cho nhiệm vụ "Thu thập đồ hộp" của Tô Tiểu Hàm. Nếu thêm món đồ hộp mới, cần cập nhật mảng này đồng bộ.

### Vũ Khí Công Cụ

```
TOOL_WEAPON_IDS  →  MELEE_WEAPONS (Tập con)
```

Dùng để xác định những vũ khí cận chiến nào thuộc nhóm "công cụ lao động".

---

## 6. Các Điểm Cần Lưu Ý

### 1. ID Phải Là Duy Nhất Trên Toàn Cục

Mỗi `id` của vật phẩm phải là duy nhất trong mảng của nó. Khuyến nghị duy trì tính duy nhất trên toàn bộ các mảng để tránh nhầm lẫn.

### 2. Sửa Đổi ID Sẽ Ảnh Hưởng Đến Tính Tương Thích Của File Lưu Game

File lưu của người chơi lưu trữ các chuỗi `id` của vật phẩm. Nếu bạn sửa đổi `id` của một vật phẩm, các file lưu cũ tham chiếu đến `id` đó sẽ không khớp được. **Nếu chỉ muốn đổi tên, khuyến nghị chỉ sửa trường `name` và giữ nguyên trường `id`.**

### 3. Thêm Vật Phẩm Mới Không Cần Sửa Đổi Các Tệp Khác

Chỉ cần thêm các mục vào mảng tương ứng, hệ thống rơi đồ, hệ thống mã cheat, v.v., sẽ tự động nhận diện các vật phẩm mới.

### 4. Xóa Vật Phẩm Phải Kiểm Tra Toàn Bộ Vị Trí Tham Chiếu

Trước khi xóa một vật phẩm, bắt buộc phải kiểm tra các vị trí sau xem có tham chiếu đến nó hay không:
- `weaponId`, `ammoId`, `foodId` trong `FIXED_LOOT_DROPS`
- Các trường trong `DEFAULT_ITEM_IDS`
- `compatibleWith` trong `AMMO`
- `weaponId` trong `TRADER_WEAPON_SHOP`
- `require` và `reward` của các nhiệm vụ trong `SURVIVOR_NPC`
- `LILI_REWARD_MEDICINE_IDS` và `XIAOHAN_REWARD_FOOD_IDS`
- `CANNED_FOOD_IDS`
- `TOOL_WEAPON_IDS`
- `ammoType` trong `TRADE_TEMPLATES`

### 5. Trường `rarity` Bắt Buộc Phải Là 1 Trong 5 Giá Trị Hợp Lệ

Các giá trị hợp lệ: `"common"`, `"uncommon"`, `"rare"`, `"epic"`, `"legendary"`. Nếu sử dụng độ hiếm nằm ngoài 5 giá trị này, thuật toán chọn ngẫu nhiên có trọng số trong hệ thống rơi đồ sẽ áp dụng trọng số mặc định là 1, có thể gây ra hành vi không mong muốn.

### 6. Trường `compatibleWith` Của Đạn Phải Khớp Với `ammoType` Của Vũ Khí

- Mỗi `ammoType` của súng tầm xa phải tồn tại trong `AMMO`.
- Mỗi `compatibleWith` của đạn trong `AMMO` phải bao gồm tất cả các vũ khí sử dụng loại đạn đó.
- Cả hai phải được đồng bộ hóa hoàn toàn, nếu không sẽ dẫn đến việc không thể nạp đạn hoặc súng không thể bắn.

### 7. Trường `type` Trong `FIXED_LOOT_DROPS` Quyết Định Phạm Vi Tra Cứu

- `type: "melee"` → tra cứu `weaponId` từ `MELEE_WEAPONS`
- `type: "ranged"` → tra cứu `weaponId` từ `RANGED_WEAPONS`
- Nếu `type` không khớp với loại vũ khí thực tế, hệ thống sẽ không tìm thấy vũ khí tương ứng.

### 8. Ánh Xạ Giữa ID Bản Đồ và Nhóm Zombie (Zombie Pool)

Hàm `getRandomZombie` sử dụng `id` bản đồ để khớp chính xác nhóm zombie. Khi thêm bản đồ mới, hãy chắc chắn bổ sung ánh xạ trong `poolMap`, nếu không game sẽ mặc định gán nhóm zombie cấp nguy hiểm thấp.

### 9. Định Dạng Lệnh Cheat

Hệ thống mã gian lận (cheat) sử dụng loại vật phẩm và ID để tạo lệnh, định dạng là `/get_{type}_{id}_{count}`. Trong đó `type` tương ứng với giá trị trường `type` của vật phẩm. Ví dụ:
- `/get_food_compressed_biscuit_5`
- `/get_melee_katana_1`
- `/get_ranged_ak47_1`
- `/get_medicine_antibiotics_3`

### 10. Hệ Thống Tiền Hoàng Gia (Royal Coin)

Tiền hoàng gia (`royal_coin`) là một loại tiền tệ độc lập, không chiếm ô chứa trong ba lô, được lưu trong `state.royalCoins`.
- Nhận thêm thông qua `addItem({ type: "royal_coin", count: N })`
- Khấu trừ thông qua `removeRoyalCoins(N)`
- Các file lưu cũ tự động bù đắp `royalCoins: 0` thông qua hàm `normalizeState()`

### 11. Hệ Thống Xăng (Gasoline)

Xăng là loại hàng hóa đặc biệt có thể cộng dồn, không chiếm ô chứa trong ba lô, được lưu trong `state.gasoline`.
- Nhận thêm thông qua `addGasoline(N)`
- Khấu trừ thông qua `removeGasoline(N)`, hàm trả về số lượng thực tế đã trừ
- Cũng có thể nhận thông qua `addItem({ type: "gasoline", count: N })` (bên trong gọi `addGasoline`)
- Cũng có thể trừ thông qua `removeItem("gasoline", N)` (bên trong gọi `removeGasoline`)
- Các file lưu cũ tự động bù đắp `gasoline: 0` thông qua `normalizeState()`
- Mã cheat: `/get_gasoline_gasoline_5` (nhận 5 thùng mỗi lần)
- Xăng được hiển thị cùng với thuốc lá và tiền hoàng gia trên bảng hàng hóa của giao diện
- Hỗ trợ chức năng vứt bỏ và tặng quà cho NPC

### 12. Vũ Khí Độc Quyền Theo Cốt Truyện

Một số vũ khí chỉ có thể nhận được qua các nhánh cốt truyện cụ thể, không thể ngẫu nhiên nhận được từ các bảng rơi đồ:
- **Cung Thảo Nguyên (Prairie Bow)** (thưởng nhiệm vụ 3 của Mục Miêu Miêu) — bị loại trừ trong `pickRandomLoot`
- **Súng Ngắn Hoàng Gia (Royal Short Gun)** (mua tại cửa hàng tạp hóa của Vương hậu) — bị loại trừ trong `pickRandomLoot`
- **Ngân Kiếm Hoàng Gia (Royal Silver Sword)** (mua tại cửa hàng tạp hóa của Vương hậu) — bị loại trừ trong `pickRandomLoot`
- **Lưỡi Đao Vô Úy (Fearless Blade)** (phần thưởng kết cục Lực Lượng Mới) — bị loại trừ trong `pickRandomLoot`

### 13. Chuẩn Mực Thiết Kế Tương Tác

Khi thêm hoặc sửa đổi tương tác của NPC, cần tuân thủ các quy chuẩn sau:

1. **Không Return Sớm (No Early Return)**: Các hàm điểm vào tương tác NPC không được dùng mẫu `if (!condition) { setStory(); refreshMenu(); return; }`. Luôn phải hiển thị trang đối thoại của NPC và ít nhất một lựa chọn "Quay lại" (Back); khi không đủ điều kiện chỉ hiển thị lời thoại + nút Quay lại.

2. **Hành Vi Khi Điểm Mệt Mỏi Đạt 100%**: Khi giá trị mệt mỏi đầy (100%), người chơi không thể chiến đấu, ăn, uống hay ngủ. Khi từ chối ăn/uống, phải gợi ý các vật phẩm y tế khả dụng (thuốc giảm đau / epinephrine, v.v.) để phục hồi tinh thần. Khi mệt mỏi đầy, chỉ cho phép dùng các loại thuốc giảm mệt mỏi.

3. **Kiểm Tra Trước Ô Trống Ba Lô Khi Giao Thương**: Trước khi khấu trừ vật phẩm của người chơi, hệ thống giao dịch phải kiểm tra xem ba lô có đủ chỗ chứa cho các vật phẩm thưởng hay không; nếu không đủ chỗ thì từ chối giao dịch.

4. **Cảnh Báo Thao Tác Nguy Hiểm**: Các lựa chọn không thể đảo ngược (như nhiệm vụ 4 của Mã Tam) và các hành động có rủi ro cao (như ăn thịt kỳ lạ +10 nhiễm trùng) cần hiển thị biểu tượng cảnh báo ⚠.

5. **Phản Hồi Cho Tùy Chọn Bị Vô Hiệu Hóa**: Khi nhấp vào các tùy chọn đang bị vô hiệu hóa (disabled), cần hiển thị thông báo "Chưa đáp ứng điều kiện" thay vì hoàn toàn im lặng không có phản hồi.

6. **Quay Lại Sau Khi Sử Dụng Vật Phẩm Tiêu Hao**: Sau khi sử dụng thức ăn / đồ uống / thuốc men, giao diện nên quay lại trang chọn vật phẩm tương ứng thay vì quay về menu chính, giúp người chơi thuận tiện sử dụng liên tục.

7. **Chọn Số Lượng Đạn Khi Mua Từ Thương Nhân Chợ Đen**: Khi mua đạn dược, hỗ trợ lựa chọn số lượng (1 / 5 / 10 / toàn bộ thuốc lá), không còn bắt buộc tiêu hao toàn bộ thuốc lá trong một lần.

8. **Nhắc Nhở Giải Cứu Liễu Như Yên**: Sau khi phát hiện Liễu Như Yên, sổ tay sinh tồn sẽ tự động thêm bộ đếm ngược thời gian giải cứu. Trường `state.liuruyanDiscovered` theo dõi trạng thái đã phát hiện hay chưa.

9. **Theo Dõi Tiến Độ Lực Lượng Mới**: Sau khi hoàn thành bất kỳ điều kiện tiên quyết nào của Lực Lượng Mới, sổ tay sinh tồn sẽ tự động thêm mục tiến độ (X/6).

10. **Tiến Độ Độ Thân Mật Cho Kết Cục Hy Vọng Bằng Tên Lửa**: Khi chọn "Đưa những người quan trọng đi cùng", hiển thị tiến độ độ thân mật hiện tại của V / Tiểu Hàm / Lệ Lệ.

---

## 6.5. Cấu Trúc Module Mã Nguồn

### Module Lâu Đài (`js/castle/`)

Tệp `castle/index.js` gốc (1033 dòng) đã được tách thành 7 submodule theo từng phân vùng chức năng:

| Submodule | Phân vùng chức năng | Các hàm bao gồm |
|-----------|---------------------|-----------------|
| `castle/outpost.js` | Bên ngoài lâu đài + tương tác lính gác | handleCastleOutpost, refreshCastleOutpost, handleCastleExploreBlocked, handleGuardChat, handleGuardEnter, handleGuardBribe, handleGuardLeave, handleCastleGuard, handleCastleGuardAction |
| `castle/interior.js` | Giao diện bên trong lâu đài / khám phá / định tuyến | enterCastleInterior, showCastleInterior, refreshCastleInterior, handleCastleInteriorExplore, handleCastleInteriorAction, handleLeaveCastleInterior, handleLeaveCastle |
| `castle/royalty.js` | Hội thoại hoàng gia + yến tiệc / vũ hội / phòng khách + nhận bổng lộc | handleCastleKing, handleCastleQueen, handleCastleBanquet, handleCastleBall, handleCastleRoom, handleCastleSalary |
| `castle/services.js` | Trị liệu / hội kiến / ngự hoa viên / cấp lại tước vị / làm việc | handleCastleTreatment, handleTreatConfirm, handleCastleMeeting, handleCastleGarden, handleCastleTitleReissue, handleCastleWork |
| `castle/king-quest.js` | Toàn bộ chuỗi nhiệm vụ Quốc vương | handleCastleKingQuest, checkKingQuestRequire, handleKingQuestSubmit, removeKingQuestItems |
| `castle/identity.js` | Đăng ký / hủy bỏ thân phận quý tộc | handleCastleIdentity, handleIdentityApply, handleIdentityCancel, refreshCastleIdentity, handleCastleIdentityAction |
| `castle/bank.js` | Ngân hàng / vay nợ / tương tác Giám đốc ngân hàng | handleCastleBank, handleBankLoan, handleLoanSubmit, handleBankRepay, handleBankBanker, handleBankerMercy, refreshCastleBank, handleBankerFight, handleCastleBankAction, handleCastleBankerAction |

`castle/index.js` đóng vai trò là điểm vào thống nhất, tái xuất tất cả các hàm từ các submodule, đường dẫn import từ bên ngoài không thay đổi.

### Module Game (`js/game/`)

Tệp `game.js` gốc (1779 dòng) đã được tách thành 8 submodule theo từng phân vùng chức năng:

| Submodule | Phân vùng chức năng | Các hàm bao gồm |
|-----------|---------------------|-----------------|
| `game/endings.js` | Hệ thống kết cục | triggerEnding, checkEndingTrigger, checkEndingTriggerAfterAction, checkGoHomeEnding, handleEndingAction |
| `game/base-actions.js` | Xây dựng căn cứ | handleBaseBuild, handleBaseBuildAction |
| `game/consumables.js` | Ngủ / ăn / uống / dùng thuốc | handleSleep, handleEatSelect, handleDrinkSelect, handleMedicineSelect, handleFoodAction, handleDrinkAction, handleMedicineAction, handleSelectionPhase |
| `game/navigation.js` | Điều hướng bản đồ | handleGoOut, handleGoHome, handleMapAction |
| `game/exploration.js` | Hệ thống khám phá | handleExplore, handleExploreAction |
| `game/save.js` | Hệ thống lưu game (Save) | handleSavePage, renderSaveSlotsAsOptions, handleSavePageAction, handleSaveConfirm |
| `game/notes.js` | Sổ tay sinh tồn | buildSurvivalNotes, handleSurvivalNotesAction, handleSurvivalNotesDetailAction |
| `game/achievements.js` | Hệ thống thành tựu | tryUnlockAchievement, checkSurvivalAchievements, checkExplorationAchievements |

`game/index.js` giữ lại các hàm điều hướng chính `handleChooseAction` và `handleAction`, đồng thời xuất thống nhất toàn bộ các hàm. Đường dẫn import từ bên ngoài được cập nhật từ `'./game.js'` thành `'./game/index.js'`.

### Phụ Thuộc Lẫn Nhau Giữa Các Module

- `castle/outpost.js` ↔ `castle/interior.js`: Import lẫn nhau (các module ES hỗ trợ tham chiếu vòng tại thời điểm runtime)
- `castle/interior.js` → `castle/royalty.js`, `castle/services.js`, `castle/king-quest.js`: Lời gọi điều hướng
- `game/index.js` → toàn bộ các submodule `game/`: Phân phối điều hướng chính
- `game/endings.js` → `game/achievements.js`: Kết thúc kích hoạt thành tựu
- `game/navigation.js` → `game/endings.js`: Kiểm tra kết thúc khi trở về nhà
- `game/exploration.js` → `game/consumables.js`, `game/navigation.js`: Tiêu thụ / điều hướng sau khi thám hiểm

### Cách Định Vị Vị Trí Khi Sửa Code

| Yêu cầu cần sửa | Tệp cần chỉnh sửa |
|-----------------|-------------------|
| Sửa tương tác lính gác lâu đài | `castle/outpost.js` |
| Sửa menu bên trong lâu đài | `castle/interior.js` |
| Sửa yến tiệc / vũ hội / phòng khách | `castle/royalty.js` |
| Sửa trị liệu / hội kiến / ngự hoa viên | `castle/services.js` |
| Sửa nhiệm vụ Quốc vương | `castle/king-quest.js` |
| Sửa đăng ký thân phận quý tộc | `castle/identity.js` |
| Sửa ngân hàng / khoản vay | `castle/bank.js` |
| Sửa logic kết cục | `game/endings.js` |
| Sửa xây dựng căn cứ | `game/base-actions.js` |
| Sửa ngủ / ăn / uống / dùng thuốc | `game/consumables.js` |
| Sửa điều hướng bản đồ | `game/navigation.js` |
| Sửa hệ thống khám phá | `game/exploration.js` |
| Sửa hệ thống lưu file | `game/save.js` |
| Sửa sổ tay sinh tồn | `game/notes.js` |
| Sửa hệ thống thành tựu | `game/achievements.js` |
| Sửa điều hướng menu chính | `game/index.js` |

---

## 7. Bảng Tra Cứu Nhanh

| Tên hằng số | Kiểu dữ liệu | Số lượng mục | Các trường chính |
|-------------|--------------|--------------|------------------|
| `TIME_PHASES` | string[] | 8 | Tên các mốc thời gian |
| `FOODS` | object[] | 19 | id, name, type, hunger, hydration? |
| `FRUITS` | object[] | 11 | id, name, type, hunger, hydration |
| `DRINKS` | object[] | 12 | id, name, type, hydration, effects? |
| `MEDICINES` | object[] | 14 | id, name, type, effects{health?,infection?,crash?}, rarity |
| `NURSE_MEDICINE_POOL` | object[] | 6 | (Suy dẫn tự động từ MEDICINES) |
| `CIGARETTES` | object[] | 5 | id, name, type |
| `BUILDING_MATERIALS` | object[] | 6 | id, name, type |
| `CROPS` | object[] | 15 | id, name, matureTurns, yield, seedId, seedName, hunger, hydration |
| `MELEE_WEAPONS` | object[] | 39 | id, name, type, damage, durability, rarity?, comboRate |
| `RANGED_WEAPONS` | object[] | 44 | id, name, type, damage, integrity, ammoType, critRate, rarity |
| `AMMO` | object[] | 13 | id, name, type, compatibleWith[] |
| `ZOMBIES` | object[] | 16 | id, name, hp, damage, dodge, ability[] |
| `NPCS` | object | 4 | {type: {name, hpMin, hpMax, damageMin, damageMax, hasRanged}} |
| `SURVIVOR_NPC` | object[] | 3 | id, name, desc, dialogues{}, tips[], quests{} |
| `NAMED_NPCS` | object | 5 | {key: {name, hp, damageMin?, damageMax?, damage?, hasRanged, dodgeRate}} |
| `BOSS_NAMES` | string[] | 5 | (Suy dẫn tự động từ NAMED_NPCS) |
| `BACKPACK_TYPES` | object | 14 | {name: {id, name, type, capacity}} |
| `LOOT_BACKPACKS` | object[] | 14 | id, name, type, capacity, rarity |
| `MAPS` | object[] | 22 | id, name, danger, encounterRate, noZombie?, lootTable{} |
| `MAP_ACTIONS` | object | 23 | {mapId: [{text, action}]} |
| `MAP_NPC_INTROS` | object | 13 | {key: appearance/combat/leave text} |
| `OUTLAW_DIALOGUES` | string[] | 15 | Lời thoại kẻ ngoài vòng pháp luật |
| `MECHANIC_DIALOGUES` | string[] | 5 | Lời thoại thợ máy |
| `WOLF_DIALOGUES` | string[] | 5 | Lời thoại sói |
| `WAREHOUSE_GUARD_DIALOGUES` | string[] | 5 | Lời thoại lính gác nhà kho |
| `NERVOUS_VETERAN_DIALOGUES` | string[] | 5 | Lời thoại cựu binh căng thẳng |
| `CASTLE_GUARD_DIALOGUES` | string[] | 5 | Lời thoại lính gác lâu đài |
| `CASTLE_KING_DIALOGUES` | string[] | 5 | Lời thoại Quốc vương lâu đài |
| `CASTLE_QUEEN_DIALOGUES` | string[] | 5 | Lời thoại Vương hậu lâu đài |
| `CASTLE_BANKER_DIALOGUES` | string[] | 5 | Lời thoại Giám đốc ngân hàng lâu đài |
| `CASTLE_GUARD_HIGH_DIALOGUES` | string[] | 5 | Lời thoại lính gác lâu đài (tước vị cao) |
| `CASTLE_KING_HIGH_DIALOGUES` | string[] | 5 | Lời thoại Quốc vương lâu đài (tước vị cao) |
| `CASTLE_QUEEN_HIGH_DIALOGUES` | string[] | 5 | Lời thoại Vương hậu lâu đài (tước vị cao) |
| `CASTLE_BANKER_HIGH_DIALOGUES` | string[] | 5 | Lời thoại Giám đốc ngân hàng lâu đài (tước vị cao) |
| `CASTLE_REJECTION_DIALOGUES` | object | 3 | {npcId: Lời thoại từ chối} |
| `DOCTOR_INTRO` | string | 1 | Đoạn giới thiệu Bác sĩ Trần |
| `DOCTOR_DIALOGUES` | string[] | 5 | Lời thoại Bác sĩ Trần |
| `ZOMBIE_KING_INTRO` | string | 1 | Đoạn giới thiệu Vua Zombie |
| `NURSE_ZOMBIE_INTRO` | string | 1 | Đoạn giới thiệu Zombie Y tá |
| `LEADER_DIALOGUES` | string[] | 5 | Lời thoại Thủ lĩnh tiền đồn |
| `SPECIAL_ITEMS` | object | 18 | {key: {id, name, type}} |
| `CASTLE_RANKS` | object[] | 6 | id, rank, name, itemId |
| `KING_QUESTS` | object[] | 5 | id, name, desc, story, submitStory, require, reward, prereqQuest |
| `BASE_LEVELS` | object[] | 5 | name, bonus, cost{}? |
| `WAREHOUSE_LEVELS` | (object|null)[] | 8 | {wood?, building_mat?, stone?, nails?, glass?} |
| `AFFINITY_THRESHOLDS` | object[] | 5 | min, label, stage |
| `AFFINITY_MAX` | object | 5 | {npcId: maxValue} |
| `GAME_CONSTANTS` | object | 22 nhóm | CRASH_MAX, INFECTION_MAX, MAX_HEALTH, TURNS_PER_DAY, SURVIVAL{}, COMBAT{}, MAP_EVENTS{}, CASTLE{}, ISLAND{}, DOCTOR{}, ROCKET{}, WEATHER{}, ENCOUNTER{}, SLEEP{}, OUTPOST{}, BASE{}, ENDINGS{}, FISHING{}, YUMO{}, LIURUYAN{}, NURSE_ZOMBIE{}, NPC{}, LOOT{}, ACHIEVEMENTS{}, TRADING{}, MAP{} |
| `TOOL_WEAPON_IDS` | string[] | 4 | Danh sách ID vũ khí công cụ |
| `V_TRADE_AMMO_TYPES` | string[] | 11 | (Suy dẫn tự động từ AMMO) |
| `TRADER_WEAPON_SHOP` | object[] | 6 | weaponId, type, costMin, costMax |
| `FIXED_LOOT_DROPS` | object | 7 | {key: {weaponId?, type?, ammoId?, ammoCount?, foodId?}} |
| `TRADE_TEMPLATES` | object[] | 4 | ammoType, ammoPerItem |
| `DEFAULT_ITEM_IDS` | object | 5 | melee, food, drink, seed, serum |
| `LILI_REWARD_MEDICINE_IDS` | string[] | 4 | Danh sách ID thuốc men |
| `XIAOHAN_REWARD_FOOD_IDS` | string[] | 3 | Danh sách ID thức ăn |
| `BUILDING_MATERIAL_NAMES` | object | 6 | (Suy dẫn tự động từ BUILDING_MATERIALS) |
| `CANNED_FOOD_IDS` | string[] | 8 | Danh sách ID thực phẩm đóng hộp |
| `SURVIVAL_NOTES` | object[] | 7 | id, name, entries[{title, content}] |
| `ACHIEVEMENTS` | object[] | 19 | id, name, desc, icon |
| `ENDING_STORIES` | object | 7 | {endingId: Nội dung truyện} |
