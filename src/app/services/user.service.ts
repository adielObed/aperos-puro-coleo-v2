import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/users`;

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.getHeaders());
  }

  updateUser(id: string, userData: Partial<User>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, userData, this.getHeaders());
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
