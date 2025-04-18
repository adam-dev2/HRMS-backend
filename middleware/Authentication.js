const jwt = require('jsonwebtoken');
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const Authentication = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: '"Unauthrized Access'});
    }

    const token = authHeader.split(" ")[1];

    try{
        const verification = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(verification.userId).select("-password");
        if(!user) {
            return res.status(401).json({message: '"User not found'});
        }
        req.user = user;
        next();
    }catch(err) {
        return res.status(401).json({message: 'Invalid or Expired token' , error: `${err}`});
    }
};

module.exports = Authentication;