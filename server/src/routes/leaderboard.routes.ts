import { Router } from 'express';
import { z } from 'zod';
import { leaderboardService } from '../services/leaderboard.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const querySchema = z.object({
  state: z.string().optional(),
  classification: z.string().optional(),
  gradYear: z.coerce.number().optional(),
  position: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(25),
});

router.get('/', authenticate, validate(querySchema, 'query'), async (req, res, next) => {
  try {
    const result = await leaderboardService.getLeaderboard(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
