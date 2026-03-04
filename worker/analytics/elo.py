"""
Universal Player Rating (Custom Elo/MMR) Algorithm.
0-99 scale. Synthesizes basic + advanced basketball metrics.
"""
import math
from .constants import (
    WEIGHTS, BASE_MMR, MMR_MIN, MMR_MAX,
    BASE_K_FACTOR, INTERNAL_SCALE,
    PERFORMANCE_WEIGHT, WIN_WEIGHT,
    NEW_PLAYER_GAMES, VOLATILITY_BONUS,
)


def compute_game_impact_score(box: dict, advanced: dict) -> float:
    """
    Compute Game Impact Score (GIS) — weighted composite of all metrics.
    Normalized to 0.0-1.0 scale.
    """
    fga = box.get("fgAttempted", 1) or 1
    possessions = fga + 0.44 * box.get("ftAttempted", 0) + box.get("turnovers", 0)

    # Normalize each input to roughly 0-1 range
    efg_norm = min(advanced.get("efgPct", 50) / 100, 1.0)
    ppp_norm = min(advanced.get("ppp", 1.0) / 2.0, 1.0)
    usg_norm = min(advanced.get("usgPct", 20) / 40, 1.0)

    ast = box.get("assists", 0)
    tov = box.get("turnovers", 0)
    ast_to = ast / max(tov, 1)
    ast_to_norm = min(ast_to / 4.0, 1.0)

    pm = box.get("plusMinus", 0)
    pm_norm = (pm + 20) / 40  # -20 → 0, +20 → 1
    pm_norm = max(0, min(1, pm_norm))

    stl_pct = box.get("steals", 0) / max(box.get("minutes", 1), 1) * 40
    stl_norm = min(stl_pct / 5.0, 1.0)

    blk_pct = box.get("blocks", 0) / max(box.get("minutes", 1), 1) * 40
    blk_norm = min(blk_pct / 4.0, 1.0)

    orb_norm = min(advanced.get("orbPct", 0) / 15, 1.0)
    to_norm = min(advanced.get("toPct", 15) / 30, 1.0)
    ftr_norm = min(advanced.get("ftr", 0.3) / 0.6, 1.0)

    min_factor = min(box.get("minutes", 20) / 40, 1.0)

    gis = (
        WEIGHTS["efg_pct"] * efg_norm
        + WEIGHTS["ppp"] * ppp_norm
        + WEIGHTS["usg_pct"] * usg_norm
        + WEIGHTS["ast_to_ratio"] * ast_to_norm
        + WEIGHTS["plus_minus"] * pm_norm
        + WEIGHTS["stl_pct"] * stl_norm
        + WEIGHTS["blk_pct"] * blk_norm
        + WEIGHTS["orb_pct"] * orb_norm
        + WEIGHTS["to_pct"] * to_norm  # Weight is already negative
        + WEIGHTS["ftr"] * ftr_norm
        + WEIGHTS["minutes_factor"] * min_factor
    )

    # Normalize to 0-1
    return max(0.0, min(1.0, gis + 0.3))  # Offset to center around 0.5


def expected_score(player_mmr: float, opponent_avg_mmr: float) -> float:
    """Standard Elo expected score, scaled for 0-99 range."""
    return 1.0 / (1.0 + 10 ** ((opponent_avg_mmr - player_mmr) / (INTERNAL_SCALE / 10)))


def compute_mmr_update(
    player_mmr: float,
    opponent_avg_mmr: float,
    game_impact_score: float,
    won: bool,
    games_played: int = 10,
) -> dict:
    """
    Compute new MMR rating.

    Returns dict with: previousRating, newRating, delta
    """
    # Win/loss modifier
    win_factor = 1.0 if won else 0.0

    # Blend performance with result
    adjusted_score = PERFORMANCE_WEIGHT * game_impact_score + WIN_WEIGHT * win_factor

    # Expected score
    exp = expected_score(player_mmr, opponent_avg_mmr)

    # Dynamic K-factor
    k = BASE_K_FACTOR
    if games_played < NEW_PLAYER_GAMES:
        k *= (1 + VOLATILITY_BONUS)

    # Delta
    delta = k * (adjusted_score - exp)

    # Apply bounds
    new_mmr = max(MMR_MIN, min(MMR_MAX, player_mmr + delta))
    actual_delta = round(new_mmr - player_mmr, 2)

    return {
        "previousRating": round(player_mmr, 2),
        "newRating": round(new_mmr, 2),
        "delta": actual_delta,
    }
