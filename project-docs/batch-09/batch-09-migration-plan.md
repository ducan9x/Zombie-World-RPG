# Batch 10 — Kiến trúc đề xuất và kế hoạch migration có kiểm soát

Ngày: 2026-11-07. **Chỉ Stage A: chưa được phép triển khai Stage B–F.**

**Lịch sử phê duyệt:** Sau Stage A, người dùng đã cho phép toàn quyền tiến hành refactor. Kế hoạch phía dưới là thiết kế gốc; trạng thái thực hiện hiện hành nằm tại `batch-09-final-acceptance-report.md`. Không áp dụng câu “chờ phê duyệt” cuối tài liệu như một blocker mới.

## 1. Ranh giới và cấu trúc mới đề xuất

Giữ ES modules, Vanilla JavaScript, PixiJS 7.4.3 local. Không đổi framework, engine, nội dung, schema hay storage keys.

- `js/presentation/app.js`: bootstrap/coordinator cho UI mới, chỉ refresh sau command.
- `js/presentation/session.js`: presentation state trong bộ nhớ: route, overlay stack, filter/search/selection, scroll/focus, render revision. Không chứa bản sao gameplay hoặc persist vào game state.
- `js/presentation/adapters/game-adapter.js`: đọc state, resolve option và gửi lệnh tới entry point hiện hữu; không tính công thức.
- `js/presentation/adapters/inventory-adapter.js`: bọc executor/live-reference hiện tại; không viết lại item effects/equip/swap/drop.
- `js/presentation/adapters/warehouse-adapter.js`: bọc hai đường kho cũ, không hợp nhất semantics.
- `js/presentation/adapters/pixi-adapter.js`: host lifecycle, view/resize, cầu POI–option và refresh; không travel logic.
- `js/presentation/selectors/`: read-only view models từ canonical state/config; derived labels/formatting, không probabilities, rewards hay eligibility engine thay thế.
- `js/presentation/screens/`: title/profile, field/narrative, map, encounter/result, loadout/profile, base/farming/warehouse, dialogue/services/trade/recipes, journal, system/save/settings/tools/about/endings.
- `js/presentation/components/`: controls, HUD, narrative, lists, sheet/dialog và status.
- `css/ui/tokens.css`, `foundation.css`, `components.css`, `screens.css`: mobile mặc định, min-width enhancement. Thay stylesheet cũ có kiểm soát, không nối tiếp hàng nghìn dòng override.

Đây là tên file **dự kiến**, chưa có file nguồn nào được tạo. `ui.js` chỉ trở thành compatibility facade khi migration được duyệt; các exports được tests/gameplay renderer gọi không được biến mất giữa chừng.

## 2. Giao thức command không sao chép engine

### Option commands

Mỗi nút giữ token gắn với phase, options reference/revision, option reference và chỉ số gốc; payload phụ như map ID/count/quest ID chỉ để đối chiếu. Khi tap:

1. Đọc lại `getState()`, kiểm tra token còn thuộc options/phase hiện tại; stale thì refresh, không đoán một lựa chọn khác cùng label.
2. Resolve option ở danh sách gốc, không lấy số thứ tự sau filter/sort/page.
3. Gọi `handleAction(originalIndex + 1)` đúng một lần. Giữ disabled checks và hậu kiểm ending/death của dispatcher.
4. Refresh presentation từ canonical state; đóng overlay stale sau load/reset/endings; không gọi thêm survival/time check cho chắc.

Chặn reentrant/double-submit theo vòng đời command và token; không kéo dài khóa UI để tự hạn chế lượt hợp lệ. Giữ khóa hiện hữu trong các executors. Không thêm `Math.random()` trong code render/preview.

### Các đường không phải option command

- New game: giữ trình tự `resetState → setName → setPlayerAppearance → setPhase('choose')` và music hiện hữu. Không reset chỉ để preview màn hình.
- Item detail: bọc `executeInventoryAction` cùng `findItemLiveLocation`, truyền state hiện tại và callback refresh. Không thay nó bằng `handleFoodAction` chỉ vì tên gần giống.
- Kho: `depositBackpackItem/withdrawWarehouseItem` và `base.js` menu flow đều được giữ tới khi parity được chứng minh. Không vô tình mất hàng hóa hoặc đổi slot counting.
- Settings: dùng toggle APIs cũ, giữ điều kiện ít nhất một cách nhập. Không auto-migrate preferences.
- Save/load: mở qua `handleSavePage`; thao tác slots qua options/handlers cũ, không shortcut `saveGame()` để vượt guard.
- Cheats/devtools: bảo toàn entry/gate cũ; không tự di chuyển command xử lý vào gameplay dispatcher.

