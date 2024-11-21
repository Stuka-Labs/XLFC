interface EnvConfig {
  API_DOMAIN: string;
  APP_NAME: string;
  BUNDLE_ID: string;
  USER_EMAIL?: string; // Optional for production
  USER_PASSWORD?: string; // Optional for production
  IS_PROD: boolean;
  API_DOMAIN_WITH_ENDPOINT?: (endpoint: string) => string;
}

const development: EnvConfig = {
  API_DOMAIN: "http://127.0.0.1:5001/xlfc-e8f8f/us-central1/{{endpoint}}/",
  APP_NAME: "XLFC Dev",
  BUNDLE_ID: "com.stuka.xlfc.dev",
  USER_EMAIL: "shakelyconsulting@gmail.com",
  USER_PASSWORD: "G9&kL!zX2@Yt~",
  IS_PROD: false,
};

const production: EnvConfig = {
  API_DOMAIN: "https://{{endpoint}}-hhjsyj7q4q-uc.a.run.app/",
  APP_NAME: "XLFC",
  BUNDLE_ID: "com.stuka.xlfc",
  IS_PROD: true,
};

const env: EnvConfig = process.env.NODE_ENV === "production" ? production : development;

env.API_DOMAIN_WITH_ENDPOINT = (endpoint: string): string =>
  env.API_DOMAIN.replace("{{endpoint}}", endpoint);

export default env;
