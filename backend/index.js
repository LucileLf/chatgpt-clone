//HERE WE RUN THE EXPRESS SERVER
import express from "express"
import cors from "cors"
import ImageKit from "imagekit"
import dotenv from 'dotenv';

dotenv.config();

console.log("hi from backend")

const port = process.env.PORT || 3000;
const app = express();

// console.log("publicKey", process.env.IMAGE_KIT_ENDPOINT);
// console.log("urlEndpoint", process.env.IMAGE_KIT_PUBLIC_KEY);
// console.log("privateKey", process.env.IMAGE_KIT_PRIVATE_KEY);

app.use(cors({
  origin: process.env.CLIENT_URL,
}))

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

app.listen(port, ()=> {
  console.log(`server running on ${port}`);
})
