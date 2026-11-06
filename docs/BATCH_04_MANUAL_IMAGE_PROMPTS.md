# BATCH 04 – MANUAL IMAGE GENERATION PROMPTS
## ZOMBIE & MONSTER ASSETS (ZOMBIE WORLD RPG)

> **Document Version:** 1.0  
> **Target Scope:** 8 Remaining Hostile Entities (3 P1, 2 P2, 3 Bosses)  
> **Art Direction:** Dark Post-Apocalyptic Survival Horror RPG. Semi-realistic 3D game character art, cinematic lighting from upper-left, gritty realistic textures, whole-body combat stance, clean silhouette isolated on transparent background, strictly no text or watermark.  
> **Status:** Manual generation guide for external AI platforms (Midjourney, ChatGPT / DALL-E 3, Leonardo AI, Stable Diffusion, etc.).

---

## Quick Usage Guide for External AI Platforms

1. **Copying Prompts:** Copy the **Main Prompt** directly into your AI image generator. If the platform has a separate field for Negative Prompts (e.g., Leonardo AI, Stable Diffusion, SeaArt), paste the **Negative Prompt** into that box.
2. **Parameters / Flags:**
   - **For Regular & P2 Zombies (Assets 1–5):** Target aspect ratio is **2:3** (portrait). In Midjourney, append `--ar 2:3 --v 6.1`. In Stable Diffusion / Leonardo, select **512×768** or **832×1248** (which will downscale to 512×768).
   - **For Boss Creatures (Assets 6–8):** Target aspect ratio is **1:1** (square). In Midjourney, append `--ar 1:1 --v 6.1`. In Stable Diffusion / Leonardo, select **1024×1024**.
3. **Handling Transparency:**
   - If the AI platform outputs an image on a solid background (black, gray, or white) or renders a faux checkerboard pattern, use the provided **Post-Processing Instructions** to extract a true 32-bit RGBA PNG with alpha channel before saving to `public/assets/zombies/`.

---

## 1. zombie_tank.png

### A. Asset Information
- **Filename:** `zombie_tank.png`
- **Enemy ID:** `zombie_tank`
- **Priority:** P1
- **Target Dimensions:** 512 × 768 pixels (Aspect Ratio 2:3)
- **Category:** Regular / Elite Juggernaut Zombie
- **Short Description:** Quái vật zombie thể hình hộ pháp như xe bọc thép: cơ bắp dày đặc hóa sừng bất khả xâm phạm, vai u thịt bắp khổng lồ nghiền nát mọi chướng ngại vật.

### B. Main Prompt
```text
Full-body character sprite of a colossal zombie tank brute (Juggernaut), immense hulking mutated anatomy with thick hardened calloused keratin armor plating over shoulders and upper body, massive boulder-like fists capable of smashing concrete, vascular thick black veins pulsing across bloated crimson muscle tissue, thick scarred neck, tiny glowing red eyes sunken into a thick cracked skull, tattered heavy industrial combat trousers, rugged reinforced work boots, brutal imposing charging battle stance, dark survival horror RPG aesthetic, semi-realistic 3D game character art, dramatic rim lighting from top-left, clean silhouette isolated on solid transparent background, whole body visible from skull to boots, strictly no background, no ground shadow, no floor, no text, no watermark --ar 2:3
```

### C. Negative Prompt
```text
floor, ground, dirt, rubble, platform, scenery, wall, room, background environment, cast shadow, fake checkerboard, drawn transparency grid, white box backdrop, black background box, cropped head, cropped fists, cropped boots, out of frame, partial body, portrait only, text, typography, watermark, logo, signature, anime, manga, kawaii, bright cartoon, chibi, futuristic sci-fi neon, cyberpunk, blurry, low resolution, extra limbs
```

