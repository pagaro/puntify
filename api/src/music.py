# src/music.py
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId
from typing import List
from fastapi import Response, UploadFile, HTTPException
from starlette.responses import StreamingResponse

from db import get_music_collection, get_gridfs
import mimetypes

music_collection = get_music_collection()


class MusicBase(BaseModel):
    name: str
    artist: str
    cover_art: Optional[str] = None
    duration: int


class MusicIn(MusicBase):
    file: UploadFile


class MusicOut(MusicBase):
    id: Optional[str] = None
    url: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "id": "6135b5da8e8390a6a1a6a983",
                "name": "Exemple de musique",
                "artist": "Artiste Exemple",
                "cover": "URL de la pochette",
                "duration": 180,
                "url": "URL du fichier audio"
            }
        }


class MusicInDB(MusicBase):
    pass


class CRUDMusic:
    @staticmethod
    async def create(music: MusicIn) -> MusicOut:
        music_doc = music.dict()
        file = music_doc.pop("file")

        music_file_gridfs = get_gridfs(bucket_name="music")
        # gridfs = get_gridfs(bucket_name="music_files")
        # file_id = await gridfs. put(file.file, filename=file.filename, content_type=file.content_type)
        file_id = await music_file_gridfs.upload_from_stream(file.filename, file.file)

        music_doc["file_id"] = file_id
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

        music_out = MusicOut(**music)
        # Assurez-vous que l'URL correspond à la route où vous servez les fichiers audio
        music_out.id = str(music["_id"])
        music_out.url = f"http://localhost:8000/music/stream/{str(music['file_id'])}"
        return music_out

    @staticmethod
    async def read_file(file_id: str):
        # Récupérez le fichier audio à partir de GridFS
        gridfs = get_gridfs(bucket_name="music")
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

    # Vous pouvez ajouter d'autres méthodes CRUD ici (get_by_id, update, delete, etc.)
