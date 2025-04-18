const Employee = require('../models/Employee');

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
const isValidPhone = (phone) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s|[-()]/g, ""));
};

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