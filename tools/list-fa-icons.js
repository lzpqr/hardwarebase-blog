const fs = require('fs');
const used = new Set();
const MODIFIERS = /^(fa|fa-fw|fa-spin|fa-spin-pulse|fa-pulse|fa-fixed-width|fa-border|fa-li|fa-2x|fa-3x|fa-4x|fa-5x|fa-6x|fa-7x|fa-lg|fa-xl|fa-2xs|fa-3xs|fa-flip-horizontal|fa-flip-vertical|fa-flip-both|fa-rotate-90|fa-rotate-180|fa-rotate-270|fa-stack|fa-stack-1x|fa-stack-2x|fa-inverse|fa-ul|fa-layer-group)$/;
const walk = d => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name.startsWith('.')) continue;
    const p = d + '/' + f.name;
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      const s = fs.readFileSync(p, 'utf8');
      for (const m of s.matchAll(/class=(["'])([^\1]*?)\1/g)) {
        for (const c of m[2].split(/\s+/)) {
          if (/^fa-/.test(c) && !MODIFIERS.test(c)) used.add(c);
        }
      }
    }
  }
};
walk(process.argv[2] || 'public');
console.log([...used].sort().join('\n'));
console.log('count:', used.size);
