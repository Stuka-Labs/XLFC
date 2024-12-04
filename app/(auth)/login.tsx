// app/(auth)/login.jsx
import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "@/components/inputs/Checkbox";
import DefaultInput from "@/components/inputs/DefaultInput";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import env from "@/env";
import images from "@/assets/images";
import defaults from "@/lib/defaults";
import { useAuth } from "@/context/authContext";
import PasswordInput from "@/components/inputs/PasswordInput";
import React from "react";

const LoginScreen = () => {
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

      if (!login) {
        throw new Error("Login function is not defined.");
      }
      const maybeUser = await login(email, password);

      console.log("maybeUser: ", maybeUser?.email || "No user found");

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error("Failed to retrieve logged-in user.");
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      const idToken = await auth.currentUser.getIdToken(true);
      // console.log("[Client] Refreshed ID Token:", idToken);

      // await AsyncStorage.setItem("email", email);

      if (maybeUser) {
        defaults.getUserInfo(
          "userInfo",
          currentUser,
          setInProgress,
          async (response) => {
            if (!response.accountType) {
              console.log("No account found, redirecting to role page");
              return router.replace("/role");
            }
            if (response.accountType === "player") {
              return router.replace("/more-info");
            }
            return router.replace("/");
          },
          undefined,
          `${idToken}`
        );
      }
    } catch (error) {
      // Use the alert to display the error message
      defaults.simpleAlert(
        "Authentication Error",
        (error as any)?.message || "An error occurred during login."
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
  //           if (!response.accountType) {
  //             console.log("No account found, redirecting to role page");
  //             return router.replace("/role");
  //           }
  //           console.log("Account found, setting async storage");
  //           await AsyncStorage.setItem("first_name", response.first_name);
  //           await AsyncStorage.setItem("sur_name", response.sur_name);
  //           await AsyncStorage.setItem("account", response.accountType);
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
    setPassword("AutoUser123!");
  }

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full flex flex-col justify-center">
        <Image source={images.logo} className="w-[135] h-[123] mx-auto" />
        <Text className="text-2xl font-semibold text-center mt-4 mb-8">
          Welcome to the XLFC App!
        </Text>

        <DefaultInput
          label="Email"
          className="mx-4 my-3"
          placeholder="Enter Email Address"
          text={email}
          setText={setEmail}
          autoCapitalize="none"
          leftView={
            <Image
              source={images.inputs.person}
              style={{ width: 20, height: 31 }}
              resizeMode="cover"
            />
          }
        />
        <PasswordInput value={password} onChangeText={setPassword} />
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Text
            style={{ textDecorationLine: "underline", color: "gray", marginHorizontal: 16 }}
            onPress={() => router.push("/recovery")}
          >
            Forgot Password?
          </Text>
        </View>
        <ButtonPrimary
          text="Login"
          containerProps="mx-4 my-6"
          inProgress={inProgress}
          onPress={handleLogin}
          icon={undefined}
          progressOver={undefined}
          leftView={undefined}
          rightView={undefined}
        />

        {!env.IS_PROD && (
          <>
            <View className="flex flex-row items-center justify-center mx-4 my-3">
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
              <Text className="ml-2">Use Test User</Text>
            </View>
          </>
        )}
        <Text style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline", fontWeight: "600" }}
            onPress={() => router.push("/register")}
          >
            Register Now
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default LoginScreen;
