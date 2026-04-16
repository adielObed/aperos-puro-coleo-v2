import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="authService.showAuthModal()" (click)="close()">
      <div class="modal-content animate-fadeInUp" (click)="$event.stopPropagation()">
        <div class="modal-header">
           <div class="logo-area">
             <span class="logo-text">APEROS</span>
             <span class="logo-text logo-text--gold">PURO COLEO</span>
           </div>
           <button class="close-modal-btn" (click)="close()">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>

        <div class="modal-tabs">
           <button [class.active]="mode() === 'login'" (click)="mode.set('login')">INICIAR SESIÓN</button>
           <button [class.active]="mode() === 'register'" (click)="mode.set('register')">REGISTRARSE</button>
        </div>

        <div class="modal-body">
           <div class="auth-desc">
             {{ mode() === 'login' ? 'Bienvenido de nuevo a la tradición.' : 'Únete a la élite del coleo y la elegancia.' }}
           </div>

           <div *ngIf="error()" class="error-msg">{{ error() }}</div>
           <div *ngIf="success()" class="success-msg">
             <span class="success-icon">✔️</span>
             <p>{{ success() }}</p>
           </div>

           <!-- LOGIN -->
           <form *ngIf="mode() === 'login'" (submit)="handleLogin($event)">
             <div class="form-group">
               <label>Correo Electrónico</label>
               <input type="email" [(ngModel)]="loginData.email" name="email" placeholder="ejemplo@correo.com" required>
             </div>
             <div class="form-group">
               <label>Contraseña</label>
               <input type="password" [(ngModel)]="loginData.password" name="password" placeholder="••••••••" required>
             </div>
             <button type="submit" class="btn-gold" style="width:100%; margin-top: 1rem;" [disabled]="loading()">
               {{ loading() ? 'AUTENTICANDO...' : 'ENTRAR A MI CUENTA' }}
             </button>
           </form>

           <!-- REGISTER -->
           <form *ngIf="mode() === 'register'" (submit)="handleRegister($event)">
             <div class="form-group">
               <label>Nombre Completo</label>
               <input type="text" [(ngModel)]="registerData.nombre" name="nombre" placeholder="Tu nombre" required>
             </div>
             <div class="form-group">
               <label>Correo Electrónico</label>
               <input type="email" [(ngModel)]="registerData.email" name="email" placeholder="ejemplo@correo.com" required>
             </div>
             <div class="form-group">
               <label>Contraseña</label>
               <input type="password" [(ngModel)]="registerData.password" name="password" placeholder="Mínimo 6 caracteres" required>
             </div>
             <!-- OPCIÓN ADMIN SOLO PARA PRUEBAS -->
             <div class="form-group checkbox-group" style="margin-top: 10px;">
                <input type="checkbox" id="adminCheck" [(ngModel)]="registerData.rol" name="rol" (change)="registerData.rol = $any($event.target).checked ? 'admin' : 'customer'">
                <label for="adminCheck" style="color:var(--gold); font-size: 0.7rem; cursor:pointer;">MODO ADMINISTRADOR (SOLO DESARROLLO)</label>
             </div>
             <button type="submit" class="btn-gold" style="width:100%; margin-top: 1rem;" [disabled]="loading()">
               {{ loading() ? 'CREANDO CUENTA...' : 'CREAR MI CUENTA' }}
             </button>
           </form>
        </div>

        <div class="modal-footer" *ngIf="mode() === 'login'">
           <a href="#" (click)="$event.preventDefault()">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      z-index: 5000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
    }
    .modal-content {
      background: #0A0A0A;
      width: 100%;
      max-width: 450px;
      border: 1px solid var(--gold);
      border-radius: 4px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    }
    .logo-area .logo-text { font-size: 1.2rem; }
    .modal-tabs {
      display: flex;
      background: #111;
    }
    .modal-tabs button {
      flex: 1;
      padding: 1rem;
      background: transparent;
      border: none;
      color: #777;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s;
    }
    .modal-tabs button.active {
      color: var(--gold);
      background: rgba(212, 175, 55, 0.05);
      border-bottom: 2px solid var(--gold);
    }
    .modal-body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .auth-desc {
      color: #999;
      font-size: 0.9rem;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .error-msg {
      background: rgba(255, 0, 0, 0.1);
      color: #ff6b6b;
      padding: 0.8rem;
      border-radius: 4px;
      font-size: 0.85rem;
      text-align: center;
      border: 1px solid rgba(255, 0, 0, 0.2);
    }
    .success-msg {
      background: rgba(212, 175, 55, 0.1);
      color: var(--gold);
      padding: 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      text-align: center;
      border: 1px solid var(--gold);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .success-icon {
      font-size: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.2rem;
    }
    .form-group label {
      font-size: 0.75rem;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .form-group input {
      background: #151515;
      border: 1px solid #333;
      padding: 12px;
      color: #fff;
      border-radius: 2px;
      outline: none;
      transition: border-color 0.3s;
    }
    .form-group input:focus {
      border-color: var(--gold);
    }
    .modal-footer {
      padding: 1rem 2rem 2rem;
      text-align: center;
    }
    .modal-footer a {
      color: #666;
      font-size: 0.8rem;
      text-decoration: underline;
    }
    .modal-footer a:hover { color: var(--gold); }
    .close-modal-btn { background: transparent; border: none; color: #fff; cursor: pointer; }
    .close-modal-btn:hover { color: var(--gold); }
  `]
})
export class AuthComponent {
  authService = inject(AuthService);
  
  mode = this.authService.authMode;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  loginData = { email: '', password: '' };
  registerData = { nombre: '', email: '', password: '', rol: 'customer' };

  close() {
    this.authService.showAuthModal.set(false);
    this.error.set(null);
    this.success.set(null);
  }

  handleLogin(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.close();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al iniciar sesión');
      }
    });
  }

  handleRegister(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set('¡Registro exitoso! Bienvenido a Aperos Puro Coleo.');
        setTimeout(() => this.close(), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al registrarse');
      }
    });
  }
}
