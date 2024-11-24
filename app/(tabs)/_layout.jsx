import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Tabs, useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import images from '../../assets/images'

const TabIcon = ({ icon, isURL, color='#FF736A', name, focused, active, inactive }) => {
  return (
    <Image 
      // source={isURL ? { uri: icon } : images.tabs[icon + (focused ? 'Active' : 'Inactive')]}
      source={images.tabs[icon]}
      resizeMode="contain"
      tintColor={focused ? active : inactive}
      className={`w-[22.5] h-[22.5] ${isURL ? 'rounded-full' : ''}`}
    />
  )
}

const TabLayout = () => {
  const [authorized, setAuthorized] = useState(null)
  const colorScheme = useColorScheme();

  const activeColor = '#1D82C6'
  const inactiveColor = '#1B1A1E'

  useFocusEffect(
    useCallback(() => {
      checkIfSignedIn()
    }, [])
  )

  async function checkIfSignedIn(){
    const hasAuthToken = !(!(await AsyncStorage.getItem('auth_token')))
    setAuthorized(hasAuthToken)
    
    if (!hasAuthToken) 
      return router.replace('/login')
  }

  if (authorized === null)
    return (<View />)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='home'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="weigh-in"
        options={{
          title: 'Weigh In',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='weigh'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='leaderboard'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Player Stats',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='stats'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="past"
        options={{
          title: 'Past Seasons',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='past'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <TabIcon
              icon='settings'
              focused={focused}
              active={activeColor}
              inactive={inactiveColor}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout