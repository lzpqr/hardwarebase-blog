const fs = require('fs');
const p = 'H:/ai/codex/web/source/css/custom.css';
let s = fs.readFileSync(p, 'utf8');
// Find the old tooltip block and replace it
const marker = '#rightside #rightside-config::after';
const idx = s.indexOf(marker);
if (idx === -1) { console.log('marker not found'); process.exit(1); }
const cssBlockStart = s.lastIndexOf('\n/* ---', idx);
const blockEnd = idx + marker.length + 20;
const newBlock = '\n/* --- rightside button labels above on hover --- */\n#rightside>div{position:relative}\n#rightside>div>a,#rightside>div>button{position:relative}\n#rightside>div>a::before,#rightside>div>button::before{content:attr(data-label);position:absolute;left:50%;top:-26px;transform:translateX(-50%);white-space:nowrap;font-size:11px;color:#fff;background:#3a3f53;padding:2px 7px;border-radius:4px;pointer-events:none;opacity:0;transition:opacity .2s ease,top .2s ease;z-index:101}\n#rightside>div>a::after,#rightside>div>button::after{content:"";position:absolute;left:50%;top:-8px;transform:translateX(-50%);border:4px solid transparent;border-top-color:#3a3f53;pointer-events:none;opacity:0;transition:opacity .2s ease;z-index:101}\n#rightside>div>a:hover::before,#rightside>div>button:hover::before,#rightside.rightside-show>div>a:hover::before,#rightside.rightside-show>div>button:hover::before{opacity:1;top:-30px}\n#rightside>div>a:hover::after,#rightside>div>button:hover::after,#rightside.rightside-show>div>a:hover::after,#rightside.rightside-show>div>button:hover::after{opacity:1}\n' + s.substring(idx, idx + marker.length + 20).replace(/display:\s*none/, 'display:none') + '\n';
const ns = s.substring(0, cssBlockStart) + newBlock + s.substring(blockEnd);
fs.writeFileSync(p, ns, 'utf8');
console.log('CSS updated, length:', ns.length);