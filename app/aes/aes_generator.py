import secrets

def get_random_key():
    return secrets.token_hex(32) 