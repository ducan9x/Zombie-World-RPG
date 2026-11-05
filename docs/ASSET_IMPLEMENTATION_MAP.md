# BẢN ĐỒ TÍCH HỢP TÀI NGUYÊN (ASSET IMPLEMENTATION MAP)
## DỰ ÁN: ZOMBIE WORLD RPG — HƯỚNG DẪN TÍCH HỢP CODEBASE

Tài liệu này là cẩm nang kỹ thuật chi tiết dành cho kỹ sư phát triển để tích hợp toàn bộ các asset hình ảnh sau khi được khởi tạo vào mã nguồn trò chơi **Zombie-World-RPG**, kết nối đồng bộ giữa **PixiJS Canvas Renderer** và **DOM User Interface** mà không làm ảnh hưởng đến logic gameplay hay hệ thống lưu trữ (Save/Load).

---

## 1. QUY HOẠCH CẤU TRÚC THƯ MỤC LƯU TRỮ (DIRECTORY STRUCTURE)

Toàn bộ asset được tổ chức tập trung trong thư mục `public/assets/` như sau:

```text
public/
├── assets/
│   ├── backgrounds/          # Hình nền 23 bản đồ, menu chính, chiến trường (1920x1080 WebP)
│   ├── characters/           # Chân dung người chơi, NPC, Boss, Zombie (512x512 / 1024x1024 PNG)
│   ├── icons/                # Biểu tượng chỉ số, tài nguyên, trang bị, tiền tệ (256x256 PNG)
│   ├── items/                # Vũ khí, đạn dược, thức ăn, thuốc men, vật phẩm cốt truyện (256x256 PNG)
│   ├── vfx/                  # Hiệu ứng vết chém, tia đạn, vết máu, bạo kích (PNG transparent)
│   └── cgs/                  # Tranh minh họa cốt truyện, kết thúc game (1920x1080 WebP)
├── icon/
│   └── icon.png              # App Favicon (400x400)
├── image/
│   └── hinh_nen.webp         # Fallback CSS Background (2732x1534)
└── music/
    └── backmusic.mp3         # Nhạc nền game
```

---

## 2. BẢN ĐỒ ÁNH XẠ TÍCH HỢP CHO TỪNG ASSET (IMPLEMENTATION MAPPING)

### 2.1. Nhóm Giao diện & Biểu tượng (UI & Icons)

| Asset ID | File Path Đề xuất | Component Sử dụng | Scene / Vị trí | Placeholder Cần thay | Cách Load Asset | Cách Render | Hành vi Responsive | Fallback | Lazy Load | Tái sử dụng |
|---|---|---|---|---|---|---|---|---|---|---|
| `ui_main_menu_bg` | `public/assets/backgrounds/ui_main_menu_bg.webp` | `NameSetup` / `UI` | Menu chính (`#name-setup`) | CSS body background | CSS `background-image` | HTML DOM Background | `background-size: cover; background-position: center;` | `hinh_nen.webp` | Không | Có |
| `ui_icon_hp` | `public/assets/icons/ui_icon_hp.png` | `renderStats` | Panel chỉ số Zone 1 | Emoji `❤` | Static HTML / Preload | Thẻ `<img>` hoặc inline SVG | Cố định 22x22px (Mobile: 20x20px) | Ký tự text "HP" | Không | Có (Tooltip, Combat) |
| `ui_icon_sanity` | `public/assets/icons/ui_icon_sanity.png` | `renderStats` | Panel chỉ số Zone 1 | Emoji `🧠` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "SAN" | Không | Có |
| `ui_icon_infection` | `public/assets/icons/ui_icon_infection.png` | `renderStats` | Panel chỉ số Zone 1 | Emoji `🦠` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "INF" | Không | Có |
| `ui_icon_hunger` | `public/assets/icons/ui_icon_hunger.png` | `renderStats` | Panel chỉ số Zone 1 | Emoji `🍖` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "HUN" | Không | Có |
| `ui_icon_hydration`| `public/assets/icons/ui_icon_hydration.png`| `renderStats` | Panel chỉ số Zone 1 | Emoji `💧` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "HYD" | Không | Có |
| `ui_icon_res_royal_coin`| `public/assets/icons/ui_icon_res_royal_coin.png`| `renderStats` / `Royalty`| Zone 1 & Lâu Đài | Emoji `👑` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "RC" | Không | Có (Shop, Bank) |
| `ui_icon_res_cigarette`| `public/assets/icons/ui_icon_res_cigarette.png`| `renderStats` / `Trade` | Zone 1 & Chợ đen | Emoji `🚬` | Static HTML / Preload | Thẻ `<img>` | Cố định 22x22px (Mobile: 20x20px) | Ký tự "CIG" | Không | Có (Npc quests) |
| `ui_placeholder_empty`| `public/assets/icons/ui_placeholder_empty.png`| `AssetManager` | Bất kỳ ô trống nào | Ô trống hoặc viền đứt | Preloaded Base Texture | `PIXI.Texture.from(...)` | Khớp tỷ lệ ô chứa 1:1 | Khung vẽ Graphics rỗng | Không | Có (Toàn game) |

