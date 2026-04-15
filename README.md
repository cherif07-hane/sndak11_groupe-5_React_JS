# Fullstack Portfolio SPA

Application React realisee avec Vite pour gerer un mini portfolio de projets.
Le projet respecte l'organisation demandee autour des composants `Dossier`,
`Projet`, `AjouterProjet` et `DetaillerProjet`, avec une persistance locale via
`json-server`.

## Fonctionnalites

- affichage de la liste des projets
- recherche instantanee par titre, categorie, description ou technologie
- consultation d'un projet en detail
- ajout d'un nouveau projet
- modification d'un projet existant
- suppression d'un projet
- navigation SPA avec React Router

## Stack

- React 19
- Vite
- React Router 7
- json-server
- CSS vanilla

## Demarrage

1. Installer les dependances :

```bash
npm install
```

2. Lancer l'API locale dans un terminal :

```bash
npm run api
```

L'API demarre sur `http://localhost:3001` et sert les donnees du fichier
`db.json`.

3. Lancer l'application Vite dans un deuxieme terminal :

```bash
npm run dev
```

4. Ouvrir l'adresse affichee par Vite dans le navigateur.

## Scripts utiles

- `npm run dev` : demarre l'application en mode developpement
- `npm run api` : demarre `json-server` sur le port 3001
- `npm run build` : genere la version de production
- `npm run lint` : verifie la qualite du code avec ESLint
- `npm run preview` : previsualise le build de production

## Structure principale

- `src/App.jsx` : shell principal et routes
- `src/components/Dossier.jsx` : orchestration des donnees et des vues
- `src/components/Projet.jsx` : carte resumee d'un projet
- `src/components/AjouterProjet.jsx` : formulaire d'ajout et d'edition
- `src/components/DetaillerProjet.jsx` : panneau de details d'un projet
- `src/services/projectsApi.js` : appels CRUD vers l'API
- `db.json` : base de donnees locale

## Notes

- Les images de demonstration sont dans `public/`.
- Si les projets ne s'affichent pas, verifier que `npm run api` tourne bien
  avant d'utiliser l'application.

## References

- React : https://react.dev/
- Vite : https://vite.dev/
- React Router : https://reactrouter.com/
- json-server : https://github.com/typicode/json-server
