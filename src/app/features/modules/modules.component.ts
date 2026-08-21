import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { RoleService } from '../../core/services/role.service';
import { ProjetErp, ModuleErp } from '../../core/models';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})
export class ModulesComponent implements OnInit {

  projets: ProjetErp[] = [];
  modules: ModuleErp[] = [];
  loading = false;
  showForm = false;
  editMode = false;
  editId: number | null = null;

  form: FormGroup;
  columns = ['nom', 'description', 'projet', 'actions'];

  constructor(private api: ApiService, private fb: FormBuilder,
              private snack: MatSnackBar, public role: RoleService) {
    this.form = this.fb.group({
      projetId:    [null, Validators.required],
      nom:         ['', [Validators.required, Validators.maxLength(150)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.api.getProjets().subscribe(p => this.projets = p);
    this.charger();
  }

  charger() {
    this.loading = true;
    this.api.getModules().subscribe({
      next: m => { this.modules = m; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm(m?: ModuleErp) {
    this.showForm = true;
    if (m) { this.editMode = true; this.editId = m.id; this.form.patchValue(m); }
    else { this.editMode = false; this.editId = null; this.form.reset(); }
  }

  cancel() { this.showForm = false; this.form.reset(); }

  save() {
    if (this.form.invalid) return;
    const obs = this.editMode && this.editId
      ? this.api.updateModule(this.editId, this.form.value)
      : this.api.createModule(this.form.value);
    obs.subscribe({
      next: () => { this.snack.open('Module enregistré ✅', '', { duration: 3000 }); this.cancel(); this.charger(); },
      error: err => this.snack.open(err.error?.message || 'Erreur', '', { duration: 4000 })
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce module ?')) return;
    this.api.deleteModule(id).subscribe({
      next: () => { this.snack.open('Module supprimé', '', { duration: 3000 }); this.charger(); }
    });
  }
}
