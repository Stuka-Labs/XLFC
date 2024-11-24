import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ButtonPrimary from './ButtonPrimary'

const ButtonSecondary = ({ text, isFullWidth=false, textColor='d-orange', backgroundColor='white', outlineColor='#FF736A', style, onClick }) => {
  return (
    <TouchableOpacity className={`border-[1px] py-2 px-2.5 rounded-xl flex items-center ${isFullWidth ? 'w-full' : ''} ${style}`} style={{ borderColor: outlineColor, backgroundColor: backgroundColor }} onPress={onClick}>
      <Text className={`text-${textColor}`}>{ text }</Text>
    </TouchableOpacity>
    // <ButtonPrimary 
    //   text={text}
    //   backgroundColor='white'
    //   textColor='#0075E0'
    //   padding='py-2 px-2.5'
    //   textSize='text-sm'
    //   isFullWidth={isFullWidth}
    //   onClick={onClick}
    // />
  )
}

export default ButtonSecondary