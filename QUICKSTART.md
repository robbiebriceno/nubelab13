# 🚀 Guía Rápida de Inicio

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar archivo .env

Copia `.env.example` a `.env` y edita con tus credenciales:

```powershell
copy .env.example .env
notepad .env
```

### 3. Configurar credenciales

Necesitas configurar:
- ✅ **MySQL local** (localhost)
- ✅ **AWS S3** (obligatorio - ver sección AWS S3)

### 4. Iniciar la aplicación

```powershell
npm start
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

---

## 📝 Configuración de MySQL Local

### Opción A: Crear base de datos manualmente

```sql
CREATE DATABASE agenda_contactos;
```

### Opción B: La aplicación la crea automáticamente

La aplicación creará automáticamente la base de datos y tabla al iniciar.

---

## ☁️ Configuración de AWS S3 (OBLIGATORIO)

### Paso 1: Crear Bucket S3

1. Ve a **AWS Console → S3**
2. Click en **"Crear bucket"**
3. Nombre: `agenda-contactos-fotos` (o el que prefieras)
4. Región: `us-east-1`
5. **Desmarcar** "Bloquear todo el acceso público"
6. Click en **"Crear bucket"**

### Paso 2: Configurar permisos del bucket

1. Ve al bucket → **Permisos** → **Política del bucket**
2. Pega esto (reemplaza `TU-BUCKET`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::TU-BUCKET/*"
        }
    ]
}
```

### Paso 3: Crear credenciales de AWS

1. Ve a **IAM → Usuarios → Crear usuario**
2. Nombre: `agenda-app-user`
3. Permisos: `AmazonS3FullAccess`
4. Crear **clave de acceso**
5. Guarda el **Access Key ID** y **Secret Access Key**

### Paso 4: Configurar en .env

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
S3_BUCKET_NAME=agenda-contactos-fotos
```

---

## 🧪 Probar que funciona

### 1. Abrir la aplicación

```
http://localhost:3000
```

### 2. Crear un contacto de prueba

- Nombre: Juan
- Apellidos: Pérez
- Correo: juan@test.com
- Fecha: 1990-01-01
- Foto: Selecciona una imagen

### 3. Verificar

- ✅ El contacto aparece en la lista
- ✅ La foto se muestra correctamente
- ✅ La foto está en S3 (ve a tu bucket en AWS)
- ✅ Los datos están en MySQL

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que MySQL esté corriendo
2. Verifica usuario y contraseña en `.env`
3. Crea la base de datos manualmente si es necesario

### Error: "S3 upload failed"

**Solución:**
1. Verifica las credenciales de AWS en `.env`
2. Verifica que el bucket existe
3. Verifica los permisos del usuario IAM

### Error: "Address already in use"

**Solución:**
Otro proceso está usando el puerto 3000. Cámbialo en `.env`:
```env
PORT=3001
```

---

## 📚 Próximos Pasos

Una vez que funcione en local:

1. ✅ Lee `AWS_DEPLOYMENT.md` para desplegar en AWS
2. ✅ Configura RDS para la base de datos en la nube
3. ✅ Configura EC2 para el servidor

---

## 🆘 ¿Necesitas ayuda?

- 📖 Lee el `README.md` completo
- ☁️ Para despliegue en AWS: `AWS_DEPLOYMENT.md`
- 🔧 Revisa los logs en la consola
- 📧 Contacta al administrador

---

## ✅ Checklist de Configuración

Antes de iniciar, asegúrate de tener:

- [ ] Node.js instalado (v14+)
- [ ] MySQL instalado y corriendo
- [ ] Cuenta de AWS creada
- [ ] Bucket S3 creado
- [ ] Credenciales de AWS configuradas
- [ ] Archivo `.env` configurado correctamente
- [ ] Dependencias instaladas (`npm install`)

¡Listo! Ahora ejecuta `npm start` 🚀
