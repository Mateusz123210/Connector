import secrets

def generate_verification_code():
    return secrets.randbelow(100000000)