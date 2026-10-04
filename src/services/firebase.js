import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Credenciales obtenidas del registro en la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFG90UGUF_v-AtukD6wlt91N-mAdruGlY",
  authDomain: "lili-hamburger.firebaseapp.com",
  projectId: "lili-hamburger",
  storageBucket: "lili-hamburger.firebasestorage.app",
  messagingSenderId: "290211440366",
  appId: "1:290211440366:web:f0dbd623356f3042b5b5ff"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la base de datos y la autenticación para usarlas en cualquier componente
export const db = getFirestore(app);
export const getFirebaseAuth = () => getAuth(app);