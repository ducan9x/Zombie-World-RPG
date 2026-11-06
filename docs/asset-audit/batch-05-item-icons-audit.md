# BÁO CÁO KIỂM KÊ TÀI NGUYÊN BATCH 05 – ITEM ICONS | ZOMBIE WORLD RPG

> **Ngày thực hiện:** 06/11/2026  
> **Trạng thái kiểm kê:** HOÀN THÀNH TOÀN DIỆN (100% Ground Truth Source Code Audit)  
> **Phạm vi kiểm tra:** Toàn bộ cơ sở dữ liệu vật phẩm, kho đồ (inventory), trang bị (equipment), hàng hóa (cargo), chiến lợi phẩm (loot), cửa hàng (shops), hệ thống nông nghiệp, câu cá, y tế, vũ khí và nhiệm vụ lâu đài.

---

## 1. MỤC TIÊU VÀ PHẠM VI KIỂM KÊ

Báo cáo này thiết lập thống kê số liệu thực tế dựa trên việc quét từng file mã nguồn định nghĩa vật phẩm của dự án **Zombie World RPG**. Toàn bộ số liệu được trích xuất trực tiếp từ code logic, không sử dụng số liệu giả định hay ước lượng.

### Phạm vi source code đã quét:
1. `js/data/weapons/melee.js` (40 vũ khí cận chiến)
2. `js/data/weapons/ranged.js` (45 vũ khí tầm xa, 13 loại đạn dược)
3. `js/data/items/foods.js` (19 thực phẩm, 11 trái cây)
4. `js/data/items/drinks.js` (12 thức uống)
5. `js/data/items/medicines.js` (15 vật phẩm y tế)
6. `js/data/items/crops.js` (15 nông sản thu hoạch, 15 gói hạt giống)
7. `js/data/items/fish.js` (16 loài cá đánh bắt)
8. `js/data/items/seafood-meals.js` (5 món ăn chế biến hải sản)
9. `js/data/items/building-materials.js` (5 nguyên liệu xây dựng)
10. `js/data/items/backpacks.js` (23 cấp bậc túi/ba lô mở rộng sức chứa)
11. `js/data/items/cigarettes.js` & `js/state.js` (3 hàng hóa tài nguyên/tiền tệ trao đổi: thuốc lá, xăng dầu, tiền hoàng gia)
12. `js/data/systems/castle.js` (23 vật phẩm nhiệm vụ và đặc biệt của hệ thống lâu đài)

---

## A. TỔNG QUAN BATCH 05

| Chỉ số | Số lượng | Ghi chú kỹ thuật |
|---|---:|---|
| **Tổng số item definitions** | **260** | Định nghĩa vật phẩm độc nhất trong JavaScript data modules |
| **Tổng số item icon độc lập cần có** | **260** *(hoặc **238**)* | 260 nếu mỗi cấp ba lô có icon riêng; 238 nếu 23 loại ba lô dùng chung icon slot ba lô |
| **Ảnh đã tồn tại (`EXISTS`)** | **3** | `ui_icon_res_cigarette.png`, `ui_icon_res_gasoline.png`, `ui_icon_res_royal_coin.png` |
| **Ảnh còn thiếu (`MISSING`)** | **257** *(hoặc **234**)* | Toàn bộ 257 item đang hiển thị dưới dạng văn bản tên chuỗi trong UI |
| **Ảnh placeholder (`PLACEHOLDER`)** | **0** | UI không dùng ảnh tạm cho item mà dùng chuỗi văn bản HTML |
| **Broken references (`BROKEN_REFERENCE`)** | **0** | Không có thẻ `<img>` nào bị trỏ sai đường dẫn 404 cho item icons |
| **Shared assets (`SHARED_ASSET`)** | **1** | `ui_icon_backpack.png` (icon ô danh mục ba lô được UI hiển thị chung) |
| **Chưa xác minh (`NEEDS_VERIFICATION`)** | **0** | 100% item đều xác minh được trực tiếp từ mã nguồn thực tế |

### Phân bố theo danh mục vật phẩm (15 Categories):

| STT | Danh mục (Category) | Số lượng Item | Trạng thái hiện tại | Thư mục mã nguồn |
|:---:|---|:---:|:---:|---|
| 1 | Melee Weapons (Vũ khí cận chiến) | 40 | 40 MISSING | `js/data/weapons/melee.js` |
| 2 | Ranged Weapons (Vũ khí tầm xa) | 45 | 45 MISSING | `js/data/weapons/ranged.js` |
| 3 | Ammunition (Đạn dược) | 13 | 13 MISSING | `js/data/weapons/ranged.js` |
| 4 | Foods (Thực phẩm tổng hợp) | 19 | 19 MISSING | `js/data/items/foods.js` |
| 5 | Fruits (Trái cây tươi) | 11 | 11 MISSING | `js/data/items/foods.js` |
| 6 | Drinks (Đồ uống) | 12 | 12 MISSING | `js/data/items/drinks.js` |
| 7 | Medicines (Dược phẩm & Y tế) | 15 | 15 MISSING | `js/data/items/medicines.js` |
| 8 | Crops (Nông sản thu hoạch) | 15 | 15 MISSING | `js/data/items/crops.js` |
| 9 | Seeds (Hạt giống cây trồng) | 15 | 15 MISSING | `js/data/items/crops.js` |
| 10 | Fish (Cá tươi câu được) | 16 | 16 MISSING | `js/data/items/fish.js` |
| 11 | Seafood Meals (Món ăn hải sản) | 5 | 5 MISSING | `js/data/items/seafood-meals.js` |
| 12 | Building Materials (Vật liệu xây dựng) | 5 | 5 MISSING | `js/data/items/building-materials.js` |
| 13 | Backpacks (Túi & Ba lô mở rộng) | 23 | 23 MISSING (hoặc 1 SHARED) | `js/data/items/backpacks.js` |
| 14 | Commodities / Currency (Hàng hóa & Tiền tệ) | 3 | **3 EXISTS** | `js/data/items/cigarettes.js`, `js/state.js` |
| 15 | Special / Quest Items (Vật phẩm đặc biệt) | 23 | 23 MISSING | `js/data/systems/castle.js` |
| **Tổng** | **15 danh mục** | **260** | **3 EXISTS / 257 MISSING** | |

---

## B. DANH SÁCH ĐẦY ĐỦ ITEM ICONS (260 ITEMS)

Dưới đây là bảng đối chiếu từng item definition trong codebase với tình trạng asset hình ảnh:

