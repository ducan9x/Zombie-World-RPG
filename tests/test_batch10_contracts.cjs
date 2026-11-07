const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const read = filename => fs.readFileSync(path.join(root, filename), 'utf8').replace(/\r\n/g, '\n');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
let passed = 0;
const check = (name, value) => { assert.ok(value, name); console.log(`[PASS] ${++passed}: ${name}`); };

async function sandbox() {
  const storage = {};
  let seed = 123456;
  const randomCalls = [];
  const math = Object.create(Math);
  math.random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; const value = seed / 4294967296; randomCalls.push(value); return value; };
  const context = vm.createContext({ console, Math: math, setTimeout, clearTimeout, Audio: class { play() { return Promise.resolve(); } pause() {} },
    localStorage: { getItem: key => storage[key] ?? null, setItem: (key, value) => { storage[key] = String(value); }, removeItem: key => { delete storage[key]; } } });
  const cache = new Map();
  const load = filename => {
    filename = path.resolve(filename);
    if (!cache.has(filename)) cache.set(filename, new vm.SourceTextModule(fs.readFileSync(filename, 'utf8'), { context, identifier: filename }));
    return cache.get(filename);
  };
  const entry = load(path.join(root, 'js/presentation/game-adapter.js'));
  await entry.link((specifier, importer) => load(path.resolve(path.dirname(importer.identifier), specifier)));
  await entry.evaluate();
  const state = cache.get(path.join(root, 'js/state.js')).namespace;
  const game = cache.get(path.join(root, 'js/game/index.js')).namespace;
  state.setName('Parity');
  return { state, game, adapter: entry.namespace, storage, randomCalls, cache };
}

async function main() {
  const excluded = new Set(['js/ui.js', 'js/main.js', 'js/inventory-ui.js', 'js/warehouse-ui.js', 'js/pixi-renderer.js']);
  const frozen = walk(path.join(root, 'js')).map(p => path.relative(root, p).replaceAll('\\', '/')).filter(p => p.endsWith('.js') && !p.startsWith('js/presentation/') && !excluded.has(p)).sort();
  check('117 authoritative Core/data modules remain byte-equivalent (normalized EOL)', frozen.length === 117 && digest(frozen.map(p => p + '\0' + read(p) + '\0').join('')) === 'cb208063177242f2ff2a64218e54514f5ccd3b42668ffbf483e4ea8443dc961b');
  const inventory = read('js/inventory-ui.js');
  check('Inventory command implementation unchanged', digest(inventory.slice(inventory.indexOf('export function executeInventoryAction'), inventory.indexOf('export function renderInventoryComponent'))) === '999594d8adb708594ec25a7358518f78532a16a63561b99b0a10fb9bcd674a25');
  const warehouse = read('js/warehouse-ui.js');
  check('Warehouse transfer implementations unchanged', digest(warehouse.slice(warehouse.indexOf('export function depositBackpackItem'))) === '6582596a5112e556beacc7225606538ba6f83be93ab844f2c45e43de0f75ed18');

  const cases = [
    ['sleep', 0], ['eat selection', 1], ['drink selection', 2], ['medicine selection', 3], ['equipment selection', 4],
    ['goOut / map options', 5], ['discard selection', 6], ['save gateway', 7], ['partner harvest', 8], ['base building', 9], ['survival notes', 10], ['main menu', 11],
  ];
  for (const [name, index] of cases) {
    const direct = await sandbox();
    const adapted = await sandbox();
    direct.game.handleAction(index + 1);
    const token = adapted.adapter.captureOption(adapted.state.getState(), adapted.state.getState().options[index]);
    let refreshes = 0;
    adapted.adapter.dispatchOption(token, () => refreshes++);
    check(`Differential ${name}: exact state, options, RNG and storage`, JSON.stringify(direct.state.getState()) === JSON.stringify(adapted.state.getState()) && JSON.stringify(direct.randomCalls) === JSON.stringify(adapted.randomCalls) && JSON.stringify(direct.storage) === JSON.stringify(adapted.storage) && refreshes === 1);
  }
  {
    const { state, adapter } = await sandbox();
    const token = adapter.captureOption(state.getState(), state.getState().options[0]);
    state.setOptions([...state.getState().options]);
    const before = JSON.stringify(state.getState());
    check('Stale options token rejected without mutation', adapter.dispatchOption(token, () => {}) === false && before === JSON.stringify(state.getState()));
    const missing = adapter.captureOption(state.getState(), { action: 'sleep' });
    check('Unregistered option cannot dispatch by matching label', adapter.dispatchOption(missing, () => {}) === false && before === JSON.stringify(state.getState()));
  }
  {
    const direct = await sandbox();
    const adapted = await sandbox();
    for (const entry of [direct, adapted]) entry.state.getState().options[0].disabled = true;
    direct.game.handleAction(1);
    adapted.adapter.dispatchOption(adapted.adapter.captureOption(adapted.state.getState(), adapted.state.getState().options[0]), () => {});
    check('Disabled command remains Core-owned and has identical result', JSON.stringify(direct.state.getState()) === JSON.stringify(adapted.state.getState()));
  }
  {
    const env = await sandbox();
    const save = env.cache.get(path.join(root, 'js/save.js')).namespace;
    const old = { slotId: 2, nickname: 'Cũ', day: 9, timestamp: '2020-01-01', gameState: { name: 'Cũ', day: 9, health: 50, food: [], drinks: [], medicine: [], other: [], ammo: [] } };
    env.storage.zombie_save_2 = JSON.stringify(old);
    const loaded = save.loadGame(2);
    check('Missing-field historical-shaped save normalizes through original loader', loaded.gameState.name === 'Cũ' && loaded.gameState.day === 9 && loaded.gameState.playerAppearance);
    check('Corrupt save fails safely through original loader', (env.storage.zombie_save_3 = '{bad', save.loadGame(3)) === null);
    check('All 11 slots retain original metadata contract', save.getAllSlots().length === 11);
  }
  check('Shell has no external font or script dependency', !/https?:\/\//.test(read('index.html').split('<body>')[0]));
  console.log(`BATCH10 CONTRACTS: ${passed} PASS / 0 FAIL`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