---

### 2.2. Nhóm Bản đồ & Bối cảnh Thế giới (World & Map Backgrounds - 23 Địa điểm)

| Asset ID | File Path Đề xuất | Component Sử dụng | Scene / Vị trí | Placeholder Cần thay | Cách Load Asset | Cách Render | Hành vi Responsive | Fallback | Lazy Load | Tái sử dụng |
|---|---|---|---|---|---|---|---|---|---|---|
| `map_lau_dai_tan_the_bg` | `public/assets/backgrounds/map_lau_dai_tan_the_bg.webp` | `PixiRenderer` | Map: `lau_dai_tan_the` | `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Tự căn giữa (Anchor 0.5), Scale Aspect Fill | Khối màu tím than `0x1a1a2e` | Có | Có (Cảnh Lâu đài) |
| `map_tran_dia_binh_minh_bg`| `public/assets/backgrounds/map_tran_dia_binh_minh_bg.webp`| `PixiRenderer` | Map: `tran_dia_binh_minh`| `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Scale Aspect Fill, Safe Area 70% | Khối màu quân sự `0x2d3436` | Có | Có (Doanh trại) |
| `map_benh_vien_ngoai_thanh_bg`| `public/assets/backgrounds/map_benh_vien_ngoai_thanh_bg.webp`| `PixiRenderer` | Map: `benh_vien_ngoai_thanh`| `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Scale Aspect Fill, Safe Area 70% | Khối màu xanh rêu `0x1e272e` | Có | Có (Event y tế) |
| `map_to_zombie_bg` | `public/assets/backgrounds/map_to_zombie_bg.webp` | `PixiRenderer` | Map: `to_zombie` & Boss King | `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Scale Aspect Fill, Safe Area 70% | Khối màu đỏ tím `0x2c001e` | Có | Có (Tổ quái) |
| `map_co_so_vu_tru_bg` | `public/assets/backgrounds/map_co_so_vu_tru_bg.webp` | `PixiRenderer` | Map: `co_so_vu_tru_tuyet_mat`| `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Scale Aspect Fill, Safe Area 70% | Khối màu xám chì `0x353b48` | Có | Có (Bệ phóng tên lửa)|
| `map_dao_nho_bg` | `public/assets/backgrounds/map_dao_nho_bg.webp` | `PixiRenderer` | Map: `dao_nho` | `rect.beginFill(0x1a1a2e)` | `PIXI.Assets.load()` | `PIXI.Sprite` trong `bgLayer` | Scale Aspect Fill, Safe Area 70% | Khối màu xanh biển `0x0c2461`| Có | Có (Khu đảo/bar) |

*(Quy tắc tương tự áp dụng cho toàn bộ 17 bản đồ còn lại: nạp theo ID dạng `public/assets/backgrounds/map_${locationId}_bg.webp` qua hàm nạp nền động của `PixiRenderer`).*

---

### 2.3. Nhóm Nhân vật, NPC & Boss (Characters, NPCs, Bosses)

| Asset ID | File Path Đề xuất | Component Sử dụng | Scene / Vị trí | Placeholder Cần thay | Cách Load Asset | Cách Render | Hành vi Responsive | Fallback | Lazy Load | Tái sử dụng |
|---|---|---|---|---|---|---|---|---|---|---|
| `char_player_portrait` | `public/assets/characters/char_player_portrait.png` | `renderIdentity` | Zone 1 Identity | Tên text nhân vật | Static `<img>` | Thẻ `<img>` hoặc Canvas Sprite | Khung vuông 64x64px (Mobile: 48x48px)| Khung avatar rỗng | Không | Có (Toàn game) |
| `char_npc_v_portrait` | `public/assets/characters/char_npc_v_portrait.png` | `PixiRenderer` / `Story` | Doanh trại / Đối thoại Chị V | Dòng chữ `NPC v` | `PIXI.Assets.load()` | `PIXI.Sprite` (Entity layer) | Neo đáy (Anchor 0.5, 1.0), Max cao 200px | Khung avatar chữ "V" | Có | Có (Hội thoại, Combat)|
| `char_npc_xiaohan_portrait`| `public/assets/characters/char_npc_xiaohan_portrait.png`| `PixiRenderer` / `Story` | Doanh trại / Đối thoại Tiểu Hàm | Dòng chữ `NPC xiaohan`| `PIXI.Assets.load()` | `PIXI.Sprite` (Entity layer) | Neo đáy (Anchor 0.5, 1.0), Max cao 200px | Khung avatar chữ "H" | Có | Có (Hội thoại) |
| `boss_zombie_king_sprite` | `public/assets/characters/boss_zombie_king_sprite.png` | `PixiRenderer` / `Combat`| Trận Boss Thi Vương | Text log cốt truyện | `PIXI.Assets.load()` | `PIXI.Sprite` (Center Stage) | Scale co giãn giữ nguyên 1:1, Anchor 0.5 | Khung hình chữ nhật đỏ | Có | Có (Combat, Story) |
| `boss_sea_monster_sprite` | `public/assets/characters/boss_sea_monster_sprite.png` | `PixiRenderer` / `Combat`| Trận Boss Biển sâu | Text log cốt truyện | `PIXI.Assets.load()` | `PIXI.Sprite` (Center Stage) | Scale co giãn giữ nguyên 1:1, Anchor 0.5 | Khung hình chữ nhật đen | Có | Có (Combat, Ending) |

---

### 2.4. Nhóm Hiệu ứng Chiến đấu & Vật phẩm (Combat VFX & Items)

| Asset ID | File Path Đề xuất | Component Sử dụng | Scene / Vị trí | Placeholder Cần thay | Cách Load Asset | Cách Render | Hành vi Responsive | Fallback | Lazy Load | Tái sử dụng |
|---|---|---|---|---|---|---|---|---|---|---|
| `vfx_blood_splatter` | `public/assets/vfx/vfx_blood_splatter.png` | `PixiRenderer` | Combat khi mất máu | Dòng text `[Máu -30]` | Preloaded Texture | `PIXI.Sprite` (Blend Additive) | Co giãn phủ toàn bộ Viewport Canvas | Bỏ qua nếu không load được | Không | Có (Mọi trận đánh) |
| `vfx_critical_hit` | `public/assets/vfx/vfx_critical_hit.png` | `PixiRenderer` | Combat khi bạo kích | Dòng text `[Bạo kích!]` | Preloaded Texture | `PIXI.Sprite` chớp tắt 0.3s | Căn giữa đối thủ bị tấn công | Chữ màu vàng `[CRIT]` | Không | Có (Mọi trận đánh) |
| `item_med_serum` | `public/assets/items/item_med_serum.png` | `renderInventory` | Túi đồ / Sử dụng thuốc | Tên text `[Huyết thanh]` | DOM On-Demand | Thẻ `<img>` trong ô đồ | Kích thước 48x48px trong lưới đồ | Viền ô màu tím theo Rarity | Có | Có (Shop, Trade) |
| `item_gun_sniper_m700`| `public/assets/items/item_gun_sniper_m700.png`| `renderWeapons` | Ô trang bị tầm xa | Tên text `[M700]` | DOM On-Demand | Thẻ `<img>` trong ô vũ khí | Kích thước 64x64px trong slot | Chữ "[M700]" | Có | Có (Inventory, Trade)|
| `story_cg_rocket_launch`| `public/assets/cgs/story_cg_rocket_launch.webp` | `StoryArea` / Modal | Ending 1: Thoát ly | Khối text cốt truyện | Lazy load on trigger | Modal Overlay toàn màn hình | `object-fit: contain; max-width: 100vw;` | Bỏ qua, chỉ hiện chữ | Có | Không |

---

## 3. MẪU KIẾN TRÚC CODE TÍCH HỢP (PIXIJS LOADER & RENDER PIPELINE)

Để tích hợp asset an toàn, không rò rỉ bộ nhớ và tự động co giãn theo responsive, lớp `PixiRenderer` cần được nâng cấp theo kiến trúc sau:

```javascript
// js/pixi-renderer.js (Mẫu kiến trúc tích hợp an toàn)
export class PixiRenderer {
  constructor() {
    this.app = null;
    this.textures = new Map(); // Cache lưu trữ textures
    this.bgSprite = null;      // Tái sử dụng 1 Sprite duy nhất cho Background
    this.entitySprites = [];   // Pool Sprite cho NPC/Quái vật
    this.isReady = false;
  }

