import 'dotenv/config';
import * as fs from 'fs';

export default ({ config }) => {
  // Generate iOS Firebase configuration
  if (process.env.GOOGLE_SERVICES_PLIST) {
    const iosFilePath = './assets/GoogleService-Info.plist';
    fs.mkdirSync('./assets', { recursive: true }); // Ensure directory exists
    fs.writeFileSync(iosFilePath, process.env.GOOGLE_SERVICES_PLIST, 'utf8');
    console.log('Generated GoogleService-Info.plist for iOS.');
  } else {
    console.error(
      'Environment variable GOOGLE_SERVICES_PLIST is missing. Firebase configuration for iOS will fail.'
    );
  }

  // Generate Android Firebase configuration
  if (process.env.GOOGLE_SERVICES_JSON) {
    const androidFilePath = './assets/google-services.json';
    fs.mkdirSync('./assets', { recursive: true }); // Ensure directory exists
    fs.writeFileSync(androidFilePath, process.env.GOOGLE_SERVICES_JSON, 'utf8');
    console.log('Generated google-services.json for Android.');
  } else {
    console.error(
      'Environment variable GOOGLE_SERVICES_JSON is missing. Firebase configuration for Android will fail.'
    );
  }

  return {
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile: './assets/GoogleService-Info.plist',
      bundleIdentifier: 'com.stuka.xlfc',
    },
    android: {
      ...config.android,
      googleServicesFile: './assets/google-services.json',
      package: 'com.stuka.xlfc',
    },
  };
};
