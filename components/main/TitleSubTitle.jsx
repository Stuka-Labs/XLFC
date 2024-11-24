import { View, Text } from 'react-native'
import React from 'react'

// import DefaultDivider from './DefaultDivider'

const TitleSubtitleText = ({ title, subTitle, align="left", style }) => {
  return (
    <View className={style}>
      <Text className={`px-4 text-2xl font-bold pb-1.5 text-${align}`} style={{ textAlign: align }}>{ title }</Text>
      <Text className={`px-4 text-sm pb-2 text-gray-600 text-${align}`} style={{ textAlign: align }}>{ subTitle }</Text>
      {/* <DefaultDivider /> */}
    </View>
  )
}

export default TitleSubtitleText