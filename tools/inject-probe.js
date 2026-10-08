const fs = require('fs');
const pub = fs.readFileSync('public/index.html', 'utf8');
const i = pub.indexOf('ld+json');
console.log(pub.slice(i - 60, i + 250).replace(/\n/g, '\\n'));
