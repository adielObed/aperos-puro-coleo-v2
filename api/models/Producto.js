const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: String,
  material: String,
  descripcion: String,
  imagen: String,
  destacado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Producto', ProductoSchema);