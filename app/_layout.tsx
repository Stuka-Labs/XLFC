import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import "react-native-reanimated";
import { AuthProvider } from "@/context/authContext";
import AuthLayout from "./(auth)/_layout";
import NotFoundScreen from "./+not-found";
import MainLayout from "./(main)/_layout";
import TabLayout from "./(tabs)/_layout";

export default function RootLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
            component={AuthLayout}
          />
          <Stack.Screen
            name="(main)"
            options={{ headerShown: false }}
            component={MainLayout}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
            component={TabLayout}
          />
          {/* <Stack.Screen name="(account)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="+not-found" component={NotFoundScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
