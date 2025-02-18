import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { config } from "dotenv";  
config();  

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Iniciando conexión a Firebase
console.log("Iniciando conexión a Firebase App...");

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Conexión establecida a Firebase App");
} catch (err) {
  console.error("Conexión fallida a Firebase App", err);
}

// Intentando conectar con Firebase Firestore
console.log("Intentando conexión con Firebase Firestore...");
let firestore;
try {
  firestore = getFirestore(app);
  console.log("Conexión establecida a Firebase Firestore");
} catch (err) {
  console.error("Conexión fallida a Firebase Firestore", err);
}

// Intentando conectar con Firebase Auth
console.log("Intentando conexión con Firebase Auth...");
let auth;
try {
  auth = getAuth(app);  // Inicializando el servicio de Auth
  console.log("Conexión establecida a Firebase Auth");
} catch (err) {
  console.error("Conexión fallida a Firebase Auth", err);
}

// Exportar servicios de Firebase
export { app, firestore, auth };
