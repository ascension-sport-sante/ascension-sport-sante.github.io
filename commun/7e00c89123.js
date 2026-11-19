(function(){
  var R = document.documentElement; if (!R.classList.contains("clair")) return;
  /* la branche s'efface un peu quand on lit plus bas */
  var loin = false, majLoin = function(){ var l = scrollY > innerHeight * .55; if (l !== loin){ loin = l; R.classList.toggle("sk-loin", l); } };
  addEventListener("scroll", majLoin, {passive:true}); majLoin();
  var mq = matchMedia("(prefers-reduced-motion: reduce)");
  var cv = document.createElement("canvas"); cv.className = "sakura-pluie"; cv.setAttribute("aria-hidden", "true");
  var br = document.querySelector(".sakura-branche"); (br ? br.parentNode : document.body).insertBefore(cv, br);
  /* la carte du texte courant : du haut du texte de présentation jusqu'au téléphone (recalculée si la mise en page bouge) */
  if (R.classList.contains("illus")){ var ht = document.querySelector(".hero-pro .h-txt");
    if (ht){ var placer = function(){ var l = ht.querySelector(".lede"), t = ht.querySelector(".tel-hero") || ht.querySelector(".actions"); if (!l || !t) return;
      var b = ht.getBoundingClientRect(), a = l.getBoundingClientRect(), z = t.getBoundingClientRect(); var p = innerWidth <= 860 ? 16 : 24;
      ht.style.setProperty("--ct", Math.round(a.top - b.top - p) + "px"); ht.style.setProperty("--cb", Math.round(b.bottom - z.bottom - p) + "px"); };
      placer(); addEventListener("resize", placer); setTimeout(placer, 1200); setTimeout(placer, 3500); if (document.fonts) document.fonts.ready.then(placer); } }
  var sol = document.createElement("div"); sol.className = "soleil-coin"; sol.setAttribute("aria-hidden", "true"); cv.parentNode.insertBefore(sol, cv);
  var ctx = cv.getContext("2d"), dpr = Math.min(1.5, devicePixelRatio || 1), W = 0, H = 0, TEL = false;
  /* un vrai pétale de cerisier, rouge vif : large, échancré en cœur au bout, fin à la base ; dégradé du rouge profond au rouge clair,
     un voile de lumière sur un côté, de fines nervures, la base plus sombre, une ombre portée douce (il flotte au-dessus du paysage) */
  function petale(c0, c1, c2, flou, as){
    as = as || 0;   /* l'asymétrie : un lobe un peu plus grand que l'autre, comme un vrai pétale */
    var S = 64, n = Math.round(S * dpr), s = document.createElement("canvas"); s.width = s.height = n;
    var g = s.getContext("2d"); g.scale(n / S, n / S); g.translate(32, 33);
    if (flou && "filter" in g) g.filter = "blur(" + flou + "px)";
    var L = 1 + as * .13, R = 1 - as * .13;
    function forme(){ g.beginPath(); g.moveTo(0, 22); g.bezierCurveTo(-15 * L, 13, -17 * L, -8, -8.5 * L, -20 * L); g.quadraticCurveTo(-4 * L, -25 * L, -1.2, -19.5); g.lineTo(0, -16.5); g.lineTo(1.2, -19.5);
      g.quadraticCurveTo(4 * R, -25 * R, 8.5 * R, -20 * R); g.bezierCurveTo(17 * R, -8, 15 * R, 13, 0, 22); g.closePath(); }
    g.save(); g.shadowColor = "rgba(90,0,12,.3)"; g.shadowBlur = 5; g.shadowOffsetY = 2.5;
    forme(); var d = g.createLinearGradient(0, 22, 0, -22); d.addColorStop(0, c0); d.addColorStop(.45, c1); d.addColorStop(1, c2); g.fillStyle = d; g.fill(); g.restore();
    g.save(); forme(); g.clip();
    /* la lumière sur un côté */
    var h = g.createRadialGradient(-6, -7, 1, -6, -7, 21); h.addColorStop(0, "rgba(255,236,239,.45)"); h.addColorStop(1, "rgba(255,236,239,0)"); g.fillStyle = h; g.fillRect(-32, -32, 64, 64);
    /* le pli central, très doux, et trois nervures fines et courbes */
    g.strokeStyle = "rgba(110,0,18,.16)"; g.lineWidth = 1.3; g.beginPath(); g.moveTo(0, 21); g.quadraticCurveTo(.8, 2, 0, -15); g.stroke();
    g.strokeStyle = "rgba(255,218,223,.2)"; g.lineWidth = .45;
    [-7, 7, -12, 12].forEach(function(x){ g.beginPath(); g.moveTo(0, 19); g.bezierCurveTo(x * .2, 8, x * .8, -2, x * (x < 0 ? L : R), -13 + Math.abs(x) * .2); g.stroke(); });
    /* la base plus sombre, là où il tenait à la fleur */
    var b = g.createRadialGradient(0, 22, 0, 0, 22, 13); b.addColorStop(0, "rgba(90,0,15,.42)"); b.addColorStop(1, "rgba(90,0,15,0)"); g.fillStyle = b; g.fillRect(-32, -32, 64, 64);
    /* le bord lumineux, translucide, comme un pétale à contre-jour */
    forme(); g.strokeStyle = "rgba(255,196,203,.5)"; g.lineWidth = 2.2; g.stroke();
    g.restore();
    forme(); g.strokeStyle = "rgba(110,0,18,.2)"; g.lineWidth = .6; g.stroke();
    return s;
  }
  var TEINTES = [["#A30D1C", "#E3202F", "#FF6B73"], ["#8E0A17", "#D41426", "#F24A55"], ["#B3121F", "#F0313D", "#FF8A8F"], ["#7A0812", "#C0101F", "#E5404B"]];
  var AS = [.7, -.5, .3, -.8];
  var T = TEINTES.map(function(c, i){ return petale(c[0], c[1], c[2], 0, AS[i]); }), TF = TEINTES.map(function(c, i){ return petale(c[0], c[1], c[2], 2.2, AS[i]); });
  var E = petale("#E0505E", "#FF8A93", "#FFD3D7", 0, .2);
  /* les blocs de texte à l'écran (relus deux fois par seconde) : un pétale qui passe derrière s'efface presque : la lecture d'abord */
  var BL = [], blT = 0, SELT = "main h1, main h2, main h3, main p, main li, main blockquote, main figcaption, main .btn, main label, main input, header.top, .r-modal.on .r-sheet";
  function blocs(now){
    if (now - blT < 500) return; blT = now; BL = [];
    var L = document.querySelectorAll(SELT);
    for (var i = 0; i < L.length && BL.length < 90; i++){ var r = L[i].getBoundingClientRect(); if (r.bottom < -20 || r.top > H + 20 || r.width < 2) continue; BL.push([r.left - 14, r.top - 12, r.right + 14, r.bottom + 12]); }
  }
  function derriere(x, y){ for (var i = 0; i < BL.length; i++){ var b = BL[i]; if (x > b[0] && x < b[2] && y > b[1] && y < b[3]) return true; } return false; }
  function trace(sp, x, y, an, fl, t, a, fl2){
    var c = Math.cos(fl), sx = c < 0 ? Math.min(-.14, c) : Math.max(.14, c), sy = .72 + .28 * Math.cos(fl2 || 0), ca = Math.cos(an) * dpr, sa = Math.sin(an) * dpr;
    var al = derriere(x, y) ? a * .1 : a;
    ctx.globalAlpha = al; ctx.setTransform(ca * sx, sa * sx, -sa * sy, ca * sy, x * dpr, y * dpr); ctx.drawImage(sp, -t / 2, -t / 2, t, t);
    if (c > .82){ ctx.globalAlpha = al * Math.min(1, (c - .82) * 5); ctx.drawImage(E, -t / 2, -t / 2, t, t); }   /* l'éclat, quand le pétale fait face à la lumière */
  }
  /* les pétales qui flottent : lents, portés par un vent qui va et vient ; les plus proches, plus grands, sont un peu flous (profondeur) */
  var P = [], N = 0, sy = scrollY, vent = 0;   /* vent déclaré avant la première naissance */
  function neuf(p, partout){
    var z = .45 + Math.random() * .95, k = (Math.random() * 4) | 0;
    p.z = z; p.t = (18 + Math.random() * 16) * z; p.vy = (12 + Math.random() * 16) * z; p.vx = 4 + Math.random() * 12;
    p.a = Math.random() * 6.3; p.va = (Math.random() - .5) * 1.4; p.f = Math.random() * 6.3; p.vf = .9 + Math.random() * 2.2; p.f2 = Math.random() * 6.3; p.vf2 = .6 + Math.random() * 1.6;
    p.ph = Math.random() * 6.3; p.am = 14 + Math.random() * 28; p.s = z > 1.15 ? TF[k] : T[k]; p.o = z > 1.15 ? .78 : .62 + .34 * Math.min(1, z);
    p.vx = (Math.random() - .5) * 12;   /* pas de dérive d'un seul côté */
    if (partout){ p.x = Math.random() * W; p.y = Math.random() * H; }
    else if (Math.abs(vent) > 10 && Math.random() < .35){ p.x = vent > 0 ? -40 : W + 40; p.y = Math.random() * H * .8; }   /* le vent les amène aussi par le côté */
    else { p.x = -40 + Math.random() * (W + 80); p.y = -30 - Math.random() * 80; }   /* sinon, d'en haut, sur toute la largeur */
    return p;
  }
  /* les nuées : un ruban de pétales-lames qui traverse l'écran en ondulant ; chacun tourbillonne autour du courant et laisse une traînée */
  var flux = [], prochain = 0;
  function nuee(now){
    var dir = Math.random() < .5 ? 1 : -1, n = TEL ? 70 : 130;
    var f = {t0:now, D:5200 + Math.random() * 1800, dir:dir, y0:H * (.2 + Math.random() * .55), A:H * (.07 + Math.random() * .1), k:(1.4 + Math.random() * 1.2) * Math.PI / W,
             w:1.2 + Math.random() * 1.2, pente:(Math.random() - .5) * .3 * H, L:W * (.5 + Math.random() * .3), P:[]};
    for (var i = 0; i < n; i++) f.P.push({s:Math.pow(Math.random(), .75), d:(Math.random() - .5) * 2, r:4 + Math.random() * 16, ph:Math.random() * 6.3, vr:2.5 + Math.random() * 5,
      a:Math.random() * 6.3, va:(Math.random() - .5) * 10, fl:Math.random() * 6.3, vf:4 + Math.random() * 7, fl2:Math.random() * 6.3, t:(13 + Math.random() * 12) * (TEL ? .9 : 1), sp:T[(Math.random() * 4) | 0]});
    flux.push(f);
  }
  function dessinerFlux(now){
    for (var j = flux.length - 1; j >= 0; j--){
      var f = flux[j], u = (now - f.t0) / f.D, tt = (now - f.t0) / 1000;
      if (u > 1.4){ flux.splice(j, 1); continue; }
      var hx = f.dir > 0 ? -.2 * W + 1.6 * W * u : 1.2 * W - 1.6 * W * u;   /* la tête de la nuée */
      var entree = Math.min(1, u / .08), sortie = u > 1 ? Math.max(0, 1 - (u - 1) / .4) : 1;
      for (var i = 0; i < f.P.length; i++){
        var p = f.P[i], x = hx - f.dir * p.s * f.L;
        if (x < -50 || x > W + 50) continue;
        var y = f.y0 + f.pente * (x / W - .5) + f.A * Math.sin(f.k * x + f.w * tt) + p.d * (14 + 74 * p.s);
        x += Math.cos(p.ph + p.vr * tt) * p.r; y += Math.sin(p.ph + p.vr * tt) * p.r * .6;
        trace(p.sp, x, y, p.a + p.va * tt, p.fl + p.vf * tt, p.t, Math.min(1, (1 - p.s) * 2.6 + .2) * entree * sortie * .95, p.fl2 + 2 * tt);
      }
    }
  }
  /* les grues (tsuru, longue vie et santé) : une petite formation en V traverse le haut du ciel, lentement, de temps en temps ;
     silhouettes à l'encre sumi, la couronne rouge de la grue du Japon ; elles s'effacent derrière les textes comme les pétales */
  var vols = [], prochGrue = 0, BL_G = R.classList.contains("grues-blanches"), ENC = BL_G ? "#FFFBF1" : "#26211C", ROUGE = "#C41E2A";
  function vol(now){
    var dir = Math.random() < .5 ? 1 : -1, n = TEL ? 5 : 7, s0 = (TEL ? 30 : 44) * (.85 + Math.random() * .35), g = {t0:now, dir:dir, D:(TEL ? 21000 : 30000) * (.9 + Math.random() * .25),
      y0:H * (.09 + Math.random() * .16), pente:(Math.random() - .6) * H * .08, B:[]};
    for (var i = 0; i < n; i++){ var c = Math.ceil(i / 2), cote = i % 2 ? 1 : -1;
      g.B.push({dx:-c * s0 * 1.05 + (Math.random() - .5) * s0 * .25, dy:cote * c * s0 * .4 + (Math.random() - .5) * s0 * .15, s:s0 * (1 - c * .04), ph:Math.random() * 6.3, v:5.2 + Math.random() * .9, bob:Math.random() * 6.3}); }
    vols.push(g);
  }
  function aile(s, w, k){   /* une aile vue de côté : bord d'attaque arqué, rémiges en éventail au bout, bord de fuite sombre */
    var ty = -w * s * .5 * k, tx = -s * .05;
    ctx.beginPath(); ctx.moveTo(s * .1, -s * .01);
    ctx.quadraticCurveTo(s * .08, ty * .6, tx + s * .03, ty);
    ctx.lineTo(tx - s * .015, ty * 1.02); ctx.lineTo(tx - s * .05, ty * .95); ctx.lineTo(tx - s * .08, ty * .86);
    ctx.quadraticCurveTo(-s * .15, ty * .45, -s * .1, s * .005); ctx.closePath(); ctx.fill();
  }
  function grue(x, y, s, ph, dir, a){
    var al = derriere(x, y) ? a * .12 : a, w = Math.sin(ph) * .92 + .18;   /* un peu plus longtemps ailes hautes : la grue plane */
    ctx.setTransform(dir * dpr, 0, 0, dpr, x * dpr, y * dpr); ctx.fillStyle = ENC; ctx.strokeStyle = ENC; ctx.lineCap = "round";
    if (BL_G){ ctx.shadowColor = "rgba(90,60,10,.45)"; ctx.shadowBlur = 3 * dpr; } else ctx.shadowBlur = 0;
    ctx.globalAlpha = al * .55; aile(s, w, .8);                                  /* l'aile lointaine, plus pâle */
    ctx.globalAlpha = al;
    ctx.beginPath(); ctx.ellipse(0, 0, s * .2, s * .042, -.05, 0, 6.2832); ctx.fill();   /* le corps */
    ctx.lineWidth = s * .028; ctx.beginPath(); ctx.moveTo(s * .14, -s * .012); ctx.quadraticCurveTo(s * .3, -s * .035, s * .45, -s * .024); ctx.stroke();   /* le long cou tendu */
    ctx.beginPath(); ctx.ellipse(s * .475, -s * .024, s * .03, s * .017, -.08, 0, 6.2832); ctx.fill();   /* la tête */
    ctx.lineWidth = s * .011; ctx.beginPath(); ctx.moveTo(s * .5, -s * .02); ctx.lineTo(s * .6, -s * .01); ctx.stroke();   /* le bec */
    ctx.beginPath(); ctx.moveTo(-s * .16, s * .012); ctx.lineTo(-s * .5, s * .03); ctx.moveTo(-s * .15, s * .022); ctx.lineTo(-s * .48, s * .052); ctx.stroke();   /* les pattes tendues derrière */
    ctx.fillStyle = ROUGE; ctx.beginPath(); ctx.arc(s * .47, -s * .039, s * .014, 0, 6.2832); ctx.fill(); ctx.fillStyle = ENC;   /* la couronne rouge */
    aile(s, w, 1);                                                               /* l'aile proche */
    ctx.shadowBlur = 0;
  }
  function dessinerGrues(now){
    for (var j = vols.length - 1; j >= 0; j--){
      var g = vols[j], u = (now - g.t0) / g.D, tt = (now - g.t0) / 1000;
      if (u > 1){ vols.splice(j, 1); continue; }
      var hx = g.dir > 0 ? -.12 * W + 1.45 * W * u : 1.12 * W - 1.45 * W * u, hy = g.y0 + g.pente * u;
      var fondu = Math.min(1, u / .06, (1 - u) / .06);
      for (var i = 0; i < g.B.length; i++){
        var b = g.B[i], x = hx + g.dir * b.dx, y = hy + b.dy + Math.sin(b.bob + tt * .9) * b.s * .06;
        if (x < -80 || x > W + 80) continue;
        grue(x, y, b.s, b.ph + b.v * tt, g.dir, .62 * fondu);
      }
    }
  }
  /* la lumière du soleil : des grains d'or partent du disque et viennent frapper le lac (un éclat, puis des ronds dans l'eau) ;
     sous le soleil, l'eau scintille. Sur les pages sans lac, les grains descendent doucement et s'éteignent. */
  var LAC = {accueil:[.685, .675]};   /* hauteur de la ligne d'eau (fraction de l'écran), ordinateur / téléphone */
  function lueur(r0, c0, c1){ var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d"), d = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    d.addColorStop(0, c0); d.addColorStop(r0, c1); d.addColorStop(1, "rgba(226,140,30,0)"); g.fillStyle = d; g.fillRect(0, 0, 64, 64); return c; }
  var ANIME = R.classList.contains("soleil-anime");   /* soleil lumineux : une lumière blanche et dorée, des reflets blancs sur l'eau */
  var GL = ANIME ? lueur(.3, "rgba(255,255,250,1)", "rgba(255,212,130,.85)") : lueur(.24, "rgba(255,251,238,1)", "rgba(232,104,36,.85)"),
      HA = ANIME ? lueur(.05, "rgba(255,224,150,.5)", "rgba(255,206,130,.22)") : lueur(.05, "rgba(228,96,34,.5)", "rgba(220,90,30,.24)");   /* la lumière du soleil rouge : cœur blanc, frange vermillon (se voit sur l'or et le beige) */
  var ET = (function(){ var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");   /* éclat en étoile à 4 branches */
    g.translate(32, 32); g.fillStyle = ANIME ? "rgba(255,226,160,.95)" : "rgba(206,84,30,.92)"; for (var k = 0; k < 2; k++){ g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(2.2, -2.2, 30, 0); g.quadraticCurveTo(2.2, 2.2, 0, 30); g.quadraticCurveTo(-2.2, 2.2, -30, 0); g.quadraticCurveTo(-2.2, -2.2, 0, -30); g.fill(); g.rotate(Math.PI / 4); g.scale(.55, .55); g.fillStyle = "rgba(255,246,220,.95)"; }
    return c; })();
  var SC = (function(){ var c = document.createElement("canvas"); c.width = 64; c.height = 8; var g = c.getContext("2d"), d = g.createLinearGradient(0, 0, 64, 0);   /* reflet allongé sur l'eau */
    d.addColorStop(0, "rgba(224,150,40,0)"); d.addColorStop(.5, "rgba(255,236,190,1)"); d.addColorStop(1, "rgba(224,150,40,0)"); g.fillStyle = d; g.fillRect(0, 2, 64, 4); g.fillStyle = ANIME ? "rgba(255,255,255,.35)" : "rgba(140,80,18,.85)"; g.fillRect(8, 6, 48, 1.6); return c; })();
  var grains = [], ronds = [], eclats = [], solR = null, solT = 0, prochGrain = 0;
  function soleilPeint(){
    var f = (R.getAttribute("data-fond") || "").split(",").map(Number), s = (R.getAttribute("data-soleil") || "").split(",").map(Number); if (f.length < 3 || s.length < 3) return null;
    var iw, ih, ox, oy; if (W / H > f[0]){ iw = W; ih = W / f[0]; ox = 0; oy = (ih - H) * f[2]; } else { ih = H; iw = H * f[0]; oy = 0; ox = (iw - W) * f[1]; }
    return {x:s[0] * iw - ox, y:s[1] * ih - oy, r:s[2] * iw * .8};
  }
  function soleil(now){ if (now - solT < 500 && solR) return solR; solT = now; if (!TEL && R.classList.contains("soleil-peint")){ solR = soleilPeint(); if (solR) return solR; } var b = sol.getBoundingClientRect(); solR = {x:b.left + b.width / 2, y:b.top + b.height / 2, r:b.width * (ANIME ? .07 : .33)}; return solR; }
  function ligneEau(){ var l = R.getAttribute("data-lac") ? R.getAttribute("data-lac").split(",").map(Number) : LAC[R.getAttribute("data-page") || "accueil"]; if (!l || scrollY > H * .45) return 0; return l[TEL ? 1 : 0] * H - scrollY * .35; }
  function lumiere(now, dt){
    var S = soleil(now), eau = ligneEau(), proche = scrollY < H * .55;
    if (proche && now > prochGrain){ prochGrain = now + (TEL ? 700 : 380) + Math.random() * (TEL ? 700 : 420);
      var a = Math.random() * 6.283, rr = Math.sqrt(Math.random()) * S.r * .8, x0 = S.x + Math.cos(a) * rr, y0 = S.y + Math.sin(a) * rr, x1, y1;
      if (eau){ var dpt = Math.random(); y1 = eau + 8 + dpt * dpt * (H - eau - 16); x1 = R.getAttribute("data-reflet-x") ? W * (+R.getAttribute("data-reflet-x") + (Math.random() - .5) * (.08 + .4 * dpt)) : W * (.12 + Math.random() * .8); }
      else { y1 = H * (.4 + Math.random() * .5); x1 = W * (.08 + Math.random() * .8); }
      grains.push({x0:x0, y0:y0, x1:x1, y1:y1, cx:(x0 + x1) / 2 + (Math.random() - .3) * W * .12, cy:Math.min(y0, y1) + (y1 - y0) * (.1 + Math.random() * .2), t0:now, D:(eau ? 3400 : 4600) + Math.random() * 2200, s:(TEL ? 11 : 13) + Math.random() * 7, eau:!!eau, ph:Math.random() * 6.3});
    }
    for (var i = grains.length - 1; i >= 0; i--){
      var g = grains[i], u = (now - g.t0) / g.D;
      if (u >= 1){ grains.splice(i, 1); if (g.eau){ var k = .45 + .9 * Math.max(0, (g.y1 - eau) / Math.max(1, H - eau)); ronds.push({x:g.x1, y:g.y1, t0:now, k:k}); } continue; }
      var al = Math.min(1, u * 6) * (g.eau ? 1 : 1 - u * u) * (.75 + .25 * Math.sin(now / 90 + g.ph));
      for (var q = 4; q >= 0; q--){   /* une petite traînée de lumière */
        var e = Math.max(0, Math.pow(u, 1.5) - q * .018), m = 1 - e, x = m * m * g.x0 + 2 * m * e * g.cx + e * e * g.x1, y = m * m * g.y0 + 2 * m * e * g.cy + e * e * g.y1;
        var t = g.s * (1 - q * .17), aq = al * (1 - q * .2) * (derriere(x, y) ? .12 : 1);
        ctx.globalAlpha = aq * .5; ctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr); ctx.drawImage(HA, -t * 1.4, -t * 1.4, t * 2.8, t * 2.8);
        ctx.globalAlpha = aq; ctx.drawImage(GL, -t / 2, -t / 2, t, t);
      }
    }
    for (i = ronds.length - 1; i >= 0; i--){   /* l'impact : un éclat, puis deux ronds qui s'élargissent sur l'eau */
      var o = ronds[i], q2 = (now - o.t0) / 1800; if (q2 > 1){ ronds.splice(i, 1); continue; }
      ctx.setTransform(dpr, 0, 0, dpr, o.x * dpr, o.y * dpr);
      if (q2 < .3){ var es = o.k * 22 * Math.sin(q2 / .3 * Math.PI); ctx.globalAlpha = .95; ctx.drawImage(ET, -es / 2, -es / 2, es, es); }
      ctx.lineWidth = 1.4; ctx.strokeStyle = ANIME ? "rgba(255,255,255,1)" : "rgba(128,72,18,1)";
      for (var n = 0; n < 2; n++){ var qq = q2 - n * .18; if (qq <= 0) continue; var rx = o.k * (3 + 34 * Math.sqrt(qq)); ctx.globalAlpha = .75 * Math.pow(1 - qq, 1.6);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * .24, 0, 0, 6.2832); ctx.stroke(); }
    }
    if (ANIME && S && scrollY < H * .6){
      var vx = W / 2 - S.x, vy = H / 2 - S.y, FL = [[.32, 26, "rgba(255,236,190,.16)"], [.5, 12, "rgba(190,225,255,.2)"], [.64, 40, "rgba(255,214,170,.09)"], [1.25, 64, "rgba(200,230,255,.07)"]];
      for (var f = 0; f < FL.length; f++){ var fx = S.x + vx * FL[f][0], fy = S.y + vy * FL[f][0]; if (derriere(fx, fy)) continue;
        ctx.setTransform(dpr, 0, 0, dpr, fx * dpr, fy * dpr); ctx.globalAlpha = .8 + .2 * Math.sin(now / 900 + f); ctx.fillStyle = FL[f][2]; ctx.beginPath(); ctx.arc(0, 0, FL[f][1] * (TEL ? .7 : 1), 0, 6.2832); ctx.fill(); }
    }
    if (eau && S){   /* l'eau scintille sous le soleil : un chemin de reflets */
      var n2 = TEL ? 1 : 2; for (var j = 0; j < n2; j++) if (Math.random() < .7){ var dp = Math.random(), yy = eau + 6 + dp * (H - eau - 10), sp = 18 + 150 * dp;
        eclats.push({x:(R.getAttribute("data-reflet-x") ? W * +R.getAttribute("data-reflet-x") : S.x) + (Math.random() + Math.random() + Math.random() - 1.5) * sp, y:yy, t0:now, D:280 + Math.random() * 520, k:.5 + dp * .9}); }
      for (i = eclats.length - 1; i >= 0; i--){ var c = eclats[i], q3 = (now - c.t0) / c.D; if (q3 > 1){ eclats.splice(i, 1); continue; }
        var w2 = c.k * 26 * Math.sin(q3 * Math.PI); ctx.globalAlpha = .85 * Math.sin(q3 * Math.PI); ctx.setTransform(dpr, 0, 0, dpr, c.x * dpr, c.y * dpr); ctx.drawImage(SC, -w2 / 2, -2 * c.k, w2, 5 * c.k); }
    } else eclats.length = 0;
  }
  function taille(){
    W = innerWidth; H = innerHeight; TEL = W <= 860; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    N = TEL ? 20 : 40; while (P.length < N) P.push(neuf({}, true)); P.length = N;
  }
  var on = false, dernier = 0, id = 0;
  function pas(now){
    if (!on) return; id = requestAnimationFrame(pas);
    if (now - dernier < (TEL ? 31 : 15)) return;   /* 60 images par seconde au plus, 30 au téléphone (lot 152 : le téléphone garde de la réserve pour réagir) */
    var dt = Math.min(.05, (now - (dernier || now)) / 1000); dernier = now;
    if (!prochain) prochain = now + 1300;             /* la première nuée passe peu après l'arrivée */
    if (now > prochain){ nuee(now); prochain = now + 14000 + Math.random() * 9000; }
    var dy = scrollY - sy; sy = scrollY; if (Math.abs(dy) > H) dy = 0; if (dy) blT = 0; blocs(now);
    /* des traînées pendant le passage d'une nuée, une image nette le reste du temps */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (flux.length){ ctx.globalCompositeOperation = "destination-out"; ctx.globalAlpha = 1; ctx.fillStyle = "rgba(0,0,0,.36)"; ctx.fillRect(0, 0, cv.width, cv.height); ctx.globalCompositeOperation = "source-over"; }
    else ctx.clearRect(0, 0, cv.width, cv.height);
    var ts = now / 1000; vent = 16 * Math.sin(ts * .13) + 9 * Math.sin(ts * .31 + 1.3);   /* le vent va et vient */
    for (var i = 0; i < P.length; i++){
      var p = P[i];
      p.ph += dt * .6; p.a += p.va * dt; p.f += p.vf * dt; p.f2 += p.vf2 * dt;
      p.x += (p.vx + vent * p.z + Math.sin(p.ph) * p.am) * dt; p.y += (p.vy + Math.cos(p.ph * 1.3) * 6) * dt - dy * .18 * p.z;
      if (p.y > H + 40 || p.x > W + 80 || p.x < -80 || p.y < -160) neuf(p, false);
      trace(p.s, p.x, p.y, p.a, p.f, p.t, p.o, p.f2);
    }
    dessinerFlux(now);
    if (!prochGrue) prochGrue = now + 4500;           /* le premier vol passe quelques secondes après l'arrivée */
    if (now > prochGrue){ vol(now); prochGrue = now + 32000 + Math.random() * 18000; }
    dessinerGrues(now);
    lumiere(now, dt);
  }
  function calme(){ return mq.matches || R.classList.contains("confort"); }
  function maj(){
    var voile = R.classList.contains("som-vu") || R.classList.contains("r-vu");   /* lot 152 : menu ou fenêtre par-dessus : pause, sans rien effacer */
    var doit = !document.hidden && !calme() && !voile;
    if (doit && !on){ on = true; dernier = 0; sy = scrollY; id = requestAnimationFrame(pas); }
    else if (!doit && on){ on = false; cancelAnimationFrame(id); if (voile) return; flux = []; vols = []; grains = []; ronds = []; eclats = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  taille(); addEventListener("resize", function(){ taille(); });
  document.addEventListener("visibilitychange", maj);
  if (mq.addEventListener) mq.addEventListener("change", maj);
  if (window.MutationObserver) new MutationObserver(maj).observe(R, {attributes:true, attributeFilter:["class"]});
  maj();
})();