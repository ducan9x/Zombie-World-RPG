
        const { execSync } = require('child_process');
        const fs = require('fs');
        const cmd = `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-test-p094 --virtual-time-budget=8000 --run-all-compositor-stages-before-draw --dump-dom "file:///Users/nguyenvandu/Documents/GitHub/Zombie-World-RPG/scratch/harness_phase09_4.html"`;
        const html = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        console.log(html);
      