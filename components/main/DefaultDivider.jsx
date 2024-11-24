import { View, Text } from 'react-native'
import React from 'react'

const DefaultDivider = ({ height=1, color="#F3F0F3", style }) => {
  return (
    // <View className={`border-b-2 border-gray-50 ${style}`}/>
    <View className={style} style={{ height: height, backgroundColor: color }}/>
    // <View className={`h-[${height}] bg-black ${style}`}/>
  )
}

export default DefaultDivider