| STT | Item ID | Item Name | Category | Filename | Status | Dimensions | Source Path |
|:---:|---|---|---|---|:---:|:---:|---|
| 1 | `dam` | Nắm Đấm | Melee Weapons | `item_melee_dam.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 2 | `dao_bep` | Dao Bếp | Melee Weapons | `item_melee_dao_bep.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 3 | `gay_go` | Gậy gỗ | Melee Weapons | `item_melee_gay_go.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 4 | `cao_cuoc` | Cào Cuốc | Melee Weapons | `item_melee_cao_cuoc.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 5 | `bua_sat_nho` | Búa sắt nhỏ | Melee Weapons | `item_melee_bua_sat_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 6 | `chao_ap` | Chảo Áp | Melee Weapons | `item_melee_chao_ap.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 7 | `can_xich_lon` | Cờ Lê Lớn | Melee Weapons | `item_melee_can_xich_lon.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 8 | `gay_bong_chay` | Gậy bóng chày | Melee Weapons | `item_melee_gay_bong_chay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 9 | `ong_sat` | Ống sắt | Melee Weapons | `item_melee_ong_sat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 10 | `xeng_sat` | Xẻng Sắt | Melee Weapons | `item_melee_xeng_sat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 11 | `dao_gam_nho` | Dao Găm Nhỏ | Melee Weapons | `item_melee_dao_gam_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 12 | `dao_tho_mo` | Dao thợ mổ | Melee Weapons | `item_melee_dao_tho_mo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 13 | `gay_cam_sat` | Gậy Cảnh Sát | Melee Weapons | `item_melee_gay_cam_sat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 14 | `cay_nay` | Cây Nạy | Melee Weapons | `item_melee_cay_nay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 15 | `bua_be_mot` | Búa nhổ đinh | Melee Weapons | `item_melee_bua_be_mot.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 16 | `riu_ngan` | Rìu ngắn | Melee Weapons | `item_melee_riu_ngan.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 17 | `riu_cuu_hoa` | Rìu cứu hỏa | Melee Weapons | `item_melee_riu_cuu_hoa.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 18 | `dao_san` | Dao săn | Melee Weapons | `item_melee_dao_san.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 19 | `dao_quan_doi` | Dao quân đội | Melee Weapons | `item_melee_dao_quan_doi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 20 | `dao_chi_ho` | Dao Chỉ Hổ | Melee Weapons | `item_melee_dao_chi_ho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 21 | `dao_kham_lon` | Đao Chém Lớn | Melee Weapons | `item_melee_dao_kham_lon.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 22 | `dao_tram_ma` | Đao Trảm Mã | Melee Weapons | `item_melee_dao_tram_ma.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 23 | `roi_chin_dot` | Roi Chín Đốt | Melee Weapons | `item_melee_roi_chin_dot.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 24 | `kiem_tay` | Kiếm Tây | Melee Weapons | `item_melee_kiem_tay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 25 | `bua_sao_bang` | Búa sao băng | Melee Weapons | `item_melee_bua_sao_bang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 26 | `kiem_thep_sap` | Kiếm Thép Ngắn | Melee Weapons | `item_melee_kiem_thep_sap.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 27 | `kiem_long_thao` | Kiếm Long Thảo | Melee Weapons | `item_melee_kiem_long_thao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 28 | `sung_ky_binh` | Giáo Kỵ Binh | Melee Weapons | `item_melee_sung_ky_binh.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 29 | `kiem_hai_luoi` | Kiếm hai lưỡi | Melee Weapons | `item_melee_kiem_hai_luoi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 30 | `kiem_melayu` | Kiếm Melayu | Melee Weapons | `item_melee_kiem_melayu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 31 | `dao_samurai` | Đao Samurai | Melee Weapons | `item_melee_dao_samurai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 32 | `dao_ngang_duong` | Đao Ngang Đường | Melee Weapons | `item_melee_dao_ngang_duong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 33 | `may_cat_cay` | Máy cắt cây | Melee Weapons | `item_melee_may_cat_cay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 34 | `kiem_dung_si` | Kiếm Dũng Sĩ | Melee Weapons | `item_melee_kiem_dung_si.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 35 | `kiem_vu_tru` | Kiếm Vũ Trụ | Melee Weapons | `item_melee_kiem_vu_tru.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 36 | `kiem_vo_uy` | Kiếm Vô Uy | Melee Weapons | `item_melee_kiem_vo_uy.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 37 | `kiem_bac_hoang_gia` | Kiếm bạc hoàng gia | Melee Weapons | `item_melee_kiem_bac_hoang_gia.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 38 | `dinh_ba_hai_ca` | Đinh Ba Hải Ca | Melee Weapons | `item_melee_dinh_ba_hai_ca.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 39 | `kiem_thuong_phong` | Kiếm Thương Phòng | Melee Weapons | `item_melee_kiem_thuong_phong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 40 | `dao_999` | Dao 999 | Melee Weapons | `item_melee_dao_999.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/melee.js` |
| 41 | `cung_go` | Cung gỗ | Ranged Weapons | `item_ranged_cung_go.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 42 | `cung_cong_nguoc` | Cung cong ngược | Ranged Weapons | `item_ranged_cung_cong_nguoc.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 43 | `cung_ket_hop` | Cung kết hợp | Ranged Weapons | `item_ranged_cung_ket_hop.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 44 | `no_thap_tu` | Nỏ Thập Tự | Ranged Weapons | `item_ranged_no_thap_tu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 45 | `no_gap` | Cối nỏ gấp | Ranged Weapons | `item_ranged_no_gap.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 46 | `no_san_ban` | Cối nỏ săn bắn | Ranged Weapons | `item_ranged_no_san_ban.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 47 | `cung_dong_que` | Cung đồng quê | Ranged Weapons | `item_ranged_cung_dong_que.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 48 | `P226` | P226 | Ranged Weapons | `item_ranged_p226.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 49 | `G17` | G17 | Ranged Weapons | `item_ranged_g17.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 50 | `USP9` | USP9 | Ranged Weapons | `item_ranged_usp9.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 51 | `M1911` | M1911 | Ranged Weapons | `item_ranged_m1911.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 52 | `GP100` | GP100 | Ranged Weapons | `item_ranged_gp100.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 53 | `sung_sa_mac` | Deagle (Sa Mạc) | Ranged Weapons | `item_ranged_sung_sa_mac.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 54 | `sung_hoang_gia` | Súng Ngắn Hoàng Gia | Ranged Weapons | `item_ranged_sung_hoang_gia.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 55 | `P90` | P90 | Ranged Weapons | `item_ranged_p90.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 56 | `UZI` | UZI | Ranged Weapons | `item_ranged_uzi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 57 | `MP5` | MP5 | Ranged Weapons | `item_ranged_mp5.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 58 | `MP7` | MP7 | Ranged Weapons | `item_ranged_mp7.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 59 | `Vector` | Vector | Ranged Weapons | `item_ranged_vector.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 60 | `UMP45` | UMP45 | Ranged Weapons | `item_ranged_ump45.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 61 | `M16A4` | M16A4 | Ranged Weapons | `item_ranged_m16a4.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 62 | `M4A1` | M4A1 | Ranged Weapons | `item_ranged_m4a1.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 63 | `SG552` | SG552 | Ranged Weapons | `item_ranged_sg552.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 64 | `HK416` | HK416 | Ranged Weapons | `item_ranged_hk416.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 65 | `AUG` | AUG | Ranged Weapons | `item_ranged_aug.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 66 | `AK47` | AK47 | Ranged Weapons | `item_ranged_ak47.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 67 | `AKM` | AKM | Ranged Weapons | `item_ranged_akm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 68 | `sung_81` | Súng Kiểu 81 | Ranged Weapons | `item_ranged_sung_81.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 69 | `AN94` | AN-94 | Ranged Weapons | `item_ranged_an94.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 70 | `SKS` | SKS | Ranged Weapons | `item_ranged_sks.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 71 | `SCARH` | SCAR-H | Ranged Weapons | `item_ranged_scarh.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 72 | `FAL` | FAL | Ranged Weapons | `item_ranged_fal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 73 | `EBR14` | EBR14 | Ranged Weapons | `item_ranged_ebr14.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 74 | `SR25` | SR25 | Ranged Weapons | `item_ranged_sr25.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 75 | `M700` | M700 | Ranged Weapons | `item_ranged_m700.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 76 | `Mosin` | Mosin-Nagant | Ranged Weapons | `item_ranged_mosin.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 77 | `AWM` | AWM | Ranged Weapons | `item_ranged_awm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 78 | `M249` | M249 SAW | Ranged Weapons | `item_ranged_m249.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 79 | `RPK` | RPK | Ranged Weapons | `item_ranged_rpk.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 80 | `M60` | M60 | Ranged Weapons | `item_ranged_m60.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 81 | `MG42` | MG42 | Ranged Weapons | `item_ranged_mg42.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 82 | `PKM` | PKM | Ranged Weapons | `item_ranged_pkm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 83 | `M870` | M870 | Ranged Weapons | `item_ranged_m870.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 84 | `AA12` | AA12 | Ranged Weapons | `item_ranged_aa12.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 85 | `SPAS12` | SPAS-12 | Ranged Weapons | `item_ranged_spas12.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 86 | `mui_ten` | Mũi tên | Ammunition | `item_ammo_mui_ten.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 87 | `.357 Magnum` | .357 Magnum | Ammunition | `item_ammo_357_magnum.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 88 | `.45 ACP` | .45 ACP | Ammunition | `item_ammo_45_acp.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 89 | `.50 AE` | .50 AE | Ammunition | `item_ammo_50_ae.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 90 | `9×19mm` | 9×19mm | Ammunition | `item_ammo_9x19mm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 91 | `5.7×28mm` | 5.7×28mm | Ammunition | `item_ammo_57x28mm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 92 | `7.62×39mm` | 7.62×39mm | Ammunition | `item_ammo_762x39mm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 93 | `5.56×45mm NATO` | 5.56×45mm NATO | Ammunition | `item_ammo_556x45mm_nato.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 94 | `7.62×51mm` | 7.62×51mm | Ammunition | `item_ammo_762x51mm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 95 | `7.62×54mmR` | 7.62×54mmR | Ammunition | `item_ammo_762x54mmr.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 96 | `7.92×57mm` | 7.92×57mm | Ammunition | `item_ammo_792x57mm.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 97 | `.300 Winchester Magnum` | .300 Winchester Magnum | Ammunition | `item_ammo_300_winchester_magnum.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 98 | `dan_12` | Đạn Shotgun 12 | Ammunition | `item_ammo_dan_12.png` | `MISSING` | 256×256 (đề xuất) | `js/data/weapons/ranged.js` |
| 99 | `dau_phong` | Đậu phộng | Foods | `item_food_dau_phong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 100 | `dau_lan_hoa` | Đậu phong lan | Foods | `item_food_dau_lan_hoa.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 101 | `hat_nho` | Hạt nhỏ | Foods | `item_food_hat_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 102 | `keo_que` | Kẹo que | Foods | `item_food_keo_que.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 103 | `thanh_nang_luong` | Thanh năng lượng | Foods | `item_food_thanh_nang_luong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 104 | `so_co_la` | Sô cô la | Foods | `item_food_so_co_la.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 105 | `mi_gion` | Mì giòn | Foods | `item_food_mi_gion.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 106 | `che_ngan_nhi` | Chè ngân nhĩ | Foods | `item_food_che_ngan_nhi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 107 | `rong_bien_gion` | Rong biển giòn | Foods | `item_food_rong_bien_gion.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 108 | `banh_quy_nen` | Bánh quy nén | Foods | `item_food_banh_quy_nen.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 109 | `banh_mi_lua_mi` | Bánh mì lúa mì | Foods | `item_food_banh_mi_lua_mi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 110 | `hop_dao_vang` | Đào vàng đóng hộp | Foods | `item_food_hop_dao_vang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 111 | `hop_dau` | Đậu đóng hộp | Foods | `item_food_hop_dau.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 112 | `hop_thit_bo` | Thịt bò đóng hộp | Foods | `item_food_hop_thit_bo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 113 | `hop_quan_luong` | Đồ hộp quân dụng | Foods | `item_food_hop_quan_luong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 114 | `hop_ca_moi` | Cá mòi đóng hộp | Foods | `item_food_hop_ca_moi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 115 | `hop_ca_ngu` | Cá ngừ đóng hộp | Foods | `item_food_hop_ca_ngu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 116 | `hop_ca_thu_dao` | Cá thu đao đóng hộp | Foods | `item_food_hop_ca_thu_dao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 117 | `hop_ca_nuc` | Cá nục đóng hộp | Foods | `item_food_hop_ca_nuc.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 118 | `tao` | Táo | Fruits | `item_fruit_tao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 119 | `chuoi` | Chuối | Fruits | `item_fruit_chuoi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 120 | `cam` | Cam | Fruits | `item_fruit_cam.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 121 | `le_tuyet` | Lê tuyết | Fruits | `item_fruit_le_tuyet.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 122 | `nho` | Nho | Fruits | `item_fruit_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 123 | `dua_hau` | Dưa hấu | Fruits | `item_fruit_dua_hau.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 124 | `dau_tay` | Dâu tây | Fruits | `item_fruit_dau_tay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 125 | `viet_quat` | Việt quất | Fruits | `item_fruit_viet_quat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 126 | `dao` | Đào | Fruits | `item_fruit_dao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 127 | `xoai` | Xoài | Fruits | `item_fruit_xoai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 128 | `hong` | Hồng | Fruits | `item_fruit_hong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/foods.js` |
| 129 | `nuoc_khoang` | Nước suối | Drinks | `item_drink_nuoc_khoang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 130 | `nuoc_dua` | Nước dừa | Drinks | `item_drink_nuoc_dua.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 131 | `nuoc_cam_qua` | Nước cam có quả | Drinks | `item_drink_nuoc_cam_qua.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 132 | `sua_tuoi` | Sữa tươi | Drinks | `item_drink_sua_tuoi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 133 | `sua_chua` | Sữa chua | Drinks | `item_drink_sua_chua.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 134 | `giam_tao` | Giấm táo | Drinks | `item_drink_giam_tao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 135 | `nuoc_maverick` | Nước Maverick | Drinks | `item_drink_nuoc_maverick.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 136 | `nuoc_dien_giai` | Nước điện giải | Drinks | `item_drink_nuoc_dien_giai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 137 | `nuoc_the_thao` | Nước thể thao | Drinks | `item_drink_nuoc_the_thao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 138 | `bia_tram_vi` | Bia Trăm Vị | Drinks | `item_drink_bia_tram_vi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 139 | `bia_nang_luong` | Bia Năng Lượng | Drinks | `item_drink_bia_nang_luong.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 140 | `ruou_cao_do` | Rượu trắng cao độ | Drinks | `item_drink_ruou_cao_do.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/drinks.js` |
| 141 | `bang_keo` | Băng cá nhân | Medicines | `item_med_bang_keo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 142 | `dich_gluco` | Dung dịch gluco | Medicines | `item_med_dich_gluco.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 143 | `thuoc_giam_dau` | Thuốc giảm đau | Medicines | `item_med_thuoc_giam_dau.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 144 | `thuoc_an_than` | Thuốc an thần | Medicines | `item_med_thuoc_an_than.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 145 | `adrenalin` | Adrenalin | Medicines | `item_med_adrenalin.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 146 | `day_bo_mau` | Dây bó máu | Medicines | `item_med_day_bo_mau.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 147 | `thuoc_sach_vet` | Thuốc sạch vết | Medicines | `item_med_thuoc_sach_vet.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 148 | `goi_phau_thuat` | Gói phẫu thuật | Medicines | `item_med_goi_phau_thuat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 149 | `khang_sinh` | Kháng sinh | Medicines | `item_med_khang_sinh.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 150 | `huyet_thanh` | Huyết thanh kháng nhiễm | Medicines | `item_med_huyet_thanh.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 151 | `goi_cap_cuu` | Gói cấp cứu y tế | Medicines | `item_med_goi_cap_cuu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 152 | `hop_y_te` | Hộp y tế chiến địa | Medicines | `item_med_hop_y_te.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 153 | `tiem_van_nang` | Thuốc tiêm đa năng | Medicines | `item_med_tiem_van_nang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 154 | `improved_serum` | Kháng thể cải tiến | Medicines | `item_med_improved_serum.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 155 | `zombie_gel` | Gel zombie | Medicines | `item_med_zombie_gel.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/medicines.js` |
| 156 | `niupicai` | Cáu bò | Crops (Harvested) | `item_crop_niupicai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 157 | `machixian` | Xà lách bò | Crops (Harvested) | `item_crop_machixian.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 158 | `juju` | Cách lá | Crops (Harvested) | `item_crop_juju.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 159 | `yangjiang` | Hành lá Tây | Crops (Harvested) | `item_crop_yangjiang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 160 | `mushu` | Cassava | Crops (Harvested) | `item_crop_mushu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 161 | `hongshu` | Khoai lang | Crops (Harvested) | `item_crop_hongshu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 162 | `tudou` | Khoai tây | Crops (Harvested) | `item_crop_tudou.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 163 | `wujing` | Củ cải trắng | Crops (Harvested) | `item_crop_wujing.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 164 | `boluomencan` | Nhan sam Ba La Môn | Crops (Harvested) | `item_crop_boluomencan.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 165 | `luobo` | Cà rốt | Crops (Harvested) | `item_crop_luobo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 166 | `jiucai` | Hẹ | Crops (Harvested) | `item_crop_jiucai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 167 | `gouqi` | Kỷ tử | Crops (Harvested) | `item_crop_gouqi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 168 | `suanmo` | Rau chua | Crops (Harvested) | `item_crop_suanmo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 169 | `heimai` | Lúa mạch đen | Crops (Harvested) | `item_crop_heimai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 170 | `wandou` | Đậu Hà Lan | Crops (Harvested) | `item_crop_wandou.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 171 | `seed_niupicai` | Hạt cáu bò | Seeds | `item_seed_seed_niupicai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 172 | `seed_machixian` | Hạt xà lách bò | Seeds | `item_seed_seed_machixian.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 173 | `seed_juju` | Hạt cách lá | Seeds | `item_seed_seed_juju.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 174 | `seed_yangjiang` | Hạt hành lá Tây | Seeds | `item_seed_seed_yangjiang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 175 | `seed_mushu` | Hạt cassava | Seeds | `item_seed_seed_mushu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 176 | `seed_hongshu` | Hạt khoai lang | Seeds | `item_seed_seed_hongshu.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 177 | `seed_tudou` | Hạt khoai tây | Seeds | `item_seed_seed_tudou.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 178 | `seed_wujing` | Hạt cải trắng | Seeds | `item_seed_seed_wujing.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 179 | `seed_boluomencan` | Hạt nhan sam Ba La Môn | Seeds | `item_seed_seed_boluomencan.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 180 | `seed_luobo` | Hạt cà rốt | Seeds | `item_seed_seed_luobo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 181 | `seed_jiucai` | Hạt hẹ | Seeds | `item_seed_seed_jiucai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 182 | `seed_gouqi` | Hạt kỷ tử | Seeds | `item_seed_seed_gouqi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 183 | `seed_suanmo` | Hạt rau chua | Seeds | `item_seed_seed_suanmo.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 184 | `seed_heimai` | Hạt mạch đen | Seeds | `item_seed_seed_heimai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 185 | `seed_wandou` | Hạt đậu Hà Lan | Seeds | `item_seed_seed_wandou.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/crops.js` |
| 186 | `grey_mullet` | Cá lóc xám | Fish | `item_fish_grey_mullet.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 187 | `iron_sardine` | Cá mòi sắt | Fish | `item_fish_iron_sardine.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 188 | `blunt_seabream` | Cá lóc đùn đầu | Fish | `item_fish_blunt_seabream.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 189 | `blacktail_mackerel` | Cá thu đen đuôi | Fish | `item_fish_blacktail_mackerel.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 190 | `ray_barracuda` | Cá nhân ký vằn | Fish | `item_fish_ray_barracuda.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 191 | `rust_flounder` | Cá đính xỉn màu | Fish | `item_fish_rust_flounder.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 192 | `twin_grouper` | Cá đá hai đầu | Fish | `item_fish_twin_grouper.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 193 | `sewage_eel` | Cá nhếch bùn thải | Fish | `item_fish_sewage_eel.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 194 | `corpse_cod` | Cá mã thây chết | Fish | `item_fish_corpse_cod.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 195 | `spine_wolffish` | Cá sói xương nứt | Fish | `item_fish_spine_wolffish.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 196 | `gel_lanternfish` | Cá lồng gel | Fish | `item_fish_gel_lanternfish.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 197 | `multi_barb_king` | Vua cá rậm nhiều | Fish | `item_fish_multi_barb_king.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 198 | `dead_giant_cod` | Cá mã khổng lồ chết | Fish | `item_fish_dead_giant_cod.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 199 | `plague_tentacle` | Côn trùng dịch bệnh | Fish | `item_fish_plague_tentacle.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 200 | `wreck_ghost_shark` | Cá m Ong hutdown | Fish | `item_fish_wreck_ghost_shark.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 201 | `abyss_core_fish` | Cá lõi vực thẳm | Fish | `item_fish_abyss_core_fish.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/fish.js` |
| 202 | `bad_seafood_meal` | Bữa ăn hải sản khó ăn | Seafood Meals | `item_meal_bad_seafood_meal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/seafood-meals.js` |
| 203 | `normal_seafood_meal` | Bữa ăn hải sản trung bình | Seafood Meals | `item_meal_normal_seafood_meal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/seafood-meals.js` |
| 204 | `delicious_seafood_meal` | Bữa ăn hải sản ngon | Seafood Meals | `item_meal_delicious_seafood_meal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/seafood-meals.js` |
| 205 | `tempting_seafood_meal` | Bữa ăn hải sản hấp dẫn | Seafood Meals | `item_meal_tempting_seafood_meal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/seafood-meals.js` |
| 206 | `top_seafood_meal` | Bữa ăn hải sản cao cấp | Seafood Meals | `item_meal_top_seafood_meal.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/seafood-meals.js` |
| 207 | `wood` | Gỗ | Building Materials | `item_mat_wood.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/building-materials.js` |
| 208 | `building_mat` | Vật liệu xây dựng | Building Materials | `item_mat_building_mat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/building-materials.js` |
| 209 | `stone` | Đá | Building Materials | `item_mat_stone.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/building-materials.js` |
| 210 | `nails` | M đóng | Building Materials | `item_mat_nails.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/building-materials.js` |
| 211 | `glass` | Kính | Building Materials | `item_mat_glass.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/building-materials.js` |
| 212 | `tui_xach` | Tú xách | Backpacks | `item_backpack_tui_xach.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 213 | `tui_eo_nho` | Tú eo nhỏ | Backpacks | `item_backpack_tui_eo_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 214 | `balo_nho` | Balo nhỏ | Backpacks | `item_backpack_balo_nho.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 215 | `tui_xach_tay` | Tú xách tay | Backpacks | `item_backpack_tui_xach_tay.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 216 | `balo_va_canvas` | Balo vải canvas | Backpacks | `item_backpack_balo_va_canvas.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 217 | `balo_thoi_trang` | Balo thời trang | Backpacks | `item_backpack_balo_thoi_trang.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 218 | `balo_the_thao` | Balo thể thao | Backpacks | `item_backpack_balo_the_thao.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 219 | `balo_le_nui` | Balo leo núi | Backpacks | `item_backpack_balo_le_nui.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 220 | `balo_quan_doi` | Balo quân đội | Backpacks | `item_backpack_balo_quan_doi.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 221 | `balo_chien_thuat` | Balo chiến thuật | Backpacks | `item_backpack_balo_chien_thuat.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 222 | `balo_dac_biet` | Balo đặc biệt | Backpacks | `item_backpack_balo_dac_biet.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 223 | `balo_le_nui_cap_i` | Balo leo núi cấp I | Backpacks | `item_backpack_balo_le_nui_cap_i.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 224 | `balo_le_nui_cap_ii` | Balo leo núi cấp II | Backpacks | `item_backpack_balo_le_nui_cap_ii.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 225 | `balo_le_nui_cap_iii` | Balo leo núi cấp III | Backpacks | `item_backpack_balo_le_nui_cap_iii.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 226 | `balo_le_nui_cap_iv` | Balo leo núi cấp IV | Backpacks | `item_backpack_balo_le_nui_cap_iv.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 227 | `balo_du_lich_sieu_lon` | Balo du lịch siêu lớn | Backpacks | `item_backpack_balo_du_lich_sieu_lon.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 228 | `balo_du_lich_nang_cap` | Balo du lịch nâng cấp | Backpacks | `item_backpack_balo_du_lich_nang_cap.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 229 | `balo_du_lich_cao_cap` | Balo du lịch cao cấp | Backpacks | `item_backpack_balo_du_lich_cao_cap.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 230 | `balo_the_thao_chu_tai` | Balo thể thao chịu tải | Backpacks | `item_backpack_balo_the_thao_chu_tai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 231 | `balo_quan_doi_chu_tai` | Balo quân đội chịu tải | Backpacks | `item_backpack_balo_quan_doi_chu_tai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 232 | `balo_dac_biet_chu_tai` | Balo đặc biệt chịu tải | Backpacks | `item_backpack_balo_dac_biet_chu_tai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 233 | `balo_dung_khi_chu_tai` | Balo dũng khí chịu tải | Backpacks | `item_backpack_balo_dung_khi_chu_tai.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 234 | `balo_luu_tru_vu_tru` | Balo lưu trữ Vũ Trụ | Backpacks | `item_backpack_balo_luu_tru_vu_tru.png` | `MISSING` | 256×256 (đề xuất) | `js/data/items/backpacks.js` |
| 235 | `thuoc_la` | Thuốc lá | Commodities / Currency | `ui_icon_res_cigarette.png` | `EXISTS` | 256×256 | `js/data/items/cigarettes.js` |
| 236 | `noble_id` | Thẻ thân phận quý tộc | Special / Quest Items | `item_quest_noble_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 237 | `dawn_badge` | Huy hiệu Dawn | Special / Quest Items | `item_quest_dawn_badge.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 238 | `silence_badge` | Huy hiệu Tịch diệt | Special / Quest Items | `item_quest_silence_badge.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 239 | `viscount_id` | Thẻ thân phận Tử tước | Special / Quest Items | `item_quest_viscount_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 240 | `count_id` | Thẻ thân phận Bá tước | Special / Quest Items | `item_quest_count_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 241 | `marquis_id` | Thẻ thân phận Hầu tước | Special / Quest Items | `item_quest_marquis_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 242 | `duke_id` | Thẻ thân phận Công tước | Special / Quest Items | `item_quest_duke_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 243 | `crown_prince_id` | Thẻ thân phận Trữ quân | Special / Quest Items | `item_quest_crown_prince_id.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 244 | `dawn_captain_badge` | Huy hiệu đội trưởng tiên phong Dawn | Special / Quest Items | `item_quest_dawn_captain_badge.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 245 | `underground_key` | Chìa khóa ngầm | Special / Quest Items | `item_quest_underground_key.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 246 | `farming_master_badge` | Huy hiệu bậc thầy nông nghiệp | Special / Quest Items | `item_quest_farming_master_badge.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 247 | `miaomiao_diary` | Nhật ký Miu Miu | Special / Quest Items | `item_quest_miaomiao_diary.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 248 | `strange_recorder` | Bút ghi âm kỳ lạ | Special / Quest Items | `item_quest_strange_recorder.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 249 | `letter_to_sister` | Thư gửi em gái | Special / Quest Items | `item_quest_letter_to_sister.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 250 | `queen_reply` | Thư hồi âm của hoàng hậu | Special / Quest Items | `item_quest_queen_reply.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 251 | `love_token` | Vật đính ước | Special / Quest Items | `item_quest_love_token.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 252 | `castle_pass` | Thẻ thông hành thành | Special / Quest Items | `item_quest_castle_pass.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 253 | `car_key` | Chìa khóa xe | Special / Quest Items | `item_quest_car_key.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 254 | `lightning_scale` | Vảy sét | Special / Quest Items | `item_quest_lightning_scale.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 255 | `thunder_scale` | Vảy sấm | Special / Quest Items | `item_quest_thunder_scale.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 256 | `pure_energy` | Năng lượng tinh khiết | Special / Quest Items | `item_quest_pure_energy.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 257 | `crime_data` | Tài liệu tội phạm | Special / Quest Items | `item_quest_crime_data.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 258 | `small_nuclear_generator` | Máy phát điện hạt nhân nhỏ | Special / Quest Items | `item_quest_small_nuclear_generator.png` | `MISSING` | 256×256 (đề xuất) | `js/data/systems/castle.js` |
| 259 | `xang_dau` | Xăng dầu (Gasoline) | Commodities / Currency | `ui_icon_res_gasoline.png` | `EXISTS` | 256×256 | `js/state.js` |
| 260 | `royal_coin` | Tiền hoàng gia (Royal Coin) | Commodities / Currency | `ui_icon_res_royal_coin.png` | `EXISTS` | 256×256 | `js/state.js` |

