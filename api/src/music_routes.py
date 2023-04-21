# src/music_routes.py
from bson import ObjectId
from fastapi import APIRouter, Header, Depends, Form, File, UploadFile, HTTPException
from typing import List

from motor.motor_asyncio import AsyncIOMotorClient

from .music import MusicIn, MusicOut, CRUDMusic

router = APIRouter()


# @router.post("/music/", response_model=MusicOut)
# async def create_music(music: MusicIn = Depends()):
#     return await CRUDMusic.create(music)

@router.post("/music/", response_model=MusicOut)
async def create_music(name: str = Form(...),
                       artist: str = Form(...),
                       duration: float = Form(...),
                       file: UploadFile = File(...), ):
    music_in = MusicIn(name=name, artist=artist, duration=duration, file=file)
    return await CRUDMusic.create(music_in)


@router.get("/music/", response_model=List[MusicOut])
async def get_all_music():
    return await CRUDMusic.get_all()


@router.get("/music/{id}", response_model=MusicOut)
async def get_music_by_id(id: str):
    music = await CRUDMusic.get_by_id(id)
    if not music:
        raise HTTPException(status_code=404, detail="La musique n'a pas été trouvée")

    return music

@router.get("/music/stream/{id_file}")
async def stream_music(id_file: str):
    stream_music = await CRUDMusic.read_file(id_file)
    if not stream_music:
        raise HTTPException(status_code=404, detail="Stream music n'a pas été trouvée")
    return  stream_music

