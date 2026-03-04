"""
Game State Parser — converts trajectory coordinates into basketball events.
In production: uses spatial heuristics (ball near hoop, player clustering, etc.)
For prototype: generates synthetic but realistic game events.
"""
import random


EVENT_TYPES = [
    "shot_made_2pt", "shot_missed_2pt",
    "shot_made_3pt", "shot_missed_3pt",
    "free_throw_made", "free_throw_missed",
    "assist", "turnover", "steal",
    "block", "offensive_rebound", "defensive_rebound",
    "foul",
]

HIGHLIGHT_EVENTS = ["shot_made_3pt", "block", "steal", "shot_made_2pt"]


def parse_trajectory_to_events(trajectory_json: dict) -> list:
    """
    Parse raw tracking data into game events with timestamps.
    Stubbed: generates ~80-120 realistic events for a 2-minute game segment.
    """
    total_frames = trajectory_json.get("totalFrames", 7200)
    fps = trajectory_json.get("fps", 60)
    duration = total_frames / fps

    events = []
    random.seed(42)  # Deterministic for demo consistency

    num_events = random.randint(80, 120)

    for i in range(num_events):
        frame = random.randint(0, total_frames - 1)
        timestamp = round(frame / fps, 2)
        player_track_id = random.randint(0, 9)
        event_type = random.choice(EVENT_TYPES)

        # Court coordinates (0-94 x 0-50 feet)
        event = {
            "type": event_type,
            "frame": frame,
            "timestamp": timestamp,
            "player_track_id": player_track_id,
            "team": "home" if player_track_id < 5 else "away",
            "coordinates": {
                "x": round(random.uniform(0, 94), 1),
                "y": round(random.uniform(0, 50), 1),
            },
        }
        events.append(event)

    return sorted(events, key=lambda e: e["frame"])


def generate_play_tags(events: list) -> list:
    """
    Auto-generate play tags from detected events.
    These pre-populate the coach's annotation layer.
    """
    tags = []
    for event in events:
        label_map = {
            "shot_made_2pt": "2PT Made",
            "shot_missed_2pt": "2PT Miss",
            "shot_made_3pt": "3PT Made",
            "shot_missed_3pt": "3PT Miss",
            "assist": "Assist",
            "turnover": "Turnover",
            "steal": "Steal",
            "block": "Block",
            "free_throw_made": "FT Made",
            "free_throw_missed": "FT Miss",
            "offensive_rebound": "OREB",
            "defensive_rebound": "DREB",
            "foul": "Foul",
        }

        label = label_map.get(event["type"], event["type"])
        stat_type_map = {
            "shot_made_2pt": "FG", "shot_missed_2pt": "FG",
            "shot_made_3pt": "3PT", "shot_missed_3pt": "3PT",
            "assist": "AST", "turnover": "TOV", "steal": "STL",
            "block": "BLK", "foul": "PF",
        }

        tags.append({
            "label": f"{label} @ {_fmt_time(event['timestamp'])}",
            "timestamp": event["timestamp"],
            "statType": stat_type_map.get(event["type"]),
            "player_track_id": event["player_track_id"],
        })

    return tags


def generate_highlights(events: list) -> list:
    """
    Identify high-impact moments for highlight reels.
    Looks for: 3PT makes, blocks, steals, and-1 opportunities.
    """
    highlights = []
    for event in events:
        if event["type"] in HIGHLIGHT_EVENTS:
            event_labels = {
                "shot_made_3pt": "3PT_MADE",
                "block": "BLOCK",
                "steal": "STEAL",
                "shot_made_2pt": "DUNK",  # Simplified for prototype
            }
            highlights.append({
                "player_track_id": event["player_track_id"],
                "startTimestamp": max(0, event["timestamp"] - 3),
                "endTimestamp": event["timestamp"] + 2,
                "eventType": event_labels.get(event["type"], event["type"]),
                "description": f"{event_labels.get(event['type'], '')} at {_fmt_time(event['timestamp'])}",
            })

    return highlights


def _fmt_time(seconds: float) -> str:
    mins = int(seconds) // 60
    secs = int(seconds) % 60
    return f"{mins}:{secs:02d}"
