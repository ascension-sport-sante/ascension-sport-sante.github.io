/* Téléphone seulement : formulaires raccourcis (questions facultatives repliées) et pied de page en volets */
(function () {
  if (!window.matchMedia || !matchMedia("(max-width:860px)").matches) return;

  // 1) Formulaires « Être rappelé » : prénom, téléphone et le bouton ; le reste se déplie si l'on veut
  document.querySelectorAll("form.r-ici").forEach(function (f) {
    if (f.querySelector(".r-opt")) return;
    var subs = [].filter.call(f.querySelectorAll(".r-sub"), function (p) { return /facultatif/i.test(p.textContent); });
    if (!subs.length) return;
    var d = document.createElement("details");
    d.className = "r-opt";
    var s = document.createElement("summary");
    s.textContent = "Préciser (facultatif) : pour qui, quand vous appeler";
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
