/* eslint-disable no-undef */
import { Alert, Linking } from "react-native";
import { Tabs, Redirect, router, useFocusEffect } from "expo-router";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fileTypeFromFile } from 'file-type'
// import mime from 'mime'
// import auth from "@react-native-firebase/auth";
import env from "@/env";

const post = async (
  endpoint: string,
  params: { token: string },
  setInProgress: ((arg0: boolean) => any) | null,
  callback: { (response: any): Promise<void>; (arg0: any): any },
  failed: { (): Promise<void>; (arg0: unknown): any } = async () =>
    Promise.resolve(),
  token: string | null | undefined,
  fullUrl: string | undefined
) => {
  const url =
    fullUrl ??
    (env.API_DOMAIN_WITH_ENDPOINT
      ? env.API_DOMAIN_WITH_ENDPOINT(endpoint)
      : ""); // Determine the URL
  const authToken = token;
  console.log("token from defaults.jsx ", authToken || "");
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

const getNew = async (
  endpoint: string,
  params: Record<string, string | number> = {},
  setInProgress?: (inProgress: boolean) => void,
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
  token?: string,
  fullUrl?: string
) => {
  try {
    // Construct the base URL
    const baseUrl = fullUrl ?? env.API_DOMAIN_WITH_ENDPOINT(endpoint);

    // Add query parameters to the URL
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();

    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    // Get the authentication token
    const authToken = token ?? (await AsyncStorage.getItem("auth_token"));

    // Set the progress indicator to true
    setInProgress && setInProgress(true);

    // Perform the GET request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }), // Add Authorization header if the token exists
      },
    });

    const data = await response.json();

    // Handle success and failure
    if (response.ok) {
      console.info("GET Request Success:", { endpoint, params, data });
      onSuccess && onSuccess(data);
    } else {
      console.error("GET Request Failed:", { endpoint, params, data });
      onError && onError(data);
    }
  } catch (error) {
    console.error("GET Request Error:", { endpoint, params, error });
    onError && onError(error);
  } finally {
    // Set the progress indicator to false
    setInProgress && setInProgress(false);
  }
};
const postNew = async (
  endpoint: string,
  body: Record<string, any> = {},
  setInProgress?: (inProgress: boolean) => void,
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
  token?: string,
  fullUrl?: string
) => {
  try {
    // Construct the base URL
    const baseUrl = fullUrl ?? env.API_DOMAIN_WITH_ENDPOINT(endpoint);
    const url = baseUrl;

    // Get the authentication token
    const authToken = token ?? (await AsyncStorage.getItem("auth_token"));

    // Set the progress indicator to true
    setInProgress && setInProgress(true);

    // Perform the POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }), // Add Authorization header if the token exists
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Handle success and failure
    if (response.ok) {
      console.info("POST Request Success:", { endpoint, body, data });
      onSuccess && onSuccess(data);
    } else {
      console.error("POST Request Failed:", { endpoint, body, data });
      onError && onError(data);
    }
  } catch (error) {
    console.error("POST Request Error:", { endpoint, body, error });
    onError && onError(error);
  } finally {
    // Set the progress indicator to false
    setInProgress && setInProgress(false);
  }
};


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
  getNew: getNew,
  postNew: postNew,
  copy: (i: any) => JSON.parse(JSON.stringify(i)),
  call: (number: any) => Linking.openURL(`tel:+${number}`),
  simpleAlert: simpleAlert,
  cString: (number: number, text: any, isOne: any) => {
    if (isOne) return `${number} ${number == 1 ? text : isOne}`;

    return `${number} ${text}${number == 1 ? "" : "s"}`;
  },
};
