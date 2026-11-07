# Batch 10 — Field Terminal: Báo cáo bàn giao UI/UX

Ngày: 2026-11-07. Tên thư mục `batch-09` giữ theo yêu cầu bàn giao của Batch 10.

## 1. Kết luận

**Giao diện mới đã tích hợp và chạy; automated acceptance Chromium đạt. Chưa đóng nghiệm thu đa thiết bị thực tế.**

Đây không chỉ là responsive override: ứng dụng không nạp stylesheet layout cũ; có shell, navigation, hierarchy, identity, screen controller, item sheet, overlay lifecycle và tool readers mới. Game Core và dữ liệu được giữ nguyên. Các DOM IDs/public renderer APIs cũ được giữ như integration seams để không phá các module gọi chúng.

Không công bố “đã xác minh mọi cơ chế, mọi save, mọi thiết bị” hoặc “không có regression tuyệt đối”. Kiểm chứng thực tế và giới hạn được tách riêng bên dưới.

## 2. Màn hình đã tích hợp

- Title/hồ sơ mới: hero môi trường, tên và CTA rõ, ngoại hình qua disclosure, inline validation; toàn bộ lựa chọn ngoại hình và tạo game cũ giữ nguyên.
- Hiện trường: một luồng scene/truyện/options trên mobile, contextual screen identity cho home/map/combat/base/farm/warehouse/recipe/dialogue/trade/finance; desktop mở scene/narrative và actions thành hai vùng, không bốn cột cũ.
- Bản đồ: host Pixi ổn định, toolbar touch-friendly, POI và DOM list cùng Core options.
- Combat: encounter/enemy/choices và resolved result/log thật; không thêm turn-by-turn choices không có trong engine.
- Hành trang: Túi/Trang bị/Hồ sơ; cards, capacity, bảy filters, item detail sheet, destructive confirmation, stats/identity/resources/equipment.
- Base/logistics: upgrade options/cost story hiện hữu, crop-slot projection chỉ đọc, plant/harvest options, mobile kho một nguồn và desktop hai pane; cả đường menu lẫn modal transfer giữ nguyên.
- NPC/quests/story/service: mọi phase/action cũ tiếp tục được render trong Field Terminal. Trade/barter, repairs/recycling/cure, castle/outpost/island/bank/investment/fishing/recipes dùng renderer options mới và screen identity theo ngữ cảnh. **Chưa có bespoke visual layout riêng cho từng NPC/service**, nhưng không ẩn/remove lựa chọn để làm UI gọn.
- Hồ sơ sinh tồn: statistics, một số tiến độ đã biết, toàn bộ ghi chú expandable, lối tới achievements/records. Không tạo quest state thứ hai; không thay thế hoặc tiết lộ toàn bộ hidden quest graph.
- System: guarded save/load/overwrite/delete theo Core, settings/music/input, About/credits/devtools entry, achievements/records và tools.
- Endings: văn bản và options Core; terminal endings không có nav để thoát gameOver.
- Tools: danh mục disclosure thay sidebar mobile, probability tables trình bày như cards có nhãn, encyclopedia/search; giữ standalone URLs/CSV/mở tab ngoài và height bridge để tránh iframe scroll trap.
- Dialog/notifications: item/warehouse/discard/devtools focus lifecycle, native accessible notice dialog thay browser alerts trên shell mới, các nút thật có touch target.

## 3. Navigation và kiến trúc

Thanh dưới: **Hiện trường / Hành trang / Hồ sơ / Hệ thống**. Route/subroute/utility/scroll ở closure của presentation app, không serialize vào game state/save.

`game-adapter.js` chặn token stale bằng state object, phase, options reference và option reference. Nó resolve index từ options gốc; sort/filter/page không biến thành command khác. Mỗi entry point giữ đúng handler cũ, đặc biệt dedicated save handlers thay vì tự thêm hậu kiểm gameplay không có trước đây.

`ui.js:renderAll()` là compatibility facade: render các host cũ rồi refresh presentation. `inventory-ui.js` và `warehouse-ui.js` tiếp tục giữ behavioral executors; không clone công thức sang components. `overlays.js` quản lý focus/inert/z-order và gọi close controls hiện hữu. Pixi `sceneOnly` ẩn HUD canvas trùng lặp, không thay travel hoặc coordinate data.

## 4. Bằng chứng bảo toàn Core/save

- 117 module Core/data hiện hữu khớp SHA256 baseline sau chuẩn hóa line ending; bao gồm state/save, combat, routing, game, items/config, map-events, NPC/castle/outpost/island, equipment/trading/base/farming/faction/map-renderer.
- Thân `executeInventoryAction` và các warehouse transfer functions có hash không đổi so với baseline `455eb65`. Thay đổi hai file UI chỉ ở markup/render events.
- Contract suite so sánh 12 lựa chọn căn cứ qua direct handler và adapter: cùng state/options/story, RNG call sequence và storage. Có stale, disabled và corrupt/missing-field save cases.
- LocalStorage keys/11 slots/normalization/autosave/save schema không đổi. Browser đã save slot 1 qua **numeric input-only mode**, rồi load lại qua Core và xác nhận tên/location được phục hồi.
- Không chạy migration hay đụng storage thật của người dùng; test dùng Chrome profile tạm riêng.
- Đây là bằng chứng mạnh về phạm vi thay đổi, không thay thế kiểm thử mọi save lịch sử hoặc mọi branch.

## 5. Tests đã thực thi

Lệnh đầy đủ: `npm run test:all` — **exit 0**.

Log thực thi được lưu tại [batch-10-test-output.txt](batch-10-test-output.txt). Browser tooling mới dùng Node.js 22+ và Chrome/Chromium/Edge cài sẵn; không thêm package dependency.

