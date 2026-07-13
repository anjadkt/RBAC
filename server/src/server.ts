import express from "express"
import mongoose from "mongoose"
import cors from 'cors'
import env from "./config/env";
import cookieParser from 'cookie-parser'

import { login, logout, register } from "./controllers/auth.controller";

const app = express();

app.use(express.json());

mongoose.connect(env.MONGO_URL)

.then(() => {
  console.log("DB connected!");
  app.listen(3000,() => console.log("Server is listening..."));
})

.catch(() => console.log("DB connection failed!"));


app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}));
app.use(express.json());
app.use(cookieParser());

app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);




export default app ;
