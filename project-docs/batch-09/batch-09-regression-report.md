# Batch 10 — Stage A: Baseline regression trước redesign

Ngày: 2026-11-07. Môi trường: Windows, Node VM modules, commit `455eb65c63d9aa7a7344b41fb29798dffbda4b19`.

**Báo cáo baseline hiện hữu, không phải kết quả UI mới hay final acceptance.**

## Cập nhật sau triển khai Field Terminal — 2026-11-07

- `npm run test:all` đã chạy thành công, exit 0 trên Windows với Google Chrome cài tại `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- `npm test`: cả 12 suite đạt, tổng 126 top-level assertions (95 baseline cũ + 31 Batch 09). Bốn browser gates cũ được migration sang production UI browser suite, không còn chứng minh dashboard bốn vùng cũ. Các assertions tĩnh trên `css/style.css` còn là kiểm tra lịch sử, không được dùng thay bằng chứng layout hiện hành.
- `audit_batch07_final.cjs`: 11/11 PASS.
- `test_batch10_contracts.cjs`: 22/22 PASS; 117 Core/data modules khớp hash baseline, inventory executor/warehouse transfer bodies không đổi; 12 command paths so sánh exact state/options/RNG/storage, stale/disabled commands và save normalization/corruption.
- `test_batch10_browser.cjs`: 81/81 PASS, 0 SKIP. Đo production UI ở 10 widths, real pointer clicks và touch injection vào nav/Pixi POI; pure-navigation invariance, single canvas, item consume/discard cancel, modal focus, settings/input-only/save/load, transient save guard, real combat log, recipes, ending/restart, tools CSV/search, low landscape, 200% text và 20 view cycles.
- Browser suite được gọi lại bởi các gates Batch 09 và chạy standalone ở cuối; **không cộng lặp 81 checks thành số case duy nhất lớn hơn**.
- 24 screenshots tại `screenshots/`: 12 màn × 375×812 và 1366×900, tạo từ Chrome thật. Các ca combat/base/recipes/endings sử dụng fixture test hoặc Core handlers để tới trạng thái hiếm, không phải walkthrough tự nhiên toàn bộ game.
- Chưa kiểm thiết bị vật lý/iOS keyboard/notch, WebKit/Firefox, toàn bộ story/economy branches hay mọi save lịch sử; chưa có before/after performance benchmark. Không kết luận “zero regressions” tuyệt đối.

Baseline audit ban đầu dưới đây được giữ để đối chiếu blocker đã xử lý.

## 1. Phương pháp và bảo vệ workspace

- Không sửa source, package, test hoặc assets.
- Chạy trong bản sao `C:\Users\dungu\AppData\Local\Temp\opencode\batch10-stage-a-20261107-093459` gồm js/css/tests, index.html/package.json/server.js, scratch riêng; public là junction đọc tới assets gốc. Các tests đã kiểm tra không ghi public.
- Mục đích: test Batch 09 sinh HTML vào scratch; workspace đang có hai harness thay đổi sẵn nên không chạy lại bằng cách ghi đè chúng.
- Sau chuẩn bị, 139 file source/test/config trong bản sao khớp từng byte với workspace. Aggregate SHA256 (file path chuẩn hóa + NUL + bytes + NUL, sort path): `aac75c49be75c67ae588d6d4044d2b1ec6b68d9ddc650a1f7a878b1e202a08f2`.
- Lượt chuẩn bị đầu tiên thiếu `server.js`, gây lỗi fixture copy trong Phase 8.4; đã bổ sung bản sao và chạy lại `npm test`. Kết quả dưới đây dùng lượt chạy lại, không ghi lỗi copy đó là lỗi repository.

## 2. Lệnh và kết quả thực tế

`npm test` chạy các suite nối bằng `&&`; exit code **1**, dừng ở Phase 09.3.

- `test_batch06_final_validation.cjs`: 20/20 PASS.
- `test_phase3_1_regression.cjs`: 15/15 PASS.
- `test_batch05_item_icons.cjs`: 14/14 PASS.
- `test_batch07_map_integration.cjs`: 12/12 PASS.
- `test_batch07_phase7_4_ux.cjs`: 8/8 PASS.
- `test_batch08_phase8_2_consistency.cjs`: 6/6 PASS.
- `test_batch08_phase8_3_ux.cjs`: 10/10 PASS.
- `test_batch08_phase8_4_final_qa.cjs`: 10/10 PASS.
- Tổng baseline đến Phase 8.4: **95/95 PASS**.
- `test_batch09_phase09_3_mobile_layout.cjs`: 7 PASS, 1 FAIL hạ tầng browser. Vì vậy toàn lệnh npm test ghi 102 PASS và 1 FAIL trước khi dừng; các suite sau không được npm chạy trong lượt này.

Chạy riêng bằng `node --experimental-vm-modules tests/<file>`:

- `test_batch09_phase09_4_subscreens.cjs`: 6 PASS, 1 FAIL hạ tầng, exit 1.
- `test_batch09_phase09_5_combat_story.cjs`: 6 PASS, 1 FAIL hạ tầng, exit 1.
- `test_batch09_phase09_6_pixi_map.cjs`: script ghi 9 PASS/0 FAIL, exit 0; thực chất 8 kiểm tra chạy đạt và 1 browser check **SKIP** với thông báo `Skipped: Chrome binary not found`. Không coi đây là browser PASS.
- `audit_batch07_final.cjs` (file thứ 13, không nằm trong npm test): 11/11 PASS, exit 0.

Không dùng các con số trên để khẳng định tất cả hành vi gameplay/thiết bị đều đã được kiểm tra. Nhiều kiểm tra dùng VM/stub hoặc assert chuỗi source/CSS, không phải browser thật.

## 3. Browser blocker xác nhận

Phase 09.3/09.4/09.5/09.6 hardcode:

`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

