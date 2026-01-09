const ConnectionRequestModel = require("../models/ConnectionRequest")
const userAuth = require("../../utils/middlewares/userAuth")
const express = require("express");
const router = express.Router();
const { userModel } = require("../models/User");
//review pending connection requests
//path- "/request/pending/" 
router.get("/view/request/pending", userAuth, async (req, res) => {
    const pendingRequests = await ConnectionRequestModel.find({
        $and: [
            { toUserId: req.user._id },
            { status: "interested" }
        ]

    });
    // console.log(typeof(pendingRequests));
    const pendingRequestUsersNames = [];
    try {
        if (pendingRequests.length) {
            pendingRequests.forEach(async function (req) {
                console.log(req.fromUserId);
                const userName = await userModel.findOne({ _id: req.fromUserId });
                pendingRequestUsersNames.push(userName.firstName + " " + userName.lastName);
                res.status(200).send(pendingRequests);
            })
        } else {
            throw new Error("No pending requests");
        }
    }
    catch (err) {
        console.log("encountered an error:", err);
        res.status(200).send("No pending requests");
    }

})

//connections
//connection of userA=>userA is either sender or receiver of request and status is accepted
router.get("/view/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({ $and: [{ $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }] }, { status: "accept" }] }).populate("fromUserId","firstName lastName age gender skills about photoUrl")
    console.log(connections);
    if (connections)
        res.status(200).send(connections);
    else
        res.status(200).send("NO CONNECTION FOUND");
})

//feed api - show other users on platform which are not connected
router.get("/view/profiles", userAuth, async (req, res) => {
    // console.log("async1");
    const loggedInUserId = req.user._id;
    let userProfiles = []
    const allUsers = await userModel.find({ $nor: [{ _id: loggedInUserId }] }).select("firstName lastName photoUrl")
    for (user of allUsers) {
        // console.log("async 2");
        const connected = await ConnectionRequestModel.findOne({ $or: [{ $and: [{ fromUserId: user._id }, { toUserId: loggedInUserId }] }, { $and: [{ fromUserId: loggedInUserId }, { toUserId: user._id }] }] })
        if (!connected) {
            // console.log("not connected to "+user.firstName);
            userProfiles.push(user);
            // console.log(userProfiles);
        } else {
            // console.log("connected to "+ user.firstName);
        }
    }
    // allUsers.forEach(async function(user){
    //     console.log("async 2");
    //     const connected=await ConnectionRequestModel.findOne({$or:[{$and:[{fromUserId:user._id},{toUserId:loggedInUserId}]},{$and:[{fromUserId:loggedInUserId},{toUserId:user._id}]}]})
    //     if(!connected){
    //         console.log("not connected to "+user.firstName);
    //         userProfiles.push(user.firstName);
    //         console.log(userProfiles);
    //     }else{
    //         console.log("connected to "+ user.firstName);
    //     }

    // }) 
    // console.log(userProfiles);

    if (userProfiles.length > 0)
        res.status(200).send(userProfiles);
    else {

        res.status(200).send("You are connected to everyone on this platform");
        // console.log("\n\n response sent\n\n");
    }// console.log("async 1 ended");
})


module.exports = router;