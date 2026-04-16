const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generar Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-ultra-safe-aperos', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Registro de Usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const newUser = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'customer'
    });

    const token = signToken(newUser._id);

    // Ocultar password en la respuesta
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: { user: newUser }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Login de Usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Verificar si email y password existen
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Por favor ingrese email y contraseña' });
    }

    // 2) Buscar usuario y verificar contraseña
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Email o contraseña incorrectos' });
    }

    // 3) Si todo ok, enviar token
    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No has iniciado sesión' });
    }

    // 2) Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-ultra-safe-aperos');

    // 3) Verificar si el usuario aún existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'El usuario ya no existe' });
    }

    // Guardar usuario en la req
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Token inválido' });
  }
};

// Middleware para restringir acceso por rol
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para realizar esta acción'
      });
    }
    next();
  };
};
