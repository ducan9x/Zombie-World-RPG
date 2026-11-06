/**
 * ============================================================
 * Item Icon Mapping Module — Zombie World RPG (Batch 05 Phase 1)
 * Hệ thống mapping icon tập trung từ bộ SwisserAI FiveM Inventory Icons v1.0
 * Tích hợp chuẩn WebP 100x100 (thẻ bài) và 256x256 (chi tiết / modal)
 * ============================================================
 */

export const SWISSERAI_BASE_PATH = 'public/assets/icons/swisserai-fivem-inventory-icons-v1.0';

/**
 * Bản đồ ánh xạ ngữ nghĩa giữa Game Item ID và SwisserAI Icon
 * Phân loại chất lượng:
 * - EXACT: Khớp chính xác 100% về ngữ nghĩa và thực thể
 * - EQUIVALENT: Tương đương về loại hình, công dụng hoặc thuộc tính đóng gói
 * - APPROPRIATE: Phù hợp ngữ cảnh sinh tồn hậu tận thế
 * - GENERIC: Thay thế chung trong phân nhóm
 */
export const ITEM_ICON_MAP = {
  // ==========================================
  // 1. THỰC PHẨM (FOODS - 19 items)
  // ==========================================
  dau_phong: { icon: 'chips_bag', quality: 'EQUIVALENT', reason: 'Đậu phộng dạng gói hạt ăn liền tương đương snack bag', packCategory: 'food' },
  dau_lan_hoa: { icon: 'chips_bag', quality: 'EQUIVALENT', reason: 'Đậu phong lan hạt sấy tương đương snack bag', packCategory: 'food' },
  hat_nho: { icon: 'chips_bag', quality: 'APPROPRIATE', reason: 'Hạt nhỏ ăn vặt đóng gói tương đương snack ăn liền', packCategory: 'food' },
  keo_que: { icon: 'candy', quality: 'EXACT', reason: 'Kẹo que khớp chính xác icon candy', packCategory: 'food' },
  thanh_nang_luong: { icon: 'chocolate_bar', quality: 'EQUIVALENT', reason: 'Thanh năng lượng dạng thỏi bọc tương đương chocolate/energy bar', packCategory: 'food' },
  so_co_la: { icon: 'chocolate_bar', quality: 'EXACT', reason: 'Sô cô la khớp chính xác icon chocolate_bar', packCategory: 'food' },
  mi_gion: { icon: 'chips_bag', quality: 'EQUIVALENT', reason: 'Mì giòn ăn liền đóng gói tương đương snack bag', packCategory: 'food' },
  che_ngan_nhi: { icon: 'tea_cup', quality: 'EQUIVALENT', reason: 'Chè ngân nhĩ ngọt uống nóng tương đương tách trà bổ dưỡng', packCategory: 'drink' },
  rong_bien_gion: { icon: 'chips_bag', quality: 'APPROPRIATE', reason: 'Rong biển sấy giòn đóng gói tương đương gói snack', packCategory: 'food' },
  banh_quy_nen: { icon: 'cookies', quality: 'EXACT', reason: 'Bánh quy nén khớp chính xác icon cookies', packCategory: 'food' },
  banh_mi_lua_mi: { icon: 'bread', quality: 'EXACT', reason: 'Bánh mì lúa mì khớp chính xác icon bread', packCategory: 'food' },
  hop_dao_vang: { icon: 'orange', quality: 'APPROPRIATE', reason: 'Đào vàng đóng hộp tương đương hoa quả múi vàng cam', packCategory: 'food' },
  hop_dau: { icon: 'corn', quality: 'APPROPRIATE', reason: 'Đậu đóng hộp tương đương rau củ đóng hạt (corn)', packCategory: 'food' },
  hop_thit_bo: { icon: 'steak', quality: 'EQUIVALENT', reason: 'Thịt bò đóng hộp tương đương thịt bò steak', packCategory: 'food' },
  hop_quan_luong: { icon: 'tosti', quality: 'APPROPRIATE', reason: 'Đồ hộp quân dụng khẩu phần ăn liền tiện dụng', packCategory: 'food' },
  hop_ca_moi: { icon: 'cooked_fish', quality: 'EQUIVALENT', reason: 'Cá mòi đóng hộp tương đương cá chế biến', packCategory: 'food' },
  hop_ca_ngu: { icon: 'cooked_fish', quality: 'EQUIVALENT', reason: 'Cá ngừ đóng hộp tương đương cá chế biến', packCategory: 'food' },
  hop_ca_thu_dao: { icon: 'cooked_fish', quality: 'EQUIVALENT', reason: 'Cá thu đao đóng hộp tương đương cá chế biến', packCategory: 'food' },
  hop_ca_nuc: { icon: 'cooked_fish', quality: 'EQUIVALENT', reason: 'Cá nục đóng hộp tương đương cá chế biến', packCategory: 'food' },

  // ==========================================
  // 2. HOA QUẢ (FRUITS - 11 items)
  // ==========================================
  tao: { icon: 'apple', quality: 'EXACT', reason: 'Táo khớp chính xác icon apple', packCategory: 'food' },
  chuoi: { icon: 'banana', quality: 'EXACT', reason: 'Chuối khớp chính xác icon banana', packCategory: 'food' },
  cam: { icon: 'orange', quality: 'EXACT', reason: 'Cam khớp chính xác icon orange', packCategory: 'food' },
  le_tuyet: { icon: 'ice_cubes', quality: 'APPROPRIATE', reason: 'Lê tuyết có đặc tính thanh mát lạnh như băng tuyết', packCategory: 'drink' },
  nho: { icon: 'grape', quality: 'EXACT', reason: 'Nho khớp chính xác icon grape', packCategory: 'food' },
  dua_hau: { icon: 'apple', quality: 'GENERIC', reason: 'Dưa hấu hoa quả tươi mọng', packCategory: 'food' },
  dau_tay: { icon: 'strawberry', quality: 'EXACT', reason: 'Dâu tây khớp chính xác icon strawberry', packCategory: 'food' },
  viet_quat: { icon: 'grape', quality: 'APPROPRIATE', reason: 'Việt quất quả mọng tím tương đồng chùm nho nhỏ', packCategory: 'food' },
  dao: { icon: 'orange', quality: 'APPROPRIATE', reason: 'Quả đào thịt quả vàng cam tương đồng trái cây tươi', packCategory: 'food' },
  xoai: { icon: 'banana', quality: 'APPROPRIATE', reason: 'Xoài quả nhiệt đới vàng ngọt', packCategory: 'food' },
  hong: { icon: 'tomato', quality: 'APPROPRIATE', reason: 'Quả hồng đỏ mọng tương đồng quả đỏ tròn tomato', packCategory: 'food' },

  // ==========================================
  // 3. ĐỒ UỐNG (DRINKS - 12 items)
  // ==========================================
  nuoc_khoang: { icon: 'water_bottle', quality: 'EXACT', reason: 'Nước suối khớp chính xác icon water_bottle', packCategory: 'drink' },
  nuoc_dua: { icon: 'coconut_water', quality: 'EXACT', reason: 'Nước dừa khớp chính xác icon coconut_water', packCategory: 'drink' },
  nuoc_cam_qua: { icon: 'juice_carton', quality: 'EXACT', reason: 'Nước cam hộp có tép quả khớp juice_carton', packCategory: 'drink' },
  sua_tuoi: { icon: 'milk_carton', quality: 'EXACT', reason: 'Sữa tươi hộp khớp chính xác icon milk_carton', packCategory: 'drink' },
  sua_chua: { icon: 'milkshake', quality: 'EQUIVALENT', reason: 'Sữa chua uống béo ngậy tương đương milkshake', packCategory: 'drink' },
  giam_tao: { icon: 'wine', quality: 'APPROPRIATE', reason: 'Giấm táo lên men chai thủy tinh tương đương wine', packCategory: 'drink' },
  nuoc_maverick: { icon: 'energy_drink', quality: 'EQUIVALENT', reason: 'Nước tăng lực Maverick lon tương đương energy_drink', packCategory: 'drink' },
  nuoc_dien_giai: { icon: 'energy_drink', quality: 'EQUIVALENT', reason: 'Nước bù điện giải lon tương đương energy_drink', packCategory: 'drink' },
  nuoc_the_thao: { icon: 'energy_drink', quality: 'EQUIVALENT', reason: 'Nước thể thao lon tương đương energy_drink', packCategory: 'drink' },
  bia_tram_vi: { icon: 'beer', quality: 'EXACT', reason: 'Bia Trăm Vị khớp chính xác icon beer', packCategory: 'drink' },
  bia_nang_luong: { icon: 'beer', quality: 'EQUIVALENT', reason: 'Bia Năng Lượng lon bia kết hợp nước lực', packCategory: 'drink' },
  ruou_cao_do: { icon: 'whiskey', quality: 'EQUIVALENT', reason: 'Rượu trắng nồng độ cao tương đương chai rượu mạnh whiskey', packCategory: 'drink' },

  // ==========================================
  // 4. Y TẾ (MEDICINES - 14 items)
  // ==========================================
  bang_keo: { icon: 'bandage', quality: 'EXACT', reason: 'Băng cá nhân dán vết thương khớp bandage', packCategory: 'medical' },
  dich_gluco: { icon: 'blood_bag', quality: 'EQUIVALENT', reason: 'Túi truyền dịch gluco tương đương túi truyền dịch/blood_bag', packCategory: 'medical' },
  thuoc_giam_dau: { icon: 'painkillers', quality: 'EXACT', reason: 'Thuốc giảm đau khớp chính xác icon painkillers', packCategory: 'medical' },
  thuoc_an_than: { icon: 'painkillers', quality: 'EQUIVALENT', reason: 'Thuốc an thần vỉ viên nén tương đương painkillers', packCategory: 'medical' },
  adrenalin: { icon: 'adrenaline_shot', quality: 'EXACT', reason: 'Ống tiêm Adrenalin khớp chính xác icon adrenaline_shot', packCategory: 'medical' },
  day_bo_mau: { icon: 'tourniquet', quality: 'EXACT', reason: 'Dây ga-rô garrotte bó cầm máu khớp tourniquet', packCategory: 'medical' },
  thuoc_sach_vet: { icon: 'gauze', quality: 'EXACT', reason: 'Gạc làm sạch vết thương sát khuẩn khớp gauze', packCategory: 'medical' },
  goi_phau_thuat: { icon: 'ifaks', quality: 'EQUIVALENT', reason: 'Gói phẫu thuật sơ cấp cứu dã chiến tương đương IFAK', packCategory: 'medical' },
  khang_sinh: { icon: 'painkillers', quality: 'EQUIVALENT', reason: 'Thuốc kháng sinh viên uống tương đương painkillers', packCategory: 'medical' },
  huyet_thanh: { icon: 'syringe', quality: 'EQUIVALENT', reason: 'Huyết thanh kháng nhiễm dạng kim tiêm tiệt trùng', packCategory: 'medical' },
  goi_cap_cuu: { icon: 'firstaid', quality: 'EXACT', reason: 'Gói cấp cứu y tế sơ khai khớp firstaid', packCategory: 'medical' },
  hop_y_te: { icon: 'medkit', quality: 'EXACT', reason: 'Hộp y tế chiến trường chuyên dụng khớp medkit', packCategory: 'medical' },
  tiem_van_nang: { icon: 'morphine', quality: 'EQUIVALENT', reason: 'Thuốc tiêm đa năng hồi sinh lực tương đương morphine auto-injector', packCategory: 'medical' },
  improved_serum: { icon: 'syringe', quality: 'EQUIVALENT', reason: 'Kháng thể cải tiến tiêm tĩnh mạch dạng syringe', packCategory: 'medical' },
  zombie_gel: { icon: 'acetone', quality: 'APPROPRIATE', reason: 'Chai hóa chất dung môi trích xuất từ zombie', packCategory: 'medical' },

  // ==========================================
  // 5. THUỐC LÁ (CIGARETTES - 1 item)
  // ==========================================
  thuoc_la: { icon: 'cigarette_pack', quality: 'EXACT', reason: 'Gói thuốc lá khớp chính xác icon cigarette_pack', packCategory: 'misc' },

  // ==========================================
  // 6. VẬT LIỆU XÂY DỰNG (MATERIALS - 5 items)
  // ==========================================
  wood: { icon: 'wood_plank', quality: 'EXACT', reason: 'Gỗ tấm xây dựng khớp chính xác icon wood_plank', packCategory: 'materials' },
  building_mat: { icon: 'steel', quality: 'EQUIVALENT', reason: 'Vật liệu xây dựng tấm thép kiên cố', packCategory: 'materials' },
  nails: { icon: 'screws', quality: 'EQUIVALENT', reason: 'Đinh sắt kim khí tương đương ốc vít screws', packCategory: 'materials' },
  glass: { icon: 'glass', quality: 'EXACT', reason: 'Mảnh kính vật liệu khớp chính xác icon glass', packCategory: 'materials' },
  stone: { icon: 'gold_ore', quality: 'EQUIVALENT', reason: 'Khối quặng khoáng sản thô tương đương khối đá xây dựng', packCategory: 'materials' },

  // ==========================================
  // 7. THỦY HẢI SẢN (FISH - 16 items)
  // ==========================================
  grey_mullet: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá lóc xám câu được biểu thị qua icon cá sinh tồn', packCategory: 'food' },
  iron_sardine: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá mòi sắt sinh tồn biểu thị qua icon cá', packCategory: 'food' },
  blunt_seabream: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá tráp đầu tù biểu thị qua icon cá', packCategory: 'food' },
  blacktail_mackerel: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá thu đuôi đen biểu thị qua icon cá', packCategory: 'food' },
  ray_barracuda: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá nhồng vằn biển biểu thị qua icon cá', packCategory: 'food' },
  rust_flounder: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá bơn gỉ sét biểu thị qua icon cá', packCategory: 'food' },
  twin_grouper: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá song hai đầu đột biến biểu thị qua icon cá', packCategory: 'food' },
  sewage_eel: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Lươn cống rãnh biểu thị qua icon thủy hải sản', packCategory: 'food' },
  corpse_cod: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá tuyết tử thi biểu thị qua icon cá sinh tồn', packCategory: 'food' },
  spine_wolffish: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá sói gai biểu thị qua icon cá sinh tồn', packCategory: 'food' },
  gel_lanternfish: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá lồng đèn phát quang sinh thái biển', packCategory: 'food' },
  multi_barb_king: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Vua cá nhiều râu biểu thị qua icon cá quý', packCategory: 'food' },
  dead_giant_cod: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá tuyết khổng lồ cổ đại', packCategory: 'food' },
  plague_tentacle: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Thủy quái dịch bệnh sinh tồn biển sâu', packCategory: 'food' },
  wreck_ghost_shark: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá mập bóng ma xác tàu', packCategory: 'food' },
  abyss_core_fish: { icon: 'cooked_fish', quality: 'APPROPRIATE', reason: 'Cá lõi vực thẳm sinh vật biển cực hiếm', packCategory: 'food' },

  // ==========================================
  // 8. BỮA ĂN HẢI SẢN (SEAFOOD MEALS - 5 items)
  // ==========================================
  bad_seafood_meal: { icon: 'cooked_fish', quality: 'EXACT', reason: 'Món cá hải sản nấu chín dã chiến', packCategory: 'food' },
  normal_seafood_meal: { icon: 'cooked_fish', quality: 'EXACT', reason: 'Bữa ăn hải sản chín tiêu chuẩn', packCategory: 'food' },
  delicious_seafood_meal: { icon: 'cooked_fish', quality: 'EXACT', reason: 'Bữa ăn hải sản chín thơm ngon', packCategory: 'food' },
  tempting_seafood_meal: { icon: 'cooked_fish', quality: 'EXACT', reason: 'Bữa ăn hải sản chín hấp dẫn', packCategory: 'food' },
  top_seafood_meal: { icon: 'cooked_fish', quality: 'EXACT', reason: 'Bữa ăn hải sản chín cao cấp thịnh soạn', packCategory: 'food' },

  // ==========================================
  // 9. BALO & TÚI ĐỰNG (BACKPACKS - 23 items)
  // ==========================================
  tui_xach: { icon: 'duffel_bag', quality: 'EXACT', reason: 'Túi xách tay vải bạt khớp duffel_bag', packCategory: 'misc' },
  tui_eo_nho: { icon: 'duffel_bag', quality: 'EQUIVALENT', reason: 'Túi đeo thắt lưng nhỏ tương đương duffel/bag', packCategory: 'misc' },
  balo_nho: { icon: 'backpack', quality: 'EXACT', reason: 'Balo nhỏ khớp chính xác icon backpack', packCategory: 'misc' },
  tui_xach_tay: { icon: 'duffel_bag', quality: 'EXACT', reason: 'Túi xách tay dã chiến khớp duffel_bag', packCategory: 'misc' },
  balo_va_canvas: { icon: 'backpack', quality: 'EXACT', reason: 'Balo vải canvas khớp chính xác icon backpack', packCategory: 'misc' },
  balo_thoi_trang: { icon: 'backpack', quality: 'EXACT', reason: 'Balo thời trang khớp chính xác icon backpack', packCategory: 'misc' },
  balo_the_thao: { icon: 'backpack', quality: 'EXACT', reason: 'Balo thể thao khớp chính xác icon backpack', packCategory: 'misc' },
  balo_le_nui: { icon: 'backpack', quality: 'EXACT', reason: 'Balo leo núi sinh tồn khớp backpack', packCategory: 'misc' },
  balo_quan_doi: { icon: 'backpack', quality: 'EXACT', reason: 'Balo quân sự dã chiến khớp backpack', packCategory: 'misc' },
  balo_chien_thuat: { icon: 'backpack', quality: 'EXACT', reason: 'Balo chiến thuật tác chiến khớp backpack', packCategory: 'misc' },
  balo_dac_biet: { icon: 'backpack', quality: 'EXACT', reason: 'Balo sinh tồn đặc biệt khớp backpack', packCategory: 'misc' },
  balo_le_nui_cap_i: { icon: 'backpack', quality: 'EXACT', reason: 'Balo leo núi chuyên dụng cấp I', packCategory: 'misc' },
  balo_le_nui_cap_ii: { icon: 'backpack', quality: 'EXACT', reason: 'Balo leo núi chuyên dụng cấp II', packCategory: 'misc' },
  balo_le_nui_cap_iii: { icon: 'backpack', quality: 'EXACT', reason: 'Balo leo núi chuyên dụng cấp III', packCategory: 'misc' },
  balo_le_nui_cap_iv: { icon: 'backpack', quality: 'EXACT', reason: 'Balo leo núi chuyên dụng cấp IV', packCategory: 'misc' },
  balo_du_lich_sieu_lon: { icon: 'backpack', quality: 'EXACT', reason: 'Balo du lịch thám hiểm cỡ đại', packCategory: 'misc' },
  balo_du_lich_nang_cap: { icon: 'backpack', quality: 'EXACT', reason: 'Balo du lịch cải tiến sức chứa', packCategory: 'misc' },
  balo_du_lich_cao_cap: { icon: 'backpack', quality: 'EXACT', reason: 'Balo du lịch vật liệu cao cấp', packCategory: 'misc' },
  balo_the_thao_chu_tai: { icon: 'backpack', quality: 'EXACT', reason: 'Balo thể thao công suất chịu tải lớn', packCategory: 'misc' },
  balo_quan_doi_chu_tai: { icon: 'backpack', quality: 'EXACT', reason: 'Balo dã chiến quân giới chịu lực nặng', packCategory: 'misc' },
  balo_dac_biet_chu_tai: { icon: 'backpack', quality: 'EXACT', reason: 'Balo đặc vụ chịu tải chuyên sâu', packCategory: 'misc' },
  balo_dung_khi_chu_tai: { icon: 'backpack', quality: 'EXACT', reason: 'Balo dũng khí chịu tải tối thượng', packCategory: 'misc' },
  balo_luu_tru_vu_tru: { icon: 'backpack', quality: 'EXACT', reason: 'Balo công nghệ không gian vũ trụ', packCategory: 'misc' },

  // ==========================================
  // 10. VŨ KHÍ CÔNG CỤ (MELEE TOOLS - 6 items)
  // ==========================================
  bua_sat_nho: { icon: 'hammer', quality: 'EXACT', reason: 'Búa sắt nhỏ khớp chính xác icon hammer', packCategory: 'tools' },
  bua_be_mot: { icon: 'hammer', quality: 'EXACT', reason: 'Búa nhổ đinh khớp chính xác icon hammer', packCategory: 'tools' },
  can_xich_lon: { icon: 'wrench', quality: 'EXACT', reason: 'Cờ lê lớn khớp chính xác icon wrench', packCategory: 'tools' },
  cay_nay: { icon: 'crowbar', quality: 'EXACT', reason: 'Cây nạy xà beng khớp chính xác icon crowbar', packCategory: 'tools' },
  xeng_sat: { icon: 'shovel', quality: 'EXACT', reason: 'Xẻng sắt công binh khớp chính xác icon shovel', packCategory: 'tools' },
  cao_cuoc: { icon: 'pickaxe', quality: 'EQUIVALENT', reason: 'Cào cuốc đào bới tương đương cuốc pickaxe', packCategory: 'tools' },

  // ==========================================
  // 11. ĐẠN DƯỢC (AMMO - 12 items)
  // ==========================================
  '9×19mm': { icon: 'pistol_ammo', quality: 'EXACT', reason: 'Đạn súng ngắn 9x19mm khớp chính xác pistol_ammo', packCategory: 'ammo' },
  '.45 ACP': { icon: 'pistol_ammo', quality: 'EQUIVALENT', reason: 'Đạn súng ngắn .45 ACP tương đương pistol_ammo', packCategory: 'ammo' },
  '.50 AE': { icon: 'pistol_ammo', quality: 'EQUIVALENT', reason: 'Đạn súng ngắn hỏa lực mạnh Desert Eagle tương đương pistol_ammo', packCategory: 'ammo' },
  '.357 Magnum': { icon: 'pistol_ammo', quality: 'EQUIVALENT', reason: 'Đạn súng ngắn ổ xoay Magnum tương đương pistol_ammo', packCategory: 'ammo' },
  '5.7×28mm': { icon: 'smg_ammo', quality: 'EXACT', reason: 'Đạn tiểu liên P90 5.7x28mm khớp chính xác smg_ammo', packCategory: 'ammo' },
  '5.56×45mm NATO': { icon: 'rifle_ammo', quality: 'EXACT', reason: 'Đạn trường tấn công 5.56 NATO khớp chính xác rifle_ammo', packCategory: 'ammo' },
  '7.62×39mm': { icon: 'rifle_ammo', quality: 'EXACT', reason: 'Đạn súng trường AK 7.62x39mm khớp chính xác rifle_ammo', packCategory: 'ammo' },
  '7.62×51mm': { icon: 'rifle_ammo', quality: 'EQUIVALENT', reason: 'Đạn trường chiến đấu 7.62 NATO tương đương rifle_ammo', packCategory: 'ammo' },
  '7.62×54mmR': { icon: 'rifle_ammo', quality: 'EQUIVALENT', reason: 'Đạn súng trường Mosin 7.62x54R tương đương rifle_ammo', packCategory: 'ammo' },
  '7.92×57mm': { icon: 'rifle_ammo', quality: 'EQUIVALENT', reason: 'Đạn súng trường Mauser tương đương rifle_ammo', packCategory: 'ammo' },
  '.300 Winchester Magnum': { icon: 'snp_ammo', quality: 'EXACT', reason: 'Đạn bắn tỉa Magnum khớp chính xác snp_ammo', packCategory: 'ammo' },
  dan_12: { icon: 'shotgun_ammo', quality: 'EXACT', reason: 'Đạn hoa cải shotgun cỡ 12 khớp chính xác shotgun_ammo', packCategory: 'ammo' },

  // ==========================================
  // 12. VẬT PHẨM ĐẶC BIỆT & QUYỀN LỰC (SPECIAL ITEMS - 20 items)
  // ==========================================
  noble_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ căn cước quý tộc khớp id_card', packCategory: 'documents' },
  viscount_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ thân phận Tử tước khớp id_card', packCategory: 'documents' },
  count_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ thân phận Bá tước khớp id_card', packCategory: 'documents' },
  marquis_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ thân phận Hầu tước khớp id_card', packCategory: 'documents' },
  duke_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ thân phận Công tước khớp id_card', packCategory: 'documents' },
  crown_prince_id: { icon: 'id_card', quality: 'EXACT', reason: 'Thẻ thân phận Trữ quân hoàng gia khớp id_card', packCategory: 'documents' },
  castle_pass: { icon: 'security_card_01', quality: 'EQUIVALENT', reason: 'Thẻ từ thông hành thành trì tương đương thẻ từ bảo mật', packCategory: 'documents' },
  dawn_badge: { icon: 'police_badge', quality: 'EQUIVALENT', reason: 'Huy hiệu quân đoàn Dawn tương đương huy hiệu biểu trưng', packCategory: 'police' },
  silence_badge: { icon: 'police_badge', quality: 'EQUIVALENT', reason: 'Huy hiệu Tịch diệt trừng phạt tương đương huy hiệu biểu trưng', packCategory: 'police' },
  dawn_captain_badge: { icon: 'police_badge', quality: 'EQUIVALENT', reason: 'Huy hiệu đội trưởng tiên phong Dawn', packCategory: 'police' },
  farming_master_badge: { icon: 'police_badge', quality: 'APPROPRIATE', reason: 'Huy hiệu danh dự bậc thầy nông nghiệp', packCategory: 'police' },
  underground_key: { icon: 'house_key', quality: 'EQUIVALENT', reason: 'Chìa khóa mở khu vực ngầm tương đương house_key', packCategory: 'misc' },
  car_key: { icon: 'vehicle_key', quality: 'EXACT', reason: 'Chìa khóa xe hơi khớp vehicle_key', packCategory: 'vehicle' },
  miaomiao_diary: { icon: 'stickynote', quality: 'EQUIVALENT', reason: 'Sổ nhật ký ghi chép giấy tương đương sticky note tài liệu', packCategory: 'documents' },
  letter_to_sister: { icon: 'contract_paper', quality: 'EQUIVALENT', reason: 'Bức thư tay trang giấy cuộn gửi em gái', packCategory: 'documents' },
  queen_reply: { icon: 'contract_paper', quality: 'EQUIVALENT', reason: 'Thư sắc lệnh hoàng gia gửi lại', packCategory: 'documents' },
  crime_data: { icon: 'filled_evidence_bag', quality: 'EXACT', reason: 'Túi hồ sơ chứng cứ tội phạm khớp filled_evidence_bag', packCategory: 'police' },
  love_token: { icon: 'goldchain', quality: 'EQUIVALENT', reason: 'Kỷ vật đính ước dây chuyền vàng quý giá', packCategory: 'valuables' },
  lightning_scale: { icon: 'diamond', quality: 'APPROPRIATE', reason: 'Vảy rồng sét lấp lánh tinh thể quý hiếm', packCategory: 'valuables' },
  thunder_scale: { icon: 'diamond', quality: 'APPROPRIATE', reason: 'Vảy rồng sấm lấp lánh tinh thể quý hiếm', packCategory: 'valuables' },
  strange_recorder: { icon: 'usb_drive', quality: 'EQUIVALENT', reason: 'Thiết bị lưu trữ ghi âm kỹ thuật số tương đương USB drive', packCategory: 'documents' },
  small_nuclear_generator: { icon: 'electronickit', quality: 'APPROPRIATE', reason: 'Bộ linh kiện điện tử vi mạch công nghệ cao tương đương cụm máy phát điện', packCategory: 'materials' },

  // ==========================================
  // 12. HẠT GIỐNG NÔNG NGHIỆP (SEEDS - 15 items)
  // ==========================================
  seed_niupicai: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống cáu bò', packCategory: 'farming' },
  seed_machixian: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống xà lách bò', packCategory: 'farming' },
  seed_juju: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống cách lá', packCategory: 'farming' },
  seed_yangjiang: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống hành lá Tây', packCategory: 'farming' },
  seed_mushu: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống cassava', packCategory: 'farming' },
  seed_hongshu: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống khoai lang', packCategory: 'farming' },
  seed_tudou: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống khoai tây', packCategory: 'farming' },
  seed_wujing: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống cải trắng', packCategory: 'farming' },
  seed_boluomencan: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống nhân sâm Ba La Môn', packCategory: 'farming' },
  seed_luobo: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống cà rốt', packCategory: 'farming' },
  seed_jiucai: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống hẹ', packCategory: 'farming' },
  seed_gouqi: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống kỷ tử', packCategory: 'farming' },
  seed_suanmo: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống rau chua', packCategory: 'farming' },
  seed_heimai: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống mạch đen', packCategory: 'farming' },
  seed_wandou: { icon: 'weed_seed', quality: 'EQUIVALENT', reason: 'Gói hạt giống đậu Hà Lan', packCategory: 'farming' },
};

