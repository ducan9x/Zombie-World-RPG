import fs from 'fs';
import path from 'path';

const COMMON_NEGATIVE = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bright saturated cartoon, anime kawaii, cheerful, colorful, futuristic sci-fi, neon cyberpunk";

const ICON_NEGATIVE = COMMON_NEGATIVE + ", background, complex backdrop, scene, full body";

const PORTRAIT_NEGATIVE = COMMON_NEGATIVE + ", full body, feet, background scenery, multiple people";

const BG_NEGATIVE = COMMON_NEGATIVE + ", characters, humans, people, closeup, portrait, text labels";

// Build manifest list
const assets = [];

// Helper
function addAsset(data) {
  assets.push({
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    prompt: data.prompt,
    negativePrompt: data.negativePrompt || (data.category === 'icons' ? ICON_NEGATIVE : data.category === 'backgrounds' ? BG_NEGATIVE : COMMON_NEGATIVE),
    file: data.file,
    width: data.width,
    height: data.height,
    aspectRatio: data.aspectRatio,
    format: data.format,
    transparent: data.transparent,
    priority: data.priority,
    status: data.status || "pending",
    usedBy: data.usedBy,
    fallback: data.fallback !== undefined ? data.fallback : true,
    notes: data.notes || ""
  });
}

// -------------------------------------------------------------
// 1. EXISTING ASSETS (2)
// -------------------------------------------------------------
addAsset({
  id: "ui_app_icon",
  name: "Zombie World App Icon",
  category: "ui",
  description: "Biểu tượng ứng dụng và Favicon đại diện cho tựa game Zombie World RPG.",
  prompt: "Tactical post-apocalyptic survival RPG game application icon, stylized biohazard hazard emblem with metallic distressing and dark red accents, dark slate background, crisp vector-like edges.",
  negativePrompt: COMMON_NEGATIVE,
  file: "public/icon/icon.png",
  width: 400,
  height: 400,
  aspectRatio: "1:1",
  format: "png",
  transparent: true,
  priority: "P0",
  status: "existing",
  usedBy: ["index.html"],
  fallback: false,
  notes: "Asset hiện có sẵn trong codebase, dùng làm favicon và touch icon."
});

addAsset({
  id: "ui_bg_fallback",
  name: "Global Fallback Background",
  category: "backgrounds",
  description: "Hình nền tổng quan phế thổ hoang tàn dùng làm nền mặc định CSS và fallback renderer.",
  prompt: "Cinematic wide angle landscape of a desolate post-apocalyptic ruined city outskirts at dusk, crumbling skyscrapers, overgrown ruined highway, thick moody atmospheric fog, dark survival RPG concept art.",
  negativePrompt: BG_NEGATIVE,
  file: "public/image/hinh_nen.webp",
  width: 2732,
  height: 1534,
  aspectRatio: "16:9",
  format: "webp",
  transparent: false,
  priority: "P0",
  status: "existing",
  usedBy: ["style.css", "PixiRenderer"],
  fallback: false,
  notes: "Asset hiện có sẵn trong codebase, dùng làm CSS body background và fallback toàn cục."
});

// -------------------------------------------------------------
// 2. CORE UI (4)
// -------------------------------------------------------------
addAsset({
  id: "ui_main_menu_bg",
  name: "Main Menu & Title Background",
  category: "backgrounds",
  description: "Hình nền menu chính và màn hình khởi tạo người chơi, bối cảnh cổng căn cứ phế thổ lúc hoàng hôn.",
  prompt: "Cinematic wide view of a post-apocalyptic survivor outpost entrance gate at dusk, heavily reinforced with rusty corrugated steel, concrete blast barriers, and razor wire, dim flickering searchlight piercing through thick toxic atmospheric haze, ruined city skyline in distant silhouette, dark survival horror video game aesthetic, photorealistic digital painting, no humans, no text --ar 16:9",
  file: "public/assets/backgrounds/ui_main_menu_bg.webp",
  width: 1920,
  height: 1080,
  aspectRatio: "16:9",
  format: "webp",
  transparent: false,
  priority: "P0",
  usedBy: ["NameSetup", "UI"],
  notes: "Sử dụng cho màn hình khởi động game (#name-setup) và menu chính."
});

addAsset({
  id: "ui_game_logo",
  name: "Game Logo Title",
  category: "ui",
  description: "Logo tiêu đề tựa game 'THẾ GIỚI ZOMBIE' dập kim loại rỉ sét kèm vết cào xước đẫm máu.",
  prompt: "Grim metallic title emblem logo with weathered dark steel, bloody claw scratch marks, warning hazard diagonal stripes, post-apocalyptic zombie survival RPG style, clean silhouette on transparent background, typography graphic asset --ar 2:1",
  file: "public/assets/ui/ui_game_logo.png",
  width: 1024,
  height: 512,
  aspectRatio: "2:1",
  format: "png",
  transparent: true,
  priority: "P0",
  usedBy: ["Header", "UI"],
  notes: "Hiển thị tại header chính của trang game."
});

addAsset({
  id: "ui_panel_frame",
  name: "9-Slice Metal Panel Frame",
  category: "ui",
  description: "Khung viền 9-slice kim loại hậu tận thế cho panel thông tin, viền đinh tán và vết xước kim loại.",
  prompt: "Modular 9-slice game UI frame border panel, industrial rusted dark steel texture, riveted bolt corners, grungy tactile metallic surface, survival RPG HUD element, isolated transparent interior and background --ar 1:1",
  file: "public/assets/ui/ui_panel_frame.png",
  width: 512,
  height: 512,
  aspectRatio: "1:1",
  format: "png",
  transparent: true,
  priority: "P1",
  usedBy: ["UI", "PixiRenderer"],
  notes: "Dùng làm viền cho các panel thống kê và bảng thông tin."
});

addAsset({
  id: "ui_button_action",
  name: "Action Button Plate",
  category: "ui",
  description: "Nút bấm hành động kim loại có viền sơn sọc vàng đen cảnh báo nguy hiểm mạt thế.",
  prompt: "Tactical post-apocalyptic UI button plate, dark gunmetal surface, hazard caution yellow-black diagonal striped border, slightly scuffed and worn, glowing amber indicator light, isolated on transparent background --ar 4:1",
  file: "public/assets/ui/ui_button_action.png",
  width: 512,
  height: 128,
  aspectRatio: "4:1",
  format: "png",
  transparent: true,
  priority: "P1",
  usedBy: ["UI"],
  notes: "Sử dụng làm skin cho các nút bấm lựa chọn trong Zone 3."
});

