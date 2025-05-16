# web_avance_front

Bienvenue sur le projet **web_avance_front** !  
Ce projet est une application front-end moderne basée sur **React**, **TypeScript** et **Vite**.  
Il sert de socle pour des développements web avancés, avec une structure claire, des outils de qualité et une expérience développeur optimale.

---

## 🚀 Fonctionnalités principales

- **Développement rapide** grâce à [Vite](https://vitejs.dev/)
- **Hot Module Replacement** (HMR) pour un rechargement instantané des modifications
- **Typage statique** avec [TypeScript](https://www.typescriptlang.org/)
- **Qualité de code** assurée par [ESLint](https://eslint.org/) et une configuration adaptée à React/TS
- **Structure modulaire** : composants, pages, hooks, services, etc.
- **Support JSX/TSX** pour le développement React moderne

---

## 🛠️ Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version recommandée : >=18)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Étapes

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-repo>
   cd web_avance_front
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   # ou
   yarn install
   ```

---

## 👨‍💻 Lancement du projet

### En mode développement

```bash
npm run dev
# ou
yarn dev
```

- L'application sera accessible sur [http://localhost:5173](http://localhost:5173) (par défaut).
- Toute modification du code source est automatiquement prise en compte grâce au HMR.

### Build pour la production

```bash
npm run build
# ou
yarn build
```

- Le résultat sera dans le dossier `dist/`.

### Prévisualisation de la build

```bash
npm run preview
# ou
yarn preview
```

---

## 📂 Structure du projet

```
web_avance_front/
├── public/           # Fichiers statiques (favicon, images, etc.)
├── src/              # Code source principal
│   ├── components/   # Composants réutilisables React
│   ├── pages/        # Pages principales de l'application
│   ├── hooks/        # Hooks personnalisés
│   ├── services/     # Appels API, gestion des données
│   ├── assets/       # Images, styles, etc.
│   ├── App.tsx       # Point d'entrée principal React
│   └── main.tsx      # Bootstrap de l'application
├── package.json      # Dépendances et scripts
├── tsconfig.json     # Configuration TypeScript
├── vite.config.ts    # Configuration Vite
└── README.md         # Ce fichier
```

---

## 📜 Scripts disponibles

- `dev` : démarre le serveur de développement
- `build` : construit l'application pour la production
- `preview` : prévisualise la build de production
- `lint` : lance ESLint pour vérifier la qualité du code

---

## 🧹 Qualité de code & ESLint

Le projet utilise ESLint avec une configuration adaptée à React et TypeScript.  
Pour vérifier la qualité du code :

```bash
npm run lint
# ou
yarn lint
```

Vous pouvez personnaliser les règles dans le fichier de configuration ESLint selon vos besoins.

---

## 🧑‍💻 Conseils de développement

- **Créer des composants réutilisables** dans `src/components`
- **Organiser les pages** dans `src/pages`
- **Utiliser des hooks personnalisés** pour factoriser la logique réutilisable
- **Séparer la logique métier** (API, gestion de données) dans `src/services`
- **Documenter votre code** pour faciliter la maintenance

---

## 🛠️ Technologies utilisées

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)

---

## 🤝 Contribution

Les contributions sont les bienvenues !  
Merci de créer une issue ou une pull request pour toute suggestion, correction ou amélioration.

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 📬 Besoin d'aide ?

Pour toute question, contactez le responsable du projet ou ouvrez une issue sur le dépôt.

---

## 👤 Créateur

GOURBAL François