---

## C. DANH SÁCH ẢNH CẦN TẠO MỚI (MISSING ASSETS)

Danh sách 257 vật phẩm chưa có hình ảnh riêng biệt, phân nhóm theo danh mục với mô tả ngoại hình trực quan để chuẩn bị cho công tác prompt sinh ảnh:

### C.1. Melee Weapons (40 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_melee_dam.png` | `dam` | Nắm Đấm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dam.png` |
| 2 | `item_melee_dao_bep.png` | `dao_bep` | Dao Bếp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_bep.png` |
| 3 | `item_melee_gay_go.png` | `gay_go` | Gậy gỗ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_gay_go.png` |
| 4 | `item_melee_cao_cuoc.png` | `cao_cuoc` | Cào Cuốc | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_cao_cuoc.png` |
| 5 | `item_melee_bua_sat_nho.png` | `bua_sat_nho` | Búa sắt nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_bua_sat_nho.png` |
| 6 | `item_melee_chao_ap.png` | `chao_ap` | Chảo Áp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_chao_ap.png` |
| 7 | `item_melee_can_xich_lon.png` | `can_xich_lon` | Cờ Lê Lớn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_can_xich_lon.png` |
| 8 | `item_melee_gay_bong_chay.png` | `gay_bong_chay` | Gậy bóng chày | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_gay_bong_chay.png` |
| 9 | `item_melee_ong_sat.png` | `ong_sat` | Ống sắt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_ong_sat.png` |
| 10 | `item_melee_xeng_sat.png` | `xeng_sat` | Xẻng Sắt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_xeng_sat.png` |
| 11 | `item_melee_dao_gam_nho.png` | `dao_gam_nho` | Dao Găm Nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_gam_nho.png` |
| 12 | `item_melee_dao_tho_mo.png` | `dao_tho_mo` | Dao thợ mổ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_tho_mo.png` |
| 13 | `item_melee_gay_cam_sat.png` | `gay_cam_sat` | Gậy Cảnh Sát | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_gay_cam_sat.png` |
| 14 | `item_melee_cay_nay.png` | `cay_nay` | Cây Nạy | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_cay_nay.png` |
| 15 | `item_melee_bua_be_mot.png` | `bua_be_mot` | Búa nhổ đinh | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_bua_be_mot.png` |
| 16 | `item_melee_riu_ngan.png` | `riu_ngan` | Rìu ngắn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_riu_ngan.png` |
| 17 | `item_melee_riu_cuu_hoa.png` | `riu_cuu_hoa` | Rìu cứu hỏa | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_riu_cuu_hoa.png` |
| 18 | `item_melee_dao_san.png` | `dao_san` | Dao săn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_san.png` |
| 19 | `item_melee_dao_quan_doi.png` | `dao_quan_doi` | Dao quân đội | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_quan_doi.png` |
| 20 | `item_melee_dao_chi_ho.png` | `dao_chi_ho` | Dao Chỉ Hổ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_chi_ho.png` |
| 21 | `item_melee_dao_kham_lon.png` | `dao_kham_lon` | Đao Chém Lớn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_kham_lon.png` |
| 22 | `item_melee_dao_tram_ma.png` | `dao_tram_ma` | Đao Trảm Mã | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_tram_ma.png` |
| 23 | `item_melee_roi_chin_dot.png` | `roi_chin_dot` | Roi Chín Đốt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_roi_chin_dot.png` |
| 24 | `item_melee_kiem_tay.png` | `kiem_tay` | Kiếm Tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_tay.png` |
| 25 | `item_melee_bua_sao_bang.png` | `bua_sao_bang` | Búa sao băng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_bua_sao_bang.png` |
| 26 | `item_melee_kiem_thep_sap.png` | `kiem_thep_sap` | Kiếm Thép Ngắn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_thep_sap.png` |
| 27 | `item_melee_kiem_long_thao.png` | `kiem_long_thao` | Kiếm Long Thảo | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_long_thao.png` |
| 28 | `item_melee_sung_ky_binh.png` | `sung_ky_binh` | Giáo Kỵ Binh | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_sung_ky_binh.png` |
| 29 | `item_melee_kiem_hai_luoi.png` | `kiem_hai_luoi` | Kiếm hai lưỡi | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_hai_luoi.png` |
| 30 | `item_melee_kiem_melayu.png` | `kiem_melayu` | Kiếm Melayu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_melayu.png` |
| 31 | `item_melee_dao_samurai.png` | `dao_samurai` | Đao Samurai | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_samurai.png` |
| 32 | `item_melee_dao_ngang_duong.png` | `dao_ngang_duong` | Đao Ngang Đường | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_ngang_duong.png` |
| 33 | `item_melee_may_cat_cay.png` | `may_cat_cay` | Máy cắt cây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_may_cat_cay.png` |
| 34 | `item_melee_kiem_dung_si.png` | `kiem_dung_si` | Kiếm Dũng Sĩ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_dung_si.png` |
| 35 | `item_melee_kiem_vu_tru.png` | `kiem_vu_tru` | Kiếm Vũ Trụ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_vu_tru.png` |
| 36 | `item_melee_kiem_vo_uy.png` | `kiem_vo_uy` | Kiếm Vô Uy | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_vo_uy.png` |
| 37 | `item_melee_kiem_bac_hoang_gia.png` | `kiem_bac_hoang_gia` | Kiếm bạc hoàng gia | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_bac_hoang_gia.png` |
| 38 | `item_melee_dinh_ba_hai_ca.png` | `dinh_ba_hai_ca` | Đinh Ba Hải Ca | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dinh_ba_hai_ca.png` |
| 39 | `item_melee_kiem_thuong_phong.png` | `kiem_thuong_phong` | Kiếm Thương Phòng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_kiem_thuong_phong.png` |
| 40 | `item_melee_dao_999.png` | `dao_999` | Dao 999 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_melee_dao_999.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_melee_dam.png** (`dam` - Nắm Đấm): Găng tay vải thô quấn băng sinh tồn bám bụi, nắm đấm chiến đấu cận chiến phòng vệ cơ bản.
- **item_melee_dao_bep.png** (`dao_bep` - Dao Bếp): Dao làm bếp kim loại có lưỡi sắc mẻ nhẹ, chuôi gỗ mài mòn, bám vài vết gỉ sét sinh tồn.
- **item_melee_gay_go.png** (`gay_go` - Gậy gỗ): Khúc gỗ chắc chắn được mài nhẵn phần tay cầm, có vết rạn nứt nhỏ do va đập chiến đấu.
- **item_melee_cao_cuoc.png** (`cao_cuoc` - Cào Cuốc): Nông cụ cào cuốc bằng sắt rèn thô, cán gỗ dài, các răng cào bằng kim loại sắc nhọn bám đất bẩn.
- **item_melee_bua_sat_nho.png** (`bua_sat_nho` - Búa sắt nhỏ): Búa cầm tay bằng thép đặc đúc khối, đầu búa vát cạnh kim loại, cán bọc cao su chống trượt.
- **item_melee_chao_ap.png** (`chao_ap` - Chảo Áp): Vũ khí cận chiến Chảo Áp, chế tác kim loại/gỗ sinh tồn với độ bền 60, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_can_xich_lon.png** (`can_xich_lon` - Cờ Lê Lớn): Vũ khí cận chiến Cờ Lê Lớn, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_gay_bong_chay.png** (`gay_bong_chay` - Gậy bóng chày): Vũ khí cận chiến Gậy bóng chày, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_ong_sat.png** (`ong_sat` - Ống sắt): Vũ khí cận chiến Ống sắt, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_xeng_sat.png** (`xeng_sat` - Xẻng Sắt): Vũ khí cận chiến Xẻng Sắt, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_gam_nho.png** (`dao_gam_nho` - Dao Găm Nhỏ): Vũ khí cận chiến Dao Găm Nhỏ, chế tác kim loại/gỗ sinh tồn với độ bền 40, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_tho_mo.png** (`dao_tho_mo` - Dao thợ mổ): Vũ khí cận chiến Dao thợ mổ, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_gay_cam_sat.png** (`gay_cam_sat` - Gậy Cảnh Sát): Vũ khí cận chiến Gậy Cảnh Sát, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_cay_nay.png** (`cay_nay` - Cây Nạy): Vũ khí cận chiến Cây Nạy, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_bua_be_mot.png** (`bua_be_mot` - Búa nhổ đinh): Vũ khí cận chiến Búa nhổ đinh, chế tác kim loại/gỗ sinh tồn với độ bền 60, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_riu_ngan.png** (`riu_ngan` - Rìu ngắn): Vũ khí cận chiến Rìu ngắn, chế tác kim loại/gỗ sinh tồn với độ bền 60, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_riu_cuu_hoa.png** (`riu_cuu_hoa` - Rìu cứu hỏa): Vũ khí cận chiến Rìu cứu hỏa, chế tác kim loại/gỗ sinh tồn với độ bền 70, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_san.png** (`dao_san` - Dao săn): Vũ khí cận chiến Dao săn, chế tác kim loại/gỗ sinh tồn với độ bền 70, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_quan_doi.png** (`dao_quan_doi` - Dao quân đội): Vũ khí cận chiến Dao quân đội, chế tác kim loại/gỗ sinh tồn với độ bền 70, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_chi_ho.png** (`dao_chi_ho` - Dao Chỉ Hổ): Vũ khí cận chiến Dao Chỉ Hổ, chế tác kim loại/gỗ sinh tồn với độ bền 90, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_kham_lon.png** (`dao_kham_lon` - Đao Chém Lớn): Vũ khí cận chiến Đao Chém Lớn, chế tác kim loại/gỗ sinh tồn với độ bền 60, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_tram_ma.png** (`dao_tram_ma` - Đao Trảm Mã): Vũ khí cận chiến Đao Trảm Mã, chế tác kim loại/gỗ sinh tồn với độ bền 60, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_roi_chin_dot.png** (`roi_chin_dot` - Roi Chín Đốt): Vũ khí cận chiến Roi Chín Đốt, chế tác kim loại/gỗ sinh tồn với độ bền 90, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_tay.png** (`kiem_tay` - Kiếm Tây): Vũ khí cận chiến Kiếm Tây, chế tác kim loại/gỗ sinh tồn với độ bền 70, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_bua_sao_bang.png** (`bua_sao_bang` - Búa sao băng): Vũ khí cận chiến Búa sao băng, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_thep_sap.png** (`kiem_thep_sap` - Kiếm Thép Ngắn): Vũ khí cận chiến Kiếm Thép Ngắn, chế tác kim loại/gỗ sinh tồn với độ bền 30, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_long_thao.png** (`kiem_long_thao` - Kiếm Long Thảo): Vũ khí cận chiến Kiếm Long Thảo, chế tác kim loại/gỗ sinh tồn với độ bền 66, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_sung_ky_binh.png** (`sung_ky_binh` - Giáo Kỵ Binh): Vũ khí cận chiến Giáo Kỵ Binh, chế tác kim loại/gỗ sinh tồn với độ bền 80, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_hai_luoi.png** (`kiem_hai_luoi` - Kiếm hai lưỡi): Vũ khí cận chiến Kiếm hai lưỡi, chế tác kim loại/gỗ sinh tồn với độ bền 100, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_melayu.png** (`kiem_melayu` - Kiếm Melayu): Vũ khí cận chiến Kiếm Melayu, chế tác kim loại/gỗ sinh tồn với độ bền 70, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_samurai.png** (`dao_samurai` - Đao Samurai): Vũ khí cận chiến Đao Samurai, chế tác kim loại/gỗ sinh tồn với độ bền 40, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_ngang_duong.png** (`dao_ngang_duong` - Đao Ngang Đường): Vũ khí cận chiến Đao Ngang Đường, chế tác kim loại/gỗ sinh tồn với độ bền 80, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_may_cat_cay.png** (`may_cat_cay` - Máy cắt cây): Vũ khí cận chiến Máy cắt cây, chế tác kim loại/gỗ sinh tồn với độ bền 120, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_dung_si.png** (`kiem_dung_si` - Kiếm Dũng Sĩ): Vũ khí cận chiến Kiếm Dũng Sĩ, chế tác kim loại/gỗ sinh tồn với độ bền 50, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_vu_tru.png** (`kiem_vu_tru` - Kiếm Vũ Trụ): Vũ khí cận chiến Kiếm Vũ Trụ, chế tác kim loại/gỗ sinh tồn với độ bền 222, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_vo_uy.png** (`kiem_vo_uy` - Kiếm Vô Uy): Vũ khí cận chiến Kiếm Vô Uy, chế tác kim loại/gỗ sinh tồn với độ bền 100, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_bac_hoang_gia.png** (`kiem_bac_hoang_gia` - Kiếm bạc hoàng gia): Vũ khí cận chiến Kiếm bạc hoàng gia, chế tác kim loại/gỗ sinh tồn với độ bền 120, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dinh_ba_hai_ca.png** (`dinh_ba_hai_ca` - Đinh Ba Hải Ca): Vũ khí cận chiến Đinh Ba Hải Ca, chế tác kim loại/gỗ sinh tồn với độ bền 150, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_kiem_thuong_phong.png** (`kiem_thuong_phong` - Kiếm Thương Phòng): Vũ khí cận chiến Kiếm Thương Phòng, chế tác kim loại/gỗ sinh tồn với độ bền 555, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.
- **item_melee_dao_999.png** (`dao_999` - Dao 999): Vũ khí cận chiến Dao 999, chế tác kim loại/gỗ sinh tồn với độ bền 1, dấu vết trầy xước hao mòn do chiến đấu hậu tận thế.

