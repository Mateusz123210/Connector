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
    ALGORITHM
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
        confirmation_code_expiration_time = utc.localize(db_user.registration_confirmation_code_expiration_time)

        if db_user.is_active == False and \
            (datetime_now > confirmation_code_expiration_time or 
            db_user.registration_confirmation_code_enter_attempts >=3):
            crud.delete_user(db_user)
            
        else:
            raise HTTPException(status_code=400, detail="Email unavailable to " + 
                                str(confirmation_code_expiration_time) + "UTC due to not confirmation!")
        
    if main.objects[2].validate_password(data.password) is False:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    hashed_password = main.objects[1].hash_password(data.password)
    verification_code = verification_code_generator.generate_verification_code()
    verification_code_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    db_user = crud.create_user(UserCreate(email=data.email, password=hashed_password, 
                                          confirmation_code=verification_code,
                                confirmation_code_expiration_time=verification_code_expiration_time))
    access_token = create_access_token(data.email, access_token_key)
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    crud.create_user_tokens(db_user=db_user, access_token=access_token_key, refresh_token=None, 
                            access_token_expiration_time=access_token_expiration_time,
                            refresh_token_expiration_time=None)
    
    mail_sender.send_email_with_verification_code_for_registration(main.objects[0], data.email, 
                                                                   verification_code)
    print(verification_code)

    return {"message": "Confirm registration",
            "access_token": access_token}

def confirm_registration1(data: BasicConfirmationWithVerificationCode):
    result = confirm_registration(data)
    if "exception" in result.keys():
        raise HTTPException(status_code=403, detail=result["exception"])
    else:
        return result

@transactional
def confirm_registration(data: BasicConfirmationWithVerificationCode):
    user = crud.get_user_by_email(email=data.email)
    if user is None:
        raise HTTPException(status_code=403, detail="User does not exist!")
    if user.is_active is True:
        raise HTTPException(status_code=403, detail="User is active!")
    utc=pytz.UTC
    verification_timeout = utc.localize(user.registration_confirmation_code_expiration_time)
    datetime_now = datetime.now(UTC)
    if datetime_now > verification_timeout:
        crud.delete_user(user) 
        return {"exception": "Verification code expired"}
    if user.registration_confirmation_code_enter_attempts >= 2:
        if user.registration_confirmation_code != data.verification_code:
            crud.delete_user(user) 
            return {"exception": "Too many atempts. Account deleted"}
    if user.registration_confirmation_code != data.verification_code:
        crud.add_verification_code_attempt(user) 
        return {"exception": "Invalid verification code"}
    crud.activate_user(user)
    crud.delete_user_tokens(user)

    return {"message": "User activated"}

@transactional
def refresh_token(data):
    db_user = crud.get_user_by_email(email=data.email)
    if db_user is None:
        raise HTTPException(status_code=403, detail="User does not exist!")
    if db_user.is_active is False:
        raise HTTPException(status_code=403, detail="User is not active!")
    db_user_tokens = crud.get_user_tokens(db_user)
    found_token = None

    found = False
    expired = True

    for db_token in db_user_tokens:
        if db_token.refresh_token is None:
            continue
        try:
            payload = jwt.decode(
                data.refresh_token, db_token.refresh_token, algorithms=[ALGORITHM]
            )
            if payload["sub"] == data.email:
                found = True
                utc=pytz.UTC
                datetime_now = datetime.now(UTC)
                token_expiration_time = utc.localize(db_token.refresh_token_expiration_time)
                if datetime_now <= token_expiration_time:
                    expired = False       
                    found_token = db_token         
    
        except(jwt.JWTError, ValidationError):
            raise HTTPException(status_code=500, detail="Error occured")
        
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
    if found_token.logged is False:
        raise HTTPException(status_code=403, detail="User not logged!")

    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    refresh_token_key = jwt_token_generator.generate_jwt_secret_key()
    access_token = create_access_token(data.email, access_token_key)
    refresh_token = create_refresh_token(data.email, refresh_token_key)
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    refresh_token_expiration_time = datetime.now(UTC) + timedelta(minutes=60*24)

    new_token = TokenSchema(access_token=access_token_key,
            access_token_expiration_time= access_token_expiration_time,
            refresh_token=refresh_token_key,
            refresh_token_expiration_time=refresh_token_expiration_time)
    crud.update_token(found_token, new_token)

    return {"message": "Token updated",
            "access_token": access_token,
            "refresh_token": refresh_token}

