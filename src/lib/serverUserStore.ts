import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserSession, GoogleJwtPayload } from '@/types/auth';
import { LoanRecord } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'persistentUsers.json');
const TMP_USERS_FILE = path.join('/tmp', 'persistentUsers.json');

let inMemoryUsersStore: Record<string, UserSession> | null = null;

// Ensure data directory and file exist
function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2), 'utf-8');
    }
  } catch {
    // Read-only filesystem on Vercel / AWS Lambda
  }
}

// Read all users from disk
export function getAllUsers(): Record<string, UserSession> {
  if (inMemoryUsersStore) {
    return inMemoryUsersStore;
  }
  ensureStorageExists();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      inMemoryUsersStore = JSON.parse(data) || {};
      return inMemoryUsersStore!;
    }
  } catch (err) {
    console.warn('Failed to read users file from project dir:', err);
  }

  try {
    if (fs.existsSync(TMP_USERS_FILE)) {
      const data = fs.readFileSync(TMP_USERS_FILE, 'utf-8');
      inMemoryUsersStore = JSON.parse(data) || {};
      return inMemoryUsersStore!;
    }
  } catch {
    // ignore
  }

  inMemoryUsersStore = {};
  return inMemoryUsersStore;
}

// Save all users to disk
export function saveAllUsers(users: Record<string, UserSession>) {
  inMemoryUsersStore = users;
  ensureStorageExists();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync(TMP_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }
}

// Find user by email
export function getUserByEmail(email: string): UserSession | null {
  const users = getAllUsers();
  return users[email.toLowerCase()] || null;
}

// Find user by either email or phone number
export function findUserByIdentifier(identifier: string): UserSession | null {
  const cleanId = identifier.trim().toLowerCase();
  const users = getAllUsers();
  
  // Direct match by email key
  if (users[cleanId]) return users[cleanId];

  // Search across users for matching email or phone
  const cleanPhone = cleanId.replace(/\D/g, '');
  for (const user of Object.values(users)) {
    if (user.email.toLowerCase() === cleanId) return user;
    if (user.phone && user.phone.replace(/\D/g, '') === cleanPhone && cleanPhone.length >= 9) {
      return user;
    }
  }

  return null;
}

// Helper to hash passwords securely
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'thanavuddho_salt_2026').digest('hex');
}

// Admin Email List & Helper
export const ADMIN_EMAILS = [
  'thanavuddho.dhamma@gmail.com',
  'asaneebas4567@gmail.com',
  'admin@thanavuddho-library.org'
];

export function isUserAdmin(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(clean) || clean.startsWith('admin@');
}

// Helper to generate running member card ID (69001, 69002, 69003...)
export function getNextMemberCardId(users: Record<string, UserSession>): string {
  let nextNum = 69001;
  Object.values(users).forEach(u => {
    if (u.memberCardId) {
      const match = u.memberCardId.match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= 69000 && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    }
  });
  return `${nextNum}`;
}

// Real Member Registration
export interface RegisterParams {
  name: string;
  email: string;
  phone?: string;
  ageRange?: string;
  password?: string;
}

export function registerMemberAccount(params: RegisterParams): { success: boolean; user?: UserSession; message: string } {
  const users = getAllUsers();
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPhone = (params.phone || '').trim();

  // Basic validation
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'กรุณาระบุที่อยู่อีเมลที่ถูกต้อง' };
  }

  if (users[cleanEmail]) {
    return { success: false, message: 'อีเมลนี้ได้รับการลงทะเบียนในระบบแล้ว กรุณาเข้าสู่ระบบ' };
  }

  // Check phone duplication if phone provided
  if (cleanPhone) {
    const rawPhone = cleanPhone.replace(/\D/g, '');
    for (const u of Object.values(users)) {
      if (u.phone && u.phone.replace(/\D/g, '') === rawPhone) {
        return { success: false, message: 'เบอร์โทรศัพท์นี้ถูกใช้ลงทะเบียนแล้ว' };
      }
    }
  }

  const now = new Date().toISOString();
  const memberCardId = getNextMemberCardId(users);
  const userRole = isUserAdmin(cleanEmail) ? 'admin' : 'member';

  const newUser: UserSession = {
    id: `usr_${Date.now()}`,
    memberCardId,
    email: cleanEmail,
    name: params.name.trim() || cleanEmail.split('@')[0],
    phone: cleanPhone || undefined,
    ageRange: params.ageRange || '18-25 ปี',
    picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
    email_verified: true,
    points: 50, // Welcome gift 50 points
    role: userRole,
    loans: [],
    boundType: cleanPhone ? 'email_and_phone' : 'email',
    passwordHash: params.password ? hashPassword(params.password) : undefined,
    createdAt: now,
    lastLoginAt: now,
  };

  users[cleanEmail] = newUser;
  saveAllUsers(users);

  return { 
    success: true, 
    user: newUser, 
    message: 'ลงทะเบียนสมาชิกห้องสมุดเรียบร้อยแล้ว ยินดีต้อนรับ!' 
  };
}

