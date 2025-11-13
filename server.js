const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const contactosRoutes = require('./routes/contactos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/contactos', contactosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Inicializar base de datos
    await initDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║     🚀 SERVIDOR INICIADO CORRECTAMENTE                ║
╠════════════════════════════════════════════════════════╣
║  Puerto: ${PORT}                                       
║  URL: http://localhost:${PORT}                        
║  API: http://localhost:${PORT}/api/contactos          
╠════════════════════════════════════════════════════════╣
║  📋 Base de datos: ${process.env.DB_NAME}             
║  ☁️  S3 Bucket: ${process.env.S3_BUCKET_NAME}         
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
