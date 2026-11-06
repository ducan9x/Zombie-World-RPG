# ĐẶC TẢ KỸ THUẬT VÀ TẠO ẢNH BATCH 04 — ZOMBIES & MONSTER ASSETS
## DỰ ÁN: ZOMBIE WORLD RPG — PHASE 1.5 GRAPHICS EXPANSION

**Thời gian lập đặc tả:** 2026-11-06 08:38:00 (ICT)  
**Phiên bản:** v1.0 (Chuẩn hóa toàn diện 21 Zombie & Monster Assets)  
**Trạng thái triển khai:** `PENDING_GENERATION` (Đã audit source code, đồng bộ manifest và thiết lập prompt; chưa sinh ảnh)

---

## 1. MỤC TIÊU VÀ PHẠM VI

Batch 04 tập trung vào toàn bộ hệ thống kẻ địch thù địch trong Zombie World RPG, bao gồm **21 asset sinh vật**:
1. **16 Zombie thường & tinh nhuệ** trong `js/data/entities/zombies.js` xuất hiện theo các tầng nguy hiểm (Low, Mid, High, Extreme, Hell) tại 21 bản đồ.
2. **5 Quái vật Boss & Biến dị đặc biệt** trong `js/data/entities/npcs.js` (`NAMED_NPCS`) gắn liền với các trận đánh Boss và cốt truyện mạt thế.

### Nguyên tắc mỹ thuật & kỹ thuật:
- **Phong cách:** Dark Post-apocalyptic Survival RPG, semi-realistic 3D game character art.
- **Ánh sáng:** Chiếu sáng điện ảnh góc xiên từ trên bên trái (cinematic rim lighting from top-left).
- **Chất liệu:** Mô tả chân thực da thịt phân hủy, gân máu căng tức, xương gãy, giáp kim loại hoen gỉ, dịch độc axit và bọc mủ sinh học.
- **Định dạng:** PNG 32-bit (True RGBA, kênh Alpha trong suốt > 60%).
- **Bố cục:** Toàn thân (Full Body) trong tư thế chiến đấu (Combat Stance), đứng chính giữa, không crop đầu/chân, không viền giả caro (checkerboard), không text/watermark.

---

## 2. BẢNG DANH MỤC 21 ASSET BATCH 04