// -------------------------------------------------------------
// 3. ICONS (20)
// -------------------------------------------------------------
const ICONS_DATA = [
  { id: "ui_icon_hp", name: "HP Vitality Icon", desc: "Trái tim sinh học bọc khung thép cơ khí phát sáng đỏ thẫm.", prompt: "Isolated tactical RPG game icon of a stylized biological human heart enclosed in heavy dark steel mechanical cage, glowing deep crimson red veins, metallic rust and bolts, dark survival horror theme, clean silhouette, sharp crisp edges, transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_sanity", name: "Sanity Mental Icon", desc: "Bộ não người phát sáng xanh lam huỳnh quang biểu thị tinh thần tỉnh táo.", prompt: "Isolated game icon of a stylized human brain glowing with ethereal cyan blue neural synapses, faint holographic psychic energy waves, dark steel cybernetic base, post-apocalyptic mental health indicator, transparent background, clean icon silhouette --ar 1:1", p: "P0" },
  { id: "ui_icon_crash", name: "Mental Crash Icon", desc: "Bộ não nứt toác với tia chớp đỏ hoảng loạn biểu thị sự sụp đổ tâm lý.", prompt: "Tactical game UI icon of a fractured shattered human brain with jagged red lightning fissures, warning alert distress indicator, mental collapse status, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "ui_icon_hunger", name: "Hunger Satiety Icon", desc: "Miếng thịt đùi nướng sinh tồn trên lửa trại mạt thế biểu thị độ no.", prompt: "Survival RPG inventory icon of a roasted meat haunch on bone, golden brown charred edges, sizzling campfire aroma embers, stylized tactical game icon, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_hydration", name: "Hydration Water Icon", desc: "Giọt nước trong vắt phản chiếu ánh sáng xanh dịu biểu thị độ khát.", prompt: "Game UI icon of a pure crystal water droplet glowing with pristine aqua blue reflection, clean survival fluid indicator, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_infection", name: "Infection Biohazard Icon", desc: "Biểu tượng cảnh báo sinh học kim loại nhỏ giọt dịch nhầy xanh lục đột biến.", prompt: "Game UI icon of a corroded biohazard symbol encrusted with radioactive toxic green slime droplets, glowing bioluminescent mutation particles, worn metallic texture, dark zombie apocalypse tone, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_power", name: "Combat Power Icon", desc: "Cánh tay cơ bắp bọc giáp thép biểu thị tổng lực chiến.", prompt: "Tactical game icon of an armored muscular cybernetic arm flexing, dark weathered plate metal, orange power conduit glow, strength stat indicator, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "ui_icon_defense", name: "Defense Shield Icon", desc: "Khiên cảnh sát chống bạo động bọc thép có vết đạn và vết cào.", prompt: "Tactical RPG icon of a heavy riot police ballistic shield, reinforced steel and rivets, battle scars and bullet dents, defense stat indicator, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "ui_icon_res_cigarette", name: "Cigarette Resource Icon", desc: "Bao thuốc lá mạt thế và điếu thuốc đang cháy khói nghi ngút.", prompt: "Post-apocalyptic wasteland currency icon, vintage crumpled pack of cigarettes with a single lit cigarette emitting wisps of smoke, gritty survival trade item, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_res_royal_coin", name: "Royal Gold Coin Icon", desc: "Đồng tiền vàng đúc hoa văn vương miện lâu đài Quốc vương Karen.", prompt: "RPG inventory icon of an antique solid gold royal coin, engraved with a detailed gothic crown emblem, sharp embossed edge, weathered micro-scratches on polished gold surface, gleaming reflections, feudal castle currency, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_res_gasoline", name: "Gasoline Canister Icon", desc: "Can xăng quân đội màu đỏ sắt có vòi rót.", prompt: "Tactical survival game icon of a red stamped metal jerrycan gasoline fuel canister, weathered paint chipping, fuel hazard markings, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_res_wood", name: "Wood Material Icon", desc: "Bó khúc gỗ rừng khô được buộc dây thừng chắc chắn.", prompt: "Survival crafting icon of a bundle of dry timber wood logs tied with rough hemp rope, clean game resource asset, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "ui_icon_res_stone", name: "Stone Material Icon", desc: "Đống đá tảng xây dựng xám sắc cạnh.", prompt: "Survival crafting icon of a pile of raw cut granite stones and quarry rock chunks, building material resource icon, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "ui_icon_res_scrap_metal", name: "Scrap Metal Icon", desc: "Các tấm kim loại phế liệu, bánh răng và bu lông cũ.", prompt: "Tactical game icon of twisted scrap metal sheets, rusty cog gears, and industrial iron bolts, crafting salvage resource, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "ui_icon_res_parts", name: "Tech Parts Icon", desc: "Bo mạch điện tử và vi mạch phát sáng xanh lục công nghệ cao.", prompt: "Sci-fi tactical icon of high-tech electronic microchips and exposed circuit board components, glowing neon green conduits, advanced tech crafting resource, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "ui_icon_backpack", name: "Backpack Inventory Icon", desc: "Balo dã ngoại quân sự màu xanh rêu nhiều ngăn.", prompt: "Tactical RPG icon of an olive-drab military rucksack backpack, multiple pouches, nylon straps and metal buckles, inventory capacity indicator, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_cargo", name: "Cargo Trunk Icon", desc: "Thùng hàng gỗ gia cố thép chứa đồ đạc căn cứ.", prompt: "Game UI icon of a heavy reinforced storage crate trunk, dark wood and steel corner brackets, base storage capacity indicator, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "ui_icon_melee_slot", name: "Melee Weapon Slot Icon", desc: "Biểu tượng hai thanh đao bắt chéo cho ô trang bị cận chiến.", prompt: "Game UI equipment slot icon of two crossed tactical combat machete blades, dark steel silhouette, sharp edge highlights, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_icon_ranged_slot", name: "Ranged Weapon Slot Icon", desc: "Biểu tượng khẩu súng trường ngắm bắn cho ô tầm xa.", prompt: "Game UI equipment slot icon of a sleek assault rifle silhouette with tactical holographic sight, dark steel icon, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "ui_placeholder_empty", name: "Empty Slot Placeholder", desc: "Khung ô vuông kim loại trống rỉ sét có dấu gạch chéo mờ dự phòng.", prompt: "Tactical game UI empty item slot border, square dark rusted steel frame with faint subtle crosshair grid line, crisp clean frame, transparent center and background --ar 1:1", p: "P0" }
];

ICONS_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "icons",
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/icons/${item.id}.png`,
    width: 256,
    height: 256,
    aspectRatio: "1:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: ["UI", "PixiRenderer"],
    notes: `Icon chuẩn hóa thay thế emoji trong UI/Canvas (${item.id}).`
  });
});

// -------------------------------------------------------------
// 4. MAP & COMBAT BACKGROUNDS (27)
// -------------------------------------------------------------
const MAPS_DATA = [
  { id: "map_lau_dai_tan_the_bg", name: "Castle Karen Background", desc: "Lâu đài Tận thế: Thành trì gothic bằng đá khổng lồ gia cố tường thép kiên cố, ánh đèn chùm vàng ấm áp rực rỡ bên trong.", prompt: "Epic wide exterior shot of an imposing gothic stone fortress castle standing tall amidst post-apocalyptic wasteland, reinforced with modern steel blast plates, barbed wire, and sniper watchtowers, warm golden chandelier lights glowing brightly from arched stained-glass windows, dark cloudy twilight stormy sky, cinematic survival horror RPG environmental art, 8k concept art, no text, no watermark --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_tran_dia_binh_minh_bg", name: "Dawn Outpost Background", desc: "Trận địa Đợi Sáng: Doanh trại quân sự tiền đồn kiên cố, bao cát công sự, tháp canh gác rọi đèn pha, xe bọc thép tuần tra.", prompt: "Grim fortified military outpost compound at night, high concrete sandbag barricades, tall floodlight watchtowers casting sharp conical light beams into surrounding misty darkness, military tents, barbed wire perimeter, dark survival atmosphere, photorealistic matte painting --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_thap_canh_bo_roi_bg", name: "Mountain Lookout Background", desc: "Tháp Canh Đỉnh Núi Hoang Vắng: Tháp quan sát bằng thép rỉ sét trên mỏm núi đá cao chót vót, gió thổi mây mù bao phủ hoang mạc.", prompt: "Rusting metal fire watchtower standing precariously on an isolated jagged rocky mountain summit, howling wind, dense overcast gloom, sweeping view of decimated post-apocalyptic valleys far below, dramatic lonely atmosphere, 8k digital painting --ar 16:9", p: "P2", used: ["MapScene", "PixiRenderer"] },
  { id: "map_nha_kho_nong_thon_bg", name: "Rural Barn Background", desc: "Nhà Kho Nông Thôn Hoang Hoắc: Kho thóc gỗ mục nát giữa cánh đồng cỏ khô cháy, máy kéo rỉ sét phủ bụi thời gian.", prompt: "Decaying weathered wooden farm barn in dead overgrown countryside, cracked collapsed roof beams, abandoned rusted tractor, dry withered cornfields under an ominous gray sky, eerie stillness, atmospheric survival scenery --ar 16:9", p: "P2", used: ["MapScene", "PixiRenderer"] },
  { id: "map_lang_nong_trai_nui_bg", name: "Mountain Farm Village Background", desc: "Làng Nông Trại Chân Núi: Ngôi làng nông nghiệp nhỏ nép mình dưới chân vách đá sụp đổ, nhà cửa bỏ hoang, cỏ dại um tùm.", prompt: "Abandoned rural farming hamlet nestled under towering eroded mountain cliffs, dilapidated rustic stone cottages, broken wooden fences, wild encroaching vegetation, desolate quiet afternoon light, cinematic concept art --ar 16:9", p: "P2", used: ["MapScene", "PixiRenderer"] },
  { id: "map_cam_trai_ben_song_bg", name: "Riverside Campsite Background", desc: "Khu Cắm Trại Bên Sông: Lều trại rách nát bên bờ sông đục ngầu, tàn tích bếp lửa đã tắt lịm, thuyền câu thủng đáy.", prompt: "Tattered expedition campsite along the muddy banks of a dark sluggish river, shredded nylon tents fluttering in cold damp breeze, dead campfire ashes, overturned wooden rowboat, gloomy misty riverbank, survival horror environment --ar 16:9", p: "P2", used: ["MapScene", "PixiRenderer"] },
  { id: "map_khu_dich_vu_cao_toc_bg", name: "Highway Rest Stop Background", desc: "Khu Dịch Vụ Cao Tốc Quốc Lộ: Trạm dừng chân cao tốc đổ nát, hàng chục xe hơi dồn toa cháy đen, biển hiệu rơi rụng.", prompt: "Derelict interstate highway rest stop plaza, shattered glass facade, overturned burned-out vehicle pileup on cracked asphalt highway, broken neon restaurant sign hanging loose, overgrown weeds, hazy desolate afternoon --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_thanh_pho_dai_hoc_bg", name: "University Campus Background", desc: "Thành Phố Đại Học: Khuôn viên trường đại học đổ nát, sách vở vương vãi, vết máu khô trên cột đá, hội trường bỏ hoang.", prompt: "Ruined modern university campus quad, classical stone columns stained with soot and old dried blood splatters, scattered library books and debris across overgrown courtyard, broken lecture hall windows, haunting post-apocalyptic silence --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_tram_xang_bo_roi_bg", name: "Abandoned Gas Station Background", desc: "Trạm Xăng Ngoại Thành Hoang Hoắc: Cột bơm xăng gỉ sét, mái che sập một góc, cửa hàng tiện lợi vỡ toang cửa kính.", prompt: "Abandoned rural highway petrol gas station, collapsed metal canopy hanging at an angle, rusted vintage fuel pumps with severed rubber hoses, smashed convenience store front, desert wasteland dust devil, atmospheric cinematic lighting --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_trung_tam_thuong_mai_bg", name: "Ruined Shopping Mall Background", desc: "Trung Tâm Thương Mại: Tòa thương xá mái kính vỡ toang, thang cuốn kẹt cứng bụi bặm, các gian hàng bị cướp phá tan hoang.", prompt: "Interior view of an enormous derelict multi-story shopping mall atrium, shattered glass skylight letting in pale diffuse sunbeams, stopped escalators littered with trash, ransacked luxury storefronts, post-apocalyptic eerie stillness --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_khu_dan_cu_cu_bg", name: "Old Residential District Background", desc: "Khu Dân Cư Cũ: Khu tập thể chung cư cũ nứt toác, dây phơi quần áo rách rưới, ô cửa sổ tối đen đầy nguy hiểm rình rập.", prompt: "Dilapidated concrete apartment block neighborhood, cracked stucco facades, hanging rusty fire escapes, broken tattered laundry lines, dark hollow window frames like empty eye sockets, gritty realistic urban decay --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_khu_cong_nghiep_bg", name: "Industrial Zone Background", desc: "Khu Công Nghiệp / Nhà Xưởng: Khu công nghiệp nặng, ống khói khổng lồ gãy gập, đường ống khí rò rỉ rỉ sét, cần cẩu đổ sụp.", prompt: "Heavy industrial manufacturing plant ruins, twisted iron girders, broken smokestacks billowing faint sickly sulfur vapor, massive rusted pipelines and storage tanks, bleak overcast skies, gritty steampunk-apocalyptic art --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_cang_ben_song_bg", name: "River Harbor Background", desc: "Cảng Bên Sông: Bến cảng sông nước đục, cần cẩu bốc dỡ rỉ sét vươn lên trời, sà lan chìm một nửa dập dềnh.", prompt: "Abandoned river port shipping terminal, gigantic rusting dockyard cranes silhouetted against twilight sky, half-submerged cargo barges in murky dark river water, scattered shipping containers, gritty harbor atmosphere --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_sieu_thi_kho_bg", name: "Wholesale Supermarket Warehouse Background", desc: "Siêu Thị Kho Tối Đại: Nhà kho bán sỉ khổng lồ với các dãy kệ hàng thép cao chót vót nhưng trống trơn sau thảm họa.", prompt: "Cavernous warehouse wholesale supermarket interior, towering industrial steel racking shelving empty and stripped clean, abandoned forklifts in wide aisles, cracked concrete floor under flickering overhead lamps, post-apocalyptic salvage setting --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_nha_kho_nha_may_bg", name: "Factory Warehouse Background", desc: "Nhà Kho Nhà Máy Hoang Hoắc: Kho chứa máy móc và linh kiện cơ khí tối tăm, ánh trăng chiếu qua kẽ hở tôn lợp.", prompt: "Dark derelict factory machine depot warehouse, moonlight beams filtering through holes in corrugated metal roof, heavy industrial lathe machines and engine blocks covered in dust, deep moody shadows --ar 16:9", p: "P2", used: ["MapScene", "PixiRenderer"] },
  { id: "map_benh_vien_ngoai_thanh_bg", name: "Abandoned Hospital Background", desc: "Bệnh Viện Ngoại Thành: Hành lang bệnh viện u ám, xe lăn lật đổ, vết máu kéo dài, đèn huỳnh quang nhấp nháy ghê rợn.", prompt: "First-person perspective of an abandoned hospital interior corridor, cracked green paint on peeling walls, overturned rusty wheelchair, scattered medical supply boxes on dirty tiled floor, ominous dried blood trails leading into dark patient rooms, single flickering fluorescent ceiling light casting long eerie shadows, survival horror atmosphere --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_canh_sat_bo_roi_bg", name: "Abandoned Police Station Background", desc: "Cảnh Sát Hoang Hoắc: Sảnh đồn cảnh sát có hàng rào kẽm gai dã chiến, quầy tiếp dân thủng lỗ đạn, tủ súng bị phá tung.", prompt: "Fortified suburban police precinct lobby, sandbag barriers and razor wire erected indoors, bullet-shattered glass reception counter, kicked-in armory door, police cruiser lights outside casting faint red-blue reflection through windows, dark gritty tension --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_tram_kiem_tra_quan_du_bg", name: "Military Checkpoint Background", desc: "Trạm Kiểm Tra Quân Sự: Trạm kiểm soát bọc thép, rào cản xe tăng, xe bọc thép Humvee rỉ sét bên đường cao tốc.", prompt: "Heavily fortified highway military quarantine checkpoint, concrete jersey barriers, rusty razor wire coils, abandoned armored military humvees with flat tires, military biohazard warning signs, stormy dusk atmosphere --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_ham_tau_dien_ngam_bg", name: "Subway Tunnel Background", desc: "Đường Hầm Địa Ngục: Ga tàu điện ngầm ngập nước đen ngòm, toa tàu trật bánh chìm trong bóng tối dày đặc.", prompt: "Flooded subterranean metro subway tunnel station, pitch-black water reflecting faint emergency amber beacon, derailed passenger train car smashed against tiled station wall, claustrophobic dark survival horror environment --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  { id: "map_vien_sinh_hoc_bg", name: "Bio-Research Institute Background", desc: "Viện Nghiên Cứu Sinh Học: Phòng thí nghiệm kính vỡ, bể nuôi cấy mẫu vật sinh học phát ánh sáng lục ma quái trong bóng tối.", prompt: "High-tech biological research laboratory in catastrophic ruin, shattered containment glass chambers, glowing eerie bioluminescent emerald green chemical goo pooling on floor, broken microscopes and overturned centrifuges, chilling sci-fi horror mood --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_to_zombie_bg", name: "Zombie Hive Lair Background", desc: "Đám Cú Zombie (Tổ Zombie): Hang động sâu dưới lòng đất phủ đầy chất nhầy hữu cơ đen và các bọc kén đỏ thẫm phát sáng.", prompt: "Horrific underground zombie hive lair interior, rocky cavern walls covered in pulsating dark organic bioluminescent biomass and deep red fleshy pods, scattered human skeletons, eerie dim sickly green vapor mist rising from subterranean crevasses, nightmarish boss arena environment --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer", "Combat"] },
  { id: "map_co_so_vu_tru_tuyet_mat_bg", name: "Secret Rocket Facility Background", desc: "Cơ Sở Vũ Trụ Tuyệt Mật: Bệ phóng tên lửa khổng lồ giữa sa mạc phế tích, tên lửa bạc uy nghi giữa giàn giáo kỹ thuật.", prompt: "Massive space launch center complex in a desolate desert wasteland, colossal weathered silver orbital rocket poised on heavy launch pad surrounded by steel scaffolding towers, thick industrial hanging cables, overcast brooding sky with orange sunset light breaking through stormy clouds, solemn epic tone --ar 16:9", p: "P0", used: ["MapScene", "PixiRenderer"] },
  { id: "map_dao_nho_bg", name: "Isolate Royal Island Background", desc: "Đảo Nhỏ (Đảo Hoàng Gia): Hòn đảo biệt lập trên biển sương mù, bến tàu đá cổ kính, khu phố mua sắm ngầm và quán bar đèn neon mờ ảo.", prompt: "Remote rocky island harbor shrouded in ocean sea fog at dusk, weathered stone pier with glowing maritime lanterns, dim neon bar signs reflecting on wet cobblestone alleyways, secluded mysterious sanctuary outpost, cinematic mood --ar 16:9", p: "P1", used: ["MapScene", "PixiRenderer"] },
  // Combat Arenas
  { id: "combat_bg_city", name: "City Street Combat Arena", desc: "Đấu trường chiến đấu ngã tư đường phố đổ nát, xác xe ô tô bốc khói, mặt đường nứt toác.", prompt: "Post-apocalyptic city street intersection combat arena, cracked pavement, burning car wreckage with black smoke plumes, shattered storefronts, cinematic low angle, moody atmospheric lighting for turn-based battle scene --ar 16:9", p: "P0", used: ["Combat", "PixiRenderer"] },
  { id: "combat_bg_interior", name: "Indoor Ruins Combat Arena", desc: "Đấu trường chiến đấu trong hành lang phòng thí nghiệm hoặc bệnh viện tối tăm.", prompt: "Grim indoor combat arena corridor, distressed concrete walls with blood spatters, overhead conduit pipes, eerie dim lighting, wide open floor space suited for RPG battle encounter, survival horror aesthetic --ar 16:9", p: "P1", used: ["Combat", "PixiRenderer"] },
  { id: "combat_bg_nest", name: "Zombie Hive Combat Arena", desc: "Đấu trường chiến đấu hang ổ quái vật cho trận đánh Boss Thi Vương Tịch Diệt.", prompt: "Underground fleshy hive cavern combat arena, pulsating red biomatter on stone floor, green toxic spore clouds, dramatic boss battle stage, high contrast cinematic horror --ar 16:9", p: "P0", used: ["Combat", "PixiRenderer"] },
  { id: "combat_bg_sea", name: "Deep Sea Storm Combat Arena", desc: "Đấu trường chiến đấu mặt biển cuộn sóng dữ dội lúc nửa đêm dưới mưa bão cho trận săn Hải Zombie.", prompt: "Terrifying midnight ocean tempest combat arena, colossal violent dark waves under torrential rain, lightning illuminating a pitch-black churning sea, epic aquatic monster showdown arena --ar 16:9", p: "P1", used: ["Combat", "PixiRenderer"] }
];

MAPS_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "backgrounds",
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/backgrounds/${item.id}.webp`,
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    format: "webp",
    transparent: false,
    priority: item.p,
    usedBy: item.used,
    notes: `Background 1920x1080 cho ${item.id}. Safe area 70% trung tâm.`
  });
});

