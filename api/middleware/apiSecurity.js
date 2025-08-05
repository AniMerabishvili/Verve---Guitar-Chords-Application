require('dotenv').config();
const jwt = require('jsonwebtoken');

// Force reading from .env - throw error if not found
if (!process.env.SECRET_KEY) {
    console.error('❌ FATAL: SECRET_KEY not found in .env file!');
    process.exit(1);
}

const SECRET_KEY = process.env.SECRET_KEY;
console.log('✅ Using SECRET_KEY from .env file');

module.exports = {
    requireLogin: (req, res, next) => {
        console.log('🔒 MIDDLEWARE CALLED - URL:', req.url);
        console.log('🔒 MIDDLEWARE CALLED - METHOD:', req.method);
        
        console.log('=== API Security Middleware Debug ===');
        console.log('Request URL:', req.url);
        console.log('Request method:', req.method);
        console.log('All headers:', req.headers);
        
        // Check if authorization header exists
        if (!req.headers.authorization) {
            console.log('❌ No authorization header found');
            return res.status(401).json({ message: 'No authorization header' });
        }

        // Extract token from Bearer format
        const authHeader = req.headers.authorization;
        console.log('🔑 Authorization header:', authHeader);
        
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        console.log('🔍 Extracted token:', token);

        if (!token) {
            console.log('❌ No token provided in authorization header');
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log('🔐 Secret key being used:', SECRET_KEY);
        console.log('🔍 Attempting to verify token...');
        
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('❌ JWT verification error:', err.message);
                console.log('❌ Error name:', err.name);
                return res.status(401).json({ message: 'invalid_session' });
            }
            console.log('✅ Token verified successfully!');
            console.log('👤 Decoded user:', decoded);
            req.user = decoded;
            next();
        });
    },

    requireAdmin: (req, res, next) => {
        // First check if user is logged in
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'invalid_session' });
            }
            
            // Check if user is admin
            if (!decoded.role || decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            
            req.user = decoded;
            next();
        });
    }
}