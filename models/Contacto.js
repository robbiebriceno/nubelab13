const { pool } = require('../config/database');
const { s3, bucketName } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

class ContactoModel {
  // Crear contacto
  static async crear(contactoData, file) {
    try {
      let fotoUrl = null;

      // Subir foto a S3 si existe
      if (file) {
        try {
          console.log('📤 Intentando subir foto a S3...');
          console.log('Bucket:', bucketName);
          console.log('Archivo:', file.originalname);
          
          const fileName = `contactos/${uuidv4()}-${file.originalname}`;
          const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read' // Hacer la imagen pública
          };

          const uploadResult = await s3.upload(params).promise();
          fotoUrl = uploadResult.Location;
          console.log('✅ Foto subida exitosamente:', fotoUrl);
        } catch (s3Error) {
          console.error('❌ Error al subir foto a S3:', s3Error.message);
          console.error('Código de error:', s3Error.code);
          console.error('Detalles:', s3Error);
          // Si falla S3, continuamos sin foto (TEMPORAL para debugging)
          console.warn('⚠️  Continuando sin foto...');
        }
      }

      // Insertar en la base de datos
      const [result] = await pool.query(
        'INSERT INTO contactos (nombre, apellidos, correo, fecha_nac, foto) VALUES (?, ?, ?, ?, ?)',
        [contactoData.nombre, contactoData.apellidos, contactoData.correo, contactoData.fecha_nac, fotoUrl]
      );

      return {
        id: result.insertId,
        ...contactoData,
        foto: fotoUrl
      };
    } catch (error) {
      console.error('❌ Error en ContactoModel.crear:', error);
      throw error;
    }
  }

  // Listar todos los contactos
  static async listarTodos() {
    try {
      const [rows] = await pool.query('SELECT * FROM contactos ORDER BY apellidos, nombre');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar por ID
  static async buscarPorId(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM contactos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar por apellido
  static async buscarPorApellido(apellido) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contactos WHERE apellidos LIKE ? ORDER BY apellidos, nombre',
        [`%${apellido}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar contacto
  static async actualizar(id, contactoData, file) {
    try {
      // Obtener contacto actual
      const contactoActual = await this.buscarPorId(id);
      if (!contactoActual) {
        throw new Error('Contacto no encontrado');
      }

      let fotoUrl = contactoActual.foto;

      // Si hay nueva foto, subir a S3 y eliminar la anterior
      if (file) {
        try {
          console.log('📤 Intentando actualizar foto en S3...');
          
          // Eliminar foto anterior de S3 si existe
          if (contactoActual.foto) {
            try {
              const oldKey = contactoActual.foto.split('.com/')[1];
              if (oldKey) {
                await s3.deleteObject({
                  Bucket: bucketName,
                  Key: oldKey
                }).promise();
                console.log('🗑️  Foto anterior eliminada de S3');
              }
            } catch (deleteError) {
              console.warn('⚠️  No se pudo eliminar la foto anterior:', deleteError.message);
            }
          }

          // Subir nueva foto
          const fileName = `contactos/${uuidv4()}-${file.originalname}`;
          const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
          };

          const uploadResult = await s3.upload(params).promise();
          fotoUrl = uploadResult.Location;
          console.log('✅ Nueva foto subida exitosamente:', fotoUrl);
        } catch (s3Error) {
          console.error('❌ Error al actualizar foto en S3:', s3Error.message);
          console.warn('⚠️  Continuando sin cambiar la foto...');
          // Mantener la foto anterior si falla
        }
      }

      // Actualizar en la base de datos
      await pool.query(
        'UPDATE contactos SET nombre = ?, apellidos = ?, correo = ?, fecha_nac = ?, foto = ? WHERE id = ?',
        [contactoData.nombre, contactoData.apellidos, contactoData.correo, contactoData.fecha_nac, fotoUrl, id]
      );

      return {
        id,
        ...contactoData,
        foto: fotoUrl
      };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar contacto
  static async eliminar(id) {
    try {
      // Obtener contacto para eliminar foto de S3
      const contacto = await this.buscarPorId(id);
      if (!contacto) {
        throw new Error('Contacto no encontrado');
      }

      // Eliminar foto de S3 si existe
      if (contacto.foto) {
        try {
          const key = contacto.foto.split('.com/')[1];
          if (key) {
            await s3.deleteObject({
              Bucket: bucketName,
              Key: key
            }).promise();
            console.log('🗑️  Foto eliminada de S3:', key);
          }
        } catch (s3Error) {
          console.warn('⚠️  No se pudo eliminar la foto de S3:', s3Error.message);
          // Continuar con la eliminación del contacto aunque falle S3
        }
      }

      // Eliminar de la base de datos
      await pool.query('DELETE FROM contactos WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactoModel;
