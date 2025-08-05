    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
    }, {
        collection: 'users',
        timestamps: true,
        read: 'nearest',
        writeConcern: {
            w: 'majority',
            j: true,
            wtimeoutMS: 30000
        }
    });

    const User = mongoose.model('User', userSchema);
    module.exports = User;