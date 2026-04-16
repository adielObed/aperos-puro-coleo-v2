import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface Category {
  _id?: string;
  name: string;
  img: string;
  active?: boolean;
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
  private apiUrl = 'http://localhost:3000/api'; // Luego lo pasaremos a environment

  getProductos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/productos`);
  }

  getCategories(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/categories`);
  }

  createCategory(categoryData: Partial<Category>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/categories`, categoryData);
  }

  createProducto(producto: Producto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/productos`, producto);
  }

  updateProducto(id: string, producto: Producto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/productos/${id}`, producto);
  }

  deleteProducto(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/productos/${id}`);
  }
}
