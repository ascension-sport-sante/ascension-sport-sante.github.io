#!/usr/bin/env python3
# Fabrique la version anglaise du site (/en/) à partir des pages françaises.
#   python3 .traduction/construire.py            -> fabrique (refuse s'il manque une traduction)
#   python3 .traduction/construire.py --manquants -> écrit .traduction/manquants.json (ce qu'il reste à traduire)
# Les textes viennent de textes.json (français -> anglais) ; les phrases des scripts de js.json.
import json, re, os, sys, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from decoupe import phrases, jetons, remonte, noms_jetons, LETTRES
from chaines_js import decode

ICI = os.path.dirname(os.path.abspath(__file__)); RACINE = os.path.dirname(ICI)
CONF = json.load(open(os.path.join(ICI, 'pages.json'), encoding='utf-8'))
SITE, PAGES, SCRIPTS = CONF['site'], CONF['pages'], CONF['scripts']
def charge(nom):
    p = os.path.join(ICI, nom)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
D = {}
for f in sorted(os.listdir(ICI)):
    if f.startswith('textes') and f.endswith('.json'):
        for k, v in charge(f).items(): D[re.sub(r'\s+', ' ', k.replace(' ', ' ').replace(' ', ' ')).strip()] = v
JS = charge('js.json')
MANQUE = {}   # clé -> [pages]
VALEURS = {"Pour moi": "For me", "Pour mon enfant ou mon ado": "For my child or teen", "Pour mon enfant": "For my child", "Pour un proche": "For a loved one",
  "Le matin": "Morning", "Le midi": "Lunchtime", "L'après-midi": "Afternoon", "L’après-midi": "Afternoon", "Le soir": "Evening", "Le week-end": "Weekend",
  "Reprendre le sport": "Getting back into exercise", "Perdre du poids": "Losing weight", "Gagner en force et en souplesse": "Gaining strength and flexibility",
  "Garder l’équilibre et l’autonomie": "Keeping balance and independence", "Bouger avec plaisir": "Enjoying moving", "Prendre confiance en soi": "Gaining self-confidence",
  "Coordination, motricité": "Coordination, motor skills", "Retrouver un poids de forme": "Reaching a healthy weight", "Progresser dans son sport": "Progressing in their sport",
  "Un besoin particulier (on en parle au téléphone)": "A specific need (we’ll talk about it on the phone)", "Enfants et ados": "Children and teens",
  "Être en forme": "Being fit", "Prendre soin de soi": "Taking care of yourself", "Prendre soin de sa santé": "Taking care of your health"}
AIDE_EN = ("/* version anglaise : traduction des valeurs du formulaire pour l'affichage (le coach les reçoit en français) */"
  "var __en=function(s){var d=" + json.dumps(VALEURS, ensure_ascii=False) + ";return d[s]||s};")
ERREURS = []

def norm(s): return re.sub(r'\s+', ' ', html.unescape(s).replace(' ', ' ').replace(' ', ' ')).strip()
def sans_jetons(s): return re.sub(r'</?(?:[a-z]+\d+|c\d+)/?>', ' ', s)
def a_traduire(s):
    x = sans_jetons(s)
    x = re.sub(r'https?://\S+|[\w.+-]+@[\w.-]+', ' ', x)
    return bool(LETTRES.search(x))
def tr(cle, page):
    if not a_traduire(cle): return cle
    if cle in D: return D[cle]
    MANQUE.setdefault(cle, []).append(page); return None

LIENS = CONF.get('liens', {})
def url_en(u):
    """Adresse française -> adresse anglaise (pages traduites seulement)."""
    if u in LIENS: return LIENS[u]
    m = re.match(r'^(https://ascension-sport-sante\.github\.io)?(/[^#?"]*)?([?#].*)?$', u)
    if not m or m.group(2) is None: return u
    chemin = m.group(2)
    if chemin in ('/index.html',): chemin = '/'
    if chemin in PAGES: return (m.group(1) or '') + PAGES[chemin] + (m.group(3) or '')
    return u