// -------------------------------------------------------------
// 5. CHARACTERS & NPCS (16)
// -------------------------------------------------------------
const CHARS_DATA = [
  { id: "char_player_portrait", name: "Survivor Player Portrait", desc: "Người chơi sống sót kiên cường, áo khoác sờn, khăn trùm cổ, ánh mắt sắc lạnh từng trải.", prompt: "Character portrait bust of a gritty battle-hardened male survivor in his late 20s, weathered leather jacket over dark tactical hoodie, protective dusty scarf around neck, intense determined eyes, faint jaw stubble and micro scars, moody rim lighting, dark studio slate background, transparent background --ar 1:1", p: "P0", used: ["renderIdentity", "PixiRenderer"] },
  { id: "char_npc_v", name: "Sister V Portrait", desc: "Chị V: Nữ sát thủ/chiến binh tóc ngắn, áo khoác rằn ri, dao găm bên hông, ánh mắt lạnh lùng.", prompt: "Character portrait of a battle-hardened female survivor 'Sister V', 28 years old, short messy black bob hair, intense sharp dark eyes, small faint scar across left cheekbone, wearing a weathered tactical combat vest over worn grey undershirt, dark survivalist scarf around neck, gritty realistic face with dirt smudges, determined expression, dramatic cinematic side-rim lighting, dark slate background, transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_xiaohan", name: "Xiao Han Portrait", desc: "Tô Tiểu Hàm: Cô gái trẻ ấm áp, tóc buộc đuôi ngựa, áo len màu kem sờn vai, ôm bình sữa tươi.", prompt: "Character portrait bust of a gentle kind-hearted young female survivor named Xiao Han, 20 years old, soft ponytail brown hair, warm comforting smile, bright compassionate eyes, wearing an oversized faded cream knit sweater, holding a vintage glass milk bottle, soft warm rim lighting contrasting with subtle grim wasteland dust, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_lili", name: "Lili Mechanic Portrait", desc: "Lili: Nữ thợ cơ khí tinh nghịch, mặt lấm lem dầu mỡ, kính bảo hộ trên trán, cầm cờ lê.", prompt: "Character portrait bust of an energetic quirky teenage female mechanic named Lili, messy reddish-brown twin braids, grease smudges on rosy cheeks, welding safety goggles pushed up onto forehead, wearing durable denim overalls over flannel shirt, clutching an adjustable steel wrench, mischievous grin, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_mumiao", name: "Mu Miaomiao Botanist Portrait", desc: "Mục Miêu Miêu: Nữ tiến sĩ nông nghiệp đội mũ rơm, ngón tay dính đất, ánh mắt ân cần.", prompt: "Character portrait bust of a quiet young female botanist named Mu Miaomiao, wide-brim woven straw hat casting soft shadow, soil smudges on fingertips and canvas work apron, gentle focused gaze holding a tiny green sprouting plant shoot, peaceful survivor aesthetic, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_king_karen", name: "King Karen Portrait", desc: "Quốc vương Karen: Cựu tài phiệt bệ vệ khoác hoàng bào nhung đỏ viền lông thú, tay chống kiếm mạ vàng.", prompt: "Character portrait bust of King Karen, pompous arrogant middle-aged tyrant ruler, thick graying beard, decadent royal velvet cape with ermine fur collar over ornate gilded plate armor, cold calculating eyes, wearing a dented gold crown, dramatic regal lighting, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Castle"] },
  { id: "char_npc_queen", name: "Queen Portrait", desc: "Hoàng Hậu: Quý bà thanh lịch u buồn, áo dạ hội nhung đen cổ điển, đeo mặt dây chuyền hoa hướng dương.", prompt: "Character portrait bust of an elegant melancholic queen, graceful pale face, mournful dark eyes, wearing a vintage black velvet gothic gown and an antique golden sunflower pendant locket, soft dim rim lighting, tragic noble beauty, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Castle"] },
  { id: "char_npc_banker", name: "Castle Banker Portrait", desc: "Trưởng Ngân Hàng: Gã quản lý ngân khố xảo quyệt, com-lê cũ kỹ sờn mép, tay vuốt ria mép sắc sảo.", prompt: "Character portrait bust of a cunning corrupt royal bank manager, sleek slicked-back thinning hair, thin mustache, round brass spectacles perched on sharp nose, frayed pinstripe suit vest, holding a golden ledger pen, sly smirking expression, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Castle"] },
  { id: "char_npc_leader", name: "Outpost Commander Leader Portrait", desc: "Trưởng Trận Địa: Chỉ huy quân sự nghiêm nghị, áo giáp chống đạn rách, vết sẹo lớn trên mặt.", prompt: "Character portrait bust of a stern hardened outpost military commander, buzzcut hair, deep scar running across right eyebrow down to cheek, heavy tactical ballistic vest with unit insignia patches, authoritative stoic gaze, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Outpost"] },
  { id: "char_npc_zhao", name: "Veteran Old Zhao Portrait", desc: "Lão Binh Lão Triệu: Cựu chiến binh già dặn, râu bạc lởm chởm, mắt đỏ ngầu gân máu, quấn băng gạc đầu.", prompt: "Character portrait bust of a crazed traumatized old military veteran 'Old Zhao', unkempt scruffy gray beard, bloodshot haunted wild eyes, dirty combat field jacket with tarnished war medals, blood-stained gauze bandage wrapped around temple, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Outpost"] },
  { id: "char_npc_doctor_chen", name: "Doctor Chen Portrait", desc: "Tiến Sĩ Trần: Nhà khoa học sinh học kính cận dày, áo blouse trắng dính vết hóa chất và máu khô.", prompt: "Character portrait bust of an exhausted obsessive senior research scientist 'Dr. Chen', messy uncombed hair, thick round spectacles reflecting faint green lab light, stained tattered white lab coat over turtleneck, clutching a syringe vial, desperate genius expression, isolated transparent background --ar 1:1", p: "P0", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_guyue", name: "Gu Yue Sea Trader Portrait", desc: "Cố Nguyệt: Nữ thương nhân tàu cá, đội mũ len thủy thủ, áo khoác da chống gió mặn biển đảo.", prompt: "Character portrait bust of a confident seafaring female trader named Gu Yue, knit sailor beanie over unruly wavy hair, heavy salt-stained leather coat, friendly yet shrewd smirk, background sea spray mist vibe, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Island"] },
  { id: "char_npc_linhan", name: "Lin Han Black Market Trader Portrait", desc: "Lâm Hàm: Thương nhân chợ đen đảo bí hiểm, áo trenchcoat đen, ngậm tẩu thuốc nghi ngút khói.", prompt: "Character portrait bust of a secretive black market smuggler 'Lin Han', broad brim dark fedora shadowing upper face, long black leather duster coat, smoking a wooden tobacco pipe with curling white smoke, mysterious knowing half-smile, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Island"] },
  { id: "char_npc_yumo", name: "Yu Mo Mysterious Girl Portrait", desc: "Vũ Mặc: Thiếu nữ bí ẩn bờ biển, tóc dài ướt rủ, áo choàng xanh biển bạc màu, ánh mắt sâu thẳm như đại dương.", prompt: "Character portrait bust of an enigmatic ethereal young woman 'Yu Mo' near ocean coast, long damp dark hair clinging to neck, deep luminous sapphire eyes reflecting sea water, faded aquamarine linen shawl, serene melancholic aura, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Island"] },
  { id: "char_npc_liuruyan", name: "Liu Ruyan Survivor Portrait", desc: "Lưu Như Yên: Người phụ nữ sống sót yếu ớt tiều tụy vì nhiễm virus, ánh mắt van nài được cứu sống.", prompt: "Character portrait bust of a sickly frail female survivor 'Liu Ruyan', pale ashen skin with faint dark viral veins on neck, trembling lips, pleading vulnerable eyes, wrapped in a coarse ragged blanket, tragic survival atmosphere, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Story"] },
  { id: "char_npc_nurse", name: "Nurse Zombie Luluwei Portrait", desc: "Lộ Lộ Vy: Nữ y tá zombie có ý thức nép mình trong góc tối, áo blouse y tá rách nát, khuôn mặt giằng xé.", prompt: "Character portrait bust of a tragic half-conscious nurse zombie 'Luluwei', torn blood-spattered nurse uniform and cap, half of face pale and pretty while other half shows mottled zombie decay and yellow iris, eating a dry ration biscuit with conflicted human expression, isolated transparent background --ar 1:1", p: "P1", used: ["PixiRenderer", "Story"] }
];

