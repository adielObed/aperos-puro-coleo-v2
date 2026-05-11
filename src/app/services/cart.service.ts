import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './product.service';

export interface CartItem {
  product: Producto;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signals for state
  private _cartItems = signal<CartItem[]>([]);
  private _wishItems = signal<Producto[]>([]);

  // Public exposure
  cartItems = this._cartItems.asReadonly();
  wishItems = this._wishItems.asReadonly();

  // Computed totals
  cartCount = computed(() => this._cartItems().reduce((acc, item) => acc + item.quantity, 0));
  wishCount = computed(() => this._wishItems().length);
  
  total = computed(() => 
    this._cartItems().reduce((acc, item) => acc + (item.product.precio * item.quantity), 0)
  );

  // Cart Methods
  addToCart(product: Producto) {
    this._cartItems.update(items => {
      const existing = items.find(i => i.product._id === product._id);
      if (existing) {
        return items.map(i => i.product._id === product._id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this._cartItems.update(items => items.filter(i => i.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._cartItems.update(items => items.map(i => 
      i.product._id === productId ? { ...i, quantity } : i
    ));
  }

  clearCart() {
    this._cartItems.set([]);
  }

  // Wishlist Methods
  toggleWish(product: Producto) {
    this._wishItems.update(items => {
      const exists = items.some(i => i._id === product._id);
      if (exists) {
        return items.filter(i => i._id !== product._id);
      }
      return [...items, product];
    });
  }

  isInWishlist(productId: string): boolean {
    return this._wishItems().some(i => i._id === productId);
  }

  removeFromWish(productId: string) {
    this._wishItems.update(items => items.filter(i => i._id !== productId));
  }
}
