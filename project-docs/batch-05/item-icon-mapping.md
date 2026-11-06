# BẢNG ÁNH XẠ ICON VẬT PHẨM (ITEM ICON MAPPING TABLE)
## Dự án: Zombie World RPG – Batch 05 Phase 1
**Bộ icon tích hợp:** SwisserAI FiveM Inventory Icons v1.0 (CC0-1.0)  
**Đường dẫn thư mục asset:** `public/assets/icons/swisserai-fivem-inventory-icons-v1.0/`  
**File điều phối logic:** `js/item-icon-mapping.js` kết nối `js/inventory-ui.js`  
**Tổng số vật phẩm rà soát:** 258 items  

---

### Phân loại mức độ ánh xạ (Mapping Quality Levels)
- **EXACT (Chính xác 100%):** Vật phẩm game khớp chính xác thực thể và ngữ nghĩa của icon (ví dụ: `banh_mi_lua_mi` -> `bread`, `nuoc_khoang` -> `water_bottle`, `bang_keo` -> `bandage`, `wood` -> `wood_plank`).
- **EQUIVALENT (Tương đương):** Vật phẩm có quy cách đóng gói hoặc công dụng tương đương (ví dụ: `banh_quy_nen` -> `cookies`, `thit_bo_dong_hop` -> `steak`, `thuoc_an_than` -> `painkillers`, `balo_du_lich` -> `backpack`).
- **APPROPRIATE (Phù hợp ngữ cảnh):** Sử dụng icon phù hợp với tính chất sinh tồn hậu tận thế (ví dụ: các loài cá đánh bắt câu biển -> `cooked_fish`, đạn magnum -> `pistol_ammo`).
- **GENERIC (Chung nhóm):** Biểu tượng đại diện phân nhóm nông sản hoặc đồ dùng thông thường.
- **SAFE FALLBACK (Bảo toàn Fallback):** Các loại vũ khí chuyên biệt (súng trường, cung tên, kiếm katana...) hoặc khoáng sản đá không có trong pack SwisserAI v1.0 được giữ nguyên biểu tượng danh mục Batch 01 (`ui_icon_melee_slot.png`, `ui_icon_ranged_slot.png`, v.v.) nhằm tuyệt đối tránh râu ông nọ cắm cằm bà kia.

---

### Thực phẩm (Foods) (19 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `dau_phong` | Đậu phộng | `chips_bag` | `webp-100/chips_bag.webp` | **EQUIVALENT** | Đậu phộng dạng gói hạt ăn liền tương đương snack bag |
| 2 | `dau_lan_hoa` | Đậu phong lan | `chips_bag` | `webp-100/chips_bag.webp` | **EQUIVALENT** | Đậu phong lan hạt sấy tương đương snack bag |
| 3 | `hat_nho` | Hạt nhỏ | `chips_bag` | `webp-100/chips_bag.webp` | **APPROPRIATE** | Hạt nhỏ ăn vặt đóng gói tương đương snack ăn liền |
| 4 | `keo_que` | Kẹo que | `candy` | `webp-100/candy.webp` | **EXACT** | Kẹo que khớp chính xác icon candy |
| 5 | `thanh_nang_luong` | Thanh năng lượng | `chocolate_bar` | `webp-100/chocolate_bar.webp` | **EQUIVALENT** | Thanh năng lượng dạng thỏi bọc tương đương chocolate/energy bar |
| 6 | `so_co_la` | Sô cô la | `chocolate_bar` | `webp-100/chocolate_bar.webp` | **EXACT** | Sô cô la khớp chính xác icon chocolate_bar |
| 7 | `mi_gion` | Mì giòn | `chips_bag` | `webp-100/chips_bag.webp` | **EQUIVALENT** | Mì giòn ăn liền đóng gói tương đương snack bag |
| 8 | `che_ngan_nhi` | Chè ngân nhĩ | `tea_cup` | `webp-100/tea_cup.webp` | **EQUIVALENT** | Chè ngân nhĩ ngọt uống nóng tương đương tách trà bổ dưỡng |
| 9 | `rong_bien_gion` | Rong biển giòn | `chips_bag` | `webp-100/chips_bag.webp` | **APPROPRIATE** | Rong biển sấy giòn đóng gói tương đương gói snack |
| 10 | `banh_quy_nen` | Bánh quy nén | `cookies` | `webp-100/cookies.webp` | **EXACT** | Bánh quy nén khớp chính xác icon cookies |
| 11 | `banh_mi_lua_mi` | Bánh mì lúa mì | `bread` | `webp-100/bread.webp` | **EXACT** | Bánh mì lúa mì khớp chính xác icon bread |
| 12 | `hop_dao_vang` | Đào vàng đóng hộp | `orange` | `webp-100/orange.webp` | **APPROPRIATE** | Đào vàng đóng hộp tương đương hoa quả múi vàng cam |
| 13 | `hop_dau` | Đậu đóng hộp | `corn` | `webp-100/corn.webp` | **APPROPRIATE** | Đậu đóng hộp tương đương rau củ đóng hạt (corn) |
| 14 | `hop_thit_bo` | Thịt bò đóng hộp | `steak` | `webp-100/steak.webp` | **EQUIVALENT** | Thịt bò đóng hộp tương đương thịt bò steak |
| 15 | `hop_quan_luong` | Đồ hộp quân dụng | `tosti` | `webp-100/tosti.webp` | **APPROPRIATE** | Đồ hộp quân dụng khẩu phần ăn liền tiện dụng |
| 16 | `hop_ca_moi` | Cá mòi đóng hộp | `cooked_fish` | `webp-100/cooked_fish.webp` | **EQUIVALENT** | Cá mòi đóng hộp tương đương cá chế biến |
| 17 | `hop_ca_ngu` | Cá ngừ đóng hộp | `cooked_fish` | `webp-100/cooked_fish.webp` | **EQUIVALENT** | Cá ngừ đóng hộp tương đương cá chế biến |
| 18 | `hop_ca_thu_dao` | Cá thu đao đóng hộp | `cooked_fish` | `webp-100/cooked_fish.webp` | **EQUIVALENT** | Cá thu đao đóng hộp tương đương cá chế biến |
| 19 | `hop_ca_nuc` | Cá nục đóng hộp | `cooked_fish` | `webp-100/cooked_fish.webp` | **EQUIVALENT** | Cá nục đóng hộp tương đương cá chế biến |

