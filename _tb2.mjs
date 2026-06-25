import { chromium } from 'playwright';
import fs from 'node:fs';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const raw=fs.readFileSync('/root/.claude/uploads/1d69dc63-8d14-501c-961a-a7f5e725fdf6/c2c0a0e6-Blender_UI_Graphics.md','utf8');
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
let toast=null;
const base='http://localhost:5173/';
await p.goto(base,{waitUntil:'networkidle'});
await p.evaluate(async (body)=>{
  const dt=new DataTransfer();
  dt.items.add(new File([body],'Blender_UI_Graphics.md',{type:'text/markdown'}));
  window.dispatchEvent(new DragEvent('dragenter',{dataTransfer:dt,bubbles:true}));
  window.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true}));
}, raw);
await p.waitForTimeout(2800);
await b.close();
