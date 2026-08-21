import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LoginResponse } from '../../../core/models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatIconModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  user: LoginResponse | null = null;
  sidebarOpen = true;

  allNavItems = [
    { label: 'Projets ERP',  icon: 'business',     route: '/app/projets',     roles: ['ADMIN'] },
    { label: 'Modules',      icon: 'extension',     route: '/app/modules',     roles: ['ADMIN','RD'] },
    { label: 'Problèmes',    icon: 'bug_report',   route: '/app/problemes',   roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Résolutions',  icon: 'fact_check',   route: '/app/resolutions', roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Versions',     icon: 'new_releases', route: '/app/versions',    roles: ['ADMIN','RD'] },
    { label: 'Clients',      icon: 'people',       route: '/app/clients',     roles: ['ADMIN','RD','AGENT_SUPPORT'] },
    { label: 'Rapports',     icon: 'analytics',    route: '/app/rapports',    roles: ['ADMIN','RD'] },
  ];

  navItems: any[] = [];

  constructor(
    private auth: AuthService,
    public role: RoleService,
    public theme: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    const userRole = this.user?.role ?? '';
    this.navItems = this.allNavItems.filter(item => item.roles.includes(userRole));
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  logout() { this.auth.logout(); }
}
