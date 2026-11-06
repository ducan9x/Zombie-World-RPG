/**
 * ============================================================
 * World Map Renderer — Zombie World RPG (Batch 07 Phase 7.4)
 * Map UX Polish & Visual Enhancement with Strict Gameplay Preservation
 * Renders the 640x320 Tileset World Map within PixiRenderer
 * Dual-Mode Selection & Synchronized Interactive HUD
 * ============================================================
 */

import { getState } from './state.js';
import { handleAction } from './game/index.js';
import { renderAll } from './ui.js';
import { MAPS } from './data/maps/maps.js';

const TILE_SIZE = 32;
const COLS = 20; // 640 / 32
const ROWS = 10; // 320 / 32
const ATLAS_JSON_PATH = 'public/assets/maps/atlases/world_map_tileset.json';

/**
 * Tọa độ sa bàn của các địa điểm trong game trên khung lưới 20x10
 * Chỉ những địa điểm có trong state.options mới có thể tương tác
 */
export const MAP_COORDINATES = {
  // Điểm xuất phát (Căn cứ)
  home: { tileX: 4, tileY: 4, name: 'Lều Người Sống Sót', structure: 'prop_barricade_sandbag_32' },

  // Căn cứ liên minh & công trình kiên cố
  lau_dai_tan_the: { tileX: 1, tileY: 0, width: 4, height: 3, structure: 'bld_castle_fortress_128' },
  tran_dia_binh_minh: { tileX: 7, tileY: 1, width: 2, height: 2, structure: 'bld_watchtower_fortified_64' },
  thap_canh_bo_roi: { tileX: 0, tileY: 4, width: 2, height: 2, structure: 'bld_watchtower_fortified_64' },

  // Ngoại ô & dịch vụ
  nha_kho_nong_thon: { tileX: 3, tileY: 3, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  lang_nong_trai_nui: { tileX: 1, tileY: 7, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  tram_xang_bo_roi: { tileX: 5, tileY: 3, width: 2, height: 2, structure: 'bld_gas_station_64' },
  khu_dich_vu_cao_toc: { tileX: 11, tileY: 4, width: 2, height: 2, structure: 'bld_gas_station_64' },

  // Đô thị & thương mại
  trung_tam_thuong_mai: { tileX: 9, tileY: 2, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  thanh_pho_dai_hoc: { tileX: 11, tileY: 7, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  khu_dan_cu_cu: { tileX: 8, tileY: 7, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  sieu_thi_kho: { tileX: 13, tileY: 3, width: 2, height: 2, structure: 'bld_abandoned_house_64' },

  // Khu vực công nghiệp & kho bãi
  khu_cong_nghiep: { tileX: 2, tileY: 7, width: 3, height: 2, structure: 'bld_industrial_warehouse_96' },
  nha_kho_nha_may: { tileX: 5, tileY: 7, width: 2, height: 2, structure: 'bld_industrial_warehouse_96' },

  // Sông ngòi & cảng biển
  cam_trai_ben_song: { tileX: 16, tileY: 3, width: 2, height: 2, structure: 'prop_oil_drum_rust_32' },
  cang_ben_song: { tileX: 17, tileY: 1, width: 2, height: 2, structure: 'prop_oil_drum_rust_32' },

  // Cơ sở đặc biệt & tử địa
  benh_vien_ngoai_thanh: { tileX: 10, tileY: 1, width: 3, height: 2, structure: 'bld_hospital_ruined_96' },
  canh_sat_bo_roi: { tileX: 7, tileY: 3, width: 2, height: 2, structure: 'prop_barricade_sandbag_32' },
  tram_kiem_tra_quan_du: { tileX: 8, tileY: 5, width: 2, height: 2, structure: 'prop_barricade_sandbag_32' },
  ham_tau_dien_ngam: { tileX: 13, tileY: 5, width: 2, height: 2, structure: 'prop_rubble_debris_32' },
  vien_sinh_hoc: { tileX: 14, tileY: 7, width: 2, height: 2, structure: 'bld_abandoned_house_64' },
  to_zombie: { tileX: 17, tileY: 7, width: 2, height: 2, structure: 'prop_rubble_debris_32' },
  co_so_vu_tru_tuyet_mat: { tileX: 17, tileY: 5, width: 2, height: 2, structure: 'prop_rubble_debris_32' },
};

/**
 * Phân tích độ nguy hiểm thành màu sắc và nhãn tiêu chuẩn
 */
export function getDangerInfo(dangerStr) {
  if (!dangerStr) return { color: 0x9ca3af, hex: '#9ca3af', label: 'KHÔNG XÁC ĐỊNH' };
  if (dangerStr.includes('An toàn')) return { color: 0x4ade80, hex: '#4ade80', label: 'AN TOÀN' };
  if (dangerStr.includes('Nhẹ nhàng')) return { color: 0x38bdf8, hex: '#38bdf8', label: 'NHẸ NHÀNG' };
  if (dangerStr.includes('Nguy hiểm thấp')) return { color: 0xfacc15, hex: '#facc15', label: 'NGUY HIỂM THẤP' };
  if (dangerStr.includes('Trung bình')) return { color: 0xfb923c, hex: '#fb923c', label: 'TRUNG BÌNH' };
  if (dangerStr.includes('Nguy hiểm cao')) return { color: 0xf87171, hex: '#f87171', label: 'NGUY HIỂM CAO' };
  if (dangerStr.includes('Tuyệt cảnh')) return { color: 0xc084fc, hex: '#c084fc', label: 'TUYỆT CẢNH' };
  if (dangerStr.includes('Luyện ngục')) return { color: 0xef4444, hex: '#ef4444', label: 'LUYỆN NGỤC' };
  return { color: 0x9ca3af, hex: '#9ca3af', label: dangerStr };
}

export class WorldMapRenderer {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.container.visible = false;

    // Content container for zooming & panning
    this.contentContainer = new PIXI.Container();
    this.container.addChild(this.contentContainer);

    // Display sub-containers inside contentContainer
    this.terrainLayer = new PIXI.Container();
    this.roadLayer = new PIXI.Container();
    this.propLayer = new PIXI.Container();
    this.structureLayer = new PIXI.Container();
    this.markerLayer = new PIXI.Container();
    this.gridLayer = new PIXI.Graphics();

    this.contentContainer.addChild(this.terrainLayer);
    this.contentContainer.addChild(this.roadLayer);
    this.contentContainer.addChild(this.propLayer);
    this.contentContainer.addChild(this.structureLayer);
    this.contentContainer.addChild(this.markerLayer);
    this.contentContainer.addChild(this.gridLayer);

    // Fixed UI & overlay containers (outside zoom container)
    this.vignetteLayer = new PIXI.Graphics();
    this.uiLayer = new PIXI.Container();
    this.container.addChild(this.vignetteLayer);
    this.container.addChild(this.uiLayer);

    this.textures = {};
    this.isLoaded = false;
    this.activeAnimations = [];
    this.playerTokenSprite = null;
    this.radarRing = null;
    this.isActionPending = false;

    // UX State
    this.zoomLevel = 1.0;
    this.showGrid = false;
    this.markerMap = {};
    this.hoveredMapId = null;

    this.createTacticalCard();
    this.drawVignette();
  }

  async loadAssets() {
    if (this.isLoaded) return;
    try {
      if (PIXI.Assets && PIXI.Assets.load) {
        const resource = await PIXI.Assets.load(ATLAS_JSON_PATH);
        if (resource && resource.textures) {
          this.textures = resource.textures;
          this.isLoaded = true;
          this.buildStaticMap();
          return;
        }
      }
    } catch (err) {
      console.warn('[WorldMapRenderer] Atlas load failed, loading individual tiles:', err?.message || err);
    }

    // Fallback: individual tiles
    const ids = [
      'terrain_grass_dead_32', 'terrain_dirt_wasteland_32', 'terrain_concrete_cracked_32',
      'terrain_asphalt_dark_32', 'terrain_gravel_coarse_32', 'terrain_rock_cliff_32',
      'terrain_water_toxic_32', 'terrain_bio_blight_32',
      'road_asphalt_h_32', 'road_asphalt_v_32', 'road_crossroads_32', 'road_t_junction_32',
      'road_corner_32', 'road_edge_32', 'road_broken_cracked_32', 'road_sidewalk_pavement_32',
      'prop_dead_bush_32', 'prop_boulder_rock_32', 'prop_rubble_debris_32',
      'prop_barricade_sandbag_32', 'prop_fence_barbed_wire_32', 'prop_oil_drum_rust_32',
      'prop_vehicle_wreck_small_32',
      'bld_abandoned_house_64', 'bld_gas_station_64', 'bld_watchtower_fortified_64',
      'bld_hospital_ruined_96', 'bld_industrial_warehouse_96', 'bld_castle_fortress_128',
      'marker_poi_active_32', 'marker_poi_unexplored_32', 'marker_danger_skull_32', 'marker_player_token_32'
    ];

    for (const id of ids) {
      let folder = 'terrain';
      if (id.startsWith('road_')) folder = 'roads';
      else if (id.startsWith('prop_')) folder = 'props';
      else if (id.startsWith('bld_')) folder = 'structures';
      else if (id.startsWith('marker_')) folder = 'markers';

      try {
        if (PIXI.Assets && PIXI.Assets.load) {
          const tex = await PIXI.Assets.load(`public/assets/maps/tiles/${folder}/${id}.png`);
          if (tex) {
            if (tex.baseTexture && PIXI.SCALE_MODES) {
              tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            }
            this.textures[id] = tex;
          }
        }
      } catch (e) {
        // Fallback procedural
      }
    }
    this.isLoaded = true;
    this.buildStaticMap();
  }

  getTexture(id) {
    if (this.textures[id]) return this.textures[id];
    if (this.app && this.app.renderer && typeof this.app.renderer.generateTexture === 'function') {
      const g = new PIXI.Graphics();
      g.beginFill(0x2a2e38);
      g.drawRect(0, 0, 32, 32);
      g.endFill();
      return this.app.renderer.generateTexture(g);
    }
    return (typeof PIXI !== 'undefined' && PIXI.Texture && PIXI.Texture.WHITE) ? PIXI.Texture.WHITE : null;
  }

  buildStaticMap() {
    this.terrainLayer.removeChildren();
    this.roadLayer.removeChildren();
    this.structureLayer.removeChildren();
    this.propLayer.removeChildren();

    // 1. Organic Terrain Grid (20x10)
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        let texKey = 'terrain_grass_dead_32';

        // Tây Bắc: Rặng núi đá hiểm trở
        if (tx < 4 && ty < 4) {
          texKey = (tx === 0 || ty === 0) ? 'terrain_rock_cliff_32' : 'terrain_gravel_coarse_32';
        }
        // Phía Đông: Dòng sông độc hại và đầm lầy biến dị
        else if (tx >= 17) {
          texKey = 'terrain_water_toxic_32';
        } else if (tx >= 14 && ty >= 5) {
          texKey = 'terrain_bio_blight_32';
        }
        // Phía Nam: Khu công nghiệp bê tông nứt vỡ & asphalt tối
        else if (tx >= 1 && tx <= 7 && ty >= 6) {
          texKey = (ty === 7) ? 'terrain_asphalt_dark_32' : 'terrain_concrete_cracked_32';
        }
        // Trung tâm & Đô thị: Đất hoang mạt thế & đá sỏi
        else if (tx >= 8 && tx <= 13) {
          texKey = (ty < 4) ? 'terrain_concrete_cracked_32' : 'terrain_dirt_wasteland_32';
        } else if (tx >= 4 && ty < 6) {
          texKey = 'terrain_dirt_wasteland_32';
        }

        const tile = new PIXI.Sprite(this.getTexture(texKey));
        tile.x = tx * TILE_SIZE;
        tile.y = ty * TILE_SIZE;
        this.terrainLayer.addChild(tile);
      }
    }

    // 2. Connected Road Network (Mạng lưới đường bộ nối liền các khu vực)
    // Đường quốc lộ Đông - Tây xuyên suốt hàng 5 (y = 160)
    for (let tx = 0; tx <= 16; tx++) {
      let roadKey = 'road_asphalt_h_32';
      if (tx === 8) roadKey = 'road_crossroads_32';
      else if (tx === 13) roadKey = 'road_t_junction_32';
      else if (tx === 3) roadKey = 'road_t_junction_32';
      else if (tx === 4) roadKey = 'road_broken_cracked_32';
      else if (tx === 11) roadKey = 'road_broken_cracked_32';

      const r = new PIXI.Sprite(this.getTexture(roadKey));
      r.x = tx * TILE_SIZE;
      r.y = 5 * TILE_SIZE;
      this.roadLayer.addChild(r);
    }

    // Trục đường Bắc - Nam trung tâm tại cột 8
    for (let ty = 0; ty < ROWS; ty++) {
      if (ty !== 5) {
        const r = new PIXI.Sprite(this.getTexture('road_asphalt_v_32'));
        r.x = 8 * TILE_SIZE;
        r.y = ty * TILE_SIZE;
        this.roadLayer.addChild(r);
      }
    }

    // Nhánh rẽ phía Tây (Cột 3 dẫn lên Lâu đài và Tháp canh)
    for (let ty = 1; ty < 5; ty++) {
      const r = new PIXI.Sprite(this.getTexture('road_asphalt_v_32'));
      r.x = 3 * TILE_SIZE;
      r.y = ty * TILE_SIZE;
      this.roadLayer.addChild(r);
    }

    // Nhánh rẽ phía Đông (Cột 13 dẫn xuống Viện sinh học & Siêu thị)
    for (let ty = 2; ty < 8; ty++) {
      if (ty !== 5) {
        const r = new PIXI.Sprite(this.getTexture('road_asphalt_v_32'));
        r.x = 13 * TILE_SIZE;
        r.y = ty * TILE_SIZE;
        this.roadLayer.addChild(r);
      }
    }

    // 3. Multi-tile Structures với bóng đổ (Grounding Shadows)
    const structures = [
      { id: 'bld_castle_fortress_128', x: 1 * TILE_SIZE, y: 0 * TILE_SIZE, w: 128, h: 96 },
      { id: 'bld_hospital_ruined_96', x: 10 * TILE_SIZE, y: 1 * TILE_SIZE, w: 96, h: 64 },
      { id: 'bld_gas_station_64', x: 5 * TILE_SIZE, y: 3 * TILE_SIZE - 6, w: 64, h: 64 },
      { id: 'bld_industrial_warehouse_96', x: 2 * TILE_SIZE, y: 7 * TILE_SIZE - 4, w: 96, h: 64 },
      { id: 'bld_watchtower_fortified_64', x: 0 * TILE_SIZE, y: 4 * TILE_SIZE, w: 64, h: 64 },
      { id: 'bld_watchtower_fortified_64', x: 7 * TILE_SIZE, y: 1 * TILE_SIZE, w: 64, h: 64 },
      { id: 'bld_abandoned_house_64', x: 9 * TILE_SIZE, y: 7 * TILE_SIZE, w: 64, h: 64 },
      { id: 'bld_abandoned_house_64', x: 13 * TILE_SIZE, y: 3 * TILE_SIZE - 8, w: 64, h: 64 },
    ];

    for (const s of structures) {
      // Bóng đổ mặt đất tạo chiều sâu
      const shadow = new PIXI.Graphics();
      shadow.beginFill(0x000000, 0.4);
      shadow.drawRoundedRect(s.x + 4, s.y + s.h - 10, s.w - 8, 12, 4);
      shadow.endFill();
      this.structureLayer.addChild(shadow);

      const bld = new PIXI.Sprite(this.getTexture(s.id));
      bld.x = s.x;
      bld.y = s.y;
      this.structureLayer.addChild(bld);
    }

    // 4. Decorative Props
    const props = [
      { id: 'prop_vehicle_wreck_small_32', x: 4 * TILE_SIZE + 6, y: 5 * TILE_SIZE + 2 },
      { id: 'prop_vehicle_wreck_small_32', x: 11 * TILE_SIZE + 8, y: 5 * TILE_SIZE + 2 },
      { id: 'prop_barricade_sandbag_32', x: 8 * TILE_SIZE - 12, y: 4 * TILE_SIZE + 18 },
      { id: 'prop_fence_barbed_wire_32', x: 8 * TILE_SIZE + 14, y: 4 * TILE_SIZE + 18 },
      { id: 'prop_oil_drum_rust_32', x: 6 * TILE_SIZE, y: 3 * TILE_SIZE + 4 },
      { id: 'prop_boulder_rock_32', x: 2 * TILE_SIZE + 10, y: 1 * TILE_SIZE + 8 },
      { id: 'prop_dead_bush_32', x: 10 * TILE_SIZE + 6, y: 4 * TILE_SIZE + 8 },
      { id: 'prop_rubble_debris_32', x: 13 * TILE_SIZE + 6, y: 5 * TILE_SIZE + 12 },
    ];

    for (const p of props) {
      const spr = new PIXI.Sprite(this.getTexture(p.id));
      spr.x = p.x;
      spr.y = p.y;
      this.propLayer.addChild(spr);
    }

    this.drawGrid();
  }

  drawGrid() {
    this.gridLayer.clear();
    if (!this.showGrid) return;

    this.gridLayer.lineStyle(1, 0x38bdf8, 0.18);
    for (let x = 0; x <= 640; x += TILE_SIZE) {
      this.gridLayer.moveTo(x, 0);
      this.gridLayer.lineTo(x, 320);
    }
    for (let y = 0; y <= 320; y += TILE_SIZE) {
      this.gridLayer.moveTo(0, y);
      this.gridLayer.lineTo(640, y);
    }
  }

  drawVignette() {
    this.vignetteLayer.clear();
    // Khung viền góc mờ phong cách mạt thế
    this.vignetteLayer.lineStyle(2, 0x111827, 0.85);
    this.vignetteLayer.drawRect(1, 1, 638, 318);

    this.vignetteLayer.lineStyle(1, 0x000000, 0.45);
    this.vignetteLayer.drawRect(2, 2, 636, 316);
    this.vignetteLayer.lineStyle(1, 0x000000, 0.2);
    this.vignetteLayer.drawRect(3, 3, 634, 314);
  }

  createTacticalCard() {
    this.infoCard = new PIXI.Container();
    this.infoCard.visible = false;
    this.infoCard.eventMode = 'none';

    this.cardBg = new PIXI.Graphics();
    this.cardTitle = new PIXI.Text('', {
      fontFamily: 'Segoe UI, monospace',
      fontSize: 12,
      fontWeight: 'bold',
      fill: 0xffffff,
    });
    this.cardDanger = new PIXI.Text('', {
      fontFamily: 'Segoe UI, monospace',
      fontSize: 10,
      fontWeight: 'bold',
      fill: 0xfacc15,
    });
    this.cardStatus = new PIXI.Text('', {
      fontFamily: 'Segoe UI, monospace',
      fontSize: 9.5,
      fontWeight: '600',
      fill: 0x4ade80,
    });
    this.cardEncounter = new PIXI.Text('', {
      fontFamily: 'Segoe UI, monospace',
      fontSize: 9.5,
      fill: 0x94a3b8,
    });
    this.cardHint = new PIXI.Text('▶ Nhấp để di chuyển tới đây', {
      fontFamily: 'Segoe UI, monospace',
      fontSize: 9,
      fontStyle: 'italic',
      fill: 0x60a5fa,
    });

    this.infoCard.addChild(this.cardBg);
    this.infoCard.addChild(this.cardTitle);
    this.infoCard.addChild(this.cardDanger);
    this.infoCard.addChild(this.cardStatus);
    this.infoCard.addChild(this.cardEncounter);
    this.infoCard.addChild(this.cardHint);

    this.uiLayer.addChild(this.infoCard);
  }

  showTacticalCard(mapData, isExplored, screenX, screenY) {
    if (!this.infoCard) return;
    const danger = getDangerInfo(mapData.danger);

    this.cardTitle.text = mapData.name || 'Địa điểm sinh tồn';
    this.cardDanger.text = `[${danger.label}]`;
    this.cardDanger.style.fill = danger.color;

    this.cardStatus.text = isExplored ? '✓ ĐÃ KHÁM PHÁ' : '? CHƯA THÁM HIỂM';
    this.cardStatus.style.fill = isExplored ? 0x4ade80 : 0xfacc15;

    const ratePct = Math.round((mapData.encounterRate || 0) * 100);
    this.cardEncounter.text = `Nguy cơ Zombie: ${ratePct}% | Cấp: ${mapData.danger || 'Thường'}`;

    const cardW = 220;
    const cardH = 76;

    this.cardBg.clear();
    this.cardBg.beginFill(0x0e131f, 0.94);
    this.cardBg.lineStyle(1.5, danger.color, 0.85);
    this.cardBg.drawRoundedRect(0, 0, cardW, cardH, 5);
    this.cardBg.endFill();

    // Dải màu nhấn phía trên card
    this.cardBg.beginFill(danger.color, 0.9);
    this.cardBg.drawRect(4, 0, cardW - 8, 2);
    this.cardBg.endFill();

    this.cardTitle.x = 10;
    this.cardTitle.y = 8;
    this.cardDanger.x = cardW - this.cardDanger.width - 10;
    this.cardDanger.y = 9;
    this.cardStatus.x = 10;
    this.cardStatus.y = 28;
    this.cardEncounter.x = 10;
    this.cardEncounter.y = 44;
    this.cardHint.x = 10;
    this.cardHint.y = 59;

    let targetX = screenX > 320 ? screenX - cardW - 22 : screenX + 22;
    let targetY = Math.max(8, Math.min(320 - cardH - 8, screenY - 32));

    this.infoCard.x = Math.max(8, Math.min(640 - cardW - 8, targetX));
    this.infoCard.y = targetY;
    this.infoCard.visible = true;
  }

  hideTacticalCard() {
    if (this.infoCard) this.infoCard.visible = false;
  }

  /**
   * Cập nhật hiển thị bản đồ dựa trên State thực tế của Game
   */
  render(state) {
    if (!state) return;
    if (!this.isLoaded) {
      this.loadAssets().then(() => this.render(state));
      return;
    }

    this.container.visible = (state.phase === 'map_select');
    if (!this.container.visible) {
      this.clearAnimations();
      this.hideTacticalCard();
      this.unhighlightMatchingOption();
      return;
    }

    this.updatePOIMarkers(state);
    this.updatePlayerToken(state);
    this.applyZoomAndPan();
  }

  clearAnimations() {
    if (this.app?.ticker?.remove) {
      for (const tickerFn of this.activeAnimations) {
        this.app.ticker.remove(tickerFn);
      }
    }
    this.activeAnimations = [];
    this.hideTacticalCard();
    this.isActionPending = false;
  }

  updatePOIMarkers(state) {
    this.clearAnimations();
    this.markerLayer.removeChildren();
    this.markerMap = {};

    const exploredList = state.stats?.mapsExplored || [];
    const availableOptions = state.options || [];

    // Duyệt qua danh sách vị trí sa bàn
    for (const [mapId, coord] of Object.entries(MAP_COORDINATES)) {
      if (mapId === 'home') continue;

      // Xác minh địa điểm này có trong options hiện tại không
      const optIndex = availableOptions.findIndex(o => o.map && o.map.id === mapId);
      if (optIndex === -1) continue; // Ẩn địa điểm chưa mở hoặc địa điểm bí mật

      const option = availableOptions[optIndex];
      const isExplored = exploredList.includes(mapId);
      const mapData = option.map;

      // Phân định icon marker
      let markerIconKey = 'marker_poi_unexplored_32';
      let dangerInfo = getDangerInfo(mapData.danger);

      if (mapData.danger && (mapData.danger.includes('Tuyệt cảnh') || mapData.danger.includes('Luyện ngục'))) {
        markerIconKey = 'marker_danger_skull_32';
      } else if (isExplored || mapData.encounterRate === 0) {
        markerIconKey = 'marker_poi_active_32';
      }

      const markerContainer = new PIXI.Container();
      const markerW = coord.width || 2;
      const posX = coord.tileX * TILE_SIZE + (markerW * TILE_SIZE) / 2;
      const posY = coord.tileY * TILE_SIZE + 10;
      markerContainer.x = posX;
      markerContainer.y = posY;
      markerContainer.eventMode = 'static';
      markerContainer.cursor = 'pointer';

      // Vòng tròn định vị / Target Reticle
      const reticle = new PIXI.Graphics();
      reticle.lineStyle(1.5, dangerInfo.color, 0.4);
      reticle.drawCircle(0, 0, 15);
      reticle.visible = false;
      markerContainer.addChild(reticle);

      const icon = new PIXI.Sprite(this.getTexture(markerIconKey));
      icon.anchor.set(0.5, 0.5);
      markerContainer.addChild(icon);

      // Animation nhịp thở nhẹ
      let elapsed = Math.random() * 10;
      const pulseFn = (delta) => {
        elapsed += delta * 0.04;
        const s = 1.0 + Math.sin(elapsed) * 0.08;
        icon.scale.set(s, s);
      };
      if (this.app?.ticker?.add) {
        this.app.ticker.add(pulseFn);
        this.activeAnimations.push(pulseFn);
      }

      // Xử lý sự kiện Hover
      const onHover = (syncDom = true) => {
        this.hoveredMapId = mapId;
        icon.tint = 0x60a5fa;
        reticle.visible = true;
        reticle.clear();
        reticle.lineStyle(2, dangerInfo.color, 0.9);
        reticle.drawCircle(0, 0, 16);

        // Tọa độ thực tế trên canvas
        const globalPos = markerContainer.toGlobal ? markerContainer.toGlobal(new PIXI.Point(0, 0)) : { x: posX, y: posY };
        this.showTacticalCard(mapData, isExplored, globalPos.x, globalPos.y);

        if (syncDom) {
          this.highlightMatchingOption(mapId);
        }
      };

      const onOut = (syncDom = true) => {
        this.hoveredMapId = null;
        icon.tint = 0xffffff;
        reticle.visible = false;
        this.hideTacticalCard();
        if (syncDom) {
          this.unhighlightMatchingOption();
        }
      };

      markerContainer.on('pointerover', () => onHover(true));
      markerContainer.on('pointerout', () => onOut(true));

      // POI Click Handler
      markerContainer.on('pointerdown', () => {
        if (this.isActionPending) return;
        this.isActionPending = true;

        // Visual click feedback
        icon.scale.set(1.25, 1.25);
        reticle.clear();
        reticle.lineStyle(2.5, 0x22c55e, 1);
        reticle.drawCircle(0, 0, 18);

        // Tìm lại index mới nhất tại thời điểm click
        const currentState = getState();
        const currentOptions = currentState.options || [];
        const targetIndex = currentOptions.findIndex(o => o.map && o.map.id === mapId);

        if (targetIndex !== -1) {
          handleAction(targetIndex + 1);
          renderAll();
        }
        setTimeout(() => { this.isActionPending = false; }, 300);
      });

      this.markerLayer.addChild(markerContainer);
      this.markerMap[mapId] = { container: markerContainer, icon, reticle, onHover, onOut };
    }
  }

  updatePlayerToken(state) {
    let tokenCoord = MAP_COORDINATES.home;

    if (state.currentMap && state.currentMap.id) {
      const c = MAP_COORDINATES[state.currentMap.id];
      if (c) tokenCoord = c;
    } else if (state.location && state.location !== 'Lều Người Sống Sót') {
      const foundMap = MAPS.find(m => m.name === state.location);
      if (foundMap && MAP_COORDINATES[foundMap.id]) {
        tokenCoord = MAP_COORDINATES[foundMap.id];
      }
    }

    const targetX = tokenCoord.tileX * TILE_SIZE + 16;
    const targetY = tokenCoord.tileY * TILE_SIZE + 16;

    // 1. Radar Beacon Ring phát xung quanh vị trí nhân vật
    if (!this.radarRing) {
      this.radarRing = new PIXI.Graphics();
      this.markerLayer.addChild(this.radarRing);
    }
    this.radarRing.x = targetX;
    this.radarRing.y = targetY;

    let radarRadius = 4;
    const radarFn = (delta) => {
      radarRadius += delta * 0.45;
      const alpha = Math.max(0, 1.0 - (radarRadius / 26));
      this.radarRing.clear();
      this.radarRing.lineStyle(1.5, 0x38bdf8, alpha);
      this.radarRing.drawCircle(0, 0, radarRadius);
      if (radarRadius >= 26) {
        radarRadius = 4;
      }
    };
    if (this.app?.ticker?.add) {
      this.app.ticker.add(radarFn);
      this.activeAnimations.push(radarFn);
    }

    // 2. Player Token Sprite
    if (!this.playerTokenSprite) {
      this.playerTokenSprite = new PIXI.Sprite(this.getTexture('marker_player_token_32'));
      this.playerTokenSprite.anchor.set(0.5, 0.5);
      this.playerTokenSprite.eventMode = 'none';
    }

    this.playerTokenSprite.x = targetX;
    this.playerTokenSprite.y = targetY;

    let t = 0;
    const bobFn = (delta) => {
      t += delta * 0.06;
      this.playerTokenSprite.y = targetY + Math.sin(t) * 2.5;
    };
    if (this.app?.ticker?.add) {
      this.app.ticker.add(bobFn);
      this.activeAnimations.push(bobFn);
    }

    this.markerLayer.addChild(this.playerTokenSprite);
  }

  setZoom(level) {
    const validLevels = [1.0, 1.25, 1.5];
    this.zoomLevel = validLevels.includes(level) ? level : 1.0;
    this.applyZoomAndPan();
    return this.zoomLevel;
  }

  cycleZoom() {
    if (this.zoomLevel === 1.0) this.setZoom(1.25);
    else if (this.zoomLevel === 1.25) this.setZoom(1.5);
    else this.setZoom(1.0);
    return this.zoomLevel;
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.drawGrid();
    return this.showGrid;
  }

  recenterToPlayer() {
    this.applyZoomAndPan(true);
  }

  applyZoomAndPan(forcePlayerCenter = false) {
    if (!this.contentContainer) return;
    const zoom = this.zoomLevel || 1.0;
    this.contentContainer.scale.set(zoom, zoom);

    if (zoom <= 1.0) {
      this.contentContainer.x = 0;
      this.contentContainer.y = 0;
      return;
    }

    let focusX = 320;
    let focusY = 160;
    if (this.playerTokenSprite) {
      focusX = this.playerTokenSprite.x;
      focusY = this.playerTokenSprite.y;
    }

    const targetX = 320 - focusX * zoom;
    const targetY = 160 - focusY * zoom;

    const minX = 640 - 640 * zoom;
    const minY = 320 - 320 * zoom;

    this.contentContainer.x = Math.max(minX, Math.min(0, targetX));
    this.contentContainer.y = Math.max(minY, Math.min(0, targetY));
  }

  highlightPOI(mapId) {
    if (this.markerMap[mapId] && this.markerMap[mapId].onHover) {
      this.markerMap[mapId].onHover(false);
    }
  }

  unhighlightPOI(mapId) {
    if (this.markerMap[mapId] && this.markerMap[mapId].onOut) {
      this.markerMap[mapId].onOut(false);
    }
  }

  highlightMatchingOption(mapId) {
    if (typeof document === 'undefined') return;
    const area = document.getElementById('options-area');
    if (!area) return;

    const items = area.querySelectorAll('.option-item');
    items.forEach(el => el.classList.remove('map-hover-highlight'));

    const state = getState();
    const targetIdx = (state.options || []).findIndex(o => o.map && o.map.id === mapId);
    if (targetIdx !== -1) {
      const match = area.querySelector(`.option-item[data-index="${targetIdx + 1}"]`);
      if (match) {
        match.classList.add('map-hover-highlight');
      }
    }
  }

  unhighlightMatchingOption() {
    if (typeof document === 'undefined') return;
    const area = document.getElementById('options-area');
    if (!area) return;
    const items = area.querySelectorAll('.option-item');
    items.forEach(el => el.classList.remove('map-hover-highlight'));
  }

  destroy() {
    this.clearAnimations();
    this.unhighlightMatchingOption();
    this.container.destroy({ children: true });
    this.isLoaded = false;
  }
}
