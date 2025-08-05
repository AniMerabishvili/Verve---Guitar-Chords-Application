const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GuitarChords')
  .then(() => {
    console.log('Connected to MongoDB');
    return testLogin();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

async function testLogin() {
  try {
    // Test login with seeded users
    const testUsers = [
      { email: 'john@example.com', password: 'password123' },
      { email: 'jane@example.com', password: 'password123' }
    ];

    for (const testUser of testUsers) {
      console.log(`\nTesting login for: ${testUser.email}`);
      
      // Find user
      const user = await User.findOne({ email: testUser.email });
      
      if (!user) {
        console.log('❌ User not found');
        continue;
      }

      // Verify password
      const isPasswordValid = bcrypt.compareSync(testUser.password, user.password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        continue;
      }

      // Generate token
      const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
      }, 'your-secret-key');

      console.log('✅ Login successful!');
      console.log(`   User: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Token: ${token.substring(0, 50)}...`);
    }

    // Show all users in database
    console.log('\n📋 All users in database:');
    const allUsers = await User.find().select('-password');
    allUsers.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
} 