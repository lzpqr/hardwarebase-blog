// Quick check: does custom.css content exist in served /css/index.css?
const https = require('https');
const http = require('http');
const fs = require('fs');
http.get('http://localhost:4000/css/index.css', (res) => {
  let d = '';
  res.on('data', (c) => (d += c));
  res.on('end', () => {
    const min = fs.readFileSync('public/css/index.min.css', 'utf8');
    const unmin = fs.readFileSync('public/css/index.css', 'utf8');
    const cu = fs.readFileSync('public/css/custom.css', 'utf8');
    console.log('served css len:', d.length);
    console.log('hb-hero in served:', (d.match(/hb-hero/g) || []).length);
    console.log('hb-hero in index.css:', (unmin.match(/hb-hero/g) || []).length);
    console.log('hb-hero in min:', (min.match(/hb-hero/g) || []).length);
    console.log('custom.css len:', cu.length, ' hb-hero:', (cu.match(/hb-hero/g) || []).length);
    console.log('min css bytes:', min.length);
  });
});
