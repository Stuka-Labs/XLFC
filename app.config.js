import 'dotenv/config';

export default {
  expo: {
    name: "XLFC",
    slug: "XLFC",
    scheme: "xlfc",
    "version": "1.0.1",
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
      apiUrl: process.env.API_URL,
      DEV_API_DOMAIN: process.env.DEV_API_DOMAIN,
      PROD_API_DOMAIN: process.env.PROD_API_DOMAIN,
      DEV_APP_NAME: process.env.DEV_APP_NAME,
      PROD_APP_NAME: process.env.PROD_APP_NAME,
      DEV_USER_EMAIL: process.env.DEV_USER_EMAIL,
      DEV_USER_PASSWORD: process.env.DEV_USER_PASSWORD,
    },
  },
};
