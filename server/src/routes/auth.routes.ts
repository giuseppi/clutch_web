import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ─── Local dev only routes (disabled when Supabase Auth is active) ───
// In production, register/login/refresh are handled by the Supabase client SDK on the frontend.
if (!process.env.SUPABASE_URL) {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['COACH', 'SCOUT', 'ATHLETE']),
    teamId: z.string().uuid().optional(),
    playerId: z.string().uuid().optional(),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const refreshSchema = z.object({
    refreshToken: z.string(),
  });

  router.post('/register', validate(registerSchema), async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });
}

// ─── Always available ─────────────────────────────────────
// /me endpoint works with both custom JWTs (local) and Supabase JWTs (production)
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
