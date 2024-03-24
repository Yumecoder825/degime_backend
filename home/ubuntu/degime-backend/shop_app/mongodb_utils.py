# mongodb_utils.py
import pymongo

def connect_to_mongodb():
    url = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(url)
    db = client['test_mongo']
    return db

def close_mongodb_connection(db):
    db.client.close()
    

