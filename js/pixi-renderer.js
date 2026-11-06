/* ============================================================
   PixiJS Renderer — Zombie World RPG (Phase 1.5 - Stage 1)
   
   Muc tieu:
   - Render the gioi ban do / NPC / item bang WebGL/Canvas.
   - Hoat dong 100% offline su dung local vendor (public/vendor/).
   - Responsive khong tran vien (no horizontal overflow), giu ty le chuan.
   - Tai su dung toan bo doi tuong render (Object Pooling), khong leak bo nho.
   - Asset Manager voi Texture Cache va Procedural Fallback Texture.
   ============================================================ */

import { WorldMapRenderer } from './map-renderer.js';

// ---------- Mau sac / chat luong hien thi ----------
const COLORS = {
  bg: 0x1a1a2e,
  panel: 0x16213e,
  text: 0xe94560,
  safe: 0x00ff88,
  danger: 0xff4757,
  neutral: 0xffa502,
  border: 0x303446,
};

// Bien luu tru instance PIXI (nap dong hoac tu local vendor)
let PIXI = null;

// ---------- PixiRenderer class ----------
export class PixiRenderer {
  /**
   * @param {Object} options
   * @param {string} options.containerId - ID the chua canvas (mac dinh: 'pixi-viewport' hoac fallback 'game-container')
   * @param {number} options.width - Chieu rong ao (virtual width)
   * @param {number} options.height - Chieu cao ao (virtual height)
   */
  constructor({ containerId = 'pixi-viewport', width = 640, height = 320 } = {}) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;

    // PixiJS Core
    this.app = null;
    this.enabled = false;
    this.state = null;
    this._resizeHandler = null;

    // Display Layers
    this.bgLayer = null;
    this.worldLayer = null;
    this.entityLayer = null;
    this.uiLayer = null;

    // Persistent Reusable Display Objects
    this.bgSprite = null;
    this.bgGraphics = null;
    this.bgBorder = null;
    this.locText = null;
    this.dayText = null;
    this.hpBarBg = null;
    this.hpBar = null;
    this.hpIconSprite = null;
    this.hpLabel = null;
    this.entityPool = [];
    this.maxEntities = 6;

    // Asset Manager & Cache
    this.textureCache = new Map();
    this.loadingAssets = new Map(); // url -> Promise<PIXI.Texture>
    this.failedAssets = new Set();
    this.fallbackTexture = null;
    this._currentLocation = null;
    this._currentBgUrl = null;

