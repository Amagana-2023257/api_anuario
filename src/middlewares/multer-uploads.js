// multer-uploads.js
import multer from 'multer';

// Tipos de archivo permitidos
const MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_SIZE = 10000000; // 10MB

// Configuración de Multer solo para validar el archivo
const createMulterConfig = () => {
  return multer({
    storage: multer.memoryStorage(), // Usamos memoria en lugar de almacenamiento en disco
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) {
        cb(null, true); // Aceptamos el archivo
      } else {
        console.log(file.mimetype)
        cb(new Error(`Solamente se aceptan archivos de los siguientes tipos: ${MIMETYPES.join(" ")}`));
      }
    },
    limits: {
      fileSize: MAX_SIZE, // Límite de tamaño de archivo
    },
  });
};

export const uploadProfilePicture = createMulterConfig(); // Exportamos el middleware de multer
