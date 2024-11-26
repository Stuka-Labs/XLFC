import 'dotenv/config';

export default {
  expo: {
    name: "XLFC",
    slug: "XLFC",
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
        projectId: "5a5b1fa7-78ad-49d8-9758-76ba0b79c7a2",
      },
      apiUrl: process.env.API_URL, // Example environment variable
    },
  },
};
