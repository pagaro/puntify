# src/music_routes.py
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends
from typing import List

from dependencies import is_token_valid, is_user_admin
from music import MusicIn, MusicOut, CRUDMusic

router = APIRouter()


@router.post("/music/", response_model=MusicOut,dependencies=[Depends(is_user_admin)])
async def create_music(name: str = Form(...), artist: str = Form(...),
                       duration: float = Form(...), file: UploadFile = File(...), ):
    music_in = MusicIn(name=name, artist=artist, duration=duration, file=file)
    return await CRUDMusic.create(music_in)


@router.get("/music/", response_model=List[MusicOut], dependencies=[Depends(is_token_valid)])
async def get_all_music():
    return await CRUDMusic.get_all()


@router.get("/music/{id}", response_model=MusicOut, dependencies=[Depends(is_token_valid)])
async def get_music_by_id(id: str):
    music = await CRUDMusic.get_by_id(id)
    if not music:
        raise HTTPException(status_code=404, detail="La musique n'a pas été trouvée")

    return music


@router.get("/stream/{id_file}", dependencies=[Depends(is_token_valid)])
async def stream_music(id_file: str):
    stream_music = await CRUDMusic.read_file(id_file)
    if not stream_music:
        raise HTTPException(status_code=404, detail="Stream music n'a pas été trouvée")
    return stream_music
