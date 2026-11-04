export const NPCS = {
  survivor: {
    name: "Lưu dân",
    hpMin: 100, hpMax: 160,
    damageMin: 20, damageMax: 30,
    hasRanged: 0.3
  },
  bandit: {
    name: "Đao Ba",
    hpMin: 150, hpMax: 240,
    damageMin: 30, damageMax: 40,
    hasRanged: 0.4
  },
  wanderingTrader: {
    name: "Thương nhân chợ đen",
    hpMin: 200, hpMax: 300,
    damageMin: 30, damageMax: 50,
    hasRanged: 0.6
  },
  doctor: {
    name: "Du y mạt thế",
    hpMin: 60, hpMax: 100,
    damageMin: 15, damageMax: 25,
    hasRanged: 0.2
  }
};

export const SURVIVOR_NPC = [
  {
    id: "v",
    name: "Cô V",
    desc: "Một nữ sát thủ ánh mắt lạnh lùng, luôn đơn độc. Cô ấy không bao giờ chủ động nói chuyện, nhưng thỉnh thoảng sẽ cho bạn một ánh mắt lạnh lẽo.",
    dialogues: {
      stranger: [
        "\"Đừng lại gần.\" cô ấy lạnh lùng nói.",
        "Cô ấy cảnh giác nhìn bạn, không nói lời nào.",
        "\"Nơi này không chào đón người lạ.\"",
        "Cô ấy lau dao găm, hoàn toàn phớt lờ sự tồn tại của bạn.",
        "\"Có việc gì?\" cô ấy hỏi mà không ngẩng đầu."
      ],
      acquaintance: [
        "\"Là bạn……có việc gì?\"",
        "Cô ấy dừng động tác, liếc bạn một cái.",
        "\"Bạn vẫn còn sống, không tệ.\"",
        "\"Đừng lảng vảng ở đây, cẩn thận zombie.\"",
        "\"Tôi không có gì để nói.\""
      ],
      friend: [
        "\"Đến rồi.\" giọng cô ấy hơi dịu đi chút.",
        "Cô ấy ném cho bạn một con dao găm: \"Cầm lấy, để phòng thân.\"",
        "\"Gần đây phía đông zombie nhiều hơn, cẩn thận.\"",
        "\"Bạn tiến bộ không ít.\" cô ấy hiếm khi khen bạn một câu.",
        "\"Cần giúp đỡ?\""
      ],
      close: [
        "\"Ngồi đi.\" cô ấy chỉ vào hòn đá bên cạnh.",
        "Cô ấy đưa bạn một chai nước: \"Khát rồi chứ.\"",
        "\"Tôi từng là đặc công……thôi, không nói cái này.\"",
        "\"Bạn là người duy nhất tôi tin trong mạt thế này.\"",
        "\"Nếu tôi chết, hãy chăm sóc bản thân.\""
      ],
      soulmate: [
        "\"Cuối cùng……tìm thấy bạn rồi.\" trong mắt cô ấy lần đầu xuất hiện sự ấm áp.",
        "Cô ấy siết chặt tay bạn: \"Chúng ta cùng sống sót.\"",
        "\"Tôi giao phó tất cả những gì tôi có cho bạn.\"",
        "\"Dù xảy ra gì, tôi cũng ở bên bạn.\"",
        "\"Có bạn ở đây, mạt thế này cũng không còn đáng sợ nữa.\""
      ]
    },
    tips: [
      "【Gợi ý】Bệnh viện có rất nhiều vật tư y tế, nhưng zombie cũng rất nhiều.",
      "【Gợi ý】Gần sở cảnh sát có vũ khí xuất hiện, nhưng phải cẩn thận zombie quân cảnh.",
      "【Gợi ý】Balo quân dụng xuất hiện với xác suất cao nhất tại trạm kiểm soát quân sự.",
      "【Gợi ý】Khi độ bền vũ khí cận chiến dưới 10 phải cẩn thận khi dùng.",
      "【Gợi ý】Giá trị nhiễm trên 50 sẽ liên tục mất máu, nhanh chóng tìm huyết thanh kháng nhiễm."
    ],
    quests: {
      v1: { name: "Nhiệm vụ gặp đầu", desc: "Nộp 1 thực phẩm + 1 đồ uống", reqAffection: 0, require: { food: 1, drinks: 1 }, reward: { item: "小匕首", desc: "Tiểu đao×1" }, story: "\"Đói bụng không thể chiến đấu. Cho tôi đồ ăn, tôi cho bạn vũ khí.\" cô ấy dùng dao găm chỉ vào bạn." },
      v2: { name: "Huấn luyện cầm máu", desc: "Nộp 5 băng gạc", reqAffection: 30, require: { medicine: 5, medicineId: "止血带" }, reward: { item: "指虎刀", desc: "Chỉ hổ đao×1" }, story: "\"Bạn chưa tính là quá yếu.\" cô ấy ném cho bạn một con chỉ hổ đao. \"Con dao này đi theo tôi giết không ít zombie, đừng làm nó mất mặt.\"" },
      v3: { name: "Nhiệm vụ huyết thanh", desc: "Nộp 8 huyết thanh kháng nhiễm", reqAffection: 60, require: { medicine: 8, medicineId: "抗感染血清" }, reward: { item: "龙抄剑", desc: "Long抄 kiếm×1" }, story: "\"Huyết thanh là một trong những tài nguyên quý giá nhất mạt thế.\" cô ấy đưa bạn một thanh long抄 kiếm. \"Bạn xứng đáng dùng cái này rồi.\"" },
      v4: { name: "Thử thách khó", desc: "Nộp 8 hộp y tế chiến địa", reqAffection: 90, require: { medicine: 8, medicineId: "战地医疗箱" }, reward: { item: "P226", ammo: { type: "9×19mm", count: 50 }, desc: "P226×1 + 9×19mm×50" }, story: "\"Bạn là người sống sót ngoan cường nhất tôi từng thấy.\" cô ấy cuối cùng nở nụ cười chân thành. \"Con P226 này, là bảo bối cuối cùng của tôi. Đừng làm tôi thất vọng.\"" },
      v5: { name: "Vật tư cấp cứu", desc: "Nộp 6 gói cấp cứu y tế + 6 huyết thanh kháng nhiễm", reqAffection: 120, require: { items: [{ type: "medicine", id: "gói cấp cứu y tế", count: 6 }, { type: "medicine", id: "huyết thanh kháng nhiễm", count: 6 }] }, reward: { item: "UZI", ammo: { type: "9×19mm", count: 50 }, desc: "UZI×1 + 9×19mm×50" }, story: "\"Bạn lớn nhanh thật.\" cô ấy đưa bạn một khẩu UZI và vài hộp đạn. \"Con súng này hỏa lực mạnh, phù hợp đối phó zombie thành đàn. Đừng lãng phí đạn.\"" },
      v6: { name: "Thử thách cuối cùng", desc: "Nộp tất cả thuốc mỗi loại 2 cái", reqAffection: 150, require: { allMedicine: 2 }, reward: { item: "M4A1", ammo: { type: "5.56×45mm NATO", count: 50 }, desc: "M4A1×1 + 5.56×45mm NATO×50" }, story: "\"Bạn đã vượt qua tôi rồi.\" cô ấy trang trọng đưa bạn một khẩu M4A1. \"Đây là khẩu súng tôi cất giữ nhiều năm, giờ thuộc về bạn. Hãy đi tạo ra một thế giới không còn zombie.\"" }
    }
  },
  {
    id: "xiaohan",
    name: "Tiểu Hàn",
    desc: "Một cô gái nụ cười ấm áp, luôn nhiệt tình giúp đỡ mọi người trong trận địa. Túi cô ấy dường như luôn có uống mãi không hết sữa.",
    dialogues: {
      stranger: [
        "\"Này! Bạn mới đến à? Chào mừng chào mừng!\" cô ấy nhiệt tình chào bạn.",
        "\"Xin chào! Tôi tên Tiểu Hàm, sau này có gì cần giúp cứ nói!\"",
        "\"Uống ly sữa chứ? Bổ sung dinh dưỡng rất quan trọng đó~\"",
        "\"Đây là chúttâm ý của tôi, hy vọng bạn thích!\" cô ấy đưa bạn một chuỗi bùa hộ mệnh tự làm.",
        "\"Quen bạn thật vui! Giữa mạt thế gặp được bạn mới thật tốt!\""
      ],
      acquaintance: [
        "\"Lại gặp nhau rồi! Hôm nay cảm giác thế nào?\"",
        "\"Tôi vừa sắp xếp xong vật tư, mệt quá……\"",
        "\"Lili lại nghịch ngợm rồi, thật không biết làm sao với cô ấy~\"",
        "\"Hôm nay chị V hình như tâm trạng không tệ!\"",
        "\"Hôm nay bạn có kế hoạch gì?\""
      ],
      friend: [
        "\"Đến rồi! Tôi để dành cho bạn chút đồ ăn!\"",
        "\"Cảm ơn bạn luôn chăm sóc tôi, thật sự rất cảm ơn!\"",
        "\"Hôm nay thời tiết đẹp, nếu không có zombie thì tốt……\"",
        "\"Tôi làm ít bánh quy, bạn muốn nếm thử không?\"",
        "\"Có bạn ở đây, tôi cảm thấy an toàn hơn nhiều.\""
      ],
      close: [
        "\"Chúng ta là bạn tốt nhất, đúng không?\" cô ấy vui vẻ cười.",
        "\"Nói bạn một bí mật……thật ra tôi rất sợ zombie……\"",
        "\"Biết không, trước đây tôi là giáo viên mẫu giáo, những đứa trẻ đó rất đáng yêu……\"",
        "\"Nếu có thể quay về trước đây thì tốt……\" ánh mắt cô ấy hơi tối đi.",
        "\"Dù xảy ra gì, chúng ta cũng phải cùng nhau sống sót!\""
      ],
      soulmate: [
        "\"Tôi……tôi thích bạn!\" cô ấy đỏ mặt nhỏ giọng nói.",
        "\"Có bạn ở bên, tôi không sợ gì cả.\"",
        "\"Chúng ta cùng nhau xây dựng một ngôi nhà mới, được không?\"",
        "\"Bạn là người quan trọng nhất của tôi trong thế giới này.\"",
        "\"Đừng bao giờ rời xa tôi, được không?\""
      ]
    },
    tips: [
      "【Gợi ý】Trái cây vừa bổ sung no vừa bổ sung nước, là thực phẩm khẩn cấp rất tốt.",
      "【Gợi ý】Uống nước sẽ giảm giá trị khát, nhưng chú ý đừng uống quá nhiều!",
      "【Gợi ý】Sữa tươi và sữa chua là đồ uống tôi thích nhất!",
      "【Gợi ý】Bánh quy nén tuy không ngon, nhưng giá trị no rất cao.",
      "【Gợi ý】Chú ý giữ đói và nước trên 0%, nếu không sẽ mất máu đó!"
    ],
    quests: {
      xh0: { name: "Mới đến", desc: "Nộp bất kỳ 1 đồ uống", reqAffection: 0, require: { drinks: 1 }, reward: { itemStack: [{ id: "创可贴", count: 3 }], desc: "Băng gạc cầm máu×3" }, story: "\"Bạn mới đến đúng không? Này, đây là quà gặp mặt!\" cô ấy lấy từ túi ra mấy miếng băng gạc đưa bạn. \"Sau này có cần thì đến nhà bếp trận địa tìm tôi!\"" },
      xh1: { name: "Dự trữ sữa", desc: "Nộp 10 hộp sữa tươi", reqAffection: 30, require: { drinks: 10, drinkId: "纯牛奶" }, reward: { itemStack: [{ id: "手术包", count: 3 }], desc: "Gói phẫu thuật×3" }, story: "\"Tuyệt quá, có những sữa này, bọn trẻ trong trận địa sẽ không phải đói.\" cô ấy lấy từ hộp y tế ra mấy gói phẫu thuật. \"Đây là bác sĩ cho tôi trước đây, tôi dùng không hết, đưa bạn!\"" },
      xh2: { name: "Mua sắm đồ uống", desc: "Nộp 15 hộp sữa chua", reqAffection: 60, require: { drinks: 15, drinkId: "优酸乳" }, reward: { itemStack: [{ id: "抗生素", count: 5 }], desc: "Kháng sinh×5" }, story: "\"Trời ơi, nhiều sữa chua vậy!\" cô ấy xúc động ôm bạn một cái. \"Kháng sinh tôi tìm lâu rồi cũng đưa bạn, xem như quà cảm ơn!\"" },
      xh3: { name: "Thu thập đồ hộp", desc: "Nộp tất cả đồ hộp mỗi loại 1 cái", reqAffection: 90, require: { allCanned: 1 }, reward: { itemStack: [{ id: "huyết thanh kháng nhiễm", count: 3 }], desc: "Huyết thanh kháng nhiễm×3" }, story: "\"Oa, nhiều đồ hộp vậy!\" 苏小涵 vui vẻ phân loại đồ hộp. \"Đủ để mọi người trong trận địa ăn mấy ngày rồi! Những huyết thanh này tôi tích trước đây, đưa bạn!\"" },
      xh4: { name: "Tiệc trái cây", desc: "Nộp tất cả trái cây mỗi loại 1 cái", reqAffection: 120, require: { allFruits: 1 }, reward: { itemStack: [{ id: "医用急救包", count: 3 }], desc: "Gói cấp cứu y tế×3" }, story: "\"Trời ơi! Trái cây!\" mắt 苏小涵 sáng lên. \"Lâu rồi không ăn trái cây tươi! Tôi phải làm đĩa trái cây cho mọi người! Mấy gói cấp cứu này bạn giữ đi!\"" },
      xh5: { name: "Mua sắm lớn", desc: "Nộp tất cả đồ uống mỗi loại 1 cái + tất cả thực phẩm mỗi loại 1 cái", reqAffection: 150, require: { allDrinks: 1, allFoods: 1 }, reward: { itemStack: [{ id: "战地医疗箱", count: 3 }], desc: "Hộp y tế chiến địa×3" }, story: "\"Cái này, nhiều quá rồi!\" 苏小涵 xúc động đến đỏ vành mắt. \"Bạn dọn cả siêu thị về đây à? Tôi……tôi không biết cảm ơn thế nào! Mấy hộp y tế chiến địa này bạn nhất định phải nhận!\"" }
    }
  },
  {
    id: "lili",
    name: "Lili",
    desc: "Một cô gái tinh nghịch, luôn thíchbày弄各种废弃武器和机械零件. Cô ấy tinh thông thu hồi và sửa chữa vũ khí, còn có thể pha chế thuốc chữa nhiễm. Cô ấy nói cô có một kho, bên trong chất đầy các loại bảo bối.",
    canRecycle: true,
    canCureInfection: true,
    dialogues: {
      stranger: [
        "\"Oa, bạn là ai? Mới đến à?\" cô ấy tò mò đánh giá bạn.",
        "\"Này! Tôi là Lili! Bạn có điếu thuốc không?\"",
        "\"Xem! Đây là bảo bối tôi nhặt được hôm nay!\" cô ấy giơ lên một con cờ lê rỉ sét.",
        "\"Bạn có muốn cùng tôi đi nhặt đồ không? Vui lắm!\"",
        "\"Chị V nói tôi quá nghịch ngợm……nhưng nhặt đồ thật sự rất thú vị mà!\""
      ],
      acquaintance: [
        "\"Lại là bạn! Hôm nay mang điếu thuốc đến chưa?\"",
        "\"Hôm qua tôi phát hiện rất nhiều đồ tốt trong nhà máy!\"",
        "\"Bánh pudding chị Tiểu Hàm làm ngon thật!\"",
        "\"Chị V dữ thật……nhưng thật ra cô ấy rất quan tâm chúng ta!\"",
        "\"Bạn từng đi siêu thị đó chưa? Bên trong có rất nhiều đồ ăn vặt!\""
      ],
      friend: [
        "\"Đến rồi đến rồi! Tôi cho bạn xem vũ khí sưu tầm mới của tôi!\"",
        "\"Nói nhỏ cho bạn biết, tôi biết một căn cứ bí mật!\"",
        "\"Bạn phải giữ bí mật giúp tôi……ban đêm tôi sẽ lén ra nhặt đồ.\"",
        "\"Điếu thuốc điếu thuốc! Bạn có điếu thuốc dư không?\"",
        "\"Đợi tôi tích đủ điếu thuốc, tôi muốn xây một khu vườn!\""
      ],
      close: [
        "\"Chúng ta là bạn tốt đúng không? Vậy bạn phải giúp tôi giữ bí mật nhé!\"",
        "\"Thật ra……tôi hơi sợ bóng tối……\"",
        "\"Biết không, trước đây tôi muốn làm kỹ sư……\"",
        "\"Nếu thế giới không có zombie thì tốt, tôi rất muốn đi học……\"",
        "\"Cảm ơn bạn luôn cùng tôi tán gẫu, bạn là bạn tốt nhất của tôi!\""
      ],
      soulmate: [
        "\"Tôi……tôi thích bạn! Bạn có muốn ở bên tôi không?\"",
        "\"Có bạn ở đây, đêm tối cũng không đáng sợ nữa!\"",
        "\"Chúng ta cùng nhau thu thập thật nhiều đồ, xây dựng một thế giới mới!\"",
        "\"Bạn là người quan trọng nhất trong cuộc đời tôi!\"",
        "\"Mãi mãi mãi mãi đừng rời xa tôi nhé!\""
      ]
    },
    tips: [
      "【Gợi ý】Vũ khí cận chiến có thể tìm thấy rất nhiều trong nhà máy và sở cảnh sát!",
      "【Gợi ý】Điếu thuốc là tiền tệ giao dịch rất tốt, nhớ thu thập nhiều!",
      "【Gợi ý】Tại thương nhân chợ đen có thể dùng điếu thuốc đổi vũ khí đó!",
      "【Gợi ý】Thu hồi vũ khí cận chiến có thể nhận điếu thuốc, tìm tôi là đúng rồi!",
      "【Gợi ý】Gậy bóng chày và rìu cứu hỏa là vũ khí cận chiến rất dễ dùng!"
    ],
    recycleQuest: { name: "Thu hồi vũ khí cận chiến (vĩnh viễn)", desc: "Thu hồi bất kỳ vũ khí cận chiến, nhận 1 điếu thuốc ngẫu nhiên", reward: { cigarette: true }, story: "\"Đồ tốt!\" cô ấy cẩn thận xem xét vũ khí bạn đưa, rồi lấy từ túi ra một điếu thuốc. \"Điếu này cho bạn, hào phóng chứ?\"" },
    recycleRangedQuest: { name: "Thu hồi vũ khí tầm xa (vĩnh viễn)", desc: "Thu hồi bất kỳ vũ khí tầm xa, nhận 2 điếu thuốc", reward: 2, story: "\"Oa, thứ này không tệ!\" mắt cô ấy sáng lên, thành thạo nghịch vũ khí tầm xa của bạn. \"Tôi đang thiếu linh kiện, hai điếu thuốc này thuộc về bạn!\"" },
    recycleBackpackQuest: { name: "Thu hồi balo dư (vĩnh viễn)", desc: "Thu hồi balo dư, tính theo 1+(dung lượng÷20 làm tròn) điếu thuốc", reward: "dynamic", story: "\"Balo cũng có thể đổi thuốc đó!\" cô ấy vỗ vỗ balo của bạn. \"Dung lượng càng lớn càng đáng tiền nhé~\"" },
    repairQuest: { name: "Sửa súng (vĩnh viễn)", desc: "Nộp 10 điếu thuốc sửa một vũ khí tầm xa hoàn chỉnh +50%", cost: 10, repair: 50, story: "\"Đưa súng đây!\" Lili hào hứng nhận vũ khí, thành thạo tháo rời, làm sạch, tra dầu……\"Sửa xong rồi! {weapon} giờ dùng như mới rồi!\"" },
    repairBowQuest: { name: "Sửa cung nỏ (vĩnh viễn)", desc: "Tiêu 5 điếu thuốc sửa một cung/nỏ hoàn chỉnh +50%", cost: 5, repair: 50, story: "\"Cung nỏ tôi giỏi nhất!\" cô ấy nhận cung nỏ của bạn, thành thạo điều chỉnh. \"Trước đây tôi từng ở câu lạc bộ bắn cung! {weapon} giờ dùng tốt hơn nhiều!\"" },
    cureInfectionQuest: { name: "Xóa nhiễm (vĩnh viễn)", desc: "Tiêu 10 điếu thuốc xóa 50% nhiễm", cost: 10, cureAmount: 50, story: "\"Bạn trông không ổn……\" cô ấy nhíu mày đánh giá bạn. \"Nhiễm không phải chuyện đùa! Này, cái này có thể giúp bạn.\" cô ấy tiêm cho bạn một mũi thuốc màu vàng nhạt." },
    giftQuest: { name: "Quà bí ẩn", desc: "Nhận quà bí ẩn", reqAffection: 150, reward: { cigarettes: 20, ammo: { type: "9×19mm", count: 50 }, desc: "Điếu thuốc×20 + 9×19mm×50" }, story: "\"Hì hì, thật ra tôi đã chuẩn bị cái này cho bạn từ lâu!\" Lili kéo từ góc kho ra một chiếc hộp lớn. \"20 điếu thuốc cùng 50 viên đạn, toàn bộ bảo bối của tôi, vì tôi tin tưởng bạn!\"" }
  },
  {
    id: "mumiao",
    name: "Mù Miào Miêu",
    desc: "Một phụ nữ trẻ đội mũ rơm, ngón tay luôn dính đất. Cô ấy là chuyên gia nông nghiệp duy nhất trong trận địa, nghe nói chỉ có cô ấy mới có thể nuôi được hạt giống trồng được giữa mạt thế.",
    canTrade: false,
    canGift: true,
    dialogues: {
      stranger: [
        "\"Bạn là ai? Đừng động vào ruộng của tôi.\" cô ấy cảnh giác chặn trước ruộng rau.",
        "\"Giữa mạt thế, người trồng được đồ còn hiếm hơn người bắn súng.\" cô ấy lạnh lùng liếc bạn.",
        "\"Muốn mua hạt giống thì xếp hàng, không mua thì đừng vướng chân.\"",
        "Cô ấy cúi người kiểm tra cây rau, hoàn toàn phớt lờ bạn.",
        "\"Đừng giẫm lên đất của tôi!\" cô ấy đột nhiên quát lớn."
      ],
      acquaintance: [
        "\"Lại đến nữa? Có vẻ bạn rất hứng thú với hạt giống của tôi.\"",
        "\"Hôm nay thời tiết tốt, cây con lớn tốt.\" cô ấy hiếm khi nở nụ cười.",
        "\"Biết không, trước mạt thế tôi là tiến sĩ thực vật học……thôi, nói những cái này có ích gì.\"",
        "\"Hạt giống rất quý giá, mỗi hạt đều không được lãng phí.\"",
        "\"Bạn trông tinh thần hơnlần trước rồi, có phải ăn rau của tôi không?\" khóe miệng cô ấy hơi cong lên."
      ],
      friend: [
        "\"Đến đây, giúp tôi xem cây này, có nên tưới nước không?\"",
        "\"Tôi vẫn đang nghiên cứu làm sao để hạt giống nảy mầm trong đất bị nhiễm……có tiến triển rồi.\"",
        "\"Cảm ơn bạn thường xuyên đến giúp, ruộng thí nghiệm một mình tôi thật sự bận không xuể.\"",
        "\"Bạn có chú ý không, một số cây biến dị lại có thể làm sạch đất? Thật kỳ diệu.\"",
        "\"Tôi để dành cho bạn ít hạt giống tốt, lần sau đến nhớ lấy.\""
      ],
      close: [
        "\"Bạn là người cẩn thận nhất tôi từng thấy……trồng trọt và đánh nhau như nhau, đều cần kiên nhẫn.\"",
        "\"Đôi khi tôi nghĩ, nếu thế giới không biến thành thế này, chúng ta có thể gặp nhau trong một khu vườn nào đó?\" ánh mắt cô ấy dịu đi.",
        "\"Biết không, tôi có một mảnh hoa viên bí mật……thôi, chưa phải lúc nói cho bạn.\"",
        "\"Mỗi lần bạn đến giúp, tôi cảm thấy……trong lòng rất yên bình.\"",
        "\"Trước đây tôi nghĩ chỉ có cây cối sẽ không phản bội tôi……giờ tôi không chắc nữa.\" cô ấy nhìn vào mắt bạn nói."
      ],
      soulmate: [
        "\"Bạn là hạt giống quý giá nhất tôi trồng trên mảnh phế thổ này.\" cô ấy khẽ nói, trong mắt có ánh sáng.",
        "\"Tôi sẵn sàng cho bạn xem hoa viên của tôi……đó là toàn bộ bí mật của tôi.\"",
        "\"Biết không, một số loài hoa chỉ nở trước người đáng tin.\" cô ấy nắm tay bạn.",
        "\"Dù thế giới biến thành thế nào, chỉ cần ở bên bạn, đâu cũng là vườn hoa.\"",
        "\"Cảm ơn bạn, để tôi tin rằng thế giới này vẫn còn thứ đáng để bảo vệ.\" cô ấy tựa vào vai bạn."
      ]
    },
    tips: [
      "【Gợi ý】Hạt giống có thể mua tại Miao Miao, cũng có thể nhận được qua chăm sóc ruộng thí nghiệm.",
      "【Gợi ý】Các loại cây khác nhau thời gian chín và sản lượng khác nhau, lập kế hoạch trồng hợp lý rất quan trọng.",
      "【Gợi ý】Thương nhân chợ đen thỉnh thoảng cũng bán hạt giống, nhưng giá đắt hơn.",
      "【Gợi ý】Trồng gì được nấy, chọn cây trồng sản lượng cao có thể sử dụng ruộng hiệu quả hơn.",
      "【Gợi ý】Thường xuyên đến chăm sóc ruộng thí nghiệm, có thể tích lũy độ thiện cảm còn nhận hạt giống miễn phí."
    ]
  }
];

