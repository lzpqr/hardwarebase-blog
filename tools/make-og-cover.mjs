import sharp from 'sharp';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(projectRoot, 'source', 'img', 'og-cover.png');

if (!existsSync(path.dirname(out))) process.exit(1);

const blue = '#6f8fba';
const blueStrong = '#5478a9';
const ink = '#243447';

// 电路走线风格底纹：浅蓝白渐变 + 细走线 + 焊盘
const pattern = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4f7fb"/>
      <stop offset="0.55" stop-color="#eaf0f8"/>
      <stop offset="1" stop-color="#dfe8f4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="${blue}" stroke-opacity="0.28" stroke-width="2" fill="none">
    <path d="M-40 88 H220 L280 148 V320"/>
    <path d="M-40 180 H120 L170 230 V520 L210 560 H420"/>
    <path d="M1240 90 H1010 L950 150 V360"/>
    <path d="M1240 220 H1100 L1050 270 V560 L1000 610 H820"/>
    <path d="M300 670 V480 L360 420 H620"/>
    <path d="M800 670 V540 L750 490 H560"/>
    <path d="M-40 470 H80 L130 520 V670"/>
    <path d="M1240 470 H1120 L1080 510 V670"/>
  </g>
  <g fill="${blue}" fill-opacity="0.35">
    <circle cx="220" cy="88" r="7"/>
    <circle cx="420" cy="560" r="7"/>
    <circle cx="950" cy="90" r="7"/>
    <circle cx="820" cy="610" r="7"/>
    <circle cx="620" cy="420" r="7"/>
    <circle cx="560" cy="490" r="7"/>
    <circle cx="130" cy="520" r="7"/>
    <circle cx="1080" cy="510" r="7"/>
    <circle cx="280" cy="320" r="9"/>
    <circle cx="1010" cy="150" r="9"/>
  </g>
  <g fill="none" stroke="${blueStrong}" stroke-opacity="0.45" stroke-width="3">
    <rect x="186" y="276" width="88" height="44" rx="6"/>
    <rect x="926" y="316" width="88" height="44" rx="6"/>
  </g>
  <g stroke="${blueStrong}" stroke-opacity="0.5" stroke-width="3">
    <line x1="150" y1="298" x2="186" y2="298"/>
    <line x1="150" y1="312" x2="186" y2="312"/>
    <line x1="274" y1="298" x2="310" y2="298"/>
    <line x1="274" y1="312" x2="310" y2="312"/>
    <line x1="890" y1="338" x2="926" y2="338"/>
    <line x1="890" y1="352" x2="926" y2="352"/>
    <line x1="1014" y1="338" x2="1050" y2="338"/>
    <line x1="1014" y1="352" x2="1050" y2="352"/>
  </g>
</svg>`;

const svgWithText = pattern.replace(
  '</svg>',
  `<g>
    <text x="90" y="238" font-family="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" font-size="64" font-weight="700" fill="${ink}">硬件Base</text>
    <text x="92" y="300" font-family="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" font-size="30" fill="${blueStrong}">系统化的硬件器件选型知识库</text>
    <text x="92" y="536" font-family="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" font-size="22" fill="${ink}" opacity="0.72">电阻 · 电容 · 电感 · 二极管 · MOSFET · LDO / DC-DC · MCU · 存储 / DDR · ADC / DAC</text>
    <text x="92" y="592" font-family="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" font-size="22" fill="${blueStrong}">www.hardwarebase.top</text>
  </g>
  </svg>`
);

await sharp(Buffer.from(svgWithText))
  .png()
  .toFile(out);

console.log('OG cover written:', out);
