# Prototype « charte » : applique la charte à toute la copie du site et réorganise l'accueil et Éveil.
# Usage : python3 -I charte.py <dossier du site>
import os, re, sys, shutil, glob
D = sys.argv[1]; ICI = os.path.dirname(os.path.abspath(__file__)); c = {}
for f in ('charte.css', 'charte.js'): shutil.copy(os.path.join(ICI, f), os.path.join(D, 'commun', f))
def rep(t, a, b, k):
    c[k] = 'ok' if a in t else 'ABSENT'; return t.replace(a, b, 1)
def section(t, marque):
    i = t.find(marque); i = t.rfind('<section', 0, i); p = i + 8; n = 1
    while n:
        a = t.find('<section', p); b = t.find('</section>', p)
        if a != -1 and a < b: n += 1; p = a + 8
        else: n -= 1; p = b + 10
    return i, p
m = re.search(r'<a class="tel-btn tel-petit" href="tel:\+33782348791">(<svg.*?</svg>)<b>07 82 34 87 91</b></a>', open(os.path.join(D, 'index.html'), encoding='utf8').read(), flags=re.S)
TEL = '<a class="btn-tel" href="tel:+33782348791">' + m.group(1) + '<span>07 82 34 87 91</span></a>'
for f in glob.glob(os.path.join(D, '**/*.html'), recursive=True):
    r = os.path.relpath(f, D); pre = '../' * r.count('/')
    t = open(f, encoding='utf8').read(); t0 = t
    if 'charte.css' not in t:
        t = re.sub(r'<header\b', lambda m: '<link rel="stylesheet" href="' + pre + 'commun/charte.css"><script src="' + pre + 'commun/charte.js"></script>' + m.group(0), t, count=1)
    if r == 'index.html':
        t = re.sub(r'<p class="lede reveal" style="--d:\.2">.*?</p>', '<p class="lede reveal" style="--d:.2">J’aide les enfants, les adultes et les seniors, avec ou sans pathologie, à progresser chez eux : <strong>force, mobilité, endurance et coordination</strong> à chaque séance.</p>', t, count=1, flags=re.S)
        t = rep(t, '<a class="btn ghost" href="#prestations">Voir les parcours</a></div>', TEL + '</div>', 'accueil téléphone à côté du bouton')
        t = re.sub(r'<!--@tel-hero-->.*?<!--/@tel-hero-->', '', t, count=1, flags=re.S)
        i, j = section(t, 'class="hero hero-pro')
        t = t[:j] + ('<div class="preuves" aria-label="En bref"><ul><li>Licence STAPS en activité physique adaptée</li><li>Carte professionnelle d’éducateur sportif</li>'
                     '<li>Paris et proche banlieue</li><li>Déplacement et matériel compris</li></ul></div>') + t[j:]
        t = rep(t, '<h2 class="rv">Qu’est-ce qui vous amène ?</h2>', '<h2 class="rv">Qu’est-ce qui vous amène ?</h2><p class="body rv">Quatre parcours selon votre point de départ. Chacun commence par un bilan chez vous.</p>', 'accueil intro parcours')
        i, j = section(t, 'class="sec pro-sec cta-final')
        t = t[:i] + ('<section class="sec pro-sec" id="prix-court" data-obs><div class="wrap"><div class="sec-head"><p class="eyebrow">Tarifs</p><h2>Des prix clairs</h2>'
                     '<p>La première séance dure 1h chez vous : 38€, satisfait ou remboursé. Ensuite, 78€ la séance à l’unité, ou 58€ avec le parcours Trois Lunes. Prix TTC, déplacement et matériel compris.</p></div>'
                     '<p class="ch-centre"><a class="lien-t" href="tarifs/index.html">Voir toutes les formules</a></p></div></section>') + t[i:]
        t = rep(t, '<a class="btn" href="bilan/index.html">Être rappelé</a>\n      </div>', '<div class="ch-actions"><a class="btn" href="bilan/index.html">Être rappelé</a>' + TEL + '</div>\n      </div>', 'accueil appel final')
    if r == 'activite-physique-adaptee-domicile/index.html':
        m = re.search(r'<div class="reconnais-b">.*?<ul class="o-chips situ rv"[^>]*>(.*?)</ul></div>', t, flags=re.S); items = m.group(1); t = t[:m.start()] + t[m.end():]
        BTN = '<a class="btn" href="#contact" data-pour="0" data-besoin="Prendre soin de sa santé">Être rappelé</a>'
        t = rep(t, '<div class="actions rv">' + BTN + '</div>', '<div class="actions rv">' + BTN + TEL + '</div>', 'éveil téléphone')
        i, j = section(t, 'class="sec pro-sec aida"'); aida = t[i:j]
        def morceau(a, b):
            k = aida.find(a); return aida[k:aida.find(b, k)]
        p0 = re.search(r'<div class="aida-c rv"><p class="body">(.*?)</p>', aida, flags=re.S).group(1)
        ps = re.findall(r'<p class="body">(.*?)</p>', aida[aida.find('aida-reste'):], flags=re.S)
        ex = re.search(r'<p class="aida-ex">(.*?)</p>', aida, flags=re.S).group(1)
        def ic(sym): return '<span class="k" aria-hidden="true"><span class="vgx"><svg class="vg" aria-hidden="true" focusable="false"><use href="#' + sym + '"/></svg></span></span>'
        nouveau = ('<section class="sec pro-sec" id="pour-qui" data-obs><div class="wrap"><div class="sec-head"><p class="eyebrow">Pour qui</p><h2>Vous vous reconnaissez ?</h2>'
                   '<p>Éveil s’adresse à celles et ceux qui repartent de loin.</p></div><ul class="ch-situ" aria-label="Les situations que j’accompagne">' + items.replace('<li>Fauteuil', '<li><span>Fauteuil').replace('handicap</li>', 'handicap</span></li>') + '</ul></div></section>'
                   '<section class="sec pro-sec" id="retient" data-obs><div class="wrap"><div class="sec-head"><p class="eyebrow">Ce qui vous retient</p><h2>Vous avez peur de mal faire, ou de vous faire mal.</h2></div>'
                   '<div class="ch-texte"><p>' + p0 + '</p></div></div></section>'
                   '<section class="sec pro-sec" id="autrement" data-obs><div class="wrap"><div class="sec-head"><p class="eyebrow">Ma façon de faire</p><h2>Ce que je fais autrement</h2></div><ul class="ch-liste">'
                   '<li class="ch-carte">' + ic('vgm-visite') + '<h3>D’abord, un bilan chez vous</h3><p>' + ps[0] + '</p></li>'
                   '<li class="ch-carte">' + ic('vgm-trio') + '<h3>Une séance adaptée à votre forme du jour</h3><p>' + ps[1] + '</p></li>'
                   '<li class="ch-carte">' + ic('vg-lanterne') + '<h3>Chez vous, à tout âge</h3><p>' + ps[2] + '</p></li></ul>'
                   '<p class="ch-note">' + ex + '</p></div></section>')
        t = t[:i] + nouveau + t[j:]
        t = rep(t, '<div><h2>On en parle ?</h2><p class="offre-clone"></p></div>\n        ' + BTN, '<div><h2>On en parle ?</h2><p class="ch-sous">' + ps[3] + '</p></div><div class="ch-actions">' + BTN + TEL + '</div>', 'éveil appel final')
        c['éveil sections'] = 'ok'
    if t != t0: open(f, 'w', encoding='utf8').write(t)
print(c)
