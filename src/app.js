const express=require('express');
const app=express();
const bcrypt=require("bcrypt");
const validator=require("validator")
const jwt=require("jsonwebtoken")
const cookie_parser=require("cookie-parser");
const authRouter=require("../src/routes/auth");
const profileRouter=require("../src/routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
//connecting to database.
const connectDb=require("../config/database").connnectDB;
connectDb().then(()=>{
    console.log("Connection established successfully");
    app.listen(7777,()=>{
        console.log("server running successfully on port 7777");
    })
}).catch(()=>{
    console.log("error while establishing connection");
})


const User=require("../src/models/User");

app.use(express.json());
app.use(cookie_parser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



//delete a user
app.delete("/deleteById",async (req,res)=>{
    const id=req.body._id;
    console.log(id);
    try{
        await User.userModel.findByIdAndDelete(id);
        res.send("Document deleted successfully");
    }catch{
        res.status(404).send("there was an error while deleting the document with id = "+id);
    }
})

//update a user
app.patch("/user",async(req,res)=>{

    const token=req.cookies.token;
    const object=jwt.verify(token,"SeCrETKee");
    console.log(object);
        const user=await User.userModel.findOne({"_id":object._id}).then((doc)=>
            console.log(doc)
        ).catch(err=>console.log(err))
        
    
    const id=req.body.id;
    const data=req.body;
    const updateAllowedOn=["id","password","lastName","skills","about","photoUrl","age"];
    try{
        if(!Object.keys(data).every((key)=>updateAllowedOn.includes(key))){
            throw new Error("you are not allowed to update your firstName , gender , email");
        }
        await User.userModel.findByIdAndUpdate({_id:id},data);
        res.send("user updated successfully");
    }catch(err){
        res.status(400).send(err.message);  
    }
})


//login a user





