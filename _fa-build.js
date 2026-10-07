// Build a minimal Font Awesome CSS subset from the bundled all.min.css.
// Kept as a one-shot build tool: run manually after the source file changes,
// then commit the result to source/vendor/fontawesome/css/all.min.css.
const fs = require('fs');
const csso = require('csso');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, 'source/vendor/fontawesome/css/all.min.css'), 'utf8'
);

// Icons actually referenced on the site (scanned from public/*.html and
// the Butterfly layout files).
const needed = [
  'adjust','archive','arrows-alt-h','arrow-up','bars','book-open','bullhorn',
  'calendar-alt','chart-line','chevron-down','chevron-left','chevron-right',
  'circle-arrow-left','circle-exclamation','circle-notch','circle-user',
  'clock','comments','cog','envelope','eye','file-word','folder-open',
  'history','home','inbox','layer-group','list-check','list-ul','message',
  'pencil-alt','pulse','qrcode','search','shake','spinner','square-arrow-up-right',
  'stream','tag','tags','thumbtack','thumbs-down','thumbs-up','times','user'
];

const base = src.match(/:root\{[^}]*\}/)[0];
const faBase = src.match(/\.fa,\.fa-brands,\.fa-classic,\.fa-regular,\.fa-solid,\.fab,\.far,\.fas\{[^}]*\}/)[0];
const fontFaces = (src.match(/@font-face\{font-family:"Font Awesome 7 Free";font-style:normal;font-weight:900;[^}]*\}/g) || []).join('');
// Keep only the solid (900) weight; the site uses no fa-regular or fa-brands.

// `.fa-name{--fa:"\fXXX"}` glyph blocks (optionally with aliases),
// plus any alias selector (`.fa-user,.fa-user-alt,...`) that maps to the
// same code point. The regex matches any rule whose body sets --fa.
const re = /\.fa-[a-z0-9-]+(?:,\.fa-[a-z0-9-]+)*\{[^{}]*\}/g;
const seen = new Set();
let m;
while ((m = re.exec(src))) {
  const sel = m[0].slice(0, m[0].indexOf('{'));
  sel.split(',').forEach(p => {
    const mm = p.trim().match(/^\.fa-([a-z0-9-]+)$/);
    if (mm) seen.add(mm[1]);
  });
}

const glyphRules = [];
const missing = [];
re.lastIndex = 0;
while ((m = re.exec(src))) {
  const sel = m[0].slice(0, m[0].indexOf('{'));
  const names = [];
  sel.split(',').forEach(p => {
    const mm = p.trim().match(/^\.fa-([a-z0-9-]+)$/);
    if (mm) names.push(mm[1]);
  });
  if (names.some(n => needed.includes(n))) glyphRules.push(m[0]);
}
for (const n of needed) if (!seen.has(n)) missing.push(n);

// Animation classes used by the theme: .fa-spin, .fa-pulse, .fa-shake.
function grabClassRules(classNames) {
  const out = [];
  const re2 = new RegExp('\\.' + classNames.join('|') + '\\{[^}]*\\}', 'g');
  let mm;
  while ((mm = re2.exec(src))) out.push(mm[0]);
  return out.join('');
}
// Keyframes definitions.
function grabKeyframe(name) {
  const i = src.indexOf('@keyframes ' + name + '{');
  if (i < 0) return '';
  let j = i + 1, depth = 0;
  for (; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') { depth--; if (depth === 0) { j++; break; } }
  }
  return src.slice(i, j);
}
const kf = grabKeyframe('fa-spin') + grabKeyframe('fa-shake');
const anim = grabClassRules(['fa-spin', 'fa-pulse', 'fa-shake']);

const out = [base, faBase, fontFaces, kf, anim, glyphRules.join('')].join('');
const min = csso.minify(out);
const target = path.join(__dirname, 'source/vendor/fontawesome/css/all.min.css');
const bytes = fs.statSync(target).size;
fs.writeFileSync(target, min.css);
console.log('rewrote', target, bytes, '->', min.css.length, 'bytes');
console.log('missing icons:', missing.length ? missing : '(none)');