Selectors được phép tính tỷ lệ chiều rộng bar hiển thị, không được thực hiện chiến đấu/điều kiện quest thay engine. Getter như `getAvailableQuest()` phải kiểm tra side effects trước khi dùng để render; ưu tiên đọc flags/data, không gọi hàm interaction để lấy nội dung preview.

## 3. Presentation navigation khác gameplay routing

Bottom routes: Hiện trường / Hành trang / Hồ sơ / Hệ thống. Subroutes và overlay không ghi vào `state.phase`.

- Mở hồ sơ đọc/đóng detail không tăng lượt, không build lại options, không phát sinh RNG.
- Ngữ cảnh gameplay hiện tại luôn còn nguyên khi chuyển view; Hiện trường quay đúng interaction đang chờ.
- Chỉ những action mutation đang có entry point hợp lệ mới được expose. Không thêm quyền dùng kho từ ngoài nhà, giao dịch từ xa, travel khi combat hay save transient.
- Xem map không tự gọi handleGoOut; vào travel flow qua lựa chọn Core cung cấp. Return map/back dùng option cũ nếu đang ở flow gameplay.
- Escape/browser Back đóng layer thuần trước. Rời giao dịch/sự kiện là action thật nếu có; không setPhase tùy ý và không snapshot/restore Core để giả navigation.
- Kết cục ưu tiên trình bày; giữ đúng restart/continue options, không nav để bypass gameOver.

## 4. Tách UI đang lẫn gameplay một cách an toàn

### Inventory

Ban đầu giữ executor trong `inventory-ui.js` như legacy command provider, renderer mới không gọi `renderInventoryComponent`. Dùng item handles/live references nội bộ adapter, không đưa rawItem vào save. Nếu executor đang đọc/xóa `_selectedInvItem`, facade có thể tiếp tục tương thích field cũ trong giai đoạn chuyển tiếp; không đổi schema và không thêm UI fields mới vào state. Việc loại bỏ writes thuần UI cần chứng minh không ảnh hưởng consumers trước khi duyệt riêng.

### Warehouse

Module cũ vừa mutation vừa render DOM. Chọn cách tương thích ít rủi ro trước: duy trì host/facade cần thiết cho contract cũ trong giai đoạn migration, render UI mới từ callback. Nếu cần tách status/render callback trong file cũ, diff phải chỉ wiring trình bày và được kiểm tra parity stack/capacity/partial transfer. Không clone thuật toán sang adapter rồi âm thầm sửa khác biệt. Nếu không có seam an toàn, **dừng riêng màn kho** và báo dependency; các stage khác không được tuyên bố migrate đủ.

### Pixi và map

Giữ một canvas host ổn định, không destroy/recreate khi chuyển tab. `map-renderer.js` hiện gọi `renderAll()` và selector options DOM; thay cầu UI bằng callback/facade hoặc contract tạm sau phê duyệt. Không sửa coordinates/map IDs để che lỗi hit target. Cần đo vùng chạm thực sau canvas scaling ở 320px, không coi circle 44 world units là 44 CSS px.

### Combat

Không sửa vòng while thành async turn engine. Screen mới bọc trước trận và kết quả. Có thể reveal log có skip/reduced-motion, nhưng chỉ dùng log có sẵn; không dựng xác suất, thắng/thua hoặc HP từng lượt giả. Parser không hiểu thì hiển thị nguyên văn, không bỏ nội dung.

## 5. Các stage và cổng kiểm soát

### Stage A — công việc hiện tại

- Hoàn thành kiểm kê/API/dependency map, đề xuất design/navigation/adapters và baseline có ghi giới hạn.
- Bàn giao bốn tài liệu đề xuất/baseline và changelog; không source changes, prototype hay ảnh UI mới.
- Cổng: người dùng duyệt kiến trúc và phạm vi Stage B/C; chưa chuyển tiếp tự động.

### Stage B — thiết kế và prototype mobile

