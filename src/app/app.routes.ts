import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'projets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projets/projets.component').then(m => m.ProjetsComponent)
  },
  {
    path: 'modules',
    canActivate: [authGuard],
    loadComponent: () => import('./features/modules/modules.component').then(m => m.ModulesComponent)
  },
  {
    path: 'problemes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/problemes/problemes.component').then(m => m.ProblemesComponent)
  },
  {
    path: 'resolutions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/resolutions/resolutions.component').then(m => m.ResolutionsComponent)
  },
  {
    path: 'versions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/versions/versions.component').then(m => m.VersionsComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
