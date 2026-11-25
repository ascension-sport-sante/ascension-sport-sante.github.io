/* Commun aux trois prototypes : version avec / sans montagne, menu, onglets, choix de formule,
   formulaire « Être rappelé » simulé (rien n'est envoyé). */
(function () {
  var d = document.documentElement, K = "asc-proto-montagne";
  function lire() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function garder(v) { try { localStorage.setItem(K, v); } catch (e) {} }
  var h = location.hash.slice(1);
  var m = h === "avec-montagne" ? "avec" : h === "sans-montagne" ? "sans" : (lire() || "sans");
  if (h === "avec-montagne" || h === "sans-montagne") {
    garder(m);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }
  if (/capture/.test(h)) d.classList.add("capture");
  function appliquer(v) {
    d.dataset.montagne = v; garder(v);
    document.querySelectorAll("[data-montagne-choix]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.montagneChoix === v));
    });
  }
  appliquer(m);

  document.addEventListener("DOMContentLoaded", function () {
    var bande = document.createElement("div");
    bande.className = "proto-band";
    bande.innerHTML = '<span class="pb-nom">' + (d.dataset.protoNom || "Prototype") + "</span>" +
      '<span class="pb-m" role="group" aria-label="Version du décor">' +
      '<button type="button" data-montagne-choix="sans">Sans montagne</button>' +
      '<button type="button" data-montagne-choix="avec">Avec montagne</button></span>' +
      '<a href="./">Comparer les trois prototypes</a>';
    document.body.prepend(bande);
    bande.addEventListener("click", function (e) {
      var b = e.target.closest("[data-montagne-choix]");
      if (b) appliquer(b.dataset.montagneChoix);
    });
    appliquer(d.dataset.montagne);

    /* Menu sur téléphone */
    document.querySelectorAll("[data-menu]").forEach(function (b) {
      var nav = document.getElementById(b.getAttribute("aria-controls"));
      function fermer() { b.setAttribute("aria-expanded", "false"); nav.classList.remove("ouvert"); }
      b.addEventListener("click", function () {
        var ouvert = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!ouvert));
        nav.classList.toggle("ouvert", !ouvert);
      });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) fermer(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });
    });

    /* Onglets (tarifs sur téléphone, méthode…) */
    document.querySelectorAll("[data-onglets]").forEach(function (g) {
      var tabs = [].slice.call(g.querySelectorAll('[role="tab"]'));
      function choisir(t, focus) {
        tabs.forEach(function (x) {
          var on = x === t;
          x.setAttribute("aria-selected", String(on));
          x.tabIndex = on ? 0 : -1;
          var p = document.getElementById(x.getAttribute("aria-controls"));
          if (p) p.classList.toggle("actif", on);
        });
        if (focus) t.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { choisir(t); });
        t.addEventListener("keydown", function (e) {
          var n = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
          if (n) { e.preventDefault(); choisir(tabs[(i + n + tabs.length) % tabs.length], true); }
        });
      });
      choisir(g.querySelector('[aria-selected="true"]') || tabs[0]);
    });

    /* Un bouton « Choisir … » préremplit la formule du formulaire */
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-formule]");
      if (!b) return;
      var s = document.getElementById("f-formule");
      if (s) s.value = b.dataset.formule;
      var p = document.getElementById("f-prenom");
      if (p) setTimeout(function () { p.focus({ preventScroll: true }); }, 450);
    });

    /* Formulaire simulé */
    document.querySelectorAll("form[data-rappel]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var prenom = f.querySelector("#f-prenom"), tel = f.querySelector("#f-tel"), premier = null;
        function erreur(champ, msg) {
          var p = document.getElementById(champ.id + "-err");
          p.textContent = msg;
          champ.setAttribute("aria-invalid", msg ? "true" : "false");
          if (msg && !premier) premier = champ;
        }
        erreur(prenom, prenom.value.trim() ? "" : "Écrivez votre prénom, pour que je sache qui rappeler.");
        var chiffres = tel.value.replace(/[^\d+]/g, "");
        var ok = /^0[1-9]\d{8}$/.test(chiffres) || /^\+33[1-9]\d{8}$/.test(chiffres);
        erreur(tel, ok ? "" : "Écrivez un numéro à 10 chiffres, par exemple 06 12 34 56 78.");
        if (premier) { premier.focus(); return; }
        var s = f.querySelector("#f-formule");
        var formule = s && s.value ? " Formule choisie : " + s.options[s.selectedIndex].text + "." : "";
        var msg = document.createElement("div");
        msg.className = "f-merci";
        msg.setAttribute("role", "status");
        msg.tabIndex = -1;
        msg.innerHTML = "<p><strong>C’est noté, " + prenom.value.trim().replace(/[<>&]/g, "") +
          ".</strong> Je vous rappelle moi-même." + formule + "</p><p class=\"f-proto\">Prototype : rien n’a été envoyé.</p>";
        f.replaceWith(msg);
        msg.focus();
      });
    });
  });
})();
