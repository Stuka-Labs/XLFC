import { View, Text, Image } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation } from 'expo-router'

import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import images from '../../assets/images'

const SuccessScreen = () => {
  
  const { message } = useLocalSearchParams()
  const navigation = useNavigation()

  return (
    <SafeAreaView className="bg-white h-full flex flex-col">
      <View className="flex-1 flex items-center justify-center flex-col">
        <Image
          source={images.feedback.check}
          className="w-[100] h-[100]"
        />
        <Text className="m-2 text-gray-600">Congratulations!</Text>
        <Text className="text-xl font-medium text-center">{ message }</Text>
      </View>
      <ButtonPrimary 
        text="Done"
        containerProps="mx-4 my-4"
        onPress={() => navigation.popToTop()}
        // onPress={() => router.replace('/')}
        // onPress={() => router.back()}
      />
    </SafeAreaView>
  )
}

export default SuccessScreen