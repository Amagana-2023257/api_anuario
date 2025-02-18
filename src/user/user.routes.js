import { Router } from "express";
import { getAllUsers,getUserById,updateUser,deactivateUser} from "./user.controller.js";
import { getUserByIdValidator, updateUserValidator,deleteUserValidator } from "../middlewares/user-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router();

// Obtener todos los usuarios (solo para administradores)
router.get("/", validateJWT, hasRoles("ADMIN", "USER"), getAllUsers);

// Obtener un usuario por su ID
router.get("/:userId", validateJWT, hasRoles("ADMIN"), getUserById);

// Actualizar un usuario
router.put("/:userId", validateJWT, hasRoles("ADMIN"),uploadProfilePicture.single("profilePicture"),  updateUserValidator, updateUser);

// Eliminar un usuario
router.delete("/:userId", validateJWT, hasRoles("ADMIN"), deleteUserValidator, deactivateUser);

export default router;
