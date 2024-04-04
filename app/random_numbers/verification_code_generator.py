import secrets

def generate_verification_code():
    verification_code = ""
    for i in range(8):
        verification_code += str(secrets.randbelow(10))
    
    return verification_code