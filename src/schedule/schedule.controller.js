import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { firestore } from "../../configs/firebase.js"; // Tu Firestore config
import { uploadToCloudinary } from "../middlewares/uploadPhoto.js";

/**
 * Crea un nuevo schedule (horario).
 * Campos esperados:
 *  - title: string (título)
 *  - type: "profesor" | "seccion" | "salon"
 *  - jornada: "matutina" | "vespertina"
 *  - photo: archivo de tipo imagen (opcional)
 */
export const createSchedule = async (req, res) => {
  try {
    const { title, type, jornada } = req.body;

    // Validaciones básicas
    if (!title || !type || !jornada) {
      return res.status(400).json({
        message: "title, type y jornada son obligatorios.",
      });
    }

    // Subir foto a Cloudinary si viene en req.file
    let photoUrl = "";
    if (req.file) {
      photoUrl = await uploadToCloudinary(req);
    }

    // Crear documento en Firestore
    const newSchedule = {
      title,
      type,
      jornada,
      photo: photoUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(firestore, "schedules"), newSchedule);

    return res.status(201).json({
      message: "Horario creado exitosamente",
      schedule: { id: docRef.id, ...newSchedule },
    });
  } catch (error) {
    console.error("Error al crear schedule:", error);
    return res.status(500).json({
      message: "Error al crear schedule",
      error: error.message,
    });
  }
};

/**
 * Obtiene la lista de schedules, con filtros opcionales por type y jornada.
 * Query params: ?type=profesor|seccion|salon & ?jornada=matutina|vespertina
 */
export const getSchedules = async (req, res) => {
  try {
    const { type, jornada } = req.query;
    let schedulesQuery = collection(firestore, "schedules");

    // Construir query con where si se envían filtros
    const conditions = [];
    if (type) {
      conditions.push(where("type", "==", type));
    }
    if (jornada) {
      conditions.push(where("jornada", "==", jornada));
    }

    let q;
    if (conditions.length > 0) {
      // Si hay filtros, creamos la query con where
      // (Puedes encadenar varios wheres)
      if (conditions.length === 1) {
        q = query(schedulesQuery, conditions[0]);
      } else if (conditions.length === 2) {
        q = query(schedulesQuery, conditions[0], conditions[1]);
      }
    } else {
      // Sin filtros
      q = schedulesQuery;
    }

    const snapshot = await getDocs(q);
    const schedules = [];
    snapshot.forEach((docSnap) => {
      schedules.push({ id: docSnap.id, ...docSnap.data() });
    });

    return res.status(200).json({
      message: "Horarios obtenidos exitosamente",
      schedules,
    });
  } catch (error) {
    console.error("Error al obtener schedules:", error);
    return res.status(500).json({
      message: "Error al obtener schedules",
      error: error.message,
    });
  }
};

/**
 * Obtiene un schedule por su ID.
 */
export const getScheduleById = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const docRef = doc(firestore, "schedules", scheduleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    return res.status(200).json({
      message: "Horario encontrado",
      schedule: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (error) {
    console.error("Error al obtener schedule:", error);
    return res.status(500).json({
      message: "Error al obtener schedule",
      error: error.message,
    });
  }
};

/**
 * Actualiza un schedule por ID.
 * Campos opcionales a actualizar: title, type, jornada, photo
 */
export const updateSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const { title, type, jornada } = req.body;

  try {
    const docRef = doc(firestore, "schedules", scheduleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    // Subir foto si viene un archivo
    let photoUrl;
    if (req.file) {
      photoUrl = await uploadToCloudinary(req);
    }

    const currentData = docSnap.data();

    // Construir objeto con campos a actualizar
    const updatedData = {
      title: title !== undefined ? title : currentData.title,
      type: type !== undefined ? type : currentData.type,
      jornada: jornada !== undefined ? jornada : currentData.jornada,
      photo: photoUrl || currentData.photo,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updatedData);

    return res.status(200).json({
      message: "Horario actualizado exitosamente",
      schedule: { id: scheduleId, ...updatedData },
    });
  } catch (error) {
    console.error("Error al actualizar schedule:", error);
    return res.status(500).json({
      message: "Error al actualizar schedule",
      error: error.message,
    });
  }
};

/**
 * Elimina (borra) un schedule de Firestore
 */
export const deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const docRef = doc(firestore, "schedules", scheduleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    await deleteDoc(docRef);

    return res.status(200).json({ message: "Horario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar schedule:", error);
    return res.status(500).json({
      message: "Error al eliminar schedule",
      error: error.message,
    });
  }
};
