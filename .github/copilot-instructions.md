# Convention Apollo Client

**IMPORTANT :** Lors de l’utilisation d’Apollo Client dans le frontend, le retour de la propriété `data` doit toujours être casté avec `as any` (ex : `const { data } = await apolloClient.query(...); return (data as any).(...);`). Cela évite les erreurs de typage et garantit la compatibilité avec TanStack Query et les hooks personnalisés.

# Convention Import Apollo Client
**IMPORTANT :** La ligne `import { gql } from "@apollo/client";` doit toujours être placée en toute première ligne des fichiers `/lib/queries.ts` et `/lib/mutations.ts` côté frontend. Aucun autre import ou déclaration ne doit précéder cette ligne dans ces fichiers.
# Convention d’ordre dans schema.prisma

**IMPORTANT :** Dans le fichier `schema.prisma`, le bloc `generator client` puis le bloc `datasource db` doivent toujours être placés en tout début de fichier, avant toute déclaration de modèle ou d’enum. Cela garantit la compatibilité Prisma et évite les erreurs de génération.
# Utilisation de ConfirmModal

**IMPORTANT :** Pour toute question nécessitant une confirmation Oui/Non (ex : suppression, action critique), il faut obligatoirement utiliser la modale `/components/layout/ConfirmModal.tsx`.
# Relecture et Correction Systématique

**IMPORTANT :** Après chaque modification de code effectuée (création, édition, suppression), il est obligatoire de :
- Relire le code modifié
- Revérifier la logique, la syntaxe et la cohérence
- Corriger immédiatement toute erreur ou incohérence détectée

Cette étape doit être systématique pour garantir la stabilité et la qualité du projet.

# Convention d’Organisation des Imports

**IMPORTANT :** Tous les imports doivent toujours être placés dans les toutes premières lignes de chaque fichier, avant toute déclaration de variable, type, fonction ou composant.
# Relecture et Correction Systématique

**IMPORTANT :** Après chaque modification de code effectuée (création, édition, suppression), il est obligatoire de :
- Relire le code modifié
- Revérifier la logique, la syntaxe et la cohérence
- Corriger immédiatement toute erreur ou incohérence détectée

Cette étape doit être systématique pour garantir la stabilité et la qualité du projet.
# Copilot Instructions - PurgatoryCompta

## Contexte du Projet

PurgatoryCompta est une application de comptabilité développée pour une organisation criminelle fictive dans l'univers de GTA RP (RolePlay). L'application permet de gérer les finances, transactions et membres de l'organisation "Purgatory".

## Architecture Technique

### Structure Monorepo
```
purgacompta/
├── apps/
│   ├── frontend/    # Application Next.js
│   └── backend/     # Serveur Apollo GraphQL + Prisma
├── packages/        # Packages partagés (futur)
├── pnpm-workspace.yaml
└── turbo.json
```

### Frontend (apps/frontend)
- **Framework**: Next.js 14 avec Page Router
- **Bundler**: Turbopack (mode développement)
- **UI**: Material UI (MUI) v5 avec thème sombre personnalisé
- **State Management**: 
  - TanStack Query pour le cache serveur
  - Apollo Client pour les requêtes GraphQL
- **Authentification**: NextAuth.js avec provider Discord
- **TypeScript**: Configuration stricte

### Backend (apps/backend)
- **API**: Apollo Server 4 (GraphQL)
- **ORM**: Prisma avec SQLite
- **TypeScript**: Configuration stricte

## Authentification Discord

