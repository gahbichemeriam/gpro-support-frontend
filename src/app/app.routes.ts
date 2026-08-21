import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Page de login (sans layout)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Application principale avec sidebar layout
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      // Redirection par défaut vers problèmes
      { path: '', redirectTo: 'problemes', pathMatch: 'full' },
      {
        path: 'projets',
        loadComponent: () => import('./features/projets/projets.component').then(m => m.ProjetsComponent)
      },
      {
        path: 'modules',
        loadComponent: () => import('./features/modules/modules.component').then(m => m.ModulesComponent)
      },
      {
        path: 'problemes',
        loadComponent: () => import('./features/problemes/problemes.component').then(m => m.ProblemesComponent)
      },
      {
        path: 'resolutions',
        loadComponent: () => import('./features/resolutions/resolutions.component').then(m => m.ResolutionsComponent)
      },
      {
        path: 'versions',
        loadComponent: () => import('./features/versions/versions.component').then(m => m.VersionsComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./features/rapports/rapports.component').then(m => m.RapportsComponent)
      }
    ]
  },

  // Toute route inconnue → login
  { path: '**', redirectTo: 'login' }
];
