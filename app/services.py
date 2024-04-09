from database import collection_name
from models import Conversation
# from schemas import list_serial
from bson import ObjectId

def get_messages(data):
    conversations = collection_name.find()
    for doc in conversations:
        print(doc)
        print(type(doc))
    return str(conversations)

    # return {"haha2"}

def send_message(data):
    # conversation = {"first_user": "252808@student.pwr.edu.pl",
    #     "second_user": "mateusz.urbanczyk11@gmail.com",
    #     "messages_list": [["osfmdomo", "left"]]
    #     }
    # # c = Conversation(first_user= "252808@student.pwr.edu.pl",
    # #     second_user= "mateusz.urbanczyk11@gmail.com",
    # #     messages_list= [["osfmdomo", "left"]]
    # #     )

    collection_name.insert_one(data)
    return {"haha"}


