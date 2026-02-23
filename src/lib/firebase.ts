import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDY6dzaAnGSIwI98uAbqSavi_1q7yA_1fY",
  authDomain: "chic-list.firebaseapp.com",
  projectId: "chic-list",
  storageBucket: "chic-list.firebasestorage.app",
  messagingSenderId: "261191146749",
  appId: "1:261191146749:web:a7a15153b19ccf4184f294",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

