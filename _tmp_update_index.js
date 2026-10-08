const fs = require('fs');
const p = '_config.butterfly.yml';
let s = fs.readFileSync(p, 'utf8');
const marker = "{ slug: 'hardware-interface-protocol-jtag-swd', title: 'JTAG-SWD 接口' }";
const i = s.indexOf(marker);
if (i < 0) { console.error('marker not found'); process.exit(1); }
const insertPos = i + marker.length;
const add = [
  `,`,
  `            { slug: 'hardware-interface-protocol-usb', title: 'USB 接口' },`,
  `            { slug: 'hardware-interface-protocol-pcie', title: 'PCIe 接口' },`,
  `            { slug: 'hardware-interface-protocol-sata', title: 'SATA 接口' },`,
  `            { slug: 'hardware-interface-protocol-mipi', title: 'MIPI 接口' },`,
  `            { slug: 'hardware-interface-protocol-edp', title: 'eDP 接口' },`,
  `            { slug: 'hardware-interface-protocol-hdmi-dp', title: 'HDMI-DP 接口' }`,
].join('\n');
s = s.slice(0, insertPos) + add + s.slice(insertPos);
fs.writeFileSync(p, s);
console.log('INDEX updated');
