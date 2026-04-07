"""
Advanced basketball stats computation.
Computes: eFG%, PPP, USG%, TO%, ORB%, FTR, +/-
"""
import random


def compute_box_score(player_idx: int, is_home: bool, frame_count: int) -> dict:
    """
    Generate a realistic synthetic box score for a player.
    In production: derived from trajectory/event data.
    """
    random.seed(player_idx * 100 + (1 if is_home else 0))

    minutes = round(random.uniform(12.0, 36.0), 1)
    fga = random.randint(4, 18)
    fgm = random.randint(1, min(fga, int(fga * 0.65)))
    fg3a = random.randint(0, min(fga // 2, 8))
    fg3m = random.randint(0, min(fg3a, int(fg3a * 0.45)))
    fta = random.randint(0, 8)
    ftm = random.randint(0, min(fta, int(fta * 0.80)))

    points = (fgm - fg3m) * 2 + fg3m * 3 + ftm

    return {
        "minutes": minutes,
        "points": points,
        "fgMade": fgm,
        "fgAttempted": fga,
        "fg3Made": fg3m,
        "fg3Attempted": fg3a,
        "ftMade": ftm,
        "ftAttempted": fta,
        "offRebounds": random.randint(0, 4),
        "defRebounds": random.randint(1, 8),
        "assists": random.randint(0, 10),
        "steals": random.randint(0, 4),
        "blocks": random.randint(0, 3),
        "turnovers": random.randint(0, 5),
        "fouls": random.randint(0, 5),
        "plusMinus": random.randint(-15, 15),
    }


def compute_advanced_stats(box: dict, team_totals: dict) -> dict:
    """Compute advanced metrics from box score."""
    fga = box["fgAttempted"] or 1
    fta = box["ftAttempted"]
    fg3m = box["fg3Made"]
    fgm = box["fgMade"]
    ftm = box["ftMade"]
    tov = box["turnovers"]

    # Effective Field Goal %
    efg_pct = round((fgm + 0.5 * fg3m) / fga * 100, 1)

    # Possessions estimate
    possessions = fga + 0.44 * fta + tov
    ppp = round(box["points"] / possessions, 2) if possessions > 0 else 0

    # Usage Rate %
    team_fga = team_totals.get("fgAttempted", 1) or 1
    team_fta = team_totals.get("ftAttempted", 0)
    team_tov = team_totals.get("turnovers", 0)
    team_min = team_totals.get("minutes", 1) or 1

    usg_numerator = (fga + 0.44 * fta + tov) * (team_min / 5)
    usg_denominator = box["minutes"] * (team_fga + 0.44 * team_fta + team_tov)
    usg_pct = round(100 * usg_numerator / usg_denominator, 1) if usg_denominator > 0 else 0

    # Turnover Rate
    to_pct = round(100 * tov / possessions, 1) if possessions > 0 else 0

    # Offensive Rebound % (simplified)
    orb_opp = team_totals.get("opponent_def_rebounds", 20) or 20
    orb_pct = round(100 * box["offRebounds"] / (box["offRebounds"] + orb_opp), 1) if (box["offRebounds"] + orb_opp) > 0 else 0

    # Free Throw Rate
    ftr = round(fta / fga, 3) if fga > 0 else 0

    return {
        "efgPct": efg_pct,
        "ppp": ppp,
        "usgPct": min(usg_pct, 50.0),  # Cap at reasonable max
        "toPct": to_pct,
        "orbPct": orb_pct,
        "ftr": ftr,
    }
