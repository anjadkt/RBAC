import express from "express"
import mongoose from "mongoose"
import env from "./config/env";
import { login, register } from "./controllers/auth.controller";

const app = express();

mongoose.connect(env.MONGO_URL)

.then(() => {
  console.log("DB connected!");
  app.listen(3000,() => console.log("Server is listening..."));
})

.catch(() => console.log("DB connection failed!"));

app.post("/register", register);
app.post("/login", login);




export default app ;