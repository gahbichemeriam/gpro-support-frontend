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
import { Client } from '../../core/models';
import { ClientDialogComponent } from '../../shared/components/dialogs/client-dialog/client-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  columns = ['nom', 'email', 'projet', 'versionActive', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar, public role: RoleService) {}

  ngOnInit() { this.chargerClients(); }

  chargerClients() {
    this.loading = true;
    this.api.getClients().subscribe({ next: c => { this.clients = c; this.loading = false; }, error: () => this.loading = false });
  }

  openDialog(c?: Client) {
    forkJoin({ projets: this.api.getProjets(), versions: this.api.getVersions() }).subscribe(({ projets, versions }) => {
      const ref = this.dialog.open(ClientDialogComponent, { width: '500px', data: { client: c, projets, versions } });
      ref.afterClosed().subscribe(result => {
        if (!result) return;
        const obs = c ? this.api.updateClient(c.id, result) : this.api.createClient(result);
        obs.subscribe({
          next: () => { this.snack.open(c ? 'Client mis à jour ✅' : 'Client créé ✅', '', { duration: 3000 }); this.chargerClients(); },
          error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
        });
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce client ?')) return;
    this.api.deleteClient(id).subscribe({ next: () => { this.snack.open('Supprimé', '', { duration: 3000 }); this.chargerClients(); } });
  }
}
