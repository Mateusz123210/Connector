
from . import models, schemas
from datetime import datetime
from app.decorators.database import db


@db
def get_user(user_id: int, db):
    return db.query(models.User).filter(models.User.id == user_id).first()

@db
def get_user_by_email(email: str, db):
    return db.query(models.User).filter(models.User.email == email).first()

@db
def check_user_password(email: str, password: str, db):
    return db.query(models.User).filter(models.User.email == email, models.User.password == password).first()

@db
def create_user(user: schemas.UserCreate, db):
    db_user = models.User(email=user.email, password=user.password, is_active= False,
                        confirmation_code = user.confirmation_code, 
                        confirmation_code_expiration_time= user.confirmation_code_expiration_time)
    db.add(db_user)
    db.flush()
    return db_user

@db
def create_user_tokens(db_user: models.User, access_token: str, refresh_token: str,
                       access_token_expiration_time: datetime, refresh_token_expiration_time: datetime, db):
    db_token = models.Token(access_token=access_token, refresh_token=refresh_token, 
                            access_token_expiration_time=access_token_expiration_time,
                            refresh_token_expiration_time=refresh_token_expiration_time, user_id=db_user)
    db.add(db_token)
    db.flush()
    return db_token

@db
def delete_user(user, db):
    print(user.id)
    user_tokens = db.query(models.Token).filter(models.Token.user_id==user.id)
    for token in user_tokens:
        db.delete(token)
    db.delete(user)
    db.flush()

@db
def delete_user_tokens(user, db):
    print(user.id)
    user_tokens = db.query(models.Token).filter(models.Token.user_id==user.id)
    for token in user_tokens:
        db.delete(token)
    db.delete(user)
    db.flush()

@db
def get_user_tokens(user, db):
    return db.query(models.Token).filter(models.Token.user_id == user.id).all()