CHARS_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "characters",
    description: item.desc,
    prompt: item.prompt,
    negativePrompt: PORTRAIT_NEGATIVE,
    file: `public/assets/characters/${item.id}.png`,
    width: 512,
    height: 512,
    aspectRatio: "1:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: item.used,
    notes: `Chân dung nhân vật/NPC 512x512 PNG transparent (${item.id}).`
  });
});

// -------------------------------------------------------------
// 6. ZOMBIES (16 from ZOMBIES array)
// -------------------------------------------------------------
const ZOMBIES_DATA = [
  { id: "zombie_lang_dao", name: "Wandering Zombie Sprite", desc: "Zombie Lãng Du Thường: Xác sống lang thang da xám xanh, quần áo rách nát, mắt đục ngầu vô hồn.", prompt: "Full body sprite of a common wandering zombie, decaying mottled greenish-gray flesh, ragged torn civilian clothes, hollow milky glazed eyes, slack-jawed menacing pose, gritty post-apocalyptic undead monster, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_thay_rach", name: "Torn Flesh Zombie Sprite", desc: "Thây Rách: Xác sống cơ bắp lộ rõ thớ thịt thối rữa, móng tay sắc nhọn, gầm gừ hung hãn.", prompt: "Full body sprite of a shredded torn-flesh zombie, exposed decaying sinew and muscle fibers, jagged sharp fingernails encrusted in grime, aggressive lunging posture, visceral survival horror creature, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_bo", name: "Crawler Zombie Sprite", desc: "Zombie Bò: Xác sống bị cụt chân bò sát mặt đất với tốc độ bất ngờ, mắt trợn trừng.", prompt: "Full body sprite of a legless crawler zombie dragging its torso on the ground with filthy calloused arms, elongated twisted spine, snarling vicious expression, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_nhanh", name: "Runner Zombie Sprite", desc: "Zombie Chạy Nhanh: Xác sống gầy guộc dị dạng, tứ chi dài ngoằng linh hoạt, miệng há toét phát ra tiếng thét rợn người.", prompt: "Full body action sprite of a feral runner zombie, emaciated lean muscular build, hyper-extended elongated limbs, unhinged jaw shrieking in rage, dynamic forward sprint pose, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_beo", name: "Bloater Zombie Sprite", desc: "Zombie Béo Phì: Khối thịt thối trương phình khổng lồ, bụng sắp nổ tung phun trào dịch độc.", prompt: "Full body concept sprite of a grotesque bloated zombie, gigantic distended swollen belly dripping toxic yellow-green bile, mottled sickly pale skin stretched taut with bulging veins, waddling menacing posture, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_no", name: "Explosive Zombie Sprite", desc: "Zombie Nổ: Toàn thân mọc các bọc mủ phát sáng cam đỏ rực rỡ sắp phát nổ kích hoạt.", prompt: "Full body sprite of an explosive mutated zombie, pulsating glowing orange pustules and volatile blister sacs across shoulders and chest, crackling volatile embers, ready to detonate, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_quan_canh", name: "Riot Police Zombie Sprite", desc: "Zombie Quân Cảnh: Xác sống mặc áo giáp chống bạo động và mũ bảo hộ nứt vỡ, cầm gậy cảnh sát.", prompt: "Full body sprite of an undead riot police officer, cracked tactical helmet with shattered visor, heavy reinforced black body armor stained with dried gore, holding a broken baton, imposing intimidating stance, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_me_nhom", name: "Hive Mother Zombie Sprite", desc: "Mẹ Zombie Bầy Đàn: Sinh vật biến dị mang kén ký sinh trùng trên lưng có khả năng sinh sôi bầy đàn.", prompt: "Full body horror concept sprite of a broodmother zombie, hunched grotesque female undead carrying pulsating organic parasite egg sacs on hunched back, skeletal claws, eerie maternal hiss, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_giap_sat", name: "Armored Iron Zombie Sprite", desc: "Zombie Giáp Sắt: Xác sống bị các tấm thép tấm và thanh ray kim loại găm sâu vào da thịt tạo thành lớp giáp tự nhiên.", prompt: "Full body sprite of an armored ironclad zombie, heavy rusted industrial scrap metal plates and rebar spikes bolted and embedded into scarred muscular flesh, defensive juggernaut, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "zombie_bang_gia", name: "Frost Zombie Sprite", desc: "Zombie Băng Giá: Xác sống phủ đầy băng tuyết và tinh thể sương giá xanh lam, tỏa hơi lạnh buốt giá.", prompt: "Full body sprite of a frostbitten zombie, frozen pale blue flesh encrusted with sharp translucent ice crystals and icicles, freezing mist radiating from body, hypothermic horror monster, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_dien_cuong", name: "Berserker Zombie Sprite", desc: "Zombie Cuồng Nộ: Xác sống đột biến cơ bắp cuồn cuộn đỏ rực như máu, mắt rực lửa cuồng loạn.", prompt: "Full body dynamic sprite of a berserker infected zombie, hyper-developed muscular upper torso, crimson red enraged skin with steaming heat haze, ferocious snarling assault pose, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_axit", name: "Acid Spitter Zombie Sprite", desc: "Zombie Phun Axit: Xác sống dị dạng có tuyến nọc độc phồng to ở cổ họng, nhỏ giọt axit ăn mòn.", prompt: "Full body concept sprite of an acid spitter zombie, grotesque pulsating translucent throat sac filled with caustic fluorescent lime green digestive acid, melted chin and corroded torso, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_nhay", name: "Leaper Zombie Sprite", desc: "Zombie Nhảy: Xác sống có cơ đùi sau phát triển dị thường, co mình chuẩn bị phóng vồ mục tiêu.", prompt: "Full body action sprite of a mutated leaper zombie, disproportionately powerful elongated hind leg tendons, crouched low in predatory hunting stance, twitching claws, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_tank", name: "Zombie Tank Brute Sprite", desc: "Zombie Xe Tăng: Quái vật xác sống khổng lồ như bức tường thép, cánh tay như chày giã đá.", prompt: "Full body concept sprite of a colossal tank zombie juggernaut, gargantuan thick-boned frame, massive club-like stone-hard mutated fists, terrifying behemoth posture, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_ma_vo_hinh", name: "Stealth Cloaked Zombie Sprite", desc: "Zombie Vô Hình: Xác sống bóng ma bán trong suốt có khả năng hòa lẫn vào không khí.", prompt: "Full body concept sprite of a shadowy stealth stalker zombie, translucent smoky phased-out ghostly form with subtle chromatic aberration distortion edges, glowing faint violet eyes, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "zombie_xuyen_thung", name: "Impaling Bone Zombie Sprite", desc: "Zombie Xuyên Thủng: Xác sống có xương cẳng tay biến dị thành ngọn giáo xương nhọn hoắt đâm xuyên con mồi.", prompt: "Full body sprite of an impaler mutated zombie, right forearm transformed into a lethal elongated spear blade of serrated hardened white bone, piercing stance, isolated on transparent background --ar 1:1", p: "P2" }
];

