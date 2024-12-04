import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import env from "@/env";
import FirebaseAuthTypes, {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  connectAuthEmulator,
  updateProfile,
} from "firebase/auth";
import defaults from "../lib/defaults";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { app as firebaseApp, firestore } from "@/app/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   onSnapshot,
// } from "firebase/firestore";

interface AuthContextInterface {
  user?: FirebaseAuthTypes.User | null;
  auth?: FirebaseAuthTypes.Auth | null;
  setInProgress?: (inProgress: boolean) => void;
  login?: (email: string, password: string) => Promise<FirebaseAuthTypes.User>;
  register?: (
    email: string | undefined,
    password: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    phoneNumber: string | undefined
  ) => Promise<FirebaseAuthTypes.User | null>;
  logout?: () => Promise<void>;
  loading?: boolean;
  isAutoCreate?: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  auth: null,
  setInProgress: () => {}, // No-op function as a placeholder
  login: async (email: string, password: string) => {
    return {} as FirebaseAuthTypes.User;
  },
  register: async () => {
    return {} as FirebaseAuthTypes.User;
  },
  logout: async () => {},
  loading: false,
  isAutoCreate: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [auth, setAuth] = useState<FirebaseAuthTypes.Auth | null>(null);
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    // Use the initialized Firebase app
    const authInstance = getAuth(firebaseApp);

    if (!env.IS_PROD) {
      try {
        connectAuthEmulator(authInstance, "http://127.0.0.1:9099");
        console.log("Connected to auth Emulator");
      } catch (error) {
        console.error("Error connecting to Auth Emulator:", error);
      }
    }

    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (user: User | null) => {
        if (user) {
          console.log("[authContext.tsx] auth state changed!");
          setUser(user);
          await AsyncStorage.setItem("uid", user?.uid);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string | undefined,
    password: string | undefined
  ) => {
    try {
      setInProgress(true); // Mark the process as in progress
      const auth = getAuth();
      console.log(`email from login authContext: ${email}`);
      console.log(`password from login authContext: ${password}`);

      if (!email || !password) {
        throw new Error("Email and Password are required for login");
      }

      console.log("auth: ", auth);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      if (!user) throw new Error("Failed to retrieve logged-in user.");
      setUser(user);

      // const idToken = await user.getIdToken(true);

      // console.log("[authContext.tsx] User logged in successfully.");

      // const uid = await AsyncStorage.getItem("uid");
      // const firstName = await AsyncStorage.getItem("firstName");
      // const surName = await AsyncStorage.getItem("surName");
      // const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      // const displayName = await AsyncStorage.getItem("displayName");
      // if (uid) {
      //   await updateUser(
      //     uid,
      //     {
      //       email: email,
      //       firstName: firstName,
      //       surName: surName,
      //       phoneNumber: phoneNumber,
      //       displayName: displayName,
      //       emailVerified: true,
      //     },
      //     idToken
      //   );
      // }

      // // Redirect user based on account type
      // await defaults.getUserInfo(
      //   "userInfo", // Endpoint
      //   { uid: user.uid, email: user.email }, // Params
      //   setInProgress, // Pass setInProgress to manage state
      //   async (response) => {
      //     console.log("Full Response:", response);

      //     if (!response.accountType) {
      //       console.log("No account received from server!");
      //       return;
      //     }
      //     console.log("Account received from server:", response.accountType);
      //     response.accountType &&
      //       (await AsyncStorage.setItem("account", response.accountType));
      //     response.displayName &&
      //       (await AsyncStorage.setItem("displayName", response.displayName));
      //   }, // Callback
      //   undefined, // Failed
      //   `${idToken}`, // Token
      //   undefined // Full URL
      // );
      return user;
    } catch (error: any) {
      // console.error("Login error:", error);
      throw error;
    } finally {
      setInProgress(false); // Mark the process as completed
    }
  };

  const logout = async () => {
    try {
      setInProgress(true); // Mark the process as in progress
      const auth = getAuth();
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("displayName");
      await AsyncStorage.removeItem("phoneNumber");
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    } finally {
      setInProgress(false); // Mark the process as completed
    }
  };

  const register = async (
    email: string | null | undefined,
    password: string | null | undefined,
    firstName?: string | null,
    surName?: string | null,
    phoneNumber?: string | null,
    isAutoCreate: boolean = false
  ) => {
    try {
      setInProgress(true);
      console.log("email", email);
      console.log("password", password);
      email =
        (email && email.trim() !== "") || isAutoCreate ? email : env.TEST_EMAIL;
      password =
        (password && password.trim() !== "") || isAutoCreate
          ? password
          : env.TEST_PASSWORD;

      if (!email || !password) {
        throw new Error("Email and Password are required for registration");
      }

      if (!auth) {
        throw new Error("Not connecting to firebase auth correctly.");
      }

      console.log("auth from authContext", auth);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("userCredential created successfully from authContext");
      const user = userCredential.user;

      // const displayName = `${firstName || ""} ${surName || ""}`.trim();

      // // Update the user's profile in Firebase Auth
      // await updateProfile(user, { displayName });
      // const idToken = (await user.getIdToken(true)) || "";

      // // Save data to AsyncStorage
      // await AsyncStorage.setItem("auth_token", idToken);
      // await AsyncStorage.multiSet([
      //   ["email", email],
      //   ["surName", userDoc.surName || ""],
      //   ["firstName", userDoc.firstName || ""],
      //   ["phoneNumber", userDoc.phoneNumber || ""],
      //   ["displayName", userDoc.displayName],
      // ]);
      setUser(user);
      const displayName = `${firstName || ""} ${surName || ""}`.trim();
      const userDoc = {
        uid: user.uid,
        email: user.email,
        firstName: firstName || "",
        surName: surName || "",
        phoneNumber: phoneNumber || "",
        displayName,
        createdAt: new Date().toISOString(),
        admin: false, // Default role settings
        superadmin: false,
        coach: false,
        player: true,
      };

      console.log("Preparing Firestore user document:", userDoc);

      try {
        console.log("Attempting to set Firestore document...");
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, userDoc);
        console.log("User document created successfully!");
      } catch (firestoreError) {
        if (firestoreError instanceof Error) {
          console.error("Firestore Error:", firestoreError.message);
          console.error("Stack Trace:", firestoreError.stack);
        } else {
          console.error("Unknown Firestore Error:", firestoreError);
        }
      }

      console.log("User document created in Firestore.");
      return user;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    } finally {
      setInProgress(false);
    }
  };

  const updateUser = async (
    uid: string | null,
    userData: {
      email?: string | null;
      firstName?: string | null;
      surName?: string | null;
      phoneNumber?: string | null;
      displayName?: string | null;
      emailVerified?: boolean;
    },
    token?: string
  ) => {
    try {
      let url = `${env.API_DOMAIN_WITH_ENDPOINT(`/updateUser/${uid}`)}`;
      // update url to replace the last "/" with ""
      url = url.replace(/\/$/, "");
      console.log("url from authContext to updateUser", url);
      // await defaults.putNew(
      //   url, // Endpoint
      //   userData, // Request body
      //   null, // Optional progress callback
      //   async (response) => {
      //     console.log("User updated successfully:", response);
      //   },
      //   async (error) => {
      //     console.error("Error updating user:", error);
      //   },
      //   token
      // );
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        setInProgress,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
