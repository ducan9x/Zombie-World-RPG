# 🧟 Hướng dẫn trò chơi sinh tồn ngày tận thế - Toàn bộ

> Hướng dẫn này được viết dựa trên cơ chế trò chơi thực tế và bao gồm tất cả các giai đoạn từ đầu đến cuối.
> Đối với người mới, khuyên đọc theo thứ tự "Khởi động nhanh", còn người chơi cũ có thể tra cứu trực tiếp các mục tương ứng.

***

## Mục lục

- [1. Tổng quan cơ chế cơ bản]
- [2. Khởi động nhanh: quy trình làm việc sinh tồn]
- [3. Hướng dẫn hoàn chỉnh: từ người mới đến cao thủ
  - [Giai đoạn 1: Sinh tồn đầu kỳ (ngày 1~5)]
  - [Giai đoạn 2: Giai đoạn tích lũy (ngày 5~15)]
  - [Giai đoạn 3: Chiêu mộ đồng minh (ngày 15~30)]
  - [Giai đoạn 4: Nâng cấp vũ khí (ngày 30+)]
  - [Giai đoạn 5: Thách thức cuối kỳ]
- [4. Giải thích toàn bộ bản đồ]
- [5. Danh sách toàn bộ NPC]
- [6. Bách khoa toàn thư vật phẩm]
- [7. Mẹo nâng cao]
- [8. Hệ thống thời tiết]
- [9. Xây dựng căn cứ]
- [10. Câu hỏi thường gặp]

***

## 1. Tổng quan cơ chế cơ bản

### Hệ thống thời gian

Một ngày = **8 lượt** (nửa đêm → sáng sớm → buổi sáng → trưa → buổi chiều → chiều tối → buổi tối → đêm khuya)

### Chỉ số cốt lõi

| Chỉ số | Mô tả | Phạt khi xuống 0 / đạt tối đa |
|:-|:-|:-
| ❤️ Sinh mệnh (HP) | Giới hạn tối đa 240 | Xuống 0 = Chết (kết thúc 1)
| 🍖 Độ no | -4 mỗi lượt | Xuống 0 rồi mỗi lượt trừ -10 HP
| 💧 Độ nước | -4 mỗi lượt | Xuống 0 rồi mỗi lượt trừ -10 HP
| 🦠 Nhiễm trùng | +2 khi bị zombie tấn công | Đạt 100 = Chết (kết thúc 1)
| 💪 Mệt mỏi | Tự động +20 mỗi 16 lượt không nghỉ | ≥50 hiển thị "mệt mỏi"; ≥100 không thể chiến đấu/ăn uống/ngủ
| 🧠 Lý trí | Giới hạn tối đa 100, tiêu hao khi khám phá | Quá thấp ảnh hưởng chiến đấu (50% tỷ lệ sát thương giảm nửa)

### Tham số chiến đấu

| Tham số | Giá trị |
|:-|:-
| Tỷ lệ chạy trốn thành công | 25%
| Tỷ lệ né tầm xa | 60% (tránh tấn công zombie trong chiến đấu tầm xa)
| Tỷ số chí mạng | ×2
| Hỗ trợ chiến đấu của Liu Ruyan | 30% tỷ lệ, gây 20 sát thương bổ sung
| Hồi máu sau chiến của Rutile | Tự động hồi +20 HP sau khi chiến thắng một trận
| Nhiễm trùng (khi bị đánh) | +2 / lần

### Ngủ

- Tiêu hao **3 lượt**
- Khôi phục sinh mệnh **+20~40**, lý trí **+20**
- Reduces Breakdown **-10~25**
### Người mới phải biết

- **Trận địa Đợi Sáng (không có quái vật) cho phép sinh tồn vĩnh viễn — ngủ, ăn, uống, làm việc ở đây**
- **Làm việc tại Trận địa Đợi Sáng chỉ tiêu hao 6 độ no + 6 độ nước + 3 mệt mỏi, rẻ hơn nhiều so với Lâu đài**
- **Nhà kho có thể hái trái cây mỗi 3 ngày**, vườn thí nghiệm có cây rau bỏ hoang
- **Leo tháp canh có thể giảm mệt mỏi**, tỷ lệ gặp quái vật chỉ 1%
- **Ngắm cảnh bến cổng sông cũng có thể giảm mệt mỏi**
- **Mưa axit không thể ra ngoài**, hãy lên kế hoạch trước

***

## 2. Khởi động nhanh: quy trình làm việc sinh tồn

> Thích hợp cho người chơi không muốn lấy rủi ro, muốn phát triển ổn định
> Độ khó: ★☆☆☆☆ (Cơ bản là không chết)

### Vòng lặp cốt lõi (Một ngày 8 lượt)

```
Làm việc (lượt 1) → Làm việc (lượt 2) → Làm việc (lượt 3) → Làm việc (lượt 4)
→ Đi-buổi-tối-hôm-nay (lượt 5) → Ăn uống (lượt 6) → Ngủ (lượt 7-8)
```

### Tính toán tiêu hao và thu nhập

| Mục tiêu | Tiêu hao | Cách bổ sung |
|:-|:-|:-
| Mệt mỏi +40 (làm việc) | Ngủ ngơi | Ngủ một lần giảm -10~25 mệt mỏi
| Độ nước -18 (làm việc) | Uống nước | Đi-buổi-tối-hôm-nay/trận địa tìm/Search kho
| Độ no -18 (làm việc) | Ăn | Nhà kho 3 ngày hái trái cây/Thức ăn trận địa

**Kết luận:** Vật tư kiếm được từ làm việc nhiều hơn tiêu hao. Như là không ra ngoài đánh, **bạn sẽ không bao giờ chết**.

### Bản đồ làm việc

1. Mỗi buổi sáng đầu tiên **đi-buổi-tối-hôm-nay** (đoán NPC tại Trận địa Đợi Sáng có cơ hội cho trái cây)
2. **Làm việc** (lưu ý: không thể làm việc vào ban đêm)
3. Sử dụng vật tư thu được **để ăn và uống**
4. **Ngủ** để bỏ qua đêm, khôi phục mệt mỏi và sinh mệnh
5. Mỗi 3 ngày đến **Nhà kho hái trái cây**
6. Tích lũy đủ sức trước khi khám phá

***

## 3. Complete Guide: From Recruit to Veteran

### Giai đoạn 1: Sinh tồn đầu kỳ (ngày 1~5 days)

**Mục tiêu:** Sinh tồn + nhận vũ khí cơ bản

#### Ngày 1

1. ✅ **Đi Trận địa Đợi Sáng để đối thoại với Cô V** để nhận nhiệm vụ gặp đầu (1 thực phẩm + 1 đồ uống)
2. ✅ Hoàn thành nhiệm vụ để nhận **tiểu đao** — vũ khí đầu tiên của bạn
3. ✅ Đi đến **nhà kho nông thôn bỏ hoang** (tỷ lệ gặp quái vật chỉ 5%) để tìm kiếm thực phẩm và vũ khí
4. ✅ Lưu ý sức khỏe, về nhà nếu không ổn

#### Ngày 2~5

- 🔄 Mỗi ngày vòng lặp: Làm việc → Ăn uống → Ngủ
- 🏪 Mỗi 3 ngày đến **Nhà kho hái trái cây** (nguồn thực phẩm ổn định)
- 🎒 Đi đến **bến cổng sông** (tỷ lệ gặp quái vật 12%) để tìm kiếm balo, mục tiêu là **balo 68 ô hoặc tốt hơn**
- ⚔️ Nhà kho có thể cho vũ khí cận chiến, hãy thay thế tiểu đao nếu tìm thấy **lát sắt / cọc đè**

#### Vòng lo vũ khí

```
Đấm đòn (18) → Tiểu đao (40) → Lát sắt (38)/Cọc đè (48)/Rìu cứu hỏa (55)
→ Chỉ hổ đao (67)/Đao ngang lớn (70) → Kiếm Tây (79)/Kiếm Long Thảo (88)/Cơ tenants dài (89)
→ Kiếm samurai (99)/Đao ngang Đường (100)/Máy cắt cây (105) → Kiếm Vũ Trụ (111)/Kiếm không sợ (115)
→ Công Ngư Sơ (128) / Kiếm bạc hoàng gia (120)
```

***

### Giai đoạn 2: Giai đoạn tích lũy (ngày 5~15)

**Mục tiêu:** Tích lũy vật tư, nâng cấp vũ khí, chuẩn bị cứu đồng minh

#### Bản đồ đề xuất khám phá

| Bản đồ | Tỷ lệ gặp | Vật phẩm chính |
|:-|:-:|:-
| Nhà kho nông thôn bỏ hoang | 2% | Thực phẩm + vũ khí
| Làng nông thôn núi sâu | 3% | Thực phẩm + trái cây + hạt giống
| Khu cắm trại bên sông | 5% | Balo + thuốc
| Khu dịch vụ quốc lộ | 10% | Thực phẩm + dân dược + nhiệm vụ Mã Tam
| Trường đại học | 12% | Thực phẩm + balo + nhiệm vụ Liu Ruyan |
| Trạm xăng ngoại thành | 15% | Dân dược + vũ khí + Vương Thiết Trụ |

#### Hành động chính

1. 🎒 **Tìm balo lớn**: Khu cắm trại tìm thi thể, tháp canh (rơi balo 68 ô siêu lớn)
2. ⚔️ **Đánh trả vũ khí**: Trạm xăng, khu công nghiệp — **Khu công nghiệp là nơi thiêng liêng để thu hồi vũ khí cận chiến!**
3. 💊 **Tích lũy thuốc**: Hãy tích lũy **thuốc kháng nhiễm** và **dây bó máu** (cần nhiều cho các nhiệm vụ sau)
4. 🚬 **Tích lũy thuốc lá**: Thuốc lá là tiền tệ quý giá! Lili thu hồi vũ khí cận thế đổi thuốc lá, thương nhân chợ đen dùng thuốc lá để mua mọi thứ
5. 🎣 **Đi đảo câu cá**: Sau khi có thân phân lâu đài / thẻ thông hành, hãy đi đảo câu cá, cá'ep/chuẩn dapat được đổi lấy vảy tại thùng kính rò điện của quán bar

#### Không biết đánh? Làm gì?

- Sức khỏe không ổn → **về nhà ngủ**, đừng cố gắng
- Mệt mỏi cao → **leo tháp canh** (giảm mệt mỏi) hoặc **ngắm cảnh bến cổng sông**
- Mang đủ thực phẩm và nước trước khi ra ngoài

***

### Giai đoạn 3: Chiêu mộ đồng minh (ngày 15~30)

**Mục tiêu:** Cứu Liu Ruyan + chiêu mộ Rutile trong vòng 30 ngày

>- ⚠️ **Liu Ruyan có thời hạn: cô ấy sẽ biến thành zombie hoàn toàn sau 30 ngày, không thể cứu nữa!
- 💡 After finding Liu Ruyan, survival notes will automatically add rescue countdown reminder

#### Điều kiện tiên quyết: Nhận vũ khí 60+ độ sát thương

- Đi đến **nhà kho nông thôn / trạm xăng / khu công nghiệp** để đánh trả vũ khí
- Hoặc làm nhiệm vụ của Cô V để nhận vũ khí tốt

#### Cứu Liu Ruyan (Có thời hạn!)

```
Trận địa thương mại giữa thành phố (tỷ lệ gặp 35%)
    → Tìm người phụ nữ nửa nhiễm (Liu Ruyan)
    → Cần 3 huyết thanh kháng nhiễm để cứu cô ấy
    → Cứu thành công → kích hoạt cốt truyện dài → mang về nhà → nhận đồng minh thứ nhất
```

**Nhận huyết thanh:**

| Phương thức | Mô tả |
|:-|:-
| 🏥 Bệnh viện ngoại thành (tỷ lệ gặp 50%) | 40% xác suất rơi thuốc, hãy nhanh tay làm
| 🛒 Thương nhân chợ đen | Làm mới ngẫu nhiên, thỉnh thoảng có huyết thanh
| 💊 Tìm kiếm bản đồ trung cấp / cao | Trạm cảnh sát, viện nghiên cứu, v.v. sẽ rơi

**Mẹo khám phá bệnh viện:**
- Đừng tham lam, đánh một vòng rồi về nhà ngủ, thức dậy quay lại
- Mang đủ thực phẩm và nước
- Mang vũ khí 60+ sát thương, nếu không đánh không qua zombie quân cảnh (HP 120 / 36 sát thương)

#### Liu Ruyan Task Line (Unlocked after Rescue)

Sau khi cứu Liu Ruyan, hãy đi đến **trường đại học → một phòng học cũ để bắt đầu chuỗi nhiệm vụ liên kết Liu Ruyan, tổng cộng 4 nhiệm vụ, cuối cùng có thể kích hoạt **kết thúc 12 "Bỏ chạy cùng". Xem [nhiệm vụ liên kết trường đại học Liu Ruyan chi tiết].

#### Cứu Rutile (Không thời hạn)

```
Trận địa bệnh viện ngoại thành (tỷ lệ gặp 50%)
    → Tìm y tá zombie tỉnh trí (Rutile)
    → Cho ăn thực phẩm đóng hộp (đào vàng/đậu/bò/cá mòi/cá ngừ/cá thu/cá nuc)
    → Hảo cảm đạt 150 → mang về nhà → nhận đồng minh thứ hai
```

**Mẹo:** Thực phẩm đóng hộp có thể thu hoạch ở nhà kho, siêu thị, nông thôn. Mỗi lần cho ăn +2~3 hảo cảm, khoảng 50~75 hộp cần thiết.

#### Các vai trò đồng minh

| Đồng minh | Điều kiện nhận | Sản phẩm hàng ngày / Hiệu lực chiến đấu |
|:-:|:-|:-
| 🌸 Liu Ruyan | Cứu trong vòng 30 ngày | Mỗi ngày 2 vật phẩm ngẫu nhiên (thực phẩm / đồ uống / trái cây / dân dược)
| 🏥 Rutile | Hảo cảm 150 (không thời hạn) | Mỗi ngày 1 thuốc (băng dính ~ Epinephrine)
| ⚔️ Liu Ruyan (chiến đấu) | Đã chiêu mộ | 30% suất hỗ trợ tấn công trong chiến đấu, gây 20 sát thương
| 💉 Rutile (sau chiến đấu) | Đã chiêu mộ | Tự động hồi +20 HP sau khi chiến thắng

***

### Giai đoạn 4: Nâng cấp vũ khí (ngày 30+)

**Mục tiêu:** Lấy vũ khí khuyến khích, thách thức bản đồ khó

#### Ưu tiên: Làm nhiệm vụ của Cô V

| Nhiệm vụ | Yêu cầu hảo cảm | Vật phẩm cần | Phần thưởng | Mức độ khuyến khích |
|:-:|:-:|:-|:-|:-:
| v1 Gặp đầu | 0 | 1 thực phẩm + 1 đồ uống | **Tiểu đao** | ⭐⭐⭐
| v2 Huấn luyện cầm máu | 30 | **Dây bó máu ×5** | **Chỉ hổ đao (66 sát thương / 12% liên kết)** | ⭐⭐⭐
| v3 Nhiệm vụ huyết thanh | 60 | **Huyết thanh kháng nhiễm ×8** | **Kiếm Long Thảo (88 sát thương / 12% liên kết)** | ⭐⭐⭐⭐⭐
| v4 Thử thách khó | 90 | Hộp y tế chiến địa ×8 | **P226 + 9mm ×50** | ⭐⭐⭐
| v5 Vật tư cấp cứu | 120 | Gói cấp cứu y tế ×6 + huyết thanh ×6 | **UZI + 9mm ×50** | ⭐⭐⭐⭐
| v6 Thử thách cuối cùng | 150 | Tất cả 15 loại thuốc ×2 mỗi loại | **M4A1 + 5.56×45mm NATO ×50** | ⭐⭐⭐⭐⭐

**Lưu ý:** v3 (Kiếm Long Thảo) là vũ khí cận chiến tuyệt vời của giai đoạn hoàn thành, 88 sát thương + 12% tỷ lệ liên kết, rất khuyên nên làm trước!

#### Nâng cấp tình cảm nhanh

- Trò chuyện 4 lần mỗi ngày, +1 hảo cảm mỗi lần
- Tặng quà: Thực phẩm / đồ uống +3, thuốc +5, thuốc lá +2
- Lili đặc biệt: Thực phẩm +6, thuốc +10

#### Cách thu thập thuốc lá

| Phương pháp | Sản phẩm |
|:-|:-
| Lili thu hồi vũ khí cận chiến | 1 thuốc lá / vũ khí
| Lili thu hồi vũ khí tầm xa | 2 thuốc lá / vũ khí
| Tìm kiếm bản đồ trung cấp / cao | Một ít
| Đánh tên thương nhân chợ đen | 2~5 thuốc lá
| Làm việc tại thành bảo | 1 thuốc lá / lần (tiêu hao lớn)
| Thăm hỏi thành bảo (quý tộc cấp 5+) | 2 thuốc lá / ngày
| Thưởng hảo cảm 150 của Lili | 20 thuốc lá (một lần)

#### Cách sử dụng thuốc lá quan trọng

| Sử dụng | Tiêu hao | Hiệu lực |
|:-|:-:|:-
| Thương nhân chợ đen mua P226 | 10~15 thuốc lá | Pistol đầu tiên
| Thương nhân chợ đen mua GP100 | 10~15 thuốc lá | Pistol RetrievedStrong
| Thương nhân chợ đen mua đạn | 1 thuốc lá / 3~6 viên | Nguồn dân dược quan trọng
| Thương nhân chợ đen mua hạt giống | 1 thuốc lá / gói | Trồng trọt căn cứ
| **Lili làm sạch nhiễm** | 10 thuốc lá | Giảm nhiễm -50
| **Lili sửa súng** | 10 thuốc lá | Tăng độ nguyên vẹn vũ khí tầm xa +50%
| **Lili sửa cung nỏ** | 5 thuốc lá | Tăng độ nguyên vẹn cung nỏ +50%
| **Làm thẻ quý tộc** | 25 thuốc lá | Vào được nội thành thành bảo

***

### Giai đoạn 5: Thách thức cuối kỳ

#### Danh sách BOSS

| Boss | Vị trí | HP | Sát thương | Lúc tránh | Đặc biệt | Phần thưởng |
|:-:|:-:|:-:|:-:|:-:|:-:|:-
| 🔫 Ma Tam | Trạm dịch vụ quốc lộ | 300 | 40~60 | 40% | Tầm xa | AK47 + 7.62×39mm ×30
| 😈 Hắc Ảnh | Siêu thị trung tâm | 400 | 50~80 | 50% | Tầm xa | GP100 + .357 Magnum ×20
| 👑 Vua Zombie | Tổ zombie | 420 | 115 | 25% | — | Huy hiệu im lặng
| 💰 Ngân hàng Hàng Trưởng | Lâu đài Tận thế | 350 | 50~80 | 30% | — | Kiếm Thương Phòng + nợ tiền gommé
| 🪖 Thủ lĩnh Trận địa | Trận địa Đợi Sáng | 400 | 110 | 25% | — | (Nhiệm vụ ám sát)
| 🤖 Cỗ Rối Khổng Lồ | Cơ sở Vũ Trụ | 380 | 105 | 20% | — | (Tiền đề nhiệm vụ tên lửa)
| 🏈 Zombie Bóng Bầu Đục | Trường Đại học | 250 | 30~55 | 15% | — | Nhiệm vụ Liu Ruyan 2
| 🏊 Zombie Lặn | Đảo Nhỏ | 200 | 35~55 | 15% | Tầm xa | Nhiệm vụ Yumo 3
| 🐙 Hải Thú Khổng Lồ | Cảng Bến Sông | 600 | 80 | 8% | — | Kết thúc Người Cá Nhân
| 👑 Vua Lâu Đài | Lâu đài Tận thế | 450 | 100 | 20% | — | Nhiệm vụ liên kết Lão Ma
| 🪖 Lão Bin Lão Trạm | Trạm Kiểm Tra Quân Sự | 350 | 70~90 | 30% | Tầm xa | Nhiệm vụ liên kết Lão Ma
| 🔬 Tiến sĩ Trần | Viện Nghiên Cứu Sinh Học | 300 | 50~70 | 35% | Tầm xa | Nhiệm vụ liên kết Lão Ma

#### Mẹo chiến đấu BOSS

**Ma Tam (Trạm dịch vụ quốc lộ):**
- Mang vũ khí cận chiến 70+ hoặc súng pistola
- Mang đủ thuốc, hắn tấn công tầm xa đầu tiên có thể làm bạn bị thương nặng
- Đánh thắng được AK47, trực tiếp đưa bạn vào thời kỳ vũ khí súng

**Hắc Ảnh (Siêu thị trung tâm):**
- Khó hơn Ma Tam! Khuyên mang Kiếm Long Thảo hoặc súng
- Tỷ lệ né tránh 50%, tỉ lệ trúng của súng tầm xa rất thấp
- Đánh thắng được GP100 là khẩu súng cỡ nòng lớn mạnh

**Vua Zombie (Tổ zombie):**
- **Quái vật zombie mạnh nhất trong game, không ai sánh được**
- Sát thương 115, hai đòn có thể làm máu bạn đầy cùng xuống đất
- Khuyên mang hộp y tế chiến địa đầy đủ + vũ khí cận chiến độ bền cao + vũ khí tầm xa
- Vũ khí khuyên dùng: M4A1 + đủ đạn 5.56mm + Kiếm Vũ Trụ / Máy cắt cây
- Đánh thắng được Huy hiệu Im lặng, là một trong những điều kiện chốt lệnh để kích hoạt kết thúc "Trở thành thế lực mới"

**Ngân hàng Hàng Trưởng (Lâu đài Tận thế):**
- Chỉ kích hoạt chiến đấu nếu nợ vay quá hạn không trả
- HP 350 / né tránh 30%, độ khó trung bình
- Sau khi đánh thắng, nợ nần bị xóa + nhận được Kiếm Thương Phòng (sát thương 99 / epic)

**Các BOSS nhiệm vụ Lão Ma (Vua Lâu Đài/Lão Zhao/Tiến sĩ Trần):**
- Vị trí: Nội thành Lâu đài / Trạm Kiểm Tra Quân Sự / Viện Nghiên Cứu Sinh Học
- Cần đánh theo thứ tự, là bước 4/5/6 của nhiệm vụ ám sát Lão Ma
- Sau khi hoàn thành, đi đến đường hầm métro gặp Lão Ma để kích hoạt kết thúc 14

**Hải Thú Khổng Lồ (Cảng Bến Sông):**
- Quái vật BOSS mạnh nhất trong trò chơi, HP 600, sát thương 80
- Chỉ được chiến đấu tầm xa! Cần trang bị Deagle (nhiệm vụ Lão Ma 3)
- Đánh thắng kích hoạt kết thúc 13 "Truyền thuyết cá nhân nhân"

#### Nhiệm vụ liên kết Tiến sĩ Chen: giao dịch cuối cùng tại viện nghiên cứu

```
Viện nghiên cứu sinh học (tỷ lệ gặp 58%)
    → Nộp 30 huyết thanh kháng nhiễm
    → Nhận M700 sniper rifle (sát thương 120) + 7.62×51mm ×30
```

**M700 là một trong những khẩu súng tầm xa mạnh nhất có thể thu hoạch trong game**, chỉ kém hơn AWM (200 sát thương).

**Điều kiện tiên quyết chuỗi nhiệm vụ tên lửa của Tiến sĩ Chen:** Cần trước hết hoàn thành thương đổi huyết thanh của Tiến sĩ Chen + đánh bại Cỗ Rối Khổng Lồ tại cơ sở vũ trụ. Lưu ý: nếu điều kiện tiên quyết chưa thỏa mãn, trò chơi sẽ hiển thị các điều kiện còn thiếu trong đối thoại của Tiến sĩ Chen.

#### Kết thúc trò chơi

Xem phần [Hệ thống kết thúc] phía dưới. Sau khi hoàn thành tất cả nhiệm vụ chính, có thể kích hoạt kết thúc "Trở thành thế lực mới", nhận vũ khí cận chiến cực đại **Kiếm không sợ (115 sát thương / 20% liên kết / huyền thoại).

***

### 4. Bản đồ toàn bộ

### 🟢 Bản đồ an toàn (tỷ lệ gặp 0%)

| Bản đồ | Tỷ lệ gặp | Đặc điểm |
|:-|:-:|:-
| 🏰 Lâu đài Tận thế | 0% | **Bản đồ xã hội**, guards / ngân hàng / danh tính / làm việc / nội thành Lâu đài
| 🌅 Trận địa Đợi Sáng | 0% | **Toàn bộ an toàn**, tất cả NPC Trận địa đều ở đây
| 🏝️ Đảo Nhỏ | 0% | Bản đồ ẩn, cần game thuyền để đến, ngân hàng đảo + NPC

### 🟡 Bản đồ nguy hiểm thấp (tỷ lệ gặp ≤12%)

| Bản đồ | Tỷ lệ gặp | Đặc điểm |
|:-|:-:|:-
| 🗼 Tháp Canh Đỉnh Núi Hoang Vắng | 1% | Leo tháp giảm mệt mỏi, rơi balo 56+ ô! Phải khám phá mỗi lần
| 🏚️ Nhà Kho Nông Thôn Hoang Hoắc | 2% | **Vùng an toàn cho người mới**, hái trái cây mỗi 3 ngày, rơi vũ khí cận chiến, hạt giống mốc
| 🏡 Làng Nông Thôn Njema Núi | 3% | Hang động rơi dân dược, vườn rau bỏ hoang rơi hạt giống / lá diệp
| ⛺ Khu Cắm Trại Bên Sông | 5% | Tìm thi thể mỗi 3 ngày, rơi balo / thuốc
| 🍖 Khu Dịch Vụ Quốc Lộ | 10% | Thực phẩm + dân dược + nhiệm vụ Mã Tam
| 🏫 Trường Đại học | 12% | Thực phẩm + balo + nhiệm vụ liên kết Liu Ruyan

### 🟠 Bản đồ nguy hiểm trung cấp (tỷ lệ gặp 15%~30%)

| Bản đồ | Tỷ lệ gặp | Vũ khí đề xuất | Vật phẩm chính |
|:-|:-:|:-|:-
| ⛽ Trạm Xăng Ngoại Thành | 15% | Tiểu đao+ | Dân dược, vũ khí, Vương Thiết Trụ đổi xăng
| 🏬 Siêu Thị Trung Tâm | 20% | Cọc đè+ | **Nhiệm vụ Liu Ruyan**, thùng kính rò điện (cá→vảy)
| 🏘️ Khu Dân Cư Cũ | 22% | Cọc đè+ | Thuốc, vũ khí, Lão Wolf đổi thuốc, kho vật tư
| 🏭 Khu Công Nghiệp / Nhà Xưởng | 24% | Cọc đè+ | **Vũ khí cận chiến sacred land**, xưởng khám phá
| ⚓ Cảng Bến Sông | 26% | Cọc đè+ | Dân dược, vũ khí, ngắm cảnh giảm mệt mỏi, tàu cứu cánh của Lâu đài
| 🛒 Siêu Thị Kho Tối Đại Liên Khu | 28% | Cọc đè+ | **Boss Hắc Ảnh**, vật liệu xây dựng, hàng cấm ngày tận thế
| 🏚️ Nhà Kho Nhà Máy Hoang Hoắc | 30% | Rìu cứu hỏa+ | Vũ khí tầm xa, vật liệu xây dựng, dân dược, sự kiện Lão Ma

### 🟠 Bản đồ nguy hiểm cao (tỷ lệ gặp 35%+)

| Bản đồ | Tỷ lệ gặp | Vũ khí đề xuất | Vật phẩm chính |
|:-|:-:|:-|:-
| 🏥 Bệnh Viện Ngoại Thành | 35% | **Sát thương 60+ | **Nơi thu huyết thanh thượng đẳng**, 60% thuốc, Rutile
| 👮 Trạm Cảnh Sát Ngoại Thành | 40% | Sát thương 70+ | **Nơi thu súng thượng đẳng**, tra cứu phòng chứng vật / hồ sơ
| 🪖 Trạm Kiểm Tra Quân Sự | 45% | Sát thương 70+ | **Nơi thu dân dược thượng đẳng**, Lão Zhao 50% dân dược / 50% súng tự nổ -40 HP
| 🚇 Đường Hầm Địa Ngục | 55% | Sát thương 80+ | Dân dược tầm xa, dân dược, Lão Ma cuối game
| 🔬 Viện Nghiên Cứu Sinh Học | 58% | Sát thương 80+ | **Nhiệm vụ Tiến sĩ Chen M700**, thuốc, giếng khai thác năng lượng
| 👑 Tổ Zombie | 60% | **Vũ khí tối thượng** | **Vua Zombie (Boss cuối cùng)**
| 🚀 Cơ Sở Vũ Trụ Tuyệt Mật | **65%** | **Vũ khí tối thượng** | **Tỷ lệ gặp cao nhất**, trung tâm phóng (tên lửa), tàu không gian 5% rơi AWM (chỉ 1 lần)

### Danh sách sự kiện bản đồ toàn bộ

| Bản đồ | Sự kiện | Điều kiện / thời gian chờ | Hiệu lực / sản phẩm |
|:-|:-|:-|:-
| 🗼 Tháp canh | Leo tháp | Không có | Giảm mệt mỏi -10
| 🗼 Watchtower | Wreath tombstone | Farming master badge + equip shovel | Get Miaomiao diary
| 🏚️ Granary | Pick fruits | 3-day cooldown | Random fruit
| 🏚️ Granary | Moldy seeds | Farming master badge, once daily | 1~3 random seeds
| 🏡 Farmhouse | Explore cave | None | Stable ammo drops
| 🏡 Farmhouse | Abandoned vegetable field | Farming master badge, once daily | 2 leeks
| ⛺ Campsite | Search corpse | 3-day cooldown | Backpack / medicine
| ⛺ Campsite | Stinking tent | Dawn captain badge | Get voice recorder
| 🍖 Service area | Service area restaurant | None | Eat miscellaneous meat (hunger+5/hydration+5/breakdown+5/infection+10, ⚠+10 infection each time), unlock Ma San task line
| 🍖 Service area | Ma San (Boss) | Complete restaurant task line | AK47 + 7.62×39mm ×30
| ⛽ Gas station | Wang Tiezhu exchange | Tool weapons | Tool weapons → 5 ammo + 1 food + 1 drink
| ⛽ Gas station | Exchange gas | 5 cigarettes | 1 gas
| 🏫 University campus | Search takeaway cabinet | None | Random food (may be expired -10 HP)
| 🏫 University campus | An old classroom | Liu Ruyan rescued | Liu Ruyan task line
| 🏬 Mall | Liu Ruyan | 3 anti-infection serums (30-day limit) | Rescue companion
| 🏬 Mall | Electric glass tank | Put fish | Epic fish → Lightning scale / Legendary fish → Thunder scale
| 🏘️ Residential community | Lao Wolf | 3 food | 3 food → random medicine
| 🏘️ Residential community | Property warehouse | Have scales | Feed scales to mermaid (+affinity)
| 🏭 Industrial park | Explore interior | None | Melee weapons / building materials
| 🏭 Industrial park | Check workshop | 60% chance scared -10 sanity | Zombie gel
| ⚓ Port | View river scenery | None | Breakdown -10
| ⚓ Port | Castle yacht | Castle identity + 1 gas, consumes 1 day | Go to small island
| 🛒 Warehouse mall | Shadow (Boss) | — | GP100 + .357 Magnum ×20
| 🛒 Warehouse mall | Doomsday contraband | None | Random contraband items
| 🏚️ Factory warehouse | Old Ma | Initial trade: 10 building materials → ranged weapon | Later unlock Old Ma task line
| 🏥 Hospital | Luluwei | Feed canned food | Affinity → recruit after 150
| 👮 Police station | Search evidence room | None | Guns / ammo
| 👮 Police station | Search file cabinet | 30% chance | Get crime data (Old Ma task 1)
| 🪖 Military checkpoint | Lao Zhao | None | 50% get ammo / 50% misfire -40 HP
| 🚇 Subway tunnel | Go deep into tunnel | None | Ranged weapons / ammo / Old Ma ending
| 🔬 Research institute | Dr. Chen | 30 anti-infection serums | M700 + 7.62×51mm ×30
| 🔬 Research institute | Energy mining well | Once daily | 1 pure energy (shows current progress X/15)
| 🚀 Space base | Launch center | Rocket task line | Trigger ending
| 🚀 Space base | Space capsule | 5% chance, only once | AWM
| 👑 Zombie nest | Zombie King (Boss) | — | Silence badge

### Island System

**Entrance:** Riverside port terminal → Castle yacht (need Castle identity or pass + 1 gas, consumes 1 day)

Island is game's **core economic zone**, contains many functional facilities.

**Basic functions:**

| Function | Effect
|:-|:-
| 🧭 Explore | Random items (may encounter robbers)
| 🛏️ Rest on island | +30 HP / -30 breakdown / +25 sanity / consumes 4 days
| 🎣 Fishing area | 4 times daily, 16 fish types, epic/legendary fish can exchange for scales
| 🧹 Clean up landing zombies | Yu Mo task 3, kill diving zombie (HP 200 / 35~55 damage)
| 🚢 Leave | Return to port terminal, consumes 1 day

**Island economic facilities:**

| Facility | Function | Description
|:-|:-|:-
| 🏦 Island bank | Borrow 10~100 royal coins (10 tiers) | 10% interest, 10-day term, overdue adds interest
| 🍺 King Karen's bar | 16 alcohol types (15~100 coins) | Reduces breakdown + replenishes hunger/hydration, midnight/night/late night open
| 🛍️ Queen Elina's street | Weapons/ammo/food/medicine shop | Forenoon~afternoon open, supports ammo recycling
| 📈 Lucius investment firm | 9 investment directions | Fixed 5-day cycle, profit and loss
| 🕵️ Royal black market | Limited refresh tech weapons | 5-day refresh, expensive price
| 📡 Intelligence center | 50 royal coins/24h immune to robbers | Must-have when holding many royal coins
| 🎁 Welfare subsidy | Noble gets royal coins weekly | 5-day cooldown, higher rank gets more (1~6 coins)
| ⛽ Kingdom oil tanker | Gas trade | 20 royal coins buy 1 gas / 1 gas sell 5 royal coins

#### Duke Yu Mo Task Line

**Prerequisite:** Talk to Yu Mo after arriving on island

| Task | Requirement | Reward
|:-:|:-|:-
| 1 Zombie gel collection | Zombie gel ×10 | Royal coins ×10
| 2 Gel big collection | Zombie gel ×30 | Royal coins ×20
| 3 Clear landing zombies | Kill 10 diving zombies | Royal coins ×30
| 4 Building materials | 5 types of building materials ×5 each | Royal coins ×40
| 5 Duke's wine | High-proof liquor ×1 | Royal coins ×50

> 💡 Zombie gel obtained at industrial park "check workshop" (50% drop), diving zombie triggered at island "clean up landing zombies" option.

***

## 5. Complete NPC List

### Dawn Outpost (Safe Zone)

| NPC | Affinity | Core Function
|:-:|:-:|:-
| **Miss V** | 0~150 | **Main task line** (small dagger → brass knuckles knife → dragon sword → P226 → UZI → M4A1)
| **Su Xiaohan** | 0~150 | **Item exchange line** (food / drink exchange medicine)
| **Lilith** | 0~150 | **Functional services** (recycle weapons · repair guns · clear infection · repair crossbows)
| **Mu Miaomiao** | 0~150 | **Farming system** (seed exchange + hidden task line)
| **Outpost Leader** | 0~150 | **Faction system** (join Dawn Outpost → task line → Dawn Captain Badge)

#### Miss V Task Line

| Task | Affinity Requirement | Submit Items | Reward
|:-:|:-:|:-|:-
| v1 First meeting | 0 | 1 food + 1 drink | Small dagger
| v2 Tourniquet training | 30 | Tourniquet ×5 | Brass knuckles knife (66 damage / 12% combo)
| v3 Serum task | 60 | Anti-infection serum ×8 | Dragon sword (88 damage / 12% combo)
| v4 Hard trial | 90 | Field medical kit ×8 | P226 + 9mm ×50
| v5 First aid supplies | 120 | Medical first aid kit ×6 + serum ×6 | UZI + 9mm ×50
| v6 Ultimate trial | 150 | All 15 medicines ×2 each | M4A1 + 5.56×45mm NATO ×50

#### Su Xiaohan Task Line

| Task | Affinity Requirement | Submit Items | Reward
|:-:|:-:|:-|:-
| xh0 First arrival | 0 | Any 1 drink | Bandage ×3
| xh1 Milk reserve | 30 | Pure milk ×10 | Surgery kit ×3
| xh2 Drink big purchase | 60 | Yogurt drink ×15 | Antibiotic ×5
| xh3 Can collection | 90 | All can types ×1 each | Anti-infection serum ×3
| xh4 Fruit party | 120 | All fruit types ×1 each | Medical first aid kit ×3
| xh5 Big purchase | 150 | All drinks + all foods ×1 each | Field medical kit ×3

#### Lilith Service Price List

| Service | Price | Effect
|:-|:-:|:-
| 🔄 Recycle melee weapon | Any melee ×1 | Get 1 random cigarette
| 🔄 Recycle ranged weapon | Any ranged ×1 | Get 2 random cigarettes
| 🔧 Repair gun | 10 cigarettes | Gun integrity +50%
| 🏹 Repair crossbow | 5 cigarettes | Crossbow integrity +50%
| 💉 Clear infection | 10 cigarettes | Infection -50

**Lilith 150 affinity reward:** Random cigarettes ×20 + 9×19mm ×50

#### Mu Miaomiao

**Prerequisite:** Unlock related interactions after getting Farming Master Badge.

**Seed exchange:** 1 cigarette → 3 random seeds

**Hidden task line "Buried past":** Need to hold Miaomiao diary (mountain abandoned watchtower → wreath tombstone → dig to get)

| Task | Submit Items | Reward
|:-:|:-|:-
| 1 Let's go picnic together | 3 carrots + 3 potatoes | Plot progress
| 2 Cross-time miss | 5 high-proof liquor + 10 rye | Plot progress
| 3 Expand test field | 15 crop types ×1 each | **Prairie bow + arrows ×30**

**Prairie Bow** (52 damage / 52% crit / myth) is plot-exclusive weapon, can't get from drop pool.

After completing task 3, go home, automatically achieve **ending 9 "I'm not the farming god"** (can continue game).

#### Outpost Leader

| Function | Affinity Change | Limit
|:-|:-:|:-:
| 💬 Talk | +1 | Once daily
| 🎁 Gift | +1 | Once daily
| 🤝 Join Outpost | — | Get **Dawn Badge**
| 🚪 Leave Outpost | — | Take back Dawn Badge

**Outpost Leader Task Line (Voice Recorder Line):**

| Task | Submit Items | Reward
|:-:|:-|:-
| 1 | Voice recorder (campsite stinking tent, need Dawn Captain Badge) | Plot progress
| 2 | — | Plot progress
| 3 | — | **Dawn Captain Badge**

**When holding noble identity card**, Outpost Leader will directly refuse interaction.

### Doomsday Castle NPCs

| NPC | Location | Function
|:-:|:-|:-
| 🛡️ Castle Guard | Castle gate | Talk · Enter Castle (need identity card or 1 cigarette bribe · Give tip
| 🏦 Bank Manager | Castle bank | Borrow (1~10 cigarettes, 10-day term) · Extend grace period · Battle (HP 350 / 50~80 damage / 30% dodge)
| 🏛️ Identity Officer | Identity office | Apply for noble identity (25 cigarettes) · Cancel identity
| 👑 Castle King | Castle interior | King task line king_1~5 (need noble identity + 25 cigarettes)
| 👸 Castle Queen | Castle interior | 4 tasks (need love token) + royal trade

#### King Task Line

| Task | Condition | Reward
|:-:|:-|:-
| king_1 | Noble identity + 25 cigarettes | Rank promotion
| king_2 | Noble identity + 25 cigarettes | Rank promotion
| king_3 | Noble identity + 25 cigarettes | Rank promotion + infection treatment 10%
| king_4 | Noble identity + 25 cigarettes | Rank promotion + infection treatment 30%
| king_5 | Noble identity + 25 cigarettes | Rank promotion + infection treatment 50% + daily audience 2 cigarettes

#### Queen Task Line

**Prerequisite:** Hold love token (Outpost Leader task 3 reward)

| Task | Submit Items | Reward
|:-:|:-|:-
| 1 Relieve sorrow | 5 assorted beer + 5 power beer | Royal coins ×10
| 2 King's recent situation | 10 wolfberries | Royal coins ×20
| 3 Sword practice | 3 rapiers | Royal coins ×30
| 4 Wedding anniversary | 1 M700 | Royal coins ×40 + **Castle Pass**

After completing task 4, unlock **royal trade** permanent option, go home automatically achieve **ending 10 "Love and hate"** (can continue game).

#### Royal Trade

**Exchange royal coins:**

| Item | Exchange Rate
|:-|:-:
| Wolfberry | 2 → 1 royal coin
| Rapier | 1 → 5 royal coins

**Queen's grocery shop:**

| Product | Price (Royal Coins)
|:-|:-:
| Military ration can | 2
| Electrolyte water | 2
| Anti-infection serum | 3
| Medical first aid kit | 5
| Field medical kit | 10
| **Royal short gun** (99 damage / myth) | 100
| **Royal silver sword** (120 damage / 120 durability / 20% combo / myth) | 100

Royal short gun and royal silver sword are exclusive weapons, only available via royal trade, can't get from drop pool.

### Map NPCs

| NPC | Location | Role
|:-:|:-:|:-
| 🛠️ Wang Tiezhu | Gas station | Tool weapons → 5 ammo + 1 food + 1 drink
| 👨‍🔧 Wang Tiezhu (Gas) | Gas station | 5 cigarettes → 1 gas
| 🐺 Lao Wolf | Residential community | 3 food → random medicine
| 🚧 Old Ma | Factory warehouse | 10 building materials → random ranged weapon
| 🪖 Lao Zhao | Military checkpoint | 50% get ammo / 50% misfire -40 HP
| 🔬 Dr. Chen | Research institute | 30 serums → M700 + 7.62×51mm ×30
| 🌸 Liu Ruyan | Mall | 3 serums rescue (30-day limit)
| 🏫 Liu Ruyan (Task line) | University campus | 4 tasks → ending 12
| 🏥 Luluwei | Hospital | Feed cans to 150 affinity recruit
| 🍖 Ma San | Service area | Restaurant task line (need eat miscellaneous meat first) → ending 11
| 🏝️ Gu Yue | Small island | Talk
| 🏝️ Lin Han | Small island | Talk
| 🏝️ Duke Yu Mo | Small island | Talk

#### Ma San Restaurant Task Line

**Prerequisite:** First eat "miscellaneous meat" at national highway service area restaurant (hunger+5 / hydration+5 / breakdown+5 / infection+10, ⚠+10 infection each time, game will show infection risk warning)

| Task | Requirement | Reward
|:-:|:-|:-
| 1 | 3 power beer | Plot progress
| 2 | 3 crops (only accepts crops, not cans) | Plot progress
| 3 | 10 cigarettes | Plot progress
| 4 Accept | None | **Ending 11: Become a meal** (endgame, ⚠ irreversible choice)
| 4 Reject | Fight Ma San | Kill Ma San (HP 300 / 40~60 damage / ranged / 40% dodge)

#### Liu Ruyan University Task Line

**Prerequisite:** Liu Ruyan rescued

| Task | Location | Requirement | Reward
|:-:|:-|:-|:-
| 1 Infirmary | University campus→old classroom | None | Universal injection ×1
| 2 Stadium | University campus→old classroom | Fight (football zombie HP 250 / 30~55 damage / 15% dodge) | Plot progress
| 3 Admin office | University campus→old classroom | Equip crowbar (crowbar can get from exploring) | Car key
| 4 Elope | University campus→old classroom | 10 gas | **Ending 12: Elope** (endgame)

### Random Encounter NPCs

| NPC | Chance | Interaction | Benefit
|:-:|:-:|:-|:-
| 🚶 Wanderer | 60% | Food / drink exchange ammo, or backstab to rob items | Trade or battle
| 💼 Black market merchant | 20% | **Cigarettes buy everything** | G17 / GP100 / USP9 / ammo / food / seeds
| 👨‍⚕️ Doomsday wandering doctor | 10% | 5 food heal 120 HP / 3 food -30 breakdown | Heal / psychological counseling
| 🔪 Scar / Tough guy | 10% | **Auto hostile**, fight on sight | Kill drops 2~4 items

#### Black Market Merchant Price List

| Product | Price
|:-|:-:
| G17 pistol | 10~15 cigarettes
| GP100 revolver | 10~15 cigarettes
| USP9 pistol | 10~15 cigarettes
| 🔥 Fire axe | 5~7 cigarettes
| 🚔 Baton | 3~5 cigarettes
| ⚾ Baseball bat | 2~3 cigarettes
| 🔫 Random ammo | 1 cigarette / 3~6 rounds (can choose quantity: 1/5/10/all cigarettes)
| 🍎 Random food / drink / fruit | 1 cigarette
| 🌱 Seed | 1 cigarette / pack

### Affinity System

#### Affinity Thresholds

| Affinity | Title
|:-:|:-:
| 0 | Stranger
| 10 | Acquaintance
| 30 | Friend
| 80 | Close friend
| 150 | Life and death friend

#### Affinity Acquisition Methods

| Method | Affinity Change | Limit
|:-|:-:|:-
| Daily talk | +1 / time | 4 times daily
| Gift (food / drink) | +3 | —
| Gift (medicine) | +5 | —
| Gift (cigarette) | +2 | —
| Lilith gift (food) | **+6** | —
| Lilith gift (medicine) | **+10** | —

### Identity Faction System

Game has two opposing factions:

| Faction | Identity Item | Acquisition Method
|:-:|:-:|:-
| 🏰 Doomsday Castle·Noble | Noble identity card | Doomsday Castle identity office · 25 cigarettes
| 🌅 Dawn Outpost | Dawn Badge | Outpost Leader · Choose "Join Outpost"

**Identity mutual exclusion rules:**

| Your Identity | Refused Action
|:-:|:-
| 🏰 Noble | ❌ Dawn Outpost NPCs refuse interaction
| 🌅 Dawn member | ❌ Castle bank loan → "Hostile faction doesn't lend"
| 🌅 Dawn member | ❌ Castle work → "Dawn spy get out"
| 🌅 Dawn member | ❌ Castle apply for identity → "Dawn person still wants to be noble?"
| ⚠ Dual identity | Auto clear noble identity card, keep Dawn Badge

**Important:** Castle Pass **does not** trigger faction exclusion, holding pass can still interact with both sides.

**Island Bank:** Holding Castle Pass or noble identity card can go to small island's island bank to borrow, 10 tiers (10~100 royal coins), 10% interest rate, 10-day repayment term, every 5 days overdue interest increases 10% (upper limit 100%). See [Island System] chapter for details.

**Recommendation:** Prioritize joining Dawn Outpost to get badge, because noble identity needs 25 cigarettes and will lose Dawn Outpost benefits. If want to enjoy Castle interior services, take noble route. Can't have both identities.

***

## 6. Item Encyclopedia

### Weapon Tier List

Game has **42 melee weapons** + **46 ranged weapons**.

#### Melee Weapons Top 10

| Rank | Weapon | Damage | Durability | Combo Rate | Rarity
|:-:|:-:|:-:|:-:|:-:|:-
| 1 | 999 Sword | **999** | 1 | 1% | legendary
| 2 | Sea Song Fish Fork | **128** | 150 | 22% | myth
| 3 | Royal Silver Sword | **120** | 120 | 20% | myth
| 4 | Fearless Blade | **115** | 100 | 20% | myth
| 5 | Universe Sword | **111** | 222 | 18% | legendary
| 6 | Brave Sword | **109** | 50 | 18% | legendary
| 7 | Chainsaw | **105** | 120 | 15% | epic
| 8 | Tanghengdao | **100** | 80 | 15% | epic
| 9 | Katana | **99** | 40 | 15% | epic
| 10 | Malay Sword | **95** | 70 | 15% | epic

> **Special melee:** Royal Silver Sword (120 damage / 120 durability / 20% combo / myth) — only available via royal trade
> **Imperial Sword:** 18 damage / 555 durability / 88% combo / legendary, special collectible.
> **999 Sword:** 999 damage but only 1 durability, one-hit kill ultimate weapon.

#### Ranged Weapons Top 6

| Rank | Weapon | Damage | Crit Rate | Ammo Type | Rarity
|:-:|:-:|:-:|:-:|:-|:-:
| 1 | AWM | **200** | — | .300 Winchester Magnum | legendary
| 2 | Mosin-Nagant | **135** | — | 7.62×54mmR | epic
| 3 | M700 | **120** | — | 7.62×51mm | rare
| 4 | SR25 | **95** | — | 7.62×51mm | epic
| 5 | SPAS-12 | **95** | — | 12 gauge shotgun shell | rare
| — | Royal Short Gun | **99** | 29% | .357 Magnum | myth

> **Special ranged:** Prairie Bow (52 damage / 52% crit / arrow / myth) — only Mu Miaomiao task 3 reward

#### Items Excluded from Drop Pool

Following items **will not** be obtained from looting / zombie drops:

- Fearless Blade ("Become a new force" ending reward)
- Royal Silver Sword (royal trade purchase / myth)
- Prairie Bow (Mu Miaomiao task 3 reward / myth)
- Royal Short Gun (royal trade purchase / myth)
- Sea Song Fish Fork (mermaid 150 affinity reward / myth)
- Imperial Sword (legendary, special purpose)
- 999 Sword (legendary, one-hit 999 damage)
- Improved antibody injection (ending 8 reward)
- Zombie gel (industrial park workshop)
- Fists (default weapon)

#### Crossbow vs Firearm

| Comparison Item | Bow / Crossbow | Firearm
|:-|:-|:-
| Crit rate | **Has crit rate** (not 0%) | 10%~45% (depends on weapon)
| Integrity consumption | **Does not consume** | Each shot -1
| Repair cost | 5 cigarettes / time (Lilith) | 10 cigarettes / time (Lilith)
| Ammo acquisition | Arrows easier to loot | Various calibers need specific maps to farm
| Damage upper limit | Prairie Bow 52 damage | AWM 200 damage
| Ranged dodge | **60% chance to dodge zombie attacks | **60% chance to dodge zombie attacks**

**Core conclusion:**
- Crossbow suitable for **daily clearing small monsters** — zero repair cost, arrows easy to get, saves cigarettes
- Firearm suitable for **boss fights / high-risk maps** — high damage + high crit + ranged dodge, but expensive to repair, ammo scarce

#### Each Stage Recommended Ranged Weapons

| Stage | Recommended Weapon | Reason
|:-|:-|:-
| Start (1~5 days) | Wooden bow / Recurve bow | Zero repair cost, granary / farmhouse drops arrows
| Accumulation (5~15 days) | Compound bow / Crossbow | Damage sufficient, saves repair cost
| Armed (15~30 days) | G17 / USP9 + folding crossbow | Pistol handles strong enemies, crossbow for small monsters
| Advanced (30+ days) | AK47 / M4A1 + sniper crossbow | Rifle firepower strong, crossbow continues saving cost
| Endgame | M700 / SR25 + AWM (if any) | Sniper rifle one-hit kill, AWM ultimate weapon

#### Farm Weapons Recommended Maps

| Target | Map | Chance
|:-|:-|:-:
| Melee weapons | Industrial park / processing plant | **30%**
| Ranged weapons | Abandoned police station | **15%+**
| Ranged weapons | Underground subway tunnel | 15%
| Ranged weapons | Biochemical research institute | 15%
| Ranged weapons | Abandoned factory warehouse | 5%

### Medicine Quick Reference (15 Types)

| Medicine | Rarity | Effect | Purpose
|:-|:-:|:-|:-
| Bandage | common | HP+10 | Basic heal
| Glucose solution | common | HP+25 / hydration+15 | Dual recovery
| Painkiller | uncommon | Sanity+15 / breakdown-5 | Sanity recovery
| Sedative | uncommon | Sanity+30 | Sanity recovery
| Epinephrine | uncommon | HP+20 / breakdown-10 | Combat medicine
| Tourniquet | uncommon | **HP+30** | Miss V task needs 5
| Debridement medicine | uncommon | Infection-25 | Mild infection
| Surgery kit | rare | HP+25 / breakdown-10 | Intermediate heal
| Antibiotic | rare | HP+35 / **Infection-25** | Must-have
| **Anti-infection serum** | rare | **Infection-60** | **Liu Ruyan task + Dr. Chen task both need!**
| Medical first aid kit | epic | **HP+70** | Strong heal
| **Field medical kit** | epic | **HP+120 / breakdown-30** | **Strongest regular medicine**
| Universal injection | legendary | HP+150 / breakdown-50 / infection-50 / hydration+20 | Ultimate medicine
| Improved antibody injection | myth | **Infection-90** | Ultimate anti-infection (ending 8 daily reward)
| Zombie gel | myth | Infection+2 (⚠ reverse effect!) | Duke Yu Mo task material

### Backpack Ranking (Capacity from High to Low)

| Rank | Backpack | Capacity | Rarity | Acquisition Method
|:-:|:-|:-:|:-:|:-
| 1 | Dimension storage backpack | **68 slots** | legendary | Special method (ending 2 reward)
| 2 | Super heavy backpack | **64 slots** | epic | Watchtower loot

### Food / Drink / Fruit

| Category | Count | Description
|:-:|:-:|:-
| Food | 19 types | From small nuts to canned food, cans can feed Luluwei
| Drink | 12 types | Includes assorted beer (breakdown-10), power beer (breakdown-10), high-proof liquor (breakdown-30)
| Fruit | 11 types | Granary pick / farmhouse vegetable field

**Canned food (8 types):** Peach can, bean can, beef can, military ration can, sardine can, tuna can, saury can, mackerel can — all can be used to feed Luluwei.

### Special Items (24 Types)

| Item | Acquisition Method | Purpose
|:-|:-|:-
| noble_id (Noble identity card) | Castle identity office 25 cigarettes | Enter Castle interior, faction identity
| dawn_badge (Dawn Badge) | Outpost Leader join | Dawn faction identity
| silence_badge (Silence Badge) | Kill Zombie King | Honor souvenir / ending condition
| viscount_id (Viscount identity card) | King task | Rank level
| count_id (Count identity card) | King task | Rank level
| marquis_id (Marquis identity card) | King task | Rank level
| duke_id (Duke identity card) | King task | Rank level
| crown_prince_id (Crown Prince identity card) | King task | Highest rank / ending 3 condition
| dawn_captain_badge (Dawn Captain Badge) | Outpost Leader task 3 | Ending 4 condition / unlock campsite voice recorder
| underground_key (Underground key) | — | Special purpose
| farming_master_badge (Farming Master Badge) | — | Unlock farming related interactions
| miaomiao_diary (Miaomiao Diary) | Watchtower wreath tombstone dig | Unlock Mu Miaomiao hidden task
| strange_recorder (Voice recorder) | Campsite stinking tent (need captain badge) | Outpost Leader task line
| letter_to_sister (Letter to sister) | — | Queen task line
| queen_reply (Queen's reply) | — | Queen task line
| love_token (Love token) | Outpost Leader task reward | Queen task prerequisite
| castle_pass (Castle Pass) | Queen task 4 reward | No identity card to enter Castle, doesn't trigger exclusion
| lightning_scale (Lightning Scale) | Electric glass tank put epic fish | Lao Wolf task 1 / mermaid affinity+2
| thunder_scale (Thunder Scale) | Electric glass tank put legendary fish | Lao Wolf task 2 / mermaid affinity+5
| crime_data (Crime data) | Police station search file cabinet (30%) | Old Ma task 1
| ⛽ Gas | Wang Tiezhu exchange (5 cigarettes → 1) / island oil tanker | Yacht fuel / Liu Ruyan task 4
| 🔑 Car key | Liu Ruyan task 3 | Liu Ruyan task 4 prerequisite

***

## 7. Advanced Tips

### 💰 Cigarette Economy

**Cigarettes are doomsday currency!** All advanced trades need cigarettes.

#### Core Cycle: Cigarettes → Materials → Cigarettes

```
Loot weapons → Lilith recycle → get cigarettes
    ↓
Cigarettes → Black market merchant → buy ammo / weapons / seeds
    ↓
Better weapons → challenge high-risk maps → more weapons / materials
    ↓
Extra weapons → Lilith recycle → more cigarettes
    ↑_________________________|
```

#### Cigarette Acquisition Methods Summary

| Method | Income | Stability
|:-|:-|:-:
| Lilith recycles melee weapons | 1 cigarette / weapon | ⭐⭐⭐ Later weapons overflow, stable cash
| Lilith recycles ranged weapons | 2 cigarettes / weapon | ⭐⭐⭐ Ranged more valuable
| Loot industrial park / factory warehouse | 10% drop cigarette | ⭐⭐ Lower chance
| Kill black market merchant | 2~5 cigarettes | ⭐ Has risk
| Castle work | 1 cigarette / time | ⭐ High consumption (18 hunger + 18 hydration + 40 breakdown)
| Castle audience (rank 5+) | 2 cigarettes / day | ⭐⭐⭐ Stable passive income
| Lilith 150 affinity reward | 20 cigarettes (one-time) | ⭐⭐⭐ One-time large amount

#### Cigarette Consumption Priority

1. **Clear infection (10 cigarettes)** — Must clear when infection near 100, otherwise death
2. **Repair gun (10 cigarettes)** — Main weapon broken is dangerous
3. **Black market buy ammo (1 cigarette / 3~6 rounds) — Maintain ranged firepower
4. **Black market buy weapon (10~15 cigarettes)** — Upgrade equipment
5. **Repair crossbow (5 cigarettes)** — Cheaper than gun, daily clear small monsters
6. **Buy seeds (1 cigarette / pack)** — Base planting long-term income

**Money-saving tips:** Use crossbow for small monsters (zero repair cost), use firearm only for boss / strong enemies, maximize cigarette utilization.

### ⚔️ Combat Tips

#### 17 Zombie Types Illustrated and Countermeasures

| Zombie | HP | Damage | Dodge | Special Ability | Countermeasure
|:-|:-:|:-:|:-:|:-|:-
| Ordinary wandering zombie | 120 | 16 | 5% | Infection(+2) | Weakest zombie, any weapon can fight
| Decayed corpse | 100 | 24 | 0% | Infection(+2) | Low HP but high damage, quick kill
| Crawling zombie | 60 | 14 | 20% | Infection(+2) + trip | High dodge, ưu tiên đánh tầm xa
| Fast zombie | 80 | 30 | 35% | Infection(+2) + scream | Very high dodge, use ranged weapon
| Fat bloated zombie | **240** | 20 | 0% | Infection(+2) + **explode** | Thick HP but low damage, note explode after kill! Keep HP >20
| Exploding zombie | 120 | 18 | 0% | **Explode** | Explode after kill, keep safe HP
| Military police zombie | 160 | **36** | 10% | Infection(+2) + **corrode** | High damage + corrode (-5 durability), bring backup weapon! Ưu tiên đánh tầm xa
| Group mother zombie | 140 | 16 | 0% | **Summon** small zombies | First turn focus kill, avoid being summoned
| Iron armor zombie | **280** | 22 | 0% | **Armor** + Infection(+2) | One of thickest HP, need high damage weapon to slowly grind
| Frost zombie | 150 | 26 | 10% | **Freeze** | Freeze effect affects action, bring enough medicine
| Zombie Cuồng bạo Xé xác | 200 | **50** | 5% | **Blind** + corrode | One of most dangerous! Blind + corrode double debuff, ranged + high HP first
| Acid spray zombie | 240 | 28 | 5% | **Acid** | High DPS, must quick kill
| Jumping zombie | 100 | 38 | 35% | **Jump** + Infection(+2) | High dodge + high damage, ưu tiên đánh tầm xa
| Giant tank zombie | **300** | 40 | 0% | **Explode** | Thickest HP + explode after kill (40 damage), ensure HP >40 before kill
| Ghost stealth zombie | 80 | 30 | **50%** | **Stealth** | Highest dodge! Ranged dodge 60% can effectively counter
| Piercing zombie | 180 | **42** | 12% | **Pierce** + corrode | High damage + corrode, bring backup weapon
| 🏈 Football zombie | 250 | 30~55 | 15% | — | Liu Ruyan task 2 exclusive, thick HP high damage

**General countermeasures:**
- Ranged combat mode has **60% chance to dodge zombie attacks**, melee can't dodge
- Infection-type zombies +2 infection per hit, remember to use debridement medicine / serum after fight
- Explode-type zombies (fat / tank / exploding) deal extra damage after kill, ensure sufficient HP
- Military police / cuồng bạo / piercing zombies' corrode effect damages weapons, ranged weapons also lose integrity when corroded
- Escape success rate only 25%, don't count on escape to save life

### 🌾 Planting System

- **5 farm plots**, **15 crop types**
- Seed sources: Mu Miaomiao (1 cigarette → 3 seeds), black market merchant (1 cigarette / pack), moldy seeds event, abandoned vegetable field event
- Crop mature time 12~40 turns, yield 1~4
- Planting is long-term stable food source, recommend starting early

### 💱 Economic Cycle Guide

#### Castle Economic Route

```
Noble identity (25 cigarettes) → Castle work (1 cigarette/time) → rank promotion
    ↓
Audience (rank 5+): daily 2 cigarettes passive income
    ↓
Garden (rank 6): every 3 days random medicine
    ↓
Infection treatment (rank 3=10%, 4=30%, 5=50%, 6=80%)
```

#### Royal Trade Route

```
Outpost Leader task → love token → Queen task line
    ↓
Wolfberries (2→1 coin) / rapiers (1→5 coins) → royal coins
    ↓
Royal coins → royal short gun (100 coins) / royal silver sword (100 coins) / medicine
```

### ⛽ Gas System

**Acquisition methods:**
| Method | Consumption
|:-|:-:
| Suburban gas station Wang Tiezhu | 5 cigarettes → 1 gas
| Island kingdom oil tanker | 20 royal coins → 1 gas
| Island oil tanker recycle | 1 gas → 5 royal coins

**Gas uses:**

| Use | Consumption | Effect
|:-|:-:|:-
| 🚢 Yacht fuel | 1 gas | From riverside port terminal to small island (also need Castle identity/pass)
| 🚗 Liu Ruyan task 4 | 10 gas | Trigger ending 12 "Elope" (endgame)

### 🎣 Fishing and Scale System

**Fishing:** Island fishing area, daily limit 4 times, 16 fish types from common to legendary

**Electric glass tank (city comprehensive mall):**
- Put fish → epic fish → **Lightning Scale** (epic)
- Put fish → legendary fish → **Thunder Scale** (legendary)
- Common/rare fish will be electrocuted, no output
- ⚠ Touch glass tank 50% chance -50 HP!

**Scale uses:**
- Lao Wolf task 1: Need 5 lightning scales
- Lao Wolf task 2: Need 3 thunder scales
- Property warehouse: Feed scales to mermaid +affinity (lightning+2/thunder+5, upper limit 150, 150 reward sea song fish fork)

### 🔫 Lao Wolf/Mermaid Task Line

**Entrance:** Old residential community → survivor Lao Wolf → property warehouse

| Step | Requirement | Reward
|:-:|:-|:-
| 1 Lightning scales | 5 lightning scales | Unlock mermaid (property warehouse)
| 2 Thunder scales | 3 thunder scales | Unlock task 3
| 3 Material preparation | 5 gas + 5 food + 5 drinks | **Desert Eagle** + .50 AE ×30
| 4 Final battle | Defeat giant sea corpse (only ranged! HP 600 / 80 damage) | **Ending 13 "Mermaid Legend"**

### 🗡️ Old Ma Assassination Task Line

**Entrance:** Abandoned factory warehouse → Old Ma → initial trade (10 building materials → ranged weapon)

| Step | Requirement | Target
|:-:|:-|:-
| 1 Collect evidence | 10 crime data (police station file cabinet 30%) | —
| 2 Clear shadow | Kill shadow | Shadow (HP 400 / 50~80 damage / ranged)
| 3 Clear Ma San | Kill Ma San | Ma San (HP 300 / 40~60 damage / ranged)
| 4 Clear King | Kill Castle King | King (HP 450 / 100 damage)
| 5 Clear Lao Zhao | Kill veteran Lao Zhao | Lao Zhao (HP 350 / 70~90 damage / ranged)
| 6 Clear Dr. Chen | Kill Dr. Chen | Dr. Chen (HP 300 / 50~70 damage / ranged)
| 7 Endgame | Go to subway tunnel to meet Old Ma | **Ending 14 "Used as a gun**

> ⚠ Old Ma task line step 4/5/6 bosses can't escape, failure means death!

***

## 8. Weather System

| Weather | Chance | Effect | Countermeasure
|:-|:-:|:-|:-
| ☀️ Sunny | 40% | None | Normal action
| ☁️ Cloudy | 30% | None | Normal action
| 🌧️ Rainy | 10% | Breakdown +2 per turn | Go out less, work at home
| 🌡️ Heat wave | 5% | Hydration -5 per turn | **Bring enough water**
| 🌫️ Foggy | 5% | Explore consumes +1 turn | Explore less that day
| ⚠️ **Acid rain** | 5% | **Can't go out** | **Sleep at home**
| 🌪️ Sandstorm | 5% | HP -2 per turn | Don't go out at home

**Weather updates every midnight**, acid rain forces staying home.

***

## 9. Base Construction

### Upgrade Base

| Level | Name | Upgrade Cost | Sleep Bonus | Upgrade Time
|:-:|:-|:-|:-:|:-:
| 0 | Survivor tent | Initial | +0 | —
| 1 | Survivor wooden house | Building materials | **+5** | 8 turns
| 2 | Survivor stone house | Building materials | **+10** | 8 turns
| 3 | Survivor house | Building materials | **+15** | 8 turns
| 4 | Survivor villa | Building materials | **+20** | 8 turns

> Each upgrade consumes **8 turns**, needs building materials.

### Upgrade Warehouse

| Level | Capacity | Upgrade Time
|:-:|:-:|:-:
| 0 | 30 slots | Initial
| 1 | 40 slots | 2 turns
| 2 | 50 slots | 2 turns
| 3 | 60 slots | 2 turns
| 4 | 70 slots | 2 turns
| 5 | 80 slots | 2 turns
| 6 | 90 slots | 2 turns
| 7 | **100 slots** | 2 turns

### Plant Crops

5 farm plots, 15 crop types. Seed sources: Mu Miaomiao (1 cigarette → 3 seeds), black market merchant (1 cigarette), moldy seeds event, abandoned vegetable field event. Crop mature time 12~40 turns, yield 1~4.

### Castle System

#### Noble Identity

- Application price: **25 cigarettes**
- Cancel: Free, but no cigarette refund

#### Castle Work

- Consumes **8 turns** (1 day)
- Hunger -18, hydration -18, breakdown +40
- Get **1 cigarette** (higher rank, lower consumption)

#### Castle Bank

| Function | Description
|:-|:-
| 💰 Borrow | Borrow 1~10 cigarettes, 10-day term
| 💳 Repay | Deduct corresponding cigarettes from warehouse
| 🤝 Extend | Request 5-day extension **or** kill manager (boss battle)
| ⚠ Overdue | Over 10 days unpaid → **All items confiscated** (only triggers once)

#### Castle Interior Services

| Service | Need Identity Card | Effect | Limit
|:-|:-:|:-|:-:
| 🍽️ Attend noble banquet | ✅ | Hunger+50 / hydration+50 | 2 turns
| 💃 Attend noble ball | ✅ | Breakdown-50 | 2 turns
| 🛏️ Rest in noble guest room | ✅ | HP+50 | 3 turns
| 🏰 Castle Pass | — | Hold to directly pass guard | Doesn't trigger exclusion

#### Rank and Infection Treatment

| Rank Level | Infection Treatment Rate | Extra Privilege
|:-:|:-:|:-
| Level 3 (Viscount) | 10% | —
| Level 4 (Count) | 30% | —
| Level 5 (Marquis) | 50% | Daily audience 2 cigarettes
| Level 6 (Duke) | 80% | Every 3 days garden random medicine

#### Crown Prince Identity Card

After completing King task line king_1~5 can get **Crown Prince identity card**, trigger **ending 3 "Power addiction"** (can continue game).

***

## Ending System

Game has **14 endings**:

| # | Ending Name | Trigger Condition | Game State | Special Reward
|:-:|:-:|:-|:-:|:-
| 1 | Death | HP drops to 0 or infection reaches 100 | **Game Over** | —
| 2 | Unknown future | Survive 999 days | Can continue | Dimension storage backpack (68 slots)
| 3 | Power addiction | Hold crown prince identity card | Can continue | —
| 4 | Shine bright | Hold dawn captain badge | Can continue | —
| 5 | Become a new force | 6 conditions all met | Can continue | **Fearless Blade**(115 damage / 20% combo / myth) |
| 6 | Fly to space | Launch rocket alone | **Game Over** | — |
| 7 | Seed of hope | Launch rocket with team | **Game Over** | — |
| 8 | Stay here | Dr. Chen leaves | Can continue | Daily improved antibody injection |
| 9 | I'm not the farming god | Complete Mu Miaomiao task 3 | Can continue | — |
| 10 | Love and hate | Complete Queen task 4 | Can continue | Royal trade unlocked |
| 11 | Become a meal | Complete Ma San task 4 (accept) | **Game Over** | — |
| 12 | Elope | Complete Liu Ruyan task 4 | **Game Over** | — |
| 13 | Mermaid legend | Complete Lao Wolf task 4 defeat giant sea corpse | **Game Over** | — |
| 14 | Used as a gun | Complete Old Ma 7-step assassination go meet Old Ma | **Game Over** | — |

**Ending 5 "Become a new force" 6 conditions:**
1. Rescue nurse zombie (recruit Luluwei)
2. Rescue Liu Ruyan
3. Kill Ma San
4. Kill Shadow
5. Kill Zombie King
6. Complete Doctor full task chain (including rocket tasks 1~3)

💡 After completing any condition, survival notes will track new force ending progress (X/6).

***

## 10. Frequently Asked Questions

**Q: How to play at the beginning?**
A: Go to granary (safe) to loot → talk to Miss V to get small dagger → work to save money → gradually explore low-risk maps.

**Q: What if Liu Ruyan isn't rescued?**
A: After 30 days she will completely turn into a zombie, can only load save or restart. So **must get 3 serums within 30 days**.

**Q: What if backpack is full?**
A: Build warehouse (base construction → build warehouse), store unused items. Warehouse max 100 slots.

**Q: How to quickly farm affinity?**
A: Talk 4 times daily (+1 each time), gift (food/drink +3, medicine +5, cigarette +2). Lilith gift bonus higher (food +6, medicine +10).

**Q: What if infection value is high?**
A: Use debridement medicine(-25) / antibiotic(-25) / anti-infection serum(-60) / improved antibody injection(-90), or ask Lilith to spend 10 cigarettes to clear -50 infection. Castle high rank also has infection treatment ratio.

**Q: What if breakdown value is high?**
A: Sleep(-10~25), painkiller(-5) / epinephrine(-10) / surgery kit(-10) / field medical kit(-30) / universal injection(-50), watchtower climb(-10), riverside view scenery(-10), castle ball(-50), assorted beer(-10) / power beer(-10) / high-proof liquor(-30).

**Q: What if melee weapon is broken?**
A: Lilith only repairs **ranged weapons**. Replace melee weapon with new one. Luckily melee weapons drop a lot.

**Q: What if ranged weapon integrity is low?**
A: Ask Lilith to spend 10 cigarettes to repair (firearm) or 5 cigarettes to repair (crossbow). Crossbow **doesn't consume integrity**, use bow for small monsters to save repair cost.

**Q: What is the strongest weapon?**
A: Melee strongest is 999 Sword(999 damage / 1 durability / legendary, one-hit kill) and Sea Song Fish Fork(128 damage / 150 durability / 22% combo / myth, mermaid 150 affinity reward); practical strongest is Royal Silver Sword(120 damage / 120 durability / 20% combo / myth) and Fearless Blade(115 damage / 100 durability / 20% combo / myth). Ranged strongest is AWM(200 damage / legendary). Also plot-exclusive weapons: Prairie Bow(52 damage / 52% crit / myth), Royal Short Gun(99 damage / 29% crit / myth), Desert Eagle(65 damage / rare).

**Q: How many endings does the game have?**
A: The game has **14 endings**: Death, Unknown future(999 days), Power addiction(Crown Prince), Shine bright(Dawn Captain), Become a new force(6 conditions), Fly to space(alone rocket), Seed of hope(team rocket), Stay here(Doctor leaves), I'm not the farming god(Mu Miaomiao task 3), Love and hate(Queen task 4), Become a meal(Ma San task 4), Elope(Liu Ruyan task 4), Mermaid legend(Lao Wolf task 4), Used as a gun(Old Ma task chain). Among them endings 2~5 and 8~10 can continue game.

**Q: How to get AWM?**
A: AWM(200 damage / legendary) is game's strongest ranged weapon, can only be obtained by **top-secret space base** 5% chance to find crashed space capsule (only 1 chance). Top-secret space base encounter rate as high as 65%, recommend bringing full medicine and top equipment before going. Normal game extremely hard to get, belongs to ultimate collectible.

**Q: How to join Dawn Outpost?**
A: At Dawn Outpost find **Outpost Leader**, choose "Join Outpost" to get **Dawn Badge**. Note: When holding noble identity card can't join (leader will refuse), need to first cancel noble identity.

**Q: What is noble identity for?**
A: Noble identity card(25 cigarettes) can enter **Doomsday Castle interior**, enjoy following privileges: Attend noble banquet(hunger+50 / hydration+50), attend noble ball(breakdown-50), rest in noble guest room(HP+50). After promoting rank also have infection treatment(up to 80%), daily audience 2 cigarettes, garden random medicine, etc. But holding noble identity will lose Dawn Outpost NPC interaction permission, and can't join Dawn Outpost.

**Q: What happens if Castle debt is overdue?**
A: Overdue unpaid(over 10 days) will trigger **confiscate all items** — everything on you stripped! This penalty only triggers once, return to normal after repaying debt. Recommend ensuring can repay within 10 days before borrowing, or ask bank manager to extend 5 days before overdue.

**Q: How to handle dual identity conflict?**
A: The game **doesn't allow holding Dawn Badge and noble identity card at same time**. If you already have Dawn Badge and go to apply for noble identity, system will automatically clear noble identity card, keep Dawn Badge. If you already have noble identity card and go to join Dawn Outpost, outpost leader will refuse interaction. Recommend first deciding which route to take before choosing identity.

**Q: How to get royal coins?**
A: Complete Queen task chain (need first complete outpost leader task chain to get love token) can get royal coin reward. After completing task 4 unlock "Royal trade", can use wolfberry(2→1 coin) and rapier(1→5 coins) to exchange royal coins.

**Q: What is Castle Pass for?**
A: Castle Pass (Queen task 4 reward) lets you directly pass guard to enter Castle, no need identity card or bribe. It **doesn't** trigger Dawn Outpost exclusion, also won't disappear because holding Dawn Captain Badge.

**Q: How to get Miaomiao Diary?**
A: Go to mountain abandoned watchtower, choose "Wreath tombstone" → "View" (need Farming Master Badge) → "Dig" (need equip shovel), can get Miaomiao Diary. After holding diary talk to Mu Miaomiao can unlock hidden task chain.

**Q: How much infection value is added each time hit by zombie?**
A: Each hit by zombie +2 infection value. Infection value reaching 100 is death, be sure to timely use debridement medicine / serum / antibody injection to treat.

**Q: What happens when breakdown value is 100?**
A: Breakdown value reaching 50 will show "Breakdown" status, reaching **100 can't fight, eat, drink, sleep**. Every 16 awake turns automatically +20 breakdown, note regularly sleep or use breakdown-reducing items. 💡 When breakdown is full, game will prompt can use painkiller(breakdown-5), epinephrine(breakdown-10), surgery kit(breakdown-10), field medical kit(breakdown-30) or universal injection(breakdown-50) to restore mental state. After breakdown drops below 100 return to normal.

**Q: Does crossbow really not consume integrity?**
A: Yes! Bow and crossbow **doesn't consume integrity**, but they have crit rate (not 0%), suitable for daily clearing small monsters to save repair cost. Firearm each shot -1 integrity, need regularly ask Lilith to repair.

**Q: How to unlock Ma San's task?**
A: First go to national highway service area restaurant eat "miscellaneous meat" (⚠️ each use +10 infection value), then talk to Ma San choose "About restaurant food". Note: Ma San task 4 whether accept or defeat Ma San, will trigger ending 11 "Become a meal" (endgame), this is irreversible choice.

**Q: How to get gas?**
A: Two ways: 1) Go to suburban abandoned gas station find Wang Tiezhu, 5 cigarettes exchange 1 gas; 2) At island kingdom oil tanker, 20 royal coins buy 1 gas. Can also sell 1 gas for 5 royal coins to recycle.

**Q: How to start Liu Ruyan's task chain?**
A: First rescue Liu Ruyan (mall 3 serums), then go to university city's "An old classroom".

**Q: How to go to small island?**
A: Need noble identity card + 1 gas (gas can exchange via Wang Tiezhu with cigarettes), from riverside port terminal take Castle yacht to go.

**Q: How to borrow from island bank?**
A: Need Castle Pass or noble identity card, can borrow 10~100 royal coins (total 10 tiers), 10-day repayment term, every 5 days overdue interest increases 10% (upper limit 100%).

**Q: What to do when encountering zombie with full breakdown value?**
A: When breakdown value is 100% enter battle can't attack, only passively take hit. Game will show ⚠ warning before battle. Recommend first use painkiller/epinephrine and other breakdown-reducing medicine to restore mental state, then fight.

**Q: Can I choose quantity when buying ammo from black market merchant?**
A: Yes! When buying ammo can choose use 1, 5, 10 or all cigarettes to exchange, 1 cigarette ≈ 3~6 rounds ammo (random). No longer consume all cigarettes at once.

**Q: How to track new force ending progress?**
A: After completing any prerequisite condition, survival notes will automatically add "New force" progress entry, show 6 conditions completion status (X/6).

**Q: What conditions does rocket "Bring important people" need?**
A: Need Miss V, Su Xiaohan, Lilith three people's affinity all reach 150. When choosing this option, game will show current affinity progress (like V:80/150 Xiaohan:60/150 Lily:150/150), convenient to judge how much left.

**Q: How to get zombie gel? What is it for?**
A: At industrial park/processing plant choose "Check workshop", 50% chance drops zombie gel. Used for Duke Yu Mo task chain (needs 10+30), ⚠ use after infection+2, don't eat as medicine!

**Q: How to trigger mermaid legend ending?**
A: 1) Go to island fishing get epic/legendary fish → 2) At mall electric glass tank exchange for scales → 3) Find Lao Wolf to do task (5 lightning scales→3 thunder scales→5 gas+5 food+5 drinks get Desert Eagle) → 4) Property warehouse feed scales to mermaid → 5) Go to port fight giant sea corpse (only ranged combat!).

**Q: How to trigger Old Ma task chain?**
A: First go to abandoned factory warehouse find Old Ma, 10 building materials exchange ranged weapon to open. Subsequent steps: Collect 10 crime data (police station file cabinet) → kill Shadow → kill Ma San → kill Castle King → kill Lao Zhao → kill Dr. Chen → go to subway tunnel meet Old Ma.

**Q: Is island investment worth it?**
A: Investment has risk! 5-day cycle, 9 directions each have different return rates. Mining highest can double(+100%), but loss can also reach -50%. Recommend diversify investment, start small. During investment royal coins locked can't be used.

**Q: What is robber? How to prevent?**
A: When exploring island, holding 200+ royal coins has chance to encounter robbers (up to 30%), lose some royal coins. At Castle/outpost safe area won't encounter robbers. Buy intelligence center service (50 royal coins/24h) can completely immune robbers.

**Q: What is island oil tanker for?**
A: At island port, can use royal coins to buy and sell gas: 20 royal coins buy 1 gas, 1 gas sell 5 royal coins. This is second way to get gas.

***

> 🌟 Wish you survive in doomsday!
> Remember: **Alive is victory**.