### C.2. Ranged Weapons (45 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_ranged_cung_go.png` | `cung_go` | Cung gỗ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_cung_go.png` |
| 2 | `item_ranged_cung_cong_nguoc.png` | `cung_cong_nguoc` | Cung cong ngược | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_cung_cong_nguoc.png` |
| 3 | `item_ranged_cung_ket_hop.png` | `cung_ket_hop` | Cung kết hợp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_cung_ket_hop.png` |
| 4 | `item_ranged_no_thap_tu.png` | `no_thap_tu` | Nỏ Thập Tự | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_no_thap_tu.png` |
| 5 | `item_ranged_no_gap.png` | `no_gap` | Cối nỏ gấp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_no_gap.png` |
| 6 | `item_ranged_no_san_ban.png` | `no_san_ban` | Cối nỏ săn bắn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_no_san_ban.png` |
| 7 | `item_ranged_cung_dong_que.png` | `cung_dong_que` | Cung đồng quê | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_cung_dong_que.png` |
| 8 | `item_ranged_p226.png` | `P226` | P226 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_p226.png` |
| 9 | `item_ranged_g17.png` | `G17` | G17 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_g17.png` |
| 10 | `item_ranged_usp9.png` | `USP9` | USP9 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_usp9.png` |
| 11 | `item_ranged_m1911.png` | `M1911` | M1911 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m1911.png` |
| 12 | `item_ranged_gp100.png` | `GP100` | GP100 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_gp100.png` |
| 13 | `item_ranged_sung_sa_mac.png` | `sung_sa_mac` | Deagle (Sa Mạc) | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sung_sa_mac.png` |
| 14 | `item_ranged_sung_hoang_gia.png` | `sung_hoang_gia` | Súng Ngắn Hoàng Gia | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sung_hoang_gia.png` |
| 15 | `item_ranged_p90.png` | `P90` | P90 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_p90.png` |
| 16 | `item_ranged_uzi.png` | `UZI` | UZI | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_uzi.png` |
| 17 | `item_ranged_mp5.png` | `MP5` | MP5 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_mp5.png` |
| 18 | `item_ranged_mp7.png` | `MP7` | MP7 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_mp7.png` |
| 19 | `item_ranged_vector.png` | `Vector` | Vector | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_vector.png` |
| 20 | `item_ranged_ump45.png` | `UMP45` | UMP45 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_ump45.png` |
| 21 | `item_ranged_m16a4.png` | `M16A4` | M16A4 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m16a4.png` |
| 22 | `item_ranged_m4a1.png` | `M4A1` | M4A1 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m4a1.png` |
| 23 | `item_ranged_sg552.png` | `SG552` | SG552 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sg552.png` |
| 24 | `item_ranged_hk416.png` | `HK416` | HK416 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_hk416.png` |
| 25 | `item_ranged_aug.png` | `AUG` | AUG | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_aug.png` |
| 26 | `item_ranged_ak47.png` | `AK47` | AK47 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_ak47.png` |
| 27 | `item_ranged_akm.png` | `AKM` | AKM | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_akm.png` |
| 28 | `item_ranged_sung_81.png` | `sung_81` | Súng Kiểu 81 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sung_81.png` |
| 29 | `item_ranged_an94.png` | `AN94` | AN-94 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_an94.png` |
| 30 | `item_ranged_sks.png` | `SKS` | SKS | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sks.png` |
| 31 | `item_ranged_scarh.png` | `SCARH` | SCAR-H | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_scarh.png` |
| 32 | `item_ranged_fal.png` | `FAL` | FAL | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_fal.png` |
| 33 | `item_ranged_ebr14.png` | `EBR14` | EBR14 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_ebr14.png` |
| 34 | `item_ranged_sr25.png` | `SR25` | SR25 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_sr25.png` |
| 35 | `item_ranged_m700.png` | `M700` | M700 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m700.png` |
| 36 | `item_ranged_mosin.png` | `Mosin` | Mosin-Nagant | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_mosin.png` |
| 37 | `item_ranged_awm.png` | `AWM` | AWM | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_awm.png` |
| 38 | `item_ranged_m249.png` | `M249` | M249 SAW | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m249.png` |
| 39 | `item_ranged_rpk.png` | `RPK` | RPK | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_rpk.png` |
| 40 | `item_ranged_m60.png` | `M60` | M60 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m60.png` |
| 41 | `item_ranged_mg42.png` | `MG42` | MG42 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_mg42.png` |
| 42 | `item_ranged_pkm.png` | `PKM` | PKM | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_pkm.png` |
| 43 | `item_ranged_m870.png` | `M870` | M870 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_m870.png` |
| 44 | `item_ranged_aa12.png` | `AA12` | AA12 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_aa12.png` |
| 45 | `item_ranged_spas12.png` | `SPAS12` | SPAS-12 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/weapons/item_ranged_spas12.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_ranged_cung_go.png** (`cung_go` - Cung gỗ): Cung săn tự chế bằng thanh gỗ uốn cong dẻo dai, dây cung bện từ sợi tổng hợp chắc chắn.
- **item_ranged_cung_cong_nguoc.png** (`cung_cong_nguoc` - Cung cong ngược): Vũ khí tầm xa Cung cong ngược, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn mui_ten.
- **item_ranged_cung_ket_hop.png** (`cung_ket_hop` - Cung kết hợp): Vũ khí tầm xa Cung kết hợp, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn mui_ten.
- **item_ranged_no_thap_tu.png** (`no_thap_tu` - Nỏ Thập Tự): Vũ khí tầm xa Nỏ Thập Tự, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn mui_ten.
- **item_ranged_no_gap.png** (`no_gap` - Cối nỏ gấp): Vũ khí tầm xa Cối nỏ gấp, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn mui_ten.
- **item_ranged_no_san_ban.png** (`no_san_ban` - Cối nỏ săn bắn): Vũ khí tầm xa Cối nỏ săn bắn, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn mui_ten.
- **item_ranged_cung_dong_que.png** (`cung_dong_que` - Cung đồng quê): Vũ khí tầm xa Cung đồng quê, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 520%, tương thích đạn mui_ten.
- **item_ranged_p226.png** (`P226` - P226): Vũ khí tầm xa P226, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_g17.png** (`G17` - G17): Vũ khí tầm xa G17, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_usp9.png** (`USP9` - USP9): Vũ khí tầm xa USP9, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_m1911.png** (`M1911` - M1911): Vũ khí tầm xa M1911, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .45 ACP.
- **item_ranged_gp100.png** (`GP100` - GP100): Vũ khí tầm xa GP100, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .357 Magnum.
- **item_ranged_sung_sa_mac.png** (`sung_sa_mac` - Deagle (Sa Mạc)): Vũ khí tầm xa Deagle (Sa Mạc), cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .50 AE.
- **item_ranged_sung_hoang_gia.png** (`sung_hoang_gia` - Súng Ngắn Hoàng Gia): Vũ khí tầm xa Súng Ngắn Hoàng Gia, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .357 Magnum.
- **item_ranged_p90.png** (`P90` - P90): Vũ khí tầm xa P90, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.7×28mm.
- **item_ranged_uzi.png** (`UZI` - UZI): Vũ khí tầm xa UZI, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_mp5.png** (`MP5` - MP5): Vũ khí tầm xa MP5, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_mp7.png** (`MP7` - MP7): Vũ khí tầm xa MP7, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_vector.png** (`Vector` - Vector): Vũ khí tầm xa Vector, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 9×19mm.
- **item_ranged_ump45.png** (`UMP45` - UMP45): Vũ khí tầm xa UMP45, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .45 ACP.
- **item_ranged_m16a4.png** (`M16A4` - M16A4): Vũ khí tầm xa M16A4, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_m4a1.png** (`M4A1` - M4A1): Vũ khí tầm xa M4A1, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_sg552.png** (`SG552` - SG552): Vũ khí tầm xa SG552, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_hk416.png** (`HK416` - HK416): Vũ khí tầm xa HK416, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_aug.png** (`AUG` - AUG): Vũ khí tầm xa AUG, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_ak47.png** (`AK47` - AK47): Vũ khí tầm xa AK47, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×39mm.
- **item_ranged_akm.png** (`AKM` - AKM): Vũ khí tầm xa AKM, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×39mm.
- **item_ranged_sung_81.png** (`sung_81` - Súng Kiểu 81): Vũ khí tầm xa Súng Kiểu 81, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×39mm.
- **item_ranged_an94.png** (`AN94` - AN-94): Vũ khí tầm xa AN-94, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_sks.png** (`SKS` - SKS): Vũ khí tầm xa SKS, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×39mm.
- **item_ranged_scarh.png** (`SCARH` - SCAR-H): Vũ khí tầm xa SCAR-H, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_fal.png** (`FAL` - FAL): Vũ khí tầm xa FAL, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_ebr14.png** (`EBR14` - EBR14): Vũ khí tầm xa EBR14, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_sr25.png** (`SR25` - SR25): Vũ khí tầm xa SR25, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_m700.png** (`M700` - M700): Vũ khí tầm xa M700, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_mosin.png** (`Mosin` - Mosin-Nagant): Vũ khí tầm xa Mosin-Nagant, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×54mmR.
- **item_ranged_awm.png** (`AWM` - AWM): Vũ khí tầm xa AWM, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn .300 Winchester Magnum.
- **item_ranged_m249.png** (`M249` - M249 SAW): Vũ khí tầm xa M249 SAW, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 5.56×45mm NATO.
- **item_ranged_rpk.png** (`RPK` - RPK): Vũ khí tầm xa RPK, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×39mm.
- **item_ranged_m60.png** (`M60` - M60): Vũ khí tầm xa M60, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×51mm.
- **item_ranged_mg42.png** (`MG42` - MG42): Vũ khí tầm xa MG42, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.92×57mm.
- **item_ranged_pkm.png** (`PKM` - PKM): Vũ khí tầm xa PKM, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn 7.62×54mmR.
- **item_ranged_m870.png** (`M870` - M870): Vũ khí tầm xa M870, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn dan_12.
- **item_ranged_aa12.png** (`AA12` - AA12): Vũ khí tầm xa AA12, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn dan_12.
- **item_ranged_spas12.png** (`SPAS12` - SPAS-12): Vũ khí tầm xa SPAS-12, cấu tạo kim loại cơ khí quân sự hậu tận thế, độ bền nguyên vẹn 100%, tương thích đạn dan_12.

### C.3. Ammunition (13 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_ammo_mui_ten.png` | `mui_ten` | Mũi tên | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_mui_ten.png` |
| 2 | `item_ammo_357_magnum.png` | `.357 Magnum` | .357 Magnum | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_357_magnum.png` |
| 3 | `item_ammo_45_acp.png` | `.45 ACP` | .45 ACP | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_45_acp.png` |
| 4 | `item_ammo_50_ae.png` | `.50 AE` | .50 AE | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_50_ae.png` |
| 5 | `item_ammo_9x19mm.png` | `9×19mm` | 9×19mm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_9x19mm.png` |
| 6 | `item_ammo_57x28mm.png` | `5.7×28mm` | 5.7×28mm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_57x28mm.png` |
| 7 | `item_ammo_762x39mm.png` | `7.62×39mm` | 7.62×39mm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_762x39mm.png` |
| 8 | `item_ammo_556x45mm_nato.png` | `5.56×45mm NATO` | 5.56×45mm NATO | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_556x45mm_nato.png` |
| 9 | `item_ammo_762x51mm.png` | `7.62×51mm` | 7.62×51mm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_762x51mm.png` |
| 10 | `item_ammo_762x54mmr.png` | `7.62×54mmR` | 7.62×54mmR | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_762x54mmr.png` |
| 11 | `item_ammo_792x57mm.png` | `7.92×57mm` | 7.92×57mm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_792x57mm.png` |
| 12 | `item_ammo_300_winchester_magnum.png` | `.300 Winchester Magnum` | .300 Winchester Magnum | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_300_winchester_magnum.png` |
| 13 | `item_ammo_dan_12.png` | `dan_12` | Đạn Shotgun 12 | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/ammo/item_ammo_dan_12.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_ammo_mui_ten.png** (`mui_ten` - Mũi tên): Bó 3 mũi tên thân gỗ có đầu bọc kim loại sắc bén, cánh đuôi gắn lông vũ cân bằng khí động học.
- **item_ammo_357_magnum.png** (`.357 Magnum` - .357 Magnum): Hộp đạn hoặc cụm các viên đạn cỡ nòng .357 Magnum, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_45_acp.png** (`.45 ACP` - .45 ACP): Hộp đạn hoặc cụm các viên đạn cỡ nòng .45 ACP, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_50_ae.png** (`.50 AE` - .50 AE): Hộp đạn hoặc cụm các viên đạn cỡ nòng .50 AE, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_9x19mm.png** (`9×19mm` - 9×19mm): Hộp đạn hoặc cụm các viên đạn cỡ nòng 9×19mm, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_57x28mm.png** (`5.7×28mm` - 5.7×28mm): Hộp đạn hoặc cụm các viên đạn cỡ nòng 5.7×28mm, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_762x39mm.png** (`7.62×39mm` - 7.62×39mm): Hộp đạn hoặc cụm các viên đạn cỡ nòng 7.62×39mm, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_556x45mm_nato.png** (`5.56×45mm NATO` - 5.56×45mm NATO): Hộp đạn hoặc cụm các viên đạn cỡ nòng 5.56×45mm NATO, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_762x51mm.png** (`7.62×51mm` - 7.62×51mm): Hộp đạn hoặc cụm các viên đạn cỡ nòng 7.62×51mm, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_762x54mmr.png** (`7.62×54mmR` - 7.62×54mmR): Hộp đạn hoặc cụm các viên đạn cỡ nòng 7.62×54mmR, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_792x57mm.png** (`7.92×57mm` - 7.92×57mm): Hộp đạn hoặc cụm các viên đạn cỡ nòng 7.92×57mm, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_300_winchester_magnum.png** (`.300 Winchester Magnum` - .300 Winchester Magnum): Hộp đạn hoặc cụm các viên đạn cỡ nòng .300 Winchester Magnum, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.
- **item_ammo_dan_12.png** (`dan_12` - Đạn Shotgun 12): Hộp đạn hoặc cụm các viên đạn cỡ nòng Đạn Shotgun 12, vỏ đạn bằng đồng vàng sáng ánh kim loại, đầu đạn chì đồng nguyên khối.