ZOMBIES_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "zombies",
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/characters/${item.id}.png`,
    width: 512,
    height: 512,
    aspectRatio: "1:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: ["Combat", "PixiRenderer"],
    notes: `Sprite quái vật chiến đấu 512x512 PNG (${item.id}).`
  });
});

// -------------------------------------------------------------
// 7. BOSSES (5)
// -------------------------------------------------------------
const BOSSES_DATA = [
  { id: "boss_zombie_king", name: "Silent Zombie King Boss Sprite", desc: "Thi Vương Tịch Diệt (Vua Zombie Im Lặng): Đại quái vật xác sống khổng lồ da đen tuyền chitin, cắm đầy vũ khí của các chiến binh từng bại trận.", prompt: "Full body concept sprite of the legendary Zombie King Boss, gigantic towering humanoid undead brute, thick obsidian black chitinous mutated skin, glowing malevolent red eyes, multiple shattered swords, daggers and iron spears embedded in its scarred muscular chest and back, dark necrotic aura radiating, menacing stance, survival horror final boss monster, isolated on transparent background, full body view --ar 1:1", p: "P0", size: 1024 },
  { id: "boss_giant_puppet", name: "Giant Mechanical Puppet Boss Sprite", desc: "Cỗ Rối Khổng Lồ: Quái vật zombie cơ khí đột biến bị đóng chặt trong khung giàn sắt bệ phóng, mắt sáng xanh lục điện từ.", prompt: "Full body boss sprite of the Giant Mechanical Puppet, colossal mutated titan biomechanically fused with massive rusted steel hydraulic scaffolding and gantry girders, pulsing exposed conduits, unhinged cybernetic faceplate with glowing green optic sensors, terrifying industrial endgame horror, isolated on transparent background --ar 1:1", p: "P0", size: 1024 },
  { id: "boss_sea_monster", name: "Deep Sea Zombie Leviathan Boss Sprite", desc: "Hải Zombie Khổng Lồ: Thây cá voi thối rữa phủ vảy sừng đen tuyền, hàng chục xúc tu bạch tuộc khổng lồ đầy gai nhọn vươn lên.", prompt: "Terrifying deep-sea zombie leviathan boss creature, massive decaying whale-like body covered in armored black barnacle scales, dozens of undulating monstrous kraken tentacles sprouting from its flanks, gaping jaws lined with jagged prehistoric teeth, pale milky blind glowing eyes, dripping sea brine, Eldritch aquatic horror, isolated on transparent background --ar 1:1", p: "P0", size: 1024 },
  { id: "boss_ma_san", name: "Ma San Wasteland Bandit Boss Sprite", desc: "Mã Tam: Trùm lục lâm chột mắt tàn bạo, áo da đinh tán hoen rỉ, cầm súng trường AK47 xả đạn điên cuồng.", prompt: "Full body sprite of notorious wasteland warlord 'Ma San', grizzled one-eyed bandit chieftain with black eye patch, scarred sneering face, heavy spiked biker leather armor, triumphantly wielding a smoking customized AK-47 assault rifle, arrogant ruthless stance, isolated on transparent background --ar 1:1", p: "P1", size: 512 },
  { id: "boss_shadow", name: "Shadow Assassin Boss Sprite", desc: "Hắc Ảnh: Sát thủ giấu mặt trong áo choàng đen rách nát, cầm súng lục ổ quay GP100 nòng dài chí mạng.", prompt: "Full body sprite of deadly mysterious assassin 'The Shadow', draped in tattered hooded black tactical cowl, face completely veiled in deep void darkness with piercing cold eyes, wielding a heavy long-barrel GP100 revolver revolver with laser sight, sleek lethal stance, isolated on transparent background --ar 1:1", p: "P1", size: 512 }
];

BOSSES_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "bosses",
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/characters/${item.id}.png`,
    width: item.size,
    height: item.size,
    aspectRatio: "1:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: ["Combat", "PixiRenderer", "Story"],
    notes: `Sprite trùm Boss đối đầu độ phân giải cao ${item.size}x${item.size} PNG (${item.id}).`
  });
});

