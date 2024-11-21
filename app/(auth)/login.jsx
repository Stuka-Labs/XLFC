import { View, Text, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import DefaultInput from '../../components/inputs/DefaultInput'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import images from '../../assets/images'

import constants from '../../lib/constants'
import defaults from '../../lib/defaults'
import {useAuth} from "../../context/authContext";

const LoginScreen = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inProgress, setInProgress] = useState(false)

  async function handleLogin() {
    try {
      setInProgress(true);
      await login(email, password);
      if (user) {
        console.log('Client user', user);
        router.push('/role');
      }
    } catch (error) {
      // Use the alert to display the error message
      defaults.simpleAlert('Authentication Error', error?.message || "An error occurred during login.");
    } finally {
      setInProgress(false);
    }
  }

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full flex flex-col justify-center">
        <Image
          source={images.logo}
          className="w-[135] h-[123] mx-auto"
        />
        <Text className="text-2xl font-semibold text-center mt-4 mb-8">Welcome to the XLFC App!</Text>
        <DefaultInput
          label="Email"
          style="mx-4 my-3"
          placeholder="Enter Email Address"
          text={email}
          setText={setEmail}
          autoCapitalize="none"
          leftView={
            <Image
              source={images.inputs.person}
              className="w-[20] h-[31]"
              resizeMode="cover"
            />
          }
        />
        <DefaultInput
          label="Password"
          style="mx-4 my-3"
          placeholder="Enter Password"
          text={password}
          setText={setPassword}
          secureTextEntry={true}
          leftView={
            <Image
              source={images.inputs.lock}
              className="w-[20] h-[31]"
              resizeMode="cover"
            />
          }
          rightView={
            <Image
              source={images.inputs.eye}
              className="w-[20] h-[31]"
              resizeMode="contain"
            />
          }
        />
        <View className="flex items-end"><Text className="underline text-gray-400 mx-4" onPress={() => router.push('/recovery')}>Forgot Password?</Text></View>
        <ButtonPrimary
          text="Login"
          containerProps="mx-4 my-6"
          inProgress={inProgress}
          onPress={handleLogin}
        />
        <View className="flex flex-row items-center mx-auto space-x-4 mt-4">
          <Image source={images.feedback.leftBar} className="w-[90] h-[1]" />
          <Text>Or continue with</Text>
          <Image source={images.feedback.rightBar} className="w-[90] h-[1]" />
        </View>
        <ButtonPrimary
          text="Continue with Google"
          containerProps="mx-4 my-6"
          backgroundColor="white"
          textColor="black"
          borderColor="#D0D5DD"
          fontSize={16}
          leftView={
            <Image
              source={images.socials.google}
              className="w-[28] h-[28]"
            />
          }
        />
        <Text className="text-center">Don't have an account? <Text className="text-primary underline font-semibold" onPress={() => router.push('/register')}>Register Now</Text></Text>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen