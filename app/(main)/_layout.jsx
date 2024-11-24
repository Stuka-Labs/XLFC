import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const MainLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="new-team"
          options={{
            headerShown: false,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="weigh-in-editor"
          options={{
            headerShown: false,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="player-stats"
          options={{
            headerShown: false,
            headerTitle: '',
          }}
        />
      </Stack>
      {/* <StatusBar backgroundColor='#161622' style='light' /> */}
    </>
  )
}

export default MainLayout