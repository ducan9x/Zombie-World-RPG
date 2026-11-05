# DANH SÁCH PROMPT SINH ẢNH AI (IMAGE GENERATION PROMPTS)
## DỰ ÁN: ZOMBIE WORLD RPG — BỘ ASSET ĐỒ HỌA MỸ THUẬT

Tài liệu này cung cấp toàn bộ Prompt tiếng Anh chuẩn Studio mỹ thuật dành cho các công cụ AI Image Generator (Midjourney v6, Stable Diffusion XL, Google Imagen 3, DALL-E 3) để tạo ra bộ tài nguyên hình ảnh đồng bộ phong cách **Dark Post-Apocalyptic Survival RPG** cho trò chơi **Zombie-World-RPG**.

---

## 1. QUY CHUẨN MỸ THUẬT CHUNG (ART STYLE GUIDELINES)

- **Phong cách chủ đạo:** Cinematic Dark Survival Horror RPG, Gritty Realism pha trộn Painterly Digital Art.
- **Tông màu (Palette):** Muted Desaturated, Dark Slate (`#1a1a2e`), Rust Orange, Toxic Green Lân Tinh, Dried Blood Red.
- **Ánh sáng (Lighting):** Volumetric Fog, High Contrast, Rim Lighting, Dramatic Shadows, Moody Post-Apocalyptic Atmosphere.
- **Negative Prompt chung cho toàn bộ:**
  ```text
  lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bright saturated cartoon, anime kawaii, happy cheerful, modern clean futuristic sci-fi
  ```

---

## 2. PROMPT CHI TIẾT THEO TỪNG NHÓM ASSET

### NHÓM A: GIAO DIỆN & BIỂU TƯỢNG (UI & ICONS)

#### Asset: `ui_main_menu_bg`
- **Tên asset:** Hình nền Menu chính
- **Mô tả hình ảnh:** Cổng vào căn cứ người sống sót trong hoang mạc mạt thế lúc chạng vạng. Hàng rào thép gai hoen rỉ, bao cát công sự, ngọn đèn pha rọi qua màn sương mù u ám, xa xa là bóng dáng thành phố đổ nát.
- **AI Prompt:**
  ```text
  Cinematic wide view of a post-apocalyptic survivor outpost entrance gate at dusk, heavily reinforced with rusty corrugated steel, concrete barriers, and concertina razor wire, dim flickering searchlight piercing through thick toxic atmospheric fog, ruined destroyed city skyline in the distant background, grim gritty survival horror video game aesthetic, 8k resolution, photorealistic digital painting, moody ambient occlusion, no humans, no text, no watermark --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Safe Area:** 70% trung tâm (giữ trống 15% biên trái và biên phải để không bị che bởi UI).
- **Ghi chú sử dụng:** Dùng làm hình nền cho màn hình khởi động game (`#name-setup`) và menu chính.

---

#### Asset: `ui_icon_hp`
- **Tên asset:** Icon Máu / Sức khỏe
- **Mô tả hình ảnh:** Trái tim sinh học giải phẫu sẫm màu được bảo vệ bởi khung kim loại cơ khí rỉ sét và bu-lông, phát ánh sáng đỏ thẫm sinh mệnh.
- **AI Prompt:**
  ```text
  Isolated tactical RPG game icon of a stylized biological human heart enclosed in heavy dark steel mechanical cage, glowing deep crimson red veins, subtle metallic rust and bolts, dark fantasy post-apocalyptic survival theme, clean silhouette, sharp crisp edges, volumetric rim light, dark studio background, asset icon design, no background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Safe Area:** 90% trung tâm, viền lề trống 10% để không bị lẹm viền khi thu nhỏ 24x24 trên mobile.
- **Ghi chú sử dụng:** Thay thế emoji `❤️` trong bảng trạng thái (`js/ui.js:140`).

---

#### Asset: `ui_icon_sanity`
- **Tên asset:** Icon Tinh thần / Sanity
- **Mô tả hình ảnh:** Bộ não người phát ánh sáng huỳnh quang xanh lam kỳ ảo, các nơ-ron thần kinh phát xung điện nhẹ, tượng trưng cho lý trí và sự tỉnh táo.
- **AI Prompt:**
  ```text
  Isolated game icon of a human brain glowing with ethereal cyan blue neural synapses, faint holographic psychic energy waves, dark steel cybernetic base, post-apocalyptic mental health indicator, crisp vector-like digital rendering, dark ambient rim light, transparent background, clean icon silhouette --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Thay thế emoji `🧠` trong bảng trạng thái.

