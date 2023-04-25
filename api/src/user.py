from pydantic import BaseModel, EmailStr
from typing import Optional
from bson.objectid import ObjectId
from passlib.hash import bcrypt
from db import get_user_collection

# Remplacez ceci par votre propre clé secrète
SECRET_KEY = "123"

user_collection = get_user_collection()


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
    async def get_by_id(user_id: str) -> Optional[UserOut]:
        result = await user_collection.find_one({"_id": ObjectId(user_id)})
        if result:
            return UserOut(**result)
        return None

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
    async def verify_password(email: str, password: str) -> bool:
        user_dict = await user_collection.find_one({"email": email})
        if user_dict:
            return bcrypt.verify(password, user_dict["password"])
        return False
