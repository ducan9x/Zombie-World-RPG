# Batch 10 — Stage A: Kiểm toán kiến trúc UI và ranh giới Game Core

Ngày: 2026-11-07. Commit tham chiếu: `455eb65c63d9aa7a7344b41fb29798dffbda4b19`.

**Chỉ kiểm toán và đề xuất. Chưa triển khai giao diện, chưa thay đổi mã nguồn.**

**Ghi chú lịch sử:** Đây là snapshot Stage A trước triển khai. Người dùng sau đó đã phê duyệt refactor; xem `batch-09-final-acceptance-report.md` cho kết quả thực hiện. Những câu “chưa triển khai” bên dưới mô tả thời điểm audit, không phải trạng thái ứng dụng hiện hành.

Tên công việc là Batch 10; thư mục và tên file `batch-09` được giữ đúng yêu cầu bàn giao, không có nghĩa đây là phần tiếp nối thiết kế Batch 09. Batch 09 cũ bảo toàn dashboard desktop; đề xuất này không bị ràng buộc bởi dashboard đó. Không sửa hoặc ghi đè báo cáo Batch 09 trong `docs/`.

## 1. Phạm vi và mức độ xác minh

- Kiểm kê 122 module JavaScript, shell HTML, CSS, công cụ HTML/CSV, luồng khởi động, dispatcher, persistence, PixiJS và 13 file kiểm tra.
- Quét tĩnh tìm được 87 giá trị literal trong lời gọi `setPhase()` và 444 nhãn literal `action:` duy nhất. Đây không phải số màn hình hay số tính năng: nhiều thao tác dùng chung phase; có phase động và action động.
- Đọc các điểm phân phối, các đường mutation UI, định tuyến, save/load, gameplay và các nhóm dữ liệu liên quan; đối chiếu tài liệu kiến trúc, feature inventory, roadmap và báo cáo Batch 09.
- Chạy kiểm tra trong bản sao tạm có source/test/config giống workspace; xem báo cáo regression cùng thư mục. Chưa thao tác browser, chưa xác minh thiết bị thật, chưa đo FPS/bộ nhớ.
- Workspace lúc bắt đầu đã có thay đổi tại `scratch/harness_phase09_4.html` và `scratch/harness_phase09_5.html`. Giữ nguyên, không diễn giải chúng là thay đổi của Stage A.

## 2. Kiến trúc thực tế

### Luồng điều khiển

1. `index.html` nạp PixiJS local v7.4.3, `js/main.js` và `tools/devtools-auth.js`.
2. `main.js:init()` đăng ký autosave slot 0, gọi `initUI()`, pagination, nhập lựa chọn, `renderAll()`, rồi khởi tạo Pixi singleton.
3. `getState()` trả về state mutable duy nhất. `phase`, `story`, `options` là giao thức gameplay hiện hữu, không phải router màn hình thuần UI.
4. `handleAction(input)` trong `js/game/index.js` dùng chỉ số **1-based của options hiện tại**, kiểm tra disabled, phân phối theo phase và kiểm tra kết cục/tử vong sau hành động.
5. `js/game/exploration.js:handleExploreAction()` tiếp tục phân phối theo `option.action` đến sự kiện, NPC, đảo, thành, outpost. Không suy ra một action label luôn là một command toàn cục.
6. `renderAll()` cập nhật DOM, túi đồ và Pixi. Các trang settings/records/tools/about còn điều khiển bằng `style.display`, ngoài state machine.
7. Một số tương tác bỏ qua dispatcher: item detail gọi `executeInventoryAction()`; kho gọi `depositBackpackItem()`/`withdrawWarehouseItem()`; tạo nhân vật gọi reset/name/appearance/phase trực tiếp. Phải giữ những đường xử lý này trong phạm vi bảo toàn hành vi.

### Game Core cần khóa hành vi

