import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../context/authContext";
import DefaultInput from "../../components/inputs/DefaultInput";
import TopNavAction from "../../components/main/TopNavAction";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import defaults from "@/lib/defaults";
import env from "@/env";

const MoreInfoScreen = () => {
  const { auth, user, logout } = useAuth();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");

  const createTeam = async () => {
    const idToken = await auth.currentUser?.getIdToken(true); // Get the ID token
    const teamData = {
      teamName: "XL Reddings FC", // Replace with your team name
      coachUid: user?.uid, // Replace with the coach's UID if applicable
      teamDescription: "A strong and dedicated football club",
      teamLogo: null, // Provide logo details if needed
    };

    defaults.postNew(
      "createTeam", // Endpoint name
      teamData, // Request body
      (inProgress) => console.log("Creating team in progress:", inProgress), // Optional progress indicator
      (response) => console.log("Team created successfully:", response), // Success handler
      (error) => console.error("Error creating team:", error), // Error handler
      idToken // Authorization token
    );
  };

  // Call createTeam inside useEffect or a button click handler
  useEffect(() => {
    createTeam();
  }, []);


  async function addTeamRecord() {
    const idToken = await auth.currentUser.getIdToken(true);
    const teamData = {
      uid: user.uid,
      teamId: "xlfc",
      name: "XL Reddings FC",
      description: "XL Reddings Football Club",
    };
    console.log("teamData", teamData);
    const baseUrl = env.API_DOMAIN_WITH_ENDPOINT("fetchAllPlayersOnTeam");
    const url = `${baseUrl}addTeam`;

    // Use defaults.post
    defaults.post(
      "addTeam",
      teamData,
      null,
      async (response) => {},
      async (error) => {
        console.error("Error adding team via defaults:", error);

        // Fallback to Axios
        try {
          const response = await axios.post(url, teamData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          console.log("Team added successfully via Axios:", response.data);
        } catch (axiosError) {
          console.error(
            "Error adding team via Axios:",
            axiosError.response?.data || axiosError.message
          );
        }
      },
      idToken,
      url
    );
  }

  useEffect(() => {
    addTeamRecord();
  }, []);

  async function handleSaveData() {
    const idToken = await auth.currentUser.getIdToken(true);

    const baseUrl = env.API_DOMAIN_WITH_ENDPOINT("createInitialPlayerData");
    const url = baseUrl;

    // Construct the data to be sent in the request body
    const data = {
      teamId: "xlfc",
      token: idToken,
      uid: user.uid,
      startWeight: weight,
      height: height,
      startBmi: bmi,
    };

    console.log("data", data);
    // Use defaults.post
    defaults.post(
      "createInitialPlayerData",
      data,
      null,
      async (response) => {
        console.log("Initial player data saved successfully:", response);
        router.replace("/");
      },
      async (error) => {
        console.error("Error saving initial player data:", error);
      },
      idToken,
      url
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Create Account" />
        <ScrollView>
          <Text className="text-xl font-semibold mx-4 mb-4">More Info</Text>
          <DefaultInput
            label="Start Weight"
            style="mx-4 my-3"
            placeholder="Kgs"
            text={weight}
            setText={setWeight}
          />
          <DefaultInput
            label="Height"
            style="mx-4 my-3"
            placeholder="cm"
            text={height}
            setText={setHeight}
          />
          <DefaultInput
            label="BMI"
            style="mx-4 my-3"
            placeholder="27 Minimum"
            text={bmi}
            setText={setBmi}
          />
        </ScrollView>
        <ButtonPrimary
          text="Continue"
          containerProps="mx-4 my-4"
          onPress={handleSaveData}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MoreInfoScreen;
