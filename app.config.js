import 'dotenv/config';
import * as fs from 'fs';

export default ({ config }) => {
  if (process.env.GOOGLE_SERVICES_PLIST) {
    const iosFilePath = './GoogleService-Info.plist';
    fs.writeFileSync(iosFilePath, process.env.GOOGLE_SERVICES_PLIST, 'utf8');
  } else {
    // ignore
  }

  return {
    expo: {
      owner: "stukadev",
      name: "xlfc",
      slug: "xlfc",
      scheme: "xlfc",
      version: "1.0.1",
      description: "XLFC",
      icon: "./assets/images/lion_head.png",
      splash: {
        "image": "./assets/logo.png",
        "resizeMode": "cover",
        "backgroundColor": "#ffffff"
      },
      ios: {
        useFrameworks: "static", // Required for Firebase integration
        supportsTablet: true,
        googleServicesFile: ".//GoogleService-Info.plist", // Firebase config
        bundleIdentifier: "com.stuka.xlfc", // Unique iOS identifier
      },
      android: {
        package: "com.stuka.xlfc", // Unique Android identifier
        googleServicesFile: "./assets/google-services.json", // Firebase config
      },
      plugins: [
        [
          "expo-build-properties",
          {
            ios: {
              useFrameworks: "static", // Enable static frameworks
              extraPodspecs: [
                {
                  pod: "GoogleUtilities",
                  options: { modular_headers: true }, // Add modular headers for Firebase
                },
              ],
            },
          },
        ],
      ],
      extra: {
        eas: {
          projectId: "ccb80d1b-1ec1-45d3-8c60-a6e093bfb193",
        },
      },
    },
  };
};
