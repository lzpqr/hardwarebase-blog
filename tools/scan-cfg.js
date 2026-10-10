const fs=require('fs');
const s=fs.readFileSync('H:/ai/codex/web/_config.butterfly.yml','utf8');
let i=-1;const out=[];
while((i=s.indexOf('hardware-interface-protocol',i+1))>=0){out.push(i);}
console.log('occurrences:',out.length);
out.forEach(p=>{
  console.log('=== at',p,'===');
  console.log(s.slice(Math.max(0,p-100),p+250).replace(/\n/g,'\n'));
});
