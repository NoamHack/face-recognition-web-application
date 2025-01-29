import uuid
from pymongo import MongoClient
import os
import base64
import config

def strip_data_url_prefix(base64_str):
  if base64_str and isinstance(base64_str, str):
    if 'data:image/jpeg;base64,' in base64_str:
      return base64_str.replace('data:image/jpeg;base64,', '')
  return base64_str

def ensure_directories_with_permissions(directories):
  for directory in directories:
    if not os.path.exists(directory):
      os.makedirs(directory, exist_ok=True)
    os.chmod(directory, 0o777)  # Give full permissions

def add_positives_anchors_and_verification_from_mongo():
  client = None
  try:
    # Connect to MongoDB
    client = MongoClient(config.variables.mongo_url)
    print("Connected to MongoDB")

    # Set up paths
    current_dir = os.getcwd()
    POS_PATH = config.variables.POS_PATH
    ANC_PATH = config.variables.ANC_PATH
    VER_PATH = config.variables.VERIFICATION_IMAGES_PATH

    # Ensure directories exist with proper permissions
    ensure_directories_with_permissions([POS_PATH, ANC_PATH, VER_PATH])
    print(f"Saving images in: {POS_PATH} {ANC_PATH}")

    # Connect to database and collection
    db = client[config.variables.mongo_client]
    collection = db[config.variables.mongo_collection]

    # Get results from MongoDB
    results = collection.find()

    # Counter for saved images
    saved_count = 0

    # Save each soldier picture
    for doc in results:
      if 'soliderPersonalNumber' in doc and doc['soliderPersonalNumber']:
        solider_verification_dir = os.path.join(VER_PATH, str(doc['soliderPersonalNumber']))
        os.makedirs(solider_verification_dir, exist_ok=True)
        os.chmod(solider_verification_dir, 0o777)

      # Process positive pictures
      for i in range(1, 5):
        pic_key = f'soliderPositivePic{i}'
        if pic_key in doc and doc[pic_key]:
          base64_str = strip_data_url_prefix(doc[pic_key])
          img_data = base64.b64decode(base64_str)

          # Save to positive path
          pos_file_path = os.path.join(POS_PATH, f'{uuid.uuid1()}.jpg')
          with open(pos_file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

          # Save to verification path
          ver_file_path = os.path.join(solider_verification_dir, f'{uuid.uuid1()}.jpg')
          with open(ver_file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

      # Process anchor pictures
      for i in range(1, 5):
        pic_key = f'soliderAnchorPic{i}'
        if pic_key in doc and doc[pic_key]:
          base64_str = strip_data_url_prefix(doc[pic_key])
          img_data = base64.b64decode(base64_str)

          # Save to anchor path
          anc_file_path = os.path.join(ANC_PATH, f'{uuid.uuid1()}.jpg')
          with open(anc_file_path, 'wb') as f:
            f.write(img_data)
          saved_count += 1

    print(f"Successfully saved {saved_count} soldier pictures")

  except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
  finally:
    if client:
      client.close()