def bascule(fr_chemin, en_chemin, langue):
    if langue == 'en':
        return ('<a class="nv-lang" href="%s" hreflang="fr" lang="fr" aria-label="Version française du site" title="Version française">FR</a>' % fr_chemin)
    return ('<a class="nv-lang" href="%s" hreflang="en" lang="en" aria-label="English version of the site" title="English version">EN</a>' % en_chemin)

def alternates(fr_chemin, en_chemin):
    return ('<!--hreflang--><link rel="alternate" hreflang="fr" href="%s%s"><link rel="alternate" hreflang="en" href="%s%s">'
            '<link rel="alternate" hreflang="x-default" href="%s%s"><!--/hreflang-->' % (SITE, fr_chemin, SITE, en_chemin, SITE, fr_chemin))

def ajoute_entete(t, fr_chemin, en_chemin, langue):
    """hreflang dans <head> et bouton de langue dans l'en-tête (sans doublon)."""
    t = re.sub(r'<!--hreflang-->.*?<!--/hreflang-->', '', t, flags=re.S)
    t = re.sub(r'(<link rel="canonical"[^>]*>)', lambda m: m.group(1) + alternates(fr_chemin, en_chemin), t, count=1)
    if '<!--hreflang-->' not in t:
        t = t.replace('</head>', alternates(fr_chemin, en_chemin) + '</head>', 1)
    t = re.sub(r'<!--langue-->.*?<!--/langue-->', '', t, flags=re.S)
    b = '<!--langue-->' + bascule(fr_chemin, en_chemin, langue) + '<!--/langue-->'
    t2 = re.sub(r'(<button type="button" class="theme-btn en-tete">.*?</button>)', lambda m: m.group(1) + b, t, count=1, flags=re.S)
    if t2 == t: ERREURS.append('bouton de langue non placé : ' + fr_chemin)
    # le même lien en bas de page et dans le menu écrit dans la page (pages thématiques), surtout pour le téléphone
    t2 = re.sub(r'<!--langue2-->.*?<!--/langue2-->', '', t2, flags=re.S)
    if langue == 'en': lien = '<a href="%s" hreflang="fr" lang="fr">Version française</a>' % fr_chemin
    else: lien = '<a href="%s" hreflang="en" lang="en">English version</a>' % en_chemin
    t3 = re.sub(r'(<div class="wrap pied-l">.*?)(<span>SIRET)', lambda m: m.group(1) + '<!--langue2-->' + lien + '<!--/langue2-->' + m.group(2), t2, count=1, flags=re.S)
    if t3 == t2: ERREURS.append('lien de langue du bas de page non placé : ' + fr_chemin)
    t3 = re.sub(r'(<div class="sm-aides">.*?</a>)(</div>)', lambda m: m.group(1) + '<!--langue2-->' + lien.replace('<a ', '<a class="sm-mail sm-lang" ') + '<!--/langue2-->' + m.group(2), t3, count=1, flags=re.S)
    return t3

ATTRS = ('alt', 'aria-label', 'title', 'placeholder', 'data-prix')
META = ('description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image:alt', 'og:site_name', 'apple-mobile-web-app-title', 'application-name')
BALISE = re.compile(r'<([a-zA-Z][\w:-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?)*)\s*(/?)>')
ATTR = re.compile(r'(\s+)([^\s=>/]+)(?:(\s*=\s*)("[^"]*"|\'[^\']*\'|[^\s>]+))?')