- `js/state.js`: thời gian, sinh tồn, vật phẩm, trang bị, tiền tệ, affinity, normalization, settings.
- `js/config.js`, `js/data/**`: công thức, xác suất, nội dung, vật phẩm, recipes, bản đồ, các hằng số.
- `js/combat.js`, `js/game/**`, `js/maps.js`, `js/map-events/**`: combat, encounters, progression, navigation, endings.
- `js/equipment.js`, `js/trading.js`, `js/base.js`, `js/farming.js`, `js/faction.js`, `js/npcs/**`, `js/castle/**`, `js/outpost/**`, `js/island/**`: hệ thống gameplay và các menu tạo options.
- `js/save.js`, `js/game/save.js`: storage và điều kiện truy cập/lưu/tải.
- **Phần logic trong `js/inventory-ui.js` và `js/warehouse-ui.js` cũng là hành vi có thẩm quyền**, dù tên file có chữ UI. Không xóa chúng cùng renderer cũ.

## 3. Kiểm kê màn hình, phụ thuộc và thiết kế thay thế

Quy ước xác minh dùng chung cho từng mục: từ cùng state đầu vào và cùng chuỗi RNG, lựa chọn trên UI cũ/mới phải gọi cùng handler đúng một lần, tạo cùng state gameplay, story/options, thời gian và storage. Mở/đóng một view thuần trình bày không được tiêu hao lượt, đổi phase hoặc RNG. Các kiểm tra dưới đây là **kế hoạch**, chưa phải kết quả nghiệm thu.

### 01. Menu chính và hồ sơ nhân vật mới

- Hiện tại: `index.html:#name-setup`, `ui.js:initUI/initAppearanceUI`; `resetState`, `setName`, `setPlayerAppearance`, `setPhase('choose')`, cấu hình `data/player-appearance.js`, music.
- Mới: màn title toàn chiều rộng với cảnh môi trường, New Game/Load là hai hành động chính; form hồ sơ riêng với portrait và nhóm chọn tuổi/giới tính/trang phục, tên có label thật.
- Luồng: chọn ngoại hình và tên → xác nhận bắt đầu theo trình tự cũ; không thêm class, perk, bonus, EXP hoặc bước tạo state khác.
- Xác minh: tên rỗng, Enter, giới hạn tên hiện tại, đủ 30 ngoại hình, reset đúng lúc và nhạc chỉ khởi động từ tương tác hợp lệ. Preview ngoại hình hiện đã gọi setter; không tự chuyển thành giao dịch commit mới mà chưa kiểm tra parity.

### 02. HUD sinh tồn, tài nguyên và trạng thái

- Hiện tại: `ui.js:renderStats/renderCargo/renderIdentity/renderMobileSurvivalHUD`; state `health/hunger/hydration/crash/sanity/infection/status/day/phaseIndex/weather/location`, tiền tệ, identity từ `faction.js`.
- Mới: HUD gọn trên cùng, HP/no/nước luôn đọc được; cảnh báo nhiễm/mệt/lý trí có nhãn và số; chạm mở hồ sơ đầy đủ, không ẩn mất tài nguyên khác.
- Xác minh: đầy đủ giá trị thật, không thay ngưỡng gameplay bằng ngưỡng màu UI; mở chi tiết không advanceTime/checkDeath hay mutation.

### 03. Căn cứ và lựa chọn sinh tồn

- Hiện tại: phase `choose`; `routing.js:showHomeOptions`, `game/index.js:handleChooseAction`, các handler sleep/eat/drink/medicine/goOut/save/base/partner/notes.
- Mới: cảnh nơi trú với hành động ngữ cảnh ở vùng ngón cái; quản lý cơ sở tách khỏi chuyện kể nhưng mọi lựa chọn vẫn truy cập được.
- Luồng: nút tương ứng option hiện tại → dispatcher; mưa axit vẫn chặn ra ngoài.
- Xác minh: ngủ và các chi phí vẫn nguyên, thu hoạch đồng đội và notes không bị mất khi nhóm lại menu.

### 04. Ăn, uống, thuốc và chọn số lượng

- Hiện tại: `game/consumables.js`, phase `eat_select/drink_select/medicine_select`; thêm đường item detail trong `inventory-ui.js`.
- Mới: danh sách vật tư có số lượng/hiệu ứng, chi tiết dạng sheet, nút dùng nằm dưới; input số tùy chọn vẫn tồn tại nếu bật input mode.
- Xác minh: bảo toàn từng entry point riêng; giới hạn kiệt sức, effects, cập nhật status và death; không tự gọi cả handler option lẫn consumeItem.

### 05. Khám phá và sự kiện tường thuật

