import express from "express";
import { login, register } from "../controllers/user.controller";

const routerUser = express.Router();
routerUser.route("/register").post(register);
routerUser.route("/login").post(login);

export default routerUser;
