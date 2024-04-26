import express from "express";
import {
  createHobbies,
  deleteAllBobbies,
  genarateHobbies,
  getHobbiesType,
  getHobbyNameFromType,
  updateHobbies,
} from "../controllers/hobbies.controller";
import { verifyToken } from "../middlewares/verifyToken";

const routerHobbies = express.Router();
// routerHobbies.route("/createHobbies").post(createHobbies);
routerHobbies.route("/updateHobbies").put(verifyToken, updateHobbies);
routerHobbies.route("/getHobbiesType").get(getHobbiesType);
routerHobbies
  .route("/getHobbyNameFromType/:type")
  .get(verifyToken, getHobbyNameFromType);
routerHobbies.route("/genarateHobbies").post(verifyToken, genarateHobbies);
routerHobbies.route("/deleteAllBobbies").delete(verifyToken, deleteAllBobbies);

export default routerHobbies;
