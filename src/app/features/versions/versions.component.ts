import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { RoleService } from '../../core/services/role.service';
import { ProjetErp, VersionErp, StatutVersion, VersionErpRequest } from '../../core/models';
import { VersionDialogComponent } from '../../shared/components/dialogs/version-dialog/version-dialog.component';

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss'
})
export class VersionsComponent implements OnInit {
  projets: ProjetErp[] = [];
  versions: VersionErp[] = [];
  projetSelectionne: ProjetErp | null = null;
  loading = false;
  columns = ['codeVersion', 'statut', 'dateRelease', 'projet', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar, public role: RoleService) {}

  ngOnInit() {
    this.api.getProjets().subscribe(p => this.projets = p);
    this.chargerVersions();
  }

  chargerVersions(projetId?: number) {
    this.loading = true;
    this.api.getVersions(projetId).subscribe({ next: v => { this.versions = v; this.loading = false; }, error: () => this.loading = false });
  }

  filtrerParProjet(p: ProjetErp) { this.projetSelectionne = p; this.chargerVersions(p.id); }
  toutAfficher() { this.projetSelectionne = null; this.chargerVersions(); }

  openDialog(v?: VersionErp) {
    const ref = this.dialog.open(VersionDialogComponent, { width: '500px', data: { version: v, projets: this.projets } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (!result.dateRelease) delete result.dateRelease;
      const obs = v ? this.api.updateVersion(v.id, result) : this.api.createVersion(result);
      obs.subscribe({
        next: () => { this.snack.open(v ? 'Version mise à jour ✅' : 'Version créée ✅', '', { duration: 3000 }); this.chargerVersions(this.projetSelectionne?.id); },
        error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette version ?')) return;
    this.api.deleteVersion(id).subscribe({ next: () => { this.snack.open('Supprimé', '', { duration: 3000 }); this.chargerVersions(this.projetSelectionne?.id); } });
  }

  getStatutClass(s: StatutVersion): string { return `statut-badge statut-${s}`; }
}

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss'
})
export class VersionsComponent implements OnInit {

  projets: ProjetErp[] = [];
  versions: VersionErp[] = [];
  projetSelectionne: ProjetErp | null = null;
  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;

  form: FormGroup;
  columns = ['codeVersion', 'statut', 'dateRelease', 'projet', 'actions'];
  statuts: StatutVersion[] = ['DEVELOPPEMENT', 'STAGING', 'PRODUCTION', 'OBSOLETE'];

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({
      projetId:    [null, Validators.required],
      codeVersion: ['', [Validators.required, Validators.maxLength(30)]],
      statut:      ['DEVELOPPEMENT', Validators.required],
      dateRelease: ['']
    });
  }

  ngOnInit() {
    this.api.getProjets().subscribe(p => this.projets = p);
    this.chargerVersions();
  }

  chargerVersions(projetId?: number) {
    this.loading = true;
    this.api.getVersions(projetId).subscribe({
      next: v => { this.versions = v; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filtrerParProjet(projet: ProjetErp) {
    this.projetSelectionne = projet;
    this.chargerVersions(projet.id);
  }

  toutAfficher() {
    this.projetSelectionne = null;
    this.chargerVersions();
  }

  openForm(v?: VersionErp) {
    this.showForm = true;
    if (v) {
      this.editMode = true; this.editId = v.id;
      this.form.patchValue({
        projetId: v.projetId,
        codeVersion: v.codeVersion,
        statut: v.statut,
        dateRelease: v.dateRelease ?? ''
      });
    } else {
      this.editMode = false; this.editId = null;
      this.form.reset({ statut: 'DEVELOPPEMENT', projetId: this.projetSelectionne?.id ?? null });
    }
  }

  cancel() { this.showForm = false; this.form.reset(); }

  save() {
    if (this.form.invalid) return;
    const req: VersionErpRequest = this.form.value;
    if (!req.dateRelease) delete req.dateRelease;

    const obs = this.editMode && this.editId
      ? this.api.updateVersion(this.editId, req)
      : this.api.createVersion(req);

    obs.subscribe({
      next: () => {
        this.snack.open(this.editMode ? 'Version mise à jour ✅' : 'Version créée ✅', '', { duration: 3000 });
        this.cancel();
        this.chargerVersions(this.projetSelectionne?.id);
      },
      error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette version ?')) return;
    this.api.deleteVersion(id).subscribe({
      next: () => { this.snack.open('Version supprimée', '', { duration: 3000 }); this.chargerVersions(this.projetSelectionne?.id); },
      error: () => this.snack.open('Erreur', '', { duration: 3000 })
    });
  }

  getStatutClass(s: StatutVersion): string { return `statut-badge statut-${s}`; }
}
