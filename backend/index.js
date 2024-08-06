//HERE WE RUN THE EXPRESS SERVER
import express from "express"
import cors from "cors"
import ImageKit from "imagekit"
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";

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

app.post("/api/chats", async (req, res)=>{
  const {userId, text} = req.body;
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
      res.status(201).send(newChat._id)
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating")
  }
  // res.send("it works!")
})

app.listen(port, ()=> {
  connect()
  console.log(`server running on ${port}`);
})
