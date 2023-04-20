from datetime import datetime, timedelta
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
from passlib.hash import bcrypt

# Remplacez ces variables par vos propres valeurs
username = "api"
password = "api"
database_name = "puntify"
# Créez l'URI de connexion en incluant le nom d'utilisateur et le mot de passe
# todo a changer quand ca sera sur docker
connection_uri = f"mongodb://{username}:{password}@localhost/{database_name}"

client = AsyncIOMotorClient(connection_uri)
db = client["puntify"]
user_collection = db["users"]

# Remplacez ceci par votre propre clé secrète
SECRET_KEY = "123"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class UserBase(BaseModel):
    email: EmailStr
    username: str
    admin: bool = False


class UserIn(UserBase):
    password: str


class UserOut(UserBase):
    id: Optional[str] = None


class UserOutPass(UserOut):
    hashed_password: str


class CRUDUser:
    @staticmethod
    async def create(user_data: UserIn) -> UserOut:
        user_dict = user_data.dict()
        user_dict["password"] = bcrypt.hash(user_dict["password"])
        result = await user_collection.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        del user_dict["password"]
        return UserOut(**user_dict)

    @staticmethod
    async def get_by_email(email: str) -> Optional[UserOutPass]:
        user_dict = await user_collection.find_one({"email": email})
        if user_dict:
            user_dict["id"] = str(user_dict["_id"])
            del user_dict["_id"]
            user_dict["hashed_password"] = user_dict["password"]
            return UserOutPass(**user_dict)
        return None

    @staticmethod
    async def get_by_username(username: str) -> Optional[UserOutPass]:
        user_dict = await user_collection.find_one({"username": username})
        if user_dict:
            user_dict["id"] = str(user_dict["_id"])
            del user_dict["_id"]
            user_dict["hashed_password"] = user_dict["password"]
            return UserOutPass(**user_dict)
        return None

    @staticmethod
    async def verify_password(email: str, password: str) -> bool:
        user_dict = await user_collection.find_one({"email": email})
        if user_dict:
            return bcrypt.verify(password, user_dict["password"])
        return False

    @staticmethod
    async def update(user_id: str, update_data: UserIn) -> Optional[UserOut]:
        update_dict = update_data.dict()
        if "password" in update_dict:
            update_dict["password"] = bcrypt.hash(update_dict["password"])
        result = await user_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_dict}
        )
        if result.modified_count:
            updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
            updated_user["id"] = str(updated_user["_id"])
            del updated_user["_id"]
            del updated_user["password"]
            return UserOut(**updated_user)
        return None

    @staticmethod
    async def delete(user_id: str) -> bool:
        result = await user_collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[UserOut]:
        result = await db.users.find_one({"_id": ObjectId(user_id)})
        if result:
            return UserOut(**result)
        return None

    @staticmethod
    async def create_access_token(user: UserOutPass):
        # Utilisez l'ID de l'utilisateur comme identifiant unique
        user_id = str(user.id)

        # Définissez la durée de validité du token (par exemple, 24 heures)
        expiration = datetime.utcnow() + timedelta(hours=1)

        # Créez le payload du JWT
        payload = {
            "sub": user_id,
            "exp": expiration,
        }

        # Générez le token JWT en utilisant la clé secrète et le payload
        access_token = jwt.encode(payload, key=SECRET_KEY, algorithm="HS256")
        return access_token

    @staticmethod
    async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserOut:
        try:
            payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")
            print(payload)
            if user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

            return await CRUDUser.get_by_id(user_id)
        except jwt.PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
