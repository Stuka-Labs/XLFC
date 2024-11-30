#!/bin/bash

# Function to display usage instructions
function usage() {
  echo "Usage: $0 [platform]"
  echo "platform: android | ios (default: ios)"
  exit 1
}

# Default to iOS if no platform argument is provided
PLATFORM=${1:-ios}

# Build for Android
if [ "$PLATFORM" == "android" ]; then
  echo "Building Android project with verbose logs..."
  cd android || { echo "Android directory not found!"; exit 1; }
  ./gradlew assembleDebug --info
  if [ $? -eq 0 ]; then
    echo "Android build completed successfully."
  else
    echo "Android build failed."
    exit 1
  fi

# Build for iOS
elif [ "$PLATFORM" == "ios" ]; then
  echo "Building iOS project with verbose logs..."
  if [ ! -d "ios" ]; then
    echo "iOS directory not found!"
    exit 1
  fi
  xcodebuild -workspace ios/XLFC.xcworkspace -scheme XLFC -configuration Debug clean build
  if [ $? -eq 0 ]; then
    echo "iOS build completed successfully."
  else
    echo "iOS build failed."
    exit 1
  fi

# Invalid platform
else
  echo "Error: Invalid platform specified."
  usage
fi
