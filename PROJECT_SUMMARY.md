# 📦 Agenda de Contactos - Resumen del Proyecto

## 🎯 Objetivo del Proyecto
Aplicación web para gestionar una agenda de contactos con almacenamiento de fotos en AWS S3 y base de datos MySQL RDS, desplegable en AWS EC2.

---

## ✅ Funcionalidades Implementadas

### CRUD Completo
- ✅ **Crear** contactos con datos personales y foto
- ✅ **Listar** todos los contactos con sus fotos
- ✅ **Modificar** información y fotos de contactos existentes
- ✅ **Eliminar** contactos (incluyendo fotos de S3)
- ✅ **Buscar** contactos por apellido

### Datos del Contacto
- ID (auto-generado)
- Nombre
- Apellidos
- Correo electrónico (único)
- Fecha de nacimiento
- Foto (almacenada en S3)

---

## 🏗️ Arquitectura de la Solución

```
┌─────────────────┐
│   Cliente Web   │
│   (Navegador)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Node.js API   │
│   (Express.js)  │
│   Puerto 3000   │
└────┬─────┬──────┘
     │     │
     │     └──────────────┐
     │                    │
     ▼                    ▼
┌─────────────┐    ┌──────────────┐
│   MySQL     │    │   AWS S3     │
│   Database  │    │   (Fotos)    │
│   (RDS)     │    │              │
└─────────────┘    └──────────────┘
```

---

## 📁 Estructura del Proyecto

```
nubelab13/
├── config/
│   ├── database.js          # Configuración de MySQL/RDS
│   └── aws.js              # Configuración de AWS S3
├── middleware/
│   └── upload.js           # Manejo de archivos con Multer
├── models/
│   └── Contacto.js         # Modelo de datos y lógica de negocio
├── routes/
│   └── contactos.js        # Rutas de la API REST
├── public/
│   └── index.html          # Interfaz web completa
├── database/
│   └── init.sql            # Script SQL de inicialización
├── server.js               # Servidor principal
├── package.json            # Dependencias del proyecto
├── .env.example            # Ejemplo de configuración
├── README.md               # Documentación principal
├── AWS_DEPLOYMENT.md       # Guía de despliegue en AWS
├── QUICKSTART.md           # Inicio rápido
└── TESTING.md              # Guía de pruebas
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** (v14+) - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL2** - Cliente de base de datos
- **AWS SDK** - Integración con servicios AWS
- **Multer** - Manejo de archivos multipart
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos con gradientes
- **JavaScript Vanilla** - Interactividad

### Infraestructura AWS
- **EC2** - Servidor de aplicaciones (Ubuntu)
- **RDS MySQL** - Base de datos como servicio
- **S3** - Almacenamiento de archivos (fotos)
- **IAM** - Gestión de permisos

### Herramientas Adicionales
- **PM2** - Gestor de procesos Node.js
- **Nginx** - Proxy inverso (opcional)

---

## 📊 API REST Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contactos` | Listar todos los contactos |
| GET | `/api/contactos/:id` | Obtener contacto por ID |
| GET | `/api/contactos/buscar/apellido?apellido=X` | Buscar por apellido |
| POST | `/api/contactos` | Crear nuevo contacto |
| PUT | `/api/contactos/:id` | Actualizar contacto |
| DELETE | `/api/contactos/:id` | Eliminar contacto |
| GET | `/health` | Health check |

---

## 🗄️ Esquema de Base de Datos

```sql
contactos
├── id (INT, PK, AUTO_INCREMENT)
├── nombre (VARCHAR(100))
├── apellidos (VARCHAR(100))
├── correo (VARCHAR(150), UNIQUE)
├── fecha_nac (DATE)
├── foto (VARCHAR(500))
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

**Índices:**
- Primary Key: `id`
- Unique: `correo`
- Index: `apellidos` (para búsquedas rápidas)

---

## 🚀 Guías de Uso

### Para Desarrollo Local
1. **Inicio Rápido:** `QUICKSTART.md`
2. **Documentación Completa:** `README.md`
3. **Pruebas:** `TESTING.md`

### Para Despliegue en AWS
1. **Guía Completa AWS:** `AWS_DEPLOYMENT.md`
2. Incluye configuración de:
   - RDS (MySQL)
   - S3 (Bucket)
   - EC2 (Ubuntu Server)
   - Grupos de Seguridad
   - PM2 y Nginx

---

## ⚙️ Configuración Rápida

### 1. Instalación Local
```powershell
# Clonar/extraer proyecto
cd nubelab13

# Instalar dependencias
npm install

# Configurar entorno
copy .env.example .env
notepad .env

