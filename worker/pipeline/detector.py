"""
Stubbed RF-DETR (Vision Transformer) object detector for basketball.
In production: loads RF-DETR weights and runs real inference.
For prototype: returns synthetic detections for 10 players + ball.
"""
import random


class RFDETRDetector:
    def __init__(self, model_path: str = None):
        self.model_loaded = False
        self.court_width = 940   # ~94ft court in 10x scale
        self.court_height = 500  # ~50ft court in 10x scale
        print("[RF-DETR] Detector initialized (stubbed mode)")

    def detect_frame(self, frame, frame_idx: int = 0) -> list:
        """
        Returns list of detections per frame.
        Each detection: { bbox, confidence, class_name, player_idx }
        Stubbed: generates realistic-looking positions that drift over time.
        """
        detections = []
        random.seed(frame_idx * 7)  # Deterministic per frame for consistency

        for i in range(10):
            # Players move in semi-realistic patterns
            base_x = 100 + (i % 5) * 160 + random.randint(-30, 30)
            base_y = 80 + (i // 5) * 280 + random.randint(-20, 20)
            # Add frame-based drift
            drift_x = int(30 * (0.5 - random.random()) + 5 * (frame_idx % 60))
            drift_y = int(20 * (0.5 - random.random()))

            x1 = max(0, min(base_x + drift_x, self.court_width - 60))
            y1 = max(0, min(base_y + drift_y, self.court_height - 120))

            detections.append({
                "bbox": [x1, y1, x1 + 60, y1 + 120],
                "confidence": round(random.uniform(0.88, 0.99), 3),
                "class_name": "player",
                "player_idx": i,
                "team": "home" if i < 5 else "away",
            })

        # Ball detection
        ball_handler = random.randint(0, 9)
        bx = detections[ball_handler]["bbox"][0] + 20
        by = detections[ball_handler]["bbox"][1] - 10
        detections.append({
            "bbox": [bx, by, bx + 15, by + 15],
            "confidence": round(random.uniform(0.90, 0.99), 3),
            "class_name": "ball",
            "player_idx": -1,
            "team": None,
        })

        return detections
