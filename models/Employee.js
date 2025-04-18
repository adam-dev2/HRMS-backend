const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    fullname: String,
    phonenumber:String,
    position: {
        type:String,
        enum:['Intern','FullTime','Junior','Senior','Team Lead'],
        default:'Intern'
    },
    email:String,
    department:String,
    dataOfJoining: {
        type:Date,
        default: Date.now
    },
    attendance: {
        type: String,
        enum: ['Present','Absent'],
        default: 'Absent'
    }
},{timestamps:true})

module.exports = mongoose.model("Employee",employeeSchema);