import re

class Validator():
    def __init__(self):
        self.email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        self.special_sym =['$', '@', '#', '%']

    def validate_email(self, email: str):
        if(re.fullmatch(self.email_regex, email)):
            return True
        else:
            return False

    def validate_password(self, password: str):
        
        if len(password) < 8:
            return False
            
        if not any(char.isdigit() for char in password):
            return False
            
        if not any(char.isupper() for char in password):
            return False
            
        if not any(char.islower() for char in password):
            return False
            
        if not any(char in self.special_sym for char in password):
            return False
        
        return True