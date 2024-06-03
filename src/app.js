import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: "*",
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

// Define API for specific Route

export { app };