### C.4. Foods (19 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_food_dau_phong.png` | `dau_phong` | Đậu phộng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_dau_phong.png` |
| 2 | `item_food_dau_lan_hoa.png` | `dau_lan_hoa` | Đậu phong lan | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_dau_lan_hoa.png` |
| 3 | `item_food_hat_nho.png` | `hat_nho` | Hạt nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hat_nho.png` |
| 4 | `item_food_keo_que.png` | `keo_que` | Kẹo que | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_keo_que.png` |
| 5 | `item_food_thanh_nang_luong.png` | `thanh_nang_luong` | Thanh năng lượng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_thanh_nang_luong.png` |
| 6 | `item_food_so_co_la.png` | `so_co_la` | Sô cô la | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_so_co_la.png` |
| 7 | `item_food_mi_gion.png` | `mi_gion` | Mì giòn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_mi_gion.png` |
| 8 | `item_food_che_ngan_nhi.png` | `che_ngan_nhi` | Chè ngân nhĩ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_che_ngan_nhi.png` |
| 9 | `item_food_rong_bien_gion.png` | `rong_bien_gion` | Rong biển giòn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_rong_bien_gion.png` |
| 10 | `item_food_banh_quy_nen.png` | `banh_quy_nen` | Bánh quy nén | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_banh_quy_nen.png` |
| 11 | `item_food_banh_mi_lua_mi.png` | `banh_mi_lua_mi` | Bánh mì lúa mì | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_banh_mi_lua_mi.png` |
| 12 | `item_food_hop_dao_vang.png` | `hop_dao_vang` | Đào vàng đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_dao_vang.png` |
| 13 | `item_food_hop_dau.png` | `hop_dau` | Đậu đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_dau.png` |
| 14 | `item_food_hop_thit_bo.png` | `hop_thit_bo` | Thịt bò đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_thit_bo.png` |
| 15 | `item_food_hop_quan_luong.png` | `hop_quan_luong` | Đồ hộp quân dụng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_quan_luong.png` |
| 16 | `item_food_hop_ca_moi.png` | `hop_ca_moi` | Cá mòi đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_ca_moi.png` |
| 17 | `item_food_hop_ca_ngu.png` | `hop_ca_ngu` | Cá ngừ đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_ca_ngu.png` |
| 18 | `item_food_hop_ca_thu_dao.png` | `hop_ca_thu_dao` | Cá thu đao đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_ca_thu_dao.png` |
| 19 | `item_food_hop_ca_nuc.png` | `hop_ca_nuc` | Cá nục đóng hộp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_food_hop_ca_nuc.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_food_dau_phong.png** (`dau_phong` - Đậu phộng): Túi hạt đậu phộng rang giòn trong gói giấy kraft nâu bọc kín, đồ ăn vặt sinh tồn.
- **item_food_dau_lan_hoa.png** (`dau_lan_hoa` - Đậu phong lan): Thực phẩm sinh tồn Đậu phong lan, đóng gói tiện lợi, hồi phục 5 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_hat_nho.png** (`hat_nho` - Hạt nhỏ): Thực phẩm sinh tồn Hạt nhỏ, đóng gói tiện lợi, hồi phục 10 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_keo_que.png** (`keo_que` - Kẹo que): Thực phẩm sinh tồn Kẹo que, đóng gói tiện lợi, hồi phục 10 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_thanh_nang_luong.png** (`thanh_nang_luong` - Thanh năng lượng): Thực phẩm sinh tồn Thanh năng lượng, đóng gói tiện lợi, hồi phục 20 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_so_co_la.png** (`so_co_la` - Sô cô la): Thực phẩm sinh tồn Sô cô la, đóng gói tiện lợi, hồi phục 20 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_mi_gion.png** (`mi_gion` - Mì giòn): Thực phẩm sinh tồn Mì giòn, đóng gói tiện lợi, hồi phục 20 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_che_ngan_nhi.png** (`che_ngan_nhi` - Chè ngân nhĩ): Thực phẩm sinh tồn Chè ngân nhĩ, đóng gói tiện lợi, hồi phục 20 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_rong_bien_gion.png** (`rong_bien_gion` - Rong biển giòn): Thực phẩm sinh tồn Rong biển giòn, đóng gói tiện lợi, hồi phục 20 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_banh_quy_nen.png** (`banh_quy_nen` - Bánh quy nén): Thực phẩm sinh tồn Bánh quy nén, đóng gói tiện lợi, hồi phục 30 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_banh_mi_lua_mi.png** (`banh_mi_lua_mi` - Bánh mì lúa mì): Thực phẩm sinh tồn Bánh mì lúa mì, đóng gói tiện lợi, hồi phục 30 điểm đói, bao bì bảo quản thời kỳ tận thế.
- **item_food_hop_dao_vang.png** (`hop_dao_vang` - Đào vàng đóng hộp): Hộp đồ hộp kim loại thiếc Đào vàng đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_dau.png** (`hop_dau` - Đậu đóng hộp): Hộp đồ hộp kim loại thiếc Đậu đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_thit_bo.png** (`hop_thit_bo` - Thịt bò đóng hộp): Hộp đồ hộp kim loại thiếc Thịt bò đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_quan_luong.png** (`hop_quan_luong` - Đồ hộp quân dụng): Hộp đồ hộp kim loại thiếc Đồ hộp quân dụng, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_ca_moi.png** (`hop_ca_moi` - Cá mòi đóng hộp): Hộp đồ hộp kim loại thiếc Cá mòi đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_ca_ngu.png** (`hop_ca_ngu` - Cá ngừ đóng hộp): Hộp đồ hộp kim loại thiếc Cá ngừ đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_ca_thu_dao.png** (`hop_ca_thu_dao` - Cá thu đao đóng hộp): Hộp đồ hộp kim loại thiếc Cá thu đao đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.
- **item_food_hop_ca_nuc.png** (`hop_ca_nuc` - Cá nục đóng hộp): Hộp đồ hộp kim loại thiếc Cá nục đóng hộp, nhãn mác giấy bạc màu mòn rách nhẹ, nắp giật tiện dụng.

### C.5. Fruits (11 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_fruit_tao.png` | `tao` | Táo | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_tao.png` |
| 2 | `item_fruit_chuoi.png` | `chuoi` | Chuối | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_chuoi.png` |
| 3 | `item_fruit_cam.png` | `cam` | Cam | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_cam.png` |
| 4 | `item_fruit_le_tuyet.png` | `le_tuyet` | Lê tuyết | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_le_tuyet.png` |
| 5 | `item_fruit_nho.png` | `nho` | Nho | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_nho.png` |
| 6 | `item_fruit_dua_hau.png` | `dua_hau` | Dưa hấu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_dua_hau.png` |
| 7 | `item_fruit_dau_tay.png` | `dau_tay` | Dâu tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_dau_tay.png` |
| 8 | `item_fruit_viet_quat.png` | `viet_quat` | Việt quất | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_viet_quat.png` |
| 9 | `item_fruit_dao.png` | `dao` | Đào | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_dao.png` |
| 10 | `item_fruit_xoai.png` | `xoai` | Xoài | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_xoai.png` |
| 11 | `item_fruit_hong.png` | `hong` | Hồng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/foods/item_fruit_hong.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_fruit_tao.png** (`tao` - Táo): Trái cây tươi Táo, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 18 đói và 18 nước.
- **item_fruit_chuoi.png** (`chuoi` - Chuối): Trái cây tươi Chuối, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 20 đói và 20 nước.
- **item_fruit_cam.png** (`cam` - Cam): Trái cây tươi Cam, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 15 đói và 15 nước.
- **item_fruit_le_tuyet.png** (`le_tuyet` - Lê tuyết): Trái cây tươi Lê tuyết, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 15 đói và 15 nước.
- **item_fruit_nho.png** (`nho` - Nho): Trái cây tươi Nho, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 15 đói và 15 nước.
- **item_fruit_dua_hau.png** (`dua_hau` - Dưa hấu): Trái cây tươi Dưa hấu, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 30 đói và 30 nước.
- **item_fruit_dau_tay.png** (`dau_tay` - Dâu tây): Trái cây tươi Dâu tây, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 12 đói và 12 nước.
- **item_fruit_viet_quat.png** (`viet_quat` - Việt quất): Trái cây tươi Việt quất, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 5 đói và 5 nước.
- **item_fruit_dao.png** (`dao` - Đào): Trái cây tươi Đào, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 18 đói và 18 nước.
- **item_fruit_xoai.png** (`xoai` - Xoài): Trái cây tươi Xoài, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 22 đói và 22 nước.
- **item_fruit_hong.png** (`hong` - Hồng): Trái cây tươi Hồng, quả chín mọng nước tự nhiên, bề mặt có đốm vỏ chân thực, bổ sung 15 đói và 15 nước.

### C.6. Drinks (12 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_drink_nuoc_khoang.png` | `nuoc_khoang` | Nước suối | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_khoang.png` |
| 2 | `item_drink_nuoc_dua.png` | `nuoc_dua` | Nước dừa | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_dua.png` |
| 3 | `item_drink_nuoc_cam_qua.png` | `nuoc_cam_qua` | Nước cam có quả | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_cam_qua.png` |
| 4 | `item_drink_sua_tuoi.png` | `sua_tuoi` | Sữa tươi | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_sua_tuoi.png` |
| 5 | `item_drink_sua_chua.png` | `sua_chua` | Sữa chua | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_sua_chua.png` |
| 6 | `item_drink_giam_tao.png` | `giam_tao` | Giấm táo | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_giam_tao.png` |
| 7 | `item_drink_nuoc_maverick.png` | `nuoc_maverick` | Nước Maverick | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_maverick.png` |
| 8 | `item_drink_nuoc_dien_giai.png` | `nuoc_dien_giai` | Nước điện giải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_dien_giai.png` |
| 9 | `item_drink_nuoc_the_thao.png` | `nuoc_the_thao` | Nước thể thao | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_nuoc_the_thao.png` |
| 10 | `item_drink_bia_tram_vi.png` | `bia_tram_vi` | Bia Trăm Vị | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_bia_tram_vi.png` |
| 11 | `item_drink_bia_nang_luong.png` | `bia_nang_luong` | Bia Năng Lượng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_bia_nang_luong.png` |
| 12 | `item_drink_ruou_cao_do.png` | `ruou_cao_do` | Rượu trắng cao độ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/drinks/item_drink_ruou_cao_do.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_drink_nuoc_khoang.png** (`nuoc_khoang` - Nước suối): Chai nước khoáng nhựa trong suốt có nắp vặn xanh, nước lọc tinh khiết bên trong bám vài giọt sương.
- **item_drink_nuoc_dua.png** (`nuoc_dua` - Nước dừa): Đồ uống Nước dừa, đóng chai/hộp chuyên dụng, giải khát bù đắp 45 điểm nước.
- **item_drink_nuoc_cam_qua.png** (`nuoc_cam_qua` - Nước cam có quả): Đồ uống Nước cam có quả, đóng chai/hộp chuyên dụng, giải khát bù đắp 30 điểm nước.
- **item_drink_sua_tuoi.png** (`sua_tuoi` - Sữa tươi): Đồ uống Sữa tươi, đóng chai/hộp chuyên dụng, giải khát bù đắp 35 điểm nước.
- **item_drink_sua_chua.png** (`sua_chua` - Sữa chua): Đồ uống Sữa chua, đóng chai/hộp chuyên dụng, giải khát bù đắp 35 điểm nước.
- **item_drink_giam_tao.png** (`giam_tao` - Giấm táo): Đồ uống Giấm táo, đóng chai/hộp chuyên dụng, giải khát bù đắp 35 điểm nước.
- **item_drink_nuoc_maverick.png** (`nuoc_maverick` - Nước Maverick): Đồ uống Nước Maverick, đóng chai/hộp chuyên dụng, giải khát bù đắp 60 điểm nước.
- **item_drink_nuoc_dien_giai.png** (`nuoc_dien_giai` - Nước điện giải): Đồ uống Nước điện giải, đóng chai/hộp chuyên dụng, giải khát bù đắp 60 điểm nước.
- **item_drink_nuoc_the_thao.png** (`nuoc_the_thao` - Nước thể thao): Đồ uống Nước thể thao, đóng chai/hộp chuyên dụng, giải khát bù đắp 60 điểm nước.
- **item_drink_bia_tram_vi.png** (`bia_tram_vi` - Bia Trăm Vị): Lon nhôm nước giải khát Bia Trăm Vị, thân lon kim loại in nhãn hiệu sờn màu, nắp bật kim loại đóng kín.
- **item_drink_bia_nang_luong.png** (`bia_nang_luong` - Bia Năng Lượng): Lon nhôm nước giải khát Bia Năng Lượng, thân lon kim loại in nhãn hiệu sờn màu, nắp bật kim loại đóng kín.
- **item_drink_ruou_cao_do.png** (`ruou_cao_do` - Rượu trắng cao độ): Đồ uống Rượu trắng cao độ, đóng chai/hộp chuyên dụng, giải khát bù đắp 0 điểm nước.

