require('../src/db/mongoose.js')

const user=require('../src/models/users.js')

const update_age_and_count=async(id,age)=>{
    const dum=await user.findByIdAndUpdate(id,{age})
    const count=await user.countDocuments({age:2})
    return count
}

update_age_and_count('64f236f1723ffd47aed8643e',2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)  
})