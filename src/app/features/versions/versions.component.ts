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
import { ProjetErp, VersionErp, StatutVersion } from '../../core/models';
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
    this.api.getVersions(projetId).subscribe({
      next: v => { this.versions = v; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filtrerParProjet(p: ProjetErp) { this.projetSelectionne = p; this.chargerVersions(p.id); }
  toutAfficher() { this.projetSelectionne = null; this.chargerVersions(); }

  openDialog(v?: VersionErp) {
    const ref = this.dialog.open(VersionDialogComponent, {
      width: '500px',
      data: { version: v, projets: this.projets }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (!result.dateRelease) delete result.dateRelease;
      const obs = v ? this.api.updateVersion(v.id, result) : this.api.createVersion(result);
      obs.subscribe({
        next: () => {
          this.snack.open(v ? 'Version mise à jour ✅' : 'Version créée ✅', '', { duration: 3000 });
          this.chargerVersions(this.projetSelectionne?.id);
        },
        error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette version ?')) return;
    this.api.deleteVersion(id).subscribe({
      next: () => { this.snack.open('Version supprimée', '', { duration: 3000 }); this.chargerVersions(this.projetSelectionne?.id); }
    });
  }

  getStatutClass(s: StatutVersion): string { return `statut-badge statut-${s}`; }
}
