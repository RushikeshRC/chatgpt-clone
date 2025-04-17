import express from "express"
import path from "path"
import cors from "cors"
import ImageKit from "imagekit";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL
}));

app.use(express.json())

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("connected to Mongodb");
    } catch (error) {
        console.log(error)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
  });

app.get("/api/upload", (req, res)=>{
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post("/api/chats", async (req, res)=>{
    const {userId, text} = req.body;

    try {
        // CREATE A NEW CHAT
        const newChat = new Chat({
            userId: userId,
            history:[{role:"user", parts:[{text}] }],
        });

        //IF WE CREATED CHATS BEFORE WE ARE GOING TO PUSH IT IN CHATS ARRAY
        const savedChat = await newChat.save();

        //IF WE HAVEN'T WE ARE GOING TO CREATE USERCHAT, THEN WE ARE GOING TO PASS IT TO CHAT

        //CHECK IF THE USERCHATS EXISTS
        const userChats = await UserChats.find({ userId : userId});

        // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats:[
                    {
                        _id: savedChat._id,
                        title: text.substring(0,40)
                    },
                ],
            });            
            await newUserChats.save();
        }else{
            // IF EXISTS, PUSH THE CHATS TO THE EXISTING ARRAY
            await UserChats.updateOne({userId: userId},{
                //push into chats array of userchats.js file
                $push:{
                    chats:{
                        _id:savedChat._id,
                        title:text.substring(0,40),
                    },
                },
            });

            //it's because when we start chatting it should be redirected to dashboard chats and we need id for that
            res.status(201).send(newChat._id);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Error creating chat..");
    }
});

app.listen(port,()=>{
    connect()
    console.log("server running on 3000");
});