### Configuration
1. Créer une application sur le [Discord Developer Portal](https://discord.com/developers/applications)
2. Configurer les OAuth2 Redirects: `http://localhost:3000/api/auth/callback/discord`
3. Copier Client ID et Client Secret dans `.env`

### Flux d'authentification
1. L'utilisateur clique sur "Se connecter avec Discord"
2. Redirection vers Discord OAuth2
3. Callback vers NextAuth
4. Mutation GraphQL `registerOrUpdateUser` pour enregistrer/mettre à jour l'utilisateur en BDD
5. Session créée avec JWT

## Système de Rôles et Permissions

### Hiérarchie des Rôles
```
OWNER (4) > ADMIN (3) > MANAGER (2) > MEMBER (1) > GUEST (0)
```

### Permissions CRUD par Rôle
| Rôle    | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| GUEST   | ❌     | ✅   | ❌     | ❌     |
| MEMBER  | ✅     | ✅   | ❌     | ❌     |
| MANAGER | ✅     | ✅   | ✅     | ❌     |
| ADMIN   | ✅     | ✅   | ✅     | ✅     |
| OWNER   | ✅     | ✅   | ✅     | ✅     |

### UserProvider
Le `UserProvider` expose:
- `user`: Données de l'utilisateur connecté
- `loading`: État de chargement
- `hasPermission(role)`: Vérifie si l'utilisateur a au moins ce rôle
- `canCreate`, `canRead`, `canUpdate`, `canDelete`: Permissions booléennes


## Règle Frontend TanStack Query

**IMPORTANT :** Toutes les queries et mutations côté frontend doivent obligatoirement utiliser TanStack Query (useQuery, useMutation, useInfiniteQuery, etc.), même pour les requêtes GraphQL Apollo. N'utilisez jamais directement useQuery Apollo ou fetch pour la gestion des données côté React, sauf cas très particulier documenté.

**IMPORTANT :** Le `queryFn` ou `mutationFn` d'une query/mutation TanStack doit toujours utiliser `apolloClient.query` ou `apolloClient.mutate` (et jamais fetch ou axios directement), afin de garantir l'intégration avec le cache Apollo et la gestion des erreurs/authentification. 

---


## Règle d'affichage des données tabulaires


**IMPORTANT :** Pour tout affichage de données sous forme de tableau, il faut toujours utiliser le composant `Mui-Datagrid` (de `@mui/x-data-grid`) à la place de `Table` (de `@mui/material`). L'utilisation de `Table` est interdite pour les données dynamiques ou administrables.

**Exception :** L'utilisation de `Table` (de `@mui/material`) est tolérée uniquement pour la page du dashboard du à la limitation concernant le CSS de `Mui-Datagrid` dans les environnements Turbopack.


## Convention de Structure des Pages Next.js

**IMPORTANT :** Toujours utiliser la structure "nested routes" pour les pages Next.js, c'est-à-dire créer un dossier pour chaque page et placer le fichier `index.tsx` à l'intérieur (ex : `settings/index.tsx` pour la page `/settings`). Cela permet d'ajouter facilement des sous-pages et d'assurer une structure claire et évolutive.

## Conventions de Code

### Nommage
- **Composants React**: PascalCase (ex: `MainLayout.tsx`)
- **Fichiers utilitaires**: camelCase (ex: `apolloClient.ts`)
- **Variables/fonctions**: camelCase
- **Types/Interfaces**: PascalCase avec préfixe descriptif
- **Constantes**: SCREAMING_SNAKE_CASE

### Structure des Composants
```typescript
// 1. Imports
import React from 'react';
import { ... } from '@mui/material';

// 2. Types/Interfaces
interface Props { ... }

// 3. Composant
const MyComponent: React.FC<Props> = ({ ... }) => {
  // Hooks
  // Handlers
  // Render
  return ( ... );
};

export default MyComponent;
```


### Organisation des Queries et Mutations GraphQL
- **Centralisation** : Toutes les queries doivent être placées dans `/lib/queries.ts` et toutes les mutations dans `/lib/mutations.ts` côté frontend.
- **Pertinence** : N'ajouter que les queries et mutations réellement utilisées dans l'application.
- **Unicité** : Si une query ou mutation nécessite des champs supplémentaires, il faut compléter la définition existante plutôt que de dupliquer la query ou mutation sous un autre nom.
- **Nommage** :
  - Queries : Préfixe `GET_` ou `FETCH_` (ex: `GET_CURRENT_USER`)
  - Mutations : Verbe d'action (ex: `registerOrUpdateUser`)
  - Fragments : Suffixe `_FRAGMENT`

## Commandes Utiles

```bash
# Installation des dépendances
pnpm install

# Développement
pnpm dev              # Lance front + back
pnpm dev:frontend     # Lance uniquement le frontend
pnpm dev:backend      # Lance uniquement le backend

# Base de données
pnpm db:generate      # Génère le client Prisma
pnpm db:migrate       # Applique les migrations
pnpm db:push          # Push le schéma vers la DB
pnpm studio           # Ouvre Prisma Studio

# Build
pnpm build            # Build tous les packages
```

## Bonnes Pratiques

### Sécurité
- Ne jamais exposer les secrets dans le code
- Utiliser les variables d'environnement
- Valider les permissions côté serveur (pas seulement côté client)
- Sanitiser les inputs utilisateur

### Performance
- Utiliser `getServerSideProps` pour les pages nécessitant une authentification
- Profiter du cache Apollo Client
- Lazy loading des composants lourds

### Accessibilité
- Utiliser les composants MUI qui respectent l'a11y
- Ajouter des labels ARIA quand nécessaire
- Tester la navigation au clavier

## Prochaines Fonctionnalités à Implémenter

1. **Page de gestion des rôles** - Permettre aux admins de modifier les rôles des utilisateurs
2. **Module Transactions** - CRUD complet pour les transactions financières
3. **Module Comptes** - Gestion des comptes bancaires de l'organisation
4. **Module Membres** - Liste et gestion des membres
5. **Rapports** - Tableaux de bord et exports
6. **Logs d'activité** - Historique des actions

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI](https://mui.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [NextAuth.js](https://next-auth.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
