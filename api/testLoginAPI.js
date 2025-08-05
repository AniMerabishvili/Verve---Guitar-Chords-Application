const http = require('http');

const BASE_URL = 'http://localhost:3000';

function testLoginAPI() {
  console.log('Testing login API...\n');

  // Test login with seeded users
  const testUsers = [
    { email: 'john@example.com', password: 'password123' },
    { email: 'jane@example.com', password: 'password123' }
  ];

  testUsers.forEach((testUser, index) => {
    console.log(`Testing login for: ${testUser.email}`);
    
    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/user/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.success) {
            console.log('✅ Login successful!');
            console.log(`   User: ${response.user.firstName} ${response.user.lastName}`);
            console.log(`   Role: ${response.user.role}`);
            console.log(`   Token: ${response.token.substring(0, 50)}...`);
          } else {
            console.log('❌ Login failed:', response.message);
          }
        } catch (error) {
          console.log('❌ Invalid response:', data);
        }
        
        console.log('');
        
        // Test next user after a short delay
        if (index < testUsers.length - 1) {
          setTimeout(() => {
            testUsers.forEach((user, i) => {
              if (i === index + 1) {
                console.log(`Testing login for: ${user.email}`);
                const postData = JSON.stringify(user);
                
                const req = http.request(options, (res) => {
                  let data = '';
                  
                  res.on('data', (chunk) => {
                    data += chunk;
                  });
                  
                  res.on('end', () => {
                    try {
                      const response = JSON.parse(data);
                      
                      if (response.success) {
                        console.log('✅ Login successful!');
                        console.log(`   User: ${response.user.firstName} ${response.user.lastName}`);
                        console.log(`   Role: ${response.user.role}`);
                        console.log(`   Token: ${response.token.substring(0, 50)}...`);
                      } else {
                        console.log('❌ Login failed:', response.message);
                      }
                    } catch (error) {
                      console.log('❌ Invalid response:', data);
                    }
                    
                    console.log('');
                    console.log('Login API testing completed!');
                  });
                });
                
                req.on('error', (error) => {
                  console.log('❌ Network error:', error.message);
                });
                
                req.write(postData);
                req.end();
              }
            });
          }, 1000);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Network error:', error.message);
    });

    req.write(postData);
    req.end();
  });
}

// Start testing
testLoginAPI(); 