import { body, param, validationResult } from "express-validator"; 
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { deleteFileOnError } from "./delete-file-on-error.js"
import { emailExists, blockRole, userExists } from "../helpers/db-validators.js"

export const registerValidator = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("email").notEmpty().withMessage("El email es requerido"),
  body("email").isEmail().withMessage("No es un email válido"),
  body("email").custom(emailExists), // Verificamos si el correo ya existe
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("La contraseña debe tener al menos 8 caracteres, con mayúsculas, números y símbolos"),
  body("carnet").notEmpty().withMessage("El carnet es requerido"),
  body("seccionAcademica").notEmpty().withMessage("La sección académica es requerida"),
  body("seccionTecnica").notEmpty().withMessage("La sección técnica es requerida"),
  body("frase").notEmpty().withMessage("La frase es requerida"),
  body("fotografia").optional().isString().withMessage("La foto debe ser una cadena de texto (URL)"),
  
  validarCampos, // Valida los campos utilizando express-validator
];



export const loginValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),
  validarCampos,
  handleErrors,
];



export const getUserByIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB")
    .custom(userExists),
  validarCampos,
  handleErrors,
];

export const updateUserValidator = [

  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .optional()
    .isIn(["ADMIN", "USER"])
    .withMessage("El rol debe ser 'ADMIN' o 'USER'"),
  validarCampos,
  handleErrors,
];


export const updateUserDetailsByIdValidator = [
  param("id")
  .isMongoId()
  .withMessage("No es un ID válido de MongoDB")
  .custom(userExists),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .optional()
    .isIn(["ADMIN", "CLIENT"])
    .withMessage("El rol debe ser 'ADMIN' o 'CLIENT'"),
  validarCampos,
  handleErrors,
];



export const deleteUserValidator = [
  validarCampos,
  handleErrors,
];