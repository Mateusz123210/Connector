from pydantic import BaseModel


class Email(BaseModel):
    email: str


    class Config:
        orm_mode = True


class BasicAuthentication(Email):
    password: str 


    class Config:
        orm_mode = True
    