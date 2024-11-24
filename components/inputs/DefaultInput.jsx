import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, interpolateColor } from 'react-native-reanimated'
import { AsYouType } from 'libphonenumber-js'
// import XMark from '../../assets/icons/nav/xmark.svg'
import { useState } from 'react'

const DefaultInput = ({ text, setText, label, placeholder, keyboardType, autoCapitalize, maxLength, secureTextEntry, disabled=false, backgroundColorFocused="#EFEFEF", align="start", autoFocus=false, showCancel=false, multiline=false, numberOfLines=1, style, leftView, rightView, onClick }) => {
  const inFocus = useSharedValue(false)
  // const [inputInFocus, setInputInFocus] = useState("")

  const buttonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(inFocus.value, [true, false], ['#1D82C6', '#EFEFEF']),
      // backgroundColor: interpolateColor(inFocus.value, [true, false], [backgroundColorFocused, '#FFF']),
      borderRadius: 15
    }
  })

  return (
    // <View className={`flex-1 ${style}`}>
    <View className={`${style}`}>
      {label && <Text className="pb-2.5 font-medium text-gray-600">{label}</Text>}

      {/* <Animated.View className="bg-b-secondary h-[50px] rounded-lg px-3 pb-0.5 justify-center border-[1.5px]" style={buttonStyle}> */}
      {/* <Animated.View className="h-[50px] rounded-lg px-3 justify-center border-[1.5px]" style={buttonStyle}> */}
      <Animated.View className={`min-h-[52px] px-3 items-center border-[1.5px] flex flex-row space-x-2 justify-${align}`} style={buttonStyle}>
        { leftView }

        <TextInput
          // style={{ height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20 }}
          // style={{ borderColor: 'blue', borderWidth: 1 }}
          // className="font-pregular text-base"
          // Adding hint in TextInput using Placeholder option.
          // Making the Under line Transparent.
          // underlineColorAndroid="transparent"
          // className="h-[48px]"
          style={{
            // fontSize: '16px',
            fontSize: 16,
            // fontFamily: 'Euclid-Circular-B-Regular',
            flex: align == "center" ? 0 : 1,
            paddingVertical: multiline ? 10 : 7.5,
          }}
          onFocus={() => {
            inFocus.value = withTiming(true, { duration: 200 })
            // setInputInFocus(true)
          }}
          onBlur={() => {
            inFocus.value = withTiming(false, { duration: 200 })
            // setInputInFocus(false)
          }}
          onPress={onClick}
          editable={!disabled}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          placeholder={placeholder}
          value={text} 
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          onChangeText={(value) => {
            // if (value.length >= text.length && keyboardType == 'phone-pad') {
            if (keyboardType == 'phone-pad') {
              const newText = new AsYouType('GH').input(value)
              if (newText != text) {
                setText(newText)
                return
              }
            }
            setText(value)
          }}
        />

        { !showCancel && rightView }
        { showCancel && text.length > 0 && (
          <TouchableOpacity className="h-[42px] w-[24px] flex justify-center items-center" onPress={() => {
            Keyboard.dismiss()
            if (setText) setText('')
          }}>
            {/* <XMark width="10px" style={{ color: '#333'}}/> */}
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  )
}

export default DefaultInput