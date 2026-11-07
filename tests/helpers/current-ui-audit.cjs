const { execFileSync } = require('child_process');
const path = require('path');

// Batch 09's static fixtures assert the retired four-zone design. Keep its
// non-browser regressions; replace the browser gate with production journeys.
module.exports = function auditCurrentUI() {
  const output = execFileSync(process.execPath, [path.resolve(__dirname, '../test_batch10_browser.cjs')], { encoding: 'utf8', timeout: 90000, maxBuffer: 4 * 1024 * 1024 });
  const summary = output.split('\n').find(line => line.startsWith('BATCH10 BROWSER:'));
  if (!summary) throw new Error('Browser suite did not produce its acceptance summary');
  return summary;
};
