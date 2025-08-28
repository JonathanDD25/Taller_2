const express = require('express');
const router = express.Router();
const personasController = require('../controllers/crud.controller');

// ==============================
// Obtener todas las personas
// ==============================
router.get('/', async (req, res) => {
    try {
        const personas = await personasController.obtenerPersonas();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// ==============================
// Obtener una persona por ID
// ==============================
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const persona = await personasController.obtenerPersonaPorId(id);
        if (!persona) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.json(persona);
    } catch (error) {
        console.error('Error al obtener la persona:', error);
        res.status(500).json({ error: 'Error al obtener la persona' });
    }
});

// ==============================
// Insertar una nueva persona
// ==============================
router.post('/', async (req, res) => {
    const nuevaPersona = req.body;
    try {
        const resultado = await personasController.insertarPersona(nuevaPersona);
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al insertar la persona:', error);
        res.status(500).json({ error: 'Error al insertar la persona' });
    }
});

// ==============================
// Actualizar persona por ID
// ==============================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const datosPersona = req.body;

    try {
        const resultado = await personasController.actualizarPersona(id, datosPersona);
        if (!resultado) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.json(resultado);
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// ==============================
// Eliminar persona por ID
// ==============================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await personasController.eliminarPersona(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.json({ mensaje: 'Persona eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;