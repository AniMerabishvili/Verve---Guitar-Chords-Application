const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

module.exports = { 
    getAll: (req, res) => {
        UserModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    },
    // add: async (req, res) => {
    //     try {
    //         const savedItem = await new UserModel(req.body).save();
    //         res.json(savedItem);
            

    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // },
    add: async (req, res) => {
        const { firstName, lastName, userName, email, password } = req.body;

        try {
            let role = 'customer'; // Default role

            if (email === 'admin@gmail.com' && password === 'admin1') {
                role = 'admin';
            }

            if (!req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.email || !req.body.password)
            {
                return res.status(400).json({
                    message: 'missed_required_fields'
                });
            }

            const emailExists = await UserModel.findOne({
                email: req.body.email
            });
            const userNameExists = await UserModel.findOne({
                userName: req.body.userName
            });

            if(emailExists) {
                return res.status(409).json({
                    message: 'User already exists'
                })
            }
            if(userNameExists) {
                return res.status(409).json({
                    message: 'User already exists'
                })
            }

            const hashPassword = bcrypt.hashSync(req.body.password, 10);
            const newUser = new UserModel({
                firstName,
                lastName,
                userName,
                email,
                password: hashPassword,
                role // Assigning role during registration
            });

            const savedUser = await newUser.save();
            
            // Generate JWT token for the new user
            const token = jwt.sign({
                _id: savedUser._id,      // Changed from 'id' to '_id'
                userName: savedUser.userName,  // Added userName field
                email: savedUser.email,
                role: savedUser.role
            }, process.env.SECRET_KEY || 'your-secret-key');

            res.json({ 
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: savedUser._id,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    userName: savedUser.userName,
                    email: savedUser.email,
                    role: savedUser.role
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
   
    //     const { firstName, lastName, userName, email, password } = req.body;

    //     try {
    //         let role = 'customer'; // Default role

    //         if (email === 'admin@gmail.com' && password === 'admin1') {
    //             role = 'admin';
    //         }

            // if (!req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.email || !req.body.password)
            // {
            //     return res.status(400).json({
            //         message: 'missed_required_fields'
            //     });
            // }

            // const emailExists = await UserModel.findOne({
            //     email: req.body.email
            // });
            // const userName = await UserModel.findOne({
            //     userName: req.body.userName
            // });

            // if(emailExists) {
            //     return res.status(409).json({
            //         message: 'User already exists'
            //     })
            // }
            // if(userName) {
            //     return res.status(409).json({
            //         message: 'User already exists'
            //     })
            // }
            // const hashPassword = bcrypt.hashSync(req.body.password, 10);

            // const newUser = await new UserModel({
            //     firstName,
            //     lastName,
            //     userName,
            //     email,
            //     password: hashPassword,
            //     role // Assigning role during registration
            // });
            // const savedUser = await newUser.save();
            // res.json(savedUser);
            // const token = jwt.sign({
            //     id: savedUser._id,
            //     email: savedUser.email
            // }, process.env.SECRET_KEY);

            // res.json({ token });

    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // },
    getOne: async (req, res) => {
        try {
            const item = await UserModel.findById(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    
    // login: async (req, res) => {
    //     const { email, password } = req.body;
    //     try {
    //         const user = await UserModel.findOne({  email: req.body.email });

    //         if (!user) {
    //             return res.status(401).json({ message: 'Authentication failed. User not found.' });
    //         }

    //         if (bcrypt.compareSync(req.body.password, user.password)) {
    //             const token = jwt.sign({
    //                 id: user_id,
    //                 email: user.email
    //             }, process.env.SECRET_KEY);
    //             res.json({ token });
    //         }
    //         else {
    //             return res.status(401).json ({
    //                 message: 'invalid_credintials'
    //             });
    //         }

    //         let role = 'customer'; // Default role

    //         if (user.email === 'admin@gmail.com' && user.password === 'admin1') {
    //             role = 'admin';
    //         }

    //         res.json({ user, role }); // Send user object and role back to the client
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
    login: async (req, res) => {
        const { email, password } = req.body;
        
        try {
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ 
                    message: 'Email and password are required' 
                });
            }

            // Find user by email
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(401).json({ 
                    message: 'Authentication failed. User not found.' 
                });
            }

            // Verify password
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Determine user role
            let role = user.role || 'customer'; // Use role from database or default to customer

            // Debug: Check secret key
            const secretKey = process.env.SECRET_KEY || 'your-secret-key';
            console.log(' Login - Secret key being used:', secretKey);
            console.log('🔐 Login - process.env.SECRET_KEY:', process.env.SECRET_KEY);

            // Generate JWT token
            const token = jwt.sign({
                _id: user._id,        // Changed from 'id' to '_id'
                userName: user.userName,  // Added userName field
                email: user.email,
                role: role
            }, secretKey);

            console.log('🔑 Login - Generated token:', token);

            // Return success response
            return res.json({ 
                success: true,
                message: 'Login successful',
                token, 
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                    role: role
                }, 
                role 
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ 
                message: 'Internal Server Error', 
                error: error.message 
            });
        }
    },
    
    // Add this new profile method
    getProfile: async (req, res) => {
        try {
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({
                success: true,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}