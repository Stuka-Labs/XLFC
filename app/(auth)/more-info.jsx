import { View, Text, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

const MoreInfoScreen = () => {

  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState('')

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
          text="Choose Role"
          containerProps="mx-4 my-4"
          onPress={() => router.push('/role')}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default MoreInfoScreen