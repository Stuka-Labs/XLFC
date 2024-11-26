/* eslint-disable no-undef */
import { Alert, Linking } from "react-native";
import { Tabs, Redirect, router, useFocusEffect } from "expo-router";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fileTypeFromFile } from 'file-type'
// import mime from 'mime'
// import auth from "@react-native-firebase/auth";
import env from "@/env";

// import { setupNotifications } from '../lib/notification.js'

const request = async (
  endpoint: string,
  method: string,
  params:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined,
  setInProgress: (arg0: boolean) => void,
  callback: (arg0: any) => void,
  failed: () => any,
  auth_token: any,
  fullUrl: string
) => {
  const url =
    fullUrl ??
    (env.API_DOMAIN_WITH_ENDPOINT
      ? env.API_DOMAIN_WITH_ENDPOINT(endpoint) + `?`
      : "");
  if (setInProgress) setInProgress(true);
  const token = auth_token ?? (await AsyncStorage.getItem("auth_token")) ?? "";
  console.log("token from defaults.request", token);
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkcml2ZXJJZCI6IjY1NzNlYzhjNTAwMTdiN2NiNzU0OTZkMCIsInVzZXJJZCI6IjY1NTY5NjI1NDQyNWY2MWI0MzI4YmMzNCIsImlhdCI6MTcxNjM0ODIwMn0.TeYhdPyRPXr333rUQnBU_syQA8ZydqRyj4OhGuLF5T4'

  try {
    const response = await fetch(
      url + new URLSearchParams(method == "GET" ? params : {}),
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
          Authorization: token,
        },
        body: method == "POST" ? JSON.stringify(params) : null,
      }
    );

    if (setInProgress) setInProgress(false);

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
      if (failed) return failed();

      if (data.message)
        Alert.alert("Error", data.message, [{ text: "Okay" }], {
          cancelable: true,
        });

      return;
    }

    console.log("Data", data);
    // You can save data to AsyncStorage, Redux store, or any state management solution here
    // console.log('Sign-in successful', data);

    if (callback) callback(data);

    // Example: Saving data to AsyncStorage (if required)
    // await AsyncStorage.setItem('userToken', data.token);

    // return data
  } catch (err) {
    const errorMessage =
      (err as any).response?.data ?? (err as any).message ?? err;
    console.log("Error", errorMessage, url);
    // return { err_message: err.message || err }
    // return { err_message: errorMessage }
    Alert.alert("Error", errorMessage, [{ text: "Okay" }], {
      cancelable: true,
    });
  }
};

const post = async (
  endpoint: string,
  params: { token: string },
  setInProgress: ((arg0: boolean) => any) | null,
  callback: { (response: any): Promise<void>; (arg0: any): any },
  failed: { (): Promise<void>; (arg0: unknown): any } = async () => Promise.resolve(),
  token: string | null | undefined,
  fullUrl: string | undefined
) => {
  const url =
    fullUrl ??
    (env.API_DOMAIN_WITH_ENDPOINT
      ? env.API_DOMAIN_WITH_ENDPOINT(endpoint)
      : ""); // Determine the URL
  const authToken = token ?? (await AsyncStorage.getItem("auth_token")); // Fetch token if not provided
  console.log("url from post", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(params),
    });

    const text = await response.text(); // Get raw response
    console.log("Raw Response:", text);

    let data;
    try {
      data = JSON.parse(text); // Attempt to parse as JSON
    } catch (err) {
      console.log("Failed to parse response as JSON. Returning raw text.");
      data = { raw: text }; // Fallback to raw text
    }

    if (response.ok) {
      console.info("POST Request Success:", { endpoint, params, data });
      callback && callback(data);
    } else {
      console.log("POST Request Failed:", { endpoint, params, data });
      failed && failed(data);
    }
  } catch (error) {
    console.error("POST Request Error:", { endpoint, params, error });
    failed && failed(error);
  } finally {
    setInProgress && setInProgress(false); // Reset progress indicator
  }
};

const get = async (
  endpoint: string,
  params:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined,
  setInProgress: (arg0: boolean) => any,
  callback: { (response: any): Promise<void>; (arg0: any): any },
  failed: ((arg0: unknown) => any) | null,
  token: string | null,
  fullUrl: string | undefined
) => {
  const url =
    fullUrl ??
    (env.API_DOMAIN_WITH_ENDPOINT
      ? `${env.API_DOMAIN_WITH_ENDPOINT(endpoint)}?${new URLSearchParams(params)}`
      : "");
  const authToken = token ?? (await AsyncStorage.getItem("auth_token"));

  try {
    setInProgress && setInProgress(true);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.info("GET Request Success:", { endpoint, params, data });
      callback && callback(data);
    } else {
      // console.log("GET Request Failed:", { endpoint, params, data });
      failed && failed(data);
    }
  } catch (error) {
    console.error("GET Request Error:", { endpoint, params, error });
    failed && failed(error);
  } finally {
    setInProgress && setInProgress(false);
  }
};

// const upload = async (uri: any, directory: any, setInProgress: (arg0: boolean) => void, progressHandler: (arg0: number) => void, completed: (arg0: any) => void, failed: (arg0: any) => void) => {
//   if (setInProgress) setInProgress(true)

//   const formData = new FormData()
//   const mimeType = mime.getType(uri)
//   const url = `${env.API_DOMAIN}upload/file?directory=${directory}`

//   formData.append('file', {
//     uri: uri,
//     name: uuidv4(),
//     type: mimeType
//   })

//   try {
//     const response = await axios.post(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       },
//       onUploadProgress: (progressEvent) => {
//         // const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
//         const progress = progressEvent.total ? progressEvent.loaded / progressEvent.total : 0
//         if (progressHandler) progressHandler(progress)
//         // setProgress(progressPercent);
//       }
//     })

//     if (setInProgress) setInProgress(false)

//     completed(response.data.fileName)
//   } catch (error) {
//     if (setInProgress) setInProgress(false)
//     if (failed) failed((error as any).response?.data ?? (error as any).message ?? error)
//   }
// }

const simpleAlert = (
  title: string,
  message: string | undefined,
  positive: any,
  onPress: any,
  negative = "Cancel"
) => {
  const options = [
    {
      text: positive ?? "Okay",
      onPress: onPress,
    },
  ];
  if (positive && negative)
    options.push({
      text: negative,
      onPress: undefined,
    });

  Alert.alert(title, message, options, { cancelable: true });
};

export default {
  post: post,
  get: get,
  copy: (i: any) => JSON.parse(JSON.stringify(i)),
  call: (number: any) => Linking.openURL(`tel:+${number}`),
  simpleAlert: simpleAlert,
  cString: (number: number, text: any, isOne: any) => {
    if (isOne) return `${number} ${number == 1 ? text : isOne}`;

    return `${number} ${text}${number == 1 ? "" : "s"}`;
  },
};
