import { Router } from 'express';
import { jobService } from '../services/job.service.js';
import { authenticate, requireWorkerSecret } from '../middleware/auth.js';

const router = Router();

router.get('/:jobId', authenticate, async (req, res, next) => {
  try {
    const job = await jobService.getStatus(req.params.jobId);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { matchId, sessionId } = req.query;
    if (matchId) {
      const jobs = await jobService.listByMatch(matchId as string);
      return res.json(jobs);
    }
    if (sessionId) {
      const jobs = await jobService.listBySession(sessionId as string);
      return res.json(jobs);
    }
    res.json([]);
  } catch (err) {
    next(err);
  }
});

// Internal endpoint — called by Python worker
router.patch('/:jobId/internal-update', requireWorkerSecret, async (req, res, next) => {
  try {
    const job = await jobService.updateStatus(req.params.jobId, req.body);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

export default router;
