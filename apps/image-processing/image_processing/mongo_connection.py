import uuid
from pymongo import MongoClient
import os
import base64


def strip_data_url_prefix(base64_str):
  if base64_str and isinstance(base64_str, str):
    if 'data:image/jpeg;base64,' in base64_str:
      return base64_str.replace('data:image/jpeg;base64,', '')
  return base64_str


def add_positives_and_anchors_from_mongo():
  try:
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    print("Connected to MongoDB")

    # Set up paths
    current_dir = os.getcwd()

    POS_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'positive')
    ANC_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'anchor')
    os.makedirs(POS_PATH, exist_ok=True)
    os.makedirs(ANC_PATH, exist_ok=True)
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
      # Save soliderPositivePic1
      if 'soliderPositivePic1' in doc and doc['soliderPositivePic1']:
        base64_str = strip_data_url_prefix(doc['soliderPositivePic1'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderPositivePic2
      if 'soliderPositivePic2' in doc and doc['soliderPositivePic2']:
        base64_str = strip_data_url_prefix(doc['soliderPositivePic2'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderPositivePic3
      if 'soliderPositivePic3' in doc and doc['soliderPositivePic3']:
        base64_str = strip_data_url_prefix(doc['soliderPositivePic3'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

      # Save soliderPositivePic4
      if 'soliderPositivePic4' in doc and doc['soliderPositivePic4']:
        base64_str = strip_data_url_prefix(doc['soliderPositivePic4'])
        img_data = base64.b64decode(base64_str)
        file_path = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        with open(file_path, 'wb') as f:
          f.write(img_data)
        saved_count += 1

        # Save soliderAnchorPic1
        if 'soliderAnchorPic1' in doc and doc['soliderAnchorPic1']:
          base64_str = strip_data_url_prefix(doc['soliderAnchorPic1'])
          img_data = base64.b64decode(base64_str)
          file_path = os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1()))
          with open(file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

        # Save soliderAnchorPic2
        if 'soliderAnchorPic2' in doc and doc['soliderAnchorPic2']:
          base64_str = strip_data_url_prefix(doc['soliderAnchorPic2'])
          img_data = base64.b64decode(base64_str)
          file_path = os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1()))
          with open(file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

        # Save soliderAnchorPic3
        if 'soliderAnchorPic3' in doc and doc['soliderAnchorPic3']:
          base64_str = strip_data_url_prefix(doc['soliderAnchorPic3'])
          img_data = base64.b64decode(base64_str)
          file_path = os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1()))
          with open(file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

        # Save soliderAnchorPic4
        if 'soliderAnchorPic4' in doc and doc['soliderAnchorPic4']:
          base64_str = strip_data_url_prefix(doc['soliderAnchorPic4'])
          img_data = base64.b64decode(base64_str)
          file_path = os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1()))
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

