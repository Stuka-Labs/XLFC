import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  API_DOMAIN: string;
  APP_NAME: string;
  BUNDLE_ID: string;
  USER_EMAIL?: string; // Optional for production
  USER_PASSWORD?: string; // Optional for production
  IS_PROD: boolean;
  USER_PHONE: string;
  API_DOMAIN_WITH_ENDPOINT?: (endpoint: string) => string;
  GOOGLE_SERVICES_FILE: string;
}

const getConfig = (): EnvConfig => {
  if (process.env.NODE_ENV === "production") {
    return {
      API_DOMAIN: process.env.PROD_API_DOMAIN!,
      APP_NAME: process.env.PROD_APP_NAME!,
      BUNDLE_ID: process.env.PROD_BUNDLE_ID!,
      USER_EMAIL: undefined,
      USER_PASSWORD: undefined,
      IS_PROD: process.env.PROD_IS_PROD === "true",
      USER_PHONE: process.env.PROD_USER_PHONE || "",
      GOOGLE_SERVICES_FILE: process.env.PROD_GOOGLE_SERVICES_FILE!,
    };
  } else {
    return {
      API_DOMAIN: process.env.DEV_API_DOMAIN!,
      APP_NAME: process.env.DEV_APP_NAME!,
      BUNDLE_ID: process.env.DEV_BUNDLE_ID!,
      USER_EMAIL: process.env.DEV_USER_EMAIL,
      USER_PASSWORD: process.env.DEV_USER_PASSWORD,
      IS_PROD: process.env.DEV_IS_PROD === "true",
      USER_PHONE: process.env.DEV_USER_PHONE!,
      GOOGLE_SERVICES_FILE: process.env.DEV_GOOGLE_SERVICES_FILE!,
    };
  }
};

const env: EnvConfig = getConfig();

env.API_DOMAIN_WITH_ENDPOINT = (endpoint: string): string =>
  env.API_DOMAIN.replace("{{endpoint}}", endpoint);

export default env;
