/**
 * ============================================================
 * Zombie World RPG — Visual Map Prototype (Phase 7.2B)
 * Standalone PixiJS v7 Tileset Renderer & Validator
 * Isolated prototype — Zero gameplay state modification
 * ============================================================
 */

(function() {
  'use strict';

  // Constants & Viewport Configuration
  const VIEWPORT_WIDTH = 640;
  const VIEWPORT_HEIGHT = 320;
  const TILE_SIZE = 32;
  const COLS = 20; // 640 / 32
  const ROWS = 10; // 320 / 32

  // Force Nearest-Neighbor Scaling for crisp pixel-art
  if (window.PIXI) {
    if (PIXI.BaseTexture && PIXI.BaseTexture.defaultOptions) {
      PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
  }

  // POI Data (Mock data representing Zombie World RPG locations)
  const POI_DATA = [
    {
      id: 'lau_dai_tan_the',
      name: 'Lâu đài Tận thế',
      danger: '☆An toàn',
      dangerClass: 'danger-safe',
      tileX: 1,
      tileY: 0,
      width: 4,
      height: 3,
      encounterRate: '0%',
      desc: 'Thành trì Gothic kiên cố bằng đá khổng lồ gia cố tường thép. Ánh đèn chùm vàng ấm áp rực rỡ bên trong, trung tâm quyền lực của thế giới mạt thế.',
      markerType: 'active'
    },
    {
      id: 'benh_vien_ngoai_thanh',
      name: 'Bệnh Viện Ngoại Thành',
      danger: '★★★★Nguy hiểm cao',
      dangerClass: 'danger-high',
      tileX: 10,
      tileY: 1,
      width: 3,
      height: 2,
      encounterRate: '35%',
      desc: 'Bệnh viện tràn ngập mùi thuốc khử trùng và xác thối rữa đan xen. Y tá zombie Lộ Lộ Vy lang thang trong sảnh cấp cứu đổ nát.',
      markerType: 'unexplored'
    },
    {
      id: 'tram_xang_bo_roi',
      name: 'Trạm Xăng Ngoại Thành',
      danger: '★★Nguy hiểm thấp',
      dangerClass: 'danger-low',
      tileX: 5,
      tileY: 3,
      width: 2,
      height: 2,
      encounterRate: '15%',
      desc: 'Trụ bơm rỉ sét, đường ống lão hóa. Nơi người thợ sửa xe Vương Thiết Trụ đang lặng lẽ sửa chữa chiếc xe bán tải cũ.',
      markerType: 'active'
    },
    {
      id: 'thap_canh_bo_roi',
      name: 'Tháp Canh Đỉnh Núi',
      danger: '★Nhẹ nhàng',
      dangerClass: 'danger-low',
      tileX: 0,
      tileY: 4,
      width: 2,
      height: 2,
      encounterRate: '1%',
      desc: 'Tháp canh thép rỉ sét cô đơn trên đỉnh núi lộng gió. Xung quanh rải rác những tấm bia mộ im lặng của người sống sót.',
      markerType: 'unexplored'
    },
    {
      id: 'khu_cong_nghiep',
      name: 'Khu Công Nghiệp / Nhà Xưởng',
      danger: '★★★Trung bình',
      dangerClass: 'danger-med',
      tileX: 2,
      tileY: 7,
      width: 3,
      height: 2,
      encounterRate: '24%',
      desc: 'Nhà kho tôn sóng khổng lồ, cấu kiện dầm thép và container rải rác. Nguồn cung cấp vật liệu cơ khí và phế liệu dồi dào.',
      markerType: 'unexplored'
    },
    {
      id: 'to_zombie',
      name: 'Tổ Zombie (Đám Cú)',
      danger: '★★★★★★Luyện ngục',
      dangerClass: 'danger-high',
      tileX: 16,
      tileY: 7,
      width: 3,
      height: 2,
      encounterRate: '60%',
      desc: 'Vùng biến dị sinh học cực kỳ nguy hiểm. Đất phủ màng nhầy máu khô và bào tử độc, hang ổ của Thi Vương Tịch Diệt.',
      markerType: 'skull'
    }
  ];

  class MapPrototypeApp {
    constructor() {
      this.app = null;
      this.textures = {};
      this.zoomLevel = 1.0;
      this.gridVisible = false;
      this.selectedPOI = null;

      // Layers
      this.worldContainer = null;
      this.terrainContainer = null;
      this.roadContainer = null;
      this.structureContainer = null;
      this.propContainer = null;
      this.markerContainer = null;
      this.gridGraphics = null;
      this.tooltipText = null;

      this.init();
    }

    async init() {
      const mount = document.getElementById('pixi-prototype-mount');
      if (!mount) {
        console.error('Mount point #pixi-prototype-mount not found.');
        return;
      }

      // 1. Initialize Pixi Application
      this.app = new PIXI.Application({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        backgroundColor: 0x0f1015,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      mount.appendChild(this.app.view);

      // 2. Set nearest-neighbor filtering on renderer
      this.app.renderer.textureGC.maxIdle = 3600;

      // 3. Load Texture Atlas
      await this.loadAssets();

      // 4. Build World Layers
      this.setupWorldLayers();

      // 5. Construct Map Scene
      this.buildShowcaseMap();

      // 6. Setup Interactions & UI Controls
      this.setupControls();

      // 7. Update metrics
      this.updateMetrics();
    }

    async loadAssets() {
      const atlasJsonPath = '../../public/assets/maps/atlases/world_map_tileset.json';
      try {
        console.log('[MapPrototype] Loading Texture Atlas:', atlasJsonPath);
        const resource = await PIXI.Assets.load(atlasJsonPath);
        if (resource && resource.textures) {
          this.textures = resource.textures;
          console.log('[MapPrototype] Atlas loaded successfully with', Object.keys(this.textures).length, 'frames.');
          return;
        }
      } catch (err) {
        console.warn('[MapPrototype] Atlas load failed, trying fallback to individual textures:', err.message);
      }

      // Fallback: Load individual tiles
      const tileList = [
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

      for (const id of tileList) {
        let folder = 'terrain';
        if (id.startsWith('road_')) folder = 'roads';
        else if (id.startsWith('prop_')) folder = 'props';
        else if (id.startsWith('bld_')) folder = 'structures';
        else if (id.startsWith('marker_')) folder = 'markers';

        const imgPath = `../../public/assets/maps/tiles/${folder}/${id}.png`;
        try {
          const tex = await PIXI.Assets.load(imgPath);
          if (tex) {
            tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.textures[id] = tex;
          }
        } catch (e) {
          console.warn('Failed to load tile:', imgPath);
        }
      }
    }

    getTexture(id) {
      if (this.textures[id]) return this.textures[id];
      // Procedural fallback colored block
      const g = new PIXI.Graphics();
      g.beginFill(0x3a3f4b);
      g.drawRect(0, 0, 32, 32);
      g.endFill();
      return this.app.renderer.generateTexture(g);
    }

    setupWorldLayers() {
      this.worldContainer = new PIXI.Container();
      this.app.stage.addChild(this.worldContainer);

      this.terrainContainer = new PIXI.Container();
      this.roadContainer = new PIXI.Container();
      this.structureContainer = new PIXI.Container();
      this.propContainer = new PIXI.Container();
      this.markerContainer = new PIXI.Container();

      this.worldContainer.addChild(this.terrainContainer);
      this.worldContainer.addChild(this.roadContainer);
      this.worldContainer.addChild(this.propContainer);
      this.worldContainer.addChild(this.structureContainer);
      this.worldContainer.addChild(this.markerContainer);

      // Grid Overlay (Toggled)
      this.gridGraphics = new PIXI.Graphics();
      this.gridGraphics.visible = false;
      this.worldContainer.addChild(this.gridGraphics);
      this.drawGridOverlay();

      // Tooltip Text
      this.tooltipText = new PIXI.Text('', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 11,
        fontWeight: 'bold',
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3,
        dropShadow: true,
        dropShadowDistance: 1,
      });
      this.tooltipText.visible = false;
      this.app.stage.addChild(this.tooltipText);
    }

    drawGridOverlay() {
      this.gridGraphics.clear();
      this.gridGraphics.lineStyle(1, 0x00ffd2, 0.25);
      for (let x = 0; x <= VIEWPORT_WIDTH; x += TILE_SIZE) {
        this.gridGraphics.moveTo(x, 0);
        this.gridGraphics.lineTo(x, VIEWPORT_HEIGHT);
      }
      for (let y = 0; y <= VIEWPORT_HEIGHT; y += TILE_SIZE) {
        this.gridGraphics.moveTo(0, y);
        this.gridGraphics.lineTo(VIEWPORT_WIDTH, y);
      }
    }

    buildShowcaseMap() {
      // 1. Terrain Grid (20 cols x 10 rows)
      for (let ty = 0; ty < ROWS; ty++) {
        for (let tx = 0; tx < COLS; tx++) {
          let texKey = 'terrain_grass_dead_32';
          if (tx >= 11 && ty < 6) texKey = 'terrain_dirt_wasteland_32';
          if (tx >= 16 && ty < 5) texKey = 'terrain_water_toxic_32';
          if (tx >= 13 && ty >= 6) texKey = 'terrain_bio_blight_32';
          if (tx < 3 && ty < 4) texKey = 'terrain_rock_cliff_32';

          const tile = new PIXI.Sprite(this.getTexture(texKey));
          tile.x = tx * TILE_SIZE;
          tile.y = ty * TILE_SIZE;
          this.terrainContainer.addChild(tile);
        }
      }

      // 2. Connected Road Network
      // Horizontal highway along row 5 (y = 160)
      for (let tx = 0; tx < COLS; tx++) {
        let roadKey = 'road_asphalt_h_32';
        if (tx === 8) roadKey = 'road_crossroads_32';
        else if (tx === 14) roadKey = 'road_t_junction_32';
        else if (tx === 4) roadKey = 'road_broken_cracked_32';

        const r = new PIXI.Sprite(this.getTexture(roadKey));
        r.x = tx * TILE_SIZE;
        r.y = 5 * TILE_SIZE;
        this.roadContainer.addChild(r);
      }

      // Vertical highway crossing at col 8
      for (let ty = 0; ty < ROWS; ty++) {
        if (ty !== 5) {
          const r = new PIXI.Sprite(this.getTexture('road_asphalt_v_32'));
          r.x = 8 * TILE_SIZE;
          r.y = ty * TILE_SIZE;
          this.roadContainer.addChild(r);
        }
      }

      // South branch at col 14
      for (let ty = 6; ty < ROWS; ty++) {
        const r = new PIXI.Sprite(this.getTexture('road_asphalt_v_32'));
        r.x = 14 * TILE_SIZE;
        r.y = ty * TILE_SIZE;
        this.roadContainer.addChild(r);
      }

      // 3. Multi-tile Structures (Native pixel sizes)
      const structures = [
        { id: 'bld_castle_fortress_128', x: 4, y: 4 },
        { id: 'bld_hospital_ruined_96', x: 10 * TILE_SIZE, y: 1 * TILE_SIZE },
        { id: 'bld_gas_station_64', x: 5 * TILE_SIZE, y: 3 * TILE_SIZE - 10 },
        { id: 'bld_industrial_warehouse_96', x: 2 * TILE_SIZE, y: 7 * TILE_SIZE - 8 },
        { id: 'bld_watchtower_fortified_64', x: 8, y: 4 * TILE_SIZE },
        { id: 'bld_abandoned_house_64', x: 10 * TILE_SIZE, y: 7 * TILE_SIZE },
      ];

      for (const s of structures) {
        const bld = new PIXI.Sprite(this.getTexture(s.id));
        bld.x = s.x;
        bld.y = s.y;
        this.structureContainer.addChild(bld);
      }

      // 4. Environmental Props
      const props = [
        { id: 'prop_vehicle_wreck_small_32', x: 6 * TILE_SIZE + 10, y: 5 * TILE_SIZE },
        { id: 'prop_barricade_sandbag_32', x: 8 * TILE_SIZE - 14, y: 4 * TILE_SIZE + 16 },
        { id: 'prop_fence_barbed_wire_32', x: 8 * TILE_SIZE + 16, y: 4 * TILE_SIZE + 16 },
        { id: 'prop_oil_drum_rust_32', x: 7 * TILE_SIZE, y: 2 * TILE_SIZE },
        { id: 'prop_boulder_rock_32', x: 4 * TILE_SIZE, y: 1 * TILE_SIZE },
        { id: 'prop_dead_bush_32', x: 11 * TILE_SIZE, y: 4 * TILE_SIZE },
        { id: 'prop_rubble_debris_32', x: 9 * TILE_SIZE + 10, y: 3 * TILE_SIZE },
      ];

      for (const p of props) {
        const spr = new PIXI.Sprite(this.getTexture(p.id));
        spr.x = p.x;
        spr.y = p.y;
        this.propContainer.addChild(spr);
      }

      // 5. POI Markers & Interactive Nodes
      for (const poi of POI_DATA) {
        const markerSprite = this.createInteractivePOI(poi);
        this.markerContainer.addChild(markerSprite);
      }

      // 6. Player Token with Animated Bobbing
      this.createPlayerToken(6 * TILE_SIZE - 6, 4 * TILE_SIZE - 8);
    }

    createInteractivePOI(poi) {
      const container = new PIXI.Container();
      container.x = poi.tileX * TILE_SIZE + (poi.width * TILE_SIZE) / 2;
      container.y = poi.tileY * TILE_SIZE + 10;
      container.eventMode = 'static';
      container.cursor = 'pointer';

      let texKey = 'marker_poi_unexplored_32';
      if (poi.markerType === 'active') texKey = 'marker_poi_active_32';
      else if (poi.markerType === 'skull') texKey = 'marker_danger_skull_32';

      const icon = new PIXI.Sprite(this.getTexture(texKey));
      icon.anchor.set(0.5, 0.5);
      container.addChild(icon);

      // Pulse animation effect
      let elapsed = Math.random() * 10;
      this.app.ticker.add((delta) => {
        elapsed += delta * 0.05;
        const scale = 1.0 + Math.sin(elapsed) * 0.08;
        icon.scale.set(scale, scale);
      });

      // Hover Interaction
      container.on('pointerover', (e) => {
        icon.tint = 0x60a5fa;
        this.tooltipText.text = `${poi.name} [${poi.danger}]`;
        this.tooltipText.x = Math.min(container.x - 30, VIEWPORT_WIDTH - 140);
        this.tooltipText.y = container.y - 25;
        this.tooltipText.visible = true;
      });

      container.on('pointerout', () => {
        icon.tint = 0xffffff;
        this.tooltipText.visible = false;
      });

      // Click Interaction
      container.on('pointerdown', () => {
        this.selectPOI(poi);
      });

      return container;
    }

    createPlayerToken(x, y) {
      const token = new PIXI.Sprite(this.getTexture('marker_player_token_32'));
      token.x = x;
      token.y = y;
      token.anchor.set(0.5, 0.5);
      token.eventMode = 'static';
      token.cursor = 'pointer';

      let t = 0;
      this.app.ticker.add((delta) => {
        t += delta * 0.06;
        token.y = y + Math.sin(t) * 2;
      });

      token.on('pointerdown', () => {
        this.showPlayerInspector();
      });

      this.markerContainer.addChild(token);
    }

    selectPOI(poi) {
      this.selectedPOI = poi;
      const detailsEl = document.getElementById('poi-details');
      if (!detailsEl) return;

      detailsEl.className = 'poi-detail-box';
      detailsEl.innerHTML = `
        <div class="poi-name-header">
          <span class="poi-title">${poi.name}</span>
          <span class="poi-danger-badge ${poi.dangerClass}">${poi.danger}</span>
        </div>
        <p class="poi-desc">${poi.desc}</p>
        <div class="poi-grid-meta">
          <div class="poi-meta-item"><span class="poi-meta-label">Tọa độ:</span> <span class="poi-meta-val">[${poi.tileX}, ${poi.tileY}]</span></div>
          <div class="poi-meta-item"><span class="poi-meta-label">Kích thước:</span> <span class="poi-meta-val">${poi.width} × ${poi.height} tiles</span></div>
          <div class="poi-meta-item"><span class="poi-meta-label">Tỷ lệ Zombie:</span> <span class="poi-meta-val text-warn">${poi.encounterRate}</span></div>
          <div class="poi-meta-item"><span class="poi-meta-label">Mã ID:</span> <span class="poi-meta-val">${poi.id}</span></div>
        </div>
      `;
    }

    showPlayerInspector() {
      const detailsEl = document.getElementById('poi-details');
      if (!detailsEl) return;

      detailsEl.className = 'poi-detail-box';
      detailsEl.innerHTML = `
        <div class="poi-name-header">
          <span class="poi-title">👤 Người Sống Sót (Token)</span>
          <span class="poi-danger-badge danger-safe">Đang dừng chân</span>
        </div>
        <p class="poi-desc">Vị trí hiện tại của nhân vật trên bản đồ phế thổ. Trụ lại tại Trạm Xăng Ngoại Thành để nghỉ ngơi và tiếp tế nhiên liệu.</p>
        <div class="poi-grid-meta">
          <div class="poi-meta-item"><span class="poi-meta-label">Vị trí:</span> <span class="poi-meta-val">Trạm Xăng</span></div>
          <div class="poi-meta-item"><span class="poi-meta-label">Tọa độ Grid:</span> <span class="poi-meta-val">[col 5, row 3]</span></div>
        </div>
      `;
    }

    setupControls() {
      const btnZoomIn = document.getElementById('btn-zoom-in');
      const btnZoomOut = document.getElementById('btn-zoom-out');
      const btnZoomReset = document.getElementById('btn-zoom-reset');
      const btnToggleGrid = document.getElementById('btn-toggle-grid');

      if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
          this.setZoom(Math.min(this.zoomLevel + 0.25, 2.0));
        });
      }

      if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
          this.setZoom(Math.max(this.zoomLevel - 0.25, 0.75));
        });
      }

      if (btnZoomReset) {
        btnZoomReset.addEventListener('click', () => {
          this.setZoom(1.0);
        });
      }

      if (btnToggleGrid) {
        btnToggleGrid.addEventListener('click', () => {
          this.gridVisible = !this.gridVisible;
          this.gridGraphics.visible = this.gridVisible;
          btnToggleGrid.style.borderColor = this.gridVisible ? '#00ffd2' : '#3f475c';
        });
      }
    }

    setZoom(lvl) {
      this.zoomLevel = lvl;
      this.worldContainer.scale.set(lvl, lvl);
      // Center world
      this.worldContainer.x = (VIEWPORT_WIDTH - VIEWPORT_WIDTH * lvl) / 2;
      this.worldContainer.y = (VIEWPORT_HEIGHT - VIEWPORT_HEIGHT * lvl) / 2;
      const resetBtn = document.getElementById('btn-zoom-reset');
      if (resetBtn) resetBtn.textContent = `${Math.round(lvl * 100)}%`;
    }

    updateMetrics() {
      // Calculate total sprites rendered
      let total = 0;
      total += this.terrainContainer.children.length;
      total += this.roadContainer.children.length;
      total += this.structureContainer.children.length;
      total += this.propContainer.children.length;
      total += this.markerContainer.children.length;

      const countEl = document.getElementById('metric-sprite-count');
      if (countEl) countEl.textContent = `${total} sprites`;
    }
  }

  // Auto-boot when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    new MapPrototypeApp();
  });
})();

