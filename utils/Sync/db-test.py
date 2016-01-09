from pymongo import MongoClient
import settings

__author__ = 'Roman Timashev'


client = MongoClient(settings.database_uri)
p = client.hudozka.posts

print(list(p.find()))

# print(dir(p))
# print(p.insert({'a': 1}))