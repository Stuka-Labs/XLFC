#!/bin/bash

set -e  # Exit on errors
set -x  # Debugging logs

# Step 1: Encode the plist file
if [ ! -f GoogleService-Info.plist ]; then
  echo "Error: GoogleService-Info.plist not found!"
  exit 1
fi

base64 -i GoogleService-Info.plist -o GoogleServiceInfo.b64

# Step 2: Verify the Base64 file
if [ ! -s GoogleServiceInfo.b64 ]; then
  echo "Error: GoogleServiceInfo.b64 is empty or invalid!"
  exit 1
fi

# Step 3: Check EAS configuration
if [ ! -f eas.json ]; then
  echo "EAS project is not configured. Run 'eas build:configure' to link the project."
  exit 1
fi

chmod +r ./GoogleServiceInfo.b64
# # Step 4: Delete existing variable if it exists
# eas env:delete --variable-name GOOGLE_SERVICE_INFO_PLIST --non-interactive || echo "No existing variable to delete."

# Step 5: Create the environment variable
eas env:create --environment production --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleServiceInfo.b64 --scope project --visibility sensitive --non-interactive
