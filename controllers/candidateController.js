const Candidate = require('../models/Candidate')

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
const isValidPhone = (phone) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s|[-()]/g, ""));
};
  
exports.createCandidate = async (req,res)=>{
    const {fullname,phonenumber,experience,email,position,resume,status} = req.body;
    if(!fullname || !phonenumber || !experience || !email || !position || !resume ) {
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
        const findCandidate = await Candidate.findOne({email});
        if(findCandidate) {
            return res.status(400).json({message: "Candidate with this Email already Exists"});
        }
        const newCandidate = new Candidate({fullname,phonenumber,experience,email,position,resume,status});
        await newCandidate.save();
        return res.status(201).json({message: "Candidate Created Successfully", userdetails: newCandidate});
    }catch(err){
        return res.status(500).json({message:`Creating Candidate Failed: ${err}`});
    }
}

exports.EditCandidate = async(req,res)=>{
    const {id} = req.params;
    const {fullname,phonenumber,experience,email,position,resume,status} = req.body;
    if(!fullname || !phonenumber || !experience || !email || !position || !resume ) {
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
        const existingCandidate = await Candidate.findById(id);
        if(!existingCandidate) {
            return res.status(404).json({message: "Candidate not found"});
        }
        existingCandidate.fullname = fullname;
        existingCandidate.phonenumber = cleanPhone;
        existingCandidate.experience = experience;
        existingCandidate.email = email;
        existingCandidate.resume = resume;
        existingCandidate.status = status;

        await existingCandidate.save();
        return res.status(200).json({message: "Updated Candidate information"});
    }catch(err) {
        return res.status(500).json({message: `Server Error: ${err}`});
    }
}   


exports.deleteCandidate = async (req,res)=>{
    const {id} = req.params;
    try{
        const findCandidate = await Candidate.findById(id);
        if(!findCandidate) {
            return res.status(404).json({message: "Candidate not found"});
        }
        
        await Candidate.findByIdAndDelete(id);

        return res.status(200).json({message: "Candidate Deleted Successfully"});

    }catch(err) {   
        res.status(500).json({message: `Internal Server Error: ${err}`});
    }
}