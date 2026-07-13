import dotenv from 'dotenv'
dotenv.config();

const getEnv = (key: string) => {

  const env = process.env[key];
  if (!env) throw new Error("env not found!");

  return env;

}


const env = {
  MONGO_URL: getEnv("MONGO_URL"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  PORT: getEnv("PORT"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  NODE_ENV: getEnv("NODE_ENV"),

}

export default env