import { Router } from 'express';
import { z } from 'zod';
import { playerService } from '../services/player.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const listQuerySchema = z.object({
  teamId: z.string().uuid().optional(),
  position: z.string().optional(),
  gradYear: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']),
  jerseyNumber: z.string().optional(),
  heightInches: z.number().optional(),
  weightLbs: z.number().optional(),
  graduationYear: z.number().min(2020).max(2035),
  teamId: z.string().uuid(),
});

router.get('/', authenticate, validate(listQuerySchema, 'query'), async (req, res, next) => {
  try {
    const result = await playerService.list(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const player = await playerService.getById(req.params.id);
    res.json(player);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole('COACH'), validate(createSchema), async (req, res, next) => {
  try {
    const player = await playerService.create(req.body);
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    const player = await playerService.update(req.params.id, req.body);
    res.json(player);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/elo-history', authenticate, async (req, res, next) => {
  try {
    const history = await playerService.getEloHistory(req.params.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/stats', authenticate, async (req, res, next) => {
  try {
    const stats = await playerService.getStats(req.params.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
