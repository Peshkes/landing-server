import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authenticationRouter from "./modules/authentication/routes/authenticationRouter";
import cookieParser from "cookie-parser";
import {createAdminUser} from "./shared/InitializeDeafultUser";
import mongoose from "mongoose";

const app = express();

//Database connection
const dbURI = "mongodb://admin:HLK2gYEzad7hbmGe9DL@localhost:27018/mongo-landings-db";
mongoose.connect(dbURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
createAdminUser();
app.use("/auth", authenticationRouter);
export {app, mongoose} ;