### D. Post-Processing Instructions
1. **Background Removal:** If generated with a solid neutral or black background, run flood-fill / color-key background removal to produce a true RGBA PNG with transparent alpha. Ensure no fake checkerboard squares remain around the fists or boots.
2. **Resize:** Scale and center to exactly **512 × 768 pixels** using Lanczos3 interpolation with aspect fit (`fit: 'contain'`).
3. **Verification:** Inspect in image viewer to ensure `hasAlpha: true`, `isOpaque: false`, and alpha ratio is between 50% and 75%.
4. **Destination:** Save to `public/assets/zombies/zombie_tank.png`.

---

## 2. zombie_ma_vo_hinh.png

### A. Asset Information
- **Filename:** `zombie_ma_vo_hinh.png`
- **Enemy ID:** `zombie_ma_vo_hinh`
- **Priority:** P1
- **Target Dimensions:** 512 × 768 pixels (Aspect Ratio 2:3)
- **Category:** Stealth / Cloaked Assassin Zombie
- **Short Description:** Xác sống bóng ma có khả năng bẻ cong ánh sáng: thân hình mờ ảo nửa trong suốt như ảo ảnh khói đen, thoắt ẩn thoắt hiện tiếp cận bất ngờ.

### B. Main Prompt
```text
Full-body character sprite of a sinister stealth cloaked shadow zombie, ethereal semi-translucent decaying form with subtle shimmering optical camouflage distortion and wisps of dark smoky necrotic mist flowing around its silhouette, faintly visible pale skeletal facial bones and glowing spectral violet eyes, lean stalking predator pose with elongated claw fingers, tattered spectral shroud rags, sharp clean outer silhouette edges, dark post-apocalyptic survival horror aesthetic, semi-realistic 3D digital illustration, cinematic rim lighting from upper-left catching edges, isolated on a completely transparent background with genuine alpha, strictly no background scenery, no ground, no floor, no cast shadow, whole body visible from head to spectral feet, no text, no watermark --ar 2:3
```

### C. Negative Prompt
```text
solid background, white background, black box, gray studio wall, floor, ground, environmental scenery, room, fake checkerboard pattern, drawn grid, text, typography, watermark, signature, cropped head, cropped feet, out of frame, cutoff body, anime kawaii, bright neon cyberpunk, cheerful, smiling, blurry, lowres, multiple figures
```

### D. Post-Processing Instructions
1. **Background Removal:** Use a thresholded flood fill starting from outer borders. Be careful to preserve the semi-translucent violet mist clinging to the character silhouette while eliminating any solid background or fake checkerboard.
2. **Resize:** Scale to exactly **512 × 768 pixels** with `fit: 'contain'` and transparent background.
3. **Verification:** Confirm `hasAlpha: true`, `isOpaque: false`, transparent ratio ~60–80%.
4. **Destination:** Save to `public/assets/zombies/zombie_ma_vo_hinh.png`.

---

## 3. zombie_xuyen_thung.png

### A. Asset Information
- **Filename:** `zombie_xuyen_thung.png`
- **Enemy ID:** `zombie_xuyen_thung`
- **Priority:** P1
- **Target Dimensions:** 512 × 768 pixels (Aspect Ratio 2:3)
- **Category:** Piercing Osteo-Mutant Zombie
- **Short Description:** Zombie biến dị cấu trúc xương: cánh tay phải biến đổi thành lưỡi gươm xương nhọn hoắt dài hơn 1 mét, lưng mọc đầy gai xương xuyên giáp.

### B. Main Prompt
```text
Full-body character sprite of a terrifying bone impaler zombie, right arm horribly mutated into a massive razor-sharp elongated calcified bone blade spear over one meter long, sharp calcified osteo-spikes and bone spurs protruding through spine and shoulder blades, lean athletic predatory stance with the piercing bone blade leveled forward, scarred decaying muscular torso, snarling desiccated jaw with exposed teeth, milky predatory eyes, torn combat rags, dramatic top-left rim lighting reflecting off polished bone edges, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game character art, centered full-body composition, head to feet completely in frame, clean silhouette isolated on solid transparent background, strictly no background, no ground, no floor shadow, no text, no watermark --ar 2:3
```

