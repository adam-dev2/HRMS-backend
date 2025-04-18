const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
const isValidPhone = (phone) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s|[-()]/g, ""));
};


exports.getAllEmployees = async(req,res) => {
    try{
        const Employees = await Employee.find();
        
        return res.status(200).json({message: "Fetched all Employees",Employees})
    }catch(err) {
        return res.status(500).json({message: `Error while fetching all the Employees:; ${err}`});
    }
}

exports.createEmployee = async (req,res)=>{
    const {fullname,phonenumber,position,email,department,dateOfJoining} = req.body;
    if(!fullname || !phonenumber || !department || !email || !position) {
        return res.status(400).json({message: "All fields are required"});
    }
    if(!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid Email"});
    }
    const cleanPhone = phonenumber.replace(/\s|[-()]/g, "");
    if (!isValidPhone(cleanPhone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
    }
    try{
        const findEmployee = await Employee.findOne({email});
        if(findEmployee) {
            return res.status(400).json({message: 'Employee with this email already exisits'});
        }
        const newEmployee = new Employee({fullname,phonenumber,position,email,department,dateOfJoining});
        await newEmployee.save();
        return res.status(200).json({message:"Registered new Employee successfully",employee: newEmployee});
    }catch(err){
        res.status(500).json({message: `Error while creating new Employee : ${err}`})
    }
}

exports.editEmployee = async(req,res)=>{
    const {id} = req.params;
    const {fullname,phonenumber,position,email,department,dateOfJoining} = req.body;
    if(!fullname || !phonenumber || !department || !email || !position) {
        return res.status(400).json({message: "All fields are required"});
    }
    if(!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid Email"});
    }
    const cleanPhone = phonenumber.replace(/\s|[-()]/g, "");
    if (!isValidPhone(cleanPhone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
    }

    try{
        const findEmployee = await Employee.findById(id);
        if(!findEmployee) {
            return res.status(404).json({message: 'User not found'});
        }

        findEmployee.fullname = fullname;
        findEmployee.phonenumber = cleanPhone;
        findEmployee.position = position;
        findEmployee.email = email;
        findEmployee.department = department;
        findEmployee.dateOfJoining = dateOfJoining;

        await findEmployee.save();
        return res.status(200).json({message: 'Employee Updated Sucessfully', updatedEmployee: findEmployee});
    }catch(err){
        return res.status(500).json({message: `Error while editing employee ${err}`});
    }
}

exports.deleteEmployee = async(req,res) => {
    const {id} = req.params;
    try{
        const findEmployee = await Employee.findById(id);
        if(!findEmployee) {
            return res.status(404).json({message: 'User not found'});
        }
        await Employee.findByIdAndDelete(id);
        return res.status(200).json({message: "deleted Employee successfully"});
    }catch(err) {
        res.status(500).json({message: `Error while deleting User ${err}`})
    }
}


exports.markAttendance = async(req,res)=> {
    const {id} = req.params;
    const {attendance} = req.body;
    try{
        const findEmployee = await Employee.findById(id);
        if(!findEmployee) {
            return res.status(404).json({message: 'Employee not Found'});
        }

        findEmployee.attendance = attendance;
        await findEmployee.save();
        return res.status(200).json({message: "Successfully marked attendance"});
    }catch(err) {   
        return res.status(500).json({message: `Error while marking attendance: ${err}`});
    }
}

exports.applyLeave = async(req,res)=>{
    const {id,date,reason,designation,documents,status} = req.body;
    try{
        const newLeave = new Leave({employee,date,reason,designation,documents,status});
        await newLeave.save();
    }catch(err) {
        return res.status(500).json({message: `Error while applying leave ${err}`});
    }
}

exports.updateLeave = async(req,res)=>{
    const id = req.body.employeeid;
    const status = req.body.status;
    try{
        const findEmployee = await Leave.findById(id);
        if(!findEmployee) {
            return res.status(404).json({message: `user not found`});
        }
        findEmployee.status = status;
        await findEmployee.save();
        return res.status(200).json({message: 'Leave updated successfully'});
    }catch(err) {
        return res.status(500).json({message: `Error while Update Leave ${err}`})
    }
}