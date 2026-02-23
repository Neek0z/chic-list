# ChickList — Liste de courses

Application de liste de courses partagée en temps réel : plusieurs personnes peuvent voir et modifier la même liste grâce à un code de partage, sans créer de compte.

## L’app en bref

- **Ajout d’articles** : nom, quantité, rayon, catégorie (fruits, légumes, épicerie, etc.).
- **Plusieurs listes** : créer des listes (ex. « Maison », « Soirée »), chacune avec un code de partage.
- **Partage** : envoyer le code à quelqu’un → il saisit le code via « Rejoindre » et accède à la même liste en direct.
- **Synchronisation temps réel** : les modifications (ajout, cocher, supprimer) apparaissent immédiatement pour tous les utilisateurs de la liste.
- **Mode clair / sombre** et page **Infos** (bouton ℹ️) pour le mode d’emploi.

## Fonctionnement (backend)

- **Firebase Firestore** sert de base de données en temps réel, sans authentification.
- **Collection** : `lists`. Chaque liste est un **document** dont l’ID est le **code de partage** (6 caractères, ex. `A3B7K2`). Le document contient : `id`, `shareCode`, `name`, `items` (tableau d’articles avec `id`, `name`, `category`, `aisle`, `quantity`, `checked`).
- **Côté client** : le hook `useGroceryList` s’abonne aux documents Firestore correspondant aux codes « rejoints » (stockés en `localStorage`) via **`onSnapshot`**. Toute modification (ajout, édition, cocher, suppression) est envoyée avec **`setDoc`** sur le document de la liste. Les autres clients abonnés à ce document reçoivent la mise à jour instantanément.
- **Règles Firestore** : avec authentification Google, il faut autoriser l’accès aux listes de l’utilisateur et à la collection partagée, par exemple :
  - `users/{userId}/lists/{listId}` : `allow read, write: if request.auth != null && request.auth.uid == userId;`
  - `lists/{listId}` : `allow read, write: if request.auth != null;`  
  (Firebase Console → Firestore → Règles.)

## Project info (Lovable)

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