@transactional
def login(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username    
    db_user = crud.get_user_by_email(email=email)
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    if db_user.is_active is False:
        raise HTTPException(status_code=403, detail="User is not active!")
    hashed_password = main.objects[1].hash_password(data.password)
    if hashed_password != db_user.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    verification_code = verification_code_generator.generate_verification_code()
    verification_code_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    print(verification_code) 
    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    access_token = create_access_token(email, access_token_key)

    crud.create_user_tokens2(db_user=db_user.id, access_token=access_token_key, refresh_token=None, 
                            access_token_expiration_time=access_token_expiration_time,
                            refresh_token_expiration_time=None,verification_code=verification_code,
                            verification_code_expiration_time=verification_code_expiration_time,
                            verification_code_type="login")

    mail_sender.send_email_with_verification_code_for_login(main.objects[0], email, verification_code) 
    return {"message": "Confirm login",
            "access_token": access_token}

def confirm_login1(data: BasicConfirmationWithVerificationCode):
    result = confirm_login(data)
    if "exception" in result.keys():
        raise HTTPException(status_code=403, detail=result["exception"])
    else:
        return result

@transactional
def confirm_login(data: BasicConfirmationWithVerificationCode):
    user = crud.get_user_by_email(email=data.email)
    if user is None:
        raise HTTPException(status_code=403, detail="User does not exist!")
    if user.is_active is False:
        raise HTTPException(status_code=403, detail="User is not active!")

    db_user_tokens = crud.get_user_tokens(user)
    found_token = None

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
                    found_token = db_token         
    
        except(jwt.JWTError, ValidationError):
            raise HTTPException(status_code=500, detail="Error occured")
        
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
    if found_token.logged is True:
        raise HTTPException(status_code=403, detail="You are currently logged!")
    if found_token.verification_code_type is not None and found_token.verification_code_type != "login":
        raise HTTPException(status_code=403, detail="Operation not permitted!")
    utc=pytz.UTC
    token_timeout = utc.localize(found_token.verification_code_expiration_time)
    datetime_now = datetime.now(UTC)
    if datetime_now > token_timeout:
        crud.delete_token(found_token) 
        return {"exception": "Verification code expired. Log in again"}
    if found_token.verification_code_enter_attempts >= 2:
        if found_token.verification_code != data.verification_code:
            crud.delete_token(found_token) 
            return {"exception": "Too many atempts. Log in again"}
    if found_token.verification_code != None and found_token.verification_code != data.verification_code:
        crud.add_verification_code_attempt2(found_token) 
        return {"exception": "Invalid verification code"}
    
    access_token_key = jwt_token_generator.generate_jwt_secret_key()
    refresh_token_key = jwt_token_generator.generate_jwt_secret_key()
    access_token = create_access_token(data.email, access_token_key)
    refresh_token = create_refresh_token(data.email, refresh_token_key)
    access_token_expiration_time = datetime.now(UTC) + timedelta(minutes=15)
    refresh_token_expiration_time = datetime.now(UTC) + timedelta(minutes=60*24)
    
    crud.update_token_after_login(found_token=found_token, access_token=access_token_key, 
                                access_token_expiration_time=access_token_expiration_time,
                                refresh_token=refresh_token_key, refresh_token_expiration_time= refresh_token_expiration_time)

    return {"message": "User logged",
            "access_token": access_token,
            "refresh_token": refresh_token}

@transactional
def reset_password():




    verification_code = verification_code_generator.generate_verification_code()
    print(verification_code) 
    # mail_sender.send_email_with_verification_code_for_password_reset(main.objects[0], '252808@student.pwr.edu.pl', verification_code) 
    return {}

@transactional
def confirm_reset_password(data: BasicConfirmationWithVerificationCode):
    
    print("reset confirmed")
    return {}

@transactional
def logout(data: BasicConfirmation):
    print("logout")
    return {}

@transactional
def validate_user_token(data):

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

@transactional
def send_message(data: BasicConfirmationForMessageSend):
    print("message sent")
    return {}

@transactional
def get_messages(data: BasicConfirmationForMessageFetch):
    print("message got")
    return {}


