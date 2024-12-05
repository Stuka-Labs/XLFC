import 'dotenv/config';

export default {
  expo: {
    owner: "stukadev",
    name: "xlfc",
    slug: "xlfc",
    scheme: "xlfc",
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