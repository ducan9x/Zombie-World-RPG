# BẢNG THUẬT NGỮ TIẾNG VIỆT THỐNG NHẤT (VIETNAMESE TERMINOLOGY)
## DỰ ÁN: ZOMBIE WORLD RPG

Tài liệu này quy chuẩn toàn bộ thuật ngữ hiển thị, khái niệm gameplay, tên gọi thực thể (NPC, Boss, Zombie, Bản đồ, Vật phẩm, Trang bị) được sử dụng nhất quán trong toàn bộ mã nguồn và giao diện người dùng của dự án **Zombie-World-RPG**.

---

## 1. CHỈ SỐ CỐT LÕI & TRẠNG THÁI (CORE STATS & STATUS)

| Thuật ngữ gốc / Mã code | Tên tiếng Việt thống nhất | Ý nghĩa & Quy chuẩn sử dụng |
|---|---|---|
| `hp` / `maxHp` | **Máu** (hoặc **HP**) | Lượng sinh mệnh của người chơi hoặc thực thể. Hiển thị "Máu: X/Y" hoặc "HP: X/Y". |
| `sanity` / `maxSanity` | **Tinh thần** (hoặc **Sanity**) | Sức khỏe tâm lý nhân vật. Giảm khi gặp sự kiện đáng sợ, chấn thương. |
| `crash` / `crashLevel` | **Sụp đổ** / **Độ sụp đổ** | Trạng thái tinh thần bị suy sụp, hoảng loạn. |
| `hunger` / `maxHunger` | **Đói** / **Độ no** | Nhu cầu dinh dưỡng thức ăn. |
| `hydration` / `maxHydration` | **Khát** / **Độ khát** | Nhu cầu nước uống. |
| `infection` / `infectionLevel` | **Nhiễm bệnh** / **Độ nhiễm** | Mức độ lây nhiễm virus zombie. Đạt ngưỡng cao sẽ liên tục mất máu. |
| `attack` / `damage` | **Tấn công** / **Sát thương** | Chỉ số sát thương gây ra trong giao tranh. |
| `defense` | **Phòng thủ** | Khả năng giảm thiểu sát thương phải nhận. |
| `dodgeRate` | **Tỷ lệ né tránh** | Xác suất né đòn tấn công của đối thủ. |
| `critRate` | **Tỷ lệ bạo kích** | Xác suất gây sát thương chí mạng. |
| `comboRate` | **Tỷ lệ liên kích** | Xác suất tung đòn đánh kép/liên hoàn vũ khí cận chiến. |
| `durability` | **Độ bền** | Độ bền của vũ khí cận chiến (giảm dần khi sử dụng). |
| `integrity` | **Độ nguyên vẹn** | Tình trạng của vũ khí tầm xa/súng (sửa chữa tại NPC). |

---

## 2. TIỀN TỆ & TÀI NGUYÊN (CURRENCIES & RESOURCES)

| Thuật ngữ gốc / Mã code | Tên tiếng Việt thống nhất | Ý nghĩa & Quy chuẩn sử dụng |
|---|---|---|
| `cigarettes` / `cigarette` | **Điếu thuốc** / **Thuốc lá** | Đơn vị tiền tệ chính để giao thương tại Doanh địa/Trận địa phế thổ. |
| `royalCoins` / `royal_coin` | **Tiền hoàng gia** | Tiền tệ cao cấp dùng tại Lâu đài tận thế và Đảo hoàng gia. |
| `gasoline` | **Xăng** | Nhiên liệu vận hành xe tải, thuyền cá và hệ thống năng lượng. |
| `wood` | **Gỗ** | Vật liệu kiến thiết căn cứ. |
| `stone` | **Đá** | Vật liệu kiến thiết căn cứ. |
| `scrap_metal` | **Kim loại phế liệu** | Phế liệu cơ khí chế tạo và sửa chữa. |
| `electronic_parts` | **Linh kiện điện tử** | Vật liệu công nghệ cao chế tạo trang thiết bị. |
| `serum` / `huyet_thanh` | **Huyết thanh kháng nhiễm** | Dược phẩm quan trọng nhất để cứu chữa lây nhiễm. |

---

## 3. ĐỊA DANH & BẢN ĐỒ (LOCATIONS & MAPS)

