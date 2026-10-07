// One-shot: remove the two stray whitespace-only lines that crept in
// between the inject.bottom </script> block and the `asset:` key in
// _config.butterfly.yml. Run once, then safe to delete.
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', '_config.butterfly.yml');
let s = fs.readFileSync(p, 'utf8');
const before = s.length;
s = s.replace(/\s*<\/script>\s*\n +\n +\n+asset:/m, '<script-end>\nasset:');
if (before !== s.length) {
  fs.writeFileSync(p, s);
  console.log('cleaned stray lines');
} else {
  console.log('no change needed (pattern not found)');
}