### Hoa quả (Fruits) (11 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `tao` | Táo | `apple` | `webp-100/apple.webp` | **EXACT** | Táo khớp chính xác icon apple |
| 2 | `chuoi` | Chuối | `banana` | `webp-100/banana.webp` | **EXACT** | Chuối khớp chính xác icon banana |
| 3 | `cam` | Cam | `orange` | `webp-100/orange.webp` | **EXACT** | Cam khớp chính xác icon orange |
| 4 | `le_tuyet` | Lê tuyết | `ice_cubes` | `webp-100/ice_cubes.webp` | **APPROPRIATE** | Lê tuyết có đặc tính thanh mát lạnh như băng tuyết |
| 5 | `nho` | Nho | `grape` | `webp-100/grape.webp` | **EXACT** | Nho khớp chính xác icon grape |
| 6 | `dua_hau` | Dưa hấu | `apple` | `webp-100/apple.webp` | **GENERIC** | Dưa hấu hoa quả tươi mọng |
| 7 | `dau_tay` | Dâu tây | `strawberry` | `webp-100/strawberry.webp` | **EXACT** | Dâu tây khớp chính xác icon strawberry |
| 8 | `viet_quat` | Việt quất | `grape` | `webp-100/grape.webp` | **APPROPRIATE** | Việt quất quả mọng tím tương đồng chùm nho nhỏ |
| 9 | `dao` | Đào | `orange` | `webp-100/orange.webp` | **APPROPRIATE** | Quả đào thịt quả vàng cam tương đồng trái cây tươi |
| 10 | `xoai` | Xoài | `banana` | `webp-100/banana.webp` | **APPROPRIATE** | Xoài quả nhiệt đới vàng ngọt |
| 11 | `hong` | Hồng | `tomato` | `webp-100/tomato.webp` | **APPROPRIATE** | Quả hồng đỏ mọng tương đồng quả đỏ tròn tomato |

