const mongoose=require('mongoose')

const TaskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

TaskSchema.pre('save',async function(next){
    const curtask=this
    next()
})
const tasks=mongoose.model('task',TaskSchema)

module.exports=tasks