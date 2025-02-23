// schedule.routes.js
import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} from "./schedule.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"; 
// O tu middleware para subir la foto (horario) a Cloudinary

const router = Router();

/**
 * Rutas para Schedules (Horarios).
 * 
 * GET    /schedules         -> listar todos (ADMIN, USER)
 * GET    /schedules/:id     -> obtener uno por ID (ADMIN, USER)
 * POST   /schedules         -> crear schedule (solo ADMIN)
 * PUT    /schedules/:id     -> actualizar schedule (solo ADMIN)
 * DELETE /schedules/:id     -> eliminar schedule (solo ADMIN)
 */

// 1) Listar Schedules (ADMIN o USER pueden ver)
router.get(
  "/",
  validateJWT,
  hasRoles("ADMIN"),
  getSchedules
);

// 2) Obtener un schedule por ID (ADMIN o USER pueden ver)
router.get(
  "/:scheduleId",
  validateJWT,
  hasRoles("ADMIN"),
  getScheduleById
);

// 3) Crear un schedule (solo ADMIN)
router.post(
  "/",
  validateJWT,
  hasRoles("ADMIN"),
  uploadProfilePicture.single("photo"), // si subes la foto del horario
  createSchedule
);

// 4) Actualizar un schedule (solo ADMIN)
router.put(
  "/:scheduleId",
  validateJWT,
  hasRoles("ADMIN"),
  uploadProfilePicture.single("photo"),
  updateSchedule
);

// 5) Eliminar un schedule (solo ADMIN)
router.delete(
  "/:scheduleId",
  validateJWT,
  hasRoles("ADMIN"),
  deleteSchedule
);

export default router;
