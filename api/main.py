from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.user_routes import router as user_router

app = FastAPI()

app.include_router(user_router)

origins = [
    "http://localhost:3000",  # L'origine de votre application React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
