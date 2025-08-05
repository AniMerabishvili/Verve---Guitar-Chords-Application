const SongModel = require('../models/song');

module.exports = {
    getAll: (req, res) => {
        // Only return approved songs for public viewing
        SongModel.find({ status: 1 })
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    },
    getAll2: (req, res) => {
        // Get pending songs for admin review
        SongModel.find({ status: 0 })
            .populate('uploadedBy', 'userName firstName lastName')
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    },
    getTitles: (req, res) => {
        // Only return approved songs for public viewing
        SongModel.find({ status: 1 }, 'title')
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    },
    getOne: async (req, res) => {
        try {
            const item = await SongModel.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: "Song not found" });
            }
            res.json(item);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    add: async (req, res) => {
        console.log('🎵 ===== SONG UPLOAD DEBUG =====');
        console.log('🎵 SongService.add called');
        console.log('🎵 Request body:', req.body);
        console.log('🎵 User from middleware:', req.user);
        console.log('🎵 User role:', req.user.role);
        
        try {
            const { title, lyrics } = req.body;
            
            // Create song with user information and pending status
            const songData = { 
                title, 
                lyrics,
                status: 0, // Pending status - IMPORTANT!
                uploadedBy: req.user._id,
                uploadedByUsername: req.user.userName
            };
            
            console.log('🎵 Song data before creating model:', songData);
            
            const newSong = new SongModel(songData);
            console.log('🎵 New song object before save:', newSong.toObject());
            console.log('🎵 Status before save:', newSong.status);
            
            const savedItem = await newSong.save();
            console.log('🎵 Song saved successfully with status:', savedItem.status);
            console.log('🎵 Full saved song:', savedItem.toObject());
            
            // Double-check the saved status
            const verifySong = await SongModel.findById(savedItem._id);
            console.log('🎵 Verified song status from database:', verifySong.status);
            
            res.json(savedItem);

        } catch (error) {
            console.log('🎵 Error saving song:', error);
            res.status(500).json(error);
        }
    },
    getUserSongs: async (req, res) => {
        try {
            const userId = req.user._id;
            const songs = await SongModel.find({ uploadedBy: userId })
                .sort({ createdAt: -1 }); // Most recent first
            res.json(songs);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getStatus: async (req, res) => {
        try {
            const status = req.body.status;
            res.json(status);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const song = await SongModel.findByIdAndUpdate(id, { status }, { new: true });
            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }
            res.json(song);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteSong: async (req, res) => {
        try {
            await SongModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}