### C. Negative Prompt
```text
ground, floor, stone, rubble, background scenery, landscape, room, decorative backdrop, fake checkerboard grid, white box, black backdrop, cropped bone spear, cropped blade tip, cropped head, cropped feet, out of frame, partial body, text, watermark, signature, cartoon, anime, bright colorful, friendly, blurry, low resolution
```

### D. Post-Processing Instructions
1. **Background Removal:** Ensure the tip of the elongated bone spear is not clipped or erased during background removal. Inspect negative space between the arm spear and the torso.
2. **Resize:** Scale to **512 × 768 pixels** with `fit: 'contain'` so the long spear fits entirely within horizontal safe boundaries.
3. **Verification:** Verify `hasAlpha: true`, `isOpaque: false`, transparent ratio ~55–75%.
4. **Destination:** Save to `public/assets/zombies/zombie_xuyen_thung.png`.

---

## 4. football_zombie.png

### A. Asset Information
- **Filename:** `football_zombie.png` *(Source ID: `zombie_football`)*
- **Enemy ID:** `football_zombie`
- **Priority:** P2
- **Target Dimensions:** 512 × 768 pixels (Aspect Ratio 2:3)
- **Category:** Heavily Armored Zombie (University Campus)
- **Short Description:** Xác sống cầu thủ bóng bầu dục khổng lồ: mặc áo đấu bùn đất rách rưới, giáp vai đồ sộ, mũ bảo hiểm vỡ kính lộ hàm răng dính máu, tư thế lao húc cực mạnh.

### B. Main Prompt
```text
Full-body character sprite of a hulking infected American football player zombie in a ruined university campus, wearing battered mud-caked team jersey with torn faded numbers, massive scuffed shoulder armor pads, cracked protective football helmet with bent iron face grill showing snarling bloodied rotting teeth, dead milky bloodshot eyes, heavy muddy athletic cleats, powerful aggressive linebacker charging tackle stance, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game character art, dramatic rim lighting from upper-left, gritty realistic textures, whole body visible from helmet top to cleat bottoms, clean silhouette isolated on solid transparent background, strictly no background, no stadium, no turf, no ground shadow, no text, no watermark --ar 2:3
```

### C. Negative Prompt
```text
stadium, football field, grass, turf, crowd, goal posts, background environment, scenery, floor, ground, shadow on ground, artificial checkerboard, white box, black backdrop, cropped helmet, cropped cleats, out of frame, partial body, portrait only, text, watermark, signature, cartoon, anime kawaii, bright cheerful colors, blurry, low resolution
```

### D. Post-Processing Instructions
1. **Background Removal:** Perform outer border flood fill and clear enclosed pockets (e.g., between arms and waist or between thighs).
2. **Resize:** Scale to **512 × 768 pixels** (`fit: 'contain'`).
3. **Verification:** Verify `hasAlpha: true`, `isOpaque: false`, transparent ratio ~55–70%.
4. **Destination:** Save to `public/assets/zombies/football_zombie.png` (and ensure mirror symlink / copy for `zombie_football.png`).

---

## 5. diving_zombie.png

### A. Asset Information
- **Filename:** `diving_zombie.png` *(Source ID: `zombie_diver`)*
- **Enemy ID:** `diving_zombie`
- **Priority:** P2
- **Target Dimensions:** 512 × 768 pixels (Aspect Ratio 2:3)
- **Category:** Aquatic Zombie (Riverside Port / Coast)
- **Short Description:** Xác sống thợ lặn nổi lên từ vùng nước ô nhiễm: đồ lặn cao su rách nát bám rong rêu, bình dưỡng khí rỉ sét sau lưng, kính lặn nứt vỡ lộ mắt trắng đục, tay cầm súng phóng lao sắc nhọn.

