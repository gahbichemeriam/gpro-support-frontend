import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Service de gestion des rôles — utilisé dans les templates HTML
 * pour afficher/masquer les boutons selon le rôle connecté.
 *
 * Usage dans un template :
 *   <button *ngIf="role.isAdmin()">Supprimer</button>
 *   <button *ngIf="role.canEdit()">Modifier</button>
 */
@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(private auth: AuthService) {}

  private getRole(): string {
    return this.auth.getUser()?.role ?? '';
  }

  /** Administrateur — accès total */
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  /** Développeur — gestion technique (ex-RD) */
  isDeveloppeur(): boolean {
    return this.getRole() === 'DEVELOPPEUR';
  }

  /** Agent support — consultation uniquement */
  isAgent(): boolean {
    return this.getRole() === 'AGENT_SUPPORT';
  }

  /** ADMIN ou DEVELOPPEUR peuvent créer/modifier du contenu */
  canEdit(): boolean {
    return this.isAdmin() || this.isDeveloppeur();
  }

  /** Seul ADMIN peut gérer les projets et les clients */
  canManageProjects(): boolean {
    return this.isAdmin();
  }

  /** ADMIN et DEVELOPPEUR peuvent voir les rapports */
  canViewReports(): boolean {
    return this.isAdmin() || this.isDeveloppeur();
  }

  /** ADMIN et DEVELOPPEUR peuvent valider QA */
  canValidateQA(): boolean {
    return this.isAdmin() || this.isDeveloppeur();
  }
}
