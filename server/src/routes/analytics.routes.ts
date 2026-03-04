import { Router } from 'express';
import { z } from 'zod';
import { analyticsService } from '../services/analytics.service.js';
import { authenticate, requireRole, requireWorkerSecret } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Match analytics (Coach + Scout)
router.get('/match/:matchId', authenticate, async (req, res, next) => {
  try {
    const analytics = await analyticsService.getMatchAnalytics(req.params.matchId);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
});

// Play tags
router.get('/match/:matchId/tags', authenticate, async (req, res, next) => {
  try {
    const tags = await analyticsService.getPlayTags(req.params.matchId);
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

const createTagSchema = z.object({
  label: z.string().min(1),
  notes: z.string().optional(),
  timestamp: z.number(),
  statType: z.string().optional(),
  playerId: z.string().uuid().optional(),
});

router.post('/match/:matchId/tags', authenticate, requireRole('COACH'), validate(createTagSchema), async (req, res, next) => {
  try {
    const tag = await analyticsService.createPlayTag({ ...req.body, matchId: req.params.matchId });
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

router.patch('/tags/:id', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    const tag = await analyticsService.updatePlayTag(req.params.id, req.body);
    res.json(tag);
  } catch (err) {
    next(err);
  }
});

router.delete('/tags/:id', authenticate, requireRole('COACH'), async (req, res, next) => {
  try {
    await analyticsService.deletePlayTag(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Highlight clips
router.get('/match/:matchId/highlights', authenticate, async (req, res, next) => {
  try {
    const clips = await analyticsService.getHighlights({ matchId: req.params.matchId });
    res.json(clips);
  } catch (err) {
    next(err);
  }
});

router.get('/player/:playerId/highlights', authenticate, async (req, res, next) => {
  try {
    const clips = await analyticsService.getHighlights({ playerId: req.params.playerId });
    res.json(clips);
  } catch (err) {
    next(err);
  }
});

// Internal: Worker stores analytics results after processing
router.post('/compute', requireWorkerSecret, async (req, res, next) => {
  try {
    await analyticsService.storeAnalyticsResults(req.body);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
