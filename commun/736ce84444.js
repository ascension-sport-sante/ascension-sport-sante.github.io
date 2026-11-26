/* lot 177 : bilans d'exemple : la visionneuse */
(function(){
  var B = {"odette": {"n": "Odette", "e": [{"t": "Au départ", "p": ["/sys/bilans/eveil-senior-1-bilan-initial-1.webp", "/sys/bilans/eveil-senior-1-bilan-initial-2.webp", "/sys/bilans/eveil-senior-1-bilan-initial-3.webp", "/sys/bilans/eveil-senior-1-bilan-initial-4.webp"], "pdf": "/sys/bilans/eveil-senior-1-bilan-initial.pdf"}, {"t": "À 6 semaines", "p": ["/sys/bilans/eveil-senior-2-six-semaines-1.webp", "/sys/bilans/eveil-senior-2-six-semaines-2.webp", "/sys/bilans/eveil-senior-2-six-semaines-3.webp", "/sys/bilans/eveil-senior-2-six-semaines-4.webp"], "pdf": "/sys/bilans/eveil-senior-2-six-semaines.pdf"}, {"t": "À la fin", "p": ["/sys/bilans/eveil-senior-3-bilan-final-1.webp", "/sys/bilans/eveil-senior-3-bilan-final-2.webp", "/sys/bilans/eveil-senior-3-bilan-final-3.webp", "/sys/bilans/eveil-senior-3-bilan-final-4.webp"], "pdf": "/sys/bilans/eveil-senior-3-bilan-final.pdf"}]}, "karim": {"n": "Karim", "e": [{"t": "Au départ", "p": ["/sys/bilans/eveil-fauteuil-1-bilan-initial-1.webp", "/sys/bilans/eveil-fauteuil-1-bilan-initial-2.webp", "/sys/bilans/eveil-fauteuil-1-bilan-initial-3.webp", "/sys/bilans/eveil-fauteuil-1-bilan-initial-4.webp"], "pdf": "/sys/bilans/eveil-fauteuil-1-bilan-initial.pdf"}, {"t": "À 6 semaines", "p": ["/sys/bilans/eveil-fauteuil-2-six-semaines-1.webp", "/sys/bilans/eveil-fauteuil-2-six-semaines-2.webp", "/sys/bilans/eveil-fauteuil-2-six-semaines-3.webp", "/sys/bilans/eveil-fauteuil-2-six-semaines-4.webp"], "pdf": "/sys/bilans/eveil-fauteuil-2-six-semaines.pdf"}, {"t": "À la fin", "p": ["/sys/bilans/eveil-fauteuil-3-bilan-final-1.webp", "/sys/bilans/eveil-fauteuil-3-bilan-final-2.webp", "/sys/bilans/eveil-fauteuil-3-bilan-final-3.webp", "/sys/bilans/eveil-fauteuil-3-bilan-final-4.webp"], "pdf": "/sys/bilans/eveil-fauteuil-3-bilan-final.pdf"}]}, "thomas": {"n": "Thomas", "e": [{"t": "Au départ", "p": ["/sys/bilans/elan-adulte-1-bilan-initial-1.webp", "/sys/bilans/elan-adulte-1-bilan-initial-2.webp", "/sys/bilans/elan-adulte-1-bilan-initial-3.webp", "/sys/bilans/elan-adulte-1-bilan-initial-4.webp"], "pdf": "/sys/bilans/elan-adulte-1-bilan-initial.pdf"}, {"t": "À 6 semaines", "p": ["/sys/bilans/elan-adulte-2-six-semaines-1.webp", "/sys/bilans/elan-adulte-2-six-semaines-2.webp", "/sys/bilans/elan-adulte-2-six-semaines-3.webp", "/sys/bilans/elan-adulte-2-six-semaines-4.webp"], "pdf": "/sys/bilans/elan-adulte-2-six-semaines.pdf"}, {"t": "À la fin", "p": ["/sys/bilans/elan-adulte-3-bilan-final-1.webp", "/sys/bilans/elan-adulte-3-bilan-final-2.webp", "/sys/bilans/elan-adulte-3-bilan-final-3.webp", "/sys/bilans/elan-adulte-3-bilan-final-4.webp"], "pdf": "/sys/bilans/elan-adulte-3-bilan-final.pdf"}]}, "lina": {"n": "Lina", "e": [{"t": "Au départ", "p": ["/sys/bilans/plume-enfant-1-bilan-initial-1.webp", "/sys/bilans/plume-enfant-1-bilan-initial-2.webp", "/sys/bilans/plume-enfant-1-bilan-initial-3.webp", "/sys/bilans/plume-enfant-1-bilan-initial-4.webp"], "pdf": "/sys/bilans/plume-enfant-1-bilan-initial.pdf"}, {"t": "À 6 semaines", "p": ["/sys/bilans/plume-enfant-2-six-semaines-1.webp", "/sys/bilans/plume-enfant-2-six-semaines-2.webp", "/sys/bilans/plume-enfant-2-six-semaines-3.webp", "/sys/bilans/plume-enfant-2-six-semaines-4.webp"], "pdf": "/sys/bilans/plume-enfant-2-six-semaines.pdf"}, {"t": "À la fin", "p": ["/sys/bilans/plume-enfant-3-bilan-final-1.webp", "/sys/bilans/plume-enfant-3-bilan-final-2.webp", "/sys/bilans/plume-enfant-3-bilan-final-3.webp", "/sys/bilans/plume-enfant-3-bilan-final-4.webp"], "pdf": "/sys/bilans/plume-enfant-3-bilan-final.pdf"}]}};

  var m, ti, tabs, pages, dl, cur, from;
  var fab = function(){
    m = document.createElement("div"); m.className = "bilv"; m.hidden = true; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-labelledby", "bilv-t");
    m.innerHTML = '<div class="bilv-fond"></div><div class="bilv-b"><div class="bilv-h"><div><p class="bilv-k">Exemple · personne fictive</p><h3 id="bilv-t"></h3></div><button type="button" class="bilv-x" aria-label="Fermer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="bilv-tabs" role="tablist"></div><div class="bilv-p"></div><p class="bilv-pied"><a class="btn ghost bilv-dl" href="#" download>Télécharger ce bilan (PDF)</a></p></div>';
    document.body.appendChild(m);
    ti = m.querySelector("#bilv-t"); tabs = m.querySelector(".bilv-tabs"); pages = m.querySelector(".bilv-p"); dl = m.querySelector(".bilv-dl");
    m.querySelector(".bilv-x").addEventListener("click", function(){ fermer(); }); m.querySelector(".bilv-fond").addEventListener("click", function(){ fermer(); });
    m.addEventListener("keydown", function(e){ if (e.key === "Escape"){ e.preventDefault(); fermer(); } });
  };
  var etape = function(k){
    var p = B[cur].e[k];
    [].forEach.call(tabs.children, function(b, i){ b.setAttribute("aria-selected", i === k ? "true" : "false"); });
    pages.innerHTML = p.p.map(function(s, i){ return '<img src="' + s + '" alt="' + B[cur].n + ', ' + p.t.toLowerCase() + ', page ' + (i + 1) + '" width="910" height="1287" loading="' + (i ? "lazy" : "eager") + '" decoding="async">'; }).join("");
    pages.scrollTop = 0; dl.href = p.pdf;
  };
  var ouvrir = function(id, b){
    if (!B[id]) return; if (!m) fab(); cur = id; from = b;
    ti.textContent = (/^[AEIOUYÉÈÊ]/.test(B[id].n) ? "Les bilans d’" : "Les bilans de ") + B[id].n;
    tabs.innerHTML = B[id].e.map(function(p){ return '<button type="button" role="tab">' + p.t + '</button>'; }).join("");
    [].forEach.call(tabs.children, function(x, i){ x.addEventListener("click", function(){ etape(i); }); });
    etape(B[id].e.length - 1);
    m.hidden = false; document.documentElement.classList.add("bilv-on");
    requestAnimationFrame(function(){ m.classList.add("on"); }); m.querySelector(".bilv-x").focus({preventScroll:true});
    if (window.ascCouche) window.ascCouche.ouvre(function(){ fermer(true); });
  };
  var fermer = function(parRetour){
    if (!m || m.hidden) return;
    m.classList.remove("on"); document.documentElement.classList.remove("bilv-on");
    setTimeout(function(){ if (!m.classList.contains("on")){ m.hidden = true; pages.innerHTML = ""; } }, 260);
    if (parRetour !== true && window.ascCouche) window.ascCouche.ferme();
    if (from && from.focus) from.focus({preventScroll:true});
  };
  document.addEventListener("click", function(e){ var t = e.target.closest && e.target.closest("[data-bilan]"); if (!t) return; e.preventDefault(); e.stopPropagation(); ouvrir(t.getAttribute("data-bilan"), t); }, true);
})();
;(function(){/* Ordinateur : toucher une page l'agrandit à la largeur de la fenêtre, un second toucher revient aux pages entières */
document.addEventListener("click",function(e){var im=e.target.closest&&e.target.closest(".bilv-p img");if(!im||innerWidth<861)return;var p=im.parentNode,z=p.classList.toggle("bilv-zoom");requestAnimationFrame(function(){im.scrollIntoView({block:"start"})});im.setAttribute("title",z?"Revenir aux pages entières":"Agrandir cette page")});
})();
