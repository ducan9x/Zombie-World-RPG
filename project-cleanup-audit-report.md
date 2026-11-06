# BÁO CÁO AUDIT DỌN DẸP DỰ ÁN (PROJECT CLEANUP AUDIT REPORT)
## DỰ ÁN: ZOMBIE WORLD RPG
**Thời điểm thực hiện:** 06/11/2026  
**Chế độ thực thi:** **AUDIT ONLY (CHƯA XÓA/DI CHUYỂN BẤT KỲ FILE NÀO)**  
**Mục tiêu:** Rà soát toàn bộ repository, phát hiện file thừa, file test tạm, file scratch, file trùng lặp và tài liệu lỗi thời trước khi triển khai Batch 07; bảo toàn 100% tính toàn vẹn của mã nguồn, gameplay và dữ liệu game.

---

### A. TỔNG QUAN HỆ THỐNG TẬP TIN

| Nhóm tập tin | Số lượng | Dung lượng ước tính | Đánh giá sơ bộ |
|---|:---:|:---:|---|
| **Tổng số file quét toàn bộ dự án** (không tính `.git`, `node_modules`) | **443 files** | ~132 MB | Dự án hoạt động ổn định, tài nguyên chính nằm ở `public/assets/` và `scratch/`. |
| **Mã nguồn trò chơi (`js/`)** | 119 files | ~1.5 MB | **100% PRODUCTION** (Bao gồm hệ thống cốt lõi, modular maps, data, npcs, castle, island). |
| **Giao diện & Stylesheet (`css/`, `index.html`)** | 2 files | ~110 KB | **100% PRODUCTION** (Giao diện chính và CSS3 custom properties). |
| **Tài nguyên Media & Game Assets (`public/`)** | 110 files | ~14.5 MB | **100% PRODUCTION** (Âm thanh, icon UI Batch 01 & 06, background, sprite Batch 04, vendor PixiJS). |
| **Công cụ phát triển (`tools/`, `server.js`)** | 8 files | ~120 KB | **100% PRODUCTION/TOOLING** (Server phát triển offline, bách khoa toàn thư, bảng xác suất). |
| **Tập tin cấu hình & Bản quyền (Root)** | 7 files | ~60 KB | `package.json`, `pnpm-lock.yaml`, `LICENSE`, `CNAME`, `.gitignore`, `.github`. |
| **Tập tin Test & Test Scripts** | 19 files | ~210 KB | 17 test scripts nằm trong `scratch/` + 2 file test UTF-8 ở thư mục gốc. |
| **Tập tin Scratch / Temporary (`scratch/`)** | 147 files | ~115.3 MB | Gồm 114 file nháp ở thư mục gốc `scratch/`, 21 file phục hồi ảnh, 7 file QA montage, 5 file module cache. |
| **Tập tin Backup cũ (`*.bak`, `*.old`, `*.backup`, `*.orig`)** | **0 files** | 0 KB | Không phát hiện file backup với các hậu tố trên. |
| **Tài liệu dự án (`docs/`, `project-docs/`, Root Markdown)** | 46 files | ~1.8 MB | Gồm tài liệu kiến trúc, hướng dẫn bảo trì, đặc tả batch, báo cáo nghiệm thu và bản sao tài liệu song ngữ. |

---

### B. DANH SÁCH KEEP (BẮT BUỘC GIỮ LẠI)

Các file thuộc nhóm này đóng vai trò sống còn đối với runtime, build, quy chuẩn tài nguyên và gameplay:

1. **Toàn bộ 119 files trong thư mục `js/`:**
   - `js/main.js`, `js/state.js`, `js/ui.js`, `js/combat.js`, `js/combat-hud.js`, `js/inventory-ui.js`, `js/equipment.js`, `js/save.js`, `js/base.js`, `js/config.js`, `js/maps.js`, `js/pixi-renderer.js`, `js/routing.js`, `js/trading.js`, `js/farming.js`, `js/faction.js`, `js/cheats.js`.
   - Toàn bộ thư mục con: `js/data/` (41 files), `js/map-events/` (23 files), `js/island/` (10 files), `js/game/` (9 files), `js/castle/` (8 files), `js/npcs/` (6 files), `js/outpost/` (5 files).
   - *Lý do:* Đây là toàn bộ logic gameplay, dữ liệu cân bằng, hệ thống sự kiện và tương tác của trò chơi.

