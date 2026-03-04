"""
Clutch AI Worker — Redis consumer entrypoint.
Consumes video processing jobs from the 'clutch:video:pending' Redis list.
Runs RF-DETR detection + ByteTrack tracking + analytics computation.
"""
import json
import time
import traceback
import redis
import requests

from config import REDIS_URL, API_BASE_URL, WORKER_SECRET
from pipeline.processor import process_video
from analytics.game_state import parse_trajectory_to_events, generate_play_tags, generate_highlights
from analytics.stats import compute_box_score, compute_advanced_stats
from analytics.elo import compute_game_impact_score, compute_mmr_update

r = redis.from_url(REDIS_URL)
HEADERS = {"X-Worker-Secret": WORKER_SECRET, "Content-Type": "application/json"}


def update_progress(job_id: str, progress: int, status: str = "PROCESSING"):
    """Update real-time progress in Redis for frontend polling."""
    r.hset(f"job:{job_id}", mapping={"progress": str(progress), "status": status})


def update_job_status(job_id: str, status: str, error_msg: str = None):
    """Callback to Node.js API to update DB record."""
    payload = {"status": status}
    if error_msg:
        payload["errorMessage"] = error_msg
    try:
        requests.patch(
            f"{API_BASE_URL}/api/v1/jobs/{job_id}/internal-update",
            json=payload,
            headers=HEADERS,
            timeout=10,
        )
    except Exception as e:
        print(f"[WARN] Failed to update job status via API: {e}")


def fetch_match_players(match_id: str) -> list:
    """Fetch player IDs for this match from the API."""
    try:
        resp = requests.get(
            f"{API_BASE_URL}/api/v1/matches/{match_id}",
            headers=HEADERS,
            timeout=10,
        )
        if resp.status_code == 200:
            match_data = resp.json()
            # Get players from both teams
            home_team_id = match_data.get("homeTeam", {}).get("id")
            away_team_id = match_data.get("awayTeam", {}).get("id")

            players = []
            for team_id in [home_team_id, away_team_id]:
                if team_id:
                    r2 = requests.get(
                        f"{API_BASE_URL}/api/v1/players?teamId={team_id}&limit=15",
                        headers=HEADERS,
                        timeout=10,
                    )
                    if r2.status_code == 200:
                        players.extend(r2.json().get("data", []))
            return players
    except Exception as e:
        print(f"[WARN] Failed to fetch players: {e}")
    return []


