/* eslint-disable no-undef */
import { Alert, Linking } from 'react-native'
import { Tabs, Redirect, router, useFocusEffect } from 'expo-router'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { fileTypeFromFile } from 'file-type'
import mime from 'mime'
import auth from "@react-native-firebase/auth";
import analytics from './analytics'
import constants from './constants'
import env from './env'

// import { setupNotifications } from '../lib/notification.js'

const request = async (endpoint, method, params, setInProgress, callback, failed, auth_token, fullUrl) => {
  const url = fullUrl ?? env.API_DOMAIN_WITH_ENDPOINT(endpoint) + `?`
  if (setInProgress) setInProgress(true)
  const token = auth_token ?? await AsyncStorage.getItem('auth_token') ?? ''
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkcml2ZXJJZCI6IjY1NzNlYzhjNTAwMTdiN2NiNzU0OTZkMCIsInVzZXJJZCI6IjY1NTY5NjI1NDQyNWY2MWI0MzI4YmMzNCIsImlhdCI6MTcxNjM0ODIwMn0.TeYhdPyRPXr333rUQnBU_syQA8ZydqRyj4OhGuLF5T4'

  try {

    const response = await fetch(url + new URLSearchParams(method == 'GET' ? params : {}), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
        'Authorization': token
      },
      body: method == 'POST' ? JSON.stringify(params) : null
    })

    if (setInProgress) setInProgress(false)

    const data = await response.json();

    if (!response.ok) {
      // response.text().then(async (text) => {
      //   if (response.status == 501 && text == 'sign-out'){
      //     // AsyncStorage.removeItem('auth_token')
      //     analytics.logEvent('log_out', {
      //       from: 'server'
      //     })
      //     analytics.initUser(null)
      //     return logOut()
      //   }

      //   Alert.alert('Error', text, [ { text: 'Okay' }], { cancelable: true })
      // })
      if (failed)
        return failed()

      if (data.message)
        Alert.alert('Error', data.message, [{ text: 'Okay' }], { cancelable: true })

      return
    }

    console.log('Data', data)
    // You can save data to AsyncStorage, Redux store, or any state management solution here
    // console.log('Sign-in successful', data);

    if (callback) callback(data)

    // Example: Saving data to AsyncStorage (if required)
    // await AsyncStorage.setItem('userToken', data.token);

    // return data
  } catch (err) {
    const errorMessage = err.response?.data ?? err.message ?? err
    console.log('Error', errorMessage, url)
    // return { err_message: err.message || err }
    // return { err_message: errorMessage }
    Alert.alert('Error', errorMessage, [{ text: 'Okay' }], { cancelable: true })
  }
}

const post = (endpoint, params, setInProgress, callback, failed, token, fullUrl) => {
  request(endpoint, 'POST', params, setInProgress, callback, failed, token, fullUrl)
}

const get = async (endpoint, params, setInProgress, callback, failed, token, fullUrl) => {
  // eslint-disable-next-line no-undef
  const url = fullUrl ?? `${env.API_DOMAIN_WITH_ENDPOINT(endpoint)}?${new URLSearchParams(params)}`;
  const authToken = token ?? (await AsyncStorage.getItem('auth_token'));

  try {
    setInProgress && setInProgress(true);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.info('GET Request Success:', { endpoint, params, data });
      callback && callback(data);
    } else {
      console.warn('GET Request Failed:', { endpoint, params, data });
      failed && failed(data);
    }
  } catch (error) {
    console.error('GET Request Error:', { endpoint, params, error });
    failed && failed(error);
  } finally {
    setInProgress && setInProgress(false);
  }
};

const upload = async (uri, directory, setInProgress, progressHandler, completed, failed) => {
  if (setInProgress) setInProgress(true)

  const formData = new FormData()
  const mimeType = mime.getType(uri)
  const url = `${env.API_DOMAIN}upload/file?directory=${directory}`

  formData.append('file', {
    uri: uri,
    name: uuidv4(),
    type: mimeType
  })

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        const progress = progressEvent.loaded / progressEvent.total
        if (progressHandler) progressHandler(progress)
        // setProgress(progressPercent);
      }
    })

    if (setInProgress) setInProgress(false)

    completed(response.data.fileName)
  } catch (error) {
    if (setInProgress) setInProgress(false)
    if (failed) failed(err.response?.data ?? err.message ?? err)
  }
}

async function logOut() {
  const auth_token = await AsyncStorage.getItem('auth_token')
  if (!auth_token) return

  post('user/sign-out', {
    token: auth_token
  }, null, async (response) => {
    await AsyncStorage.clear()
    router.replace('/starter')
  }, async () => {
    await AsyncStorage.clear()
    router.replace('/starter')
  })
}

const simpleAlert = (title, message, positive, onPress, negative = 'Cancel') => {
  const options = [
    {
      text: positive ?? 'Okay',
      onPress: onPress
    }
  ]
  if (positive && negative)
    options.push({
      text: negative
    })

  Alert.alert(title, message, options, { cancelable: true })
}

async function getIdToken() {
  const user = auth().currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    return idToken;
  }
  throw new Error('No user is signed in.');
}

async function sendTokenToServer() {
  try {
    const idToken = await getIdToken();
    const response = await fetch('https://your-backend.com/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();
    console.log('Server response:', data);
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
}


export default {
  post: post,
  get: get,
  logIn: async (email, password, setInProgress) => {
    try {
      setInProgress(true);
      email = env.IS_PROD ? email : env.USER_EMAIL
      password = env.IS_PROD ? password : env.USER_PASSWORD
      console.log('env.IS_PROD:', env.IS_PROD);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);

      // console.log("[Client] Firebase Login Response:", JSON.stringify(userCredential));
      const { user } = userCredential;
      console.log('[Client] User:', user);

      // Save token or user data to AsyncStorage
      const idToken = await auth().currentUser.getIdToken(true);

      console.log('[Client] idToken:', idToken);

      await AsyncStorage.setItem("auth_token", idToken);
      await AsyncStorage.setItem("email", user.email);

      // Navigate or fetch additional user information if needed
      // console.log("User logged in successfully:", user);
      get('userInfo', {}, setInProgress, async (response) => {
        console.log('User info:', response);
        if (!response.account) {
          return router.replace("/role");
        }

        await AsyncStorage.setItem('first_name', response.first_name);
        await AsyncStorage.setItem('sur_name', response.sur_name);
        await AsyncStorage.setItem('account', response.account);
        return router.replace("/");
      }, null, `${idToken}`);

    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setInProgress(false);
    }
  },
  logOut: logOut,
  upload: upload,
  copy: (i) =>
    JSON.parse(JSON.stringify(i)),
  call: (number) =>
    Linking.openURL(`tel:+${number}`),
  simpleAlert: simpleAlert,
  cString: (number, text, isOne) => {
    if (isOne)
      return `${number} ${number == 1 ? text : isOne}`

    return `${number} ${text}${number == 1 ? '' : 's'}`
  }
}