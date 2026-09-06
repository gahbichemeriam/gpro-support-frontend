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
import { ModuleErp } from '../../core/models';
import { ModuleDialogComponent } from '../../shared/components/dialogs/module-dialog/module-dialog.component';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})
export class ModulesComponent implements OnInit {
  modules: ModuleErp[] = [];
  loading = false;
  columns = ['nom', 'description', 'projet', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar, public role: RoleService) {}

  ngOnInit() { this.api.getProjets().subscribe(); this.charger(); }

  charger() {
    this.loading = true;
    this.api.getModules().subscribe({ next: m => { this.modules = m; this.loading = false; }, error: () => this.loading = false });
  }

  openDialog(m?: ModuleErp) {
    this.api.getProjets().subscribe(projets => {
      const ref = this.dialog.open(ModuleDialogComponent, { width: '500px', data: { module: m, projets } });
      ref.afterClosed().subscribe(result => {
        if (!result) return;
        const obs = m ? this.api.updateModule(m.id, result) : this.api.createModule(result);
        obs.subscribe({
          next: () => { this.snack.open(m ? 'Module mis à jour ✅' : 'Module créé ✅', '', { duration: 3000 }); this.charger(); },
          error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
        });
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce module ?')) return;
    this.api.deleteModule(id).subscribe({ next: () => { this.snack.open('Supprimé', '', { duration: 3000 }); this.charger(); } });
  }
}
