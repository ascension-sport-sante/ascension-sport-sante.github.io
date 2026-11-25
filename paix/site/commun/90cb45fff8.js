/* lot 166 v2 : copies cachées des icônes immobiles */
(function(){
  if (!("IntersectionObserver" in window)) return;
  var ANIM = {}, nSym = -1, sprite = null, suivis = new WeakSet(), cadres = [];
  var SEL = "animate, animateTransform, animateMotion, set";
  function preparer(){
    var ys = document.querySelectorAll('symbol[id^="vg-"]'); if (ys.length === nSym) return;
    [].forEach.call(ys, function(y){
      if (/--fixe$/.test(y.id) || ANIM[y.id] || !y.querySelector(SEL)) return;
      ANIM[y.id] = 1; sprite = sprite || y.closest("svg");
      if (!document.getElementById(y.id + "--fixe")){
        var f = y.cloneNode(true); f.id = y.id + "--fixe";
        [].forEach.call(f.querySelectorAll(SEL), function(a){ a.parentNode.removeChild(a); });
        y.parentNode.appendChild(f);
      }
    });
    nSym = document.querySelectorAll('symbol[id^="vg-"]').length;
  }
  function base(u){ var h = u.getAttribute("href") || u.getAttribute("xlink:href") || ""; return h.charAt(0) === "#" ? h.slice(1).replace(/--fixe$/, "") : ""; }
  function visible(s){
    if (!s.__dedans) return false;
    for (var a = s; a && a.nodeType === 1; a = a.parentElement){
      var c = getComputedStyle(a); if (c.display === "none" || c.visibility === "hidden" || +c.opacity === 0) return false;
    }
    return true;
  }
  function viser(u, id){ var h = "#" + id; if (u.getAttribute("href") !== h) u.setAttribute("href", h); if (u.hasAttribute("xlink:href") && u.getAttribute("xlink:href") !== h) u.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", h); }
  function maj(){
    var n = 0;
    cadres = cadres.filter(function(s){ return s.isConnected; });
    cadres.forEach(function(s){
      var v = visible(s);
      s.__uses.forEach(function(u){ var b = u.__b; if (v){ viser(u, b); n++; } else viser(u, b + "--fixe"); });
    });
    if (sprite && sprite.pauseAnimations) try { if (n) { if (sprite.animationsPaused()) sprite.unpauseAnimations(); } else if (!sprite.animationsPaused()) sprite.pauseAnimations(); } catch (x) {}
  }
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ e.target.__dedans = e.isIntersecting; }); revoir(); }, {rootMargin:"80px 0px"});
  function scan(){
    preparer();
    [].forEach.call(document.querySelectorAll("use"), function(u){
      if (suivis.has(u)) return; var b = base(u); if (!ANIM[b]) return;
      suivis.add(u); u.__b = b;
      var s = u.ownerSVGElement; while (s && s.ownerSVGElement) s = s.ownerSVGElement;
      if (!s) return;
      if (!s.__uses){ s.__uses = []; s.__dedans = false; cadres.push(s); io.observe(s); }
      s.__uses.push(u);
    });
  }
  var rq = 0;
  function revoir(){ if (rq) return; rq = requestAnimationFrame(function(){ rq = 0; scan(); maj(); }); }
  function plusTard(){ revoir(); setTimeout(revoir, 80); setTimeout(revoir, 450); }   /* menus et fenêtres s'ouvrent en fondu */
  var mo = new MutationObserver(plusTard), vusMenus = new WeakSet();
  function menus(){ [].forEach.call(document.querySelectorAll("#sommaire, #nv-prest, .nv-drop, .r-modal"), function(m){ if (vusMenus.has(m)) return; vusMenus.add(m); mo.observe(m, {attributes:true, attributeFilter:["class", "hidden", "style", "aria-hidden"]}); }); }
  var ajouts = new MutationObserver(function(ms){
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++){ var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (/^(svg|use)$/i.test(n.tagName) || n.querySelector("use"))){ menus(); plusTard(); return; } }
  });
  function brancher(){
    scan(); maj(); menus();
    mo.observe(document.documentElement, {attributes:true, attributeFilter:["class", "data-page"]});
    ajouts.observe(document.body, {childList:true, subtree:true});
    addEventListener("load", plusTard); setTimeout(plusTard, 1500);
    document.addEventListener("click", plusTard, true);
    document.addEventListener("focusin", plusTard, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", brancher); else brancher();
})();
