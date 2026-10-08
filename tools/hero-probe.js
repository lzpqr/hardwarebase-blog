const fs = require('fs');
const y = fs.readFileSync('_config.butterfly.yml', 'utf8');
const i = y.indexOf('id="hb-hero"');
console.log(y.slice(i - 200, i + 1800));
