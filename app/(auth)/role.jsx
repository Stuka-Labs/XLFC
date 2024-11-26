import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/authContext";
import DefaultInput from "../../components/inputs/DefaultInput";
import TopNavAction from "../../components/main/TopNavAction";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import images from "../../assets/images";
import defaults from "../../lib/defaults";
import LogoutIcon from "../../components/buttons/LogoutIcon";
import { useState, useEffect, useCallback } from "react";
import env from "@/env";

const RoleScreen = () => {
  const { login, logout, user, auth } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const accounts = [
    {
      account: "player",
      subTitle: "",
      image: images.dummy.player,
      endpoint: "assignUserAsPlayer",
    },
    {
      account: "coach",
      subTitle: "",
      image: images.dummy.manager,
      endpoint: "assignUserAsCoach",
    },
    {
      account: "admin",
      subTitle: "",
      image: images.dummy.admin,
      endpoint: "createAdmin",
    },
  ];

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  async function refresh() {
    if (!auth || !user) return;
    console.log("Getting account Type...");

    await getAccountType();
  }

  async function getAccountType() {
    const account = await AsyncStorage.getItem("account");
    console.log("Account Type:", account);
    if (account) {
      router.replace("/");
    }
  }

  async function setAccountType() {
    console.log("setting account type!");
    if (!selectedAccount) {
      return defaults.simpleAlert("Error", "Please select your role");
    }

    const auth_token = await AsyncStorage.getItem("auth_token");
    const account = accounts.find((a) => a.account === selectedAccount);
    console.log("Account:", account);
    if (!account) {
      console.error("No matching account found for selected role.");
      return;
    }

    defaults.post(
      account.endpoint, // Endpoint
      {}, // Params
      setInProgress, // Set progress callback
      async (response) => {
        try {
          console.log("Response:", response); // Debug the raw response
          await AsyncStorage.setItem("account", account.account);
          router.replace("/");
        } catch (err) {
          console.error("Error processing response:", err);
        }
      },
      (error) => {
        console.error("Post request failed:", error);
      }, // Failed callback
      auth_token // Auth token
    );


  }

  const handleLogout = async () => {
    try {
      console.log("logging out!");
      await AsyncStorage.removeItem("auth_token");
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-screen">
        <View className="absolute top-20 right-4 z-10">
          <TouchableOpacity
            className="w-[42px] h-[42px] rounded-xl border-[1px] border-gray-300 flex items-center justify-center"
            onPress={handleLogout}
          >
            <LogoutIcon />
          </TouchableOpacity>
        </View>

        <TopNavAction title="Role Selection" />
        <ScrollView>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.account}
              className="flex flex-row mx-4 my-2.5 p-4 border-[1px] items-center rounded-3xl"
              style={{
                borderColor:
                  account.account == selectedAccount ? "blue" : "#E4E4E4",
              }}
              onPress={() => setSelectedAccount(account.account)}
            >
              <View className="flex-1 space-y-2">
                <Text className="text-xl font-bold capitalize">
                  {account.account}
                </Text>
                <Text className="font-light">{account.subTitle}</Text>
              </View>
              <Image source={account.image} className="w-[60px] h-[60px]" />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ButtonPrimary
          text="Create Account"
          containerProps="mx-4 my-4"
          inProgress={inProgress}
          onPress={() => setAccountType()}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RoleScreen;
