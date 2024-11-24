import { View, Text, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import ArrowDown from '../../assets/images/nav/arrow-down.svg'
import images from '../../assets/images'

const RecoveryScreen = () => {

  const [email, setEmail] = useState('sarah_collin@gmail.com')

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Forgot Password" />
        <ScrollView>
          <DefaultInput 
            label="Enter Your Email"
            style="mx-4 my-3"
            placeholder="Enter Email Address"
            text={email}
            setText={setEmail}
          />
        </ScrollView>
        <ButtonPrimary 
          text="Continue"
          containerProps="mx-4 my-4"
          onPress={() => router.push('/verification')}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default RecoveryScreen