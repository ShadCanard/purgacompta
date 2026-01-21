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

---


## Règle d'affichage des données tabulaires

**IMPORTANT :** Pour tout affichage de données sous forme de tableau, il faut toujours utiliser le composant `Mui-Datagrid` (de `@mui/x-data-grid`) à la place de `Table` (de `@mui/material`). L'utilisation de `Table` est interdite pour les données dynamiques ou administrables.


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

### GraphQL
- **Queries**: Préfixe `GET_` ou `FETCH_` (ex: `GET_CURRENT_USER`)
- **Mutations**: Verbe d'action (ex: `registerOrUpdateUser`)
- **Fragments**: Suffixe `_FRAGMENT`

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
