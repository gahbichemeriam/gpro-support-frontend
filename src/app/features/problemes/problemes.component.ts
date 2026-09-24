import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { RoleService } from '../../core/services/role.service';
import { ProjetErp, ModuleErp, Probleme, Priorite } from '../../core/models';
import { ProblemeDialogComponent } from '../../shared/components/dialogs/probleme-dialog/probleme-dialog.component';

@Component({
  selector: 'app-problemes',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatTableModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDialogModule
  ],
  templateUrl: './problemes.component.html',
  styleUrl: './problemes.component.scss'
})
export class ProblemesComponent implements OnInit {

  projets: ProjetErp[] = [];
  modules: ModuleErp[] = [];
  problemes: Probleme[] = [];
  projetSelectionne: ProjetErp | null = null;
  moduleSelectionne: ModuleErp | null = null;
  termeRecherche = '';
  loading = false;
  columns = ['codeErreur', 'titre', 'priorite', 'module', 'actions'];

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    public role: RoleService
  ) {}

  ngOnInit() {
    this.api.getProjets().subscribe(p => this.projets = p);
    this.chargerTousLesProblemes();
  }

  chargerTousLesProblemes() {
    this.loading = true;
    this.api.getProblemes().subscribe({
      next: p => { this.problemes = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  selectionnerProjet(projet: ProjetErp) {
    this.projetSelectionne = projet;
    this.moduleSelectionne = null;
    this.modules = [];
    this.loading = true;
    this.api.getModules(projet.id).subscribe({
      next: m => { this.modules = m; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getProblemes().subscribe(p => {
      this.problemes = p.filter(pb => pb.projetId === projet.id);
    });
  }

  selectionnerModule(module: ModuleErp) {
    this.moduleSelectionne = module;
    this.loading = true;
    this.api.getProblemes(module.id).subscribe({
      next: p => { this.problemes = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  rechercher() {
    if (!this.termeRecherche.trim()) { this.chargerTousLesProblemes(); return; }
    this.loading = true;
    this.api.getProblemes(undefined, this.termeRecherche).subscribe({
      next: p => { this.problemes = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  reinitialiserFiltres() {
    this.projetSelectionne = null;
    this.moduleSelectionne = null;
    this.modules = [];
    this.termeRecherche = '';
    this.chargerTousLesProblemes();
  }

  openDialog(p?: Probleme) {
    // Charger tous les modules disponibles pour le dialog
    this.api.getModules().subscribe(modules => {
      const ref = this.dialog.open(ProblemeDialogComponent, {
        width: '520px',
        data: {
          probleme: p,
          modules,
          moduleIdPreselect: this.moduleSelectionne?.id
        }
      });

      ref.afterClosed().subscribe(result => {
        if (!result) return;
        const obs = p
          ? this.api.updateProbleme(p.id, result)
          : this.api.createProbleme(result);

        obs.subscribe({
          next: () => {
            this.snack.open(p ? 'Problème mis à jour ✅' : 'Problème créé ✅', '', { duration: 3000 });
            if (this.moduleSelectionne) this.selectionnerModule(this.moduleSelectionne);
            else this.chargerTousLesProblemes();
          },
          error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
        });
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce problème ?')) return;
    this.api.deleteProbleme(id).subscribe({
      next: () => { this.snack.open('Problème supprimé', '', { duration: 3000 }); this.chargerTousLesProblemes(); }
    });
  }

  getPrioriteBadge(p: Priorite): string { return `badge badge-${p}`; }
}
