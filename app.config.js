import 'dotenv/config';
import * as fs from 'fs';

export default ({ config }) => {
  // Generate iOS Firebase configuration
  // if (process.env.GOOGLE_SERVICES_PLIST) {
  //   const iosFilePath = './GoogleService-Info.plist';
  //   fs.mkdirSync('./assets', { recursive: true }); // Ensure directory exists
  //   fs.writeFileSync(iosFilePath, process.env.GOOGLE_SERVICES_PLIST, 'utf8');
  //   console.log('Generated GoogleService-Info.plist for iOS.');
  // } else {
  //   console.error(
  //     'Environment variable GOOGLE_SERVICES_PLIST is missing. Firebase configuration for iOS will fail.'
  //   );
  // }

  // // Generate Android Firebase configuration
  // if (process.env.GOOGLE_SERVICES_JSON) {
  //   const androidFilePath = './assets/google-services.json';
  //   fs.mkdirSync('./assets', { recursive: true }); // Ensure directory exists
  //   fs.writeFileSync(androidFilePath, process.env.GOOGLE_SERVICES_JSON, 'utf8');
  //   console.log('Generated google-services.json for Android.');
  // } else {
  //   console.error(
  //     'Environment variable GOOGLE_SERVICES_JSON is missing. Firebase configuration for Android will fail.'
  //   );
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
        bundleIdentifier: "com.stuka.xlfc",
        googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? '/Users/joeshakely/repos/XLFC-Front/GoogleService-Info.plist',
      },
      android: {
        package: "com.stuka.xlfc", // Unique Android identifier
        googleServicesFile: "./assets/google-services.json", // Dynamically generated file
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
