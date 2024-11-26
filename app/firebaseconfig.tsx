import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, connectAuthEmulator } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore, connectFirestoreEmulator, collection, addDoc } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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
console.log("app?.options?.projectId", app?.options?.projectId);
// Initialize Auth with AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = getFirestore();
const functions = getFunctions(app);

if (process.env.NODE_ENV === "development") {
  const emulatorHost = "127.0.0.1";
  console.log("Connecting to emulator at:", emulatorHost);

  // connectAuthEmulator(auth, `http://${emulatorHost}:9199`);
  // connectFirestoreEmulator(firestore, emulatorHost, 8080);
  // connectFunctionsEmulator(functions, emulatorHost, 5002);

  addDoc(collection(firestore, "test"), { message: "Hello World!" })
    .then((docRef) => console.log("Document written with ID:", docRef.id))
    .catch((error) => console.error("Error adding document:", error));
}

export { app, auth, firestore, functions };
