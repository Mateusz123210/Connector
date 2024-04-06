from fastapi import HTTPException, Depends, status
from app.mail import mail_sender
from fastapi.security import OAuth2PasswordRequestForm
from . import crud
from app.random_numbers import verification_code_generator
from datetime import datetime, timedelta, UTC
from app.utils import create_access_token, create_refresh_token
from app.random_numbers import jwt_token_generator
from app.schemas import *
from app import main
from app.decorators.database import transactional
import pytz
from jose import jwt
from .utils import (
    ALGORITHM#,
    # JWT_SECRET_KEY
)
from pydantic import ValidationError

@transactional
def register(data: BasicAuthentication):
    if main.objects[2].validate_email(data.email) is False:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    db_user = crud.get_user_by_email(email=data.email)
    if db_user:
        utc=pytz.UTC
        datetime_now = datetime.now(UTC)
        confirmation_code_expiration_time = utc.localize(db_user.confirmation_code_expiration_time)

        if db_user.is_active == False and \
            datetime_now > confirmation_code_expiration_time:
            crud.delete_user(db_user)
            
        else:
            raise HTTPException(status_code=400, detail="Email unavailable to " + 
                                str(confirmation_code_expiration_time) + "UTC due to not confirmation!")

    if main.objects[2].validate_password(data.password) is False:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    hashed_password = main.objects[1].hash_password(data.password)
    verification_code = verification_code_generator.generate_verification_code()
    verification_code_expiration_time = datetime.now(UTC) + timedelta(minutes=5)
    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    refresh_token_key = jwt_token_generator.generate_jwt_secret_key()

    db_user = crud.create_user(UserCreate(email=data.email, password=hashed_password, confirmation_code=verification_code,
                                confirmation_code_expiration_time=verification_code_expiration_time))
    access_token = create_access_token(data.email, access_token_key)
    refresh_token = create_refresh_token(data.email, refresh_token_key)
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=5)
    refresh_token_expiration_time = datetime.now(UTC) + timedelta(minutes=60*24)
    crud.create_user_tokens(db_user=db_user.id, access_token=access_token_key, refresh_token=refresh_token_key, 
                            access_token_expiration_time=access_token_expiration_time,
                            refresh_token_expiration_time=refresh_token_expiration_time)
    
    # mail_sender.send_email_with_verification_code_for_registration(main.objects[0], '252808@student.pwr.edu.pl', 
    #                                                                verification_code)
    print(verification_code) 

    return {"message": "Confirm registration",
            "access_token": access_token,
            "refresh_token": refresh_token}

@transactional
def confirm_registration(data: BasicConfirmation):
    print("verification")
    print(data)
    # user = crud.get_user_by_email(email=data.email)
    # print(user)
    # if user.confirmation_code != data.verification_code:
    #     raise HTTPException(status_code=400, detail="Invalid verification code")
    #TO DO Too many attempts to verify verification_code





    return {}

@transactional
def login(data: OAuth2PasswordRequestForm = Depends()):
    
    db_user = crud.get_user_by_email(email=data.email)
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    hashed_password = main.objects[1].hash_password(data.password)
    if hashed_password != db_user.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")


    verification_code = verification_code_generator.generate_verification_code()
    verification_code_expiration_time = datetime.now(UTC) + timedelta(minutes=5)
    print(verification_code) 
    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    refresh_token_key = jwt_token_generator.generate_jwt_secret_key()
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=5)
    refresh_token_expiration_time = datetime.now(UTC) + timedelta(minutes=60*24)
    # db_user = crud.create_user(UserCreate(email=data.email, password=hashed_password, confirmation_code=verification_code,
    #                             confirmation_code_expiration_time=verification_code_expiration_time))
    access_token = create_access_token(data.email, access_token_key, 5)
    refresh_token = create_refresh_token(data.email, refresh_token_key)


    

    # mail_sender.send_email_with_verification_code_for_login(main.objects[0], '252808@student.pwr.edu.pl', verification_code) 
    return {"message": "Confirm registration",
            "access_token": access_token,
            "refresh_token": refresh_token}

@transactional
def confirm_login( ):
    

    return {}

@transactional
def reset_password():




    verification_code = verification_code_generator.generate_verification_code()
    print(verification_code) 
    # mail_sender.send_email_with_verification_code_for_password_reset(main.objects[0], '252808@student.pwr.edu.pl', verification_code) 
    return {}

@transactional
def confirm_reset_password( ):
    

    return {}

@transactional
def logout():
    return {}

@transactional
def send_message():
    return {}

@transactional
def get_messages():
    print("messages")
    return {}

@transactional
def validate_user_token(data: BasicConfirmation):
    db_user = crud.get_user_by_email(email=data.email)
    db_user_tokens = crud.get_user_tokens(db_user)

    found = False
    expired = True

    for db_token in db_user_tokens:
        try:
            payload = jwt.decode(
                data.access_token, db_token.access_token, algorithms=[ALGORITHM]
            )
            if payload["sub"] == data.email:
                found = True
                utc=pytz.UTC
                datetime_now = datetime.now(UTC)
                token_expiration_time = utc.localize(db_token.access_token_expiration_time)
                if datetime_now <= token_expiration_time:
                    expired = False                
    
        except(jwt.JWTError, ValidationError):
            pass
        
    if found is False:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    if expired is True:
        raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    return data