- Hiện tại: `game/exploration.js`, `routing.js`, `maps.js`, `map-events/**`; `explore/explore_action/robber_event`, `story/options/currentMap`, cờ nhiệm vụ/cooldown.
- Mới: một màn Field với cảnh địa điểm, nội dung truyện ưu tiên đọc, lựa chọn trong luồng và action chính gần đáy; danh sách lựa chọn dài mở thành trang đầy đủ.
- Luồng: đọc → lựa chọn nguyên bản → handler → hiển thị kết quả. Không prefetch sự kiện hay gọi gameplay để dựng preview.
- Xác minh: gặp NPC/zombie, cướp, loot rỗng, sương mù, hạn ngày, túi đầy; giữ nguyên nội dung/nhánh và thứ tự RNG.

### 06. Bản đồ thế giới và di chuyển

- Hiện tại: `game/navigation.js:handleGoOut/handleMapAction/handleGoHome`, phase `map_select`; `map-renderer.js:selectPOI`, `pixi-renderer.js`, `data/maps/**`; hidden maps và options hiện tại.
- Mới: màn sa bàn riêng, toolbar lớn, danh sách địa điểm DOM tương đương và tấm thông tin POI; di chuyển chỉ từ command hiện hữu. Mở bản đồ tham khảo không đồng nghĩa ra ngoài/di chuyển.
- Xác minh: map IDs, điều kiện hidden, thời gian đi/về, sanity chặn về nhà, kết cục khi về, entry thành/đảo; POI và list chọn cùng option index, không tự mở khóa điểm đến.

### 07. Trước trận và kết quả chiến đấu

- Hiện tại: `combat.js:handlePreCombatChoice/handlePreCombatNpcChoice`, vòng while tính cả trận; phase `pre_combat/pre_combat_npc/combat`, `_pendingZombie/_pendingNpc/_lastCombatEnemy`; `combat-hud.js` phân tích story/log.
- Mới: màn encounter riêng với enemy art, khả năng và lựa chọn cận chiến/tầm xa/chạy thực sự được Core cung cấp; sau resolve là bản tổng kết và nhật ký trận có thể mở rộng.
- Không thêm nút Attack/Defend/Skill theo lượt: engine hiện không chờ người chơi mỗi round. Không giả lập HP từng frame như dữ liệu engine chính xác khi log không có dữ liệu đó.
- Xác minh: RNG, thứ tự lượt, đạn, độ bền, nhiễm, ally, boss, chạy thoát/thất bại, rewards/death/endings; animation chỉ trình bày kết quả đã tính, không chạy lại trận.

### 08. Túi đồ và chi tiết item

- Hiện tại: `inventory-ui.js:getAllInventoryItems/filterItemsByTab/findItemLiveLocation/executeInventoryAction`; các mảng food/drinks/medicine/other/seeds/ammo và trang bị đang dùng; 7 bộ lọc.
- Mới: tab Túi thuộc màn Hành trang, danh sách/thẻ nhỏ dễ đọc, filter sheet thay dải quá dài; sheet chi tiết với ảnh lớn, thuộc tính và đúng action khả dụng.
- Xác minh: item cùng ID nhưng khác durability/integrity phải thao tác đúng reference; rapid taps, stack cuối, stale selection sau load, sorting/filter không làm lệch index; giữ tất cả actions hiện có.

### 09. Trang bị, nạp đạn và hồ sơ

- Hiện tại: `equipment.js`, `state.js:equipMelee/equipRanged`; `equip_select/melee_equip/ranged_equip/ammo_load/backpack_equip`, direct actions của inventory; identity/stats/cargo UI.
- Mới: Hành trang gồm Túi/Trang bị/Hồ sơ; slot lớn, so sánh chỉ số từ item thật; nạp đạn chỉ theo options hiện hữu.
- Xác minh: hoán đổi từng bản sao vũ khí, tháo súng/tay không, đổi túi có đủ sức chứa, ammo; không tự thêm skill tree/level/EXP vì chưa có subsystem tương ứng.

### 10. Vứt bỏ và xác nhận phá hủy

- Hiện tại: `equipment.js:handleDiscard*` và `inventory-ui.js:openDiscardModal/executeInventoryAction`; phase `discard_select/discard_quantity`; modal `#discard-confirm-modal`.
- Mới: confirm sheet có tên, ảnh, số lượng, cảnh báo rõ ràng, cancel mặc định, stepper >=44px.
- Xác minh: confirm đúng một lần, Escape/backdrop không mutation, item không tồn tại, chọn tất cả, không thao tác nhầm stack sau rerender. Giữ khác biệt giữa hai entry point nếu hiện có.

