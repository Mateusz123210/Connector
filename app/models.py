from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    registration_confirmation_code = Column(String, nullable=True)
    registration_confirmation_code_expiration_time = Column(DateTime, nullable=True)
    registration_confirmation_code_enter_attempts = Column(Integer, nullable=False, default=0)

    user_tokens = relationship("Token", back_populates="users")
    first_user_key = relationship("Key", backref = 'first_user_key', lazy = 'dynamic', foreign_keys = 'Key.first_user_id')
    second_user_key = relationship("Key", backref = 'second_user_key', lazy = 'dynamic', foreign_keys = 'Key.second_user_id')


class Key(Base):
    __tablename__ = "keys"

    id = Column(Integer, primary_key=True)
    first_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    second_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    aes_key = Column(String, nullable=False)


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True)
    access_token = Column(String, nullable=False)
    access_token_expiration_time = Column(DateTime, nullable=False)
    refresh_token = Column(String, nullable=True)
    refresh_token_expiration_time = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    verification_code = Column(String, nullable=True)
    verification_code_expiration_time = Column(DateTime, nullable=True)
    verification_code_enter_attempts = Column(Integer, nullable=False, default=0)
    verification_code_type = Column(String, nullable=True)
    logged = Column(Boolean, nullable=False, default=False)
    new_password = Column(String, nullable=True)

    users = relationship("User", back_populates="user_tokens")
