import hashlib
import base64
from cryptography.fernet import Fernet


class PasswordHasher():
    def __init__(self):

        key = b'A2rx2R6MqhD3rfkMXO1suUb3sCc5IX6KS7TeUz55pxc='
        f = Fernet(key)

        with open("./app/keys/salt_key.env", "rb") as encrypted_file:
            encrypted = encrypted_file.read()

        self.salt = f.decrypt(encrypted)    

    def hash_password(self, password: str):
        hash = hashlib.sha512()
        hash.update(self.salt)
        hash.update(password.encode("utf-8"))
        return base64.urlsafe_b64encode(hash.digest()).decode("utf-8")