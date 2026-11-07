const assert = require('node:assert/strict');
const path = require('node:path');
const { launch, serve } = require('./helpers/chromium.cjs');

async function main() {
  const server = await serve(path.resolve(__dirname, '..'));
  let browser;
  let passed = 0;
  const check = (name, result) => { assert.ok(result, name); console.log(`[PASS] ${++passed}: ${name}`); };
  try {
    browser = await launch();
    console.log(`Real browser: ${browser.executable}`);
    const evaluate = expression => browser.evaluate(expression);
    const click = async selector => {
      const point = await evaluate(`const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw new Error('Missing control: '+${JSON.stringify(selector)});el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();const x=r.x+r.width/2,y=r.y+r.height/2;const hit=document.elementFromPoint(x,y);({x,y,visible:r.width>0&&r.height>0&&el.contains(hit)})`);
      assert.ok(point.visible, `Control is visible and not occluded: ${selector}`);
      await browser.command('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 });
      await browser.command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 });
    };
    const capture = async name => {
      if (!process.env.CAPTURE_SCREENSHOTS) return;
      for (const width of [375, 1366]) {
        await browser.viewport(width, width === 375 ? 812 : 900);
        await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
        await browser.screenshot(`project-docs/batch-09/screenshots/${name}-${width}.png`);
      }
      await browser.viewport(375, 812);
    };
    await browser.viewport(375, 812);
    await browser.navigate(server.url);
    await evaluate(`new Promise((resolve,reject)=>{const check=()=>document.querySelector('#system-save-btn')?resolve():requestAnimationFrame(check);check();setTimeout(()=>reject(new Error('App did not initialize')),10000)})`);
    check('New styles load and app initializes', await evaluate(`document.querySelector('#system-save-btn') && getComputedStyle(document.body).backgroundColor !== 'rgb(255, 255, 255)'`));
    await capture('title');
    for (const width of [320, 375, 430]) {
      await browser.viewport(width, 812);
      check(`${width}px character setup stays within viewport`, await evaluate(`document.documentElement.scrollWidth<=document.documentElement.clientWidth`));
    }
    await browser.viewport(375, 812);
    await click('#new-game-btn');
    check('Empty name stays in setup and reports inline validation', await evaluate(`!!document.querySelector('#name-feedback').textContent && getComputedStyle(document.querySelector('#name-setup')).display !== 'none'`));
    await evaluate(`document.querySelector('#name-input').value='Kiểm thử'`);
    await click('#new-game-btn');
    check('Create character enters canonical choose phase', await evaluate(`import('/js/state.js').then(m=>m.getState().phase === 'choose' && m.getState().name === 'Kiểm thử')`));
    await evaluate(`window.__initialState = JSON.stringify((await import('/js/state.js')).getState())`);
    for (const route of ['loadout', 'journal', 'system', 'field']) await click(`[data-route="${route}"]`);
    check('Pure navigation preserves entire game state', await evaluate(`JSON.stringify((await import('/js/state.js')).getState()) === window.__initialState`));
    check('One persistent Pixi canvas', await evaluate(`document.querySelectorAll('#pixi-viewport canvas').length === 1`));
    const touchPoint = await evaluate(`const r=document.querySelector('[data-route="loadout"]').getBoundingClientRect();({x:r.x+r.width/2,y:r.y+r.height/2})`);
    await browser.command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...touchPoint, radiusX: 8, radiusY: 8 }] });
    await browser.command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check('Touch event opens loadout without consuming a turn', await evaluate(`!document.querySelector('#loadout-screen').hidden && JSON.stringify((await import('/js/state.js')).getState()) === window.__initialState`));
    await click('[data-route="field"]');
    await capture('field');

    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1366, 1920]) {
      await browser.viewport(width, width < 768 ? 844 : 900);
      for (const route of ['field', 'loadout', 'journal', 'system']) {
        await click(`[data-route="${route}"]`);
        const metrics = await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{const visible=el=>el.getClientRects().length && !el.closest('[hidden]');const controls=[...document.querySelectorAll('#game-content button')].filter(visible);resolve({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43.5||r.height<43.5}).map(el=>el.id||el.className),main:document.querySelector('#app-main').getBoundingClientRect().width})})))`);
        check(`${width}px ${route}: no overflow and all buttons >=44 CSS px (${JSON.stringify(metrics)})`, metrics.scroll <= metrics.width && metrics.small.length === 0 && metrics.main > 0);
      }
    }
    await browser.viewport(375, 812);
    await click('[data-route="field"]');
    await click('#options-area [data-index="6"]');
    check('Map enters through original goOut option', await evaluate(`(await import('/js/state.js')).getState().phase === 'map_select'`));
    await capture('map');
    const poi = await evaluate(`const p=(await import('/js/pixi-renderer.js')).pixiRenderer;await new Promise((resolve,reject)=>{const ready=()=>Object.keys(p.worldMapRenderer.markerMap).length?resolve():requestAnimationFrame(ready);ready();setTimeout(()=>reject(new Error('Map markers unavailable')),10000)});const s=(await import('/js/state.js')).getState();const mapId=s.options.find(o=>o.map&&p.worldMapRenderer.markerMap[o.map.id]).map.id;const marker=p.worldMapRenderer.markerMap[mapId].container.toGlobal({x:0,y:0});const r=p.app.view.getBoundingClientRect();({x:r.x+marker.x/640*r.width,y:r.y+marker.y/320*r.height,mapId})`);
    await browser.command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: poi.x, y: poi.y, radiusX: 8, radiusY: 8 }] });
    await browser.command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check('Touching a Pixi POI travels to its real map through Core exactly once', await evaluate(`const s=(await import('/js/state.js')).getState();s.currentMap?.id===${JSON.stringify(poi.mapId)} && s.phase !== 'map_select' && s.phaseIndex === 1`));

    await click('[data-route="loadout"]');
    await click('.inv-tab[data-tab="food"]');
    await click('.inv-card');
    check('Item detail exposes real inventory action', await evaluate(`!!document.querySelector('[data-action="eat"]')`));
    await capture('inventory');
    await evaluate(`window.__foodBefore=(await import('/js/state.js')).getState().food.reduce((n,i)=>n+(i.count||1),0)`);
    await click('[data-action="eat"]');
    check('Inventory consumes exactly one real item', await evaluate(`(await import('/js/state.js')).getState().food.reduce((n,i)=>n+(i.count||1),0) === window.__foodBefore-1`));
    await click('#inventory-sheet .inv-detail-close');
    await click('.inv-card');
    await click('#inventory-sheet [data-action="discard"]');
    check('Destructive confirmation takes focus above item sheet', await evaluate(`document.querySelector('#discard-confirm-modal').contains(document.activeElement)`));
    const beforeCancel = await evaluate(`JSON.stringify((await import('/js/state.js')).getState().food)`);
    await click('#discard-cancel-btn');
    check('Cancel discard preserves inventory and returns to detail sheet', await evaluate(`JSON.stringify((await import('/js/state.js')).getState().food)===${JSON.stringify(beforeCancel)} && document.querySelector('#inventory-sheet').contains(document.activeElement)`));
    await click('#inventory-sheet .inv-detail-close');

    await click('[data-route="system"]');
    await click('#settings-btn');
    check('Settings opens within shell, not hidden by legacy display writes', await evaluate(`!document.querySelector('#utility-screen').hidden && getComputedStyle(document.querySelector('#settings-page')).display !== 'none'`));
    await capture('settings');
    await click('#input-mode-btn');
    await click('#click-mode-btn');
    check('Input-only preference disables click choices, retains numeric entry', await evaluate(`const m=await import('/js/state.js');!m.getGameSettings().clickMode && m.getGameSettings().inputMode && [...document.querySelectorAll('#options-area .option-item')].every(el=>el.disabled)`));
    await click('#input-mode-btn');
    check('Cannot disable the last control mode; accessible notice opens', await evaluate(`document.querySelector('#notice-dialog').open && (await import('/js/state.js')).getGameSettings().inputMode`));
    await click('#notice-dismiss');
    await click('#utility-back');
    await click('#system-save-btn');
    check('Save screen uses canonical phase and shows all slots', await evaluate(`(await import('/js/state.js')).getState().phase === 'save_page' && document.querySelectorAll('#save-options-area button').length===12`));
    check('Save numeric input is visible in input-only mode', await evaluate(`document.querySelector('#save-page').contains(document.querySelector('#input-area')) && document.querySelector('#action-input').getClientRects().length>0`));
    await evaluate(`document.querySelector('#action-input').value='2'`);
    await click('#submit-btn');
    await evaluate(`document.querySelector('#action-input').value='1'`);
    await click('#submit-btn');
    check('Save slot 1 writes unchanged protocol', await evaluate(`const raw=JSON.parse(localStorage.getItem('zombie_save_1'));raw.slotId===1&&raw.gameState.name==='Kiểm thử'`));
    await capture('save');
    await click('#save-return-btn');
    await click('[data-route="system"]');
    await click('#settings-btn');
    await click('#click-mode-btn');
    await click('#utility-back');
    await click('#system-save-btn');
    await click('#save-options-area [data-index="2"]');
    await evaluate(`(await import('/js/state.js')).setName('Khác')`);
    await click('#save-options-area [data-index="1"]');
    check('Load slot restores character and routes to saved map through Core', await evaluate(`const s=(await import('/js/state.js')).getState();s.name==='Kiểm thử'&&!!s.currentMap&&s.phase==='explore'`));

    // Fixture setup is explicit test-only state, never a production navigation shortcut.
    await evaluate(`const m=await import('/js/state.js');m.resetState();m.setName('Kho thử');(await import('/js/routing.js')).showHomeOptions();(await import('/js/ui.js')).renderAll();`);
    await click('#options-area [data-index="10"]');
    check('Base screen exposes real crop slots without advancing time', await evaluate(`document.querySelectorAll('.crop-summary').length === (await import('/js/state.js')).getState().crops.length`));
    await capture('base');
    await click('#options-area [data-index="6"]');
    check('Warehouse opens via real base options', await evaluate(`getComputedStyle(document.querySelector('#warehouse-modal')).display !== 'none'`));
    await evaluate(`new Promise(resolve=>requestAnimationFrame(resolve))`);
    check('Warehouse focus is inside dialog', await evaluate(`document.querySelector('#warehouse-modal').contains(document.activeElement)`));
    await click('.wh-item-card');
    await click('#wh-btn-dep-1');
    check('Warehouse deposits one item through existing transfer API', await evaluate(`(await import('/js/state.js')).getState().warehouse.length===1`));
    await capture('warehouse');
    await click('#warehouse-modal-close');
    check('Modal close restores background interactivity', await evaluate(`!document.querySelector('#game-content').inert`));

    await evaluate(`const s=(await import('/js/state.js')).getState();s._pendingZombie={id:'zombie_lang_dao',name:'Zombie Lãng Du',hp:50,damage:5,ability:[]};(await import('/js/state.js')).setPhase('pre_combat');(await import('/js/state.js')).setStory('Một bóng người xuất hiện từ đống đổ nát.');(await import('/js/state.js')).setOptions([{text:'Chiến đấu cận chiến',action:'combat_melee'},{text:'Thử chạy thoát',action:'combat_flee'}]);(await import('/js/ui.js')).renderAll();`);
    check('Encounter screen presents pending enemy without running combat', await evaluate(`document.querySelector('#screen-title').textContent==='Chạm trán' && !!document.querySelector('.combat-enemy-card')`));
    await capture('encounter');
    await click('[data-route="system"]');
    await click('#system-save-btn');
    check('Save shortcut cannot bypass transient combat guard', await evaluate(`(await import('/js/state.js')).getState().phase==='pre_combat' && (await import('/js/state.js')).getState().story.includes('không thể lưu')`));
    await click('[data-route="field"]');
    await click('#options-area [data-index="1"]');
    check('Actual combat resolves through Core and presents its real log', await evaluate(`const s=(await import('/js/state.js')).getState();s.phase!=='pre_combat' && s.story.includes('Nhật ký chiến đấu') && !!document.querySelector('.combat-log-body')`));
    await capture('combat-result');
    await evaluate(`const m=await import('/js/state.js');m.resetState();m.setName('Công thức');const map=(await import('/js/data/maps/maps.js')).MAPS.find(x=>x.id==='dao_nho');m.setCurrentMap(map);m.setLocation(map.name);(await import('/js/island/linhan.js')).handleLinhanCook();(await import('/js/ui.js')).renderAll();`);
    check('Recipe screen retains every original recipe and disabled eligibility', await evaluate(`const s=(await import('/js/state.js')).getState();s.phase==='island_linhan' && s.options.filter(x=>x.cookRecipe).length===(await import('/js/data/items/seafood-meals.js')).SEAFOOD_MEAL_RECIPES.length && document.querySelector('#field-screen').dataset.kind==='recipe'`));
    await capture('recipes');
    for (let i=0;i<20;i++) { await click('[data-route="loadout"]'); await click('[data-route="field"]'); }
    check('Twenty view cycles retain a single Pixi application canvas', await evaluate(`document.querySelectorAll('#pixi-viewport canvas').length===1`));
    await browser.viewport(844, 390);
    check('Low landscape retains readable content area', await evaluate(`document.querySelector('#app-main').clientHeight>100 && document.documentElement.scrollWidth<=document.documentElement.clientWidth`));
    await browser.viewport(375, 812);
    await evaluate(`document.documentElement.style.fontSize='200%'`);
    check('200% text scaling avoids horizontal document overflow', await evaluate(`document.documentElement.scrollWidth<=document.documentElement.clientWidth`));
    await evaluate(`document.documentElement.style.fontSize=''`);
    await evaluate(`(await import('/js/game/endings.js')).triggerEnding('ending_death');(await import('/js/ui.js')).renderAll()`);
    check('Terminal ending hides navigation and only exposes Core restart', await evaluate(`(await import('/js/state.js')).getState().gameOver && document.querySelector('#primary-nav').hidden && document.querySelectorAll('#options-area button').length===1`));
    await capture('ending');
    await click('#options-area [data-index="1"]');
    check('Restart returns to character setup', await evaluate(`getComputedStyle(document.querySelector('#name-setup')).display!=='none'`));

    for (const tool of ['probability', 'encyclopedia']) {
      await browser.viewport(320, 844);
      await browser.navigate(`${server.url}/tools/${tool}.html`);
      await evaluate(`new Promise((resolve,reject)=>{const check=()=>document.querySelector('table[data-mobile-labels],.card-grid .card')?resolve():requestAnimationFrame(check);check();setTimeout(()=>reject(new Error('Tool data not loaded')),10000)})`);
      check(`${tool}: CSV loaded offline-local and 320px reader has no horizontal overflow`, await evaluate(`document.documentElement.scrollWidth <= document.documentElement.clientWidth && !!document.querySelector('.tool-categories')`));
      if (tool === 'encyclopedia') {
        await evaluate(`document.querySelector('#searchInput').value='súng';document.querySelector('#searchInput').dispatchEvent(new Event('input',{bubbles:true}))`);
        check('Encyclopedia search executes without selector exception', await evaluate(`document.querySelector('#searchInput').value==='súng'`));
      }
    }
    const errors = browser.events.filter(e => e.method === 'Runtime.exceptionThrown');
    check(`No uncaught JavaScript exceptions (${JSON.stringify(errors)})`, errors.length === 0);
    const remote = browser.events.filter(e => e.method === 'Network.requestWillBeSent' && /^https?:/.test(e.params.request.url) && !e.params.request.url.startsWith(server.url));
    check('No external HTTP dependency during tested journeys', remote.length === 0);
    console.log(`BATCH10 BROWSER: ${passed} PASS / 0 FAIL / 0 SKIP`);
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
