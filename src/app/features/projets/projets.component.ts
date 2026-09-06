import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { RoleService } from '../../core/services/role.service';
import { ProjetErp } from '../../core/models';
import { ProjetDialogComponent } from '../../shared/components/dialogs/projet-dialog/projet-dialog.component';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    MatTableModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDialogModule
  ],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.scss'
})
export class ProjetsComponent implements OnInit {

  projets: ProjetErp[] = [];
  loading = false;
  columns = ['nom', 'codeProduit', 'description', 'actions'];

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    public role: RoleService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getProjets().subscribe({
      next: data => { this.projets = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openDialog(projet?: ProjetErp) {
    const ref = this.dialog.open(ProjetDialogComponent, {
      width: '500px',
      data: { projet }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const obs = projet
        ? this.api.updateProjet(projet.id, result)
        : this.api.createProjet(result);

      obs.subscribe({
        next: () => {
          this.snack.open(projet ? 'Projet mis à jour ✅' : 'Projet créé ✅', '', { duration: 3000 });
          this.load();
        },
        error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce projet ? Tous ses modules et données seront supprimés.')) return;
    this.api.deleteProjet(id).subscribe({
      next: () => { this.snack.open('Projet supprimé', '', { duration: 3000 }); this.load(); },
      error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 })
    });
  }
}
