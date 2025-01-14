const express=require('express');
const app=express();
const validation=require("../utils/validation");


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

// signup a user

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const data=req.body;
    
    try{
        //validate user
        validation.validateSignupData(req);
        //encrypt the password
        
        //create instance of model 
        const newUser=new User.userModel(data);

        //save the user to database
        await newUser.save();

        //response to client
        res.send("user registered successfully ");
    }catch(err){
        //error ,if any
        res.status(400).send("could not register the user : " + err.message);
    }
})


//get a user




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








