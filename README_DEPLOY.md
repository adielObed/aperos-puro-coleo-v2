# 🚀 Despliegue en DigitalOcean - Guía Rápida

Este proyecto está estructurado para ser desplegado en **DigitalOcean App Platform**.

## Estructura
- **Frontend**: Angular (en la raíz)
- **Backend**: Node.js/Express (en carpeta `/api`)

## Pasos para el Despliegue

### 1. Preparar el Repositorio
- Asegúrate de haber subido todos los cambios a GitHub/GitLab.
- El archivo `.env` en `/api` **NO** debe subirse. Las variables se configuran en el panel de DO.

### 2. Crear la App en DigitalOcean
1. Ve a **Apps** -> **Create**.
2. Selecciona tu repositorio.
3. DigitalOcean detectará los componentes automáticamente o deberás añadirlos:

#### Componente 1: Frontend (Web Service / Static Site)
- **Nombre**: `aperos-frontend`
- **Source Directory**: `/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/browser` (Confirmado por build local)
- **HTTP Port**: `80` (si es Static Site) o `4200` (si es Web Service)

#### Componente 2: Backend (Web Service)
- **Nombre**: `aperos-backend`
- **Source Directory**: `/api`
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **HTTP Port**: `3000`
- **Variables de Entorno**:
  - `MONGO_URI`: (Tu cadena de conexión)
  - `JWT_SECRET`: (Tu clave secreta)
  - `NODE_ENV`: `production`
  - `PORT`: `3000`

### 3. Sincronizar Frontend con Backend
Una vez desplegado el backend, obtendrás una URL (ej: `https://aperos-backend-xyz.ondigitalocean.app`).
Debes actualizar el archivo `src/environments/environment.production.ts` con esa URL en `apiUrl` y hacer push.

---
🤠 **¡Listo para galopar en la nube!**
