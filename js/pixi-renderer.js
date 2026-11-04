/* ============================================================
   PixiJS Renderer — Zombie World RPG (Phase 1.5)
   
   Muc tieu: Render the gioi ban do / NPC / item bang WebGL/Canvas,
             giu nguyen he thong menu/DOM hien tai.
   
   Cach hoa dong:
   - index.html: them the <canvas> va tai PixiJS tu CDN
   - js/main.js: khoi tao PixiRenderer va goi render() khi state thay doi
   - js/ui.js: bo sung khu vuc hien thi PixiJS (optional)
   
   Ghi nho: DOM UI (stats, inventory, story, options) van duoc giu nguyen,
            PixiJS chi bo sung tram tran trang cho the gioi.
   ============================================================ */

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/dist/pixi.mjs';

// ---------- Mau sac / chat luong hien thi ----------
const COLORS = {
  bg: 0x1a1a2e,
  panel: 0x16213e,
  text: 0xe94560,
  safe: 0x00ff88,
  danger: 0xff4757,
  neutral: 0xffa502,
};

// ---------- PixiRenderer class ----------
export class PixiRenderer {
  /**
   * @param {Object} options
   * @param {string} options.containerId - ID the hien thi canvas (mac dinh: 'game-container')
   * @param {number} options.width - Chieu rong canvas
   * @param {number} options.height - Chieu cao canvas
   */
  constructor({ containerId = 'game-container', width = 640, height = 360 } = {}) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.app = null;
    this.background = null;
    this.worldLayer = null;
    this.uiLayer = null;
    this.spriteCache = new Map(); // id -> PIXI.Sprite
    this.enabled = false;
    this.state = null;
  }

  // ---------- Khoi tao ----------
  async init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn('[PixiRenderer] Khong tim thay container:', this.containerId);
      return false;
    }

    // Tao PixiJS Application
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: COLORS.bg,
      antialias: true,
      resizeTo: window,
    });

    // Dat canvas o day sau game-header, truoc noi dung DOM
    const canvas = this.app.view;
    canvas.id = 'pixi-canvas';
    canvas.style.display = 'block';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.margin = '0 auto';
    canvas.style.zIndex = '0';

    // Chen canvas vao container (truoc cac phan tu DOM con de DOM o tren)
    container.insertBefore(canvas, container.firstChild);

    // Tao cac layer
    this.background = new PIXI.Container();
    this.worldLayer = new PIXI.Container();
    this.uiLayer = new PIXI.Container();

    this.app.stage.addChild(this.background);
    this.app.stage.addChild(this.worldLayer);
    this.app.stage.addChild(this.uiLayer);

    // Ve nen mac dinh
    this._drawBackground();

    this.enabled = true;
    console.log('[PixiRenderer] Da khoi tao PixiJS render.');
    return true;
  }

  // ---------- Cap nhat render theo state ----------
  /**
   * Goi ham nay moi khi state thay doi de cap nhat hien thi PixiJS.
   * @param {Object} state - Trang thai game hien tai
   */
  render(state) {
    if (!this.enabled || !this.app) return;
    this.state = state;

    // Xoa world layer (cac doi tuong dong)
    this.worldLayer.removeChildren();

    // Ve nen theo vi tri hien tai
    this._drawBackground(state);

    // Ve thong tin co ban (ten vi tri, ngay, thoi tiet)
    this._drawWorldInfo(state);

    // Ve NPC / item neu co du lieu (hien tai la placeholder vi chua co sprite)
    this._drawEntities(state);

    this.app.render();
  }

  // ---------- Tuong tac ----------
  resize(width, height) {
    if (!this.enabled || !this.app) return;
    this.app.renderer.resize(width, height);
    this._drawBackground(this.state);
    this._drawWorldInfo(this.state);
    this._drawEntities(this.state);
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
    }
    this.enabled = false;
  }

  // ---------- Hai ham con ve nen ----------

  _drawBackground(state) {
    this.background.removeChildren();

    // Nen gradient don gian
    const rect = new PIXI.Graphics();
    rect.beginFill(COLORS.bg);
    rect.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    rect.endFill();
    this.background.addChild(rect);

    // Vien trang tri
    const border = new PIXI.Graphics();
    border.lineStyle(4, COLORS.text, 0.6);
    border.drawRect(10, 10, this.app.screen.width - 20, this.app.screen.height - 20);
    this.background.addChild(border);
  }

  _drawWorldInfo(state) {
    if (!state) return;

    // Ten vi tri
    const locText = new PIXI.Text({
      text: state.location || 'Khong xac dinh',
      style: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 20,
        fill: COLORS.safe,
        stroke: COLORS.bg,
        strokeThickness: 2,
      },
    });
    locText.x = 20;
    locText.y = 20;
    this.worldLayer.addChild(locText);

    // Ngay / thoi tiet / giai doan
    const dayText = new PIXI.Text({
      text: `Ngay ${state.day || 1}  |  ${state.weather || ''}  |  ${state.status || ''}`,
      style: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        fill: 0xffffff,
        stroke: COLORS.bg,
        strokeThickness: 1,
      },
    });
    dayText.x = 20;
    dayText.y = 50;
    this.worldLayer.addChild(dayText);

    // Mau cua suc khoe (HP bar)
    const hpPct = state.health ? Math.round((state.health / 100) * 100) : 0;
    const hpBarBg = new PIXI.Graphics();
    hpBarBg.beginFill(0x333333);
    hpBarBg.drawRect(20, 78, 200, 12);
    hpBarBg.endFill();
    this.worldLayer.addChild(hpBarBg);

    const hpBar = new PIXI.Graphics();
    hpBar.beginFill(hpPct > 30 ? COLORS.safe : COLORS.danger);
    hpBar.drawRect(20, 78, (hpPct / 100) * 200, 12);
    hpBar.endFill();
    this.worldLayer.addChild(hpBar);

    const hpLabel = new PIXI.Text({
      text: `HP: ${hpPct}%`,
      style: { fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fill: 0xffffff },
    });
    hpLabel.x = 230;
    hpLabel.y = 74;
    this.worldLayer.addChild(hpLabel);
  }

  _drawEntities(state) {
    // Placeholder: ve cac entity (NPC, item) o vi tri tuong doi
    // Hien tai chua co toa do trong state, nen chi hien thi danh sach text
    if (!state) return;

    const entities = [];

    // Them nhung NPC co the duoc biet qua affinity
    if (state.npcAffinity) {
      Object.keys(state.npcAffinity).forEach((npcId, i) => {
        entities.push({ id: npcId, name: `NPC ${npcId}`, affinity: state.npcAffinity[npcId] });
      });
    }

    const startY = 110;
    entities.slice(0, 6).forEach((ent, i) => {
      const color = ent.affinity > 30 ? COLORS.safe : ent.affinity > 0 ? COLORS.neutral : 0xffffff;
      const txt = new PIXI.Text({
        text: `${ent.name} (tham thiet ${ent.affinity})`,
        style: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fill: color },
      });
      txt.x = 20;
      txt.y = startY + i * 22;
      this.worldLayer.addChild(txt);
    });
  }
}

// ---------- Singleton instance ----------
export const pixiRenderer = new PixiRenderer();