// -------------------------------------------------------------
// 8. COMBAT VFX (7)
// -------------------------------------------------------------
const VFX_DATA = [
  { id: "vfx_hit_slash", name: "Melee Slash VFX Overlay", desc: "Vết chém sắc bén màu trắng bạc xé toạc không khí khi ra đòn cận chiến.", prompt: "Action game VFX overlay of a dynamic curved razor-sharp silver white sword slash arc, subtle glowing blue edge sparks, motion blur trail, clean alpha transparency, isolated on transparent background --ar 1:1", p: "P1", w: 512, h: 512 },
  { id: "vfx_hit_bullet", name: "Bullet Muzzle & Impact VFX Overlay", desc: "Tia lửa đạn nổ lóe sáng và khói súng khi đạn bắn trúng đích.", prompt: "Combat action VFX of high-caliber bullet impact flash, bright amber sparks bursting outward, puff of gray gunsmoke, dynamic particle shockwave, isolated on transparent background --ar 1:1", p: "P1", w: 512, h: 512 },
  { id: "vfx_blood_splatter", name: "Screen Blood Splatter VFX Overlay", desc: "Vết máu đỏ tươi bắn tung tóe lên màn hình khi người chơi nhận sát thương nặng.", prompt: "Photorealistic screen splatter overlay of dark arterial red blood droplets and streaks splashing across clear glass lens, high dynamic range, crisp droplets, cinematic combat damage vignette effect, isolated on black background, additive alpha blending ready --ar 1:1", p: "P1", w: 1024, h: 1024 },
  { id: "vfx_critical_hit", name: "Critical Strike Flash VFX Overlay", desc: "Luồng ánh sáng vàng bùng nổ mạnh mẽ kèm tia chớp khi bạo kích thành công.", prompt: "Explosive golden critical strike flash FX, sharp diagonal energy slash blade of bright amber lightning, shattered glass particle sparks flying, dynamic action anime-realism VFX element, intense high impact bloom, isolated on transparent background --ar 1:1", p: "P1", w: 512, h: 512 },
  { id: "vfx_heal_glow", name: "Healing Aura Glow VFX Overlay", desc: "Vòng hào quang xanh lục dịu mát hồi phục sinh lực và giải trừ nhiễm bệnh.", prompt: "Game VFX of radiant soothing emerald green healing light particles swirling upward in gentle vortex, soft celestial glow, recovery spell effect, isolated on transparent background --ar 1:1", p: "P2", w: 512, h: 512 },
  { id: "vfx_victory_banner", name: "Victory Banner UI Overlay", desc: "Biểu ngữ chiến thắng rực lửa phong cách sinh tồn hoang tàn sau trận đánh.", prompt: "Post-apocalyptic victory banner plate, rugged stamped dark metal ribbon with glowing bold text 'CHIẾN THẮNG', ember sparks flying, triumphant gritty survival style, isolated on transparent background --ar 4:1", p: "P1", w: 1024, h: 256 },
  { id: "vfx_defeat_banner", name: "Defeat Banner UI Overlay", desc: "Dòng chữ u ám 'BẠN ĐÃ TỬ NẠN' rỉ sét đẫm máu biểu thị thất bại.", prompt: "Grim defeat death screen banner, corroded iron plate with rusted dark crimson text 'BẠN ĐÃ TỬ NẠN', trailing dried blood drips, somber survival horror atmosphere, isolated on transparent background --ar 4:1", p: "P1", w: 1024, h: 256 }
];

