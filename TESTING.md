# 🧪 Guía de Pruebas de la Aplicación

Esta guía te ayudará a probar todas las funcionalidades de la aplicación tanto en local como en AWS.

---

## 📋 Pruebas en Local

### Prerrequisitos
- ✅ MySQL local corriendo
- ✅ Bucket S3 configurado en AWS
- ✅ Archivo `.env` configurado
- ✅ Aplicación corriendo (`npm start`)

---

## 1️⃣ Prueba de Interfaz Web

### Abrir la aplicación
```
http://localhost:3000
```

### Prueba 1: Crear contacto con foto
1. Completa el formulario:
   - Nombre: `Juan`
   - Apellidos: `Pérez García`
   - Correo: `juan.perez@test.com`
   - Fecha: `1990-05-15`
   - Foto: Selecciona una imagen JPG/PNG
2. Click en "Guardar Contacto"
3. ✅ **Verificar:** El contacto aparece en la lista con su foto

### Prueba 2: Crear contacto sin foto
1. Completa el formulario:
   - Nombre: `María`
   - Apellidos: `López Martínez`
   - Correo: `maria.lopez@test.com`
   - Fecha: `1985-08-22`
   - Foto: No seleccionar
2. Click en "Guardar Contacto"
3. ✅ **Verificar:** El contacto aparece con placeholder "Sin foto"

### Prueba 3: Buscar por apellido
1. En el campo de búsqueda, escribe: `Pérez`
2. Click en "Buscar"
3. ✅ **Verificar:** Solo aparecen contactos con apellido "Pérez"
4. Click en "Ver Todos"
5. ✅ **Verificar:** Aparecen todos los contactos

### Prueba 4: Editar contacto
1. En una tarjeta de contacto, click en "Editar"
2. El formulario se llena con los datos
3. Modifica el nombre a: `Juan Carlos`
4. Opcionalmente cambia la foto
5. Click en "Actualizar Contacto"
6. ✅ **Verificar:** Los cambios se reflejan en la lista

### Prueba 5: Eliminar contacto
1. En una tarjeta de contacto, click en "Eliminar"
2. Confirma la eliminación
3. ✅ **Verificar:** El contacto desaparece de la lista

---

## 2️⃣ Pruebas de API con cURL

### Prueba 1: Listar contactos
```powershell
curl http://localhost:3000/api/contactos
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellidos": "Pérez García",
      "correo": "juan.perez@test.com",
      "fecha_nac": "1990-05-15",
      "foto": "https://bucket.s3.amazonaws.com/..."
    }
  ]
}
```

### Prueba 2: Crear contacto
```powershell
# Crea un archivo de prueba test.jpg primero
curl -X POST http://localhost:3000/api/contactos `
  -F "nombre=Carlos" `
  -F "apellidos=Sánchez Pérez" `
  -F "correo=carlos@test.com" `
  -F "fecha_nac=1992-03-10" `
  -F "foto=@test.jpg"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Contacto creado exitosamente",
  "data": { ... }
}
```

### Prueba 3: Buscar por apellido
```powershell
curl "http://localhost:3000/api/contactos/buscar/apellido?apellido=Sánchez"
```

### Prueba 4: Obtener contacto específico
```powershell
curl http://localhost:3000/api/contactos/1
```

### Prueba 5: Actualizar contacto
```powershell
curl -X PUT http://localhost:3000/api/contactos/1 `
  -F "nombre=Juan Carlos" `
  -F "apellidos=Pérez García" `
  -F "correo=juan.perez@test.com" `
  -F "fecha_nac=1990-05-15"
```

### Prueba 6: Eliminar contacto
```powershell
curl -X DELETE http://localhost:3000/api/contactos/1
```

---

## 3️⃣ Verificación de Datos

### Verificar en MySQL
```sql
-- Conectar a MySQL
mysql -u root -p

-- Seleccionar base de datos
USE agenda_contactos;

-- Ver todos los contactos
SELECT * FROM contactos;

-- Ver contactos con foto
SELECT id, nombre, apellidos, foto FROM contactos WHERE foto IS NOT NULL;

-- Contar contactos
SELECT COUNT(*) as total FROM contactos;
```

### Verificar en S3
1. Ve a **AWS Console → S3**
2. Abre tu bucket
3. Ve a la carpeta `contactos/`
4. ✅ **Verificar:** Las fotos están almacenadas
5. Click en una imagen
6. Copia la URL del objeto
7. Pégala en el navegador
8. ✅ **Verificar:** La imagen se visualiza

---

## 4️⃣ Pruebas de Validación

### Prueba 1: Email duplicado
1. Intenta crear dos contactos con el mismo correo
2. ✅ **Verificar:** El segundo da error

### Prueba 2: Campos obligatorios
1. Intenta crear contacto sin nombre
2. ✅ **Verificar:** Sale error de validación

### Prueba 3: Archivo muy grande
1. Intenta subir una imagen > 5MB
2. ✅ **Verificar:** Sale error de tamaño

### Prueba 4: Archivo no válido
1. Intenta subir un archivo .txt como foto
2. ✅ **Verificar:** Sale error de tipo de archivo

---

## 5️⃣ Pruebas en AWS (Después del Despliegue)

### Cambiar la URL base
Reemplaza `localhost:3000` por la IP pública de tu EC2:
```
http://[IP-PUBLICA-EC2]
```
O si configuraste Nginx:
```
http://[IP-PUBLICA-EC2]
```

### Prueba 1: Health Check
```powershell
curl http://[IP-PUBLICA-EC2]/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-12T..."
}
```

