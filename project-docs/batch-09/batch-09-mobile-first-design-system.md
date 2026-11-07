# Batch 10 — Đề xuất hệ thiết kế Mobile-First

Ngày: 2026-11-07. Trạng thái: **Đề xuất trong Stage A, chưa triển khai Stage B.**

**Cập nhật sau phê duyệt:** Field Terminal đã được triển khai tại `css/ui/` và `js/presentation/`. Bản mô tả phía dưới giữ lại quyết định thiết kế ban đầu; actual implementation và sai khác/giới hạn được ghi ở final acceptance report. Tokens thực tế nằm trong `css/ui/tokens.css`, screenshot trong `screenshots/`.

## 1. Bản sắc: Field Terminal

Một bộ thiết bị sinh tồn dã chiến trong thế giới hậu tận thế: mặt nền than đen, vật liệu thép xước nhẹ từ asset hiện có, dấu đánh dấu chiến thuật tiết chế, cảnh môi trường có chiều sâu và nội dung truyện rõ ràng. Không dùng bố cục dashboard bốn vùng, sidebar desktop thu nhỏ, màu neon tràn lan hay phong cách nông trại.

Ảnh môi trường và nhân vật tiếp tục dùng asset local. Phân lớp scene và bề mặt đọc gần đục; không để chữ dài trực tiếp trên nền ảnh nhiều chi tiết. Không sinh/thay asset trong Stage A.

## 2. Token đề xuất

Tên dưới đây là contract thiết kế tương lai, không phải CSS đã được thêm:

- Nền `--ui-bg: #0B1010`; surface `--ui-surface: #151D1C`; raised `--ui-surface-raised: #202B28`; stroke `--ui-border: #3B4A44`.
- Chữ chính `--ui-text: #F0F3E9`; phụ `--ui-text-muted: #B6C2B7`.
- Tương tác chính `--ui-accent: #D1E58B` đi với chữ tối, không chữ trắng trên accent sáng.
- HP/ổn định `--ui-health: #9ACD9C`; thiếu nước/info `--ui-water: #8FC9DC`; cảnh báo `--ui-warning: #E8BC74`; nguy hiểm `--ui-danger: #F28B82`.
- Infection giữ nhãn/mã riêng, có thể dùng danger + ký hiệu biohazard; không thêm một phổ màu cho từng stat.
- Màu UI không thay ngưỡng, probability hay trạng thái engine. Độ tương phản phải đo khi Stage B: text thường >=4.5:1, chữ lớn >=3:1, control/focus >=3:1. Chưa xác nhận palette đạt trong mọi phối hợp.
- Khoảng cách theo bội 4: 4/8/12/16/24/32px; gutter mobile 12px ở 320px, 16px từ 360px; radius control 6px, panel 10px, sheet 16px ở góc trên.
- Touch target tối thiểu 44×44 CSS px cho cả icon/close/filter/stepper/tab; CTA chính cao 48–52px, cách nhau >=8px. Không dùng icon 20px làm toàn vùng chạm.
- Font nội dung: system sans có tiếng Việt, 16px/1.65; label 14px; metadata không thiết yếu 12–13px; heading 20/24/30px. Monospace chỉ cho số/chỉ số ngắn; không ép toàn truyện thành terminal monospace. Input >=16px. Không nạp font bên ngoài làm điều kiện render.

## 3. Hệ layout mới

Mobile là CSS mặc định, không phải một khối max-width override phía cuối CSS cũ.

- **320–767px:** một cột, chỉ một màn nội dung chính tại một thời điểm. HUD gọn, scene/narrative hoặc management screen, action vùng ngón cái, bottom navigation có nhãn.
- **768–1023px:** cùng screen hierarchy; mở rộng danh sách + detail khi đủ chỗ, không đồng thời nhét mọi hệ thống.
- **1024–1279px:** chiều rộng đọc có giới hạn, secondary detail tùy screen, không tự trở về bố cục cũ.
- **>=1280px:** scene + narrative hoặc list + detail hai vùng theo ngữ cảnh; max line-length khoảng 65ch. Desktop vẫn là game, không khôi phục dashboard bốn vùng.
- `100dvh` với fallback phù hợp; grid shell có hàng HUD / nội dung `minmax(0,1fr)` / contextual actions / navigation. Các màn dài có một scroll owner; story log không tạo thêm scroll vùng con.
- Bottom navigation và action area có `env(safe-area-inset-bottom)`; top/left/right cũng bảo vệ notch. Không cộng safe-area trùng ở body, shell và control.
- Keyboard: ưu tiên `visualViewport` nếu cần bổ sung dvh, giữ input/CTA trong vùng nhìn, giảm/hide nav thuần UI khi keyboard mở, không ép focus sau mỗi tap. Phải kiểm tra iOS/Android thật trước tuyên bố hoàn thành.
- Landscape thấp chuyển scene sang compact, giữ nội dung và controls; không khóa xoay hoặc tắt user zoom.
- Không dùng `overflow-x:hidden` để che lỗi kích thước: dùng min-width:0, wrap tên dài, intrinsic sizing và bounds assertions.

## 4. Điều hướng chính đề xuất

Thanh dưới có bốn mục, đều là **presentation routes**, không phải phase gameplay:

1. **Hiện trường:** cảnh và interaction đang diễn ra: căn cứ, ngoài trời, NPC, exploration hoặc combat/result theo Core.
2. **Hành trang:** Túi / Trang bị / Hồ sơ. Chỉ thay view khi xem; dùng/equip/drop gọi đúng entry point cũ, không bổ sung đặc quyền mới.
3. **Hồ sơ:** ghi chú sinh tồn, tiến độ nhiệm vụ đã biết, thành tích và kỷ lục. Đọc dữ liệu không nhận/nộp quest từ xa.
4. **Hệ thống:** save/load qua guard cũ, cài đặt, tra cứu xác suất, bách khoa, About và devtools entry hiện hữu.