### Đồ uống (Drinks) (12 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `nuoc_khoang` | Nước suối | `water_bottle` | `webp-100/water_bottle.webp` | **EXACT** | Nước suối khớp chính xác icon water_bottle |
| 2 | `nuoc_dua` | Nước dừa | `coconut_water` | `webp-100/coconut_water.webp` | **EXACT** | Nước dừa khớp chính xác icon coconut_water |
| 3 | `nuoc_cam_qua` | Nước cam có quả | `juice_carton` | `webp-100/juice_carton.webp` | **EXACT** | Nước cam hộp có tép quả khớp juice_carton |
| 4 | `sua_tuoi` | Sữa tươi | `milk_carton` | `webp-100/milk_carton.webp` | **EXACT** | Sữa tươi hộp khớp chính xác icon milk_carton |
| 5 | `sua_chua` | Sữa chua | `milkshake` | `webp-100/milkshake.webp` | **EQUIVALENT** | Sữa chua uống béo ngậy tương đương milkshake |
| 6 | `giam_tao` | Giấm táo | `wine` | `webp-100/wine.webp` | **APPROPRIATE** | Giấm táo lên men chai thủy tinh tương đương wine |
| 7 | `nuoc_maverick` | Nước Maverick | `energy_drink` | `webp-100/energy_drink.webp` | **EQUIVALENT** | Nước tăng lực Maverick lon tương đương energy_drink |
| 8 | `nuoc_dien_giai` | Nước điện giải | `energy_drink` | `webp-100/energy_drink.webp` | **EQUIVALENT** | Nước bù điện giải lon tương đương energy_drink |
| 9 | `nuoc_the_thao` | Nước thể thao | `energy_drink` | `webp-100/energy_drink.webp` | **EQUIVALENT** | Nước thể thao lon tương đương energy_drink |
| 10 | `bia_tram_vi` | Bia Trăm Vị | `beer` | `webp-100/beer.webp` | **EXACT** | Bia Trăm Vị khớp chính xác icon beer |
| 11 | `bia_nang_luong` | Bia Năng Lượng | `beer` | `webp-100/beer.webp` | **EQUIVALENT** | Bia Năng Lượng lon bia kết hợp nước lực |
| 12 | `ruou_cao_do` | Rượu trắng cao độ | `whiskey` | `webp-100/whiskey.webp` | **EQUIVALENT** | Rượu trắng nồng độ cao tương đương chai rượu mạnh whiskey |

### Y tế (Medicines) (15 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `bang_keo` | Băng cá nhân | `bandage` | `webp-100/bandage.webp` | **EXACT** | Băng cá nhân dán vết thương khớp bandage |
| 2 | `dich_gluco` | Dung dịch gluco | `blood_bag` | `webp-100/blood_bag.webp` | **EQUIVALENT** | Túi truyền dịch gluco tương đương túi truyền dịch/blood_bag |
| 3 | `thuoc_giam_dau` | Thuốc giảm đau | `painkillers` | `webp-100/painkillers.webp` | **EXACT** | Thuốc giảm đau khớp chính xác icon painkillers |
| 4 | `thuoc_an_than` | Thuốc an thần | `painkillers` | `webp-100/painkillers.webp` | **EQUIVALENT** | Thuốc an thần vỉ viên nén tương đương painkillers |
| 5 | `adrenalin` | Adrenalin | `adrenaline_shot` | `webp-100/adrenaline_shot.webp` | **EXACT** | Ống tiêm Adrenalin khớp chính xác icon adrenaline_shot |
| 6 | `day_bo_mau` | Dây bó máu | `tourniquet` | `webp-100/tourniquet.webp` | **EXACT** | Dây ga-rô garrotte bó cầm máu khớp tourniquet |
| 7 | `thuoc_sach_vet` | Thuốc sạch vết | `gauze` | `webp-100/gauze.webp` | **EXACT** | Gạc làm sạch vết thương sát khuẩn khớp gauze |
| 8 | `goi_phau_thuat` | Gói phẫu thuật | `ifaks` | `webp-100/ifaks.webp` | **EQUIVALENT** | Gói phẫu thuật sơ cấp cứu dã chiến tương đương IFAK |
| 9 | `khang_sinh` | Kháng sinh | `painkillers` | `webp-100/painkillers.webp` | **EQUIVALENT** | Thuốc kháng sinh viên uống tương đương painkillers |
| 10 | `huyet_thanh` | Huyết thanh kháng nhiễm | `syringe` | `webp-100/syringe.webp` | **EQUIVALENT** | Huyết thanh kháng nhiễm dạng kim tiêm tiệt trùng |
| 11 | `goi_cap_cuu` | Gói cấp cứu y tế | `firstaid` | `webp-100/firstaid.webp` | **EXACT** | Gói cấp cứu y tế sơ khai khớp firstaid |
| 12 | `hop_y_te` | Hộp y tế chiến địa | `medkit` | `webp-100/medkit.webp` | **EXACT** | Hộp y tế chiến trường chuyên dụng khớp medkit |
| 13 | `tiem_van_nang` | Thuốc tiêm đa năng | `morphine` | `webp-100/morphine.webp` | **EQUIVALENT** | Thuốc tiêm đa năng hồi sinh lực tương đương morphine auto-injector |
| 14 | `improved_serum` | Kháng thể cải tiến | `syringe` | `webp-100/syringe.webp` | **EQUIVALENT** | Kháng thể cải tiến tiêm tĩnh mạch dạng syringe |
| 15 | `zombie_gel` | Gel zombie | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

