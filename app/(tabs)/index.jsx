import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/authContext";
import images from "../../assets/images";
import defaults from "@/lib/defaults";
import env from "@/env";
import { updateProfile } from "firebase/auth";
import admin from "@/assets/images/dummy/role_admin.png";
import Checkbox from "@/components/inputs/Checkbox";

// https://avatars.githubusercontent.com/u/28612032?v=4

// Custom Input for Display Name
const DisplayNameInput = ({ value, onChangeText }) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter your name"
      placeholderTextColor="#cccccc"
      style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        paddingVertical: 4,
      }}
    />
  );
};

// Custom Input for Photo URL
const PhotoUrlInput = ({ value, onChangeText, onClear }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#FFFFFF",
        paddingVertical: 4,
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter photo URL"
        placeholderTextColor="#cccccc"
        style={{
          fontSize: 14,
          color: "white",
          flex: 1,
        }}
      />
      {value !== "" && (
        <TouchableOpacity onPress={onClear} style={{ marginLeft: 8 }}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
            X
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HomeScreen = () => {
  const { auth, user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);
  const [account, setAccount] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [photoURL, setPhotoUrl] = useState(null);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [members, setMembers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [ping, setPing] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    async function init() {
      if (!user) return;

      setDisplayName(user.displayName);
      setPhotoUrl(user.photoURL);

      const idToken = await user.getIdToken(true);

      // Fetch players on team
      defaults.getNew(
        "fetchAllPlayersOnTeam",
        { teamId: "xlfc", searchQuery: "xlfc" }, // Add your query parameters here
        (inProgress) => console.log("Fetching in progress:", inProgress),
        (response) => {
          console.log("Response from fetchAllPlayersOnTeam", response.data);
          if (Array.isArray(response.data)) {
            setMembers(response.data.length);

            // console.log('parseInt(response.data[0].height) + parseInt(response.data[0].weight)', parseInt((response.data[0].height)) + parseInt((response.data[0].weight)));
            setTotalPoints(
              parseInt(response.data[0]?.height || 0) +
                parseInt(response.data[0]?.bonusPoints || 0)
            );
          }
        },
        (error) => console.error("Error fetching players:", error),
        idToken // Optional token
      );

      // Fetch all teams
      defaults.getNew(
        "fetchAllTeams",
        {}, // No additional query parameters
        (inProgress) =>
          console.log("Fetching all teams in progress:", inProgress),
        (response) => {
          console.log("Response from fetchAllTeams:", response.data);
          if (Array.isArray(response.data)) {
            setTeams(response.data);
          }
        },
        (error) => console.error("Error fetching teams:", error),
        idToken // Optional token
      );
    }

    init();
  }, [user, members]);

  async function logOut() {
    await AsyncStorage.clear();
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

  const handleSetDisplayName = async (value) => {
    if (user && auth) {
      try {
        await updateProfile(user, { displayName: value });
        console.log("Firebase Auth displayName updated to:", value);

        setDisplayName(value);
        await AsyncStorage.setItem("displayName", value);
      } catch (error) {
        console.error("Error updating displayName:", error);
      }
    }
  };

  const handleSetPhotoUrl = async (value) => {
    if (user && auth) {
      try {
        await updateProfile(user, { photoURL: value });
        console.log("Firebase Auth photoURL updated to:", value);

        setPhotoUrl(value);
        await AsyncStorage.setItem("photoURL", value);
        setShowPhotoInput(false); // Hide the input after updating
      } catch (error) {
        console.error("Error updating photoURL:", error);
      }
    }
  };

  const handleClearPhotoUrl = async () => {
    if (user && auth) {
      try {
        await updateProfile(user, { photoURL: "" });
        console.log("Photo URL successfully cleared");

        setPhotoUrl(null);
        await AsyncStorage.removeItem("photoURL");
        setShowPhotoInput(false); // Hide the input after clearing
      } catch (error) {
        console.error("Error clearing photoURL:", error);
      }
    }
  };

  async function handlePing() {
    const token = await auth.currentUser.getIdToken(true);
    if (!token || token === "") {
      router.replace("/login");
    }
    defaults.getNew(
      "ping",
      {},
      setInProgress,
      (reponse) => {
        Alert.alert("Ping", reponse.data.messsage);
      },
      console.error,
      token,
      undefined
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
          {/* Profile Image */}
          <TouchableOpacity onPress={() => setShowPhotoInput(!showPhotoInput)}>
            <Image
              source={photoURL ? { uri: photoURL } : admin}
              className="h-[52] w-[52] rounded-full"
            />
          </TouchableOpacity>
          <View className="mx-4 flex-1">
            <Text className="text-white">Hello,</Text>
            <DisplayNameInput
              value={displayName || ""}
              onChangeText={(value) => setDisplayName(value)}
            />
            {/* Conditionally show the photo URL input */}
            {showPhotoInput && (
              <PhotoUrlInput
                value={photoURL}
                onChangeText={handleSetPhotoUrl}
                onClear={handleClearPhotoUrl}
              />
            )}
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

            {teams.map((team, index) => (
              <TouchableOpacity
                key={team.teamId || `${team.name}-${index}`}
                className="border-[1px] border-[#E4E4E4] !border-red-500 mt-4 rounded-2xl p-4"
                onPress={() => {
                  switch (account) {
                    case "admin":
                      router.push({
                        pathname: "/new-team",
                        params: {
                          id: team.teamId, // Use teamId as a unique identifier
                          old_name: team.name,
                          old_description: team.description,
                        },
                      });
                    default:
                      router.push({
                        pathname: "/player-stats",
                        params: {
                          id: team.teamId, // Use teamId as a unique identifier
                          name: team.name,
                          description: team.description,
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
                  <View classaName="mx-2.5 flex-1">
                    <Text className="font-bold text-lg">{team.name}</Text>
                    {team.description && (
                      <Text className="text-gray-500 text-xs">
                        {team.description}
                      </Text>
                    )}
                    {(members > 0 || totalPoints > 0) && (
                      <View className="flex-row items-center space-x-2">
                        {members > 0 && (
                          <Text className="text-gray-500 text-xs font-bold">
                            {members}
                            <Text className="text-gray-500 text-xs text-green-500 font-bold">
                              &nbsp;Members
                            </Text>
                          </Text>
                        )}
                        {totalPoints > 0 && (
                          <Text className="text-gray-500 text-xs font-bold">
                            {totalPoints}
                            <Text className="text-gray-500 text-xs text-green-500 font-bold">
                              &nbsp;Total Points
                            </Text>
                          </Text>
                        )}
                      </View>
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
        <View className="flex flex-row items-center justify-center mx-4 my-3">
          <Checkbox
            value={ping}
            onValueChange={(newValue) => {
              setPing(newValue);
              if (newValue) {
                handlePing();
              }
            }}
          />
          <Text className="ml-2">Ping</Text>
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
