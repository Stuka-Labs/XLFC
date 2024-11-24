import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'
import ButtonSecondary from '../../components/buttons/ButtonSecondary'
import GaugeWithBlob from '../../components/ui/GaugeWithBlob'

import images from '../../assets/images'

const PlayerStatsScreen = () => {

  const { player_image, player_name } = useLocalSearchParams()

  const sections = [
    { startAngle: -85, endAngle: -5, color: 'red' },
    { startAngle: 10, endAngle: 55, color: 'yellow' },
    { startAngle: 65, endAngle: 85, color: 'green' },
  ];

  const weeks = [
    {
      week: 1,
      points: 42.75
    },
    {
      week: 2,
      points: -10.25
    },
    {
      week: 3,
      points: 0
    },
    {
      week: 4,
      points: 91.5
    },
    {
      week: 5,
      points: -12.75
    },
    {
      week: 6,
      points: 15.25
    },
    {
      week: 7,
      points: 27.75
    },
    {
      week: 8,
      points: 30.5
    },
    {
      week: 9,
      points: -19.25
    },
    {
      week: 10,
      points: 45.75
    }
  ]

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <ScrollView>
          <Text className="pb-2.5 font-medium text-gray-600 mx-4 mt-4">Players</Text>
          <View className="mx-4 mb-3 flex flex-row items-center justify-between">
            <View className="bg-[#F0F0F1] my-1 rounded-2xl px-4 py-2.5 flex flex-row space-x-2.5 items-center w-full">
              <Image
                source={player_image}
                className="w-[50] h-[50]"
              />
              <Text className="text-lg flex-1">{player_name}</Text>
              <TouchableOpacity className="bg-white h-[34] w-[34] flex items-center justify-center rounded-lg" onPress={() => router.back()}>
                <AntDesign name="close" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex flex-row mx-4 my-4">
            <View className="flex-1">
              <Text className="text-xs">Current Points</Text>
              <Text className="text-lg text-blue-400 font-semibold">53 points</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs">Weight:</Text>
              <Text className="text-lg text-blue-400 font-semibold">111.5 KG</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs">Weight Change:</Text>
              <Text className="text-lg text-green-400 font-semibold">-6 KG</Text>
            </View>
          </View>
          
          <View className="flex flex-row mx-4 my-2.5">
            <Text className="flex-1 font-bold text-xl">Points Breakdown</Text>
            <Entypo name="dots-two-vertical" size={24} color="black" />
          </View>

          <View className="bg-[#EFF1F7] mx-4 rounded-2xl py-4">
            <View className="flex flex-row mx-4 my-2">
              <View className="flex-1">
                <Text className="text-xs">Standard Points</Text>
                <Text className="text-lg font-semibold">21 points</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs">Bonus Points</Text>
                <Text className="text-lg font-semibold">32 points</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs">Lifetime Points</Text>
                <Text className="text-lg font-semibold">53 points</Text>
              </View>
            </View>

            {/* <View className="rounded-2xl mx-4 my-2 overflow-hidden">
              {weeks.map(wk => (
                <View key={wk.week} className="flex flex-row">
                  <Text className="flex-1 bg-[#F5F5F5] px-4 py-2.5">Week {wk.week}</Text>
                  <Text className="flex-1 bg-white px-4 py-2.5">{wk.points}</Text>
                </View>
              ))}
            </View> */}
          </View>

          {/* <GaugeChart id="gauge-chart5"
            nrOfLevels={420}
            arcsLength={[0.3, 0.5, 0.2]}
            colors={['#5BE12C', '#F5CD19', '#EA4228']}
            percent={0.37}
            arcPadding={0.02}
          /> */}
          
          <View className="flex flex-row mx-4 my-6">
            <Text className="flex-1 font-bold text-xl">Current Weight</Text>
            <Entypo name="dots-two-vertical" size={24} color="black" />
          </View>
          
          <View className="mx-auto my-2">
            {/* <GaugeWithBlob width={200} height={200} strokeWidth={10} color="blue" /> */}
            <GaugeWithBlob width={275} height={275} strokeWidth={17.5} sections={sections} />
            <View className="absolute left-0 right-0 flex items-center" style={{ top: 100 }}>
              <Text className="text-4xl font-bold">0.00 KG</Text>
              <Text className="mt-2">Your current weight is average</Text>
              <Text className="mb-2">Last Check on 21 Apr</Text>
              <ButtonPrimary text="View Details" containerProps="w-[200] m-4" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default PlayerStatsScreen