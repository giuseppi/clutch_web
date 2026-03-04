import { Router } from 'express';
import { z } from 'zod';
import { uploadService } from '../services/upload.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const presignSchema = z.object({
  matchId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  fileName: z.string(),
  contentType: z.string(),
  type: z.enum(['MATCH', 'SESSION']),
});

const confirmSchema = z.object({
  matchId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  s3Key: z.string(),
  homeJerseyColor: z.string().optional(),
  awayJerseyColor: z.string().optional(),
  type: z.enum(['MATCH', 'SESSION']),
});

router.post('/presign', authenticate, requireRole('COACH'), validate(presignSchema), async (req, res, next) => {
  try {
    const result = await uploadService.generatePresignedUrl({
      ...req.body,
      userId: req.user!.userId,
      teamId: req.user!.teamId!,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/confirm', authenticate, requireRole('COACH'), validate(confirmSchema), async (req, res, next) => {
  try {
    const job = await uploadService.confirmUpload({
      ...req.body,
      userId: req.user!.userId,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

export default router;
