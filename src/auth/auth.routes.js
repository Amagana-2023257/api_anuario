// auth.routes.js
import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"; // Importamos multer

const router = Router();

// Ruta para registro de usuarios con subida de imagen
router.post(
  "/register",
  uploadProfilePicture.single("profilePicture"), // Usar .single() aquí para manejar el archivo
  registerValidator, 
  register
);

router.post(
  "/login",
  loginValidator,
  login
);

export default router;
