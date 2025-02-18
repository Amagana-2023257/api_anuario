import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";  // Importamos Firestore
import { firestore } from "../../configs/firebase.js";  // Asegúrate de que la configuración de Firebase esté correcta

export const validateJWT = async (req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers["authorization"];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No se proporcionó un token en la petición",
            });
        }

        token = token.replace(/^Bearer\s+/, "");

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar si el UID del token corresponde a un documento de usuario en Firestore
        const userRef = doc(firestore, "users", uid);  // Referencia al documento de usuario con el UID
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(400).json({
                success: false,
                message: "Usuario no existe en la DB",
            });
        }

        const user = userDoc.data();  // Obtener los datos del usuario

        if (!user.status) {
            return res.status(400).json({
                success: false,
                message: "Usuario fue desactivado previamente",
            });
        }

        req.usuario = user;  // Pasar los datos del usuario a la solicitud

        console.log(user);  // Log de usuario para depuración

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al validar el token",
            error: err.message,
        });
    }
};
