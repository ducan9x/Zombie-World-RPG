export const BASE_LEVELS = [
  { name: "Lều Lưu Sinh", bonus: 0, cost: null, upgradeFlavor: "Bạn vã mồ hôi hột vận chuyển gỗ, đóng đinh sắt. Ngôi lều tồi tàn trong tay bạn từng chút một thay đổi hình dạng——tường đứng lên, mái nhà được lợp. Khi tấm ván cuối cùng được đóng chặt, một ngôi nhà gỗ nhỏ chắc chắn sừng sững trước mặt bạn!" },
  { name: "Nhà Gỗ Lưu Sinh", bonus: 5, cost: { wood: 15, building_mat: 5 }, upgradeFlavor: "Bạn tháo dỡ những bức tường cũ của nhà gỗ, dùng đá và xi măng xây lại. Tiếng búa vang cả ngày, trong bụi mù mịt, một ngôi nhà đá nặng nề mọc lên. Bức tường dày đến mức ngay cả zombie cũng không đâm sập được!" },
  { name: "Nhà Đá Lưu Sinh", bonus: 10, cost: { wood: 25, building_mat: 10, stone: 10 }, upgradeFlavor: "Bạn xây thêm tầng hai trên nền nhà đá, lắp cửa sổ kính, lát sàn gỗ. Giữa sắt thép và xi măng, một ngôi nhà cấp bốn đàng hoàng đã hoàn thành! Mở cửa sổ, gió nhẹ thổi vào, bạn như mơ hồ trở về thế giới văn minh." },
  { name: "Nhà Cấp Bốn Lưu Sinh", bonus: 15, cost: { wood: 40, building_mat: 20, stone: 20, nails: 10 }, upgradeFlavor: "Bạn xây thêm tầng hai trên nền nhà đá, lắp cửa sổ kính, lát sàn gỗ. Giữa sắt thép và xi măng, một ngôi nhà cấp bốn đàng hoàng đã hoàn thành! Mở cửa sổ, gió nhẹ thổi vào, bạn như mơ hồ trở về thế giới văn minh." },
  { name: "Biệt Thự Lưu Sinh", bonus: 20, cost: { wood: 60, building_mat: 35, stone: 35, nails: 25, glass: 10 }, upgradeFlavor: "Bạn từng viên gạch một mở rộng, trang trí, làm vườn. Khi tấm ngói lưu ly cuối cùng được lợp lên mái, ngôi biệt thự hoành tráng này cuối cùng cũng hoàn thành! Trong đống đổ nát ngày tận thế, bạn sở hữu một bến cảng an toàn sang trọng thuộc về riêng mình." },
];

export const WAREHOUSE_LEVELS = [
  null,
  { wood: 5, building_mat: 3 },
  { wood: 10, building_mat: 5 },
  { wood: 15, building_mat: 8, stone: 5 },
  { wood: 20, building_mat: 12, stone: 10, nails: 5 },
  { wood: 30, building_mat: 18, stone: 15, nails: 10 },
  { wood: 40, building_mat: 25, stone: 20, nails: 15 },
  { wood: 50, building_mat: 35, stone: 30, nails: 20, glass: 5 },
];
