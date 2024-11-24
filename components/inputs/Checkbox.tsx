import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Or any other icon library

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ value, onValueChange, label }) => {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: value ? "blue" : "gray",
          backgroundColor: value ? "blue" : "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value && (
          <MaterialIcons name="check" size={16} color="white" />
        )}
      </View>
      <Text style={{ marginLeft: 8 }}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
