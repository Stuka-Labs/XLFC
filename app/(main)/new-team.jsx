import { View, Text, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'
import ButtonSecondary from '../../components/buttons/ButtonSecondary'

import defaults from '../../lib/defaults'

const NewTeamScreen = () => {

  const { id, old_name, old_description } = useLocalSearchParams()

  const [name, setName] = useState('')
  const [coach, setCoach] = useState('')
  const [participants, setParticipants] = useState('')
  const [description, setDescription] = useState('')
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    setName(old_name ?? '')
    setDescription(old_description ?? '')
  }, [])

  function createTeam(){
    defaults.post('createTeam', {
      teamName: name,
      coach: coach,
      description: description
    }, setInProgress, (response) => {
      router.replace({
        pathname: '/success',
        params: {
          message: response.message
        }
      })
    })
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Add New Team" />
        <ScrollView>
          <Text className="pb-2.5 font-medium text-gray-600 mx-4 mt-4">Team Logo</Text>
          <View className="mx-4 mb-3 flex flex-row items-center justify-between">
            <View className="w-[74] h-[74] border-[1px] border-[#E4E4E4] rounded-full flex items-center justify-center">
              <Ionicons name="image-outline" size={28} color="#1B1A1E26" />
            </View>
            <ButtonSecondary
              text="Upload Photo"
              outlineColor="#EFF1F7"
              backgroundColor="#EFF1F7"
            />
          </View>
          <DefaultInput 
            label="Team Name"
            style="mx-4 my-3"
            placeholder="Enter Team Name"
            text={name}
            setText={setName}
          />
          <DefaultInput 
            label="Team Coach"
            style="mx-4 my-3"
            placeholder="Select Coach"
            text={coach}
            setText={setCoach}
            rightView={
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#1B1A1E66" />
            }
          />
          {/* <DefaultInput 
            label="Number of Participants"
            style="mx-4 my-3"
            placeholder="Enter Number of Participants"
            text={participants}
            setText={setParticipants}
          /> */}
          <DefaultInput 
            label="Team Description:"
            style="mx-4 my-3"
            placeholder="Type Description..."
            text={description}
            setText={setDescription}
            multiline={true}
            numberOfLines={3}
          />
        </ScrollView>
        <ButtonPrimary 
          text="Create Team"
          containerProps="mx-4 my-4"
          inProgress={inProgress}
          onPress={createTeam}
          // onPress={() => router.push({
          //   pathname: '/success',
          //   params: {
          //     message: 'Your Account has been created'
          //   }
          // })}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default NewTeamScreen