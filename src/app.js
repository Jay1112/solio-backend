import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";
import socialsRouter from "./routers/socials.router.js";
import personalizedRouter from "./routers/personalized.router.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_DOMAIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());

// Import Routers
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/socials",socialsRouter);
app.use("/api/v1/personalize",personalizedRouter);

// Define API for specific Route

export { app };