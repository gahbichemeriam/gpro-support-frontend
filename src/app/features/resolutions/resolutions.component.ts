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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../core/services/api.service';
import { Probleme, Resolution, TypeResolution, ResolutionRequest } from '../../core/models';

@Component({
  selector: 'app-resolutions',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule,
    MatCardModule, MatChipsModule, MatTooltipModule, MatSlideToggleModule
  ],
  templateUrl: './resolutions.component.html',
  styleUrl: './resolutions.component.scss'
})
export class ResolutionsComponent implements OnInit {

  problemes: Probleme[] = [];
  resolutions: Resolution[] = [];
  problemeSelectionne: Probleme | null = null;
  recherche = '';

  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;
  copiedId: number | null = null;

  form: FormGroup;
  types: TypeResolution[] = ['SQL', 'PARAMETRAGE', 'PATCH_CODE', 'PROCEDURE'];

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({
      problemeId:        [null, Validators.required],
      typeResolution:    ['SQL', Validators.required],
      descriptionEtapes: [''],
      validationQa:      [false]
    });
  }

  ngOnInit() {
    this.api.getProblemes().subscribe(p => this.problemes = p);
  }

  rechercherProblemes() {
    if (!this.recherche.trim()) {
      this.api.getProblemes().subscribe(p => this.problemes = p);
      return;
    }
    this.api.getProblemes(undefined, this.recherche).subscribe(p => this.problemes = p);
  }

  selectionnerProbleme(p: Probleme) {
    this.problemeSelectionne = p;
    this.loading = true;
    this.api.getResolutions(p.id).subscribe({
      next: r => { this.resolutions = r; this.loading = false; },
      error: () => this.loading = false
    });
    this.form.patchValue({ problemeId: p.id });
  }

  openForm(r?: Resolution) {
    this.showForm = true;
    if (r) {
      this.editMode = true; this.editId = r.id;
      this.form.patchValue({
        problemeId: r.problemeId,
        typeResolution: r.typeResolution,
        descriptionEtapes: r.descriptionEtapes,
        validationQa: r.validationQa
      });
    } else {
      this.editMode = false; this.editId = null;
      this.form.patchValue({ typeResolution: 'SQL', descriptionEtapes: '', validationQa: false,
                             problemeId: this.problemeSelectionne?.id ?? null });
    }
  }

  cancel() { this.showForm = false; }

  save() {
    if (this.form.invalid) return;
    const req: ResolutionRequest = this.form.value;
    const obs = this.editMode && this.editId
      ? this.api.updateResolution(this.editId, req)
      : this.api.createResolution(req);

    obs.subscribe({
      next: () => {
        this.snack.open('Résolution enregistrée ✅', '', { duration: 3000 });
        this.cancel();
        if (this.problemeSelectionne) this.selectionnerProbleme(this.problemeSelectionne);
      },
      error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
    });
  }

  valider(r: Resolution) {
    this.api.validerResolution(r.id).subscribe({
      next: () => {
        this.snack.open('Résolution validée par QA ✅', '', { duration: 3000 });
        if (this.problemeSelectionne) this.selectionnerProbleme(this.problemeSelectionne);
      }
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette résolution ?')) return;
    this.api.deleteResolution(id).subscribe({
      next: () => {
        this.snack.open('Résolution supprimée', '', { duration: 3000 });
        if (this.problemeSelectionne) this.selectionnerProbleme(this.problemeSelectionne);
      }
    });
  }

  copierScript(r: Resolution) {
    navigator.clipboard.writeText(r.descriptionEtapes || '');
    this.copiedId = r.id;
    setTimeout(() => this.copiedId = null, 2000);
    this.snack.open('Script copié !', '', { duration: 2000 });
  }

  getTypeIcon(t: TypeResolution): string {
    const icons: Record<TypeResolution, string> = {
      SQL: 'storage', PARAMETRAGE: 'settings', PATCH_CODE: 'code', PROCEDURE: 'list_alt'
    };
    return icons[t];
  }

  getTypeColor(t: TypeResolution): string {
    const colors: Record<TypeResolution, string> = {
      SQL: '#26c6da', PARAMETRAGE: '#ffa726', PATCH_CODE: '#7986cb', PROCEDURE: '#66bb6a'
    };
    return colors[t];
  }
}
