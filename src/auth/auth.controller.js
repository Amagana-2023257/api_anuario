import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../configs/firebase.js";
import { uploadToCloudinary } from "../middlewares/uploadPhoto.js";
import { emailExists } from "../helpers/db-validators.js";
import { validationResult } from 'express-validator';
import { generateJWT } from "../helpers/generate-jwt.js";

const handleErrorResponse = (res, statusCode, message, error = '') => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
}

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleErrorResponse(res, 400, "Validation error", errors.array());
  }

  try {
    const data = req.body;

    if (!req.file) {
      return handleErrorResponse(res, 400, "La foto está vacía");
    }

    const userExists = await emailExists(data.email);
    if (userExists) {
      return handleErrorResponse(res, 400, "El correo ya está registrado");
    }

    const profilePicture = await uploadToCloudinary(req);
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    await setDoc(doc(firestore, "users", user.uid), {
      name: data.nombre,
      surname: data.apellido,
      email: data.email,
      carnet: data.carnet,
      seccionAcademica: data.seccionAcademica,
      seccionTecnica: data.seccionTecnica,
      frase: data.frase,
      profilePicture,
      role: "USER",
      status: true,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "Usuario creado con éxito",
      userDetails: {
        name: data.nombre,
        email: data.email,
        profilePicture,
      },
    });

  } catch (err) {
    console.error("Error en el registro:", err);
    return handleErrorResponse(res, 500, "Error en el registro del usuario", err.message || err.stack);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(firestore, "users", user.uid));

    if (!userDoc.exists()) {
      return handleErrorResponse(res, 404, "Usuario no encontrado");
    }

    const userData = userDoc.data();
    const token = await generateJWT(user.uid);
    console.log(userData.role)
    return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        userDetails: {
          token,  // Asegúrate de que el backend está devolviendo el token
          role: userData.role // Se retorna el role directamente
        },
      });
      

  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Error al iniciar sesión", err.message || err);
  }
};