### Thuốc lá (Cigarettes) (1 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `thuoc_la` | Thuốc lá | `cigarette_pack` | `webp-100/cigarette_pack.webp` | **EXACT** | Gói thuốc lá khớp chính xác icon cigarette_pack |

### Vật liệu xây dựng (Materials) (5 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `wood` | Gỗ | `wood_plank` | `webp-100/wood_plank.webp` | **EXACT** | Gỗ tấm xây dựng khớp chính xác icon wood_plank |
| 2 | `building_mat` | Vật liệu xây dựng | `steel` | `webp-100/steel.webp` | **EQUIVALENT** | Vật liệu xây dựng tấm thép kiên cố |
| 3 | `stone` | Đá | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 4 | `nails` | M đóng | `screws` | `webp-100/screws.webp` | **EQUIVALENT** | Đinh sắt kim khí tương đương ốc vít screws |
| 5 | `glass` | Kính | `glass` | `webp-100/glass.webp` | **EXACT** | Mảnh kính vật liệu khớp chính xác icon glass |

### Thủy hải sản câu bắt (Fish) (16 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `grey_mullet` | Cá lóc xám | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá lóc xám câu được biểu thị qua icon cá sinh tồn |
| 2 | `iron_sardine` | Cá mòi sắt | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá mòi sắt sinh tồn biểu thị qua icon cá |
| 3 | `blunt_seabream` | Cá lóc đùn đầu | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá tráp đầu tù biểu thị qua icon cá |
| 4 | `blacktail_mackerel` | Cá thu đen đuôi | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá thu đuôi đen biểu thị qua icon cá |
| 5 | `ray_barracuda` | Cá nhân ký vằn | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá nhồng vằn biển biểu thị qua icon cá |
| 6 | `rust_flounder` | Cá đính xỉn màu | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá bơn gỉ sét biểu thị qua icon cá |
| 7 | `twin_grouper` | Cá đá hai đầu | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá song hai đầu đột biến biểu thị qua icon cá |
| 8 | `sewage_eel` | Cá nhếch bùn thải | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Lươn cống rãnh biểu thị qua icon thủy hải sản |
| 9 | `corpse_cod` | Cá mã thây chết | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá tuyết tử thi biểu thị qua icon cá sinh tồn |
| 10 | `spine_wolffish` | Cá sói xương nứt | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá sói gai biểu thị qua icon cá sinh tồn |
| 11 | `gel_lanternfish` | Cá lồng gel | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá lồng đèn phát quang sinh thái biển |
| 12 | `multi_barb_king` | Vua cá rậm nhiều | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Vua cá nhiều râu biểu thị qua icon cá quý |
| 13 | `dead_giant_cod` | Cá mã khổng lồ chết | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá tuyết khổng lồ cổ đại |
| 14 | `plague_tentacle` | Côn trùng dịch bệnh | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Thủy quái dịch bệnh sinh tồn biển sâu |
| 15 | `wreck_ghost_shark` | Cá m Ong hutdown | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá mập bóng ma xác tàu |
| 16 | `abyss_core_fish` | Cá lõi vực thẳm | `cooked_fish` | `webp-100/cooked_fish.webp` | **APPROPRIATE** | Cá lõi vực thẳm sinh vật biển cực hiếm |

### Bữa ăn hải sản (Seafood Meals) (5 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `bad_seafood_meal` | Bữa ăn hải sản khó ăn | `cooked_fish` | `webp-100/cooked_fish.webp` | **EXACT** | Món cá hải sản nấu chín dã chiến |
| 2 | `normal_seafood_meal` | Bữa ăn hải sản trung bình | `cooked_fish` | `webp-100/cooked_fish.webp` | **EXACT** | Bữa ăn hải sản chín tiêu chuẩn |
| 3 | `delicious_seafood_meal` | Bữa ăn hải sản ngon | `cooked_fish` | `webp-100/cooked_fish.webp` | **EXACT** | Bữa ăn hải sản chín thơm ngon |
| 4 | `tempting_seafood_meal` | Bữa ăn hải sản hấp dẫn | `cooked_fish` | `webp-100/cooked_fish.webp` | **EXACT** | Bữa ăn hải sản chín hấp dẫn |
| 5 | `top_seafood_meal` | Bữa ăn hải sản cao cấp | `cooked_fish` | `webp-100/cooked_fish.webp` | **EXACT** | Bữa ăn hải sản chín cao cấp thịnh soạn |