### 11. Xây dựng và nâng cấp

- Hiện tại: `game/base-actions.js`, `base.js`; `base_build/base_upgrade_confirm/warehouse_upgrade_confirm`; BASE_LEVELS/WAREHOUSE_LEVELS, vật liệu, thời gian.
- Mới: trang cơ sở với từng công trình, chi phí và trạng thái hiện tại, màn xác nhận nâng cấp riêng; không phải dashboard nông trại.
- Xác minh: thiếu vật liệu, max level, chi phí, thời gian, recovery bonus và achievement giữ nguyên; preview dùng dữ liệu, không gọi mutation handler.

### 12. Kho căn cứ

- Hiện tại: `base.js:handleOpenWarehouse/handleDoDeposit/handleDoWithdraw`, `warehouse-ui.js:depositBackpackItem/withdrawWarehouseItem`; `warehouse_menu/warehouse_deposit_select/warehouse_withdraw_select`.
- Mới: fullscreen logistics, chuyển nguồn Túi/Kho bằng segmented control; chi tiết item và chuyển 1/tất cả nếu entry point cũ hỗ trợ; tài nguyên hàng hóa vẫn có lối truy cập.
- Xác minh: sức chứa kho đếm entries khác sức chứa túi, merge stack, partial transfer, túi/kho đầy, ammo/equipped exclusions và hàng hóa. **Không hợp nhất hai thuật toán kho**: modal và menu hiện có phạm vi/stack semantics khác nhau.

### 13. Trồng trọt và khu thử nghiệm

- Hiện tại: `farming.js:handlePlantCrop/handleSeedSelect/handleViewCrops/handleHarvestCrops`; `seed_select`, crops/seeds; `npcs/mumiao.js:handleMumiaoBuySeeds/handleMumiaoTendField`.
- Mới: các ô đất dạng danh sách trạng thái, chọn hạt qua sheet, CTA thu hoạch theo hành vi cũ; đất thử nghiệm của NPC là interaction ở đúng địa điểm.
- Xác minh: 5 ô theo hằng số hiện tại, matureTurns, thời gian trồng, partial harvest do túi đầy, giới hạn chăm mỗi ngày và phần thưởng RNG.
- Không tìm thấy hệ thống quản lý nhà kính độc lập: không dựng nút nhà kính giả hoặc thêm cơ chế mới; giữ chức năng ruộng/đất thử nghiệm đã có.

### 14. Công thức, chế biến, sửa chữa và tái chế

- Hiện tại: `island/linhan.js:handleLinhanCook/handleLinhanCookMeal`, `data/items/seafood-meals.js:SEAFOOD_MEAL_RECIPES`; `npcs/index.js:handleNpcRepair/handleRepairConfirm/handleLiliRepair*` và recycle/cure; thiết bị huyết thanh tại `map-events/doctor.js`.
- Mới: recipe cards/nguyên liệu/sản phẩm trong dịch vụ đúng NPC; sửa chữa/tái chế là action sheets có chi phí và xác nhận; không thêm hệ crafting tổng quát.
- Xác minh: fish rarity, chi phí từ constants, thứ tự trừ nguyên liệu/addItem, thời gian, túi đầy; giá và effects sửa/thu hồi/chữa nhiễm không đổi. FEATURE-INVENTORY cũ nói không có crafting là thiếu trường hợp chế biến này.

### 15. Giao dịch, barter và thương nhân ngẫu nhiên

- Hiện tại: `trading.js:handleTradeChoice/handleTradeInput`; `combat.js:handleWanderingTraderAction/handleTraderBuyAmmo/handleTraderBuyWeapon/handleSurvivorAction/handleDoctorAction`; `trade_choice/trade_input/trader_* /survivor_interact/doctor_interact`.
- Mới: offer cards, màn số lượng ánh xạ đúng options count, phần đổi/nhận rõ ràng; rời giao dịch cũng phải gửi đúng action Core nếu có chi phí lượt.
- Xác minh: giá, hàng/RNG đã tạo, số lượng lựa chọn, capacity, cancel có tiêu hao thời gian; không nhập số lượng tùy ý vượt domain Core cung cấp.

