import { chromium } from 'playwright';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const errs=[];
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('pageerror',e=>errs.push('pageerr:'+e.message));
const base='http://localhost:5173/';
await p.goto(base,{waitUntil:'networkidle'});

const bundle=`---
category: ZZ Bundle
section: Pack
bundle: true
icon: "🎚️"
tags: [demo]
---

# Alpha

## Intro
Press \`Ctrl+A\` to select all.

# Beta

\`\`\`shortcuts
Do thing | Ctrl+K
\`\`\`

# Gamma

Some text here.
`;

await p.evaluate(async (body)=>{
  const dt=new DataTransfer();
  dt.items.add(new File([body],'my-pack.md',{type:'text/markdown'}));
  window.dispatchEvent(new DragEvent('dragenter',{dataTransfer:dt,bubbles:true}));
  window.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true}));
}, bundle);

await p.waitForTimeout(1800); // import + reload

for(const r of ['/zz-bundle/pack/alpha','/zz-bundle/pack/beta','/zz-bundle/pack/gamma']){
  await p.goto(base+'#'+r,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const t=await p.$eval('.doc-title',e=>e.textContent.trim()).catch(()=>'(none)');
  const rows=await p.$$eval('.shortcut-table tbody tr',x=>x.length).catch(()=>0);
  console.log('  %s -> title=%j shortcutRows=%d',r,t,rows);
}
console.log('ERRORS:',errs.length?JSON.stringify(errs.slice(0,4)):'none');
await b.close();
