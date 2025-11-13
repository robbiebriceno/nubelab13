const express = require('express');
const router = express.Router();
const ContactoModel = require('../models/Contacto');
const upload = require('../middleware/upload');

// Listar todos los contactos
router.get('/', async (req, res) => {
  try {
    const contactos = await ContactoModel.listarTodos();
    res.json({
      success: true,
      data: contactos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
      error: error.message
    });
  }
});

// Buscar contacto por ID
router.get('/:id', async (req, res) => {
  try {
    const contacto = await ContactoModel.buscarPorId(req.params.id);
    if (!contacto) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    res.json({
      success: true,
      data: contacto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el contacto',
      error: error.message
    });
  }
});

// Buscar por apellido
router.get('/buscar/apellido', async (req, res) => {
  try {
    const { apellido } = req.query;
    if (!apellido) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un apellido para buscar'
      });
    }
    const contactos = await ContactoModel.buscarPorApellido(apellido);
    res.json({
      success: true,
      data: contactos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar contactos',
      error: error.message
    });
  }
});

// Crear nuevo contacto
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    
    if (!nombre || !apellidos || !correo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellidos y correo son obligatorios'
      });
    }

    const contacto = await ContactoModel.crear({
      nombre,
      apellidos,
      correo,
      fecha_nac
    }, req.file);

    res.status(201).json({
      success: true,
      message: 'Contacto creado exitosamente',
      data: contacto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el contacto',
      error: error.message
    });
  }
});

// Actualizar contacto
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    
    if (!nombre || !apellidos || !correo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellidos y correo son obligatorios'
      });
    }

    const contacto = await ContactoModel.actualizar(req.params.id, {
      nombre,
      apellidos,
      correo,
      fecha_nac
    }, req.file);

    res.json({
      success: true,
      message: 'Contacto actualizado exitosamente',
      data: contacto
    });
  } catch (error) {
    if (error.message === 'Contacto no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
      error: error.message
    });
  }
});

// Eliminar contacto
router.delete('/:id', async (req, res) => {
  try {
    await ContactoModel.eliminar(req.params.id);
    res.json({
      success: true,
      message: 'Contacto eliminado exitosamente'
    });
  } catch (error) {
    if (error.message === 'Contacto no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
      error: error.message
    });
  }
});

module.exports = router;
