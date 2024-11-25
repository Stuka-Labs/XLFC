#!/bin/bash

# Encode the plist file
base64 -i GoogleService-Info.plist -o GoogleServiceInfo.b64

# Ensure the EAS project is already configured manually
if [ ! -f eas.json ]; then
  echo "EAS project is not configured. Run 'eas build:configure' manually to link the project."
  exit 1
fi

# Delete existing variable if it exists
eas env:delete --variable-name GOOGLE_SERVICE_INFO_PLIST --non-interactive || echo "No existing variable to delete."

# Create EAS secret with sensitive visibility and production environment
eas env:create --variable-name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleServiceInfo.b64 --scope project --visibility sensitive --environment production

# Verify the secret
eas env:list production
