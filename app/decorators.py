# from database import client
# from fastapi import HTTPException

# def transactional(func):
#     async def wrapper(*args, **kwargs):
#         try:
#             async with await client.start_session() as session:
#                 async with session.start_transaction():
#                     result = await func(*args, **kwargs, session=session)
#                     return result
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")
#     return wrapper

from database import client

def transactional(origin_func):
    def wrapper_func(*args, **kwargs):
        with client.start_session() as session:
            with session.start_transaction():
                return origin_func(*args, session=session, **kwargs)

    return wrapper_func