import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import fs from 'fs';
import path from 'path';

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

// User interface
export interface User {
  id: number;
  username: string;
  password: string;
}

// Load users from JSON file
export function loadUsers(): User[] {
  try {
    const usersPath = path.join(process.cwd(), 'config', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const { users } = JSON.parse(usersData);
    return users;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Find user by username
export function findUserByUsername(username: string): User | null {
  const users = loadUsers();
  return users.find(user => user.username === username) || null;
}

// Verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Hash password (for creating new users)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Create JWT token
export async function createToken(userId: number, username: string): Promise<string> {
  return await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: number; username: string };
  } catch (error) {
    return null;
  }
}

// Authenticate user
export async function authenticateUser(username: string, password: string): Promise<{ user: User; token: string } | null> {
  console.log('Authenticating user:', username);
  
  const user = findUserByUsername(username);
  if (!user) {
    console.log('User not found:', username);
    return null;
  }

  console.log('User found, verifying password');
  console.log('Stored hash:', user.password);
  
  const isValidPassword = await verifyPassword(password, user.password);
  console.log('Password valid:', isValidPassword);
  
  if (!isValidPassword) {
    return null;
  }

  const token = await createToken(user.id, user.username);
  console.log('Token created successfully');
  
  return { user, token };
}
