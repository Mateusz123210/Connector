from database import collection_name
from fastapi import HTTPException
from decorators import transactional

@transactional
def get_messages(data, session):
    found_conversation = collection_name.find_one({"first_user": data["first_user"], "second_user": data["second_user"]},
                                                  session=session)
    if found_conversation:
        list1 = found_conversation["message"]
        return {"messages": list1}
    else:
        found_conversation = collection_name.find_one({"first_user": data["second_user"], "second_user": data["first_user"]},
                                                      session=session)
        if found_conversation:
            list1 = found_conversation["message"]
            reversed_list_for_second_caller = []
            for i in list1:
                dictionary = i
                for j in dictionary:
                    if dictionary[j] == "from_first":
                        dictionary[j] = "from_second"
                    else:
                        dictionary[j] = "from_first"
                reversed_list_for_second_caller.append(dictionary)
            return {"messages": reversed_list_for_second_caller}
        else:
            raise HTTPException(status_code=204)

@transactional
def send_message(data, session):
    if len(data["message"]) == 0:
        raise HTTPException(status_code=400, detail="You cannot send empty message!")
    found_conversation = collection_name.find_one({"first_user": data["first_user"], "second_user": data["second_user"]}, 
                                                  session=session)
    if found_conversation:
        list1 = found_conversation["message"]
        list1.append({data["message"]: "from_first"})
        filter = { '_id': found_conversation["_id"] }
        new_values = { "$set": { 'message': list1 } }
        collection_name.update_one(filter, new_values, session=session)
    else:
        found_conversation = collection_name.find_one({"first_user": data["second_user"], "second_user": data["first_user"]},
                                                      session=session)
        if found_conversation:
            list1 = found_conversation["message"]
            list1.append({data["message"]: "from_second"})
            filter = { '_id': found_conversation["_id"] }
            new_values = { "$set": { 'message': list1 } }
            collection_name.update_one(filter, new_values, session=session)
        else:
            insert_data = {"first_user": data["first_user"], "second_user": data["second_user"]}
            insert_data["message"] = [{data["message"]: "from_first"}]
            collection_name.insert_one(insert_data, session=session)

    return {"message": "Message sent!"}

@transactional
def delete_messages(data, session):
    found_conversation = collection_name.find_one_and_delete({"first_user": data["user"]}, session=session)
    if found_conversation:
        return {"message": "User messages has been deleted!"}
    else:
        found_conversation = collection_name.find_one_and_delete({"second_user": data["user"]}, session=session)
        if found_conversation:
            return {"message": "User messages has been deleted!"}
        else:
            return {"message": "User had no sended messages!"}
        