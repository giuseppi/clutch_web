"""
Configurable weights for the Universal Player Rating algorithm.
These can be tuned as we gather real data.
"""

# Game Impact Score (GIS) weights
WEIGHTS = {
    "efg_pct": 0.15,
    "ppp": 0.15,
    "usg_pct": 0.10,
    "ast_to_ratio": 0.10,
    "plus_minus": 0.12,
    "stl_pct": 0.08,
    "blk_pct": 0.06,
    "orb_pct": 0.06,
    "to_pct": -0.08,  # Negative — turnovers hurt
    "ftr": 0.05,
    "minutes_factor": 0.05,  # Playing time adjustment
}

# Elo/MMR configuration
BASE_MMR = 50.0           # Starting MMR (0-99 scale)
MMR_MIN = 0.0             # Floor
MMR_MAX = 99.0            # Ceiling
BASE_K_FACTOR = 3.2       # K-factor on 0-99 scale (equiv to K=32 on 0-1000)
INTERNAL_SCALE = 400.0    # Elo denominator
PERFORMANCE_WEIGHT = 0.7  # How much individual performance matters vs win/loss
WIN_WEIGHT = 0.3          # How much the team result matters
NEW_PLAYER_GAMES = 5      # Games threshold for volatility bonus
VOLATILITY_BONUS = 0.5    # Extra K for new players (< NEW_PLAYER_GAMES)
