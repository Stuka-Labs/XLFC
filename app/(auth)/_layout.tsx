import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LoginScreen from "./login";

const AuthLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="more-info"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="success"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="recovery"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="verification"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="new-password"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="role"
          options={{
            headerShown: false,
            headerTitle: "",
          }}
          component={LoginScreen}
        />
      </Stack.Navigator>
      {/* <StatusBar backgroundColor='#161622' style='light' /> */}
    </>
  );
};

export default AuthLayout;
