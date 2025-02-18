import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';

// Expresión regular para validar el formato de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailExists = (email = "") => {
    return new Promise(async (resolve, reject) => {
        // Limpiar el correo para eliminar posibles espacios
        email = email.trim();

        console.log('Validating email format:', email);  // Ver el correo recibido
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);  // Log para verificar qué email no pasó
            return reject(new Error('The email format is invalid'));
        }

        try {
            const auth = getAuth();  // Inicializar Firebase Auth
            console.log('Checking if email exists in Firebase:', email);  // Log de consulta
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            // Si el array no está vacío, significa que el correo ya está registrado
            if (signInMethods.length > 0) {
                console.log('Email already registered');
                return reject(new Error(`The email ${email} is already registered`));
            }

            console.log('Email is available');
            resolve();  // Si el correo no está registrado, resuelve la promesa
        } catch (error) {
            console.log('Error checking email in Firebase:', error);  // Log de error de Firebase
            reject(new Error(`Error checking email: ${error.message}`));
        }
    });
};


export const blockRole = (value) => {
    if (value) {
      throw new Error("No puedes setear el rol. El rol será asignado automáticamente como 'CLIENT', contacta con un Administrador.");
    }
    return true;
};  

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const userExistsToken = async (value, { req }) => {
    const uidFromToken = req.usuario._id; 
    if (!uidFromToken) {
      throw new Error("ID de usuario no disponible en el token");
    }

    if (value && value !== uidFromToken.toString()) {
      throw new Error("No tiene permisos para actualizar este usuario");
    }

    const user = await User.findById(uidFromToken);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return true;
}

export const blockToken = (value) => {
    if (value) {
      throw new Error("No puedes setear el rol. El rol será asignado automáticamente como 'CLIENT', contacta con un Administrador");
    }
    return true;
}

export const pictureExist = (value, { req }) => {
    if (!req.file) {
        throw new Error('Se requiere un archivo de imagen');
    }
    return true;
}

export const searchProduct = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("El producto no existe.");
    }
    return true;
  }