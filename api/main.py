from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from src.user_routes import router as user_router
from src.music_routes import router as music_router

app = FastAPI()

app.include_router(user_router)
app.include_router(music_router)

origins = [
    "http://localhost:3000",  # L'origine de votre application React
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(
#     admin_routes,
#     prefix="/admin",
#     tags=["admin"],
#     dependencies=[Depends(is_user_admin)],
#     responses={418: {"description": "I'm a teapot"}},
# )
#
# app.include_router(
#     users,
#     prefix="/users",
#     tags=["users"],
#     dependencies=[Depends(is_user_admin)],
#     responses={418: {"description": "I'm a teapot"}},
# )
#
# app.include_router(
#     login,
#     prefix="",
#     tags=["login"],
#     responses={418: {"description": "I'm a teapot"}},
# )
#
# app.include_router(
#     music_router,
#     prefix="/music",
#     tags=["app"],
#     dependencies=[Depends(is_token_valid)],
#     responses={418: {"description": "I'm a teapot"}},
# )
