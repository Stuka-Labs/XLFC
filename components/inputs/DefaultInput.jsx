import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { AsYouType } from "libphonenumber-js";

import { useState } from "react";

const DefaultInput = ({
  text,
  setText,
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
  maxLength,
  secureTextEntry,
  disabled = false,
  backgroundColorFocused = "#EFEFEF",
  align = "start",
  autoFocus = false,
  showCancel = false,
  multiline = false,
  numberOfLines = 1,
  style,
  leftView = null,
  rightView,
  onClick,
}) => {
  const inFocus = useSharedValue(false);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        inFocus.value,
        [true, false],
        ["#1D82C6", "#EFEFEF"]
      ),
      borderRadius: 15,
    };
  });

  return (
    <View className={`${style}`}>
      {label && (
        <Text className="pb-2.5 font-medium text-gray-600">{label}</Text>
      )}

      <Animated.View
        className={`min-h-[52px] px-3 items-center border-[1.5px] flex flex-row space-x-2 justify-${align}`}
        style={buttonStyle}
      >
        {leftView}

        <TextInput
          style={{
            fontSize: 16,

            flex: align == "center" ? 0 : 1,
            paddingVertical: multiline ? 10 : 7.5,
          }}
          onFocus={() => {
            inFocus.value = withTiming(true, { duration: 200 });
          }}
          onBlur={() => {
            inFocus.value = withTiming(false, { duration: 200 });
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
          textAlignVertical={multiline ? "top" : "center"}
          onChangeText={(value) => {
            if (keyboardType == "phone-pad") {
              const newText = new AsYouType("GH").input(value);
              if (newText != text) {
                setText(newText);
                return;
              }
            }
            setText(value);
          }}
        />

        {!showCancel && rightView}
        {showCancel && text.length > 0 && (
          <TouchableOpacity
            className="h-[42px] w-[24px] flex justify-center items-center"
            onPress={() => {
              Keyboard.dismiss();
              if (setText) setText("");
            }}
          ></TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default DefaultInput;
