# 🔧 Solución de Problemas - Error al Crear Contacto

## Error: POST /api/contactos 500 (Internal Server Error)

Este error indica que hay un problema en el servidor. Las causas más comunes son:

### ✅ Checklist de Verificación

1. **Base de datos MySQL no conectada**
2. **Credenciales de AWS S3 incorrectas**
3. **Bucket S3 no existe**
4. **Archivo .env mal configurado**

---

## 🔍 Paso 1: Ver los Logs del Servidor

En tu instancia EC2, ejecuta:

```bash
pm2 logs agenda-contactos --lines 50
```

Esto te mostrará el error exacto. Busca mensajes como:
- `ECONNREFUSED` → MySQL no está accesible
- `AccessDenied` → Problema con credenciales de S3
- `NoSuchBucket` → El bucket no existe

---

## 🔍 Paso 2: Verificar Conexión a MySQL (RDS)

Desde tu servidor EC2, prueba conectarte a RDS:

```bash
# Instalar cliente MySQL si no lo tienes
sudo apt install -y mysql-client

# Probar conexión (reemplaza con tu endpoint real)
mysql -h agenda-contactos-db.XXXXXX.us-east-1.rds.amazonaws.com -u admin -p
```

**Si falla:**
1. Verifica que el endpoint en `.env` sea correcto
2. Verifica el grupo de seguridad de RDS permite conexiones desde EC2
3. Verifica la contraseña

---

## 🔍 Paso 3: Verificar Credenciales de S3

Desde EC2:

```bash
# Instalar AWS CLI si no lo tienes
sudo apt install -y awscli

# Configurar credenciales temporalmente
export AWS_ACCESS_KEY_ID="tu_access_key"
export AWS_SECRET_ACCESS_KEY="tu_secret_key"
export AWS_DEFAULT_REGION="us-east-1"

# Probar acceso a S3
aws s3 ls s3://tu-bucket-name/
```

**Si falla:**
1. Verifica las credenciales en `.env`
2. Verifica que el bucket existe
3. Verifica los permisos del usuario IAM

---

## 🔍 Paso 4: Verificar Archivo .env

En tu servidor EC2:

```bash
cd /home/ubuntu/agenda-contactos
cat .env
```

**Verifica que tenga:**
- Todas las variables completas (sin TU_CONTRASEÑA o TU_ACCESS_KEY)
- El endpoint de RDS correcto
- Las credenciales de AWS correctas
- El nombre del bucket correcto

---

## ✅ Soluciones Rápidas

### Problema 1: Base de Datos No Conecta

**Causa:** Grupo de seguridad de RDS no permite tráfico desde EC2

**Solución:**
1. Ve a **AWS Console → RDS → Bases de datos → agenda-contactos-db**
2. Click en el grupo de seguridad
3. **Editar reglas de entrada**
4. Asegúrate de tener:
   - Tipo: `MySQL/Aurora`
   - Puerto: `3306`
   - Origen: `0.0.0.0/0` (temporal) o el grupo de seguridad de EC2

### Problema 2: S3 No Accesible

**Causa:** Credenciales incorrectas o bucket no existe

**Solución:**
1. Verifica en AWS Console que el bucket existe
2. Crea nuevas credenciales de acceso en IAM
3. Actualiza el archivo `.env` en EC2:

```bash
nano .env
# Actualiza las credenciales
# Guarda con Ctrl+O, Enter, Ctrl+X

# Reinicia la aplicación
pm2 restart agenda-contactos
```

### Problema 3: .env No Cargado

**Causa:** El archivo .env no se creó o está en la ubicación incorrecta

**Solución:**
```bash
cd /home/ubuntu/agenda-contactos

# Verificar que existe
ls -la .env

# Si no existe, créalo
nano .env
# Pega la configuración completa
# Guarda y reinicia
pm2 restart agenda-contactos
```

---

## 🧪 Prueba de Diagnóstico Completa

Ejecuta este script en tu servidor EC2:

```bash
#!/bin/bash
echo "=== DIAGNÓSTICO DE AGENDA CONTACTOS ==="
echo ""

echo "1. Verificando archivo .env..."
if [ -f .env ]; then
    echo "✅ .env existe"
    echo "Variables configuradas:"
    grep -E "^[A-Z_]+=" .env | cut -d= -f1
else
    echo "❌ .env NO EXISTE"
fi
echo ""

echo "2. Verificando conexión a RDS..."
DB_HOST=$(grep DB_HOST .env | cut -d= -f2)
DB_USER=$(grep DB_USER .env | cut -d= -f2)
echo "Intentando conectar a: $DB_HOST"
# Esto pedirá contraseña
mysql -h "$DB_HOST" -u "$DB_USER" -p -e "SELECT 1;" 2>&1
echo ""

echo "3. Verificando acceso a S3..."
S3_BUCKET=$(grep S3_BUCKET_NAME .env | cut -d= -f2)
AWS_KEY=$(grep AWS_ACCESS_KEY_ID .env | cut -d= -f2)
AWS_SECRET=$(grep AWS_SECRET_ACCESS_KEY .env | cut -d= -f2)
AWS_REGION=$(grep AWS_REGION .env | cut -d= -f2)

export AWS_ACCESS_KEY_ID="$AWS_KEY"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET"
export AWS_DEFAULT_REGION="$AWS_REGION"

echo "Intentando acceder a bucket: $S3_BUCKET"
aws s3 ls s3://$S3_BUCKET/ 2>&1
echo ""

echo "4. Estado de PM2..."
pm2 status
echo ""

echo "5. Últimos logs..."
pm2 logs agenda-contactos --lines 20 --nostream
```

Guarda esto como `diagnostico.sh`, dale permisos y ejecútalo:

```bash
chmod +x diagnostico.sh
./diagnostico.sh
```

---

## 📋 Checklist de Configuración Correcta

- [ ] Archivo `.env` existe en `/home/ubuntu/agenda-contactos/`
- [ ] Todas las variables tienen valores reales (no TU_CONTRASEÑA)
- [ ] Endpoint de RDS es accesible desde EC2
- [ ] Grupo de seguridad de RDS permite puerto 3306 desde EC2
- [ ] Bucket S3 existe en AWS
- [ ] Credenciales de AWS son válidas
- [ ] Usuario IAM tiene permisos de S3
- [ ] Aplicación reiniciada después de cambiar `.env`

---

## 🆘 Si Nada Funciona

Envíame:
1. Los últimos 50 logs: `pm2 logs agenda-contactos --lines 50`
2. Contenido de .env (OCULTA las contraseñas): `cat .env | sed 's/=.*/=HIDDEN/'`
3. Resultado de: `mysql -h [TU-ENDPOINT-RDS] -u admin -p -e "SELECT 1;"`
4. Resultado de: `aws s3 ls s3://[TU-BUCKET]/`

---

## ✅ Una Vez Solucionado

1. Reinicia la aplicación:
```bash
pm2 restart agenda-contactos
```

2. Verifica que inicie correctamente:
```bash
pm2 logs agenda-contactos
```

3. Prueba crear un contacto de nuevo

4. Si funciona, guarda la configuración:
```bash
pm2 save
```
