import { View, Text, TextInput } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, interpolateColor } from 'react-native-reanimated'
import { AsYouType } from 'libphonenumber-js'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { TextR } from '../defaults/TextCustom'

const BottomSheetInput = ({ text, setText, label, placeholder, keyboardType, autoCapitalize, maxLength, secureTextEntry, style }) => {
  const inFocus = useSharedValue(false)

  const buttonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(inFocus.value, [true, false], ['#0075E0', '#EFEFEF'])
    }
  })

  return (
    <View className={`flex-1 ${style}`}>
      {label && <TextR className="pb-3">{label}</TextR>}

      <Animated.View className="bg-b-secondary h-[48px] rounded-lg px-3 justify-center border-[1.5px]" style={buttonStyle}>
      <BottomSheetTextInput
        // style={{ height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20 }}
        // style={{ borderColor: 'blue', borderWidth: 1 }}
        // className="font-pregular text-base"
        // Adding hint in TextInput using Placeholder option.
        // Making the Under line Transparent.
        // underlineColorAndroid="transparent"
        style={{
          fontSize: '16px',
          // fontFamily: 'Euclid-Circular-B-Regular'
        }}
        onFocus={() => {
          inFocus.value = withTiming(true, { duration: 200 })
        }}
        onBlur={() => {
          inFocus.value = withTiming(false, { duration: 200 })
        }}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        placeholder={placeholder}
        value={text} 
        autoCapitalize={autoCapitalize}
        onChangeText={(value) => {
          // if (value.length >= text.length && keyboardType == 'phone-pad') {
          if (keyboardType == 'phone-pad') {
            const newText = new AsYouType('US').input(value)
            if (newText != text) {
              setText(newText)
              return
            }
          }
          setText(value)
        }}
      />
    </Animated.View>
    </View>
  )
}

export default BottomSheetInput