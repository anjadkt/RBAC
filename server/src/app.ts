import express from "express";
import cors from 'cors';
import env from "./config/env";
import cookieParser from 'cookie-parser';
import serverRoutes from "./router";
import globalErrorHandler from "./middlewares/error.middleware";
import morgan from "morgan";
import helmet from "helmet";



const app = express();

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(morgan('dev'));
app.use(helmet());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api", serverRoutes);

app.use(globalErrorHandler);


export default app;