### C.7. Medicines (15 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_med_bang_keo.png` | `bang_keo` | Băng cá nhân | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_bang_keo.png` |
| 2 | `item_med_dich_gluco.png` | `dich_gluco` | Dung dịch gluco | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_dich_gluco.png` |
| 3 | `item_med_thuoc_giam_dau.png` | `thuoc_giam_dau` | Thuốc giảm đau | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_thuoc_giam_dau.png` |
| 4 | `item_med_thuoc_an_than.png` | `thuoc_an_than` | Thuốc an thần | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_thuoc_an_than.png` |
| 5 | `item_med_adrenalin.png` | `adrenalin` | Adrenalin | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_adrenalin.png` |
| 6 | `item_med_day_bo_mau.png` | `day_bo_mau` | Dây bó máu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_day_bo_mau.png` |
| 7 | `item_med_thuoc_sach_vet.png` | `thuoc_sach_vet` | Thuốc sạch vết | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_thuoc_sach_vet.png` |
| 8 | `item_med_goi_phau_thuat.png` | `goi_phau_thuat` | Gói phẫu thuật | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_goi_phau_thuat.png` |
| 9 | `item_med_khang_sinh.png` | `khang_sinh` | Kháng sinh | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_khang_sinh.png` |
| 10 | `item_med_huyet_thanh.png` | `huyet_thanh` | Huyết thanh kháng nhiễm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_huyet_thanh.png` |
| 11 | `item_med_goi_cap_cuu.png` | `goi_cap_cuu` | Gói cấp cứu y tế | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_goi_cap_cuu.png` |
| 12 | `item_med_hop_y_te.png` | `hop_y_te` | Hộp y tế chiến địa | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_hop_y_te.png` |
| 13 | `item_med_tiem_van_nang.png` | `tiem_van_nang` | Thuốc tiêm đa năng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_tiem_van_nang.png` |
| 14 | `item_med_improved_serum.png` | `improved_serum` | Kháng thể cải tiến | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_improved_serum.png` |
| 15 | `item_med_zombie_gel.png` | `zombie_gel` | Gel zombie | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/medicines/item_med_zombie_gel.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_med_bang_keo.png** (`bang_keo` - Băng cá nhân): Miếng băng dán cá nhân y tế vô trùng, lớp keo dán màu be có đệm gạc thấm hút nhỏ ở giữa.
- **item_med_dich_gluco.png** (`dich_gluco` - Dung dịch gluco): Vật phẩm y tế Dung dịch gluco, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_thuoc_giam_dau.png** (`thuoc_giam_dau` - Thuốc giảm đau): Vỉ thuốc viên hoặc lọ thuốc Thuốc giảm đau, nhãn y tế chuẩn, dùng điều trị y tế khẩn cấp.
- **item_med_thuoc_an_than.png** (`thuoc_an_than` - Thuốc an thần): Vỉ thuốc viên hoặc lọ thuốc Thuốc an thần, nhãn y tế chuẩn, dùng điều trị y tế khẩn cấp.
- **item_med_adrenalin.png** (`adrenalin` - Adrenalin): Vật phẩm y tế Adrenalin, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_day_bo_mau.png** (`day_bo_mau` - Dây bó máu): Vật phẩm y tế Dây bó máu, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_thuoc_sach_vet.png** (`thuoc_sach_vet` - Thuốc sạch vết): Vỉ thuốc viên hoặc lọ thuốc Thuốc sạch vết, nhãn y tế chuẩn, dùng điều trị y tế khẩn cấp.
- **item_med_goi_phau_thuat.png** (`goi_phau_thuat` - Gói phẫu thuật): Vật phẩm y tế Gói phẫu thuật, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_khang_sinh.png** (`khang_sinh` - Kháng sinh): Vỉ thuốc viên hoặc lọ thuốc Kháng sinh, nhãn y tế chuẩn, dùng điều trị y tế khẩn cấp.
- **item_med_huyet_thanh.png** (`huyet_thanh` - Huyết thanh kháng nhiễm): Vật phẩm y tế Huyết thanh kháng nhiễm, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_goi_cap_cuu.png** (`goi_cap_cuu` - Gói cấp cứu y tế): Vật phẩm y tế Gói cấp cứu y tế, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_hop_y_te.png** (`hop_y_te` - Hộp y tế chiến địa): Vật phẩm y tế Hộp y tế chiến địa, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_tiem_van_nang.png** (`tiem_van_nang` - Thuốc tiêm đa năng): Vật phẩm y tế Thuốc tiêm đa năng, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_improved_serum.png** (`improved_serum` - Kháng thể cải tiến): Vật phẩm y tế Kháng thể cải tiến, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.
- **item_med_zombie_gel.png** (`zombie_gel` - Gel zombie): Vật phẩm y tế Gel zombie, dụng cụ/thuốc cứu thương sinh tồn, hỗ trợ phục hồi sức khỏe và giảm nhiễm bệnh.

### C.8. Crops (Harvested) (15 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_crop_niupicai.png` | `niupicai` | Cáu bò | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_niupicai.png` |
| 2 | `item_crop_machixian.png` | `machixian` | Xà lách bò | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_machixian.png` |
| 3 | `item_crop_juju.png` | `juju` | Cách lá | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_juju.png` |
| 4 | `item_crop_yangjiang.png` | `yangjiang` | Hành lá Tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_yangjiang.png` |
| 5 | `item_crop_mushu.png` | `mushu` | Cassava | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_mushu.png` |
| 6 | `item_crop_hongshu.png` | `hongshu` | Khoai lang | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_hongshu.png` |
| 7 | `item_crop_tudou.png` | `tudou` | Khoai tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_tudou.png` |
| 8 | `item_crop_wujing.png` | `wujing` | Củ cải trắng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_wujing.png` |
| 9 | `item_crop_boluomencan.png` | `boluomencan` | Nhan sam Ba La Môn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_boluomencan.png` |
| 10 | `item_crop_luobo.png` | `luobo` | Cà rốt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_luobo.png` |
| 11 | `item_crop_jiucai.png` | `jiucai` | Hẹ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_jiucai.png` |
| 12 | `item_crop_gouqi.png` | `gouqi` | Kỷ tử | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_gouqi.png` |
| 13 | `item_crop_suanmo.png` | `suanmo` | Rau chua | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_suanmo.png` |
| 14 | `item_crop_heimai.png` | `heimai` | Lúa mạch đen | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_heimai.png` |
| 15 | `item_crop_wandou.png` | `wandou` | Đậu Hà Lan | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/crops/item_crop_wandou.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_crop_niupicai.png** (`niupicai` - Cáu bò): Nông sản thu hoạch Cáu bò, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_machixian.png** (`machixian` - Xà lách bò): Nông sản thu hoạch Xà lách bò, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_juju.png** (`juju` - Cách lá): Nông sản thu hoạch Cách lá, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_yangjiang.png** (`yangjiang` - Hành lá Tây): Nông sản thu hoạch Hành lá Tây, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_mushu.png** (`mushu` - Cassava): Nông sản thu hoạch Cassava, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_hongshu.png** (`hongshu` - Khoai lang): Nông sản thu hoạch Khoai lang, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_tudou.png** (`tudou` - Khoai tây): Nông sản thu hoạch Khoai tây, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_wujing.png** (`wujing` - Củ cải trắng): Nông sản thu hoạch Củ cải trắng, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_boluomencan.png** (`boluomencan` - Nhan sam Ba La Môn): Nông sản thu hoạch Nhan sam Ba La Môn, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_luobo.png** (`luobo` - Cà rốt): Nông sản thu hoạch Cà rốt, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_jiucai.png** (`jiucai` - Hẹ): Nông sản thu hoạch Hẹ, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_gouqi.png** (`gouqi` - Kỷ tử): Nông sản thu hoạch Kỷ tử, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_suanmo.png** (`suanmo` - Rau chua): Nông sản thu hoạch Rau chua, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_heimai.png** (`heimai` - Lúa mạch đen): Nông sản thu hoạch Lúa mạch đen, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.
- **item_crop_wandou.png** (`wandou` - Đậu Hà Lan): Nông sản thu hoạch Đậu Hà Lan, lá/củ tươi nguyên vẹn còn dính chút đất mùn tự nhiên sau khi thu hoạch tại nông trại căn cứ.

### C.9. Seeds (15 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_seed_seed_niupicai.png` | `seed_niupicai` | Hạt cáu bò | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_niupicai.png` |
| 2 | `item_seed_seed_machixian.png` | `seed_machixian` | Hạt xà lách bò | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_machixian.png` |
| 3 | `item_seed_seed_juju.png` | `seed_juju` | Hạt cách lá | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_juju.png` |
| 4 | `item_seed_seed_yangjiang.png` | `seed_yangjiang` | Hạt hành lá Tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_yangjiang.png` |
| 5 | `item_seed_seed_mushu.png` | `seed_mushu` | Hạt cassava | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_mushu.png` |
| 6 | `item_seed_seed_hongshu.png` | `seed_hongshu` | Hạt khoai lang | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_hongshu.png` |
| 7 | `item_seed_seed_tudou.png` | `seed_tudou` | Hạt khoai tây | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_tudou.png` |
| 8 | `item_seed_seed_wujing.png` | `seed_wujing` | Hạt cải trắng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_wujing.png` |
| 9 | `item_seed_seed_boluomencan.png` | `seed_boluomencan` | Hạt nhan sam Ba La Môn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_boluomencan.png` |
| 10 | `item_seed_seed_luobo.png` | `seed_luobo` | Hạt cà rốt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_luobo.png` |
| 11 | `item_seed_seed_jiucai.png` | `seed_jiucai` | Hạt hẹ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_jiucai.png` |
| 12 | `item_seed_seed_gouqi.png` | `seed_gouqi` | Hạt kỷ tử | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_gouqi.png` |
| 13 | `item_seed_seed_suanmo.png` | `seed_suanmo` | Hạt rau chua | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_suanmo.png` |
| 14 | `item_seed_seed_heimai.png` | `seed_heimai` | Hạt mạch đen | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_heimai.png` |
| 15 | `item_seed_seed_wandou.png` | `seed_wandou` | Hạt đậu Hà Lan | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/seeds/item_seed_seed_wandou.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_seed_seed_niupicai.png** (`seed_niupicai` - Hạt cáu bò): Túi giấy nhỏ chứa hạt giống cây trồng cáu bò, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_machixian.png** (`seed_machixian` - Hạt xà lách bò): Túi giấy nhỏ chứa hạt giống cây trồng xà lách bò, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_juju.png** (`seed_juju` - Hạt cách lá): Túi giấy nhỏ chứa hạt giống cây trồng cách lá, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_yangjiang.png** (`seed_yangjiang` - Hạt hành lá Tây): Túi giấy nhỏ chứa hạt giống cây trồng hành lá Tây, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_mushu.png** (`seed_mushu` - Hạt cassava): Túi giấy nhỏ chứa hạt giống cây trồng cassava, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_hongshu.png** (`seed_hongshu` - Hạt khoai lang): Túi giấy nhỏ chứa hạt giống cây trồng khoai lang, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_tudou.png** (`seed_tudou` - Hạt khoai tây): Túi giấy nhỏ chứa hạt giống cây trồng khoai tây, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_wujing.png** (`seed_wujing` - Hạt cải trắng): Túi giấy nhỏ chứa hạt giống cây trồng cải trắng, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_boluomencan.png** (`seed_boluomencan` - Hạt nhan sam Ba La Môn): Túi giấy nhỏ chứa hạt giống cây trồng nhan sam Ba La Môn, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_luobo.png** (`seed_luobo` - Hạt cà rốt): Túi giấy nhỏ chứa hạt giống cây trồng cà rốt, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_jiucai.png** (`seed_jiucai` - Hạt hẹ): Túi giấy nhỏ chứa hạt giống cây trồng hẹ, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_gouqi.png** (`seed_gouqi` - Hạt kỷ tử): Túi giấy nhỏ chứa hạt giống cây trồng kỷ tử, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_suanmo.png** (`seed_suanmo` - Hạt rau chua): Túi giấy nhỏ chứa hạt giống cây trồng rau chua, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_heimai.png** (`seed_heimai` - Hạt mạch đen): Túi giấy nhỏ chứa hạt giống cây trồng mạch đen, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.
- **item_seed_seed_wandou.png** (`seed_wandou` - Hạt đậu Hà Lan): Túi giấy nhỏ chứa hạt giống cây trồng đậu Hà Lan, buộc dây thừng gai với nhãn chữ viết tay mộc mạc.

### C.10. Fish (16 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_fish_grey_mullet.png` | `grey_mullet` | Cá lóc xám | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_grey_mullet.png` |
| 2 | `item_fish_iron_sardine.png` | `iron_sardine` | Cá mòi sắt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_iron_sardine.png` |
| 3 | `item_fish_blunt_seabream.png` | `blunt_seabream` | Cá lóc đùn đầu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_blunt_seabream.png` |
| 4 | `item_fish_blacktail_mackerel.png` | `blacktail_mackerel` | Cá thu đen đuôi | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_blacktail_mackerel.png` |
| 5 | `item_fish_ray_barracuda.png` | `ray_barracuda` | Cá nhân ký vằn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_ray_barracuda.png` |
| 6 | `item_fish_rust_flounder.png` | `rust_flounder` | Cá đính xỉn màu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_rust_flounder.png` |
| 7 | `item_fish_twin_grouper.png` | `twin_grouper` | Cá đá hai đầu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_twin_grouper.png` |
| 8 | `item_fish_sewage_eel.png` | `sewage_eel` | Cá nhếch bùn thải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_sewage_eel.png` |
| 9 | `item_fish_corpse_cod.png` | `corpse_cod` | Cá mã thây chết | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_corpse_cod.png` |
| 10 | `item_fish_spine_wolffish.png` | `spine_wolffish` | Cá sói xương nứt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_spine_wolffish.png` |
| 11 | `item_fish_gel_lanternfish.png` | `gel_lanternfish` | Cá lồng gel | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_gel_lanternfish.png` |
| 12 | `item_fish_multi_barb_king.png` | `multi_barb_king` | Vua cá rậm nhiều | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_multi_barb_king.png` |
| 13 | `item_fish_dead_giant_cod.png` | `dead_giant_cod` | Cá mã khổng lồ chết | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_dead_giant_cod.png` |
| 14 | `item_fish_plague_tentacle.png` | `plague_tentacle` | Côn trùng dịch bệnh | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_plague_tentacle.png` |
| 15 | `item_fish_wreck_ghost_shark.png` | `wreck_ghost_shark` | Cá m Ong hutdown | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_wreck_ghost_shark.png` |
| 16 | `item_fish_abyss_core_fish.png` | `abyss_core_fish` | Cá lõi vực thẳm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/fish/item_fish_abyss_core_fish.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_fish_grey_mullet.png** (`grey_mullet` - Cá lóc xám): Con cá tươi nguyên con Cá lóc xám, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_iron_sardine.png** (`iron_sardine` - Cá mòi sắt): Con cá tươi nguyên con Cá mòi sắt, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_blunt_seabream.png** (`blunt_seabream` - Cá lóc đùn đầu): Con cá tươi nguyên con Cá lóc đùn đầu, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_blacktail_mackerel.png** (`blacktail_mackerel` - Cá thu đen đuôi): Con cá tươi nguyên con Cá thu đen đuôi, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_ray_barracuda.png** (`ray_barracuda` - Cá nhân ký vằn): Con cá tươi nguyên con Cá nhân ký vằn, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_rust_flounder.png** (`rust_flounder` - Cá đính xỉn màu): Con cá tươi nguyên con Cá đính xỉn màu, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_twin_grouper.png** (`twin_grouper` - Cá đá hai đầu): Con cá tươi nguyên con Cá đá hai đầu, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_sewage_eel.png** (`sewage_eel` - Cá nhếch bùn thải): Con cá tươi nguyên con Cá nhếch bùn thải, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_corpse_cod.png** (`corpse_cod` - Cá mã thây chết): Con cá tươi nguyên con Cá mã thây chết, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_spine_wolffish.png** (`spine_wolffish` - Cá sói xương nứt): Con cá tươi nguyên con Cá sói xương nứt, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_gel_lanternfish.png** (`gel_lanternfish` - Cá lồng gel): Con cá tươi nguyên con Cá lồng gel, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_multi_barb_king.png** (`multi_barb_king` - Vua cá rậm nhiều): Con cá tươi nguyên con Vua cá rậm nhiều, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_dead_giant_cod.png** (`dead_giant_cod` - Cá mã khổng lồ chết): Con cá tươi nguyên con Cá mã khổng lồ chết, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_plague_tentacle.png** (`plague_tentacle` - Côn trùng dịch bệnh): Con cá tươi nguyên con Côn trùng dịch bệnh, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_wreck_ghost_shark.png** (`wreck_ghost_shark` - Cá m Ong hutdown): Con cá tươi nguyên con Cá m Ong hutdown, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.
- **item_fish_abyss_core_fish.png** (`abyss_core_fish` - Cá lõi vực thẳm): Con cá tươi nguyên con Cá lõi vực thẳm, lớp vây và vảy cá ánh bạc tự nhiên, thân cá cong nhẹ vừa được câu từ mặt nước.

### C.11. Seafood Meals (5 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_meal_bad_seafood_meal.png` | `bad_seafood_meal` | Bữa ăn hải sản khó ăn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/meals/item_meal_bad_seafood_meal.png` |
| 2 | `item_meal_normal_seafood_meal.png` | `normal_seafood_meal` | Bữa ăn hải sản trung bình | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/meals/item_meal_normal_seafood_meal.png` |
| 3 | `item_meal_delicious_seafood_meal.png` | `delicious_seafood_meal` | Bữa ăn hải sản ngon | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/meals/item_meal_delicious_seafood_meal.png` |
| 4 | `item_meal_tempting_seafood_meal.png` | `tempting_seafood_meal` | Bữa ăn hải sản hấp dẫn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/meals/item_meal_tempting_seafood_meal.png` |
| 5 | `item_meal_top_seafood_meal.png` | `top_seafood_meal` | Bữa ăn hải sản cao cấp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/meals/item_meal_top_seafood_meal.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_meal_bad_seafood_meal.png** (`bad_seafood_meal` - Bữa ăn hải sản khó ăn): Món ăn hải sản chế biến Bữa ăn hải sản khó ăn, phục vụ trong khay nhôm quân dụng, mùi vị nóng hổi bổ dưỡng cung cấp nhiều năng lượng.
- **item_meal_normal_seafood_meal.png** (`normal_seafood_meal` - Bữa ăn hải sản trung bình): Món ăn hải sản chế biến Bữa ăn hải sản trung bình, phục vụ trong khay nhôm quân dụng, mùi vị nóng hổi bổ dưỡng cung cấp nhiều năng lượng.
- **item_meal_delicious_seafood_meal.png** (`delicious_seafood_meal` - Bữa ăn hải sản ngon): Món ăn hải sản chế biến Bữa ăn hải sản ngon, phục vụ trong khay nhôm quân dụng, mùi vị nóng hổi bổ dưỡng cung cấp nhiều năng lượng.
- **item_meal_tempting_seafood_meal.png** (`tempting_seafood_meal` - Bữa ăn hải sản hấp dẫn): Món ăn hải sản chế biến Bữa ăn hải sản hấp dẫn, phục vụ trong khay nhôm quân dụng, mùi vị nóng hổi bổ dưỡng cung cấp nhiều năng lượng.
- **item_meal_top_seafood_meal.png** (`top_seafood_meal` - Bữa ăn hải sản cao cấp): Món ăn hải sản chế biến Bữa ăn hải sản cao cấp, phục vụ trong khay nhôm quân dụng, mùi vị nóng hổi bổ dưỡng cung cấp nhiều năng lượng.

