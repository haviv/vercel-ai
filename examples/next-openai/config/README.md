# Users Configuration

This file contains the users that can access the application.

## Default Users

- **admin** / **secret** - Administrator account
- **demo** / **demo** - Demo account

## Adding New Users

To add new users, you can:
1. Add them to the `users.json` file with a bcrypt hashed password
2. Use an online bcrypt generator to hash passwords
3. Or run the following Node.js code to generate a hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
```

## Security Note

This is a minimal authentication system for development purposes. For production use, consider:
- Using a proper database
- Implementing proper session management
- Adding rate limiting
- Using environment variables for secrets
- Implementing proper user management features
