const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');
const target = "  document.getElementById('about-page').style.display = 'none';\r\n}";
const targetLF = "  document.getElementById('about-page').style.display = 'none';\n}";
if (code.includes(target)) {
  code = code.replace(target, "  document.getElementById('about-page').style.display = 'none';\r\n  initAppearanceUI();\r\n}");
  fs.writeFileSync('js/ui.js', code, 'utf8');
  console.log('initAppearanceUI added with CRLF!');
} else if (code.includes(targetLF)) {
  code = code.replace(targetLF, "  document.getElementById('about-page').style.display = 'none';\n  initAppearanceUI();\n}");
  fs.writeFileSync('js/ui.js', code, 'utf8');
  console.log('initAppearanceUI added with LF!');
} else {
  console.error('Target not found!');
}

