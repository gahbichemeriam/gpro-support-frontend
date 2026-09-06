import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VersionErp, ProjetErp } from '../../../../core/models';

export interface VersionDialogData { version?: VersionErp; projets: ProjetErp[]; }

@Component({
  selector: 'app-version-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>new_releases</mat-icon> {{ data.version ? 'Modifier la version' : 'Nouvelle version' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Projet ERP</mat-label>
          <mat-select formControlName="projetId">
            <mat-option *ngFor="let p of data.projets" [value]="p.id">{{ p.nom }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Code version</mat-label>
          <input matInput formControlName="codeVersion" placeholder="1.8.2">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut">
            <mat-option value="DEVELOPPEMENT">🔵 DÉVELOPPEMENT</mat-option>
            <mat-option value="STAGING">🟡 STAGING</mat-option>
            <mat-option value="PRODUCTION">🟢 PRODUCTION</mat-option>
            <mat-option value="OBSOLETE">🔴 OBSOLÈTE</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Date de release</mat-label>
          <input matInput formControlName="dateRelease" type="date">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="confirmer()">
        {{ data.version ? 'Mettre à jour' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`h2{display:flex;align-items:center;gap:8px} .dialog-form{display:flex;flex-direction:column;gap:4px;min-width:420px;padding-top:8px} .full{width:100%}`]
})
export class VersionDialogComponent {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<VersionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: VersionDialogData, private fb: FormBuilder) {
    this.form = this.fb.group({
      projetId:    [data.version?.projetId ?? null,       Validators.required],
      codeVersion: [data.version?.codeVersion ?? '',      [Validators.required, Validators.maxLength(30)]],
      statut:      [data.version?.statut ?? 'DEVELOPPEMENT', Validators.required],
      dateRelease: [data.version?.dateRelease ?? '']
    });
  }
  confirmer() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
