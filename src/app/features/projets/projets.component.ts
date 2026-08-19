import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { RoleService } from '../../core/services/role.service';
import { ProjetErp } from '../../core/models';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTableModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.scss'
})
export class ProjetsComponent implements OnInit {

  projets: ProjetErp[] = [];
  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;

  form: FormGroup;
  columns = ['nom', 'codeProduit', 'description', 'actions'];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    public role: RoleService
  ) {
    this.form = this.fb.group({
      nom:         ['', [Validators.required, Validators.maxLength(150)]],
      codeProduit: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['']
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getProjets().subscribe({
      next: data => { this.projets = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(projet?: ProjetErp) {
    this.showForm = true;
    if (projet) {
      this.editMode = true;
      this.editId = projet.id;
      this.form.patchValue(projet);
    } else {
      this.editMode = false;
      this.editId = null;
      this.form.reset();
    }
  }

  cancel() { this.showForm = false; this.form.reset(); }

  save() {
    if (this.form.invalid) return;
    const req = this.form.value;

    const obs = this.editMode && this.editId
      ? this.api.updateProjet(this.editId, req)
      : this.api.createProjet(req);

    obs.subscribe({
      next: () => {
        this.snack.open(this.editMode ? 'Projet mis à jour ✅' : 'Projet créé ✅', '', { duration: 3000 });
        this.cancel();
        this.load();
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Erreur', '', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce projet ? Tous ses modules et données associées seront supprimés.')) return;
    this.api.deleteProjet(id).subscribe({
      next: () => { this.snack.open('Projet supprimé', '', { duration: 3000 }); this.load(); },
      error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 })
    });
  }
}
