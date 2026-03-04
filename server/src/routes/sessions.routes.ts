import { Router } from 'express';
import { z } from 'zod';
import { sessionService } from '../services/session.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  sessionType: z.enum(['PRACTICE', 'SCRIMMAGE', 'TRAINING']),
  date: z.string(),
  notes: z.string().optional(),
});

router.get('/', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    if (!req.user!.teamId) return res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
    const result = await sessionService.list({
      teamId: req.user!.teamId,
      type: req.query.type as any,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.getById(req.params.id);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole('COACH'), validate(createSchema), async (req, res, next) => {
  try {
    if (!req.user!.teamId) return res.status(400).json({ error: 'No team assigned' });
    const session = await sessionService.create({ ...req.body, teamId: req.user!.teamId });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

export default router;