2. **Toàn bộ 110 files trong thư mục `public/`:**
   - `public/assets/icons/`: Toàn bộ 15 icon UI Batch 01 và 4 icon mới Batch 06.
   - `public/assets/backgrounds/`: Các ảnh nền WebP đã được tối ưu.
   - `public/assets/characters/`: Ảnh người chơi (`player/`) và NPC (`npcs/`).
   - `public/assets/zombies/`: Kho sprite zombie đã kiểm định từ Batch 04.
   - `public/vendor/pixi.min.js`: Thư viện đồ họa PixiJS v7.4.3 offline.
   - `public/audio/`: Nhạc nền trò chơi.
   - `public/icon/`: Favicon game.
   - *Lý do:* Runtime assets được nạp trực tiếp qua thẻ `<img>` và PixiJS Sprite Loader.

3. **Tập tin gốc và Web Core:**
   - `index.html`: Entrypoint giao diện chính của game.
   - `css/style.css`: Toàn bộ hệ thống stylesheet, HUD, visual cards, animations.
   - `server.js`: Web server Node.js phục vụ môi trường chạy offline.
   - `package.json`, `pnpm-lock.yaml`: Cấu hình dependencies và start script.
   - `LICENSE`, `CNAME`, `.gitignore`, `.github/workflows/ci.yml`.

4. **Tài liệu kiến trúc và hướng dẫn nghiệp vụ cốt lõi:**
   - `project-docs/ARCHITECTURE.md`: Kiến trúc tổng quan hệ thống.
   - `project-docs/FEATURE-INVENTORY.md`: Bảng tính năng trò chơi.
   - `project-docs/GAMEPLAY-FLOW.md`: Sơ đồ luồng trạng thái gameplay.
   - `project-docs/ROADMAP-PLAN.md`: Kế hoạch và lộ trình phát triển.
   - `project-docs/CHANGELOG.md`: Lịch sử thay đổi dự án.
   - `project-docs/assets/asset-manifest.json`: Manifest tài nguyên trung tâm.
   - `project-docs/assets/batches/*.json`: Cấu hình trạng thái từng batch (`batch-01` đến `batch-04`).
   - `project-docs/assets/player-appearance-manifest.json`: Manifest 30 ngoại hình nhân vật.
   - `VIETNAMESE-TERMINOLOGY.md`: Bảng thuật ngữ tiếng Việt chuẩn hóa.
   - `RULE.md`: Quy tắc bắt buộc cập nhật tài liệu thiết kế.
   - `docs/huong_dan_bao_tri_du_lieu.md`: Hướng dẫn bảo trì dữ liệu chuẩn tiếng Việt.
   - `docs/huong_dan_tro_choi_tong_quat.md`: Hướng dẫn chơi game tổng quát tiếng Việt.
   - `docs/huong_dan_tuyen_truyen.md`: Tuyến cốt truyện tiếng Việt.
   - `docs/phan_tich_cot_truyen_chuyen_sau.md`: Phân tích cốt truyện tiếng Việt.
   - `docs/BATCH_04_ZOMBIE_SPEC.md`, `docs/BATCH_03_CHARACTER_SPEC.md`: Đặc tả kỹ thuật các batch asset đã duyệt.

5. **Bộ kiểm thử hồi quy có giá trị cao (High-Value Regression Suites):**
   - `scratch/test_batch06_final_validation.cjs` (20 checklist kiểm định toàn diện Batch 06).
   - `scratch/test_phase3_1_regression.cjs` (15 test cases chuyên sâu Index Mapping và Lifecycle Inventory).
   - *Khuyến nghị:* **KHÔNG XÓA**. Nên di chuyển (Promote) vào một thư mục chính thức `tests/` để tiếp tục chạy CI/regression trước mỗi Batch mới.

