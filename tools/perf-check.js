const fs = require('fs');
const pub = fs.readFileSync('public/index.html', 'utf8');

const scripts = [...pub.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
  .filter(m => m[1].trim().length > 0);
console.log('inline scripts:', scripts.length);
scripts.forEach((m, i) => console.log(i, m[1].length, 'chars, start:', m[1].slice(0, 80).replace(/\n/g, ' ')));

const ext = [...pub.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
console.log('external scripts:', ext);

const css = [...pub.matchAll(/<link[^>]*\shref="([^"]+\.css)"/g)].map(m => m[1]);
console.log('css:', css);

const imgs = [...pub.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
console.log('imgs:', imgs.slice(0, 12));
