import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createMessage,
  deleteMessage,
  getMessage,
} from "../controllers/message.controller";

const routerMessage = express.Router();
routerMessage.route("/createMessage").post(verifyToken, createMessage);
routerMessage.route("/getMessage").post(verifyToken, getMessage);
routerMessage.route("/deleteMessage").delete(verifyToken, deleteMessage);
export default routerMessage;
