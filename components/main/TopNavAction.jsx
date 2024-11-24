import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { router } from 'expo-router'

import XMark from '../../assets/images/nav/xmark.svg'
import ArrowBack from '../../assets/images/nav/arrow-back.svg'
import ArrowLeft from '../../assets/images/nav/arrow-left.svg'

const TopNavAction = ({ closing=false, backgroundColor='#EFEFEF', addShadow=false, title, hideBackBtn=false }) => {
  return (
    <View className="flex flex-row items-start">
      <View className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center">
        <Text className="text-lg font-medium">{ title }</Text>
      </View>
      <TouchableOpacity 
        className={`mx-2 my-4 w-[42px] h-[42px] rounded-full flex justify-center items-center`}
        style={{ opacity: hideBackBtn ? 0 : 1 }}
        disabled={hideBackBtn}
        // style={{ backgroundColor: backgroundColor }} 
        // style={{
        //   shadowColor: "#000",
        //   shadowOffset: {
        //     width: 0,
        //     height: 2,
        //   },
        //   shadowOpacity: addShadow ? 0.1 : 0,
        //   shadowRadius: 4.65,
        //   elevation: 2,
        // }}
        onPress={() => router.back()}
      >
        {closing && <XMark width="12px" height="12px" style={{ color: 'black' }} />}
        {!closing && <ArrowLeft width="30px" height="30px" />}
      </TouchableOpacity>
    </View>
  )
}

export default TopNavAction