Bản đồ là công cụ ngữ cảnh ở Hiện trường, không là nút teleport luôn bật. Khi Core cung cấp goOut/select_map/goHome, action liên quan đi qua option/handler đó. Map tham khảo nếu thêm chỉ đọc và không dùng phase giả trên canonical state.

Trong encounter/death/confirmation, interaction phải bám phase: view đọc có thể quay lại mà không hủy nhánh; không expose thêm mutation hoặc Save đang bị chặn. Nút Back hệ thống đóng sheet thuần trước, rồi quay presentation route; nếu muốn rời interaction gameplay phải dùng option rời thật. Không restore snapshot state để giả Back.

## 5. Thành phần dùng chung

- **AppShell:** landmark header/main/nav, skip link; không giữ gameplay state.
- **SurvivalHUD / VitalIndicator:** tên, số, bar và cảnh báo có text; mở hồ sơ từ vùng chạm đủ lớn.
- **SceneViewport:** host Pixi sống xuyên điều hướng; fallback DOM khi WebGL/asset lỗi, không ảnh hưởng choices.
- **NarrativePanel:** giữ văn bản/nội dung gốc, hỗ trợ đoạn dài, chữ Việt, text zoom; không tự cuộn nếu đang đọc phía trên.
- **OptionButton / ActionDock:** semantic button có số lựa chọn thật, label/disabled reason; một action nổi bật nếu xác định chắc chắn, các action khác không bị mất. Danh sách dài mở full screen, không nhồi một dock cao che truyện.
- **ItemCard / ItemDetails / EquipmentSlot:** metadata thật, trạng thái trang bị và stock; selected item handle chỉ có vòng đời presentation và được resolve lại khi submit.
- **QuantityControl:** stepper và numeric input; domain lấy từ options/entry point cũ, không tự cho phép batch command mới.
- **ServiceCard / RecipeCard / CropSlot / QuestDetail:** cùng primitive nhưng bố cục theo dịch vụ gameplay, không biến mọi screen thành lưới card giống nhau.
- **Sheet / Dialog / FullscreenPanel:** một manager quản lý mở/đóng, focus trap, restore focus, aria-modal/inert background, scroll lock và stack. Không overlay chồng vô hạn.
- **StatusMessage / Toast:** aria-live polite cho feedback, lỗi quan trọng có vùng alert; không announce toàn bộ combat log sau mỗi render.
- **EmptyState / LoadingState / ErrorState:** biểu đạt tình huống thật và đường thử lại thật; không nút placeholder.

## 6. Bố cục đại diện cần prototype ở Stage B

- Title/profile: một scene có chiều cao giới hạn, title/CTA, form từng nhóm thay các panel dồn cùng màn.
- Field: HUD → địa điểm/scene → truyện → lựa chọn → bottom nav. Dài thì cuộn nội dung, CTA không che dòng cuối.
- Encounter: enemy/khả năng → chuẩn bị và weapon info → choices Core; result riêng với summary/log thật.
- Hành trang: capacity + tìm/lọc → list hoặc grid dễ đọc → item detail sheet + CTA; equipment/profile là subview, không sidebar.
- Kho: source switch Túi/Kho → list → selected detail → transfer; lối gửi hàng hóa cũ vẫn truy cập được.
- Save/settings: list toàn màn, destructive confirmation tách biệt; keyboard và focus kiểm soát được.
- Tools: reader list/details, filter sheet và search; không dense table/sidebar trên điện thoại.

Prototype phải dùng fixture/state thật và đầy đủ lựa chọn, nhưng không được bấm nút giả như chức năng đã hoạt động. Chỉ xây khi được phê duyệt Stage B.

## 7. Accessibility, chuyển động và hiệu năng

- Semantic buttons thay clickable div; labels thật cho name/password/quantity; fieldset/legend cho nhóm chọn.
- Focus visible, logical tab order, Escape đóng overlay thuần, Enter/Space hoạt động; roving tabindex chỉ cho tablist thật.
- Disabled state có lý do đọc được; không chỉ màu. Tên dài không cắt mất thông tin mà không có cách xem đầy đủ.
- 200% zoom/text scaling, reduced-motion, touch và keyboard đều có đường thao tác tương đương map canvas qua DOM list.
- Transition 120–180ms cho opacity/transform; không animation layout dài, flashing hay delayed RNG. Reduce-motion loại bỏ animation không thiết yếu.
- Một Pixi app, reuse textures, DPR cap hiện tại, không tạo ticker/listener theo mỗi view; chỉ rerender vùng cần sau command, không đánh mất focus/scroll do full innerHTML.
- Load asset theo screen và viewport, không preload toàn bộ icon lớn; không thêm dependency/framework. Đo trước/sau trên cùng fixture trước khi tuyên bố không regression hiệu năng.

## 8. Tiêu chí duyệt Stage B

Kiểm tra thực ở 320/375/430px: không horizontal overflow, mọi hit target >=44px, text/narrative đọc được, sheet không che CTA, keyboard không che input, map có DOM fallback, toàn bộ option vẫn tới được. Cần cả trạng thái text dài, inventory đầy và dialog; screenshot màn menu đơn lẻ không đủ. Chưa có xác minh hay screenshot UI mới ở Stage A.
