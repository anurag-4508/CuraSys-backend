import express from 'express'
import { config } from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import userRouter from "./router/userRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
const app = express();

config({ path: "./config/config.env" })

//MIDDLEWARES 
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DAHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))



app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/appointment", appointmentRouter)
dbConnection()


app.use(errorMiddleware);
export default app;
