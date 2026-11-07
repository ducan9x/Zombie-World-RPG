const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert/strict');

async function runTests() {
  console.log('====================================================');
  console.log('   TRANSACTIONAL AUTOSAVE & RECOVERY AUDIT SUITE    ');
  console.log('====================================================\n');

  // Cố định RNG trong môi trường VM (Deterministic Linear Congruential Generator)
  let seed = 987654321;
  const mockMath = Object.create(Math);
  mockMath.random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const context = vm.createContext({
    console,
    Math: mockMath,
    setTimeout,
    clearTimeout
  });

  const moduleCache = new Map();
  async function linker(specifier, referencingModule) {
    let resolvedPath = specifier;
    if (specifier.startsWith('.')) {
      const dir = path.dirname(referencingModule.identifier);
      resolvedPath = path.resolve(dir, specifier);
      if (!resolvedPath.endsWith('.js')) resolvedPath += '.js';
    } else {
      resolvedPath = path.resolve(process.cwd(), specifier);
      if (!resolvedPath.endsWith('.js')) resolvedPath += '.js';
    }
    resolvedPath = path.normalize(resolvedPath);
    if (moduleCache.has(resolvedPath)) {
      return moduleCache.get(resolvedPath);
    }
    const code = fs.readFileSync(resolvedPath, 'utf8');
    const mod = new vm.SourceTextModule(code, { identifier: resolvedPath, context });
    moduleCache.set(resolvedPath, mod);
    return mod;
  }

  const statePath = path.resolve(process.cwd(), 'js/state.js');
  const stateCode = fs.readFileSync(statePath, 'utf8');
  const stateMod = new vm.SourceTextModule(stateCode, { identifier: statePath, context });
  moduleCache.set(statePath, stateMod);
  await stateMod.link(linker);
  await stateMod.evaluate();

  const {
    getState,
    resetState,
    advanceTime,
    updateStatusEffects,
    checkDeath,
    setPhase,
    setAutoSaveCallback,
    suspendAutoSave,
    flushAutoSave,
    cancelPendingAutoSave,
    isAutoSaveSuspended,
    isAutoSavePending,
    normalizeState
  } = stateMod.namespace;

  let passed = 0;
  const test = (title, fn) => {
    resetState();
    cancelPendingAutoSave();
    setAutoSaveCallback(null);
    fn();
    console.log(`[PASS] #${++passed}: ${title}`);
  };

  // Test 1: Autosave ngoài transaction giữ nguyên hành vi cũ
  test('Autosave ngoài transaction gọi ngay callback khi day % 5 === 0', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; });
    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;
    assert.equal(isAutoSaveSuspended(), false);
    advanceTime(1); // day 4 phaseIndex 7 + 1 -> day 5
    assert.equal(s.day, 5);
    assert.equal(saved, 1, 'Callback phải được gọi ngay lập tức ngoài transaction');
    assert.equal(isAutoSavePending(), false);
  });

  // Test 2: Trong transaction, autosave bị trì hoãn và bật pending
  test('Trong transaction, advanceTime qua mốc 5 không gọi callback ngay mà đặt pending', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; });
    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    assert.equal(isAutoSaveSuspended(), true);

    advanceTime(1); // day -> 5
    assert.equal(s.day, 5);
    assert.equal(saved, 0, 'Callback KHÔNG được gọi khi đang suspend');
    assert.equal(isAutoSavePending(), true, 'isAutoSavePending() phải trả về true');
  });

  // Test 3: Snapshot flush đã có kết quả survival decay đầy đủ do caller hoàn tất
  test('Snapshot flush đã có kết quả survival/decay đầy đủ do caller hoàn tất', () => {
    let capturedState = null;
    setAutoSaveCallback((state) => {
      capturedState = JSON.parse(JSON.stringify(state));
      return true;
    });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 6;
    s.hunger = 100;
    s.hydration = 100;

    suspendAutoSave();
    advanceTime(2); // day 4 phase 6 + 2 -> day 5 phase 0 (hunger decay 2*4=8 -> 92)
    updateStatusEffects();
    checkDeath();

    assert.equal(capturedState, null, 'Chưa flush thì chưa có snapshot');

    const result = flushAutoSave();
    assert.equal(result.flushed, true);
    assert.equal(result.success, true);
    assert.notEqual(capturedState, null);
    assert.equal(capturedState.day, 5);
    assert.equal(capturedState.hunger, 92, 'Snapshot phải ghi nhận đầy đủ hunger decay');
    assert.equal(capturedState.hydration, 92, 'Snapshot phải ghi nhận đầy đủ hydration decay');
    assert.equal(isAutoSavePending(), false);
    assert.equal(isAutoSaveSuspended(), false);
  });

  // Test 4: Snapshot flush ghi nhận riêng tác động thời tiết (Weather Effects)
  test('Snapshot flush ghi nhận chính xác tác động thời tiết lên chỉ số sinh tồn', () => {
    let capturedState = null;
    setAutoSaveCallback((state) => {
      capturedState = JSON.parse(JSON.stringify(state));
      return true;
    });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 6;
    s.health = 100;

    // Cố định RNG sinh ra bão cát khi qua ngày 5 (bao_cat nằm trong khoảng [0.95, 1.0))
    const prevRandom = mockMath.random;
    mockMath.random = () => 0.97;

    suspendAutoSave();
    advanceTime(2); // Qua ngày 5 -> generateWeather() sinh 'bao_cat' -> applyWeatherEffects(2) trừ 2*2=4 HP
    updateStatusEffects();
    checkDeath();

    mockMath.random = prevRandom; // Khôi phục RNG

    const result = flushAutoSave();
    assert.equal(result.flushed, true);
    assert.equal(result.success, true);
    assert.notEqual(capturedState, null);
    assert.equal(capturedState.weather, 'bao_cat', 'Thời tiết phải được sinh là bão cát');
    assert.equal(capturedState.health, 96, 'Snapshot phải chứa đúng lượng máu đã bị trừ bởi thời tiết bão cát (100 - 4 = 96)');
  });

  // Test 5: Snapshot flush ghi nhận sát thương chết đói (Starvation Damage)
  test('Snapshot flush ghi nhận đúng sát thương suy giảm sinh lực khi đói về 0', () => {
    let capturedState = null;
    setAutoSaveCallback((state) => {
      capturedState = JSON.parse(JSON.stringify(state));
      return true;
    });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;
    s.hunger = 0; // Đang đói kiệt cùng
    s.health = 100;

    suspendAutoSave();
    advanceTime(1); // day -> 5
    updateStatusEffects(); // hunger <= 0 gây starvation damage (mặc định -5 hoặc -10 HP)
    checkDeath();

    assert.ok(s.health < 100, 'Health phải bị trừ do đói');
    const expectedHealth = s.health;

    const result = flushAutoSave();
    assert.equal(result.flushed, true);
    assert.equal(result.success, true);
    assert.equal(capturedState.health, expectedHealth, 'Snapshot phải ghi nhận đúng HP sau khi chịu sát thương starvation');
  });

  // Test 6: Flush lặp không lưu trùng (Idempotent Flush)
  test('Flush lặp không lưu trùng khi pending đã được xử lý', () => {
    let callCount = 0;
    setAutoSaveCallback(() => { callCount++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1); // day -> 5
    assert.equal(isAutoSavePending(), true);

    const firstFlush = flushAutoSave();
    assert.equal(firstFlush.flushed, true);
    assert.equal(firstFlush.success, true);
    assert.equal(callCount, 1);

    // Flush lần 2 ngay sau đó
    const secondFlush = flushAutoSave();
    assert.equal(secondFlush.flushed, false);
    assert.equal(secondFlush.reason, 'no_pending');
    assert.equal(callCount, 1, 'Không được gọi callback lần thứ hai');
  });

  // Test 7: Suspend lồng nhau (Nesting) không mất pending request
  test('Suspend lồng nhau không làm mất pending request và chỉ flush ở outermost', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave(); // depth 1
    advanceTime(1);    // day -> 5, pending = true
    assert.equal(isAutoSavePending(), true);

    suspendAutoSave(); // depth 2 (lồng nhau)
    assert.equal(isAutoSavePending(), true, 'Pending không được bị mất khi suspend lặp');

    const innerFlush = flushAutoSave(); // depth giảm về 1
    assert.equal(innerFlush.flushed, false);
    assert.equal(innerFlush.depth, 1);
    assert.equal(saved, 0, 'Inner flush chưa được ghi đĩa');
    assert.equal(isAutoSavePending(), true);

    const outerFlush = flushAutoSave(); // depth về 0
    assert.equal(outerFlush.flushed, true);
    assert.equal(outerFlush.success, true);
    assert.equal(saved, 1, 'Outer flush ghi đĩa thành công đúng 1 lần');
    assert.equal(isAutoSavePending(), false);
  });

  // Test 8: Callback trả về false được xử lý an toàn (thử 1 lần, hủy pending, trả kết quả)
  test('Callback trả về false để lại depth=0, pending=false và báo rõ kết quả', () => {
    let calls = 0;
    setAutoSaveCallback(() => {
      calls++;
      return false; // Báo lưu thất bại (quota error)
    });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1);

    const result = flushAutoSave();
    assert.equal(result.flushed, true);
    assert.equal(result.success, false);
    assert.equal(result.reason, 'callback_returned_false');
    assert.equal(calls, 1, 'Chỉ thử đúng 1 lần, không tự retry');
    assert.equal(isAutoSavePending(), false, 'Hủy yêu cầu lưu, không treo pending');
    assert.equal(isAutoSaveSuspended(), false);
  });

  // Test 9: Callback quăng ngoại lệ (throw Error) được bắt an toàn
  test('Callback throw Error không làm crash game, hủy pending và trả về error', () => {
    setAutoSaveCallback(() => {
      throw new Error('Simulated QuotaExceededError');
    });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1);

    let result;
    assert.doesNotThrow(() => {
      result = flushAutoSave();
    });

    assert.equal(result.flushed, true);
    assert.equal(result.success, false);
    assert.equal(result.reason, 'callback_threw');
    assert.ok(result.error instanceof Error);
    assert.equal(isAutoSavePending(), false, 'Hủy yêu cầu pending sau exception');
  });

  // Test 10: Tử vong do nhiễm trùng hủy pending autosave, không lưu người chết đè slot 0
  test('Nhân vật tử vong do nhiễm trùng (infection >= 100) hủy ngay pending autosave', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1); // day -> 5, pending = true
    assert.equal(isAutoSavePending(), true);

    s.infection = 100; // Nhiễm trùng đạt đỉnh
    const isDead = checkDeath();
    assert.equal(isDead, true);
    assert.equal(s.gameOver, true);
    assert.equal(isAutoSavePending(), false, 'checkDeath phải tự hủy pending autosave khi chết do nhiễm');

    const flushResult = flushAutoSave();
    assert.equal(flushResult.flushed, false);
    assert.equal(saved, 0, 'Tuyệt đối không lưu snapshot người chơi đã chết');
  });

  // Test 11: resetState khi thực sự có cả suspend và pending dọn sạch cả hai
  test('resetState khi có cả suspend và pending dọn sạch sẽ toàn bộ trạng thái', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1); // day -> 5, pending = true
    assert.equal(isAutoSaveSuspended(), true, 'Đang suspend');
    assert.equal(isAutoSavePending(), true, 'Đang pending');

    resetState();
    assert.equal(isAutoSaveSuspended(), false, 'resetState phải đưa depth về 0');
    assert.equal(isAutoSavePending(), false, 'resetState phải hủy pending');

    const flushResult = flushAutoSave();
    assert.equal(flushResult.flushed, false);
    assert.equal(saved, 0);
  });

  // Test 12: setPhase("main_menu") khi thực sự có cả suspend và pending dọn sạch cả hai
  test('setPhase sang main_menu khi có cả suspend và pending dọn sạch sẽ transaction', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    suspendAutoSave();
    advanceTime(1); // day -> 5, pending = true
    assert.equal(isAutoSaveSuspended(), true);
    assert.equal(isAutoSavePending(), true);

    setPhase('main_menu');
    assert.equal(isAutoSaveSuspended(), false, 'main_menu phải đưa depth về 0');
    assert.equal(isAutoSavePending(), false, 'main_menu phải hủy pending');

    const flushResult = flushAutoSave();
    assert.equal(flushResult.flushed, false);
    assert.equal(saved, 0);
  });

  // Test 13: Caller gặp exception và cleanup qua finally
  test('Caller gặp exception và dọn dẹp an toàn qua block finally', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    assert.throws(() => {
      suspendAutoSave();
      try {
        advanceTime(1);
        throw new Error('Caller unexpected failure');
      } finally {
        cancelPendingAutoSave();
      }
    }, /Caller unexpected failure/);

    assert.equal(isAutoSaveSuspended(), false);
    assert.equal(isAutoSavePending(), false);
    assert.equal(saved, 0);
  });

  // Test 14: normalizeState trên save khác giữ nguyên cả suspend lẫn pending của runtime
  test('normalizeState trên đối tượng save khác giữ nguyên cả suspend lẫn pending của runtime', () => {
    let saved = 0;
    setAutoSaveCallback(() => { saved++; return true; });

    const s = getState();
    s.day = 4;
    s.phaseIndex = 7;

    // Thiết lập runtime đang ở giữa transaction và có pending autosave
    suspendAutoSave();
    advanceTime(1); // day -> 5, pending = true
    assert.equal(isAutoSaveSuspended(), true);
    assert.equal(isAutoSavePending(), true);

    // Chuẩn hóa một đối tượng save bên ngoài
    const externalSaveObj = {
      name: 'ExternalSurvivor',
      day: 14,
      phase: 'cellar_expedition',
      _cellarSession: { floor: 2 }
    };

    normalizeState(externalSaveObj);

    // Kiểm tra đối tượng save được chuẩn hóa đúng chính sách
    assert.equal(externalSaveObj.phase, 'explore');
    assert.equal(externalSaveObj.lastCellarRaidDay, 14, 'Áp cooldown 3 ngày theo ngày checkpoint');
    assert.equal(externalSaveObj._cellarSession, undefined);

    // ĐIỀU KIỆN QUAN TRỌNG: Runtime transaction hoàn toàn KHÔNG bị suy suyển
    assert.equal(isAutoSaveSuspended(), true, 'Runtime suspend phải giữ nguyên');
    assert.equal(isAutoSavePending(), true, 'Runtime pending phải giữ nguyên');

    // Dọn dẹp runtime sau test
    cancelPendingAutoSave();
  });

  console.log('\n====================================================');
  console.log(`TOTAL AUDIT ITEMS: ${passed} | PASS: ${passed} | FAIL: 0`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('[FAIL] Audit suite failed:', err);
  process.exit(1);
});
