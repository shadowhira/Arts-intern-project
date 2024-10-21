import { cleanEnv, str } from "envalid";

// check type for env variable

const env = cleanEnv(process.env, {
  PEXELS_API_KEY: str(),
});

export default env;