/**
 * Lấy đường dẫn icon SwisserAI theo item và độ phân giải mong muốn
 * @param {Object|string} item - Vật phẩm hoặc ID vật phẩm
 * @param {'100'|'256'} size - Kích thước icon mong muốn ('100' cho thẻ bài, '256' cho modal chi tiết)
 * @returns {string|null} Đường dẫn asset WebP hoặc null nếu không có ánh xạ
 */
export function getItemIconPath(item, size = '100') {
  if (!item) return null;
  const itemId = typeof item === 'string' ? item : item.id;
  if (!itemId) return null;

  const mapping = ITEM_ICON_MAP[itemId];
  if (!mapping || !mapping.icon) return null;

  const validSize = size === '256' ? '256' : '100';
  return `${SWISSERAI_BASE_PATH}/webp-${validSize}/${mapping.icon}.webp`;
}

/**
 * Lấy thông tin metadata ánh xạ của một vật phẩm
 * @param {Object|string} item - Vật phẩm hoặc ID vật phẩm
 * @returns {Object|null} Metadata ánh xạ hoặc null
 */
export function getItemIconEntry(item) {
  if (!item) return null;
  const itemId = typeof item === 'string' ? item : item.id;
  return ITEM_ICON_MAP[itemId] || null;
}

/**
 * Trả về toàn bộ bản đồ ánh xạ icon
 * @returns {Object} Bản đồ ánh xạ đầy đủ
 */
export function getAllItemIconMappings() {
  return { ...ITEM_ICON_MAP };
}

