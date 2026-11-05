# Maintenance du portfolio

Ce guide explique comment faire vivre le site sans rien casser. Toutes les commandes se tapent dans un terminal ouvert sur le dossier du projet.

## Où se trouve quoi

| Élément | Fichier |
|---|---|
| Textes et structure de la page | `index.html` |
| Comportement du site, projets, certifications, réponses prédéfinies du chatbot | `app.js` |
| Ce que sait l'assistante (consignes et faits) | `api/_lib/knowledge.js` |
| Photos d'origine (non publiées, sauvegardées par OneDrive) | `_originaux/images/` |
| Photos optimisées (générées, ne pas modifier à la main) | `img/` et `images.json` |
| Clé Groq pour les essais sur ton ordinateur (jamais publiée) | `.env.local` |
| Réglages de sécurité et de cache du site en ligne | `vercel.json` |

## Voir le site sur ton ordinateur

1. Tape `npm run serve`.
2. Ouvre http://localhost:8080 (en navigation privée pour éviter les anciennes versions).
3. Pour arrêter : Ctrl+C dans le terminal.

N'ouvre pas `index.html` en double-cliquant : la galerie et les badges resteraient vides.

## Ajouter ou remplacer une image

1. Dépose la photo d'origine dans `_originaux/images/` avec le bon nom :
   * galerie : `galerie-8.jpg` (le numéro suivant) ;
   * badge Prise de parole : `parole-1.jpg` à `parole-4.jpg`, et `parole-2-2.jpg` pour une 2e photo du badge 2 ;
   * projet : `projet-nom.jpg` ;
   * certification : `cert-nom.jpg`.
2. Tape `npm run images`. Le script crée les versions optimisées, met à jour `images.json` et retire les données GPS des photos.
3. Vérifie avec `npm run serve`, puis republie (voir plus bas).

Pour remplacer une photo, dépose la nouvelle avec le même nom et relance `npm run images`. Les majuscules, les espaces et les extensions (jpg, jpeg, png) sont corrigés automatiquement.

## Ajouter un projet

1. Ajoute son image : `projet-nom.jpg` dans `_originaux/images/`, puis `npm run images`.
2. Dans `index.html`, section `PROJETS`, copie un bloc `<div class="project-card" ...>` complet et change :
   * `data-key="nom"` ;
   * `data-img="projet-nom"` ;
   * le titre et la description, en français (`data-fr`) et en anglais (`data-en`).
3. Dans `app.js`, dans `const projectData`, copie une entrée existante avec la même clé `nom`. Renseigne `title`, `img:'projet-nom'`, `link` (adresse du dépôt ou de la démo, ou `''` s'il n'y en a pas), `desc` et `tags`.
4. Si l'assistante doit en parler, ajoute le projet dans `api/_lib/knowledge.js`, partie PROJETS ou PROJECTS.
5. Lance `npm run check`, puis republie.

## Ajouter une certification

1. Ajoute l'image du certificat : `cert-nom.jpg` dans `_originaux/images/`, puis `npm run images`.
2. Dans `index.html`, section `CERTIFICATIONS`, copie un bloc `<div class="folder-card">` et change `data-cert="nom"`, le titre, l'organisme et l'année (`data-meta-fr` et `data-meta-en`) et la description.
3. Dans `app.js`, dans `const certData`, ajoute une entrée `nom` avec `name`, `org`, `id`, `link` (le PDF officiel) et `img:'cert-nom'`.
4. Ajoute-la à la ligne CERTIFICATIONS de `api/_lib/knowledge.js`, en français et en anglais.
5. Lance `npm run check`, puis republie.

## Modifier le chatbot

