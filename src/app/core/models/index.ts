// Format de réponse standard du backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth
export type Role = 'AGENT_SUPPORT' | 'RD' | 'ADMIN';
export interface LoginRequest { email: string; motDePasse: string; }
export interface LoginResponse { token: string; email: string; nom: string; role: Role; }
export interface RegisterRequest { nom: string; email: string; motDePasse: string; role: Role; }

// Projet
export interface ProjetErp { id: number; nom: string; description: string; codeProduit: string; }
export interface ProjetErpRequest { nom: string; description: string; codeProduit: string; }

// Module
export interface ModuleErp { id: number; nom: string; description: string; projetId: number; projetNom: string; }
export interface ModuleErpRequest { projetId: number; nom: string; description: string; }

// Problème
export type Priorite = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export interface Probleme { id: number; titre: string; codeErreur: string; priorite: Priorite; dateCreation: string; moduleId: number; moduleNom: string; projetId: number; projetNom: string; }
export interface ProblemeRequest { moduleId: number; titre: string; codeErreur: string; priorite: Priorite; }

// Résolution
export type TypeResolution = 'SQL' | 'PARAMETRAGE' | 'PATCH_CODE' | 'PROCEDURE';
export interface Resolution { id: number; typeResolution: TypeResolution; descriptionEtapes: string; validationQa: boolean; problemeId: number; problemeTitre: string; problemeCodeErreur: string; }
export interface ResolutionRequest { problemeId: number; typeResolution: TypeResolution; descriptionEtapes: string; validationQa: boolean; }

// Version
export type StatutVersion = 'DEVELOPPEMENT' | 'STAGING' | 'PRODUCTION' | 'OBSOLETE';
export interface VersionErp { id: number; codeVersion: string; dateRelease: string; statut: StatutVersion; projetId: number; projetNom: string; }
export interface VersionErpRequest { projetId: number; codeVersion: string; dateRelease?: string; statut: StatutVersion; }

// Client
export interface Client { id: number; nom: string; email: string; projetId: number; projetNom: string; versionActiveId: number; versionActiveCode: string; }
export interface ClientRequest { nom: string; email: string; projetId: number; versionActiveId: number; }
