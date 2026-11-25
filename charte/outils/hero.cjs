const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [n,o] of [['pc',{viewport:{width:1600,height:900}}],['mob',{...devices['Pixel 5']}]]){const c=await b.newContext(o);await c.addInitScript(()=>{try{sessionStorage.setItem('ascension-shoji','1')}catch(e){}});
const p=await c.newPage();await p.goto('http://localhost:8803/charte/site/index.html');await p.waitForTimeout(5000);
if(n==='mob')await p.evaluate(()=>scrollTo(0,120));await p.waitForTimeout(800);
await p.screenshot({path:process.argv[2]+'/hero-'+n+'.png'});await c.close()}
await b.close()})();
