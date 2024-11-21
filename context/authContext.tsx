// TODO: auth context for firebase authentication

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import env from '../lib/env'

interface AuthContextInterface {
  user: FirebaseAuthTypes.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      // console.log("user logged in!", user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string | undefined, password: string | undefined) => {
    try {
      email = env.IS_PROD ? email : env.USER_EMAIL;
      password = env.IS_PROD ? password : env.USER_PASSWORD;
      console.log("Attempting login with email:", email);

      if (!email || !password) {
        throw new Error("Email and Password are required for login");
      }

      await auth().signInWithEmailAndPassword(email, password);
      console.log("Login successful");
    } catch (error: any) {
      // console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        error.message = "Invalid credential. Ensure the token or credentials are correct.";
      } else if (error.code === "auth/wrong-password") {
        error.message = "Incorrect password.";
      } else if (error.code === "auth/user-not-found") {
        error.message = "No user found with this email.";
      } else {
        error.message = error.message || "Unknown login error.";
      }

      // Rethrow the error so it can be handled in the calling function
      throw error;
    }
  };



  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error registering: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
