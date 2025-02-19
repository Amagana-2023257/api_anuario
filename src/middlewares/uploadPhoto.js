// uploadPhoto.js
import { cloudinary } from '../../configs/cloudinary.js';  // Importamos la configuración de Cloudinary
import { Readable } from 'stream';  // Necesario para convertir el buffer a stream

// Función para subir la imagen a Cloudinary de manera asíncrona
export const uploadToCloudinary = async (req) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  return new Promise((resolve, reject) => {
    // Subir el archivo a Cloudinary
    const uploadResult = cloudinary.uploader.upload_stream(
      {
        public_id: `profile-pictures/${req.file.originalname.split('.')[0]}-${Date.now()}`, // Asignamos un nombre único
        folder: 'profile-pictures', // Establecemos la carpeta
        resource_type: 'image', // Especificamos que es una imagen
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(new Error('Failed to upload image'));
        } else {
          // Resolvemos con la URL de la imagen subida
          resolve(result.secure_url);
        }
      }
    );

    // Convertir el archivo en un stream y enviarlo a Cloudinary
    bufferToStream(req.file.buffer).pipe(uploadResult);
  });
};

// Función para convertir el buffer a un stream (se necesita en este contexto)
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};