### Balo & Túi (Backpacks) (23 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `tui_xach` | Tú xách | `duffel_bag` | `webp-100/duffel_bag.webp` | **EXACT** | Túi xách tay vải bạt khớp duffel_bag |
| 2 | `tui_eo_nho` | Tú eo nhỏ | `duffel_bag` | `webp-100/duffel_bag.webp` | **EQUIVALENT** | Túi đeo thắt lưng nhỏ tương đương duffel/bag |
| 3 | `balo_nho` | Balo nhỏ | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo nhỏ khớp chính xác icon backpack |
| 4 | `tui_xach_tay` | Tú xách tay | `duffel_bag` | `webp-100/duffel_bag.webp` | **EXACT** | Túi xách tay dã chiến khớp duffel_bag |
| 5 | `balo_va_canvas` | Balo vải canvas | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo vải canvas khớp chính xác icon backpack |
| 6 | `balo_thoi_trang` | Balo thời trang | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo thời trang khớp chính xác icon backpack |
| 7 | `balo_the_thao` | Balo thể thao | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo thể thao khớp chính xác icon backpack |
| 8 | `balo_le_nui` | Balo leo núi | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo leo núi sinh tồn khớp backpack |
| 9 | `balo_quan_doi` | Balo quân đội | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo quân sự dã chiến khớp backpack |
| 10 | `balo_chien_thuat` | Balo chiến thuật | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo chiến thuật tác chiến khớp backpack |
| 11 | `balo_dac_biet` | Balo đặc biệt | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo sinh tồn đặc biệt khớp backpack |
| 12 | `balo_le_nui_cap_i` | Balo leo núi cấp I | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo leo núi chuyên dụng cấp I |
| 13 | `balo_le_nui_cap_ii` | Balo leo núi cấp II | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo leo núi chuyên dụng cấp II |
| 14 | `balo_le_nui_cap_iii` | Balo leo núi cấp III | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo leo núi chuyên dụng cấp III |
| 15 | `balo_le_nui_cap_iv` | Balo leo núi cấp IV | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo leo núi chuyên dụng cấp IV |
| 16 | `balo_du_lich_sieu_lon` | Balo du lịch siêu lớn | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo du lịch thám hiểm cỡ đại |
| 17 | `balo_du_lich_nang_cap` | Balo du lịch nâng cấp | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo du lịch cải tiến sức chứa |
| 18 | `balo_du_lich_cao_cap` | Balo du lịch cao cấp | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo du lịch vật liệu cao cấp |
| 19 | `balo_the_thao_chu_tai` | Balo thể thao chịu tải | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo thể thao công suất chịu tải lớn |
| 20 | `balo_quan_doi_chu_tai` | Balo quân đội chịu tải | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo dã chiến quân giới chịu lực nặng |
| 21 | `balo_dac_biet_chu_tai` | Balo đặc biệt chịu tải | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo đặc vụ chịu tải chuyên sâu |
| 22 | `balo_dung_khi_chu_tai` | Balo dũng khí chịu tải | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo dũng khí chịu tải tối thượng |
| 23 | `balo_luu_tru_vu_tru` | Balo lưu trữ Vũ Trụ | `backpack` | `webp-100/backpack.webp` | **EXACT** | Balo công nghệ không gian vũ trụ |

