from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def check_user_password(db: Session, email: str, password: str):
    return db.query(models.User).filter(models.User.email == email, models.User.password == password).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, hashed_password=user.password, is_active= False,
                        confirmation_code = user.confirmation_code, 
                        confirmation_code_expiration_time= user.confirmation_code_expiration_time)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def register_user(db: Session, email: str, password: str):
    pass