const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authMiddleware = require('../middleware/auth');

router.get('/all', userService.getAll);
router.post('/add', userService.add);
router.get('/:id', userService.getOne);
router.post('/login', userService.login);
router.get('/profile', authMiddleware, userService.getProfile); // Add this protected route

module.exports = router;