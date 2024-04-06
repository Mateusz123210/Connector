from typing import Union, Any
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app import services


from jose import jwt
from pydantic import ValidationError
from app.schemas import *# TokenPayload, SystemUser
# from replit import db

# reuseable_oauth = OAuth2PasswordBearer(
#     tokenUrl="/login",
#     scheme_name="JWT"
# )


async def get_current_user(data: BasicConfirmation) :# = Depends(reuseable_oauth)              -> SystemUser
    return services.validate_user_token(data)