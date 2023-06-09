import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./src/routers/index.js"

dotenv.config();

const app = express();

const PORT = 3333 || process.env.PORT;

const corsOptions = {
    origin:'https://ignakk.github.io', 
    credentials:true,           
    optionSuccessStatus:200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`Server started on ${PORT} port`))
    } catch (e) {
        console.log(e)
    }
}

start();