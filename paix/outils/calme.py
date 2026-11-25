# Prototype « Paix » : applique la mise en page calme sur la copie du site. Usage : python3 -I calme.py <dossier du site>
import os, re, sys, shutil, glob
D = sys.argv[1]; ICI = os.path.dirname(os.path.abspath(__file__))
for f in ('calme.css', 'calme.js'): shutil.copy(os.path.join(ICI, f), os.path.join(D, 'commun', f))
c = {}
def rep(t, a, b, k, n=1):
    if a not in t: c[k] = 'ABSENT'; return t
    c[k] = 'ok'; return t.replace(a, b, n)
def section(t, marque):
    """Début et fin (après </section>) de la section qui contient la marque, sections imbriquées comprises."""
    i = t.find(marque); i = t.rfind('<section', 0, i); p = i + 8; n = 1
    while n:
        a = t.find('<section', p); b = t.find('</section>', p)
        if a != -1 and a < b: n += 1; p = a + 8
        else: n -= 1; p = b + 10
    return i, p
ETAPES = ('<ol class="steps trois">'
 '<li class="rv"><span class="num" aria-hidden="true">1</span><h3>On s’appelle</h3><p>Laissez votre prénom et votre numéro, je vous rappelle. Ou appelez-moi au 07 82 34 87 91.</p></li>'
 '<li class="rv"><span class="num" aria-hidden="true">2</span><h3>Le bilan chez vous</h3><p>Une heure pour faire le point sur votre forme, votre santé et vos objectifs, avec quelques tests simples.</p></li>'
 '<li class="rv"><span class="num" aria-hidden="true">3</span><h3>Vos séances, vos progrès</h3><p>Chaque séance est préparée pour vous. On refait les tests régulièrement : vous voyez vos progrès en chiffres.</p></li></ol>')
RASSURE = '<p class="rassure">1<sup>re</sup> séance satisfait ou remboursé · Sans engagement · Matériel fourni</p>'
def cta(pre):
    return ('<div class="cta-box rv"><h2>On en parle ?</h2><p>Laissez votre prénom et votre numéro : je vous rappelle moi-même, sans engagement.</p>'
     '<form class="r-ici" novalidate aria-label="Être rappelé"><div class="r-grid r-grid2">'
     '<label class="r-field"><span>Prénom</span><input name="ici-prenom" autocomplete="given-name"></label>'
     '<label class="r-field"><span>Téléphone</span><input name="ici-tel" type="tel" inputmode="tel" autocomplete="tel"></label></div>'
     '<button type="submit" class="btn r-ici-go">Être rappelé</button></form>' + RASSURE + '</div>')
RESPIRE = '<section class="respiration" aria-hidden="true"></section>'

