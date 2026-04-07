import os

# All values default to local Docker dev. Production (Supabase/Upstash) must set env vars explicitly.
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
S3_BUCKET = os.environ.get("S3_BUCKET", "clutch-uploads")
S3_TRAJECTORIES_BUCKET = os.environ.get("S3_TRAJECTORIES_BUCKET", "clutch-trajectories")
S3_ENDPOINT = os.environ.get("S3_ENDPOINT", "http://localhost:9000")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "clutch_access")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "clutch_secret")
API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3001")
WORKER_SECRET = os.environ.get("WORKER_SECRET", "clutch-worker-secret-change-in-production")
