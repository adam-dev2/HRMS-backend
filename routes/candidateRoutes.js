const express = require('express');
const Authentication = require('../middleware/Authentication');
const {createCandidate, EditCandidate, deleteCandidate, getAllCandidates} = require('../controllers/candidateController');
const router = express.Router();

router.post('/',Authentication,getAllCandidates);
router.post('/create',Authentication,createCandidate);
router.put('/edit/:id',Authentication,EditCandidate);
router.delete('/delete/:id',Authentication,deleteCandidate);

module.exports = router;