- 12 suite `npm test`: **126/126** top-level checks.
- Final Batch 07 map audit bổ sung: **11/11**.
- Batch 10 contracts: **22/22**.
- Production Chrome suite: **81/81**, không skip.

Browser gates của bốn suite Batch 09 chạy cùng production Chrome acceptance thay fixtures cưỡng chế layout desktop cũ. Thiếu Chrome/Chromium là lỗi BLOCKED, có thể đặt `CHROME_PATH`/`CHROMIUM_PATH`; không ghi skip là PASS. Các non-browser tests cũ được giữ, nhưng static CSS checks của stylesheet đã nghỉ chỉ là legacy regressions.

Các assertion groups không được cộng thành một con số “unique cases” vì browser suite được chạy lặp trong các gates. Regression report ghi rõ chi tiết và baseline trước refactor.

## 6. Responsive/interaction đã xác minh

- Actual production DOM/layout: 320, 360, 375, 390, 430, 768, 1024, 1280, 1366, 1920px cho bốn primary routes; không document horizontal overflow; mọi visible button tại những states đó >=44×44 CSS px.
- Clicks qua hit-tested screen coordinates, không chỉ gọi `.click()` trên control bị che; touch injection vào bottom nav và một POI Pixi xác nhận một lượt travel đúng map.
- Input-only save, mode guard, modal focus/cancel/restore, inventory tiêu đúng một item, kho deposit thật, transient-save rejection, combat resolve/log, recipe disabled state, ending/restart và tools search.
- 844×390 landscape có vùng nội dung sử dụng được; 200% text trên state được kiểm không overflow; 20 view cycles vẫn một canvas.
- Không uncaught JS exceptions hoặc external HTTP requests trong các journeys đã chạy. Đã bỏ Google Fonts ở shell và cheat tool.
- Không đo mọi button ở mọi branch hoặc chứng nhận accessibility toàn ứng dụng; chưa kiểm máy iOS/Android thật, notch/keyboard thật, screen reader, Firefox/WebKit.

## 7. Screenshots thực

Thư mục `screenshots/`, mỗi nhóm có `-375.png` (375×812) và `-1366.png` (1366×900):

- `title`, `field`, `map`, `inventory`, `settings`, `save`.
- `base`, `warehouse`, `encounter`, `combat-result`, `recipes`, `ending`.

Tổng 24 ảnh. Có thể tái tạo bằng `CAPTURE_SCREENSHOTS=1` khi chạy `test_batch10_browser.cjs` (PowerShell: `$env:CAPTURE_SCREENSHOTS='1'`). Fixture nhân vật/encounter/recipes được ghi trong test; screenshot không được dùng như chứng minh đã chơi qua toàn bộ story.

## 8. Files thay đổi

Nguồn/wiring hiện hữu:

- `index.html`, `js/main.js`, `js/ui.js`, `js/pixi-renderer.js`.
- `js/inventory-ui.js`, `js/warehouse-ui.js` (presentation markup/events).
- `tools/probability.html`, `tools/encyclopedia.html`, `tools/index.html`.
- `package.json` (chỉ thêm scripts, không dependency mới).

Nguồn mới:

- `css/ui/tokens.css`, `foundation.css`, `components.css`, `screens.css`, `tools.css`.
- `js/presentation/app.js`, `game-adapter.js`, `overlays.js`, `screens.js`.
- `tools/presentation.js`.

Tests:

- `tests/test_batch10_contracts.cjs`, `tests/test_batch10_browser.cjs`.
- `tests/helpers/chromium.cjs`, `tests/helpers/current-ui-audit.cjs`.
- Browser gates trong bốn `test_batch09_phase09_{3,4,5,6}_*.cjs`.

Tài liệu: README, CHANGELOG/ARCHITECTURE/GAMEPLAY-FLOW/FEATURE-INVENTORY/ROADMAP, bốn tài liệu Stage A được bổ sung status lịch sử, final report này, execution log và screenshots. Hai `scratch/harness_phase09_4.html`/`harness_phase09_5.html` là thay đổi có sẵn, không thuộc refactor và không được overwrite.

## 9. Giới hạn và công việc còn lại

1. Kiểm nghiệm iOS Safari/Android Chrome thật: keyboard, safe area, tap gestures, sound/autoplay, text scaling và orientation.
2. WebKit/Firefox acceptance, screen reader/focus/contrast audit đầy đủ; stress tất cả modal/long-list branches.
3. Đi qua toàn bộ NPC quests, castle/outpost/island commerce, investment/debt/fishing/farming, mọi endings; chuẩn bị fixtures lịch sử thực cho đủ save shapes.
4. Đo trước/sau performance, memory và GPU trên thiết bị tương đương. Single-canvas test không chứng minh không memory leak hay không performance regression.
5. Generic service screens đã tích hợp nhưng vẫn có thể phát triển bespoke projections sâu hơn, không đổi quyền truy cập/luật.
6. `css/style.css` và nhánh legacy browser fixtures còn làm reference/test lịch sử, không nạp runtime. Có thể dọn riêng sau khi đồng thuận retire tests lịch sử; chưa xóa để không mất audit trail.
7. Offline hiện được kiểm theo local HTTP serving, không external requests trong tested journeys. Chưa có service worker/caching để bảo đảm cold-start hosted URL khi hoàn toàn mất mạng; không tự thêm phạm vi PWA.

**Kết luận phát hành:** có thể chạy/review UI mới và tiếp tục playtest; chưa gắn nhãn “nghiệm thu hoàn toàn trên mọi thiết bị”.
