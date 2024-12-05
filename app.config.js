import 'dotenv/config';
// import * as fs from 'fs';

export default ({ config }) => {
  // if (process.env.GOOGLE_SERVICES_PLIST) {
  //   const iosFilePath = './GoogleService-Info.plist';
  //   fs.writeFileSync(iosFilePath, process.env.GOOGLE_SERVICES_PLIST, 'utf8');
  // } else {
  //   // ignore
  // }

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
        "image": "./assets/images/logo.png",
        "backgroundColor": "transparent"
      },
      ios: {
        useFrameworks: "static",
        supportsTablet: true,
        bundleIdentifier: "com.stuka.xlfc",
      },
      plugins: [
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        [
          "expo-build-properties",
          {
            ios: {
              useFrameworks: "static",
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
