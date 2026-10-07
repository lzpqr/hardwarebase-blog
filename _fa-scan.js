const fs = require('fs');
const s = fs.readFileSync('H:/ai/codex/web/source/vendor/fontawesome/css/all.min.css', 'utf8');
// Each icon rule is `.fa-name{--fa:"\fXXX"}`; several rules may be
// chained together as `.fa-a,.fa-b{--fa:"\fXXX"}`. We collect the
// full set of selectors by splitting on commas.
const re = /\.fa-[a-z0-9-]+(?:,\.fa-[a-z0-9-]+)*\{--fa:[^{}]*\}/g;
const seen = new Set();
let m;
while ((m = re.exec(s))) {
  const sel = m[0].slice(0, m[0].indexOf('{'));
  sel.split(',').forEach(p => {
    const mm = p.trim().match(/^\.fa-([a-z0-9-]+)$/);
    if (mm) seen.add(mm[1]);
  });
}
console.log('icon names defined:', seen.size);
const needed = ['home','search','user','circle-user','calendar-alt','spinner','pulse','shake','bullhorn','circle-exclamation','square-arrow-up-right','chart-line','stream','book-open','arrows-alt-h','list-check','layer-group','tags','thumbs-up','chevron-left','chevron-right','bars','cog','envelope','file-word','folder-open','history','inbox','times','adjust'];
for (const n of needed) {
  if (!seen.has(n)) console.log('MISSING:', n);
}
console.log('check done');
