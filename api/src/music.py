# src/music.py
import os
from base64 import b64encode
from typing import Optional
from pydantic import BaseModel
from tinytag import TinyTag
from bson import ObjectId
from typing import List
from fastapi import UploadFile, HTTPException, status
from starlette.responses import StreamingResponse

from db import get_music_collection, get_gridfs

music_collection = get_music_collection()


class MusicBase(BaseModel):
    title: str
    duration: int
    album: Optional[str] = None  # album as string
    albumartist: Optional[str] = None  # album artist as string
    artist: Optional[str] = None  # artist name as string
    bitrate: Optional[int] = None  # bitrate in kBits/s
    filesize: Optional[int] = None   # file size in bytes
    genre: Optional[str] = None   # genre as string
    year: Optional[str] = None # year or date as string
    cover_art: Optional[str] = None


class MusicIn(BaseModel):
    file: UploadFile


class MusicInUpdate(MusicBase):
    pass


class MusicOut(MusicBase):
    id: str
    url: Optional[str] = None


class CRUDMusic:
    @staticmethod
    async def create(file_music: UploadFile) -> MusicOut:
        temp_file = os.path.join("./", file_music.filename)
        cover_art = None
        try:
            with open(temp_file, 'wb') as f:
                f.write(await file_music.read())

            tag = TinyTag.get(temp_file, image=True)
            cover = tag.get_image()
            music_doc = tag.as_dict()

            if not music_doc['title']:
                music_doc['title'] = file_music.filename
            if cover:
                cover_art = b64encode(cover).decode('utf-8')

            music_file_gridfs = get_gridfs()
            with open(temp_file, 'rb') as f:
                file_id = await music_file_gridfs.upload_from_stream(file_music.filename, f)

            os.remove(temp_file)

        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Invalid song format")

        music_doc["file_id"] = file_id
        music_doc["cover_art"] = cover_art
        music_id = await music_collection.insert_one(music_doc)
        return MusicOut(**music_doc, id=str(music_id.inserted_id))

    @staticmethod
    async def get_all() -> List[MusicOut]:
        cursor = music_collection.find()
        musics = await cursor.to_list(length=None)
        return [MusicOut(**music, id=str(music.pop("_id"))) for music in musics]

    @staticmethod
    async def get_by_id(music_id: str) -> Optional[MusicOut]:
        music = await music_collection.find_one({"_id": ObjectId(music_id)})
        if not music:
            raise HTTPException(status_code=404, detail="La musique n'a pas été trouvée")

        music_out = MusicOut(**music, id=music_id)
        # Assurez-vous que l'URL correspond à la route où vous servez les fichiers audio
        music_out.id = str(music["_id"])
        music_out.url = f"http://localhost:8000/stream/{str(music['file_id'])}"
        return music_out

    @staticmethod
    async def stream_file(file_id: str):
        # Récupérez le fichier audio à partir de GridFS
        gridfs = get_gridfs()
        gridfs_file = await gridfs.open_download_stream(ObjectId(file_id))

        if not gridfs_file:
            raise HTTPException(status_code=404, detail="Le fichier audio n'a pas été trouvé")

        # Créez une fonction pour lire les données du fichier audio
        async def read_file_data(file):
            chunk_size = 8192
            while data := await file.read(chunk_size):
                yield data

        # Créez une réponse en continu avec le fichier audio
        response = StreamingResponse(read_file_data(gridfs_file), media_type="audio/mpeg")

        return response

    @staticmethod
    async def update(music_id: str, music_data: MusicInUpdate) -> MusicOut:
        music_data = music_data.dict(exclude_unset=True)
        music_db = await music_collection.find_one({"_id": ObjectId(music_id)})
        if music_db:
            await music_collection.update_one({"_id": ObjectId(music_id)}, {"$set": music_data})
            music_db.update(music_data)
            return MusicOut(**music_db)
        else:
            raise HTTPException(status_code=404, detail="Music not found")

    @staticmethod
    async def delete(music_id: str) -> MusicOut:
        music_db = await music_collection.find_one({"_id": ObjectId(music_id)})
        if music_db:
            grid_fs_bucket = get_gridfs()
            await grid_fs_bucket.delete(ObjectId(music_db["file_id"]))

            await music_collection.delete_one({"_id": ObjectId(music_id)})
            return MusicOut(**music_db)
        else:
            raise HTTPException(status_code=404, detail="Music not found")
