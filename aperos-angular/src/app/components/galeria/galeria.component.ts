import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service'; 

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.component.html', // Verifica que este archivo exista en la misma carpeta
  styleUrl: './galeria.component.css'    // Verifica que este archivo exista en la misma carpeta
})
export class GaleriaComponent implements OnInit {
  productos: any[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      // Agregamos ": any" para que TypeScript no se queje
      next: (res: any) => {
        this.productos = res.data;
        console.log('Productos cargados:', this.productos);
      },
      error: (err: any) => {
        console.error('Error al conectar con Node.js', err);
      }
    });
  }
}