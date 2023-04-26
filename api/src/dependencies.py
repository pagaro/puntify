from datetime import datetime, timedelta
import jwt
from fastapi import Depends, HTTPException, status, Request
from pydantic import BaseModel
from typing import Optional
from user import UserOutPass, CRUDUser, UserOut

SECRET_KEY = "SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class TokenToto(BaseModel):
    access_token: str
    token_type: str


async def is_token_valid(request: Request) -> Optional[UserOut]:
    token = request.cookies.get("access_token")

    try:
        payload_token = jwt.decode(token, key=SECRET_KEY, algorithms=ALGORITHM)

        user = await CRUDUser.get_by_id(payload_token.get("user_id"))
        if user:
            return user

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def is_user_admin(user: UserOut = Depends(is_token_valid)):
    if user.admin:
        return user.admin
    raise HTTPException(status_code=status.HTTP_418_IM_A_TEAPOT, detail="Your are note admin")


async def token_create(user: UserOutPass):
    user_id = str(user.id)

    # Définissez la durée de validité du token (par exemple, 24 heures)
    expiration = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Créez le payload du JWT

    payload = {
        "exp": expiration,
        "user_id": user_id,
        "is_admin": user.admin,
    }

    access_token = jwt.encode(payload, key=SECRET_KEY, algorithm=ALGORITHM)
    return access_token