| ID Bản đồ | Tên tiếng Việt thống nhất | Mô tả địa danh |
|---|---|---|
| `doanh_dia` | **Doanh địa sống sót** | Khu trú ẩn an toàn khởi đầu của người chơi. |
| `can_cu_dawn` | **Căn cứ Dawn** | Tiền đồn kiên cố do lực lượng quân sự/sống sót lập nên. |
| `ben_xe_cu` | **Trạm xe cũ** | Khu phế tích giao thông, nhiều phụ tùng xe cũ. |
| `sieu_thi_ngam` | **Siêu thị ngầm** | Nguồn thu thập thực phẩm, nước uống và tạp phẩm. |
| `benh_vien_hoang` | **Bệnh viện bỏ hoang** | Nguồn thu thập dược phẩm, thiết bị y tế; nguy cơ nhiễm cao. |
| `so_canh_sat` | **Sở cảnh sát** | Nơi tìm kiếm súng ngắn, đạn dược và còng cảnh sát. |
| `khu_thuong_mai` | **Phố thương mại** | Khu vực buôn bán sầm uất trước đại dịch. |
| `cong_vien_trung_tam` | **Công viên trung tâm** | Vùng thực vật hoang hóa, nhiều nguy hiểm tiềm ẩn. |
| `nha_kho_ngoai_o` | **Kho ngoại ô** | Nơi lưu trữ vật liệu xây dựng và nguyên liệu thô. |
| `tram_kiem_soat` | **Trạm kiểm soát quân sự** | Chốt canh quân đội, cơ hội tìm thấy balo quân sự và đạn súng trường. |
| `to_zombie` | **Tổ zombie** | Hang ổ nguy hiểm của bầy xác sống và Thi Vương Tịch Diệt. |
| `rung_ram` | **Rừng rậm** | Khu sinh thái tự nhiên, thu thập gỗ và săn bắn. |
| `ho_nuoc` | **Hồ nước** | Nguồn cấp nước và câu cá nội địa. |
| `lau_dai_tan_the` | **Lâu đài tận thế** | Lãnh địa xa hoa biệt lập của Karen và giới quý tộc. |
| `khu_mua_sam_dao` | **Khu thương mại đảo** | Chợ đen, phố đi bộ và ngân hàng trên đảo biệt lập. |
| `trung_tam_phong` | **Trung tâm phóng tên lửa** | Nơi lưu giữ tên lửa thoát ly Trái Đất (Endgame). |

---

## 4. NHÂN VẬT & NPC (CHARACTERS & NPCS)

| ID NPC | Tên tiếng Việt thống nhất | Vai trò / Đặc điểm |
|---|---|---|
| `xiaohan` | **Tô Tiểu Hàm** | Cô gái ấm áp phụ trách hậu cần tại căn cứ, thích chia sẻ sữa tươi. |
| `v` | **Chị V** | Nữ chiến binh lạnh lùng, thiện chiến, huấn luyện kỹ năng sinh tồn. |
| `lili` | **Lili** | Thợ cơ khí tinh nghịch, sửa chữa vũ khí và tái chế balo. |
| `mumiao` | **Mục Miêu Miêu** | Chuyên gia nông nghiệp, hướng dẫn trồng trọt và cung cấp hạt giống. |
| `guyue` | **Cố Nguyệt** | Thương nhân hàng hải, thu mua hải sản và chế biến món ăn biển. |
| `linhan` | **Lâm Hàm** | Thương nhân chợ đen trên đảo biệt lập. |
| `yumo` | **Vũ Mặc** | Cô gái bí ẩn trên bờ biển có mối liên hệ với biển sâu. |
| `liuruyan` | **Lưu Như Yên** | Người phụ nữ gặp nạn trong trạm xăng/ngoại ô cần cứu viện. |
| `zhao` | **Lão Triệu** (Lão Binh Lão Triệu) | Cựu binh canh gác trạm kiểm soát quân đội. |
| `doctor_chen` | **Tiến Sĩ Trần** (Dr. Chen) | Nhà khoa học nghiên cứu huyết thanh kháng virus tại viện nghiên cứu. |
| `king_karen` | **Karen** (Quốc vương Karen) | Cựu trùm bất động sản lập nên Vương quốc Lâu đài tận thế. |
| `queen` | **Hoàng Hậu** | Người vợ ưu tư của Karen cư ngụ trong lâu đài. |
| `banker` | **Trưởng Ngân Hàng** | Quản lý hệ thống cho vay và thế chấp tại ngân hàng lâu đài. |
| `leader` | **Thủ Lĩnh Trận Địa** | Chỉ huy quân sự tại căn cứ tiền đồn. |

