import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Esta es la dirección de tu servidor de Node.js
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) { }

  // Método para traer todos los productos de MongoDB
  getProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}