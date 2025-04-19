import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzhaVgFkvQ7xFPqnnm_bZctAZ-zJa6jQs",
  authDomain: "moviecon-d1c1f.firebaseapp.com",
  projectId: "moviecon-d1c1f",
  storageBucket: "moviecon-d1c1f.firebasestorage.app",
  messagingSenderId: "1040000088109",
  appId: "1:1040000088109:web:fb6adb7043fdaf46c5e0a4"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const firestore_db = getFirestore(app);

export { app, firestore_db };