* Ce que sait l'assistante : `api/_lib/knowledge.js`, une version française (`KB_FR`) et une version anglaise (`KB_EN`). Garde les deux identiques sur le fond.
* Les 10 réponses aux questions suggérées : `app.js`, `const CANNED`. Après modification, tape `npm run kb` (c'est aussi fait automatiquement par `npm run serve`).
* `npm run check` vérifie que les deux restent synchronisés.

## Rouvrir les questions libres

Aujourd'hui, le chat ne propose que les 10 questions suggérées et un bouton « Écrire à Kadi » (email prérempli). Les questions libres sont fermées à deux endroits :

1. Sur Vercel : Settings > Environment Variables, mets `CHAT_FREE_ENABLED` à `true`, puis redéploie. Tant que ce n'est pas fait, `/api/chat` répond « 503 disabled », même si quelqu'un l'appelle directement.
2. Dans `app.js` : remplace `const CHAT_FREE=false;` par `const CHAT_FREE=true;`. La zone de texte revient à la place du bouton email.

Vérifie ensuite `https://ton-domaine/api/health` : `"chatFree":true` et `"groqKey":true`. Pour refermer, fais l'inverse.

## Changer de modèle Groq

1. Sur console.groq.com, page Models, vérifie le nom exact du modèle (par exemple `openai/gpt-oss-120b`).
2. Sur Vercel : ton projet, Settings, Environment Variables.
   * `GROQ_MODEL` : le modèle principal (s'il n'existe pas, `openai/gpt-oss-120b` est utilisé).
   * `GROQ_MODELS` : les modèles de secours séparés par des virgules, essayés dans l'ordre si le principal est en panne, retiré ou saturé.
3. Onglet Deployments : sur le dernier déploiement, menu à trois points, Redeploy. Une variable ne s'applique qu'aux nouveaux déploiements.
4. Vérifie https://ton-domaine/api/health : le champ `model` doit afficher le nouveau nom.
5. Fais la même modification dans `.env.local` pour tes essais en local.

## Renouveler la clé Groq

À faire une fois par an, ou tout de suite si tu penses que la clé a pu être vue.

1. Sur console.groq.com, API Keys, Create API Key. Copie la nouvelle clé.
2. Sur Vercel, Settings, Environment Variables : modifie `GROQ_API_KEY`, colle la nouvelle clé et enregistre.
3. Redeploy (voir ci-dessus), puis vérifie que /api/health affiche `"groqKey": true` et que le chatbot répond à une question libre.
4. Seulement ensuite, retourne sur console.groq.com et supprime l'ancienne clé.
5. Si tu fais des essais en local, remplace aussi la clé dans `.env.local`.

Ne colle jamais la clé dans un fichier du projet autre que `.env.local`, dans un message ou dans une capture d'écran.

## Changer l'adresse du site (domaine)

L'adresse du site est écrite à un seul endroit, puis recopiée par un script dans la balise canonical, les balises de partage (LinkedIn, WhatsApp), le JSON-LD, sitemap.xml et robots.txt.

1. Tape `npm run seo -- https://kadi-bagayoko.fr` (avec ton adresse, sans / à la fin).
2. Tape `npm run check`, puis républie (voir plus bas).
3. Dans Google Search Console, envoie `https://kadi-bagayoko.fr/sitemap.xml`.

Le même script regénère l'image de partage `og.jpg` (1200 x 630) et les icônes à partir de `img/kadi.webp`.

## Lancer les tests automatiques

`npm test` ouvre le site dans un navigateur invisible et vérifie : aucune erreur console, langues et thèmes, les 8 certifications, les badges et la galerie, le chatbot, l'affichage à 390 px et le poids de la page. La première fois sur un nouvel ordinateur : `npx playwright install chromium`.

## Républier après une modification

1. `npm run check` (doit finir par « Tout est en ordre »).
2. `git add -A`
3. `git commit -m "Ce que j'ai changé"`
4. `git push`

Vercel publie automatiquement en une minute environ. En cas de problème, sur Vercel, onglet Deployments, choisis le déploiement précédent puis Promote to Production (ou Instant Rollback) : l'ancienne version revient immédiatement.

## Lire une alerte

Tu peux recevoir trois sortes d'alertes par email.

**GitHub, « Controle du portfolio » en échec** (chaque lundi, et à chaque envoi). Une issue « Alerte » est aussi ouverte dans le dépôt.
1. Ouvre le lien de l'email, puis l'étape `npm run check` ou `gitleaks`.
2. Lis les lignes qui commencent par ECHEC. Les causes les plus fréquentes :
   * lien externe cassé : un dépôt GitHub renommé ou un certificat déplacé, corrige l'adresse dans `index.html` ou `app.js` ;
   * clé Groq absente en ligne : voir Renouveler la clé ;
   * site injoignable : regarde Vercel, onglet Deployments ;
   * gitleaks : une clé a été envoyée dans le dépôt. Change de clé immédiatement sur console.groq.com, puis demande de l'aide pour la retirer de l'historique.
3. Corrige, republie, puis ferme l'issue.

Les lignes « Attention » ne bloquent pas : par exemple LinkedIn refuse souvent les robots, le lien est alors simplement à vérifier à la main.

**UptimeRobot, « Monitor is DOWN »** : le site ou /api/health ne répond plus. Ouvre le site. S'il est hors ligne, regarde Vercel (Deployments, puis Logs du dernier déploiement) et reviens au déploiement précédent si besoin.

**Dependabot** : une proposition de mise à jour (pull request). Si le contrôle automatique de la pull request est vert, clique Merge. Sinon, laisse-la de côté et demande de l'aide.

## Brancher la surveillance UptimeRobot (gratuit, une seule fois)

1. Crée un compte sur uptimerobot.com (plan Free) et confirme ton email.
2. Add New Monitor :
   * Monitor Type : HTTP(s) ;
   * Friendly Name : Portfolio accueil ;
   * URL : https://ton-domaine/ ;
   * Monitoring Interval : 5 minutes ;
   * Alert Contacts : ton email.
3. Add New Monitor une seconde fois :
   * Monitor Type : Keyword ;
   * Friendly Name : Portfolio chatbot ;
   * URL : https://ton-domaine/api/health ;
   * Keyword : `"groqKey":true` ;
   * Alert when : keyword not exists (alerte si le mot n'est plus trouvé, donc si la clé a disparu ou si l'API est en panne) ;
   * Alert Contacts : ton email.
4. Les deux moniteurs doivent passer au vert (Up) en quelques minutes.

## Chaque mois (10 minutes)

1. Ouvre le site sur ton téléphone, change de langue et de thème.
2. Pose une question libre au chatbot en français, puis en anglais.
3. GitHub, onglet Actions : le dernier « Controle du portfolio » est vert, et l'onglet Issues ne contient pas d'alerte ouverte.
4. Pull requests Dependabot : fusionne celles dont le contrôle est vert.
5. UptimeRobot : disponibilité proche de 100 %.
6. console.groq.com, page Models : les modèles de `GROQ_MODELS` existent toujours. Sinon, voir Changer de modèle Groq.
7. Relis la disponibilité affichée (bandeau du haut et section Contact) : est-elle encore juste ?

## Chaque année

1. Renouvelle la clé Groq (voir plus haut).
2. Mets à jour les textes datés : disponibilité, projets « en cours », année de formation (B3), année du pied de page (© 2026), dans `index.html`, `app.js` et `api/_lib/knowledge.js`.
3. Vérifie le renouvellement automatique du nom de domaine et la validité de ta carte chez le registraire.
4. Dans `.github/workflows/check.yml`, passe `node-version` à la version LTS actuelle de Node.
5. Mesure les performances sur pagespeed.web.dev (objectif : 90 ou plus sur mobile).
6. Relis les données personnelles visibles et les photos (accord des personnes présentes).
7. Vérifie que `_originaux` est toujours bien sauvegardé dans OneDrive.
