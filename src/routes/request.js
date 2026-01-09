

const express=require("express");
const router=express.Router();
const userAuth = require("../../utils/middlewares/userAuth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const { userModel } = require("../models/User");

//send connection request
// path-"/request/send/:status/:touserId"
router.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    

    //handling corner cases
    //1.user may send anything as status 
    const allowedStatus=["interested","ignored"];
    if(!allowedStatus.includes(status)){
        throw new Error("the status is not acceptable status can either be 'interested' or 'ignored'");
    }
    //2.the user must not be able to resend the request to same person and if the request from personA is sent to personB , personB should not be able to send the request to personA
    const existingRequest=await ConnectionRequestModel.findOne({$or:[{$and:[{toUserId:fromUserId},{fromUserId:toUserId}]},{$and:[{toUserId},{fromUserId}]}]})
    if(existingRequest){
        throw new Error("cannot send request.Request already exists!");
    }
    //3.toUserId must be an objectId(check performed by the schema itself ✔)and the obecjt id must not be random it must be present in the db
    const existingUser=await userModel.findOne({_id:toUserId});
    if(!existingUser)
        throw new Error("Can't send request to random object id!")

    //creating an instance of connection Request model
    const newRequest=new ConnectionRequestModel({fromUserId,toUserId,status});

    await newRequest.save();
    
    res.status(200).send("request sent successfully");

    }catch(err){
        res.status(400).send("Request coudn't be sent : "+err);
    }

    
})



//review and accept/reject a request
//path- "/request/review/:status/requestId"
router.post("/request/review/:status/:reqId",userAuth,async(req,res)=>{
    try{
        
        const reqId=req.params.reqId;
        const status=req.params.status;
        const loggedInUserId=req.user._id;
        if(!["accept",'reject'].includes(status))
            throw new Error("status can be 'accept' or 'reject'")
        const request=await ConnectionRequestModel.findOne(
            {
                $and:[
                    {_id:reqId},
                    {status:"interested"},
                    {toUserId:loggedInUserId}
                ]
            }
        );
        // console.log(request);
        if(request)
            request["status"]=status;
        else
            throw new Error("no such request exists.");
        request.save();
    
        res.status(200).send("request "+status+"ed successfully");
    }catch(err){
        res.status(400).send("Err: "+err)
    }
    
})

module.exports=router;
