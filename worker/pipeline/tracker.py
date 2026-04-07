"""
Stubbed ByteTrack multi-object tracker.
In production: maintains Kalman filters and Hungarian assignment.
For prototype: assigns consistent track IDs based on detection index.
"""


class ByteTracker:
    def __init__(self):
        self.track_id_counter = 0
        self.active_tracks = {}
        print("[ByteTrack] Tracker initialized (stubbed mode)")

    def update(self, detections: list, frame_id: int) -> list:
        """
        Takes per-frame detections, returns tracked objects with stable IDs.
        Stubbed: uses player_idx as consistent track ID.
        """
        tracked = []
        for det in detections:
            player_idx = det.get("player_idx", -1)

            # Ball gets special track ID
            if det["class_name"] == "ball":
                track_id = 100
            else:
                track_id = player_idx

            tracked.append({
                **det,
                "track_id": track_id,
                "frame_id": frame_id,
            })

        return tracked
