/* Prototype « Paix » : pétales qui se posent, moins d'encadrés, lecture plus confortable, envoi simulé. */
(function () {
  setTimeout(function () { document.documentElement.classList.add('calme-pose'); }, 6000);
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div');
    b.className = 'bandeau-proto';
    b.innerHTML = '<span>Prototype « Paix » : rien n’est publié</span><a href="https://ascension-sport-sante.github.io/" target="_blank" rel="noopener">Comparer avec le site actuel</a>';
    document.body.append(b);
    var main = document.querySelector('main');
    if (!main) return;
    // 4. Moins d'encadrés : on garde seulement ce qui se compare ou se remplit
    var garde = '.lune-c,.calc,.quiz,form,.cta-box,.r-ici,.tel-carte,.bilv,dialog,[role=dialog],.bil-c,.photo-res,.tel-btn,.lien,.q-ch,.calc-ch,.chip,.btn,input,select,textarea,.nv-menu,img,.vgx,.mentions-calme';
    main.querySelectorAll('*').forEach(function (e) {
      if (e.closest(garde)) return;
      var s = getComputedStyle(e);
      if (parseFloat(s.borderRadius) > 8 && s.borderTopStyle !== 'none' && parseFloat(s.borderTopWidth) > 0 && e.offsetWidth > 150) {
        e.style.setProperty('border-color', 'transparent', 'important');
        e.style.setProperty('box-shadow', 'none', 'important');
        e.style.setProperty('background', 'transparent', 'important');
        e.style.setProperty('backdrop-filter', 'none', 'important');
      }
    });
    // 5 et 6. Texte à gauche dès qu'il est long, lignes de 65 caractères au plus
    main.querySelectorAll('p').forEach(function (p) {
      if (p.closest('.hero,.p-hero,.lune-c,.calc,.quiz,.cta-box,.mentions-calme,.prix-ligne')) return;
      if (p.textContent.trim().length > 110 && p.offsetWidth > 420) {
        p.style.setProperty('text-align', 'left', 'important');
        p.style.setProperty('max-width', '65ch', 'important');
        p.style.setProperty('margin-inline', 'auto', 'important');
      }
    });
  });
  // Prototype : la demande n'est jamais envoyée
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.matches || !f.matches('form.r-ici, form.rituel')) return;
    var p = f.querySelector('[name=ici-prenom],[name=prenom]'), t = f.querySelector('[name=ici-tel],[name=tel]');
    if (p && t && p.value.trim() && t.value.replace(/\D/g, '').length >= 10) {
      e.preventDefault(); e.stopImmediatePropagation();
      f.innerHTML = '<p class="body" role="status" style="text-align:center"><strong>Merci, ' + p.value.trim().replace(/[<>&]/g, '') + '.</strong> Je vous rappelle moi-même.<br><small>Prototype : rien n’a été envoyé.</small></p>';
    }
  }, true);
})();
