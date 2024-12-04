import 'dotenv/config';
import * as fs from 'fs';

export default ({ config }) => {
  // Dynamically write the iOS Firebase configuration
  // if (process.env.GOOGLE_SERVICES_PLIST) {
  const iosFilePath = './assets/GoogleService-Info.plist';
  fs.mkdirSync('./assets', { recursive: true }); // Ensure the assets directory exists
  fs.writeFileSync(iosFilePath, process.env.GOOGLE_SERVICES_PLIST, 'utf8');
  // }

  // // Dynamically write the Android Firebase configuration
  // if (process.env.GOOGLE_SERVICES_JSON) {
  //   const androidFilePath = './assets/google-services.json';
  //   fs.mkdirSync('./assets', { recursive: true }); // Ensure the assets directory exists
  //   fs.writeFileSync(androidFilePath, process.env.GOOGLE_SERVICES_JSON, 'utf8');
  // }

  return {
    expo: {
      owner: "stukadev",
      name: "XLFC",
      slug: "xlfc",
      scheme: "xlfc",
      version: "1.0.1",
      ios: {
        useFrameworks: "static", // Required for Firebase integration
        supportsTablet: true,
        googleServicesFile: "./assets/GoogleService-Info.plist", // Firebase config
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
