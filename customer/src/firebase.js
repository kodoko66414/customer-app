// customer/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiV3IO9jPN6fRLvOQzPPmuPyDJaHMnyMQ",
  authDomain: "customer-app-acafe.firebaseapp.com",
  projectId: "customer-app-acafe",
  storageBucket: "customer-app-acafe.firebasestorage.app",
  messagingSenderId: "229778535288",
  appId: "1:229778535288:web:9155fa40f73ff919460e8d",
  measurementId: "G-NKEE7LHEHP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);