### Vũ khí cận chiến (Melee Weapons) (40 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `dam` | Nắm Đấm | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 2 | `dao_bep` | Dao Bếp | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 3 | `gay_go` | Gậy gỗ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 4 | `cao_cuoc` | Cào Cuốc | `pickaxe` | `webp-100/pickaxe.webp` | **EQUIVALENT** | Cào cuốc đào bới tương đương cuốc pickaxe |
| 5 | `bua_sat_nho` | Búa sắt nhỏ | `hammer` | `webp-100/hammer.webp` | **EXACT** | Búa sắt nhỏ khớp chính xác icon hammer |
| 6 | `chao_ap` | Chảo Áp | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 7 | `can_xich_lon` | Cờ Lê Lớn | `wrench` | `webp-100/wrench.webp` | **EXACT** | Cờ lê lớn khớp chính xác icon wrench |
| 8 | `gay_bong_chay` | Gậy bóng chày | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 9 | `ong_sat` | Ống sắt | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 10 | `xeng_sat` | Xẻng Sắt | `shovel` | `webp-100/shovel.webp` | **EXACT** | Xẻng sắt công binh khớp chính xác icon shovel |
| 11 | `dao_gam_nho` | Dao Găm Nhỏ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 12 | `dao_tho_mo` | Dao thợ mổ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 13 | `gay_cam_sat` | Gậy Cảnh Sát | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 14 | `cay_nay` | Cây Nạy | `crowbar` | `webp-100/crowbar.webp` | **EXACT** | Cây nạy xà beng khớp chính xác icon crowbar |
| 15 | `bua_be_mot` | Búa nhổ đinh | `hammer` | `webp-100/hammer.webp` | **EXACT** | Búa nhổ đinh khớp chính xác icon hammer |
| 16 | `riu_ngan` | Rìu ngắn | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 17 | `riu_cuu_hoa` | Rìu cứu hỏa | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 18 | `dao_san` | Dao săn | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 19 | `dao_quan_doi` | Dao quân đội | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 20 | `dao_chi_ho` | Dao Chỉ Hổ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 21 | `dao_kham_lon` | Đao Chém Lớn | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 22 | `dao_tram_ma` | Đao Trảm Mã | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 23 | `roi_chin_dot` | Roi Chín Đốt | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 24 | `kiem_tay` | Kiếm Tây | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 25 | `bua_sao_bang` | Búa sao băng | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 26 | `kiem_thep_sap` | Kiếm Thép Ngắn | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 27 | `kiem_long_thao` | Kiếm Long Thảo | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 28 | `sung_ky_binh` | Giáo Kỵ Binh | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 29 | `kiem_hai_luoi` | Kiếm hai lưỡi | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 30 | `kiem_melayu` | Kiếm Melayu | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 31 | `dao_samurai` | Đao Samurai | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 32 | `dao_ngang_duong` | Đao Ngang Đường | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 33 | `may_cat_cay` | Máy cắt cây | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 34 | `kiem_dung_si` | Kiếm Dũng Sĩ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 35 | `kiem_vu_tru` | Kiếm Vũ Trụ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 36 | `kiem_vo_uy` | Kiếm Vô Uy | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 37 | `kiem_bac_hoang_gia` | Kiếm bạc hoàng gia | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 38 | `dinh_ba_hai_ca` | Đinh Ba Hải Ca | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 39 | `kiem_thuong_phong` | Kiếm Thương Phòng | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 40 | `dao_999` | Dao 999 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_melee_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

### Vũ khí tầm xa (Ranged Weapons) (45 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `cung_go` | Cung gỗ | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 2 | `cung_cong_nguoc` | Cung cong ngược | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 3 | `cung_ket_hop` | Cung kết hợp | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 4 | `no_thap_tu` | Nỏ Thập Tự | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 5 | `no_gap` | Cối nỏ gấp | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 6 | `no_san_ban` | Cối nỏ săn bắn | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 7 | `cung_dong_que` | Cung đồng quê | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 8 | `P226` | P226 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 9 | `G17` | G17 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 10 | `USP9` | USP9 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 11 | `M1911` | M1911 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 12 | `GP100` | GP100 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 13 | `sung_sa_mac` | Deagle (Sa Mạc) | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 14 | `sung_hoang_gia` | Súng Ngắn Hoàng Gia | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 15 | `P90` | P90 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 16 | `UZI` | UZI | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 17 | `MP5` | MP5 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 18 | `MP7` | MP7 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 19 | `Vector` | Vector | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 20 | `UMP45` | UMP45 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 21 | `M16A4` | M16A4 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 22 | `M4A1` | M4A1 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 23 | `SG552` | SG552 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 24 | `HK416` | HK416 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 25 | `AUG` | AUG | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 26 | `AK47` | AK47 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 27 | `AKM` | AKM | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 28 | `sung_81` | Súng Kiểu 81 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 29 | `AN94` | AN-94 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 30 | `SKS` | SKS | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 31 | `SCARH` | SCAR-H | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 32 | `FAL` | FAL | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 33 | `EBR14` | EBR14 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 34 | `SR25` | SR25 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 35 | `M700` | M700 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 36 | `Mosin` | Mosin-Nagant | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 37 | `AWM` | AWM | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 38 | `M249` | M249 SAW | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 39 | `RPK` | RPK | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 40 | `M60` | M60 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 41 | `MG42` | MG42 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 42 | `PKM` | PKM | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 43 | `M870` | M870 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 44 | `AA12` | AA12 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 45 | `SPAS12` | SPAS-12 | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

