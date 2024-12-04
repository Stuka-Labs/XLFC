import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardTypeOptions,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { AsYouType } from "libphonenumber-js";

interface DefaultInputProps {
  text: string;
  setText: (value: string) => void;
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  secureTextEntry?: boolean;
  disabled?: boolean;
  backgroundColorFocused?: string;
  align?: "start" | "center" | "end";
  autoFocus?: boolean;
  showCancel?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  className?: string;
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  onClick?: () => void;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  text,
  setText,
  label,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
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
  const inFocus = useSharedValue<boolean>(false);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        inFocus.value ? 1 : 0,
        [0, 1],
        ["#EFEFEF", "#1D82C6"]
      ),
      borderRadius: 15,
    } as ViewStyle;
  });

  return (
    <View style={style}>
      {label && (
        <Text className="pb-2.5 font-medium text-gray-600">{label}</Text>
      )}

      <Animated.View
        className={`min-h-[52px] px-6 items-center border-[1.5px] flex flex-row space-x-2 justify-${align}`}
        style={buttonStyle}
      >
        {leftView}

        <TextInput
          style={{
            fontSize: 16,
            flex: align === "center" ? 0 : 1,
            paddingVertical: multiline ? 10 : 7.5,
          }}
          onFocus={() => {
            inFocus.value = true;
          }}
          onBlur={() => {
            inFocus.value = false;
          }}
          onPressIn={onClick}
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
            if (keyboardType === "phone-pad") {
              const newText = new AsYouType("GH").input(value);
              if (newText !== text) {
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
            style={{
              height: 42,
              width: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Keyboard.dismiss();
              setText("");
            }}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default DefaultInput;
