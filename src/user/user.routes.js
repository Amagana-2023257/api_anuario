import { Router } from "express";
import { getAllUsers,getUserById,updateUser,deactivateUser, resetPassword} from "./user.controller.js";
import { getUserByIdValidator, updateUserValidator,deleteUserValidator } from "../middlewares/user-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router();


router.get("/", getAllUsers);

// Obtener un usuario por su ID
router.get("/:userId", validateJWT, hasRoles("ADMIN", "USER"), getUserById);

// Actualizar un usuario
router.put("/updateUser/:userId", validateJWT, hasRoles("ADMIN", "USER"),uploadProfilePicture.single("profilePicture"),  updateUserValidator, updateUser);

// Eliminar un usuario
router.delete("/:userId", validateJWT, hasRoles("ADMIN"), deleteUserValidator, deactivateUser);

// Nueva ruta para recuperar la contraseña
router.post("/reset-password", resetPassword);

export default router;
