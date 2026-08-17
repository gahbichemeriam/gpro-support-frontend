import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTableModule, MatTooltipModule
  ],
  templateUrl: './rapports.component.html',
  styleUrl: './rapports.component.scss'
})
export class RapportsComponent implements OnInit {

  loading = false;
  kpi: any = null;
  topPannes: any[] = [];
  parModule: any[] = [];
  parPriorite: any[] = [];

  colonnesTop = ['rang', 'codeErreur', 'titre', 'moduleNom', 'priorite', 'nbResolutions', 'qaValidee'];

  constructor(private api: ApiService) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.loading = true;
    forkJoin({
      kpi:         this.api.getKpi(),
      topPannes:   this.api.getTopPannes(10),
      parModule:   this.api.getStatsParModule(),
      parPriorite: this.api.getStatsParPriorite()
    }).subscribe({
      next: data => {
        this.kpi         = data.kpi;
        this.topPannes   = data.topPannes;
        this.parModule   = data.parModule;
        this.parPriorite = data.parPriorite;
        this.loading     = false;
      },
      error: () => this.loading = false
    });
  }

  /**
   * Export CSV — génère un fichier CSV téléchargeable sans librairie externe.
   * Le navigateur crée un lien invisible, le clique automatiquement, puis le supprime.
   */
  exportCsv() {
    const entetes = ['Code Erreur', 'Titre', 'Module', 'Priorité', 'Nb Résolutions', 'QA Validée'];
    const lignes = this.topPannes.map(p => [
      p.codeErreur,
      `"${p.titre}"`,
      p.moduleNom,
      p.priorite,
      p.nbResolutions,
      p.qaValidee ? 'Oui' : 'Non'
    ].join(';'));

    const contenu = [entetes.join(';'), ...lignes].join('\n');
    const blob = new Blob(['\uFEFF' + contenu], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `gpro-top-pannes-${new Date().toISOString().slice(0,10)}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export JSON — pour partage avec l'équipe R&D.
   */
  exportJson() {
    const data = { kpi: this.kpi, topPannes: this.topPannes, parModule: this.parModule, parPriorite: this.parPriorite };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `gpro-rapport-${new Date().toISOString().slice(0,10)}.json`;
    lien.click();
    URL.revokeObjectURL(url);
  }

  getPrioriteCouleur(p: string): string {
    const map: Record<string, string> = {
      CRITIQUE: '#f06292', HAUTE: '#ef5350', MOYENNE: '#ffa726', BASSE: '#66bb6a'
    };
    return map[p] ?? '#9fa8da';
  }

  getBarreWidth(count: number): string {
    const max = Math.max(...this.parModule.map((m: any) => m.count), 1);
    return `${Math.round(count / max * 100)}%`;
  }
}
