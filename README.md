# 🔥 PurgatoryCompta

> 💰 Système de comptabilité pour organisation criminelle - GTA RP

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Apollo GraphQL](https://img.shields.io/badge/Apollo-GraphQL-311C87?style=flat-square&logo=apollo-graphql)](https://www.apollographql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Material UI](https://img.shields.io/badge/Material%20UI-v5-007FFF?style=flat-square&logo=mui)](https://mui.com/)

## 📋 Description

PurgatoryCompta est une application web de gestion financière développée pour une organisation criminelle fictive dans l'univers de **GTA RolePlay**. Elle permet de suivre les transactions, gérer les comptes, et administrer les membres de l'organisation "Purgatory".

## ✨ Fonctionnalités

- 🔐 **Authentification Discord** - Connexion sécurisée via OAuth2
- 👥 **Gestion des rôles** - Système de permissions hiérarchique (GUEST → OWNER)
- 📊 **Dashboard** - Vue d'ensemble

## 🏗️ Architecture

```
purgacompta/
├── 📁 apps/
│   ├── 📁 frontend/          # 🌐 Application Next.js
│   │   ├── src/
│   │   │   ├── components/   # Composants React
│   │   │   ├── pages/        # Pages (Page Router)
│   │   │   ├── providers/    # Context Providers
│   │   │   ├── lib/          # Utilitaires
│   │   │   └── styles/       # Thème MUI
│   │   └── ...
│   │
│   └── 📁 backend/           # ⚡ Serveur GraphQL
│       ├── src/
│       │   ├── graphql/      # Schema & Resolvers
│       │   └── lib/          # Prisma client
│       └── prisma/           # Schema & migrations
│
├── 📁 packages/              # 📦 Packages partagés (futur)
├── pnpm-workspace.yaml
└── turbo.json
```

## 🚀 Démarrage Rapide

### Prérequis

- 📦 Node.js 18+
- 📦 pnpm 8+
- 🎮 Une application Discord (pour OAuth)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/purgacompta.git
cd purgacompta

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env

# 4. Configurer les variables d'environnement
# Éditer les fichiers .env avec vos clés Discord

# 5. Initialiser la base de données
pnpm db:generate
pnpm db:push

# 6. Lancer en développement
pnpm dev
```

### 🎮 Configuration Discord

1. Aller sur le [Discord Developer Portal](https://discord.com/developers/applications)
2. Créer une nouvelle application
3. Dans OAuth2 → General :
   - Ajouter le redirect URI: `http://localhost:3000/api/auth/callback/discord`
4. Copier le **Client ID** et **Client Secret** dans `apps/frontend/.env`

## 📜 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | 🚀 Lance frontend + backend en dev |
| `pnpm dev:frontend` | 🌐 Lance uniquement le frontend |
| `pnpm dev:backend` | ⚡ Lance uniquement le backend |
| `pnpm build` | 🏗️ Build de production |
| `pnpm studio` | 🗄️ Ouvre Prisma Studio |
| `pnpm db:migrate` | 📊 Applique les migrations |
| `pnpm db:generate` | ⚙️ Génère le client Prisma |
| `pnpm db:push` | 📤 Push le schéma vers la DB |

## 🛠️ Technologies

### Frontend
- ⚛️ **Next.js 14** - Framework React avec Page Router
- ⚡ **Turbopack** - Bundler ultra-rapide
- 🎨 **Material UI v5** - Composants UI avec thème sombre
- 🔄 **TanStack Query** - Gestion du cache serveur
- 🚀 **Apollo Client** - Client GraphQL
- 🔐 **NextAuth.js** - Authentification

### Backend
- 🚀 **Apollo Server 4** - Serveur GraphQL
- 🗄️ **Prisma** - ORM TypeScript
- 💾 **SQLite** - Base de données


## 🎨 Thème

L'application utilise un thème sombre personnalisé avec une palette rouge foncé inspirée de l'univers criminel :

- **Primaire** : `#b71c1c` (Rouge foncé)
- **Secondaire** : `#c62828` (Rouge secondaire)
- **Background** : `#181212` (Noir profond teinté rouge)

## 📁 Structure des Composants

```typescript
// Convention de structure
src/
├── components/
│   ├── layout/        # Composants de layout (Sidebar, MainLayout)
│   ├── common/        # Composants réutilisables
│   └── [feature]/     # Composants par fonctionnalité
├── pages/
│   ├── api/           # API routes (NextAuth)
│   ├── auth/          # Pages d'authentification
│   └── [feature]/     # Pages par fonctionnalité
└── providers/         # Context providers (UserProvider)
```

## 🔒 Sécurité

- ✅ Authentification OAuth2 avec Discord
- ✅ Sessions JWT sécurisées
- ✅ Validation des permissions côté serveur
- ✅ Variables d'environnement pour les secrets

## 📝 Licence

MIT © 2026 ShadCanard

---

<p align="center">
  <strong>🔥 Fait avec passion pour GTA RP 🔥</strong>
</p>
