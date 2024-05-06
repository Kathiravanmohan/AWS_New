const mongoose = require('mongoose')

function validateEmail(e){      
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(e); 
  } 
function validateMobile(e){
    let result = true;
    for(let i = 0;i<e.length;i++)
    {
        if(Number(e[i])==e[i])
        {
            continue;
        }
        else
        {
            result = false
            break;
        }
    }
    return result
}

let UserSchema = new mongoose.Schema({
    First_name:{type:String, required:true},
    Last_name:{type:String, required:true},
    email:{type:String, required:true,validate:{validator:validateEmail,message:"Invalid Email"}},
    password:{type:String,required:true},
    status:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now()}
},{collection:'AWS_users',versionKey:false})

let AWS = mongoose.model('AWS_users',UserSchema)

module.exports = {AWS}