import { chromium } from 'playwright';
import fs from 'node:fs';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const raw=fs.readFileSync('/root/.claude/uploads/1d69dc63-8d14-501c-961a-a7f5e725fdf6/c2c0a0e6-Blender_UI_Graphics.md','utf8');
const errs=[];
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('pageerror',e=>errs.push('pageerr:'+e.message));
const base='http://localhost:5173/';
await p.goto(base,{waitUntil:'networkidle'});

const res = await p.evaluate(async (body)=>{
  const dt=new DataTransfer();
  dt.items.add(new File([body],'Blender_UI_Graphics.md',{type:'text/markdown'}));
  window.dispatchEvent(new DragEvent('dragenter',{dataTransfer:dt,bubbles:true}));
  window.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true}));
  return 'dispatched';
}, raw);

await p.waitForTimeout(2500); // import + reload
// Count pages under the Graphics Pipeline category via the tree
const leaves = await p.$$eval('.tree a', as=>as.map(a=>a.getAttribute('href')).filter(h=>h&&h.includes('/graphics-pipeline/')));
console.log('pages under graphics-pipeline:', leaves.length);
console.log(JSON.stringify(leaves.slice(0,30),null,0));
console.log('ERRORS:',errs.length?JSON.stringify(errs.slice(0,6)):'none');
await b.close();
