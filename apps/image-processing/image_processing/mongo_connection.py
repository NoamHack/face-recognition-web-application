import uuid
from pymongo import MongoClient
import os
import base64


def strip_data_url_prefix(base64_str):
  if base64_str and isinstance(base64_str, str):
    if 'data:image/jpeg;base64,' in base64_str:
      return base64_str.replace('data:image/jpeg;base64,', '')
  return base64_str


def add_positives_from_mongo():
  try:
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    print("Connected to MongoDB")

    # Set up paths
    current_dir = os.getcwd()

    POS_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'positive')
    os.makedirs(POS_PATH, exist_ok=True)
    print(f"Saving images in: {POS_PATH}")

    # Connect to database and collection
    db = client["test"]
    collection = db["soliderpics"]

    # Get results from MongoDB
    results = collection.find()

    # Counter for saved images
    saved_count = 0

    # Save each soldier picture
    for doc in results:
      # Save soliderFrontPic1
      if 'soliderFrontPic1' in doc and doc['soliderFrontPic1']:
        base64_str = strip_data_url_prefix(doc['soliderFrontPic1'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderFrontPic2
      if 'soliderFrontPic2' in doc and doc['soliderFrontPic2']:
        base64_str = strip_data_url_prefix(doc['soliderFrontPic2'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderFrontPic3
      if 'soliderFrontPic3' in doc and doc['soliderFrontPic3']:
        base64_str = strip_data_url_prefix(doc['soliderFrontPic3'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderFrontPic4
      if 'soliderFrontPic4' in doc and doc['soliderFrontPic4']:
        base64_str = strip_data_url_prefix(doc['soliderFrontPic4'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

    print(f"Successfully saved {saved_count} soldier pictures")

  except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()  # This will print the full error trace
  finally:
    if client:
      client.close()

