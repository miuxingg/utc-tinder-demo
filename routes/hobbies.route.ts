import express from "express";
import {
  createHobbies,
  genarateHobbies,
  updateHobbies,
} from "../controllers/hobbies.controller";
import { verifyToken } from "../middlewares/verifyToken";

const routerHobbies = express.Router();
// routerHobbies.route("/createHobbies").post(createHobbies);
routerHobbies.route("/updateHobbies").put(verifyToken, updateHobbies);
routerHobbies.route("/genarateHobbies").post(verifyToken, genarateHobbies);

export default routerHobbies;
