const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },
    data:{
        type:Date,
    },
    reason: String,
    designation: String,
    documents: String,
    status:{
        type:String,
        enum: ['Pending','Approve','Reject'],
        default:'Pending'
    }
},{timestamps:true})

module.exports = mongoose.model("Leave",leaveSchema);