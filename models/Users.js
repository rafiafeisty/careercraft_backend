const mongoose=require("mongoose")

const loginschema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true}
})
const companyschema=new mongoose.Schema({
    company_name:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
})

const appliedschema=new mongoose.Schema({
    user_name:{type:String,required:true},
    company_name:{type:String,required:true},
    category:{type:String,required:true},
    user_id:{type:String,required:true}
})

const Users=mongoose.model('user',loginschema)
const Company=mongoose.model('Company',companyschema)
const Applied=mongoose.model('Applied',appliedschema)

module.exports={
    Users,
    Company,
    Applied
}