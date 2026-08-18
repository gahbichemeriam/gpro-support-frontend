# GPRO Support — Frontend

> Module d'aide au support ERP — Angular 17 / Angular Material

## 📋 Description

Interface web Angular pour GPRO Support. Permet aux agents support de naviguer à travers un parcours guidé de diagnostic, consulter les résolutions et accéder aux rapports d'activité.

## 🏗️ Stack Technique

| Technologie | Version | Rôle |
|---|---|---|
| Angular | 17.3 | Framework frontend |
| Angular Material | 17.3 | Composants UI |
| RxJS | 7.x | Gestion des flux de données |
| TypeScript | 5.x | Langage |

## 🚀 Lancement

### Prérequis
- Node.js 20+
- Angular CLI 17+
- Backend GPRO Support démarré sur le port 8081

### Démarrage
```bash
npm install
ng serve
```

L'application démarre sur **http://localhost:4200**

## 📱 Pages disponibles

| Page | URL | Description |
|---|---|---|
| Login | /login | Authentification JWT |
| Dashboard | /dashboard | Navigation principale |
| Projets ERP | /projets | CRUD des projets |
| Problèmes | /problemes | Parcours guidé + recherche |
| Résolutions | /resolutions | Scripts SQL + validation QA |
| Versions | /versions | Gestion des versions ERP |
| Clients | /clients | Parc clients |
| Rapports | /rapports | KPI + Top pannes + Export |

## 🎨 Design

- Thème sombre (mode nuit pour travail en production 24/7)
- Police Roboto
- Palette Indigo/Cyan

## 🗂️ Architecture

```
src/app/
├── core/
│   ├── models/       → Interfaces TypeScript
│   ├── services/     → AuthService, ApiService
│   ├── guards/       → authGuard
│   └── interceptors/ → jwtInterceptor
└── features/
    ├── auth/         → Page login
    ├── dashboard/    → Tableau de bord
    ├── projets/      → CRUD projets
    ├── problemes/    → Parcours guidé
    ├── resolutions/  → Scripts + QA
    ├── versions/     → CRUD versions
    ├── clients/      → Parc clients
    └── rapports/     → KPI + Stats
```

## 👩‍💻 Auteur

**Meriam Gahbiche** — Stage d'été 2026  
Département Support — GPRO
