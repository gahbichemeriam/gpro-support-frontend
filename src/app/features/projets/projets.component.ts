import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar style="background:var(--bg-sidebar);border-bottom:1px solid var(--border)">
      <button mat-icon-button routerLink="/dashboard"><mat-icon>arrow_back</mat-icon></button>
      <span style="font-weight:700;margin-left:8px">Projets ERP</span>
    </mat-toolbar>
    <div style="padding:32px">
      <p class="text-muted">Page en cours de développement...</p>
    </div>
  `
})
export class ProjetsComponent {}
