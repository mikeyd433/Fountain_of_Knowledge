import { chromium } from 'playwright';
const CH='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const errs=[];
const b=await chromium.launch({executablePath:CH});
const p=await b.newPage();
p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('pageerror',e=>errs.push('pageerr:'+e.message));
const base='http://localhost:5173/';

// seed a throwaway page via the dev import endpoint
const seed='---\ntitle: Replace Me\ncategory: ZZ Test\n---\n\n## Before\n\nOld content.\n';
await p.request.post(base+'__import',{data:{files:[{relPath:'ZZ Test/Replace Me.md',content:seed}]}});

await p.goto(base+'#/zz-test/replace-me',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
const title1=await p.$eval('.doc-title',e=>e.textContent.trim()).catch(()=>'(none)');
const hasExport=await p.$('text=Export .md')!==null;
const hasReplace=await p.$('.sec-drop')!==null;
console.log('STEP1 title=%j export=%s replace=%s',title1,hasExport,hasReplace);

// test EXPORT download (web fallback -> browser download)
const [dl]=await Promise.all([
  p.waitForEvent('download',{timeout:5000}).catch(()=>null),
  p.click('text=Export .md'),
]);
console.log('EXPORT download filename=%j',dl?dl.suggestedFilename():'(no download event)');

// test REPLACE via the hidden file input
const newRaw='---\ntitle: Replaced OK\ncategory: ZZ Test\n---\n\n## After\n\n```shortcuts\nDo thing | Ctrl+K\n```\n';
await p.setInputFiles('.sec-drop input[type=file]',{name:'new.md',mimeType:'text/markdown',buffer:Buffer.from(newRaw)});
await p.waitForTimeout(1500); // doReplace writes + reloads
// after reload hash should be the new route
await p.waitForTimeout(800);
const url=p.url();
const title2=await p.$eval('.doc-title',e=>e.textContent.trim()).catch(()=>'(none)');
const rows=await p.$$eval('.shortcut-table tbody tr',r=>r.length).catch(()=>0);
console.log('REPLACE url=%j title=%j shortcutRows=%d',url.split('#')[1],title2,rows);

console.log('ERRORS:',errs.length?JSON.stringify(errs.slice(0,5)):'none');
await b.close();