### B. Main Prompt
```text
Full-body character sprite of an eerie deep-sea scuba diver zombie, wearing a dark weathered torn neoprene rubber wetsuit dripping with slimy strands of kelp and sea slime, heavy corroded twin oxygen scuba tanks strapped to back with severed rubber breathing tubes, cracked glass scuba diving mask revealing a pale bloated waterlogged corpse face with vacant milky dead eyes, wearing worn rubber diving flippers on feet, holding a heavy rusted underwater speargun with a barbed steel harpoon pointed forward in a menacing stance, dark post-apocalyptic aquatic survival horror aesthetic, semi-realistic 3D game character art, cinematic rim lighting from upper-left catching wet rubber reflections, centered full-body composition, head to flipper tips completely visible, clean silhouette isolated on solid transparent background, strictly no water, no ocean, no seafloor, no bubbles, no ground, no shadow, no text, no watermark --ar 2:3
```

### C. Negative Prompt
```text
water, ocean, river, underwater, seabed, coral, bubbles, water splash, swimming pool, background scenery, floor, ground shadow, checkerboard pattern, white box, black background, cropped mask, cropped flippers, out of frame, partial body, text, watermark, signature, cartoon, anime, cheerful, blurry, low resolution
```

### D. Post-Processing Instructions
1. **Background Removal:** Ensure the thin harpoon spear tip and the rubber flippers are intact and not eroded during matting.
2. **Resize:** Scale to **512 × 768 pixels** with `fit: 'contain'`.
3. **Verification:** Confirm `hasAlpha: true`, `isOpaque: false`, transparent ratio ~55–75%.
4. **Destination:** Save to `public/assets/zombies/diving_zombie.png` (and mirror for `zombie_diver.png`).

---

## 6. zombie_king.png

### A. Asset Information
- **Filename:** `zombie_king.png` *(Source ID: `zombie_king` / `boss_zombie_king`)*
- **Enemy ID:** `zombie_king`
- **Priority:** Boss (P0 Boss)
- **Target Dimensions:** 1024 × 1024 pixels (Square 1:1)
- **Category:** Ultimate Boss / Monarch of the Zombie Hive
- **Short Description:** Chúa tể tối cao của Tổ Zombie (Thi Vương Tịch Diệt): quái vật hình người cao hơn 3 mét, da bọc giáp kitin đen tuyền, cắm đầy vũ khí gãy của các chiến binh thách đấu, vương miện sừng gai xương, mắt đỏ rực.

### B. Main Prompt
```text
Full-body concept art sprite of the legendary Silent Zombie King Boss (Thi Vương Tịch Diệt), a colossal 3.5-meter tall humanoid undead monarch and final boss, body heavily encrusted with thick obsidian-black mutated chitinous carapace armor resembling dark gothic plate armor, an imposing crown of jagged calcified bone horns growing naturally from his massive horned skull, twin malevolent burning crimson eyes radiating terrifying intelligence, scarred muscular broad chest and shoulders impaled with multiple rusted shattered ancient swords, daggers, and snapped iron spearheads from fallen warriors, dark smoky necrotic miasma aura subtly outlining the edges, dominating imposing battle-ready stance with massive clawed gauntleted hands, dark gothic post-apocalyptic survival horror RPG aesthetic, ultra-detailed semi-realistic 3D character art, cinematic high-contrast rim lighting from top-left, centered square composition, entire monarch visible from bone horn crown to heavy chitinous armored greaves, clean silhouette isolated on a pure transparent background with genuine alpha channel, strictly no throne, no floor, no castle, no ground shadow, no text, no watermark --ar 1:1
```

### C. Negative Prompt
```text
throne, castle, cathedral, room, floor, ground, stones, scenery, environment, background, shadows on floor, checkerboard pattern, white backdrop, black box, cropped horns, cropped feet, out of frame, partial body, bust, portrait only, text, typography, watermark, logo, signature, anime, cartoon, bright high-saturation colors, low quality, blurry, duplicate limbs
```

