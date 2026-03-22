import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import playerRoutes from './routes/players.routes.js';
import matchRoutes from './routes/matches.routes.js';
import sessionRoutes from './routes/sessions.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// After all imports: if you never see the next line, something in the import graph is hanging during load.
console.log('[clutch-api] modules loaded, creating app…');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Global Middleware ──────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ─── Health Check ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// ─── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────
console.log(`[clutch-api] binding port ${PORT}…`);
app.listen(PORT, () => {
  console.log(`\n🏀 Clutch API server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