### C.12. Building Materials (5 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_mat_wood.png` | `wood` | Gỗ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/materials/item_mat_wood.png` |
| 2 | `item_mat_building_mat.png` | `building_mat` | Vật liệu xây dựng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/materials/item_mat_building_mat.png` |
| 3 | `item_mat_stone.png` | `stone` | Đá | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/materials/item_mat_stone.png` |
| 4 | `item_mat_nails.png` | `nails` | M đóng | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/materials/item_mat_nails.png` |
| 5 | `item_mat_glass.png` | `glass` | Kính | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/materials/item_mat_glass.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_mat_wood.png** (`wood` - Gỗ): Bó các thanh gỗ xẻ vuông vức chắc chắn dùng cho xây dựng công sự và củng cố căn cứ.
- **item_mat_building_mat.png** (`building_mat` - Vật liệu xây dựng): Nguyên vật liệu xây dựng Vật liệu xây dựng, hỗ trợ nâng cấp kết cấu và phòng ngự cứ điểm.
- **item_mat_stone.png** (`stone` - Đá): Đống đá tảng hoa cương thô cứng góc cạnh, vật liệu kiên cố cho công trình.
- **item_mat_nails.png** (`nails` - M đóng): Nguyên vật liệu xây dựng M đóng, hỗ trợ nâng cấp kết cấu và phòng ngự cứ điểm.
- **item_mat_glass.png** (`glass` - Kính): Nguyên vật liệu xây dựng Kính, hỗ trợ nâng cấp kết cấu và phòng ngự cứ điểm.

### C.13. Backpacks (23 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_backpack_tui_xach.png` | `tui_xach` | Tú xách | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_tui_xach.png` |
| 2 | `item_backpack_tui_eo_nho.png` | `tui_eo_nho` | Tú eo nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_tui_eo_nho.png` |
| 3 | `item_backpack_balo_nho.png` | `balo_nho` | Balo nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_nho.png` |
| 4 | `item_backpack_tui_xach_tay.png` | `tui_xach_tay` | Tú xách tay | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_tui_xach_tay.png` |
| 5 | `item_backpack_balo_va_canvas.png` | `balo_va_canvas` | Balo vải canvas | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_va_canvas.png` |
| 6 | `item_backpack_balo_thoi_trang.png` | `balo_thoi_trang` | Balo thời trang | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_thoi_trang.png` |
| 7 | `item_backpack_balo_the_thao.png` | `balo_the_thao` | Balo thể thao | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_the_thao.png` |
| 8 | `item_backpack_balo_le_nui.png` | `balo_le_nui` | Balo leo núi | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_le_nui.png` |
| 9 | `item_backpack_balo_quan_doi.png` | `balo_quan_doi` | Balo quân đội | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_quan_doi.png` |
| 10 | `item_backpack_balo_chien_thuat.png` | `balo_chien_thuat` | Balo chiến thuật | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_chien_thuat.png` |
| 11 | `item_backpack_balo_dac_biet.png` | `balo_dac_biet` | Balo đặc biệt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_dac_biet.png` |
| 12 | `item_backpack_balo_le_nui_cap_i.png` | `balo_le_nui_cap_i` | Balo leo núi cấp I | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_le_nui_cap_i.png` |
| 13 | `item_backpack_balo_le_nui_cap_ii.png` | `balo_le_nui_cap_ii` | Balo leo núi cấp II | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_le_nui_cap_ii.png` |
| 14 | `item_backpack_balo_le_nui_cap_iii.png` | `balo_le_nui_cap_iii` | Balo leo núi cấp III | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_le_nui_cap_iii.png` |
| 15 | `item_backpack_balo_le_nui_cap_iv.png` | `balo_le_nui_cap_iv` | Balo leo núi cấp IV | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_le_nui_cap_iv.png` |
| 16 | `item_backpack_balo_du_lich_sieu_lon.png` | `balo_du_lich_sieu_lon` | Balo du lịch siêu lớn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_du_lich_sieu_lon.png` |
| 17 | `item_backpack_balo_du_lich_nang_cap.png` | `balo_du_lich_nang_cap` | Balo du lịch nâng cấp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_du_lich_nang_cap.png` |
| 18 | `item_backpack_balo_du_lich_cao_cap.png` | `balo_du_lich_cao_cap` | Balo du lịch cao cấp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_du_lich_cao_cap.png` |
| 19 | `item_backpack_balo_the_thao_chu_tai.png` | `balo_the_thao_chu_tai` | Balo thể thao chịu tải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_the_thao_chu_tai.png` |
| 20 | `item_backpack_balo_quan_doi_chu_tai.png` | `balo_quan_doi_chu_tai` | Balo quân đội chịu tải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_quan_doi_chu_tai.png` |
| 21 | `item_backpack_balo_dac_biet_chu_tai.png` | `balo_dac_biet_chu_tai` | Balo đặc biệt chịu tải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_dac_biet_chu_tai.png` |
| 22 | `item_backpack_balo_dung_khi_chu_tai.png` | `balo_dung_khi_chu_tai` | Balo dũng khí chịu tải | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_dung_khi_chu_tai.png` |
| 23 | `item_backpack_balo_luu_tru_vu_tru.png` | `balo_luu_tru_vu_tru` | Balo lưu trữ Vũ Trụ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/backpacks/item_backpack_balo_luu_tru_vu_tru.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_backpack_tui_xach.png** (`tui_xach` - Tú xách): Túi chứa / Ba lô sinh tồn Tú xách, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 20 ô đồ.
- **item_backpack_tui_eo_nho.png** (`tui_eo_nho` - Tú eo nhỏ): Túi chứa / Ba lô sinh tồn Tú eo nhỏ, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 22 ô đồ.
- **item_backpack_balo_nho.png** (`balo_nho` - Balo nhỏ): Túi chứa / Ba lô sinh tồn Balo nhỏ, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 24 ô đồ.
- **item_backpack_tui_xach_tay.png** (`tui_xach_tay` - Tú xách tay): Túi chứa / Ba lô sinh tồn Tú xách tay, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 26 ô đồ.
- **item_backpack_balo_va_canvas.png** (`balo_va_canvas` - Balo vải canvas): Túi chứa / Ba lô sinh tồn Balo vải canvas, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 28 ô đồ.
- **item_backpack_balo_thoi_trang.png** (`balo_thoi_trang` - Balo thời trang): Túi chứa / Ba lô sinh tồn Balo thời trang, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 30 ô đồ.
- **item_backpack_balo_the_thao.png** (`balo_the_thao` - Balo thể thao): Túi chứa / Ba lô sinh tồn Balo thể thao, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 32 ô đồ.
- **item_backpack_balo_le_nui.png** (`balo_le_nui` - Balo leo núi): Túi chứa / Ba lô sinh tồn Balo leo núi, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 34 ô đồ.
- **item_backpack_balo_quan_doi.png** (`balo_quan_doi` - Balo quân đội): Túi chứa / Ba lô sinh tồn Balo quân đội, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 36 ô đồ.
- **item_backpack_balo_chien_thuat.png** (`balo_chien_thuat` - Balo chiến thuật): Túi chứa / Ba lô sinh tồn Balo chiến thuật, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 39 ô đồ.
- **item_backpack_balo_dac_biet.png** (`balo_dac_biet` - Balo đặc biệt): Túi chứa / Ba lô sinh tồn Balo đặc biệt, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 42 ô đồ.
- **item_backpack_balo_le_nui_cap_i.png** (`balo_le_nui_cap_i` - Balo leo núi cấp I): Túi chứa / Ba lô sinh tồn Balo leo núi cấp I, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 48 ô đồ.
- **item_backpack_balo_le_nui_cap_ii.png** (`balo_le_nui_cap_ii` - Balo leo núi cấp II): Túi chứa / Ba lô sinh tồn Balo leo núi cấp II, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 50 ô đồ.
- **item_backpack_balo_le_nui_cap_iii.png** (`balo_le_nui_cap_iii` - Balo leo núi cấp III): Túi chứa / Ba lô sinh tồn Balo leo núi cấp III, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 52 ô đồ.
- **item_backpack_balo_le_nui_cap_iv.png** (`balo_le_nui_cap_iv` - Balo leo núi cấp IV): Túi chứa / Ba lô sinh tồn Balo leo núi cấp IV, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 54 ô đồ.
- **item_backpack_balo_du_lich_sieu_lon.png** (`balo_du_lich_sieu_lon` - Balo du lịch siêu lớn): Túi chứa / Ba lô sinh tồn Balo du lịch siêu lớn, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 56 ô đồ.
- **item_backpack_balo_du_lich_nang_cap.png** (`balo_du_lich_nang_cap` - Balo du lịch nâng cấp): Túi chứa / Ba lô sinh tồn Balo du lịch nâng cấp, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 60 ô đồ.
- **item_backpack_balo_du_lich_cao_cap.png** (`balo_du_lich_cao_cap` - Balo du lịch cao cấp): Túi chứa / Ba lô sinh tồn Balo du lịch cao cấp, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 64 ô đồ.
- **item_backpack_balo_the_thao_chu_tai.png** (`balo_the_thao_chu_tai` - Balo thể thao chịu tải): Túi chứa / Ba lô sinh tồn Balo thể thao chịu tải, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 68 ô đồ.
- **item_backpack_balo_quan_doi_chu_tai.png** (`balo_quan_doi_chu_tai` - Balo quân đội chịu tải): Túi chứa / Ba lô sinh tồn Balo quân đội chịu tải, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 72 ô đồ.
- **item_backpack_balo_dac_biet_chu_tai.png** (`balo_dac_biet_chu_tai` - Balo đặc biệt chịu tải): Túi chứa / Ba lô sinh tồn Balo đặc biệt chịu tải, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 78 ô đồ.
- **item_backpack_balo_dung_khi_chu_tai.png** (`balo_dung_khi_chu_tai` - Balo dũng khí chịu tải): Túi chứa / Ba lô sinh tồn Balo dũng khí chịu tải, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 85 ô đồ.
- **item_backpack_balo_luu_tru_vu_tru.png** (`balo_luu_tru_vu_tru` - Balo lưu trữ Vũ Trụ): Túi chứa / Ba lô sinh tồn Balo lưu trữ Vũ Trụ, chất liệu vải bạt dù Cordura chịu lực, quai đeo đệm dày, nhiều ngăn khóa kéo chứa sức chứa 100 ô đồ.

### C.14. Special / Quest Items (23 items)

