import secrets

def get_random_key():
    return secrets.token_hex(16) 

def get_random_initialization_vector():
    return secrets.token_hex(8) 