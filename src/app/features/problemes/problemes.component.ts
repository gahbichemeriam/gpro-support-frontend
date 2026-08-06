import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApiService } from '../../core/services/api.service';
import { ProjetErp, ModuleErp, Probleme, Priorite } from '../../core/models';

@Component({
  selector: 'app-problemes',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatChipsModule, MatExpansionModule
  ],
  templateUrl: './problemes.component.html',
  styleUrl: './problemes.component.scss'
})
export class ProblemesComponent implements OnInit {

  // Données des filtres en cascade
  projets: ProjetErp[] = [];
  modules: ModuleErp[] = [];
  problemes: Probleme[] = [];

  // Sélections actives
  projetSelectionne: ProjetErp | null = null;
  moduleSelectionne: ModuleErp | null = null;

  // Recherche
  termeRecherche = '';

  // État UI
  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;

  form: FormGroup;
  columns = ['codeErreur', 'titre', 'priorite', 'module', 'actions'];

  priorites: Priorite[] = ['BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE'];

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({
      moduleId:   [null, Validators.required],
      titre:      ['', [Validators.required, Validators.maxLength(255)]],
      codeErreur: ['', [Validators.required, Validators.maxLength(50)]],
      priorite:   ['MOYENNE', Validators.required]
    });
  }

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
    // Filtrer les problèmes par projet
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
    if (!this.termeRecherche.trim()) {
      this.chargerTousLesProblemes();
      return;
    }
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

  openForm(p?: Probleme) {
    this.showForm = true;
    if (p) {
      this.editMode = true; this.editId = p.id;
      this.form.patchValue({ moduleId: p.moduleId, titre: p.titre, codeErreur: p.codeErreur, priorite: p.priorite });
    } else {
      this.editMode = false; this.editId = null;
      this.form.reset({ priorite: 'MOYENNE', moduleId: this.moduleSelectionne?.id ?? null });
    }
  }

  cancel() { this.showForm = false; this.form.reset(); }

  save() {
    if (this.form.invalid) return;
    const req = this.form.value;
    const obs = this.editMode && this.editId
      ? this.api.updateProbleme(this.editId, req)
      : this.api.createProbleme(req);

    obs.subscribe({
      next: () => {
        this.snack.open(this.editMode ? 'Problème mis à jour ✅' : 'Problème créé ✅', '', { duration: 3000 });
        this.cancel();
        if (this.moduleSelectionne) this.selectionnerModule(this.moduleSelectionne);
        else this.chargerTousLesProblemes();
      },
      error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce problème ?')) return;
    this.api.deleteProbleme(id).subscribe({
      next: () => {
        this.snack.open('Problème supprimé', '', { duration: 3000 });
        this.chargerTousLesProblemes();
      }
    });
  }

  getPrioriteBadge(p: Priorite): string {
    return `badge badge-${p}`;
  }
}