export const NAMED_NPCS = {
  ma_san: { name: "Mã Tam", hp: 300, damageMin: 40, damageMax: 60, hasRanged: true, dodgeRate: 0.4 },
  shadow: { name: "Hắc Ảnh", hp: 400, damageMin: 50, damageMax: 80, hasRanged: true, dodgeRate: 0.5 },
  zombie_king: { name: "Vua Zombie Im Lặng", hp: 420, damage: 115, hasRanged: false, dodgeRate: 0.25 },
  banker: { name: "Ngân Hàng Hàng Trưởng", hp: 350, damageMin: 50, damageMax: 80, hasRanged: false, dodgeRate: 0.3 },
  leader: { name: "Trưởng Trận Địa", hp: 400, damage: 110, hasRanged: false, dodgeRate: 0.25 },
  giant_puppet: { name: "Cỗ Rối Khổng Lồ", hp: 380, damage: 105, hasRanged: false, dodgeRate: 0.20 },
  football_zombie: { name: "Zombie Bóng Bầu Đục", hp: 250, damageMin: 30, damageMax: 55, hasRanged: false, dodgeRate: 0.15 },
  diving_zombie: { name: "Zombie Lặn", hp: 200, damageMin: 35, damageMax: 55, hasRanged: true, dodgeRate: 0.15 },
  sea_monster: { name: "Hải Thần Khổng Lồ", hp: 600, damage: 80, hasRanged: false, dodgeRate: 0.08 },
  king_boss: { name: "Vua Lâu Đài", hp: 450, damage: 100, hasRanged: false, dodgeRate: 0.2 },
  zhao_boss: { name: "Lão Bin Lão Triệu", hp: 350, damageMin: 70, damageMax: 90, hasRanged: true, dodgeRate: 0.3 },
  doctor_boss: { name: "Tiến Sĩ Trần", hp: 300, damageMin: 50, damageMax: 70, hasRanged: true, dodgeRate: 0.35 },
};

export const BOSS_NAMES = Object.values(NAMED_NPCS).map(npc => npc.name);
