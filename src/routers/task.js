const express=require('express')
const router=new express.Router()
const Task=require('../models/tasks.js')

router.post('/tasks/create',(req,res)=>{
    const task=new Task(req.body)
    task.save().then(()=>{
        res.status(200).send(task)
    }).catch((error)=>{
        res.status(404).send(error)
    })
})

router.patch('/tasks/update/:id',async (req,res)=>{
    const keys=Object.keys(req.body)
    console.log(req.body)
    const valid=['description','completed']
    keys.forEach((key)=>{
        try{
            if(!valid.includes(key)){
                throw new Error('Updating unavailable fields')
            }
        }
        catch(e){
            res.send(e)
        }
    })
    try{
        console.log(req.params.id)
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        console.log(task)
        if(!task){
            throw new Error('No such task with given id')
        }
        else{
            res.send(task)
        }
    }catch(e){
        res.send(e)
    }
})

router.delete('/tasks/delete/:id',async (req,res)=>{
    
    try{
        console.log(req.params.id)
        const task=await Task.findByIdAndDelete(req.params.id)
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