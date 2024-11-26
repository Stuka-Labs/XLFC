// app/(auth)/login.jsx
import { View, Text, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DefaultInput from "../../components/inputs/DefaultInput";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";

import images from "../../assets/images";
import defaults from "../../lib/defaults";
import { useAuth } from "../../context/authContext";
import PasswordInput from "@/components/inputs/PasswordInput";
import * as Google from "expo-auth-session/providers/google";

const LoginScreen = () => {
  const { login, user, auth } = useAuth();
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "873926025846-alnov15hhvrpv07u5lt8judnqeqq9d6j.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inProgress, setInProgress] = useState(false);

  async function handleLogin() {
    try {
      setInProgress(true);

      console.log("logging in in login.tsx " + email + " " + password);
      // Log in the user immediately after successful registration
      const maybeUser = await login(email, password);

      console.log("maybeUser: ", maybeUser?.email || "No user found");

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error("Failed to retrieve logged-in user.");
      console.log("User logged in successfully.");
      const idToken = await auth.currentUser.getIdToken(true);
      // console.log("[Client] Refreshed ID Token:", idToken);
      await AsyncStorage.setItem("auth_token", idToken);
      await AsyncStorage.setItem("email", email);

      if (maybeUser) {
        defaults.get(
          "userInfo",
          currentUser,
          setInProgress,
          async (response) => {
            if (!response.account) {
              console.log("No account found, redirecting to role page");
              return router.replace("/role");
            }
            console.log("Account found, setting async storage");
            await AsyncStorage.setItem("first_name", response.first_name);
            await AsyncStorage.setItem("sur_name", response.sur_name);
            await AsyncStorage.setItem("account", response.account);
            return router.replace("/");
          },
          null,
          `${idToken}`
        );
        // return router.push("/role");
      }
    } catch (error) {
      // Use the alert to display the error message
      defaults.simpleAlert(
        "Authentication Error",
        error?.message || "An error occurred during login."
      );
    } finally {
      setInProgress(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setInProgress(true);

      // Prompt the user to sign in with Google
      const result = await promptAsync();
      if (result.type === "success") {
        // Extract the token and fetch user info
        const { id_token } = result.params;

        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${id_token}` },
          }
        );
        const userInfo = await userInfoResponse.json();

        console.log("User Info:", userInfo);

        // Set user info to AsyncStorage or Context
        await AsyncStorage.setItem("auth_token", id_token);
        await AsyncStorage.setItem("email", userInfo.email);

        // Redirect the user based on account status
        defaults.get(
          "userInfo",
          {},
          setInProgress,
          async (response) => {
            if (!response.account) {
              console.log("No account found, redirecting to role page");
              return router.replace("/role");
            }
            console.log("Account found, setting async storage");
            await AsyncStorage.setItem("first_name", response.first_name);
            await AsyncStorage.setItem("sur_name", response.sur_name);
            await AsyncStorage.setItem("account", response.account);
            return router.replace("/");
          },
          null,
          `${id_token}`
        );
      } else {
        console.log("Google sign-in was canceled.");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    } finally {
      setInProgress(false);
    }
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
          style="mx-4 my-3"
          placeholder="Enter Email Address"
          text={email}
          setText={setEmail}
          autoCapitalize="none"
          leftView={
            <Image
              source={images.inputs.person}
              className="w-[20] h-[31]"
              resizeMode="cover"
            />
          }
        />
        <PasswordInput value={password} />
        <View className="flex items-end">
          <Text
            className="underline text-gray-400 mx-4"
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
        />
        <View className="flex flex-row items-center mx-auto space-x-4 mt-4">
          <Image source={images.feedback.leftBar} className="w-[90] h-[1]" />
          <Text>Or continue with</Text>
          <Image source={images.feedback.rightBar} className="w-[90] h-[1]" />
        </View>
        <ButtonPrimary
          text="Continue with Google"
          containerProps="mx-4 my-6"
          backgroundColor="white"
          textColor="black"
          borderColor="#D0D5DD"
          fontSize={16}
          onPress={handleGoogleSignIn}
          leftView={
            <Image source={images.socials.google} className="w-[28] h-[28]" />
          }
        />
        <Text className="text-center">
          Don't have an account?{" "}
          <Text
            className="text-primary underline font-semibold"
            onPress={() => router.push("/register")}
          >
            Register Now
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
