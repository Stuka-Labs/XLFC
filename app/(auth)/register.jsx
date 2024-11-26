import { View, Text, ScrollView, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Checkbox from "@/components/inputs/Checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefaultInput from "../../components/inputs/DefaultInput";
import TopNavAction from "../../components/main/TopNavAction";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import env from "@/env";
import ArrowDown from "../../assets/images/nav/arrow-down.svg";
import images from "../../assets/images";
import { useAuth } from "../../context/authContext";
import defaults from "../../lib/defaults";
import PasswordInput from "@/components/inputs/PasswordInput";

const predefinedUser = {
  firstName: "Bob",
  surName: "Loblaw",
  email: "bobloblaw@gmail.com",
  displayName: "Bob Loblaw",
  phoneNumber: env.TEST_PHONE,
  password: env.TEST_PASSWORD,
  emailVerified: "true",
};

const RegisterScreen = () => {
  const { register, login, logout, user, auth } = useAuth();
  // const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [autoCreate, setAutoCreate] = useState(false);

  const handleRegister = async () => {
    if (autoCreate) {
      console.log('[register.tsx] exiting handleRegister')
      return;
    }
    await AsyncStorage.multiSet([
      ["email", email],
      ["surName", surName],
      ["firstName", firstName],
      ["phoneNumber", phoneNumber],
    ]);

    if (env.IS_PROD && (!email || !password || password !== confirmPassword)) {
      defaults.simpleAlert(
        "Validation Error",
        !email || !password
          ? "Please fill in all required fields."
          : "Passwords do not match."
      );
      return;
    }

    try {
      setInProgress(true); // Indicate registration is in progress
      if (password === "" && email === "") {
        Alert.alert("Error", "Email and password required.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }

      // Register the user
      await register(email, password, firstName, surName, phoneNumber);

      // Log in the user immediately after successful registration
      await login(email, password);

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error("Failed to retrieve logged-in user.");

      console.log("User registered and logged in successfully.");

      const idToken = await currentUser.getIdToken(true);
      // Redirect user based on account type
      await defaults.get(
        "userInfo",
        currentUser,
        setInProgress,
        async (response) => {
          if (!response.account) {
            return router.replace("/role");
          }

          await AsyncStorage.setItem("account", response.account);
          router.replace("/");
        },
        null,
        `${idToken}`
      );
    } catch (error) {
      console.error("Registration Error:", error);
      defaults.simpleAlert("Error", error.message || "Failed to register.");
      await logout(); // Ensure user is logged out on failure
    } finally {
      setInProgress(false);
    }
  };

  const handleAutoCreate = async () => {
    if (!autoCreate) {
      console.log('[register.tsx] starting handleAutoCreate')
      try {
        setInProgress(true);
        // Save data locally
        await AsyncStorage.multiSet([
          ["email", predefinedUser.email],
          ["surName", predefinedUser.surName],
          ["firstName", predefinedUser.firstName],
          ["phoneNumber", predefinedUser.phoneNumber],
          ["displayName", predefinedUser.displayName],
          ["emailVerified", predefinedUser.emailVerified],
        ]);

        await register(
          predefinedUser.email,
          predefinedUser.password,
          predefinedUser.firstName,
          predefinedUser.surName,
          predefinedUser.phoneNumber,
          true
        );
        await login(predefinedUser.email, predefinedUser.password, true);
        const currentUser = auth?.currentUser;
        if (!currentUser) throw new Error("Failed to retrieve logged-in user.");
        const idToken = await currentUser.getIdToken(true);
        console.log("currentUser", currentUser);
        console.log(`email from handleAutoCreate: ${predefinedUser.email}`);
        console.log(
          `password from handleAutoCreate: ${predefinedUser.password}`
        );

        console.log("User registered and logged in successfully.");

        await defaults.get(
          "userInfo",
          null,
          setInProgress,
          async (response) => {
            if (!response.accountType) {
              return router.replace("/role");
            }
            console.log("response", response);
            await AsyncStorage.setItem("account", response.accountType);
            router.replace("/");
          },
          null,
          `${idToken}`
        );
      } catch (error) {
        console.error("Registration Error:", error);
        defaults.simpleAlert("Error", error.message || "Failed to register.");
        await logout();
      } finally {
        setInProgress(false);
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Create Account" />
        <ScrollView>
          <DefaultInput
            label="First Name"
            style="mx-4 my-3"
            placeholder="Enter First Name"
            text={firstName}
            setText={setFirstName}
          />
          <DefaultInput
            label="Sur Name"
            style="mx-4 my-3"
            placeholder="Enter Sur Name"
            text={surName}
            setText={setSurName}
          />
          {/* <DefaultInput
            label="Date Of Birth"
            style="mx-4 my-3"
            placeholder="Enter Date Of Birth"
            text={dateOfBirth}
            setText={setDateOfBirth}
            rightView={
              <Image
                source={images.inputs.calendar}
                className="w-[20] h-[20]"
              />
            }
          /> */}
          <DefaultInput
            label="Email"
            style="mx-4 my-3"
            placeholder="Enter Email Address"
            text={email}
            setText={setEmail}
            keyboardType="email"
            autoCapitalize="none"
          />
          <DefaultInput
            label="Phone Number"
            style="mx-4 my-3"
            placeholder="+1 000 000 000"
            text={phoneNumber}
            setText={setPhoneNumber}
            leftView={
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={images.dummy.country_usa}
                  className="w-[22] h-[22]"
                />
                <ArrowDown color="#666666" />
              </View>
            }
          />
          <PasswordInput value={password} onChangeText={setPassword} />
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {!env.IS_PROD && (
            <View className="flex flex-row items-center mx-4 my-3">
              <Checkbox
                value={autoCreate}
                onValueChange={(newValue) => {
                  setAutoCreate(newValue);
                  if (newValue) {
                    handleAutoCreate();
                  }
                }}
              />
              <Text className="ml-2">Auto-create a predefined user</Text>
            </View>
          )}
        </ScrollView>
        <ButtonPrimary
          text="Continue"
          containerProps="mx-4 my-4"
          inProgress={inProgress}
          onPress={handleRegister}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RegisterScreen;
