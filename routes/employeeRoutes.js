const express = require('express');
const Authentication = require('../middleware/Authentication');
const { createEmployee, editEmployee, deleteEmployee, markAttendance, getAllEmployees } = require('../controllers/employeeController');
const router = express.Router();

router.post('/',Authentication,getAllEmployees);
router.post('/create',Authentication,createEmployee);
router.put('/edit/:id',Authentication,editEmployee);
router.delete('/delete/:id',Authentication,deleteEmployee);

router.post('/attendance',Authentication,markAttendance);

module.exports = router;