import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authenticationRouter from "./modules/authentication/routes/authenticationRouter";
import cookieParser from "cookie-parser";
import {createAdminUser} from "./shared/InitializeDeafultUser";
import mongoose from "mongoose";
import {errorHandler} from "./shared/errorHandler";

const app = express();

//admin:HLK2gYEzad7hbmGe9DL@


const connect = async () =>{

    await mongoose.connect("mongodb://localhost:27017/mongo-landings-db")
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
};

app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
connect();
createAdminUser();
app.use("/auth", authenticationRouter);
app.use(errorHandler);
export {app, mongoose} ;