### 16. NPC, affinity, tặng quà, nhiệm vụ và dịch vụ

- Hiện tại: `npcs/index.js`, `npcs/v.js/xiaohan.js/lili.js/mumiao.js/map-npcs.js`; phase động `npc_` + npcId; giftItem/currentNpc, quests, affinity, daily counters, trade cooldowns.
- Mới: portrait, thoại và action list phân nhóm; quest preview có yêu cầu/phần thưởng từ dữ liệu thật; gift selection dùng sheet; không chuyển thành hội thoại mới hay thay văn bản.
- Xác minh: daily chat, thưởng affinity, nhánh secret, nhận/nộp quest, quest preview/back, từng loại recycle/repair/cure, cửa hàng V/Tiểu Hàn/Lili và map NPC.

### 17. Nhật ký nhiệm vụ và ghi chú sinh tồn

- Hiện tại: `game/notes.js:buildSurvivalNotes/handleSurvivalNotesAction`, SURVIVAL_NOTES; `npcs/index.js:getQuestProgress/canSubmitQuest/getAvailableQuest`; cờ riêng trong state và các module story.
- Mới: tab Hồ sơ trong thanh dưới chứa ghi chú/tiến độ đã biết; chỉ tổng hợp cờ đã có, không gọi interaction để khám phá nhiệm vụ, không tiết lộ achievement bí mật.
- Xác minh: hạn cứu Liu Ruyan, các điều kiện newforce, oldMaStep, kingQuestsDone, flags của doctor/wolf/Yumo; nhận/nộp vẫn ở đúng NPC và phase. Chưa có quest manager thống nhất, không tạo state quest thứ hai.

### 18. Dawn Outpost, công việc và phe phái

- Hiện tại: `outpost/menu.js/work.js/leader.js/assassinate.js`, `faction.js`; `explore/npc_leader/leader_gift_select/leader_assassinate/leader_assassinate_warn`.
- Mới: hub địa điểm với khu Dịch vụ/Chỉ huy; xin vật tư, làm việc, trading post, collection, honor/recorder/join/quit/claim vẫn qua options cũ.
- Xác minh: identity, cooldown, tiền/thời gian, quest và assassination confirmations; không mở dịch vụ từ xa bằng bottom nav.

### 19. Thành bảo, triều đình và ngân hàng

- Hiện tại: `castle/outpost.js/interior.js/identity.js/bank.js/services.js/royalty.js/king-quest.js`, barrel `castle/index.js`; rank, debt, daily flags, story branches.
- Mới: hub thành và từng dịch vụ fullscreen, role/rank trong hồ sơ; guard, bribe, identity, loan/repay/waiver, treatment, work, garden, meeting, banquet, ball, room, salary, royal trade/shop/exchange, king/queen quests và underground vẫn đủ.
- Xác minh: phí vào cửa, exclusivity identity, thứ hạng, lãi/hạn vay, daily gates, assassination king/banker và endings; Back không mặc định teleport ra khỏi thành.

### 20. Đảo và nền kinh tế

- Hiện tại: `island/index.js/bar.js/street.js/black-market.js/intel.js/invest.js/fishing.js/yumo.js/guyue.js/linhan.js`; island/sub-phases và `_barAction/_streetAction/_investAction`, debt/investment/affinity.
- Mới: location hub → dịch vụ riêng: bank, bar, các shop vũ khí/đạn/thu hồi đạn/food/medical, chợ đen, intel, đầu tư, welfare, tàu xăng, nghỉ, câu cá, Yumo/Guyue/Lâm Hàn.
- Xác minh: điều kiện đến/rời đảo, lãi, đầu tư RNG và kỳ hạn, refresh chợ đen, giá xăng, royalty/welfare, fishing/seafood, NPC quests; không mở commerce toàn cầu ngoài vị trí.

### 21. Toàn bộ nhóm sự kiện địa điểm

Tất cả dùng màn Field/Dialogue/Encounter theo options, không bị loại vì không có HTML riêng. API nguồn là các hàm `handle*` trong các file sau, gọi qua `game/exploration.js`, `maps.js` và barrel `map-events/index.js`:

