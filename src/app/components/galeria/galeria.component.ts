import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service'; 

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit {
  productos: any[] = [];
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProductos().subscribe({
      next: (res) => {
        if (res.status === 'ok') {
          this.productos = res.data;
        }
      },
      error: (err) => {
        console.error('Error al conectar con Node.js', err);
      }
    });
  }
}