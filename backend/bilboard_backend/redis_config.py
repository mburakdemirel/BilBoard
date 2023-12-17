"""
Redis config for bilboard_backend project.
"""

from django.core.cache import cache
import time
import redis
redis_instance = redis.StrictRedis(host='127.0.0.1', port=6379, db=1)

def get_redis_instance():
    return redis.StrictRedis(host='127.0.0.1', port=6379, db=1)