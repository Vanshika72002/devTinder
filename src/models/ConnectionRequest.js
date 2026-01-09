const mongoose=require("mongoose");
const {userModel}=require("./User");
const connectionRequestSchema=mongoose.Schema({
    "fromUserId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    "toUserId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    "status":{
        type:String,
        enum:{
            values:["ignored","accept","reject","interested"],
            message:`{VALUE} is not supported`
        }
    }

},
{timestamps:true});

connectionRequestSchema.pre("save",async function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
        throw new Error("you can't send connection request to yourself");
    next();
})

const ConnectionRequestModel=mongoose.model("connectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;