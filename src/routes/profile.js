const express=require("express");
const router=express.Router();
const userAuth=require("../../utils/middlewares/userAuth");
const User=require("../models/User");
const validator=require("validator");
const bcrypt=require("bcrypt");

router.get("/profile/view",userAuth,async(req,res)=>{

    try{
        res.status(200).send(req.user);
    }catch(err){
        res.status(400).send("Error:" + err);
    }

    
})

//edit profile
router.patch("/profile/edit",userAuth,async(req,res)=>{
    // console.log("received ",req.body," at backend");
    //authenticated user must only be able to edit the profile
    //only certain fields are editable(age,skills,photoUrl,firstname,lastname)
    const {age,skills,photoUrl,firstName,lastName}=req.body;
    //validate new data - done by setting runValidators:true
    //find and update the record
    try{
        const oldData=await User.userModel.findByIdAndUpdate(req.user._id,{age,skills,photoUrl,firstName,lastName},{runValidators:true});
        const updatedData=await User.userModel.findByIdAndUpdate(req.user._id,{age,skills,photoUrl,firstName,lastName},{runValidators:true,new:true});
        const user=await User.userModel.findById(req.user._id)
        // console.log(user);
        res.status(200).send(updatedData);
    }catch(err){
        res.status(400).send(err.message);
    }
    
})

//update password
router.patch("/profile/edit/password",userAuth,async(req,res)=>{
    //authenticated user            ✔ w/ userAuth middleware
    try{
        //new password==confirm password
        const {newPassword,confirmPassword}=req.body;
        if(newPassword!=confirmPassword)
            throw new Error("newPassword and confirmPassword fields values should match");
        
        //is Password strong 
        if(!validator.isStrongPassword(newPassword))
            throw new Error("password should be strong!!couldn't update password")
        
        //update
        const loggedInUser=await User.userModel.findById(req.user._id);
        const hash=await bcrypt.hash(newPassword,10);
        loggedInUser["password"]=hash;
        loggedInUser.save();

        //send success response
        res.status(200).send("successfully updated password")
    }catch(err){
        res.status(400).send(err.message);
    }
    


})

module.exports=router;