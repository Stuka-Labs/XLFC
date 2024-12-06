import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

if (!extra) {
  throw new Error("Expo config is not set correctly. Ensure 'extra' is defined in app.config.js.");
}

console.log("Extra config:", extra);
const NODE_ENV = extra.eas.NODE_ENV || "development"; // Fallback to development if undefined
const isDevelopment = NODE_ENV === "development";
const emulatorHost = "127.0.0.1"; // Replace with your emulator's host if different

if (isDevelopment) {
  console.log("Running in development mode. Connecting to Firebase emulators.");
} else {
  console.log("Running in production mode. Connecting to Firebase production services.");
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjG4zCetIbppB0g4jF2tm4KO0SSkz8t_4",
  authDomain: "xlfc-e8f8f.firebaseapp.com",
  projectId: "xlfc-e8f8f",
  storageBucket: "xlfc-e8f8f.appspot.com",
  messagingSenderId: "873926025846",
  appId: "1:873926025846:ios:aae1ebb2d3f88a96223557",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const functions = getFunctions(app);

// Connect to emulators in development mode
if (isDevelopment) {
  connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
  connectFirestoreEmulator(firestore, emulatorHost, 8080);
  connectFunctionsEmulator(functions, emulatorHost, 5001);
}

export { app, auth, firestore, functions };
