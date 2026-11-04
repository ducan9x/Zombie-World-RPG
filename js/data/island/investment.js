export const INVEST_AMOUNTS = [100, 200,300,400,500,600,700,800,900,1000];
export const INVEST_DURATION_DAYS = 5;

export const INVEST_DIRECTIONS = [
  // Đầu tư ban đầu
  {
    id: "realestate",
    name: "Đầu tư bất động sản (biến động cao)",
    outcomes: [
      { probability: 0.04, returnRate: 0.80, desc: "Giá đất trên đảo tăng vọt! Đầu tư bất động sản của bạn thu được lợi nhuận kinh ngạc!" },
      { probability: 0.10, returnRate: 0.50, desc: "Thị trường bất động sản tăng nhiệt mạnh, lợi nhuận rất khả quan." },
      { probability: 0.22, returnRate: 0.15, desc: "Giá nhà ổn định có tăng, bạn thu được một ít lợi nhuận." },
      { probability: 0.14, returnRate: 0.00, desc: "Thị trường bất động sản không nóng không lạnh, khó khăn lắm mới bảo toàn vốn." },
      { probability: 0.28, returnRate: -0.15, desc: "Thị trường bất động sản hạ nhiệt nhẹ, đầu tư xuất hiện lỗ." },
      { probability: 0.22, returnRate: -0.40, desc: "Thị trường nhà đất sụp đổ! Tài sản của bạn co lại mạnh." },
    ],
  },
  {
    id: "food",
    name: "Đầu tư thực phẩm (ổn định)",
    outcomes: [
      { probability: 0.35, returnRate: 0.10, desc: "Nhu cầu thực phẩm ổn định, bạn thu được một ít lợi nhuận." },
      { probability: 0.35, returnRate: 0.00, desc: "Thị trường thực phẩm bình ổn, đầu tư của bạn không lãi không lỗ." },
      { probability: 0.30, returnRate: -0.10, desc: "Thực phẩm cung vượt cầu, đầu tư của bạn lỗ nhẹ." },
    ],
  },
  {
    id: "entertainment",
    name: "Đầu tư giải trí (biến động cao)",
    outcomes: [
      { probability: 0.01, returnRate: 0.90, desc: "Dự án giải trí bùng nổ! Bạn kiếm được đầy túi!" },
      { probability: 0.05, returnRate: 0.60, desc: "Dự án giải trí phản hồi nhiệt tình, lợi nhuận khá tốt." },
      { probability: 0.18, returnRate: 0.20, desc: "Dự án biểu hiện tạm được, thu được một ít lợi nhuận." },
      { probability: 0.21, returnRate: 0.05, desc: "Dự án giải trí khó khăn lắm mới có lãi, kiếm được một ít." },
      { probability: 0.20, returnRate: -0.10, desc: "Không đủ sức hút, đầu tư xuất hiện lỗ nhẹ." },
      { probability: 0.30, returnRate: -0.25, desc: "Dự án hoàn toàn lỗi thời, bạn thiệt hại nặng nề." },
    ],
  },
  {
    id: "tech",
    name: "Đầu tư công nghệ (rủi ro trung bình)",
    outcomes: [
      { probability: 0.30, returnRate: 0.20, desc: "Nghiên cứu công nghệ đạt tiến triển, bạn thu được một ít lợi nhuận." },
      { probability: 0.30, returnRate: 0.00, desc: "Nghiên cứu công nghệ vẫn đang tiến hành, đầu tư của bạn không lãi không lỗ." },
      { probability: 0.40, returnRate: -0.15, desc: "Nghiên cứu công nghệ gặp nút cổ chai, đầu tư của bạn lỗ nhẹ." },
    ],
  },
  {
    id: "agriculture",
    name: "Đầu tư nông nghiệp (ổn định)",
    outcomes: [
      { probability: 0.10, returnRate: 0.25, desc: "Năm nay thời tiết thuận lợi, nông sản đại thu hoạch! Bạn nhận được lợi nhuận hậu hĩnh!" },
      { probability: 0.20, returnRate: 0.08, desc: "Nông nghiệp thu hoạch tạm được, bạn thu được một ít lợi nhuận." },
      { probability: 0.45, returnRate: 0.00, desc: "Nông nghiệp thu hoạch bình thường, đầu tư của bạn không lãi không lỗ." },
      { probability: 0.25, returnRate: -0.15, desc: "Gặp sâu bệnh, nông sản giảm sản lượng, đầu tư của bạn lỗ nhẹ." },
    ],
  },

  // Đầu tư mới
  {
    id: "mining",
    name: "Đầu tư khai thác (biến động cao)",
    outcomes: [
      { probability: 0.05, returnRate: 1.00, desc: "Phát hiện mỏ lớn! Đầu tư trực tiếp gấp đôi!" },
      { probability: 0.10, returnRate: 0.50, desc: "Giá khoáng sản đi lên, lợi nhuận rất khả quan." },
      { probability: 0.20, returnRate: 0.10, desc: "Sản lượng khai thác ổn định, có lãi nhẹ." },
      { probability: 0.25, returnRate: 0.00, desc: "Thị trường khoáng sản bình thường, vừa đủ hồi vốn." },
      { probability: 0.25, returnRate: -0.20, desc: "Mỏ xảy ra tai nạn nhỏ, gây ra một số tổn thất." },
      { probability: 0.15, returnRate: -0.50, desc: "Tai nạn mỏ thường xuyên, đầu tư co lại mạnh." },
    ],
  },
  {
    id: "pharma",
    name: "Đầu tư y dược (rủi ro thấp)",
    outcomes: [
      { probability: 0.15, returnRate: 0.15, desc: "Thuốc mới lên kệ thành công, lãi không nhỏ." },
      { probability: 0.50, returnRate: 0.04, desc: "Bán thuốc thường quy ổn định, lợi nhuận bình ổn." },
      { probability: 0.35, returnRate: -0.12, desc: "Đường ống nghiên cứu gặp trắc trở, lỗ nhẹ." },
    ],
  },
  {
    id: "energy",
    name: "Đầu tư năng lượng (ổn định)",
    outcomes: [
      { probability: 0.10, returnRate: 0.20, desc: "Giá năng lượng tăng, lợi nhuận hậu hĩnh." },
      { probability: 0.28, returnRate: 0.08, desc: "Nhu cầu năng lượng ổn định, thu được lợi nhuận ổn định." },
      { probability: 0.30, returnRate: 0.00, desc: "Thị trường năng lượng yên ả, không lãi không lỗ." },
      { probability: 0.32, returnRate: -0.12, desc: "Giá năng lượng hạ, lỗ nhẹ." },
    ],
  },
  {
    id: "education",
    name: "Đầu tư giáo dục (biến động cao)",
    outcomes: [
      { probability: 0.03, returnRate: 0.80, desc: "Giáo dục quý tộc bùng nổ trong một đêm! Lợi nhuận hậu hĩnh!" },
      { probability: 0.12, returnRate: 0.40, desc: "Khóa học mới được đánh giá cao, lợi nhuận khả quan." },
      { probability: 0.18, returnRate: 0.10, desc: "Số lượng tuyển sinh đạt chuẩn, có lãi nhẹ." },
      { probability: 0.12, returnRate: 0.05, desc: "Nguồn sinh viên ổn định, còn dư một ít." },
      { probability: 0.20, returnRate: 0.00, desc: "Thị trường giáo dục ổn định, không lãi không lỗ." },
      { probability: 0.20, returnRate: -0.15, desc: "Cạnh tranh khốc liệt, nguồn sinh viên thất thoát, xuất hiện lỗ." },
      { probability: 0.15, returnRate: -0.40, desc: "Chính sách vương quốc thay đổi đột ngột, dự án đầu tư bị thiệt hại nặng." },
    ],
  },
  {
    id: "transport",
    name: "Đầu tư vận tải (biến động cao)",
    outcomes: [
      { probability: 0.05, returnRate: 0.80, desc: "Tuyến đường mới mở, đơn vận tải bùng nổ!" },
      { probability: 0.12, returnRate: 0.30, desc: "Nhu cầu logistics mạnh, lợi nhuận tăng ổn định." },
      { probability: 0.24, returnRate: 0.10, desc: "Lượng vận tải bình ổn, có lãi nhẹ." },
      { probability: 0.20, returnRate: 0.00, desc: "Thị trường bình thường, vừa đủ hồi vốn." },
      { probability: 0.20, returnRate: -0.15, desc: "Chi phí nhiên liệu tăng vọt, lợi nhuận bị nén mạnh." },
      { probability: 0.19, returnRate: -0.40, desc: "Tai nạn giao thông lớn dẫn đến bồi thường khổng lồ." },
    ],
  },
];