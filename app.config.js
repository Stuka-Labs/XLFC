import 'dotenv/config';

export default {
    expo: {
        name: "XLFC",
        slug: "XLFC",
        scheme: "xlfc",
        ios: {
            googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST_PATH || './GoogleService-Info.plist',
            bundleIdentifier: "com.stuka.xlfc",
        },
        extra: {
            eas: {
                projectId: "5a5b1fa7-78ad-49d8-9758-76ba0b79c7a2",
            },
        },
    },
};
