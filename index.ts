import dotenv from 'dotenv';
dotenv.config();

import connectDB  from './configs/db';
connectDB()

import express from 'express';
import cors from 'cors';
import User from './models/users.model';


const app = express();


app.use(cors())
app.use(express.json())
app.get('/get', (req,res)=>{res.json('okela')})

app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const createUser = await User.create({
        name,
        email,
        password,
      });
      //jwt.sign({ userId: createUser._id }, process.env.APP_SECRET!)
  
      res
        
        .status(201)
        .json({
          id: createUser._id,
          name,
          email,
        });
      // res.status(200).json({
      //   status: "ok",
      //   data: createUser,
      // });
    } catch (error) {
      res.json(error);
    }
  });
const port = process.env.APP_PORT
 
app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})