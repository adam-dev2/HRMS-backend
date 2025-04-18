const express = require('express');
const Authentication = require('../middleware/Authentication');
const { createEmployee, editEmployee, deleteEmployee } = require('../controllers/employeeController');
const router = express.Router();

router.post('/create',Authentication,createEmployee);
router.put('/edit/:id',Authentication,editEmployee);
router.delete('/delete/:id',Authentication,deleteEmployee);

module.exports = router;