from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from cryptography.fernet import Fernet

key = b'wLVkugNZXHJESDEarg_xUnc7JHaUck1lkGECooRD2OA='
f = Fernet(key)

with open("./app/keys/db_key.env", "rb") as encrypted_file:
    encrypted = encrypted_file.read()

SQLALCHEMY_DATABASE_URL = f.decrypt(encrypted).decode("utf-8")

# TO DO Connecting with database using SSL/TLS


engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionMaker = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()