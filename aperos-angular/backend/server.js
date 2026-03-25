require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // IMPORTANTE: Debe estar arriba
const cors = require('cors');

const app = express();

// ── 1. CONFIGURACIÓN MIDDLEWARE ──
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// ── 2. CONEXIÓN A MONGODB ATLAS ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🤠 ¡Conectado a la base de datos de Aperos Puro Coleo!'))
  .catch(err => console.error('❌ Error de conexión:', err));

// ── 3. MODELOS ──
const Producto = require('./models/Producto');
const Category = require('./models/Category'); 

// ── 4. RUTAS DE CATEGORÍAS ──
app.post('/api/categories', async (req, res) => {
  try {
    const nuevaCat = new Category(req.body);
    await nuevaCat.save();
    res.status(201).json({ status: 'ok', data: nuevaCat });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categorias = await Category.find({ active: true });
    res.json({ status: 'ok', data: categorias });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ── 5. RUTAS DE PRODUCTOS ──
app.post('/api/productos', async (req, res) => {
  try {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.status(201).json({ status: 'ok', message: 'Producto guardado', data: nuevo });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    // Si necesitas filtrar, lo puedes manejar aquí también, pero para iniciar, mandamos todos
    const productos = await Producto.find();
    res.json({ status: 'ok', total: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// ── ACTUALIZAR UN PRODUCTO (PUT) ──
app.put('/api/productos/:id', async (req, res) => {
  try {
    // Busca por ID y actualiza con lo que enviamos en el body
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Esto hace que nos devuelva el producto ya modificado
    );
    
    if (!productoActualizado) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    res.json({ status: 'ok', message: '¡Producto actualizado!', data: productoActualizado });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// ── ELIMINAR UN PRODUCTO (DELETE) ──
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    
    if (!productoEliminado) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    res.json({ status: 'ok', message: '¡Producto eliminado para siempre!' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// ── 6. INICIAR SERVIDOR ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor galopando en http://localhost:${PORT}`);
});