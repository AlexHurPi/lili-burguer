import { db } from '../services/firebase'; // Ajusta la ruta a tu firebase.js
import { doc, setDoc } from 'firebase/firestore';
import catalogData from '../languages/spanish.json'; // Ajusta la ruta a tu spanish.json

export const migrarMenuAFirestore = async () => {
  try {
    console.log("Iniciando migración...");
    
    // Guardamos todo el objeto JSON dentro del documento "spanish" en la colección "menu"
    await setDoc(doc(db, "menu", "spanish"), catalogData);

    alert("¡Menú subido con éxito a Firebase Firestore!");
    console.log("¡Migración completada con éxito!");
  } catch (error) {
    console.error("Error al subir los datos a Firestore:", error);
    alert("Ocurrió un error al subir los datos. Revisa la consola.");
  }
};