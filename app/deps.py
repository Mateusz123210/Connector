from app import services
from app.schemas import *

async def validate_user_token_for_confirmation(data: BasicConfirmationWithVerificationCode) :
    return services.validate_user_token(data)

async def validate_user_token(data: BasicConfirmation) :
    return services.validate_user_token(data)

async def validate_user_token_for_message_send(data: BasicConfirmationForMessageSend) :
    return services.validate_user_token_with_verification_if_user_logged(data)

async def validate_user_token_for_message_fetch(data: BasicConfirmationForMessageFetch) :
    return services.validate_user_token_with_verification_if_user_logged(data)

async def validate_user_token_for_delete_account(data: BasicConfirmationForDeleteAccount) :
    return services.validate_user_token(data)

async def validate_user_token_for_aes_fetch(data: BasicConfirmationForFetchingAES) :
    return services.validate_user_token_with_verification_if_user_logged(data)

async def validate_user_token_for_available_callers_fetch(data: BasicConfirmation) :
    return services.validate_user_token_with_verification_if_user_logged(data)
