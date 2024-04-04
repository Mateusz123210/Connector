from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    confirmation_code = Column(String)
    confirmation_code_expiration_time = Column(DateTime)

    user_tokens = relationship("Token", back_populates="users")


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True)
    bearer_token = Column(String)
    bearer_token_expiration_time = Column(DateTime)
    refresh_token = Column(String)
    refresh_token_expiration_time = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"))

    users = relationship("User", back_populates="user_tokens")

