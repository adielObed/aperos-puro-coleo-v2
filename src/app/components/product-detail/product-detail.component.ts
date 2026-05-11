import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail-container animate-fadeInUp">
      <button class="back-btn btn-outline" (click)="onBack.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Volver a Colecciones
      </button>

      <div class="product-detail-grid">
        <div class="product-image-box">
          <img [src]="producto.imagen" [alt]="producto.nombre" loading="lazy">
        </div>
        <div class="product-info-box">
          <span class="product-category">{{ producto.categoria }}</span>
          <h2 class="product-title font-serif">{{ producto.nombre }}</h2>
          <div class="product-price">{{ producto.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</div>
          
          <div class="product-meta">
            <p><strong>Material:</strong> {{ producto.material }}</p>
            <p *ngIf="producto.stock > 0"><strong>Disponibilidad:</strong> {{ producto.stock }} en stock</p>
            <p *ngIf="producto.stock === 0" style="color: red;"><strong>Agotado temporalmente</strong></p>
          </div>
          
          <div class="product-description">
            <h3>Acerca de esta pieza</h3>
            <p>{{ producto.descripcion }}</p>
          </div>
          
          <div class="product-benefits">
             <div class="benefit-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Calidad de exportación</div>
             <div class="benefit-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Hecho por artesanos llaneros</div>
             <div class="benefit-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Garantía de por vida en cuero</div>
          </div>

          <div class="actions">
            <button class="btn-gold btn-lg add-to-cart" (click)="onAddToCart.emit(producto)" [disabled]="producto.stock === 0">AÑADIR AL CARRITO</button>
            <button class="btn-outline btn-lg wish-btn" (click)="onAddToWish.emit(producto)">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- SECCIÓN RELACIONADOS -->
      <div class="related-section" *ngIf="relatedProducts.length > 0">
        <h3 class="related-title">TAMBIÉN TE PUEDE INTERESAR</h3>
        <div class="related-grid">
          <div class="mini-card" *ngFor="let p of relatedProducts" (click)="selectProduct(p)">
            <div class="mini-img-box">
              <img [src]="p.imagen" [alt]="p.nombre">
            </div>
            <div class="mini-info">
              <span class="mini-cat">{{ p.categoria }}</span>
              <h4 class="mini-name">{{ p.nombre }}</h4>
              <div class="mini-price">{{ p.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 0 5% 60px;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 30px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 500;
      border-radius: 4px;
      color: var(--gray-300);
      border-color: var(--gray-300);
      transition: all 0.3s;
    }
    .back-btn:hover { 
      background: rgba(255, 255, 255, 0.05); 
      color: #fff; 
    }
    .product-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      background: var(--gray-900);
      border-radius: 12px;
      border: 1px solid var(--gray-800);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      align-items: stretch;
    }
    .product-image-box {
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 12px 0 0 12px;
      overflow: hidden;
    }
    .product-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-info-box {
      padding: 40px 50px 40px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .product-category { 
      color: var(--gold); 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      font-size: 0.9rem; 
      font-weight: 600;
      margin-bottom: 10px;
    }
    .product-title { 
      font-size: 3rem; 
      color: #fff; 
      margin-bottom: 20px;
      line-height: 1.1;
    }
    .product-price { 
      font-size: 1.8rem; 
      color: var(--gold); 
      font-weight: 500; 
      margin-bottom: 25px;
      font-family: 'Playfair Display', serif;
      letter-spacing: 1px;
      text-align: left;
      align-self: flex-start;
    }
    .product-meta {
      margin-bottom: 30px;
      padding: 20px 0;
      border-top: 1px solid var(--gray-800);
      border-bottom: 1px solid var(--gray-800);
    }
    .product-meta p {
      margin-bottom: 8px;
      color: var(--gray-300);
    }
    .product-meta strong {
      color: #fff;
      font-weight: 500;
    }
    .product-description {
      margin-bottom: 30px;
    }
    .product-description h3 { 
      margin-bottom: 15px; 
      color: #fff; 
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .product-description p { 
      color: var(--gray-300); 
      line-height: 1.8; 
      font-size: 1.05rem;
    }
    .product-benefits {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--gray-300);
      font-size: 0.95rem;
    }
    .benefit-item svg {
      color: var(--gold);
    }
    .actions { 
      display: flex; 
      gap: 16px; 
      margin-top: auto; 
    }
    .btn-lg { 
      padding: 18px 24px; 
      font-weight: bold; 
      cursor: pointer; 
      border-radius: 4px;
      letter-spacing: 1px;
      font-size: 1rem;
    }
    .add-to-cart {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .add-to-cart:disabled {
      background: var(--gray-800);
      color: var(--gray-500);
      cursor: not-allowed;
      border-color: var(--gray-800);
    }
    .wish-btn { 
      flex: 0 0 60px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 0;
    }
    @media (max-width: 992px) {
      .product-detail-grid { grid-template-columns: 1fr; }
      .product-info-box { padding: 30px; }
      .product-image-box { height: 400px; }
    }

    /* ESTILOS RELACIONADOS MINI */
    .related-section {
      margin-top: 80px;
      padding-top: 40px;
      border-top: 1px solid var(--gray-800);
    }
    .related-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      letter-spacing: 0.4em;
      color: var(--gold);
      text-align: center;
      margin-bottom: 40px;
      font-weight: 700;
    }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .mini-card {
      background: #121212;
      border: 1px solid rgba(192, 192, 192, 0.1);
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .mini-card:hover {
      border-color: #C0C0C0;
      transform: translateY(-5px);
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.2);
    }
    .mini-img-box {
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #1E1E1E;
    }
    .mini-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    .mini-card:hover .mini-img-box img {
      transform: scale(1.1);
    }
    .mini-info {
      padding: 15px;
    }
    .mini-cat {
      font-size: 0.6rem;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
      margin-bottom: 5px;
    }
    .mini-name {
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      color: #fff;
      margin-bottom: 8px;
    }
    .mini-price {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      color: #fff;
      font-weight: 400;
    }
    @media (max-width: 1024px) {
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .related-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent {
  @Input() producto!: Producto;
  @Input() allProducts: Producto[] = [];
  @Output() onBack = new EventEmitter<void>();
  @Output() onAddToCart = new EventEmitter<Producto>();
  @Output() onAddToWish = new EventEmitter<Producto>();
  @Output() onProductSelect = new EventEmitter<Producto>();

  get relatedProducts(): Producto[] {
    if (!this.producto || !this.allProducts) return [];
    
    return this.allProducts
      .filter(p => p._id !== this.producto._id)
      .sort((a, b) => {
        // Priorizar misma categoría
        if (a.categoria === this.producto.categoria && b.categoria !== this.producto.categoria) return -1;
        if (a.categoria !== this.producto.categoria && b.categoria === this.producto.categoria) return 1;
        return 0;
      })
      .slice(0, 4);
  }

  selectProduct(p: Producto) {
    this.onProductSelect.emit(p);
  }
}
