import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
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

  cards = [
    { label: 'Projets ERP',  icon: 'business',     route: '/projets',     color: '#7986cb', desc: 'Gérer les projets ERP' },
    { label: 'Problèmes',    icon: 'bug_report',   route: '/problemes',   color: '#ef5350', desc: 'Base de connaissances' },
    { label: 'Résolutions',  icon: 'fact_check',   route: '/resolutions', color: '#ab47bc', desc: 'Scripts et procédures' },
    { label: 'Versions',     icon: 'new_releases', route: '/versions',    color: '#26c6da', desc: 'Gestion des versions' },
    { label: 'Clients',      icon: 'people',       route: '/clients',     color: '#66bb6a', desc: 'Parc clients' },
  ];

  constructor(private auth: AuthService) {}
  ngOnInit() { this.user = this.auth.getUser(); }
  logout() { this.auth.logout(); }
}