---

#### Asset: `ui_icon_infection`
- **Tên asset:** Icon Nhiễm bệnh / Lây nhiễm
- **Mô tả hình ảnh:** Biểu tượng cảnh báo nguy hiểm sinh học (Biohazard) bằng kim loại đen bị ăn mòn, nhỏ giọt chất nhầy đột biến màu xanh lá dạ quang rực rỡ.
- **AI Prompt:**
  ```text
  Game UI icon of a corroded hazard biohazard symbol encrusted with radioactive toxic green slime droplets, glowing bioluminescent mutation particles, worn metallic texture, dark ominous zombie apocalypse tone, isolated on transparent background, high contrast graphic asset --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Thay thế emoji `🦠` trong bảng trạng thái.

---

#### Asset: `ui_icon_res_royal_coin`
- **Tên asset:** Icon Tiền Hoàng Gia
- **Mô tả hình ảnh:** Đồng tiền vàng đúc cổ kính thời mạt thế, mép viền dập nổi hoa văn vương miện của Quốc vương Karen, bề mặt có vết xước nhẹ của thời gian.
- **AI Prompt:**
  ```text
  RPG inventory icon of an antique solid gold royal coin, engraved with a detailed gothic crown emblem, sharp embossed edge, weathered micro-scratches on polished gold surface, gleaming reflections, dark survival feudal castle currency, isolated on transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Thay thế emoji `👑` trong bảng tiền tệ và giao diện đổi tiền Lâu Đài.

---

### NHÓM B: BẢN ĐỒ & ĐỊA DANH (WORLD & MAP BACKGROUNDS)

