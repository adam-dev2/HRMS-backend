const Candidate = require('../models/Candidate')

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
const isValidPhone = (phone) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s|[-()]/g, ""));
};
  
exports.getAllCandidates = async(req,res) => {
    try{
        const Candidates = await Candidate.find();
        console.log(Candidates)
        return res.status(200).json({message: "Fetched all Candidates",Candidates})
    }catch(err) {
        console.log(err)
        return res.status(500).json({message: `Error while fetching all the candidates:; ${err}`});
    }
}

exports.createCandidate = async (req,res)=>{
    const {fullname,phonenumber,experience,email,position,resume,status} = req.body;
    console.log(fullname,phonenumber,experience,email,position,resume,status)
    if(!fullname || !phonenumber || !experience || !email || !position) {
        return res.status(400).json({message: "All fields are required"});
    }
    const resumePath = req.file?.path;
    if(!resumePath) {
        return res.status(400).json({message:'Resume file is required'});
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
        const newCandidate = new Candidate({fullname,phonenumber,experience,email,position,resume: resumePath.replace(/\\/g, '/'),status});
        await newCandidate.save();
        return res.status(201).json({message: "Candidate Created Successfully", userdetails: newCandidate});
    }catch(err){
        return res.status(500).json({message:`Creating Candidate Failed: ${err}`});
    }
}

exports.EditCandidate = async (req, res) => {
    const { id } = req.params;
    const { fullname, phonenumber, experience, email, position, status } = req.body;
    const resumePath = req.file?.path;
  
    try {
      const existingCandidate = await Candidate.findById(id);
      if (!existingCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
  
      if (fullname) existingCandidate.fullname = fullname;
      if (phonenumber) {
        const cleanPhone = phonenumber.replace(/\s|[-()]/g, "");
        if (!isValidPhone(cleanPhone)) {
          return res.status(400).json({ message: "Invalid phone number format" });
        }
        existingCandidate.phonenumber = cleanPhone;
      }
      if (experience) existingCandidate.experience = experience;
      if (email) {
        if (!isValidEmail(email)) {
          return res.status(400).json({ message: "Invalid Email" });
        }
        existingCandidate.email = email;
      }
      if (position) existingCandidate.position = position;
      if (status) existingCandidate.status = status;
      if (resumePath) existingCandidate.resume = resumePath.replace(/\\/g, '/');
  
      await existingCandidate.save();
      return res.status(200).json({ message: "Updated Candidate information" });
    } catch (err) {
      return res.status(500).json({ message: `Server Error: ${err}` });
    }
  };
    


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