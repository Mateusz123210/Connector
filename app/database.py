from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from cryptography.fernet import Fernet

key = b'R_rw02I6agqWA-NqsQdqTgKy6GL_5vA8YMqIhLV23PU='
f = Fernet(key)

with open("keys/db_key.env", "rb") as encrypted_file:
    encrypted = encrypted_file.read()

SQLALCHEMY_DATABASE_URL = f.decrypt(encrypted).decode("utf-8")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={'sslmode':'require'}
)
SessionMaker = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()