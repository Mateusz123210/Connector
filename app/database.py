
# from fastapi import FastAPI, HTTPException
# from motor.motor_asyncio import AsyncIOMotorClient
# from pydantic import BaseModel

# app = FastAPI()

# # MongoDB connection URL
# MONGO_URL = "'mongodb+srv://ConDB2Adm:%G0DBC\\);RN<f7P;@127.0.0.1'"
# client = AsyncIOMotorClient(MONGO_URL)
# database = client["mydatabase"]
# collection = database["items"]





from pymongo import MongoClient
import urllib.parse
username = urllib.parse.quote_plus('ConDB2Adm')
password = urllib.parse.quote_plus('G0DBC\\);RN<f7P;')
uri = "mongodb+srv://ConDB2Adm:OL1Vsd0DR9AT@connectorcluster.u9oh4pa.mongodb.net/"
MongoClient(uri)

client = MongoClient(uri)

try:
    client.ConDB2Adm.command("ping")
    print("Connected")
except Exception as e:
    print(e)

db = client.conversations
collection_name = db["conversations"]






# import motor.motor_asyncio
# from bson.objectid import ObjectId
# from decouple import config

# # MONGO_DETAILS = config("MONGO_DETAILS")  # read environment variable
# MONGO_DETAILS = "mongodb+srv://ConDB2Adm:OL1Vsd0DR9AT@connectorcluster.u9oh4pa.mongodb.net/"
# # MONGO_DETAILS = "mongodb+srv://ConDB2Adm:G0DBC\);RN<f7P;@mongodb://localhost?retryWrites=true&w=majority"

# client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

# database = client.students

# student_collection = database.get_collection("students_collection")


# # helpers


# def student_helper(student) -> dict:
#     return {
#         "id": str(student["_id"]),
#         "fullname": student["fullname"],
#         "email": student["email"],
#         "course_of_study": student["course_of_study"],
#         "year": student["year"],
#         "GPA": student["gpa"],
#     }


# # crud operations


# # Retrieve all students present in the database
# async def retrieve_students():
#     students = []
#     async for student in student_collection.find():
#         students.append(student_helper(student))
#     return students


# # Add a new student into to the database
# async def add_student(student_data: dict) -> dict:
#     student = await student_collection.insert_one(student_data)
#     new_student = await student_collection.find_one({"_id": student.inserted_id})
#     return student_helper(new_student)


# # Retrieve a student with a matching ID
# async def retrieve_student(id: str) -> dict:
#     student = await student_collection.find_one({"_id": ObjectId(id)})
#     if student:
#         return student_helper(student)


# # Update a student with a matching ID
# async def update_student(id: str, data: dict):
#     # Return false if an empty request body is sent.
#     if len(data) < 1:
#         return False
#     student = await student_collection.find_one({"_id": ObjectId(id)})
#     if student:
#         updated_student = await student_collection.update_one(
#             {"_id": ObjectId(id)}, {"$set": data}
#         )
#         if updated_student:
#             return True
#         return False


# # Delete a student from the database
# async def delete_student(id: str):
#     student = await student_collection.find_one({"_id": ObjectId(id)})
#     if student:
#         await student_collection.delete_one({"_id": ObjectId(id)})
#         return True