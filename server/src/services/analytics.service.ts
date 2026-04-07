import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errors.js';

export const analyticsService = {
  async getMatchAnalytics(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: { select: { id: true, name: true, abbreviation: true } },
        awayTeam: { select: { id: true, name: true, abbreviation: true } },
        matchStats: {
          include: {
            player: {
              select: { id: true, firstName: true, lastName: true, position: true, jerseyNumber: true, teamId: true, mmr: true },
            },
          },
        },
        playTags: {
          orderBy: { timestamp: 'asc' },
          include: {
            player: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        highlightClips: {
          orderBy: { startTimestamp: 'asc' },
          include: {
            player: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        videoJobs: {
          where: { status: 'COMPLETED' },
          take: 1,
          orderBy: { completedAt: 'desc' },
          select: { id: true, rawVideoS3Key: true, completedAt: true },
        },
      },
    });

    if (!match) throw new NotFoundError('Match', matchId);

    // Split stats by team
    const homeStats = match.matchStats.filter(s => s.player.teamId === match.homeTeamId);
    const awayStats = match.matchStats.filter(s => s.player.teamId === match.awayTeamId);

    // Compute four factors for each team
    const computeFourFactors = (stats: typeof homeStats) => {
      const totals = stats.reduce((acc, s) => ({
        fgMade: acc.fgMade + s.fgMade,
        fgAttempted: acc.fgAttempted + s.fgAttempted,
        fg3Made: acc.fg3Made + s.fg3Made,
        ftMade: acc.ftMade + s.ftMade,
        ftAttempted: acc.ftAttempted + s.ftAttempted,
        offRebounds: acc.offRebounds + s.offRebounds,
        turnovers: acc.turnovers + s.turnovers,
        points: acc.points + s.points,
      }), { fgMade: 0, fgAttempted: 0, fg3Made: 0, ftMade: 0, ftAttempted: 0, offRebounds: 0, turnovers: 0, points: 0 });

      const fga = totals.fgAttempted || 1;
      return {
        efgPct: +((totals.fgMade + 0.5 * totals.fg3Made) / fga * 100).toFixed(1),
        toPct: +(totals.turnovers / (fga + 0.44 * totals.ftAttempted + totals.turnovers) * 100).toFixed(1),
        orbPct: +(totals.offRebounds / (totals.offRebounds + 10) * 100).toFixed(1), // simplified
        ftRate: +(totals.ftAttempted / fga).toFixed(3),
        totalPoints: totals.points,
      };
    };

    return {
      match: {
        id: match.id,
        matchCode: match.matchCode,
        scheduledDate: match.scheduledDate,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        result: match.result,
        isProcessed: match.isProcessed,
      },
      homeStats,
      awayStats,
      fourFactors: {
        home: computeFourFactors(homeStats),
        away: computeFourFactors(awayStats),
      },
      playTags: match.playTags,
      highlightClips: match.highlightClips,
      videoJob: match.videoJobs[0] ?? null,
    };
  },

  async getPlayTags(matchId: string) {
    return prisma.playTag.findMany({
      where: { matchId },
      include: { player: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { timestamp: 'asc' },
    });
  },

  async createPlayTag(data: {
    matchId?: string;
    sessionId?: string;
    label: string;
    notes?: string;
    timestamp: number;
    statType?: string;
    playerId?: string;
  }) {
    return prisma.playTag.create({ data });
  },

  async updatePlayTag(id: string, data: { label?: string; notes?: string; statType?: string }) {
    return prisma.playTag.update({ where: { id }, data });
  },

  async deletePlayTag(id: string) {
    return prisma.playTag.delete({ where: { id } });
  },

  async getHighlights(params: { matchId?: string; playerId?: string }) {
    const where: Record<string, string> = {};
    if (params.matchId) where.matchId = params.matchId;
    if (params.playerId) where.playerId = params.playerId;

    return prisma.highlightClip.findMany({
      where,
      include: {
        player: { select: { id: true, firstName: true, lastName: true, position: true } },
        match: { select: { id: true, matchCode: true, scheduledDate: true } },
      },
      orderBy: { startTimestamp: 'asc' },
    });
  },

  // Called by Python worker after processing
  async storeAnalyticsResults(data: {
    matchId: string;
    jobId: string;
    trajectoryS3Key: string;
    stats: Array<{
      playerId: string;
      minutes: number;
      points: number;
      fgMade: number;
      fgAttempted: number;
      fg3Made: number;
      fg3Attempted: number;
      ftMade: number;
      ftAttempted: number;
      offRebounds: number;
      defRebounds: number;
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
      fouls: number;
      ppp?: number;
      efgPct?: number;
      usgPct?: number;
      toPct?: number;
      orbPct?: number;
      ftr?: number;
      plusMinus?: number;
    }>;
    playTags: Array<{
      label: string;
      timestamp: number;
      statType?: string;
      playerId?: string;
    }>;
    highlights: Array<{
      playerId: string;
      startTimestamp: number;
      endTimestamp: number;
      eventType: string;
      description?: string;
    }>;
    eloUpdates: Array<{
      playerId: string;
      previousRating: number;
      newRating: number;
      delta: number;
    }>;
    homeScore: number;
    awayScore: number;
  }) {
    await prisma.$transaction(async (tx) => {
      // 1. Create match stats
      for (const stat of data.stats) {
        await tx.matchStat.upsert({
          where: { matchId_playerId: { matchId: data.matchId, playerId: stat.playerId } },
          create: { matchId: data.matchId, ...stat },
          update: stat,
        });
      }

      // 2. Create play tags
      if (data.playTags.length > 0) {
        await tx.playTag.createMany({
          data: data.playTags.map(t => ({ ...t, matchId: data.matchId })),
        });
      }

      // 3. Create highlight clips
      if (data.highlights.length > 0) {
        await tx.highlightClip.createMany({
          data: data.highlights.map(h => ({ ...h, matchId: data.matchId })),
        });
      }

      // 4. Update player MMR ratings and log history
      for (const elo of data.eloUpdates) {
        await tx.player.update({
          where: { id: elo.playerId },
          data: { mmr: Math.max(0, Math.min(99, elo.newRating)) },
        });
        await tx.eloHistory.create({
          data: {
            playerId: elo.playerId,
            matchId: data.matchId,
            previousRating: elo.previousRating,
            newRating: elo.newRating,
            delta: elo.delta,
            reason: 'Match result',
          },
        });
      }

      // 5. Update match as processed with scores
      await tx.match.update({
        where: { id: data.matchId },
        data: {
          isProcessed: true,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          result: data.homeScore > data.awayScore ? 'WIN' : data.homeScore < data.awayScore ? 'LOSS' : 'DRAW',
        },
      });

      // 6. Create trajectory log
      await tx.trajectoryLog.create({
        data: {
          videoJobId: data.jobId,
          trajectoryS3Key: data.trajectoryS3Key,
          eventsDetected: data.playTags.length,
        },
      });

      // 7. Mark job as completed
      await tx.videoJob.update({
        where: { id: data.jobId },
        data: { status: 'COMPLETED', progress: 100, completedAt: new Date() },
      });
    });
  },
};
