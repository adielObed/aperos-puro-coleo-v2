require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// ── 1. CONFIGURACIÓN MIDDLEWARE ──
const allowedOrigins = [
  'http://localhost:4200', 
  'http://127.0.0.1:4200'
];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// ── 2. CONEXIÓN A MONGODB ──
connectDB();

// ── 3. RUTAS ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/users', require('./routes/user.routes'));

// ── 3. SERVIR FRONTEND (INTEGRACIÓN) ──
// Servir archivos estáticos desde la carpeta de build de Angular
const frontendPath = path.join(__dirname, '../dist/browser');
app.use(express.static(frontendPath));

// Ruta comodín para manejar el routing de Angular (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── 4. INICIAR SERVIDOR ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor galopando en el puerto ${PORT}`);
});

module.exports = app;