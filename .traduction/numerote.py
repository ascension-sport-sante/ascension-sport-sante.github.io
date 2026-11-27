# Fige la liste des phrases à traduire avec un numéro (lot), et fusionne les traductions numérotées.
#   python3 numerote.py exporter LOT      -> lot-LOT.json (liste figée) + affichage par page
#   python3 numerote.py fusionner LOT FICHIER.txt  -> ajoute au dictionnaire textes.json (lignes « n ⟶ anglais »)
import json, sys, os, re
ICI = os.path.dirname(os.path.abspath(__file__))
if sys.argv[1] == 'exporter':
    m = json.load(open(os.path.join(ICI, 'manquants.json'), encoding='utf-8'))
    ordre = list(json.load(open(os.path.join(ICI, 'pages.json'), encoding='utf-8'))['pages'])
    liste = sorted(m.items(), key=lambda kv: ordre.index(kv[1]) if kv[1] in ordre else 99)
    json.dump([k for k, _ in liste], open(os.path.join(ICI, 'lot-%s.json' % sys.argv[2]), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    page = None
    for i, (k, p) in enumerate(liste):
        if p != page: print('\n#### ' + p); page = p
        print('%d: %s' % (i, k))
elif sys.argv[1] == 'fusionner':
    lot = json.load(open(os.path.join(ICI, 'lot-%s.json' % sys.argv[2]), encoding='utf-8'))
    dico_p = os.path.join(ICI, 'textes.json')
    dico = json.load(open(dico_p, encoding='utf-8')) if os.path.exists(dico_p) else {}
    n = 0
    for ligne in open(sys.argv[3], encoding='utf-8'):
        mm = re.match(r'^(\d+)\s*⟶\s?(.*)$', ligne.rstrip('\n'))
        if not mm: continue
        dico[lot[int(mm.group(1))]] = mm.group(2); n += 1
    json.dump(dico, open(dico_p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('fusionné', n, '; dictionnaire', len(dico))
