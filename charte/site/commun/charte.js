/* Charte (prototype) : un paragraphe long se lit à gauche, en lignes courtes. */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('main p').forEach(function (p) {
    if (p.closest('.sec-head,.hero,.p-hero,.bes-hero,.cta-box,.card-p,.lune-c,.calc,.quiz,.preuves,.bil-c,.suite')) return;
    if (p.textContent.trim().length > 160 && getComputedStyle(p).textAlign !== 'left') {
      p.style.setProperty('text-align', 'left', 'important');
      p.style.setProperty('max-width', '65ch');
      p.style.setProperty('margin-inline', 'auto');
    }
  });
});