### Đạn dược (Ammo) (13 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `mui_ten` | Mũi tên | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_ranged_slot.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 2 | `.357 Magnum` | .357 Magnum | `pistol_ammo` | `webp-100/pistol_ammo.webp` | **EQUIVALENT** | Đạn súng ngắn ổ xoay Magnum tương đương pistol_ammo |
| 3 | `.45 ACP` | .45 ACP | `pistol_ammo` | `webp-100/pistol_ammo.webp` | **EQUIVALENT** | Đạn súng ngắn .45 ACP tương đương pistol_ammo |
| 4 | `.50 AE` | .50 AE | `pistol_ammo` | `webp-100/pistol_ammo.webp` | **EQUIVALENT** | Đạn súng ngắn hỏa lực mạnh Desert Eagle tương đương pistol_ammo |
| 5 | `9×19mm` | 9×19mm | `pistol_ammo` | `webp-100/pistol_ammo.webp` | **EXACT** | Đạn súng ngắn 9x19mm khớp chính xác pistol_ammo |
| 6 | `5.7×28mm` | 5.7×28mm | `smg_ammo` | `webp-100/smg_ammo.webp` | **EXACT** | Đạn tiểu liên P90 5.7x28mm khớp chính xác smg_ammo |
| 7 | `7.62×39mm` | 7.62×39mm | `rifle_ammo` | `webp-100/rifle_ammo.webp` | **EXACT** | Đạn súng trường AK 7.62x39mm khớp chính xác rifle_ammo |
| 8 | `5.56×45mm NATO` | 5.56×45mm NATO | `rifle_ammo` | `webp-100/rifle_ammo.webp` | **EXACT** | Đạn trường tấn công 5.56 NATO khớp chính xác rifle_ammo |
| 9 | `7.62×51mm` | 7.62×51mm | `rifle_ammo` | `webp-100/rifle_ammo.webp` | **EQUIVALENT** | Đạn trường chiến đấu 7.62 NATO tương đương rifle_ammo |
| 10 | `7.62×54mmR` | 7.62×54mmR | `rifle_ammo` | `webp-100/rifle_ammo.webp` | **EQUIVALENT** | Đạn súng trường Mosin 7.62x54R tương đương rifle_ammo |
| 11 | `7.92×57mm` | 7.92×57mm | `rifle_ammo` | `webp-100/rifle_ammo.webp` | **EQUIVALENT** | Đạn súng trường Mauser tương đương rifle_ammo |
| 12 | `.300 Winchester Magnum` | .300 Winchester Magnum | `snp_ammo` | `webp-100/snp_ammo.webp` | **EXACT** | Đạn bắn tỉa Magnum khớp chính xác snp_ammo |
| 13 | `dan_12` | Đạn Shotgun 12 | `shotgun_ammo` | `webp-100/shotgun_ammo.webp` | **EXACT** | Đạn hoa cải shotgun cỡ 12 khớp chính xác shotgun_ammo |

### Nông sản trồng trọt (Crops) (15 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `niupicai` | Cáu bò | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 2 | `machixian` | Xà lách bò | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 3 | `juju` | Cách lá | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 4 | `yangjiang` | Hành lá Tây | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 5 | `mushu` | Cassava | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 6 | `hongshu` | Khoai lang | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 7 | `tudou` | Khoai tây | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 8 | `wujing` | Củ cải trắng | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 9 | `boluomencan` | Nhan sam Ba La Môn | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 10 | `luobo` | Cà rốt | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 11 | `jiucai` | Hẹ | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 12 | `gouqi` | Kỷ tử | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 13 | `suanmo` | Rau chua | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 14 | `heimai` | Lúa mạch đen | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 15 | `wandou` | Đậu Hà Lan | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

### Hạt giống cây trồng (Seeds) (15 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `seed_niupicai` | Hạt cáu bò | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 2 | `seed_machixian` | Hạt xà lách bò | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 3 | `seed_juju` | Hạt cách lá | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 4 | `seed_yangjiang` | Hạt hành lá Tây | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 5 | `seed_mushu` | Hạt cassava | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 6 | `seed_hongshu` | Hạt khoai lang | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 7 | `seed_tudou` | Hạt khoai tây | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 8 | `seed_wujing` | Hạt cải trắng | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 9 | `seed_boluomencan` | Hạt nhan sam Ba La Môn | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 10 | `seed_luobo` | Hạt cà rốt | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 11 | `seed_jiucai` | Hạt hẹ | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 12 | `seed_gouqi` | Hạt kỷ tử | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 13 | `seed_suanmo` | Hạt rau chua | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 14 | `seed_heimai` | Hạt mạch đen | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 15 | `seed_wandou` | Hạt đậu Hà Lan | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png (hoặc category)` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

### Vật phẩm đặc biệt & Nhiệm vụ (Special Items) (23 vật phẩm)

