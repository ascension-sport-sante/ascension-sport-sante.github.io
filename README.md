# Ascension, coach sport-santé à domicile

Le site d'Ascension : coach sport-santé et enseignant en activité physique adaptée (APA-S), à domicile, à Paris et en proche banlieue.

En ligne : https://ascension-sport-sante.github.io

## Ce que contient ce dépôt

- `index.html` : le site principal (accueil, Santé, Forme, Enfants, Méthode, À propos, Tarifs, Contact, pages légales), sur une seule page.
- Un dossier par page « par besoin », chacun avec son `index.html` : `mal-de-dos/`, `sport-sur-ordonnance/`, `reprise-apres-maladie/`, `coach-sportif-enfants/`, `coach-sportif-senior/`, `coach-sportif-domicile-paris/`, `tarifs/`.
- `fond/` : les paysages en vidéo (`fond/` pour le téléphone, `fond/pc/` et `fond/pc720/` pour l'ordinateur).
- `sil/` : les silhouettes animées ; `sys/` : les illustrations des trois systèmes ; `polices/` : les polices de caractères.
- `sitemap.xml`, `robots.txt`, `llms.txt` : pour Google et les assistants.
- `seance/` : l'appli de séance des clients (appli web construite depuis le projet privé du coach, ne pas modifier à la main). Les séances et les résultats voyagent dans les liens, jamais sur ce site. `robots.txt` l'exclut des moteurs de recherche.
- `.well-known/assetlinks.json` : permet aux liens de retour d'ouvrir directement l'app du coach sur Android.

## Modifier un texte

1. Ouvrir le fichier (`index.html` ou le `index.html` d'une page par besoin), cliquer sur le crayon.
2. Chercher le texte avec Ctrl + F, le changer, sans toucher aux signes `<`, `>` et `"` autour.
3. « Commit changes ». Le site se met à jour en une à deux minutes.

Pour changer un texte présent dans plusieurs fichiers : appuyer sur la touche `.` sur la page du dépôt (éditeur github.dev), puis rechercher et remplacer dans tous les fichiers.

## Ajouter un avis client (un vrai)

Les avis sont cachés tant qu'il n'y en a aucun. Pour en afficher :

1. Dans `index.html`, chercher `id="temoignages" data-obs hidden` et effacer seulement le mot ` hidden` (la section devient visible).
2. Chercher `<!--@temo--><!--/@temo-->` et coller entre les deux repères un bloc comme celui-ci par avis :

```html
<figure class="avis" data-voie="0"><span class="av-noeud" aria-hidden="true"></span><span class="av-et" role="img" aria-label="5 étoiles sur 5"><i><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg></i></span><blockquote class="av-t"><p>TEXTE DE L'AVIS</p></blockquote><figcaption><span class="av-sceau" aria-hidden="true">M</span><span class="av-qui"><b>Prénom N.</b><small>Avis Google · MOIS ANNÉE</small></span></figcaption></figure>
```

3. Dans le bloc, remplacer :
   - `TEXTE DE L'AVIS` par le texte, recopié tel quel ;
   - `M` (dans `av-sceau`) par l'initiale du prénom, et `Prénom N.` par le prénom et l'initiale du nom ;
   - `Avis Google · MOIS ANNÉE` par la source et la date (par exemple `Avis Google · janvier 2027`, ou `Message reçu · janvier 2027`) ;
   - `data-voie="0"` selon la prestation : `0` Enfants et ados, `1` Être en forme, `2` Santé (l'avis s'affiche aussi sur cette page).
   - Pour 4 étoiles au lieu de 5 : remplacer le dernier `<i>` du bloc par `<i class="vide">` (et `5 étoiles sur 5` par `4 étoiles sur 5`).
4. Juste après `<!--@temo-note--><!--/@temo-note-->`, coller une fois cette phrase (obligation d'informer sur le contrôle des avis) :

```html
<p class="note rv">Avis recopiés depuis ma fiche Google ou reçus de mes clients, avec leur accord, sans modification. Ils ne sont pas vérifiés par un organisme extérieur.</p>
```

Ne jamais publier d'avis inventé : c'est une pratique commerciale trompeuse, interdite.

Les demandes de bilan partent directement vers la feuille Google privée du coach : aucune donnée de client n'est enregistrée dans ce dépôt.
