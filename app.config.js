import 'dotenv/config';

export default {
  expo: {
    name: "XLFC",
    slug: "XLFC",
    scheme: "xlfc",
    ios: {
      useFrameworks: "static", // Required for Firebase in iOS builds
      supportsTablet: true,
      googleServicesFile: "./assets/GoogleService-Info.plist", // Firebase iOS configuration
      bundleIdentifier: "com.stuka.xlfc", // Unique iOS app ID
    },
    android: {
      package: "com.stuka.xlfc", // Unique Android app ID
      googleServicesFile: "./assets/google-services.json", // Firebase Android configuration
    },
    extra: {
      eas: {
        projectId: "5a5b1fa7-78ad-49d8-9758-76ba0b79c7a2", // EAS project ID
      },
    },
  },
};
