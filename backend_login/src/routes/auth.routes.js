const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ==============================
// Ruta para registrar un nuevo usuario
// ==============================
router.post('/registro', async (req, res) => {
    try {
        const resultado = await authController.registrarUsuario(req.body);
        res.json(resultado);
    } catch (error) {
        console.error('Error en ruta de registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
});

// ==============================
// Ruta para iniciar sesión
// ==============================
router.post('/login', async (req, res) => {
    try {
        const { email, clave } = req.body;
        const resultado = await authController.iniciarSesion(email, clave);

        if (resultado.success) {
            // Aquí se podrían establecer sesiones o JWT
            res.json(resultado);
        } else {
            res.status(401).json(resultado);
        }
    } catch (error) {
        console.error('Error en ruta de login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
});

// ==============================
// Ruta para verificar si un usuario está autenticado
// ==============================
router.get('/verificar', async (req, res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token no proporcionado' });
        }

        const resultado = await authController.verificarUsuario(token);
        res.json(resultado);

    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar usuario'
        });
    }
});

module.exports = router;