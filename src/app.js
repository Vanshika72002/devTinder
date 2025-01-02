const express=require('express');

const app=express();

app.use("/test",(req,res)=>{
    res.send("you requested to localhost:7777/test.")
})
app.listen(7777,()=>{
    console.log("server running successfully on port 7777");
})
app.use((req,res)=>{
    res.send("Hi this is server running on port 7777");
})