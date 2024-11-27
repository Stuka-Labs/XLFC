import React from "react";
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
import axios from "axios";
import FirebaseAuthTypes from "firebase/auth";

const MoreInfoScreen = () => {
  const { auth, user, logout } = useAuth();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");

  async function getToken(auth: FirebaseAuthTypes.Auth | null): Promise<string | undefined> {
    const idToken =
      !auth || !auth?.currentUser
        ? undefined
        : await auth.currentUser.getIdToken(true);
    return idToken;
  }

  async function addTeamRecord() {
    if (!auth || !auth.currentUser) {
      console.error("Auth or currentUser is undefined.");
      return;
    }
    const idToken = await getToken(auth);

    const teamData = {
      uid: user?.uid ?? "",
      teamId: "xlfc",
      name: "XL Reddings FC",
      description: "XL Reddings Football Club",
      active: true,
    };

    console.log("teamData", teamData);

    const baseUrl = env.API_DOMAIN_WITH_ENDPOINT("fetchAllPlayersOnTeam");
    const url = `${baseUrl}addTeam`;

    defaults.postNew(
      "addTeam",
      teamData,
      undefined,
      async (response) => {
        console.log("Team added successfully:", response);
      },
      async (error) => {
        console.error("Error adding team via defaults:", error);
        if (axios.isAxiosError(error)) {
          console.error(
            "Axios-specific error:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
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
    if (!auth || !auth.currentUser) {
      console.error("Auth or currentUser is undefined.");
      return;
    }
    const idToken = await auth.currentUser.getIdToken(true);

    const data = {
      teamId: "xlfc",
      token: idToken,
      uid: user?.uid ?? "",
      startWeight: weight,
      height: height,
      startBmi: bmi,
    };

    console.log("data", data);

    defaults.postNew(
      "createInitialPlayerData",
      data,
      undefined,
      async (response) => {
        console.log("Initial player data saved successfully:", response);
        router.replace("/");
      },
      async (error) => {
        console.error("Error saving initial player data:", error);
      },
      idToken
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
        <TopNavAction title="Create Account" />
        <ScrollView>
          <Text style={{ fontSize: 20, fontWeight: "bold", margin: 16 }}>
            More Info
          </Text>
          <DefaultInput
            label="Start Weight"
            style="mx-4 my-3"
            placeholder="Kgs"
            text={weight}
            setText={setWeight}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={10}
            secureTextEntry={undefined}
            rightView={undefined}
            onClick={undefined}
          />
          <DefaultInput
            label="Height"
            style="mx-4 my-3"
            placeholder="cm"
            text={height}
            setText={setHeight}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={10}
            secureTextEntry={undefined}
            rightView={undefined}
            onClick={undefined}
          />
          <DefaultInput
            label="BMI"
            style="mx-4 my-3"
            placeholder="27 Minimum"
            text={bmi}
            setText={setBmi}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={10}
            secureTextEntry={undefined}
            rightView={undefined}
            onClick={undefined}
          />
        </ScrollView>
        <ButtonPrimary
          text="Continue"
          containerProps="mx-4 my-4"
          onPress={handleSaveData}
          icon={null}
          inProgress={false}
          progressOver={undefined}
          leftView={undefined}
          rightView={undefined}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MoreInfoScreen;
