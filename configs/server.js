import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import { initializeApp, cert } from 'firebase-admin/app';
import { fileURLToPath } from 'url'; 
import path from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, '..', 'auth.json');

const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf-8'));

initializeApp({
  credential: cert(serviceAccount),
});

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

export const initServer = () => {
    const app = express();
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(`Error en la inicialización del servidor: ${err}`);
    }
};