| STT | Mã Asset (ID) | Tên Kẻ Địch | Phân Loại | Kích Thước | Tỷ Lệ | File Đích (`public/assets/zombies/`) | Nguồn Source Code | Mức Độ | Trạng Thái |
|:---:|---|---|---|:---:|:---:|---|---|:---:|:---:|
| 1 | `zombie_lang_dao` | Zombie Lãng Du Thường | Zombie Thường | 512×768 | 2:3 | `zombie_lang_dao.png` | `zombies.js (zombie_lang_dao)` | P0 | `PENDING` |
| 2 | `zombie_thay_rach` | Thây Rách | Zombie Thường | 512×768 | 2:3 | `zombie_thay_rach.png` | `zombies.js (zombie_thay_rach)` | P1 | `PENDING` |
| 3 | `zombie_bo` | Zombie Bò | Zombie Bò Trườn | 512×768 | 2:3 | `zombie_bo.png` | `zombies.js (zombie_bo)` | P1 | `PENDING` |
| 4 | `zombie_nhanh` | Zombie Chạy Nhanh | Zombie Nhanh | 512×768 | 2:3 | `zombie_nhanh.png` | `zombies.js (zombie_nhanh)` | P0 | `PENDING` |
| 5 | `zombie_beo` | Zombie Béo Phì | Zombie Hạng Nặng | 512×768 | 2:3 | `zombie_beo.png` | `zombies.js (zombie_beo)` | P1 | `PENDING` |
| 6 | `zombie_no` | Zombie Nổ | Zombie Cảm Tử | 512×768 | 2:3 | `zombie_no.png` | `zombies.js (zombie_no)` | P0 | `PENDING` |
| 7 | `zombie_quan_canh` | Zombie Quân Cảnh | Zombie Bọc Giáp | 512×768 | 2:3 | `zombie_quan_canh.png` | `zombies.js (zombie_quan_canh)` | P0 | `PENDING` |
| 8 | `zombie_me_nhom` | Mẹ Zombie Bầy Đàn | Zombie Tổ Đàn | 512×768 | 2:3 | `zombie_me_nhom.png` | `zombies.js (zombie_me_nhom)` | P1 | `PENDING` |
| 9 | `zombie_giap_sat` | Zombie Giáp Sắt | Zombie Bọc Giáp | 512×768 | 2:3 | `zombie_giap_sat.png` | `zombies.js (zombie_giap_sat)` | P1 | `PENDING` |
| 10 | `zombie_bang_gia` | Zombie Băng Giá | Zombie Nguyên Tố | 512×768 | 2:3 | `zombie_bang_gia.png` | `zombies.js (zombie_bang_gia)` | P1 | `PENDING` |
| 11 | `zombie_dien_cuong` | Zombie Cuồng Nộ | Zombie Tinh Nhuệ | 512×768 | 2:3 | `zombie_dien_cuong.png` | `zombies.js (zombie_dien_cuong)` | P0 | `PENDING` |
| 12 | `zombie_axit` | Zombie Phun Axit | Zombie Tầm Xa | 512×768 | 2:3 | `zombie_axit.png` | `zombies.js (zombie_axit)` | P0 | `PENDING` |
| 13 | `zombie_nhay` | Zombie Nhảy | Zombie Nhảy Vồ | 512×768 | 2:3 | `zombie_nhay.png` | `zombies.js (zombie_nhay)` | P1 | `PENDING` |
| 14 | `zombie_tank` | Zombie Xe Tăng | Zombie Đột Biến | 512×768 | 2:3 | `zombie_tank.png` | `zombies.js (zombie_tank)` | P0 | `PENDING` |
| 15 | `zombie_ma_vo_hinh` | Zombie Vô Hình | Zombie Ảo Ảnh | 512×768 | 2:3 | `zombie_ma_vo_hinh.png` | `zombies.js (zombie_ma_vo_hinh)` | P1 | `PENDING` |
| 16 | `zombie_xuyen_thung` | Zombie Xuyên Thủng | Zombie Gai Xương | 512×768 | 2:3 | `zombie_xuyen_thung.png` | `zombies.js (zombie_xuyen_thung)` | P1 | `PENDING` |
| 17 | `boss_zombie_king` | Vua Zombie Im Lặng | Boss Tối Cao | 1024×1024 | 1:1 | `boss_zombie_king.png` | `npcs.js (zombie_king)` | P0 | `PENDING` |
| 18 | `boss_giant_puppet` | Cỗ Rối Khổng Lồ | Boss Cơ Khí | 1024×1024 | 1:1 | `boss_giant_puppet.png` | `npcs.js (giant_puppet)` | P1 | `PENDING` |
| 19 | `boss_sea_monster` | Hải Zombie Khổng Lồ | Boss Biển Sâu | 1024×1024 | 1:1 | `boss_sea_monster.png` | `npcs.js (sea_monster)` | P1 | `PENDING` |
| 20 | `zombie_football` | Zombie Bóng Bầu Dục | Zombie Đặc Biệt | 512×768 | 2:3 | `zombie_football.png` | `npcs.js (football_zombie)` | P2 | `PENDING` |
| 21 | `zombie_diver` | Zombie Thợ Lặn | Zombie Đặc Biệt | 512×768 | 2:3 | `zombie_diver.png` | `npcs.js (diving_zombie)` | P2 | `PENDING` |

---

## 3. CHI TIẾT PROMPT TẠO ẢNH CHO TỪNG KẺ ĐỊCH

Negative Prompt chuẩn hóa:
```text
cropped head, cropped feet, out of frame, cut off, partial body, portrait only, text, watermark, signature, username, anime kawaii, bright cartoon, chibi, futuristic high-tech sci-fi, cyberpunk neon, superhero, friendly, smiling, healthy skin, blurry, solid background, white box backdrop, checkerboard pattern, decorative scenery, weapons blocking body
```

### 1. Zombie Lãng Du Thường (`zombie_lang_dao.png`)

