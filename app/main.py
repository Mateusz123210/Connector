import uvicorn
from fastapi import FastAPI
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from database import engine
from database import Base
from mail.mail_sender_executor import MailSenderExecutor
from hashing.password_hasher import PasswordHasher
from validating import Validator
from schemas import *
import services
from deps import *
from fastapi.middleware.cors import CORSMiddleware
import ssl
from threading import Thread
import time


class SecondThread:

    def __init__(self):
        self.working = True

    def stop_work(self):
        self.working = False

    def delete_unnecessary_data_from_database(self):
        time_counter = 0
        while self.working is True:

            if time_counter >= 3000000:
                time_counter = 0
                services.delete_not_activated_users_and_all_tokens()
            time_counter += 1

            time.sleep(0.01)

second_thread = SecondThread()
objects = []
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    objects.append(MailSenderExecutor())
    objects.append(PasswordHasher())
    objects.append(Validator())
    thread = Thread(name='daemon', target=second_thread.delete_unnecessary_data_from_database)
    thread.start()
    yield
    second_thread.stop_work()
    thread.join()
    objects[0].quit_connection_with_email_server()
    objects.clear()
    services.queue_sender.close_connection()

app = FastAPI(lifespan = lifespan)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

ssl_certfile = './ssl_certificate/cert.cer'
ssl_keyfile = './ssl_certificate/key.pem'

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(certfile=ssl_certfile, keyfile=ssl_keyfile)

@app.post("/register")
async def register(data: BasicAuthentication):
    return services.register(data)

@app.post("/confirm-registration")
async def confirm_registration(data: BasicConfirmationWithVerificationCode = Depends(validate_user_token_for_confirmation)):
    return services.confirm_registration1(data)

@app.post("/refresh-token")
async def refresh_token(data: RefreshToken):
    return services.refresh_token(data)

@app.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    return services.login(data)

@app.post("/confirm-login")
async def confirm_login(data: BasicConfirmationWithVerificationCode = Depends(validate_user_token_for_confirmation)):
    return services.confirm_login1(data)

@app.post("/get-key")
async def get_key(data: BasicConfirmationForFetchingAES = Depends(validate_user_token_for_aes_fetch)):
    return services.get_aes_key(data)

@app.post("/delete-account")
async def delete_account(data: BasicConfirmationForDeleteAccount = Depends(validate_user_token_for_delete_account)):
    return services.delete_account(data)

@app.post("/logout")
async def logout(data: BasicConfirmation = Depends(validate_user_token)):
    return services.logout(data)

@app.post("/send-message")
async def send_message(data: BasicConfirmationForMessageSend = Depends(validate_user_token_for_message_send)):
    return services.send_message(data)

@app.post("/get-messages")
async def get_messages(data: BasicConfirmationForMessageFetch = Depends(validate_user_token_for_message_fetch)):
    return services.get_messages(data)

@app.post("/get-available-callers")
async def get_available_callers(data: BasicConfirmation = Depends(validate_user_token_for_available_callers_fetch)):
    return services.get_available_callers(data)

# @app.post("/reset-password")
# async def reset_password(data: OAuth2PasswordRequestForm = Depends()):
#     return services.reset_password(data)

# @app.post("/confirm-reset-password")
# async def confirm_reset_password(data: BasicConfirmationWithVerificationCode = Depends(validate_user_token_for_confirmation)):
#     return services.confirm_reset_password(data)

# @app.post("/change-password")
# async def change_password():
#     return services.change_password()

# @app.post("/confirm-change-password")
# async def confirm_change_password(data: BasicConfirmationWithVerificationCode = Depends(validate_user_token_for_confirmation)):
#     return services.confirm_change_password(data)


# if __name__ == '__main__':
#     uvicorn.run(app, port=8000, host='0.0.0.0', ssl_certfile=ssl_certfile, ssl_keyfile=ssl_keyfile)






