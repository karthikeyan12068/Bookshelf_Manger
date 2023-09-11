const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        validate(data){
            if(data<0){
                throw new Error('Agemust be positive')
            }
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(data){
            if(!validator.isEmail(data)){
                throw new Error('Bad email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(data){
            if(data.length<5){
                throw new Error('Less length')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//Hiding private data
UserSchema.methods.getPublicProfile=function(){
    const curuser=this
    const userObject=curuser.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
//This is directly searching the static mongoose model so we give statics
UserSchema.statics.findByCredentials=async (email,password)=>{
    const curuser=await User.findOne({email})
    if(!curuser){
        throw new Error('Unable to login')
    }
    const ismatch=await bcrypt.compare(password,curuser.password)
    if(!ismatch){
        throw new Error('Unable to login')
    }
    return curuser
}

//when menthods is used it is for the user so user variable has the method geneerateauth token
UserSchema.methods.generateAuthToken=async function(){
    const curuser=this
    const token=jwt.sign({_id:curuser._id.toString()},'karthik',{ expiresIn: '1h' })
    //console.log(token)
    curuser.tokens=curuser.tokens.concat({token})
    await curuser.save()
    return token
}

UserSchema.pre('save',async function(next){
    const curuser=this
    //console.log('success')

    //modify password
    if(curuser.isModified('password')){
        curuser.password=await bcrypt.hash(curuser.password,8)
    }
    next()
})
const User=mongoose.model('user',UserSchema)

module.exports=User