- `barn.js`: hái quả; `village.js`: hang, hạt mốc, ruộng bỏ hoang.
- `campsite.js`: lều, đi vào/tìm kiếm/rời, thi thể; `lookout.js`: leo tháp, nhìn/đào mộ.
- `factory.js`: khám phá/xưởng; `harbor.js`: sông/du thuyền; `police.js`: raid/hồ sơ; `tunnel.js`: khám phá/chờ Lão Mã.
- `warehouse.js`: guard/trade/confirm và chuỗi oldMa; `mechanic.js`: thoại/đổi vật phẩm/xăng/confirm.
- `outlaw.js`: nhà hàng/tiêu thụ/tủ đồ, thức ăn lạ, chấp nhận/từ chối/đánh/rời; `supermarket.js`: masked man và contraband.
- `nurse-zombie.js`: tương tác/cho ăn/chọn/đưa về; `partner-harvest.js`: thu hoạch đồng đội.
- `liuruyan.js`: phát hiện/tiêm/bỏ qua/đánh, classroom/seat/accept/reject và quest battle.
- `veteran.js`: trò chuyện/đạn/đánh Zhao; `doctor.js`: chat/trade, rocket consult/quest submit, serum/energy well/kill.
- `rocket.js`: launch center/puppet/repair/các lựa chọn kết cục; `zombie-king.js`: boss.
- `electro-tank.js`: cá/confirm/chạm/rời; `wolf.js`: chat/trade/4 quests/property warehouse/mermaid/lightning/thunder; `robber.js`: encounter/continue.
- Xác minh cho từng nhóm: khóa truy cập, cooldown ngày, item và reward, death/ending interrupt, return target và mọi option kể cả nhánh từ chối. Không đổi nội dung để làm UI gọn hơn.

### 22. Save/load, ghi đè và xóa

- Hiện tại: `game/save.js:handleSavePage/handleSavePageAction/handleSaveConfirm`, `save.js:getAllSlots/loadGame/saveGame/deleteSlot`; `save_page/save_confirm`, 11 slots, slot 0 autosave.
- Mới: danh sách slot dạng thẻ với metadata, detail và cảnh báo thao tác phá hủy; truy cập qua gateway cũ để không bypass transient phase guards.
- Xác minh: empty/corrupt/old saves, slot 0 không ghi/xóa thủ công qua UI, slot 1–10 đủ thao tác, overwrite/delete, load normalize rồi route theo currentMap; autosave mỗi 5 ngày giữ nguyên.

### 23. Thành tích và kỷ lục

- Hiện tại: `ui.js:renderAchievementPage/renderBestRecordPage`, `game/achievements.js`, ACHIEVEMENTS, `state.unlockedAchievements`, `save.js:getBestRecord/updateBestRecord`.
- Mới: hồ sơ sống sót/collection, nhóm thành tích và record detail đọc rõ; locked achievements tiếp tục ẩn thông tin như hiện tại.
- Xác minh: không unlock khi xem; đọc record snapshot không thêm field vào storage; không coi metadata thiếu là gameplay đã xảy ra.

### 24. Cài đặt, âm nhạc và cách nhập

- Hiện tại: `state.js:getGameSettings/toggleClickMode/toggleInputMode/toggleMusic`, `ui.js:*Music*`, key `zombieWorldGameSettings`; input số trong `main.js`.
- Mới: settings dạng list/switch có label; input phụ không tự focus sau mỗi tap; lỗi inline/dialog thay alert nhưng không đổi validation. Duy trì ít nhất một chế độ thao tác theo API cũ.
- Xác minh: settings cũ được đọc nguyên, bật/tắt click/input/music, numeric option trên mọi screen, media autoplay/error và tắt nhạc; không tự bật click mode cho save cũ để làm UI mới thuận tiện hơn.

### 25. Tra cứu xác suất, bách khoa và công cụ

- Hiện tại: `tools/probability.html` tải `tools_data/probability_data.csv`; `tools/encyclopedia.html` tải `tools_data/encyclopedia_data.csv`; iframe/player-tools trong `ui.js`; mở tab ngoài.
- Mới: reader fullscreen có tìm kiếm/filter sheet, các mục xác suất thay dense table bằng nhóm thuộc tính; bách khoa card/details; giữ standalone URLs và mở tab mới, không để iframe lồng cuộn thành UX cuối cùng.
- Xác minh: toàn bộ danh mục CSV/giá trị/công thức hiển thị giữ nguyên, search/empty/error/retry, served-local offline; không biến dữ liệu CSV thành engine xác suất mới. Đây hiện là công cụ tra cứu, không giả định có simulation calculator độc lập.

