const ChordModel = require('../models/chords');
module.exports = { 
    getAll: (req, res) => {
        ChordModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    },
    add: async (req, res) => {
        try {
            const savedItem = await new ChordModel(req.body).save();
            res.json(savedItem);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}