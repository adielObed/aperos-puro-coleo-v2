// ============================================================
//  app.component.ts  –  Aperos Puro Coleo
//  Angular 17+ Standalone Component
// ============================================================

import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ProductService, Producto } from './product.service';
import { 
  LucideAngularModule, ShoppingCart, Search, User, Heart, Menu, X, Star, ChevronDown, Instagram, Facebook, Mail, Phone 
} from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrls: ['./styles.css']
})
export class AppComponent implements OnInit {

  private productService = inject(ProductService);

  // ── State ──────────────────────────────────────────────
  productos             = signal<Producto[]>([]);
  categoriasBaseDeDatos = signal<any[]>([]); 
  searchTerm            = signal('');
  cargando              = signal(true);
  errorMsg              = signal('');
  categoriaActiva       = signal('Todos');
  materialActivo        = signal('Todos');
  precioMax             = signal(800000);
  headerScrolled        = signal(false);
  mobileMenuOpen        = signal(false);
  cartCount             = signal(3);
  wishCount             = signal(2);
  priceRange            = signal(30);
  selectedMaterials     = signal<string[]>([]);
  email                 = signal('');
  subscribed            = signal(false);

  // ── Datos estáticos ────────────────────────────────────
  categoryTabs = ['Todos', 'Sombreros', 'Sillas de Montar', 'Botas', 'Frenos & Bocados', 'Cotizas', 'Casqueras'];

  sidebarCats: [string, number][] = [
    ['Sombreros', 24],
    ['Sillas de Montar', 12],
    ['Caballeria', 8],
    ['Calzados', 15],
    ['Accesorios', 6],
  ];

  materials = ['Cuero Crudo', 'Fieltro Pelo', 'Plata & Oro'];

  craftStats: [string, string][] = [
    ['500+', 'Jinetes satisfechos'],
    ['30+', 'Artesanos expertos'],
    ['100%', 'Cuero legítimo'],
  ];

  footerExplorar = ['Nuestra Historia', 'Catálogo Completo', 'Blog del Llanero', 'Eventos & Coleo'];
  footerAyuda = ['Rastrear Pedido', 'Tallas de Sombreros', 'Cuidado del Cuero', 'Contacto'];

  // ── Computed ───────────────────────────────────────────
  priceDisplay = computed(() => {
    return (this.priceRange() * 50000).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  });

  productosFiltrados = computed(() => {
    const lista = this.productos();
    const cat = this.categoriaActiva();
    const mats = this.selectedMaterials();
    const max = this.priceRange() * 50000; 
    const busqueda = this.searchTerm().toLowerCase().trim(); 

    return lista.filter(p => {
      const matchCat = cat === 'Todos' || p.categoria === cat;
      const matchMat = mats.length === 0 || mats.includes(p.material);
      const matchPrice = p.precio <= max;
      
      const matchBusqueda = busqueda === '' || 
        (p.nombre?.toLowerCase().includes(busqueda)) || 
        (p.descripcion?.toLowerCase().includes(busqueda));

      return matchCat && matchMat && matchPrice && matchBusqueda;
    });
  });

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit() {
    // Traer productos de Node.js
    this.productService.getProductos().subscribe({
      next: (res) => {
        if(res.status === 'ok') {
          this.productos.set(res.data);
          this.cargando.set(false);
        }
      },
      error: (err) => {
        this.errorMsg.set('Error al cargar productos');
        this.cargando.set(false);
      }
    });

    // Traer categorías de Node.js
    this.productService.getCategories().subscribe({
      next: (res) => {
        if(res.status === 'ok') this.categoriasBaseDeDatos.set(res.data);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.headerScrolled.set(window.scrollY > 50);
  }

  // ── Handlers ───────────────────────────────────────────
  addToCart():  void { this.cartCount.update(c => c + 1); }
  addToWish():  void { this.wishCount.update(c => c + 1); }
  toggleMobileMenu(): void { this.mobileMenuOpen.update(v => !v); }

  setCat(c: string): void { this.categoriaActiva.set(c); }

  setSearch(e: Event): void {
    const element = e.target as HTMLInputElement;
    this.searchTerm.set(element.value);
  }

  clearFilters(): void {
    this.categoriaActiva.set('Todos');
    this.selectedMaterials.set([]);
    this.priceRange.set(30);
    this.searchTerm.set('');
  }

  setPriceRange(e: Event): void {
    this.priceRange.set(+(e.target as HTMLInputElement).value);
  }

  toggleMaterial(mat: string): void {
    const current = this.selectedMaterials();
    if (current.includes(mat)) {
      this.selectedMaterials.set(current.filter(m => m !== mat));
    } else {
      this.selectedMaterials.set([...current, mat]);
    }
  }

  setEmail(e: Event): void {
    this.email.set((e.target as HTMLInputElement).value);
  }

  handleSubscribe(): void {
    if (this.email().includes('@')) {
      this.subscribed.set(true);
    }
  }
}