def traduit_balise(m, page):
    tag, attrs, fin = m.group(1).lower(), m.group(2), m.group(3)
    nom_meta = re.search(r'\s(?:name|property)="([^"]+)"', attrs)
    nom_meta = nom_meta.group(1) if nom_meta else ''
    def rep(a):
        esp, k, eg, v = a.groups()
        if v is None: return a.group(0)
        q = v[0] if v[0] in '"\'' else ''
        brut = v[1:-1] if q else v
        val = html.unescape(brut); nv = None; kl = k.lower()
        if kl in ATTRS or (tag == 'meta' and kl == 'content' and nom_meta in META):
            n = norm(val)
            if a_traduire(n):
                t2 = tr(n, page)
                nv = t2 if t2 is not None else val
        elif tag == 'meta' and kl == 'content' and nom_meta == 'og:locale': nv = 'en_GB'
        elif tag == 'meta' and kl == 'content' and nom_meta == 'og:locale:alternate': nv = 'fr_FR'
        elif kl == 'href' and val in LIENS: nv = LIENS[val]
        elif kl in ('href', 'content') and (val.startswith('/') or val.startswith(SITE)):
            nv = url_en(val)
        elif kl == 'src' and val.split('?')[0] in SCRIPTS:
            nv = SCRIPTS[val.split('?')[0]] + ('?' + val.split('?', 1)[1] if '?' in val else '')
        if nv is None or nv == val: return a.group(0)
        return '%s%s%s"%s"' % (esp, k, eg, nv.replace('&', '&amp;').replace('"', '&quot;'))
    return '<' + m.group(1) + ATTR.sub(rep, attrs) + (' /' if fin else '') + '>'

def variantes(s):
    """Formes possibles d'une chaîne dans un script minifié (accents écrits \\xE9, \\u2026…)."""
    def esc(ch, latin, autres):
        o = ord(ch)
        if o < 128: return ch
        if o < 256 and latin: return '\\x%02X' % o
        if o >= 256 and autres and ch != '’': return '\\u%04x' % o
        return ch
    vs = [s]
    for latin, autres in ((True, False), (True, True), (False, True)):
        v = ''.join(esc(c, latin, autres) for c in s)
        if v not in vs: vs.append(v)
    return vs

def remplace_js(code, paires, ou, obligatoire=True):
    for fr, en in paires:
        trouve = False
        for v in variantes(fr):
            if v in code:
                code = code.replace(v, en); trouve = True; break
        if not trouve and obligatoire: ERREURS.append('%s : phrase de script introuvable « %s »' % (ou, fr[:60]))
    return code

def traduit_json(o, page, cle=''):
    if isinstance(o, dict): return {k: traduit_json(v, page, k) for k, v in o.items()}
    if isinstance(o, list): return [traduit_json(v, page, cle) for v in o]
    if isinstance(o, str):
        if cle in ('@type', '@context', '@id', 'url', 'image', 'logo', 'telephone', 'email', 'tel', 'mail', 'formulaire', 'wa', 'sameAs', 'priceCurrency', 'addressCountry', 'postalCode', 'glyphe', 'sceau'):
            return url_en(o) if cle in ('url', '@id') else o
        if cle == 'inLanguage': return 'en'
        if o.startswith('/') or o.startswith('http'): return url_en(o)
        n = norm(o)
        if not a_traduire(n): return o
        t2 = tr(n, page)
        return t2 if t2 is not None else o
    return o

