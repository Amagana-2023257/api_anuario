import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { generateJWT } from "../helpers/generate-jwt.js";
import { auth, firestore } from "../../configs/firebase.js"; 

export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;

        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Agregar el campo status al registrar al usuario en Firestore
        await setDoc(doc(firestore, "users", user.uid), {
            name: data.name,
            surname: data.surname,
            email: data.email,
            profilePicture: profilePicture,
            role: "USER",
            status: true,  // Asegúrate de agregar el campo status
            createdAt: new Date().toISOString(),
        });

        return res.status(201).json({
            message: "User has been created",
            name: data.name,
            email: data.email,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "User registration failed",
            error: err.message || err,
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
            return res.status(404).json({
                message: "User not found",
                error: "No user data found in Firestore",
            });
        }

        const userData = userDoc.data();

        const token = await generateJWT(user.uid);

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                profilePicture: userData.profilePicture,
                name: userData.name,
                email: userData.email,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Login failed",
            error: err.message || err,
        });
    }
};