### D. Post-Processing Instructions
1. **Background Removal:** Use high-precision matting. Preserve the intricate crown of bone horns and the hilts/blades of impaled weapons sticking out from the chest and back.
2. **Square Canvas:** Maintain **1024 × 1024 pixels** (1:1 aspect ratio). Boss assets use high-resolution square viewports in the combat screen.
3. **Verification:** Inspect in image viewer. Confirm 4 channels (RGBA), `isOpaque: false`, transparent ratio ~45–65%.
4. **Destination:** Save to `public/assets/zombies/zombie_king.png` (and mirror for `boss_zombie_king.png`).

---

## 7. giant_puppet.png

### A. Asset Information
- **Filename:** `giant_puppet.png` *(Source ID: `giant_puppet` / `boss_giant_puppet`)*
- **Enemy ID:** `giant_puppet`
- **Priority:** Boss (P1 Boss)
- **Target Dimensions:** 1024 × 1024 pixels (Square 1:1)
- **Category:** Subterranean Bio-Mechanical Cyber-Zombie Boss
- **Short Description:** Quái vật zombie đột biến sinh cơ khí trong Trạm Phóng Tên Lửa Tuyệt Mật: thân hình khổng lồ bị giằng néo bởi khung sắt cơ khí, piston thủy lực và dây cáp treo lơ lửng, mắt sáng xanh lục độc địa.

### B. Main Prompt
```text
Full-body concept art sprite of the Giant Puppet Boss (Cỗ Rối Khổng Lồ), a massive terrifying bio-mechanical cybernetic zombie boss from a subterranean missile silo facility, towering mutated humanoid corpse monstrosity integrated with heavy industrial machinery, rusted steel exoskeleton framework and heavy hydraulic pistons bolted directly into rotting muscular flesh and exposed titanium bone joints, thick dangling severed industrial power cables and pneumatic hoses hanging from shoulders and back like marionette puppet strings, a single large sinister glowing emerald green optical sensor lens embedded into a bolted iron plate skull, massive mechanical claw-hand on one arm and crushing industrial fist on the other, menacing heavy combat stance, dark industrial cyberpunk-apocalyptic survival horror RPG aesthetic, ultra-detailed semi-realistic 3D digital illustration, cinematic rim lighting from upper-left with green sensor eye glint, centered square composition, whole cyborg creature visible from head cables to heavy reinforced industrial boots, clean silhouette isolated on a pure transparent background with true alpha channel, strictly no missile silo, no factory, no floor, no ground shadow, no text, no watermark --ar 1:1
```

### C. Negative Prompt
```text
missile silo, bunker, launch pad, factory, industrial room, pipes background, wall, floor, platform, ground, scenery, environment, shadows on ground, checkerboard pattern, white box, black backdrop, cropped head, cropped feet, out of frame, partial body, text, watermark, signature, cartoon, anime, clean futuristic sci-fi, blurry, low resolution
```

### D. Post-Processing Instructions
1. **Background Removal:** Carefully inspect the dangling severed cables and pneumatic hoses hanging from the shoulders and back. Ensure cable contours remain intact without background checkerboard fragments trapped between them.
2. **Square Canvas:** Maintain **1024 × 1024 pixels** (1:1).
3. **Verification:** Confirm `hasAlpha: true`, `isOpaque: false`, transparent ratio ~45–65%.
4. **Destination:** Save to `public/assets/zombies/giant_puppet.png` (and mirror for `boss_giant_puppet.png`).

---

## 8. sea_monster.png

### A. Asset Information
- **Filename:** `sea_monster.png` *(Source ID: `sea_monster` / `boss_sea_monster`)*
- **Enemy ID:** `sea_monster`
- **Priority:** Boss (P1 Boss)
- **Target Dimensions:** 1024 × 1024 pixels (Square 1:1)
- **Category:** Deep-Sea Zombie Leviathan Boss
- **Short Description:** Đại quái vật biển sâu nhiễm virus zombie: thân thể khổng lồ như cá voi cổ đại mục rữa phủ vỏ hà đá đen, hàng chục xúc tu bạch tuộc khổng lồ đầy gai nhọn vươn lên, hàm răng lởm chởm như quái vật tiền sử.

