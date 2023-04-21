from motor.aiohttp import AIOHTTPGridFS
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

username = "api"
password = "api"
database_name = "puntify"


def get_db():
    # todo a changer quand ca sera sur docker
    connection_uri = f"mongodb://{username}:{password}@localhost/{database_name}"

    db = AsyncIOMotorClient(connection_uri)
    return db["puntify"]


def get_user_collection():
    db = get_db()
    return db["users"]


def get_music_collection():
    db = get_db()
    return db["musics"]


def get_gridfs(bucket_name: str) -> AsyncIOMotorGridFSBucket:
    db = get_db()
    gridfs = AsyncIOMotorGridFSBucket(db, bucket_name)
    return gridfs
