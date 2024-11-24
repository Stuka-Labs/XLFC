import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/authContext";

import images from "../../assets/images";
import defaults from "../../lib/defaults";
import env from "../../lib/env";

const HomeScreen = () => {
  const { auth, user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);
  const [account, setAccount] = useState(null);
  const [firstName, setFirstName] = useState("");

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [auth])
  );

  async function refresh() {
    if (!auth) return;
    setFirstName(await AsyncStorage.getItem("first_name"));
    const account = await AsyncStorage.getItem("account");
    console.log("account from HomeScreen: ", account);
    setAccount(account);

    const idToken =
      auth && auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
    if (account && idToken) {
      defaults.get(
        account == "admin" ? "fetchAllTeams" : account === "coach" ? "fetchCoachTeams" : "fetchPlayerTeams",
        null,
        null,
        (response) => {
          setTeams(response.data);
          if (response.data.length == 0)
            router.push({
              pathname: "/success",
              params: {
                message:
                  "Your Account has been created.\nPlease wait while admin approves",
              },
            });
        },
        null,
        `${idToken}`
      );
    }
  }

  async function logOut() {
    await AsyncStorage.removeItem("auth_token");
    await logout();
    router.replace("/login");
  }

  async function deleteAccount() {
    const authToken = await AsyncStorage.getItem("auth_token");
    if (!authToken) {
      Alert.alert("Error", "You need to be logged in to delete your account.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Deleting account...");
              const url = `${env.API_DOMAIN_WITH_ENDPOINT("deleteUser")}`; // Construct the full URL
              console.log("Delete URL:", url);

              const response = await fetch(url, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              });

              if (response.ok) {
                console.log("Account successfully deleted");
                await AsyncStorage.clear(); // Clear local storage
                router.replace("/login"); // Redirect to login
              } else {
                const errorText = await response.text();
                console.error("Failed to delete account:", errorText);
                Alert.alert("Error", "Failed to delete account. Try again.");
              }
            } catch (err) {
              console.error("Error deleting account:", err);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          },
        },
      ]
    );
  }

  return (
    <GestureHandlerRootView>
      <View
        className="bg-[#1D82C6] h-full flex flex-col"
        style={{ paddingTop: insets.top }}
      >
        <Image
          source={images.lionHead}
          className="h-[72] mx-auto"
          resizeMode="contain"
        />
        <View className="flex flex-row items-center mx-4 mb-4">
          <Image source={images.dummy.ronaldo} className="h-[52] w-[52]" />
          <View className="mx-4 flex-1">
            <Text className="text-white">Hello,</Text>
            <Text className="text-white font-bold text-xl">{firstName}</Text>
          </View>
          <TouchableOpacity
            className="w-[42] h-[42] rounded-xl border-[1px] border-[#FFFFFF] flex items-center justify-center"
            onPress={logOut}
          >
            <Image
              source={images.feedback.logout}
              className="h-[24] w-[24] ml-1"
            />
          </TouchableOpacity>
        </View>
        <View className="bg-white flex-1 rounded-t-[33.3px] overflow-hidden">
          <ScrollView className="px-4">
            <Text className="text-xl font-bold mt-6">Teams</Text>

            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                className="border-[1px] border-[#E4E4E4] mt-4 rounded-2xl p-4"
                onPress={() => {
                  switch (account) {
                    case "admin":
                      router.push({
                        pathname: "/new-team",
                        params: {
                          id: team.id,
                          old_name: team.name,
                          old_description: team.description,
                        },
                      });
                      break;
                  }
                }}
              >
                <View className="flex-row items-center">
                  <Image
                    source={images.dummy.readings}
                    className="h-[57] w-[57]"
                    resizeMode="contain"
                  />
                  <View className="mx-2.5 flex-1">
                    <Text className="font-bold text-lg">{team.name}</Text>
                    {team.description && (
                      <Text className="text-gray-500 text-xs">
                        {team.description}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {account === "coach" && teams.length === 0 && (
              <Text className="my-6 font-semibold">{`Your Account has been created.\nPlease wait while admin approves`}</Text>
            )}
            <View className="mb-6" />
          </ScrollView>
        </View>
        {!env.IS_PROD && (
          <TouchableOpacity
            className="bg-[#FF4D4F] py-3"
            onPress={deleteAccount}
          >
            <Text className="text-white text-center font-bold">
              Delete Account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
