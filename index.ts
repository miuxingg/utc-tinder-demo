import dotenv from 'dotenv';
dotenv.config();

import connectDB from './configs/db';
connectDB();

import express from 'express';
import cors from 'cors';
import User from './models/users.model';
import routerUser from './routes/user.route';
import routerProfile from './routes/profile.route';
import routerHobbies from './routes/hobbies.route';
import routerPreferences from './routes/preferences.route';
import { errorHandler } from './middlewares/validate.middleware';
import routerActivity from './routes/activity.route';
import routerCloudinaryUpload from './routes/cloudinaryUpload.route';
import routerMessage from './routes/message.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routerUser);
app.use('/api', routerProfile);
app.use('/api', routerHobbies);
app.use('/api', routerPreferences);
app.use('/api', routerActivity);
app.use('/api', routerMessage);
app.use('/api', routerCloudinaryUpload);
app.all('*', (req, res, next) => {
  const err = new Error('The route can not found');
  return next(err);
});

app.use(errorHandler);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
});

const { Server } = require('socket.io');
const io = new Server({});

let onlineUsers: any = [];
io.on('connection', (socket: any) => {
  console.log('new conect', socket.id);
  socket.on('addNewUsers', (userId: any) => {
    !onlineUsers.some((user: any) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });
    io.emit('getOnlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(
      (user: any) => user.socketId !== socket.id
    );
    io.emit('getOnlineUsers', onlineUsers);
  });

  socket.on('sendMessage', (message: any) => {
    const user = onlineUsers.find(
      (user: any) => user.userId === message.recipientId
    );
    if (user) {
      console.log('user.socketId', user.socketId);

      io.to(user.socketId).emit('getMessage', message);
    }
  });
});
io.listen(3001);
