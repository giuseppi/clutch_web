"""
Main video processing pipeline.
Orchestrates: Download → Detect → Track → Build Trajectory → Upload → Analytics
"""
import json
import time
import boto3
from .detector import RFDETRDetector
from .tracker import ByteTracker
from ..config import S3_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_TRAJECTORIES_BUCKET


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name="us-east-1",
    )


def process_video(job_data: dict, progress_callback=None) -> dict:
    """
    Main pipeline — stubbed for prototype.
    Simulates processing a 2-minute video at 60fps (7200 frames).
    """
    job_id = job_data["jobId"]
    match_id = job_data.get("matchId")
    session_id = job_data.get("sessionId")
    entity_id = match_id or session_id

    print(f"\n{'='*60}")
    print(f"  CLUTCH AI PIPELINE — Job {job_id[:8]}...")
    print(f"  Type: {job_data['type']} | Entity: {entity_id[:8]}...")
    print(f"{'='*60}\n")

    # Step 1: Simulate video download
    print("[1/5] Downloading video from S3...")
    time.sleep(1)
    if progress_callback:
        progress_callback(5)

    # Step 2: Initialize models
    print("[2/5] Loading RF-DETR model + ByteTrack tracker...")
    detector = RFDETRDetector()
    tracker = ByteTracker()
    time.sleep(0.5)
    if progress_callback:
        progress_callback(10)

    # Step 3: Frame-by-frame inference
    fps = 60
    total_frames = 7200  # 2 minutes @ 60fps
    trajectory_data = {
        "matchId": match_id,
        "sessionId": session_id,
        "jobId": job_id,
        "fps": fps,
        "totalFrames": total_frames,
        "frames": [],
    }

    print(f"[3/5] Running inference on {total_frames} frames...")
    for frame_idx in range(total_frames):
        # Detect
        detections = detector.detect_frame(None, frame_idx)
        # Track
        tracked = tracker.update(detections, frame_idx)

        # Store every 10th frame to keep JSON manageable
        if frame_idx % 10 == 0:
            trajectory_data["frames"].append({
                "frame": frame_idx,
                "timestamp": round(frame_idx / fps, 3),
                "objects": tracked,
            })

        # Progress updates
        if frame_idx % 720 == 0:
            pct = 10 + int((frame_idx / total_frames) * 60)
            if progress_callback:
                progress_callback(pct)
            print(f"   Frame {frame_idx}/{total_frames} ({pct}%) — "
                  f"{len(detections)} detections")

    if progress_callback:
        progress_callback(75)

    # Step 4: Upload trajectory JSON to S3
    print("[4/5] Uploading trajectory data to S3...")
    s3 = get_s3_client()
    trajectory_key = f"trajectories/{entity_id}/{job_id}.json"

    s3.put_object(
        Bucket=S3_TRAJECTORIES_BUCKET,
        Key=trajectory_key,
        Body=json.dumps(trajectory_data),
        ContentType="application/json",
    )
    if progress_callback:
        progress_callback(85)

    print(f"   → Stored at s3://{S3_TRAJECTORIES_BUCKET}/{trajectory_key}")

    # Step 5: Run analytics
    print("[5/5] Computing analytics...")
    if progress_callback:
        progress_callback(90)

    return {
        "trajectoryS3Key": trajectory_key,
        "totalFrames": total_frames,
        "fps": fps,
    }
