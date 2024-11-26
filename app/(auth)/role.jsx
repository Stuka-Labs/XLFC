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
  // const [players, setPlayers] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  // useEffect(() => {
  //   async function updateUserData() {
  //     try {
  //       console.log("[role.jsx] now should be updating the user!");
  //       const email = await AsyncStorage.getItem("email");
  //       const surName = await AsyncStorage.getItem("surName");
  //       const firstName = await AsyncStorage.getItem("firstName");
  //       const phoneNumber = await AsyncStorage.getItem("phoneNumber");
  //       const emailVerified = await AsyncStorage.getItem("emailVerified");
  //       // const phoneNumber = await AsyncStorage.getItem("phoneNumber");
  //       const updatedObj = { email, firstName, surName, phoneNumber, emailVerified };
  //       console.log("[role.jsx] updatedObj", updatedObj);

  //       // const idToken = await auth.currentUser.getIdToken(true);
  //       // console.log("[role.jsx] idToken from role page: ", idToken);
  //       // AsyncStorage.setItem("auth_token", idToken);
  //       // // Save data locally
  //       // await AsyncStorage.multiSet([
  //       //   ["surName", surName],
  //       //   ["firstName", firstName],
  //       //   ["phoneNumber", phoneNumber],
  //       //   ["auth_token", idToken],
  //       // ]);

  //       const baseUrl = env.API_DOMAIN_WITH_ENDPOINT("updateUser");
  //       const url = `${baseUrl}${user?.uid}`;

  //       console.log("Update URL:", url);
  //       const authToken = await auth.currentUser.getIdToken(true);
  //       const newData = updatedObj;
  //       AsyncStorage.setItem("auth_token", authToken);
  //       if (!authToken) {
  //         Alert.alert(
  //           "Error",
  //           "You need to be logged in to update your account."
  //         );
  //         return;
  //       }

  //       const response = await fetch(url, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //         body: JSON.stringify(newData),
  //       });

  //       console.log("[role.jsx] response: ", response);
  //       if (response.ok) {
  //         console.log("Account successfully updated");
  //         // Alert.alert("Success", "Your account has been updated.");
  //         await refresh(); // Refresh user data after update
  //       } else {
  //         const errorText = await response.text();
  //         console.error("Failed to update account:", errorText);
  //         Alert.alert("Error", "Failed to update account. Try again.");
  //       }
  //     } catch (err) {
  //       console.error("Error updating account:", err);
  //       Alert.alert("Error", "An unexpected error occurred.");
  //     }
  //   }
  //   updateUserData();
  // }, []);

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
    const storedName = await AsyncStorage.getItem("displayName");
    setDisplayName(storedName || user?.displayName || "");
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
    console.log('setting account type!')
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
