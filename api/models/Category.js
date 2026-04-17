const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true
  },
  img: { 
    type: String, 
    required: [true, 'La imagen es obligatoria'] 
  },
  count: { 
    type: Number, 
    default: 0 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Category', CategorySchema);