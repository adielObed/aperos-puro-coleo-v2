const Producto = require('../models/Producto');

const normalizeRegex = (str) => {
  return str
    .replace(/[aáàä]/gi, '[aáàä]')
    .replace(/[eéèë]/gi, '[eéèë]')
    .replace(/[iíìï]/gi, '[iíìï]')
    .replace(/[oóòö]/gi, '[oóòö]')
    .replace(/[uúùü]/gi, '[uúùü]');
};

exports.getProductos = async (req, res) => {
  try {
    let queryObj = {};
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      const normalizedSearch = normalizeRegex(searchTerm);
      const regex = new RegExp(normalizedSearch, 'i');
      
      queryObj = {
        $or: [
          { nombre: { $regex: regex } },
          { descripcion: { $regex: regex } },
          { categoria: { $regex: regex } },
          { material: { $regex: regex } }
        ]
      };
    }

    const productos = await Producto.find(queryObj);
    res.json({ status: 'ok', total: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.status(201).json({ status: 'ok', message: 'Producto guardado', data: nuevo });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!productoActualizado) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'ok', message: '¡Producto actualizado!', data: productoActualizado });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'ok', message: '¡Producto eliminado!' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
