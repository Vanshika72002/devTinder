const express = require("express");
const validation=require("../../utils/validation");
const router=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/User");
const validator=require("validator");
const jwt=require("jsonwebtoken");

router.post("/signup",async(req,res)=>{
    const {email,password,firstName,lastName,skills,about,age,gender}=req.body;
    const data=req.body;
    
    try{
        //validate user
        validation.validateSignupData(req);
        //check if user with the email id already exists
        
        const user=await User.userModel.findOne({email});
        console.log(user);

        if(user){
            throw new Error("user with the email id already exists");
        }
        //encrypt the password
        const hash=await bcrypt.hash(password,10);
        //create instance of model 
        const newUser=new User.userModel({email,firstName,age,gender,lastName,skills,password:hash});

        //save the user to database
        await newUser.save();

        //response to client
        res.send("user registered successfully ");
    }catch(err){
        //error ,if any
        res.status(400).send("could not register the user : " + err.message);
    }
})

router.get("/login",async(req,res)=>{
    console.log("inside path /login ")
    const {email,password}=req.body;
    if(!validator.isEmail(email))
        res.status(400).send("please enter a valid email");
    else{
        User.userModel.findOne({email}).then((doc)=>{
            if(doc){
                bcrypt.compare(password,doc.password,(err,isMatch)=>{
                    if(isMatch){
                        console.log(doc._id);
                        const token=jwt.sign(
                            {
                                _id:doc._id
                            },"SeCrETKee"
                        )
                        console.log("token=",token);
                        res.cookie("token",token);
                        res.send("user logged in successfully");
                    }else{
                        res.status(400).send("please enter valid credentials");
                    }      
                })
            }else{
                res.status(400).send("user not found");
            }
        }).catch(err=>res.status(400).send("login failed"));
    }
})

router.post("/logout",async(req,res)=>{
    const token=req.cookies;
    console.log(token);
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("user logged out successfully");

})

module.exports=router;