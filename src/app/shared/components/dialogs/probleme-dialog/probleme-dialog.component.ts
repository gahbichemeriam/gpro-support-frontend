import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Probleme, ModuleErp, Priorite } from '../../../../core/models';

export interface ProblemeDialogData {
  probleme?: Probleme;
  modules: ModuleErp[];
  moduleIdPreselect?: number;
}

@Component({
  selector: 'app-probleme-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>bug_report</mat-icon> {{ data.probleme ? 'Modifier le problème' : 'Nouveau problème' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Module</mat-label>
          <mat-select formControlName="moduleId">
            <mat-option *ngFor="let m of data.modules" [value]="m.id">{{ m.nom }} — {{ m.projetNom }}</mat-option>
          </mat-select>
          <mat-error>Obligatoire</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Code erreur</mat-label>
          <input matInput formControlName="codeErreur" placeholder="ERR-PROD-201">
          <mat-error>Obligatoire</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Titre du problème</mat-label>
          <input matInput formControlName="titre">
          <mat-error>Obligatoire</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priorite">
            <mat-option value="BASSE">🟢 BASSE</mat-option>
            <mat-option value="MOYENNE">🟡 MOYENNE</mat-option>
            <mat-option value="HAUTE">🟠 HAUTE</mat-option>
            <mat-option value="CRITIQUE">🔴 CRITIQUE</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="confirmer()">
        {{ data.probleme ? 'Mettre à jour' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`h2{display:flex;align-items:center;gap:8px} .dialog-form{display:flex;flex-direction:column;gap:4px;min-width:440px;padding-top:8px} .full{width:100%}`]
})
export class ProblemeDialogComponent {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<ProblemeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ProblemeDialogData, private fb: FormBuilder) {
    this.form = this.fb.group({
      moduleId:   [data.probleme?.moduleId ?? data.moduleIdPreselect ?? null, Validators.required],
      codeErreur: [data.probleme?.codeErreur ?? '', [Validators.required, Validators.maxLength(50)]],
      titre:      [data.probleme?.titre ?? '',      [Validators.required, Validators.maxLength(255)]],
      priorite:   [data.probleme?.priorite ?? 'MOYENNE', Validators.required]
    });
  }
  confirmer() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
