const express = require("express");
const router = express.Router();
const {getLeaves,createLeave,updateLeaveStatus,getApprovedLeaves,searchLeaves} = require("../controllers/leaveController");
const upload = require("../middleware/upload");

router.get('/', getLeaves);
router.post('/create', upload('uploads/', 'resume'), createLeave); 
router.put("/:id/status", updateLeaveStatus);
router.get("/approved", getApprovedLeaves);
router.get("/search", searchLeaves);

module.exports = router;
