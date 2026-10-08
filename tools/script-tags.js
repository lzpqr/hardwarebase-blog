const fs = require('fs');
const c = fs.readFileSync('public/index.html', 'utf8');
const tags = c.match(/<script[^>]*>/g);
console.log(tags.join('\n'));
