import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8081/api/auth';
  private TOKEN_KEY = 'gpro_token';
  private USER_KEY = 'gpro_user';

  private userSubject = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API}/login`, req).pipe(
      tap(r => { if (r.success) this.saveSession(r.data); })
    );
  }

  register(req: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API}/register`, req).pipe(
      tap(r => { if (r.success) this.saveSession(r.data); })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getUser(): LoginResponse | null { return this.userSubject.value; }

  private saveSession(user: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getStoredUser(): LoginResponse | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }
}