    // World Map Graphical Renderer (Batch 07 Phase 7.3)
    this.worldMapRenderer = null;
    this.mapViewMode = 'graphical'; // 'graphical' | 'textual'
  }

  // ---------- Nap thu vien PixiJS (Offline / Local Vendor) ----------
  async _loadPixiLibrary() {
    if (PIXI) return PIXI;

    // 1. Kiem tra PIXI da duoc load qua script tag local (public/vendor/pixi.min.js)
    if (typeof window !== 'undefined' && window.PIXI) {
      PIXI = window.PIXI;
      return PIXI;
    }

    // 2. Fallback: Dynamic import local ESM bundle
    try {
      const module = await import('../public/vendor/pixi.mjs');
      PIXI = module.default || module;
      return PIXI;
    } catch (err) {
      console.warn('[PixiRenderer] Khong the nap local vendor pixi.mjs:', err.message);
    }

    return null;
  }

  // ---------- Khoi tao Renderer ----------
  async init() {
    try {
      const pixiLib = await this._loadPixiLibrary();
      if (!pixiLib) {
        console.warn('[PixiRenderer] Khong co thu vien PixiJS, he thong se dung DOM UI thuan tuy.');
        this.enabled = false;
        return false;
      }

      // Tim container phu hop: uu tien 'pixi-viewport', fallback ve containerId
      let container = document.getElementById('pixi-viewport');
      if (!container) {
        container = document.getElementById(this.containerId);
      }
      if (!container) {
        console.warn('[PixiRenderer] Khong tim thay container de chen canvas.');
        this.enabled = false;
        return false;
      }

      // Khong dung resizeTo: window de tranh horizontal overflow
      this.app = new PIXI.Application({
        width: this.width,
        height: this.height,
        backgroundColor: COLORS.bg,
        antialias: true,
        autoDensity: true,
        resolution: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
      });

      const canvas = this.app.view;
      canvas.id = 'pixi-canvas';
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.maxWidth = '100%';
      canvas.style.margin = '0 auto';

      // Xoa canvas cu neu ton tai
      const existingCanvas = container.querySelector('#pixi-canvas');
      if (existingCanvas) existingCanvas.remove();

      container.appendChild(canvas);

      // Khoi tao cac layer co dinh
      this.bgLayer = new PIXI.Container();
      this.worldLayer = new PIXI.Container();
      this.entityLayer = new PIXI.Container();
      this.uiLayer = new PIXI.Container();

      this.app.stage.addChild(this.bgLayer);
      this.app.stage.addChild(this.worldLayer);
      this.app.stage.addChild(this.entityLayer);
      this.app.stage.addChild(this.uiLayer);

      // Tao fallback texture procedural (khong can anh ngoai)
      this.fallbackTexture = this._createFallbackTexture();

      // Khoi tao cac doi tuong render tai su dung (Persistent Objects)
      this._initPersistentObjects();

      // Khoi tao World Map Renderer (Batch 07 Phase 7.3)
      this.worldMapRenderer = new WorldMapRenderer(this.app);
      this.worldLayer.addChild(this.worldMapRenderer.container);
      this.worldMapRenderer.loadAssets().catch(err => {
        console.warn('[PixiRenderer] WorldMapRenderer asset load warning:', err?.message || err);
      });

      // Preload Batch 01 UI Assets
      this.preloadBatch01().catch(err => {
        console.warn('[PixiRenderer] Preload Batch 01 warning:', err?.message || err);
      });

      // Lang nghe su kien resize cua cua so
      this._resizeHandler = () => this.resize();
      window.addEventListener('resize', this._resizeHandler);

      this.enabled = true;
      console.log('[PixiRenderer] Da khoi tao thanh cong PixiJS v' + (PIXI.VERSION || '7') + ' (Offline Local Vendor).');
      return true;
    } catch (err) {
      console.warn('[PixiRenderer] Khoi tao PixiJS that bai:', err.message);
      this.enabled = false;
      return false;
    }
  }

  // ---------- Tao texture du phong (Procedural Fallback) ----------
  _createFallbackTexture() {
    if (!this.app || !this.app.renderer) return null;
    const g = new PIXI.Graphics();
    g.beginFill(COLORS.panel);
    g.drawRect(0, 0, 64, 64);
    g.endFill();
    g.lineStyle(2, COLORS.text, 0.7);
    g.drawRect(1, 1, 62, 62);
    g.moveTo(6, 6);
    g.lineTo(58, 58);
    g.moveTo(58, 6);
    g.lineTo(6, 58);
    return this.app.renderer.generateTexture(g);
  }

  // ---------- Khoi tao cac doi tuong co dinh (Tranh Memory Leak) ----------
  _initPersistentObjects() {
    // 1. Background
    this.bgGraphics = new PIXI.Graphics();
    this.bgGraphics.beginFill(COLORS.bg);
    this.bgGraphics.drawRect(0, 0, this.width, this.height);
    this.bgGraphics.endFill();
    this.bgLayer.addChild(this.bgGraphics);

    this.bgSprite = new PIXI.Sprite(this.fallbackTexture || PIXI.Texture.WHITE);
    this.bgSprite.width = this.width;
    this.bgSprite.height = this.height;
    this.bgSprite.alpha = 0.4;
    this.bgLayer.addChild(this.bgSprite);

    this.bgBorder = new PIXI.Graphics();
    this.bgBorder.lineStyle(2, COLORS.text, 0.4);
    this.bgBorder.drawRect(4, 4, this.width - 8, this.height - 8);
    this.bgLayer.addChild(this.bgBorder);

    // 2. Info Layer (Text & HP Bar)
    this.locText = new PIXI.Text('Dang tai...', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 18,
      fontWeight: 'bold',
      fill: COLORS.safe,
      stroke: COLORS.bg,
      strokeThickness: 2,
    });
    this.locText.x = 16;
    this.locText.y = 12;
    this.worldLayer.addChild(this.locText);

    this.dayText = new PIXI.Text('', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      fill: 0xcccccc,
      stroke: COLORS.bg,
      strokeThickness: 1,
    });
    this.dayText.x = 16;
    this.dayText.y = 38;
    this.worldLayer.addChild(this.dayText);

    // HP Icon & Bar
    this.hpIconSprite = new PIXI.Sprite(this.fallbackTexture || PIXI.Texture.WHITE);
    this.hpIconSprite.x = 16;
    this.hpIconSprite.y = 59;
    this.hpIconSprite.width = 16;
    this.hpIconSprite.height = 16;
    this.worldLayer.addChild(this.hpIconSprite);

    this.hpBarBg = new PIXI.Graphics();
    this.hpBarBg.beginFill(0x222222);
    this.hpBarBg.drawRect(38, 62, 160, 10);
    this.hpBarBg.endFill();
    this.worldLayer.addChild(this.hpBarBg);

    this.hpBar = new PIXI.Graphics();
    this.worldLayer.addChild(this.hpBar);

    this.hpLabel = new PIXI.Text('HP: 100%', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      fill: 0xffffff,
    });
    this.hpLabel.x = 204;
    this.hpLabel.y = 60;
    this.worldLayer.addChild(this.hpLabel);

    // 3. Entity Pool (Chuan bi san 6 slots, bat/tat bang .visible)
    this.entityPool = [];
    const startY = 88;
    for (let i = 0; i < this.maxEntities; i++) {
      const txt = new PIXI.Text('', {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        fill: 0xffffff,
      });
      txt.x = 16;
      txt.y = startY + i * 20;
      txt.visible = false;
      this.entityLayer.addChild(txt);
      this.entityPool.push(txt);
    }
  }

  // ---------- Asset Manager Minimal: Texture Cache & Fallback ----------
  async loadTexture(url) {
    if (!this.enabled || !PIXI) return this.fallbackTexture;
    if (!url) return this.fallbackTexture;

    // 1. Kiem tra cache: da co texture thi tra ve ngay
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url);
    }

    // 2. Neu asset truoc do da load loi, dung ngay fallback khong thu lai
    if (this.failedAssets.has(url)) {
      return this.fallbackTexture;
    }

    // 3. Neu asset dang trong qua trinh load, tra ve chinh Promise dang chay (chia se promise)
    if (this.loadingAssets.has(url)) {
      return await this.loadingAssets.get(url);
    }

    // 4. Tao Promise loading moi va luu vao loadingAssets
    const loadPromise = (async () => {
      try {
        const texture = await PIXI.Assets.load(url);
        if (texture) {
          this.textureCache.set(url, texture);
          return texture;
        } else {
          throw new Error('PIXI.Assets.load tra ve texture rong');
        }
      } catch (err) {
        this.failedAssets.add(url);
        console.warn(`[PixiRenderer] Khong the tai asset: ${url}, su dung fallback.`);
        return this.fallbackTexture;
      } finally {
        this.loadingAssets.delete(url);
      }
    })();

    this.loadingAssets.set(url, loadPromise);
    return await loadPromise;
  }

  // ---------- Preload Asset Batch 01 (UI Icons & Logo) ----------
  async preloadBatch01() {
    const batch01Assets = [
      'public/assets/ui/ui_game_logo.png',
      'public/assets/icons/ui_icon_hp.png',
      'public/assets/icons/ui_icon_sanity.png',
      'public/assets/icons/ui_icon_hunger.png',
      'public/assets/icons/ui_icon_hydration.png',
      'public/assets/icons/ui_icon_infection.png',
      'public/assets/icons/ui_icon_res_cigarette.png',
      'public/assets/icons/ui_icon_res_royal_coin.png',
      'public/assets/icons/ui_icon_res_gasoline.png',
      'public/assets/icons/ui_icon_backpack.png',
      'public/assets/icons/ui_icon_melee_slot.png',
      'public/assets/icons/ui_icon_ranged_slot.png',
      'public/assets/ui/ui_placeholder_empty.png',
    ];

    const promises = batch01Assets.map(path => this.loadTexture(path).catch(err => {
      console.warn(`[PixiRenderer] Preload warning for ${path}:`, err?.message || err);
    }));

    await Promise.allSettled(promises);
    if (this.hpIconSprite && this.textureCache.has('public/assets/icons/ui_icon_hp.png')) {
      this.hpIconSprite.texture = this.textureCache.get('public/assets/icons/ui_icon_hp.png');
    }
  }

  // ---------- Cap nhat hien thi theo State (Zero Allocation Render Loop) ----------
  render(state) {
    if (!this.enabled || !this.app) return;
    this.state = state;

    // Kiem tra hien thi ban do sa ban (Batch 07 Phase 7.3)
    if (state && state.phase === 'map_select') {
      if (this.mapViewMode === 'graphical') {
        if (this.locText) this.locText.visible = false;
        if (this.dayText) this.dayText.visible = false;
        if (this.hpBarBg) this.hpBarBg.visible = false;
        if (this.hpBar) this.hpBar.visible = false;
        if (this.hpIconSprite) this.hpIconSprite.visible = false;
        if (this.hpLabel) this.hpLabel.visible = false;
        for (const p of this.entityPool) p.visible = false;
        if (this.bgLayer) this.bgLayer.visible = false;

        if (this.worldMapRenderer) {
          this.worldMapRenderer.render(state);
        }
        return;
      }
    }

    // Phuc hoi hien thi HUD mac dinh khi khong o man hinh map_select
    if (this.bgLayer) this.bgLayer.visible = true;
    if (this.worldMapRenderer) {
      this.worldMapRenderer.render({ ...state, phase: 'idle' });
    }
    if (this.locText) this.locText.visible = true;
    if (this.dayText) this.dayText.visible = true;
    if (this.hpBarBg) this.hpBarBg.visible = true;
    if (this.hpBar) this.hpBar.visible = true;
    if (this.hpIconSprite) this.hpIconSprite.visible = true;
    if (this.hpLabel) this.hpLabel.visible = true;

    // 1. Cap nhat vi tri & bối cảnh
    this._updateLocation(state);

    // 2. Cap nhat thong tin the gioi (Ngay, HP, trang thai)
    this._updateWorldInfo(state);

    // 3. Cap nhat danh sach thuc the (NPC) qua Object Pool
    this._updateEntities(state);
  }

  _updateLocation(state) {
    if (!state) return;
    const loc = state.location || 'Doanh địa người sống sót';
    if (this.locText) {
      this.locText.text = loc;
    }

    const bgUrl = this._resolveBackground(state);
    if (bgUrl && this.bgSprite && this._currentBgUrl !== bgUrl) {
      this._currentBgUrl = bgUrl;
      this.loadTexture(bgUrl).then(tex => {
        if (tex && this.bgSprite && this._currentBgUrl === bgUrl) {
          this.bgSprite.texture = tex;
          this.bgSprite.alpha = 0.55;
        }
      }).catch(() => {});
    }
  }

  _resolveBackground(state) {
    if (!state) return null;
    const phase = state.phase;
    if (phase === 'castle_bank') {
      return 'public/assets/backgrounds/map_lau_dai_bank_bg.webp';
    }
    if (phase === 'castle_treatment') {
      return 'public/assets/backgrounds/map_lau_dai_y_te_bg.webp';
    }
    if (phase === 'trading_post' || (state.story && state.story.includes('Trạm giao dịch Dawn'))) {
      return 'public/assets/backgrounds/map_tram_giao_dich_bg.webp';
    }
    const mapId = state.currentMap?.id;
    if (mapId) {
      return `public/assets/backgrounds/map_${mapId}_bg.webp`;
    }
    return null;
  }

  _updateWorldInfo(state) {
    if (!state) return;

    if (this.dayText) {
      const day = state.day || 1;
      const weather = state.weather || 'Âm u';
      const status = state.status || 'Bình thường';
      this.dayText.text = `Ngày ${day}  |  ${weather}  |  ${status}`;
    }

    // Cap nhat HP Icon va thanh HP
    if (this.hpIconSprite && this.textureCache.has('public/assets/icons/ui_icon_hp.png')) {
      this.hpIconSprite.texture = this.textureCache.get('public/assets/icons/ui_icon_hp.png');
    }

    const maxHp = state.maxHealth || 100;
    const curHp = state.health !== undefined ? state.health : 100;
    const hpPct = Math.max(0, Math.min(100, Math.round((curHp / maxHp) * 100)));

    if (this.hpBar) {
      this.hpBar.clear();
      this.hpBar.beginFill(hpPct > 30 ? COLORS.safe : COLORS.danger);
      this.hpBar.drawRect(38, 62, (hpPct / 100) * 160, 10);
      this.hpBar.endFill();
    }

    if (this.hpLabel) {
      this.hpLabel.text = `HP: ${hpPct}%`;
    }
  }

  _updateEntities(state) {
    if (!state) return;

    const entities = [];
    if (state.npcAffinity) {
      for (const [npcId, aff] of Object.entries(state.npcAffinity)) {
        entities.push({ id: npcId, name: `NPC ${npcId}`, affinity: aff });
      }
    }

    for (let i = 0; i < this.maxEntities; i++) {
      const poolItem = this.entityPool[i];
      if (!poolItem) continue;

      if (i < entities.length) {
        const ent = entities[i];
        const color = ent.affinity > 30 ? COLORS.safe : ent.affinity > 0 ? COLORS.neutral : 0xffffff;
        poolItem.text = `• ${ent.name} (thân thiết ${ent.affinity})`;
        poolItem.style.fill = color;
        poolItem.visible = true;
      } else {
        poolItem.visible = false;
      }
    }
  }

  // ---------- Responsive Resize ----------
  resize() {
    if (!this.enabled || !this.app || !this.app.renderer) return;

    const container = document.getElementById('pixi-viewport') || document.getElementById(this.containerId);
    if (!container) return;

    // Canvas CSS da co width: 100%, height: auto nen co gian responsive muot ma.
    // O day ta chi can render lai mot luot de dam bao stage khong bi blur.
    if (this.state) {
      this.render(this.state);
    }
  }

  // ---------- Chuyen doi che do xem Ban do Sa ban / Danh sach chu ----------
  toggleMapViewMode() {
    this.mapViewMode = (this.mapViewMode === 'graphical') ? 'textual' : 'graphical';
    if (this.state) this.render(this.state);
    return this.mapViewMode;
  }

  setMapViewMode(mode) {
    if (mode === 'graphical' || mode === 'textual') {
      this.mapViewMode = mode;
      if (this.state) this.render(this.state);
    }
  }

  // ---------- Giai phong tai nguyen ----------
  destroy() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }

    if (this.worldMapRenderer) {
      this.worldMapRenderer.destroy();
      this.worldMapRenderer = null;
    }

    if (this.fallbackTexture) {
      this.fallbackTexture.destroy(true);
      this.fallbackTexture = null;
    }

    for (const tex of this.textureCache.values()) {
      tex.destroy(true);
    }
    this.textureCache.clear();
    this.loadingAssets.clear();
    this.failedAssets.clear();

    if (this.app) {
      this.app.destroy(true, { children: true, texture: false, baseTexture: false });
      this.app = null;
    }

    this.enabled = false;
    this.state = null;
  }
}

// ---------- Singleton instance ----------
export const pixiRenderer = new PixiRenderer();
