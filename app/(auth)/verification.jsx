import { View, Text, Image } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import OTPTextInput from 'react-native-otp-textinput'

import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import images from '../../assets/images'

const VerificationScreen = () => {

  const [otpCode, setOtpCode] = useState('')

  const otpInputRef = useRef()

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full flex flex-col">
        <TopNavAction title="OTP Verification" />
        <View className="flex-1 flex items-center justify-center flex-col">
          <Text className="m-2 text-gray-600">Code has been sent to</Text>
          <Text className="text-xl font-medium">sarah_collin@gmail.com</Text>
          <OTPTextInput 
            ref={otpInputRef}
            handleTextChange={setOtpCode}
            autoFocus={true}
            textInputStyle={{ height: 60, flex: 1, borderWidth: 1.5, borderRadius: 12, borderColor: "#EFEFEF", backgroundColor: "#FFFFFF" }}
            containerStyle={{ marginHorizontal: 16, marginVertical: 40 }}
            tintColor="#1D82C6"
            offTintColor="#EFEFEF"
            inputCount={6}
          />
          <Text>Resend code in <Text className="text-primary">55s</Text></Text>
        </View>
        <ButtonPrimary 
          text="Verify"
          containerProps="mx-4 my-4"
          onPress={() => router.push({
            pathname: '/success',
            params: {
              message: 'Your password has been reset'
            }
          })}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default VerificationScreen