Windows báo `The system cannot find the path specified.`. Các command còn dùng profile `/tmp/...` và file URL cần portability. Phase 09.6 bỏ qua khi không có executable nhưng record true thành PASS.

Đây là lỗi portability/reporting đã xác nhận; không suy ra gameplay thất bại, cũng không chứng minh layout hoạt động. Chưa sửa vì Stage A cấm source/test implementation changes.

## 4. Evidence

Logs lưu trong thư mục tạm ở mục 1:

- `baseline-npm-test.log` (lượt chạy lại có đủ server.js).
- `test_batch09_phase09_4_subscreens.cjs.log`.
- `test_batch09_phase09_5_combat_story.cjs.log`.
- `test_batch09_phase09_6_pixi_map.cjs.log`.
- `audit_batch07_final.cjs.log`.

Thư mục tạm không phải artifact versioned và có thể bị hệ thống dọn. Báo cáo này ghi lệnh, suite counts, lỗi và giới hạn để lưu bằng chứng lâu dài; chưa thêm test mới.

## 5. Save/load và Game Core preservation

- Đã đọc 11-slot protocol `zombie_save_0..10`, `zombie_best_record`, settings key `zombieWorldGameSettings`, clean transient fields và `normalizeState`.
- Core/source/test/config không thay đổi trong Stage A; không có schema migration, không thao tác storage của người chơi.
- Baseline regression có kiểm tra save/load và inventory theo fixtures hiện có. **Chưa chạy nhập kho save lịch sử của người chơi, chưa có parity tests cho UI mới**. Không thể xác nhận “hỗ trợ mọi save hiện có” bằng source audit này.
- Kế hoạch bổ sung differential commands/storage/RNG, historical save fixtures và browser journeys nằm trong migration plan; chưa thực thi.

## 6. Chưa xác minh

- Không màn hình nào được migrate, không prototype mới, không screenshots redesigned.
- Chưa browser/mobile acceptance tại 320/375/430px hoặc desktop; không kiểm iOS safe area/keyboard hay Android gestures.
- Chưa đo overflow/touch bounding boxes, focus/screen reader/zoom, map coordinates qua thao tác thật.
- Chưa test cold offline startup, lỗi network font, performance/FPS/memory và mọi branch economy/quest/endings.
- Không công bố baseline “124/124” hoặc “zero gameplay regressions” cho UI chưa xây.

## 7. Kết luận

Baseline VM/static đến Phase 8.4 tái lập đạt **95/95**. Full npm test hiện **không xanh** trên Windows do browser path; một browser check bị skip nhưng script báo pass. Cần sửa test tooling sau phê duyệt và thực hiện acceptance thực trong Stage F. **Chưa đủ điều kiện nghiệm thu redesign.**
