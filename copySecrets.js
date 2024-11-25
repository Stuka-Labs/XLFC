const fs = require('fs');
const path = require('path');

const secretsPath = path.resolve(__dirname, '../GoogleServiceInfo.b64');
const iosTargetPath = path.resolve(__dirname, '../ios/MyApp/GoogleService-Info.plist');
const androidTargetPath = path.resolve(__dirname, '../android/app/google-services.json');

// Copy to iOS
fs.copyFileSync(secretsPath, iosTargetPath);

// Copy to Android
fs.copyFileSync(secretsPath, androidTargetPath);

console.log('Secrets copied to native projects.');
