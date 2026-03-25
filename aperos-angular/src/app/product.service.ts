import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  _id?: string;
  nombre: string;
  precio: number;
  categoria: string;
  material: string;
  descripcion: string;
  imagen: string;
  destacado: boolean;
}

export interface ApiResponse {
  status: string;
  total: number;
  data: Producto[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getProductos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/productos`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
}