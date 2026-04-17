require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ── 1. CONFIGURACIÓN MIDDLEWARE ──
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'https://aperos-puro-coleo-v2.vercel.app'],
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

// ── 4. INICIAR SERVIDOR (Solo local) ──
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor galopando en http://localhost:${PORT}`);
  });
}

module.exports = app;