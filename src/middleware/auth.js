const jwt=require('jsonwebtoken')
const User=require('../models/users.js')

const auth=async(req,res,next)=>{
    try{
        //we gave header in postman use it with header method
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,'karthik')
        const user=await User.findOne({'_id':decoded._id,'tokens.token':token})
        if(!user){
            throw new Error('Notfound')
        }
        req.user=user
        req.token=token
        next()
    }catch(e){
        console.log(e)
        res.status(400).send({"error":e})
    }
}

module.exports=auth