import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Client, ProjetErp, VersionErp } from '../../../../core/models';

export interface ClientDialogData { client?: Client; projets: ProjetErp[]; versions: VersionErp[]; }

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>people</mat-icon> {{ data.client ? 'Modifier le client' : 'Nouveau client' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nom du client</mat-label>
          <input matInput formControlName="nom" placeholder="Société Alpha SARL">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Projet ERP</mat-label>
          <mat-select formControlName="projetId" (selectionChange)="onProjetChange($event.value)">
            <mat-option *ngFor="let p of data.projets" [value]="p.id">{{ p.nom }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Version active</mat-label>
          <mat-select formControlName="versionActiveId">
            <mat-option *ngFor="let v of versionsFiltered" [value]="v.id">v{{ v.codeVersion }} — {{ v.statut }}</mat-option>
          </mat-select>
          <mat-hint *ngIf="!form.get('projetId')?.value">Sélectionnez d'abord un projet</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="confirmer()">
        {{ data.client ? 'Mettre à jour' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`h2{display:flex;align-items:center;gap:8px} .dialog-form{display:flex;flex-direction:column;gap:4px;min-width:420px;padding-top:8px} .full{width:100%}`]
})
export class ClientDialogComponent {
  form: FormGroup;
  versionsFiltered: VersionErp[] = [];

  constructor(public dialogRef: MatDialogRef<ClientDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ClientDialogData, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom:            [data.client?.nom ?? '',          [Validators.required, Validators.maxLength(150)]],
      email:          [data.client?.email ?? '',        Validators.email],
      projetId:       [data.client?.projetId ?? null,   Validators.required],
      versionActiveId:[data.client?.versionActiveId ?? null, Validators.required]
    });
    if (data.client?.projetId) {
      this.versionsFiltered = data.versions.filter(v => v.projetId === data.client!.projetId);
    }
  }

  onProjetChange(projetId: number) {
    this.versionsFiltered = this.data.versions.filter(v => v.projetId === projetId);
    this.form.get('versionActiveId')?.reset();
  }

  confirmer() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
