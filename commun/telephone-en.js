/* Téléphone seulement : formulaires raccourcis (questions facultatives repliées) et pied de page en volets */
(function () {
  if (!window.matchMedia || !matchMedia("(max-width:860px)").matches) return;

  // 1) Formulaires « Être appelé » : prénom, téléphone et le bouton ; le reste se déplie si l'on veut
  document.querySelectorAll("form.r-ici").forEach(function (f) {
    if (f.querySelector(".r-opt")) return;
    var subs = [].filter.call(f.querySelectorAll(".r-sub"), function (p) { return /facultatif/i.test(p.textContent); });
    if (!subs.length) return;
    var d = document.createElement("details");
    d.className = "r-opt";
    var s = document.createElement("summary");
    s.textContent = "More details (optional): who it’s for, when to call you";
    d.appendChild(s);
    var avant = subs[0];
    f.insertBefore(d, avant);
    subs.forEach(function (p) {
      var n = p.nextElementSibling;
      d.appendChild(p);
      if (n && n.classList.contains("r-chips")) d.appendChild(n);
    });
  });

  // 2) Pied de page : chaque groupe de liens s'ouvre d'un toucher (le contact reste visible)
  document.querySelectorAll("footer.pied nav").forEach(function (n, i) {
    var h = n.querySelector("h3");
    if (!h || n.querySelector(".pied-bt")) return;
    var liens = [].filter.call(n.children, function (c) { return c !== h; });
    var box = document.createElement("div");
    box.className = "pied-liste";
    box.id = "pied-liste-" + i;
    box.hidden = true;
    liens.forEach(function (a) { box.appendChild(a); });
    n.appendChild(box);
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pied-bt";
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-controls", box.id);
    b.textContent = h.textContent;
    h.textContent = "";
    h.appendChild(b);
    b.addEventListener("click", function () {
      var ouvert = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", ouvert ? "false" : "true");
      box.hidden = ouvert;
    });
  });
})();

/* Téléphone : hauteur d'écran stable (elle ne change pas quand la barre du navigateur apparaît ou disparaît,
   ce qui faisait bouger la page toute seule), et petites sections regroupées pour remplir un écran sans grands vides */
(function () {
  if (!window.matchMedia) return;
  var R = document.documentElement, largeur = 0;
  function ecran() {
    if (Math.abs(innerWidth - largeur) < 2 && R.style.getPropertyValue("--ecran")) return false;
    largeur = innerWidth;
    R.style.setProperty("--ecran", innerHeight + "px");
    return true;
  }
  function ranger() {
    if (!matchMedia("(max-width:860px)").matches) return;
    var page = document.querySelector("main .page.on") || document.querySelector("main .page") || document.querySelector("main");
    if (!page) return;
    var L = [].filter.call(page.children, function (s) { return s.tagName === "SECTION" && !s.hidden && getComputedStyle(s).display !== "none"; });
    if (L.length < 3) return;
    var tete = document.querySelector("header.top"), hd = tete ? Math.max(0, tete.getBoundingClientRect().bottom) : 56;
    var E = (parseFloat(R.style.getPropertyValue("--ecran")) || innerHeight) - hd;
    var HAUT = 18, BAS = 64, serre = function (s, h, bs) { s.style.setProperty("padding-top", h + "px", "important"); s.style.setProperty("padding-bottom", bs + "px", "important"); };
    L.forEach(function (s) { s.removeAttribute("data-avec"); ["min-height", "align-content", "padding-top", "padding-bottom"].forEach(function (k) { s.style.removeProperty(k); }); });
    /* hauteur de chaque section, tassée (petites marges) */
    L.forEach(function (s) { s.style.setProperty("min-height", "0px", "important"); serre(s, 6, 12); });
    var H = L.map(function (s) { return s.offsetHeight; });
    L.forEach(function (s) { ["min-height", "padding-top", "padding-bottom"].forEach(function (k) { s.style.removeProperty(k); }); });
    for (var i = 1; i < L.length;) {
      var tot = H[i], j = i, marge = (HAUT - 6) + (BAS - 12);
      while (j + 1 < L.length && tot + H[j + 1] + marge <= E) { j++; tot += H[j]; }
      if (j > i) {
        for (var k = i; k <= j; k++) {
          if (k > i) L[k].setAttribute("data-avec", "");
          serre(L[k], k === i ? HAUT : 6, k === j ? BAS : 12);
          L[k].style.setProperty("min-height", "0px", "important");
        }
        var reste = 0; for (var m = i; m < j; m++) reste += L[m].offsetHeight;
        L[j].style.setProperty("min-height", Math.ceil(E - reste) + "px", "important");
        L[j].style.setProperty("align-content", "start", "important");
      }
      i = j + 1;
    }
  }
  var t = 0;
  function plus_tard() { clearTimeout(t); t = setTimeout(ranger, 120); }
  ecran();
  addEventListener("resize", ecran);
})();
