from pymongo import MongoClient

def add_anchors_from_mongo():
  try:
    client = MongoClient('mongodb://localhost:27017/')
    print("Connected to MongoDB")
  except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    client = None

  if client:
    db = client["test"]
    collection = db["soliderpics"]

  results = collection.find()

  for f in results:
    print(f)
