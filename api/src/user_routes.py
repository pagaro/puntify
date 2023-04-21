from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBasic, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

from user import UserIn, UserOut, CRUDUser

router = APIRouter()
security = HTTPBasic()


class Token(BaseModel):
    access_token: str
    token_type: str


# Créez un objet CryptContext pour gérer le hachage et la vérification des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def authenticate_user(username: str, password: str):
    user = await CRUDUser.get_by_username(username)
    if not user:
        user = await CRUDUser.get_by_email(username)
    if not user:
        return False
    if not pwd_context.verify(secret=password, hash=user.hashed_password):
        return False
    access_token = await CRUDUser.create_access_token(user)  # Appeler la fonction directement, sans utiliser CRUDUser
    return access_token


@router.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    existing_user = await CRUDUser.get_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="L'email est déjà utilisé.")
    return await CRUDUser.create(user)


@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    user = await CRUDUser.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    return user


@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: str, user: UserIn):
    updated_user = await CRUDUser.update(user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    return updated_user


@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    success = await CRUDUser.delete(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    return {"detail": "Utilisateur supprimé avec succès."}


@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    token = await authenticate_user(form_data.username, form_data.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/verify-token", response_model=UserOut)
async def verify_token(current_user: UserOut = Depends(CRUDUser.get_current_user)):
    return current_user
