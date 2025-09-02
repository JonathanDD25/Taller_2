const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const JWT_SECRET = "secret";
const JWT_EXPIRATION = "1h";

class AuthController {

  // Registro de nuevos usuarios
  async registrarUsuario(userdata) {
    try {
      // Verificar si el email ya existe
      const [existeEmail] = await db.query(
        'SELECT email FROM usuarios WHERE email = ?',
        [userdata.email]
      );

      if (existeEmail.length > 0) {
        return {
          success: false,
          message: 'El email ya está registrado'
        };
      }

      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userdata.clave, saltRounds);

      // Crear el objeto de usuario con la contraseña encriptada
      const usuario = {
        ...userdata,
        clave: hashedPassword
      };

      // Insertar el usuario en la base de datos
      const [resultado] = await db.query(
        'INSERT INTO usuarios SET ?',
        [usuario]
      );

      return {
        success: true,
        message: 'Usuario registrado correctamente',
        userId: resultado.insertId
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  // Inicio de sesión
  async iniciarSesion(email, clave) {
    try {
      // Buscar el usuario por email
      const [usuarios] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );

      if (usuarios.length === 0) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      const usuario = usuarios[0];

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(clave, usuario.clave);

      if (!passwordMatch) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Crear un objeto con los datos del usuario (excluyendo la contraseña)
      const usuarioData = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      };

      const token = jwt.sign(usuarioData,JWT_SECRET, { expiresIn: JWT_EXPIRATION});

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  // Verificar si un usuario está autenticado
  async verificarUsuario(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id_usuario; 

        const [usuarios] = await db.query(
            'SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = ?',
            [userId]
        );

        if (usuarios.length === 0) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        return {
            success: true,
            usuario: usuarios[0]
        };

    } catch (error) {
        console.error('Error al verificar usuario:', error);
        
        if (error.name === 'TokenExpiredError') {
            return { success: false, message: 'Token expirado' };
        }
        if (error.name === 'JsonWebTokenError') {
            return { success: false, message: 'Token inválido' };
        }

        throw error;
    }
}
}

module.exports = new AuthController();