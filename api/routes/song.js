    const express = require('express');
    const router = express.Router();

    const songService = require('../services/songService');
    const apiSecurity = require('../middleware/apiSecurity');

    router.post('/add', apiSecurity.requireLogin, songService.add);
    router.get('/all', songService.getAll);
    router.get('/all2', apiSecurity.requireAdmin, songService.getAll2); // Admin only
    router.get('/user-songs', apiSecurity.requireLogin, songService.getUserSongs);
    router.get('/title', songService.getTitles);
    router.get('/:id', songService.getOne);
    router.put('/:id/update', apiSecurity.requireAdmin, songService.updateStatus) // Admin only
    router.delete('/:id/delete', apiSecurity.requireAdmin, songService.deleteSong); // Admin only
    

    module.exports = router;