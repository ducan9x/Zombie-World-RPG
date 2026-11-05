# BÁO CÁO AUDIT PIXIJS & ĐÁNH GIÁ KIẾN TRÚC RENDER
## DỰ ÁN: ZOMBIE WORLD RPG

- **Tác giả:** Senior Game Frontend Engineer
- **Thời gian audit:** Tháng 11/2026
- **Phạm vi kiểm tra:** `js/pixi-renderer.js`, `js/main.js`, `index.html`, `css/style.css`, DOM UI layout (`js/ui.js`), dữ liệu game (`js/data/`).
- **Mục tiêu:** Phân tích toàn diện hiện trạng tích hợp PixiJS, các lỗi tiềm ẩn (CRITICAL, HIGH, MEDIUM, LOW), cơ chế placeholder text/image, nguy cơ rò rỉ bộ nhớ, xung đột responsive và giải pháp kiến trúc để thay thế placeholder bằng asset thực tế mà không làm ảnh hưởng gameplay logic.

---

## 1. TỔNG QUAN HIỆN TRẠNG TÍCH HỢP PIXIJS

Hiện tại, game đang ở giai đoạn **Phase 1.5** theo tài liệu `project-docs/ROADMAP-PLAN.md`.
- File triển khai chính: [`js/pixi-renderer.js`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/js/pixi-renderer.js).
- Điểm khởi tạo và gọi render: [`js/main.js`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/js/main.js#L11-L79).
- DOM UI: Hệ thống menu, panel chỉ số, bảng trang bị, khung cốt truyện và danh sách lựa chọn vẫn đang được render hoàn toàn bằng HTML DOM thông qua `js/ui.js`.
- Thư mục asset PixiJS: `public/assets/pixi/` hiện chỉ chứa file `.gitkeep`, hoàn toàn **chưa có bất kỳ asset texture, sprite, hay hình ảnh nào**.

---

## 2. DANH SÁCH LỖI VÀ VẤN ĐỀ KỸ THUẬT PIXIJS

### 2.1. Phân loại theo mức độ nghiêm trọng

| Mã lỗi | Mức độ | File & Vị trí | Tóm tắt vấn đề |
|---|---|---|---|
| **PIXI-CRIT-01** | `CRITICAL` | `js/pixi-renderer.js:16` | **Static CDN Import gây sập toàn bộ game khi mất mạng / offline / CDN lỗi** |
| **PIXI-CRIT-02** | `CRITICAL` | `js/pixi-renderer.js:100-236` | **Rò rỉ bộ nhớ nghiêm trọng (Memory Leak & WebGL Context Loss) do khởi tạo Text/Graphics lặp đi lặp lại** |
| **PIXI-HIGH-01** | `HIGH` | `js/pixi-renderer.js:58-76` | **Xung đột bố cục Responsive do `resizeTo: window` kết hợp chèn canvas trước `container.firstChild`** |
| **PIXI-HIGH-02** | `HIGH` | `js/pixi-renderer.js:44, 211-236` | **Lạm dụng Text Object thay thế cho Sprite & hoàn toàn thiếu hệ thống Sprite/Texture Loading** |
| **PIXI-HIGH-03** | `HIGH` | `js/pixi-renderer.js:100-117` | **Hoàn toàn thiếu cơ chế Error Handling & Fallback Texture khi load asset** |
| **PIXI-MED-01** | `MEDIUM` | `index.html`, `js/pixi-renderer.js` | **Thiếu vùng chứa Canvas chuyên dụng (Dedicated Canvas Viewport Container)** |
| **PIXI-MED-02** | `MEDIUM` | `js/pixi-renderer.js:155-209` | **Hardcoded tọa độ pixel cố định, không co giãn theo tỷ lệ màn hình (No Scaled Positioning)** |
| **PIXI-LOW-01** | `LOW` | `js/pixi-renderer.js:16` | **Sử dụng CDN PixiJS v7 không khóa hash toàn vẹn (Subresource Integrity - SRI)** |

---

### 2.2. Chi tiết kỹ thuật từng vấn đề

#### [PIXI-CRIT-01] Static CDN Import gây sập toàn bộ game khi offline hoặc CDN bị chặn
- **Vị trí:** `js/pixi-renderer.js`, Dòng 16:
  ```js
  import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/dist/pixi.mjs';
  ```
- **Bằng chứng từ code:** `js/main.js` import tĩnh `pixiRenderer`:
  ```js
  import { pixiRenderer } from './pixi-renderer.js';
  ```
- **Nguyên nhân:** Khi trình duyệt nạp `main.js`, nó phải resolve toàn bộ static import tree trước khi chạy bất kỳ dòng code nào. Nếu người dùng offline, mạng chậm, hoặc CDN `jsdelivr.net` bị gián đoạn, trình duyệt ném `TypeError: Failed to fetch dynamically imported module` ngay ở bước nạp script.
- **Tác động:** Dù trong `main.js` có khối `try/catch` bọc quanh `pixiRenderer.init()`, khối try/catch này **vô tác dụng** vì lỗi xảy ra ở tầng phân giải Module của trình duyệt. Game bị màn hình đen hoàn toàn, không thể vào được cả giao diện DOM.
- **Giải pháp đề xuất khi tích hợp:** Chuyển sang Dynamic Import (`await import(...)`) bên trong hàm `init()` hoặc lưu bundle PixiJS cục bộ trong thư mục `public/vendor/pixi.min.js`.

---

#### [PIXI-CRIT-02] Rò rỉ bộ nhớ (Memory Leak) & Nguy cơ WebGL Context Loss do tạo mới Text/Graphics liên tục
- **Vị trí:** `js/pixi-renderer.js`, các hàm `render()`, `_drawBackground()`, `_drawWorldInfo()`, `_drawEntities()`.
- **Bằng chứng từ code:**
  ```js
  render(state) {
    this.worldLayer.removeChildren();
    this._drawBackground(state);
    this._drawWorldInfo(state);
    this._drawEntities(state);
    this.app.render();
  }
  ```
  Trong `_drawWorldInfo()`:
  ```js
  const locText = new PIXI.Text({ ... });
  const dayText = new PIXI.Text({ ... });
  const hpBarBg = new PIXI.Graphics();
  const hpBar = new PIXI.Graphics();
  const hpLabel = new PIXI.Text({ ... });
  ```
- **Nguyên nhân:**
  1. Trong PixiJS, hàm `removeChildren()` chỉ gỡ đối tượng khỏi display list (`parent.children`), **KHÔNG HỀ GỌI HÀM `destroy()`** trên các đối tượng bị gỡ.
  2. Mỗi đối tượng `PIXI.Text` bên dưới WebGL sẽ âm thầm tạo ra một phần tử `<canvas>` HTML ẩn và gọi `canvas.getContext('2d')` để rasterize font chữ thành texture.
  3. Cứ mỗi lần người chơi bấm nút lựa chọn, khám phá, di chuyển hay đánh nhau, hàm `render()` được gọi. Sau 50-100 lượt click, hàng trăm canvas 2D ẩn và hàng trăm buffer hình học của `PIXI.Graphics` bị bỏ rơi trong bộ nhớ RAM/VRAM.
- **Tác động:** Trình duyệt di động (Safari iOS giới hạn 16-32 active canvas context, Chrome Android giới hạn bộ nhớ GPU) sẽ bị **WebGL Context Lost**, làm sập render hoặc đơ tab trình duyệt sau khoảng 5-10 phút chơi.
- **Giải pháp đề xuất khi tích hợp:** Tái sử dụng đối tượng (Object Pooling), giữ lại các instance `PIXI.Text`, `PIXI.Graphics`, `PIXI.Sprite` cố định và chỉ cập nhật thuộc tính `.text`, `.x`, `.y`, `.tint` hoặc `.texture` thay vì `new` liên tục.

---

#### [PIXI-HIGH-01] Xung đột Responsive Layout do `resizeTo: window` và chèn canvas sai vị trí
- **Vị trí:** `js/pixi-renderer.js`, Dòng 58-76:
  ```js
  this.app = new PIXI.Application({
    width: this.width,
    height: this.height,
    backgroundColor: COLORS.bg,
    antialias: true,
    resizeTo: window,
  });
  ...
  container.insertBefore(canvas, container.firstChild);
  ```
- **Bằng chứng từ CSS:** Trong `css/style.css`, `#game-container` có:
  ```css
  #game-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  ```
- **Nguyên nhân:**
  - `resizeTo: window` ép kích thước canvas PixiJS bằng toàn bộ `window.innerWidth` (ví dụ 1920px trên Desktop).
  - Canvas được chèn vào bên trong `#game-container` (vốn chỉ rộng tối đa 900px).
  - Kích thước canvas 1920px làm vỡ nát container 900px, đẩy chiều rộng trang web ra ngoài tầm mắt, sinh thanh cuộn ngang khó chịu.
  - Trên điện thoại di động (màn hình 360-390px dọc), canvas bị ép chiều cao cửa sổ làm đẩy toàn bộ các nút bấm và cốt truyện trôi xuống dưới nhiều trang màn hình.
- **Giải pháp đề xuất khi tích hợp:** Không dùng `resizeTo: window`. Canvas phải được đặt trong một thẻ `div` khung hình chuyên dụng (ví dụ `#pixi-viewport`), thiết lập tỷ lệ cố định (ví dụ 16:9) và co giãn theo chiều rộng của `#game-container`.

---

#### [PIXI-HIGH-02] Lạm dụng Text Object thay thế cho Sprite & thiếu hệ thống Texture Loading
- **Vị trí:** `js/pixi-renderer.js`, Dòng 211-236:
  ```js
  _drawEntities(state) {
    ...
    entities.slice(0, 6).forEach((ent, i) => {
      const txt = new PIXI.Text({
        text: `${ent.name} (tham thiet ${ent.affinity})`, ...
      });
      this.worldLayer.addChild(txt);
    });
  }
  ```
- **Nguyên nhân:** Bản đồ, NPC, quái vật hiện chưa có texture hình ảnh thật nào. Thay vào đó, lập trình viên đang dùng các dòng chữ `"NPC xiaohan (tham thiet 30)"` để thay thế. Thuộc tính `this.spriteCache = new Map()` được khai báo ở constructor nhưng bị bỏ xó, không có dòng code nào nạp sprite hay quản lý texture.
- **Tác động:** Canvas PixiJS hiện tại chỉ hiển thị một hình chữ nhật màu xanh tím đậm cùng vài dòng chữ thô sơ, chưa phát huy được bất kỳ tính năng đồ họa nào của engine WebGL.
- **Giải pháp đề xuất khi tích hợp:** Xây dựng module `AssetManager` sử dụng `PIXI.Assets.load()`, khai báo danh mục Sprite Sheet, Texture, Avatar và render Sprite thật sự.

---

#### [PIXI-HIGH-03] Hoàn toàn thiếu Error Handling & Fallback Texture
- **Vị trí:** `js/pixi-renderer.js`
- **Nguyên nhân:** Không có bất kỳ đoạn code nào bắt lỗi khi texture load thất bại (`onFailed`, `catch`, placeholder texture).
- **Tác động:** Nếu sau này đưa đường dẫn ảnh vào code (ví dụ `PIXI.Sprite.from('assets/map.webp')`), nếu đường dẫn bị sai hoặc file chưa kịp tải, PixiJS sẽ vẽ một texture rỗng màu đen hoặc ném lỗi ngầm, làm biến mất các đối tượng trên canvas mà người chơi không biết lý do.
- **Giải pháp đề xuất khi tích hợp:** Tạo sẵn một fallback texture 64x64 màu xám có icon chấm hỏi hoặc khung cảnh báo, khi ảnh chính không tải được thì tự động gán fallback texture.

---

## 3. PHÂN TÍCH HIỆN TRẠNG PLACEHOLDER TRONG SOURCE CODE

Hiện tại, toàn bộ game đang sử dụng các hình thức placeholder sau đây:

1. **Placeholder bằng Emoji Unicode trong DOM UI:**
   - Hơn 35 loại Emoji được dùng thay thế toàn bộ Icon chỉ số, Icon trang bị, Icon tài nguyên, Icon nút bấm trong `js/ui.js` (ví dụ: `❤️` cho Máu, `🧠` cho Tinh thần, `🦠` cho Nhiễm bệnh, `⚔️` cho Cận chiến, `🔫` cho Tầm xa, `🍞` cho Thức ăn, `🥤` cho Nước, `💊` cho Thuốc, `👑` cho Tiền hoàng gia, `🏰` cho Lâu đài).
2. **Placeholder bằng Màu nền (CSS Color Blocks):**
   - Các panel giao diện (`#zone-1`, `#zone-2`, `#zone-3`, `#zone-4`) dùng màu nền phẳng `background: #1a1a2e` và viền `#16213e`, không có họa tiết khung kim loại, gỉ sét hay phong cách phế thổ (post-apocalyptic border/frame).
3. **Placeholder bằng Text trong PixiJS:**
   - Canvas PixiJS dùng `PIXI.Graphics` vẽ khung chữ nhật và `PIXI.Text` in tên địa điểm, số ngày và danh sách NPC.
4. **Placeholder Background:**
   - Chỉ có duy nhất một ảnh nền `public/image/hinh_nen.webp` cho toàn bộ game. Khi người chơi di chuyển qua 23 địa điểm khác nhau (từ Rừng rậm, Bệnh viện hoang, Tổ zombie, Sân bay, đến Lâu đài tận thế hay Đảo biệt lập), khung cảnh phía sau hoàn toàn không thay đổi!
5. **Placeholder Chiến đấu & Cốt truyện:**
   - Các trận đánh Boss nghẹt thở (Vua Zombie, Hải Zombie, Cỗ Rối Khổng Lồ) và các kết thúc game (13 Endings) hiện hoàn toàn chỉ là các đoạn văn bản text thuần túy trong `#story-area`.

---

## 4. KẾT LUẬN & ĐỀ XUẤT CHO BƯỚC TRIỂN KHAI

1. **Thứ tự thực hiện:** Tuyệt đối không nhồi nhét texture vào source code ngay khi chưa tối ưu lại `js/pixi-renderer.js`. Cần sửa cấu trúc `PixiRenderer` (sửa memory leak, bỏ `resizeTo: window`, thêm `PIXI.Assets.load` và cơ chế fallback) trước khi đưa ảnh vào.
2. **Chi tiết danh mục asset:** Xem toàn bộ 120+ asset được phân loại chi tiết tại file [`docs/PIXIJ_ASSET_INVENTORY.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/docs/PIXIJ_ASSET_INVENTORY.md).
3. **Prompts tạo ảnh:** Xem chi tiết các prompt chuẩn Studio AI tại file [`docs/IMAGE_GENERATION_PROMPTS.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/docs/IMAGE_GENERATION_PROMPTS.md).
4. **Bản đồ tích hợp source code:** Xem quy trình nạp và render tại file [`docs/ASSET_IMPLEMENTATION_MAP.md`](file:///c:/Users/dungu/Documents/test/Zombie-World-RPG/docs/ASSET_IMPLEMENTATION_MAP.md).

