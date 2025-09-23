const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = [
    { username: 'admin', password: 'secret' },
    { username: 'demo', password: 'demo' }
  ];

  console.log('Generated password hashes:');
  console.log('========================');
  
  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 12);
    console.log(`${user.username} (${user.password}): ${hash}`);
  }
}

generateHashes().catch(console.error);
