-- Script para crear la base de datos manualmente en MySQL local

CREATE DATABASE IF NOT EXISTS agenda_contactos;

USE agenda_contactos;

CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  fecha_nac DATE,
  foto VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_apellidos (apellidos),
  INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo (opcional)
INSERT INTO contactos (nombre, apellidos, correo, fecha_nac) VALUES
('Juan', 'Pérez García', 'juan.perez@example.com', '1990-05-15'),
('María', 'López Martínez', 'maria.lopez@example.com', '1985-08-22'),
('Carlos', 'Sánchez Pérez', 'carlos.sanchez@example.com', '1992-03-10'),
('Ana', 'García Rodríguez', 'ana.garcia@example.com', '1988-11-30'),
('Luis', 'Martínez Pérez', 'luis.martinez@example.com', '1995-07-18');

-- Verificar datos
SELECT * FROM contactos;
