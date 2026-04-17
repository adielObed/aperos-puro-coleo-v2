const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🤠 ¡Conectado a la base de datos de Aperos Puro Coleo!');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    // No salimos del proceso para evitar que Vercel marque el despliegue como fallido por pre-warm
  }
};

module.exports = connectDB;
