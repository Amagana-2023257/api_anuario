import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firestore } from "../../configs/firebase.js"; // Ya tienes firestore exportado desde firebase.js


// Obtener todos los usuarios de Firestore
export const getAllUsers = async (req, res) => {
    try {
        // Obtener todos los usuarios de Firestore
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const users = [];

        // Iterar sobre los documentos y agregar los datos de cada usuario
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({
            message: "Usuarios obtenidos exitosamente",
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message,
        });
    }
};

// Obtener un usuario por su UID (ID en Firestore)
export const getUserById = async (req, res) => {
    const { userId } = req.params; // El UID del usuario a obtener

    try {
        const userDoc = await getDoc(doc(firestore, "users", userId)); // Obtener el documento de usuario de Firestore

        if (!userDoc.exists()) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            message: "Usuario encontrado",
            user: userDoc.data(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener usuario",
            error: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const {
        name,
        surname,
        email,
        carnet,
        seccionAcademica,
        seccionTecnica,
        frase,
        role,
        status,
    } = req.body;

    let profilePicture = req.file ? req.file.path : req.body.profilePicture;

    // Si `profilePicture` llega como un array, extraer solo la URL
    if (Array.isArray(profilePicture) && profilePicture.length > 0) {
        profilePicture = profilePicture[0]; 
    }

    if (!name || !surname || !email || !carnet || !seccionAcademica || !seccionTecnica) {
        return res.status(400).json({
            message: "Todos los campos obligatorios deben estar completos.",
        });
    }

    try {
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const currentUserData = userDoc.data();

        const updateData = {
            name,
            surname,
            email,
            carnet,
            seccionAcademica,
            seccionTecnica,
            frase,
            role: role || currentUserData.role,
            status: status !== undefined ? status : currentUserData.status,
            profilePicture: profilePicture || currentUserData.profilePicture, // Actualiza la imagen si se envió una nueva
            updatedAt: new Date().toISOString(),
        };

        await updateDoc(userRef, updateData);

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
            user: updateData,
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({
            message: "Error al actualizar usuario",
            error: error.message,
        });
    }
};



// Desactivar un usuario (cambiar su status a false)
export const deactivateUser = async (req, res) => {
    const { userId } = req.params; // El UID del usuario a desactivar

    try {
        const userRef = doc(firestore, "users", userId); // Referencia al documento de usuario en Firestore
        const userDoc = await getDoc(userRef); // Obtener el documento para asegurarse de que exista

        if (!userDoc.exists()) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        // Actualizar el status del usuario a false
        await updateDoc(userRef, {
            status: false, // Cambiar el estado del usuario a 'false'
            updatedAt: new Date().toISOString(), // Establecer la fecha de actualización
        });

        return res.status(200).json({
            message: "Usuario desactivado exitosamente",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al desactivar usuario",
            error: error.message,
        });
    }
};




export const resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "El correo es obligatorio.",
        });
    }

    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);

        return res.status(200).json({
            message: "Se ha enviado un enlace de recuperación a tu correo.",
        });
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        return res.status(500).json({
            message: "Error al procesar la solicitud",
            error: error.message,
        });
    }
};
