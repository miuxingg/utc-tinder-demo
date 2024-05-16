import mongoose from "mongoose";
import Message from "../models/message.model";

export const createMessage = async (req: any, res: any, next: any) => {
  try {
    const user = req.userId;
    const message = await Message.create({
      sender: user,
      recipient: req.body.recipient,
      content: req.body.content,
    });
    console.log("message", message);

    res.status(200).json({
      status: "success",
      data: message,
    });
  } catch (error) {
    res.json(error);
  }
};

export const getMessage = async (req: any, res: any, next: any) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: req.body.recipient },
        { sender: req.body.recipient, recipient: req.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .skip(req.body.skipCount)
      .limit(55);

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    res.json(error);
  }
};

export const deleteMessage = async (req: any, res: any, next: any) => {
  try {
    const deleteMessage = await Message.deleteMany();

    res.status(200).json({
      status: "success",
      data: deleteMessage,
    });
  } catch (error) {
    res.json(error);
  }
};
