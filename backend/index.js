import express, { application } from "express"
import path from "path"
import cors from "cors"
import ImageKit from "imagekit";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import {clerkMiddleware, requireAuth } from "@clerk/express";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}));

app.use(clerkMiddleware());

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

// app.get("/api/test",requireAuth(), (req,res) =>{
//     const userId = req.auth.userId;  
//     console.log(userId);
//     res.send("success");
// })

app.post("/api/chats",requireAuth(), async (req, res)=>{
    const userId = req.auth.userId;
    const {text} = req.body;

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

app.get("/api/userchats", requireAuth(), async (req,res) =>{
    const userId = req.auth.userId;
    try {
        const userChats = await UserChats.find({userId});
        res.status(200).send(userChats[0].chats);        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching userchats..");
    }
});

app.get("/api/chats/:id", requireAuth(), async (req,res) =>{
    const userId = req.auth.userId;
    try {
        const chat = await Chat.findOne({_id: req.params.id, userId});
        res.status(200).send(chat);        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching chat..");
    }
});

app.put("/api/chats/:id", requireAuth(), async (req,res) =>{
    const userId = req.auth.userId;

    const {question, answer, img} = req.body;

    const newItems = [
        ...(question 
            ? [{role: "user", parts: [{ text: question}], ...(img && {img})}]
            : []),
        {role: "model", parts: [{ text: answer}]},
    ]

    try {        
        const updatedChat = await Chat.updateOne({_id: req.params.id, userId},{
            $push:{
                history:{
                    $each: newItems,
                },
            },
        });
        res.status(200).send(updatedChat);        

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding conversations..");
    }
})

// app.use((err,req,res,next) =>{
//     console.error(err.stack);
//     res.status(401).send('Unauthenticated!');
// });

const legacyRequireAuth = (req, res, next) => {
    if (!req.auth.userId) {
      return next(new Error('Unauthenticated'))
    }
    next()
  }
  app.get('/', legacyRequireAuth)

app.listen(port,()=>{
    connect()
    console.log("server running on 3000");
});