- Chốt tokens/components, dựng representative screens với fixture hợp lệ: title, field, encounter/result, inventory detail, warehouse, save/settings.
- Validate 320/375/430px trước tablet/desktop; kiểm keyboard/focus/text dài, targets thực, overflow.
- Chưa chuyển default UI nếu prototype chưa đủ interactions/parity. Nút chưa tích hợp không được giới thiệu như gameplay hoàn chỉnh.
- Cổng: review visual + interaction + accessibility và không có engine diff.

### Stage C — nền UI mới

- App shell, presentation-only state/router, command adapters, overlay manager, persistent HUD và Pixi host.
- Compatibility facade giữ entry points/exports cần thiết; có đường fallback nội bộ tới UI cũ trong migration, không persist flag vào save.
- Kiểm thử opens/closes pure views không làm state/options/RNG/storage drift; numeric input và disabled options hoạt động ở shell mới.
- Cổng: shell thực sự chạy với Core cũ, single canvas/state, không dead navigation. Chưa xóa UI cũ toàn bộ.

### Stage D — migration từng nhóm, mỗi nhóm vẫn playable

Thứ tự và gate riêng:

1. **D1 Title/profile:** new/load entry, records/achievements/settings/About access không mất; giữ creation/reset behavior.
2. **D2 Field/narrative:** home/explore/consumables/generic option screen, đủ nhánh map-events/NPC; mọi phase chưa có specialized screen vẫn có renderer mới đầy đủ options, không placeholder.
3. **D3 Map:** POI/list/action parity, bounds/hit targets, hidden maps, travel/return/ending gates, Pixi lifecycle.
4. **D4 Combat:** pre-combat NPC/zombie, full resolve/result/death/boss; seed parity và log fallback.
5. **D5 Hành trang/hồ sơ:** cả option-based và direct inventory paths, ammo/backpack, duplicate IDs, discard confirm/stale references.
6. **D6 Base/logistics:** nâng cấp/kho/farm/đất thử nghiệm/partner; hai đường kho không đổi và currencies không mất.
7. **D7 Services/story hubs:** outpost/castle/island; NPC gifts/quest/recycle/repair/cure, trade/barter/shop, recipe Lâm Hàn, debt/invest/fishing, mọi map-event family trong audit.
8. **D8 Secondary/endgame:** journal/notes, tools và standalone URLs, settings/input/music, devtools/About, save/load/delete/overwrite, records/achievements, toàn bộ endings.

Sau mỗi nhóm: chạy baseline + tests mới + smoke journey xuyên màn; lập danh sách màn migrated/thực sự verified, chụp ảnh sau khi màn đó hoạt động. Không bỏ feature ít gặp chỉ vì không nằm trên happy path.

### Stage E — enhancement tablet/desktop

- Cùng navigation và Core adapter, không khôi phục dashboard cũ.
- Tablet 768/1024, desktop 1280/1366/1920; master-detail khi hợp lý, giới hạn độ dài dòng, keyboard, landscape.
- Không dùng một bản desktop khác chạy command khác với mobile.

### Stage F — regression/acceptance

- Chạy toàn bộ suite với browser runner portable, phân biệt PASS/FAIL/SKIP/BLOCKED; không tính skip là pass.
- So sánh gameplay, RNG calls, storage và save compatibility; mobile interaction/viewport/accessibility; offline và performance/Pixi lifecycle.
- Bàn giao screenshots thực major screens mobile/desktop, regression report cuối và `batch-09-final-acceptance-report.md` với kết luận thật.
- Cổng: không missing features, fake buttons, stale commands, engine behavior diff hay browser checks chưa chạy bị ghi pass.

## 6. Kế hoạch kiểm thử bổ sung (chưa thêm test)

### Behavioral differential harness

Fixture cùng normalized state, mock localStorage và RNG stream; chạy entry point legacy và adapter mới trong hai VM độc lập, so sánh snapshot gameplay/options/story/storage và số/thứ tự lần gọi RNG. Chỉ loại trừ UI fields đã xác định, không bỏ qua mọi field bắt đầu `_` vì có transient gameplay flags quan trọng. Timestamp save được cố định lúc so sánh; normalization/JSON Infinity giữ đúng baseline hiện hành, không lén sửa trong redesign.

### Bộ ca bắt buộc

