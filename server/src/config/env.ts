import dotenv from 'dotenv'
dotenv.config();

const getEnv = (key:string) => {

  const env = process.env[key];
  if(!env) throw new Error("env not found!");

  return env ;

}


const env = {
  MONGO_URL : getEnv("MONGO_URL"),
  JWT_SECRET : getEnv("JWT_SECRET")

}

export default env