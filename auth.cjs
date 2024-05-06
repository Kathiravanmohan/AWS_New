const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRound = 10;
const JWT_SK = 'svnsjkvdkvskdssdvfd'

const JWT_EXPIRE = '1h'

let hashPassword = async (password)=>{
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

let comparePassword = async (password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
}


let createToken = async({email, First_name , Last_name})=>{
    try {
        const token = await jwt.sign(
            { email, First_name, Last_name },
            JWT_SK,
            { expiresIn: JWT_EXPIRE }
        );
        console.log(token);
        return token;
    } catch (error) {
        console.error('Error creating token:', error);
        throw new Error('Error creating token');
    }
}
let decodeToken = async (token)=>{//decaoding the jwt
    return jwt.decode(token)
}
let validate = async (req,res,next)=>{//validate if token is not expired
    let token = req?.headers?.authorization?.split(" ")[1]

    if(token)
    {
        let {exp} = await decodeToken(token)
        if((Math.round((+new Date()/1000)))<exp){
    
            next()
        }
        else
            res.status(401).send({message:"Token Expired"})
    }
    else
        res.status(401).send({message:"Token Not Found"})
}



module.exports={createToken,validate,hashPassword,comparePassword}