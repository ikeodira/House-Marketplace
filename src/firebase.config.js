// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJIP7tTFB3n2YIrCDAzZP3_U2PwM7ZIXo",
  authDomain: "house-marketplace-app-5edaf.firebaseapp.com",
  projectId: "house-marketplace-app-5edaf",
  storageBucket: "house-marketplace-app-5edaf.appspot.com",
  messagingSenderId: "135800396035",
  appId: "1:135800396035:web:1dc7fef7d18d63508f7136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()