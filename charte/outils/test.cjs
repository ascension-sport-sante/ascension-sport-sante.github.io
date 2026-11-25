const {chromium,devices}=require('playwright');const B='http://localhost:8803/charte/site/';
(async()=>{const b=await chromium.launch();const out=[];
for(const [m,o] of [['pc',{viewport:{width:1440,height:900}}],['mob',{...devices['Pixel 5']}]]){const c=await b.newContext(o);await c.addInitScript(()=>{try{sessionStorage.setItem('ascension-shoji','1')}catch(e){}});const p=await c.newPage();const e404=new Set(),err=[];
 p.on('response',r=>{if(r.status()>=400)e404.add(r.status()+' '+r.url().replace(B,''))});p.on('pageerror',e=>err.push(e.message.slice(0,90)));
 for(const r of ['index.html','tarifs/index.html','methode/index.html','bilan/index.html','a-propos/index.html','activite-physique-adaptee-domicile/index.html']){await p.goto(B+r);await p.waitForTimeout(1300)}
 await p.goto(B+'index.html');await p.waitForTimeout(1200);await p.click('a.nv-l[href*="tarifs"]').catch(()=>{});await p.waitForTimeout(2000);const u1=p.url().replace(B,'');
 out.push(m+' | navigation accueil→tarifs : '+u1+' | 404 : '+[...e404].slice(0,8).join(', ')+' | erreurs JS : '+(err.join(' ; ')||'aucune'));await c.close();}
console.log(out.join('\n'));await b.close();})();
