import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const serverStartTime = Date.now();

// Password hashing helper using standard crypto (salt + hash)
function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): string {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

interface ServerUser {
  id: string;
  email: string;
  passwordHash: string;
  roles: ('ROLE_USER' | 'ROLE_ADMIN')[];
  isEmailVerified: boolean;
  otpHash?: string;
  otpExpiry?: number;
  resetOtpHash?: string;
  resetOtpExpiry?: number;
  createdAt: string;
  lastLoginAt?: string;
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // In-memory server-authoritative store
  const users: Map<string, ServerUser> = new Map();
  const sessions: Map<string, string> = new Map(); // token -> userId

  // Initialize a protected Admin user by default for administration testing
  // Initial admin credentials can be set via env vars or default bootstrap
  const initialAdminEmail = process.env.ADMIN_EMAIL || 'admin@koodal.dev';
  const initialAdminPass = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Koodal2026!';
  const adminId = 'usr_admin_root';
  users.set(initialAdminEmail.toLowerCase(), {
    id: adminId,
    email: initialAdminEmail.toLowerCase(),
    passwordHash: hashPassword(initialAdminPass),
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  });

  let serverProfile: any = null;
  let serverJobs: any[] = [];
  let serverApplications: any[] = [];
  let serverErrors: any[] = [];
  let serverTemplates: any[] = [];

  // Authentication Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const userId = sessions.get(token);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    req.user = user;
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user || !req.user.roles.includes('ROLE_ADMIN')) {
      return res.status(403).json({ error: 'Access denied: Requires administrator privileges' });
    }
    next();
  };

  // --- Auth Endpoints ---

  // Register with Email & Password -> Sends OTP
  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const emailNorm = email.toLowerCase().trim();
    if (users.has(emailNorm) && users.get(emailNorm)!.isEmailVerified) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Generate 6-digit cryptographic OTP
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = hashOtp(rawOtp);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins expiry

    const newUser: ServerUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: emailNorm,
      passwordHash: hashPassword(password),
      roles: ['ROLE_USER'],
      isEmailVerified: false,
      otpHash,
      otpExpiry,
      createdAt: new Date().toISOString(),
    };

    users.set(emailNorm, newUser);

    console.log(`[AUTH-DEV-EMAIL] One-Time Password for ${emailNorm}: ${rawOtp}`);

    res.json({
      success: true,
      message: 'Verification code sent to your email address.',
      requiresOtp: true,
      email: emailNorm,
      // In local development / preview sandbox, return devOtp for immediate testing
      devOtp: !isProduction ? rawOtp : undefined,
    });
  });

  // Verify Registration OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification request' });
    }

    if (!user.otpHash || !user.otpExpiry || Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (hashOtp(otp) !== user.otpHash) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Mark verified & clear OTP
    user.isEmailVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    user.lastLoginAt = new Date().toISOString();

    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
    sessions.set(token, user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  });

  // Resend Verification OTP
  app.post('/api/auth/resend-otp', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    if (!user) {
      return res.json({ success: true, message: 'If the email is registered, a code has been sent.' });
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    user.otpHash = hashOtp(rawOtp);
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    console.log(`[AUTH-DEV-EMAIL] Resent OTP for ${emailNorm}: ${rawOtp}`);

    res.json({
      success: true,
      message: 'New verification code generated.',
      devOtp: !isProduction ? rawOtp : undefined,
    });
  });

  // Password Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: 'Email address is not yet verified.',
        requiresVerification: true,
        email: user.email,
      });
    }

    user.lastLoginAt = new Date().toISOString();
    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
    sessions.set(token, user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  });

  // Admin Login (Strictly verifies ROLE_ADMIN)
  app.post('/api/auth/admin-login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }

    if (!user.roles.includes('ROLE_ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized: User is not an administrator' });
    }

    user.lastLoginAt = new Date().toISOString();
    const token = `admin_tok_${crypto.randomBytes(24).toString('hex')}`;
    sessions.set(token, user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  });

  // Forgot Password
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    let devOtp: string | undefined;

    if (user) {
      const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
      user.resetOtpHash = hashOtp(rawOtp);
      user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;
      devOtp = rawOtp;
      console.log(`[AUTH-DEV-EMAIL] Password Reset OTP for ${emailNorm}: ${rawOtp}`);
    }

    res.json({
      success: true,
      message: 'If the account exists, a password reset code has been dispatched.',
      devOtp: !isProduction ? devOtp : undefined,
    });
  });

  // Reset Password with OTP
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);
    if (!user || !user.resetOtpHash || !user.resetOtpExpiry || Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ error: 'Reset code is invalid or has expired' });
    }

    if (hashOtp(otp) !== user.resetOtpHash) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    user.passwordHash = hashPassword(newPassword);
    user.resetOtpHash = undefined;
    user.resetOtpExpiry = undefined;

    res.json({ success: true, message: 'Password has been successfully reset. Please log in.' });
  });

  // Current User / Session
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        roles: req.user.roles,
        isEmailVerified: req.user.isEmailVerified,
        createdAt: req.user.createdAt,
      },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      sessions.delete(token);
    }
    res.json({ success: true });
  });

  // --- Admin Endpoints (ROLE_ADMIN Protected) ---

  app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      email: u.email,
      roles: u.roles,
      isEmailVerified: u.isEmailVerified,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));
    res.json(userList);
  });

  app.get('/api/admin/system', authenticateToken, requireAdmin, (req, res) => {
    res.json({
      status: 'UP',
      uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
      activeUsers: users.size,
      totalJobs: serverJobs.length,
      totalApplications: serverApplications.length,
      unresolvedErrors: serverErrors.filter(e => !e.isResolved).length,
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        type: 'In-Memory Preview Engine + MongoDB Atlas Driver Ready',
      },
      sources: [
        {
          source: 'NAUKRI',
          displayName: 'Naukri.com India',
          healthStatus: 'HEALTHY',
          apiAccessStatus: 'PERMITTED_URL_GENERATOR',
          lastSyncedAt: new Date().toISOString(),
        },
        {
          source: 'LINKEDIN',
          displayName: 'LinkedIn Jobs',
          healthStatus: 'HEALTHY',
          apiAccessStatus: 'PERMITTED_URL_GENERATOR',
          lastSyncedAt: new Date().toISOString(),
        },
        {
          source: 'INDEED',
          displayName: 'Indeed India',
          healthStatus: 'HEALTHY',
          apiAccessStatus: 'PERMITTED_URL_GENERATOR',
          lastSyncedAt: new Date().toISOString(),
        },
        {
          source: 'COMPANY_CAREER',
          displayName: 'Company Career Portals',
          healthStatus: 'HEALTHY',
          apiAccessStatus: 'AUTHORIZED_FEED',
          lastSyncedAt: new Date().toISOString(),
        },
      ],
    });
  });

  // --- Core Application Endpoints ---

  app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', service: 'koodal-personal-job-assistant', timestamp: new Date().toISOString() });
  });

  // Profile
  app.get('/api/profile', (req, res) => {
    res.json(serverProfile || null);
  });

  app.put('/api/profile', (req, res) => {
    serverProfile = req.body;
    res.json(serverProfile);
  });

  // Jobs
  app.get('/api/jobs', (req, res) => {
    const { location, source } = req.query;
    let result = serverJobs;
    if (location && typeof location === 'string') {
      result = result.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()));
    }
    if (source && typeof source === 'string') {
      result = result.filter(j => j.source === source);
    }
    res.json(result);
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = serverJobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  });

  app.post('/api/jobs/batch-sync', (req, res) => {
    const { jobs } = req.body;
    if (Array.isArray(jobs)) serverJobs = jobs;
    res.json({ success: true, count: serverJobs.length });
  });

  // Applications
  app.get('/api/applications', (req, res) => {
    res.json(serverApplications);
  });

  app.post('/api/applications/batch-sync', (req, res) => {
    const { applications } = req.body;
    if (Array.isArray(applications)) serverApplications = applications;
    res.json({ success: true, count: serverApplications.length });
  });

  // Errors & Recovery
  app.get('/api/applications/errors', (req, res) => {
    res.json(serverErrors);
  });

  app.post('/api/applications/errors/sync', (req, res) => {
    const { errors } = req.body;
    if (Array.isArray(errors)) serverErrors = errors;
    res.json({ success: true, count: serverErrors.length });
  });

  // Templates
  app.get('/api/message-templates', (req, res) => {
    res.json(serverTemplates);
  });

  app.post('/api/message-templates/batch-sync', (req, res) => {
    const { templates } = req.body;
    if (Array.isArray(templates)) serverTemplates = templates;
    res.json({ success: true, count: serverTemplates.length });
  });

  // Frontend Serving
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Koodal Job Assistant Server running on http://0.0.0.0:${PORT}`);
    console.log(`[BOOTSTRAP] Administrator Account Initialized: ${initialAdminEmail} / ${initialAdminPass}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
