import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { UnauthorizedError, ValidationError } from '../middleware/errors.js';
import type { UserRole } from '@prisma/client';
import type { JwtPayload } from '../middleware/auth.js';

const SALT_ROUNDS = 12;

export const authService = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    teamId?: string;
    playerId?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ValidationError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        teamId: data.teamId,
        playerId: data.role === 'ATHLETE' ? data.playerId : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        teamId: true,
        playerId: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const tokens = generateTokens(user);
    return { ...tokens, user };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { team: { select: { id: true, name: true, abbreviation: true } } },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const { passwordHash: _, ...safeUser } = user;
    const tokens = generateTokens(safeUser);
    return { ...tokens, user: safeUser };
  },

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          teamId: true,
          playerId: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        teamId: true,
        playerId: true,
        avatarUrl: true,
        createdAt: true,
        team: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            level: true,
            visibilitySettings: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  },
};

function generateTokens(user: { id: string; role: UserRole; teamId?: string | null; playerId?: string | null }) {
  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
    teamId: user.teamId ?? undefined,
    playerId: user.playerId ?? undefined,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
}
