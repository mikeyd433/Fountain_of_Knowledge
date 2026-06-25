import { chromium } from 'playwright';
import fs from 'node:fs';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const raw=fs.readFileSync('/root/.claude/uploads/1d69dc63-8d14-501c-961a-a7f5e725fdf6/c2c0a0e6-Blender_UI_Graphics.md','utf8');
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
p.on('dialog',d=>d.accept()); // auto-confirm window.confirm
const base='http://localhost:5173/';
await p.goto(base,{waitUntil:'networkidle'});
// import the bundle
await p.evaluate(async (body)=>{const dt=new DataTransfer();dt.items.add(new File([body],'Blender_UI_Graphics.md',{type:'text/markdown'}));window.dispatchEvent(new DragEvent('dragenter',{dataTransfer:dt,bubbles:true}));window.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true}));}, raw);
await p.waitForTimeout(2600);
console.log('after import, disk count:', fs.existsSync('src/content/Graphics Pipeline')? fs.readdirSync('src/content/Graphics Pipeline/Blender UI Graphics').length : 0);
// click the delete (trash) button on the top-level "Graphics Pipeline" folder row
const clicked = await p.evaluate(()=>{
  const btns=[...document.querySelectorAll('.tree-folder')].map(li=>li.querySelector('.tree-folder-name'));
  for(const li of document.querySelectorAll('.tree-folder')){
    const name=li.querySelector('.tree-folder-name');
    if(name && name.textContent.trim()==='Graphics Pipeline'){
      li.querySelector('.tree-del').click();
      return true;
    }
  }
  return false;
});
console.log('delete button clicked:', clicked);
await p.waitForTimeout(2200);
console.log('after delete, folder exists on disk:', fs.existsSync('src/content/Graphics Pipeline'));
await b.close();