### Prueba 2: Verificar conexión RDS
1. Crea un contacto desde la interfaz web
2. Conéctate a RDS desde tu máquina local:
```bash
mysql -h [ENDPOINT-RDS] -u admin -p
USE agenda_contactos;
SELECT * FROM contactos;
```
3. ✅ **Verificar:** El contacto está en RDS

### Prueba 3: Verificar subida a S3
1. Crea un contacto con foto
2. Ve a AWS Console → S3 → Tu bucket
3. ✅ **Verificar:** La foto se subió correctamente

### Prueba 4: Verificar eliminación en S3
1. Elimina un contacto con foto
2. Ve a S3
3. ✅ **Verificar:** La foto también se eliminó de S3

---

## 6️⃣ Pruebas de Rendimiento

### Prueba 1: Crear múltiples contactos
```powershell
# Crear 10 contactos de prueba
for ($i=1; $i -le 10; $i++) {
    curl -X POST http://localhost:3000/api/contactos `
      -F "nombre=Contacto$i" `
      -F "apellidos=Apellido$i Test" `
      -F "correo=contacto$i@test.com" `
      -F "fecha_nac=1990-01-0$i"
}
```

### Prueba 2: Búsqueda con muchos resultados
1. Busca por apellido común (ej: "Test")
2. ✅ **Verificar:** Todos los resultados se muestran correctamente

---

## 7️⃣ Pruebas de Seguridad Básicas

### Prueba 1: Validación de entrada
```powershell
# Intentar inyección SQL
curl -X POST http://localhost:3000/api/contactos `
  -F "nombre='; DROP TABLE contactos; --" `
  -F "apellidos=Test" `
  -F "correo=test@test.com"
```
✅ **Verificar:** La tabla NO se elimina (protección automática de MySQL2)

### Prueba 2: Límite de tamaño de archivo
```powershell
# Intentar subir archivo muy grande
# Crear archivo de 6MB
fsutil file createnew test_large.jpg 6291456
curl -X POST http://localhost:3000/api/contactos `
  -F "nombre=Test" `
  -F "apellidos=Test" `
  -F "correo=test2@test.com" `
  -F "foto=@test_large.jpg"
```
✅ **Verificar:** Sale error por exceder el límite

---

## 8️⃣ Checklist Final de Funcionalidades

### CRUD Básico
- [ ] ✅ Crear contacto sin foto
- [ ] ✅ Crear contacto con foto
- [ ] ✅ Listar todos los contactos
- [ ] ✅ Ver detalles de un contacto
- [ ] ✅ Actualizar contacto sin cambiar foto
- [ ] ✅ Actualizar contacto cambiando foto
- [ ] ✅ Eliminar contacto sin foto
- [ ] ✅ Eliminar contacto con foto

### Búsqueda
- [ ] ✅ Buscar por apellido (con resultados)
- [ ] ✅ Buscar por apellido (sin resultados)
- [ ] ✅ Buscar con texto parcial
- [ ] ✅ Volver a ver todos después de búsqueda

### Almacenamiento S3
- [ ] ✅ Foto se sube a S3 al crear
- [ ] ✅ Foto se visualiza desde S3
- [ ] ✅ Foto antigua se elimina al actualizar
- [ ] ✅ Foto se elimina de S3 al eliminar contacto

### Base de Datos
- [ ] ✅ Datos se guardan en MySQL/RDS
- [ ] ✅ Email único (no duplicados)
- [ ] ✅ Fechas se guardan correctamente
- [ ] ✅ Índices funcionan (búsqueda rápida)

### Interfaz
- [ ] ✅ Formulario de creación funciona
- [ ] ✅ Formulario de edición se llena automáticamente
- [ ] ✅ Búsqueda funciona correctamente
- [ ] ✅ Mensajes de éxito/error se muestran
- [ ] ✅ Fotos se muestran correctamente
- [ ] ✅ Placeholder "Sin foto" cuando no hay imagen

---

## 9️⃣ Limpieza Después de las Pruebas

### Limpiar base de datos
```sql
-- Eliminar todos los contactos de prueba
DELETE FROM contactos WHERE correo LIKE '%test.com';

-- O eliminar todos
TRUNCATE TABLE contactos;
```

### Limpiar S3
1. Ve a AWS Console → S3 → Tu bucket
2. Selecciona la carpeta `contactos/`
3. Click en "Eliminar"
4. Confirma

### Reiniciar auto-increment
```sql
ALTER TABLE contactos AUTO_INCREMENT = 1;
```

---

## 🎯 Resultados Esperados

Todas las pruebas deben pasar correctamente. Si alguna falla:

1. **Revisa los logs:**
   ```bash
   # En local
   Mira la consola donde corre npm start
   
   # En AWS con PM2
   pm2 logs agenda-contactos
   ```

2. **Verifica configuración:**
   - Credenciales en `.env`
   - Conexión a MySQL
   - Permisos de S3
   - Grupos de seguridad en AWS

3. **Consulta documentación:**
   - `README.md` - Configuración local
   - `AWS_DEPLOYMENT.md` - Configuración AWS
   - `QUICKSTART.md` - Guía rápida

---

## 📊 Reporte de Pruebas

Al terminar, deberías poder confirmar:

✅ **Funcionalidades Principales:**
- Crear, Listar, Actualizar, Eliminar contactos
- Búsqueda por apellido
- Subida y gestión de fotos en S3

✅ **Integración:**
- Base de datos MySQL/RDS funcional
- Almacenamiento S3 funcional
- API REST funcional

✅ **Interfaz:**
- Formularios funcionan
- Búsqueda funciona
- Fotos se muestran

✅ **Seguridad:**
- Validaciones funcionan
- Límites de tamaño funcionan
- No hay errores de seguridad obvios

---

¡Excelente! Tu aplicación está lista para producción 🚀