VFX_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: "combat_vfx",
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/vfx/${item.id}.png`,
    width: item.w,
    height: item.h,
    aspectRatio: item.w === item.h ? "1:1" : "4:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: ["Combat", "PixiRenderer"],
    notes: `Hiệu ứng đồ họa chiến đấu (${item.id}).`
  });
});

// -------------------------------------------------------------
// 9. WEAPONS, ITEMS & EQUIPMENT (27)
// -------------------------------------------------------------
const ITEMS_DATA = [
  // Weapons
  { id: "item_knife_dagger", name: "Tactical Combat Dagger Icon", cat: "weapons", desc: "Dao găm quân dụng (dao_gam_nho) lưỡi thép đen có răng cưa.", prompt: "Tactical RPG weapon icon of a sleek combat dagger, matte black carbon steel blade with serrated back edge, textured ergonomic grip, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_weapon_bat", name: "Barbed Baseball Bat Icon", cat: "weapons", desc: "Gậy bóng chày (gay_bong_chay) bọc dây thép gai đẫm máu sinh tồn.", prompt: "Tactical weapon icon of a heavy wooden baseball bat wrapped tightly in barbed wire, dried blood stains, nails embedded in top, apocalypse melee weapon, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_weapon_fireaxe", name: "Firefighter Axe Icon", cat: "weapons", desc: "Rìu cứu hỏa (riu_cuu_hoa) cán dài lưỡi thép đỏ có mũi nhọn phá cửa.", prompt: "Tactical RPG melee weapon icon of a heavy firefighter breaching axe, crimson painted steel head with sharp spike pick, durable fiberglass handle, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_weapon_samurai", name: "Samurai Katana Sword Icon", cat: "weapons", desc: "Đao Samurai (dao_samurai) lưỡi bén sáng loáng chuôi quấn dây đen.", prompt: "Tactical RPG weapon icon of a traditional Japanese katana samurai sword, gleaming folded steel curved blade, black cord wrapped hilt (tsuka), golden brass guard (tsuba), isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_weapon_fearless", name: "Fearless Mythic Blade Icon", cat: "weapons", desc: "Kiếm Vô Uy (kiem_vo_uy) thanh kiếm thần thoại lưỡi bạc phát ánh sáng xanh thần bí.", prompt: "Mythic RPG weapon icon of the legendary 'Fearless Sword', ancient polished damascus steel broadsword glowing with ethereal azure rune inscriptions, regal pommel, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_pistol_p226", name: "SIG P226 Pistol Icon", cat: "weapons", desc: "Súng ngắn SIG Sauer P226 (P226) bán tự động kim loại đen.", prompt: "Tactical firearm icon of a SIG Sauer P226 9mm semi-automatic pistol, dark nitron finish, stippled grip, crisp photorealistic gunsmith rendering, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_pistol_deagle", name: "Desert Eagle .50 AE Pistol Icon", cat: "weapons", desc: "Súng ngắn Deagle Sa Mạc (sung_sa_mac) nòng lớn uy lực khủng khiếp.", prompt: "Tactical firearm icon of a massive .50 AE Desert Eagle pistol, brushed chrome silver metal finish, tactical rail, intimidating heavy hand cannon, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_smg_uzi", name: "UZI Submachine Gun Icon", cat: "weapons", desc: "Súng tiểu liên UZI (UZI) báng gấp nhỏ gọn hỏa lực áp đảo.", prompt: "Tactical firearm icon of an Israeli 9mm UZI submachine gun, stamped dark steel receiver, folded wire stock, extended box magazine, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_rifle_m4a1", name: "M4A1 Assault Rifle Icon", cat: "weapons", desc: "Súng trường tấn công M4A1 (M4A1) gắn kính ngắm holo và báng kéo.", prompt: "Tactical military weapon icon of an M4A1 carbine assault rifle, matte black polymer finish, holographic optic sight mounted on picatinny rail, vertical foregrip, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_rifle_ak47", name: "AK-47 Assault Rifle Icon", cat: "weapons", desc: "Súng trường huyền thoại AK-47 (AK47) báng gỗ cổ điển rỉ sét nhẹ.", prompt: "Tactical firearm icon of a classic Kalashnikov AK-47 assault rifle, weathered varnished dark wood stock and handguard, curved steel 30-round magazine, rugged wasteland aesthetic, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_gun_sniper_m700", name: "M700 Sniper Rifle Icon", cat: "weapons", desc: "Súng bắn tỉa M700 (M700) thân polymer đen gắn ống ngắm quang học tầm xa.", prompt: "Tactical precision sniper rifle icon of a Remington M700 bolt-action rifle, matte dark polymer stock, heavy threaded barrel, high-power telescopic long-range optic scope, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_bow_wood", name: "Survival Wooden Bow Icon", cat: "weapons", desc: "Cung gỗ (cung_go) chế tác thủ công bằng gỗ dẻo và dây gân.", prompt: "Survival archery icon of a handcrafted recurve wooden hunting bow, polished dark timber grain, tight braided string, isolated on transparent background --ar 1:1", p: "P2" },
  // Ammo
  { id: "item_ammo_box_9mm", name: "9x19mm Ammunition Box Icon", cat: "items", desc: "Hộp đạn quân sự xanh lục in nhãn vàng '9×19mm'.", prompt: "Tactical ammunition box icon, olive drab cardboard box labeled '9x19mm Parabellum' with several brass shiny bullet cartridges resting beside it, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_ammo_box_rifle", name: "5.56 NATO Ammo Tin Icon", cat: "items", desc: "Hộp đạn sắt quân đội chống ẩm in nhãn '5.56×45mm NATO'.", prompt: "Military surplus ammo can icon, stamped steel green container stenciled with '5.56x45mm NATO', brass linked rifle rounds protruding, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_ammo_box_arrow", name: "Hunting Arrows Quiver Icon", cat: "items", desc: "Bó mũi tên săn bắn lông vũ (mui_ten) đầu bọc thép nhọn.", prompt: "Archery inventory icon of a quiver bundle of wooden hunting arrows, sharp three-blade steel broadhead tips, black and red feather fletching, isolated on transparent background --ar 1:1", p: "P2" },
  // Medicines
  { id: "item_med_bandage", name: "Adhesive Bandage Strips Icon", cat: "items", desc: "Băng cá nhân (bang_keo) vô trùng dùng cầm máu vết xước.", prompt: "Survival medical icon of sterile adhesive bandage strips with white cotton gauze pad, emergency medical item, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_med_firstaid", name: "First Aid Kit Bag Icon", cat: "items", desc: "Gói cấp cứu y tế (goi_cap_cuu) bạt đỏ in chữ thập trắng nổi bật.", prompt: "Tactical emergency medical icon of a red canvas trauma first aid kit pouch with prominent white medical cross patch, heavy-duty zipper, sterile field supplies inside, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "item_med_serum", name: "Anti-Infection Serum Ampoule Icon", cat: "items", desc: "Ống nghiệm huyết thanh kháng nhiễm (huyet_thanh) phát sáng huỳnh quang xanh lam.", prompt: "Sci-fi medical RPG inventory icon of a reinforced glass ampoule vial containing glowing bioluminescent cyan-blue antiviral serum, steel protective casing, cure infection medicine, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "item_med_medkit", name: "Field Combat Medkit Box Icon", cat: "items", desc: "Hộp y tế chiến địa (hop_y_te) bằng kim loại bọc cao su chống sốc.", prompt: "Tactical survival inventory icon of an olive-drab steel military combat medical kit box with latches, stencil red cross logo, morphine injectors and gauze rolls visible, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_med_universal", name: "Universal Auto-Injector Icon", cat: "items", desc: "Thuốc tiêm đa năng (tiem_van_nang) ống tiêm tự động công nghệ cao dung dịch vàng kim.", prompt: "Advanced high-tech medical auto-injector pen icon, glowing liquid gold medicine reservoir, digital dosage indicator, life-saving panacea stimulant, isolated on transparent background --ar 1:1", p: "P1" },
  // Foods & Drinks
  { id: "item_food_biscuit", name: "Compressed Military Biscuit Icon", cat: "items", desc: "Bánh quy nén (banh_quy_nen) lương khô quân đội bọc giấy bạc rách mép.", prompt: "Survival food ration icon of a dense vacuum-packed compressed military ration biscuit bar, torn foil wrapper revealing high-energy cracker block, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_food_canned_beef", name: "Canned Braised Beef Icon", cat: "items", desc: "Thịt bò đóng hộp (hop_thit_bo) hộp thiếc rỉ sét nhẹ có hình con bò.", prompt: "Survival RPG food icon of a tin can of braised stewed beef, retro weathered paper label, pull tab on lid, nourishing wasteland meal, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_food_apple", name: "Fresh Red Apple Icon", cat: "items", desc: "Quả táo tươi (tao) mọng nước bổ sung cả độ no và nước.", prompt: "RPG inventory icon of a crisp shiny red orchard apple with a single fresh green leaf on stem, isolated on transparent background --ar 1:1", p: "P2" },
  { id: "item_drink_water", name: "Bottled Mineral Water Icon", cat: "items", desc: "Chai nước khoáng (nuoc_khoang) nhựa trong suốt còn đầy nước mát.", prompt: "Survival drink icon of a clear plastic water bottle filled with clean drinking mineral water, blue screw cap, condensation droplets, isolated on transparent background --ar 1:1", p: "P1" },
  { id: "item_drink_beer", name: "Hundred Flavor Beer Bottle Icon", cat: "items", desc: "Chai bia thủy tinh nâu Bia Trăm Vị (bia_tram_vi) nắp thiếc.", prompt: "Wasteland drink icon of a dark amber glass beer bottle with vintage distressed label 'Bia Trăm Vị', metal crown cap, frothy golden beer inside, isolated on transparent background --ar 1:1", p: "P1" },
  // Key items
  { id: "item_special_pass", name: "Castle Royal Pass Seal Icon", cat: "items", desc: "Thẻ thông hành lâu đài Karen bằng đồng thau dập con dấu sáp hoàng gia.", prompt: "RPG key item icon of an ornate antique brass safe-conduct pass tablet, engraved gothic scrollwork, stamped with a deep scarlet wax seal bearing royal crown emblem, isolated on transparent background --ar 1:1", p: "P0" },
  { id: "item_badge_silence", name: "Silence Medal of King Slayer Icon", cat: "items", desc: "Huy chương Tịch Diệt đúc bằng kim loại đen cổ ngữ sau khi hạ Boss Thi Vương.", prompt: "Legendary boss trophy key item icon of the 'Silence King Slayer Medal', carved obsidian dark metal medallion radiating faint ominous purple glow, engraved with ancient eldritch runes, isolated on transparent background --ar 1:1", p: "P0" }
];

ITEMS_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: item.cat,
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/items/${item.id}.png`,
    width: 256,
    height: 256,
    aspectRatio: "1:1",
    format: "png",
    transparent: true,
    priority: item.p,
    usedBy: ["Inventory", "Equipment", "Trading"],
    notes: `Icon vật phẩm chiến thuật 256x256 PNG (${item.id}).`
  });
});

