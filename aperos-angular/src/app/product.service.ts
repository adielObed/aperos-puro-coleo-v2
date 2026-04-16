import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

export interface Producto {
  _id?: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  material: string;
  descripcion: string;
  imagen: string;
  destacado: boolean;
}

export interface ApiResponse {
  status: string;
  total?: number;
  data?: any;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api';

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getProductos(search?: string): Observable<ApiResponse> {
    let url = `${this.apiUrl}/productos`;
    if (search) {
      const cleanSearch = search.trim();
      url += `?search=${encodeURIComponent(cleanSearch)}`;
    }
    return this.http.get<ApiResponse>(url);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  createCategory(categoryData: { name: string, img: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/categories`, categoryData, this.getHeaders());
  }

  createProducto(producto: Producto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/productos`, producto, this.getHeaders());
  }

  updateProducto(id: string, producto: Producto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/productos/${id}`, producto, this.getHeaders());
  }

  deleteProducto(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/productos/${id}`, this.getHeaders());
  }
}