const { default: mongoose } = require("mongoose");
const constants=require("../utils/constants")
const url=constants.url;
//connecting to database
 const connnectDB=async function(){
    console.log("connecting to database")
    await mongoose.connect(url);
} 
module.exports={connnectDB};
// connnectDB().then(()=>{
//     console.log("Connection established successfully");
// }).catch(()=>{
//     console.log("error while establishing connection");  
// })