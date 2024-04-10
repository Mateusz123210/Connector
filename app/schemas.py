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


class BasicConfirmationForDeleteAccount(BasicAuthentication):
    access_token: str 


    class Config:
        from_attributes = True


class BasicConfirmation(Email):
    access_token: str

    class Config:
        from_attributes = True


class BasicConfirmationForFetchingAES(BasicConfirmation):
    receiver: str

    class Config:
        from_attributes = True


class RefreshToken(Email):
    refresh_token: str

    class Config:
        from_attributes = True


class BasicConfirmationWithVerificationCode(BasicConfirmation):
    verification_code: str

    class Config:
        from_attributes = True


class BasicConfirmationForMessageSend(BasicConfirmation):
    message: str
    receiver: str


    class Config:
        from_attributes = True


class BasicConfirmationForMessageFetch(BasicConfirmation):
    caller: str
    

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


class TokenSchema(BaseModel):
    access_token: str
    access_token_expiration_time: datetime
    refresh_token: str
    refresh_token_expiration_time: datetime


    class Config:
        from_attributes = True


class TokenSchemaWithVerificationCode(TokenSchema):
    verification_code: str
    verification_code_expiration_time: datetime
    verification_code_enter_attempts: int
    verification_code_type: str


    class Config:
        from_attributes = True