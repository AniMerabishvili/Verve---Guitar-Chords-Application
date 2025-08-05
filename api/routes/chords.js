const express = require('express');
const router = express.Router();

const chordService = require('../services/chordService');

router.get('/all', chordService.getAll);
router.post('/add', chordService.add);

module.exports = router;