### 26. About, bản quyền và công cụ nhà phát triển

- Hiện tại: `index.html:#about-page`; `tools/devtools-auth.js` tạo overlay xác thực, mở `tools/index.html` (CSV cheat lookup/copy/toast); `main.js` xử lý `processCheatCommand` trước parse số.
- Mới: About trong System, giữ credits/license/links; dialog devtools cùng phong cách nhưng giữ kiểm tra và lối mở hiện hữu; command console/input vẫn có chức năng cũ.
- Xác minh: xác thực thành công/thất bại/empty/cancel/Escape, copy feedback, không bypass cổng truy cập, cheat command xử lý đúng một lần. Không coi client password là bảo mật server mới.

### 27. Game over, chiến thắng và các kết cục

- Hiện tại: `game/endings.js:triggerEnding/handleEndingAction`, ENDING_STORIES, gameOver/unlockedEndings/options; kiểm tra tự động cuối `handleAction`.
- Mới: màn kết cục riêng với art, story đầy đủ và chỉ các lựa chọn Core cung cấp; tổng kết từ stats thật.
- Xác minh: terminal endings chỉ restart, non-terminal có continue nếu options cho phép; phần thưởng/unlock/record chỉ một lần; nav không thoát death để tiếp tục trái luật.

### 28. Các overlay, thông báo và tương tác phụ

- Hiện tại: item detail inline, discard/warehouse overlays, devtools auth, browser alerts, save confirmations qua phase, tactical card/map hover, pagination/input, tooltip, notification qua story/status.
- Mới: một overlay manager cho sheet/dialog/toast, quản lý stack/focus/scroll; confirm gameplay đi qua option thật, toast không thay thế nội dung truyện; action list dài là full page.
- Xác minh: Escape/Back/backdrop chỉ đóng UI thuần; cancel có side effect vẫn gửi option tương ứng; focus trap/restore, screen reader, không click xuyên, không stale modal sau load/restart, không double-submit.

## 4. Registry phase cần bảo toàn

87 giá trị literal được nhóm dưới đây; grouping không tạo state machine mới:

- Shell/base: `main_menu`, `choose`, `base_build`, `base_upgrade_confirm`, `warehouse_upgrade_confirm`, `seed_select`.
- Item: `eat_select`, `drink_select`, `medicine_select`, `equip_select`, `melee_equip`, `ranged_equip`, `ammo_load`, `backpack_equip`, `discard_select`, `discard_quantity`.
- Field: `map_select`, `explore`, `explore_action`, `robber_event`, `nurse_feed`.
- Combat/encounter: `pre_combat`, `pre_combat_npc`, `combat`, `survivor_interact`, `doctor_interact`, `trader_interact`, `trader_buy_ammo`, `trader_ammo_qty`, `trader_buy_weapon`, `trade_choice`, `trade_input`.
- NPC: `npc_mumiao`, `npc_leader`, `npc_gift`, `npc_quest`, `npc_quest_preview`, `npc_recycle`, `npc_recycle_ranged`, `npc_recycle_backpack`, `npc_repair`, `npc_repair_bow`, `lili_repair_gun`, `lili_repair_bow`, `npc_cure`, `v_trade`, `v_trade_result`, `xiaohan_trade`, `lili_trade`, `map_npc`, `map_npc_trade`, `map_npc_gift_select`.
- Outpost: `leader_gift_select`, `leader_assassinate`, `leader_assassinate_warn`.
- Castle: `castle_guard`, `castle_bank`, `castle_identity`, `castle_interior`, `castle_loan_input`, `castle_banker`, `castle_banker_waiver`, `castle_treatment`, `castle_king_quest`.
- Island: `island`, `island_bank`, `island_bar`, `island_black_market`, `island_fishing`, `island_guyue`, `island_intel`, `island_invest`, `island_linhan`, `island_street`, `island_street_melee`, `island_street_ammo`, `island_street_ammo_recycle`, `island_street_food`, `island_street_medical`, `island_yumo`.
- Logistics/persistence/reference: `warehouse_menu`, `warehouse_deposit_select`, `warehouse_withdraw_select`, `save_page`, `save_confirm`, `survival_notes`, `ending`.