// -------------------------------------------------------------
// 10. STORY CGS & ENDINGS (6)
// -------------------------------------------------------------
const STORY_DATA = [
  { id: "story_cg_intro", name: "Prologue Nightmare CG", cat: "events", desc: "Khởi đầu câu chuyện: Người sống sót co ro trong căn lều rách nát, nhìn ra màn đêm tiếng zombie gào thét.", prompt: "Cinematic story illustration of a lonely survivor huddled inside a torn makeshift canvas tent on a stormy post-apocalyptic night, clutching a small flashlight, listening tensely to distant shadowy zombie silhouettes prowling through dense toxic fog outside, dramatic storytelling atmosphere, 8k concept art --ar 16:9", p: "P1" },
  { id: "story_cg_nurse", name: "Encounter with Nurse Luluwei CG", cat: "events", desc: "Sự kiện Bệnh viện: Nữ y tá zombie Lộ Lộ Vy nép mình trong góc tối nhìn chằm chằm mẩu bánh quy với ánh mắt giằng xé.", prompt: "Cinematic emotional story CG of tragic half-turned nurse zombie Luluwei cowering in the shadowy corner of an abandoned hospital room, clutching a dry ration biscuit between trembling bloodied fingers, conflicted tearful human gaze mixed with horrific zombie corruption, poignant narrative art --ar 16:9", p: "P2" },
  { id: "story_cg_rocket_launch", name: "Ending Space Escape CG", cat: "endings", desc: "Ending Thoát Ly Vũ Trụ (ending_space): Tên lửa ngân hà khai hỏa bốc khói trắng xóa bay vút vào không gian rời khỏi Trái Đất hoang tàn.", prompt: "Epic cinematic ending illustration of a towering space rocket igniting colossal roaring plumes of brilliant white and orange rocket exhaust flame, launching into the stratosphere away from a ruined dark Earth continent below, stars shining in deep cosmos, awe-inspiring hopeful finale --ar 16:9", p: "P0" },
  { id: "story_cg_mermaid", name: "Ending Deep Sea Mermaid CG", cat: "endings", desc: "Ending Người Cá Biển Sâu (ending_mermaid): Người cá xinh đẹp vươn mình từ mặt biển tĩnh lặng lấp lánh ánh trăng sau khi hạ Hải Zombie.", prompt: "Breathtaking mythical ending CG of an ethereal bioluminescent mermaid emerging gracefully from calm ocean waves under full silver moonlight, shimmering iridescent scales, starlit reflection on gentle ripples, tranquil melancholic fairytale conclusion --ar 16:9", p: "P1" },
  { id: "story_cg_king_vassal", name: "Ending Castle Vassalage CG", cat: "endings", desc: "Ending Hoàng Quyền Lâu Đài (ending_prince): Người chơi quỳ gối tuyên thệ trước ngai vàng quốc vương Karen trong đại sảnh lâu đài lộng lẫy.", prompt: "Cinematic story ending CG of a kneeling armored warrior survivor taking an oath of fealty before the gilded throne of King Karen inside a grand gothic castle hall, flickering torches, noble courtiers watching in opulent shadows, dark feudal survival triumph --ar 16:9", p: "P2" },
  { id: "story_cg_infection_death", name: "Bad Ending Infection Death CG", cat: "endings", desc: "Ending Tử Nạn Biến Dị (ending_death): Cánh tay người chơi bị đột biến đen ngòm ngã quỵ trên nền đất hoang khi virus hoàn toàn chiếm đoạt.", prompt: "Tragic dark bad ending illustration, first-person point of view of a dying survivor collapsing onto cold barren dirt wasteland, foreground arm turning black with pulsating fluorescent green viral veins and horrific chitinous mutations, fading blurred vision into total darkness, grim finality --ar 16:9", p: "P2" }
];

STORY_DATA.forEach(item => {
  addAsset({
    id: item.id,
    name: item.name,
    category: item.cat,
    description: item.desc,
    prompt: item.prompt,
    file: `public/assets/cgs/${item.id}.webp`,
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    format: "webp",
    transparent: false,
    priority: item.p,
    usedBy: ["StoryArea", "Modal", "PixiRenderer"],
    notes: `Tranh minh họa cốt truyện / kết thúc 1920x1080 WebP (${item.id}).`
  });
});

// Output manifest to file
const outManifestPath = path.resolve('project-docs/assets/asset-manifest.json');
fs.writeFileSync(outManifestPath, JSON.stringify(assets, null, 2), 'utf-8');
console.log(`Successfully generated manifest with ${assets.length} assets.`);

// -------------------------------------------------------------
// CREATE BATCH 01: UI & ICONS (Only P0 Core Assets)
// -------------------------------------------------------------
// We select critical P0 UI, vital stat icons, and top P0 backgrounds for first generation test.
const batch01Assets = assets.filter(a => a.priority === "P0" && (a.category === "icons" || a.category === "ui") && a.status === "pending");

const batch01 = {
  batchId: "batch-01-ui-icons",
  title: "Batch 01: Core UI & Essential Vital Icons",
  description: "Bộ asset ưu tiên P0 đầu tiên dùng để sinh ảnh AI, tập trung vào logo game, icon chỉ số sinh tồn và tài nguyên cốt lõi.",
  assetCount: batch01Assets.length,
  targetFormat: "PNG 256x256 (icons) / PNG 1024x512 (logo)",
  styleGuide: "Dark Post-Apocalyptic Tactical Survival RPG. Desaturated palette, grim steel and biohazard accents, sharp crisp borders on transparent background.",
  assets: batch01Assets
};

const outBatch1Path = path.resolve('project-docs/assets/batches/batch-01-ui-icons.json');
fs.writeFileSync(outBatch1Path, JSON.stringify(batch01, null, 2), 'utf-8');
console.log(`Successfully generated batch 01 with ${batch01Assets.length} P0 assets.`);