### B. Main Prompt
```text
Full-body creature concept sprite of the colossal Deep-Sea Zombie Leviathan Boss (Hải Zombie Khổng Lồ), a gargantuan prehistoric whale-like undead sea monstrosity, massive rotting whale-like aquatic body covered in jagged black volcanic barnacles, necrotic decaying sea blubber, and clinging dark kelp, dozens of massive muscular kraken tentacles equipped with barbed predatory suckers erupting from its flanks and coiling menacingly, cavernous gaping maw hinged wide open displaying triple concentric rows of jagged prehistoric shark teeth, glowing milky blind yellow eyes along its scarred skull, dark aquatic Eldritch survival horror RPG aesthetic, ultra-detailed semi-realistic 3D creature art, dramatic top-left rim lighting catching wet sea-slime reflections, centered square composition, entire leviathan creature and curled tentacles completely visible within canvas, clean silhouette isolated on a solid transparent background with genuine alpha channel, strictly no ocean, no water waves, no underwater seafloor, no bubbles, no background, no text, no watermark --ar 1:1
```

### C. Negative Prompt
```text
ocean, water surface, waves, underwater, ocean floor, coral reef, bubbles, water splashing, background scenery, environment, floor, ground shadow, checkerboard pattern, white backdrop, black box, cropped tentacles, cropped body, out of frame, partial creature, text, watermark, signature, cartoon, anime, bright vibrant colors, blurry, low quality
```

### D. Post-Processing Instructions
1. **Background Removal:** Leviathan tentacles spread wide across the canvas; ensure the fine spaces between coiled tentacles are cleanly cut out and transparent, with no residual solid backdrop.
2. **Square Canvas:** Maintain **1024 × 1024 pixels** (1:1).
3. **Verification:** Confirm `hasAlpha: true`, `isOpaque: false`, transparent ratio ~40–60%.
4. **Destination:** Save to `public/assets/zombies/sea_monster.png` (and mirror for `boss_sea_monster.png`).

---

## Summary Reference Table

| # | Asset Filename | Enemy ID | Category | Priority | Ratio | Resolution | Core Visual Theme |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---|
| 1 | `zombie_tank.png` | `zombie_tank` | Elite Brute | P1 | 2:3 | 512 × 768 | Keratin-armored juggernaut, boulder fists |
| 2 | `zombie_ma_vo_hinh.png` | `zombie_ma_vo_hinh` | Stealth | P1 | 2:3 | 512 × 768 | Translucent optical camo, dark violet mist |
| 3 | `zombie_xuyen_thung.png` | `zombie_xuyen_thung` | Elite Impaler | P1 | 2:3 | 512 × 768 | 1m calcified bone blade arm, back osteo-spikes |
| 4 | `football_zombie.png` | `zombie_football` | Armored | P2 | 2:3 | 512 × 768 | Muddy football armor, cracked helmet, charging tackle |
| 5 | `diving_zombie.png` | `zombie_diver` | Aquatic | P2 | 2:3 | 512 × 768 | Scuba wetsuit, twin oxygen tanks, speargun |
| 6 | `zombie_king.png` | `zombie_king` | Final Boss | Boss (P0) | 1:1 | 1024 × 1024 | 3.5m monarch, chitin armor, impaled swords, bone crown |
| 7 | `giant_puppet.png` | `giant_puppet` | Silo Boss | Boss (P1) | 1:1 | 1024 × 1024 | Bio-mechanical cyborg, hydraulic pistons, cable marionette |
| 8 | `sea_monster.png` | `sea_monster` | Leviathan Boss | Boss (P1) | 1:1 | 1024 × 1024 | Prehistoric undead whale, barnacles, kraken tentacles |

---
*Tài liệu này được tạo độc lập để phục vụ người dùng copy-paste trực tiếp lên các công cụ sinh ảnh AI bên ngoài (Midjourney, ChatGPT Image, Leonardo AI, v.v.) mà không cần phụ thuộc vào API quota nội bộ.*

