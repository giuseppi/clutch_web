-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COACH', 'SCOUT', 'ATHLETE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('MATCH', 'SESSION');

-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'LOSS', 'DRAW');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PRACTICE', 'SCRIMMAGE', 'TRAINING');

-- CreateEnum
CREATE TYPE "TeamLevel" AS ENUM ('HIGH_SCHOOL', 'COLLEGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'COACH',
    "avatarUrl" TEXT,
    "teamId" TEXT,
    "playerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT,
    "state" TEXT,
    "classification" TEXT,
    "level" "TeamLevel" NOT NULL DEFAULT 'HIGH_SCHOOL',
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "visibilitySettings" JSONB NOT NULL DEFAULT '{"athleteCanViewTeamStats":true,"athleteCanViewOwnAnalytics":true,"athleteCanViewLeaderboard":true}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jerseyNumber" TEXT,
    "heightInches" INTEGER,
    "weightLbs" INTEGER,
    "birthDate" TIMESTAMP(3),
    "graduationYear" INTEGER NOT NULL,
    "photoUrl" TEXT,
    "teamId" TEXT NOT NULL,
    "mmr" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "matchCode" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "result" "MatchResult",
    "season" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL DEFAULT 'PRACTICE',
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "teamId" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_stats" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "minutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "fgMade" INTEGER NOT NULL DEFAULT 0,
    "fgAttempted" INTEGER NOT NULL DEFAULT 0,
    "fg3Made" INTEGER NOT NULL DEFAULT 0,
    "fg3Attempted" INTEGER NOT NULL DEFAULT 0,
    "ftMade" INTEGER NOT NULL DEFAULT 0,
    "ftAttempted" INTEGER NOT NULL DEFAULT 0,
    "offRebounds" INTEGER NOT NULL DEFAULT 0,
    "defRebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "ppp" DOUBLE PRECISION,
    "efgPct" DOUBLE PRECISION,
    "usgPct" DOUBLE PRECISION,
    "toPct" DOUBLE PRECISION,
    "orbPct" DOUBLE PRECISION,
    "ftr" DOUBLE PRECISION,
    "plusMinus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_stats" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "minutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "fgMade" INTEGER NOT NULL DEFAULT 0,
    "fgAttempted" INTEGER NOT NULL DEFAULT 0,
    "fg3Made" INTEGER NOT NULL DEFAULT 0,
    "fg3Attempted" INTEGER NOT NULL DEFAULT 0,
    "ftMade" INTEGER NOT NULL DEFAULT 0,
    "ftAttempted" INTEGER NOT NULL DEFAULT 0,
    "offRebounds" INTEGER NOT NULL DEFAULT 0,
    "defRebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "ppp" DOUBLE PRECISION,
    "efgPct" DOUBLE PRECISION,
    "usgPct" DOUBLE PRECISION,
    "toPct" DOUBLE PRECISION,
    "orbPct" DOUBLE PRECISION,
    "ftr" DOUBLE PRECISION,
    "plusMinus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_jobs" (
    "id" TEXT NOT NULL,
    "type" "JobType" NOT NULL DEFAULT 'MATCH',
    "matchId" TEXT,
    "sessionId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "rawVideoS3Key" TEXT NOT NULL,
    "rawVideoSize" BIGINT,
    "duration" DOUBLE PRECISION,
    "homeJerseyColor" TEXT,
    "awayJerseyColor" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trajectory_logs" (
    "id" TEXT NOT NULL,
    "videoJobId" TEXT NOT NULL,
    "trajectoryS3Key" TEXT NOT NULL,
    "frameCount" INTEGER,
    "playerCount" INTEGER,
    "eventsDetected" INTEGER NOT NULL DEFAULT 0,
    "processingTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trajectory_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elo_history" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT,
    "previousRating" DOUBLE PRECISION NOT NULL,
    "newRating" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "elo_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_tags" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "statType" TEXT,
    "matchId" TEXT,
    "sessionId" TEXT,
    "playerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "play_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "highlight_clips" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "startTimestamp" DOUBLE PRECISION NOT NULL,
    "endTimestamp" DOUBLE PRECISION NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT,
    "clipS3Key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "highlight_clips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_playerId_key" ON "users"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_abbreviation_key" ON "teams"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "matches_matchCode_key" ON "matches"("matchCode");

-- CreateIndex
CREATE UNIQUE INDEX "match_stats_matchId_playerId_key" ON "match_stats"("matchId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "session_stats_sessionId_playerId_key" ON "session_stats"("sessionId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "trajectory_logs_videoJobId_key" ON "trajectory_logs"("videoJobId");

-- CreateIndex
CREATE INDEX "elo_history_playerId_createdAt_idx" ON "elo_history"("playerId", "createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_stats" ADD CONSTRAINT "session_stats_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_stats" ADD CONSTRAINT "session_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajectory_logs" ADD CONSTRAINT "trajectory_logs_videoJobId_fkey" FOREIGN KEY ("videoJobId") REFERENCES "video_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elo_history" ADD CONSTRAINT "elo_history_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_tags" ADD CONSTRAINT "play_tags_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_tags" ADD CONSTRAINT "play_tags_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_tags" ADD CONSTRAINT "play_tags_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlight_clips" ADD CONSTRAINT "highlight_clips_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlight_clips" ADD CONSTRAINT "highlight_clips_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
