import { Image, StyleSheet, Button, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useState, useEffect, useCallback } from 'react'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-reanimated-table'

import AntDesign from '@expo/vector-icons/AntDesign';

import images from '../../assets/images'

import ButtonPrimary from '../../components/buttons/ButtonPrimary'
import ButtonSecondary from '../../components/buttons/ButtonSecondary'

import defaults from '../../lib/defaults'

const LeaderboardScreen = () => {

  const insets = useSafeAreaInsets()

  const tableHead = ['Name', 'W', 'D', 'L', 'Head5', 'Head6', 'Head7', 'Head8', 'Head9']
  const widthArr = [150, 100, 100, 100, 120, 140, 160, 180, 200]

  const tableData = [];
  for (let i = 0; i < 30; i += 1) {
    const rowData = [];
    for (let j = 0; j < 9; j += 1) {
      rowData.push(j == 0 ? `Player ${i}` : `${i}${j}`);
    }
    tableData.push(rowData);
  }

  useFocusEffect(
    useCallback(refresh, [])
  )

  function refresh(){
    // defaults.get('fetchAllTeams', {}, null, (response) => {
    //   console.log('Teams')
    // })
  }

  async function logOut(){
    await AsyncStorage.removeItem('auth_token')
    router.replace('/login')
  }

  return (
    <GestureHandlerRootView>
      <View className="bg-[#1D82C6] h-full flex flex-col" style={{ paddingTop: insets.top }}>
        <View className="flex flex-row items-center mx-4 mb-4">
          <Image
            source={images.dummy.readings}
            className="h-[52] w-[52]"
          />
          <View className="mx-4 flex-1">
            <Text className="text-white font-bold text-xl">Readings XLFC</Text>
          </View>
        </View>
        <View className="bg-white flex-1 rounded-t-[33.3px] overflow-hidden">
          <Text className="text-xl font-bold px-4 py-6">League Table</Text>
          
          {/* TABLE */}

          <View className="">
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row 
                    data={tableHead} 
                    widthArr={widthArr} 
                    style={{ height: 50 }} 
                    textStyle={{ paddingHorizontal: 16 }}
                  />
                </Table>
                <ScrollView style={{ marginBottom: insets.bottom + 45 }}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {
                      tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={widthArr}
                          style={[{ height: 40, backgroundColor: '#E7E6E1' }, index%2 && {backgroundColor: '#F7F6E7'}]}
                          textStyle={{ paddingHorizontal: 16, fontSize: 12 }}
                        />
                      ))
                    }
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

export default LeaderboardScreen