- **Asset ID:** `zombie_lang_dao`
- **Nguồn Source Code:** `zombie_lang_dao` (Chỉ số: {"hp":120,"damage":16,"dodge":0.05,"ability":["infect"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_lang_dao.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống lang thang phổ biến nhất trong thế giới tận thế: da xám xanh tái nhợt, mắt trắng đục vô hồn, quần áo thường dân rách tơi tả, hàm há hốc nhỏ dãi máu đen.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a classic wandering undead zombie in a ruined city, pale sickly grayish-blue decaying flesh, milky blind clouded eyes, ragged tattered blood-stained civilian clothes, gaping jaw with black necrotic saliva, aggressive shambling forward stance with outstretched clawing hands, dark post-apocalyptic survival horror RPG aesthetic, semi-realistic 3D game character art, dramatic rim lighting, gritty realistic textures, whole body visible from head to tattered shoes, isolated on solid transparent background, strictly no background, no text, no watermark --ar 2:3
```

---
### 2. Thây Rách (`zombie_thay_rach.png`)

- **Asset ID:** `zombie_thay_rach`
- **Nguồn Source Code:** `zombie_thay_rach` (Chỉ số: {"hp":100,"damage":24,"dodge":0,"ability":["infect"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_thay_rach.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống phân hủy nặng nề, da thịt bong tróc từng mảng lớn lộ rõ lồng ngực và xương sườn, tứ chi méo mó nhưng tấn công cực kỳ tàn bạo.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a heavily mutilated torn-flesh zombie, shredded rotting skin revealing exposed ribcage and bloody muscle sinew, missing jaw flesh, torn rags barely clinging to skeletal frame, aggressive lunging posture, dripping gore and dark necrotic fluids, dark post-apocalyptic survival horror RPG aesthetic, semi-realistic digital illustration, sharp silhouette isolated on solid transparent background, whole body visible from head to feet, no cropped limbs, no text, no watermark --ar 2:3
```

---
### 3. Zombie Bò (`zombie_bo.png`)

- **Asset ID:** `zombie_bo`
- **Nguồn Source Code:** `zombie_bo` (Chỉ số: {"hp":60,"damage":14,"dodge":0.2,"ability":["infect","trip"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_bo.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Zombie gãy chân hoặc cụt nửa thân dưới, bò trườn cực nhanh sát mặt đất bằng hai cánh tay gầy guộc móng nhọn, chuyên gạt ngã người sống sót.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body creature sprite of a mutilated crawler zombie crawling low on the ground, dragging broken crushed legs, extremely powerful elongated bony arms with dirty sharp claw fingers digging into ground, head tilted upwards with rabid predatory glare, shredded filthy shirt, dark survival horror RPG aesthetic, semi-realistic 3D character art, isolated on solid transparent background, centered composition, whole creature fully visible, no cropped limbs, no text, no watermark --ar 2:3
```

---
### 4. Zombie Chạy Nhanh (`zombie_nhanh.png`)

- **Asset ID:** `zombie_nhanh`
- **Nguồn Source Code:** `zombie_nhanh` (Chỉ số: {"hp":80,"damage":30,"dodge":0.35,"ability":["infect","screech"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_nhanh.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống đột biến tốc độ cao: thân hình gầy guộc khẳng khiu, mạch máu đỏ tươi căng phồng dưới da, miệng ngoác rộng phát ra tiếng thét chói tai.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a terrifying feral runner zombie caught in an explosive sprint attack stance, emaciated sinewy athletic body with pulsing dark red veins visible beneath pale stretched skin, jaw unhinged in a blood-curdling screech, feral wild bloodshot eyes, razor-sharp blackened fingernails, torn ragged athletic apparel, dynamic menacing posture, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game art, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 5. Zombie Béo Phì (`zombie_beo.png`)

- **Asset ID:** `zombie_beo`
- **Nguồn Source Code:** `zombie_beo` (Chỉ số: {"hp":240,"damage":20,"dodge":0,"ability":["infect","selfDestruct"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_beo.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Khối thịt thối trương phình khổng lồ đầy mỡ nhớp nhúa, da nứt nẻ rỉ dịch vàng nhớt, bụng to quá khổ sắp phát nổ tự sát khi bị tiêu diệt.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a grotesque bloated zombie (bloater), morbidly swollen massive mutated corpse body with stretched mottled green and sickly yellow skin, weeping sores and putrid boils across bloated torso, ripped straining dirty clothes, sluggish heavy threatening stance, sickly dim yellow glowing fluid beneath taut translucent belly skin, dark post-apocalyptic survival horror aesthetic, semi-realistic digital illustration, clean silhouette on transparent background, full body visible from head to bloated feet, no text, no watermark --ar 2:3
```

---
### 6. Zombie Nổ (`zombie_no.png`)

- **Asset ID:** `zombie_no`
- **Nguồn Source Code:** `zombie_no` (Chỉ số: {"hp":120,"damage":18,"dodge":0,"ability":["explosive"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_no.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Zombie mang các bọc mủ hóa chất sinh học phát sáng màu cam đỏ trên lưng và ngực, luôn điên cuồng lao vào người chơi để kích hoạt khối nổ.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a volatile explosive zombie (suicide bomber mutant), torso and hunchback encrusted with volatile pulsing bioluminescent fiery orange and toxic amber chemical pustules on the verge of detonating, charred smoking skin patches, frantic rabid charging stance, cracked crazed facial expression, dark survival horror RPG aesthetic, semi-realistic 3D game character art, dramatic rim light, isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 7. Zombie Quân Cảnh (`zombie_quan_canh.png`)

- **Asset ID:** `zombie_quan_canh`
- **Nguồn Source Code:** `zombie_quan_canh` (Chỉ số: {"hp":160,"damage":36,"dodge":0.1,"ability":["infect","corrode"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_quan_canh.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống cảnh sát chống bạo động: mang áo giáp kevlar rách nát, mũ bảo hiểm vỡ kính che mặt lộ đôi mắt đỏ ngầu, tay cầm dùi cùi gỉ sét đẫm máu.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of an undead SWAT riot police zombie, wearing heavily scratched cracked black tactical body armor, shattered visor riot helmet revealing half of a snarling decaying face with hollow glowing eyes, battered utility belt, heavy tactical combat boots, holding a rusted bloodied police baton, sturdy menacing combat stance, dark gritty post-apocalyptic survival RPG aesthetic, semi-realistic digital art, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 8. Mẹ Zombie Bầy Đàn (`zombie_me_nhom.png`)

- **Asset ID:** `zombie_me_nhom`
- **Nguồn Source Code:** `zombie_me_nhom` (Chỉ số: {"hp":140,"damage":16,"dodge":0,"ability":["summon"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_me_nhom.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống cái đột biến dạng tổ kén, lưng gù mang các bọc trứng sinh học nhớp nhúa có khả năng triệu hồi bầy đàn zombie con vây hãm con mồi.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a grotesque broodmother zombie (Hive Mother), hunched mutated female infected creature with clusters of pulsating dark purple and slimy organic egg sacs growing out of her mutated back and shoulders, elongated clawed hands, hollow shrieking mouth, tattered decayed dress, dark biological horror aesthetic, semi-realistic 3D character art, isolated on transparent background, full body visible from head to clawed feet, no cropped limbs, no text, no watermark --ar 2:3
```

---
### 9. Zombie Giáp Sắt (`zombie_giap_sat.png`)

- **Asset ID:** `zombie_giap_sat`
- **Nguồn Source Code:** `zombie_giap_sat` (Chỉ số: {"hp":280,"damage":22,"dodge":0,"ability":["armor","infect"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_giap_sat.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống công nhân nhà máy bị các tấm thép, đinh tán và xích sắt găm sâu vào cơ thể qua các vết thương, tạo thành lớp giáp tự nhiên chống chịu cực cao.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of an ironclad armored industrial zombie, body fused with rusted heavy iron plates, barbed wire, and metal rebars embedded directly through rotting muscle and bone, wearing heavy steel-toed work boots and torn grease-stained welder pants, towering brutal stance, dark post-apocalyptic industrial horror aesthetic, semi-realistic digital illustration, clean silhouette on transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 10. Zombie Băng Giá (`zombie_bang_gia.png`)

- **Asset ID:** `zombie_bang_gia`
- **Nguồn Source Code:** `zombie_bang_gia` (Chỉ số: {"hp":150,"damage":26,"dodge":0.1,"ability":["freeze"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_bang_gia.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống đông lạnh trong hầm lạnh: da tím xanh bao phủ bởi lớp băng tuyết và gai băng sắc nhọn, phát ra luồng hàn khí làm đông cứng đối thủ.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a frozen frost zombie, pale cyan and indigo frostbitten flesh covered in jagged glacial ice shards and sharp frozen icicles protruding from shoulders and spine, exhaling freezing cold mist, tattered frost-crusted winter parka, glowing icy blue dead eyes, rigid menacing combat posture, dark survival RPG aesthetic, semi-realistic 3D game art, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 11. Zombie Cuồng Nộ (`zombie_dien_cuong.png`)

- **Asset ID:** `zombie_dien_cuong`
- **Nguồn Source Code:** `zombie_dien_cuong` (Chỉ số: {"hp":200,"damage":50,"dodge":0.05,"ability":["blind","corrode"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_dien_cuong.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Quái vật zombie cuồng nộ cơ bắp đỏ rực, mắt rực lửa hung hãn, gân guốc nổi chằng chịt, tấn công như vũ bão với sát thương cực kỳ khủng khiếp.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a savage berserker zombie brute, towering muscular physique with hyper-developed swollen red muscle tissue and thick black veins, ferocious snarling face with foaming bloody maw, massive claw-tipped hands dripping dark acidic blood, torn combat trousers, aggressive forward-charging battle pose, dark survival horror RPG aesthetic, semi-realistic 3D game character art, dramatic rim lighting, isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 12. Zombie Phun Axit (`zombie_axit.png`)

- **Asset ID:** `zombie_axit`
- **Nguồn Source Code:** `zombie_axit` (Chỉ số: {"hp":240,"damage":28,"dodge":0.05,"ability":["acid"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_axit.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống đột biến tuyến nọc độc: cổ họng phồng to phát sáng xanh lục sinh học, hàm dưới tách đôi rỉ axit đậm đặc ăn mòn vũ khí và trang bị.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a venomous acid spitter zombie, swollen throat sac glowing with virulent bioluminescent emerald green corrosive bile, mutated split mandibles dripping smoking green acid that corrodes the air, skeletal hunchbacked body with corrosive acid burns across flesh, tattered hazmat remnants, crouched ready-to-spit stance, dark survival horror RPG aesthetic, semi-realistic digital painting, isolated on solid transparent background, full body view, no text, no watermark --ar 2:3
```

---
### 13. Zombie Nhảy (`zombie_nhay.png`)

- **Asset ID:** `zombie_nhay`
- **Nguồn Source Code:** `zombie_nhay` (Chỉ số: {"hp":100,"damage":38,"dodge":0.35,"ability":["leap","infect"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_nhay.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Zombie có cơ đùi sau phát triển dị thường như loài thú săn mồi, luôn co mình trên các gờ tường rồi nhảy vồ từ trên cao xuống xé nát con mồi.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of an agile mutated leaper zombie (hunter infected), coiled in a tense predatory crouching stance ready to leap, hyper-developed muscular legs with elongated talons, sinewy lean torso with extended arm claws, feral twitching head with white predatory eyes, shredded rags, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game art, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 14. Zombie Xe Tăng Khổng Lồ (`zombie_tank.png`)

- **Asset ID:** `zombie_tank`
- **Nguồn Source Code:** `zombie_tank` (Chỉ số: {"hp":300,"damage":40,"dodge":0,"ability":["selfDestruct"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_tank.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Quái vật zombie thể hình hộ pháp như xe bọc thép: cơ bắp dày đặc hóa sừng bất khả xâm phạm, vai u thịt bắp khổng lồ nghiền nát mọi chướng ngại vật.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a colossal zombie tank brute (Juggernaut), immense hulking mutated anatomy with thick hardened calloused keratin armor plating over shoulders and upper body, massive boulder-like fists capable of smashing concrete, brutal imposing combat stance, tiny glowing red eyes in a thick scarred skull, dark survival horror RPG aesthetic, semi-realistic 3D game character art, dramatic top-left lighting, clean silhouette isolated on transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 15. Zombie Vô Hình (`zombie_ma_vo_hinh.png`)

- **Asset ID:** `zombie_ma_vo_hinh`
- **Nguồn Source Code:** `zombie_ma_vo_hinh` (Chỉ số: {"hp":80,"damage":30,"dodge":0.5,"ability":["cloak"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_ma_vo_hinh.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống bóng ma có khả năng bẻ cong ánh sáng: thân hình mờ ảo nửa trong suốt như ảo ảnh khói đen, thoắt ẩn thoắt hiện tiếp cận bất ngờ.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a sinister stealth cloaked shadow zombie, ethereal semi-translucent decaying form with shimmering optical camouflage distortion and wisps of dark smoky necrotic mist flowing around its silhouette, faintly visible pale skeletal facial bones and glowing spectral violet eyes, silent stalking pose, dark survival horror aesthetic, semi-realistic digital illustration, clean sharp edges isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 16. Zombie Xuyên Thủng (`zombie_xuyen_thung.png`)

- **Asset ID:** `zombie_xuyen_thung`
- **Nguồn Source Code:** `zombie_xuyen_thung` (Chỉ số: {"hp":180,"damage":42,"dodge":0.12,"ability":["impale","corrode"]})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_xuyen_thung.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Zombie biến dị cấu trúc xương: cánh tay phải biến đổi thành lưỡi gươm xương nhọn hoắt dài hơn 1 mét, lưng mọc đầy gai xương xuyên giáp.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a terrifying bone impaler zombie, right arm horribly mutated into a massive razor-sharp elongated bone blade spear, sharp calcified bone spikes protruding through back and shoulders, lean predatory stance with piercing blade leveled forward, scarred decaying torso, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game character art, dramatic lighting, isolated on solid transparent background, full body visible from skull to feet, no text, no watermark --ar 2:3
```

---
### 17. Vua Zombie Im Lặng (`boss_zombie_king.png`)

- **Asset ID:** `boss_zombie_king`
- **Nguồn Source Code:** `zombie_king` (Chỉ số: {"hp":420,"damage":115,"dodgeRate":0.25})
- **Đường dẫn file đích:** `public/assets/zombies/boss_zombie_king.png`
- **Kích thước & Tỷ lệ:** 1024×1024 (1:1), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Chúa tể tối cao của Tổ Zombie: đại quái vật hình người cao hơn 3 mét, da bọc giáp kitin đen tuyền, trên ngực và lưng cắm đầy vũ khí gãy của những kẻ thách đấu trước đó, tỏa ra hắc khí tử thần.
- **Độ ưu tiên:** P0 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body concept sprite of the legendary Silent Zombie King Boss (Thi Vương Tịch Diệt), gigantic towering humanoid undead monarch standing over 3 meters tall, thick obsidian-black mutated chitinous armor skin, malevolent crimson glowing eyes beneath a crown of mutated bone horns, shattered ancient swords, daggers and iron spears embedded in scarred muscular chest and back, dark necrotic miasma aura radiating around silhouette, dominating menacing final boss stance, survival horror RPG masterpiece, semi-realistic 3D character art, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 1:1
```

---
### 18. Cỗ Rối Khổng Lồ (`boss_giant_puppet.png`)

- **Asset ID:** `boss_giant_puppet`
- **Nguồn Source Code:** `giant_puppet` (Chỉ số: {"hp":380,"damage":105,"dodgeRate":0.2})
- **Đường dẫn file đích:** `public/assets/zombies/boss_giant_puppet.png`
- **Kích thước & Tỷ lệ:** 1024×1024 (1:1), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Quái vật zombie đột biến sinh cơ khí trong Trạm Phóng Tên Lửa Tuyệt Mật: thân hình khổng lồ bị giằng néo bởi khung sắt cơ khí, piston thủy lực và dây cáp treo lơ lửng, mắt sáng xanh lục độc địa.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body concept sprite of the Giant Puppet Boss (Cỗ Rối Khổng Lồ), a massive mutated bio-mechanical cybernetic zombie boss in a secret rocket launch facility, towering grotesque flesh cyborg reinforced with rusted steel exoskeleton braces, heavy hydraulic pistons bolted into rotting limbs, severed industrial cables hanging like marionette strings, glowing sinister emerald green mechanical optical sensor eye, destructive heavy stance, dark sci-fi survival horror RPG aesthetic, semi-realistic 3D digital illustration, clean silhouette on transparent background, full body view, no text, no watermark --ar 1:1
```

---
### 19. Hải Zombie Khổng Lồ (`boss_sea_monster.png`)

- **Asset ID:** `boss_sea_monster`
- **Nguồn Source Code:** `sea_monster` (Chỉ số: {"hp":600,"damage":80,"dodgeRate":0.08})
- **Đường dẫn file đích:** `public/assets/zombies/boss_sea_monster.png`
- **Kích thước & Tỷ lệ:** 1024×1024 (1:1), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Đại quái vật biển sâu nhiễm virus zombie: thân thể khổng lồ như cá voi cổ đại mục rữa phủ vỏ hà đá đen, hàng chục xúc tu bạch tuộc khổng lồ đầy gai nhọn vươn lên, hàm răng lởm chởm như quái vật tiền sử.
- **Độ ưu tiên:** P1 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full creature concept sprite of the colossal Deep-Sea Zombie Leviathan Boss (Hải Zombie Khổng Lồ), gargantuan decaying prehistoric whale-like aquatic horror covered in jagged black barnacles and rotting sea-flesh, dozens of massive writhing kraken tentacles armed with spiked suckers erupting from flanks, gaping cavernous maw lined with triple rows of razor prehistoric teeth, milky blind glowing yellow eyes, dripping seawater brine, Eldritch aquatic survival horror RPG aesthetic, semi-realistic 3D illustration, isolated on transparent background, full creature silhouette visible, no text, no watermark --ar 1:1
```

---
### 20. Zombie Bóng Bầu Dục (`zombie_football.png`)

- **Asset ID:** `zombie_football`
- **Nguồn Source Code:** `football_zombie` (Chỉ số: {"hp":250,"damageMin":30,"damageMax":55,"dodgeRate":0.15})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_football.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống vận động viên bóng bầu dục trường đại học: thân hình đồ sộ bọc giáp vai khổng lồ và mũ bảo hộ bóng bầu dục vỡ nứt, húc bay mọi rào cản với lực xô đẩy kinh người.
- **Độ ưu tiên:** P2 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of a hulking infected American football player zombie in a ruined university campus, wearing battered mud-caked team jersey with torn number, massive scuffed shoulder armor pads, cracked protective football helmet with face grill showing snarling bloodied teeth, heavy cleats, powerful aggressive linebacker charging stance, dark post-apocalyptic survival RPG aesthetic, semi-realistic 3D game character art, dramatic rim lighting, clean silhouette isolated on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
### 21. Zombie Thợ Lặn (`zombie_diver.png`)

- **Asset ID:** `zombie_diver`
- **Nguồn Source Code:** `diving_zombie` (Chỉ số: {"hp":200,"damageMin":35,"damageMax":55,"dodgeRate":0.15,"hasRanged":true})
- **Đường dẫn file đích:** `public/assets/zombies/zombie_diver.png`
- **Kích thước & Tỷ lệ:** 512×768 (2:3), PNG 32-bit True Alpha
- **Mô tả sinh vật:** Xác sống thợ lặn cảng biển: mặc bộ đồ lặn cao su rách tả tơi, bình dưỡng khí sau lưng rò rỉ bọt khí độc, mặt nạ lặn nứt vỡ với đôi mắt trắng đục, tay lăm lăm súng bắn lao han gỉ.
- **Độ ưu tiên:** P2 | **Trạng thái:** `PENDING`

#### AI Generation Prompt:
```text
Full-body character sprite of an eerie scuba diver zombie emerging from murky river waters, wearing a weathered torn rubber wetsuit with dripping seaweed, tarnished oxygen diving tanks strapped to back with broken valves, cracked glass diving mask revealing pale bloated waterlogged face and milky dead eyes, wearing rubber diving fins on feet, holding a rusted heavy speargun with barbed steel harpoon, menacing alert stance, dark aquatic post-apocalyptic survival horror aesthetic, semi-realistic 3D illustration, clean silhouette on solid transparent background, whole body visible, no text, no watermark --ar 2:3
```

---
