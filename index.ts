import dotenv from "dotenv";
dotenv.config();

import connectDB from "./configs/db";
connectDB();

import express from "express";
import cors from "cors";
import User from "./models/users.model";
import routerUser from "./routes/user.route";
import routerProfile from "./routes/profile.route";
import routerHobbies from "./routes/hobbies.route";
import routerPreferences from "./routes/preferences.route";
import { errorHandler } from "./middlewares/validate.middleware";
import routerActivity from "./routes/activity.route";
import routerCloudinaryUpload from "./routes/cloudinaryUpload.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routerUser);
app.use("/api", routerProfile);
app.use("/api", routerHobbies);
app.use("/api", routerPreferences);
app.use("/api", routerActivity);
app.use("/api", routerCloudinaryUpload);
app.all("*", (req, res, next) => {
  const err = new Error("The route can not found");
  return next(err);
});

app.use(errorHandler);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
});
