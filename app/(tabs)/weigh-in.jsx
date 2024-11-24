import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import TopNavAction from '../../components/main/TopNavAction'
import SearchBar from '../../components/inputs/SearchBar'

import images from '../../assets/images'

const WeighInScreen = () => {

  const insets = useSafeAreaInsets()

  const players = [
    {
      image: images.dummy.ronaldo,
      name: 'Ronaldo'
    },
    {
      image: images.dummy.messi,
      name: 'Messi'
    },
    {
      image: images.dummy.salah,
      name: 'M. Salah'
    },
    {
      image: images.dummy.vanDijk,
      name: 'V. Vandijk'
    },
    {
      image: images.dummy.erickson,
      name: 'Erickson'
    },
    {
      image: images.dummy.neuer,
      name: 'Neuer'
    }
  ]
  
  return (
    <GestureHandlerRootView>
      <View className="bg-white h-full" style={{ paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : insets.top }}>
        <TopNavAction title="Choose Player" hideBackBtn />
        <SearchBar />
        <ScrollView className="mt-2">
          <Text className="mx-4 my-2 text-gray-600">Players</Text>
          {players.map(p => (
            <TouchableOpacity key={p.image} className="bg-[#F0F0F1] mx-4 my-1 rounded-2xl px-4 py-2.5 flex flex-row space-x-2.5 items-center" onPress={() => router.push({
              pathname: '/weigh-in-editor',
              params: {
                player_image: p.image,
                player_name: p.name
              }
            })}>
              <Image
                source={p.image}
                className="w-[50] h-[50]"
              />
              <Text className="text-lg">{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}

export default WeighInScreen