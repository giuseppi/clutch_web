import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Clutch database...\n');

  // ─── Teams ────────────────────────────────────────────
  const westviewHS = await prisma.team.upsert({
    where: { abbreviation: 'WVHS' },
    update: {},
    create: {
      name: 'Westview Wolverines',
      schoolName: 'Westview High School',
      abbreviation: 'WVHS',
      conference: 'Pacific League',
      state: 'CA',
      classification: '5A',
      level: 'HIGH_SCHOOL',
      primaryColor: '#002855',
      secondaryColor: '#FFD700',
      visibilitySettings: { athleteCanViewTeamStats: true, athleteCanViewOwnAnalytics: true, athleteCanViewLeaderboard: true },
    },
  });

  const lincolnHS = await prisma.team.upsert({
    where: { abbreviation: 'LCHS' },
    update: {},
    create: {
      name: 'Lincoln Lions',
      schoolName: 'Lincoln High School',
      abbreviation: 'LCHS',
      conference: 'Valley League',
      state: 'CA',
      classification: '4A',
      level: 'HIGH_SCHOOL',
      primaryColor: '#8B0000',
      secondaryColor: '#FFFFFF',
      visibilitySettings: { athleteCanViewTeamStats: true, athleteCanViewOwnAnalytics: true, athleteCanViewLeaderboard: true },
    },
  });

  const uciAnteaters = await prisma.team.upsert({
    where: { abbreviation: 'UCI' },
    update: {},
    create: {
      name: 'UCI Anteaters',
      schoolName: 'University of California, Irvine',
      abbreviation: 'UCI',
      conference: 'Big West',
      state: 'CA',
      classification: 'D1',
      level: 'COLLEGE',
      primaryColor: '#0064A4',
      secondaryColor: '#FFD200',
      visibilitySettings: { athleteCanViewTeamStats: true, athleteCanViewOwnAnalytics: true, athleteCanViewLeaderboard: true },
    },
  });

  console.log('✅ Teams created');

  // ─── Users ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('clutch2026', 12);

  const coachUser = await prisma.user.upsert({
    where: { email: 'coach@clutch.gg' },
    update: {},
    create: {
      email: 'coach@clutch.gg',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Thompson',
      role: 'COACH',
      teamId: westviewHS.id,
    },
  });

  const scoutUser = await prisma.user.upsert({
    where: { email: 'scout@clutch.gg' },
    update: {},
    create: {
      email: 'scout@clutch.gg',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'SCOUT',
    },
  });

  console.log('✅ Users created');

  // ─── Players (Westview) ───────────────────────────────
  const westviewPlayers = [
    { firstName: 'Marcus', lastName: 'Johnson', position: 'PG', jerseyNumber: '1', heightInches: 73, weightLbs: 175, graduationYear: 2026, mmr: 72, stars: 4 },
    { firstName: 'DeAndre', lastName: 'Williams', position: 'SG', jerseyNumber: '3', heightInches: 76, weightLbs: 195, graduationYear: 2026, mmr: 68, stars: 3 },
    { firstName: 'Jaylen', lastName: 'Brooks', position: 'SF', jerseyNumber: '12', heightInches: 78, weightLbs: 210, graduationYear: 2027, mmr: 61, stars: 3 },
    { firstName: 'Kai', lastName: 'Anderson', position: 'PF', jerseyNumber: '24', heightInches: 80, weightLbs: 225, graduationYear: 2026, mmr: 65, stars: 4 },
    { firstName: 'Zion', lastName: 'Mitchell', position: 'C', jerseyNumber: '32', heightInches: 82, weightLbs: 240, graduationYear: 2027, mmr: 58, stars: 3 },
    { firstName: 'Tyler', lastName: 'Chen', position: 'PG', jerseyNumber: '5', heightInches: 71, weightLbs: 165, graduationYear: 2028, mmr: 45, stars: 2 },
    { firstName: 'Isaiah', lastName: 'Davis', position: 'SG', jerseyNumber: '11', heightInches: 74, weightLbs: 185, graduationYear: 2027, mmr: 52, stars: 2 },
    { firstName: 'Noah', lastName: 'Garcia', position: 'SF', jerseyNumber: '22', heightInches: 77, weightLbs: 200, graduationYear: 2028, mmr: 48, stars: 2 },
  ];

  const createdWVPlayers = [];
  for (const p of westviewPlayers) {
    const player = await prisma.player.upsert({
      where: { id: `seed-wv-${p.jerseyNumber}` },
      update: {},
      create: { id: `seed-wv-${p.jerseyNumber}`, ...p, teamId: westviewHS.id, isVerified: true },
    });
    createdWVPlayers.push(player);
  }

  // ─── Players (Lincoln) ────────────────────────────────
  const lincolnPlayers = [
    { firstName: 'Jordan', lastName: 'Taylor', position: 'PG', jerseyNumber: '2', heightInches: 72, weightLbs: 170, graduationYear: 2026, mmr: 66, stars: 3 },
    { firstName: 'Aiden', lastName: 'Clark', position: 'SG', jerseyNumber: '7', heightInches: 75, weightLbs: 190, graduationYear: 2026, mmr: 63, stars: 3 },
    { firstName: 'Elijah', lastName: 'Robinson', position: 'SF', jerseyNumber: '15', heightInches: 79, weightLbs: 215, graduationYear: 2027, mmr: 59, stars: 3 },
    { firstName: 'Brandon', lastName: 'Lee', position: 'PF', jerseyNumber: '21', heightInches: 81, weightLbs: 230, graduationYear: 2026, mmr: 70, stars: 4 },
    { firstName: 'Cameron', lastName: 'White', position: 'C', jerseyNumber: '33', heightInches: 83, weightLbs: 245, graduationYear: 2027, mmr: 55, stars: 2 },
    { firstName: 'Derek', lastName: 'Harris', position: 'PG', jerseyNumber: '4', heightInches: 70, weightLbs: 160, graduationYear: 2028, mmr: 42, stars: 1 },
    { firstName: 'Ryan', lastName: 'Martinez', position: 'SG', jerseyNumber: '10', heightInches: 73, weightLbs: 180, graduationYear: 2028, mmr: 46, stars: 2 },
  ];

  const createdLCPlayers = [];
  for (const p of lincolnPlayers) {
    const player = await prisma.player.upsert({
      where: { id: `seed-lc-${p.jerseyNumber}` },
      update: {},
      create: { id: `seed-lc-${p.jerseyNumber}`, ...p, teamId: lincolnHS.id, isVerified: true },
    });
    createdLCPlayers.push(player);
  }

  console.log('✅ Players created (15 total)');

  // Create athlete user linked to first Westview player
  await prisma.user.upsert({
    where: { email: 'athlete@clutch.gg' },
    update: {},
    create: {
      email: 'athlete@clutch.gg',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Johnson',
      role: 'ATHLETE',
      teamId: westviewHS.id,
      playerId: createdWVPlayers[0].id,
    },
  });
  console.log('✅ Athlete user created');

  // ─── Matches ──────────────────────────────────────────
  const match1 = await prisma.match.upsert({
    where: { matchCode: 'MATCH-2026-0215-WVvsLC' },
    update: {},
    create: {
      matchCode: 'MATCH-2026-0215-WVvsLC',
      scheduledDate: new Date('2026-02-15T19:00:00Z'),
      venue: 'Westview Gymnasium',
      homeTeamId: westviewHS.id,
      awayTeamId: lincolnHS.id,
      season: '2025-2026',
      homeScore: 72,
      awayScore: 65,
      result: 'WIN',
      isProcessed: true,
    },
  });

  const match2 = await prisma.match.upsert({
    where: { matchCode: 'MATCH-2026-0222-LCvsWV' },
    update: {},
    create: {
      matchCode: 'MATCH-2026-0222-LCvsWV',
      scheduledDate: new Date('2026-02-22T18:30:00Z'),
      venue: 'Lincoln Fieldhouse',
      homeTeamId: lincolnHS.id,
      awayTeamId: westviewHS.id,
      season: '2025-2026',
      homeScore: 68,
      awayScore: 71,
      result: 'LOSS',
      isProcessed: true,
    },
  });

  // Upcoming unprocessed match (for upload demo)
  const match3 = await prisma.match.upsert({
    where: { matchCode: 'MATCH-2026-0308-WVvsLC' },
    update: {},
    create: {
      matchCode: 'MATCH-2026-0308-WVvsLC',
      scheduledDate: new Date('2026-03-08T19:00:00Z'),
      venue: 'Westview Gymnasium',
      homeTeamId: westviewHS.id,
      awayTeamId: lincolnHS.id,
      season: '2025-2026',
      isProcessed: false,
    },
  });

  const match4 = await prisma.match.upsert({
    where: { matchCode: 'MATCH-2026-0315-LCvsWV' },
    update: {},
    create: {
      matchCode: 'MATCH-2026-0315-LCvsWV',
      scheduledDate: new Date('2026-03-15T18:30:00Z'),
      venue: 'Lincoln Fieldhouse',
      homeTeamId: lincolnHS.id,
      awayTeamId: westviewHS.id,
      season: '2025-2026',
      isProcessed: false,
    },
  });

  console.log('✅ Matches created (4 total, 2 processed + 2 upcoming)');

  // ─── Match Stats (for processed matches) ──────────────
  const statSeed = (matchId: string, players: any[], isHome: boolean, matchIdx: number) => {
    return players.slice(0, 5).map((p: any, i: number) => {
      const seed = matchIdx * 100 + i + (isHome ? 0 : 50);
      const rng = (min: number, max: number) => min + Math.floor((Math.sin(seed * (i + 1)) * 0.5 + 0.5) * (max - min));
      const fga = rng(5, 16);
      const fgm = rng(2, Math.min(fga, 10));
      const fg3a = rng(0, 6);
      const fg3m = rng(0, Math.min(fg3a, 3));
      const fta = rng(0, 8);
      const ftm = rng(0, Math.min(fta, 6));
      const pts = (fgm - fg3m) * 2 + fg3m * 3 + ftm;

      return {
        matchId,
        playerId: p.id,
        minutes: +(rng(15, 35) + Math.random() * 5).toFixed(1),
        points: pts,
        fgMade: fgm,
        fgAttempted: fga,
        fg3Made: fg3m,
        fg3Attempted: fg3a,
        ftMade: ftm,
        ftAttempted: fta,
        offRebounds: rng(0, 4),
        defRebounds: rng(1, 7),
        assists: rng(0, 8),
        steals: rng(0, 3),
        blocks: rng(0, 2),
        turnovers: rng(0, 4),
        fouls: rng(0, 4),
        ppp: +(pts / Math.max(fga + 0.44 * fta + rng(0, 3), 1)).toFixed(2),
        efgPct: +((fgm + 0.5 * fg3m) / Math.max(fga, 1) * 100).toFixed(1),
        plusMinus: rng(-10, 15),
      };
    });
  };

  // Match 1 stats
  const m1Stats = [
    ...statSeed(match1.id, createdWVPlayers, true, 1),
    ...statSeed(match1.id, createdLCPlayers, false, 1),
  ];
  for (const stat of m1Stats) {
    await prisma.matchStat.upsert({
      where: { matchId_playerId: { matchId: stat.matchId, playerId: stat.playerId } },
      update: stat,
      create: stat,
    });
  }

  // Match 2 stats
  const m2Stats = [
    ...statSeed(match2.id, createdLCPlayers, true, 2),
    ...statSeed(match2.id, createdWVPlayers, false, 2),
  ];
  for (const stat of m2Stats) {
    await prisma.matchStat.upsert({
      where: { matchId_playerId: { matchId: stat.matchId, playerId: stat.playerId } },
      update: stat,
      create: stat,
    });
  }

  console.log('✅ Match stats created');

  // ─── Elo History ──────────────────────────────────────
  for (const player of [...createdWVPlayers, ...createdLCPlayers]) {
    // Initial seeding
    await prisma.eloHistory.create({
      data: {
        playerId: player.id,
        previousRating: 50,
        newRating: player.mmr,
        delta: player.mmr - 50,
        reason: 'Initial seed',
      },
    });
    // Post match-1 adjustment
    const delta1 = +(Math.random() * 4 - 1).toFixed(2);
    await prisma.eloHistory.create({
      data: {
        playerId: player.id,
        matchId: match1.id,
        previousRating: player.mmr - delta1,
        newRating: player.mmr,
        delta: delta1,
        reason: 'Match result',
      },
    });
  }

  console.log('✅ Elo history created');

  // ─── Sessions ─────────────────────────────────────────
  await prisma.session.upsert({
    where: { id: 'seed-session-1' },
    update: {},
    create: {
      id: 'seed-session-1',
      title: 'Pre-season Practice #1',
      sessionType: 'PRACTICE',
      date: new Date('2026-01-15T16:00:00Z'),
      teamId: westviewHS.id,
      notes: 'Focus on transition offense and press break',
    },
  });

  console.log('✅ Sessions created');

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Login credentials:');
  console.log('   Coach:   coach@clutch.gg / clutch2026');
  console.log('   Scout:   scout@clutch.gg / clutch2026');
  console.log('   Athlete: athlete@clutch.gg / clutch2026\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
