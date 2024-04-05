from pydantic import BaseModel
from datetime import datetime


class Email(BaseModel):
    email: str


    class Config:
        from_attributes = True


class BasicAuthentication(Email):
    password: str 


    class Config:
        from_attributes = True


class UserCreate(BasicAuthentication):
    confirmation_code: str
    confirmation_code_expiration_time: datetime


    class Config:
        from_attributes = True


class UserSchema(UserCreate):
    confirmation_code: str
    confirmation_code_expiration_time: datetime


    class Config:
        from_attributes = True