def process_match_job(job_data: dict, pipeline_result: dict):
    """
    Process a MATCH job: compute stats, update MMR, store results.
    Only MATCH jobs update the leaderboard.
    """
    match_id = job_data["matchId"]
    job_id = job_data["jobId"]

    # Fetch players for this match
    players = fetch_match_players(match_id)
    if not players:
        print("[WARN] No players found, generating synthetic data")
        # Generate 10 fake player IDs for demo
        players = [{"id": f"player-{i}", "mmr": 50, "teamId": f"team-{'home' if i < 5 else 'away'}", "position": "SG"}
                    for i in range(10)]

    # Parse trajectory into events
    trajectory_data = {"totalFrames": 7200, "fps": 60}
    events = parse_trajectory_to_events(trajectory_data)

    # Generate play tags and highlights
    raw_tags = generate_play_tags(events)
    raw_highlights = generate_highlights(events)

    # Compute stats for each player
    home_players = [p for i, p in enumerate(players) if i < 5 or p.get("teamId") == players[0].get("teamId")][:5]
    away_players = [p for i, p in enumerate(players) if i >= 5 or p.get("teamId") != players[0].get("teamId")][:5]

    all_stats = []
    team_totals = {"fgAttempted": 0, "ftAttempted": 0, "turnovers": 0, "minutes": 0, "opponent_def_rebounds": 20}

    for idx, player in enumerate(players[:10]):
        is_home = idx < 5
        box = compute_box_score(idx, is_home, 7200)
        team_totals["fgAttempted"] += box["fgAttempted"]
        team_totals["ftAttempted"] += box["ftAttempted"]
        team_totals["turnovers"] += box["turnovers"]
        team_totals["minutes"] += box["minutes"]

        advanced = compute_advanced_stats(box, team_totals)
        box.update(advanced)
        all_stats.append({"playerId": player["id"], **box})

    # Compute scores
    home_score = sum(s["points"] for s in all_stats[:5])
    away_score = sum(s["points"] for s in all_stats[5:10])
    home_won = home_score > away_score

    # Compute MMR updates
    home_avg_mmr = sum(p.get("mmr", 50) for p in players[:5]) / max(len(players[:5]), 1)
    away_avg_mmr = sum(p.get("mmr", 50) for p in players[5:10]) / max(len(players[5:10]), 1)

    elo_updates = []
    for idx, player in enumerate(players[:10]):
        is_home = idx < 5
        stat = all_stats[idx]
        advanced = {k: stat.get(k) for k in ["efgPct", "ppp", "usgPct", "toPct", "orbPct", "ftr"]}
        gis = compute_game_impact_score(stat, advanced)
        opponent_avg = away_avg_mmr if is_home else home_avg_mmr
        won = home_won if is_home else not home_won

        update = compute_mmr_update(
            player_mmr=player.get("mmr", 50),
            opponent_avg_mmr=opponent_avg,
            game_impact_score=gis,
            won=won,
            games_played=5,  # Simplified for prototype
        )
        elo_updates.append({"playerId": player["id"], **update})

    # Map play tags to player IDs
    play_tags = []
    for tag in raw_tags[:50]:  # Limit to 50 tags
        track_id = tag.get("player_track_id", 0)
        player_id = players[track_id]["id"] if track_id < len(players) else None
        play_tags.append({
            "label": tag["label"],
            "timestamp": tag["timestamp"],
            "statType": tag.get("statType"),
            "playerId": player_id,
        })

    # Map highlights to player IDs
    highlights = []
    for h in raw_highlights[:20]:  # Limit to 20 highlights
        track_id = h.get("player_track_id", 0)
        player_id = players[track_id]["id"] if track_id < len(players) else None
        if player_id:
            highlights.append({
                "playerId": player_id,
                "startTimestamp": h["startTimestamp"],
                "endTimestamp": h["endTimestamp"],
                "eventType": h["eventType"],
                "description": h.get("description"),
            })

    # Send results to API
    payload = {
        "matchId": match_id,
        "jobId": job_id,
        "trajectoryS3Key": pipeline_result["trajectoryS3Key"],
        "stats": all_stats,
        "playTags": play_tags,
        "highlights": highlights,
        "eloUpdates": elo_updates,
        "homeScore": home_score,
        "awayScore": away_score,
    }

    print(f"\n📊 Match Results: {home_score} - {away_score}")
    print(f"   MMR updates: {len(elo_updates)} players")
    print(f"   Play tags: {len(play_tags)} | Highlights: {len(highlights)}")

    resp = requests.post(
        f"{API_BASE_URL}/api/v1/analytics/compute",
        json=payload,
        headers=HEADERS,
        timeout=30,
    )

    if resp.status_code != 200:
        print(f"[ERROR] Analytics store failed: {resp.status_code} {resp.text}")
        raise Exception(f"Analytics store failed: {resp.text}")

    print("   ✅ Analytics stored successfully")


def main():
    print("\n" + "=" * 60)
    print("  🏀 CLUTCH AI WORKER")
    print("  Waiting for video processing jobs...")
    print("=" * 60 + "\n")

    while True:
        try:
            # Block until a job is available
            result = r.blpop("clutch:video:pending", timeout=0)
            if not result:
                continue

            _, raw = result
            job_data = json.loads(raw)
            job_id = job_data["jobId"]
            job_type = job_data.get("type", "MATCH")

            print(f"\n🎬 New job received: {job_id[:8]}... (type: {job_type})")

            # Update status to PROCESSING
            update_progress(job_id, 0, "PROCESSING")
            update_job_status(job_id, "PROCESSING")

            # Run the video processing pipeline
            pipeline_result = process_video(
                job_data,
                progress_callback=lambda p: update_progress(job_id, p),
            )

            # Run analytics (only for MATCH jobs)
            if job_type == "MATCH" and job_data.get("matchId"):
                process_match_job(job_data, pipeline_result)
            else:
                print(f"   ℹ️  Session job — analytics computed but MMR NOT updated")
                update_job_status(job_id, "COMPLETED")

            # Mark as completed
            update_progress(job_id, 100, "COMPLETED")
            print(f"\n✅ Job {job_id[:8]}... completed successfully\n")

        except Exception as e:
            traceback.print_exc()
            if 'job_id' in dir():
                update_progress(job_id, -1, "FAILED")
                update_job_status(job_id, "FAILED", str(e))
            print(f"\n❌ Job failed: {e}\n")

        except KeyboardInterrupt:
            print("\n👋 Worker shutting down...")
            break


if __name__ == "__main__":
    main()