  async init(containerEl) {
    if (this.isReady) return;
    
    // 1. Khởi tạo Application không dùng resizeTo: window
    this.app = new PIXI.Application({
      width: 800,
      height: 450, // Tỷ lệ chuẩn 16:9
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    containerEl.appendChild(this.app.view);

    // 2. Thiết lập Display Containers cố định (Không new lặp lại)
    this.bgLayer = new PIXI.Container();
    this.entityLayer = new PIXI.Container();
    this.vfxLayer = new PIXI.Container();
    this.uiLayer = new PIXI.Container();

    this.app.stage.addChild(this.bgLayer, this.entityLayer, this.vfxLayer, this.uiLayer);

    // 3. Tạo Sprite Background cố định
    this.bgSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.bgSprite.width = 800;
    this.bgSprite.height = 450;
    this.bgLayer.addChild(this.bgSprite);

    this.isReady = true;
  }

  /** Chuyển đổi Background bản đồ an toàn */
  async updateMapBackground(locationId) {
    if (!this.isReady) return;
    const assetPath = `public/assets/backgrounds/map_${locationId}_bg.webp`;

    try {
      if (!this.textures.has(assetPath)) {
        const tex = await PIXI.Assets.load(assetPath);
        this.textures.set(assetPath, tex);
      }
      this.bgSprite.texture = this.textures.get(assetPath);
      this.bgSprite.tint = 0xffffff;
    } catch (err) {
      console.warn(`[PixiRenderer] Khong the tai asset ${assetPath}, su dung fallback.`);
      this.bgSprite.texture = PIXI.Texture.WHITE;
      this.bgSprite.tint = 0x1a1a2e; // Fallback màu nền sẫm
    }
  }

  /** Co giãn mượt mà theo kích thước khung chứa DOM */
  resize(parentWidth) {
    if (!this.app || !this.app.renderer) return;
    const targetWidth = Math.min(parentWidth, 900);
    const targetHeight = targetWidth * (9 / 16); // Giữ đúng tỷ lệ 16:9
    this.app.renderer.resize(targetWidth, targetHeight);
    if (this.bgSprite) {
      this.bgSprite.width = targetWidth;
      this.bgSprite.height = targetHeight;
    }
  }
}
```

---

## 4. CHIẾN LƯỢC TÍCH HỢP TỪNG BƯỚC (STEP-BY-STEP IMPLEMENTATION ROADMAP)

- **Bước 1 (Chuẩn bị hạ tầng):** Tạo cấu trúc các thư mục `public/assets/...` theo mục 1; sửa lỗi rò rỉ bộ nhớ và responsive trong `js/pixi-renderer.js`.
- **Bước 2 (Tích hợp Asset P0 - Ưu tiên cao nhất):** Nạp bộ Icon chỉ số (`ui_icon_*.png`), 5 Background quan trọng (`lau_dai`, `to_zombie`, `can_cu_dawn`, `benh_vien`, `co_so_vu_tru`), và chân dung 4 NPC căn cứ.
- **Bước 3 (Tích hợp Asset P1 - Khám phá & Chiến đấu):** Nạp toàn bộ 18 Background bản đồ còn lại, Sprite các loại zombie, Boss và hiệu ứng chiến đấu (máu bắn, bạo kích).
- **Bước 4 (Tích hợp Asset P2 & P3 - Chi tiết hóa):** Nạp Thumbnail trang bị vũ khí, cây trồng, cá biển và các bức tranh Ending CG.