for f in glob.glob(os.path.join(D, '**/*.html'), recursive=True):
    r = os.path.relpath(f, D); pre = '../' * r.count('/')
    t = open(f, encoding='utf8').read(); t0 = t
    # 1. plus de 3D en arrière-plan
    t = re.sub(r'<link rel="preload" href="[./]*three-r128\.min\.js"[^>]*>', '', t)
    t = re.sub(r'<script>if\(screen\.width>860&&matchMedia\("\(min-width:861px\)"\)\.matches\)document\.write\(.<script src="[./]*three-r128\.min\.js"><\\/script>.\)</script>', '', t)
    if 'calme.css' not in t:
        t = re.sub(r'<header\b', lambda m: '<link rel="stylesheet" href="' + pre + 'commun/calme.css"><script src="' + pre + 'commun/calme.js"></script>' + m.group(0), t, count=1)
    # appel final : un formulaire court sur toutes les pages qui en ont un
    for m in list(re.finditer(r'<div class="cta-box rv">', t))[::-1]:
        j = t.find('</div>', t.find('</a>', m.end())) + 6
        if 'Être rappelé' in t[m.start():j]: t = t[:m.start()] + cta(pre) + t[j:]; c['cta ' + r] = 'ok'
    if r == 'index.html':
        t = re.sub(r'<p class="lede reveal" style="--d:\.2">.*?</p>', '<p class="lede reveal" style="--d:.2">Des séances d’activité physique adaptée chez vous, à Paris. Pour les enfants, les adultes et les seniors, avec ou sans pathologie.</p>', t, count=1, flags=re.S)
        t = rep(t, '<!--/@offre-hero-->', '<!--/@offre-hero-->' + RASSURE, 'rassure hero')
        i, j = section(t, 'id="deroule"')
        t = t[:i] + RESPIRE + '<section class="sec pro-sec" id="deroule" data-obs><div class="wrap"><div class="sec-head"><h2 class="rv">Comment ça se passe</h2></div>' + ETAPES + '</div></section>' + \
            '<section class="sec pro-sec prix-ligne" id="prix" data-obs><div class="wrap"><h2 class="rv">Combien ça coûte</h2><p class="rv">La première séance dure une heure chez vous : <span class="grand">38€</span> <span class="pv">soit <b>19€ pour vous</b> après crédit d’impôt*</span>. Satisfait ou remboursé. Ensuite, la séance est à 58€.</p>' + \
            '<p class="rv">Premières séances dès janvier 2027.</p><p class="rv"><a class="lien" href="tarifs/index.html">Toutes les formules<span aria-hidden="true"> →</span></a></p><p class="note">* Crédit d’impôt de 50 % des services à la personne, sous réserve de l’enregistrement de ma déclaration, en cours. Détails sur la page Tarifs.</p></div></section>' + t[j:]
        i, j = section(t, 'id="exemples-bilans"'); t = t[:i] + t[j:]; c['accueil bilans retirés'] = 'ok'
        t = rep(t, 'En savoir plus sur moi<span aria-hidden="true"> →</span></a>', 'En savoir plus sur moi<span aria-hidden="true"> →</span></a><p class="voir-bilan"><button type="button" class="btn ghost" data-bilan="odette">Voir un exemple de bilan</button></p>', 'bouton bilan')
    if r == 'methode/index.html':
        i, j = section(t, 'id="parcours"')
        t = t[:i] + '<section class="sec pro-sec" id="parcours" data-obs><div class="wrap"><div class="sec-head"><h2 class="rv">Comment ça se passe</h2></div>' + ETAPES + \
            '<p class="lien-parcours"><a class="lien" href="../index.html#prestations">Éveil, Élan, Envol, Plume : voir les quatre parcours<span aria-hidden="true"> →</span></a></p></div></section>' + RESPIRE.replace('respiration', 'respiration nuages') + t[j:]
        i, j = section(t, 'id="accompagnements"'); t = t[:i] + t[j:]
        i, j = section(t, 'id="la-voie"'); voie = t[i:j]; t = t[:i] + t[j:]
        i, j = section(t, 'id="code"'); code = t[i:j]; t = t[:i] + t[j:]
        open(os.path.join(ICI, 'voie_code.html'), 'w', encoding='utf8').write(voie + code); c['methode'] = 'ok'
    if r == 'tarifs/index.html':
        m = re.search(r'<p class="body rv lunes-mentions">.*?</p>', t, flags=re.S); men = m.group(0); t = t[:m.start()] + t[m.end():]
        i, j = section(t, '<section class="calc rv"')
        t = t[:j] + men.replace('class="body rv lunes-mentions"', 'class="mentions-calme"').replace('<small>', '').replace('</small>', '') + t[j:]; c['tarifs mentions'] = 'ok'
    if t != t0: open(f, 'w', encoding='utf8').write(t)
# à propos : la philosophie et les principes, venus de la méthode
f = os.path.join(D, 'a-propos/index.html'); t = open(f, encoding='utf8').read()
vc = open(os.path.join(ICI, 'voie_code.html'), encoding='utf8').read()
i = t.find('<section class="sec pro-sec cta-final'); t = t[:i] + vc + t[i:]; open(f, 'w', encoding='utf8').write(t); c['a-propos'] = 'ok'
print(c)
