from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    confirmation_code = Column(String, nullable=True)
    confirmation_code_expiration_time = Column(DateTime, nullable=True)

    user_tokens = relationship("Token", back_populates="users")


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True)
    access_token = Column(String, nullable=False)
    access_token_expiration_time = Column(DateTime, nullable=False)
    refresh_token = Column(String, nullable=True)
    refresh_token_expiration_time = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    users = relationship("User", back_populates="user_tokens")

