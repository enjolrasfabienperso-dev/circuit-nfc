# Circuit NFC — mot du jour et image quotidienne

Site statique, sans dépendance : `generateur.html` (puce 1), `image.html` (puce 2), `admin.html` (lien administrateur, non lié ailleurs).

> **Ce n’est pas une protection réelle.** Une capture d’écran, une copie de l’URL avant effacement du fragment, ou la lecture du code source (le calcul du mot est dans `commun.js`, les images sont des fichiers publics dans `images/`) contournent le circuit. Le but est seulement qu’un usage ordinaire passe par le scan des puces.

## Publier

- **GitHub Pages** : pousser le contenu de ce dossier à la racine d’un dépôt, puis *Settings → Pages → Deploy from a branch → main / (root)*. Le fichier `.nojekyll` est déjà présent.
- **Netlify** : glisser-déposer le dossier sur app.netlify.com (*Deploy manually*). Le fichier `_headers` y pose `Cache-Control: no-store` (GitHub Pages ne le permet pas : la parade est doublée en JavaScript).
- Tester en local : `python3 -m http.server 8000` dans ce dossier, puis `http://localhost:8000/…`.

## Les deux URL à écrire dans les puces (enregistrement URL)

- Puce 1 : `https://<ton-site>/generateur.html#k=<fragment 1>`
- Puce 2 : `https://<ton-site>/image.html#k=<fragment 2>`

Les fragments réels ne sont **pas** dans ce dépôt (seules leurs empreintes SHA-256 sont dans `config.js`). Ils sont fournis à part, dans un fichier privé à garder hors du dépôt. Sans le bon fragment, chaque page reste blanche.

## Changer le mot de passe ou les fragments (avant publication)

1. Calculer l’empreinte : `printf '%s' 'NouveauMotDePasse' | sha256sum` (ou *admin.html → Outils*, qui sait aussi générer un nouveau fragment aléatoire).
2. Coller l’empreinte dans `config.js` (`motDePasseAdmin`, `fragmentGenerateur` ou `fragmentImage`).
3. Si un fragment change, réécrire la puce correspondante avec la nouvelle URL.

## Publier une nouvelle image (2 lignes)

1. Dans `admin.html`, ajoute l’image puis clique sur *Préparer les fichiers* : copie les images du ZIP dans `images/`.
2. Remplace `images.json` par celui du ZIP, puis commit/push (ou glisser-déposer le dossier sur Netlify).

## Règle du mot du jour (pour mémoire)

Fuseau Europe/Paris, changement à minuit, jour 0 = 8 octobre 2026. Index = jours civils écoulés ; liste = floor(index / 100) mod 4 ; position = index mod 100. Image du jour = image n° (index mod nombre d’images) de `images.json`, dans l’ordre du fichier. Saisie insensible à la casse, aux accents, aux espaces, tirets et apostrophes.

## Comportement

- Le fragment est lu puis effacé (`history.replaceState`) : rechargement, retour arrière ou favori → page blanche. Retour depuis le cache de navigation (`pageshow` persisté) → page blanche.
- Page image : le fragment reste jusqu’à la saisie ; bon mot → image plein écran et fragment effacé ; mauvais mot → page blanche et fragment effacé (nouvel essai = nouveau scan).
- Aucun `localStorage`, `sessionStorage` ni service worker. Images chargées avec un paramètre de date (`?d=AAAA-MM-JJ`) et `images.json` en `no-store`.
