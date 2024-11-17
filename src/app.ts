import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authenticationRouter from "./modules/authentication/routes/authenticationRouter";
import draftOfferRouter from "./modules/offer/routes/draftOfferRouter";
import cookieParser from "cookie-parser";
import {createAdminUser} from "./shared/InitializeDeafultUser";
import mongoose from "mongoose";
import {errorHandler} from "./shared/errorHandler";
import {jwtRequestFilter} from "./shared/middlewares/jwtRequestFilter";
import salesTierRouter from "./modules/tier/routs/salesTierRouter";
import baseTierRouter from "./modules/tier/routs/baseTierRouter";

const app = express();

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

app.use(jwtRequestFilter);
app.use("/auth", authenticationRouter);
app.use("/offer", draftOfferRouter);
app.use("/sales_tier", salesTierRouter);
app.use("/base_tier", baseTierRouter);
app.use(errorHandler);

export {app, mongoose} ;