# BÁO CÁO ĐỘ PHỦ ICON VẬT PHẨM (ITEM ICON COVERAGE REPORT)
## Dự án: Zombie World RPG – Batch 05 Phase 1

### 1. Thống kê tổng quan (Executive Summary)

| Chỉ số | Số lượng | Tỷ lệ (%) | Ý nghĩa |
|--------|----------|-----------|---------|
| **Tổng số vật phẩm toàn game** | **258** | **100.0%** | Toàn bộ 15 danh mục vật phẩm trong mã nguồn |
| **Vật phẩm được tích hợp icon SwisserAI** | **143** | **55.4%** | Có biểu tượng hình ảnh sắc nét, hiện đại |
| ├─ *EXACT Match (Khớp chuẩn 100%)* | 70 | 27.1% | Khớp chính xác hoàn hảo từng chi tiết thực tế |
| ├─ *EQUIVALENT Match (Tương đương quy chuẩn)* | 42 | 16.3% | Tương đồng về bao bì, công năng hoặc chủng loại |
| ├─ *APPROPRIATE Match (Hợp bối cảnh sinh tồn)* | 30 | 11.6% | Biểu tượng hải sản, hạt ăn liền, huân chương |
| └─ *GENERIC Match (Chung phân nhóm)* | 1 | 0.4% | Biểu thị trong nhóm hoa quả tươi |
| **Vật phẩm bảo toàn Fallback an toàn** | **115** | **44.6%** | Giữ nguyên `ui_icon_*` theo nguyên tắc bảo vệ bối cảnh |

---

### 2. Thống kê chi tiết theo danh mục (Category Coverage Breakdown)

| Danh mục vật phẩm | Tổng số | Tích hợp icon | Tỷ lệ phủ | EXACT | EQUIV | APPROP | GENERIC | Fallback |
|-------------------|---------|---------------|-----------|-------|-------|--------|---------|----------|
| **Thực phẩm (Foods)** | 19 | 19 | **100.0%** | 4 | 10 | 5 | 0 | 0 |
| **Hoa quả (Fruits)** | 11 | 11 | **100.0%** | 5 | 0 | 5 | 1 | 0 |
| **Đồ uống (Drinks)** | 12 | 12 | **100.0%** | 5 | 6 | 1 | 0 | 0 |
| **Y tế (Medicines)** | 15 | 14 | **93.3%** | 7 | 7 | 0 | 0 | 1 |
| **Thuốc lá (Cigarettes)** | 1 | 1 | **100.0%** | 1 | 0 | 0 | 0 | 0 |
| **Vật liệu xây dựng (Materials)** | 5 | 4 | **80.0%** | 2 | 2 | 0 | 0 | 1 |
| **Thủy hải sản câu bắt (Fish)** | 16 | 16 | **100.0%** | 0 | 0 | 16 | 0 | 0 |
| **Bữa ăn hải sản (Seafood Meals)** | 5 | 5 | **100.0%** | 5 | 0 | 0 | 0 | 0 |
| **Balo & Túi (Backpacks)** | 23 | 23 | **100.0%** | 22 | 1 | 0 | 0 | 0 |
| **Vũ khí cận chiến (Melee Weapons)** | 40 | 6 | **15.0%** | 5 | 1 | 0 | 0 | 34 |
| **Vũ khí tầm xa (Ranged Weapons)** | 45 | 0 | **0.0%** | 0 | 0 | 0 | 0 | 45 |
| **Đạn dược (Ammo)** | 13 | 12 | **92.3%** | 6 | 6 | 0 | 0 | 1 |
| **Nông sản trồng trọt (Crops)** | 15 | 0 | **0.0%** | 0 | 0 | 0 | 0 | 15 |
| **Hạt giống cây trồng (Seeds)** | 15 | 0 | **0.0%** | 0 | 0 | 0 | 0 | 15 |
| **Vật phẩm đặc biệt & Nhiệm vụ (Special Items)** | 23 | 20 | **87.0%** | 8 | 9 | 3 | 0 | 3 |
| **TỔNG CỘNG TOÀN BỘ** | **258** | **143** | **55.4%** | **70** | **42** | **30** | **1** | **115** |

---

### 3. Đánh giá chất lượng và An toàn hình ảnh
1. **100% Phủ kín các nhóm sinh tồn cơ bản:**
   - Nhóm Thực phẩm (Foods): 19/19 (100%)
   - Nhóm Hoa quả (Fruits): 11/11 (100%)
   - Nhóm Đồ uống (Drinks): 12/12 (100%)
   - Nhóm Balo & Túi đồ (Backpacks): 23/23 (100%)
   - Nhóm Bữa ăn hải sản (Seafood Meals): 5/5 (100%)
   - Nhóm Thuốc lá (Cigarettes): 1/1 (100%)
   - Nhóm Thủy hải sản (Fish): 16/16 (100%)
   - Nhóm Y tế (Medicines): 14/15 (93.3% - chỉ giữ fallback cho `zombie_gel` là chất sinh học đặc thù)
   - Nhóm Đạn dược (Ammo): 12/13 (92.3% - đạn súng 100% khớp, giữ fallback cho mũi tên `mui_ten`)
   - Nhóm Vật phẩm nhiệm vụ (Special Items): 20/23 (87.0% - thẻ căn cước, chìa khóa, huy hiệu, nhật ký)

2. **Lý do bảo toàn Fallback cho các nhóm còn lại:**
   - **Vũ khí tầm xa (Ranged Weapons - 45 súng & cung):** Bộ SwisserAI v1.0 chỉ cung cấp phụ kiện nâng cấp (scope, silencer, trigger...) chứ không chứa sprite súng nguyên cây. Do đó, việc duy trì `ui_icon_ranged_slot.png` đảm bảo tính chân thực, không gán phụ kiện làm vũ khí hoàn chỉnh.
   - **Vũ khí cận chiến (Melee Weapons - 34 vũ khí võ thuật/kiếm):** 6 vũ khí công cụ sinh tồn (`bua_sat_nho`, `bua_be_mot`, `can_xich_lon`, `cay_nay`, `xeng_sat`, `cao_cuoc`) đã được ánh xạ chính xác sang hammer, wrench, crowbar, shovel, pickaxe. Các loại đao kiếm katana hoặc nắm đấm tiếp tục sử dụng `ui_icon_melee_slot.png`.
   - **Nông sản & Hạt giống (Crops & Seeds - 30 items):** Giữ nguyên phân loại nông nghiệp dã chiến, tránh lạm dụng icon cỏ dại/chất kích thích.
