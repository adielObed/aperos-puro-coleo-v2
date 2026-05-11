import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Producto } from '../../services/product.service';
import { AuthService, User } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Panel flotante solo visible si isAdmin -->
    <div class="admin-fab" *ngIf="authService.isAdmin() && !isOpen()" (click)="openPanel()">
       ⚙️ Admin Panel
    </div>

    <div class="modal-overlay" *ngIf="authService.isAdmin() && isOpen()">
      <div class="modal-content animate-fadeInUp">
        <div class="modal-header">
          <h3>Panel de Administración (MongoDB)</h3>
          <button class="close-modal-btn" (click)="isOpen.set(false)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="modal-tabs">
           <button [class.active]="tab() === 'manage-products'" (click)="tab.set('manage-products')">Productos</button>
           <button [class.active]="tab() === 'users'" (click)="tab.set('users')">Usuarios</button>
           <button [class.active]="tab() === 'categories'" (click)="tab.set('categories')">Categorías</button>
        </div>

        <!-- LISTADO Y GESTIÓN DE PRODUCTOS -->
        <div class="modal-body" *ngIf="tab() === 'manage-products'">
          <div class="action-bar">
            <button class="btn-gold btn-sm" (click)="showForm.set(true); resetForm()">+ Nuevo Producto</button>
          </div>

          <!-- Tabla de productos -->
          <div class="admin-table-container" *ngIf="!showForm()">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of productos()">
                  <td>{{ p.nombre }}</td>
                  <td>{{ p.categoria }}</td>
                  <td>\${{ p.precio }}</td>
                  <td>{{ p.stock }}</td>
                  <td class="actions">
                    <button (click)="editProduct(p)" class="btn-icon">✏️</button>
                    <button (click)="deleteProduct(p._id)" class="btn-icon delete">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Formulario Producto -->
          <div class="admin-form" *ngIf="showForm()">
            <div class="form-header">
              <h4>{{ editingId() ? 'Editar' : 'Nuevo' }} Producto</h4>
              <button (click)="showForm.set(false)" class="btn-sm">Volver</button>
            </div>
            
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input type="text" placeholder="Ej: Galápago, Pechera, Freno" [(ngModel)]="productoForm.nombre">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select [(ngModel)]="productoForm.categoria">
                  <option value="" disabled>Selecciona...</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Niño">Niño</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Talabarteria">Talabartería</option>
                </select>
              </div>
              <div class="form-group">
                <label>Tipo de Cuero/Material *</label>
                <input type="text" placeholder="Ej: Cuero crudo, Neopreno" [(ngModel)]="productoForm.material">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <input type="number" placeholder="Ej: 150000" [(ngModel)]="productoForm.precio">
              </div>
              <div class="form-group">
                <label>Stock *</label>
                <input type="number" placeholder="Cantidad disponible" [(ngModel)]="productoForm.stock">
              </div>
            </div>

            <div class="form-group">
              <label>Descripción Detallada *</label>
              <textarea rows="3" placeholder="Especificar medidas, resistencia, etc." [(ngModel)]="productoForm.descripcion"></textarea>
            </div>

            <div class="form-group">
              <label>Imagen (URL, en BD)</label>
              <input type="text" placeholder="Ej: images/cat_sombreros.png" [(ngModel)]="productoForm.imagen">
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="destacadoCheck" [(ngModel)]="productoForm.destacado">
              <label for="destacadoCheck">Marcar como Producto Destacado</label>
            </div>
            
            <button class="btn-gold" style="width:100%" (click)="saveProduct()" [disabled]="isSaving()">
              {{ isSaving() ? 'Guardando...' : 'Guardar en MongoDB' }}
            </button>
          </div>
        </div>

        <!-- GESTIÓN DE USUARIOS -->
        <div class="modal-body" *ngIf="tab() === 'users'">
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users()">
                  <td>{{ u.nombre }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.rol }}</td>
                  <td class="actions">
                    <button *ngIf="u.rol !== 'admin'" (click)="makeAdmin(u)" class="btn-icon">👑</button>
                    <button (click)="deleteUser(u._id)" class="btn-icon delete">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FORMULARIO CATEGORÍAS -->
        <div class="modal-body" *ngIf="tab() === 'categories'">
          <div class="form-group">
            <label>Nombre de la Categoría *</label>
            <input type="text" placeholder="Ej: Hombre, Mujer..." [(ngModel)]="categoriaForm.name">
          </div>
          
          <div class="form-group">
            <label>Imagen Promocional (URL) *</label>
            <input type="text" placeholder="Ej: images/cat_sombreros.png" [(ngModel)]="categoriaForm.img">
          </div>

          <p style="color:var(--text-muted); font-size:0.85rem;">Nota: La categoría se mostrará en las "Colecciones Esenciales".</p>
          
          <button class="btn-gold" style="width:100%; margin-top: 1rem;" (click)="saveCategory()" [disabled]="isSaving()">
            {{ isSaving() ? 'Guardando...' : 'Guardar Categoría' }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-fab {
      position: fixed;
      bottom: 120px;
      right: 30px;
      background: var(--bg-darkest);
      color: var(--gold);
      border: 1px solid var(--gold);
      padding: 10px 20px;
      border-radius: 30px;
      cursor: pointer;
      z-index: 2000;
      font-weight: bold;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .modal-tabs {
      display: flex;
      background: #000;
    }
    .modal-tabs button {
      flex: 1;
      background: transparent;
      color: #777;
      border: none;
      padding: 15px;
      cursor: pointer;
      font-weight: bold;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .modal-tabs button.active {
      color: var(--gold);
      border-bottom: 2px solid var(--gold);
      background: rgba(255,255,255,0.05);
    }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(8px);
      z-index: 4000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    .modal-content {
      background: #0A0A0A; 
      width: 100%;
      max-width: 800px;
      border-radius: 4px;
      border: 1px solid var(--gold);
      box-shadow: 0 20px 60px rgba(0,0,0,1);
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }
    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(212, 175, 55, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0A0A0A;
    }
    .modal-header h3 { color: var(--gold); margin: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .close-modal-btn { background: transparent; border: none; color: #fff; cursor: pointer; }
    .close-modal-btn:hover { color: var(--gold); }
    .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
    
    .action-bar { margin-bottom: 1rem; display: flex; justify-content: flex-end; }
    
    /* Tables */
    .admin-table-container { background: #111; border-radius: 4px; border: 1px solid #222; }
    .admin-table { width: 100%; border-collapse: collapse; color: #ccc; font-size: 0.85rem; }
    .admin-table th { background: #181818; color: var(--gold); text-align: left; padding: 12px; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; }
    .admin-table td { padding: 12px; border-bottom: 1px solid #222; }
    .admin-table tr:hover { background: rgba(255,255,255,0.02); }
    .actions { display: flex; gap: 8px; }
    .btn-icon { background: none; border: 1px solid #333; padding: 4px 8px; border-radius: 4px; cursor: pointer; color: #fff; filter: grayscale(1); }
    .btn-icon:hover { border-color: var(--gold); filter: none; }
    .btn-icon.delete:hover { border-color: #ff4d4d; }

    /* Forms */
    .admin-form { display: flex; flex-direction: column; gap: 1rem; background: #111; padding: 1.5rem; border-radius: 4px; }
    .form-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; align-items: center; }
    .form-header h4 { color: var(--gold); margin: 0; }
    .form-row { display: flex; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; flex: 1; margin-bottom: 1rem; }
    .form-group label { font-size: 0.75rem; color: #999; margin-bottom: 0.4rem; font-weight: 600; text-transform: uppercase; }
    .form-group input, .form-group select, .form-group textarea {
      background: #181818;
      border: 1px solid #333;
      padding: 10px; color: #fff; border-radius: 2px;
      outline: none; transition: border-color 0.3s;
    }
    .form-group input:focus { border-color: var(--gold); }
    .checkbox-group { flex-direction: row; align-items: center; gap: 0.8rem; }
    .checkbox-group label { margin: 0; cursor: pointer; text-transform: none; }
    
    .btn-gold { background: var(--gold); color: #000; border: none; padding: 10px 24px; font-weight: 700; cursor: pointer; transition: all 0.3s; border-radius: 2px; }
    .btn-gold:hover { background: #E8C97A; transform: translateY(-1px); }
    .btn-gold:disabled { background: #555; color: #999; cursor: not-allowed; }
  `]
})
export class AdminPanelComponent implements OnInit {
  productService = inject(ProductService);
  authService = inject(AuthService);
  userService = inject(UserService);

  @Output() onDataChanged = new EventEmitter<void>();

  isOpen = signal(false);
  isSaving = signal(false);
  tab = signal<'manage-products'|'users'|'categories'>('manage-products');
  showForm = signal(false);
  
  productos = signal<Producto[]>([]);
  users = signal<User[]>([]);
  
  editingId = signal<string | null>(null);

  productoForm: Partial<Producto> = {
    nombre: '', categoria: '', material: '', precio: 0, stock: 0, descripcion: '', imagen: '', destacado: false
  };

  categoriaForm = { name: '', img: '' };

  ngOnInit() {}

  openPanel() {
    this.isOpen.set(true);
    this.loadInitialData();
  }

  loadInitialData() {
    this.productService.getProductos().subscribe((res: any) => {
      if(res.status === 'ok') this.productos.set(res.data);
    });
    this.userService.getUsers().subscribe((res: any) => {
      if(res.status === 'success') this.users.set(res.data.users);
    });
  }

  resetForm() {
    this.editingId.set(null);
    this.productoForm = { nombre: '', categoria: '', material: '', precio: 0, stock: 0, descripcion: '', imagen: '', destacado: false };
  }

  editProduct(p: Producto) {
    this.editingId.set(p._id!);
    this.productoForm = { ...p };
    this.showForm.set(true);
  }

  saveProduct() {
    if (!this.productoForm.nombre || !this.productoForm.categoria) {
      alert("Por favor completa los campos requeridos.");
      return;
    }
    
    this.isSaving.set(true);
    const obs = this.editingId() 
      ? this.productService.updateProducto(this.editingId()!, this.productoForm as Producto)
      : this.productService.createProducto(this.productoForm as Producto);

    obs.subscribe({
      next: (res: any) => {
        if(res.status === 'ok') {
           alert("¡Producto " + (this.editingId() ? 'actualizado' : 'guardado') + " exitosamente!");
           this.resetForm();
           this.showForm.set(false);
           this.loadInitialData();
           this.onDataChanged.emit();
        }
        this.isSaving.set(false);
      },
      error: (err: any) => {
        alert("Error: " + (err.error?.message || err.message));
        this.isSaving.set(false);
      }
    });
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Eliminar este producto?')) {
      this.productService.deleteProducto(id).subscribe(() => {
        this.loadInitialData();
        this.onDataChanged.emit();
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('¿Eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadInitialData();
      });
    }
  }

  makeAdmin(u: User) {
    if (confirm('¿Convertir a ' + u.nombre + ' en administrador?')) {
      this.userService.updateUser(u._id, { rol: 'admin' }).subscribe(() => {
        this.loadInitialData();
      });
    }
  }

  saveCategory() {
    if (!this.categoriaForm.name || !this.categoriaForm.img) {
      alert("Por favor completa los campos requeridos.");
      return;
    }
    
    this.isSaving.set(true);
    this.productService.createCategory(this.categoriaForm).subscribe({
      next: (res: any) => {
        if(res.status === 'ok') {
           alert("¡Categoría guardada exitosamente!");
           this.categoriaForm = { name: '', img: '' };
           this.onDataChanged.emit();
        }
        this.isSaving.set(false);
      },
      error: (err: any) => {
        alert("Error: " + (err.error?.message || err.message));
        this.isSaving.set(false);
      }
    });
  }
}
