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
      .limit(5);

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    res.json(error);
  }
};
