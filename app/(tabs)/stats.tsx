import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import TopNavAction from "../../components/main/TopNavAction";
import SearchBar from "../../components/inputs/SearchBar";
import images from "../../assets/images";
import { useAuth } from "@/context/authContext";
import defaults from "@/lib/defaults";
import env from "@/env";

const PlayerStatsScreen = () => {
  const { auth, user, logout } = useAuth();
  // const [players] = useState([
  //   { image: images.dummy.ronaldo, name: "Ronaldo" },
  //   { image: images.dummy.messi, name: "Messi" },
  //   { image: images.dummy.salah, name: "M. Salah" },
  //   { image: images.dummy.vanDijk, name: "V. Van Dijk" },
  //   { image: images.dummy.erickson, name: "Erickson" },
  //   { image: images.dummy.neuer, name: "Neuer" },
  // ]);
  const [players, setPlayers] = useState<any>([]);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (!user || !auth?.currentUser) return;

      const idToken = await auth.currentUser.getIdToken(true);

      // Fetch players on team
      defaults.getNew(
        "fetchAllPlayersOnTeam",
        { teamId: "xlfc", searchQuery: "xlfc" }, // Add your query parameters here
        (inProgress) => console.log("Fetching in progress:", inProgress),
        (response) => {
          console.log("Response from fetchAllPlayersOnTeam", response.data);
          if (Array.isArray(response.data)) {
            setPlayers(response.data);
            console.log('all players', response.data);
          }
        },
        (error) => console.error("Error fetching players:", error),
        idToken // Optional token
      );
    }

    init();
  }, [user, auth]);

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight : insets.top,
        }}
      >
        <TopNavAction title="Choose Player" />
        <SearchBar />
        <ScrollView style={{ marginTop: 8 }}>
          <Text
            style={{
              marginHorizontal: 16,
              marginVertical: 8,
              color: "#4B5563",
            }}
          >
            Players
          </Text>
          {players &&
            players.length > 0 &&
            players.map((p: any) => (
              <TouchableOpacity
                key={p.id} // Use a unique key like `p.name` or `p.image`
                style={{
                  backgroundColor: "#F0F0F1",
                  marginHorizontal: 16,
                  marginVertical: 4,
                  borderRadius: 16,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() =>
                  router.push({
                    pathname: "/player-stats",
                    params: {
                      player_image: p.image,
                      player_name: p.name,
                    },
                  })
                }
              >
                <Image source={p.image} style={{ width: 50, height: 50 }} />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>{p.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default PlayerStatsScreen;
