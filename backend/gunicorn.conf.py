# Gunicorn configuration for AWS Elastic Beanstalk
# Production-optimized settings for Plattdeutsch TTS

import os
import multiprocessing

# Server socket
bind = "0.0.0.0:" + os.environ.get("PORT", "5000")
backlog = 2048

# Worker processes
# For TTS (CPU-intensive), use fewer workers with more threads
workers = int(os.environ.get("WEB_CONCURRENCY", 2))
worker_class = "sync"  # Use sync for CPU-bound TTS operations
threads = 1  # Single thread per worker for TTS
worker_connections = 1000
timeout = 120  # TTS generation can take time
keepalive = 5

# Spew (debugging) - keep False in production
spew = False

# Server mechanics
daemon = False
raw_env = []
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Logging
errorlog = "-"
loglevel = os.environ.get("LOG_LEVEL", "info")
accesslog = "-"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "plattdeutsch-tts"

# Server hooks
def on_starting(server):
    """Called before master process is initialized."""
    pass

def on_reload(server):
    """Called when USR1 is received."""
    pass

def worker_int(worker):
    """Called when worker receives INT or QUIT."""
    pass

def worker_abort(worker):
    """Called when worker receives SIGABRT."""
    pass

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    pass

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    pass

def post_worker_init(worker):
    """Called just after a worker has initialized."""
    pass

def worker_exit(server, worker):
    """Called just after a worker has exited."""
    pass

def nworkers_changed(server, new_value, old_value):
    """Called when worker count changes."""
    pass

def pre_exec(server):
    """Called just before exec()."""
    pass
