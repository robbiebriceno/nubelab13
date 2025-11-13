# 🚀 Guía de Inicio - Agenda de Contactos

## 📌 Opción 1: Inicio Automático (Recomendado)

### Windows PowerShell

```powershell
# 1. Navegar al directorio del proyecto
cd C:\Users\robbie\Desktop\nubelab13

# 2. Ejecutar script de configuración
.\setup.ps1

# 3. Configurar archivo .env cuando se solicite
# (El script pausará para que lo hagas)

# 4. Iniciar la aplicación
npm start
```

---

## 📌 Opción 2: Inicio Manual Paso a Paso

### Paso 1: Instalar Dependencias

```powershell
npm install
```

**Dependencias que se instalarán:**
- express (framework web)
- mysql2 (cliente MySQL)
- aws-sdk (servicios AWS)
- multer (manejo de archivos)
- dotenv (variables de entorno)
- cors (CORS headers)
- uuid (generador de IDs únicos)

### Paso 2: Configurar Variables de Entorno

```powershell
# Copiar archivo de ejemplo
copy .env.example .env

# Editar con tus credenciales
notepad .env
```

**Configuración mínima requerida:**

```env
# Servidor
PORT=3000

# MySQL Local
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=[TU_PASSWORD_MYSQL]
DB_NAME=agenda_contactos
DB_PORT=3306

# AWS S3 (OBLIGATORIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=[TU_ACCESS_KEY]
AWS_SECRET_ACCESS_KEY=[TU_SECRET_KEY]
S3_BUCKET_NAME=[TU_BUCKET_NAME]
```

### Paso 3: Configurar AWS S3

⚠️ **IMPORTANTE:** Debes hacer esto ANTES de iniciar la aplicación

1. **Crear Bucket S3:**
   - Ve a AWS Console → S3
   - Click "Crear bucket"
   - Nombre: `agenda-contactos-fotos-tunombre`
   - Región: `us-east-1`
   - Desmarcar "Bloquear acceso público"
   - Crear

2. **Crear Usuario IAM:**
   - Ve a AWS Console → IAM → Usuarios
   - Click "Crear usuario"
   - Nombre: `agenda-app-user`
   - Permisos: Adjuntar `AmazonS3FullAccess`
   - Crear clave de acceso
   - Guardar Access Key ID y Secret Access Key

3. **Actualizar .env con las credenciales**

### Paso 4: Configurar MySQL

**Opción A: La aplicación crea la BD automáticamente**
```powershell
# Solo asegúrate de que MySQL esté corriendo
# La app creará la BD y tabla automáticamente
```

**Opción B: Crear manualmente (opcional)**
```sql
mysql -u root -p

CREATE DATABASE agenda_contactos;
USE agenda_contactos;

-- La tabla se creará automáticamente, pero si quieres hacerlo manual:
source database/init.sql
```

### Paso 5: Iniciar la Aplicación

```powershell
npm start
```

**Salida esperada:**
```
╔════════════════════════════════════════════════════════╗
║     🚀 SERVIDOR INICIADO CORRECTAMENTE                ║
╠════════════════════════════════════════════════════════╣
║  Puerto: 3000                                       
║  URL: http://localhost:3000                        
║  API: http://localhost:3000/api/contactos          
╠════════════════════════════════════════════════════════╣
║  📋 Base de datos: agenda_contactos             
║  ☁️  S3 Bucket: agenda-contactos-fotos         
╚════════════════════════════════════════════════════════╝
```

### Paso 6: Abrir en el Navegador

```
http://localhost:3000
```

---

## 🔧 Comandos Útiles

### Desarrollo con Auto-Reinicio

```powershell
npm run dev
```

Usa **nodemon** para reiniciar automáticamente cuando cambies archivos.

### Verificar Estado

```powershell
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar MySQL
mysql --version

# Probar conexión MySQL
mysql -u root -p -e "SELECT 1"
```

### Probar API desde PowerShell

```powershell
# Health Check
Invoke-WebRequest -Uri "http://localhost:3000/health"

# Listar contactos
Invoke-RestMethod -Uri "http://localhost:3000/api/contactos"
```

---

## 📱 Probar la Aplicación

### 1. Crear tu primer contacto

1. Abre http://localhost:3000
2. Completa el formulario:
   - Nombre: `Juan`
   - Apellidos: `Pérez`
   - Correo: `juan@test.com`
   - Fecha: `1990-01-15`
   - Foto: Selecciona una imagen
3. Click "Guardar Contacto"

