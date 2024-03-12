import express from "express";
import { createHobbies } from "../controllers/hobbies.controller";

const routerhHobbies = express.Router();
routerhHobbies.route("/createHobbies").post(createHobbies);

export default routerhHobbies;
