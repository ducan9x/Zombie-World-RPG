/* Presentation command boundary. Never resolve an option from its visible index. */
import { getState } from '../state.js';
import { handleAction } from '../game/index.js';

export function captureOption(state, option) {
  return { state, phase: state.phase, options: state.options, option };
}

export function dispatchOption(token, refresh, execute = handleAction) {
  const state = getState();
  const index = state.options?.indexOf(token.option) ?? -1;
  if (state !== token.state || state.phase !== token.phase || state.options !== token.options || index < 0) {
    refresh();
    return false;
  }
  // Disabled handling and ending/death checks remain inside the authoritative API.
  execute(index + 1);
  refresh();
  return true;
}
