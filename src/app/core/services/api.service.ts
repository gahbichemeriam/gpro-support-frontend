import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ProjetErp, ProjetErpRequest, ModuleErp, ModuleErpRequest,
         Probleme, ProblemeRequest, Resolution, ResolutionRequest,
         VersionErp, VersionErpRequest, Client, ClientRequest } from '../models';

const BASE = 'http://localhost:8081/api';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  // ===== PROJETS =====
  getProjets(): Observable<ProjetErp[]> {
    return this.http.get<ApiResponse<ProjetErp[]>>(`${BASE}/projets`).pipe(map(r => r.data));
  }
  createProjet(req: ProjetErpRequest): Observable<ProjetErp> {
    return this.http.post<ApiResponse<ProjetErp>>(`${BASE}/projets`, req).pipe(map(r => r.data));
  }
  updateProjet(id: number, req: ProjetErpRequest): Observable<ProjetErp> {
    return this.http.put<ApiResponse<ProjetErp>>(`${BASE}/projets/${id}`, req).pipe(map(r => r.data));
  }
  deleteProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/projets/${id}`);
  }

  // ===== MODULES =====
  getModules(projetId?: number): Observable<ModuleErp[]> {
    const url = projetId ? `${BASE}/modules?projetId=${projetId}` : `${BASE}/modules`;
    return this.http.get<ApiResponse<ModuleErp[]>>(url).pipe(map(r => r.data));
  }
  createModule(req: ModuleErpRequest): Observable<ModuleErp> {
    return this.http.post<ApiResponse<ModuleErp>>(`${BASE}/modules`, req).pipe(map(r => r.data));
  }
  deleteModule(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/modules/${id}`);
  }

  // ===== PROBLEMES =====
  getProblemes(moduleId?: number, recherche?: string): Observable<Probleme[]> {
    const params: string[] = [];
    if (moduleId) params.push(`moduleId=${moduleId}`);
    if (recherche) params.push(`recherche=${encodeURIComponent(recherche)}`);
    const url = `${BASE}/problemes${params.length ? '?' + params.join('&') : ''}`;
    return this.http.get<ApiResponse<Probleme[]>>(url).pipe(map(r => r.data));
  }
  createProbleme(req: ProblemeRequest): Observable<Probleme> {
    return this.http.post<ApiResponse<Probleme>>(`${BASE}/problemes`, req).pipe(map(r => r.data));
  }
  updateProbleme(id: number, req: ProblemeRequest): Observable<Probleme> {
    return this.http.put<ApiResponse<Probleme>>(`${BASE}/problemes/${id}`, req).pipe(map(r => r.data));
  }
  deleteProbleme(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/problemes/${id}`);
  }

  // ===== RESOLUTIONS =====
  getResolutions(problemeId: number): Observable<Resolution[]> {
    return this.http.get<ApiResponse<Resolution[]>>(`${BASE}/resolutions?problemeId=${problemeId}`).pipe(map(r => r.data));
  }
  createResolution(req: ResolutionRequest): Observable<Resolution> {
    return this.http.post<ApiResponse<Resolution>>(`${BASE}/resolutions`, req).pipe(map(r => r.data));
  }
  validerResolution(id: number): Observable<Resolution> {
    return this.http.patch<ApiResponse<Resolution>>(`${BASE}/resolutions/${id}/valider`, {}).pipe(map(r => r.data));
  }

  // ===== VERSIONS =====
  getVersions(projetId?: number): Observable<VersionErp[]> {
    const url = projetId ? `${BASE}/versions?projetId=${projetId}` : `${BASE}/versions`;
    return this.http.get<ApiResponse<VersionErp[]>>(url).pipe(map(r => r.data));
  }
  createVersion(req: VersionErpRequest): Observable<VersionErp> {
    return this.http.post<ApiResponse<VersionErp>>(`${BASE}/versions`, req).pipe(map(r => r.data));
  }
  deleteVersion(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/versions/${id}`);
  }

  // ===== CLIENTS =====
  getClients(projetId?: number): Observable<Client[]> {
    const url = projetId ? `${BASE}/clients?projetId=${projetId}` : `${BASE}/clients`;
    return this.http.get<ApiResponse<Client[]>>(url).pipe(map(r => r.data));
  }
  createClient(req: ClientRequest): Observable<Client> {
    return this.http.post<ApiResponse<Client>>(`${BASE}/clients`, req).pipe(map(r => r.data));
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/clients/${id}`);
  }
}
