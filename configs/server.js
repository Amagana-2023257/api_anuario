// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import scheduleRoutes from "../src/schedule/schedule.routes.js";
import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { cloudinary } from './cloudinary.js'; // Importar la conexión a Cloudinary

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Asegurarse de que las variables de entorno sean correctas
const {
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_CLIENT_X509_CERT_URL,
  PROJECT_ID,
  PORT
} = process.env;

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const routes = (app) => {
  app.use("/anuario/v1/auth", authRoutes);
  app.use("/anuario/v1/user", userRoutes);
  app.use("/anuario/v1/schedule", scheduleRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

const conectarDB = async () => {
  try {
    console.log('Firebase Firestore conectado');
  } catch (err) {
    console.log(`Error en la conexión con Firestore: ${err}`);
    process.exit(1);
  }
};

// Inicializar Firebase utilizando las credenciales de las variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Reemplazar '\n' por salto de línea
  client_email: FIREBASE_CLIENT_EMAIL,
  client_id: FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

initializeApp({
  credential: cert(serviceAccount),
});

export const initServer = () => {
  const app = express();
  try {
    middlewares(app);
    conectarDB();
    routes(app);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log(`Error en la inicialización del servidor: ${err}`);
  }
};
