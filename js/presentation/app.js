/* Field Terminal — presentation session. No phase, turn or save writes here. */
import { getState, getGameSettings } from '../state.js';
import { SURVIVAL_NOTES } from '../config.js';
import { pixiRenderer } from '../pixi-renderer.js';
import { initOverlays } from './overlays.js';
import { describeScreen } from './screens.js';

const routeTitles = {
  field: ['NHẬT KÝ SINH TỒN', 'Hiện trường'],
  loadout: ['SẴN SÀNG CHO ĐIỀU TỒI TỆ NHẤT', 'Hành trang'],
  journal: ['NHỮNG GÌ BẠN ĐÃ TRẢI QUA', 'Hồ sơ sinh tồn'],
  system: ['THIẾT BỊ DÃ CHIẾN', 'Hệ thống'],
  utility: ['FIELD TERMINAL', 'Tiện ích'],
};
const utilityPages = {
  'best-record-btn': ['best-record-page', 'Kỷ lục sống sót'],
  'achievement-btn': ['achievement-page', 'Thành tích'],
  'settings-btn': ['settings-page', 'Cài đặt'],
  'player-tools-btn': ['player-tools-page', 'Công cụ người chơi'],
  'about-btn': ['about-page', 'Về trò chơi'],
};

export function initPresentation({ setRefresh, renderAll }) {
  const $ = id => document.getElementById(id);
  if (!$('app-main')) return null;
  let route = 'field';
  let subroute = 'bag';
  let utility = null;
  let utilityTitle = '';
  let utilityOrigin = 'system';
  let previousState = getState();
  let previousPhase = previousState.phase;
  let previousStory = previousState.story;
  let previousOptions = previousState.options;
  const scroll = new Map();
  const startButtons = document.querySelector('.start-buttons');
  const utilityButtons = Object.keys(utilityPages).map($).filter(Boolean);
  const closeLegacyOverlays = () => {
    for (const id of ['inventory-sheet', 'discard-confirm-modal', 'warehouse-modal']) {
      const modal = $(id);
      if (modal?.style.display !== 'none') modal?.querySelector('.modal-close-btn')?.click();
    }
  };
  // Keep the Pixi host and original command hosts alive, not cloned per route.
  $('field-screen').append($('zone-3'), $('zone-4'));
  $('loadout-bag').append($('inventory-panel'));
  $('loadout-equipment').append($('weapon-panel'));
  $('loadout-profile').append($('stats-panel'), $('identity-panel'), $('cargo-panel'));
  $('zone-1').hidden = true;
  $('zone-2').hidden = true;
  const overlays = initOverlays();
  pixiRenderer.sceneOnly = true;
  const contextPanel = document.createElement('section');
  contextPanel.id = 'field-context';
  contextPanel.className = 'context-panel';
  $('zone-3').append(contextPanel);

  function syncInventorySheet() {
    const sheet = $('inventory-sheet');
    const detail = $('inventory-panel').querySelector('.inv-detail-panel');
    const canShow = route === 'loadout' && subroute === 'bag' && !!getState()._selectedInvItem;
    if (canShow && detail) {
      detail.classList.add('modal-box');
      detail.querySelector('.inv-detail-close')?.classList.add('modal-close-btn');
      sheet.replaceChildren(detail);
    }
    if (!canShow || !sheet.querySelector('.inv-detail-panel')) {
      sheet.style.display = 'none';
      sheet.replaceChildren();
    } else sheet.style.display = 'flex';
    overlays.sync();
  }
  document.addEventListener('inventory:rendered', syncInventorySheet);
  $('inventory-sheet').addEventListener('click', event => {
    if (event.target === $('inventory-sheet')) $('inventory-sheet').querySelector('.inv-detail-close')?.click();
  });

  function renderJournal() {
    const container = $('journal-content');
    container.replaceChildren();
    const state = getState();
    const section = document.createElement('section');
    section.className = 'journal-section';
    const heading = document.createElement('h3');
    heading.textContent = 'Dấu vết trong vùng hoang';
    const summary = document.createElement('p');
    summary.textContent = `Ngày ${state.day} · ${state.stats?.zombieKills || 0} zombie đã hạ · ${state.stats?.mapsExplored?.length || 0} địa điểm đã tới`;
    section.append(heading, summary);
    const facts = [
      state.liuruyanDiscovered && ['Liu Ruyan', state.liuruyanRescued ? 'Đã cứu' : 'Chưa được cứu — xem lựa chọn nhiệm vụ tại hiện trường'],
      state.oldMaStep > 0 && ['Lão Mã', `Tiến độ hiện tại: ${state.oldMaStep}`],
      state.doctorQuest1Accepted && ['Tiến sĩ', state.doctorQuest3Done ? 'Đã hoàn thành nhiệm vụ vật tư' : 'Đang theo dõi chuỗi nhiệm vụ'],
    ].filter(Boolean);
    for (const [name, status] of facts) {
      const item = document.createElement('p');
      item.textContent = `${name}: ${status}`;
      section.append(item);
    }
    container.append(section);
    for (const category of SURVIVAL_NOTES) {
      const group = document.createElement('section');
      group.className = 'journal-section';
      const title = document.createElement('h3');
      title.textContent = category.name;
      group.append(title);
      for (const entry of category.entries) {
        const details = document.createElement('details');
        const caption = document.createElement('summary');
        caption.textContent = entry.title;
        const body = document.createElement('p');
        body.textContent = entry.content;
        details.append(caption, body);
        group.append(details);
      }
      container.append(group);
    }
  }

  function showRoute(next, { focus = true } = {}) {
    if (!routeTitles[next]) return;
    scroll.set(route, $('app-main').scrollTop);
    route = next;
    sync();
    $('app-main').scrollTop = scroll.get(next) || 0;
    if (next === 'journal') renderJournal();
    if (focus) $('app-main').focus({ preventScroll: true });
    if (next === 'field') pixiRenderer.resize(true);
  }

  function openUtility(id, title) {
    utilityOrigin = route === 'utility' ? utilityOrigin : route;
    utility = id;
    utilityTitle = title;
    $('utility-content').append($(id));
    showRoute('utility');
  }

  function sync() {
    const state = getState();
    const reset = previousState !== state;
    const phaseChanged = previousPhase !== state.phase;
    const contentChanged = previousStory !== state.story || previousOptions !== state.options;
    if (reset || (phaseChanged && state.phase !== 'save_page' && state.phase !== 'save_confirm')) {
      route = 'field';
      utility = null;
      if (reset || state.phase === 'ending' || state.phase === 'main_menu') closeLegacyOverlays();
    }
    if (state.phase === 'save_page' || state.phase === 'save_confirm') {
      if (utility !== 'save-page') utilityOrigin = route === 'utility' ? 'system' : route;
      utility = 'save-page';
      utilityTitle = 'Quản lý lưu trữ';
      route = 'utility';
      $('utility-content').append($('save-page'));
    }
    const menu = (state.phase === 'main_menu' || !state.name) && !['save_page', 'save_confirm'].includes(state.phase) && route !== 'utility';
    $('game-container').classList.toggle('is-playing', !menu);
    $('game-header').style.display = menu ? 'block' : 'none';
    $('name-setup').style.display = menu ? 'flex' : 'none';
    $('game-content').style.display = menu ? 'none' : 'flex';
    $('mobile-gameplay-header').hidden = !state.name || state.phase === 'main_menu';
    $('primary-nav').hidden = !state.name || state.phase === 'main_menu' || state.gameOver;
    const owner = menu ? startButtons : $('system-actions');
    for (const button of utilityButtons) if (button.parentElement !== owner) owner.append(button);
    let saveButton = $('system-save-btn');
    if (!saveButton) {
      saveButton = document.createElement('button');
      saveButton.id = 'system-save-btn';
      saveButton.type = 'button';
      saveButton.textContent = 'Lưu / tải trò chơi';
      saveButton.addEventListener('click', () => $('load-game-btn').click());
      $('system-actions').prepend(saveButton);
    }
    for (const name of Object.keys(routeTitles)) $(name === 'utility' ? 'utility-screen' : `${name}-screen`).hidden = name !== route;
    for (const [button, [id]] of Object.entries(utilityPages)) {
      $(id).style.display = route === 'utility' && utility === id ? 'block' : 'none';
    }
    $('save-page').style.display = utility === 'save-page' && route === 'utility' ? 'block' : 'none';
    const [kicker, title] = routeTitles[route];
    $('screen-kicker').textContent = kicker;
    $('screen-title').textContent = route === 'utility' ? utilityTitle : title;
    const encounter = ['pre_combat', 'pre_combat_npc'].includes(state.phase);
    $('field-screen').classList.toggle('is-encounter', encounter);
    contextPanel.hidden = state.phase !== 'base_build';
    if (!contextPanel.hidden) {
      contextPanel.replaceChildren();
      const heading = document.createElement('h3');
      heading.textContent = 'Đất trồng tại nơi trú';
      contextPanel.append(heading);
      (state.crops || []).forEach((crop, index) => {
        const row = document.createElement('div');
        row.className = 'crop-summary';
        const label = document.createElement('span');
        label.textContent = `Ô ${index + 1} · ${crop?.name || 'Chưa trồng'}`;
        const status = document.createElement('span');
        status.textContent = !crop ? 'Trống' : crop.matureTurns <= 0 ? 'Sẵn sàng thu hoạch' : `Còn ${crop.matureTurns} lượt`;
        row.append(label, status);
        contextPanel.append(row);
      });
    }
    if (route === 'field') {
      const [screenKicker, screenTitle, kind] = describeScreen(state);
      $('screen-title').textContent = screenTitle;
      $('screen-kicker').textContent = screenKicker;
      $('field-screen').dataset.kind = kind;
    }
    $('screen-phase').textContent = state.phase === 'ending' ? 'KẾT CỤC' : encounter ? 'NGUY HIỂM' : `NGÀY ${state.day}`;
    $('terminal-context').textContent = state.name || 'Hồ sơ ngoại tuyến';
    const alerts = [state.status && state.status !== 'Bình thường' ? state.status : '', state.infection > 0 ? `Nhiễm ${state.infection}%` : ''].filter(Boolean);
    $('survival-alerts').hidden = !alerts.length;
    $('survival-alerts').textContent = alerts.join(' · ');
    $('utility-back').hidden = utility === 'save-page';
    for (const button of document.querySelectorAll('[data-route]')) {
      if (button.dataset.route === (route === 'utility' ? utilityOrigin : route)) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    for (const name of ['bag', 'equipment', 'profile']) $(`loadout-${name}`).hidden = subroute !== name;
    for (const button of document.querySelectorAll('[data-loadout]')) button.setAttribute('aria-pressed', String(button.dataset.loadout === subroute));
    // Save-only input mode must remain usable as well as click mode.
    const inputArea = $('input-area');
    const inputOwner = utility === 'save-page' && route === 'utility' ? $('save-page').firstElementChild : $('zone-4');
    if (inputArea.parentElement !== inputOwner) inputOwner.append(inputArea);
    inputArea.style.display = getGameSettings().inputMode ? 'flex' : 'none';
    previousState = state;
    previousPhase = state.phase;
    previousStory = state.story;
    previousOptions = state.options;
    if ((phaseChanged || contentChanged) && (route === 'field' || utility === 'save-page')) $('app-main').scrollTop = 0;
    syncInventorySheet();
    overlays.sync();
  }

  for (const [button, [id, title]] of Object.entries(utilityPages)) {
    // Legacy listener renders the content; this listener owns navigation only.
    $(button).addEventListener('click', () => openUtility(id, title));
  }
  for (const id of ['click-mode-btn', 'input-mode-btn', 'music-btn']) $(id).addEventListener('click', renderAll);
  for (const id of ['best-record-return-btn', 'achievement-return-btn', 'settings-return-btn', 'player-tools-return-btn', 'about-return-btn']) {
    $(id)?.addEventListener('click', () => { utility = null; showRoute(utilityOrigin); });
  }
  $('utility-back').addEventListener('click', () => {
    if (utility === 'player-tools-page') $('player-tools-frame').src = 'about:blank';
    utility = null;
    showRoute(utilityOrigin);
  });
  for (const button of document.querySelectorAll('[data-route]')) button.addEventListener('click', () => {
    // A save interaction is gameplay-owned: return via its real Back control.
    if (['save_page', 'save_confirm'].includes(getState().phase)) { $('save-return-btn').click(); return; }
    utility = null;
    showRoute(button.dataset.route);
  });
  for (const button of document.querySelectorAll('[data-loadout]')) button.addEventListener('click', () => { subroute = button.dataset.loadout; sync(); });
  $('terminal-system-btn').addEventListener('click', () => showRoute('system'));
  $('mobile-survival-hud').addEventListener('click', () => { subroute = 'profile'; showRoute('loadout'); });
  document.querySelector('.terminal-brand').addEventListener('click', event => { event.preventDefault(); showRoute('field'); });
  $('journal-achievements').addEventListener('click', () => $('achievement-btn').click());
  $('journal-records').addEventListener('click', () => $('best-record-btn').click());
  window.addEventListener('message', event => {
    const frame = $('player-tools-frame');
    if (event.origin !== window.location.origin || event.source !== frame.contentWindow || event.data?.type !== 'field-tool-height') return;
    const height = event.data.height;
    if (Number.isFinite(height) && height > 0 && height < 100000) frame.style.height = `${Math.ceil(height)}px`;
  });

  const viewport = window.visualViewport;
  const updateViewport = () => document.body.classList.toggle('keyboard-open', !!viewport && window.innerHeight - viewport.height > 150 && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName));
  viewport?.addEventListener('resize', updateViewport);
  document.addEventListener('focusout', updateViewport);
  const dialog = $('notice-dialog');
  $('notice-dismiss').addEventListener('click', () => dialog.close());
  window.addEventListener('game:notice', event => {
    $('notice-message').textContent = event.detail;
    if (!dialog.open) dialog.showModal();
  });
  setRefresh(sync);
  sync();
  return { sync, showRoute, renderJournal, renderAll };
}