| # | Item ID | Tên vật phẩm | Icon SwisserAI | Đường dẫn Asset WebP | Chất lượng | Ghi chú ngữ nghĩa |
|---|---------|--------------|----------------|----------------------|------------|-------------------|
| 1 | `noble_id` | Thẻ thân phận quý tộc | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ căn cước quý tộc khớp id_card |
| 2 | `dawn_badge` | Huy hiệu Dawn | `police_badge` | `webp-100/police_badge.webp` | **EQUIVALENT** | Huy hiệu quân đoàn Dawn tương đương huy hiệu biểu trưng |
| 3 | `silence_badge` | Huy hiệu Tịch diệt | `police_badge` | `webp-100/police_badge.webp` | **EQUIVALENT** | Huy hiệu Tịch diệt trừng phạt tương đương huy hiệu biểu trưng |
| 4 | `viscount_id` | Thẻ thân phận Tử tước | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ thân phận Tử tước khớp id_card |
| 5 | `count_id` | Thẻ thân phận Bá tước | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ thân phận Bá tước khớp id_card |
| 6 | `marquis_id` | Thẻ thân phận Hầu tước | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ thân phận Hầu tước khớp id_card |
| 7 | `duke_id` | Thẻ thân phận Công tước | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ thân phận Công tước khớp id_card |
| 8 | `crown_prince_id` | Thẻ thân phận Trữ quân | `id_card` | `webp-100/id_card.webp` | **EXACT** | Thẻ thân phận Trữ quân hoàng gia khớp id_card |
| 9 | `dawn_captain_badge` | Huy hiệu đội trưởng tiên phong Dawn | `police_badge` | `webp-100/police_badge.webp` | **EQUIVALENT** | Huy hiệu đội trưởng tiên phong Dawn |
| 10 | `underground_key` | Chìa khóa ngầm | `house_key` | `webp-100/house_key.webp` | **EQUIVALENT** | Chìa khóa mở khu vực ngầm tương đương house_key |
| 11 | `farming_master_badge` | Huy hiệu bậc thầy nông nghiệp | `police_badge` | `webp-100/police_badge.webp` | **APPROPRIATE** | Huy hiệu danh dự bậc thầy nông nghiệp |
| 12 | `miaomiao_diary` | Nhật ký Miu Miu | `stickynote` | `webp-100/stickynote.webp` | **EQUIVALENT** | Sổ nhật ký ghi chép giấy tương đương sticky note tài liệu |
| 13 | `strange_recorder` | Bút ghi âm kỳ lạ | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 14 | `letter_to_sister` | Thư gửi em gái | `contract_paper` | `webp-100/contract_paper.webp` | **EQUIVALENT** | Bức thư tay trang giấy cuộn gửi em gái |
| 15 | `queen_reply` | Thư hồi âm của hoàng hậu | `contract_paper` | `webp-100/contract_paper.webp` | **EQUIVALENT** | Thư sắc lệnh hoàng gia gửi lại |
| 16 | `love_token` | Vật đính ước | `goldchain` | `webp-100/goldchain.webp` | **EQUIVALENT** | Kỷ vật đính ước dây chuyền vàng quý giá |
| 17 | `castle_pass` | Thẻ thông hành thành | `security_card_01` | `webp-100/security_card_01.webp` | **EQUIVALENT** | Thẻ từ thông hành thành trì tương đương thẻ từ bảo mật |
| 18 | `car_key` | Chìa khóa xe | `vehicle_key` | `webp-100/vehicle_key.webp` | **EXACT** | Chìa khóa xe hơi khớp vehicle_key |
| 19 | `lightning_scale` | Vảy sét | `diamond` | `webp-100/diamond.webp` | **APPROPRIATE** | Vảy rồng sét lấp lánh tinh thể quý hiếm |
| 20 | `thunder_scale` | Vảy sấm | `diamond` | `webp-100/diamond.webp` | **APPROPRIATE** | Vảy rồng sấm lấp lánh tinh thể quý hiếm |
| 21 | `pure_energy` | Năng lượng tinh khiết | *(Không có icon phù hợp)* | `public/assets/icons/ui_icon_pure_energy.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |
| 22 | `crime_data` | Tài liệu tội phạm | `filled_evidence_bag` | `webp-100/filled_evidence_bag.webp` | **EXACT** | Túi hồ sơ chứng cứ tội phạm khớp filled_evidence_bag |
| 23 | `small_nuclear_generator` | Máy phát điện hạt nhân nhỏ | *(Không có icon phù hợp)* | `public/assets/icons/ui_placeholder_empty.png` | *SAFE FALLBACK* | Giữ nguyên fallback giao diện sinh tồn |

