// app/(auth)/login.jsx
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "@/components/inputs/Checkbox";
import DefaultInput from "../../components/inputs/DefaultInput";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import env from "@/env";
import images from "../../assets/images";
import defaults from "../../lib/defaults";
import { useAuth } from "../../context/authContext";
import PasswordInput from "@/components/inputs/PasswordInput";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

// import * as Google from "expo-auth-session/providers/google";

type RootStackParamList = {
  home: undefined;
  role: undefined;
  recovery: undefined;
  register: undefined;
};

const LoginScreen = () => {
  const router = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { login, user, auth } = useAuth();
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "873926025846-alnov15hhvrpv07u5lt8judnqeqq9d6j.apps.googleusercontent.com",
  //   scopes: ["profile", "email"],
  // });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [autoCreate, setAutoCreate] = useState(false);

  useEffect(() => {
    async function getEmailAndPassword() {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedEmail && storedEmail !== "") {
        console.log("[login.jsx] setting storedEmail", storedEmail);
        setEmail(storedEmail);
      }
      if (storedPassword && storedPassword !== "") {
        console.log("[login.jsx] setting storedPassword ", storedPassword);
        setPassword(storedPassword);
      }
    }
    getEmailAndPassword();
  }, []);

  async function handleLogin() {
    try {
      setInProgress(true);

      if (!login) return;

      const maybeUser = await login(email, password);

      console.log("maybeUser: ", maybeUser?.email || "No user found");

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error("Failed to retrieve logged-in user.");

      const idToken = await auth.currentUser.getIdToken(true);
      // console.log("[Client] Refreshed ID Token:", idToken);
      await AsyncStorage.setItem("auth_token", idToken);
      // await AsyncStorage.setItem("email", email);

      if (maybeUser) {
        defaults.getNew(
          "userInfo",
          currentUser,
          setInProgress,
          async (response) => {
            if (!response.account) {
              console.log("No account found, redirecting to role page");
              return router.replace("role");
            }
            console.log("Account found, setting async storage");
            console.log(
              "firstName after login in login.jsx",
              response.firstName
            );
            await AsyncStorage.setItem("first_name", response.first_name);
            await AsyncStorage.setItem("sur_name", response.sur_name);
            await AsyncStorage.setItem("account", response.account);
            await AsyncStorage.setItem("password", password);
            return router.replace("home");
          },
          undefined,
          `${idToken}`
        );
      }
    } catch (error) {
      // Use the alert to display the error message
      defaults.simpleAlert(
        "Authentication Error",
        (error as any)?.message || "An error occurred during login.",
        "OK",
        undefined,
        undefined
      );
    } finally {
      setInProgress(false);
    }
  }

  // async function handleGoogleSignIn() {
  //   try {
  //     setInProgress(true);

  //     // Prompt the user to sign in with Google
  //     const result = await promptAsync();
  //     if (result.type === "success") {
  //       // Extract the token and fetch user info
  //       const { id_token } = result.params;

  //       const userInfoResponse = await fetch(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: { Authorization: `Bearer ${id_token}` },
  //         }
  //       );
  //       const userInfo = await userInfoResponse.json();

  //       console.log("User Info:", userInfo);

  //       // Set user info to AsyncStorage or Context
  //       await AsyncStorage.setItem("auth_token", id_token);
  //       await AsyncStorage.setItem("email", userInfo.email);

  //       // Redirect the user based on account status
  //       defaults.getNew(
  //         "userInfo",
  //         {},
  //         setInProgress,
  //         async (response) => {
  //           if (!response.account) {
  //             console.log("No account found, redirecting to role page");
  //             return router.replace("/role");
  //           }
  //           console.log("Account found, setting async storage");
  //           await AsyncStorage.setItem("first_name", response.first_name);
  //           await AsyncStorage.setItem("sur_name", response.sur_name);
  //           await AsyncStorage.setItem("account", response.account);
  //           return router.replace("/");
  //         },
  //         null,
  //         `${id_token}`
  //       );
  //     } else {
  //       console.log("Google sign-in was canceled.");
  //     }
  //   } catch (error) {
  //     console.error("Error during Google Sign-In:", error);
  //   } finally {
  //     setInProgress(false);
  //   }
  // }

  function handleUseTestUser() {
    setEmail("bobloblaw@gmail.com");
    setPassword("G9&kL!zX2@Yt~");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to the XLFC App!</Text>

        <DefaultInput
          label="Email"
          style={styles.input}
          placeholder="Enter Email Address"
          text={email}
          setText={setEmail}
          autoCapitalize="none"
          leftView={
            <Image
              source={images.inputs.person}
              style={styles.inputIcon}
              resizeMode="cover"
            />
          }
        />
        <PasswordInput value={password} onChangeText={setPassword} />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => router.push("recovery")}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <ButtonPrimary
          text="Login"
          containerProps={styles.loginButton}
          inProgress={inProgress}
          onPress={handleLogin}
          icon={undefined}
          progressOver={undefined}
          leftView={undefined}
          rightView={undefined}
        />
        {/* Uncomment if using Google Sign-In
        <View style={styles.socialContainer}>
          <View style={styles.socialBar} />
          <Text style={styles.orText}>Or continue with</Text>
          <View style={styles.socialBar} />
        </View>
        <ButtonPrimary
          text="Continue with Google"
          containerProps={styles.googleButton}
          backgroundColor="white"
          textColor="black"
          borderColor="#D0D5DD"
          fontSize={16}
          onPress={handleGoogleSignIn}
          leftView={
            <Image source={images.socials.google} style={styles.googleIcon} />
          }
        /> */}
        {!env.IS_PROD && (
          <View style={styles.testUserContainer}>
            <Checkbox
              value={autoCreate}
              onValueChange={(newValue) => {
                setAutoCreate(newValue);
                if (newValue) {
                  handleUseTestUser();
                }
              }}
              label={""}
            />
            <Text style={styles.testUserText}>Use Test User</Text>
          </View>
        )}
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("register")}
          >
            Register Now
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 16,
  },
  input: {
    marginVertical: 12,
  },
  inputIcon: {
    width: 20,
    height: 31,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginHorizontal: 16,
  },
  forgotPasswordText: {
    textDecorationLine: "underline",
    color: "#9CA3AF", // Gray-400
  },
  loginButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  socialBar: {
    height: 1,
    width: 90,
    backgroundColor: "#D1D5DB", // Gray-300
  },
  orText: {
    marginHorizontal: 8,
  },
  googleButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  testUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  testUserText: {
    marginLeft: 8,
  },
  registerText: {
    textAlign: "center",
  },
  registerLink: {
    color: "#1D4ED8", // Primary
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default LoginScreen;