Ngoài literal producers, dispatcher còn nhận `npc_v/npc_xiaohan/npc_lili` từ `setPhase('npc_' + npcId)` và các case như `npc_chat/npc_quest_confirm/survival_notes_detail`. Giữ khả năng đọc phase cũ; không kết luận một phase không có literal producer là có thể xóa. Các view settings/records/achievements/about/player-tools và các modal không có phase riêng vẫn phải nằm trong registry trình bày.

## 5. Coupling và điều kiện dừng

1. `inventory-ui.js:618–796` chứa mutation, checks, live references, reordering item cùng ID, tháo súng/đổi túi trực tiếp. Hướng an toàn: adapter gọi nguyên public executor trước; chỉ tách phần trình bày với differential tests. Không chuyển sang một command inventory mới dựa trên suy đoán.
2. `warehouse-ui.js:407–502` chứa logic stack/transfer và gọi renderer/status DOM; `base.js:232–248` tự mở modal, tạo chu trình import base → warehouse-ui → base. Giữ facade/host tương thích hoặc tách side effect bằng cầu trình bày đã kiểm chứng; không sửa thuật toán kho. Nếu không tách an toàn được, dừng migration kho và xin duyệt dependency cụ thể.
3. `map-renderer.js` import cả dispatcher và `renderAll`, đồng bộ selector `.option-item[data-index]`. Thay callback presentation khi được duyệt, hoặc giữ contract tạm; không đổi map IDs/graph/travel logic. Đây là renderer có command coupling, không chỉ ảnh nền.
4. `combat-hud.js` nhận diện kết quả bằng nội dung log; không đủ dữ liệu structured cho replay chính xác mọi HP/round. Dùng log nguyên bản làm fallback, không ghi thêm combat state để hỗ trợ animation.
5. `game/save.js` chặn transient phases và load chuẩn hóa/routing; shortcut Save toàn cục không được bypass gateway.
6. Handler Back có thể advanceTime hoặc kích hoạt kết cục (`trade_back`, goHome). UI history không thể thay gameplay return bằng `setPhase` hay snapshot restore.
7. Nhiều action cùng label nhưng khác payload/context; chỉ số option thay đổi khi filter/page/state thay đổi. Dispatch phải resolve từ options hiện tại, không từ vị trí trên màn hình.
8. Narrative có hướng dẫn số lựa chọn (ví dụ intro nhắc lựa chọn 11). Phải giữ số tham chiếu option thật trong UI mới thay vì sửa story hoặc làm hướng dẫn vô nghĩa.

## 6. Các khoảng trống xác nhận và không được suy diễn

- Chưa có general crafting, skill tree, EXP/level hoặc greenhouse manager độc lập; có chế biến recipe Lâm Hàn, nâng cấp công trình, sửa chữa và đất thử nghiệm. Chỉ trình bày hệ thống thực tế, không thêm nút hứa hẹn chức năng chưa tồn tại.
- Chưa xác minh browser layout/touch/keyboard, old saves thực tế trên thiết bị, cold offline startup, performance hay mọi nhánh gameplay. 95 tests không phải chứng minh toàn bộ engine không lỗi.
- Google Fonts là network reference tại shell và một số tools. Local font/system fallback cần được xử lý khi triển khai; không thêm framework/CDN mới. Chạy local server không cần Internet khác với mở file:// hoặc cold-start hosted app offline; chưa có bằng chứng bảo đảm mọi chế độ đó.
- Tài liệu Batch 09 và feature inventory có drift; không lấy báo cáo 124/124 làm baseline tái lập.

## 7. Kết luận Stage A

Đề xuất viết lớp trình bày hoàn toàn mới, không kéo dài CSS 4-zone cũ. Vanilla JS và PixiJS local vẫn giữ; adapters bọc các handler hiện hữu, UI state tách khỏi save, contextual navigation không thay gameplay routing. Chi tiết tại tài liệu design system và migration plan cùng thư mục.

**Chờ phê duyệt trước Stage B/C. Chưa có màn hình nào được migration và chưa thể nghiệm thu UI mới.**
