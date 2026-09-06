import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModuleErp, ProjetErp } from '../../../../core/models';

export interface ModuleDialogData {
  module?: ModuleErp;
  projets: ProjetErp[];
}

@Component({
  selector: 'app-module-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>extension</mat-icon> {{ data.module ? 'Modifier le module' : 'Nouveau module' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Projet ERP</mat-label>
          <mat-select formControlName="projetId">
            <mat-option *ngFor="let p of data.projets" [value]="p.id">{{ p.nom }}</mat-option>
          </mat-select>
          <mat-error>Obligatoire</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nom du module</mat-label>
          <input matInput formControlName="nom" placeholder="Production">
          <mat-error>Obligatoire</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="confirmer()">
        {{ data.module ? 'Mettre à jour' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`h2{display:flex;align-items:center;gap:8px} .dialog-form{display:flex;flex-direction:column;gap:4px;min-width:420px;padding-top:8px} .full{width:100%}`]
})
export class ModuleDialogComponent {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModuleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ModuleDialogData, private fb: FormBuilder) {
    this.form = this.fb.group({
      projetId:    [data.module?.projetId ?? null, Validators.required],
      nom:         [data.module?.nom ?? '',        [Validators.required, Validators.maxLength(150)]],
      description: [data.module?.description ?? '']
    });
  }
  confirmer() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
