import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { RoleService } from '../../core/services/role.service';
import { LoginResponse } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  user: LoginResponse | null = null;

  // Toutes les cartes avec le rôle minimum requis
  allCards = [
    { label: 'Projets ERP',  icon: 'business',     route: '/projets',     color: '#7986cb', desc: 'Gérer les projets ERP',  roles: ['ADMIN'] },
    { label: 'Problèmes',    icon: 'bug_report',   route: '/problemes',   color: '#ef5350', desc: 'Base de connaissances',  roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Résolutions',  icon: 'fact_check',   route: '/resolutions', color: '#ab47bc', desc: 'Scripts et procédures',  roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Versions',     icon: 'new_releases', route: '/versions',    color: '#26c6da', desc: 'Gestion des versions',   roles: ['ADMIN','RD'] },
    { label: 'Clients',      icon: 'people',       route: '/clients',     color: '#66bb6a', desc: 'Parc clients',           roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Rapports',     icon: 'analytics',    route: '/rapports',    color: '#ffa726', desc: 'KPI & Top pannes',       roles: ['ADMIN','RD'] },
  ];

  // Cartes filtrées selon le rôle de l'utilisateur connecté
  cards: any[] = [];

  constructor(private auth: AuthService, public role: RoleService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    const userRole = this.user?.role ?? '';
    this.cards = this.allCards.filter(c => c.roles.includes(userRole));
  }

  logout() { this.auth.logout(); }
}
