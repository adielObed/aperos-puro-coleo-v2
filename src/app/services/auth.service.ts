import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'customer';
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Señales de estado
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  // Getters reactivos
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAdmin = signal<boolean>(false);
  showAuthModal = signal<boolean>(false);
  authMode = signal<'login' | 'register'>('login');

  toggleAuthModal(mode: 'login' | 'register' = 'login') {
    this.authMode.set(mode);
    this.showAuthModal.set(!this.showAuthModal());
  }

  isLoggedIn(): boolean {
    return !!this._token();
  }

  constructor() {
    this.loadStorage();
  }

  private loadStorage() {
    const savedToken = localStorage.getItem('aperos_token');
    const savedUser = localStorage.getItem('aperos_user');

    if (savedToken && savedUser) {
      this._token.set(savedToken);
      const user = JSON.parse(savedUser);
      this._user.set(user);
      this.isAdmin.set(user.rol === 'admin');
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.handleAuthentication(res))
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthentication(res))
    );
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this.isAdmin.set(false);
    localStorage.removeItem('aperos_token');
    localStorage.removeItem('aperos_user');
  }

  private handleAuthentication(res: AuthResponse) {
    if (res.token && res.data.user) {
      this._token.set(res.token);
      this._user.set(res.data.user);
      this.isAdmin.set(res.data.user.rol === 'admin');
      
      localStorage.setItem('aperos_token', res.token);
      localStorage.setItem('aperos_user', JSON.stringify(res.data.user));
    }
  }

  getToken(): string | null {
    return this._token() || localStorage.getItem('aperos_token');
  }
}
