import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authenticationRouter from "./modules/authentication/routes/authenticationRouter";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authenticationRouter);

export default app;