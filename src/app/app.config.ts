import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. AGREGA ESTA IMPORTACIÓN AQUÍ ARRIBA
import { provideHttpClient } from '@angular/common/http'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. AGREGA ESTA LÍNEA EN LOS PROVIDERS
    provideHttpClient() 
  ]
};