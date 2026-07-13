import express from "express"
import mongoose from "mongoose"
import cors from 'cors'
import env from "./config/env";
import cookieParser from 'cookie-parser'

import { login, logout, register } from "./controllers/auth.controller";
import { authenticate } from "./middlewares/auth.middleware";
import { createRole, getRoles } from "./controllers/role.controller";
import { authorize } from "./middlewares/permission.middleware";
import { createPermission, getPermissions } from "./controllers/permission.controller";

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
app.get("/logout", authenticate, logout);

app.get("/roles", authenticate, authorize("users.roles.view"), getRoles);
app.post("/roles", authenticate, authorize("users.roles.create"), createRole);

app.get("/permissions", authenticate, authorize("users.permissions.view"), getPermissions);
app.post("/permissions", authenticate, authorize("users.permissions.create"), createPermission)





export default app ;