- Mỗi nhóm 01–28 trong audit có ít nhất một journey cùng empty/disabled/error/back; nhánh nguy hiểm có confirm/cancel/death.
- Food/drink/medicine, duplicate weapon ID/durability, backpack capacity, ammo, last-stack/discard, repeated taps và stale action sau load.
- Kho full/merge/partial/exclusions/currencies cho cả menu và modal path, crops partial harvest, costs/time của upgrade.
- Trade cancellation/time, loan interest/due date, investment settle RNG, shop refresh, fishing/recipe, NPC gift/quest/affinity/cooldowns.
- Save slots 0–10, corrupt/missing fields, representative historical fixtures, load về đúng location, transient-save rejection, autosave cadence, endings restart/continue/unlock.
- Pure tab/filter/modal transitions không đổi game state, turn/RNG/options/storage; không action từ stale phase.
- Bảo toàn text/narrative, cả số lựa chọn được nội dung tham chiếu, locked achievements và credits.

### Browser và device acceptance

- Width: 320/360/375/390/430/768/1024/1280/1366/1920, thêm height thấp và landscape.
- Assert document và active containers không tràn ngang, controls không overlap/occlude, bounding boxes touch targets >=44×44 **CSS px**, text zoom 200%, focus order/dialog behavior.
- Chromium/Firefox/WebKit khi có runner; iOS Safari/Android Chrome thật để kiểm safe area/keyboard/gestures. Không gọi desktop emulation là kiểm thiết bị thật.
- Canvas visibility/resize, single app/ticker/listener cleanup sau 20 lần đổi view; WebGL failure/asset failure có DOM fallback hoạt động.
- Offline: truy cập local server khi ngắt Internet, fonts/assets/tools CSV/music không phụ thuộc remote; cold hosted startup offline chỉ cam kết nếu có cơ chế caching được duyệt/test riêng. Không thêm service worker ngoài scope âm thầm.
- Performance: đo initial load, command-to-render, scroll, memory/GPU trước/sau trên cùng fixture/device; định nghĩa budget sau baseline đo thật, không tự ghi “zero regression” từ source inspection.

## 7. Hạ tầng test cần xử lý sau phê duyệt

Các browser tests Phase 09.3–09.6 hardcode macOS Chrome; cần discovery cross-platform hoặc executable cấu hình được, URL file/path portable hoặc local HTTP server, profile temp phù hợp Windows, và skip semantics trung thực. Đây là thay đổi test tooling, **chưa thực hiện ở Stage A**. Existing source/CSS-string assertions có thể ràng buộc layout cũ; thay bằng behavioral assertions khi migration, không chỉ xóa test khó hoặc hạ số baseline.

## 8. Tài liệu và quản lý thay đổi

- Cập nhật CHANGELOG cho từng stage thực sự hoàn thành; cập nhật ARCHITECTURE/GAMEPLAY-FLOW/FEATURE-INVENTORY khi implementation thay wiring/UI; giữ phần Game Core mô tả nguyên behavior.
- Roadmap mới là đề xuất chờ duyệt, không đánh dấu Stage B–F completed và không âm thầm ghi đè tiến độ Batch 09 cũ.
- Mỗi migration review diff riêng, smoke journeys và regression evidence; rollback chỉ presentation changes của stage đó, không reset save hay thay đổi người dùng.
- Trước xóa legacy renderer: tìm toàn bộ imports/DOM consumers/tests, chứng minh feature coverage, giữ public APIs cần thiết. Không xóa `inventory-ui.js`/`warehouse-ui.js` chỉ vì đã có màn mới.

## 9. Điểm cần người dùng duyệt

1. Bản sắc Field Terminal và navigation bốn mục; bỏ ràng buộc desktop bốn vùng của thiết kế cũ.
2. Adapter giữ hành vi kể cả logic trong file UI cũ; cho phép thay wiring trình bày có kiểm thử, không thay thuật toán.
3. Combat mới là encounter + kết quả/log của engine hiện tại, không engine tương tác mỗi lượt mới.
4. Chỉ migrate hệ thống có thật: recipes Lâm Hàn và farm/đất thử nghiệm; không thêm general crafting/skill/greenhouse giả.
5. Giữ tên đường dẫn bàn giao batch-09 theo yêu cầu dù công việc mang tên Batch 10; có thể đổi nếu người dùng xác nhận.

**Dừng tại đây để chờ phê duyệt.**
