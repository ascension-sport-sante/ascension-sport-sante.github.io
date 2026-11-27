# Découpe une page HTML en « phrases à traduire » sans jamais toucher au reste du balisage.
# Chaque phrase garde ses balises en ligne sous forme de jetons courts (<a1>…</a1>, <svg2/>),
# pour que la traduction puisse changer l'ordre des mots sans casser la page.
import re, html
from html.parser import HTMLParser

VIDES = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr','param'}
EN_LIGNE = {'a','abbr','b','bdi','bdo','br','cite','code','data','dfn','em','i','kbd','mark','q','s','samp',
            'small','span','strong','sub','sup','time','u','var','wbr','button','label','img','input'}
OPAQUES = {'svg','img','picture','video','audio','canvas','iframe','input','source','script','style','template',
           'math','object','textarea','select','noscript'}
LETTRES = re.compile(r'[A-Za-zÀ-ÖØ-öø-ÿŒœ]{2,}')

class Noeud:
    def __init__(s, tag, debut, fin_ouv, parent):
        s.tag, s.debut, s.fin_ouv, s.parent = tag, debut, fin_ouv, parent
        s.debut_fer = s.fin = None
        s.enfants = []

class Analyse(HTMLParser):
    def __init__(s, texte):
        super().__init__(convert_charrefs=False)
        s.t = texte
        s.lignes = [0]
        for m in re.finditer('\n', texte): s.lignes.append(m.end())
        s.racine = Noeud('#racine', 0, 0, None); s.racine.debut_fer = s.racine.fin = len(texte)
        s.pile = [s.racine]
        s.feed(texte); s.close()
        fin = len(texte)
        while len(s.pile) > 1:
            n = s.pile.pop(); n.debut_fer = n.fin = fin
    def pos(s):
        l, c = s.getpos(); return s.lignes[l - 1] + c
    def handle_starttag(s, tag, attrs):
        d = s.pos(); brut = s.get_starttag_text()
        n = Noeud(tag, d, d + len(brut), s.pile[-1]); s.pile[-1].enfants.append(n)
        if tag in VIDES: n.debut_fer = n.fin = n.fin_ouv
        else: s.pile.append(n)
    def handle_startendtag(s, tag, attrs):
        d = s.pos(); brut = s.get_starttag_text()
        n = Noeud(tag, d, d + len(brut), s.pile[-1]); n.debut_fer = n.fin = n.fin_ouv
        s.pile[-1].enfants.append(n)
    def handle_endtag(s, tag):
        d = s.pos(); f = s.t.index('>', d) + 1
        if not any(n.tag == tag for n in s.pile[1:]): return
        while s.pile[-1].tag != tag:
            n = s.pile.pop(); n.debut_fer = n.fin = d
        n = s.pile.pop(); n.debut_fer, n.fin = d, f
    def _texte(s, longueur_brute):
        d = s.pos(); n = Noeud('#texte', d, d, s.pile[-1]); n.fin = n.debut_fer = d + longueur_brute
        s.pile[-1].enfants.append(n)
    def handle_data(s, data):
        if s.pile[-1].tag in ('script', 'style'): return
        s._texte(len(data))
    def handle_entityref(s, name): s._texte(len(name) + 2 if s.t[s.pos() + len(name) + 1:s.pos() + len(name) + 2] == ';' else len(name) + 1)
    def handle_charref(s, name): s._texte(len(name) + 3 if s.t[s.pos() + len(name) + 2:s.pos() + len(name) + 3] == ';' else len(name) + 2)
    def handle_comment(s, data):
        d = s.pos(); n = Noeud('#commentaire', d, d, s.pile[-1]); n.fin = n.debut_fer = d + len(data) + 7
        s.pile[-1].enfants.append(n)

def a_du_texte(t, n):
    if n.tag == '#texte': return bool(LETTRES.search(html.unescape(t[n.debut:n.fin])))
    if n.tag in OPAQUES or n.tag == '#commentaire': return False
    return any(a_du_texte(t, e) for e in n.enfants)

def pur(n):
    """Vrai si le nœud ne contient que du texte, des balises en ligne et des éléments opaques."""
    if n.tag in ('#texte', '#commentaire') or n.tag in OPAQUES: return True
    if n.tag not in EN_LIGNE: return False
    return all(pur(e) for e in n.enfants)

def phrases(t):
    """Renvoie la liste des morceaux (debut, fin) à traduire."""
    racine = Analyse(t).racine; res = []
    def visite(n):
        if n.tag in OPAQUES or n.tag in ('#texte', '#commentaire'): return
        if n.tag in ('head', 'title'):
            for e in n.enfants: visite(e)
            if n.tag == 'title': res.append((n.fin_ouv, n.debut_fer))
            return
        enf = n.enfants
        if n.tag != '#racine' and enf and all(pur(e) for e in enf):
            if a_du_texte(t, n): res.append((n.fin_ouv, n.debut_fer))
            return
        groupe = []
        def vider():
            if groupe and any(a_du_texte(t, e) for e in groupe): res.append((groupe[0].debut, groupe[-1].fin))
            groupe.clear()
        for e in enf:
            if pur(e): groupe.append(e)
            else: vider(); visite(e)
        vider()
    visite(racine)
    # un même <title> peut être compté deux fois : on dédoublonne
    return sorted(set(res))

def jetons(t, debut, fin):
    """Transforme un morceau en clé lisible + table des jetons pour reconstruire."""
    sous = Analyse(t[debut:fin]).racine
    cle, table, k = [], {}, [0]
    def ecrit(n):
        if n.tag == '#texte':
            cle.append(t[debut + n.debut:debut + n.fin]); return
        k[0] += 1; nom = ('c' if n.tag == '#commentaire' else n.tag) + str(k[0])
        brut = t[debut + n.debut:debut + n.fin]
        if n.tag == '#commentaire' or n.tag in OPAQUES or n.tag in VIDES:
            cle.append('<%s/>' % nom); table[nom] = brut; return
        table[nom] = (t[debut + n.debut:debut + n.fin_ouv], t[debut + n.debut_fer:debut + n.fin])
        cle.append('<%s>' % nom)
        for e in n.enfants: ecrit(e)
        cle.append('</%s>' % nom)
    for e in sous.enfants: ecrit(e)
    brut = ''.join(cle)
    lisible = re.sub(r'\s+', ' ', html.unescape(brut).replace(' ', ' ').replace(' ', ' ')).strip()
    return lisible, table

def remonte(en, table):
    """Remet les vraies balises à la place des jetons dans la traduction."""
    def rep(m):
        ferme, nom, seul = m.group(1), m.group(2), m.group(3)
        v = table[nom]
        if isinstance(v, str): return v
        return v[1] if ferme else v[0]
    sortie = re.sub(r'&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)', '&amp;', en)
    return re.sub(r'<(/?)([a-z]+\d+|c\d+)(/?)>', rep, sortie)

def noms_jetons(s):
    return sorted(re.findall(r'</?(?:[a-z]+\d+|c\d+)/?>', s))