def fabrique(fr_chemin, en_chemin):
    src = os.path.join(RACINE, fr_chemin.strip('/'), 'index.html') if fr_chemin != '/' else os.path.join(RACINE, 'index.html')
    t = open(src, encoding='utf-8').read()
    # la page française porte déjà son bouton de langue et ses hreflang : on les retire avant de traduire
    t = re.sub(r'<!--langue-->.*?<!--/langue-->', '', t, flags=re.S)
    t = re.sub(r'<!--hreflang-->.*?<!--/hreflang-->', '', t, flags=re.S)
    t = re.sub(r'<!--langue2-->.*?<!--/langue2-->', '', t, flags=re.S)
    # 1. phrases du corps
    morceaux = []
    for d, f in phrases(t):
        cle, table = jetons(t, d, f)
        en = tr(cle, fr_chemin)
        if en is None or en == cle and not a_traduire(cle): continue
        if noms_jetons(en) != noms_jetons(cle):
            ERREURS.append('%s : balises différentes dans la traduction de « %s »' % (fr_chemin, cle[:70])); continue
        brut = t[d:f]; avant = re.match(r'\s*', brut).group(0); apres = re.search(r'\s*$', brut).group(0)
        morceaux.append((d, f, avant + remonte(en, table) + apres))
    for d, f, x in sorted(morceaux, reverse=True): t = t[:d] + x + t[f:]
    # 2. balises (attributs, liens) hors scripts, puis scripts
    parts = re.split(r'(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>)', t, flags=re.S)
    for i, p in enumerate(parts):
        if i % 2 == 0:
            parts[i] = BALISE.sub(lambda m: traduit_balise(m, fr_chemin), p)
        elif p.startswith('<script'):
            ouv = re.match(r'<script\b[^>]*>', p).group(0); corps = p[len(ouv):-9]
            ouv2 = BALISE.sub(lambda m: traduit_balise(m, fr_chemin), ouv)
            if 'application/ld+json' in ouv or 'application/json' in ouv:
                if corps.strip():
                    o = json.loads(corps)
                    corps = json.dumps(traduit_json(o, fr_chemin), ensure_ascii=False, separators=(',', ':') if 'id="contenu"' in ouv else (', ', ': ')).replace('</', '<\\/')
            elif corps.strip():
                corps = remplace_js(decode(corps), JS.get('pages', []), fr_chemin, obligatoire=False)
                if '__en(' in corps: corps = AIDE_EN + corps
                corps = re.sub(r'(["\'])(/[a-z0-9-]*/?)(#[^"\']*)?\1', lambda m: m.group(1) + url_en(m.group(2)) + (m.group(3) or '') + m.group(1) if m.group(2) in PAGES and m.group(2) != '/' else m.group(0), corps)
                corps = remplace_js(corps, JS.get('accueil', []), fr_chemin, obligatoire=False)
            parts[i] = ouv2 + corps + '</script>'
    t = ''.join(parts)
    for aj in CONF.get('ajouts', {}).get(fr_chemin, []):   # textes propres à la version anglaise
        if aj['apres'] not in t: ERREURS.append('%s : point d’ajout introuvable « %s »' % (fr_chemin, aj['apres'])); continue
        t = t.replace(aj['apres'], aj['apres'] + aj['html'], 1)
    t = re.sub(r'<html lang="fr[^"]*"', '<html lang="en"', t, count=1)
    t = ajoute_entete(t, fr_chemin, en_chemin, 'en')
    dest = os.path.join(RACINE, en_chemin.strip('/'), 'index.html')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    return dest, t

def scripts_en():
    sortie = []
    for fr, en in SCRIPTS.items():
        code = decode(open(os.path.join(RACINE, fr.strip('/')), encoding='utf-8').read())
        code = remplace_js(code, JS.get(fr, []), fr)
        if '__en(' in code: code = AIDE_EN + code
        sortie.append((os.path.join(RACINE, en.strip('/')), code))
    return sortie

def francais():
    """Ajoute hreflang et le bouton EN aux pages françaises (idempotent)."""
    sortie = []
    for fr, en in PAGES.items():
        src = os.path.join(RACINE, fr.strip('/'), 'index.html') if fr != '/' else os.path.join(RACINE, 'index.html')
        t = open(src, encoding='utf-8').read()
        sortie.append((src, ajoute_entete(t, fr, en, 'fr')))
    return sortie

if __name__ == '__main__':
    res = [fabrique(fr, en) for fr, en in PAGES.items()]
    res += scripts_en()
    if '--manquants' in sys.argv:
        json.dump({k: v[0] for k, v in MANQUE.items()}, open(os.path.join(ICI, 'manquants.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('à traduire :', len(MANQUE), 'phrases ;', sum(len(k.split()) for k in MANQUE), 'mots'); print('\n'.join(ERREURS[:30])); sys.exit(0)
    if MANQUE or ERREURS:
        print('Rien n’est écrit. Il manque', len(MANQUE), 'traductions.'); print('\n'.join(ERREURS[:40]))
        for k in list(MANQUE)[:15]: print('  -', k[:100])
        sys.exit(1)
    res += francais()
    for dest, t in res: open(dest, 'w', encoding='utf-8').write(t)
    print('Version anglaise fabriquée :', len(PAGES), 'pages,', len(SCRIPTS), 'scripts.')