| STT | Filename đề xuất | Item ID | Tên vật phẩm | Kích thước | Định dạng & Kênh Alpha | Đường dẫn dự kiến |
|:---:|---|---|---|:---:|:---:|---|
| 1 | `item_quest_noble_id.png` | `noble_id` | Thẻ thân phận quý tộc | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_noble_id.png` |
| 2 | `item_quest_dawn_badge.png` | `dawn_badge` | Huy hiệu Dawn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_dawn_badge.png` |
| 3 | `item_quest_silence_badge.png` | `silence_badge` | Huy hiệu Tịch diệt | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_silence_badge.png` |
| 4 | `item_quest_viscount_id.png` | `viscount_id` | Thẻ thân phận Tử tước | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_viscount_id.png` |
| 5 | `item_quest_count_id.png` | `count_id` | Thẻ thân phận Bá tước | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_count_id.png` |
| 6 | `item_quest_marquis_id.png` | `marquis_id` | Thẻ thân phận Hầu tước | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_marquis_id.png` |
| 7 | `item_quest_duke_id.png` | `duke_id` | Thẻ thân phận Công tước | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_duke_id.png` |
| 8 | `item_quest_crown_prince_id.png` | `crown_prince_id` | Thẻ thân phận Trữ quân | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_crown_prince_id.png` |
| 9 | `item_quest_dawn_captain_badge.png` | `dawn_captain_badge` | Huy hiệu đội trưởng tiên phong Dawn | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_dawn_captain_badge.png` |
| 10 | `item_quest_underground_key.png` | `underground_key` | Chìa khóa ngầm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_underground_key.png` |
| 11 | `item_quest_farming_master_badge.png` | `farming_master_badge` | Huy hiệu bậc thầy nông nghiệp | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_farming_master_badge.png` |
| 12 | `item_quest_miaomiao_diary.png` | `miaomiao_diary` | Nhật ký Miu Miu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_miaomiao_diary.png` |
| 13 | `item_quest_strange_recorder.png` | `strange_recorder` | Bút ghi âm kỳ lạ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_strange_recorder.png` |
| 14 | `item_quest_letter_to_sister.png` | `letter_to_sister` | Thư gửi em gái | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_letter_to_sister.png` |
| 15 | `item_quest_queen_reply.png` | `queen_reply` | Thư hồi âm của hoàng hậu | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_queen_reply.png` |
| 16 | `item_quest_love_token.png` | `love_token` | Vật đính ước | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_love_token.png` |
| 17 | `item_quest_castle_pass.png` | `castle_pass` | Thẻ thông hành thành | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_castle_pass.png` |
| 18 | `item_quest_car_key.png` | `car_key` | Chìa khóa xe | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_car_key.png` |
| 19 | `item_quest_lightning_scale.png` | `lightning_scale` | Vảy sét | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_lightning_scale.png` |
| 20 | `item_quest_thunder_scale.png` | `thunder_scale` | Vảy sấm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_thunder_scale.png` |
| 21 | `item_quest_pure_energy.png` | `pure_energy` | Năng lượng tinh khiết | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_pure_energy.png` |
| 22 | `item_quest_crime_data.png` | `crime_data` | Tài liệu tội phạm | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_crime_data.png` |
| 23 | `item_quest_small_nuclear_generator.png` | `small_nuclear_generator` | Máy phát điện hạt nhân nhỏ | 256×256 | PNG 32-bit RGBA (Transparent) | `public/assets/items/quest/item_quest_small_nuclear_generator.png` |

**Chi tiết mô tả thị giác (Visual Descriptions):**

- **item_quest_noble_id.png** (`noble_id` - Thẻ thân phận quý tộc): Vật phẩm đặc biệt cốt truyện Thẻ thân phận quý tộc, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_dawn_badge.png** (`dawn_badge` - Huy hiệu Dawn): Vật phẩm đặc biệt cốt truyện Huy hiệu Dawn, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_silence_badge.png** (`silence_badge` - Huy hiệu Tịch diệt): Vật phẩm đặc biệt cốt truyện Huy hiệu Tịch diệt, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_viscount_id.png** (`viscount_id` - Thẻ thân phận Tử tước): Vật phẩm đặc biệt cốt truyện Thẻ thân phận Tử tước, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_count_id.png** (`count_id` - Thẻ thân phận Bá tước): Vật phẩm đặc biệt cốt truyện Thẻ thân phận Bá tước, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_marquis_id.png** (`marquis_id` - Thẻ thân phận Hầu tước): Vật phẩm đặc biệt cốt truyện Thẻ thân phận Hầu tước, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_duke_id.png** (`duke_id` - Thẻ thân phận Công tước): Vật phẩm đặc biệt cốt truyện Thẻ thân phận Công tước, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_crown_prince_id.png** (`crown_prince_id` - Thẻ thân phận Trữ quân): Vật phẩm đặc biệt cốt truyện Thẻ thân phận Trữ quân, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_dawn_captain_badge.png** (`dawn_captain_badge` - Huy hiệu đội trưởng tiên phong Dawn): Vật phẩm đặc biệt cốt truyện Huy hiệu đội trưởng tiên phong Dawn, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_underground_key.png** (`underground_key` - Chìa khóa ngầm): Vật phẩm đặc biệt cốt truyện Chìa khóa ngầm, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_farming_master_badge.png** (`farming_master_badge` - Huy hiệu bậc thầy nông nghiệp): Vật phẩm đặc biệt cốt truyện Huy hiệu bậc thầy nông nghiệp, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_miaomiao_diary.png** (`miaomiao_diary` - Nhật ký Miu Miu): Vật phẩm đặc biệt cốt truyện Nhật ký Miu Miu, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_strange_recorder.png** (`strange_recorder` - Bút ghi âm kỳ lạ): Vật phẩm đặc biệt cốt truyện Bút ghi âm kỳ lạ, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_letter_to_sister.png** (`letter_to_sister` - Thư gửi em gái): Vật phẩm đặc biệt cốt truyện Thư gửi em gái, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_queen_reply.png** (`queen_reply` - Thư hồi âm của hoàng hậu): Vật phẩm đặc biệt cốt truyện Thư hồi âm của hoàng hậu, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_love_token.png** (`love_token` - Vật đính ước): Vật phẩm đặc biệt cốt truyện Vật đính ước, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_castle_pass.png** (`castle_pass` - Thẻ thông hành thành): Vật phẩm đặc biệt cốt truyện Thẻ thông hành thành, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_car_key.png** (`car_key` - Chìa khóa xe): Vật phẩm đặc biệt cốt truyện Chìa khóa xe, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_lightning_scale.png** (`lightning_scale` - Vảy sét): Vật phẩm đặc biệt cốt truyện Vảy sét, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_thunder_scale.png** (`thunder_scale` - Vảy sấm): Vật phẩm đặc biệt cốt truyện Vảy sấm, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_pure_energy.png** (`pure_energy` - Năng lượng tinh khiết): Vật phẩm đặc biệt cốt truyện Năng lượng tinh khiết, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_crime_data.png** (`crime_data` - Tài liệu tội phạm): Vật phẩm đặc biệt cốt truyện Tài liệu tội phạm, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.
- **item_quest_small_nuclear_generator.png** (`small_nuclear_generator` - Máy phát điện hạt nhân nhỏ): Vật phẩm đặc biệt cốt truyện Máy phát điện hạt nhân nhỏ, thiết kế chi tiết mang ý nghĩa nhiệm vụ quan trọng tại thế giới Zombie World RPG.


---

## D. DANH SÁCH ẢNH ĐÃ CÓ (EXISTS ASSETS)

Hiện tại dự án đã có sẵn **3 asset vật phẩm/tiền tệ** đang được sử dụng chính thức trong giao diện người dùng (`renderCargo` trong `js/ui.js`), cộng thêm **1 asset danh mục ba lô chung** đã đạt chuẩn:

| STT | Filename | Item ID | Item Name | Danh mục | Kích thước thực tế | Dung lượng | Định dạng | Đường dẫn thực tế | Trạng thái |
|:---:|---|---|---|---|:---:|:---:|:---:|---|:---:|
| 1 | `ui_icon_res_cigarette.png` | `thuoc_la` | Thuốc lá | Commodities / Currency | 256×256 | 64.6 KB | PNG 32-bit RGBA | `public/assets/icons/ui_icon_res_cigarette.png` | `EXISTS` |
| 2 | `ui_icon_res_gasoline.png` | `xang_dau` | Xăng dầu (Gasoline) | Commodities / Currency | 256×256 | 89.3 KB | PNG 32-bit RGBA | `public/assets/icons/ui_icon_res_gasoline.png` | `EXISTS` |
| 3 | `ui_icon_res_royal_coin.png` | `royal_coin` | Tiền hoàng gia (Royal Coin) | Commodities / Currency | 256×256 | 148.2 KB | PNG 32-bit RGBA | `public/assets/icons/ui_icon_res_royal_coin.png` | `EXISTS` |
| 4 | `ui_icon_backpack.png` | *Nhiều cấp độ* | Ba lô (Icon danh mục) | Backpacks | 256×256 | 76.2 KB | PNG 32-bit RGBA | `public/assets/icons/ui_icon_backpack.png` | `SHARED_ASSET` |

### Đánh giá chất lượng các asset hiện có:
- Cả 4 ảnh đều có kích thước chuẩn **256×256 pixels**.
- Định dạng **PNG 32-bit (RGBA)** với kênh Alpha trong suốt thực sự, viền cắt sạch đẹp, không dính nền checkerboard giả lập.
- Phong cách đồ họa nhất quán: 3D item illustration với độ đổ bóng chân thực và màu sắc tương thích hoàn hảo với giao diện nền tối của game.
- **Không cần tạo lại** 3 asset vật phẩm này nhằm tiết kiệm tài nguyên và bảo toàn tính ổn định.

---

## E. ĐỀ XUẤT QUY CHUẨN TẠO ẢNH BATCH 05

Dựa trên phân tích cách thức hiển thị giao diện DOM (`js/ui.js`, `css/style.css`) và PixiJS Canvas (`js/pixi-renderer.js`), quy chuẩn tạo ảnh cho toàn bộ Batch 05 được xác lập như sau:

### 1. Kích thước và Tỷ lệ khung hình
- **Độ phân giải chuẩn:** **256 × 256 pixels** (Khớp 100% với Batch 01 UI Icons).
- **Tỷ lệ khung hình:** **1:1 (Vuông)**.
- **Khả năng co giãn (Scaling):** Khi hiển thị inline trong danh sách kho đồ hoặc giao diện bảng chỉ số, ảnh co về `14×14` đến `24×24` pixel vẫn giữ rõ nét khối hình dạng (silhouette); khi phóng to trong modal xem chi tiết vật phẩm hoặc tooltip ở kích thước `64×64` hay `128×128`, chi tiết bề mặt vật liệu vẫn sắc sảo, không vỡ hạt.

### 2. Định dạng file và Kênh Alpha
- **Định dạng:** **PNG-24 / PNG-32 (RGBA)**.
- **Yêu cầu nền:** **Nền trong suốt 100% (True Alpha Transparency)**. Tuyệt đối không có viền nền màu solid (trắng, đen) và không bị hiện họa tiết ô bàn cờ giả lập (checkerboard artifacts).
- **Viền vật thể:** Anti-aliasing mượt mà, viền vật thể được xử lý sạch sẽ, không có quầng sáng trắng (white halo) hoặc răng cưa sắc nhọn.

### 3. Phong cách nghệ thuật (Art Direction)
- **Chủ đề trung tâm:** *Dark post-apocalyptic survival RPG* (Sinh tồn hậu tận thế u tối, tàn khốc, thực tế).
- **Thể loại thể hiện:** *Semi-realistic 3D item illustration* (Minh họa vật phẩm 3D bán tả thực với độ sắc nét cao).
- **Chất liệu bề mặt (Materials):** Thể hiện rõ tính chất vật lý của vật thể trong môi trường thảm họa:
  - Kim loại: Có ánh kim, trầy xước, vết mẻ, ốc vít hoen gỉ nhẹ.
  - Gỗ: Vân gỗ sần sùi, mép bào thô mộc, vết nứt nhỏ do khô hanh.
  - Vải dù / Nylon: Sợi dệt thô, đường chỉ may gia cố, quai đeo sờn rách nhẹ.
  - Thực phẩm / Y tế: Bao bì giấy bạc gập nếp, đồ hộp kim loại dập nổi, thuốc sát trùng đóng chai thủy tinh phủ bụi.
- **Bảng màu (Color Palette):** Tông màu trầm, lạnh, phong hóa (weathered), độ bão hòa (saturation) vừa phải, tránh màu sắc neon sặc sỡ hoạt hình.

### 4. Góc nhìn và Bố cục (Perspective & Composition)
- **Góc nhìn chính:**
  - *Isometric / 3/4 Perspective* (Nghiêng nhẹ 30° đến 45° từ góc trên nhìn xuống): Áp dụng cho phần lớn vật phẩm hình khối (hộp đạn, ba lô, đồ hộp, vũ khí ngắn, trang bị) để phô diễn đầy đủ chiều sâu không gian 3 chiều.
  - *Side-profile / Angled 45°*: Áp dụng cho các vũ khí dài (súng trường, kiếm, gậy, rìu dài, cung tên) đặt chéo góc khung hình từ góc trên bên phải xuống góc dưới bên trái hoặc ngược lại để tối ưu hóa diện tích khung hình vuông.
- **Bố cục & Căn giữa:**
  - Vật thể đơn lập được căn chính giữa khung hình (centered isolated object).
  - Kích thước vật thể chiếm khoảng **75% – 85%** diện tích canvas.
  - Chừa khoảng đệm an toàn (**padding margin**) từ **8% đến 12%** ở cả 4 cạnh để tránh bị cắt góc khi đặt trong các ô slot UI tròn/bo góc của game.

### 5. Ánh sáng và Đổ bóng (Lighting & Shading)
- **Nguồn sáng chính (Key Light):** Chiếu từ góc trên bên trái (**Cinematic Top-Left Lighting**, góc chiếu ~45°).
- **Ánh sáng viền (Rim Light):** Một dải viền sáng mỏng nhẹ ở mép đối diện để tách biệt vật thể khỏi nền tối của giao diện game.
- **Đổ bóng (Ambient Occlusion & Contact Shadow):** Bóng đổ tiếp xúc mềm mại ngay sát chân vật thể, không đổ bóng loang rộng tràn ra ngoài khung 256×256.

### 6. Quy tắc đặt tên file (Naming Convention)
Để dễ dàng đồng bộ hóa vào thư mục `public/assets/items/`, cấu trúc tên file chuẩn hóa như sau:
- Thư mục gốc: `public/assets/items/<nhóm_vật_phẩm>/`
- Định dạng tên: `item_<tiền_tố_nhóm>_<id_chuẩn_hóa>.png`
- Tiền tố phân nhóm:
  - Cận chiến: `item_melee_<id>.png`
  - Tầm xa: `item_ranged_<id>.png`
  - Đạn dược: `item_ammo_<slug>.png` *(Lưu ý: Chuyển đổi các ký tự đặc biệt như `×`, `.`, khoảng trắng thành slug an toàn, ví dụ `item_ammo_9x19mm.png`, `item_ammo_556x45mm_nato.png`)*
  - Thực phẩm: `item_food_<id>.png`
  - Trái cây: `item_fruit_<id>.png`
  - Đồ uống: `item_drink_<id>.png`
  - Y tế: `item_med_<id>.png`
  - Nông sản: `item_crop_<id>.png`
  - Hạt giống: `item_seed_<id>.png`
  - Cá: `item_fish_<id>.png`
  - Món hải sản: `item_meal_<id>.png`
  - Vật liệu: `item_mat_<id>.png`
  - Ba lô: `item_backpack_<id>.png`
  - Hàng hóa/Tiền tệ: `ui_icon_res_<id>.png` *(Giữ nguyên 3 file hiện hữu)*
  - Nhiệm vụ/Đặc biệt: `item_quest_<id>.png`

---

## F. KẾT LUẬN VÀ BƯỚC TIẾP THEO

Báo cáo kiểm kê xác nhận kết quả ground truth cuối cùng của Batch 05:
1. **Tổng số item definitions trong toàn bộ codebase:** **260 items** thuộc 15 danh mục riêng biệt.
2. **Tổng số ảnh đã có và đạt chuẩn:** **3 items** (`thuoc_la`, `xang_dau`, `royal_coin`) + **1 icon danh mục dùng chung** (`ui_icon_backpack.png`).
3. **Tổng số ảnh còn thiếu cần tạo mới:**
   - **257 items** nếu mỗi cấp bậc ba lô (23 cấp) được trang bị biểu tượng đồ họa riêng biệt nhằm tăng trải nghiệm tiến trình RPG.
   - **234 items** nếu 23 cấp ba lô tiếp tục sử dụng chung biểu tượng `ui_icon_backpack.png`.
4. **Trạng thái mã nguồn:** Toàn vẹn 100%. Không có bất kỳ dòng code gameplay, định nghĩa item hay logic UI nào bị chỉnh sửa trong quá trình kiểm kê này.
