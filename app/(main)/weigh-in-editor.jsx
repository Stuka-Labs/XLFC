import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'
import ButtonSecondary from '../../components/buttons/ButtonSecondary'

import images from '../../assets/images'

const WeighInEditorScreen = () => {

  const { player_image, player_name } = useLocalSearchParams()

  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [foodDiary, setFoodDiary] = useState('')
  const [stepCounter, setStepCounter] = useState('')
  const [weightLossMilestone, setWeightLossMilestone] = useState('')
  const [parkRun, setParkRun] = useState('')
  const [coachesBonus, setCoachesBonus] = useState('')

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Weigh-in Editor" />
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
          <DefaultInput 
            label="Date of Weigh-in"
            style="mx-4 my-3"
            placeholder="Enter Date"
            text={date}
            setText={setDate}
            rightView={
              <Image
                source={images.inputs.calendar}
                className="w-[20] h-[20]"
              />
            }
          />
          <DefaultInput 
            label="Weight"
            style="mx-4 my-3"
            placeholder="Enter Weight"
            text={weight}
            setText={setWeight}
          />
          <DefaultInput 
            label="Food Diary"
            style="mx-4 my-3"
            placeholder="1 or 0"
            text={foodDiary}
            setText={setFoodDiary}
          />
          <DefaultInput 
            label="Step Counter"
            style="mx-4 my-3"
            placeholder="1 or 0"
            text={stepCounter}
            setText={setStepCounter}
          />
          <DefaultInput 
            label="Weight Loss Milestone"
            style="mx-4 my-3"
            placeholder="1 or 0"
            text={weightLossMilestone}
            setText={setWeightLossMilestone}
          />
          <DefaultInput 
            label="Park Run"
            style="mx-4 my-3"
            placeholder="1 or 0"
            text={parkRun}
            setText={setParkRun}
          />
          <DefaultInput 
            label="Coaches Bonus"
            style="mx-4 my-3"
            placeholder="1 or 0"
            text={coachesBonus}
            setText={setCoachesBonus}
          />
        </ScrollView>
        <ButtonPrimary 
          text="Submit"
          containerProps="mx-4 my-4"
          // onPress={() => router.push({
          //   pathname: '/success',
          //   params: {
          //     message: 'Weigh-in data submitted successfully'
          //   }
          // })}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default WeighInEditorScreen