// ============================================================
//  app.component.ts  –  Aperos Puro Coleo
//  Angular 17+ Standalone Component
// ============================================================

import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ProductService, Producto } from './product.service';
import { AuthService } from './services/auth.service';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthComponent } from './components/auth/auth.component';
import { 
  LucideAngularModule, ShoppingCart, Search, User, Heart, Menu, X, Star, ChevronDown, Instagram, Facebook, Mail, Phone, Edit, Trash2, Plus 
} from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ProductDetailComponent, AdminPanelComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./styles.css']
})
export class AppComponent implements OnInit {

  private productService = inject(ProductService);
  public authService = inject(AuthService);

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

  productoSeleccionado  = signal<Producto | null>(null);

  // ── UI Sidebars ────────────────────────────────────────
  isCartOpen = signal(false);
  isWishOpen = signal(false);
  isLangOpen = signal(false);
  isHelpOpen = signal(false);

  // ── Admin & Modal State ────────────────────────────────
  showModal = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  isSaving = signal(false);
  
  formData = signal<Partial<Producto>>({
    nombre: '',
    categoria: '',
    material: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen: '',
    destacado: false
  });

  // ── Datos estáticos ────────────────────────────────────
  categoryTabs = ['Hombre', 'Mujer', 'Niño', 'Accesorios', 'Talabarteria'];

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

  // ── Utils ──────────────────────────────────────────────
  private normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  // ── Computed ───────────────────────────────────────────
  priceDisplay = computed(() => {
    return (this.priceRange() * 50000).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  });

  hasActiveFilters = computed(() => {
    return this.categoriaActiva() !== 'Todos' || this.searchTerm() !== '';
  });

  productosFiltrados = computed(() => {
    const lista = this.productos();
    const cat = this.categoriaActiva();
    const mats = this.selectedMaterials();
    const max = this.priceRange() * 50000; 
    const busqueda = this.normalize(this.searchTerm()); 

    let filtrados = lista.filter(p => {
      const matchCat = cat === 'Todos' || p.categoria === cat;
      const matchMat = mats.length === 0 || mats.includes(p.material);
      const matchPrice = p.precio <= max;
      
      const normNombre = this.normalize(p.nombre || '');
      const normDesc = this.normalize(p.descripcion || '');
      
      // Búsqueda Profesional: Permite coincidencias parciales y de palabras sueltas
      const palabrasBusqueda = busqueda.split(' ').filter(word => word.length > 0);
      const matchBusqueda = palabrasBusqueda.length === 0 || palabrasBusqueda.every(palabra => 
        normNombre.includes(palabra) || normDesc.includes(palabra)
      );

      return matchCat && matchMat && matchPrice && matchBusqueda;
    });

    // Búsqueda Sugerida / Por aproximación (Si no hay resultados exactos)
    if (filtrados.length === 0 && busqueda.length > 2) {
      filtrados = lista.filter(p => {
        const normNombre = this.normalize(p.nombre || '');
        // Si al menos el 50% de las letras coinciden o es una sub-palabra cercana
        return busqueda.split('').slice(0, 3).every(char => normNombre.includes(char));
      }).slice(0, 3); // Solo 3 sugerencias
    }

    return filtrados;
  });

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.cargando.set(true);
    // Llamar al backend con el término de búsqueda si existe (Sincronización Backend/Frontend)
    const term = this.searchTerm();
    this.productService.getProductos(term).subscribe({
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
  addToCart():  void { 
    this.cartCount.update(c => c + 1); 
    this.isCartOpen.set(true);
  }
  
  addToWish():  void { 
    this.wishCount.update(c => c + 1); 
    this.isWishOpen.set(true);
  }
  
  toggleCart(): void { this.isCartOpen.update(v => !v); }
  toggleWish(): void { this.isWishOpen.update(v => !v); }
  toggleMobileMenu(): void { this.mobileMenuOpen.update(v => !v); }

  setCat(c: string): void { 
    this.categoriaActiva.set(c); 
    this.productoSeleccionado.set(null); // volver al listado al cambiar categoria
    
    // Scroll al contenedor de productos
    setTimeout(() => {
      const element = document.getElementById('productos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  verDetalle(p: Producto): void {
    this.productoSeleccionado.set(p);
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  volverListado(): void {
    this.productoSeleccionado.set(null);
  }

  searchTimeout: any;
  setSearch(e: Event): void {
    const element = e.target as HTMLInputElement;
    this.searchTerm.set(element.value);
    
    // Debounce para no saturar el servidor en cada tecla
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.refreshData();
    }, 400);
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

  // ── CRUD Handlers ──────────────────────────────────────
  openCreateModal(): void {
    this.formData.set({ nombre: '', categoria: '', material: '', precio: 0, stock: 0, descripcion: '', imagen: '', destacado: false });
    this.modalMode.set('create');
    this.showModal.set(true);
  }

  openEditModal(p: Producto): void {
    this.formData.set({ ...p });
    this.modalMode.set('edit');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveProduct(): void {
    const data = this.formData() as Producto;
    if (!data.nombre || !data.categoria || !data.material || !data.descripcion) {
      alert("Por favor completa los campos requeridos");
      return;
    }
    
    this.isSaving.set(true);
    
    if (this.modalMode() === 'create') {
      this.productService.createProducto(data).subscribe({
        next: (res) => {
          if (res.status === 'ok') {
            this.productos.update(list => [...list, res.data]);
            this.closeModal();
          }
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    } else {
      if (data._id) {
        this.productService.updateProducto(data._id, data).subscribe({
          next: (res) => {
            if (res.status === 'ok') {
              this.productos.update(list => list.map(p => p._id === data._id ? res.data : p));
              this.closeModal();
            }
            this.isSaving.set(false);
          },
          error: () => this.isSaving.set(false)
        });
      }
    }
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro que deseas eliminar el producto? Esta acción no se puede deshacer.')) {
      this.productService.deleteProducto(id).subscribe({
        next: (res) => {
          if (res.status === 'ok') {
            this.productos.update(list => list.filter(p => p._id !== id));
          }
        }
      });
    }
  }
}