---

### C. DANH SÁCH UPDATE (CẦN CHỈNH SỬA / CẬP NHẬT)

Các tài liệu còn giá trị nhưng hiện tại đã bị lệch một phần so với mã nguồn thực tế sau khi hoàn thành Batch 06:

| Tập tin | Hiện trạng | Nội dung cần cập nhật |
|---|---|---|
| [`README.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/README.md) | Chưa phản ánh các tính năng mới của Batch 06 (Combat Visual HUD, Visual Inventory UI, 4 UI Icons mới). | Cập nhật mục tính năng giao diện, bổ sung hình ảnh minh họa Combat HUD và Kho đồ mới, cập nhật danh sách Batch hoàn thành (Batch 01 - 06). |
| [`README_zh-CN.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/README_zh-CN.md) | File mang tên `_zh-CN` nhưng thực tế bên trong là nội dung Tiếng Việt bị trùng lặp với `README.md`. | Đổi tên hoặc chuẩn hóa thành `README_vi.md`, đồng bộ cấu trúc với `README.md`. |
| [`project-docs/CHANGELOG.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/CHANGELOG.md) | Mới ghi nhận đến Batch 04 / Phase 1 của Batch 06. | Bổ sung chi tiết hoàn thành: Batch 05 (Item Icons Audit & Integration) và Batch 06 (Phase 1, Phase 2 Combat HUD, Phase 3 Inventory UI, Phase 3.1 Hardening, Phase 4.1 Icon Integration & Final Validation). |
| [`project-docs/ROADMAP-PLAN.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/project-docs/ROADMAP-PLAN.md) | Batch 05 và Batch 06 đang ở trạng thái Pending hoặc In-Progress. | Đánh dấu Batch 05 & Batch 06: **COMPLETED**; chuyển trọng tâm tiếp theo sang **Batch 07**. |
| [`docs/UI_FLOW_CURRENT.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/docs/UI_FLOW_CURRENT.md) | Mô tả giao diện cũ dạng văn bản trước khi có Combat HUD và Visual Inventory Card Grid. | Cập nhật sơ đồ luồng hiển thị Combat HUD (`combat-hud.js`) và modal chi tiết kho đồ (`inventory-ui.js`). |

---

### D. DANH SÁCH ARCHIVE (NÊN DI CHUYỂN VÀO THƯ MỤC LƯU TRỮ LỊCH SỬ)

Các tài liệu nghiệm thu trung gian, báo cáo giai đoạn đã hoàn thành có giá trị tham khảo lịch sử nhưng không nên để rải rác ở thư mục gốc:

| Tập tin hiện tại | Thư mục đề xuất chuyển đến | Lý do Archive |
|---|---|---|
| `batch-06-final-acceptance-report.md` (Root) | `project-docs/reports/batch-06/` | Báo cáo nghiệm thu chính thức Batch 06. |
| `batch-06-phase-3.1-regression-report.md` (Root) | `project-docs/reports/batch-06/` | Báo cáo kiểm tra hồi quy Phase 3.1. |
| `batch-06-phase-3-report.md` (Root) | `project-docs/reports/batch-06/` | Báo cáo giai đoạn Phase 3. |
| `PROJECT-AUDIT-REPORT.md` (Root) | `project-docs/reports/audit/` | Báo cáo audit toàn diện giai đoạn khởi động dự án. |
| `docs/asset-audit/batch-05-item-icons-audit.md` | `project-docs/assets/reports/` | Báo cáo kiểm kê Batch 05 (154 KB). |
| `docs/asset-audit/batch-06-game-ui-audit.md` | `project-docs/assets/reports/` | Báo cáo audit ban đầu của Batch 06. |
| `docs/BACKGROUND_OPTIMIZATION_REPORT.md` | `project-docs/assets/reports/` | Báo cáo tối ưu ảnh nền Batch 02. |
| `docs/BATCH_03_GENERATION_REPORT.md` | `project-docs/assets/reports/` | Báo cáo khởi tạo Batch 03. |
| `docs/PIXIJS_AUDIT_REPORT.md` | `project-docs/reports/pixijs/` | Báo cáo audit PixiJS. |
| `docs/PIXIJ_ASSET_INVENTORY.md` | `project-docs/reports/pixijs/` | Danh mục tài nguyên PixiJS ban đầu. |
| `docs/BATCH_04_MANUAL_IMAGE_PROMPTS.md` | `project-docs/assets/batches/` | Tài liệu prompt hỗ trợ sinh ảnh ngoại vi Batch 04. |
| `scratch/qa/` (7 files: `*_montage.png`, `*_montage.svg`) | `project-docs/assets/qa/` | Ảnh montage so sánh trực quan phục vụ QA Batch 03 & Batch 04. |

---

### E. DANH SÁCH DELETE (ĐỀ XUẤT XÓA SAU KHI ĐƯỢC PHÊ DUYỆT)

Dưới đây là các file tạm, file thử nghiệm một lần (one-off), cache sinh tự động hoặc file trùng lặp byte-for-byte không còn bất kỳ tham chiếu nào trong runtime.

> [!IMPORTANT]
> **Toàn bộ danh sách này CHƯA BỊ XÓA.** Chúng chỉ được xóa khi lập trình viên xem xét và xác nhận bằng văn bản.

#### 1. File rác và file test UTF-8 ở thư mục gốc (2 files)
| Đường dẫn | Loại | Lý do đề xuất xóa | Tham chiếu | Mức độ an toàn |
|---|:---:|---|---|:---:|
| `_testutf8.txt` | Text tạm | File sinh ra trong lúc sửa lỗi encoding UTF-8 tiếng Việt, không dùng trong game. | 0 tham chiếu | **HIGH** |
| `_testutf8b.txt` | Text tạm | File sinh ra trong lúc sửa lỗi encoding UTF-8 tiếng Việt, không dùng trong game. | 0 tham chiếu | **HIGH** |

#### 2. Thư mục Cache biên dịch trong scratch (`scratch/module-cache/` - 5 files)
| Đường dẫn | Loại | Lý do đề xuất xóa | Tham chiếu | Mức độ an toàn |
|---|:---:|---|---|:---:|
| `scratch/module-cache/3H3G7ZME8UHBB/SwiftShims-3NQPJMR94IEXI.pcm` | Cache binary | Cache clang/swift sót lại từ môi trường build ngoài. | 0 tham chiếu | **HIGH** |
| `scratch/module-cache/modules.timestamp` | Cache meta | Timestamp cache biên dịch ngoài. | 0 tham chiếu | **HIGH** |
| `scratch/module-cache/Swift-363ETFRWARY44.swiftmodule` | Cache binary | Swift module binary cache. | 0 tham chiếu | **HIGH** |
| `scratch/module-cache/Swift-363ETFRWARY44.swiftmodule.lock` | Lock file | Lock file tạm thời của cache. | 0 tham chiếu | **HIGH** |
| `scratch/module-cache/Swift-363ETFRWARY44.swiftmodule.lock-14b19376` | Lock file | Lock file tạm thời của cache. | 0 tham chiếu | **HIGH** |

#### 3. Bản sao tài liệu trùng lặp 100% byte-for-byte trong `docs/` (2 files)
| Đường dẫn | Loại | Lý do đề xuất xóa | Tham chiếu | Mức độ an toàn |
|---|:---:|---|---|:---:|
| `docs/Data Maintenance Guide.md` | Markdown | Trùng lặp chính xác 100% byte-for-byte (84.5 KB) với `docs/huong_dan_bao_tri_du_lieu.md`. Cả hai đều có nội dung tiếng Việt giống hệt nhau. Giữ lại bản tiếng Việt có dấu gạch dưới chuẩn SEO. | Cần chuyển link trong `README.md` sang file tiếng Việt | **MEDIUM** (Cần cập nhật link README trước khi xóa) |
| `docs/General-Game-Guide.md` | Markdown | Trùng lặp chính xác 100% byte-for-byte (68.7 KB) với `docs/huong_dan_tro_choi_tong_quat.md`. Giữ lại bản tiếng Việt có dấu gạch dưới. | Cần chuyển link trong `README.md` sang file tiếng Việt | **MEDIUM** (Cần cập nhật link README trước khi xóa) |

#### 4. File ảnh mockup SVG tạm thời trong `scratch/` (21 files)
Các file này được sinh ra trong các turn trước để tính toán bounding box và tỷ lệ render nhân vật PixiJS, không phải game assets:
- `scratch/comp_perfect.svg`
- `scratch/preview_3test.svg`
- `scratch/preview_5test.svg`
- `scratch/preview_bfsb.svg`
- `scratch/preview_exact.svg`
- `scratch/preview_exact2.svg`
- `scratch/preview_med.svg`
- `scratch/preview_no_trim.svg`
- `scratch/preview_npc_test.svg`
- `scratch/preview_pass_sample.svg`
- `scratch/preview_perfect.svg`
- `scratch/preview_perfect2.svg`
- `scratch/preview_perfect3.svg`
- `scratch/preview_perfect_final.svg`
- `scratch/preview_pfill.svg`
- `scratch/preview_ratio.svg`
- `scratch/preview_raw_b.svg`
- `scratch/preview_rbr.svg`
- `scratch/preview_test.svg`
- `scratch/preview_ya_med.svg`
*(Đánh giá an toàn: **HIGH** - Không có tham chiếu trong code sản phẩm hay HTML).*

#### 5. Script C# cục bộ độc lập trong `scratch/` (4 files)
Các file code C# được lập trình viên viết để chạy xử lý ảnh cục bộ qua .NET Core, không nằm trong pipeline Node.js hay web build:
- `scratch/BatchProcessor.cs`
- `scratch/ImageProcessor.cs`
- `scratch/PerfectBackpackProcessor.cs`
- `scratch/ResizeBackground.cs`
*(Đánh giá an toàn: **HIGH** nếu đã xử lý xong ảnh Batch 02/03; hoặc **NEEDS_REVIEW** nếu lập trình viên muốn giữ làm công cụ cá nhân).*

#### 6. Các script one-off test và patch trung gian trong `scratch/` (~70 files)
Các script đã hoàn thành nhiệm vụ lịch sử, dữ liệu đã được áp dụng vào codebase chính hoặc đã được thay thế bởi bộ test tổng hợp:
- **Nhóm script patch/update đã áp dụng vào code:** `patch_init.cjs`, `patch_inv.cjs`, `patch_save.cjs`, `update_combat.cjs`, `update_ui.cjs`, `update_ui.mjs`, `update_ui_inv.cjs`, `append_changelog.cjs`, `append_changelog_b4.cjs`, `append_changelog_batch03.cjs`, `append_combat_css.cjs`, `append_inventory_css.cjs`.
- **Nhóm script kiểm tra tra cứu tạm:** `check_b3_npcs.cjs`, `check_combat_images.cjs`, `check_football_diver.cjs`, `check_nurse_manifest.cjs`, `check_nurse_spec.cjs`, `check_recovery_sources.cjs`, `check_ui_pixi_creatures.cjs`, `find_brain_images.cjs`, `find_zombie_images.cjs`, `inspect_batch_reports.cjs`, `inspect_batch_structure.cjs`, `inspect_combat.cjs`, `inspect_docs.cjs`, `inspect_manifest_zombies.cjs`, `inspect_pixi.cjs`, `inspect_pixi_render.cjs`, `read_b3_report.cjs`, `read_full_b3_rep.cjs`, `read_npcs.cjs`, `read_table_2_4.cjs`, `search_asset_manifest.cjs`, `search_code_refs.cjs`, `search_nurse.cjs`, `search_ui_occurrences.cjs`, `audit_entities.cjs`, `survey_characters.mjs`, `survey_combat.mjs`, `survey_entities.mjs`.
- **Nhóm script test riêng lẻ giai đoạn nháp:** `test_combat_hud.cjs`, `test_combat_log.mjs`, `test_detect.cjs`, `test_e2e_combat_hud.mjs`, `test_index_mapping.cjs`, `test_inventory_logic.mjs`, `test_options_logic.cjs`, `test_phase3_e2e.cjs`, `test_phase3_inventory.mjs`, `test_phase3_runner.js`, `test_save_load_inventory.cjs`, `test_state_funcs.mjs`, `test_ui_import.mjs`, `test_ui_mock_dom.cjs`, `test_ui_syntax.cjs`.
- **Tập tin dữ liệu tạm dump ra trong quá trình kiểm kê:** `scratch/all_items_dump.json`, `scratch/recovery_results.json`.
*(Đánh giá an toàn: **HIGH** - Không có bất kỳ file production nào import các file này).*

---

### F. RỦI RO & CÁC TẬP TIN CẦN LẬP TRÌNH VIÊN LƯU TÂM (CRITICAL NOTICE)

> [!WARNING]
> **RỦI RO P0: Thư mục `scratch/backup_recovery_source/` (65.6 MB, 21 files)**
> Qua kiểm tra chuyên sâu, trong thư mục này có **6 file ảnh NPC** chưa tồn tại trong `public/assets/characters/npcs/`:
> 1. ` npc_tien_si_tran.png` (có dấu cách ở đầu tên file)
> 2. `npc_co_v.png`
> 3. `npc_lili.png`
> 4. `npc_muc_mieu_mieu.png`
> 5. `npc_tieu_ham.png`
> 6. `npc_vua_karen.png`
>
> 15 file ảnh người chơi còn lại (`adult_male_survivor.png`, `young_adult_female_casual.png`,...) đã có bản gốc trong `public/assets/characters/player/`.
> 
> **Khuyến nghị xử lý an toàn:**
> - **TUYỆT ĐỐI KHÔNG XÓA** thư mục `scratch/backup_recovery_source/` lúc này.
> - Cần thực hiện sao chép 6 ảnh NPC trên vào đúng thư mục đích `public/assets/characters/npcs/` (chuẩn hóa lại tên bỏ khoảng trắng thừa), sau đó mới di chuyển thư mục recovery này vào Archive lưu trữ an toàn.

> [!NOTE]
> **RỦI RO P1: Bộ kiểm thử hồi quy Batch 06**
> - Hai file `scratch/test_batch06_final_validation.cjs` và `scratch/test_phase3_1_regression.cjs` hiện đang là suite kiểm thử hồi quy mạnh mẽ nhất của dự án (kiểm tra 35 ca kiểm thử bao gồm Index Mapping, debounce, combat log, dynamic HP, save/load).
> - **Khuyến nghị:** Tạo thư mục `tests/` tại root và di chuyển 2 file này vào đó, thay vì xếp vào nhóm file rác cần xóa.

---

### G. ĐỀ XUẤT KẾ HOẠCH HÀNH ĐỘNG DỌN DẸP (KHI ĐƯỢC DUYỆT)

1. **Bước 1 (Bảo vệ dữ liệu NPC):** Di chuyển 6 ảnh NPC từ `scratch/backup_recovery_source/` sang `public/assets/characters/npcs/`.
2. **Bước 2 (Bảo vệ Test Suite):** Tạo thư mục `tests/` và chuyển 2 file regression test Batch 06 vào đó.
3. **Bước 3 (Archive tài liệu):** Tạo thư mục `project-docs/reports/batch-06/` và di chuyển các file markdown nghiệm thu từ Root vào đó.
4. **Bước 4 (Dọn dẹp an toàn):** Xóa 2 file UTF-8 test ở root, xóa `scratch/module-cache/`, xóa các script nháp one-off trong `scratch/`.
5. **Bước 5 (Cập nhật Documentation):** Cập nhật `README.md`, `project-docs/CHANGELOG.md` và `project-docs/ROADMAP-PLAN.md`.
6. **Bước 6 (Regression Testing):** Chạy lại toàn bộ test suite để đảm bảo game khởi động và hoạt động trơn tru 100%.

---

*Báo cáo Audit hoàn tất. Hệ thống đang ở trạng thái an toàn tuyệt đối, chưa có bất kỳ tệp tin nào bị xóa hay thay đổi.*

