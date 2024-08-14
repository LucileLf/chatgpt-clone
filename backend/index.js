//HERE WE RUN THE EXPRESS SERVER
import express from "express"
import cors from "cors"
import ImageKit from "imagekit"
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

dotenv.config();

console.log("hi from backend")

const port = process.env.PORT || 3000;
const app = express();

// console.log("publicKey", process.env.IMAGE_KIT_ENDPOINT);
// console.log("urlEndpoint", process.env.IMAGE_KIT_PUBLIC_KEY);
// console.log("privateKey", process.env.IMAGE_KIT_PRIVATE_KEY);

// MIDDLEWARES
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
//

const connect = async ()=>{
  try {
    await mongoose.connect(process.env.MONGO)
    console.log("connected to mongoDB");
  }catch(err){
    console.log(err);
  }
}


const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

// ENDPOINTS
app.get("/test", (req, res)=>{
  res.send("it works!")
})

app.get("/api/upload", (req, res)=>{
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
  // res.send("it works!")
})

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res)=>{
//   const userId = req.auth.userId;
//   console.log("userId", userId);
//   res.send("success!");
//   // res.send("it works!")
// })



app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res)=>{
  const userId = req.auth.userId;
  const {text} = req.body;
  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId,
      history:[{role:"user", parts:[{text}]}]
    })
    const savedChat = await newChat.save()

    // CHECK IF USERCHATS EXIST
    const userChats = await UserChats.find({userId})
    // IF USERCHATS DOESNT EXIST...
    if (!userChats.length) {
      // CREATE USERCHATS AND PASS CHAT TO CHATS ARRAY
      console.log("found NO userchats");
      const newUserChats = new UserChats({
        userId,
        chats:[
          {
            _id:savedChat._id,
            title: text.substring(0, 40)
          }
        ]
      })
      await newUserChats.save()
    } else {
    // IF USERCHATS EXIST, PUSH CHAT TO EXISTING ARRAY
    console.log("found SOME userchats");

      await UserChats.updateOne({userId}, {
        $push:{
          chats:{
            _id:savedChat._id,
            title: text.substring(0, 40)
          }
        }
      })
      res.status(201).send(newChat._id) // returning new chat id
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating")
  }
  // res.send("it works!")
})

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res)=>{
  const userId=req.auth.userId;
  try{
    const userChats = await UserChats.find({userId}) // userId: userId
    console.log("first chat",userChats[0].chats)
    res.status(200).send(userChats[0].chats)
  } catch(err) {
    console.log(err);
    res.status(500).send("Error fetching userchat!")
  }
})

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res)=>{
  const userId=req.auth.userId;
  try{
    const chat = await Chat.findOne({ _id: req.params.id, userId}) // userId: userId
    res.status(200).send(chat)
  } catch(err) {
    console.log(err);
    res.status(500).send("Error fetching  chat!")
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!")
})

app.listen(port, ()=> {
  connect()
  console.log(`server running on ${port}`);
})
