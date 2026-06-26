import { chromium } from 'playwright';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const bundle=`---
category: ZZ Deep
section: L1/L2
bundle: true
icon: "📦"
---

# Page One

Shallow page.

# L3a/L3b/Deep Page

\`\`\`shortcuts
Go deep | Ctrl+D
\`\`\`
`;
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const base='http://localhost:5173/';
await p.goto(base,{waitUntil:'networkidle'});
await p.evaluate(async (body)=>{const dt=new DataTransfer();dt.items.add(new File([body],'deep.md',{type:'text/markdown'}));window.dispatchEvent(new DragEvent('dragenter',{dataTransfer:dt,bubbles:true}));window.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true}));}, bundle);
await p.waitForTimeout(2500);
for(const r of ['/zz-deep/l1/l2/page-one','/zz-deep/l1/l2/l3a/l3b/deep-page']){
  await p.goto(base+'#'+r,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const t=await p.$eval('.doc-title',e=>e.textContent.trim()).catch(()=>'(none)');
  const crumb=await p.$$eval('.breadcrumb *',els=>els.map(e=>e.textContent.trim()).filter(Boolean)).catch(()=>[]);
  console.log('%s -> title=%j depth(route segs)=%d', r, t, r.split('/').filter(Boolean).length);
}
console.log('errors:',errs.length?JSON.stringify(errs):'none');
await b.close();