### 2. Verificar que funciona

✅ El contacto aparece en la lista  
✅ La foto se muestra correctamente  
✅ Los datos están en MySQL  
✅ La foto está en S3  

### 3. Probar búsqueda

1. Escribe un apellido en el campo de búsqueda
2. Click "Buscar"
3. Verifica los resultados

### 4. Probar edición

1. Click "Editar" en una tarjeta
2. Modifica algún dato
3. Click "Actualizar Contacto"

### 5. Probar eliminación

1. Click "Eliminar" en una tarjeta
2. Confirma
3. Verifica que se eliminó

---

## ❌ Solución de Problemas Comunes

### Error: "Cannot find module 'express'"

**Causa:** Dependencias no instaladas  
**Solución:**
```powershell
npm install
```

### Error: "Cannot connect to database"

**Causa:** MySQL no está corriendo o credenciales incorrectas  
**Solución:**
```powershell
# Verificar que MySQL esté corriendo
Get-Service MySQL*

# Si no está corriendo, iniciarlo
Start-Service MySQL80  # o el nombre de tu servicio

# Verificar credenciales en .env
notepad .env
```

### Error: "S3 upload failed"

**Causa:** Credenciales de AWS incorrectas o bucket no existe  
**Solución:**
1. Verifica que el bucket existe en AWS Console
2. Verifica las credenciales en `.env`
3. Verifica los permisos del usuario IAM

### Error: "Port 3000 is already in use"

**Causa:** Otro proceso está usando el puerto  
**Solución:**
```powershell
# Opción 1: Cambiar puerto en .env
# Cambiar PORT=3000 a PORT=3001

# Opción 2: Matar el proceso en el puerto 3000
netstat -ano | findstr :3000
# Busca el PID y:
taskkill /PID [numero_del_pid] /F
```

### Error: ".env file not found"

**Causa:** No copiaste .env.example a .env  
**Solución:**
```powershell
copy .env.example .env
notepad .env
```

### Warning: "File too large"

**Causa:** Imagen mayor a 5MB  
**Solución:**
- Usa una imagen más pequeña
- Comprime la imagen antes de subirla

---

## 🎯 Verificación de Instalación

Ejecuta estos comandos para verificar que todo está listo:

```powershell
# 1. Verificar Node.js (debe ser v14+)
node --version

# 2. Verificar npm
npm --version

# 3. Verificar MySQL
mysql --version

# 4. Verificar dependencias instaladas
npm list --depth=0

# 5. Verificar archivo .env existe
Test-Path .env

# 6. Probar conexión MySQL
mysql -u root -p -e "SHOW DATABASES"
```

**Todos deben pasar ✅**

---

## 📊 Estructura de Archivos Clave

```
nubelab13/
├── .env                    ⚠️ DEBES CREAR ESTE ARCHIVO
├── .env.example           📝 Plantilla para .env
├── server.js              🚀 Punto de entrada
├── package.json           📦 Dependencias
├── README.md              📖 Documentación
├── QUICKSTART.md          ⚡ Inicio rápido
└── AWS_DEPLOYMENT.md      ☁️ Despliegue en AWS
```

---

## 🎓 Siguiente Paso: Desplegar en AWS

Una vez que tu aplicación funcione correctamente en local:

1. ✅ Verifica que todo funciona
2. ✅ Lee `AWS_DEPLOYMENT.md`
3. ✅ Sigue los pasos para:
   - Configurar RDS
   - Configurar EC2
   - Desplegar la aplicación

---

## 📞 Recursos de Ayuda

| Documento | Cuándo Usarlo |
|-----------|---------------|
| `QUICKSTART.md` | Configuración rápida (5 min) |
| `README.md` | Documentación completa |
| `AWS_DEPLOYMENT.md` | Desplegar en AWS |
| `TESTING.md` | Probar funcionalidades |
| `PROJECT_SUMMARY.md` | Visión general del proyecto |

---

## ✅ Checklist Pre-Inicio

Antes de ejecutar `npm start`, verifica:

- [ ] Node.js instalado (v14+)
- [ ] MySQL instalado y corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Bucket S3 creado en AWS
- [ ] Credenciales de AWS configuradas en `.env`
- [ ] Puerto 3000 disponible (o cambiado en `.env`)

Si todo está ✅, ejecuta:
```powershell
npm start
```

---

## 🎉 ¡Listo!

Tu aplicación debería estar corriendo en:
```
http://localhost:3000
```

**¡Disfruta gestionando tus contactos!** 📇✨
