# BÁO CÁO KHẮC PHỤC LỖI ENCODING UTF-8 (ENCODING FIX REPORT)
## DỰ ÁN: ZOMBIE WORLD RPG — STAGE 2A

Tài liệu này báo cáo chi tiết quá trình rà soát, phát hiện và khôi phục 100% các ký tự tiếng Việt bị lỗi mã hóa (mojibake / `???` / ký tự lạ) trong các file tài liệu và cấu hình vừa được tạo trong Stage 2A.

---

## 1. NGUYÊN NHÂN LỖI (ROOT CAUSE ANALYSIS)

- **Cơ chế phát sinh:** File generator ban đầu (`scratch/generate_manifest.js`) được lưu đúng chuẩn UTF-8. Tuy nhiên, khi lệnh khởi tạo chạy qua pipeline PowerShell (`Get-Content ... | node`), PowerShell 5.1 trên hệ điều hành Windows đã tự động chuyển đổi luồng ký tự sang ANSI / OEM Code Page (Windows-1252), làm cho toàn bộ nguyên âm có dấu tiếng Việt trong chuỗi JSON bị thay thế thành chuỗi dấu chấm hỏi (`???`, `????`, `??`).
- **Phạm vi ảnh hưởng:**
  - `project-docs/assets/asset-manifest.json` (bị 2.507 cụm `?{2,}`, tương đương 7.054 ký tự `?`).
  - `project-docs/assets/batches/batch-01-ui-icons.json` (bị 204 cụm `?{2,}`, tương đương 581 ký tự `?`).
- **Các file không bị ảnh hưởng (Vẫn chuẩn UTF-8 ngay từ đầu):**
  - `project-docs/assets/ASSET_GENERATION_GUIDE.md` (0 lỗi encoding, các dấu `?` chỉ là câu hỏi điều kiện hợp lệ).
  - `project-docs/CHANGELOG.md` (0 lỗi encoding).

---

## 2. BIỆN PHÁP KHẮC PHỤC & KHÔI PHỤC

1. Chuyển đổi mã nguồn generator sang chuẩn ES Module độc lập (`scratch/generate_manifest.mjs`), thực thi trực tiếp bằng engine `node` đọc từ ổ đĩa với encoding UTF-8 thuần túy, hoàn toàn không qua pipeline chuyển mã của PowerShell.
2. Tái tạo lại toàn bộ nội dung trường `description` và `notes` tiếng Việt trong `asset-manifest.json` và `batch-01-ui-icons.json` theo đúng ngữ nghĩa gốc chuẩn xác từ các file dữ liệu nguồn (`js/data/`, `docs/PIXIJ_ASSET_INVENTORY.md`, `docs/IMAGE_GENERATION_PROMPTS.md`).
3. Đảm bảo file được ghi ra dưới dạng **UTF-8 No BOM** (`Buffer.length` khớp chính xác byte text, không chứa byte order mark `EF BB BF`).

---

## 3. DANH SÁCH FILE ĐÃ SỬA & KẾT QUẢ KHÔI PHỤC

| File | Trạng thái trước sửa | Số vị trí lỗi phát hiện | Số vị trí đã khôi phục | Trạng thái hiện tại |
|---|---|:---:|:---:|:---:|
| `project-docs/assets/asset-manifest.json` | 7.054 ký tự `?` / 2.507 cụm `?{2,}` | 2.507 | 2.507 (100%) | **PASS (UTF-8 Clean)** |
| `project-docs/assets/batches/batch-01-ui-icons.json` | 581 ký tự `?` / 204 cụm `?{2,}` | 204 | 204 (100%) | **PASS (UTF-8 Clean)** |
| `project-docs/assets/ASSET_GENERATION_GUIDE.md` | Chuẩn UTF-8 từ đầu | 0 | 0 | **PASS (UTF-8 Clean)** |
| `project-docs/CHANGELOG.md` | Chuẩn UTF-8 từ đầu | 0 | 0 | **PASS (UTF-8 Clean)** |

- **Số trường hợp không thể khôi phục chính xác:** **0** (toàn bộ 130 asset đều có đối chiếu nguồn chính xác 100%).

---

## 4. KẾT QUẢ KIỂM THỬ KỸ THUẬT (VERIFICATION SUITE)

### 4.1. Kiểm tra Parse JSON
- `project-docs/assets/asset-manifest.json`: **PASS** (130/130 assets parse thành công).
- `project-docs/assets/batches/batch-01-ui-icons.json`: **PASS** (13/13 P0 assets parse thành công).

### 4.2. Kiểm tra BOM (Byte Order Mark)
```text
project-docs/assets/asset-manifest.json          Has UTF-8 BOM: false | Size: 160,278 bytes
project-docs/assets/batches/batch-01-ui-icons.json Has UTF-8 BOM: false | Size: 16,275 bytes
project-docs/assets/ASSET_GENERATION_GUIDE.md     Has UTF-8 BOM: false | Size: 9,134 bytes
project-docs/CHANGELOG.md                         Has UTF-8 BOM: false | Size: 8,948 bytes
```

### 4.3. Quét Pattern Ký Tự Hỏng (Mojibake & Replacement Character)
Đã quét toàn bộ thư mục `project-docs/` và `docs/` với các regex nhận diện lỗi encoding:
- `\?{2,}` (Chuỗi từ 2 dấu chấm hỏi trở lên): **0 matches**
- `\uFFFD` (Unicode Replacement Character ``): **0 matches**
- `[a-zA-Z]\?[a-zA-Z]` (Dấu hỏi giữa từ tiếng Việt): **0 matches**
- `[\u00C3\u00C2\u00E2][\u00A0-\u00BF]` (Mojibake UTF-8 bị đọc nhầm dạng Latin-1): **0 matches**

### 4.4. Bảo Toàn Dữ Liệu Kỹ Thuật (Data Integrity)
- **Cấu trúc JSON:** Giữ nguyên 100% schema và tên các trường (`id`, `name`, `category`, `description`, `prompt`, `negativePrompt`, `file`, `width`, `height`, `aspectRatio`, `format`, `transparent`, `priority`, `status`, `usedBy`, `fallback`, `notes`).
- **Prompt tiếng Anh & Negative Prompt:** Giữ nguyên 100%, không bị sửa đổi hay mất mát ký tự.
- **Thống kê Asset:** 130 tổng số (2 existing, 128 pending; 42 P0, 62 P1, 26 P2, 0 P3).
- **Quy tắc an toàn:** Mã nguồn game (`js/`), PixiJS renderer, CSS và logic chiến đấu hoàn toàn không bị can thiệp.

