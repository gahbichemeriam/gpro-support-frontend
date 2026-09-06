import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjetErp } from '../../../../core/models';

export interface ProjetDialogData {
  projet?: ProjetErp; // si présent = mode édition, sinon = création
}

@Component({
  selector: 'app-projet-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>business</mat-icon>
      {{ data.projet ? 'Modifier le projet' : 'Nouveau projet ERP' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nom du projet</mat-label>
          <input matInput formControlName="nom" placeholder="GPRO Industry SaaS">
          <mat-error *ngIf="form.get('nom')?.hasError('required')">Obligatoire</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Code produit</mat-label>
          <input matInput formControlName="codeProduit" placeholder="GPRO-IND-001">
          <mat-error *ngIf="form.get('codeProduit')?.hasError('required')">Obligatoire</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid"
              (click)="confirmer()">
        {{ data.projet ? 'Mettre à jour' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; font-size: 18px; }
    .dialog-form { display: flex; flex-direction: column; gap: 4px; min-width: 420px; padding-top: 8px; }
    .full { width: 100%; }
  `]
})
export class ProjetDialogComponent {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProjetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetDialogData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom:         [data.projet?.nom ?? '',         [Validators.required, Validators.maxLength(150)]],
      codeProduit: [data.projet?.codeProduit ?? '', [Validators.required, Validators.maxLength(50)]],
      description: [data.projet?.description ?? '']
    });
  }

  confirmer(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
