import { Component, inject, signal, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-overlay" *ngIf="isOpen()">
      <div class="checkout-modal animate-fadeInUp">
        
        <!-- HEADER -->
        <div class="checkout-header">
          <h2>FINALIZAR COMPRA</h2>
          <button class="close-btn" (click)="close()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="checkout-grid" *ngIf="step() !== 'success'">
          <!-- LEFT: FORMS -->
          <div class="checkout-main">
            
            <!-- STEPS INDICATOR -->
            <div class="steps-nav">
              <div class="step-item" [class.active]="step() === 'shipping'" (click)="step.set('shipping')">1. Envío</div>
              <div class="step-item" [class.active]="step() === 'payment'" (click)="step.set('payment')">2. Pago</div>
            </div>

            <!-- SHIPPING FORM -->
            <div class="step-content" *ngIf="step() === 'shipping'">
              <h3>Dirección de Entrega</h3>
              <div class="form-grid">
                <div class="form-group full">
                  <label>Nombre Completo</label>
                  <input type="text" [(ngModel)]="shippingData.name" placeholder="Ej: Juan Pérez">
                </div>
                <div class="form-group">
                  <label>Cédula / NIT</label>
                  <input type="text" [(ngModel)]="shippingData.id" placeholder="12345678">
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="text" [(ngModel)]="shippingData.phone" placeholder="321 000 0000">
                </div>
                <div class="form-group full">
                  <label>Dirección</label>
                  <input type="text" [(ngModel)]="shippingData.address" placeholder="Calle 123 #45-67">
                </div>
                <div class="form-group">
                  <label>Ciudad</label>
                  <input type="text" [(ngModel)]="shippingData.city" placeholder="Ej: Villavicencio">
                </div>
                <div class="form-group">
                  <label>Departamento</label>
                  <input type="text" [(ngModel)]="shippingData.state" placeholder="Ej: Meta">
                </div>
              </div>
              <button class="btn-gold btn-block" (click)="step.set('payment')">CONTINUAR AL PAGO</button>
            </div>

            <!-- PAYMENT FORM -->
            <div class="step-content" *ngIf="step() === 'payment'">
              <h3>Método de Pago</h3>
              <div class="payment-methods">
                <div class="method-card" [class.selected]="paymentMethod() === 'card'" (click)="paymentMethod.set('card')">
                  <div class="method-icon">💳</div>
                  <span>Tarjeta</span>
                </div>
                <div class="method-card" [class.selected]="paymentMethod() === 'pse'" (click)="paymentMethod.set('pse')">
                  <div class="method-icon">🏦</div>
                  <span>PSE</span>
                </div>
                <div class="method-card" [class.selected]="paymentMethod() === 'cash'" (click)="paymentMethod.set('cash')">
                  <div class="method-icon">💵</div>
                  <span>Efectivo</span>
                </div>
              </div>

              <div class="card-details" *ngIf="paymentMethod() === 'card'">
                <div class="form-group full">
                  <label>Número de Tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Expira</label>
                    <input type="text" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label>CVC</label>
                    <input type="password" placeholder="***">
                  </div>
                </div>
              </div>
              
              <button class="btn-gold btn-block" (click)="processPayment()" [disabled]="isProcessing()">
                {{ isProcessing() ? 'PROCESANDO...' : 'FINALIZAR PEDIDO' }}
              </button>
            </div>

          </div>

          <!-- RIGHT: SUMMARY -->
          <div class="checkout-summary">
            <h3>Resumen del Pedido</h3>
            <div class="summary-items">
              <div class="summary-item" *ngFor="let item of cartService.cartItems()">
                <img [src]="item.product.imagen" [alt]="item.product.nombre">
                <div class="item-info">
                  <p class="name">{{ item.product.nombre }} x {{ item.quantity }}</p>
                  <p class="price">{{ (item.product.precio * item.quantity) | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                </div>
              </div>
            </div>
            
            <div class="totals-box">
              <div class="total-row">
                <span>Subtotal</span>
                <span>{{ cartService.total() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
              <div class="total-row">
                <span>Envío</span>
                <span class="text-free">{{ cartService.total() >= 200000 ? 'GRATIS' : '$15.000' }}</span>
              </div>
              <div class="total-row grand-total">
                <span>TOTAL</span>
                <span>{{ (cartService.total() + (cartService.total() >= 200000 ? 0 : 15000)) | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>

            <div class="secure-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Pago 100% seguro y encriptado
            </div>
          </div>
        </div>

        <!-- SUCCESS STATE -->
        <div class="success-screen" *ngIf="step() === 'success'">
          <div class="success-icon animate-pop">✓</div>
          <h2>¡GRACIAS POR TU COMPRA!</h2>
          <p>Tu pedido #APC-{{ orderId }} ha sido recibido exitosamente.</p>
          <p class="text-muted">Enviamos un correo de confirmación con los detalles del envío.</p>
          <button class="btn-gold" (click)="close()">VOLVER A LA TIENDA</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .checkout-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(0,0,0,0.95);
      backdrop-filter: blur(10px);
      z-index: 6000;
      display: flex; justify-content: center; align-items: center;
      padding: 1rem;
    }
    .checkout-modal {
      background: #0A0A0A;
      width: 100%; max-width: 1000px;
      max-height: 90vh;
      border: 1px solid var(--gold);
      border-radius: 4px;
      display: flex; flex-direction: column;
      overflow: hidden;
      box-shadow: 0 30px 100px rgba(0,0,0,1);
    }
    .checkout-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex; justify-content: space-between; align-items: center;
    }
    .checkout-header h2 { font-size: 1.2rem; letter-spacing: 3px; color: var(--gold); margin: 0; }
    .checkout-grid { display: grid; grid-template-columns: 1fr 350px; flex: 1; overflow: hidden; }
    
    .checkout-main { padding: 2rem; overflow-y: auto; border-right: 1px solid rgba(255,255,255,0.05); }
    .checkout-summary { padding: 2rem; background: #070707; overflow-y: auto; }

    .steps-nav { display: flex; gap: 2rem; margin-bottom: 2rem; border-bottom: 1px solid #222; }
    .step-item { padding-bottom: 1rem; color: #555; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: 0.3s; }
    .step-item.active { color: var(--gold); border-bottom: 2px solid var(--gold); }

    h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { font-size: 0.7rem; text-transform: uppercase; color: #888; letter-spacing: 1px; }
    .form-group input { background: #111; border: 1px solid #333; padding: 12px; color: #fff; border-radius: 2px; }
    .form-group input:focus { border-color: var(--gold); outline: none; }

    .payment-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .method-card { 
      background: #111; border: 1px solid #222; padding: 1.5rem; border-radius: 4px;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; transition: 0.3s;
    }
    .method-card:hover { border-color: var(--gold-dark); }
    .method-card.selected { border-color: var(--gold); background: rgba(212, 175, 55, 0.05); }
    .method-icon { font-size: 1.5rem; }
    .method-card span { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }

    .summary-items { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
    .summary-item { display: flex; gap: 1rem; }
    .summary-item img { width: 50px; height: 60px; object-fit: cover; border-radius: 2px; }
    .item-info .name { font-size: 0.85rem; color: #fff; margin-bottom: 4px; }
    .item-info .price { font-size: 0.8rem; color: var(--gold); font-weight: 600; }

    .totals-box { border-top: 1px solid #222; padding-top: 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; }
    .total-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #888; }
    .total-row.grand-total { border-top: 1px solid #333; padding-top: 1rem; font-size: 1.2rem; color: #fff; font-weight: 700; }
    .grand-total span:last-child { color: var(--gold); }
    .text-free { color: #25D366; font-weight: 700; }

    .secure-badge { margin-top: 2rem; display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: #666; justify-content: center; }
    
    .btn-block { width: 100%; padding: 15px; font-size: 1rem; letter-spacing: 2px; }

    .success-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem; }
    .success-icon { width: 80px; height: 80px; background: #25D366; color: #fff; border-radius: 50%; font-size: 3rem; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
    .success-screen h2 { font-size: 2rem; margin-bottom: 1rem; letter-spacing: 4px; }
    .success-screen p { margin-bottom: 0.5rem; }

    @media (max-width: 800px) {
      .checkout-grid { grid-template-columns: 1fr; }
      .checkout-summary { order: -1; max-height: 300px; }
    }

    .animate-pop { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes pop {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class CheckoutComponent {
  public cartService = inject(CartService);
  
  @Input() isOpen = signal(false);
  @Output() onClosed = new EventEmitter<void>();

  step = signal<'shipping' | 'payment' | 'success'>('shipping');
  paymentMethod = signal<'card' | 'pse' | 'cash'>('card');
  isProcessing = signal(false);
  orderId = '';

  shippingData = {
    name: '',
    id: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  };

  close() {
    this.isOpen.set(false);
    this.onClosed.emit();
    if (this.step() === 'success') {
      this.cartService.clearCart();
      this.step.set('shipping');
    }
  }

  processPayment() {
    this.isProcessing.set(true);
    this.orderId = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Simular latencia de red de una pasarela real
    setTimeout(() => {
      this.isProcessing.set(false);
      this.step.set('success');
    }, 2500);
  }
}
