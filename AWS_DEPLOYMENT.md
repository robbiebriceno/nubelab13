# ☁️ PARTE 2: Configuración y Despliegue en AWS

Esta guía detalla paso a paso cómo desplegar la aplicación en AWS usando EC2, RDS y S3.

## 📋 Índice

1. [Configurar RDS (MySQL)](#1-configurar-rds-mysql)
2. [Configurar S3 Bucket](#2-configurar-s3-bucket)
3. [Configurar EC2 (Ubuntu)](#3-configurar-ec2-ubuntu)
4. [Desplegar la Aplicación](#4-desplegar-la-aplicación)
5. [Configurar Seguridad](#5-configurar-seguridad)

---

## 1️⃣ Configurar RDS (MySQL)

### Paso 1.1: Crear Base de Datos RDS

1. **Accede a AWS Console → RDS → Crear base de datos**

2. **Configuración básica:**
   - Método de creación: `Creación estándar`
   - Tipo de motor: `MySQL`
   - Versión: `MySQL 8.0.35` (o la más reciente)
   - Plantillas: `Capa gratuita` (si aplica)

3. **Configuración de la instancia:**
   - Identificador de instancia: `agenda-contactos-db`
   - Nombre de usuario maestro: `admin`
   - Contraseña: `[TU_CONTRASEÑA_SEGURA]` (Guárdala en un lugar seguro)

4. **Configuración de instancia:**
   - Clase de instancia: `db.t3.micro` (capa gratuita) o `db.t3.small`
   - Almacenamiento: 20 GB (SSD de uso general)

5. **Conectividad:**
   - VPC: `Default VPC`
   - Acceso público: `Sí` (para desarrollo) - **EN PRODUCCIÓN: NO**
   - Grupo de seguridad: Crear nuevo `agenda-db-sg`

6. **Configuración adicional:**
   - Nombre de base de datos inicial: `agenda_contactos`
   - Puerto: `3306` (predeterminado)
   - Habilitar: `Automated backups` (retención 7 días)

7. **Hacer clic en "Crear base de datos"**

### Paso 1.2: Configurar Grupo de Seguridad de RDS

1. Ve a **EC2 → Grupos de seguridad → agenda-db-sg**
2. **Editar reglas de entrada:**
   - Tipo: `MySQL/Aurora`
   - Puerto: `3306`
   - Origen: `Grupo de seguridad de EC2` (lo crearás después) o `0.0.0.0/0` (temporal para pruebas)

### Paso 1.3: Obtener Endpoint de RDS

1. Ve a **RDS → Bases de datos → agenda-contactos-db**
2. En la sección **Conectividad y seguridad**, copia el **Punto de enlace**
   - Ejemplo: `agenda-contactos-db.abc123xyz.us-east-1.rds.amazonaws.com`

---

## 2️⃣ Configurar S3 Bucket

### Paso 2.1: Crear Bucket S3

1. **AWS Console → S3 → Crear bucket**

2. **Configuración del bucket:**
   - Nombre: `agenda-contactos-fotos-[TU-NOMBRE-UNICO]`
   - Región: `us-east-1` (o la misma que tu EC2)
   - **IMPORTANTE:** Desmarcar "Bloquear todo el acceso público"
   - ✅ Reconocer que la configuración puede hacer públicos los objetos

3. **Configuración adicional:**
   - Control de versiones: Deshabilitado (opcional)
   - Etiquetas: Puedes agregar `Environment: Production`

4. **Hacer clic en "Crear bucket"**

### Paso 2.2: Configurar Política del Bucket

1. Ve al bucket creado → **Permisos** → **Política del bucket**
2. Pega la siguiente política (reemplaza `TU-NOMBRE-BUCKET`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::TU-NOMBRE-BUCKET/*"
        }
    ]
}
```

### Paso 2.3: Configurar CORS (Cross-Origin Resource Sharing)

1. En el bucket → **Permisos** → **CORS**
2. Pega la siguiente configuración:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }
]
```

### Paso 2.4: Crear Usuario IAM con Acceso a S3

1. **IAM → Usuarios → Crear usuario**
   - Nombre: `agenda-app-s3-user`

2. **Permisos:**
   - Adjuntar políticas directamente
   - Buscar y seleccionar: `AmazonS3FullAccess`

3. **Crear credenciales de acceso:**
   - Ve al usuario creado → **Credenciales de seguridad**
   - **Crear clave de acceso**
   - Tipo: `Aplicación que se ejecuta fuera de AWS`
   - **Guarda el Access Key ID y Secret Access Key** (no los podrás ver de nuevo)

---

## 3️⃣ Configurar EC2 (Ubuntu)

### Paso 3.1: Lanzar Instancia EC2

1. **AWS Console → EC2 → Lanzar instancia**

2. **Nombre y etiquetas:**
   - Nombre: `Agenda-Contactos-Server`

3. **Imágenes de aplicaciones y SO:**
   - AMI: `Ubuntu Server 22.04 LTS` (capa gratuita elegible)
   - Arquitectura: `64 bits (x86)`

4. **Tipo de instancia:**
   - `t2.micro` (capa gratuita) o `t2.small`

5. **Par de claves (login):**
   - Crear nuevo par de claves
   - Nombre: `agenda-contactos-key`
   - Tipo: `RSA`
   - Formato: `.pem` (para Linux/Mac) o `.ppk` (para Windows/PuTTY)
   - **Descargar y guardar en lugar seguro**

6. **Configuración de red:**
   - VPC: `Default VPC`
   - Subred: `Sin preferencia`
   - Asignar IP pública automáticamente: `Habilitar`
   - Crear grupo de seguridad: `agenda-app-sg`
   
   **Reglas de entrada del grupo de seguridad:**
   - SSH (22): `Mi IP` o `0.0.0.0/0`
   - HTTP (80): `0.0.0.0/0`
   - HTTPS (443): `0.0.0.0/0`
   - Personalizado TCP (3000): `0.0.0.0/0` (para Node.js)

7. **Almacenamiento:**
   - 8-20 GB SSD (gp3)

8. **Hacer clic en "Lanzar instancia"**

### Paso 3.2: Conectarse a la Instancia EC2

#### Opción A: Usando Windows PowerShell

```powershell
# Cambiar permisos del archivo .pem (solo la primera vez)
icacls "C:\ruta\a\agenda-contactos-key.pem" /inheritance:r
icacls "C:\ruta\a\agenda-contactos-key.pem" /grant:r "$($env:USERNAME):(R)"

# Conectar via SSH
ssh -i "C:\ruta\a\agenda-contactos-key.pem" ubuntu@[IP-PUBLICA-EC2]
```

#### Opción B: Usando PuTTY (Windows)

1. Abre PuTTY
2. Host Name: `ubuntu@[IP-PUBLICA-EC2]`
3. Connection → SSH → Auth → Credentials: Selecciona tu archivo `.ppk`
4. Conectar

#### Opción C: Usando EC2 Instance Connect (más fácil)

1. Ve a **EC2 → Instancias → Agenda-Contactos-Server**
2. Click en **Conectar**
3. Pestaña **EC2 Instance Connect**
4. Click en **Conectar**

---

## 4️⃣ Desplegar la Aplicación

### Paso 4.1: Actualizar el Sistema e Instalar Dependencias

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (versión 18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar Git
sudo apt install -y git

# Instalar PM2 (gestor de procesos para Node.js)
sudo npm install -g pm2
```

### Paso 4.2: Clonar o Subir la Aplicación

#### Opción A: Si tu código está en GitHub

```bash
cd /home/ubuntu
git clone https://github.com/TU-USUARIO/agenda-contactos.git
cd agenda-contactos
```

#### Opción B: Subir archivos manualmente

Desde tu máquina local (PowerShell):

```powershell
# Comprimir la aplicación
Compress-Archive -Path "C:\Users\robbie\Desktop\nubelab13\*" -DestinationPath "C:\Users\robbie\Desktop\agenda-app.zip"

# Copiar a EC2 via SCP
scp -i "C:\ruta\a\agenda-contactos-key.pem" "C:\Users\robbie\Desktop\agenda-app.zip" ubuntu@[IP-PUBLICA-EC2]:/home/ubuntu/

# Luego en el servidor EC2:
cd /home/ubuntu
sudo apt install -y unzip
unzip agenda-app.zip -d agenda-contactos
cd agenda-contactos
```

### Paso 4.3: Instalar Dependencias de la Aplicación

```bash
npm install
```

### Paso 4.4: Configurar Variables de Entorno

```bash
# Crear archivo .env
nano .env
```

Pega el siguiente contenido (reemplaza con tus valores reales):

```env
PORT=3000

# RDS MySQL
DB_HOST=agenda-contactos-db.abc123xyz.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=TU_CONTRASEÑA_RDS
DB_NAME=agenda_contactos
DB_PORT=3306

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY
S3_BUCKET_NAME=agenda-contactos-fotos-tu-nombre-unico
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`

### Paso 4.5: Probar la Aplicación

```bash
# Iniciar la aplicación manualmente
npm start
```

Si todo está bien, verás:
```
╔════════════════════════════════════════════════════════╗
║     🚀 SERVIDOR INICIADO CORRECTAMENTE                ║
╠════════════════════════════════════════════════════════╣
║  Puerto: 3000                                       
║  URL: http://localhost:3000                        
...
```

Abre tu navegador: `http://[IP-PUBLICA-EC2]:3000`

### Paso 4.6: Configurar PM2 para Mantener la Aplicación Corriendo

```bash
# Detener la aplicación manual (Ctrl+C)

# Iniciar con PM2
pm2 start server.js --name agenda-contactos

# Verificar estado
pm2 status

# Configurar PM2 para iniciar al reiniciar el servidor
pm2 startup systemd
# Ejecuta el comando que PM2 te muestra

pm2 save

# Ver logs en tiempo real
pm2 logs agenda-contactos

# Otros comandos útiles:
pm2 restart agenda-contactos
pm2 stop agenda-contactos
pm2 delete agenda-contactos
```

---

## 5️⃣ Configurar Seguridad y Optimización

### Paso 5.1: Instalar y Configurar Nginx (Opcional pero Recomendado)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Configurar Nginx como proxy inverso
sudo nano /etc/nginx/sites-available/agenda-contactos
```

Pega esta configuración:

```nginx
server {
    listen 80;
    server_name [IP-PUBLICA-EC2] tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Habilitar configuración
sudo ln -s /etc/nginx/sites-available/agenda-contactos /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Ahora puedes acceder sin especificar el puerto: `http://[IP-PUBLICA-EC2]`

### Paso 5.2: Configurar Firewall UFW

```bash
# Habilitar UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Verificar estado
sudo ufw status
```

### Paso 5.3: Configurar HTTPS con Let's Encrypt (Si tienes dominio)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática (ya está configurada)
sudo certbot renew --dry-run
```

---

## 6️⃣ Verificación Final

### Checklist de Verificación:

- ✅ RDS está corriendo y accesible desde EC2
- ✅ S3 bucket creado con permisos correctos
- ✅ EC2 instancia corriendo Ubuntu
- ✅ Aplicación Node.js instalada y corriendo con PM2
- ✅ Grupo de seguridad de EC2 permite tráfico en puerto 80/3000
- ✅ Grupo de seguridad de RDS permite tráfico desde EC2
- ✅ Variables de entorno configuradas correctamente
- ✅ Nginx configurado como proxy inverso (opcional)

### Probar la Aplicación:

1. Abre: `http://[IP-PUBLICA-EC2]` o `http://[IP-PUBLICA-EC2]:3000`
2. Crea un contacto con foto
3. Verifica que la foto se suba a S3
4. Verifica que el contacto se guarde en RDS
5. Prueba buscar, editar y eliminar

---

## 🔧 Solución de Problemas en AWS

### Problema: No puedo conectarme a RDS desde EC2

**Solución:**
```bash
# Verificar conectividad desde EC2
sudo apt install -y mysql-client
mysql -h [ENDPOINT-RDS] -u admin -p

# Si falla:
# 1. Verifica el grupo de seguridad de RDS
# 2. Asegúrate de que permite tráfico desde el grupo de seguridad de EC2
# 3. Verifica que RDS esté en la misma VPC que EC2
```

### Problema: Las imágenes no se suben a S3

**Solución:**
```bash
# Verificar credenciales de AWS
aws configure list

# Probar acceso a S3 manualmente
aws s3 ls s3://[TU-BUCKET]/

# Si falla:
# 1. Verifica las credenciales en .env
# 2. Verifica los permisos del usuario IAM
# 3. Verifica la política del bucket
```

### Problema: La aplicación se detiene al cerrar SSH

**Solución:**
```bash
# Usa PM2 en lugar de ejecutar directamente
pm2 start server.js --name agenda-contactos
pm2 save
pm2 startup
```

### Problema: Error de permisos en archivos

**Solución:**
```bash
# Cambiar propietario de los archivos
sudo chown -R ubuntu:ubuntu /home/ubuntu/agenda-contactos

# Dar permisos de ejecución
chmod +x /home/ubuntu/agenda-contactos/server.js
```

---

## 📊 Monitoreo y Mantenimiento

### Ver logs de la aplicación:
```bash
pm2 logs agenda-contactos --lines 100
```

### Ver uso de recursos:
```bash
pm2 monit
```

### Actualizar la aplicación:
```bash
cd /home/ubuntu/agenda-contactos
git pull origin main  # Si usas Git
npm install  # Si hay nuevas dependencias
pm2 restart agenda-contactos
```

### Backup de la base de datos:
```bash
mysqldump -h [ENDPOINT-RDS] -u admin -p agenda_contactos > backup_$(date +%Y%m%d).sql
```

---

## 💰 Estimación de Costos AWS (Región us-east-1)

### Capa Gratuita (12 meses):
- **EC2 t2.micro:** 750 horas/mes GRATIS
- **RDS db.t3.micro:** 750 horas/mes GRATIS
- **S3:** 5GB almacenamiento, 20,000 GET, 2,000 PUT GRATIS

### Después de la capa gratuita (aprox.):
- **EC2 t2.micro:** ~$8/mes
- **RDS db.t3.micro:** ~$15/mes
- **S3:** ~$0.50/mes (por 10GB)
- **Total estimado:** ~$23-25/mes

---

## 🎉 ¡Felicidades!

Tu aplicación de Agenda de Contactos ahora está desplegada en AWS con:
- ✅ Base de datos MySQL RDS
- ✅ Almacenamiento de imágenes en S3
- ✅ Servidor Node.js en EC2 Ubuntu
- ✅ Alta disponibilidad con PM2
- ✅ Proxy inverso con Nginx (opcional)

**URL de acceso:** `http://[IP-PUBLICA-EC2]`

---

## 📚 Recursos Adicionales

- [Documentación de AWS RDS](https://docs.aws.amazon.com/rds/)
- [Documentación de AWS S3](https://docs.aws.amazon.com/s3/)
- [Documentación de AWS EC2](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
