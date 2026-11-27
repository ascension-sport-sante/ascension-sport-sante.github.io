# Version anglaise du site (/en/)

Les pages anglaises sont **fabriquées** à partir des pages françaises : on ne les modifie jamais à la main.

- `pages.json` : correspondance des adresses (français → anglais), scripts anglais, liens vers les versions anglaises des sources.
- `textes.json` : toutes les phrases des pages (français → anglais). Les balises en ligne sont notées `<strong1>…</strong1>`, `<svg2/>`.
- `js.json` : les phrases affichées par les scripts. Les réponses du formulaire restent envoyées en français au coach, avec la mention « [Site anglais] ».
- `construire.py` : fabrique `/en/`, les scripts `-en.js`, et ajoute aux pages françaises les liens hreflang et le bouton EN.

Après toute modification d'une page française :

    python3 .traduction/construire.py --manquants   # liste ce qu'il reste à traduire (manquants.json)
    python3 .traduction/construire.py              # refuse d'écrire s'il manque une seule traduction

`numerote.py` aide à traduire par lots numérotés ; `chaines_js.py` liste les phrases françaises d'un script.
Sources : les recommandations de l'OMS sont recopiées mot pour mot de leur texte officiel anglais ; les sources françaises (HAS, Inserm, Code de la santé publique, Vidal, service-public) sont traduites et marquées « (our translation) ».
