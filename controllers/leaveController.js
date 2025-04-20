const Leave = require("../models/Leave");
const path = require("path");
const Employee = require('../models/Employee')

exports.getLeaves = async(req,res) => {
    const {employee} = req.params;
    try{
        const Leaves = await Leave.find().populate(employee);
        console.log(Leaves)
        return res.status(200).json({message: "Fetched all Leaves",Leaves})
    }catch(err) {
        return res.status(500).json({message: `Error while fethcing Leaves ${err}`})
    }
}

exports.createLeave = async (req, res) => {
    console.log(req.file);
    try {
      const { employee, date, reason, designation } = req.body;
  
      if (!employee || !date || !reason || !designation) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const emp = await Employee.findById(employee);
      if (!emp || emp.attendance !== "Present") {
        return res.status(400).json({ message: "Only present employees can take leave" });
      }
  
      const documentPath = req.file?.path;
      if (!documentPath) {
        return res.status(400).json({ message: "Leave document is required" });
      }
  
      const leave = new Leave({
        employee,
        date,
        reason,
        designation,
        documents: documentPath
      });
  
      await leave.save();
  
      return res.status(201).json({ message: "Leave Created Successfully", leavedetails: leave });
    } catch (err) {
      console.log("Error creating leave:", err);
      return res.status(500).json({ message: `Creating Leave Failed: ${err.message}` });
    }
  };
  

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApprovedLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Approve" }).populate("employee", "name");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave || !leave.documents) return res.status(404).json({ error: "Document not found" });

    res.download(path.resolve(leave.documents));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchLeaves = async (req, res) => {
  try {
    const { status, date, employeeName } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (date) filter.date = new Date(date);

    if (employeeName) {
      const employees = await Employee.find({ name: new RegExp(employeeName, "i") }).select("_id");
      filter.employee = { $in: employees.map(emp => emp._id) };
    }

    const leaves = await Leave.find(filter).populate("employee", "name");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
