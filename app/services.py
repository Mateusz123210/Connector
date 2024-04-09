from database import collection_name
from fastapi import HTTPException

def get_messages(data):
    found_conversation = collection_name.find_one({"first_user": data["first_user"], "second_user": data["second_user"]})
    if found_conversation:
        list1 = found_conversation["message"]
        return {"messages": list1}
    else:
        found_conversation = collection_name.find_one({"first_user": data["second_user"], "second_user": data["first_user"]})
        if found_conversation:
            list1 = found_conversation["message"]
            return {"messages": list1}
        else:
            return {"message": "No messages sent to this receiver yet!"}

def send_message(data):
    if len(data["message"]) == 0:
        raise HTTPException(status_code=400, detail="You cannot send empty message!")
    found_conversation = collection_name.find_one({"first_user": data["first_user"], "second_user": data["second_user"]})
    if found_conversation:
        list1 = found_conversation["message"]
        list1.append({data["message"]: "from_first"})
        filter = { '_id': found_conversation["_id"] }
        new_values = { "$set": { 'message': list1 } }
        collection_name.update_one(filter, new_values)
    else:
        found_conversation = collection_name.find_one({"first_user": data["second_user"], "second_user": data["first_user"]})
        if found_conversation:
            list1 = found_conversation["message"]
            list1.append({data["message"]: "from_second"})
            filter = { '_id': found_conversation["_id"] }
            new_values = { "$set": { 'message': list1 } }
            collection_name.update_one(filter, new_values)
        else:
            insert_data = {"first_user": data["first_user"], "second_user": data["second_user"]}
            insert_data["message"] = [{data["message"]: "from_first"}]
            collection_name.insert_one(insert_data)

    return {"message": "Message sent!"}

def delete_messages(data):
    found_conversation = collection_name.find_one_and_delete({"first_user": data["user"]})
    if found_conversation:
        return {"message": "User messages has been deleted!"}
    else:
        found_conversation = collection_name.find_one_and_delete({"second_user": data["user"]})
        if found_conversation:
            return {"message": "User messages has been deleted!"}
        else:
            return {"message": "User had no sended messages!"}