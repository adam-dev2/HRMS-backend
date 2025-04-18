const express = require('express');
const router = express.Router();
const {createCandidate, EditCandidate, deleteCandidate} = require('../controllers/candidateController');
const Authentication = require('../middleware/Authentication');

router.post('/create',Authentication,createCandidate);
router.put('/edit',Authentication,EditCandidate);
router.delete('/delete',Authentication,deleteCandidate);

module.exports = router;