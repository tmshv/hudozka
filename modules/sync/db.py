from pymongo import MongoClient

import settings


def db():
    client = MongoClient(settings.database_uri)
    return client.hudozka


def collection(name):
    return db()[name]