// Authenticate Member with Email/Phone + Password
export function authenticateMember(identifier: string, password: string): { success: boolean; user?: UserSession; message: string } {
  const user = findUserByIdentifier(identifier);
  if (!user) {
    return { success: false, message: 'ไม่พบบัญชีผู้ใช้งานที่ตรงกับอีเมลหรือเบอร์โทรศัพท์นี้' };
  }

  if (user.passwordHash) {
    const incomingHash = hashPassword(password);
    if (incomingHash !== user.passwordHash) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
    }
  }

  // Update last login timestamp and ensure role & member card ID
  user.lastLoginAt = new Date().toISOString();
  if (!user.role || isUserAdmin(user.email)) {
    user.role = isUserAdmin(user.email) ? 'admin' : 'member';
  }
  const users = getAllUsers();
  if (!user.memberCardId || user.memberCardId.startsWith('LIB-')) {
    user.memberCardId = getNextMemberCardId(users);
  }
  users[user.email.toLowerCase()] = user;
  saveAllUsers(users);

  return { success: true, user, message: 'เข้าสู่ระบบสำเร็จ' };
}

// Upsert user from verified Google payload
export function upsertGoogleUser(payload: GoogleJwtPayload): UserSession {
  const users = getAllUsers();
  const emailKey = payload.email.toLowerCase();
  const existing = users[emailKey];
  const now = new Date().toISOString();

  if (existing) {
    const updated: UserSession = {
      ...existing,
      name: payload.name || existing.name,
      picture: payload.picture || existing.picture,
      email_verified: payload.email_verified,
      role: isUserAdmin(payload.email) ? 'admin' : (existing.role || 'member'),
      memberCardId: existing.memberCardId && !existing.memberCardId.startsWith('LIB-') 
        ? existing.memberCardId 
        : getNextMemberCardId(users),
      lastLoginAt: now,
    };
    users[emailKey] = updated;
    saveAllUsers(users);
    return updated;
  }

  // Create new user record with welcome bonus (+50 XP points)
  const memberCardId = getNextMemberCardId(users);
  const userRole = isUserAdmin(payload.email) ? 'admin' : 'member';
  const newUser: UserSession = {
    id: payload.sub || `usr_${Date.now()}`,
    memberCardId,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(payload.email)}`,
    email_verified: Boolean(payload.email_verified),
    points: 50, // Welcome points
    role: userRole,
    loans: [],
    boundType: 'google',
    createdAt: now,
    lastLoginAt: now,
  };

  users[emailKey] = newUser;
  saveAllUsers(users);
  return newUser;
}

// Update user loans and points
export function updateUserLoansAndPoints(
  email: string, 
  loans: LoanRecord[], 
  pointsDelta?: number
): UserSession | null {
  const users = getAllUsers();
  const emailKey = email.toLowerCase();
  const user = users[emailKey];

  if (!user) return null;

  user.loans = loans;
  if (typeof pointsDelta === 'number') {
    user.points = Math.max(0, user.points + pointsDelta);
  }
  user.lastLoginAt = new Date().toISOString();

  users[emailKey] = user;
  saveAllUsers(users);
  return user;
}