---

## 5. KẺ ĐỊCH & BOSS (ENEMIES & BOSSES)

| ID Entity | Tên tiếng Việt thống nhất | Phân loại | Ghi chú |
|---|---|---|---|
| `ma_san` | **Mã Tam** | Tên cướp khét tiếng | Rơi AK47 khi bị đánh bại |
| `shadow` | **Hắc Ảnh** | Sát thủ bóng đêm | Boss tầm xa nguy hiểm |
| `zombie_king` | **Vua Zombie Im Lặng** (Thi Vương) | Boss tối thượng tổ zombie | Rơi Huy chương Tịch Diệt |
| `banker` | **Trưởng Ngân Hàng** | Boss lâu đài | Rơi Đao Samurai |
| `leader` | **Thủ Lĩnh Trận Địa** | Boss tiền đồn | Sát thương cực cao |
| `giant_puppet` | **Cỗ Rối Khổng Lồ** | Boss trung tâm phóng | Robot zombie thí nghiệm sinh học |
| `football_zombie`| **Zombie Bóng Bầu Dục** | Zombie đột biến | Thể lực trâu bò |
| `diving_zombie` | **Zombie Thợ Lặn** | Zombie vùng nước | Khả năng tấn công tầm xa |
| `sea_monster` | **Hải Zombie Khổng Lồ** | Siêu Boss biển sâu | Kích hoạt chuỗi kết thúc người cá |
| `king_boss` | **Vua Lâu Đài** | Boss quyền lực tối cao | Bảo vệ ngai vàng Karen |
| `zhao_boss` | **Lão Binh Lão Triệu** | Cựu binh phát điên | Thiện xạ súng trường |
| `doctor_boss` | **Tiến Sĩ Trần** | Nhà khoa học biến chất | Sử dụng vũ khí hóa sinh |

---

## 6. DANH MỤC VŨ KHÍ & ĐẠN DƯỢC (WEAPONS & AMMO)

### 6.1. Vũ khí cận chiến tiêu biểu (Melee)
- **Nắm Đấm** (`dam`)
- **Dao Bếp** (`dao_bep`)
- **Gậy Bóng Chày** (`gay_bong_chay`)
- **Xẻng Sắt** (`xeng_sat`)
- **Dao Găm Nhỏ** (`dao_gam_nho`)
- **Dao Chỉ Hổ** (`dao_chi_ho`)
- **Búa Nhổ Đinh** (`bua_be_mot`)
- **Đao Trảm Mã** (`dao_tram_ma`)
- **Kiếm Tây** (`kiem_tay`)
- **Kiếm Long Thảo** (`kiem_long_thao`)
- **Đao Samurai** (`dao_samurai`)
- **Kiếm Bạc Hoàng Gia** (`kiem_bac_hoang_gia`)

### 6.2. Cỡ đạn tiêu chuẩn (Ammo Calibers)
Giữ nguyên ký hiệu chuẩn quốc tế cho các cỡ đạn:
- `mui_ten` (Mũi tên)
- `9×19mm`
- `7.62×39mm`
- `5.56×45mm NATO`
- `7.62×51mm`
- `7.62×54mmR`
- `7.92×57mm`
- `.357 Magnum`
- `.45 ACP`
- `.50 AE`
- `5.7×28mm`
- `.300 Winchester Magnum`
- `dan_12` (Đạn Shotgun 12 gauge)

---

## 7. QUY CHUẨN ĐẶT TÊN & MÃ HÓA (NAMING CONVENTIONS)

1. **Khóa dữ liệu / Key / Identifier**: Bắt buộc dùng chữ cái Latin thường, không dấu, nối từ bằng dấu gạch dưới (`snake_case`), ví dụ: `thuoc_hoi_mau`, `goi_cap_cuu`, `tiem_van_nang`.
2. **Ký hiệu đạn kỹ thuật**: Giữ nguyên tên chuẩn công nghiệp quốc tế (`9×19mm`, `5.56×45mm NATO`, `.357 Magnum`).
3. **Nội dung hiển thị (Display Names / UI)**: Sử dụng tiếng Việt chuẩn chính tả, ngữ pháp tự nhiên, viết hoa chữ cái đầu hoặc viết hoa danh xưng trang trọng.

