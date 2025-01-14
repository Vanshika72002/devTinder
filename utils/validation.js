const validator=require("validator");
function validateSignupData(req){

    console.log("custom validator");
    const {email,password,firstName,lastName}=req.body;
    if(!email || !password ||!validator.isEmail(email)){
        throw new Error("invalid credentials");
    }if(!firstName||!lastName){
        throw new Error("Please enter a valid name");
    }
}
module.exports={validateSignupData};