#### Asset: `map_lau_dai_tan_the_bg`
- **Tên asset:** Background Lâu Đài Tận Thế (Karen's Castle)
- **Mô tả hình ảnh:** Tòa lâu đài kiến trúc Gothic kiên cố bằng đá xám khổng lồ ngự trị trên đỉnh đồi đá, được gia cố thêm tường thép hiện đại và tháp súng máy. Ánh đèn chùm vàng ấm áp rực rỡ hắt ra từ các ô cửa kính màu, tương phản với khung cảnh hoang tàn lạnh lẽo bên ngoài.
- **AI Prompt:**
  ```text
  Epic wide exterior shot of an imposing gothic stone fortress castle standing tall amidst post-apocalyptic wasteland, reinforced with modern steel blast plates, barbed wire, and sniper watchtowers, warm golden chandelier lights glowing brightly from arched stained-glass windows, dark cloudy twilight stormy sky, dramatic shadows, cinematic survival horror RPG environmental art, 8k concept art, no text, no watermark --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Safe Area:** Tòa lâu đài nằm ở trung tâm 60% bức ảnh để hỗ trợ crop responsive cả trên màn hình điện thoại dọc.
- **Ghi chú sử dụng:** Background khi người chơi đến địa điểm `lau_dai_tan_the`.

---

#### Asset: `map_benh_vien_ngoai_thanh_bg`
- **Tên asset:** Background Bệnh Viện Bỏ Hoang
- **Mô tả hình ảnh:** Hành lang bệnh viện dã chiến tối tăm, tường bong tróc, sàn nhà bẩn thỉu rải rác vỏ thuốc và vết máu khô kéo dài. Một chiếc xe lăn gãy bánh đổ nghiêng, một ngọn đèn huỳnh quang treo lủng lẳng chập chờn.
- **AI Prompt:**
  ```text
  First-person perspective of an abandoned hospital interior corridor, cracked green paint on peeling walls, overturned rusty wheelchair, scattered medical supply boxes on dirty tiled floor, ominous dried blood trails leading into dark patient rooms, single flickering fluorescent ceiling light casting long eerie shadows, survival horror atmosphere, photorealistic atmospheric concept art --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Ghi chú sử dụng:** Background khi khám phá `benh_vien_ngoai_thanh`.

---

#### Asset: `map_to_zombie_bg`
- **Tên asset:** Background Tổ Zombie (Zombie Nest)
- **Mô tả hình ảnh:** Hang ổ ngầm tăm tối dưới lòng đất, vách đá bị bao phủ bởi chất nhờn hữu cơ đen nhớp nháp và những kén sinh học màu đỏ thẫm phát sáng mờ. Hàng trăm bộ xương trắng vương vãi, không khí đặc quánh mùi chết chóc.
- **AI Prompt:**
  ```text
  Horrific underground zombie hive lair interior, rocky cavern walls covered in pulsating dark organic bioluminescent biomass and deep red fleshy pods, scattered human skeletons, eerie dim sickly green vapor mist rising from subterranean crevasses, nightmarish boss arena environment, cinematic lighting, 8k Unreal Engine 5 render style, no text --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Ghi chú sử dụng:** Background trận chiến và khám phá `to_zombie`.

---

#### Asset: `map_co_so_vu_tru_bg`
- **Tên asset:** Background Trung Tâm Phóng Tên Lửa
- **Mô tả hình ảnh:** Bệ phóng tên lửa khổng lồ sừng sững giữa sa mạc phế tích hoang vắng. Tên lửa vũ trụ kim loại màu bạc bạc màu phủ bụi thời gian, giàn giáo kỹ thuật bao quanh, dây cáp công nghiệp khổng lồ chằng chịt.
- **AI Prompt:**
  ```text
  Massive space launch center complex in a desolate desert wasteland, colossal weathered silver orbital rocket poised on heavy launch pad surrounded by steel scaffolding towers, thick industrial hanging cables, overcast brooding sky with orange sunset light breaking through stormy clouds, solemn epic tone, endgame sci-fi survival RPG art --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Ghi chú sử dụng:** Background địa điểm `co_so_vu_tru_tuyet_mat` (Endgame Rocket).

---

### NHÓM C: NHÂN VẬT, NPC & BOSS (PORTRAITS & COMBAT SPRITES)

#### Asset: `char_npc_v_portrait`
- **Tên asset:** Chân dung Chị V
- **Mô tả hình ảnh:** Chân dung bán thân nữ chiến binh sinh tồn khoảng 28 tuổi, tóc ngắn ngang vai đen tuyền lọn rối, ánh mắt sắc bén từng trải, gò má có vết sẹo nhỏ. Mặc áo khoác rằn ri quân sự mở khóa để lộ áo thun xám, quàng khăn rằn, dây đeo chéo giữ bao súng ngắn.
- **AI Prompt:**
  ```text
  Character portrait of a battle-hardened female survivor 'Sister V', 28 years old, short messy black bob hair, intense sharp dark eyes, small faint scar across left cheekbone, wearing a weathered tactical combat vest over worn grey undershirt, dark survivalist scarf around neck, gritty realistic face with dirt smudges, determined expression, dramatic cinematic side-rim lighting, dark slate background, transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `512x512`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Avatar đại diện khi giao tiếp và nhận nhiệm vụ với Chị V.

---

#### Asset: `char_npc_xiaohan_portrait`
- **Tên asset:** Chân dung Tô Tiểu Hàm
- **Mô tả hình ảnh:** Cô gái trẻ khoảng 20 tuổi với nụ cười dịu dàng ấm áp giữa mạt thế hoang tàn, tóc buộc đuôi ngựa buộc lỏng, mặc áo len dệt màu kem hơi sờn vai, hai tay ôm bình sữa thủy tinh có nắp bọc vải.
- **AI Prompt:**
  ```text
  Character portrait of a gentle kind-hearted young female survivor named Xiao Han, 20 years old, soft ponytail brown hair, warm comforting smile, bright compassionate eyes, wearing an oversized faded cream knit sweater, holding a vintage glass milk bottle, soft warm rim lighting contrasting with subtle grim wasteland dust, isolated transparent background, character bust art --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `512x512`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Avatar hội thoại của Tiểu Hàm.

---

#### Asset: `boss_zombie_king_sprite`
- **Tên asset:** Sprite Boss Vua Zombie Im Lặng (Thi Vương Tịch Diệt)
- **Mô tả hình ảnh:** Con quái vật xác sống khổng lồ gấp 3 lần người thường, da đen thẫm như áo giáp vảy sừng, đôi mắt đỏ ngầu rực lửa hận thù. Trên lưng và ngực cắm đầy những lưỡi gươm gãy, đao và mảnh đạn kim loại rỉ sét của những chiến binh từng bại trận.
- **AI Prompt:**
  ```text
  Full body concept sprite of the legendary Zombie King Boss, gigantic towering humanoid undead brute, thick obsidian black chitinous mutated skin, glowing malevolent red eyes, multiple shattered swords, daggers and iron spears embedded in its scarred muscular chest and back, dark necrotic aura radiating, menacing stance, survival horror final boss monster, isolated on transparent background, full body view --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `1024x1024`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Sprite đối thủ trong trận đánh Boss `zombie_king`.

---

#### Asset: `boss_sea_monster_sprite`
- **Tên asset:** Sprite Boss Hải Zombie Khổng Lồ
- **Mô tả hình ảnh:** Sinh vật cổ đại biển sâu bị nhiễm virus zombie khổng lồ: thân thể như một con cá voi bọc vảy sừng đen thối rữa, hai bên sườn vươn ra hàng chục xúc tu bạch tuộc khổng lồ đầy gai nhọn, hàm răng lởm chởm như răng cá mập tiền sử.
- **AI Prompt:**
  ```text
  Terrifying deep-sea zombie leviathan boss creature, massive decaying whale-like body covered in armored black barnacle scales, dozens of undulating monstrous kraken tentacles sprouting from its flanks, gaping jaws lined with jagged prehistoric teeth, pale milky blind glowing eyes, dripping sea brine, Eldritch aquatic horror, isolated on transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `1024x1024`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Sprite đối thủ trong trận săn Boss biển sâu tại sự kiện `wolf.js`.

---

### NHÓM D: HIỆU ỨNG CHIẾN ĐẤU & CHIẾN TRƯỜNG (COMBAT VFX & ARENAS)

#### Asset: `vfx_blood_splatter`
- **Tên asset:** Hiệu ứng Vết Máu Bắn Màn Hình
- **Mô tả hình ảnh:** Vết máu đỏ tươi bắn tung tóe từ bốn góc màn hình, có những vệt máu rỉ xuống từ từ tạo cảm giác nhân vật vừa bị quái vật cắn trúng chí mạng.
- **AI Prompt:**
  ```text
  Photorealistic screen splatter overlay of dark arterial red blood droplets and streaks splashing across clear glass lens, high dynamic range, crisp droplets, cinematic combat damage vignette effect, isolated on black background, additive alpha blending ready --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `1024x1024`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Overlay chớp lên màn hình khi người chơi mất máu nặng trong `js/combat.js`.

---

#### Asset: `vfx_critical_hit`
- **Tên asset:** Hiệu ứng Bạo Kích (Critical Slash Flash)
- **Mô tả hình ảnh:** Vết chém xé toạc không gian bằng tia sét vàng kim rực rỡ, kèm theo mảnh kính vỡ và các hạt năng lượng bùng nổ, biểu thị đòn đánh gây sát thương chí mạng.
- **AI Prompt:**
  ```text
  Explosive golden critical strike flash FX, sharp diagonal energy slash blade of bright amber lightning, shattered glass particle sparks flying, dynamic action anime-realism VFX element, intense high impact bloom, isolated on transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `512x512`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Hiệu ứng hiển thị khi đòn đánh kích hoạt `isCrit = true`.

---

### NHÓM E: VẬT PHẨM & TRANG BỊ CHIẾN LƯỢC (ITEMS & EQUIPMENT)

#### Asset: `item_med_serum`
- **Tên asset:** Icon Huyết Thanh Kháng Nhiễm
- **Mô tả hình ảnh:** Ống tiêm thủy tinh y tế bọc khung kim loại bảo vệ, bên trong chứa dung dịch kháng thể virus phát ánh sáng xanh dương neon rực rỡ, bọt khí li ti bên trong.
- **AI Prompt:**
  ```text
  Tactical RPG inventory icon of a military anti-infection serum injector, reinforced glass vial encased in titanium casing, filled with glowing luminescent cyan medicine liquid, micro bubbles, sterile scientific asset, clean 45-degree angle product view, isolated on transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Icon cho vật phẩm `huyet_thanh` trong kho đồ.

---

#### Asset: `item_gun_sniper_m700`
- **Tên asset:** Icon Súng Bắn Tỉa M700
- **Mô tả hình ảnh:** Khẩu súng trường bắn tỉa M700 màu đen nhám đặt chéo góc, báng súng polymer cao cấp, gắn ống ngắm bắn tỉa quang học tầm xa cỡ lớn và đầu giảm thanh.
- **AI Prompt:**
  ```text
  Inventory game icon of an M700 bolt-action tactical sniper rifle, matte black synthetic stock, heavy fluted barrel, precision high-magnification optical scope mounted, detailed metal receiver, clean isometric 45 degree angle, isolated on transparent background --ar 1:1
  ```
- **Aspect Ratio:** `1:1`
- **Source Size:** `256x256`
- **Format:** `PNG` (Transparent Background)
- **Ghi chú sử dụng:** Icon hiển thị súng M700 (phần thưởng Tiến Sĩ Trần / Quest Hoàng Hậu 4).

---

### NHÓM F: TRANH MINH HỌA CỐT TRUYỆN (STORY & ENDING CG)

#### Asset: `story_cg_rocket_launch`
- **Tên asset:** CG Kết thúc 1 — Tên Lửa Thoát Ly
- **Mô tả hình ảnh:** Tên lửa không gian khổng lồ khai hỏa gầm rú, luồng lửa vàng cam rực cháy bốc khói cuồn cuộn soi sáng cả sa mạc đêm đen, từ từ bay vút lên bầu trời sao thoát khỏi hành tinh Trái Đất đầy rẫy đại dịch zombie.
- **AI Prompt:**
  ```text
  Breathtaking cinematic wide CG illustration of a colossal spacecraft rocket launching into starry night sky, roaring massive bright orange thruster flame illuminating billows of thick smoke and desert wasteland launchpad below, dramatic low angle perspective, sense of monumental triumph and bittersweet escape from dying zombie planet, 8k cinematic key art, masterpiece, no text --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Ghi chú sử dụng:** Minh họa toàn màn hình khi người chơi kích hoạt Ending 1: Thoát khỏi Trái Đất.

---

#### Asset: `story_cg_mermaid`
- **Tên asset:** CG Kết thúc 13 — Người Cá & Biển Sâu
- **Mô tả hình ảnh:** Sau khi quái vật Hải Zombie gục ngã, mặt biển đêm tĩnh lặng trở lại. Dưới ánh trăng rằm bàng bạc soi sáng từng con sóng, một người cá xinh đẹp với mái tóc đen dài và chiếc đuôi phủ vảy cá óng ánh từ từ trồi lên khỏi mặt nước, ánh mắt dịu dàng nhìn người chơi trên mạn thuyền.
- **AI Prompt:**
  ```text
  Enchanting and hauntingly beautiful cinematic CG art of a mystical mermaid emerging from dark calm ocean waters under bright full moonlight, long flowing wet dark hair, iridescent shimmering scales on mermaid tail reflecting silver moonbeams, serene peaceful ocean surface, misty horizon, emotional ending scene for dark survival RPG, 8k resolution, romantic gothic fantasy key art, no text --ar 16:9
  ```
- **Aspect Ratio:** `16:9`
- **Source Size:** `1920x1080`
- **Format:** `WebP`
- **Background:** `Opaque`
- **Ghi chú sử dụng:** Minh họa kết cục bí mật Ending 13: Gặp gỡ Người Cá.

