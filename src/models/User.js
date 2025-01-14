const mongoose=require("mongoose");
// const constants=require("../../utils/constants");
// (async function connect(){
//     mongoose.connect(constants.url);
// })();
const validator=require("validator");
const userSchema=new mongoose.Schema({
    "firstName":{
        type:"string",
        maxLength:50,
        required:true,
        minLength:2
    },
    "lastName":{
        type:"string",
        maxLen:50
    },
    "age":{
        type:"Number",
        min:18
    },
    "gender":{
        type:String,
        enum:["female","male","others"]
    },
    "email":{
        type:String,
        required:true,
        validate(value){
            console.log("Schema validator");
            return validator.isEmail(value);
        },
        unique:true,
        trim:true,
        lowercase:true,
        
    },
    "password":{
        type:String,
        required:true,
        validate(value){
            return validator.isStrongPassword(value);
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
        validate(value){
            return validator.isURL(value);
        }
    },
    skills:{
        type:[String],
        validate(value){
            return value.length<=10;
        }
    },
    about:{
        type:String,
    }
},{timestamps:true})

const userModel=mongoose.model("User",userSchema);

module.exports={userModel};