const express = require('express');
const router = express.Router();
const createHash = require('hash-generator');

const {MongoClient} = require("mongodb");

const client = new MongoClient(process.env.REACT_APP_MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true});

router.get('/rk',(req,res)=>{
    res.json({"id": "JAA MAR JAA BC"})
});

router.post('/sign-in-user',(req,res)=>{
    async function signInUser(){
        try{
            await client.connect()
            const database=client.db("UsersDB")
            const userLoginInfo=req.body
            const collection=database.collection("Users")
            
            
            if(userLoginInfo.email)
            {const userExistsCountEmail=await collection.count({email: userLoginInfo.email,password: userLoginInfo.password},{limit:1})
            if(userExistsCountEmail===1){
                const hash=createHash(16)
                const myQuery={email: userLoginInfo.email}
                const newValues={$set:{token: hash}}
                const result=await collection.updateOne(myQuery,newValues)
                
                return res.json({token:hash,error:''})
            }
            else{
                return res.json({token:'',error:"User doesn't exist!"})
            }
            }
            else if(userLoginInfo.username)   
            {const userExistsCountUsername=await collection.count({username: userLoginInfo.username,password: userLoginInfo.password},{limit:1})
                if(userExistsCountUsername===1){
                    const hash=createHash(16)
                    const myQuery={username: userLoginInfo.username}
                    const newValues={$set:{token: hash}}
                    const result=await collection.updateOne(myQuery,newValues)
                    return res.json({token:hash,error:""})
                }
                else{
                    return res.json({token:'',error:"User doesn't exist!"})
                }
            
            }

        }
        catch(err){
            return res.json({error: err.message,token: ''})
        }
    }
    signInUser()
});

router.post('/sign-up-user',(req,res)=>{
    async function signUpUser(){
        try{
            await client.connect()
            const database=client.db("UsersDB")
            const userLoginInfo=req.body
            const collection=database.collection(`Users`)
            const alreadyExists=await collection.count({email : userLoginInfo.email},{limit:1})
            const alreadyExistsUsername=await collection.count({username : userLoginInfo.username},{limit:1})
            if(alreadyExists===1 || alreadyExistsUsername===1){
                return res.json({error: 'User with this Email/Username Already Exists!',refNo:null})
            }
            const hash=createHash(16)
            const finalUserInfo={...userLoginInfo,
            token:hash}
            const result = await collection.insertOne(finalUserInfo);
            return res.json({refNo: hash, error: null})
        }
        catch(err){
            return res.json({error: err.message, refNo: null})
        }
    }
    signUpUser()
});


module.exports = router;