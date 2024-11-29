interface Env {
  API_DOMAIN: string;
  APP_NAME: string;
  BUNDLE_ID: string;
  IS_PROD: boolean;
  USER_PHONE: string;
  USER_EMAIL?: string;
  USER_PASSWORD?: string;
  DEV_USER_EMAIL?: string;
  DEV_USER_PASSWORD?: string;
  TEST_EMAIL?: string;
  TEST_PHONE?: string;
  TEST_PASSWORD?: string;
  NODE_ENV: string;
  API_DOMAIN_WITH_ENDPOINT: (endpoint: string) => string;
}

const development: Env = {
  API_DOMAIN: "http://127.0.0.1:5001/xlfc-e8f8f/us-central1/{{endpoint}}/",
  APP_NAME: "XLFC Dev",
  BUNDLE_ID: "com.stuka.xlfc.dev",
  USER_EMAIL: "shakelyconsulting@gmail.com",
  USER_PASSWORD: "G9&kL!zX2@Yt~",
  IS_PROD: false,
  USER_PHONE: "+19169479632",
  API_DOMAIN_WITH_ENDPOINT: (endpoint: string): string =>
    "http://127.0.0.1:5001/xlfc-e8f8f/us-central1/{{endpoint}}/".replace(
      "{{endpoint}}",
      endpoint
    ),
    DEV_USER_EMAIL: "bobloblaw@gmail.com",
    DEV_USER_PASSWORD: "G9&kL!zX2@Yt~",
    TEST_PASSWORD: "G9&kL!zX2@Yt~",
    TEST_PHONE:  "+19169479669",
    TEST_EMAIL:  "bobloblaw@gmail.com",
    NODE_ENV: "development",
};

const production: Env = {
  NODE_ENV: "production",
  API_DOMAIN: "https://{{endpoint}}-hhjsyj7q4q-uc.a.run.app/",
  APP_NAME: "XLFC",
  BUNDLE_ID: "com.stuka.xlfc",
  IS_PROD: true,
  USER_PHONE: "",
  API_DOMAIN_WITH_ENDPOINT: (endpoint: string): string =>
    "https://{{endpoint}}-hhjsyj7q4q-uc.a.run.app/".replace(
      "{{endpoint}}",
      endpoint
    ),
    DEV_USER_EMAIL: "",
    DEV_USER_PASSWORD: "",
};

const env: Env =
  process.env.NODE_ENV === "production" ? production : development;

export default env;
