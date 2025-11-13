# � Agenda de Contactos - Node.js + AWS

> Aplicación web completa para gestionar contactos con almacenamiento de fotos en AWS S3 y base de datos MySQL RDS

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0-orange.svg)](https://www.mysql.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-yellow.svg)](https://aws.amazon.com/s3/)
[![License](https://img.shields.io/badge/License-Educational-red.svg)]()

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────┐
│  📇 Agenda de Contactos                                 │
│  Gestiona tus contactos de manera fácil y eficiente     │
├─────────────────────────────────────────────────────────┤
│  [Nuevo Contacto]          [� Buscar por apellido...]  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  [Foto]  │  │  [Foto]  │  │  [Foto]  │             │
│  │ Juan P.  │  │ María L. │  │ Carlos S.│             │
│  │ 📧 Email │  │ 📧 Email │  │ 📧 Email │             │
│  │ 🎂 Fecha │  │ 🎂 Fecha │  │ 🎂 Fecha │             │
│  │[✏️][🗑️]  │  │[✏️][🗑️]  │  │[✏️][🗑️]  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

## ✨ Características Principales

| Funcionalidad | Descripción | Estado |
|--------------|-------------|---------|
| 📝 **Crear** | Agregar nuevos contactos con foto | ✅ |
| 📋 **Listar** | Ver todos los contactos con sus fotos | ✅ |
| ✏️ **Modificar** | Actualizar información y fotos | ✅ |
| 🗑️ **Eliminar** | Borrar contactos (incluye foto en S3) | ✅ |
| 🔍 **Buscar** | Filtrar contactos por apellido | ✅ |
| ☁️ **S3 Storage** | Almacenamiento de imágenes en la nube | ✅ |
| 🗄️ **MySQL RDS** | Base de datos como servicio | ✅ |

## 🏗️ Arquitectura

```
├── config/
│   ├── aws.js          # Configuración AWS S3
│   └── database.js     # Configuración MySQL
├── middleware/
│   └── upload.js       # Manejo de archivos con Multer
├── models/
│   └── Contacto.js     # Modelo de datos
├── public/
│   └── index.html      # Interfaz de usuario
├── routes/
│   └── contactos.js    # Rutas de la API
├── .env.example        # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js           # Servidor principal
```

## 🛠️ PARTE 1: Instalación y Configuración Local

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL local instalado
- Cuenta de AWS (para S3)

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
copy .env.example .env
```

Edita el archivo `.env` con tus credenciales locales:

```env
PORT=3000

# MySQL Local
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=agenda_contactos
DB_PORT=3306

# AWS S3 (necesario incluso para desarrollo local)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
S3_BUCKET_NAME=agenda-contactos-fotos
```

### Paso 3: Configurar AWS S3 (obligatorio)

1. Ve a AWS Console → S3
2. Crea un nuevo bucket llamado `agenda-contactos-fotos` (o el nombre que prefieras)
3. Configuración del bucket:
   - Región: us-east-1 (o la que prefieras)
   - Desactiva "Bloquear todo el acceso público"
   - Habilita "ACLs"

4. Ve a IAM → Usuarios → Crear usuario
5. Nombre: `agenda-app-user`
6. Permisos: Adjunta la política `AmazonS3FullAccess`
7. Crea las credenciales de acceso y guarda el Access Key ID y Secret Access Key

### Paso 4: Crear la base de datos MySQL local

```sql
CREATE DATABASE agenda_contactos;
```

La tabla se creará automáticamente al iniciar la aplicación.

### Paso 5: Iniciar la aplicación

```bash
npm start
```

O para desarrollo con auto-reinicio:

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

## 🧪 Probar la API con Postman o cURL

### Crear contacto
```bash
curl -X POST http://localhost:3000/api/contactos \
  -F "nombre=Juan" \
  -F "apellidos=Pérez García" \
  -F "correo=juan@example.com" \
  -F "fecha_nac=1990-05-15" \
  -F "foto=@ruta/a/foto.jpg"
```

### Listar contactos
```bash
curl http://localhost:3000/api/contactos
```

### Buscar por apellido
```bash
curl "http://localhost:3000/api/contactos/buscar/apellido?apellido=Pérez"
```

### Actualizar contacto
```bash
curl -X PUT http://localhost:3000/api/contactos/1 \
  -F "nombre=Juan" \
  -F "apellidos=Pérez López" \
  -F "correo=juan@example.com"
```

### Eliminar contacto
```bash
curl -X DELETE http://localhost:3000/api/contactos/1
```

## 📝 Estructura de la Base de Datos

```sql
CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  fecha_nac DATE,
  foto VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Solución de Problemas

### Error: Cannot connect to database
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error: S3 upload failed
- Verifica las credenciales de AWS
- Comprueba que el bucket existe
- Revisa los permisos del usuario IAM

### Error: File too large
- El límite es 5MB por imagen
- Comprime la imagen antes de subirla

---

**Continúa con la PARTE 2 del README para instrucciones de despliegue en AWS** 👇
