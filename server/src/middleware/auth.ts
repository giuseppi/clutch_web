import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './errors.js';
import type { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  teamId?: string;
  playerId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT verification (custom tokens signed with JWT_SECRET).
 * Supabase dual-mode (SUPABASE_JWT_SECRET + `sub` claim) is disabled — see commented lines below.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);
  // const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET!;
  const jwtSecret = process.env.JWT_SECRET!;

  try {
    const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;

    req.user = {
      // `sub` was for Supabase tokens; custom JWTs use `userId`
      userId: (decoded.sub as string) || (decoded.userId as string),
      role: decoded.role as UserRole,
      teamId: decoded.teamId as string | undefined,
      playerId: decoded.playerId as string | undefined,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`This action requires one of: ${roles.join(', ')}`));
    }
    next();
  };
}

// Internal worker endpoint protection
export function requireWorkerSecret(req: Request, _res: Response, next: NextFunction) {
  const secret = req.headers['x-worker-secret'];
  if (secret !== process.env.WORKER_SECRET) {
    return next(new ForbiddenError('Invalid worker secret'));
  }
  next();
}
