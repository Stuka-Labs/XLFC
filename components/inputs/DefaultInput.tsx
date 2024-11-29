import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TextInputProps,
  StyleSheet,
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
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  maxLength?: number;
  secureTextEntry?: boolean;
  disabled?: boolean;
  backgroundColorFocused?: string;
  align?: "start" | "center" | "end";
  autoFocus?: boolean;
  showCancel?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: string | object;
  leftView?: ReactNode;
  rightView?: ReactNode;
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
  secureTextEntry = false,
  disabled = false,
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
  const inFocus = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        inFocus.value,
        [1, 0],
        ["#1D82C6", "#EFEFEF"]
      ),
      borderRadius: 15,
    };
  });

  return (
    <View style={typeof style === "string" ? {} : style}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputContainer,
          buttonStyle,
          align === "center" && styles.centerAlign,
        ]}
      >
        {leftView}

        <TextInput
          style={[
            styles.textInput,
            multiline && { paddingVertical: 10 },
            align === "center" && { flex: 0 },
          ]}
          onFocus={() => {
            inFocus.value = withTiming(1, { duration: 200 });
          }}
          onBlur={() => {
            inFocus.value = withTiming(0, { duration: 200 });
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
            style={styles.cancelButton}
            onPress={() => {
              Keyboard.dismiss();
              if (setText) setText("");
            }}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingBottom: 10,
    fontWeight: "500",
    color: "#4B5563", // Gray-600
  },
  inputContainer: {
    minHeight: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    justifyContent: "flex-start",
    borderRadius: 15,
  },
  centerAlign: {
    justifyContent: "center",
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    paddingVertical: 7.5,
  },
  cancelButton: {
    height: 42,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DefaultInput;
