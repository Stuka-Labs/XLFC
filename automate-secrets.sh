#!/bin/bash

set -e  # Exit on errors
set -x  # Debugging logs

# Step 1: Check if the plist file exists
if [ ! -f GoogleService-Info.plist ]; then
  echo "Error: GoogleService-Info.plist not found!"
  exit 1
fi

# Step 2: Encode the plist file into base64
base64 GoogleService-Info.plist > GoogleServiceInfo.b64

# Step 3: Verify the Base64 file
if [ ! -s GoogleServiceInfo.b64 ]; then
  echo "Error: GoogleServiceInfo.b64 is empty or invalid!"
  exit 1
fi

# Step 4: Check EAS configuration
if [ ! -f eas.json ]; then
  echo "EAS project is not configured. Run 'eas build:configure' to link the project."
  exit 1
fi

# Step 5: Create the environment variable
eas env:create --environment production --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleServiceInfo.b64 --scope project --visibility sensitive --non-interactive

# Step 6: Verify the variable
eas env:list production
