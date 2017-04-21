from pymongo import MongoClient
from settings import db_uri, db_name, db_user, db_password

db = MongoClient(db_uri)[db_name]
if db_user and db_password:
    auth_status = db.authenticate(db_user, db_password)
    if not auth_status:
        print('Failed to authenticate user')
        exit(1)


def collection(name):
    return db[name]
