import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { ProjetErp, VersionErp, Client, ClientRequest } from '../../core/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {

  projets: ProjetErp[] = [];
  versions: VersionErp[] = [];
  versionsFiltered: VersionErp[] = [];
  clients: Client[] = [];
  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;

  form: FormGroup;
  columns = ['nom', 'email', 'projet', 'versionActive', 'actions'];

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({
      nom:            ['', [Validators.required, Validators.maxLength(150)]],
      email:          ['', Validators.email],
      projetId:       [null, Validators.required],
      versionActiveId:[null, Validators.required]
    });

    // Quand projetId change → recharger les versions filtrées
    this.form.get('projetId')?.valueChanges.subscribe(projetId => {
      if (projetId) {
        this.versionsFiltered = this.versions.filter(v => v.projetId === projetId);
        this.form.get('versionActiveId')?.reset();
      }
    });
  }

  ngOnInit() {
    this.api.getProjets().subscribe(p => this.projets = p);
    this.api.getVersions().subscribe(v => this.versions = v);
    this.chargerClients();
  }

  chargerClients() {
    this.loading = true;
    this.api.getClients().subscribe({
      next: c => { this.clients = c; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm(c?: Client) {
    this.showForm = true;
    if (c) {
      this.editMode = true; this.editId = c.id;
      this.versionsFiltered = this.versions.filter(v => v.projetId === c.projetId);
      this.form.patchValue({ nom: c.nom, email: c.email, projetId: c.projetId, versionActiveId: c.versionActiveId });
    } else {
      this.editMode = false; this.editId = null;
      this.versionsFiltered = [];
      this.form.reset();
    }
  }

  cancel() { this.showForm = false; this.form.reset(); }

  save() {
    if (this.form.invalid) return;
    const req: ClientRequest = this.form.value;

    const obs = this.editMode && this.editId
      ? this.api.updateClient(this.editId, req)
      : this.api.createClient(req);

    obs.subscribe({
      next: () => {
        this.snack.open(this.editMode ? 'Client mis à jour ✅' : 'Client créé ✅', '', { duration: 3000 });
        this.cancel();
        this.chargerClients();
      },
      error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce client ?')) return;
    this.api.deleteClient(id).subscribe({
      next: () => { this.snack.open('Client supprimé', '', { duration: 3000 }); this.chargerClients(); }
    });
  }
}
