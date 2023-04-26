import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')


def get_db():
    connection_uri = f"mongodb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    db = AsyncIOMotorClient(connection_uri)
    return db["puntify"]


def get_user_collection():
    db = get_db()
    return db["users"]


def get_music_collection():
    db = get_db()
    return db["musics"]


def get_gridfs(bucket_name: str = "music") -> AsyncIOMotorGridFSBucket:
    db = get_db()
    gridfs = AsyncIOMotorGridFSBucket(db, bucket_name)
    return gridfs
