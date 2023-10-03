import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyADcaRXImQi-NiF-08CPTdXIirfd009TgQ",
  authDomain: "chatapp-fa464.firebaseapp.com",
  projectId: "chatapp-fa464",
  storageBucket: "chatapp-fa464.appspot.com",
  messagingSenderId: "810995156112",
  appId: "1:810995156112:web:68713f5ae5ed8ca779c415",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
