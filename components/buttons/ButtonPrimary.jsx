import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import colors from "tailwindcss/colors"

const ButtonPrimary = ({ text, icon, inProgress, backgroundColor = '#1D82C6', textColor = 'white', textSize = 'text-base', padding = 'py-3', borderColor = '#1D82C6', isFullWidth = false, fontSize = 20, progressOver, containerProps, leftView, rightView, onPress }) => {
  return (
    <View className={`px-${isFullWidth ? '4' : '0'} ${isFullWidth ? 'w-full' : ''} ${containerProps}`}>
      <TouchableOpacity 
        // className={`bg-${backgroundColor} rounded-md h-[40px] justify-center items-center w-full`}
        className={`h-[62px] justify-center items-center w-full border-[1px]`}
        // className={`bg-d-blue-100 rounded-md h-[45px] justify-center items-center w-full`}
        style={{
          // alignSelf: 'flex-start',
          // shadowColor: "#000",
          // shadowOffset: {
          //     width: 0,
          //     height: 3,
          // },
          // shadowOpacity: 0.27,
          // shadowRadius: 4.65,
          // elevation: 2,
          borderRadius: 15,
          borderColor: borderColor,
          backgroundColor: backgroundColor
        }}
        // style={[styles.shadow, { backgroundColor: colors.blue }]}
        // style={{ backgroundColor: 'blue' }}
        onPress={() => {
          if (!inProgress && onPress)
            onPress()
        }}
        activeOpacity={0.7}
        disabled={inProgress || !onPress}
      >

        {inProgress && <ActivityIndicator 
            size={30}
            color={textColor}
        />}
        {!inProgress && (<>
          <View className="flex flex-row space-x-2 items-center">
            { leftView }
            
            {text &&
              <Text 
                className={`pt-0 ${textSize} font-medium`}
                style={{ color: textColor, fontSize: fontSize }}
              >
                { text }
              </Text>
            }

            { rightView }
          </View>
        </>)}
      </TouchableOpacity>
    </View>
  )
}

// const styles = StyleSheet.create({
//     shadow: {
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 3,
//         },
//         shadowOpacity: 0.27,
//         shadowRadius: 4.65,
//         elevation: 2
//     }
// })

// const ButtonPrimaryInnerContent = () => {
//     return (
//         <>
//         </>
//     )
// }

// ButtonPrimary.defaultProps = {
//     inProgress: false
// }

export default ButtonPrimary