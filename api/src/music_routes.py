# src/music_routes.py
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends
from typing import List

from dependencies import is_token_valid, is_user_admin
from music import MusicOut, CRUDMusic, MusicInUpdate

router = APIRouter()


@router.post("/music/", response_model=MusicOut, dependencies=[Depends(is_user_admin)])
async def create_music(file: UploadFile):
    return await CRUDMusic.create(file)


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
    stream_music = await CRUDMusic.stream_file(id_file)
    if not stream_music:
        raise HTTPException(status_code=404, detail="Stream music n'a pas été trouvée")
    return stream_music


@router.put("/music/{music_id}", response_model=MusicOut, dependencies=[Depends(is_user_admin)])
async def update_music(music_id: str, music_data: MusicInUpdate):
    return await CRUDMusic.update(music_id, music_data)


@router.delete("/music/{music_id}", dependencies=[Depends(is_user_admin)])
async def delete_music(music_id: str):
    await CRUDMusic.delete(music_id)
