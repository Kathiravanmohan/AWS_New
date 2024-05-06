const express =require('express')
const dotenv = require('dotenv')
const router = express.Router()
const dbName = 'AWS'
const mongodb = require('mongodb')
var cors = require('cors')
const mongoose = require('mongoose')
const {AWS} = require('../Schema/userschema.cjs')
dotenv.config()
router.use(cors())
const {createToken,validate,hashPassword,comparePassword} = require('../auth.cjs')

const MongoUrl=`mongodb+srv://root:root@cluster0.twewtt9.mongodb.net/${dbName}`
mongoose.connect(MongoUrl)

router.get('/',async(req,res)=>{
    res.send(`
    <h2>Available Routes</h2>
    <div>GET /all</div>
    <div>GET /:id</div>
    <div>POST /signup</div>
    <div>POST /signin</div>
    <div>POST /change-password/:id</div>
    `)
})

router.get('/all',validate,async(req,res)=>{
    try{
        let user = await AWS.find()

        res.status(200)
        .send({
            message:"Data fetched sucessfully",user: user || []
        })

        
    }catch (error) { 
        console.log(error)
        res.status(500)
        .send({
            message:"internal server error"
        })
    }
})

router.post('/signup',async (req,res)=>{
    try {
        let user = await AWS.findOne({email:req.body.email})
        if(!user)
        {
            req.body.password = await hashPassword(req.body.password)
            let newUser = await AWS.create(req.body)
            res.status(200).send({message:"User Created Successfully"})
        }
        else
        {
            res.status(400).send({message:`User with ${req.body.email} already exists`})
        }

    } catch (error) {
        res
        .status(500)
        .send({
                message:"Internal Server Error",
                error: error?.message
            })
    }
})

router.post('/signin',async (req,res)=>{
    try {
        let user = await AWS.findOne({email:req.body.email})
        if(user)
        {
            if(await comparePassword(req.body.password,user.password))
            {
                let token = await createToken(user)
                res.status(200).send({
                    message:"Login Successfull",
                   token
                })
            }
            else
            {
                res.status(400).send({message:"Invalid Credentials"})
            }
        }
        else
        {
            res.status(400).send({message:`User with ${req.body.email} does not exists`})
        }

    } catch (error) {
        res
        .status(500)
        .send({
                message:"Internal Server Error",
                error: error?.message
            })
    }
})

router.post('/change-password/:id', async (req,res)=>{
    try {
        let user = await AWS.findById(req.params.id)
        if(user)
        {
            if(await comparePassword(req.body.current_password,user.password))
            {
                user.password = await hashPassword(req.body.new_password)
                user.save()
                res.status(200).send({
                    message:"Password Changed Successfully"
                })
            }
            else
            {
                res.status(400).send({message:"Invalid Current Password"})
            }
        }
        else
        {
            res.status(400).send({message:`User does not exists`})
        }

    } catch (error) {
        res
        .status(500)
        .send({
                message:"Internal Server Error",
                error: error?.message
            })
    }
})

router.get('/:id',validate,async (req,res)=>{
    try {
        let data = await AWS.findById(req.params.id)
        if(data)
        {
            res.status(200).send({
                message:"Data Fetch Successfull",
                data
            })
        }
        else
        {
            res.status(400).send({message:'Invalid Id'})
        }
    } catch (error) {
        console.log(error)
        res
        .status(500)
        .send({
                message:"Internal Server Error"
            })
    }
})



module.exports = router;