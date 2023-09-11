const express=require('express')
const router=new express.Router()
const User=require('../models/users.js')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth.js')


//to get current profile
router.get('/users/me',auth,(req,res)=>{
    res.send(req.user)
})
router.post('/users/create',async (req,res)=>{
    try{
        const user=new User(req.body)
        await user.save()
        const token=await user.generateAuthToken()
        res.status(200).send(user)
    }catch(e){
        console.log(e)
        res.status(404).send(e)
    }
})
// to get users by id using find function of mongoose model

router.get('/users/get/:id',(req,res)=>{
    const _id=req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        return res.send(user)
    }).catch((e)=>{
        
        res.send(e)
    })
})

//loggin in users

router.post('/users/login',async (req,res)=>{
    try{
        
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.status(200).send({user:user.getPublicProfile(),token})
    }
    catch(e){
        res.status(404).send(e)
    }
})

//for logout
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=await req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//for logout all sessions

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(400).send(e)
    }
})
router.patch('/users/update/:id',async (req,res)=>{
    const keys=Object.keys(req.body)
    const valid=['name','email','age','password']
    keys.forEach((key)=>{
        try{
            if(!valid.includes(key)){
                throw new Error('Updating unavailable fields')
            }
        }
        catch(e){
            res.status(404).send(e)
        }
    })
    try{
        const user=await User.findById(req.params.id)
        keys.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            throw new Error('No such task with given id')
        }
        else{
            res.status(200).send(user)
        }
    }catch(e){
        res.status(404).send(e)
    }
})

router.delete('/users/delete/:id',async (req,res)=>{
    
    try{
        console.log(req.params.id)
        const task=await User.findByIdAndDelete(req.params.id)
        console.log(task)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
        
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router