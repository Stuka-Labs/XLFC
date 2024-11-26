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
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";


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
  ) => Promise<void>;
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
  register: async () => {},
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
    const authInstance = getAuth();
    const firestore = getFirestore();
    const currentUser = authInstance.currentUser;

    // if (!currentUser) {
    //   console.log('router', JSON.stringify(router));
    //   console.warn('No current user found');
    // }
    if (!env.IS_PROD) {
      try {
        connectAuthEmulator(authInstance, "http://127.0.0.1:9099");
      } catch (error) {
        console.error("Error connecting to Auth Emulator:", error);
      }
    }

    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (user: User | null) => {
        console.log("[authContext.tsx] auth state changed!", user);
        setUser(user);

        if (user) {
          const userDocRef = doc(firestore, "users", user.uid);

          // Real-time listener for Firestore user document
          const unsubscribeSnapshot = onSnapshot(userDocRef, async (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              console.log("[authContext.tsx] Firestore user data:", userData);

              if (userData?.displayName) {
                await AsyncStorage.setItem("displayName", userData.displayName);
              }

              if (userData?.photoURL) {
                await AsyncStorage.setItem("photoURL", userData.photoURL);
              }

              // Add any additional user data processing here
            } else {
              console.warn("User document does not exist in Firestore.");
            }
          });

          return () => unsubscribeSnapshot();
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  const login = async (
    email: string | undefined,
    password: string | undefined,
    isAutoCreate: boolean = false
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
      setUser(user);
      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error("Failed to retrieve logged-in user.");

      const idToken = await currentUser.getIdToken(true);

      console.log("[authContext.tsx] User logged in successfully.");

      // Redirect user based on account type
      await defaults.get(
        "userInfo", // Endpoint
        {}, // Params
        setInProgress, // Pass setInProgress to manage state
        async (response) => {
          console.log("Full Response:", response);

          if (!response.accountType) {
            console.log("No account received from server!");
            return;
          }
          console.log("Account received from server:", response.accountType);
          response.accountType &&
            (await AsyncStorage.setItem("account", response.accountType));
          response.displayName &&
            (await AsyncStorage.setItem("displayName", response.displayName));
        }, // Callback
        null, // Failed
        `${idToken}`, // Token
        undefined // Full URL
      );
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
    email: string | undefined,
    password: string | undefined,
    firstName?: string | undefined,
    surName?: string | undefined,
    phoneNumber?: string | undefined,
    isAutoCreate: boolean = false
  ) => {
    try {
      setInProgress(true);

      email =
        (email && email.trim() !== "") || isAutoCreate ? email : env.TEST_EMAIL;
      password =
        (password && password.trim() !== "") || isAutoCreate
          ? password
          : env.TEST_PASSWORD;

      if (!email || !password) {
        throw new Error("Email and Password are required for registration");
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const displayName = `${firstName || ""} ${surName || ""}`.trim();

      // Update the user's profile in Firebase Auth
      await updateProfile(user, { displayName });
      const idToken = (await user.getIdToken(true)) || "";
      const userObj = {
        email,
        password,
        confirmPassword: password,
        firstName,
        surName,
        phoneNumber,
        displayName,
        token: idToken,
      };

      console.log("Registering user in Firestore", userObj);

      // Store user information in Firestore or other backend
      await defaults.post(
        "createUser",
        userObj,
        setInProgress,
        (response) => {
          console.log("User info:", response);
          return Promise.resolve();
        },
        undefined,
        "",
        undefined
      );


      await AsyncStorage.setItem("auth_token", idToken);
      await AsyncStorage.setItem("displayName", displayName);

      setUser(user);
    } catch (error) {
      console.error("Error registering: ", error);
      throw error;
    } finally {
      setInProgress(false);
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

export const useAuth = () => useContext(AuthContext);