# Iniciar aplicación
npm start
```

### 2. Acceder
```
http://localhost:3000
```

### 3. Configurar AWS S3 (Obligatorio)
Ver sección "Configuración de AWS S3" en `QUICKSTART.md`

---

## 🔒 Seguridad Implementada

- ✅ Variables de entorno para credenciales
- ✅ Validación de tipos de archivo (solo imágenes)
- ✅ Límite de tamaño de archivo (5MB)
- ✅ Validación de campos obligatorios
- ✅ Email único (sin duplicados)
- ✅ Consultas preparadas (previene SQL injection)
- ✅ CORS configurado
- ✅ Gestión de permisos IAM en AWS

---

## 📈 Características Destacadas

### Gestión Inteligente de Archivos
- Subida automática a S3
- URLs públicas accesibles
- Eliminación automática al actualizar/borrar
- Validación de formatos y tamaños

### Interfaz Moderna
- Diseño responsive (móvil/tablet/desktop)
- Efectos visuales con CSS3
- Búsqueda en tiempo real
- Feedback visual de operaciones
- Sin necesidad de framework frontend

### Escalabilidad
- Pool de conexiones MySQL
- Gestión eficiente de memoria
- Preparado para alta concurrencia
- Compatible con servicios AWS administrados

---

## 🧪 Testing

### Tipos de Pruebas Disponibles
- ✅ Pruebas de interfaz web
- ✅ Pruebas de API con cURL
- ✅ Verificación de datos en MySQL
- ✅ Verificación de archivos en S3
- ✅ Pruebas de validación
- ✅ Pruebas de rendimiento
- ✅ Pruebas de seguridad básicas

**Ver:** `TESTING.md` para guía completa

---

## 💰 Estimación de Costos AWS

### Capa Gratuita (12 meses)
- EC2 t2.micro: **GRATIS**
- RDS db.t3.micro: **GRATIS**
- S3 (5GB): **GRATIS**

### Post Capa Gratuita
- **~$23-25/mes** para operación básica
- Ver detalles en `AWS_DEPLOYMENT.md`

---

## 📝 Pasos para el Laboratorio

### Fase 1: Desarrollo Local ✅
1. ✅ Configurar entorno local
2. ✅ Configurar S3 en AWS
3. ✅ Probar aplicación localmente
4. ✅ Verificar funcionalidades

### Fase 2: Despliegue en AWS
1. Crear instancia RDS MySQL
2. Crear bucket S3 (producción)
3. Lanzar instancia EC2 Ubuntu
4. Configurar grupos de seguridad
5. Desplegar aplicación
6. Configurar PM2
7. Configurar Nginx (opcional)
8. Pruebas finales

**Sigue:** `AWS_DEPLOYMENT.md` paso a paso

---

## 🆘 Soporte

### Documentación Disponible
- `README.md` - Información general y configuración local
- `QUICKSTART.md` - Inicio rápido en 5 minutos
- `AWS_DEPLOYMENT.md` - Despliegue completo en AWS
- `TESTING.md` - Guía de pruebas exhaustiva

### Solución de Problemas
Cada documento incluye sección de troubleshooting con:
- Problemas comunes
- Soluciones paso a paso
- Comandos de verificación

---

## ✨ Características Técnicas Avanzadas

### Modelo de Datos
- Auto-incremento de IDs
- Timestamps automáticos
- Validación a nivel de BD
- Índices optimizados

### API REST
- Respuestas JSON estandarizadas
- Códigos HTTP apropiados
- Manejo de errores robusto
- Logging de operaciones

### Almacenamiento
- CDN-ready (S3 URLs públicas)
- Organización por carpetas
- Nombres únicos (UUID)
- Limpieza automática

---

## 🎓 Objetivos de Aprendizaje Cubiertos

✅ Desarrollo de API REST con Node.js
✅ Integración con servicios AWS (S3, RDS, EC2)
✅ Gestión de bases de datos relacionales
✅ Manejo de archivos y uploads
✅ Despliegue en la nube
✅ Configuración de infraestructura
✅ Seguridad básica en aplicaciones web
✅ Gestión de procesos con PM2
✅ Configuración de proxy inverso

---

## 📞 Próximos Pasos Sugeridos

### Mejoras Opcionales
- [ ] Implementar autenticación de usuarios
- [ ] Agregar paginación a la lista
- [ ] Implementar filtros avanzados
- [ ] Agregar campos personalizados
- [ ] Implementar exportación a CSV/PDF
- [ ] Agregar API de geolocalización
- [ ] Implementar notificaciones
- [ ] Agregar modo oscuro

### Optimizaciones
- [ ] Implementar caché con Redis
- [ ] Agregar CDN para assets estáticos
- [ ] Implementar búsqueda full-text
- [ ] Optimizar queries con índices adicionales
- [ ] Implementar lazy loading de imágenes

---

## 📄 Licencia

Este proyecto es para fines educativos del laboratorio.

---

## 🎉 Conclusión

Has creado exitosamente una aplicación completa de gestión de contactos con:
- ✅ Backend robusto en Node.js
- ✅ Integración completa con AWS
- ✅ Interfaz web funcional
- ✅ Base de datos relacional
- ✅ Almacenamiento en la nube
- ✅ Preparada para producción

**¡Excelente trabajo!** 🚀

---

**Fecha de creación:** Noviembre 2025  
**Versión:** 1.0.0  
**Autor:** Laboratorio de Cloud Computing
