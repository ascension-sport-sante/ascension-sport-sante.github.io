// Captures pleine page : node cap.cjs <base> <dossier> <pages séparées par des virgules> [pc,mob]
const {chromium,devices}=require('playwright');const [B,O,P,M]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();
for(const [m,o] of [['pc',{viewport:{width:1440,height:900}}],['mob',{...devices['Pixel 5']}]]){if(M&&!M.split(',').includes(m))continue;
 const c=await b.newContext({...o,colorScheme:'light'});await c.addInitScript(()=>{try{sessionStorage.setItem('ascension-shoji','1')}catch(e){}});const p=await c.newPage();
 for(const r of P.split(',')){await p.goto(B+r);await p.waitForTimeout(900);
  await p.addStyleTag({content:'.sakura-pluie,.cur,.encre-pc{visibility:hidden!important}.rv,.reveal{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}'});
  const h=await p.evaluate(()=>document.body.scrollHeight);for(let y=0;y<h;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(50)}
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
  await p.screenshot({path:O+'/'+(r.split('/')[0].replace('.html','')||'index')+'-'+m+'.png',fullPage:true});}
 await c.close();}
await b.close();})();
