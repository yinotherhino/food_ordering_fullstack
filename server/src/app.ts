import express, { Request, Response } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import adminRouter from "./routes/admin";
import indexRouter from "./routes/index";
import vendorRouter from "./routes/vendor";
import cors from 'cors';
import { db } from "./config";
import { config } from "dotenv";

config();

db.sync()
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(cors())

//Router Middleware
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/admins", adminRouter);
app.use("/vendors", vendorRouter);

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

export default app;
