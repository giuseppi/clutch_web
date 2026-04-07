import { Router } from 'express';
import { z } from 'zod';
import { matchService } from '../services/match.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const listQuerySchema = z.object({
  teamId: z.string().uuid().optional(),
  season: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createSchema = z.object({
  scheduledDate: z.string(),
  venue: z.string().optional(),
  homeTeamId: z.string().uuid(),
  awayTeamId: z.string().uuid(),
  season: z.string(),
  matchCode: z.string(),
});

router.get('/', authenticate, validate(listQuerySchema, 'query'), async (req, res, next) => {
  try {
    const result = await matchService.list(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/scheduled', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    if (!req.user!.teamId) {
      return res.json([]);
    }
    const matches = await matchService.getScheduled(req.user!.teamId);
    res.json(matches);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const match = await matchService.getById(req.params.id);
    res.json(match);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole('COACH'), validate(createSchema), async (req, res, next) => {
  try {
    const match = await matchService.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    const match = await matchService.update(req.params.id, req.body);
    res.json(match);
  } catch (err) {
    next(err);
  }
});

export default router;
